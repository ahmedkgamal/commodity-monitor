#!/usr/bin/env python3
"""
Commodity Price Auto-Updater
Fetches latest prices from the original data sources and updates
the JS config files directly (config.js, config-oilgas.js, config-poultry.js).

Sources used:
  - Yahoo Finance (yfinance): Daily settlement prices from CME, ICE, CBOT
  - FRED API: Monthly commodity averages (IMF Primary Commodity Prices)

Environment Variables:
  FRED_API_KEY  (optional) — free key from https://fred.stlouisfed.org/docs/api/api_key.html
"""

import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TODAY = datetime.utcnow().strftime("%Y-%m-%d")


# ── Yahoo Finance ticker → config mapping ────────────────────────────
# Each entry maps a Yahoo ticker to targets in the config files.
# "convert" transforms the raw Yahoo price to the unit used in the config.
YAHOO_MAP = {
    # ── config.js  compactCommodities + sampleData ──
    "ZL=F": {
        "file": "config.js",
        "targets": [
            {"section": "compactCommodities", "name": "Soybean Oil"},
            {"section": "sampleData",         "key":  "soybean_oil"},
        ],
        "convert_compact": lambda p: round(p * 22.0462, 2),   # cents/lb → USD/MT
        "convert_sample":  lambda p: round(p * 22.0462, 2),
    },
    "ZS=F": {
        "file": "config.js",
        "targets": [
            {"section": "compactCommodities", "name": "Soybeans"},
            {"section": "sampleData",         "key":  "soybeans"},
        ],
        "convert_compact": lambda p: round(p * 0.3674, 2),    # cents/bu → USD/MT
        "convert_sample":  lambda p: round(p * 0.3674, 2),
    },
    "ZM=F": {
        "file": "config.js",
        "targets": [
            {"section": "compactCommodities", "name": "Soybean Meal"},
            {"section": "sampleData",         "key":  "soybean_meal"},
        ],
        "convert_compact": lambda p: round(p * 1.10231, 2),   # USD/short ton → USD/MT
        "convert_sample":  lambda p: round(p * 1.10231, 2),
    },
    "SB=F": {
        "file": "config.js",
        "targets": [
            {"section": "compactCommodities", "name": "Raw Sugar (No. 11)"},
            {"section": "sampleData",         "key":  "raw_sugar"},
        ],
        "convert_compact": lambda p: round(p * 22.0462, 2),   # cents/lb → USD/MT
        "convert_sample":  lambda p: round(p * 22.0462, 2),
    },
    # ── config-oilgas.js ──
    "BZ=F": {
        "file": "config-oilgas.js",
        "targets": [{"section": "commodities", "name": "Brent Crude"}],
        "convert_compact": lambda p: round(p, 2),
    },
    "CL=F": {
        "file": "config-oilgas.js",
        "targets": [{"section": "commodities", "name": "WTI Crude"}],
        "convert_compact": lambda p: round(p, 2),
    },
    "NG=F": {
        "file": "config-oilgas.js",
        "targets": [{"section": "commodities", "name": "Henry Hub Nat Gas"}],
        "convert_compact": lambda p: round(p, 2),
    },
    "RB=F": {
        "file": "config-oilgas.js",
        "targets": [{"section": "commodities", "name": "RBOB Gasoline"}],
        "convert_compact": lambda p: round(p, 4),
    },
    # ── config-poultry.js  global benchmarks ──
    "ZC=F": {
        "file": "config-poultry.js",
        "targets": [{"section": "commodities", "name": "Corn (CBOT Front-Month)"}],
        "convert_compact": lambda p: round(p, 2),   # already ¢/bu
    },
}

