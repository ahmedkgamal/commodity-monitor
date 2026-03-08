/* =============================================
   COMMODITY PRICE MONITOR — Main Application
   ============================================= */

(function () {
    'use strict';

    // =========================================
    // STATE
    // =========================================
    const state = {
        commodityData: {},
        charts: {},
        activeTab: 'cpo'
    };

    // =========================================
    // INITIALIZATION
    // =========================================
    document.addEventListener('DOMContentLoaded', () => {
        initNavigation();
        loadData();
        renderDashboard();
        renderAnalysis();
        renderEgyptNews();
        renderReportsCalendar();
        updateTimestamp();
        initScrollSpy();
    });

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

    function initScrollSpy() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-links a');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { rootMargin: '-100px 0px -60% 0px' });

        sections.forEach(section => observer.observe(section));
    }

    // =========================================
    // DATA LOADING
    // =========================================
    function loadData() {
        // Check if any API is enabled
        const anyApiEnabled = Object.values(CONFIG.apis).some(api => api.enabled);

        if (anyApiEnabled) {
            fetchLiveData();
        } else {
            // Use sample data
            Object.keys(CONFIG.commodities).forEach(key => {
                state.commodityData[key] = CONFIG.sampleData[key];
            });
        }
    }

    async function fetchLiveData() {
        // =========================================
        // WORLD BANK API EXAMPLE
        // Uncomment and modify when you have API access
        // =========================================
        /*
        if (CONFIG.apis.worldBank.enabled) {
            try {
                const { url, indicators, format, perPage } = CONFIG.apis.worldBank;
                // Example: fetch palm oil data
                const response = await fetch(
                    `${url}${indicators.palmOil}?format=${format}&per_page=${perPage}&date=2025:2026`
                );
                const data = await response.json();
                // Parse and map to state.commodityData.cpo
                // data[1] contains the records
            } catch (error) {
                console.error('World Bank API error:', error);
            }
        }
        */

        // =========================================
        // COMMODITIES-API EXAMPLE
        // =========================================
        /*
        if (CONFIG.apis.commodityPricesApi.enabled) {
            try {
                const { apiKey, baseUrl, endpoints } = CONFIG.apis.commodityPricesApi;
                const response = await fetch(
                    `${baseUrl}${endpoints.latest}?access_key=${apiKey}&base=USD&symbols=PALM,SOYBEAN,SUGAR`
                );
                const data = await response.json();
                // Map data.rates to state.commodityData
            } catch (error) {
                console.error('Commodities API error:', error);
            }
        }
        */

        // Fallback to sample data if fetches fail
        Object.keys(CONFIG.commodities).forEach(key => {
            if (!state.commodityData[key]) {
                state.commodityData[key] = CONFIG.sampleData[key];
            }
        });
    }

    // =========================================
    // HELPERS
    // =========================================
    function formatPrice(value) {
        if (value == null) return '—';
        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calcChange(current, previous) {
        if (!current || !previous) return { absolute: 0, percent: 0 };
        const absolute = current - previous;
        const percent = ((absolute / previous) * 100);
        return { absolute, percent };
    }

    function changeClass(value) {
        if (value > 0) return 'positive';
        if (value < 0) return 'negative';
        return 'neutral';
    }

    function changeArrow(value) {
        if (value > 0) return '&#9650;';  // ▲
        if (value < 0) return '&#9660;';  // ▼
        return '&#9644;';                 // ▬
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function isUsingSampleData() {
        return !Object.values(CONFIG.apis).some(api => api.enabled);
    }

    // =========================================
    // RENDER: PRICE DASHBOARD
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
                    <td>
                        <span class="change-badge ${changeClass(dailyChange.percent)}">
                            ${changeArrow(dailyChange.percent)}
                            ${dailyChange.absolute >= 0 ? '+' : ''}${formatPrice(dailyChange.absolute)}
                            (${dailyChange.percent >= 0 ? '+' : ''}${dailyChange.percent.toFixed(2)}%)
                        </span>
                    </td>
                    <td class="price-value">${formatPrice(data.avgThisMonth)}</td>
                    <td class="price-value">${formatPrice(data.avgLastMonth)}</td>
                    <td>
                        <span class="change-badge ${changeClass(momChange.percent)}">
                            ${momChange.percent >= 0 ? '+' : ''}${momChange.percent.toFixed(2)}%
                        </span>
                    </td>
                    <td class="price-value">${formatPrice(data.avgYTD)}</td>
                    <td class="price-value">${formatPrice(data.avgLastYear)}</td>
                    <td>
                        <span class="change-badge ${changeClass(ytdChange.percent)}">
                            ${ytdChange.percent >= 0 ? '+' : ''}${ytdChange.percent.toFixed(2)}%
                        </span>
                    </td>
                    <td>
                        <a href="${commodity.source.url}" target="_blank" rel="noopener" class="source-link">
                            ${commodity.source.name}
                        </a>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });

        // Render mobile cards
        renderMobileCards();

        // Initialize tooltips
        initTooltips();
    }

    // =========================================
    // RENDER: MOBILE CARDS
    // =========================================
    function renderMobileCards() {
        const container = document.getElementById('mobileCards');
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

            const card = document.createElement('div');
            card.className = 'mobile-card';
            card.innerHTML = `
                <div class="mobile-card-header">
                    <div>
                        <div class="mobile-card-title">${commodity.shortName} ${sampleBadge}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted)">${commodity.name}</div>
                    </div>
                    <div class="mobile-card-change change-${changeClass(dailyChange.percent)}">
                        ${changeArrow(dailyChange.percent)} ${dailyChange.percent >= 0 ? '+' : ''}${dailyChange.percent.toFixed(2)}%
                    </div>
                </div>
                <div class="mobile-card-grid">
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">Today (USD/MT)</span>
                        <span class="mobile-card-value">${formatPrice(data.today)}</span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">Yesterday Close</span>
                        <span class="mobile-card-value">${formatPrice(data.yesterdayClose)}</span>
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
                        <span class="mobile-card-value change-${changeClass(momChange.percent)}">
                            ${momChange.percent >= 0 ? '+' : ''}${momChange.percent.toFixed(2)}%
                        </span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">YTD Change</span>
                        <span class="mobile-card-value change-${changeClass(ytdChange.percent)}">
                            ${ytdChange.percent >= 0 ? '+' : ''}${ytdChange.percent.toFixed(2)}%
                        </span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">Avg YTD</span>
                        <span class="mobile-card-value">${formatPrice(data.avgYTD)}</span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-card-label">Avg Last Year</span>
                        <span class="mobile-card-value">${formatPrice(data.avgLastYear)}</span>
                    </div>
                </div>
                <div style="margin-top:12px;font-size:0.78rem">
                    <a href="${commodity.source.url}" target="_blank" rel="noopener" class="source-link">${commodity.source.name}</a>
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
    // RENDER: YEARLY ANALYSIS
    // =========================================
    function renderAnalysis() {
        const container = document.getElementById('analysisContent');
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
                    ${isUsingSampleData() ? '<p class="sample-badge" style="margin-top:12px">Analysis based on sample data</p>' : ''}
                </div>
                <div class="chart-container">
                    <canvas id="chart-${key}"></canvas>
                </div>
            `;

            container.appendChild(panel);
        });

        // Initialize tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const commodity = btn.getAttribute('data-commodity');
                switchTab(commodity);
            });
        });

        // Render chart for active tab
        renderChart(state.activeTab);
    }

    function switchTab(key) {
        state.activeTab = key;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-commodity') === key);
        });

        // Update panels
        document.querySelectorAll('.analysis-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `panel-${key}`);
        });

        // Render chart
        renderChart(key);
    }

    function renderChart(key) {
        const data = state.commodityData[key];
        const commodity = CONFIG.commodities[key];
        const canvasId = `chart-${key}`;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Destroy existing chart
        if (state.charts[key]) {
            state.charts[key].destroy();
        }

        const ctx = canvas.getContext('2d');

        // Filter out null values for this year
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
    // RENDER: EGYPTIAN NEWS
    // =========================================
    function renderEgyptNews() {
        const container = document.getElementById('egyptNewsGrid');
        container.innerHTML = '';

        CONFIG.egyptNews.forEach(item => {
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
    // RENDER: REPORTS CALENDAR
    // =========================================
    function renderReportsCalendar() {
        const tbody = document.getElementById('reportsBody');
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

        // Update every 60 seconds
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
