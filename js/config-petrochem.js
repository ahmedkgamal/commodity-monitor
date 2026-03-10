/* =============================================
   PETROCHEMICALS INDUSTRY CONFIGURATION

   Data Sources:
   - Naphtha: S&P Global Platts, ICIS
   - Olefins: ICIS, Platts, CME
   - Polymers: ChemOrbis, ICIS, Polymerupdate
   - Aromatics: ICIS, Platts
   - Other: Methanex (Methanol), ICIS (MEG)
   - All data last verified: March 10, 2026

   NOTE: Many petrochemical prices are subscription-gated.
   Prices shown are based on latest publicly available
   assessments from ICIS, Platts, and industry reports.
   ============================================= */

const CONFIG_PETROCHEM = {

    // =========================================
    // COMMODITIES — Price Dashboard
    // =========================================
    commodities: [
        // --- FEEDSTOCKS ---
        {
            group: '🧪 Feedstocks',
            name: 'Naphtha (NE Asia CFR)',
            price: 695.00,
            prevPrice: 670.00,
            unit: '$/MT',
            sourceName: 'S&P Global Platts',
            sourceUrl: 'https://www.spglobal.com/commodities/en/market-insights/topics/naphtha.html'
        },
        {
            name: 'Naphtha (NWE CIF)',
            price: 680.00,
            prevPrice: 655.00,
            unit: '$/MT',
            sourceName: 'S&P Global Platts',
            sourceUrl: 'https://www.spglobal.com/commodities/en/market-insights/topics/naphtha.html'
        },
        {
            name: 'Naphtha (ME FOB)',
            price: 665.00,
            prevPrice: 640.00,
            unit: '$/MT',
            sourceName: 'S&P Global Platts',
            sourceUrl: 'https://www.spglobal.com/commodities/en/market-insights/topics/naphtha.html'
        },
        {
            name: 'Ethane (Mt Belvieu)',
            price: 154.00,
            prevPrice: 148.00,
            unit: '$/MT',
            sourceName: 'Intratec/CME',
            sourceUrl: 'https://www.intratec.us/solutions/primary-commodity-prices/commodity/ethane-prices'
        },
        // --- OLEFINS ---
        {
            group: '⚗️ Olefins',
            name: 'Ethylene (NE Asia CFR)',
            price: 850.00,
            prevPrice: 820.00,
            unit: '$/MT',
            sourceName: 'ICIS/CME',
            sourceUrl: 'https://www.cmegroup.com/markets/energy/petrochemicals/ethylene-cfr-ne-asia-icis.html'
        },
        {
            name: 'Ethylene (NWE FD)',
            price: 1100.00,
            prevPrice: 1080.00,
            unit: '$/MT',
            sourceName: 'ICIS',
            sourceUrl: 'https://www.icis.com/explore/commodities/chemicals/ethylene/'
        },
        {
            name: 'Propylene (FE Asia CFR)',
            price: 870.00,
            prevPrice: 850.00,
            unit: '$/MT',
            sourceName: 'ICIS',
            sourceUrl: 'https://www.icis.com/explore/commodities/chemicals/propylene/'
        },
        // --- POLYMERS ---
        {
            group: '📦 Polymers',
            name: 'HDPE (SE Asia CFR)',
            price: 1010.00,
            prevPrice: 990.00,
            unit: '$/MT',
            sourceName: 'ChemOrbis',
            sourceUrl: 'https://www.chemorbis.com/'
        },
        {
            name: 'LDPE (SE Asia CFR)',
            price: 1180.00,
            prevPrice: 1160.00,
            unit: '$/MT',
            sourceName: 'ChemOrbis',
            sourceUrl: 'https://www.chemorbis.com/'
        },
        {
            name: 'LLDPE (SE Asia CFR)',
            price: 980.00,
            prevPrice: 965.00,
            unit: '$/MT',
            sourceName: 'ChemOrbis',
            sourceUrl: 'https://www.chemorbis.com/'
        },
        {
            name: 'Polypropylene (SE Asia CFR)',
            price: 1020.00,
            prevPrice: 1000.00,
            unit: '$/MT',
            sourceName: 'ChemOrbis',
            sourceUrl: 'https://www.chemorbis.com/'
        },
        // --- AROMATICS (BTX) ---
        {
            group: '🔬 Aromatics (BTX)',
            name: 'Benzene (NE Asia FOB)',
            price: 920.00,
            prevPrice: 900.00,
            unit: '$/MT',
            sourceName: 'ICIS',
            sourceUrl: 'https://www.icis.com/explore/commodities/chemicals/benzene/'
        },
        {
            name: 'Toluene (NE Asia FOB)',
            price: 780.00,
            prevPrice: 770.00,
            unit: '$/MT',
            sourceName: 'ICIS',
            sourceUrl: 'https://www.icis.com/explore/commodities/chemicals/toluene/'
        },
        {
            name: 'Xylene (NE Asia FOB)',
            price: 870.00,
            prevPrice: 855.00,
            unit: '$/MT',
            sourceName: 'ICIS',
            sourceUrl: 'https://www.icis.com/explore/commodities/chemicals/xylenes/'
        },
        // --- OTHER ---
        {
            group: '🏭 Other Chemicals',
            name: 'Butadiene (NE Asia CFR)',
            price: 1240.00,
            prevPrice: 1210.00,
            unit: '$/MT',
            sourceName: 'ICIS',
            sourceUrl: 'https://www.icis.com/explore/commodities/chemicals/butadiene/'
        },
        {
            name: 'Methanol (US Gulf)',
            price: 480.00,
            prevPrice: 465.00,
            unit: '$/MT',
            sourceName: 'Methanex',
            sourceUrl: 'https://www.methanex.com/our-business/pricing'
        },
        {
            name: 'MEG (NE Asia CFR)',
            price: 560.00,
            prevPrice: 545.00,
            unit: '$/MT',
            sourceName: 'ICIS',
            sourceUrl: 'https://www.icis.com/explore/commodities/chemicals/ethylene-glycols/'
        }
    ],

    // =========================================
    // PRICE HISTORY — Monthly averages for charts
    // 2025 = full year, 2026 = Jan–Mar available
    // =========================================
    priceHistory: {
        feedstocks: {
            label: 'Naphtha (NE Asia CFR)',
            unit: '$/MT',
            color: '#004A88',
            monthlyLastYear: [650, 640, 635, 630, 625, 630, 645, 650, 640, 635, 630, 630],
            monthlyThisYear: [655, 670, 695, null, null, null, null, null, null, null, null, null]
        },
        olefins: {
            label: 'Ethylene (NE Asia CFR)',
            unit: '$/MT',
            color: '#F58420',
            monthlyLastYear: [780, 770, 760, 750, 740, 745, 755, 770, 780, 790, 800, 810],
            monthlyThisYear: [820, 835, 850, null, null, null, null, null, null, null, null, null]
        },
        polymers: {
            label: 'HDPE (SE Asia CFR)',
            unit: '$/MT',
            color: '#0A7B56',
            monthlyLastYear: [1020, 1010, 1000, 990, 980, 975, 970, 975, 980, 985, 990, 995],
            monthlyThisYear: [990, 1000, 1010, null, null, null, null, null, null, null, null, null]
        },
        aromatics: {
            label: 'Benzene (NE Asia FOB)',
            unit: '$/MT',
            color: '#DC2626',
            monthlyLastYear: [870, 860, 855, 850, 845, 850, 860, 870, 880, 890, 895, 900],
            monthlyThisYear: [905, 910, 920, null, null, null, null, null, null, null, null, null]
        },
        other: {
            label: 'Methanol (US Gulf)',
            unit: '$/MT',
            color: '#6E6E73',
            monthlyLastYear: [440, 435, 430, 425, 420, 425, 435, 440, 445, 450, 455, 460],
            monthlyThisYear: [465, 475, 480, null, null, null, null, null, null, null, null, null]
        }
    },

    // =========================================
    // YEARLY ANALYSIS
    // =========================================
    analysis: {
        feedstocks: {
            title: 'Feedstocks',
            points: [
                'Naphtha prices in NE Asia rose to ~$695/MT in March 2026, up from the Q4 2025 low of ~$630/MT, driven by surging crude oil costs from the Iran conflict. The naphtha crack spread vs. Brent has narrowed. <a href="https://www.spglobal.com/commodities/en/market-insights/topics/naphtha.html" target="_blank" class="source-inline">[S&P Global Platts]</a>',
                'European naphtha CIF NWE moved up to ~$680/MT from $630/MT in December 2025, with costs rising in tandem with Brent crude. The ethylene-naphtha spread remains tight in Europe. <a href="https://www.icis.com/explore/commodities/chemicals/naphtha/" target="_blank" class="source-inline">[ICIS]</a>',
                'U.S. ethane at Mont Belvieu (~$154/MT) maintains a significant cost advantage over naphtha for steam cracking, keeping U.S. petrochemical producers competitive globally. <a href="https://www.intratec.us/solutions/primary-commodity-prices/commodity/ethane-prices" target="_blank" class="source-inline">[Intratec]</a>',
                'The feedstock cost disparity between gas-based (U.S./ME) and naphtha-based (Europe/Asia) crackers widened further in 2026 as crude oil surged, pressuring European cracker margins. <a href="https://www.eia.gov/todayinenergy/detail.php?id=66645" target="_blank" class="source-inline">[EIA]</a>'
            ]
        },
        olefins: {
            title: 'Olefins',
            points: [
                'NE Asia ethylene CFR held near $850/MT in early March, rising from the sub-$740/MT levels seen in late 2025, supported by feedstock cost pass-through and improved downstream demand. <a href="https://www.cmegroup.com/markets/energy/petrochemicals/ethylene-cfr-ne-asia-icis.html" target="_blank" class="source-inline">[CME/ICIS]</a>',
                'European ethylene FD NWE traded at approximately $1,100/MT, up from $1,000/MT in H2 2025, as higher naphtha costs and limited new capacity in Europe supported prices. <a href="https://www.icis.com/explore/commodities/chemicals/ethylene/" target="_blank" class="source-inline">[ICIS]</a>',
                'Global propylene prices firmed to ~$870/MT CFR FE Asia on tighter supply from refinery maintenance and strong polypropylene demand in packaging and automotive sectors. <a href="https://www.icis.com/explore/commodities/chemicals/propylene/" target="_blank" class="source-inline">[ICIS]</a>'
            ]
        },
        polymers: {
            title: 'Polymers',
            points: [
                'HDPE prices in SE Asia recovered to ~$1,010/MT CFR from a H2 2025 trough, supported by feedstock cost pass-through and restocking activity in China ahead of the spring construction season. <a href="https://www.chemorbis.com/" target="_blank" class="source-inline">[ChemOrbis]</a>',
                'LDPE remained the highest-priced polyethylene grade at ~$1,180/MT, reflecting tighter global supply after several unplanned outages at major producers in the Gulf and Europe. <a href="https://www.chemorbis.com/" target="_blank" class="source-inline">[ChemOrbis]</a>',
                'Polypropylene prices rose to ~$1,020/MT in SE Asia, gaining ~2% MoM on firm demand from the packaging, film, and fiber sectors in China and ASEAN. <a href="https://plastic4trade.com/polymer-price-today-update-list-graph" target="_blank" class="source-inline">[Plastic4trade]</a>',
                'Indian polymer markets saw sharp increases in early March — PP Domestic up Rs. 23/kg, PE up Rs. 23.50/kg — driven by rising import costs and a depreciating rupee. <a href="https://www.polymerupdate.com/" target="_blank" class="source-inline">[Polymerupdate]</a>'
            ]
        },
        aromatics: {
            title: 'Aromatics (BTX)',
            points: [
                'NE Asia benzene FOB rose to ~$920/MT on higher crude oil and naphtha feedstock costs, with downstream styrene and cumene demand providing additional support. <a href="https://www.icis.com/explore/commodities/chemicals/benzene/" target="_blank" class="source-inline">[ICIS]</a>',
                'Toluene traded at ~$780/MT FOB Korea, stable versus February, as the disproportionation economics for benzene and xylene production remained marginal. <a href="https://www.icis.com/explore/commodities/chemicals/toluene/" target="_blank" class="source-inline">[ICIS]</a>',
                'Paraxylene (PX) prices in Asia strengthened alongside xylene at ~$870/MT, supporting the PTA-PET value chain amid improved textile and packaging demand. <a href="https://www.icis.com/explore/commodities/chemicals/xylenes/" target="_blank" class="source-inline">[ICIS]</a>'
            ]
        },
        other: {
            title: 'Other Chemicals',
            points: [
                'Methanol US Gulf prices rose to ~$480/MT driven by higher natural gas costs and strong methanol-to-olefins (MTO) demand in China. Methanex\'s latest posted price reflects the Q1 uplift. <a href="https://www.methanex.com/our-business/pricing" target="_blank" class="source-inline">[Methanex]</a>',
                'MEG NE Asia CFR recovered to ~$560/MT from $520/MT in December 2025, supported by improved polyester demand in China and tighter regional supply after production cuts. <a href="https://www.icis.com/explore/commodities/chemicals/ethylene-glycols/" target="_blank" class="source-inline">[ICIS]</a>',
                'Butadiene strengthened to ~$1,240/MT CFR NE Asia on tight supply after maintenance at several Asian extraction units and firm synthetic rubber demand. <a href="https://www.icis.com/explore/commodities/chemicals/butadiene/" target="_blank" class="source-inline">[ICIS]</a>'
            ]
        }
    },

    // =========================================
    // MONTHLY UPDATES (March 2026)
    // =========================================
    monthlyUpdates: {
        feedstocks: {
            title: 'Feedstocks — March 2026',
            points: [
                'Naphtha prices surged sharply in the first week of March as crude oil rallied on the Iran conflict. Asia CFR naphtha jumped from ~$670/MT to ~$695/MT, the highest level since September 2023. <a href="https://www.polymerupdate.com/News/Details/1446276" target="_blank" class="source-inline">[Polymerupdate]</a>',
                'The naphtha-ethane cost advantage for U.S. crackers widened further in March, with the ethane feedstock cost at ~$154/MT versus naphtha above $680/MT in both Europe and Asia. <a href="https://www.intratec.us/solutions/primary-commodity-prices/commodity/ethane-prices" target="_blank" class="source-inline">[Intratec]</a>'
            ]
        },
        polymers: {
            title: 'Polymers — March 2026',
            points: [
                'Advanced Petrochemical Company (APC, Saudi Arabia) issued new offers for HDPE, LLDPE, and PP in Asian markets, intensifying competition amid Saudi capacity expansions. <a href="https://plastic4trade.com/polymer-price-today-update-list-graph" target="_blank" class="source-inline">[Plastic4trade]</a>',
                'Indian polymer markets saw aggressive price hikes across all grades — HDPE up Rs. 6/kg, LLDPE up Rs. 6/kg, LDPE up Rs. 7/kg — reflecting rising import costs and rupee weakness. <a href="https://www.polymerupdate.com/" target="_blank" class="source-inline">[Polymerupdate]</a>',
                'Formosa Taiwan raised HDPE Film offers to India, signaling tighter regional supply and higher export netback expectations. <a href="https://plastic4trade.com/todays-latest-polymer-news-price-update" target="_blank" class="source-inline">[Plastic4trade]</a>'
            ]
        },
        aromatics: {
            title: 'Aromatics — March 2026',
            points: [
                'Benzene prices in NE Asia tracked crude oil higher, gaining ~2% to ~$920/MT on increased feedstock costs and tightening supply from scheduled cracker turnarounds. <a href="https://www.icis.com/explore/commodities/chemicals/benzene/" target="_blank" class="source-inline">[ICIS]</a>',
                'The global aromatics complex faces upside risk as Middle East crude supply disruptions raise naphtha and reformate costs — key feedstocks for BTX production. <a href="https://www.spglobal.com/commodities/en/market-insights/topics/naphtha.html" target="_blank" class="source-inline">[S&P Global]</a>'
            ]
        },
        other: {
            title: 'Other Chemicals — March 2026',
            points: [
                'Methanol prices firmed in March on natural gas cost pass-through and sustained MTO demand in China. U.S. Gulf spot prices approached $480/MT. <a href="https://www.methanex.com/our-business/pricing" target="_blank" class="source-inline">[Methanex]</a>',
                'MEG market turned bullish as Chinese polyester producers increased operating rates ahead of the spring textile season, drawing down inventories. <a href="https://www.icis.com/explore/commodities/chemicals/ethylene-glycols/" target="_blank" class="source-inline">[ICIS]</a>'
            ]
        }
    },

    // =========================================
    // GLOBAL NEWS
    // =========================================
    globalNews: [
        {
            title: 'Naphtha prices march higher in Asia and U.S. amid supply concerns and bullish upstream trends',
            source: 'Polymerupdate',
            date: '2026-03-02',
            url: 'https://www.polymerupdate.com/News/Details/1446276',
            category: 'Feedstocks'
        },
        {
            title: 'Indian polymer prices surge: PP up Rs. 23/kg, PE up Rs. 23.50/kg on rising import costs',
            source: 'Polymerupdate',
            date: '2026-03-09',
            url: 'https://www.polymerupdate.com/',
            category: 'Polymers'
        },
        {
            title: 'HDPE price forecast 2026: Trends, supply outlook, and feedstock cost analysis',
            source: 'Expert Market Research',
            date: '2026-03-01',
            url: 'https://www.expertmarketresearch.com/price-forecast/hdpe-price-forecast',
            category: 'Polymers'
        },
        {
            title: 'Advanced Petrochemical (Saudi) issues new HDPE and PP offers for Asian markets',
            source: 'Plastic4trade',
            date: '2026-03-05',
            url: 'https://plastic4trade.com/todays-latest-polymer-news-price-update',
            category: 'Polymers'
        },
        {
            title: 'Ethylene prices expected to stabilize as naphtha costs and sentiment remain volatile — Procurement Resource',
            source: 'Procurement Resource',
            date: '2026-03-04',
            url: 'https://www.procurementresource.com/resource-center/ethylene-price-trends',
            category: 'Olefins'
        },
        {
            title: 'Chemical Market Analytics: Global polymer fundamentals tighten as crude oil spike raises feedstock costs',
            source: 'OPIS/Dow Jones',
            date: '2026-03-06',
            url: 'https://chemicalmarketanalytics.com/',
            category: 'Market Overview'
        }
    ],

    // =========================================
    // LOCAL NEWS (Egypt & MENA)
    // =========================================
    localNews: [
        {
            title: 'EGYPES 2026: North Africa\'s largest energy show to feature petrochemical innovation summit',
            source: 'EGYPES',
            date: '2026-03-01',
            url: 'https://www.egypes.com/',
            category: 'Industry Events'
        },
        {
            title: 'Egyptian petrochemical imports face higher costs as shipping rates surge amid Strait of Hormuz crisis',
            source: 'Egypt Oil & Gas',
            date: '2026-03-07',
            url: 'https://egyptoil-gas.com/news/',
            category: 'Supply Chain'
        },
        {
            title: 'Saudi Aramco\'s petrochemical expansion targets 4 million MT/yr additional capacity by 2030',
            source: 'Oil & Gas Middle East',
            date: '2026-02-20',
            url: 'https://www.oilandgasmiddleeast.com',
            category: 'Capacity'
        },
        {
            title: 'GPCA annual report: GCC petrochemical production reached 156 million MT in 2025',
            source: 'GPCA',
            date: '2026-02-15',
            url: 'https://www.gpca.org.ae/',
            category: 'Industry Data'
        },
        {
            title: 'Egypt\'s Sidi Kerir Petrochemicals targets 15% production increase in FY2026',
            source: 'Enterprise',
            date: '2026-02-28',
            url: 'https://enterprise.press/',
            category: 'Local Production'
        }
    ],

    // =========================================
    // REPORTS CALENDAR
    // =========================================
    reports: [
        {
            name: 'ICIS Weekly Petrochemical Update',
            body: 'ICIS',
            commodities: 'Ethylene, Propylene, HDPE, LDPE, PP, BTX',
            nextRelease: '2026-03-14',
            frequency: 'Weekly (Fri)',
            url: 'https://www.icis.com/'
        },
        {
            name: 'Platts Global Petrochemical Index',
            body: 'S&P Global Platts',
            commodities: 'Naphtha, Olefins, Polymers, Aromatics',
            nextRelease: '2026-03-15',
            frequency: 'Monthly',
            url: 'https://www.spglobal.com/commodities/en/market-insights/topics/petrochemicals.html'
        },
        {
            name: 'Methanex Monthly Methanol Price',
            body: 'Methanex',
            commodities: 'Methanol (US, Europe, Asia)',
            nextRelease: '2026-04-01',
            frequency: 'Monthly',
            url: 'https://www.methanex.com/our-business/pricing'
        },
        {
            name: 'ChemOrbis Weekly Polymer Report',
            body: 'ChemOrbis',
            commodities: 'HDPE, LDPE, LLDPE, PP, PVC',
            nextRelease: '2026-03-14',
            frequency: 'Weekly (Fri)',
            url: 'https://www.chemorbis.com/'
        },
        {
            name: 'ACC Chemical Activity Barometer',
            body: 'American Chemistry Council',
            commodities: 'Chemical Industry Output Index',
            nextRelease: '2026-03-25',
            frequency: 'Monthly',
            url: 'https://www.americanchemistry.com/chemistry-in-america/data-industry-statistics/resources/chemical-activity-barometer'
        },
        {
            name: 'GPCA Monthly Statistics Report',
            body: 'Gulf Petrochemicals & Chemicals Association',
            commodities: 'GCC Petrochemical Production & Trade',
            nextRelease: '2026-03-20',
            frequency: 'Monthly',
            url: 'https://www.gpca.org.ae/'
        }
    ]
};
