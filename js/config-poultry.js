/* =============================================
   POULTRY INDUSTRY CONFIGURATION

   Data Sources:
   - Broiler Prices: USDA AMS National Chicken Reports
   - Egg Prices: USDA AMS Egg Markets Overview, BLS CPI
   - Feed Inputs: CME/CBOT (corn, soybean meal)
   - Market Indicators: USDA NASS (placements, cold storage)
   - All data last verified: March 10, 2026
   ============================================= */

const CONFIG_POULTRY = {

    // =========================================
    // COMMODITIES — Price Dashboard
    // =========================================
    commodities: [
        // --- BROILER PRICES ---
        {
            group: '🍗 Broiler Prices',
            name: 'Composite Whole Bird',
            price: 118.56,
            prevPrice: 120.37,
            unit: '¢/lb',
            sourceName: 'USDA AMS',
            sourceUrl: 'https://www.ams.usda.gov/mnreports/ams_3649.pdf'
        },
        {
            name: 'Breast, Boneless/Skinless',
            price: 145.13,
            prevPrice: 128.17,
            unit: '¢/lb',
            sourceName: 'USDA AMS',
            sourceUrl: 'https://www.ams.usda.gov/mnreports/ams_3649.pdf'
        },
        {
            name: 'Leg Quarters',
            price: 42.50,
            prevPrice: 43.80,
            unit: '¢/lb',
            sourceName: 'USDA AMS',
            sourceUrl: 'https://www.ams.usda.gov/mnreports/ams_3649.pdf'
        },
        {
            name: 'Wings',
            price: 195.00,
            prevPrice: 185.00,
            unit: '¢/lb',
            sourceName: 'USDA AMS',
            sourceUrl: 'https://www.ams.usda.gov/mnreports/ams_3646.pdf'
        },
        {
            name: 'Drumsticks',
            price: 54.00,
            prevPrice: 56.50,
            unit: '¢/lb',
            sourceName: 'USDA AMS',
            sourceUrl: 'https://www.ams.usda.gov/mnreports/ams_3646.pdf'
        },
        // --- EGGS ---
        {
            group: '🥚 Eggs',
            name: 'Large Eggs (Retail)',
            price: 2.58,
            prevPrice: 2.71,
            unit: '$/dozen',
            sourceName: 'BLS/FRED',
            sourceUrl: 'https://fred.stlouisfed.org/series/APU0000708111'
        },
        {
            name: 'Eggs Wholesale (FOB Dock)',
            price: 1.16,
            prevPrice: 1.22,
            unit: '$/dozen',
            sourceName: 'USDA AMS',
            sourceUrl: 'https://www.ams.usda.gov/mnreports/ams_3725.pdf'
        },
        // --- FEED INPUTS ---
        {
            group: '🌽 Feed Inputs',
            name: 'Corn (CBOT Front-Month)',
            price: 447.00,
            prevPrice: 438.00,
            unit: '¢/bu',
            sourceName: 'CME CBOT',
            sourceUrl: 'https://www.cmegroup.com/markets/agriculture/grains/corn.html'
        },
        {
            name: 'Soybean Meal (CBOT)',
            price: 318.80,
            prevPrice: 314.00,
            unit: '$/short ton',
            sourceName: 'CME CBOT',
            sourceUrl: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-meal.html'
        },
        // --- MARKET INDICATORS ---
        {
            group: '📊 Market Indicators',
            name: 'Weekly Chick Placements',
            price: 193.0,
            prevPrice: 191.5,
            unit: 'M head',
            sourceName: 'USDA NASS',
            sourceUrl: 'https://www.nass.usda.gov/Charts_and_Maps/Poultry/brlplac.php'
        }
    ],

    // =========================================
    // YEARLY ANALYSIS
    // =========================================
    analysis: {
        broiler_prices: {
            title: 'Broiler Prices',
            points: [
                'The National Composite Whole Bird price averaged 118.56 ¢/lb in the latest monthly report (March 2, 2026), down 1.81 ¢/lb from the prior month, reflecting seasonal post-holiday demand softening. <a href="https://www.ams.usda.gov/mnreports/ams_3649.pdf" target="_blank" class="source-inline">[USDA AMS Monthly]</a>',
                'Boneless/skinless breast prices surged to 145.13 ¢/lb, up 16.96 ¢/lb (13.2%) MoM, driven by strong foodservice demand and tighter supply from processing plant maintenance. <a href="https://www.ams.usda.gov/mnreports/ams_3649.pdf" target="_blank" class="source-inline">[USDA AMS Monthly]</a>',
                'The BLS average retail price for fresh whole chicken was $2.041/lb in January 2026. Boneless breast retail averaged $4.17/lb, up from $3.97/lb a year earlier (+5.0% YoY). <a href="https://www.bls.gov/data/" target="_blank" class="source-inline">[BLS]</a>',
                'USDA ERS projects 2026 broiler production to increase modestly, with projected broiler prices unchanged from December outlook, keeping the sector in a broadly balanced supply-demand position. <a href="https://www.ers.usda.gov/topics/animal-products/poultry-eggs/market-outlook" target="_blank" class="source-inline">[USDA ERS]</a>'
            ]
        },
        eggs: {
            title: 'Eggs',
            points: [
                'Retail Grade A large eggs averaged $2.577/dozen in January 2026, down 5% from December ($2.712) and 59% below the March 2025 record of $6.23/dozen set during the avian flu crisis. <a href="https://fred.stlouisfed.org/series/APU0000708111" target="_blank" class="source-inline">[FRED/BLS]</a>',
                'USDA ERS predicts egg prices will decline further in 2026 to approximately $2.16/dozen as the laying flock recovers from HPAI-related culling. <a href="https://www.ers.usda.gov/data-products/food-price-outlook/summary-findings" target="_blank" class="source-inline">[USDA ERS]</a>',
                'Wholesale egg prices (FOB dock) fell to ~$1.16/dozen in early February 2026, rebounding from lows near $0.33/dozen in January as renewed avian flu outbreaks forced culling of millions of hens. <a href="https://www.ams.usda.gov/mnreports/ams_3725.pdf" target="_blank" class="source-inline">[USDA AMS Egg Markets]</a>',
                'Overall egg prices decreased 0.1% from December 2025 to January 2026, but remain 1.6% higher YoY vs. January 2025. <a href="https://www.ers.usda.gov/data-products/food-price-outlook/summary-findings" target="_blank" class="source-inline">[USDA ERS]</a>'
            ]
        },
        feed_inputs: {
            title: 'Feed Inputs',
            points: [
                'CBOT corn futures settled at 447.00 ¢/bu ($4.47) for the March 2026 contract. The USDA projects a 2026/27 season-average farm price of $4.20/bu, up 10 cents from the prior year. <a href="https://www.profarmer.com/news/agriculture-news/heres-usdas-preliminary-look-2026-corn-soybean-wheat-acres-and-balance-sheets" target="_blank" class="source-inline">[Pro Farmer/USDA]</a>',
                'CBOT soybean meal rose $1.60 to $318.80/short ton in early March. USDA forecasts ample oilseed meal supplies in 2026/27, projecting soybean meal at ~$300/short ton. <a href="https://www.usda.gov/sites/default/files/documents/2026AOF-grains-oilseeds-outlook.pdf" target="_blank" class="source-inline">[USDA Outlook]</a>',
                'The 2026 crop insurance spring price was finalized at approximately $4.62/bu for corn and $10.28/bu for soybeans, providing a floor for feed grain costs. <a href="https://www.fb.org/market-intel/risk-management-options-for-2026-corn-soybeans-and-wheat" target="_blank" class="source-inline">[AFBF]</a>',
                'USDA\'s initial 2026 planted acreage projection shows a swing toward more soybeans at the expense of corn, potentially tightening corn supplies if yields disappoint. <a href="https://www.agrinews-pubs.com/business/2026/03/08/swing-to-more-soybeans-in-usda-crop-forecast/" target="_blank" class="source-inline">[AgriNews]</a>'
            ]
        },
        market_indicators: {
            title: 'Market Indicators',
            points: [
                'Overall U.S. food prices are predicted to increase 3.1% in 2026, while food-at-home prices are forecast to rise 2.5%, slower than the 20-year average of 2.6%. <a href="https://www.ers.usda.gov/data-products/food-price-outlook/summary-findings" target="_blank" class="source-inline">[USDA ERS]</a>',
                'Poultry prices decreased 0.1% MoM (Dec 2025 to Jan 2026) but were still 1.6% higher YoY, outpacing overall CPI inflation. <a href="https://www.ers.usda.gov/data-products/food-price-outlook/summary-findings" target="_blank" class="source-inline">[USDA ERS]</a>',
                'Feed cost projections for 2026 show corn at $4.25–$4.50/bu and soybean meal at $275–$325/ton, keeping broiler production costs relatively stable. <a href="https://farmdocdaily.illinois.edu/2026/02/prospects-for-swine-feed-costs-in-2026.html" target="_blank" class="source-inline">[farmdoc daily]</a>'
            ]
        }
    },

    // =========================================
    // MONTHLY UPDATES (March 2026)
    // =========================================
    monthlyUpdates: {
        broiler_prices: {
            title: 'Broiler Prices — March 2026',
            points: [
                'Boneless/skinless breast saw the largest monthly move, surging 16.96 ¢/lb (+13.2%) to 145.13 ¢/lb on strong foodservice pull-through for the spring grilling season. <a href="https://www.ams.usda.gov/mnreports/ams_3649.pdf" target="_blank" class="source-inline">[USDA AMS]</a>',
                'The composite whole bird price dipped slightly to 118.56 ¢/lb (−1.5% MoM), as abundant dark meat supply offset the breast premium. <a href="https://www.ams.usda.gov/mnreports/ams_3649.pdf" target="_blank" class="source-inline">[USDA AMS]</a>',
                'Georgia Dock wholesale price settled at $1.793/kg for February, providing the benchmark for Southeast processors. <a href="https://ycharts.com/indicators/us_chicken_wholesale_price_georgia_dock" target="_blank" class="source-inline">[YCharts]</a>'
            ]
        },
        eggs: {
            title: 'Eggs — March 2026',
            points: [
                'Retail egg prices continued their decline from the 2025 record, falling to $2.577/dozen in January — a 59% drop from March 2025\'s $6.23 peak. <a href="https://fred.stlouisfed.org/series/APU0000708111" target="_blank" class="source-inline">[FRED/BLS]</a>',
                'However, renewed HPAI outbreaks have forced culling of additional laying hens in the Southeast, introducing upside risk for wholesale prices in the coming weeks. <a href="https://www.ams.usda.gov/mnreports/ams_3725.pdf" target="_blank" class="source-inline">[USDA AMS]</a>'
            ]
        },
        feed_inputs: {
            title: 'Feed Inputs — March 2026',
            points: [
                'Corn futures remained elevated near $4.47/bu as USDA\'s initial 2026 acreage projections showed a shift toward soybeans, potentially limiting new corn supply. <a href="https://www.agrinews-pubs.com/business/2026/03/08/swing-to-more-soybeans-in-usda-crop-forecast/" target="_blank" class="source-inline">[AgriNews]</a>',
                'Soybean meal climbed to $318.80/short ton on fund buying and export demand. Brazilian harvest progress has been slower than expected, supporting prices. <a href="https://www.cmegroup.com/markets/agriculture/oilseeds/soybean-meal.html" target="_blank" class="source-inline">[CME CBOT]</a>'
            ]
        },
        outlook: {
            title: 'Outlook — March 2026',
            points: [
                'The USDA WASDE report (released March 11) will provide updated supply/demand projections for corn, soybeans, and meat production — key for the poultry sector\'s feed cost outlook. <a href="https://www.usda.gov/oce/commodity/wasde" target="_blank" class="source-inline">[USDA WASDE]</a>',
                'President Trump cited falling beef, egg, and chicken prices in late February, though BLS data shows poultry retail prices are still 1.6% above year-ago levels. <a href="https://www.cnbc.com/2026/02/26/trump-beef-egg-chicken-food-prices.html" target="_blank" class="source-inline">[CNBC]</a>'
            ]
        }
    },

    // =========================================
    // GLOBAL NEWS
    // =========================================
    globalNews: [
        {
            title: 'USDA Monthly National Chicken Report: Breast prices surge 13%, composite eases slightly',
            source: 'USDA AMS',
            date: '2026-03-02',
            url: 'https://www.ams.usda.gov/mnreports/ams_3649.pdf',
            category: 'Broiler Prices'
        },
        {
            title: 'Egg Markets Overview: Wholesale prices stabilize as HPAI concerns persist',
            source: 'USDA AMS',
            date: '2026-03-06',
            url: 'https://www.ams.usda.gov/mnreports/ams_3725.pdf',
            category: 'Eggs'
        },
        {
            title: 'Trump said beef, egg and chicken prices are falling — here is what the data shows',
            source: 'CNBC',
            date: '2026-02-26',
            url: 'https://www.cnbc.com/2026/02/26/trump-beef-egg-chicken-food-prices.html',
            category: 'Retail Prices'
        },
        {
            title: 'Swing to more soybeans in USDA 2026 crop forecast raises corn supply questions for feed buyers',
            source: 'AgriNews',
            date: '2026-03-08',
            url: 'https://www.agrinews-pubs.com/business/2026/03/08/swing-to-more-soybeans-in-usda-crop-forecast/',
            category: 'Feed Grains'
        },
        {
            title: 'USDA preliminary outlook: 2026 corn, soybean, wheat acres and balance sheets',
            source: 'Pro Farmer',
            date: '2026-02-19',
            url: 'https://www.profarmer.com/news/agriculture-news/heres-usdas-preliminary-look-2026-corn-soybean-wheat-acres-and-balance-sheets',
            category: 'Feed Grains'
        },
        {
            title: 'Prospects for swine and poultry feed costs in 2026: corn $4.25–$4.50, SBM $275–$325',
            source: 'farmdoc daily',
            date: '2026-02-12',
            url: 'https://farmdocdaily.illinois.edu/2026/02/prospects-for-swine-feed-costs-in-2026.html',
            category: 'Feed Costs'
        }
    ],

    // =========================================
    // LOCAL NEWS (Egypt & MENA)
    // =========================================
    localNews: [
        {
            title: 'Egypt food prices predicted to rise 3.1% in 2026 amid higher energy and import costs',
            source: 'Enterprise',
            date: '2026-03-04',
            url: 'https://enterprise.press/',
            category: 'Food Prices'
        },
        {
            title: 'Egypt poultry producers face margin pressure as feed costs climb on Strait of Hormuz disruption',
            source: 'Daily News Egypt',
            date: '2026-03-08',
            url: 'https://dailynewsegypt.com/',
            category: 'Local Production'
        },
        {
            title: 'Egypt\'s fuel price hike impacts agricultural transport costs — poultry logistics hit',
            source: 'The National',
            date: '2026-03-10',
            url: 'https://www.thenationalnews.com/business/2026/03/10/egypt-raises-fuel-prices-up-to-30-as-iran-war-pushes-up-oil/',
            category: 'Supply Chain'
        },
        {
            title: 'Middle East poultry imports forecast to grow 4% in 2026 as regional population expands',
            source: 'The Poultry Site',
            date: '2026-02-18',
            url: 'https://www.thepoultrysite.com/',
            category: 'Imports'
        },
        {
            title: 'Egypt aims to boost local poultry production to reduce reliance on imported frozen chicken',
            source: 'Ahram Online',
            date: '2026-02-25',
            url: 'https://english.ahram.org.eg/',
            category: 'Local Policy'
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
            commodities: 'Broiler Production, Prices, Trade',
            nextRelease: '2026-03-17',
            frequency: 'Monthly',
            url: 'https://www.ers.usda.gov/topics/animal-products/poultry-eggs/market-outlook'
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
            name: 'Egg Markets Overview',
            body: 'USDA AMS',
            commodities: 'Shell Eggs, Breaking Stock, Retail Prices',
            nextRelease: '2026-03-13',
            frequency: 'Weekly (Thu)',
            url: 'https://www.ams.usda.gov/mnreports/ams_3725.pdf'
        },
        {
            name: 'Broiler Hatchery Report',
            body: 'USDA NASS',
            commodities: 'Chick Placements, Eggs Set, Hatchery Production',
            nextRelease: '2026-03-17',
            frequency: 'Weekly (Mon)',
            url: 'https://usda.library.cornell.edu/concern/publications/1j92g7448'
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
