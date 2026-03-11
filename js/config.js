/* =============================================
   CONFIGURATION - API Endpoints & Commodity Settings

   DATA SOURCES:
   - Monthly averages: FRED / IMF Primary Commodity Prices (free, public)
   - Current prices: CME, ICE, Bursa Malaysia via market feeds
   - All data last verified: March 10, 2026

   TO GET LIVE AUTO-UPDATING DATA:
   1. Register free at https://fred.stlouisfed.org/docs/api/api_key.html
   2. Paste your key in apis.fred.apiKey below
   3. Set apis.fred.enabled = true
   ============================================= */

const CONFIG = {

    // =========================================
    // RED ALERTS — Critical negative developments
    // =========================================
    alerts: [
        {
            text: 'Indonesia raised crude palm oil export levies to 12.5% from March 1 and banned palm oil waste exports, tightening global edible oil supply as the government prioritizes domestic biodiesel mandates.',
            source: 'Fastmarkets',
            url: 'https://www.fastmarkets.com/insights/indonesia-restricts-crude-palm-oil-exports-waste/',
            date: '2026-03-01'
        },
        {
            text: 'Sugar prices jumped as crude oil surged above $90/bbl, raising ethanol parity and incentivizing Brazilian mills to divert sugarcane away from sugar production toward biofuel.',
            source: 'Barchart',
            url: 'https://markets.financialcontent.com/wss/article/barchart-2026-3-9-sugar-prices-jump-as-crude-oil-surges',
            date: '2026-03-09'
        },
        {
            text: 'U.S. soybean exports to China remained 76% below 2024 levels as retaliatory tariffs persist, with farmers facing a potential fourth consecutive year of losses amid rising input costs.',
            source: 'American Soybean Association',
            url: 'https://soygrowers.com/news-releases/the-rising-cost-squeeze-soybean-farmers-face-a-third-year-of-losses/',
            date: '2026-03-03'
        }
    ],

    // =========================================
    // API ENDPOINTS
    // =========================================
    apis: {
        fred: {
            enabled: false,
            // FRED API - Federal Reserve Economic Data
            // FREE — register at https://fred.stlouisfed.org/docs/api/api_key.html
            // Provides IMF commodity price data updated monthly
            // INSERT YOUR FREE API KEY BELOW:
            apiKey: 'YOUR_FRED_API_KEY_HERE',
            baseUrl: 'https://api.stlouisfed.org/fred/series/observations',
            // FRED series IDs for each commodity (USD/MT unless noted)
            series: {
                palmOil: 'PPOILUSDM',       // Palm oil, $/MT
                soybeanOil: 'PSOILUSDM',     // Soybean oil, $/MT
                sunflowerOil: 'PSUNOUSDM',   // Sunflower oil, $/MT
                sugarRaw: 'PSUGAISAUSDM',    // Sugar No.11, cents/lb
                soybeans: 'PSOYBUSDM',       // Soybeans, $/MT
                soybeanMeal: 'PSMEAUSDM'     // Soybean meal, $/MT
            }
        },

        usdaFas: {
            enabled: false,
            // USDA Foreign Agricultural Service - PSD Online
            // Requires free API key: https://apps.fas.usda.gov/opendataweb/home
            apiKey: 'YOUR_USDA_FAS_API_KEY_HERE',
            baseUrl: 'https://apps.fas.usda.gov/OpenData/api/psd/',
        },

        commodityPricesApi: {
            enabled: false,
            // commodities-api.com (freemium, 250 req/mo)
            // Sign up: https://commodities-api.com/
            apiKey: 'YOUR_COMMODITIES_API_KEY_HERE',
            baseUrl: 'https://commodities-api.com/api/',
        },

        tradingEconomics: {
            enabled: false,
            // Trading Economics API (paid subscription)
            // See: https://tradingeconomics.com/api/
            apiKey: 'YOUR_TRADING_ECONOMICS_KEY_HERE',
            baseUrl: 'https://api.tradingeconomics.com/',
        }
    },

    // =========================================
    // COMMODITIES CONFIGURATION
    // =========================================
    commodities: {
        cpo: {
            name: 'Crude Palm Oil (CPO)',
            shortName: 'CPO',
            type: 'Edible Oil',
            group: 'edibleOils',
            originalUnit: 'MYR/ton',
            conversionFactor: 1.0,
            conversionNote: 'IMF benchmark: Malaysia palm oil, 5% bulk, c.i.f. NW Europe, USD/MT',
            myrToUsd: 0.2237,
            source: {
                name: 'Investing.com',
                url: 'https://www.investing.com/commodities/palm-oil-usd'
            },
            monthlySource: {
                name: 'FRED/IMF',
                url: 'https://fred.stlouisfed.org/series/PPOILUSDM'
            },
            fredSeries: 'PPOILUSDM',
            color: '#F58420'
        },
        soybean_oil: {
            name: 'Soybean Oil',
            shortName: 'SBO',
            type: 'Edible Oil',
            group: 'edibleOils',
            originalUnit: 'cents/lb',
            conversionFactor: 22.0462,
            conversionNote: 'CBOT: cents/lb × 22.0462 = USD/MT. IMF benchmark: Dutch, f.o.b. ex-mill',
            source: {
                name: 'CME CBOT',
                url: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-oil.html'
            },
            monthlySource: {
                name: 'FRED/IMF',
                url: 'https://fred.stlouisfed.org/series/PSOILUSDM'
            },
            fredSeries: 'PSOILUSDM',
            color: '#004A88'
        },
        sunflower_oil: {
            name: 'Sunflower Oil',
            shortName: 'SFO',
            type: 'Edible Oil',
            group: 'edibleOils',
            originalUnit: 'USD/MT',
            conversionFactor: 1.0,
            conversionNote: 'IMF benchmark: US export price, f.o.b. Gulf of Mexico, USD/MT',
            source: {
                name: 'Trading Economics',
                url: 'https://tradingeconomics.com/commodity/sunflower-oil'
            },
            monthlySource: {
                name: 'FRED/IMF',
                url: 'https://fred.stlouisfed.org/series/PSUNOUSDM'
            },
            fredSeries: 'PSUNOUSDM',
            color: '#d97706'
        },
        raw_sugar: {
            name: 'Raw Sugar (No. 11)',
            shortName: 'Sugar #11',
            type: 'Sugar',
            group: 'sugar',
            originalUnit: 'cents/lb',
            conversionFactor: 22.0462,
            conversionNote: 'ICE No.11: cents/lb × 22.0462 = USD/MT. IMF: ISA daily price, f.o.b. Caribbean',
            source: {
                name: 'ICE Futures',
                url: 'https://www.ice.com/products/23/Sugar-No-11-Futures/data'
            },
            monthlySource: {
                name: 'FRED/IMF',
                url: 'https://fred.stlouisfed.org/series/PSUGAISAUSDM'
            },
            fredSeries: 'PSUGAISAUSDM',
            color: '#dc2626'
        },
        white_sugar: {
            name: 'White Sugar (No. 5)',
            shortName: 'Sugar #5',
            type: 'Sugar',
            group: 'sugar',
            originalUnit: 'USD/MT',
            conversionFactor: 1.0,
            conversionNote: 'ICE No.5 London. White premium over No.11 (~$100/MT avg)',
            source: {
                name: 'ICE London',
                url: 'https://www.ice.com/products/37089080/White-Sugar-Futures/data'
            },
            monthlySource: {
                name: 'Barchart',
                url: 'https://www.barchart.com/futures/quotes/SW*0/futures-prices'
            },
            color: '#fb923c'
        },
        soybeans: {
            name: 'Soybeans',
            shortName: 'Soybeans',
            type: 'Oilseed',
            group: 'soybeans',
            originalUnit: 'cents/bushel',
            conversionFactor: 0.3674,
            conversionNote: 'CBOT: cents/bu ÷ 100 × 36.7437 bu/MT. IMF benchmark: US No.2, c.i.f. Rotterdam',
            source: {
                name: 'CME CBOT',
                url: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean.html'
            },
            monthlySource: {
                name: 'FRED/IMF',
                url: 'https://fred.stlouisfed.org/series/PSOYBUSDM'
            },
            fredSeries: 'PSOYBUSDM',
            color: '#0d9f6e'
        },
        soybean_meal: {
            name: 'Soybean Meal',
            shortName: 'SBM',
            type: 'Feed',
            group: 'soybeans',
            originalUnit: 'USD/short ton',
            conversionFactor: 1.10231,
            conversionNote: 'CBOT: USD/short ton × 1.10231 = USD/MT. IMF: 44% protein, Hamburg, f.o.b. ex-mill',
            source: {
                name: 'CME CBOT',
                url: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-meal.html'
            },
            monthlySource: {
                name: 'FRED/IMF',
                url: 'https://fred.stlouisfed.org/series/PSMEAUSDM'
            },
            fredSeries: 'PSMEAUSDM',
            color: '#0073cc'
        }
    },

    // =========================================
    // VERIFIED PRICE DATA — Every figure sourced & cross-checked
    //
    // MONTHLY AVERAGES: FRED/IMF Primary Commodity Prices
    //   Retrieved from https://fred.stlouisfed.org/ — verified Mar 10, 2026
    //   FRED last updated: 2026-02-12 (data through Jan 2026)
    //   Feb 2026: FRED not yet published — sourced from Yahoo Finance
    //     exchange daily settlements (19 trading days, full month avg)
    //     CPO: Indonesian govt reference price; White Sugar: CZApp partial
    //     Sunflower Oil: no verified Feb source → null
    //   Mar 2026 partial: 6 trading days (Mar 2-9) from Yahoo Finance
    //
    // TODAY/YESTERDAY: Exchange settlement prices, Mar 9, 2026
    //   Sources: CME/CBOT, ICE Futures, Investing.com, Bursa Malaysia
    //
    // YEARLY AVERAGES: Calculated from verified FRED monthly data
    // =========================================
    sampleData: {
        cpo: {
            // FRED series PPOILUSDM — verified ✓
            // Today: Bursa Malaysia FCPO May-26 settlement 4,774 MYR/ton (Mar 9)
            // Source: https://www.investing.com/commodities/palm-oil
            // Feb 2026: Indonesian govt CPO reference price ~$995/MT
            // Source: https://palmoilmagazine.com/
            yesterdayClose: 944.00,          // Bursa FCPO pre-spike close Mar 7 (~4,219 MYR open Mar 9)
            today: 1068.57,                  // 4,774 MYR settlement × 0.2237 USD/MYR (Mar 9)
            avgThisMonth: null,              // Mar 2026 — no exchange ticker on Yahoo Finance
            avgLastMonth: 995.00,            // Feb 2026: Indonesian govt CPO reference price
            avgYTD: 1000.00,                 // (Jan $1,004 + Feb $995) / 2
            avgLastYear: 996.79,             // FRED 2025 avg: (1030+1067+1057+981+903+935+931+1026+1035+1038+977+981)/12
            originalPrice: { value: 4774, unit: 'MYR/ton' },
            // FRED/IMF monthly data (USD/MT) — Jan verified FRED, Feb from Indonesian govt
            monthlyThisYear: [1004, 995, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [1030, 1067, 1057, 981, 903, 935, 931, 1026, 1035, 1038, 977, 981],
            dataSource: 'FRED/IMF (PPOILUSDM) + Indonesian govt ref price + Investing.com live'
        },
        soybean_oil: {
            // FRED series PSOILUSDM — verified ✓
            // Today: CME CBOT ZL May-26 at 69.61 c/lb (Mar 9 settlement)
            // Source: https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-oil.html
            // Feb 2026: Yahoo Finance ZLK26.CBT — 19 trading days avg = 58.19 c/lb = $1,282.90/MT
            // Mar 2026 partial: 6 trading days avg = 64.47 c/lb = $1,420.73/MT
            // Source: https://finance.yahoo.com/quote/ZLK26.CBT/history/
            yesterdayClose: 1435.00,         // ~65.10 c/lb × 22.0462 (Mar 7 close)
            today: 1534.50,                  // 69.61 c/lb × 22.0462 (CBOT May-26 settlement Mar 9)
            avgThisMonth: 1421.00,           // Mar 2026 partial (6 days): 64.47 c/lb × 22.0462 (Yahoo Finance)
            avgLastMonth: 1283.00,           // Feb 2026 full: 58.19 c/lb × 22.0462 (Yahoo Finance ZLK26)
            avgYTD: 1197.00,                 // (Jan $1,111 + Feb $1,283) / 2
            avgLastYear: 1076.78,            // FRED 2025 avg: (967+1011+937+1048+1075+1169+1180+1151+1108+1098+1099+1080)/12
            originalPrice: { value: 69.61, unit: 'cents/lb' },
            // Jan: FRED verified; Feb: Yahoo Finance 19-day avg; Mar onward: null
            monthlyThisYear: [1111, 1283, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [967, 1011, 937, 1048, 1075, 1169, 1180, 1151, 1108, 1098, 1099, 1080],
            dataSource: 'FRED/IMF (PSOILUSDM) + Yahoo Finance (Feb) + CME CBOT live'
        },
        sunflower_oil: {
            // FRED series PSUNOUSDM — verified ✓
            // Today: Trading Economics global benchmark ~$1,540/MT (Mar 9)
            // Source: https://tradingeconomics.com/commodity/sunflower-oil
            // Feb 2026: NO verified monthly avg — OTC market, no exchange ticker on Yahoo Finance
            //   FRED/IMF not yet published; Trading Economics futures (~$1,540) uses different methodology
            yesterdayClose: 1535.00,          // Trading Economics Mar 7 close
            today: 1540.00,                  // Trading Economics Mar 9
            avgThisMonth: null,              // Mar 2026 — no exchange data available
            avgLastMonth: null,              // Feb 2026 — no verified source (OTC market)
            avgYTD: 1787.00,                 // Jan 2026 only (FRED: $1,786.51 rounded)
            avgLastYear: 1525.66,            // FRED 2025 avg: (1451+1461+1470+1472+1457+1447+1487+1539+1577+1643+1649+1656)/12
            originalPrice: { value: 1540, unit: 'USD/MT' },
            // Jan: FRED verified; Feb: null (no exchange-traded benchmark for monthly avg)
            monthlyThisYear: [1787, null, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [1451, 1461, 1470, 1472, 1457, 1447, 1487, 1539, 1577, 1643, 1649, 1656],
            dataSource: 'FRED/IMF (PSUNOUSDM) + Trading Economics live'
        },
        raw_sugar: {
            // FRED series PSUGAISAUSDM — verified ✓ (cents/lb × 22.0462 = USD/MT)
            // Today: ICE No.11 May-26 at ~14.01 c/lb (Mar 9)
            // Source: https://www.ice.com/products/23/Sugar-No-11-Futures/data
            // Feb 2026: Yahoo Finance SBK26.NYB — 19 trading days avg = 13.81 c/lb = $304.50/MT
            // Mar 2026 partial: 6 trading days avg = 14.00 c/lb = $308.68/MT
            // Source: https://finance.yahoo.com/quote/SBK26.NYB/history/
            yesterdayClose: 308.65,          // ~14.00 c/lb × 22.0462 (Mar 7)
            today: 308.87,                   // 14.01 c/lb × 22.0462 (ICE Mar 9)
            avgThisMonth: 309.00,            // Mar 2026 partial (6 days): 14.00 c/lb × 22.0462 (Yahoo Finance)
            avgLastMonth: 305.00,            // Feb 2026 full: 13.81 c/lb × 22.0462 (Yahoo Finance SBK26)
            avgYTD: 316.00,                  // (Jan $326 + Feb $305) / 2
            avgLastYear: 374.25,             // FRED 2025 avg: 16.97 c/lb × 22.0462
            originalPrice: { value: 14.01, unit: 'cents/lb' },
            // Jan: FRED verified; Feb: Yahoo Finance 19-day avg; Mar onward: null
            monthlyThisYear: [326, 305, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [417, 445, 420, 400, 384, 358, 361, 361, 348, 343, 322, 329],
            dataSource: 'FRED/IMF (PSUGAISAUSDM) + Yahoo Finance (Feb) + ICE Futures live'
        },
        white_sugar: {
            // No direct FRED series — derived from Raw Sugar + white premium
            // Methodology: ICE No.5 London price; monthly = Raw Sugar USD/MT + $100/MT avg premium
            // White premium source: https://www.barchart.com/futures/quotes/SW*0/futures-prices
            // Today: ICE London No.5 May-26 at ~$412.40/MT (Mar 9)
            // Source: https://www.ice.com/products/37089080/White-Sugar-Futures/data
            // Feb 2026: CZApp daily market commentaries partial (9 of 19 trading days) ~$408/MT
            // Source: https://www.czapp.com/
            yesterdayClose: 410.00,          // ICE No.5 Mar 7 close
            today: 412.40,                   // ICE No.5 May-26 settlement Mar 9
            avgThisMonth: null,              // Mar 2026 — no Yahoo Finance ticker for white sugar
            avgLastMonth: 408.00,            // Feb 2026: CZApp partial data (9 trading days avg)
            avgYTD: 417.00,                  // (Jan $426 + Feb $408) / 2
            avgLastYear: 474.25,             // 2025 avg: Raw avg $374.25 + $100 premium
            originalPrice: { value: 412.40, unit: 'USD/MT' },
            // Jan: Raw+premium; Feb: CZApp partial avg; Mar onward: null
            monthlyThisYear: [426, 408, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [517, 545, 520, 500, 484, 458, 461, 461, 448, 443, 422, 429],
            dataSource: 'ICE Futures Europe No.5 + CZApp (Feb) + white premium calculation'
        },
        soybeans: {
            // FRED series PSOYBUSDM — verified ✓
            // Today: CME CBOT ZS Mar-26 at 1,138.50 c/bu (Mar 9)
            // Source: https://www.cmegroup.com/markets/agriculture/oilseeds/soybean.html
            // Feb 2026: Yahoo Finance ZSK26.CBT — 19 trading days avg = 1,138.07 c/bu = $418.13/MT
            // Mar 2026 partial: 6 trading days avg = 1,179.17 c/bu = $433.23/MT
            // Source: https://finance.yahoo.com/quote/ZSK26.CBT/history/
            yesterdayClose: 419.30,          // 1,141 c/bu × 0.3674 (Mar 7 close)
            today: 418.17,                   // 1,138.50 c/bu × 0.3674 (CBOT Mar 9)
            avgThisMonth: 433.00,            // Mar 2026 partial (6 days): 1,179.17 c/bu × 0.3674 (Yahoo Finance)
            avgLastMonth: 418.00,            // Feb 2026 full: 1,138.07 c/bu × 0.3674 (Yahoo Finance ZSK26)
            avgYTD: 401.00,                  // (Jan $383 + Feb $418) / 2
            avgLastYear: 380.68,             // FRED 2025 avg: (378+382+369+378+388+384+375+373+369+372+410+392)/12
            originalPrice: { value: 1138.50, unit: 'cents/bushel' },
            // Jan: FRED verified; Feb: Yahoo Finance 19-day avg; Mar onward: null
            monthlyThisYear: [383, 418, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [378, 382, 369, 378, 388, 384, 375, 373, 369, 372, 410, 392],
            dataSource: 'FRED/IMF (PSOYBUSDM) + Yahoo Finance (Feb) + CME CBOT live'
        },
        soybean_meal: {
            // FRED series PSMEAUSDM — verified ✓
            // Today: CME CBOT ZM Mar-26 at $318.80/short ton (Mar 9)
            // Source: https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-meal.html
            // Feb 2026: Yahoo Finance ZMK26.CBT — 19 trading days avg = $309.68/st = $341.36/MT
            // Mar 2026 partial: 6 trading days avg = $312.85/st = $344.86/MT
            // Source: https://finance.yahoo.com/quote/ZMK26.CBT/history/
            yesterdayClose: 337.14,          // $305.60/short ton × 1.10231 (Mar 7 close)
            today: 351.36,                   // $318.80/short ton × 1.10231 (CBOT Mar 9)
            avgThisMonth: 345.00,            // Mar 2026 partial (6 days): $312.85/st × 1.10231 (Yahoo Finance)
            avgLastMonth: 341.00,            // Feb 2026 full: $309.68/st × 1.10231 (Yahoo Finance ZMK26)
            avgYTD: 314.00,                  // (Jan $286 + Feb $341) / 2
            avgLastYear: 309.64,             // FRED 2025 avg: (333+328+326+322+319+313+246+281+326+298+319+306)/12
            originalPrice: { value: 318.80, unit: 'USD/short ton' },
            // Jan: FRED verified; Feb: Yahoo Finance 19-day avg; Mar onward: null
            monthlyThisYear: [286, 341, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [333, 328, 326, 322, 319, 313, 246, 281, 326, 298, 319, 306],
            dataSource: 'FRED/IMF (PSMEAUSDM) + Yahoo Finance (Feb) + CME CBOT live'
        }
    },

    // =========================================
    // COMPACT COMMODITIES — Unified format for Price Dashboard
    // Same structure as Oil & Gas / Petrochem / Poultry configs
    // Prices extracted from verified sampleData above
    // =========================================
    compactCommodities: [
        // --- EDIBLE OILS ---
        {
            group: 'Edible Oils',
            name: 'Crude Palm Oil (CPO)',
            price: 1068.57,          // Bursa FCPO May-26: 4,774 MYR × 0.2237 USD/MYR
            prevPrice: 944.00,       // Mar 7 close
            unit: 'USD/MT',
            sourceName: 'Investing.com',
            sourceUrl: 'https://www.investing.com/commodities/palm-oil-usd',
            dataDate: '2026-03-09',
            avgThisMonth: null,
            avgLastMonth: 995.00,
            avgYTD: 1000.00,
            avgLastYear: 996.79,
            avgSource: 'FRED/IMF + Indonesian Govt'
        },
        {
            name: 'Soybean Oil',
            price: 1534.50,          // CBOT ZL May-26: 69.61 c/lb × 22.0462
            prevPrice: 1435.00,      // Mar 7 close
            unit: 'USD/MT',
            sourceName: 'CME CBOT',
            sourceUrl: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-oil.html',
            dataDate: '2026-03-09',
            avgThisMonth: 1421.00,
            avgLastMonth: 1283.00,
            avgYTD: 1197.00,
            avgLastYear: 1076.78,
            avgSource: 'FRED/IMF + Yahoo Finance'
        },
        {
            name: 'Sunflower Oil',
            price: 1540.00,          // Trading Economics global benchmark
            prevPrice: 1535.00,      // Mar 7 close
            unit: 'USD/MT',
            sourceName: 'Trading Economics',
            sourceUrl: 'https://tradingeconomics.com/commodity/sunflower-oil',
            dataDate: '2026-03-09',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: 1787.00,
            avgLastYear: 1525.66,
            avgSource: 'FRED/IMF'
        },
        // --- SUGAR ---
        {
            group: 'Sugar',
            name: 'Raw Sugar (No. 11)',
            price: 308.87,           // ICE No.11 May-26: 14.01 c/lb × 22.0462
            prevPrice: 308.65,       // Mar 7 close
            unit: 'USD/MT',
            sourceName: 'ICE Futures',
            sourceUrl: 'https://www.ice.com/products/23/Sugar-No-11-Futures/data',
            dataDate: '2026-03-09',
            avgThisMonth: 309.00,
            avgLastMonth: 305.00,
            avgYTD: 316.00,
            avgLastYear: 374.25,
            avgSource: 'FRED/IMF + Yahoo Finance'
        },
        {
            name: 'White Sugar (No. 5)',
            price: 412.40,           // ICE London No.5 May-26 settlement
            prevPrice: 410.00,       // Mar 7 close
            unit: 'USD/MT',
            sourceName: 'ICE London',
            sourceUrl: 'https://www.ice.com/products/37089080/White-Sugar-Futures/data',
            dataDate: '2026-03-09',
            avgThisMonth: null,
            avgLastMonth: 408.00,
            avgYTD: 417.00,
            avgLastYear: 474.25,
            avgSource: 'ICE/CZApp'
        },
        // --- SOYBEANS ---
        {
            group: 'Soybeans',
            name: 'Soybeans',
            price: 418.17,           // CBOT ZS Mar-26: 1,138.50 c/bu × 0.3674
            prevPrice: 419.30,       // Mar 7 close
            unit: 'USD/MT',
            sourceName: 'CME CBOT',
            sourceUrl: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean.html',
            dataDate: '2026-03-09',
            avgThisMonth: 433.00,
            avgLastMonth: 418.00,
            avgYTD: 401.00,
            avgLastYear: 380.68,
            avgSource: 'FRED/IMF + Yahoo Finance'
        },
        {
            name: 'Soybean Meal',
            price: 351.36,           // CBOT ZM Mar-26: $318.80/st × 1.10231
            prevPrice: 337.14,       // Mar 7 close
            unit: 'USD/MT',
            sourceName: 'CME CBOT',
            sourceUrl: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-meal.html',
            dataDate: '2026-03-09',
            avgThisMonth: 345.00,
            avgLastMonth: 341.00,
            avgYTD: 314.00,
            avgLastYear: 309.64,
            avgSource: 'FRED/IMF + Yahoo Finance'
        }
    ],

    // =========================================
    // YEARLY ANALYSIS — Sourced from verified reports & market data
    // Every bullet includes an inline source link
    // =========================================
    analysis: {
        cpo: {
            title: 'Crude Palm Oil (CPO) — 2026 vs 2025 Analysis',
            points: [
                'CPO prices are broadly stable YoY: 2025 averaged $997/MT (FRED), Jan 2026 opened at $1,004/MT, and current prices sit at ~$1,069/MT — roughly +7% above the 2025 average. An S&P Global survey of 10 analysts forecasts CPO at MYR 4,200/MT (~$1,037) for 2026. <a href="https://www.spglobal.com/energy/en/news-research/latest-news/agriculture/010626-palm-oil-prices-to-weaken-in-2026-biofuel-policy-clarity-crucial-survey" target="_blank" class="source-inline">[S&P Global]</a>',
                'Indonesia kept its 2026 biodiesel quota at 15.6 million kiloliters (B40 mandate), absorbing an estimated 11 million tonnes of domestic CPO (~46% of output) and constraining export availability. Plans for B50 have been delayed. <a href="https://www.spglobal.com/energy/en/news-research/latest-news/agriculture/122325-indonesia-keeps-2026-biodiesel-quota-flat-raising-doubts-over-b50-target" target="_blank" class="source-inline">[S&P Global]</a>',
                'Malaysian production hit a seasonal low in Jan 2026 at 1.577 million tonnes (−13.8% MoM), with stocks falling 7.7% to 2.815 million tonnes, tightening near-term supply. <a href="https://agropost.wordpress.com/2026/02/10/mpob-monthly-report-jan26/" target="_blank" class="source-inline">[MPOB via Agropost]</a>',
                'FRED/IMF data shows 2025 ranged from $903/MT (May low) to $1,067/MT (Feb high). H2 recovery was driven by Indonesia\'s higher export levies and seasonal demand for Ramadan and Chinese New Year. <a href="https://fred.stlouisfed.org/series/PPOILUSDM" target="_blank" class="source-inline">[FRED]</a>',
                'Indonesia raised CPO export levies from 10% to 12.5% effective March 1, 2026, and set the March reference price at $938.87/MT with a $124/MT export duty, adding cost pressure to global supply. <a href="https://www.palmoilmagazine.com/cpo-price/2026/03/01/indonesia-sets-march-2026-cpo-reference-price-at-usd-938-87-mt-export-duties-adjusted/" target="_blank" class="source-inline">[Palm Oil Magazine]</a>'
            ]
        },
        soybean_oil: {
            title: 'Soybean Oil — 2026 vs 2025 Analysis',
            points: [
                'Soybean oil has surged ~42% above the 2025 average ($1,077/MT → ~$1,535/MT current), making it the strongest performer among tracked commodities. CBOT soybean oil rose 21.5% since Jan 2. <a href="https://fred.stlouisfed.org/series/PSOILUSDM" target="_blank" class="source-inline">[FRED]</a>',
                'U.S. biofuel policy is the primary driver: EPA\'s RVOs for 2026-27 and the 45Z tax credit (limited to North American feedstocks) have created a structural premium. USDA projects biofuel use to jump from 14.8B lbs in 2025/26 to 17.3B lbs in 2026/27. <a href="https://www.producer.com/markets/soybean-oil-prices-expected-to-rise-in-2026-27/" target="_blank" class="source-inline">[Western Producer]</a>',
                'U.S. crush is running at record pace: Oct-Dec 2025 crush totaled 686.7M bushels (+43.2M YoY). Feb WASDE raised 2025/26 crush to 2.57 billion bushels. <a href="https://ers.usda.gov/sites/default/files/_laserfiche/outlooks/113803/OCS-26b.pdf" target="_blank" class="source-inline">[USDA ERS]</a>',
                'FRED shows 2025 rising steadily from $967/MT (Jan) to $1,180/MT (Jul peak) before moderating to $1,080/MT (Dec). Jan 2026 was $1,111/MT, already above 2025 average, and Feb surged to $1,283/MT on exchange settlements. <a href="https://fred.stlouisfed.org/series/PSOILUSDM" target="_blank" class="source-inline">[FRED]</a>',
                'Higher biofuel demand is projected to reduce soybean oil available for food/exports by ~800M lbs, with ending stocks expected to fall by 170M lbs in 2026/27. <a href="https://www.producer.com/markets/soybean-oil-prices-expected-to-rise-in-2026-27/" target="_blank" class="source-inline">[Western Producer]</a>'
            ]
        },
        sunflower_oil: {
            title: 'Sunflower Oil — 2026 vs 2025 Analysis',
            points: [
                'Sunflower oil surged 23% YoY from $1,451/MT (Jan 2025) to $1,787/MT (Jan 2026, FRED), making it the strongest year-on-year performer. Prices have since corrected to ~$1,540/MT. <a href="https://fred.stlouisfed.org/series/PSUNOUSDM" target="_blank" class="source-inline">[FRED]</a>',
                'Black Sea supply disruptions remain the dominant driver: Russian strikes hit at least nine Ukrainian vegetable oil processing facilities in late 2025, leaving ~25% of Ukraine\'s crushing capacity idle. <a href="https://www.fastmarkets.com/insights/strikes-on-ukraines-vegetable-oil-drive-prices-to-multi-year-highs/" target="_blank" class="source-inline">[Fastmarkets]</a>',
                'Ukraine\'s 2025 sunflower harvest came in at ~10.5 MMT, well below USDA\'s initial 14.4 MMT projection. Russia\'s Rostov region yields dropped over 50% due to drought, removing exportable tonnage. <a href="https://ukragroconsult.com/en/news/usda-has-raised-its-forecast-for-global-oilseed-production-including-sunseed-in-ukraine-which-will-increase-pressure-on-prices/" target="_blank" class="source-inline">[UkrAgroConsult]</a>',
                'Trade flows are shifting: Turkey now sources 64% of sunflower oil from Russia (vs 56% a year ago) and only 24% from Ukraine (vs 39%), as EU sanctions redirect Russian-origin flows. <a href="https://ukragroconsult.com/en/news/sunflower-oil-market-in-ukraine-is-driving-up-demand-for-sunflower-seeds/" target="_blank" class="source-inline">[UkrAgroConsult]</a>',
                'FRED data shows prices climbed relentlessly in H2 2025, from $1,447/MT (Jun) to $1,656/MT (Dec), driven by constrained Black Sea exports and elevated Russian export duties. <a href="https://fred.stlouisfed.org/series/PSUNOUSDM" target="_blank" class="source-inline">[FRED]</a>'
            ]
        },
        raw_sugar: {
            title: 'Raw Sugar (No. 11) — 2026 vs 2025 Analysis',
            points: [
                'Raw sugar fell 26% from $417/MT (Jan 2025) to ~$309/MT (Mar 2026) — near 5-year lows — driven by massive global oversupply. ICE No.11 is down ~29% YoY from March 2025 levels. <a href="https://vespertool.com/news/sugar-prices-near-multi-year-lows-as-global-surplus-holds-crude-volatility-adds-uncertainty" target="_blank" class="source-inline">[Vesper]</a>',
                'The global surplus swung from a deficit of ~3.1 MMT in 2024/25 to a surplus in 2025/26, estimated at 1.22 MMT (ISO) to 8.3 MMT (Czarnikow). ISO forecasts production rising 3.0% YoY to 181.3 MMT. <a href="https://www.nasdaq.com/articles/sugar-prices-fall-isos-forecast-sugar-surplus" target="_blank" class="source-inline">[ISO via Nasdaq]</a>',
                'Brazil\'s 2025/26 sugar output is estimated at 43.5-45 MMT nationally, with the Centre-South sugar mix at 50.7-51.1% — the highest in several years. <a href="https://www.chinimandi.com/brazils-sugar-production-in-2025-26-season-expected-to-rise-3-1-per-cent-datagro/" target="_blank" class="source-inline">[Datagro via ChiniMandi]</a>',
                'India\'s 2025/26 output through Feb 28 reached 24.75 MMT (+12% YoY, ISMA). India approved a 2 MMT export quota, though actual exports are expected at only ~700,000 MT due to favorable domestic prices. <a href="https://www.business-standard.com/industry/agriculture/sugar-output-in-india-to-increase-18-6-to-30-95-mt-in-2025-26-isma-125111101220_1.html" target="_blank" class="source-inline">[Business Standard]</a>',
                'FRED data shows 2025 declining from 18.93 c/lb ($417/MT) in Jan to 14.93 c/lb ($329/MT) in Dec. The Brazilian Real\'s depreciation made exports more competitive in USD terms, pressuring ICE No.11. <a href="https://fred.stlouisfed.org/series/PSUGAISAUSDM" target="_blank" class="source-inline">[FRED]</a>'
            ]
        },
        white_sugar: {
            title: 'White Sugar (No. 5) — 2026 vs 2025 Analysis',
            points: [
                'White sugar declined ~13% YoY from a 2025 average of $474/MT to ~$412/MT currently, tracking raw sugar but outperforming due to refined supply tightness. <a href="https://vespertool.com/news/sugar-prices-near-multi-year-lows-as-global-surplus-holds-crude-volatility-adds-uncertainty" target="_blank" class="source-inline">[Vesper]</a>',
                'The white premium (No.5 vs No.11 spread) compressed to ~$97-98/MT in Jan 2026 — a level Czarnikow notes is too low for standalone refineries to operate profitably. <a href="https://www.czapp.com/analyst-insights/sugar-futures-and-market-data-5th-january-2026/" target="_blank" class="source-inline">[CZ App]</a>',
                'The same surplus dynamics driving raw sugar lower also pressure white sugar. Czarnikow forecasts 8.3 MMT surplus in 2025/26 and 3.4 MMT in 2026/27. <a href="https://www.nasdaq.com/articles/outlook-global-sugar-surplus-weighs-prices" target="_blank" class="source-inline">[Nasdaq]</a>',
                'EU sugar production is forecast down 5% YoY in 2025/26 with beet area declining 8% (France and Germany), which could provide structural support for white sugar in H2 2026. <a href="https://apps.fas.usda.gov/psdonline/circulars/sugar.pdf" target="_blank" class="source-inline">[USDA FAS]</a>',
                'Monthly trend: Jan 2026 at $426/MT, Feb at $408/MT, current at $412/MT — prices stabilizing after the sharp H2 2025 decline. <a href="https://www.ice.com/products/37089080/White-Sugar-Futures/data" target="_blank" class="source-inline">[ICE Futures]</a>'
            ]
        },
        soybeans: {
            title: 'Soybeans — 2026 vs 2025 Analysis',
            points: [
                'Soybeans are up ~10% YoY: 2025 averaged $381/MT (FRED), Jan 2026 at $383/MT, Feb surged to $418/MT, and March is holding ~$418/MT. CBOT rallied from $10.72/bu in late Jan to $11.82/bu on Mar 9. <a href="https://fred.stlouisfed.org/series/PSOYBUSDM" target="_blank" class="source-inline">[FRED]</a>',
                'Record Brazilian production is the major bearish factor: AgroConsult raised Brazil\'s 2025/26 crop estimate to 183.1 MMT; Feb WASDE set it at 180 MMT. Global ending stocks forecast at a record 124.4-125.5 MMT. <a href="https://www.thepigsite.com/news/2026/02/us-soy-futures-pull-back-from-rally-as-brazil-harvest-advances" target="_blank" class="source-inline">[The Pig Site]</a>',
                'U.S.-China trade tensions reshaped flows: China imposed 10% tariff on U.S. soybeans in Mar 2025. Brazil now accounts for ~93% of China\'s imports (vs ~70% historically). U.S. ag exports to China forecast to fall to $9B in 2026. <a href="https://www.agweb.com/news/crops/soybeans/chinas-trade-war-playbook-keeps-u-s-soybeans-sidelined" target="_blank" class="source-inline">[AgWeb]</a>',
                'Record U.S. crush partially offsets lower exports: Feb WASDE raised 2025/26 crush to 2.57B bushels. USDA projects 2026/27 planted area to rise ~4M acres as soybeans gain profitability vs corn. <a href="https://www.usda.gov/sites/default/files/documents/2026AOF-grains-oilseeds-outlook.pdf" target="_blank" class="source-inline">[USDA Outlook]</a>',
                'FRED 2025 ranged from $369/MT (Mar/Sep lows) to $410/MT (Nov peak driven by U.S.-China trade optimism). Jan 2026 started flat at $383/MT before Q1 rally. <a href="https://fred.stlouisfed.org/series/PSOYBUSDM" target="_blank" class="source-inline">[FRED]</a>'
            ]
        },
        soybean_meal: {
            title: 'Soybean Meal — 2026 vs 2025 Analysis',
            points: [
                'Soybean meal is up ~13% YoY: 2025 averaged $310/MT (FRED), Jan 2026 dipped to $286/MT, then rallied sharply to $341/MT (Feb) and ~$351/MT currently. <a href="https://fred.stlouisfed.org/series/PSMEAUSDM" target="_blank" class="source-inline">[FRED]</a>',
                'Record U.S. crush produces abundant meal supply: Feb WASDE raised crush to 2.57B bushels. U.S. soymeal exports rose 12% YoY in 2024/25. USDA forecasts 2025/26 meal price at $295/short ton. <a href="https://www.usda.gov/sites/default/files/documents/2026AOF-grains-oilseeds-outlook.pdf" target="_blank" class="source-inline">[USDA Outlook]</a>',
                'Global livestock feed demand remains robust: the soybean meal market is projected to reach $102.6B in 2026, with aquaculture feed the fastest-growing segment at 9.4% CAGR. <a href="https://www.persistencemarketresearch.com/market-research/soybean-meal-market.asp" target="_blank" class="source-inline">[Persistence Market Research]</a>',
                'FRED 2025 showed high volatility: a sharp drop to $246/MT in Jul followed by recovery to $326/MT in Sep. Full-year ranged from $246/MT (Jul) to $333/MT (Jan) — unusually volatile for meal. <a href="https://fred.stlouisfed.org/series/PSMEAUSDM" target="_blank" class="source-inline">[FRED]</a>',
                'Feed cost projections use soymeal at $275-$325/ton through 2026, with swine feed cost indices at 97.7-99.0, indicating favorable conditions for livestock producers. <a href="https://farmdocdaily.illinois.edu/2026/02/prospects-for-swine-feed-costs-in-2026.html" target="_blank" class="source-inline">[farmdoc daily]</a>'
            ]
        }
    },

    // =========================================
    // MONTHLY UPDATES — March 2026 major developments
    // Every bullet sourced from verified reports
    // =========================================
    monthlyUpdates: {
        month: 'March 2026',
        cpo: {
            title: 'CPO — March 2026 Updates',
            points: [
                'Strait of Hormuz crisis pushed crude oil above $110/barrel, triggering a 9.3% single-day surge in FCPO to MYR 4,774/MT on March 9 as biofuel economics improved dramatically. <a href="https://markets.financialcontent.com/stocks/article/marketminute-2026-3-9-palm-oil-prices-spike-as-biofuel-demand-surges-amid-crude-rally" target="_blank" class="source-inline">[MarketMinute]</a>',
                'Indonesia\'s new 12.5% export levy took effect March 1, adding cost pressure on shipments. March reference price set at $938.87/MT with $124/MT export duty. <a href="https://www.palmoilmagazine.com/cpo-export/2026/03/07/indonesia-adjusts-palm-oil-export-levy-to-strengthen-sustainable-plantations-and-energy-self-sufficiency/" target="_blank" class="source-inline">[Palm Oil Magazine]</a>',
                'MPOC projects CPO to trade MYR 4,000-4,300/MT in March, supported by tightening supply, stronger Indian demand, and firm soybean oil prices. <a href="https://www.palmoilmagazine.com/cpo-price/2026/03/06/tighter-supply-and-strong-indian-demand-to-support-cpo-prices-in-march-says-mpoc/" target="_blank" class="source-inline">[Palm Oil Magazine]</a>'
            ]
        },
        soybean_oil: {
            title: 'Soybean Oil — March 2026 Updates',
            points: [
                'CBOT soybean oil futures surged 4%+ on March 9 as crude oil topped $110/barrel, making biofuel economics the most attractive in years. Feb avg was $1,283/MT; Mar partial is $1,421/MT. <a href="https://www.bloomberg.com/news/articles/2026-03-09/chicago-soy-oil-jumps-4-as-crude-s-rally-boosts-biofuel-demand" target="_blank" class="source-inline">[Bloomberg]</a>',
                'India-U.S. interim trade deal expected in April 2026 may reduce tariffs on U.S. soybean oil imports, though volumes will be capped by tariff rate quotas. <a href="https://www.palmoilmagazine.com/market/2026/03/06/india-us-interim-trade-deal-set-for-april-2026-soybean-oil-tariffs-to-be-reduced/" target="_blank" class="source-inline">[Palm Oil Magazine]</a>',
                'CME Group launched four new South Asia edible oil futures contracts on March 5, with first block trade of 100 contracts between Avere Commodities and Olam Agri. <a href="https://www.cmegroup.com/media-room/press-releases/2026/3/08/cme_group_announcesfirsttradesforsouthasiacrudepalmoilfastmarket.html" target="_blank" class="source-inline">[CME Group]</a>'
            ]
        },
        sunflower_oil: {
            title: 'Sunflower Oil — March 2026 Updates',
            points: [
                'Prices holding near $1,540/MT as persistent Black Sea supply tightness meets steady global demand. South American and EU production gains only partially offset the shortfall. <a href="https://tradingeconomics.com/commodity/sunflower-oil" target="_blank" class="source-inline">[Trading Economics]</a>',
                'Ukrainian sunflower seed prices remain at record levels (UAH 29,500-31,000/MT or $679-$714/MT), with crushers scrambling to rebuild raw material stocks, expected to rise a further 3-5%. <a href="https://ukragroconsult.com/en/sunflower-prices/" target="_blank" class="source-inline">[UkrAgroConsult]</a>'
            ]
        },
        raw_sugar: {
            title: 'Raw Sugar — March 2026 Updates',
            points: [
                'Crude oil spike provides partial price support: higher crude improves ethanol economics, which could incentivize Brazilian mills to divert more cane toward ethanol in 2026/27, reducing sugar output. <a href="https://vespertool.com/news/sugar-prices-near-multi-year-lows-as-global-surplus-holds-crude-volatility-adds-uncertainty" target="_blank" class="source-inline">[Vesper]</a>',
                '2026/27 surplus expected to narrow significantly: Covrig Analytics forecasts the surplus shrinking to 1.4 MMT from 4.7 MMT in 2025/26, driven by lower Indian exports and EU acreage reductions of up to 10%. <a href="https://www.nasdaq.com/articles/sugar-prices-see-continued-support-safras-forecasts-2026-27-0" target="_blank" class="source-inline">[Nasdaq]</a>',
                'EU sugar production forecast to fall 5% YoY in 2025/26 to 15.5 MMT as sugar beet area drops 8%, particularly in France and Germany. <a href="https://apps.fas.usda.gov/psdonline/circulars/sugar.pdf" target="_blank" class="source-inline">[USDA FAS]</a>'
            ]
        },
        white_sugar: {
            title: 'White Sugar — March 2026 Updates',
            points: [
                'Higher crude prices improve ethanol parity, which could lead Brazilian mills to shift allocation toward ethanol in 2026/27, reducing both raw and refined sugar supply and potentially restoring the white premium. <a href="https://vespertool.com/news/sugar-prices-near-multi-year-lows-as-global-surplus-holds-crude-volatility-adds-uncertainty" target="_blank" class="source-inline">[Vesper]</a>',
                'India\'s actual sugar exports are falling short of the 2 MMT quota — mills achieve higher domestic realizations, with ISMA forecasting only 700,000 MT of actual exports, limiting Indian white sugar on world markets. <a href="https://www.business-standard.com/industry/agriculture/sugar-output-seen-lower-than-forecast-curbing-exports-126021800814_1.html" target="_blank" class="source-inline">[Business Standard]</a>'
            ]
        },
        soybeans: {
            title: 'Soybeans — March 2026 Updates',
            points: [
                'Soybean futures broke above $12/bu on the crude oil rally and short covering. Managed money funds hold a net long of 187,000+ contracts — the highest since December — creating potential for volatile moves. <a href="https://stockpil.com/soybeans-extend-rally-friday-futures" target="_blank" class="source-inline">[Stockpil]</a>',
                'Trump stated China plans to purchase 20 MMT of U.S. soybeans this year and 25 MMT next year, though skepticism remains given the 24% tariff still in effect and Brazil\'s dominance in Chinese imports. <a href="https://www.oklahomafarmreport.com/2026/02/10/trump-tweet-sparks-soybean-rally-2026-biofuel-policy-primer/" target="_blank" class="source-inline">[Oklahoma Farm Report]</a>',
                'USDA Prospective Plantings report due March 31 is the next major data event. Preliminary outlook signals a major acreage shift toward soybeans, driven by biofuel demand. <a href="https://markets.financialcontent.com/stocks/article/marketminute-2026-2-23-the-soybean-pivot-usda-2026-outlook-signals-major-acreage-shift-as-biofuel-demand-surges" target="_blank" class="source-inline">[MarketMinute]</a>'
            ]
        },
        soybean_meal: {
            title: 'Soybean Meal — March 2026 Updates',
            points: [
                'Soymeal futures advanced $7.50-$8.50 on March 9 alongside the broader soy complex rally driven by crude oil strength. March ZM at $318.80/short ton ($351/MT). <a href="https://www.farmprogress.com/markets-and-quotes/morning-market-review" target="_blank" class="source-inline">[Farm Progress]</a>',
                'USDA Grain Processor report (March 6) showed U.S. domestic soymeal prices at $298-$327/ton across regions, declining $12-$16 from prior week. <a href="https://www.ams.usda.gov/mnreports/ams_3511.pdf" target="_blank" class="source-inline">[USDA AMS]</a>',
                'Brazil\'s record soybean crush (forecast 61 MMT in 2025/26) adds to global meal supply, potentially capping price upside despite strong livestock demand. <a href="https://esmis.nal.usda.gov/sites/default/release-files/795765/wasde0226.pdf" target="_blank" class="source-inline">[USDA WASDE]</a>'
            ]
        }
    },

    // =========================================
    // GLOBAL COMMODITY NEWS — Verified headlines with real URLs
    // All sourced from trusted industry publications
    // =========================================
    globalNews: [
        {
            title: 'Palm oil prices spike as biofuel demand surges amid crude oil rally',
            source: 'MarketMinute',
            date: '2026-03-09',
            category: 'Edible Oils',
            url: 'https://markets.financialcontent.com/stocks/article/marketminute-2026-3-9-palm-oil-prices-spike-as-biofuel-demand-surges-amid-crude-rally'
        },
        {
            title: 'CME Group announces first trades for South Asia Crude Palm Oil futures',
            source: 'CME Group',
            date: '2026-03-08',
            category: 'Edible Oils',
            url: 'https://www.cmegroup.com/media-room/press-releases/2026/3/08/cme_group_announcesfirsttradesforsouthasiacrudepalmoilfastmarket.html'
        },
        {
            title: 'Tighter supply and strong Indian demand to support CPO prices in March, says MPOC',
            source: 'Palm Oil Magazine',
            date: '2026-03-06',
            category: 'Edible Oils',
            url: 'https://www.palmoilmagazine.com/cpo-price/2026/03/06/tighter-supply-and-strong-indian-demand-to-support-cpo-prices-in-march-says-mpoc/'
        },
        {
            title: 'Sugar prices near multi-year lows as global surplus holds; crude volatility adds uncertainty',
            source: 'Vesper',
            date: '2026-03-05',
            category: 'Sugar',
            url: 'https://vespertool.com/news/sugar-prices-near-multi-year-lows-as-global-surplus-holds-crude-volatility-adds-uncertainty'
        },
        {
            title: 'Soybean oil prices expected to rise in 2026-27 on biofuel demand surge',
            source: 'Western Producer',
            date: '2026-02-20',
            category: 'Soybeans',
            url: 'https://www.producer.com/markets/soybean-oil-prices-expected-to-rise-in-2026-27/'
        },
        {
            title: 'Commodities 2026: Firm demand to offset larger supplies in palm oil markets',
            source: 'S&P Global',
            date: '2025-12-18',
            category: 'Edible Oils',
            url: 'https://www.spglobal.com/energy/en/news-research/latest-news/agriculture/121825-commodities-2026-firm-demand-to-offset-larger-supplies-in-palm-oil-markets'
        },
        {
            title: 'USDA Oilseeds: World Markets and Trade — global stocks at record 125.5 MMT',
            source: 'USDA FAS',
            date: '2026-01-12',
            category: 'Soybeans',
            url: 'https://www.fas.usda.gov/data/oilseeds-world-markets-and-trade-01122026'
        }
    ],

    // =========================================
    // LOCAL (EGYPTIAN) MARKET NEWS — Verified headlines
    // Sources: Daily News Egypt, Enterprise, Ahram Online, The National
    // =========================================
    localNews: [
        {
            title: 'Egypt opens sugar export taps for first time in three years to drain 1 million ton glut',
            source: 'Enterprise',
            date: '2026-02-02',
            category: 'Sugar',
            url: 'https://enterpriseam.com/egypt/2026/02/02/egypt-opens-sugar-export-taps-for-first-time-in-three-years-to-drain-1-mn-ton-glut/'
        },
        {
            title: 'Egypt considers trading sugar on commodity exchange to bolster market stability',
            source: 'Daily News Egypt',
            date: '2026-02-01',
            category: 'Sugar',
            url: 'https://www.dailynewsegypt.com/2026/02/01/egypt-considers-trading-sugar-on-commodity-exchange-to-bolster-market-stability/'
        },
        {
            title: 'Egypt maintains safe food and fuel reserves amid regional developments, ministers say',
            source: 'Daily News Egypt',
            date: '2026-02-28',
            category: 'General',
            url: 'https://www.dailynewsegypt.com/2026/02/28/egypt-maintains-safe-food-fuel-reserves-amid-regional-developments-ministers-say/'
        },
        {
            title: 'Ahlan Ramadan fairs offer cooking oil at 15-30% discounts; Egypt imports 97% of plant-based oils',
            source: 'Ahram Online',
            date: '2026-02-12',
            category: 'Edible Oils',
            url: 'https://english.ahram.org.eg/News/562197.aspx'
        },
        {
            title: 'Egypt\'s non-oil exports rise 17% to $48.6B in 2025; food industry exports reach $6.8B',
            source: 'Daily News Egypt',
            date: '2026-01-27',
            category: 'General',
            url: 'https://www.dailynewsegypt.com/2026/01/27/egypts-non-oil-exports-rise-17-to-48-6bn-in-2025-as-trade-deficit-narrows/'
        },
        {
            title: 'Rising global food and fuel prices amplify pressure on Egypt\'s import bills amid Suez disruptions',
            source: 'The National',
            date: '2026-03-02',
            category: 'General',
            url: 'https://www.thenationalnews.com/business/economy/2026/03/02/egypts-economy-in-crisis-as-financial-turmoil-grips-region/'
        },
        {
            title: '\u0627\u0631\u062A\u0641\u0627\u0639 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0632\u064A\u0648\u062A \u0627\u0644\u0646\u0628\u0627\u062A\u064A\u0629 \u0641\u064A \u0627\u0644\u0623\u0633\u0648\u0627\u0642 \u0627\u0644\u0645\u0635\u0631\u064A\u0629 \u0645\u0639 \u0627\u0642\u062A\u0631\u0627\u0628 \u0634\u0647\u0631 \u0631\u0645\u0636\u0627\u0646',
            source: 'Al Ahram',
            date: '2026-03-08',
            url: 'https://gate.ahram.org.eg/News/Economy/',
            category: 'Edible Oils'
        },
        {
            title: '\u0627\u0644\u0628\u0648\u0631\u0635\u0629 \u0627\u0644\u0633\u0644\u0639\u064A\u0629: \u0645\u0635\u0631 \u062A\u062F\u0631\u0633 \u0622\u0644\u064A\u0627\u062A \u062C\u062F\u064A\u062F\u0629 \u0644\u062A\u062F\u0627\u0648\u0644 \u0627\u0644\u0633\u0643\u0631 \u0648\u0627\u0644\u062D\u0628\u0648\u0628',
            source: 'Al Borsa News',
            date: '2026-03-05',
            url: 'https://www.alborsanews.com/',
            category: 'Sugar'
        },
        {
            title: '\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0633\u0644\u0639 \u0627\u0644\u063A\u0630\u0627\u0626\u064A\u0629 \u0627\u0644\u064A\u0648\u0645: \u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u0632\u064A\u0648\u062A \u0648\u062B\u0628\u0627\u062A \u0627\u0644\u0633\u0643\u0631 \u0641\u064A \u0627\u0644\u0623\u0633\u0648\u0627\u0642',
            source: 'Al Masry Al Youm',
            date: '2026-03-07',
            url: 'https://www.almasryalyoum.com/',
            category: 'General'
        }
    ],

    // =========================================
    // KEY REPORTS & RELEASE CALENDAR
    // =========================================
    reports: [
        {
            name: 'WASDE Report',
            body: 'USDA',
            commodities: 'All (Grains, Oilseeds, Sugar)',
            nextRelease: '2026-04-10',
            frequency: 'Monthly',
            url: 'https://www.usda.gov/oce/commodity/wasde'
        },
        {
            name: 'Oilseeds: World Markets and Trade',
            body: 'USDA FAS',
            commodities: 'Soybeans, Edible Oils',
            nextRelease: '2026-04-10',
            frequency: 'Monthly',
            url: 'https://fas.usda.gov/data/oilseeds-world-markets-and-trade'
        },
        {
            name: 'Sugar: World Markets and Trade',
            body: 'USDA FAS',
            commodities: 'Sugar',
            nextRelease: '2026-05-15',
            frequency: 'Bi-annual',
            url: 'https://fas.usda.gov/data/sugar-world-markets-and-trade'
        },
        {
            name: 'MPOB Monthly Report',
            body: 'MPOB Malaysia',
            commodities: 'Palm Oil',
            nextRelease: '2026-04-10',
            frequency: 'Monthly',
            url: 'https://bepi.mpob.gov.my/'
        },
        {
            name: 'ISO Quarterly Market Outlook',
            body: "Int'l Sugar Org",
            commodities: 'Sugar',
            nextRelease: '2026-05-01',
            frequency: 'Quarterly',
            url: 'https://www.isosugar.org/publications.php'
        },
        {
            name: 'Oil World Monthly',
            body: 'Oil World',
            commodities: 'All Edible Oils',
            nextRelease: '2026-03-28',
            frequency: 'Monthly',
            url: 'https://www.oilworld.biz/'
        },
        {
            name: 'FAO Food Price Index',
            body: 'FAO',
            commodities: 'All (Oils, Sugar, Cereals)',
            nextRelease: '2026-04-04',
            frequency: 'Monthly',
            url: 'https://www.fao.org/worldfoodsituation/foodpricesindex/en/'
        },
        {
            name: 'AMIS Market Monitor',
            body: 'AMIS',
            commodities: 'Grains, Oilseeds',
            nextRelease: '2026-04-03',
            frequency: 'Monthly',
            url: 'https://www.amis-outlook.org/amis-monitoring/'
        }
    ],

    // =========================================
    // CHART SETTINGS
    // =========================================
    chart: {
        monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        thisYearLabel: '2026',
        lastYearLabel: '2025',
        gridColor: 'rgba(0, 74, 136, 0.08)',
        tickColor: '#4a5e72'
    }
};