# FRED series for monthly averages (updates sampleData in config.js)
FRED_SERIES = {
    "PPOILUSDM":    {"key": "cpo",           "convert": lambda v: round(v, 2)},
    "PSOILUSDM":    {"key": "soybean_oil",   "convert": lambda v: round(v, 2)},
    "PSUNOUSDM":    {"key": "sunflower_oil", "convert": lambda v: round(v, 2)},
    "PSUGAISAUSDM": {"key": "raw_sugar",     "convert": lambda v: round(v * 22.0462)},
    "PSOYBUSDM":    {"key": "soybeans",      "convert": lambda v: round(v, 2)},
    "PSMEAUSDM":    {"key": "soybean_meal",  "convert": lambda v: round(v, 2)},
}


# ── Helpers ───────────────────────────────────────────────────────────

def fmt(val):
    """Format a number for JS: no trailing zeros for ints, else 2-4 decimals."""
    if val == int(val):
        return str(int(val))
    s = f"{val:.4f}".rstrip("0")
    if s.endswith("."):
        s += "0"
    return s


def update_compact_price(content, commodity_name, price, prev_price, date_str):
    """Update price, prevPrice, dataDate for a commodity in a compactCommodities or commodities array."""
    # Find the block for this commodity by name
    pattern = re.compile(
        r"(name:\s*'" + re.escape(commodity_name) + r"'.*?)"
        r"(price:\s*)([\d.]+)(.*?\n)"
        r"(.*?prevPrice:\s*)([\d.]+)(.*?\n)"
        r"(.*?)"
        r"(dataDate:\s*')([\d-]+)(')",
        re.DOTALL
    )
    match = pattern.search(content)
    if not match:
        print(f"    [SKIP] '{commodity_name}' not found in file")
        return content

    old_price = match.group(3)
    new_content = content[:match.start()]
    new_content += match.group(1)
    new_content += match.group(2) + fmt(price)
    # Update the comment if there is one on the price line
    price_comment = match.group(4)
    price_comment = re.sub(r'//.*', f'// auto-updated {date_str}', price_comment)
    new_content += price_comment
    new_content += match.group(5) + fmt(prev_price)
    prev_comment = match.group(7)
    prev_comment = re.sub(r'//.*', f'// previous: {old_price}', prev_comment)
    new_content += prev_comment
    new_content += match.group(8)
    new_content += match.group(9) + date_str + match.group(11)
    new_content += content[match.end():]

    print(f"    [OK] '{commodity_name}': {old_price} → {fmt(price)}")
    return new_content


def update_sample_price(content, key, price, prev_price):
    """Update today/yesterdayClose in sampleData for a given key."""
    # Find the sampleData block for this key
    block_pattern = re.compile(
        r"(" + re.escape(key) + r":\s*\{.*?)"
        r"(yesterdayClose:\s*)([\d.]+)(.*?\n)"
        r"(.*?today:\s*)([\d.]+)",
        re.DOTALL
    )
    match = block_pattern.search(content)
    if not match:
        print(f"    [SKIP] sampleData.{key} not found")
        return content

    new_content = content[:match.start()]
    new_content += match.group(1)
    new_content += match.group(2) + fmt(prev_price)
    yesterday_comment = match.group(4)
    yesterday_comment = re.sub(r'//.*', f'// previous close', yesterday_comment)
    new_content += yesterday_comment
    new_content += match.group(5) + fmt(price)
    new_content += content[match.end():]

    print(f"    [OK] sampleData.{key}: today={fmt(price)}")
    return new_content


