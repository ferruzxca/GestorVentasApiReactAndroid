import { Router } from 'express';
import { ROUTE_CATALOG } from '../utils/routeCatalog.js';

const router = Router();

function buildDashboardHtml() {
  const routesJson = JSON.stringify(ROUTE_CATALOG).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard API - Gestor Tecnologia</title>
  <style>
    :root {
      --pink: #ff4fa8;
      --purple: #7c3aed;
      --blue: #22c7f0;
      --black: #0c0b12;
      --panel: #151423;
      --panel-2: #11101b;
      --text: #f8f7ff;
      --muted: #bbb8d8;
      --ok: #2fdf8d;
      --warn: #ffd166;
      --danger: #ff5c7a;
      --border: rgba(255, 255, 255, 0.12);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 0% 0%, rgba(255,79,168,.22), transparent 35%),
        radial-gradient(circle at 90% 0%, rgba(34,199,240,.18), transparent 35%),
        linear-gradient(160deg, #0a0911 0%, #0d0c16 45%, #0b0b14 100%);
      padding: 1.2rem;
    }

    .container {
      max-width: 1320px;
      margin: 0 auto;
      display: grid;
      gap: .9rem;
    }

    .card {
      background: linear-gradient(155deg, rgba(124,58,237,.18), rgba(17,16,27,.95));
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: .95rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: .8rem;
    }

    .title {
      margin: 0;
      font-size: clamp(1.35rem, 2.6vw, 2.1rem);
    }

    .subtitle {
      margin: .35rem 0 0;
      color: var(--muted);
      font-size: .92rem;
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: .5rem;
      align-items: center;
    }

    .btn {
      border: 1px solid transparent;
      border-radius: 9px;
      padding: .5rem .75rem;
      font-size: .82rem;
      font-weight: 700;
      color: white;
      cursor: pointer;
      background: linear-gradient(90deg, var(--pink), var(--purple), var(--blue));
    }

    .btn.ghost {
      background: rgba(255,255,255,.04);
      border-color: var(--border);
    }

    .btn.warn {
      background: linear-gradient(90deg, #f59e0b, #ef4444);
    }

    .btn:hover { filter: brightness(1.08); }
    .btn:disabled { opacity: .55; cursor: not-allowed; }

    .small {
      margin: .18rem 0 0;
      color: var(--muted);
      font-size: .82rem;
    }

    .monitor-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: .8rem;
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: .4rem;
      border-radius: 999px;
      padding: .24rem .62rem;
      font-size: .79rem;
      font-weight: 700;
      border: 1px solid var(--border);
      margin-bottom: .45rem;
    }

    .status-chip.up {
      color: var(--ok);
      background: rgba(47, 223, 141, 0.12);
    }

    .status-chip.down {
      color: var(--danger);
      background: rgba(255, 92, 122, 0.12);
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: .6rem;
    }

    .kpi {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: .65rem;
      background: linear-gradient(160deg, rgba(17,16,27,.8), rgba(10,9,17,.9));
    }

    .kpi .label {
      color: var(--muted);
      font-size: .76rem;
      text-transform: uppercase;
      letter-spacing: .05em;
    }

    .kpi .value {
      font-size: 1.25rem;
      font-weight: 800;
      margin-top: .2rem;
      word-break: break-word;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: .8rem;
    }

    .col-4 { grid-column: span 4; }
    .col-8 { grid-column: span 8; }
    .col-6 { grid-column: span 6; }

    .chart-card {
      background: linear-gradient(160deg, rgba(122,58,237,.16), rgba(15,14,24,.94));
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: .8rem;
      min-height: 260px;
    }

    .chart-title {
      margin: 0 0 .6rem;
      font-size: .97rem;
    }

    .donut-wrap {
      display: grid;
      justify-items: center;
      gap: .7rem;
      margin-top: .6rem;
    }

    .donut {
      width: 165px;
      height: 165px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: conic-gradient(var(--ok) 0 50%, var(--danger) 50% 100%);
      position: relative;
    }

    .donut::after {
      content: '';
      position: absolute;
      inset: 27px;
      border-radius: 50%;
      background: var(--panel-2);
      border: 1px solid rgba(255,255,255,.06);
    }

    .donut-label {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      z-index: 2;
      font-weight: 800;
      font-size: .92rem;
    }

    .legend {
      display: grid;
      gap: .32rem;
      width: 100%;
      max-width: 240px;
    }

    .legend-row {
      display: flex;
      justify-content: space-between;
      font-size: .83rem;
      color: var(--muted);
    }

    .bar-list {
      display: grid;
      gap: .55rem;
      margin-top: .5rem;
    }

    .bar-row {
      display: grid;
      gap: .22rem;
    }

    .bar-head {
      display: flex;
      justify-content: space-between;
      font-size: .82rem;
      color: var(--muted);
      gap: .4rem;
    }

    .bar-track {
      height: 9px;
      border-radius: 999px;
      background: rgba(255,255,255,.09);
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--pink), var(--purple), var(--blue));
      width: 0;
    }

    .tables-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: .8rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: .84rem;
    }

    th, td {
      text-align: left;
      padding: .45rem .35rem;
      border-bottom: 1px solid rgba(255,255,255,.09);
    }

    th { color: #e6e2ff; font-size: .76rem; text-transform: uppercase; letter-spacing: .04em; }

    .routes {
      display: grid;
      gap: .6rem;
      margin-top: .55rem;
    }

    .route {
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: .72rem;
      background: rgba(15, 14, 24, .72);
      display: grid;
      gap: .3rem;
    }

    .method {
      display: inline-block;
      min-width: 54px;
      text-align: center;
      border-radius: 8px;
      padding: .18rem .45rem;
      margin-right: .45rem;
      font-size: .75rem;
      color: #fff;
      background: linear-gradient(90deg, var(--pink), var(--purple));
      font-weight: 700;
    }

    pre {
      margin: .5rem 0 0;
      padding: .7rem;
      border-radius: 9px;
      background: #0d0d15;
      border: 1px solid rgba(255,255,255,.08);
      color: #b8f2df;
      overflow-x: auto;
      font-size: .75rem;
    }

    .ok { color: var(--ok); }
    .warn { color: var(--warn); }
    .danger { color: var(--danger); }

    .msg {
      min-height: 1.2rem;
      font-size: .82rem;
      color: var(--muted);
      margin-top: .35rem;
    }

    .empty {
      color: var(--muted);
      font-size: .82rem;
      border: 1px dashed rgba(255,255,255,.2);
      border-radius: 8px;
      padding: .6rem;
      text-align: center;
      margin-top: .5rem;
    }

    .muted-link {
      color: var(--blue);
      text-decoration: none;
    }

    .muted-link:hover { text-decoration: underline; }

    @media (max-width: 1080px) {
      .col-4, .col-8, .col-6 { grid-column: 1 / -1; }
    }
  </style>
</head>
<body>
  <main class="container">
    <section class="card header">
      <div>
        <h1 class="title">Dashboard API - Gestor de Accesorios de Computo</h1>
        <p class="subtitle">Monitor avanzado con estado, conexion, estadisticas, graficas y explorador de rutas JSON.</p>
        <p id="monitor-state" class="small">Monitor: sin estado</p>
        <p id="sync-state" class="small">Sincronizacion pendiente</p>
        <p id="error-state" class="msg"></p>
      </div>
      <div class="controls">
        <button id="btn-connect" class="btn">Conectar monitor</button>
        <button id="btn-disconnect" class="btn warn">Desconectar monitor</button>
        <button id="btn-refresh" class="btn ghost">Refrescar ahora</button>
        <button id="btn-test-db" class="btn ghost">Probar DB</button>
      </div>
    </section>

    <section class="monitor-row">
      <article class="card">
        <div id="health-status" class="status-chip down">API: sin datos</div>
        <p class="small" id="health-api">Estado API: -</p>
        <p class="small" id="health-env">Entorno: -</p>
        <p class="small" id="health-node">Node: -</p>
        <p class="small" id="health-up">Uptime: -</p>
        <p class="small" id="health-memory">Memoria RSS: - | Heap: -</p>
        <p class="small" id="health-time">Actualizado: -</p>
      </article>

      <article class="card">
        <div id="db-status-chip" class="status-chip down">DB: sin datos</div>
        <p class="small" id="db-engine">Engine: -</p>
        <p class="small" id="db-host">Host: -</p>
        <p class="small" id="db-port">Puerto: -</p>
        <p class="small" id="db-name">Base: -</p>
        <p class="small" id="db-status">Estado: -</p>
        <p class="small" id="db-error">Error: -</p>
      </article>

      <article class="card">
        <h3 style="margin:0 0 .5rem; font-size:.95rem;">Accesos rapidos</h3>
        <p class="small"><a class="muted-link" href="/api/health" target="_blank" rel="noreferrer">GET /api/health</a></p>
        <p class="small"><a class="muted-link" href="/api/meta/connection" target="_blank" rel="noreferrer">GET /api/meta/connection</a></p>
        <p class="small"><a class="muted-link" href="/api/meta/stats" target="_blank" rel="noreferrer">GET /api/meta/stats</a></p>
        <p class="small"><a class="muted-link" href="/api/meta/routes" target="_blank" rel="noreferrer">GET /api/meta/routes</a></p>
        <p class="small" id="stats-time">Stats timestamp: -</p>
      </article>
    </section>

    <section class="card">
      <h3 style="margin:0 0 .7rem; font-size:.96rem;">KPIs Globales</h3>
      <div class="kpi-grid">
        <article class="kpi"><div class="label">Productos</div><div id="kpi-products" class="value">-</div></article>
        <article class="kpi"><div class="label">Activos</div><div id="kpi-active" class="value ok">-</div></article>
        <article class="kpi"><div class="label">Inactivos</div><div id="kpi-inactive" class="value danger">-</div></article>
        <article class="kpi"><div class="label">Bajo Stock (<=5)</div><div id="kpi-low-stock" class="value warn">-</div></article>
        <article class="kpi"><div class="label">Stock Total</div><div id="kpi-stock-total" class="value">-</div></article>
        <article class="kpi"><div class="label">Valor Inventario</div><div id="kpi-value" class="value">-</div></article>
        <article class="kpi"><div class="label">Usuarios</div><div id="kpi-users" class="value">-</div></article>
        <article class="kpi"><div class="label">Admins / Vendedores</div><div id="kpi-roles" class="value">-</div></article>
      </div>
    </section>

    <section class="charts-grid">
      <article class="chart-card col-4">
        <h3 class="chart-title">Productos por Status</h3>
        <div class="donut-wrap">
          <div class="donut" id="product-donut">
            <div class="donut-label" id="product-donut-label">0%</div>
          </div>
          <div class="legend" id="product-legend"></div>
        </div>
      </article>

      <article class="chart-card col-4">
        <h3 class="chart-title">Distribucion de Roles</h3>
        <div id="role-bars" class="bar-list"><div class="empty">Sin datos</div></div>
      </article>

      <article class="chart-card col-4">
        <h3 class="chart-title">Status Inventario</h3>
        <div id="status-bars" class="bar-list"><div class="empty">Sin datos</div></div>
      </article>
    </section>

    <section class="tables-grid">
      <article class="chart-card col-6">
        <h3 class="chart-title">Productos con Bajo Stock</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Stock</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody id="low-stock-body">
            <tr><td colspan="5" class="small">Sin datos</td></tr>
          </tbody>
        </table>
      </article>

      <article class="chart-card col-6">
        <h3 class="chart-title">Top Stock</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Stock</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody id="top-stock-body">
            <tr><td colspan="5" class="small">Sin datos</td></tr>
          </tbody>
        </table>
      </article>
    </section>

    <section class="card">
      <h3 style="margin:0 0 .2rem; font-size:.96rem;">Rutas disponibles y JSON de ejemplo</h3>
      <p class="small" style="margin:0 0 .5rem;">El dashboard consume las rutas publicas y muestra payloads de ejemplo para integracion web/movil.</p>
      <div class="routes" id="routes"></div>
    </section>
  </main>

  <script>
    const routes = ${routesJson};
    const REFRESH_MS = 15000;

    let monitorConnected = false;
    let monitorInterval = null;
    let isRefreshing = false;

    function byId(id) {
      return document.getElementById(id);
    }

    function setText(id, text) {
      const node = byId(id);
      if (node) {
        node.textContent = text;
      }
    }

    function formatNumber(value) {
      const n = Number(value || 0);
      return new Intl.NumberFormat('es-MX').format(n);
    }

    function formatCurrency(value) {
      const n = Number(value || 0);
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
    }

    function formatDate(value) {
      if (!value) {
        return '-';
      }

      const d = new Date(value);
      if (Number.isNaN(d.getTime())) {
        return '-';
      }

      return d.toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function updateMonitorState() {
      const text = monitorConnected
        ? 'Monitor conectado (auto refresh cada ' + (REFRESH_MS / 1000) + 's)'
        : 'Monitor desconectado';

      setText('monitor-state', text);

      byId('btn-connect').disabled = monitorConnected || isRefreshing;
      byId('btn-disconnect').disabled = !monitorConnected || isRefreshing;
      byId('btn-refresh').disabled = isRefreshing;
      byId('btn-test-db').disabled = isRefreshing;
    }

    async function fetchJson(url) {
      const response = await fetch(url, { cache: 'no-store' });
      let payload = null;

      try {
        payload = await response.json();
      } catch (_error) {
        throw new Error('Respuesta invalida en ' + url);
      }

      if (!response.ok) {
        throw new Error((payload && payload.message) ? payload.message : 'Error HTTP ' + response.status + ' en ' + url);
      }

      return payload;
    }

    function setChip(nodeId, isUp, textUp, textDown) {
      const node = byId(nodeId);
      node.className = isUp ? 'status-chip up' : 'status-chip down';
      node.textContent = isUp ? textUp : textDown;
    }

    function renderHealth(data) {
      setChip('health-status', !!data.ok, 'API: operando', 'API: con fallas');
      setText('health-api', 'Estado API: ' + (data.db === 'connected' ? 'DB alcanzable' : 'DB no alcanzable'));
      setText('health-env', 'Entorno: ' + (data.environment || '-'));
      setText('health-node', 'Node: ' + (data.nodeVersion || '-'));
      setText('health-up', 'Uptime: ' + formatNumber(data.uptimeSeconds) + ' s');

      const rss = data.memory && data.memory.rssMB ? data.memory.rssMB : 0;
      const heap = data.memory && data.memory.heapUsedMB ? data.memory.heapUsedMB : 0;
      setText('health-memory', 'Memoria RSS: ' + formatNumber(rss) + ' MB | Heap usado: ' + formatNumber(heap) + ' MB');
      setText('health-time', 'Actualizado: ' + formatDate(data.timestamp));
    }

    function renderConnection(data) {
      const conn = data.connection || {};
      const connected = conn.status === 'connected';

      setChip('db-status-chip', connected, 'DB: conectada', 'DB: desconectada');
      setText('db-engine', 'Engine: ' + (conn.engine || '-'));
      setText('db-host', 'Host: ' + (conn.host || '-'));
      setText('db-port', 'Puerto: ' + (conn.port || '-'));
      setText('db-name', 'Base: ' + (conn.database || conn.databasePath || '-'));
      setText('db-status', 'Estado: ' + (conn.status || '-'));
      setText('db-error', 'Error: ' + (conn.error || 'ninguno'));
    }

    function renderSummary(summary) {
      setText('kpi-products', formatNumber(summary.products_total));
      setText('kpi-active', formatNumber(summary.products_active));
      setText('kpi-inactive', formatNumber(summary.products_inactive));
      setText('kpi-low-stock', formatNumber(summary.low_stock_total));
      setText('kpi-stock-total', formatNumber(summary.stock_total));
      setText('kpi-value', formatCurrency(summary.inventory_value));
      setText('kpi-users', formatNumber(summary.users_total));
      setText('kpi-roles', formatNumber(summary.admins_total) + ' / ' + formatNumber(summary.vendedores_total));
    }

    function renderDonut(productStatus, summary) {
      const donut = byId('product-donut');
      const label = byId('product-donut-label');
      const legend = byId('product-legend');

      let active = Number(summary.products_active || 0);
      let inactive = Number(summary.products_inactive || 0);

      if (active + inactive === 0 && Array.isArray(productStatus)) {
        active = Number((productStatus.find(function(row) { return row.status === 'activo'; }) || {}).total || 0);
        inactive = Number((productStatus.find(function(row) { return row.status === 'inactivo'; }) || {}).total || 0);
      }

      const total = active + inactive;
      const activePct = total > 0 ? Math.round((active / total) * 100) : 0;

      donut.style.background = 'conic-gradient(var(--ok) 0 ' + activePct + '%, var(--danger) ' + activePct + '% 100%)';
      label.textContent = activePct + '% activo';

      legend.innerHTML =
        '<div class="legend-row"><span>Activo</span><strong class="ok">' + formatNumber(active) + '</strong></div>' +
        '<div class="legend-row"><span>Inactivo</span><strong class="danger">' + formatNumber(inactive) + '</strong></div>' +
        '<div class="legend-row"><span>Total</span><strong>' + formatNumber(total) + '</strong></div>';
    }

    function pickBarColor(label) {
      if (label === 'activo' || label === 'Administrador') {
        return 'linear-gradient(90deg, #22c55e, #16a34a)';
      }

      if (label === 'inactivo' || label === 'Vendedor') {
        return 'linear-gradient(90deg, #fb7185, #ef4444)';
      }

      return 'linear-gradient(90deg, var(--pink), var(--purple), var(--blue))';
    }

    function renderBars(targetId, rows, labelKey) {
      const root = byId(targetId);

      if (!Array.isArray(rows) || rows.length === 0) {
        root.innerHTML = '<div class="empty">Sin datos disponibles</div>';
        return;
      }

      const max = rows.reduce(function(acc, row) {
        const n = Number(row.total || 0);
        return n > acc ? n : acc;
      }, 0);

      root.innerHTML = rows.map(function(row) {
        const total = Number(row.total || 0);
        const label = row[labelKey] || 'N/A';
        const pct = max > 0 ? Math.max((total / max) * 100, 4) : 0;
        const color = pickBarColor(label);

        return (
          '<div class="bar-row">' +
            '<div class="bar-head"><span>' + escapeHtml(label) + '</span><strong>' + formatNumber(total) + '</strong></div>' +
            '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%; background:' + color + ';"></div></div>' +
          '</div>'
        );
      }).join('');
    }

    function renderStockTable(targetId, rows) {
      const body = byId(targetId);

      if (!Array.isArray(rows) || rows.length === 0) {
        body.innerHTML = '<tr><td colspan="5" class="small">Sin registros</td></tr>';
        return;
      }

      body.innerHTML = rows.map(function(row) {
        const stock = Number(row.cantidad_stock || 0);
        const stockClass = stock <= 5 ? 'warn' : 'ok';

        return (
          '<tr>' +
            '<td>' + escapeHtml(row.id) + '</td>' +
            '<td>' + escapeHtml(row.nombre) + '</td>' +
            '<td>' + escapeHtml(row.marca) + '</td>' +
            '<td><strong class="' + stockClass + '">' + formatNumber(stock) + '</strong></td>' +
            '<td>' + formatCurrency(row.precio || 0) + '</td>' +
          '</tr>'
        );
      }).join('');
    }

    function renderStats(data) {
      const summary = data.summary || {};

      renderSummary(summary);
      renderDonut(data.productStatus || [], summary);
      renderBars('role-bars', data.roleDistribution || [], 'rol');
      renderBars('status-bars', data.productStatus || [], 'status');
      renderStockTable('low-stock-body', data.lowStock || []);
      renderStockTable('top-stock-body', data.topStock || []);
      setText('stats-time', 'Stats timestamp: ' + formatDate(data.timestamp));
    }

    function renderRoutes() {
      const root = byId('routes');

      root.innerHTML = routes.map(function(route, idx) {
        return (
          '<article class="route">' +
            '<div><span class="method">' + escapeHtml(route.method) + '</span><strong>' + escapeHtml(route.path) + '</strong></div>' +
            '<div class="small">' + escapeHtml(route.description) + '</div>' +
            '<div class="small"><strong>Auth:</strong> ' + escapeHtml(route.auth) + '</div>' +
            '<button class="btn ghost" onclick="toggleSample(' + idx + ')">Ver JSON</button>' +
            '<pre id="sample-' + idx + '" style="display:none"></pre>' +
          '</article>'
        );
      }).join('');
    }

    window.toggleSample = function(idx) {
      const route = routes[idx];
      const node = byId('sample-' + idx);
      const payload = {
        request: route.sampleRequest || null,
        response: route.sampleResponse || null
      };

      if (node.style.display === 'none') {
        node.style.display = 'block';
        node.textContent = JSON.stringify(payload, null, 2);
      } else {
        node.style.display = 'none';
      }
    };

    async function refreshDashboard() {
      if (isRefreshing) {
        return;
      }

      isRefreshing = true;
      updateMonitorState();
      setText('sync-state', 'Sincronizando datos del dashboard...');

      try {
        const results = await Promise.all([
          fetchJson('/api/health'),
          fetchJson('/api/meta/connection'),
          fetchJson('/api/meta/stats')
        ]);

        renderHealth(results[0]);
        renderConnection(results[1]);
        renderStats(results[2]);

        setText('sync-state', 'Ultima sincronizacion: ' + formatDate(new Date().toISOString()));
        setText('error-state', '');
      } catch (error) {
        setText('error-state', 'Error de monitor: ' + (error && error.message ? error.message : 'desconocido'));

        if (!byId('health-api').textContent || byId('health-api').textContent === '-') {
          setText('health-api', 'Estado API: no disponible');
        }

        if (!byId('db-status').textContent || byId('db-status').textContent === '-') {
          setText('db-status', 'Estado: no disponible');
        }
      } finally {
        isRefreshing = false;
        updateMonitorState();
      }
    }

    async function testDbConnection() {
      if (isRefreshing) {
        return;
      }

      try {
        const result = await fetchJson('/api/meta/connection');
        renderConnection(result);
        setText('error-state', 'Prueba DB exitosa: conexion disponible.');
      } catch (error) {
        setText('error-state', 'Prueba DB fallo: ' + (error && error.message ? error.message : 'desconocido'));
      }
    }

    function connectMonitor() {
      if (monitorConnected) {
        return;
      }

      monitorConnected = true;
      updateMonitorState();
      refreshDashboard();

      monitorInterval = setInterval(function() {
        refreshDashboard();
      }, REFRESH_MS);
    }

    function disconnectMonitor() {
      monitorConnected = false;

      if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
      }

      setText('sync-state', 'Monitor pausado por usuario');
      updateMonitorState();
    }

    byId('btn-connect').addEventListener('click', connectMonitor);
    byId('btn-disconnect').addEventListener('click', disconnectMonitor);
    byId('btn-refresh').addEventListener('click', refreshDashboard);
    byId('btn-test-db').addEventListener('click', testDbConnection);

    renderRoutes();
    updateMonitorState();
    connectMonitor();
  </script>
</body>
</html>`;
}

router.get('/dashboard', (_req, res) => {
  res.type('html').send(buildDashboardHtml());
});

router.get('/', (_req, res) => {
  res.redirect('/dashboard');
});

export default router;
