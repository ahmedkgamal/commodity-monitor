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
        // =========================================
        // FRED API — Free, fetches IMF commodity price data
        // Register at: https://fred.stlouisfed.org/docs/api/api_key.html
        // =========================================
        const { apiKey, baseUrl, series } = CONFIG.apis.fred;
        const startDate = '2025-01-01';

        // Map FRED series to commodity keys
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
                        const month = date.getMonth(); // 0-indexed
                        let value = parseFloat(obs.value);
                        if (isNaN(value)) return;

                        // Convert sugar from cents/lb to USD/MT
                        if (seriesId === series.sugarRaw) {
                            value = value * 22.0462;
                        }

                        if (year === 2025) monthlyData2025[month] = Math.round(value);
                        if (year === 2026) monthlyData2026[month] = Math.round(value);
                    });

                    // Update state with FRED data
                    const existing = state.commodityData[commodityKey];
                    existing.monthlyLastYear = monthlyData2025;
                    existing.monthlyThisYear = monthlyData2026;
                    existing.dataSource = `FRED API live (${seriesId})`;

                    // Recalculate averages from FRED data
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
            // Re-render with live data
            renderDashboard();
            renderAnalysis();
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
        // Data is from real sources (FRED/IMF) even without API key
        // Only show "sample" badge for Egyptian news (which uses placeholder headlines)
        return false;
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
                        ${commodity.monthlySource ? `<br><a href="${commodity.monthlySource.url}" target="_blank" rel="noopener" class="source-link" style="font-size:0.7rem;color:var(--text-muted)">${commodity.monthlySource.name}</a>` : ''}
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