def update_fred_monthly(content, key, monthly_this_year, monthly_last_year, avg_ytd, avg_last_year, avg_last_month):
    """Update monthly arrays and averages in sampleData."""
    # monthlyThisYear
    mty_pattern = re.compile(
        r"(" + re.escape(key) + r":\s*\{.*?monthlyThisYear:\s*)\[([^\]]*)\]",
        re.DOTALL
    )
    match = mty_pattern.search(content)
    if match:
        arr_str = ", ".join("null" if v is None else str(v) for v in monthly_this_year)
        content = content[:match.start(2)] + arr_str + content[match.end(2):]

    # monthlyLastYear
    mly_pattern = re.compile(
        r"(" + re.escape(key) + r":\s*\{.*?monthlyLastYear:\s*)\[([^\]]*)\]",
        re.DOTALL
    )
    match = mly_pattern.search(content)
    if match:
        arr_str = ", ".join("null" if v is None else str(v) for v in monthly_last_year)
        content = content[:match.start(2)] + arr_str + content[match.end(2):]

    # avgYTD
    if avg_ytd is not None:
        content = re.sub(
            r"(" + re.escape(key) + r":\s*\{.*?avgYTD:\s*)([\d.]+|null)",
            lambda m: m.group(1) + fmt(avg_ytd),
            content, count=1, flags=re.DOTALL
        )

    # avgLastYear
    if avg_last_year is not None:
        content = re.sub(
            r"(" + re.escape(key) + r":\s*\{.*?avgLastYear:\s*)([\d.]+|null)",
            lambda m: m.group(1) + fmt(avg_last_year),
            content, count=1, flags=re.DOTALL
        )

    # avgLastMonth
    if avg_last_month is not None:
        content = re.sub(
            r"(" + re.escape(key) + r":\s*\{.*?avgLastMonth:\s*)([\d.]+|null)",
            lambda m: m.group(1) + fmt(avg_last_month),
            content, count=1, flags=re.DOTALL
        )

    return content


# ── Data Fetchers ─────────────────────────────────────────────────────

def fetch_yahoo():
    """Fetch current prices from Yahoo Finance."""
    try:
        import yfinance as yf
    except ImportError:
        print("[Yahoo Finance] yfinance not installed — skipping")
        return {}

    tickers = list(YAHOO_MAP.keys())
    print(f"[Yahoo Finance] Fetching {len(tickers)} tickers...")

    results = {}
    try:
        data = yf.download(tickers, period="5d", interval="1d", progress=False, threads=True)
    except Exception as e:
        print(f"  Download failed: {e}")
        return {}

    for ticker in tickers:
        try:
            if len(tickers) == 1:
                close = data["Close"]
            else:
                close = data["Close"][ticker]
            valid = close.dropna()
            if len(valid) == 0:
                continue
            price = float(valid.iloc[-1])
            prev = float(valid.iloc[-2]) if len(valid) >= 2 else price
            date = valid.index[-1].strftime("%Y-%m-%d")
            results[ticker] = {"price": price, "prev": prev, "date": date}
            print(f"  {ticker}: {price:.4f} (prev {prev:.4f}, {date})")
        except Exception as e:
            print(f"  {ticker}: FAILED — {e}")

    return results


def fetch_fred(api_key):
    """Fetch monthly observations from FRED."""
    import urllib.request
    now = datetime.utcnow()
    start = f"{now.year - 1}-01-01"
    results = {}

    print(f"[FRED API] Fetching {len(FRED_SERIES)} series...")

    for series_id, meta in FRED_SERIES.items():
        url = (
            f"https://api.stlouisfed.org/fred/series/observations"
            f"?series_id={series_id}&api_key={api_key}&file_type=json"
            f"&observation_start={start}&sort_order=desc&limit=24"
        )
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "CommodityMonitor/1.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode())

            convert = meta["convert"]
            monthly_this = [None] * 12
            monthly_last = [None] * 12

            for obs in data.get("observations", []):
                try:
                    val = convert(float(obs["value"]))
                except (ValueError, TypeError):
                    continue
                dt = datetime.strptime(obs["date"], "%Y-%m-%d")
                if dt.year == now.year:
                    monthly_this[dt.month - 1] = val
                elif dt.year == now.year - 1:
                    monthly_last[dt.month - 1] = val

            valid_this = [v for v in monthly_this if v is not None]
            valid_last = [v for v in monthly_last if v is not None]

            results[meta["key"]] = {
                "monthlyThisYear": monthly_this,
                "monthlyLastYear": monthly_last,
                "avgYTD": round(sum(valid_this) / len(valid_this), 2) if valid_this else None,
                "avgLastYear": round(sum(valid_last) / len(valid_last), 2) if valid_last else None,
                "avgLastMonth": monthly_this[now.month - 2] if now.month >= 2 else monthly_last[11],
            }
            print(f"  {series_id} ({meta['key']}): {len(valid_this)} months this year, {len(valid_last)} last year")

        except Exception as e:
            print(f"  {series_id}: FAILED — {e}")

    return results


