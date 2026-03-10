/* =============================================
   COMMODITY PRICE MONITOR — Main Application
   Multi-Industry Platform
   ============================================= */

(function () {
    'use strict';

    // =========================================
    // STATE
    // =========================================
    const state = {
        commodityData: {},
        charts: {},
        activeTab: 'cpo',
        activeMonthlyTab: 'cpo',
        currentIndustry: null, // null = landing page
        industryTabState: {}   // track active tabs per industry
    };

    // =========================================
    // INITIALIZATION
    // =========================================
    document.addEventListener('DOMContentLoaded', () => {
        initNavigation();
        initKeyboardNav();
        loadData();
        showLanding();
        renderLandingTickers();
        updateTimestamp();
    });

    // =========================================
    // PUBLIC API (for onclick handlers in HTML)
    // =========================================
    window.APP = {
        showIndustry: showIndustry,
        showLanding: showLanding
    };

    // =========================================
    // LANDING PAGE / INDUSTRY SWITCHING
    // =========================================
    function showLanding() {
        state.currentIndustry = null;

        // Hide all industry containers
        document.querySelectorAll('.industry-content').forEach(el => {
            el.classList.remove('active');
        });

        // Show landing page
        const landing = document.getElementById('landing-page');
        if (landing) landing.style.display = '';

        // Hide nav links and toggle (they're industry-specific)
        const navLinks = document.getElementById('navLinks');
        if (navLinks) {
            navLinks.style.display = 'none';
            navLinks.classList.remove('open');
        }
        const navToggle = document.getElementById('navToggle');
        if (navToggle) navToggle.style.display = 'none';

        // Hide footer on landing (show only within industries)
        const footer = document.getElementById('site-footer');
        if (footer) footer.style.display = '';

        // Scroll to top
        window.scrollTo(0, 0);

        // Update page title
        document.title = 'Commodity Price Monitor — Multi-Industry Platform';
    }

    function showIndustry(key) {
        state.currentIndustry = key;

        // Hide landing page
        const landing = document.getElementById('landing-page');
        if (landing) landing.style.display = 'none';

        // Hide all industry containers, show the selected one
        document.querySelectorAll('.industry-content').forEach(el => {
            el.classList.remove('active');
        });
        const container = document.getElementById('industry-' + key);
        if (container) container.classList.add('active');

        // Show nav links and toggle
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.style.display = '';
        const navToggle = document.getElementById('navToggle');
        if (navToggle) navToggle.style.display = '';

        // Update nav links for this industry
        updateNavLinks(key);

        // Render content for the selected industry
        renderIndustry(key);

        // Scroll to top
        window.scrollTo(0, 0);

        // Update page title
        const titles = {
            agri: 'Commodity Price Monitor — Oil & Commodities',
            oilgas: 'Commodity Price Monitor — Oil & Gas',
            petrochem: 'Commodity Price Monitor — Petrochemicals',
            poultry: 'Commodity Price Monitor — Poultry'
        };
        document.title = titles[key] || 'Commodity Price Monitor';
    }

    function updateNavLinks(key) {
        const navLinks = document.getElementById('navLinks');
        if (!navLinks) return;

        // Build section IDs based on industry
        const prefix = key === 'agri' ? '' : key + '-';
        const sections = [
            { href: prefix + 'dashboard', label: 'Price Dashboard' },
            { href: prefix + 'analysis', label: 'Y-o-Y Changes' },
            { href: prefix + 'monthly', label: 'Monthly Updates' },
            { href: prefix + 'global-news', label: 'Global News' },
            { href: prefix + 'local-news', label: 'Local News' },
            { href: prefix + 'reports', label: 'Reports Calendar' }
        ];

        // For agri, use the original section IDs
        if (key === 'agri') {
            sections[2].href = 'monthly-updates';
            sections[5].href = 'reports';
        }

        navLinks.innerHTML = sections.map(s =>
            `<li><a href="#${s.href}">${s.label}</a></li>`
        ).join('');

        // Re-attach mobile nav close
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    function renderIndustry(key) {
        try {
            renderKPIStrip(key);
            if (key === 'agri') {
                renderCompactDashboard(key);
                renderAnalysis();
                renderMonthlyUpdates();
                renderGlobalNews();
                renderLocalNews();
                renderReportsCalendar();
            } else {
                renderCompactDashboard(key);
                renderIndustryAnalysis(key);
                renderIndustryMonthly(key);
                renderIndustryGlobalNews(key);
                renderIndustryLocalNews(key);
                renderIndustryReports(key);
            }
        } catch (err) {
            console.error('[renderIndustry] Error rendering', key, err);
        }
    }

    // =========================================
    // NAVIGATION
    // =========================================
    function initNavigation() {
        const toggle = document.getElementById('navToggle');
        const links = document.getElementById('navLinks');

        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
        });

        // Close mobile nav on link click
        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
            });
        });
    }

    // =========================================
    // DATA LOADING
    // =========================================
    function loadData() {
        // Always start with real data from config
        Object.keys(CONFIG.commodities).forEach(key => {
            state.commodityData[key] = CONFIG.sampleData[key];
        });

        // If FRED API key is configured, fetch latest monthly data
        if (CONFIG.apis.fred.enabled && CONFIG.apis.fred.apiKey !== 'YOUR_FRED_API_KEY_HERE') {
            fetchFredData();
        }
    }

    async function fetchFredData() {
        const { apiKey, baseUrl, series } = CONFIG.apis.fred;
        const startDate = '2025-01-01';

        const seriesMap = {
            [series.palmOil]: 'cpo',
            [series.soybeanOil]: 'soybean_oil',
            [series.sunflowerOil]: 'sunflower_oil',
            [series.sugarRaw]: 'raw_sugar',
            [series.soybeans]: 'soybeans',
            [series.soybeanMeal]: 'soybean_meal'
        };

        const fetchPromises = Object.entries(seriesMap).map(async ([seriesId, commodityKey]) => {
            try {
                const url = `${baseUrl}?series_id=${seriesId}&api_key=${apiKey}&file_type=json&observation_start=${startDate}&sort_order=asc`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.observations && data.observations.length > 0) {
                    const monthlyData2025 = new Array(12).fill(null);
                    const monthlyData2026 = new Array(12).fill(null);

                    data.observations.forEach(obs => {
                        const date = new Date(obs.date);
                        const year = date.getFullYear();
                        const month = date.getMonth();
                        let value = parseFloat(obs.value);
                        if (isNaN(value)) return;

                        if (seriesId === series.sugarRaw) {
                            value = value * 22.0462;
                        }

                        if (year === 2025) monthlyData2025[month] = Math.round(value);
                        if (year === 2026) monthlyData2026[month] = Math.round(value);
                    });

                    const existing = state.commodityData[commodityKey];
                    existing.monthlyLastYear = monthlyData2025;
                    existing.monthlyThisYear = monthlyData2026;
                    existing.dataSource = `FRED API live (${seriesId})`;

                    const valid2025 = monthlyData2025.filter(v => v !== null);
                    const valid2026 = monthlyData2026.filter(v => v !== null);
                    if (valid2025.length > 0) {
                        existing.avgLastYear = Math.round(valid2025.reduce((a, b) => a + b, 0) / valid2025.length * 100) / 100;
                    }
                    if (valid2026.length > 0) {
                        existing.avgYTD = Math.round(valid2026.reduce((a, b) => a + b, 0) / valid2026.length * 100) / 100;
                    }
                }
            } catch (error) {
                console.warn(`FRED fetch failed for ${seriesId}:`, error);
            }
        });

        try {
            await Promise.all(fetchPromises);

            // Sync FRED data into compactCommodities so the compact table shows updated prices
            if (CONFIG.compactCommodities) {
                const keyMap = {
                    'Crude Palm Oil (CPO)': 'cpo',
                    'Soybean Oil': 'soybean_oil',
                    'Sunflower Oil': 'sunflower_oil',
                    'Raw Sugar No.11': 'raw_sugar',
                    'White Sugar': 'white_sugar',
                    'Soybeans': 'soybeans',
                    'Soybean Meal': 'soybean_meal'
                };
                CONFIG.compactCommodities.forEach(item => {
                    const stateKey = keyMap[item.name];
                    if (stateKey && state.commodityData[stateKey]) {
                        const d = state.commodityData[stateKey];
                        if (d.today != null) {
                            item.prevPrice = item.price;
                            item.price = d.today;
                            item.dataDate = 'Live';
                        }
                    }
                });
            }

            if (state.currentIndustry === 'agri') {
                renderCompactDashboard('agri');
                renderKPIStrip('agri');
                renderAnalysis();
            }
            console.log('FRED data loaded successfully');
        } catch (error) {
            console.warn('Some FRED fetches failed, using cached data:', error);
        }
    }

    // =========================================
    // HELPERS
    // =========================================
    function formatPrice(value) {
        if (value == null) return '—';
        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calcChange(current, previous) {
        if (current == null || previous == null) return null;
        const absolute = current - previous;
        const percent = ((absolute / previous) * 100);
        return { absolute, percent };
    }

    function changeClass(value) {
        if (value > 0) return 'positive';
        if (value < 0) return 'negative';
        return 'neutral';
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // =========================================
    // RENDER: COMPACT DASHBOARD (Oil & Gas, Petrochem, Poultry)
    // =========================================
    function renderCompactDashboard(industryKey) {
        const configMap = {
            agri: typeof CONFIG !== 'undefined' ? CONFIG : null,
            oilgas: typeof CONFIG_OILGAS !== 'undefined' ? CONFIG_OILGAS : null,
            petrochem: typeof CONFIG_PETROCHEM !== 'undefined' ? CONFIG_PETROCHEM : null,
            poultry: typeof CONFIG_POULTRY !== 'undefined' ? CONFIG_POULTRY : null
        };

        const cfg = configMap[industryKey];
        if (!cfg) {
            console.warn('[Dashboard] No config found for', industryKey);
            return;
        }

        // For agri, use compactCommodities; for others, use commodities
        const commodities = industryKey === 'agri' ? cfg.compactCommodities : cfg.commodities;
        if (!commodities || commodities.length === 0) {
            console.warn('[Dashboard] No commodities data for', industryKey);
            return;
        }

        const tbody = document.getElementById(industryKey + 'Body');
        const mobileContainer = document.getElementById(industryKey + 'MobileCards');
        if (!tbody) {
            console.warn('[Dashboard] tbody not found:', industryKey + 'Body');
            return;
        }

        tbody.innerHTML = '';
        if (mobileContainer) mobileContainer.innerHTML = '';

        // Group headers
        let currentGroup = '';

        commodities.forEach(item => {
            // Insert group header row if group changed
            if (item.group && item.group !== currentGroup) {
                currentGroup = item.group;
                const groupRow = document.createElement('tr');
                groupRow.innerHTML = `<td colspan="6" style="background:var(--bg-primary);font-weight:600;font-size:0.6875rem;color:var(--text-secondary);padding:10px 14px;letter-spacing:0.06em;text-transform:uppercase">${item.group}</td>`;
                tbody.appendChild(groupRow);
            }

            const change = calcChange(item.price, item.prevPrice);
            const changePct = change ? change.percent : null;
            const changeAbs = change ? change.absolute : null;
            const cls = changePct != null ? changeClass(changePct) : 'neutral';

            // Conditional formatting for big moves (>5%)
            const bigMove = changePct != null && Math.abs(changePct) > 5;
            const bigCls = bigMove ? (changePct > 0 ? ' big-move-up' : ' big-move-down') : '';

            // Date/live indicator
            const dateLabel = item.dataDate === 'Live'
                ? '<span class="data-live">Live</span>'
                : item.dataDate
                    ? '<span class="data-date">' + formatDate(item.dataDate) + '</span>'
                    : '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="font-weight:600">${item.name}</td>
                <td class="price-value">${item.price != null ? formatPrice(item.price) : '—'}</td>
                <td class="price-unit">${item.unit || ''}</td>
                <td><span class="change-badge ${cls}${bigCls}">${changeAbs != null ? (changeAbs >= 0 ? '+' : '') + formatPrice(changeAbs) : '—'}</span></td>
                <td><span class="change-badge ${cls}${bigCls}">${changePct != null ? (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%' : '—'}</span></td>
                <td><a href="${item.sourceUrl}" target="_blank" rel="noopener" class="source-link">${item.sourceName} &#8599;</a>${dateLabel}</td>
            `;
            tbody.appendChild(row);

            // Mobile card
            if (mobileContainer) {
                const card = document.createElement('div');
                card.className = 'mobile-card';
                card.innerHTML = `
                    <div class="mobile-card-header">
                        <div>
                            <div class="mobile-card-title">${item.name}</div>
                            <div style="font-size:0.72rem;color:var(--text-muted)">${item.unit || ''}</div>
                        </div>
                        <div style="text-align:right">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--text-primary)">${item.price != null ? formatPrice(item.price) : '—'}</div>
                            <div class="mobile-card-change change-${cls}" style="font-size:0.8rem">
                                ${changePct != null ? (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%' : '—'}
                            </div>
                        </div>
                    </div>
                    <div style="margin-top:10px;font-size:0.75rem;display:flex;justify-content:space-between;align-items:center">
                        <span style="color:var(--text-muted)">Change: <span class="change-${cls}">${changeAbs != null ? (changeAbs >= 0 ? '+' : '') + formatPrice(changeAbs) : '—'}</span></span>
                        <a href="${item.sourceUrl}" target="_blank" rel="noopener" class="source-link">${item.sourceName} &#8599;</a>
                    </div>
                    ${dateLabel ? '<div style="margin-top:6px;font-size:0.6875rem;color:var(--text-muted)">' + (item.dataDate === 'Live' ? 'Live data' : 'As of ' + formatDate(item.dataDate)) + '</div>' : ''}
                `;
                mobileContainer.appendChild(card);
            }
        });
    }

    // =========================================
    // RENDER: INDUSTRY ANALYSIS (generic)
    // =========================================
    function renderIndustryAnalysis(industryKey) {
        const configMap = {
            oilgas: typeof CONFIG_OILGAS !== 'undefined' ? CONFIG_OILGAS : null,
            petrochem: typeof CONFIG_PETROCHEM !== 'undefined' ? CONFIG_PETROCHEM : null,
            poultry: typeof CONFIG_POULTRY !== 'undefined' ? CONFIG_POULTRY : null
        };

        const cfg = configMap[industryKey];
        if (!cfg || !cfg.analysis) return;

        const tabsContainer = document.getElementById(industryKey + 'AnalysisTabs');
        const contentContainer = document.getElementById(industryKey + 'AnalysisContent');
        if (!tabsContainer || !contentContainer) return;

        tabsContainer.innerHTML = '';
        contentContainer.innerHTML = '';

        const categories = Object.keys(cfg.analysis);
        if (!state.industryTabState[industryKey]) {
            state.industryTabState[industryKey] = { analysis: categories[0], monthly: null };
        }
        const activeKey = state.industryTabState[industryKey].analysis || categories[0];

        categories.forEach((catKey, idx) => {
            const cat = cfg.analysis[catKey];

            // Tab button
            const btn = document.createElement('button');
            btn.className = 'tab-btn' + (catKey === activeKey ? ' active' : '');
            btn.textContent = cat.title;
            btn.addEventListener('click', () => {
                state.industryTabState[industryKey].analysis = catKey;
                // Toggle active
                tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                contentContainer.querySelectorAll('.analysis-panel').forEach(p => p.classList.remove('active'));
                document.getElementById(industryKey + '-analysis-panel-' + catKey).classList.add('active');
                // Render chart for the newly active tab
                renderIndustryChart(industryKey, catKey);
            });
            tabsContainer.appendChild(btn);

            // Panel — includes chart canvas if price history exists
            const panel = document.createElement('div');
            panel.className = 'analysis-panel' + (catKey === activeKey ? ' active' : '');
            panel.id = industryKey + '-analysis-panel-' + catKey;

            const pointsHtml = cat.points.map(p => `<li>${p}</li>`).join('');
            const hasChart = cfg.priceHistory && cfg.priceHistory[catKey];
            const chartHtml = hasChart
                ? `<div class="chart-container"><canvas id="chart-${industryKey}-${catKey}"></canvas></div>`
                : '';

            panel.innerHTML = `
                <div class="analysis-summary">
                    <h3>${cat.title}</h3>
                    <ul>${pointsHtml}</ul>
                </div>
                ${chartHtml}
            `;
            contentContainer.appendChild(panel);
        });

        // Render chart for the initially active tab
        renderIndustryChart(industryKey, activeKey);
    }

    // =========================================
    // RENDER: INDUSTRY CHART (generic for Oil, Petrochem, Poultry)
    // =========================================
    function renderIndustryChart(industryKey, catKey) {
        const configMap = {
            oilgas: typeof CONFIG_OILGAS !== 'undefined' ? CONFIG_OILGAS : null,
            petrochem: typeof CONFIG_PETROCHEM !== 'undefined' ? CONFIG_PETROCHEM : null,
            poultry: typeof CONFIG_POULTRY !== 'undefined' ? CONFIG_POULTRY : null
        };

        const cfg = configMap[industryKey];
        if (!cfg || !cfg.priceHistory || !cfg.priceHistory[catKey]) return;

        const history = cfg.priceHistory[catKey];
        const canvasId = `chart-${industryKey}-${catKey}`;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const chartKey = industryKey + '-' + catKey;

        // Destroy existing chart if any
        if (state.charts[chartKey]) {
            state.charts[chartKey].destroy();
        }

        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const ctx = canvas.getContext('2d');
        state.charts[chartKey] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthLabels,
                datasets: [
                    {
                        label: `${history.label} 2026`,
                        data: history.monthlyThisYear || [],
                        borderColor: history.color || '#004A88',
                        backgroundColor: (history.color || '#004A88') + '20',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: history.color || '#004A88',
                        tension: 0.3,
                        fill: false,
                        spanGaps: false
                    },
                    {
                        label: `${history.label} 2025`,
                        data: history.monthlyLastYear || [],
                        borderColor: '#6E6E73',
                        backgroundColor: 'rgba(110, 110, 115, 0.08)',
                        borderWidth: 1.5,
                        borderDash: [6, 4],
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        pointBackgroundColor: '#6E6E73',
                        tension: 0.3,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#6E6E73',
                            font: { family: "'Inter', sans-serif", size: 12 },
                            padding: 16,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1D1D1F',
                        titleColor: '#ffffff',
                        bodyColor: 'rgba(255,255,255,0.85)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { family: "'Inter', sans-serif", weight: '600' },
                        bodyFont: { family: "'Inter', sans-serif" },
                        callbacks: {
                            label: function (context) {
                                const val = context.parsed.y;
                                if (val == null) return null;
                                return `${context.dataset.label}: ${formatPrice(val)} ${history.unit}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
                        ticks: {
                            color: '#6E6E73',
                            font: { family: "'Inter', sans-serif", size: 11 }
                        }
                    },
                    y: {
                        grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
                        ticks: {
                            color: '#6E6E73',
                            font: { family: "'Inter', sans-serif", size: 11 },
                            callback: function (value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // =========================================
    // RENDER: INDUSTRY MONTHLY UPDATES (generic)
    // =========================================
    function renderIndustryMonthly(industryKey) {
        const configMap = {
            oilgas: typeof CONFIG_OILGAS !== 'undefined' ? CONFIG_OILGAS : null,
            petrochem: typeof CONFIG_PETROCHEM !== 'undefined' ? CONFIG_PETROCHEM : null,
            poultry: typeof CONFIG_POULTRY !== 'undefined' ? CONFIG_POULTRY : null
        };

        const cfg = configMap[industryKey];
        if (!cfg || !cfg.monthlyUpdates) return;

        const tabsContainer = document.getElementById(industryKey + 'MonthlyTabs');
        const contentContainer = document.getElementById(industryKey + 'MonthlyContent');
        if (!tabsContainer || !contentContainer) return;

        tabsContainer.innerHTML = '';
        contentContainer.innerHTML = '';

        const categories = Object.keys(cfg.monthlyUpdates);
        if (!state.industryTabState[industryKey]) {
            state.industryTabState[industryKey] = { analysis: null, monthly: categories[0] };
        }
        if (!state.industryTabState[industryKey].monthly) {
            state.industryTabState[industryKey].monthly = categories[0];
        }
        const activeKey = state.industryTabState[industryKey].monthly;

        categories.forEach((catKey) => {
            const cat = cfg.monthlyUpdates[catKey];

            const btn = document.createElement('button');
            btn.className = 'tab-btn' + (catKey === activeKey ? ' active' : '');
            btn.textContent = cat.title;
            btn.addEventListener('click', () => {
                state.industryTabState[industryKey].monthly = catKey;
                tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                contentContainer.querySelectorAll('.analysis-panel').forEach(p => p.classList.remove('active'));
                document.getElementById(industryKey + '-monthly-panel-' + catKey).classList.add('active');
            });
            tabsContainer.appendChild(btn);

            const panel = document.createElement('div');
            panel.className = 'analysis-panel' + (catKey === activeKey ? ' active' : '');
            panel.id = industryKey + '-monthly-panel-' + catKey;

            const pointsHtml = cat.points.map(p => `<li>${p}</li>`).join('');
            panel.innerHTML = `
                <div class="analysis-summary">
                    <h3>${cat.title}</h3>
                    <ul>${pointsHtml}</ul>
                </div>
            `;
            contentContainer.appendChild(panel);
        });
    }

    // =========================================
    // RENDER: INDUSTRY NEWS (generic)
    // =========================================
    function renderIndustryGlobalNews(industryKey) {
        const configMap = {
            oilgas: typeof CONFIG_OILGAS !== 'undefined' ? CONFIG_OILGAS : null,
            petrochem: typeof CONFIG_PETROCHEM !== 'undefined' ? CONFIG_PETROCHEM : null,
            poultry: typeof CONFIG_POULTRY !== 'undefined' ? CONFIG_POULTRY : null
        };

        const cfg = configMap[industryKey];
        if (!cfg || !cfg.globalNews) return;

        const containerId = industryKey + 'GlobalNewsGrid';
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        cfg.globalNews.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="news-card-meta">
                    <span class="news-source">${item.source}</span>
                    <span class="news-date">${formatDate(item.date)}</span>
                </div>
                <span class="news-category">${item.category}</span>
                <h4 class="news-title">${item.title}</h4>
                <a href="${item.url}" target="_blank" rel="noopener" class="news-link">
                    Read full article &#8594;
                </a>
            `;
            container.appendChild(card);
        });

        renderNewsWithFilters(containerId, cfg.globalNews);
    }

    function renderIndustryLocalNews(industryKey) {
        const configMap = {
            oilgas: typeof CONFIG_OILGAS !== 'undefined' ? CONFIG_OILGAS : null,
            petrochem: typeof CONFIG_PETROCHEM !== 'undefined' ? CONFIG_PETROCHEM : null,
            poultry: typeof CONFIG_POULTRY !== 'undefined' ? CONFIG_POULTRY : null
        };

        const cfg = configMap[industryKey];
        if (!cfg || !cfg.localNews) return;

        const containerId = industryKey + 'LocalNewsGrid';
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        cfg.localNews.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="news-card-meta">
                    <span class="news-source">${item.source}</span>
                    <span class="news-date">${formatDate(item.date)}</span>
                </div>
                <span class="news-category">${item.category}</span>
                <h4 class="news-title">${item.title}</h4>
                <a href="${item.url}" target="_blank" rel="noopener" class="news-link">
                    Read full article &#8594;
                </a>
            `;
            container.appendChild(card);
        });

        renderNewsWithFilters(containerId, cfg.localNews);
    }

    // =========================================
    // RENDER: INDUSTRY REPORTS (generic)
    // =========================================
    function renderIndustryReports(industryKey) {
        const configMap = {
            oilgas: typeof CONFIG_OILGAS !== 'undefined' ? CONFIG_OILGAS : null,
            petrochem: typeof CONFIG_PETROCHEM !== 'undefined' ? CONFIG_PETROCHEM : null,
            poultry: typeof CONFIG_POULTRY !== 'undefined' ? CONFIG_POULTRY : null
        };

        const cfg = configMap[industryKey];
        if (!cfg || !cfg.reports) return;

        const tbody = document.getElementById(industryKey + 'ReportsBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        cfg.reports.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="report-name">${report.name}</td>
                <td class="report-body">${report.body}</td>
                <td>${report.commodities}</td>
                <td>${formatDate(report.nextRelease)}</td>
                <td><span class="report-frequency">${report.frequency}</span></td>
                <td>
                    <a href="${report.url}" target="_blank" rel="noopener" class="report-link">
                        View &#8599;
                    </a>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // (Old renderDashboard, renderMobileCards, initTooltips removed — agri now uses renderCompactDashboard)

    // =========================================
    // RENDER: YEARLY ANALYSIS (Agri)
    // =========================================
    function renderAnalysis() {
        const container = document.getElementById('analysisContent');
        if (!container) return;
        container.innerHTML = '';

        Object.keys(CONFIG.commodities).forEach(key => {
            const analysis = CONFIG.analysis[key];
            const commodity = CONFIG.commodities[key];
            const data = state.commodityData[key];

            const panel = document.createElement('div');
            panel.className = `analysis-panel${key === state.activeTab ? ' active' : ''}`;
            panel.id = `panel-${key}`;

            const pointsHtml = analysis.points.map(p => `<li>${p}</li>`).join('');

            panel.innerHTML = `
                <div class="analysis-summary">
                    <h3>${analysis.title}</h3>
                    <ul>${pointsHtml}</ul>
                </div>
                <div class="chart-container">
                    <canvas id="chart-${key}"></canvas>
                </div>
            `;

            container.appendChild(panel);
        });

        // Initialize tab buttons (only within agri industry)
        const agriContainer = document.getElementById('industry-agri');
        if (agriContainer) {
            agriContainer.querySelectorAll('#analysis .tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const commodity = btn.getAttribute('data-commodity');
                    switchTab(commodity);
                });
            });
        }

        renderChart(state.activeTab);
    }

    function switchTab(key) {
        state.activeTab = key;

        const agriContainer = document.getElementById('industry-agri');
        if (!agriContainer) return;

        agriContainer.querySelectorAll('#analysis .tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-commodity') === key);
        });

        agriContainer.querySelectorAll('#analysisContent .analysis-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `panel-${key}`);
        });

        renderChart(key);
    }

    function renderChart(key) {
        const data = state.commodityData[key];
        const commodity = CONFIG.commodities[key];
        const canvasId = `chart-${key}`;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (state.charts[key]) {
            state.charts[key].destroy();
        }

        const ctx = canvas.getContext('2d');
        const thisYearData = data.monthlyThisYear || [];
        const lastYearData = data.monthlyLastYear || [];

        state.charts[key] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: CONFIG.chart.monthLabels,
                datasets: [
                    {
                        label: `${commodity.shortName} ${CONFIG.chart.thisYearLabel}`,
                        data: thisYearData,
                        borderColor: commodity.color,
                        backgroundColor: commodity.color + '20',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: commodity.color,
                        tension: 0.3,
                        fill: false,
                        spanGaps: false
                    },
                    {
                        label: `${commodity.shortName} ${CONFIG.chart.lastYearLabel}`,
                        data: lastYearData,
                        borderColor: '#6E6E73',
                        backgroundColor: 'rgba(110, 110, 115, 0.08)',
                        borderWidth: 1.5,
                        borderDash: [6, 4],
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        pointBackgroundColor: '#6E6E73',
                        tension: 0.3,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#6E6E73',
                            font: { family: "'Inter', sans-serif", size: 12 },
                            padding: 16,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1D1D1F',
                        titleColor: '#ffffff',
                        bodyColor: 'rgba(255,255,255,0.85)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { family: "'Inter', sans-serif", weight: '600' },
                        bodyFont: { family: "'Inter', sans-serif" },
                        callbacks: {
                            label: function (context) {
                                const val = context.parsed.y;
                                if (val == null) return null;
                                return `${context.dataset.label}: $${formatPrice(val)}/MT`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: CONFIG.chart.gridColor, drawBorder: false },
                        ticks: {
                            color: CONFIG.chart.tickColor,
                            font: { family: "'Inter', sans-serif", size: 11 }
                        }
                    },
                    y: {
                        grid: { color: CONFIG.chart.gridColor, drawBorder: false },
                        ticks: {
                            color: CONFIG.chart.tickColor,
                            font: { family: "'Inter', sans-serif", size: 11 },
                            callback: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // =========================================
    // RENDER: MONTHLY UPDATES (Agri)
    // =========================================
    function renderMonthlyUpdates() {
        const container = document.getElementById('monthlyContent');
        if (!container) return;
        container.innerHTML = '';

        Object.keys(CONFIG.commodities).forEach(key => {
            const updates = CONFIG.monthlyUpdates[key];
            if (!updates) return;

            const panel = document.createElement('div');
            panel.className = `analysis-panel${key === state.activeMonthlyTab ? ' active' : ''}`;
            panel.id = `monthly-panel-${key}`;

            const pointsHtml = updates.points.map(p => `<li>${p}</li>`).join('');

            panel.innerHTML = `
                <div class="analysis-summary">
                    <h3>${updates.title}</h3>
                    <ul>${pointsHtml}</ul>
                </div>
            `;

            container.appendChild(panel);
        });

        // Initialize monthly tab buttons
        const monthlyTabs = document.getElementById('monthlyTabs');
        if (monthlyTabs) {
            monthlyTabs.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const commodity = btn.getAttribute('data-commodity');
                    switchMonthlyTab(commodity);
                });
            });
        }
    }

    function switchMonthlyTab(key) {
        state.activeMonthlyTab = key;

        const monthlyTabs = document.getElementById('monthlyTabs');
        if (monthlyTabs) {
            monthlyTabs.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-commodity') === key);
            });
        }

        const monthlyContent = document.getElementById('monthlyContent');
        if (monthlyContent) {
            monthlyContent.querySelectorAll('.analysis-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === `monthly-panel-${key}`);
            });
        }
    }

    // =========================================
    // RENDER: GLOBAL NEWS (Agri)
    // =========================================
    function renderGlobalNews() {
        const container = document.getElementById('globalNewsGrid');
        if (!container) return;
        container.innerHTML = '';

        CONFIG.globalNews.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="news-card-meta">
                    <span class="news-source">${item.source}</span>
                    <span class="news-date">${formatDate(item.date)}</span>
                </div>
                <span class="news-category">${item.category}</span>
                <h4 class="news-title">${item.title}</h4>
                <a href="${item.url}" target="_blank" rel="noopener" class="news-link">
                    Read full article &#8594;
                </a>
            `;
            container.appendChild(card);
        });

        renderNewsWithFilters('globalNewsGrid', CONFIG.globalNews);
    }

    // =========================================
    // RENDER: LOCAL NEWS (Agri)
    // =========================================
    function renderLocalNews() {
        const container = document.getElementById('localNewsGrid');
        if (!container) return;
        container.innerHTML = '';

        CONFIG.localNews.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="news-card-meta">
                    <span class="news-source">${item.source}</span>
                    <span class="news-date">${formatDate(item.date)}</span>
                </div>
                <span class="news-category">${item.category}</span>
                <h4 class="news-title">${item.title}</h4>
                <a href="${item.url}" target="_blank" rel="noopener" class="news-link">
                    Read full article &#8594;
                </a>
            `;
            container.appendChild(card);
        });

        renderNewsWithFilters('localNewsGrid', CONFIG.localNews);
    }

    // =========================================
    // RENDER: REPORTS CALENDAR (Agri)
    // =========================================
    function renderReportsCalendar() {
        const tbody = document.getElementById('reportsBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        CONFIG.reports.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="report-name">${report.name}</td>
                <td class="report-body">${report.body}</td>
                <td>${report.commodities}</td>
                <td>${formatDate(report.nextRelease)}</td>
                <td><span class="report-frequency">${report.frequency}</span></td>
                <td>
                    <a href="${report.url}" target="_blank" rel="noopener" class="report-link">
                        View &#8599;
                    </a>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // =========================================
    // KEYBOARD NAVIGATION — Accessibility
    // =========================================
    function initKeyboardNav() {
        document.querySelectorAll('.industry-card').forEach(card => {
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });

        // Ensure back-to-landing buttons work via JS event delegation
        document.querySelectorAll('.back-to-landing').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showLanding();
            });
        });
    }

    // =========================================
    // LANDING PAGE TICKERS — Live price pills
    // =========================================
    function renderLandingTickers() {
        // Agri tickers — using compactCommodities
        const agriTickers = document.getElementById('tickers-agri');
        if (agriTickers && typeof CONFIG !== 'undefined' && CONFIG.compactCommodities) {
            const items = CONFIG.compactCommodities.filter(c => !c.group || CONFIG.compactCommodities.indexOf(c) < 4).slice(0, 3);
            agriTickers.innerHTML = items.map(item => {
                const change = calcChange(item.price, item.prevPrice);
                const pct = change ? change.percent : null;
                const cls = pct != null ? changeClass(pct) : 'neutral';
                const arrow = pct > 0 ? '&#9650;' : pct < 0 ? '&#9660;' : '';
                const pctStr = pct != null ? (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%' : '';
                const shortName = item.name.split('(')[0].trim().split(' ')[0];
                return `<span class="ticker-item ${cls}"><span class="ticker-name">${shortName}</span> ${arrow} ${pctStr}</span>`;
            }).join('');
        }

        // Oil & Gas tickers
        const oilgasTickers = document.getElementById('tickers-oilgas');
        if (oilgasTickers && typeof CONFIG_OILGAS !== 'undefined') {
            const items = CONFIG_OILGAS.commodities.slice(0, 3);
            oilgasTickers.innerHTML = items.map(item => {
                const change = calcChange(item.price, item.prevPrice);
                const pct = change ? change.percent : null;
                const cls = pct != null ? changeClass(pct) : 'neutral';
                const arrow = pct > 0 ? '&#9650;' : pct < 0 ? '&#9660;' : '';
                const pctStr = pct != null ? (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%' : '';
                const shortName = item.name.split(' ')[0];
                return `<span class="ticker-item ${cls}"><span class="ticker-name">${shortName}</span> ${arrow} ${pctStr}</span>`;
            }).join('');
        }

        // Petrochem tickers
        const petrochemTickers = document.getElementById('tickers-petrochem');
        if (petrochemTickers && typeof CONFIG_PETROCHEM !== 'undefined') {
            const items = CONFIG_PETROCHEM.commodities.filter(c => !c.group || CONFIG_PETROCHEM.commodities.indexOf(c) < 5).slice(0, 3);
            petrochemTickers.innerHTML = items.map(item => {
                const change = calcChange(item.price, item.prevPrice);
                const pct = change ? change.percent : null;
                const cls = pct != null ? changeClass(pct) : 'neutral';
                const arrow = pct > 0 ? '&#9650;' : pct < 0 ? '&#9660;' : '';
                const pctStr = pct != null ? (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%' : '';
                const shortName = item.name.split(' ')[0];
                return `<span class="ticker-item ${cls}"><span class="ticker-name">${shortName}</span> ${arrow} ${pctStr}</span>`;
            }).join('');
        }

        // Poultry tickers
        const poultryTickers = document.getElementById('tickers-poultry');
        if (poultryTickers && typeof CONFIG_POULTRY !== 'undefined') {
            const items = CONFIG_POULTRY.commodities.slice(0, 3);
            poultryTickers.innerHTML = items.map(item => {
                const change = calcChange(item.price, item.prevPrice);
                const pct = change ? change.percent : null;
                const cls = pct != null ? changeClass(pct) : 'neutral';
                const arrow = pct > 0 ? '&#9650;' : pct < 0 ? '&#9660;' : '';
                const pctStr = pct != null ? (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%' : '';
                const shortName = item.name.length > 12 ? item.name.substring(0, 10) + '..' : item.name;
                return `<span class="ticker-item ${cls}"><span class="ticker-name">${shortName}</span> ${arrow} ${pctStr}</span>`;
            }).join('');
        }
    }

    // =========================================
    // KPI STRIP — Top movers for each industry
    // =========================================
    function renderKPIStrip(industryKey) {
        // Unified KPI strip — all industries use the same compact data format
        const configMap = {
            agri: typeof CONFIG !== 'undefined' ? CONFIG : null,
            oilgas: typeof CONFIG_OILGAS !== 'undefined' ? CONFIG_OILGAS : null,
            petrochem: typeof CONFIG_PETROCHEM !== 'undefined' ? CONFIG_PETROCHEM : null,
            poultry: typeof CONFIG_POULTRY !== 'undefined' ? CONFIG_POULTRY : null
        };

        const cfg = configMap[industryKey];
        if (!cfg) return;

        // For agri, use compactCommodities; for others, use commodities
        const commodities = industryKey === 'agri' ? cfg.compactCommodities : cfg.commodities;
        if (!commodities) return;

        const container = document.getElementById(industryKey + 'KpiStrip');
        if (!container) return;

        // Get items with changes, sort by biggest move
        const movers = commodities
            .filter(item => item.price != null && item.prevPrice != null)
            .map(item => {
                const change = calcChange(item.price, item.prevPrice);
                return { name: item.name, price: item.price, unit: item.unit, change };
            })
            .filter(item => item.change)
            .sort((a, b) => Math.abs(b.change.percent) - Math.abs(a.change.percent));

        container.innerHTML = movers.slice(0, 4).map(item => {
            const cls = changeClass(item.change.percent);
            const arrow = item.change.percent > 0 ? '&#9650;' : item.change.percent < 0 ? '&#9660;' : '';
            const shortName = item.name.length > 18 ? item.name.substring(0, 16) + '..' : item.name;
            return `
                <div class="kpi-card">
                    <span class="kpi-card-label">${shortName}</span>
                    <span class="kpi-card-value">${formatPrice(item.price)}</span>
                    <span class="kpi-card-change ${cls}">
                        ${arrow} ${item.change.percent >= 0 ? '+' : ''}${item.change.percent.toFixed(2)}%
                    </span>
                </div>
            `;
        }).join('');
    }

    // =========================================
    // FILTER PILLS — Category filters for news
    // =========================================
    function renderNewsWithFilters(containerId, newsItems, renderCardFn) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Extract unique categories
        const categories = [...new Set(newsItems.map(item => item.category))];

        // Only add pills if there are 2+ categories
        if (categories.length >= 2) {
            let filterContainer = container.previousElementSibling;
            if (!filterContainer || !filterContainer.classList.contains('filter-pills')) {
                filterContainer = document.createElement('div');
                filterContainer.className = 'filter-pills';
                container.parentNode.insertBefore(filterContainer, container);
            }

            filterContainer.innerHTML = `<button class="filter-pill active" data-category="all">All</button>` +
                categories.map(cat =>
                    `<button class="filter-pill" data-category="${cat}">${cat}</button>`
                ).join('');

            filterContainer.querySelectorAll('.filter-pill').forEach(pill => {
                pill.addEventListener('click', () => {
                    filterContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    const selectedCat = pill.getAttribute('data-category');

                    container.querySelectorAll('.news-card').forEach(card => {
                        if (selectedCat === 'all') {
                            card.style.display = '';
                        } else {
                            const cardCat = card.querySelector('.news-category');
                            card.style.display = (cardCat && cardCat.textContent === selectedCat) ? '' : 'none';
                        }
                    });
                });
            });
        }
    }

    // =========================================
    // TIMESTAMP
    // =========================================
    function updateTimestamp() {
        const el = document.getElementById('updateTimestamp');
        if (!el) return;
        const now = new Date();
        el.textContent = now.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        setInterval(() => {
            const t = new Date();
            el.textContent = t.toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        }, 60000);
    }

})();
