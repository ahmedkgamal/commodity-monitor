/* =============================================
   OIL & GAS INDUSTRY CONFIGURATION

   Data Sources:
   - Crude Oil: CME/NYMEX, ICE Futures, EIA
   - Natural Gas: CME Henry Hub, ICE TTF, Platts JKM
   - NGLs: FRED/EIA Mont Belvieu spot prices
   - Market Indicators: Baker Hughes, EIA Weekly Petroleum Status
   - All data last verified: 2026-05-02

   NOTE: Oil markets are experiencing extreme volatility
   due to the Iran conflict and Strait of Hormuz disruption.
   ============================================= */

const CONFIG_OILGAS = {

    // =========================================
    // RED ALERTS — Critical negative developments
    // =========================================
    alerts: [
        {
            text: 'Strait of Hormuz effectively closed to commercial shipping after Iran threatened all vessel traffic, halting ~20 million b/d of crude oil transit and triggering the largest oil supply disruption in history.',
            source: 'Bloomberg',
            url: 'https://www.bloomberg.com/news/articles/2026-03-10/iran-war-oil-and-gas-supply-squeeze-and-strait-of-hormuz-disruption-explained',
            date: '2026-03-10'
        },
        {
            text: 'IEA convened an extraordinary meeting of member countries to discuss the largest coordinated strategic reserve release in history (300-400 million barrels) to stabilize markets after Brent spiked above $119/bbl.',
            source: 'CNBC',
            url: 'https://www.cnbc.com/2026/03/10/iea-g7-oil-iran-war-strait-hormuz.html',
            date: '2026-03-10'
        },
        {
            text: 'OPEC+ producers Saudi Arabia, Iraq, Kuwait, and UAE began involuntary production shut-ins as onshore storage filled up with no export route available through the blocked Strait of Hormuz.',
            source: 'EIA',
            url: 'https://www.eia.gov/outlooks/steo/report/global_oil.php',
            date: '2026-03-09'
        }
    ],

    // =========================================
    // COMMODITIES — Price Dashboard
    // =========================================
    commodities: [
        // --- CRUDE OIL ---
        {
            group: 'Crude Oil',
            name: 'Brent Crude',
            price: 108.17,
            prevPrice: 114.01,
            unit: '$/bbl',
            sourceName: 'ICE Futures',
            sourceUrl: 'https://www.cmegroup.com/markets/energy/crude-oil/brent-crude-oil.html',
            dataDate: '2026-05-01',
            avgThisMonth: 90.33,
            avgLastMonth: 76.00,
            avgYTD: 79.61,
            avgLastYear: 75.07,
            avgSource: 'CME/ICE'
        },
        {
            name: 'WTI Crude',
            price: 101.94,
            prevPrice: 105.07,
            unit: '$/bbl',
            sourceName: 'CME NYMEX',
            sourceUrl: 'https://www.cmegroup.com/markets/energy/crude-oil/light-sweet-crude.html',
            dataDate: '2026-05-01',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        {
            name: 'Dubai/Oman Crude',
            price: 99.14,
            prevPrice: 81.90,
            unit: '$/bbl',
            sourceName: 'DME/Platts',
            sourceUrl: 'https://www.theice.com/products/34361119/Murban-Crude-Oil-Futures',
            dataDate: '2026-03-08',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        // --- NATURAL GAS ---
        {
            group: 'Natural Gas',
            name: 'Henry Hub Nat Gas',
            price: 2.78,
            prevPrice: 2.77,
            unit: '$/MMBtu',
            sourceName: 'CME NYMEX',
            sourceUrl: 'https://www.cmegroup.com/markets/energy/natural-gas/natural-gas.html',
            dataDate: '2026-05-01',
            avgThisMonth: 2.92,
            avgLastMonth: 3.45,
            avgYTD: 4.70,
            avgLastYear: 2.74,
            avgSource: 'CME NYMEX'
        },
        {
            name: 'JKM LNG (Asia)',
            price: 15.98,
            prevPrice: 14.50,
            unit: '$/MMBtu',
            sourceName: 'ICE/Platts',
            sourceUrl: 'https://www.theice.com/products/6753653/JKM-LNG-Platts-Future',
            dataDate: '2026-03-12',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        {
            name: 'TTF Natural Gas (EU)',
            price: 49.69,
            prevPrice: 50.90,
            unit: '\u20AC/MWh',
            sourceName: 'ICE Endex',
            sourceUrl: 'https://www.investing.com/commodities/dutch-ttf-gas-c1-futures',
            dataDate: '2026-03-14',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        // --- REFINED PRODUCTS ---
        {
            group: 'Refined Products',
            name: 'RBOB Gasoline',
            price: 3.5952,
            prevPrice: 3.7715,
            unit: '$/gal',
            sourceName: 'CME NYMEX',
            sourceUrl: 'https://www.cmegroup.com/markets/energy/refined-products/rbob-gasoline.html',
            dataDate: '2026-05-01',
            avgThisMonth: 3.05,
            avgLastMonth: 2.72,
            avgYTD: 2.76,
            avgLastYear: 2.50,
            avgSource: 'CME NYMEX'
        },
        {
            name: '3-2-1 Crack Spread',
            price: 28.50,
            prevPrice: 22.80,
            unit: '$/bbl',
            sourceName: 'CME Group',
            sourceUrl: 'https://www.cmegroup.com/tools-information/quikstrike/crack-spread-calculator.html',
            dataDate: '2026-03-09',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        // --- NGLs ---
        {
            group: 'Natural Gas Liquids',
            name: 'Ethane (Mt Belvieu)',
            price: 0.22,
            prevPrice: 0.20,
            unit: '$/gal',
            sourceName: 'CME/OPIS',
            sourceUrl: 'https://www.cmegroup.com/markets/energy/petrochemicals/mont-belvieu-ethane-opis-5-decimals-swap.html',
            dataDate: '2026-03-09',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        {
            name: 'Propane (Mt Belvieu)',
            price: 0.745,
            prevPrice: 0.740,
            unit: '$/gal',
            sourceName: 'EIA/FRED',
            sourceUrl: 'https://fred.stlouisfed.org/series/DPROPANEMBTX',
            dataDate: '2026-03-09',
            avgThisMonth: 0.605,
            avgLastMonth: 0.58,
            avgYTD: 0.60,
            avgLastYear: 0.56,
            avgSource: 'EIA/FRED'
        },
        {
            name: 'Butane (Mt Belvieu)',
            price: 0.92,
            prevPrice: 0.87,
            unit: '$/gal',
            sourceName: 'EIA/OPIS',
            sourceUrl: 'https://www.eia.gov/dnav/pet/pet_pri_spt_s1_d.htm',
            dataDate: '2026-03-07',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        // --- MARKET INDICATORS ---
        {
            group: 'Market Indicators',
            name: 'Baker Hughes Rig Count',
            price: 553,
            prevPrice: 551,
            unit: 'rigs',
            sourceName: 'Baker Hughes',
            sourceUrl: 'https://rigcount.bakerhughes.com/',
            dataDate: '2026-03-13',
            avgThisMonth: 551,
            avgLastMonth: 550,
            avgYTD: 549.67,
            avgLastYear: 558.92,
            avgSource: 'Baker Hughes'
        },
        {
            name: 'EIA Crude Inventory',
            price: 3.824,
            prevPrice: 16.0,
            unit: 'M bbl chg',
            sourceName: 'EIA',
            sourceUrl: 'https://www.eia.gov/petroleum/supply/weekly/',
            dataDate: '2026-03-06',
            avgThisMonth: null,
            avgLastMonth: null,
            avgYTD: null,
            avgLastYear: null,
            avgSource: null
        },
        {
            name: 'VLCC Tanker Rate (ME-Asia)',
            price: 423736,
            prevPrice: 68000,
            unit: '$/day',
            sourceName: 'Platts',
            sourceUrl: 'https://www.spglobal.com/commodities/en/market-insights/topics/tanker-shipping.html',
            dataDate: '2026-03-09',
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
        crude_oil: {
            label: 'Brent Crude',
            unit: '$/bbl',
            color: '#004A88',
            monthlyLastYear: [78.50, 76.80, 73.20, 71.60, 74.80, 77.50, 80.20, 78.90, 76.50, 73.00, 70.80, 69.00],
            monthlyThisYear: [72.50, 76.00, 90.33, null, null, null, null, null, null, null, null, null]
        },
        natural_gas: {
            label: 'Henry Hub',
            unit: '$/MMBtu',
            color: '#F58420',
            monthlyLastYear: [3.10, 2.80, 2.50, 2.20, 2.10, 2.40, 2.80, 2.70, 2.50, 2.90, 3.30, 3.60],
            monthlyThisYear: [7.72, 3.45, 2.92, null, null, null, null, null, null, null, null, null]
        },
        refined_products: {
            label: 'RBOB Gasoline',
            unit: '$/gal',
            color: '#DC2626',
            monthlyLastYear: [2.20, 2.35, 2.60, 2.75, 2.80, 2.85, 2.70, 2.65, 2.45, 2.30, 2.20, 2.15],
            monthlyThisYear: [2.50, 2.72, 3.05, null, null, null, null, null, null, null, null, null]
        },
        ngls: {
            label: 'Propane (Mt Belvieu)',
            unit: '$/gal',
            color: '#0A7B56',
            monthlyLastYear: [0.65, 0.62, 0.58, 0.55, 0.52, 0.50, 0.48, 0.50, 0.53, 0.56, 0.59, 0.62],
            monthlyThisYear: [0.60, 0.58, 0.605, null, null, null, null, null, null, null, null, null]
        },
        market_indicators: {
            label: 'Baker Hughes Rig Count',
            unit: 'rigs',
            color: '#6E6E73',
            monthlyLastYear: [576, 574, 570, 568, 564, 560, 555, 552, 550, 548, 546, 544],
            monthlyThisYear: [548, 550, 551, null, null, null, null, null, null, null, null, null]
        }
    },

    // =========================================
    // YEARLY ANALYSIS
    // =========================================
    analysis: {
        crude_oil: {
            title: 'Crude Oil',
            points: [
                'Brent crude surged 55% YTD in early March 2026 after Israeli strikes on Iranian oil depots triggered fears of a prolonged Strait of Hormuz closure, through which 20% of global oil transits. <a href="https://www.cnbc.com/2026/03/09/oil-prices-iran-war-middle-east-us-israel-strait-of-hormuz.html" target="_blank" class="source-inline">[CNBC]</a>',
                'The EIA\'s pre-conflict February 2026 STEO had forecast Brent at $58/bbl for 2026, down from $69/bbl in 2025 — a projection now rendered obsolete by the Middle East crisis. <a href="https://www.eia.gov/outlooks/steo/" target="_blank" class="source-inline">[EIA STEO]</a>',
                'U.S. crude production held at a record 13.6 million b/d in early 2026, unchanged from 2025, as efficiency gains offset lower rig activity. <a href="https://www.eia.gov/petroleum/supply/weekly/" target="_blank" class="source-inline">[EIA]</a>',
                'OPEC+ voluntary cuts of 2.2 million b/d remain in place through Q2 2026, with the group postponing planned unwinds due to market uncertainty. <a href="https://www.opec.org/opec_web/en/" target="_blank" class="source-inline">[OPEC]</a>'
            ]
        },
        natural_gas: {
            title: 'Natural Gas',
            points: [
                'Henry Hub spot prices averaged $7.72/MMBtu in January 2026 — up 81% from December — driven by a severe cold snap that boosted heating demand and drew down storage. <a href="https://fred.stlouisfed.org/series/DHHNGSP" target="_blank" class="source-inline">[FRED]</a>',
                'European TTF gas spiked 16.6% to €62.26/MWh on March 3 after Qatar\'s Ras Laffan LNG facility was shut down amid Strait of Hormuz tensions. EU storage at 39.2% remains well below the 52% year-ago level. <a href="https://www.investing.com/commodities/dutch-ttf-gas-c1-futures" target="_blank" class="source-inline">[Investing.com]</a>',
                'Asian JKM LNG prices rallied sharply as spot cargoes from the Middle East became unavailable, with Japan and South Korea scrambling for alternative U.S. Gulf Coast supplies. <a href="https://www.theice.com/products/6753653/JKM-LNG-Platts-Future" target="_blank" class="source-inline">[ICE]</a>',
                'The IEA projects global gas markets will not ease until well into 2027, when a wave of new LNG capacity — mainly from the U.S. and Qatar — is expected to increase global export capacity by nearly 50% by 2030. <a href="https://www.iea.org/commentaries/european-gas-market-volatility-puts-continued-pressure-on-competitiveness-and-cost-of-living" target="_blank" class="source-inline">[IEA]</a>'
            ]
        },
        refined_products: {
            title: 'Refined Products',
            points: [
                'RBOB gasoline futures surged to $3.05/gal for the April 2026 contract, the highest since September 2023, amid fears that the conflict could push retail gasoline above $4/gal nationally. <a href="https://www.cmegroup.com/markets/energy/refined-products/rbob-gasoline.html" target="_blank" class="source-inline">[CME]</a>',
                'The 3-2-1 crack spread widened to $28.50/bbl as refinery margins strengthened on tight product supply and surging crude costs. <a href="https://www.cmegroup.com/tools-information/quikstrike/crack-spread-calculator.html" target="_blank" class="source-inline">[CME]</a>',
                'U.S. gasoline inventories fell for the seventh consecutive week, declining 1.4 million barrels to 241.2 million barrels in the week ending February 27. <a href="https://www.eia.gov/petroleum/supply/weekly/" target="_blank" class="source-inline">[EIA]</a>'
            ]
        },
        ngls: {
            title: 'NGLs & Feedstocks',
            points: [
                'Mont Belvieu propane spot prices stood at $0.605/gal in February 2026, relatively stable as strong U.S. NGL production offset seasonal heating demand. <a href="https://fred.stlouisfed.org/series/DPROPANEMBTX" target="_blank" class="source-inline">[FRED]</a>',
                'Ethane prices remain supported near $0.22/gal as U.S. ethylene crackers ran at high utilization rates, benefiting from the wide ethane-to-naphtha cost advantage. <a href="https://www.cmegroup.com/markets/energy/petrochemicals/mont-belvieu-ethane-opis-5-decimals-swap.html" target="_blank" class="source-inline">[CME]</a>',
                'The U.S. NGL-to-crude ratio remains favorable for gas-based cracking, keeping the American petrochemical cost advantage over European and Asian naphtha-based peers. <a href="https://www.eia.gov/todayinenergy/detail.php?id=66645" target="_blank" class="source-inline">[EIA]</a>'
            ]
        },
        market_indicators: {
            title: 'Market Indicators',
            points: [
                'The Baker Hughes U.S. rig count rose by 1 to 551 in the week of March 6, the first increase in four weeks, with 411 oil rigs and 134 gas rigs active. <a href="https://rigcount.bakerhughes.com/" target="_blank" class="source-inline">[Baker Hughes]</a>',
                'EIA crude inventories fell 1.7 million barrels in the latest weekly report, after a massive 16 million barrel build the prior week — highlighting the extreme volatility in physical markets. <a href="https://www.eia.gov/petroleum/supply/weekly/" target="_blank" class="source-inline">[EIA]</a>',
                'VLCC tanker rates on the benchmark Middle East–Asia route surged to a historic Worldscale 419 (approximately $423,736/day) as tanker operators refused to transit the Strait of Hormuz. <a href="https://www.spglobal.com/commodities/en/market-insights/topics/tanker-shipping.html" target="_blank" class="source-inline">[S&P Global Platts]</a>'
            ]
        }
    },

    // =========================================
    // MONTHLY UPDATES (March 2026)
    // =========================================
    monthlyUpdates: {
        crude_oil: {
            title: 'Crude Oil — March 2026',
            points: [
                'Brent crude briefly touched $119.50/bbl on March 3 — the highest since 2022 — after Israeli airstrikes on 30 Iranian oil depots triggered Iran\'s threat to close the Strait of Hormuz. Prices have since pulled back to ~$90/bbl as diplomacy intensifies. <a href="https://www.cnbc.com/2026/03/08/crude-oil-prices-today-iran-war.html" target="_blank" class="source-inline">[CNBC]</a>',
                'WTI surged to $119.48 intraday before settling back near $88/bbl. The 52-week range for WTI now spans from $54.98 to $119.43. <a href="https://www.investing.com/commodities/crude-oil" target="_blank" class="source-inline">[Investing.com]</a>',
                'The Strait of Hormuz saw a near-total halt in tanker traffic for 48 hours on March 2-3, disrupting approximately 20% of global oil supply before partial resumption. <a href="https://www.cnn.com/2026/03/09/economy/oil-price-shock" target="_blank" class="source-inline">[CNN]</a>'
            ]
        },
        natural_gas: {
            title: 'Natural Gas — March 2026',
            points: [
                'TTF front-month spiked to €69.50/MWh intraday on March 3 before settling near €48.63, as Qatar\'s Ras Laffan LNG complex halted loadings amid Strait security concerns. <a href="https://www.investing.com/commodities/dutch-ttf-gas-c1-futures" target="_blank" class="source-inline">[Investing.com]</a>',
                'Henry Hub eased to $2.92/MMBtu from the January cold-snap peak of $7.72, but supply risks remain elevated as global LNG trade routes face disruption. <a href="https://www.cmegroup.com/markets/energy/natural-gas/natural-gas.html" target="_blank" class="source-inline">[CME]</a>',
                'EU gas storage stands at 39.2% full vs. 52% a year ago; Germany (30.2%), France (29%), and the Netherlands (23.5%) face the tightest balances. <a href="https://www.iea.org/commentaries/european-gas-market-volatility-puts-continued-pressure-on-competitiveness-and-cost-of-living" target="_blank" class="source-inline">[IEA]</a>'
            ]
        },
        refined_products: {
            title: 'Refined Products — March 2026',
            points: [
                'RBOB gasoline surged above $3.00/gal on the April contract, with analysts warning that $4/gal at the retail pump is possible if the Iran crisis persists. <a href="https://articles.stockcharts.com/article/four-dollar-gasoline-ahead-what-rbob-futures-and-oil-charts-signal-about-pain-at-pump/" target="_blank" class="source-inline">[StockCharts]</a>',
                'U.S. gasoline inventories fell for the seventh straight week, tightening the market heading into the spring driving season. <a href="https://www.eia.gov/petroleum/supply/weekly/" target="_blank" class="source-inline">[EIA]</a>'
            ]
        },
        regional: {
            title: 'Egypt & MENA — March 2026',
            points: [
                'Egypt raised fuel prices 14–17% on March 10, with 95-octane petrol now at EGP 24/litre and diesel at EGP 20.50/litre, as the Strait of Hormuz crisis pushes up import costs. <a href="https://www.thenationalnews.com/business/2026/03/10/egypt-raises-fuel-prices-up-to-30-as-iran-war-pushes-up-oil/" target="_blank" class="source-inline">[The National]</a>',
                'Mubadala Energy completed acquisition of a 15% stake in Egypt\'s Nargis Offshore concession from Eni, joining Chevron (45% operator) and Tharwa Petroleum (10%). <a href="https://www.oedigital.com/news/535950-mubadala-energy-finalizes-nargis-deal-with-eni-offshore-egypt" target="_blank" class="source-inline">[OE Digital]</a>',
                'Egypt\'s Petroleum Minister met with Chevron Cyprus to coordinate connecting the Aphrodite gas field to Egyptian infrastructure. <a href="https://egyptoil-gas.com/news/" target="_blank" class="source-inline">[Egypt Oil & Gas]</a>'
            ]
        }
    },

    // =========================================
    // GLOBAL NEWS
    // =========================================
    globalNews: [
        {
            title: 'Oil prices surge above $100 as Israel-Iran conflict triggers biggest oil disruption in history',
            source: 'CNN Business',
            date: '2026-03-09',
            url: 'https://www.cnn.com/2026/03/09/economy/oil-price-shock',
            category: 'Crude Oil'
        },
        {
            title: 'Oil prices decline after nearly hitting $120 as Trump says U.S. considering taking over Strait of Hormuz',
            source: 'CNBC',
            date: '2026-03-08',
            url: 'https://www.cnbc.com/2026/03/08/crude-oil-prices-today-iran-war.html',
            category: 'Crude Oil'
        },
        {
            title: 'Europe\'s TTF gas jumps as Qatar LNG shock tightens supply',
            source: 'TS2 Tech',
            date: '2026-03-04',
            url: 'https://ts2.tech/en/natural-gas-prices-today-europes-ttf-jumps-as-qatar-lng-shock-tightens-supply/',
            category: 'Natural Gas'
        },
        {
            title: '$4 gasoline ahead? What RBOB futures and oil charts signal about pain at the pump',
            source: 'StockCharts',
            date: '2026-03-07',
            url: 'https://articles.stockcharts.com/article/four-dollar-gasoline-ahead-what-rbob-futures-and-oil-charts-signal-about-pain-at-pump/',
            category: 'Refined Products'
        },
        {
            title: 'U.S. drillers add oil and gas rigs for first time in four weeks — Baker Hughes',
            source: 'BOE Report',
            date: '2026-03-06',
            url: 'https://boereport.com/2026/03/06/us-drillers-add-oil-gas-rigs-for-first-time-in-four-weeks-baker-hughes-says/',
            category: 'Market Indicators'
        },
        {
            title: 'U.S. drilling activity rises as Baker Hughes rig count ticks up to 553 amid oil price surge',
            source: 'FX.co',
            date: '2026-03-13',
            url: 'https://www.fx.co/en/forex-news/2935382',
            category: 'Market Indicators'
        },
        {
            title: 'European gas prices jump by as much as 45% as Qatar stops LNG production',
            source: 'Euronews',
            date: '2026-03-02',
            url: 'https://www.euronews.com/business/2026/03/02/european-gas-prices-jump-by-as-much-as-45-as-qatar-stops-lng-production',
            category: 'Natural Gas'
        }
    ],

    // =========================================
    // LOCAL NEWS (Egypt & MENA)
    // =========================================
    localNews: [
        {
            title: 'Egypt raises fuel prices up to 30% as Iran war pushes up global oil costs',
            source: 'The National',
            date: '2026-03-10',
            url: 'https://www.thenationalnews.com/business/2026/03/10/egypt-raises-fuel-prices-up-to-30-as-iran-war-pushes-up-oil/',
            category: 'Fuel Prices'
        },
        {
            title: 'Mubadala Energy finalizes Nargis offshore deal with Eni in Egypt',
            source: 'OE Digital',
            date: '2026-03-05',
            url: 'https://www.oedigital.com/news/535950-mubadala-energy-finalizes-nargis-deal-with-eni-offshore-egypt',
            category: 'Upstream'
        },
        {
            title: 'Egypt Petroleum Minister coordinates Aphrodite gas field connection with Chevron Cyprus',
            source: 'Egypt Oil & Gas',
            date: '2026-03-03',
            url: 'https://egyptoil-gas.com/news/',
            category: 'Natural Gas'
        },
        {
            title: 'EGYPES 2026: Egypt Energy Show to attract 50,000 attendees, March 30 – April 1 in Cairo',
            source: 'EGYPES',
            date: '2026-03-01',
            url: 'https://www.egypes.com/',
            category: 'Industry Events'
        },
        {
            title: 'MENA region set to become world\'s largest hydrogen exporter by 2060 — DNV report',
            source: 'Oil & Gas Middle East',
            date: '2026-02-25',
            url: 'https://www.oilandgasmiddleeast.com',
            category: 'Energy Transition'
        },
        {
            title: 'Wood Mackenzie warns oil and LNG prices "heavily risked to the upside" if Strait of Hormuz disruptions persist',
            source: 'Oil Review Middle East',
            date: '2026-03-04',
            url: 'https://oilreviewmiddleeast.com/',
            category: 'Market Analysis'
        },
        {
            title: '\u0645\u0635\u0631 \u062A\u0631\u0641\u0639 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0628\u0646\u0632\u064A\u0646 \u0648\u0627\u0644\u0633\u0648\u0644\u0627\u0631 \u0628\u0646\u0633\u0628 \u062A\u0635\u0644 \u0625\u0644\u0649 17% \u0628\u0633\u0628\u0628 \u0627\u0631\u062A\u0641\u0627\u0639 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0646\u0641\u0637 \u0639\u0627\u0644\u0645\u064A\u0627\u064B',
            source: 'Al Shorouk',
            date: '2026-03-10',
            url: 'https://www.shorouknews.com/',
            category: 'Fuel Prices'
        },
        {
            title: '\u0648\u0632\u064A\u0631 \u0627\u0644\u0628\u062A\u0631\u0648\u0644 \u064A\u0628\u062D\u062B \u062A\u0637\u0648\u064A\u0631 \u062D\u0642\u0648\u0644 \u0627\u0644\u063A\u0627\u0632 \u0627\u0644\u0637\u0628\u064A\u0639\u064A \u0645\u0639 \u0634\u0631\u0643\u0627\u062A \u062F\u0648\u0644\u064A\u0629 \u0641\u064A \u0634\u0631\u0642 \u0627\u0644\u0645\u062A\u0648\u0633\u0637',
            source: 'Al Borsa News',
            date: '2026-03-04',
            url: 'https://www.alborsanews.com/',
            category: 'Natural Gas'
        },
        {
            title: '\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0628\u062A\u0631\u0648\u0644 \u0627\u0644\u064A\u0648\u0645: \u062E\u0627\u0645 \u0628\u0631\u0646\u062A \u064A\u0633\u062C\u0644 \u0623\u0639\u0644\u0649 \u0645\u0633\u062A\u0648\u0649 \u0645\u0646\u0630 \u0623\u0643\u062A\u0648\u0628\u0631 2023',
            source: 'Youm7',
            date: '2026-03-09',
            url: 'https://www.youm7.com/',
            category: 'Crude Oil'
        }
    ],

    // =========================================
    // REPORTS CALENDAR
    // =========================================
    reports: [
        {
            name: 'Weekly Petroleum Status Report',
            body: 'EIA',
            commodities: 'Crude Oil, Gasoline, Distillates, Inventories',
            nextRelease: '2026-03-11',
            frequency: 'Weekly (Wed)',
            url: 'https://www.eia.gov/petroleum/supply/weekly/'
        },
        {
            name: 'Short-Term Energy Outlook (STEO)',
            body: 'EIA',
            commodities: 'Crude Oil, Natural Gas, Petroleum Products',
            nextRelease: '2026-04-08',
            frequency: 'Monthly',
            url: 'https://www.eia.gov/outlooks/steo/'
        },
        {
            name: 'Monthly Oil Market Report (MOMR)',
            body: 'OPEC',
            commodities: 'Crude Oil, Supply/Demand Balance',
            nextRelease: '2026-03-13',
            frequency: 'Monthly',
            url: 'https://www.opec.org/opec_web/en/publications/338.htm'
        },
        {
            name: 'Oil Market Report',
            body: 'IEA',
            commodities: 'Global Oil Supply, Demand, Inventories',
            nextRelease: '2026-03-14',
            frequency: 'Monthly',
            url: 'https://www.iea.org/topics/oil-market-report'
        },
        {
            name: 'Baker Hughes Rig Count',
            body: 'Baker Hughes',
            commodities: 'U.S. & International Rig Activity',
            nextRelease: '2026-03-14',
            frequency: 'Weekly (Fri)',
            url: 'https://rigcount.bakerhughes.com/'
        },
        {
            name: 'Petroleum Supply Monthly',
            body: 'EIA',
            commodities: 'Production, Imports, Exports, Stocks',
            nextRelease: '2026-03-28',
            frequency: 'Monthly',
            url: 'https://www.eia.gov/petroleum/supply/monthly/'
        }
    ]
};
