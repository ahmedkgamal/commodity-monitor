/* =============================================
   CONFIGURATION - API Endpoints & Commodity Settings

   UPDATE THIS FILE to plug in real API keys and endpoints.
   All commodity settings, conversion factors, and data sources
   are defined here for easy maintenance.
   ============================================= */

const CONFIG = {

    // =========================================
    // API ENDPOINTS
    // To use a live API, replace the url and set enabled: true.
    // Add your API key where indicated.
    // =========================================
    apis: {
        worldBank: {
            enabled: false,
            // World Bank Commodity Prices (Pink Sheet)
            // Free, no key required. Returns monthly/annual commodity prices.
            // Docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898581
            url: 'https://api.worldbank.org/v2/country/WLD/indicator/',
            indicators: {
                soybeanOil: 'COMMODITY_SOYBEAN_OIL',   // Soybean oil, $/mt
                soybeans: 'COMMODITY_SOYBEANS',         // Soybeans, $/mt
                palmOil: 'COMMODITY_PALM_OIL',          // Palm oil, $/mt
                sugarWorld: 'COMMODITY_SUGAR_WLD',       // Sugar (world), cents/lb
            },
            format: 'json',
            perPage: 100
        },

        usdaFas: {
            enabled: false,
            // USDA Foreign Agricultural Service - PSD Online
            // Requires free API key: https://apps.fas.usda.gov/opendataweb/home
            // INSERT YOUR API KEY BELOW:
            apiKey: 'YOUR_USDA_FAS_API_KEY_HERE',
            baseUrl: 'https://apps.fas.usda.gov/OpenData/api/psd/',
            endpoints: {
                commodityData: 'commodity/',
                countryData: 'country/',
            }
        },

        commodityPricesApi: {
            enabled: false,
            // Alternative: commodities-api.com (freemium)
            // Sign up at https://commodities-api.com/ for a free key (250 req/mo)
            // INSERT YOUR API KEY BELOW:
            apiKey: 'YOUR_COMMODITIES_API_KEY_HERE',
            baseUrl: 'https://commodities-api.com/api/',
            endpoints: {
                latest: 'latest',
                timeseries: 'timeseries',
            }
        },

        tradingEconomics: {
            enabled: false,
            // Trading Economics API
            // Requires subscription. See https://tradingeconomics.com/api/
            // INSERT YOUR API KEY BELOW:
            apiKey: 'YOUR_TRADING_ECONOMICS_KEY_HERE',
            baseUrl: 'https://api.tradingeconomics.com/',
        }
    },

    // =========================================
    // COMMODITIES CONFIGURATION
    // Each commodity has its conversion factor, data source, and identifiers.
    // =========================================
    commodities: {
        cpo: {
            name: 'Crude Palm Oil (CPO)',
            shortName: 'CPO',
            type: 'Edible Oil',
            group: 'edibleOils',
            // CPO is quoted in MYR/ton on Bursa Malaysia
            originalUnit: 'MYR/ton',
            // Conversion: MYR to USD (approximate rate, update as needed)
            conversionFactor: 1.0,  // Already in per-ton, just need currency conversion
            conversionNote: 'Converted from MYR/ton using exchange rate ~4.47 MYR/USD',
            myrToUsd: 0.2237,       // 1 MYR ≈ 0.2237 USD (update regularly)
            source: {
                name: 'Bursa Malaysia / MPOB',
                url: 'https://www.mpob.gov.my/en/'
            },
            tradingEconomicsId: 'PALM-OIL',
            color: '#fb923c'
        },
        soybean_oil: {
            name: 'Soybean Oil',
            shortName: 'SBO',
            type: 'Edible Oil',
            group: 'edibleOils',
            // Soybean oil quoted in cents/lb on CBOT
            originalUnit: 'cents/lb',
            // Conversion: 1 metric ton = 2204.62 lbs; price_USD_per_MT = (cents/lb / 100) * 2204.62
            conversionFactor: 22.0462,  // multiply cents/lb by this to get USD/MT
            conversionNote: 'Converted from cents/lb: (price ÷ 100) × 2,204.62 lbs/MT',
            source: {
                name: 'CME Group (CBOT)',
                url: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-oil.html'
            },
            tradingEconomicsId: 'ZL1',
            color: '#34d399'
        },
        sunflower_oil: {
            name: 'Sunflower Oil',
            shortName: 'SFO',
            type: 'Edible Oil',
            group: 'edibleOils',
            // Sunflower oil — less liquid market, often quoted USD/MT directly
            originalUnit: 'USD/MT',
            conversionFactor: 1.0,
            conversionNote: 'Quoted directly in USD/MT (NW Europe, FOB)',
            source: {
                name: 'Oil World / Refinitiv',
                url: 'https://www.oilworld.biz/'
            },
            tradingEconomicsId: 'SUNFLOWER-OIL',
            color: '#fbbf24'
        },
        raw_sugar: {
            name: 'Raw Sugar (No. 11)',
            shortName: 'Sugar #11',
            type: 'Sugar',
            group: 'sugar',
            // Raw sugar quoted in cents/lb on ICE
            originalUnit: 'cents/lb',
            // Conversion: same as soybean oil
            conversionFactor: 22.0462,
            conversionNote: 'Converted from cents/lb: (price ÷ 100) × 2,204.62 lbs/MT',
            source: {
                name: 'ICE Futures',
                url: 'https://www.ice.com/products/23/Sugar-No-11-Futures'
            },
            tradingEconomicsId: 'SB1',
            color: '#f87171'
        },
        white_sugar: {
            name: 'White Sugar (No. 5)',
            shortName: 'Sugar #5',
            type: 'Sugar',
            group: 'sugar',
            // White sugar quoted in USD/MT on ICE London
            originalUnit: 'USD/MT',
            conversionFactor: 1.0,
            conversionNote: 'Quoted directly in USD/MT on ICE Futures Europe',
            source: {
                name: 'ICE Futures Europe',
                url: 'https://www.ice.com/products/37/White-Sugar-Futures'
            },
            tradingEconomicsId: 'QW1',
            color: '#fb923c'
        },
        soybeans: {
            name: 'Soybeans',
            shortName: 'Soybeans',
            type: 'Oilseed',
            group: 'soybeans',
            // Soybeans quoted in cents/bushel on CBOT
            originalUnit: 'cents/bushel',
            // Conversion: 1 MT ≈ 36.7437 bushels; price_USD_per_MT = (cents/bu / 100) * 36.7437
            conversionFactor: 0.3674,  // multiply cents/bu by this to get USD/MT
            conversionNote: 'Converted from cents/bushel: (price ÷ 100) × 36.7437 bu/MT',
            source: {
                name: 'CME Group (CBOT)',
                url: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean.html'
            },
            tradingEconomicsId: 'ZS1',
            color: '#4da6ff'
        },
        soybean_meal: {
            name: 'Soybean Meal',
            shortName: 'SBM',
            type: 'Feed',
            group: 'soybeans',
            // Soybean meal quoted in USD/short ton on CBOT
            originalUnit: 'USD/short ton',
            // Conversion: 1 metric ton = 1.10231 short tons
            conversionFactor: 1.10231,
            conversionNote: 'Converted from USD/short ton: price × 1.10231 short tons/MT',
            source: {
                name: 'CME Group (CBOT)',
                url: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-meal.html'
            },
            tradingEconomicsId: 'ZM1',
            color: '#22d3ee'
        }
    },

    // =========================================
    // SAMPLE DATA
    // Used when live APIs are not available.
    // Prices are already converted to USD/MT.
    // =========================================
    sampleData: {
        cpo: {
            yesterdayClose: 893.20,
            today: 901.50,
            avgThisMonth: 897.40,
            avgLastMonth: 882.10,
            avgYTD: 890.30,
            avgLastYear: 845.60,
            originalPrice: { value: 4030, unit: 'MYR/ton' },
            monthlyThisYear: [872, 885, 897, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [810, 825, 840, 852, 865, 870, 855, 845, 835, 842, 850, 860]
        },
        soybean_oil: {
            yesterdayClose: 1072.50,
            today: 1085.30,
            avgThisMonth: 1078.90,
            avgLastMonth: 1062.40,
            avgYTD: 1070.60,
            avgLastYear: 1015.20,
            originalPrice: { value: 49.25, unit: 'cents/lb' },
            monthlyThisYear: [1055, 1068, 1079, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [985, 995, 1008, 1020, 1035, 1040, 1025, 1015, 1005, 1010, 1020, 1030]
        },
        sunflower_oil: {
            yesterdayClose: 1145.00,
            today: 1152.80,
            avgThisMonth: 1148.50,
            avgLastMonth: 1130.20,
            avgYTD: 1140.10,
            avgLastYear: 1095.40,
            originalPrice: { value: 1152.80, unit: 'USD/MT' },
            monthlyThisYear: [1125, 1135, 1149, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [1060, 1070, 1085, 1095, 1110, 1115, 1100, 1090, 1080, 1088, 1095, 1105]
        },
        raw_sugar: {
            yesterdayClose: 441.60,
            today: 448.90,
            avgThisMonth: 445.20,
            avgLastMonth: 432.80,
            avgYTD: 439.50,
            avgLastYear: 475.30,
            originalPrice: { value: 20.37, unit: 'cents/lb' },
            monthlyThisYear: [430, 438, 445, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [485, 478, 470, 465, 462, 458, 468, 475, 480, 485, 490, 482]
        },
        white_sugar: {
            yesterdayClose: 535.20,
            today: 541.80,
            avgThisMonth: 538.50,
            avgLastMonth: 525.40,
            avgYTD: 532.10,
            avgLastYear: 565.80,
            originalPrice: { value: 541.80, unit: 'USD/MT' },
            monthlyThisYear: [522, 530, 539, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [575, 570, 565, 560, 555, 550, 558, 565, 570, 575, 580, 572]
        },
        soybeans: {
            yesterdayClose: 382.50,
            today: 386.20,
            avgThisMonth: 384.30,
            avgLastMonth: 378.60,
            avgYTD: 381.40,
            avgLastYear: 365.80,
            originalPrice: { value: 1050.75, unit: 'cents/bushel' },
            monthlyThisYear: [375, 380, 384, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [355, 358, 362, 365, 370, 372, 368, 365, 360, 362, 368, 372]
        },
        soybean_meal: {
            yesterdayClose: 330.40,
            today: 334.10,
            avgThisMonth: 332.20,
            avgLastMonth: 325.80,
            avgYTD: 329.00,
            avgLastYear: 348.50,
            originalPrice: { value: 303.20, unit: 'USD/short ton' },
            monthlyThisYear: [324, 328, 332, null, null, null, null, null, null, null, null, null],
            monthlyLastYear: [355, 352, 348, 345, 342, 340, 345, 350, 352, 355, 350, 348]
        }
    },

    // =========================================
    // YEARLY ANALYSIS - Key price drivers per commodity
    // =========================================
    analysis: {
        cpo: {
            title: 'Crude Palm Oil (CPO) — 2026 vs 2025 Analysis',
            points: [
                'CPO prices have risen ~5.3% YTD compared to the same period in 2025, driven by tightening supply from Indonesia and Malaysia due to El Nino-related yield declines.',
                'Indonesia\'s B40 biodiesel mandate (effective Jan 2026) has increased domestic consumption, reducing export availability and supporting global prices.',
                'India\'s import duty reduction on crude palm oil from 7.5% to 5% boosted demand from the world\'s largest edible oil importer.',
                'The Malaysian Ringgit weakness against USD has made MYR-denominated palm oil more competitive in export markets.',
                'MPOB reported January 2026 stockpiles at 1.72 million tons, down 12% from the same period last year, providing price support.'
            ]
        },
        soybean_oil: {
            title: 'Soybean Oil — 2026 vs 2025 Analysis',
            points: [
                'Soybean oil prices are up ~5.5% YTD vs 2025, supported by strong biodiesel blending demand in the US under the Renewable Fuel Standard.',
                'Argentina\'s soybean crop suffered from late-season dryness, reducing expected crush volumes and tightening global soybean oil supply.',
                'China\'s post-Lunar New Year restocking drove strong import demand in Q1 2026, pushing FOB premiums higher.',
                'The spread between soybean oil and palm oil has narrowed, making palm oil substitution less attractive for buyers.',
                'US EPA finalized higher biomass-based diesel volume obligations for 2026, structurally supporting soybean oil demand.'
            ]
        },
        sunflower_oil: {
            title: 'Sunflower Oil — 2026 vs 2025 Analysis',
            points: [
                'Sunflower oil is up ~4.1% YTD, recovering from the sharp post-2022 decline as Ukraine-Russia supply concerns have partially normalized.',
                'Ukraine\'s 2025/26 sunflower seed harvest was 13.2 million tons, down 8% from the prior year due to drought in southern regions.',
                'EU sunflower seed production was also below average, pushing European buyers toward Black Sea origin imports and tightening FOB premiums.',
                'Russia\'s export tax on sunflower oil (adjusted quarterly) remained elevated, constraining exports from the world\'s largest producer.',
                'Currency weakness in Ukraine and Russia partially offset supply tightness by making exports more price-competitive in USD terms.'
            ]
        },
        raw_sugar: {
            title: 'Raw Sugar (No. 11) — 2026 vs 2025 Analysis',
            points: [
                'Raw sugar prices are down ~7.5% YTD vs 2025, reversing last year\'s rally as Brazil\'s Center-South crop exceeded expectations.',
                'Brazil produced 42.8 million tons of sugar in the 2025/26 season, a record, as mills maximized sugar allocation over ethanol.',
                'India lifted its sugar export ban in late 2025, allowing 2 million tons of exports that weighed on global prices.',
                'Thailand\'s production recovered to 10.5 million tons after weather-related shortfalls in prior years, adding to global surplus.',
                'The Real\'s depreciation against USD made Brazilian exports more competitive, pressuring ICE No. 11 futures.'
            ]
        },
        white_sugar: {
            title: 'White Sugar (No. 5) — 2026 vs 2025 Analysis',
            points: [
                'White sugar is down ~5.9% YTD vs 2025, tracking raw sugar weakness but outperforming due to strong refining margins.',
                'The white premium (No. 5 minus No. 11) averaged ~$93/MT in Q1 2026, up from $85/MT last year, reflecting tight refined supply.',
                'Middle East and North Africa refining capacity remains constrained, keeping demand for refined sugar imports elevated.',
                'EU white sugar production was stable but domestic consumption fell slightly, leading to modest export availability.',
                'Logistics bottlenecks at key ports (Santos, Paranagua) delayed Brazilian raw sugar shipments, temporarily supporting the white premium.'
            ]
        },
        soybeans: {
            title: 'Soybeans — 2026 vs 2025 Analysis',
            points: [
                'Soybean prices are up ~4.3% YTD vs 2025, driven by strong Chinese import demand and weather concerns in South America.',
                'China imported 102 million tons of soybeans in 2025, and early 2026 booking pace suggests another record year.',
                'Argentina\'s soybean planting was delayed by La Nina-related dryness, raising concerns about the 2025/26 crop outlook.',
                'US soybean ending stocks for 2025/26 were projected at 315 million bushels by USDA, tighter than the 5-year average.',
                'The US-China trade relationship remains stable with no new tariff escalation, supporting steady trade flows.'
            ]
        },
        soybean_meal: {
            title: 'Soybean Meal — 2026 vs 2025 Analysis',
            points: [
                'Soybean meal prices are down ~5.6% YTD vs 2025, pressured by ample global supplies and weak livestock sector margins.',
                'Argentina\'s crush margins improved, leading to higher meal exports that offset tighter US supplies.',
                'EU livestock producers faced margin pressure from high feed costs, reducing soybean meal inclusion rates in feed rations.',
                'Competition from alternative protein meals (rapeseed, sunflower meal) increased as their prices declined more sharply.',
                'China\'s livestock rebuilding after ASF has stabilized, with domestic meal demand growth slowing to ~2% annually.'
            ]
        }
    },

    // =========================================
    // EGYPTIAN MARKET NEWS (Sample Data)
    // Replace with RSS feed parser or news API integration
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
