#!/usr/bin/env python3
"""
Commodity Price Auto-Updater
Fetches latest prices from free APIs and writes data/prices.json.

Data Sources:
  - FRED API (Federal Reserve Economic Data): Monthly commodity averages
  - Yahoo Finance (yfinance): Daily/current exchange prices

Usage:
  FRED_API_KEY=xxx python3 scripts/update_prices.py

Environment Variables:
  FRED_API_KEY  — Free API key from https://fred.stlouisfed.org/docs/api/api_key.html
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# ---------------------------------------------------------------------------
# Yahoo Finance tickers → commodity mapping
# ---------------------------------------------------------------------------
YAHOO_TICKERS = {
    # Oil & Gas
    "BZ=F":  {"industry": "oilgas", "name": "Brent Crude",         "unit": "$/bbl"},
    "CL=F":  {"industry": "oilgas", "name": "WTI Crude",           "unit": "$/bbl"},
    "NG=F":  {"industry": "oilgas", "name": "Henry Hub Nat Gas",   "unit": "$/MMBtu"},
    "RB=F":  {"industry": "oilgas", "name": "RBOB Gasoline",       "unit": "$/gal"},
    # Agri — compactCommodities
    "ZL=F":  {"industry": "agri", "name": "Soybean Oil",
              "unit": "USD/MT", "convert": lambda p: round(p * 22.0462, 2)},
    "ZS=F":  {"industry": "agri", "name": "Soybeans",
              "unit": "USD/MT", "convert": lambda p: round(p * 0.3674, 2)},
    "ZM=F":  {"industry": "agri", "name": "Soybean Meal",
              "unit": "USD/MT", "convert": lambda p: round(p * 1.10231, 2)},
    "SB=F":  {"industry": "agri", "name": "Raw Sugar (No. 11)",
              "unit": "USD/MT", "convert": lambda p: round(p * 22.0462, 2)},
    # Poultry global benchmarks
    "ZC=F":  {"industry": "poultry", "name": "Corn (CBOT Front-Month)", "unit": "¢/bu"},
}

# ---------------------------------------------------------------------------
# FRED series → commodity mapping
# ---------------------------------------------------------------------------
FRED_SERIES = {
    # Agri (monthly, USD/MT unless noted)
    "PPOILUSDM":   {"industry": "agri",   "name": "Crude Palm Oil (CPO)", "key": "cpo"},
    "PSOILUSDM":   {"industry": "agri",   "name": "Soybean Oil",         "key": "soybean_oil"},
    "PSUNOUSDM":   {"industry": "agri",   "name": "Sunflower Oil",       "key": "sunflower_oil"},
    "PSUGAISAUSDM": {"industry": "agri",  "name": "Raw Sugar (No. 11)",  "key": "raw_sugar",
                     "convert": lambda v: round(v * 22.0462)},
    "PSOYBUSDM":   {"industry": "agri",   "name": "Soybeans",            "key": "soybeans"},
    "PSMEAUSDM":   {"industry": "agri",   "name": "Soybean Meal",        "key": "soybean_meal"},
    # Oil (daily)
    "DCOILBRENTEU": {"industry": "oilgas", "name": "Brent Crude",        "key": "brent_daily"},
    "DCOILWTICO":   {"industry": "oilgas", "name": "WTI Crude",          "key": "wti_daily"},
    # Propane
    "DPROPANEMBTX": {"industry": "oilgas", "name": "Propane (Mt Belvieu)", "key": "propane_daily"},
}


def fetch_fred_data(api_key: str) -> dict:
    """Fetch latest observations from FRED for all configured series."""
    import urllib.request
    import urllib.error

    results = {}
    now = datetime.utcnow()
    start_date = f"{now.year - 1}-01-01"

    for series_id, meta in FRED_SERIES.items():
        url = (
            f"https://api.stlouisfed.org/fred/series/observations"
            f"?series_id={series_id}&api_key={api_key}&file_type=json"
            f"&observation_start={start_date}&sort_order=desc&limit=24"
        )
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "CommodityMonitor/1.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode())

            observations = data.get("observations", [])
            convert = meta.get("convert", lambda v: round(v, 2))

            monthly_this_year = [None] * 12
            monthly_last_year = [None] * 12
            latest_value = None
            latest_date = None

            for obs in observations:
                try:
                    value = float(obs["value"])
                except (ValueError, TypeError):
                    continue
                value = convert(value)
                obs_date = obs["date"]
                dt = datetime.strptime(obs_date, "%Y-%m-%d")

                if latest_value is None:
                    latest_value = value
                    latest_date = obs_date

                if dt.year == now.year:
                    monthly_this_year[dt.month - 1] = value
                elif dt.year == now.year - 1:
                    monthly_last_year[dt.month - 1] = value

            # Compute averages
            valid_this_year = [v for v in monthly_this_year if v is not None]
            valid_last_year = [v for v in monthly_last_year if v is not None]

            results[meta["key"]] = {
                "name": meta["name"],
                "industry": meta["industry"],
                "latestValue": latest_value,
                "latestDate": latest_date,
                "monthlyThisYear": monthly_this_year,
                "monthlyLastYear": monthly_last_year,
                "avgYTD": round(sum(valid_this_year) / len(valid_this_year), 2) if valid_this_year else None,
                "avgLastYear": round(sum(valid_last_year) / len(valid_last_year), 2) if valid_last_year else None,
                "avgLastMonth": monthly_this_year[now.month - 2] if now.month >= 2 else monthly_last_year[11],
                "source": f"FRED ({series_id})",
            }
            print(f"  FRED {series_id}: {latest_value} ({latest_date})")

        except Exception as e:
            print(f"  FRED {series_id}: FAILED — {e}", file=sys.stderr)

    return results


def fetch_yahoo_data() -> dict:
    """Fetch current prices from Yahoo Finance using yfinance."""
    results = {}

    try:
        import yfinance as yf
    except ImportError:
        print("  yfinance not installed, skipping Yahoo Finance data", file=sys.stderr)
        return results

    tickers_str = " ".join(YAHOO_TICKERS.keys())
    try:
        data = yf.download(tickers_str, period="5d", interval="1d", progress=False, threads=True)
    except Exception as e:
        print(f"  Yahoo Finance download failed: {e}", file=sys.stderr)
        return results

    for ticker, meta in YAHOO_TICKERS.items():
        try:
            # Handle both single-ticker and multi-ticker DataFrame formats
            if len(YAHOO_TICKERS) == 1:
                close_series = data["Close"]
            else:
                close_series = data["Close"][ticker]

            # Drop NaN and get last two values
            valid = close_series.dropna()
            if len(valid) == 0:
                continue

            raw_price = float(valid.iloc[-1])
            raw_prev = float(valid.iloc[-2]) if len(valid) >= 2 else raw_price
            last_date = valid.index[-1].strftime("%Y-%m-%d")

            convert = meta.get("convert", lambda p: round(p, 2))
            price = convert(raw_price)
            prev_price = convert(raw_prev)

            results[ticker] = {
                "name": meta["name"],
                "industry": meta["industry"],
                "price": price,
                "prevPrice": prev_price,
                "rawPrice": round(raw_price, 4),
                "dataDate": last_date,
                "source": "Yahoo Finance",
            }
            print(f"  Yahoo {ticker} ({meta['name']}): {price} ({last_date})")

        except Exception as e:
            print(f"  Yahoo {ticker}: FAILED — {e}", file=sys.stderr)

    return results


def build_output(fred_data: dict, yahoo_data: dict) -> dict:
    """Build the final prices.json structure."""
    now = datetime.utcnow()

    # --- Agri: merge FRED monthly + Yahoo daily ---
    agri_commodities = {}
    for key in ["cpo", "soybean_oil", "sunflower_oil", "raw_sugar", "soybeans", "soybean_meal"]:
        fred = fred_data.get(key, {})
        entry = {
            "monthlyThisYear": fred.get("monthlyThisYear"),
            "monthlyLastYear": fred.get("monthlyLastYear"),
            "avgYTD": fred.get("avgYTD"),
            "avgLastYear": fred.get("avgLastYear"),
            "avgLastMonth": fred.get("avgLastMonth"),
            "fredLatest": fred.get("latestValue"),
            "fredDate": fred.get("latestDate"),
        }
        agri_commodities[key] = entry

    # Map Yahoo tickers to agri keys
    yahoo_agri_map = {
        "ZL=F": "soybean_oil",
        "ZS=F": "soybeans",
        "ZM=F": "soybean_meal",
        "SB=F": "raw_sugar",
    }
    for ticker, agri_key in yahoo_agri_map.items():
        ydata = yahoo_data.get(ticker)
        if ydata and agri_key in agri_commodities:
            agri_commodities[agri_key]["price"] = ydata["price"]
            agri_commodities[agri_key]["prevPrice"] = ydata["prevPrice"]
            agri_commodities[agri_key]["dataDate"] = ydata["dataDate"]
            agri_commodities[agri_key]["rawPrice"] = ydata["rawPrice"]

    # --- Oil & Gas ---
    oilgas_commodities = {}
    yahoo_oilgas_map = {
        "BZ=F": "Brent Crude",
        "CL=F": "WTI Crude",
        "NG=F": "Henry Hub Nat Gas",
        "RB=F": "RBOB Gasoline",
    }
    for ticker, name in yahoo_oilgas_map.items():
        ydata = yahoo_data.get(ticker)
        if ydata:
            oilgas_commodities[name] = {
                "price": ydata["price"],
                "prevPrice": ydata["prevPrice"],
                "dataDate": ydata["dataDate"],
            }

    # Add FRED daily oil data
    for fred_key, name in [("brent_daily", "Brent Crude"), ("wti_daily", "WTI Crude")]:
        fred = fred_data.get(fred_key, {})
        if fred and name in oilgas_commodities:
            oilgas_commodities[name]["fredLatest"] = fred.get("latestValue")
            oilgas_commodities[name]["fredDate"] = fred.get("latestDate")

    # Propane
    propane = fred_data.get("propane_daily", {})
    if propane:
        oilgas_commodities["Propane (Mt Belvieu)"] = {
            "price": propane.get("latestValue"),
            "dataDate": propane.get("latestDate"),
        }

    # --- Poultry global benchmarks ---
    poultry_commodities = {}
    corn_data = yahoo_data.get("ZC=F")
    if corn_data:
        poultry_commodities["Corn (CBOT Front-Month)"] = {
            "price": corn_data["price"],
            "prevPrice": corn_data["prevPrice"],
            "dataDate": corn_data["dataDate"],
        }
    # Soybean Meal for poultry is same as agri
    zm_data = yahoo_data.get("ZM=F")
    if zm_data:
        poultry_commodities["Soybean Meal (CBOT)"] = {
            "price": zm_data["rawPrice"],  # poultry config uses $/short ton
            "prevPrice": round(zm_data["prevPrice"] / 1.10231, 2),
            "dataDate": zm_data["dataDate"],
        }

    return {
        "lastUpdated": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "agri": agri_commodities,
        "oilgas": oilgas_commodities,
        "petrochem": {},  # subscription-gated sources, no free API
        "poultry": poultry_commodities,
    }


def main():
    fred_api_key = os.environ.get("FRED_API_KEY", "")
    output_path = Path(__file__).parent.parent / "data" / "prices.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print("Fetching commodity prices...")

    fred_data = {}
    if fred_api_key and fred_api_key != "YOUR_FRED_API_KEY_HERE":
        print("\n[FRED API]")
        fred_data = fetch_fred_data(fred_api_key)
    else:
        print("\nNo FRED_API_KEY set — skipping FRED data")

    print("\n[Yahoo Finance]")
    yahoo_data = fetch_yahoo_data()

    if not fred_data and not yahoo_data:
        print("\nNo data fetched from any source. Exiting without update.")
        sys.exit(1)

    output = build_output(fred_data, yahoo_data)

    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote {output_path}")
    print(f"Last updated: {output['lastUpdated']}")


if __name__ == "__main__":
    main()
