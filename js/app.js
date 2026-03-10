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
        loadData();
        showLanding();
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
            agri: 'Commodity Price Monitor — Edible Oils, Sugar & Soybeans',
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
            { href: prefix + 'analysis', label: 'Yearly Analysis' },
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
        if (key === 'agri') {
            renderDashboard();
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
            if (state.currentIndustry === 'agri') {
                renderDashboard();
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

    function formatChange(change, showAbsolute) {
        if (!change) return '<span class="change-badge neutral">—</span>';
        const cls = changeClass(change.percent);
        if (showAbsolute) {
            return `<span class="change-badge ${cls}">
                ${changeArrow(change.percent)}
                ${change.absolute >= 0 ? '+' : ''}${formatPrice(change.absolute)}
                (${change.percent >= 0 ? '+' : ''}${change.percent.toFixed(2)}%)
            </span>`;
        }
        return `<span class="change-badge ${cls}">
            ${change.percent >= 0 ? '+' : ''}${change.percent.toFixed(2)}%
        </span>`;
    }

    function changeClass(value) {
        if (value > 0) return 'positive';
        if (value < 0) return 'negative';
        return 'neutral';
    }

    function changeArrow(value) {
        if (value > 0) return '&#9650;';
        if (value < 0) return '&#9660;';
        return '&#9644;';
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function isUsingSampleData() {
        return false;
    }

    // =========================================
    // RENDER: COMPACT DASHBOARD (Oil & Gas, Petrochem, Poultry)
    // =========================================
    function renderCompactDashboard(industryKey) {
        const configMap = {
            oilgas: typeof CONFIG_OILGAS !== 'undefined' ? CONFIG_OILGAS : null,
            petrochem: typeof CONFIG_PETROCHEM !== 'undefined' ? CONFIG_PETROCHEM : null,
            poultry: typeof CONFIG_POULTRY !== 'undefined' ? CONFIG_POULTRY : null
        };

        const cfg = configMap[industryKey];
        if (!cfg) return;

        const tbody = document.getElementById(industryKey + 'Body');
        const mobileContainer = document.getElementById(industryKey + 'MobileCards');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (mobileContainer) mobileContainer.innerHTML = '';

        // Group headers
        let currentGroup = '';

        cfg.commodities.forEach(item => {
            // Insert group header row if group changed
            if (item.group && item.group !== currentGroup) {
                currentGroup = item.group;
                const groupRow = document.createElement('tr');
                groupRow.innerHTML = `<td colspan="6" style="background:var(--bg-secondary);font-weight:700;font-size:0.82rem;color:var(--cib-blue);padding:10px 14px;letter-spacing:0.3px">${item.group}</td>`;
                tbody.appendChild(groupRow);
            }

            const change = calcChange(item.price, item.prevPrice);
            const changePct = change ? change.percent : null;
            const changeAbs = change ? change.absolute : null;
            const cls = changePct != null ? changeClass(changePct) : 'neutral';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="font-weight:600">${item.name}</td>
                <td class="price-value">${item.price != null ? formatPrice(item.price) : 'N/A'}</td>
                <td class="price-unit">${item.unit || ''}</td>
                <td><span class="change-badge ${cls}">${changeAbs != null ? (changeAbs >= 0 ? '+' : '') + formatPrice(changeAbs) : '—'}</span></td>
                <td><span class="change-badge ${cls}">${changePct != null ? (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%' : '—'}</span></td>
                <td><a href="${item.sourceUrl}" target="_blank" rel="noopener" class="source-link">${item.sourceName} &#8599;</a></td>
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
                            <div style="font-size:1.1rem;font-weight:700;color:var(--text-primary)">${item.price != null ? formatPrice(item.price) : 'N/A'}</div>
                            <div class="mobile-card-change change-${cls}" style="font-size:0.8rem">
                                ${changePct != null ? (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%' : '—'}
                            </div>
                        </div>
                    </div>
                    <div style="margin-top:10px;font-size:0.75rem;display:flex;justify-content:space-between;align-items:center">
                        <span style="color:var(--text-muted)">Change: <span class="change-${cls}">${changeAbs != null ? (changeAbs >= 0 ? '+' : '') + formatPrice(changeAbs) : '—'}</span></span>
                        <a href="${item.sourceUrl}" target="_blank" rel="noopener" class="source-link">${item.sourceName} &#8599;</a>
                    </div>
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
            });
            tabsContainer.appendChild(btn);

            // Panel
            const panel = document.createElement('div');
            panel.className = 'analysis-panel' + (catKey === activeKey ? ' active' : '');
            panel.id = industryKey + '-analysis-panel-' + catKey;

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

        const container = document.getElementById(industryKey + 'GlobalNewsGrid');
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
    }

    function renderIndustryLocalNews(industryKey) {
        const configMap = {
            oilgas: typeof CONFIG_OILGAS !== 'undefined' ? CONFIG_OILGAS : null,
            petrochem: typeof CONFIG_PETROCHEM !== 'undefined' ? CONFIG_PETROCHEM : null,
            poultry: typeof CONFIG_POULTRY !== 'undefined' ? CONFIG_POULTRY : null
        };

        const cfg = configMap[industryKey];
        if (!cfg || !cfg.localNews) return;

        const container = document.getElementById(industryKey + 'LocalNewsGrid');
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

    // =========================================
    // RENDER: PRICE DASHBOARD (Agri - existing)
    // =========================================
    function renderDashboard() {
        const groups = {
            edibleOils: { bodyId: 'edibleOilsBody', keys: ['cpo', 'soybean_oil', 'sunflower_oil'] },
            sugar: { bodyId: 'sugarBody', keys: ['raw_sugar', 'white_sugar'] },
            soybeans: { bodyId: 'soybeansBody', keys: ['soybeans', 'soybean_meal'] }
        };

        const sampleBadge = isUsingSampleData()
            ? '<span class="sample-badge">Sample Data</span>'
            : '';

        Object.entries(groups).forEach(([groupName, group]) => {
            const tbody = document.getElementById(group.bodyId);
            if (!tbody) return;
            tbody.innerHTML = '';

            group.keys.forEach(key => {
                const commodity = CONFIG.commodities[key];
                const data = state.commodityData[key];
                if (!data) return;

                const dailyChange = calcChange(data.today, data.yesterdayClose);
                const momChange = calcChange(data.avgThisMonth, data.avgLastMonth);
                const ytdChange = calcChange(data.avgYTD, data.avgLastYear);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <span class="commodity-name">${commodity.shortName}</span>
                        <span class="commodity-type">${commodity.name}</span>
                        ${sampleBadge}
                    </td>
                    <td class="price-value">${formatPrice(data.yesterdayClose)}</td>
                    <td class="price-value">
                        ${formatPrice(data.today)}
                        <span class="info-icon" data-tooltip="${commodity.conversionNote}${data.originalPrice ? '\nOriginal: ' + data.originalPrice.value + ' ' + data.originalPrice.unit : ''}">i</span>
                    </td>
                    <td>${formatChange(dailyChange, true)}</td>
                    <td class="price-value">${formatPrice(data.avgThisMonth)}</td>
                    <td class="price-value">${formatPrice(data.avgLastMonth)}</td>
                    <td>${formatChange(momChange, false)}</td>
                    <td class="price-value">${formatPrice(data.avgYTD)}</td>
                    <td class="price-value">${formatPrice(data.avgLastYear)}</td>
                    <td>${formatChange(ytdChange, false)}</td>
                    <td>
                        <a href="${commodity.source.url}" target="_blank" rel="noopener" class="source-link" title="Daily prices">
                            ${commodity.source.name} &#8599;
                        </a>
                        ${commodity.monthlySource ? `<br><a href="${commodity.monthlySource.url}" target="_blank" rel="noopener" class="source-link" style="font-size:0.7rem;color:var(--text-muted)" title="Monthly averages">${commodity.monthlySource.name} &#8599;</a>` : ''}
                    </td>
                `;
                tbody.appendChild(row);
            });
        });

        renderMobileCards();
        initTooltips();
    }

    // =========================================
    // RENDER: MOBILE CARDS (Agri)
    // =========================================
    function renderMobileCards() {
        const container = document.getElementById('mobileCards');
        if (!container) return;
        container.innerHTML = '';

        const sampleBadge = isUsingSampleData()
            ? '<span class="sample-badge">Sample Data</span>'
            : '';

        Object.keys(CONFIG.commodities).forEach(key => {
            const commodity = CONFIG.commodities[key];
            const data = state.commodityData[key];
            if (!data) return;

            const dailyChange = calcChange(data.today, data.yesterdayClose);
            const momChange = calcChange(data.avgThisMonth, data.avgLastMonth);
            const ytdChange = calcChange(data.avgYTD, data.avgLastYear);

            const dailyPct = dailyChange ? `${changeArrow(dailyChange.percent)} ${dailyChange.percent >= 0 ? '+' : ''}${dailyChange.percent.toFixed(2)}%` : '—';
            const dailyCls = dailyChange ? `change-${changeClass(dailyChange.percent)}` : '';
            const dailyAbs = dailyChange ? `${dailyChange.absolute >= 0 ? '+' : ''}${formatPrice(dailyChange.absolute)}` : '—';
            const dailyAbsCls = dailyChange ? `change-${changeClass(dailyChange.absolute)}` : '';
            const momPct = momChange ? `${momChange.percent >= 0 ? '+' : ''}${momChange.percent.toFixed(2)}%` : '—';
            const momCls = momChange ? `change-${changeClass(momChange.percent)}` : '';
            const ytdPct = ytdChange ? `${ytdChange.percent >= 0 ? '+' : ''}${ytdChange.percent.toFixed(2)}%` : '—';
            const ytdCls = ytdChange ? `change-${changeClass(ytdChange.percent)}` : '';

            const card = document.createElement('div');
            card.className = 'mobile-card';
            card.innerHTML = `
                <div class="mobile-card-header">
                    <div>
                        <div class="mobile-card-title">${commodity.shortName}</div>
                        <div style="font-size:0.72rem;color:var(--text-muted)">${commodity.name}</div>
                    </div>
                    <div style="text-align:right">
                        <div style="font-size:1.1rem;font-weight:700;color:var(--text-primary)">${formatPrice(data.today)}</div>
                        <div class="mobile-card-change ${dailyCls}" style="font-size:0.8rem">
                            ${dailyPct}
                        </div>
                    </div>
                </div>
                <div class="mobile-card-grid">
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">Yesterday Close</span>
                        <span class="mobile-card-value">${formatPrice(data.yesterdayClose)}</span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">Daily Change</span>
                        <span class="mobile-card-value ${dailyAbsCls}">
                            ${dailyAbs}
                        </span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">Avg This Month</span>
                        <span class="mobile-card-value">${formatPrice(data.avgThisMonth)}</span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">Avg Last Month</span>
                        <span class="mobile-card-value">${formatPrice(data.avgLastMonth)}</span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">MoM Change</span>
                        <span class="mobile-card-value ${momCls}">
                            ${momPct}
                        </span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">YTD vs 2025</span>
                        <span class="mobile-card-value ${ytdCls}">
                            ${ytdPct}
                        </span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">Avg YTD 2026</span>
                        <span class="mobile-card-value">${formatPrice(data.avgYTD)}</span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">Avg 2025</span>
                        <span class="mobile-card-value">${formatPrice(data.avgLastYear)}</span>
                    </div>
                </div>
                <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border-light);font-size:0.75rem;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
                    <span style="color:var(--text-muted)">Sources:</span>
                    <a href="${commodity.source.url}" target="_blank" rel="noopener" class="source-link">${commodity.source.name} &#8599;</a>
                    ${commodity.monthlySource ? `<a href="${commodity.monthlySource.url}" target="_blank" rel="noopener" class="source-link" style="color:var(--text-muted)">${commodity.monthlySource.name} &#8599;</a>` : ''}
                </div>
            `;
            container.appendChild(card);
        });
    }

    // =========================================
    // TOOLTIPS
    // =========================================
    function initTooltips() {
        const tooltip = document.getElementById('tooltip');

        document.querySelectorAll('.info-icon').forEach(icon => {
            icon.addEventListener('mouseenter', (e) => {
                const text = e.target.getAttribute('data-tooltip');
                tooltip.textContent = text;
                tooltip.classList.add('visible');

                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.bottom + 8}px`;
                tooltip.style.transform = 'translateX(-50%)';
            });

            icon.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });
    }

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
                        borderColor: '#8295a8',
                        backgroundColor: 'rgba(130, 149, 168, 0.1)',
                        borderWidth: 2,
                        borderDash: [6, 4],
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        pointBackgroundColor: '#8295a8',
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
                            color: '#4a5e72',
                            font: { family: "'Inter', sans-serif", size: 12 },
                            padding: 16,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#004A88',
                        titleColor: '#ffffff',
                        bodyColor: 'rgba(255,255,255,0.85)',
                        borderColor: '#003466',
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