# ── Main ──────────────────────────────────────────────────────────────

def main():
    fred_api_key = os.environ.get("FRED_API_KEY", "")

    # Fetch data
    yahoo = fetch_yahoo()
    fred = {}
    if fred_api_key and fred_api_key != "YOUR_FRED_API_KEY_HERE":
        fred = fetch_fred(fred_api_key)
    else:
        print("\n[FRED] No FRED_API_KEY set — skipping monthly data")

    if not yahoo and not fred:
        print("\nNo data fetched. Config files unchanged.")
        return

    # Read config files
    files = {}
    for fname in ["config.js", "config-oilgas.js", "config-poultry.js"]:
        path = ROOT / "js" / fname
        files[fname] = path.read_text()

    # Apply Yahoo Finance prices
    if yahoo:
        print("\n[Applying Yahoo Finance prices]")
        for ticker, ydata in yahoo.items():
            mapping = YAHOO_MAP[ticker]
            fname = mapping["file"]
            convert = mapping.get("convert_compact", lambda p: p)
            price = convert(ydata["price"])
            prev = convert(ydata["prev"])
            date = ydata["date"]

            for target in mapping["targets"]:
                if target["section"] in ("compactCommodities", "commodities"):
                    files[fname] = update_compact_price(
                        files[fname], target["name"], price, prev, date
                    )
                elif target["section"] == "sampleData":
                    files[fname] = update_sample_price(
                        files[fname], target["key"], price, prev
                    )

    # Apply FRED monthly data
    if fred:
        print("\n[Applying FRED monthly data]")
        fname = "config.js"
        for key, fdata in fred.items():
            print(f"  Updating sampleData.{key} monthly arrays")
            files[fname] = update_fred_monthly(
                files[fname], key,
                fdata["monthlyThisYear"], fdata["monthlyLastYear"],
                fdata["avgYTD"], fdata["avgLastYear"], fdata["avgLastMonth"]
            )
            # Also update avgYTD/avgLastYear in compactCommodities
            # Find the matching compact commodity name
            key_to_name = {
                "cpo": "Crude Palm Oil (CPO)", "soybean_oil": "Soybean Oil",
                "sunflower_oil": "Sunflower Oil", "raw_sugar": "Raw Sugar (No. 11)",
                "soybeans": "Soybeans", "soybean_meal": "Soybean Meal",
            }
            cname = key_to_name.get(key)
            if cname and fdata["avgYTD"] is not None:
                files[fname] = re.sub(
                    r"(name:\s*'" + re.escape(cname) + r"'.*?avgYTD:\s*)([\d.]+|null)",
                    lambda m: m.group(1) + fmt(fdata["avgYTD"]),
                    files[fname], count=1, flags=re.DOTALL
                )
            if cname and fdata["avgLastYear"] is not None:
                files[fname] = re.sub(
                    r"(name:\s*'" + re.escape(cname) + r"'.*?avgLastYear:\s*)([\d.]+|null)",
                    lambda m: m.group(1) + fmt(fdata["avgLastYear"]),
                    files[fname], count=1, flags=re.DOTALL
                )

    # Write updated files
    print("\n[Writing updated config files]")
    for fname, content in files.items():
        path = ROOT / "js" / fname
        path.write_text(content)
        print(f"  {fname} ✓")

    # Update the "All data last verified" date in file headers
    for fname in files:
        path = ROOT / "js" / fname
        txt = path.read_text()
        txt = re.sub(
            r"All data last verified: .+",
            f"All data last verified: {TODAY}",
            txt
        )
        path.write_text(txt)

    print(f"\nDone — prices updated to {TODAY}")


if __name__ == "__main__":
    main()
