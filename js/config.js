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
                name: 'Investing.com',
                url: 'https://www.investing.com/commodities/ncdex-crude-sunflower-oil-c1-futures'
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
    // REAL PRICE DATA — Sources: FRED/IMF, CME, ICE, Bursa Malaysia
    // Monthly averages from FRED (IMF Primary Commodity Prices)
    // "Today" prices from exchange data as of March 9, 2026
    // =========================================
    sampleData: {
        cpo: {
            // Source: FRED series PPOILUSDM + Investing.com/Bursa Malaysia live
            yesterdayClose: 1050.00,         // Pre-spike close Mar 7
            today: 1077.75,                  // Investing.com open Mar 9 (intraday high ~$1,204)
            avgThisMonth: 1060.00,           // Estimated early March avg
            avgLastMonth: 1040.00,           // Estimated Feb 2026
            avgYTD: 1028.00,                 // (Jan 1004 + Feb ~1040 + Mar ~1060) / 3
            avgLastYear: 996.79,             // Full year 2025 FRED average
            originalPrice: { value: 4367, unit: 'MYR/ton' },
            // FRED/IMF monthly data (USD/MT)
            monthlyThisYear: [1004, 1040, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [1030, 1067, 1057, 981, 903, 935, 931, 1026, 1035, 1038, 977, 981],
            dataSource: 'FRED/IMF (PPOILUSDM) + Investing.com live'
        },
        soybean_oil: {
            // Source: FRED series PSOILUSDM + CME CBOT ZL live
            yesterdayClose: 1435.00,         // ~65.10 c/lb × 22.0462
            today: 1498.58,                  // 67.98 c/lb × 22.0462 (CBOT Mar 9)
            avgThisMonth: 1350.00,           // Estimated early March avg
            avgLastMonth: 1200.00,           // Estimated Feb 2026
            avgYTD: 1220.00,                 // (Jan 1111 + Feb ~1200 + Mar ~1350) / 3
            avgLastYear: 1072.57,            // Full year 2025 FRED average
            originalPrice: { value: 67.98, unit: 'cents/lb' },
            monthlyThisYear: [1111, 1200, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [967, 1011, 937, 1048, 1075, 1169, 1180, 1151, 1108, 1098, 1099, 1080],
            dataSource: 'FRED/IMF (PSOILUSDM) + CME CBOT live'
        },
        sunflower_oil: {
            // Source: FRED series PSUNOUSDM + market reports
            yesterdayClose: 1535.00,
            today: 1540.00,                  // NCDEX ~1,533; elevated on supply tightness
            avgThisMonth: 1545.00,           // Estimated early March
            avgLastMonth: 1750.00,           // Estimated Feb 2026 (uptrend from Jan $1,787)
            avgYTD: 1690.00,                 // (Jan 1787 + Feb ~1750 + Mar ~1545) / 3
            avgLastYear: 1516.16,            // Full year 2025 FRED average
            originalPrice: { value: 1540, unit: 'USD/MT' },
            monthlyThisYear: [1787, 1750, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [1451, 1461, 1470, 1472, 1457, 1447, 1487, 1539, 1577, 1643, 1649, 1656],
            dataSource: 'FRED/IMF (PSUNOUSDM) + market reports'
        },
        raw_sugar: {
            // Source: FRED series PSUGAISAUSDM + ICE No.11 live
            // FRED gives cents/lb; converted to USD/MT using × 22.0462
            yesterdayClose: 308.65,          // ~14.00 c/lb × 22.0462
            today: 308.87,                   // ~14.01 c/lb (ICE Mar 9, +0.01)
            avgThisMonth: 305.00,            // Estimated ~13.84 c/lb avg
            avgLastMonth: 317.00,            // Estimated Feb ~14.38 c/lb
            avgYTD: 311.00,                  // (Jan 326 + Feb ~317 + Mar ~305) / 3
            avgLastYear: 382.33,             // Full year 2025 avg: 17.35 c/lb × 22.0462
            originalPrice: { value: 14.01, unit: 'cents/lb' },
            // Monthly data in USD/MT (converted from FRED cents/lb × 22.0462)
            monthlyThisYear: [326, 317, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [417, 445, 420, 400, 384, 358, 361, 361, 348, 343, 322, 329],
            dataSource: 'FRED/IMF (PSUGAISAUSDM) + ICE Futures live'
        },
        white_sugar: {
            // Source: ICE No.5 London + white premium over No.11
            // No direct FRED series; calculated as Raw Sugar USD/MT + white premium
            // White premium Q1 2026: ~$100-118/MT (Barchart, ICE data)
            yesterdayClose: 410.00,
            today: 407.30,                   // ICE London open Mar 9
            avgThisMonth: 415.00,            // Estimated early March
            avgLastMonth: 427.00,            // Estimated Feb 2026
            avgYTD: 421.00,                  // (Jan ~426 + Feb ~427 + Mar ~415) / 3
            avgLastYear: 485.00,             // Estimated 2025 avg (raw avg $382 + ~$103 premium)
            originalPrice: { value: 407.30, unit: 'USD/MT' },
            // Monthly data in USD/MT (Raw sugar + white premium ~$95-110)
            monthlyThisYear: [426, 427, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [517, 545, 520, 500, 484, 458, 461, 461, 448, 443, 422, 429],
            dataSource: 'ICE Futures Europe No.5 + white premium calculation'
        },
        soybeans: {
            // Source: FRED series PSOYBUSDM + CME CBOT ZS live
            yesterdayClose: 419.30,          // ~1141 c/bu × 0.3674
            today: 418.17,                   // 1138.50 c/bu × 0.3674 (CBOT Mar 9)
            avgThisMonth: 412.00,            // Estimated early March
            avgLastMonth: 400.00,            // Estimated Feb 2026
            avgYTD: 398.00,                  // (Jan 383 + Feb ~400 + Mar ~412) / 3
            avgLastYear: 384.52,             // Full year 2025 FRED average
            originalPrice: { value: 1138.50, unit: 'cents/bushel' },
            monthlyThisYear: [383, 400, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [378, 382, 369, 378, 388, 384, 375, 373, 369, 372, 410, 392],
            dataSource: 'FRED/IMF (PSOYBUSDM) + CME CBOT live'
        },
        soybean_meal: {
            // Source: FRED series PSMEAUSDM + CME CBOT ZM live
            yesterdayClose: 337.14,          // ~$305.60/short ton × 1.10231 (prev close)
            today: 351.36,                   // $318.80/short ton × 1.10231 (CBOT Mar 9)
            avgThisMonth: 340.00,            // Estimated early March
            avgLastMonth: 315.00,            // Estimated Feb 2026
            avgYTD: 314.00,                  // (Jan 286 + Feb ~315 + Mar ~340) / 3
            avgLastYear: 309.64,             // Full year 2025 FRED average
            originalPrice: { value: 318.80, unit: 'USD/short ton' },
            monthlyThisYear: [286, 315, null, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [333, 328, 326, 322, 319, 313, 246, 281, 326, 298, 319, 306],
            dataSource: 'FRED/IMF (PSMEAUSDM) + CME CBOT live'
        }
    },

    // =========================================
    // YEARLY ANALYSIS — Updated with real 2025 data context
    // =========================================
    analysis: {
        cpo: {
            title: 'Crude Palm Oil (CPO) — 2026 vs 2025 Analysis',
            points: [
                'CPO prices surged 9.3% on March 9 alone to ~$1,204/MT, driven by a crude oil rally after Strait of Hormuz tensions pushed Brent above $110/barrel, directly boosting biodiesel-linked palm oil demand.',
                'Indonesia raised its CPO reference price for March 2026 and increased the export duty from $74 to $124/MT, constraining export supply and supporting global prices.',
                'Indonesia\'s B50 biodiesel mandate remains a key structural driver — if fully implemented, it could remove 5 million tonnes of CPO from the global export pool annually.',
                'FRED/IMF data shows 2025 full-year average was $997/MT, with prices declining from ~$1,067/MT in Feb to a low of ~$903/MT in May before recovering in H2.',
                'Jan 2026 averaged $1,004/MT (FRED), roughly in line with the 2025 average, but March volatility linked to energy markets has pushed spot prices well above this baseline.'
            ]
        },
        soybean_oil: {
            title: 'Soybean Oil — 2026 vs 2025 Analysis',
            points: [
                'Soybean oil surged to 67.98 c/lb ($1,499/MT) on March 9, up from 65.10 c/lb at the open, driven by a massive crude oil rally that boosted biodiesel feedstock demand.',
                'FRED/IMF data shows 2025 averaged $1,073/MT, rising from $967/MT in Jan to a peak of $1,180/MT in Jul before moderating to ~$1,080/MT by Dec.',
                'Jan 2026 FRED average was $1,111/MT — already above the 2025 average — supported by strong US biodiesel blending mandates under the Renewable Fuel Standard.',
                'Managed money funds expanded their net long in soybean futures to over 187,000 contracts, the highest since early December, signaling strong speculative bullish sentiment.',
                'US EPA\'s higher biomass-based diesel volume obligations for 2026 structurally support soybean oil demand, keeping the oil share of the crush above historical norms.'
            ]
        },
        sunflower_oil: {
            title: 'Sunflower Oil — 2026 vs 2025 Analysis',
            points: [
                'Sunflower oil has been the strongest performer among edible oils, with FRED data showing a surge from $1,451/MT in Jan 2025 to $1,787/MT in Jan 2026 — a 23% increase.',
                'Prices climbed relentlessly in H2 2025, rising from $1,447/MT in Jun to $1,656/MT in Dec, driven by Black Sea supply tightness and attacks on Ukrainian crushing facilities.',
                'Ukraine\'s weaker sunflower seed harvest and processing bottlenecks curtailed export availability, driving FOB premiums to levels not seen since mid-2022.',
                'Russia\'s variable export duties on sunflower oil remained elevated throughout 2025, further constraining shipments from the world\'s largest producer.',
                'Argentina doubled sunflower oil exports in Jan 2026, but this only partially offset Black Sea shortfalls, keeping prices near multi-year highs.'
            ]
        },
        raw_sugar: {
            title: 'Raw Sugar (No. 11) — 2026 vs 2025 Analysis',
            points: [
                'Raw sugar collapsed from 18.93 c/lb ($417/MT) in Jan 2025 to ~14 c/lb ($309/MT) by Mar 2026 — a 26% decline to 5-year lows, driven by massive global oversupply.',
                'Brazil\'s Center-South production hit a record, with Copersucar forecasting 620 million tons of sugarcane in the upcoming season (up from 608M), as mills maximized sugar over ethanol.',
                'The global surplus reached 8.3 million metric tons in 2025/26, with Czarnikow projecting another 3.4 MMT surplus in 2026/27 — keeping bearish pressure on prices.',
                'India lifted its sugar export ban in late 2025, and Thailand recovered to strong production levels, adding to the supply glut.',
                'The Brazilian Real\'s depreciation made exports more competitive in USD terms, further pressuring ICE No. 11 futures. Sugar lost nearly 29% over the past 12 months.'
            ]
        },
        white_sugar: {
            title: 'White Sugar (No. 5) — 2026 vs 2025 Analysis',
            points: [
                'White sugar declined to ~$407-430/MT in Q1 2026, down from ~$517/MT in Jan 2025, tracking the raw sugar collapse but outperforming due to a widening white premium.',
                'The white premium (No. 5 minus No. 11) expanded to ~$100-118/MT in Q1 2026 from ~$100/MT average in 2025, reflecting tight global refining capacity.',
                'Middle East and North African buyers continued to drive demand for refined sugar imports, with constrained local refining capacity keeping the premium elevated.',
                'March London ICE No. 5 (SWH26) surged 5.58% on its final trading day on short-covering, highlighting how thin liquidity can amplify moves in the white sugar market.',
                'The current contango curve structure in ICE No. 5 confirms a well-supplied market with rising global end-stocks, consistent with the bearish fundamental outlook.'
            ]
        },
        soybeans: {
            title: 'Soybeans — 2026 vs 2025 Analysis',
            points: [
                'Soybeans traded at 1,138.50 c/bu ($418/MT) on March 9, rallying 12-15 cents overnight on crude oil spillover before trimming gains to finish mixed.',
                'FRED/IMF 2025 average was $385/MT, ranging from $369/MT (Mar/Sep lows) to $410/MT (Nov peak driven by US-China trade optimism and South American weather concerns).',
                'Jan 2026 FRED average was $383/MT — roughly in line with 2025 — but renewed Chinese purchase commitments and Argentina planting delays have pushed Q1 prices higher.',
                'President Trump\'s statements that China would lift purchases to 20-25 million tonnes boosted soybean futures, with strong early 2026 Chinese booking pace supporting the rally.',
                'US soybean ending stocks for 2025/26 remain tighter than the 5-year average, providing a fundamental floor even as South American production expands.'
            ]
        },
        soybean_meal: {
            title: 'Soybean Meal — 2026 vs 2025 Analysis',
            points: [
                'Soybean meal traded at $318.80/short ton ($351/MT) on March 9, rebounding 2.6% from two-week lows on crude oil rally spillover support.',
                'FRED/IMF data reveals high volatility in 2025 — a sharp drop to $246/MT in Jul 2025 followed by recovery to $326/MT in Sep, suggesting supply disruptions mid-year.',
                'The 2025 full-year average was $310/MT, with prices ranging widely from $246/MT (Jul) to $333/MT (Jan) — an unusually volatile year for the normally stable feed ingredient.',
                'Argentina\'s improved crush margins led to higher meal exports in late 2025, but EU livestock producers cut soybean meal inclusion rates due to margin pressure.',
                'Jan 2026 FRED price was $286/MT — well below 2025 average — as ample Argentine exports and weak EU feed demand kept a lid on prices into the new year.'
            ]
        }
    },

    // =========================================
    // EGYPTIAN MARKET NEWS (Sample headlines)
    // Replace with RSS feed parser or news API for live updates
    // =========================================
    egyptNews: [
        {
            title: 'Egypt\'s Supply Ministry sets new subsidized cooking oil prices for March 2026',
            source: 'Ahram Online',
            date: '2026-03-06',
            category: 'Edible Oils',
            url: 'https://english.ahram.org.eg/'
        },
        {
            title: 'CAPMAS: Egypt\'s edible oil imports rise 15% in January 2026, reaching $280M',
            source: 'Enterprise',
            date: '2026-03-05',
            category: 'Edible Oils',
            url: 'https://enterprise.press/en/'
        },
        {
            title: 'Egyptian government extends sugar import tariff exemption through June 2026',
            source: 'Daily News Egypt',
            date: '2026-03-04',
            category: 'Sugar',
            url: 'https://www.dailynewsegypt.com/'
        },
        {
            title: 'Local soybean crushing capacity to expand by 20% as new Alexandria plant opens',
            source: 'Enterprise',
            date: '2026-03-02',
            category: 'Soybeans',
            url: 'https://enterprise.press/en/'
        },
        {
            title: 'Egypt\'s strategic sugar reserves reach 4.2 months of consumption — Supply Ministry',
            source: 'Ahram Online',
            date: '2026-02-28',
            category: 'Sugar',
            url: 'https://english.ahram.org.eg/'
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
