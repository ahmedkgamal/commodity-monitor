/* =============================================
   POULTRY INDUSTRY CONFIGURATION

   Data Sources:
   - Egyptian Local Prices: Arab Finance/IDSC, Al-Ard, Al Mal News
   - Feed Inputs (Egypt): Al Mal News, Al-Ard, Vetogate
   - Feed Inputs (Global): CME/CBOT (corn, soybean meal)
   - Market Indicators: USDA NASS, CAPMAS
   - All data last verified: 2026-04-07

   NOTE: Egyptian poultry prices are surging ahead of Ramadan 2026,
   driven by seasonal demand, rising feed costs, and EGP depreciation.
   ============================================= */

const CONFIG_POULTRY = {

    // =========================================
    // RED ALERTS — Critical negative developments
    // =========================================
    alerts: [
        {
            text: 'Live chicken prices surged 24% in under three weeks to EGP 110.60/kg ahead of Ramadan, with extreme regional disparities reaching EGP 190/kg in Matrouh while government deploys subsidized frozen imports at EGP 100/kg.',
            source: 'Zawya',
            url: 'https://www.zawya.com/en/economy/north-africa/poultry-prices-in-egypt-rise-ahead-of-ramadan-vutby0qn',
            date: '2026-03-09'
        },
        {
            text: 'Egypt confirmed 85 million birds infected with avian influenza as of February 2026, marking one of the country\'s most severe H5N1 outbreaks and threatening poultry supply and food security.',
            source: 'FAO / Egyptian Ministry of Health',
            url: 'https://www.fao.org/newsroom/story/Stamping-out-avian-flu-in-Egypt/en',
            date: '2026-02-04'
        },
        {
            text: 'Egyptian feed costs exploded as imported yellow corn surged EGP 1,900/ton in two weeks to EGP 14,600/ton and soybean meal jumped EGP 800/ton in a single day, driven by 12.8% EGP depreciation and Strait of Hormuz disruptions.',
            source: 'Al Mal News',
            url: 'https://almalnews.com/2102453/',
            date: '2026-03-09'
        }
    ],

    // =========================================
    // COMMODITIES — Price Dashboard
    // =========================================
    commodities: [
        // --- EGYPTIAN LOCAL POULTRY PRICES ---
        {
            group: 'Egyptian Local Prices',
            name: 'Live Chicken (White)',
            price: 101.00,
            prevPrice: 101.00,
            unit: 'EGP/kg',
            sourceName: 'Al-Masry Al-Youm',
            sourceUrl: 'https://www.almasryalyoum.com/news/details/4222294',
            dataDate: '2026-03-15',
            avgThisMonth: 110.60,
            avgLastMonth: 97.00,
            avgYTD: 98.87,
            avgLastYear: 72.50,
            avgSource: 'Arab Finance/IDSC'
        },
        {
            name: 'Live Chicken (Baladi)',
            price: 125.00,
            prevPrice: 120.00,
            unit: 'EGP/kg',
            sourceName: 'Al-Masry Al-Youm',
            sourceUrl: 'https://www.almasryalyoum.com/news/details/4222166',
            dataDate: '2026-03-15',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        {
            name: 'Frozen Chicken (Imported)',
            price: 90.00,
            prevPrice: 122.00,
            unit: 'EGP/kg',
            sourceName: 'Zawya',
            sourceUrl: 'https://www.zawya.com/en/economy/north-africa/poultry-prices-in-egypt-rise-ahead-of-ramadan-vutby0qn',
            dataDate: '2026-03-12',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        {
            name: 'Chilled Chicken (Sasso)',
            price: 108.00,
            prevPrice: 110.00,
            unit: 'EGP/kg',
            sourceName: 'Al-Masry Al-Youm',
            sourceUrl: 'https://www.almasryalyoum.com/news/details/4222166',
            dataDate: '2026-03-15',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        {
            name: 'Table Eggs (30-egg tray)',
            price: 125.00,
            prevPrice: 118.00,
            unit: 'EGP/tray',
            sourceName: 'Al-Masry Al-Youm',
            sourceUrl: 'https://www.almasryalyoum.com/news/details/4222166',
            dataDate: '2026-03-15',
            avgThisMonth: 140.50,
            avgLastMonth: 138.00,
            avgYTD: 136.17,
            avgLastYear: 107.58,
            avgSource: 'Arab Finance/IDSC'
        },
        {
            name: 'Day-Old Chick (White)',
            price: 25.00,
            prevPrice: 18.00,
            unit: 'EGP/chick',
            sourceName: 'El-Morshed',
            sourceUrl: 'https://www.elmorshdledwagn.com/prices/1',
            dataDate: '2026-03-12',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        // --- EGYPTIAN FEED INPUTS ---
        {
            group: 'Egyptian Feed Inputs',
            name: 'Yellow Corn (Imported)',
            price: 14600,
            prevPrice: 14300,
            unit: 'EGP/ton',
            sourceName: 'Al Mal News',
            sourceUrl: 'https://almalnews.com/2102453/',
            dataDate: '2026-03-10',
            avgThisMonth: 14600.00,
            avgLastMonth: 13500.00,
            avgYTD: 13700.00,
            avgLastYear: 11100.00,
            avgSource: 'Al Mal News'
        },
        {
            name: 'White Corn (Local)',
            price: 14400,
            prevPrice: 13638,
            unit: 'EGP/ton',
            sourceName: 'Al Mal News',
            sourceUrl: 'https://almalnews.com/2102453/',
            dataDate: '2026-03-09',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        {
            name: 'Soybean Meal 44% (Local)',
            price: 23500,
            prevPrice: 22700,
            unit: 'EGP/ton',
            sourceName: 'Al-Ard',
            sourceUrl: 'https://www.elaard.com/129897',
            dataDate: '2026-03-10',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        {
            name: 'Soybean Meal 46% (Imported)',
            price: 24500,
            prevPrice: 23800,
            unit: 'EGP/ton',
            sourceName: 'Al-Ard',
            sourceUrl: 'https://www.elaard.com/129897',
            dataDate: '2026-03-10',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        // --- GLOBAL FEED BENCHMARKS ---
        {
            group: 'Global Feed Benchmarks',
            name: 'Corn (CBOT Front-Month)',
            price: 450.75,
            prevPrice: 454,
            unit: '\u00A2/bu',
            sourceName: 'CME CBOT',
            sourceUrl: 'https://www.cmegroup.com/markets/agriculture/grains/corn.html',
            dataDate: '2026-04-07',
            avgThisMonth: 447.00,
            avgLastMonth: 445.00,
            avgYTD: 444.00,
            avgLastYear: 414.67,
            avgSource: 'CME CBOT'
        },
        {
            name: 'Soybean Meal (CBOT)',
            price: 311.80,
            prevPrice: 314.50,
            unit: '$/short ton',
            sourceName: 'CME CBOT',
            sourceUrl: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-meal.html',
            dataDate: '2026-03-15',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        }
    ],

    // =========================================
    // PRICE HISTORY — Monthly averages for charts
    // 2025 = full year, 2026 = Jan–Mar available
    // =========================================
    priceHistory: {
        egypt_poultry: {
            label: 'Live Chicken (White)',
            unit: 'EGP/kg',
            color: '#004A88',
            monthlyLastYear: [58, 62, 65, 68, 70, 72, 74, 76, 78, 80, 82, 85],
            monthlyThisYear: [89, 97, 110.60, null, null, null, null, null, null, null, null, null]
        },
        egypt_eggs: {
            label: 'Table Eggs (30-tray)',
            unit: 'EGP/tray',
            color: '#F58420',
            monthlyLastYear: [95, 98, 105, 110, 108, 105, 100, 102, 108, 115, 120, 125],
            monthlyThisYear: [130, 138, 140.50, null, null, null, null, null, null, null, null, null]
        },
        egypt_feed: {
            label: 'Yellow Corn (Imported)',
            unit: 'EGP/ton',
            color: '#0A7B56',
            monthlyLastYear: [9500, 9800, 10200, 10500, 10800, 11000, 11200, 11500, 11800, 12000, 12300, 12600],
            monthlyThisYear: [13000, 13500, 14600, null, null, null, null, null, null, null, null, null]
        },
        global_feed: {
            label: 'Corn (CBOT)',
            unit: '\u00A2/bu',
            color: '#DC2626',
            monthlyLastYear: [410, 405, 400, 395, 398, 405, 415, 420, 425, 430, 435, 438],
            monthlyThisYear: [440, 445, 447, null, null, null, null, null, null, null, null, null]
        }
    },

    // =========================================
    // YEARLY ANALYSIS
    // =========================================
    analysis: {
        egypt_poultry: {
            title: 'Egyptian Poultry Prices',
            points: [
                'Live white chicken prices surged to EGP 110.60/kg in March 2026, up 30% from EGP 85/kg in December 2025, driven by Ramadan demand, rising feed costs, and a 12.8% EGP depreciation over the past month. <a href="https://www.arabfinance.com/en/news/newdetails/40989" target="_blank" class="source-inline">[Arab Finance/IDSC]</a>',
                'Baladi (local breed) chicken commands a premium at EGP 122/kg farm-gate (EGP 137/kg retail), while Sasso-breed reached EGP 112/kg farm-gate (EGP 127/kg retail) as consumers shift to perceived higher-quality local breeds. <a href="https://www.elaard.com/129926" target="_blank" class="source-inline">[Al-Ard]</a>',
                'Imported frozen chicken reached EGP 128/kg on the open market, though the government is offering subsidized imports at EGP 100/kg through state consumer outlets to alleviate pre-Ramadan price pressure. <a href="https://www.zawya.com/en/economy/north-africa/poultry-prices-in-egypt-rise-ahead-of-ramadan-vutby0qn" target="_blank" class="source-inline">[Zawya]</a>',
                'Egypt aims to boost local poultry production capacity to reduce reliance on imported frozen chicken, with the Ministry of Agriculture targeting a 15% increase in domestic output by end-2027. <a href="https://english.ahram.org.eg/" target="_blank" class="source-inline">[Ahram Online]</a>'
            ]
        },
        egypt_eggs: {
            title: 'Egyptian Egg Market',
            points: [
                'Table egg prices averaged EGP 140.50/tray (30 eggs) in March 2026, relatively stable versus February but up 47% from EGP 95/tray in January 2025. <a href="https://www.arabfinance.com/en/news/newdetails/40989" target="_blank" class="source-inline">[Arab Finance/IDSC]</a>',
                'The government announced egg price stabilization at EGP 150/tray at state consumer outlets, setting a ceiling for the market ahead of Ramadan. <a href="https://en.amwalalghad.com/egypt-to-fix-egg-prices-at-egp150-per-tray/" target="_blank" class="source-inline">[Amwal Al Ghad]</a>',
                'Day-old chick prices eased to EGP 14–20/chick (white broiler) from ~EGP 25/chick in October 2025, reflecting post-peak seasonal adjustment and increased hatchery capacity. <a href="https://www.elmorshdledwagn.com/prices/1" target="_blank" class="source-inline">[El-Morshed]</a>'
            ]
        },
        egypt_feed: {
            title: 'Egyptian Feed Market',
            points: [
                'Imported yellow corn prices surged to EGP 14,600/ton in March 2026, up ~EGP 2,000/ton in just 10 days, driven by EGP depreciation and global supply disruptions from the Strait of Hormuz crisis. <a href="https://almalnews.com/2102453/" target="_blank" class="source-inline">[Al Mal News]</a>',
                'Soybean meal (44% protein) jumped to EGP 23,500/ton, rising ~EGP 2,700/ton in the first 9 days of March alone, as traders restricted supply amid geopolitical tensions. <a href="https://www.elaard.com/129897" target="_blank" class="source-inline">[Al-Ard]</a>',
                'Local white corn held at EGP 14,400/ton, slightly below imported corn, as domestic harvest winds down and stockpiles are drawn upon for the animal feed sector. <a href="https://almalnews.com/2102453/" target="_blank" class="source-inline">[Al Mal News]</a>',
                'Egypt\'s fuel price hike of 14–17% on March 10 will further raise transport costs for feed inputs from ports to farms, adding an estimated EGP 200–400/ton to delivered feed costs. <a href="https://www.thenationalnews.com/business/2026/03/10/egypt-raises-fuel-prices-up-to-30-as-iran-war-pushes-up-oil/" target="_blank" class="source-inline">[The National]</a>'
            ]
        },
        global_feed: {
            title: 'Global Feed Benchmarks',
            points: [
                'CBOT corn futures settled at 447.00 \u00A2/bu ($4.47) for the March 2026 contract. The USDA projects a 2026/27 season-average farm price of $4.20/bu, up 10 cents from the prior year. <a href="https://www.profarmer.com/news/agriculture-news/heres-usdas-preliminary-look-2026-corn-soybean-wheat-acres-and-balance-sheets" target="_blank" class="source-inline">[Pro Farmer/USDA]</a>',
                'CBOT soybean meal rose $1.60 to $318.80/short ton in early March. USDA forecasts ample oilseed meal supplies in 2026/27, projecting soybean meal at ~$300/short ton. <a href="https://www.usda.gov/sites/default/files/documents/2026AOF-grains-oilseeds-outlook.pdf" target="_blank" class="source-inline">[USDA Outlook]</a>',
                'USDA\'s initial 2026 planted acreage projection shows a swing toward more soybeans at the expense of corn, potentially tightening corn supplies if yields disappoint. <a href="https://www.agrinews-pubs.com/business/2026/03/08/swing-to-more-soybeans-in-usda-crop-forecast/" target="_blank" class="source-inline">[AgriNews]</a>',
                'Feed cost projections for 2026 show corn at $4.25\u2013$4.50/bu and soybean meal at $275\u2013$325/ton, keeping global production costs relatively stable but Egypt faces amplified pressure from currency effects. <a href="https://farmdocdaily.illinois.edu/2026/02/prospects-for-swine-feed-costs-in-2026.html" target="_blank" class="source-inline">[farmdoc daily]</a>'
            ]
        }
    },

    // =========================================
    // MONTHLY UPDATES (March 2026)
    // =========================================
    monthlyUpdates: {
        egypt_poultry: {
            title: 'Egyptian Poultry — March 2026',
            points: [
                'Live white chicken prices rose sharply from EGP 89/kg in mid-February to EGP 110.60/kg by March 10, a 24% jump driven by Ramadan pre-stocking and rising input costs. <a href="https://www.arabfinance.com/en/news/newdetails/40989" target="_blank" class="source-inline">[Arab Finance]</a>',
                'The government is deploying subsidized frozen chicken at EGP 100/kg through state outlets and has signaled potential price intervention if open-market prices continue to rise. <a href="https://www.zawya.com/en/economy/north-africa/poultry-prices-in-egypt-rise-ahead-of-ramadan-vutby0qn" target="_blank" class="source-inline">[Zawya]</a>',
                'Regional price variation remains extreme: New Valley at EGP 83/kg while Matrouh exceeds EGP 190/kg, reflecting supply-chain bottlenecks and transport cost disparities. <a href="https://www.elaard.com/129926" target="_blank" class="source-inline">[Al-Ard]</a>'
            ]
        },
        egypt_feed: {
            title: 'Egyptian Feed — March 2026',
            points: [
                'Yellow corn (imported) surged from EGP 12,700/ton in late February to EGP 14,600/ton by March 9, a gain of ~EGP 1,900/ton in under two weeks, as the EGP weakened 12.8% against the USD. <a href="https://almalnews.com/2102453/" target="_blank" class="source-inline">[Al Mal News]</a>',
                'Soybean meal (44%) rose by approximately EGP 800/ton on March 9 alone, reaching EGP 23,500/ton, with traders reportedly restricting supply to exploit geopolitical tensions. <a href="https://www.elaard.com/129897" target="_blank" class="source-inline">[Al-Ard]</a>',
                'Egypt\'s March 10 fuel price hike (14\u201317%) will further pressure logistics costs for feed distribution from port warehouses to farms nationwide. <a href="https://www.thenationalnews.com/business/2026/03/10/egypt-raises-fuel-prices-up-to-30-as-iran-war-pushes-up-oil/" target="_blank" class="source-inline">[The National]</a>'
            ]
        },
        global_feed: {
            title: 'Global Feed — March 2026',
            points: [
                'Corn futures remained elevated near $4.47/bu as USDA\'s initial 2026 acreage projections showed a shift toward soybeans, potentially limiting new corn supply. <a href="https://www.agrinews-pubs.com/business/2026/03/08/swing-to-more-soybeans-in-usda-crop-forecast/" target="_blank" class="source-inline">[AgriNews]</a>',
                'Soybean meal climbed to $318.80/short ton on fund buying and export demand. Brazilian harvest progress has been slower than expected, supporting prices. <a href="https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-meal.html" target="_blank" class="source-inline">[CME CBOT]</a>'
            ]
        },
        outlook: {
            title: 'Outlook — March 2026',
            points: [
                'Egyptian poultry prices are expected to remain elevated through Ramadan (beginning March 1), with gradual easing anticipated post-holiday as seasonal demand normalizes. <a href="https://www.zawya.com/en/economy/north-africa/poultry-prices-in-egypt-rise-ahead-of-ramadan-vutby0qn" target="_blank" class="source-inline">[Zawya]</a>',
                'The USDA WASDE report (released March 11) will provide updated supply/demand projections for corn, soybeans, and meat production \u2014 key for the global feed cost outlook. <a href="https://www.usda.gov/oce/commodity/wasde" target="_blank" class="source-inline">[USDA WASDE]</a>',
                'Further EGP depreciation remains the primary upside risk for Egyptian feed and poultry prices, with USD/EGP having reached 52.79 on March 9. <a href="https://www.arabfinance.com/en/news/newdetails/40989" target="_blank" class="source-inline">[Arab Finance]</a>'
            ]
        }
    },

    // =========================================
    // GLOBAL NEWS
    // =========================================
    globalNews: [
        {
            title: 'Poultry prices in Egypt rise ahead of Ramadan amid feed cost surge and EGP depreciation',
            source: 'Zawya',
            date: '2026-03-09',
            url: 'https://www.zawya.com/en/economy/north-africa/poultry-prices-in-egypt-rise-ahead-of-ramadan-vutby0qn',
            category: 'Egyptian Prices'
        },
        {
            title: 'Egypt poultry & egg prices on March 10: White chicken at EGP 110.60/kg, eggs at EGP 140.50/tray',
            source: 'Arab Finance',
            date: '2026-03-10',
            url: 'https://www.arabfinance.com/en/news/newdetails/40989',
            category: 'Egyptian Prices'
        },
        {
            title: 'Egypt feed raw material prices surge: corn up EGP 500/ton, soybean meal up EGP 800/ton in one day',
            source: 'Al Mal News',
            date: '2026-03-09',
            url: 'https://almalnews.com/2102453/',
            category: 'Feed Costs'
        },
        {
            title: 'Swing to more soybeans in USDA 2026 crop forecast raises corn supply questions for feed buyers',
            source: 'AgriNews',
            date: '2026-03-08',
            url: 'https://www.agrinews-pubs.com/business/2026/03/08/swing-to-more-soybeans-in-usda-crop-forecast/',
            category: 'Feed Grains'
        },
        {
            title: 'CBOT corn and soybean meal ease from Ramadan highs as WASDE shows ample global stocks',
            source: 'CME CBOT',
            date: '2026-03-11',
            url: 'https://www.cmegroup.com/markets/agriculture/grains/corn.html',
            category: 'Feed Grains'
        },
        {
            title: 'أسعار الفراخ البيضاء والساسو وكرتونة البيض اليوم الأحد 15 مارس 2026 في بورصة الدواجن',
            source: 'Al-Masry Al-Youm',
            date: '2026-03-15',
            url: 'https://www.almasryalyoum.com/news/details/4222166',
            category: 'Egyptian Prices'
        }
    ],

    // =========================================
    // LOCAL NEWS (Egypt & MENA)
    // =========================================
    localNews: [
        {
            title: 'Egypt to fix egg prices at EGP 150/tray at government outlets ahead of Ramadan',
            source: 'Amwal Al Ghad',
            date: '2026-03-08',
            url: 'https://en.amwalalghad.com/egypt-to-fix-egg-prices-at-egp150-per-tray/',
            category: 'Government Policy'
        },
        {
            title: 'Egypt poultry producers face margin pressure as feed costs climb on Strait of Hormuz disruption',
            source: 'Daily News Egypt',
            date: '2026-03-08',
            url: 'https://dailynewsegypt.com/',
            category: 'Local Production'
        },
        {
            title: 'Egypt\'s fuel price hike impacts agricultural transport costs \u2014 poultry logistics hit',
            source: 'The National',
            date: '2026-03-10',
            url: 'https://www.thenationalnews.com/business/2026/03/10/egypt-raises-fuel-prices-up-to-30-as-iran-war-pushes-up-oil/',
            category: 'Supply Chain'
        },
        {
            title: 'Egypt food prices predicted to rise 3.1% in 2026 amid higher energy and import costs',
            source: 'Enterprise',
            date: '2026-03-04',
            url: 'https://enterprise.press/',
            category: 'Food Prices'
        },
        {
            title: 'أسعار الدواجن والبيض اليوم الأحد 15 مارس 2026: الفراخ البيضاء 101 جنيه والبيض الأبيض 125 جنيه',
            source: 'Al-Masry Al-Youm',
            date: '2026-03-15',
            url: 'https://www.almasryalyoum.com/news/details/4222294',
            category: 'Egyptian Prices'
        },
        {
            title: '\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062F\u0648\u0627\u062C\u0646 \u0648\u0627\u0644\u0628\u064A\u0636 \u0627\u0644\u064A\u0648\u0645: \u0627\u0644\u0641\u0631\u0627\u062E \u0627\u0644\u0628\u064A\u0636\u0627\u0621 \u062A\u0633\u062C\u0644 110 \u062C\u0646\u064A\u0647\u0627\u062A \u0644\u0644\u0643\u064A\u0644\u0648',
            source: 'Al Mal News',
            date: '2026-03-10',
            url: 'https://almalnews.com/',
            category: 'Egyptian Prices'
        },
        {
            title: '\u0627\u0631\u062A\u0641\u0627\u0639 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0623\u0639\u0644\u0627\u0641 \u064A\u0636\u063A\u0637 \u0639\u0644\u0649 \u0645\u0646\u062A\u062C\u064A \u0627\u0644\u062F\u0648\u0627\u062C\u0646 \u0642\u0628\u064A\u0644 \u0634\u0647\u0631 \u0631\u0645\u0636\u0627\u0646',
            source: 'Al Ahram',
            date: '2026-03-09',
            url: 'https://gate.ahram.org.eg/News/Economy/',
            category: 'Feed Costs'
        },
        {
            title: '\u0627\u0644\u062D\u0643\u0648\u0645\u0629 \u062A\u0637\u0631\u062D \u062F\u062C\u0627\u062C \u0645\u062C\u0645\u062F \u0628\u0640100 \u062C\u0646\u064A\u0647 \u0641\u064A \u0645\u0646\u0627\u0641\u0630 \u0627\u0644\u062A\u0645\u0648\u064A\u0646 \u0644\u0645\u0648\u0627\u062C\u0647\u0629 \u063A\u0644\u0627\u0621 \u0627\u0644\u0623\u0633\u0639\u0627\u0631',
            source: 'Youm7',
            date: '2026-03-08',
            url: 'https://www.youm7.com/',
            category: 'Government Policy'
        }
    ],

    // =========================================
    // REPORTS CALENDAR
    // =========================================
    reports: [
        {
            name: 'WASDE Report',
            body: 'USDA',
            commodities: 'Corn, Soybeans, Wheat, Meat Supply/Demand',
            nextRelease: '2026-03-11',
            frequency: 'Monthly',
            url: 'https://www.usda.gov/oce/commodity/wasde'
        },
        {
            name: 'Poultry Outlook',
            body: 'USDA ERS',
            commodities: 'Global Broiler Production, Prices, Trade',
            nextRelease: '2026-03-17',
            frequency: 'Monthly',
            url: 'https://www.ers.usda.gov/topics/animal-products/poultry-eggs/market-outlook'
        },
        {
            name: 'CAPMAS Monthly CPI Report',
            body: 'CAPMAS',
            commodities: 'Egyptian Consumer Prices incl. Poultry & Eggs',
            nextRelease: '2026-03-12',
            frequency: 'Monthly',
            url: 'https://www.capmas.gov.eg/'
        },
        {
            name: 'Egypt IDSC Daily Price Bulletin',
            body: 'IDSC',
            commodities: 'Egyptian Poultry, Eggs, and Food Prices',
            nextRelease: '2026-03-11',
            frequency: 'Daily',
            url: 'https://www.idsc.gov.eg/'
        },
        {
            name: 'Weekly National Chicken Report',
            body: 'USDA AMS',
            commodities: 'Broiler Cutout, Parts Prices',
            nextRelease: '2026-03-14',
            frequency: 'Weekly (Fri)',
            url: 'https://www.ams.usda.gov/mnreports/ams_3646.pdf'
        },
        {
            name: 'Cold Storage Report',
            body: 'USDA NASS',
            commodities: 'Frozen Poultry, Red Meat, Dairy Stocks',
            nextRelease: '2026-03-24',
            frequency: 'Monthly',
            url: 'https://www.nass.usda.gov/Surveys/Guide_to_NASS_Surveys/Cold_Storage/index.php'
        }
    ]
};
