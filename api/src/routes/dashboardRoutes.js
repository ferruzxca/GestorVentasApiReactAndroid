import { Router } from 'express';
import { ROUTE_CATALOG } from '../utils/routeCatalog.js';

const router = Router();

function buildDashboardHtml() {
  const routesJson = JSON.stringify(ROUTE_CATALOG);

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
      --black: #111018;
      --panel: #1a1826;
      --text: #f6f5ff;
      --muted: #bcb7da;
      --ok: #28d17c;
      --warn: #ffd166;
      --danger: #ff5c7a;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 20% 10%, rgba(255,79,168,.25), transparent 40%),
        radial-gradient(circle at 80% 0%, rgba(34,199,240,.22), transparent 35%),
        linear-gradient(160deg, #10101a 0%, #0b0b11 50%, #111018 100%);
      min-height: 100vh;
      padding: 2rem;
    }

    .container {
      max-width: 1080px;
      margin: 0 auto;
      display: grid;
      gap: 1.2rem;
    }

    .title {
      margin: 0;
      font-size: clamp(1.6rem, 2.6vw, 2.2rem);
      letter-spacing: .4px;
    }

    .subtitle { color: var(--muted); margin-top: .4rem; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .card {
      background: linear-gradient(140deg, rgba(124,58,237,.22), rgba(17,16,24,.9));
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 14px;
      padding: 1rem;
      backdrop-filter: blur(6px);
    }

    h2, h3 {
      margin: 0 0 .7rem;
      font-size: 1.05rem;
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: .45rem;
      font-weight: 700;
      font-size: .95rem;
      padding: .3rem .65rem;
      border-radius: 999px;
      background: rgba(40,209,124,.15);
      color: var(--ok);
    }

    .status.down {
      background: rgba(255,92,122,.15);
      color: var(--danger);
    }

    .small {
      font-size: .88rem;
      color: var(--muted);
    }

    .routes {
      display: grid;
      gap: .7rem;
    }

    .route {
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 10px;
      padding: .8rem;
      background: rgba(16,16,26,.7);
      display: grid;
      gap: .35rem;
    }

    .method {
      display: inline-block;
      min-width: 56px;
      text-align: center;
      border-radius: 8px;
      padding: .2rem .5rem;
      margin-right: .5rem;
      font-size: .77rem;
      color: #fff;
      background: linear-gradient(90deg, var(--pink), var(--purple));
      font-weight: 700;
    }

    button {
      background: linear-gradient(90deg, var(--purple), var(--blue));
      border: none;
      color: white;
      border-radius: 8px;
      padding: .5rem .8rem;
      cursor: pointer;
      font-weight: 600;
      font-size: .82rem;
      width: fit-content;
    }

    button:hover { filter: brightness(1.07); }

    pre {
      margin: .6rem 0 0;
      padding: .8rem;
      border-radius: 10px;
      background: #0f0f17;
      border: 1px solid rgba(255,255,255,.08);
      color: #b6f5e8;
      overflow-x: auto;
      font-size: .78rem;
    }

    .muted-link {
      color: var(--blue);
      text-decoration: none;
    }

    .muted-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <main class="container">
    <section>
      <h1 class="title">Dashboard API - Gestor de Accesorios de Computo</h1>
      <p class="subtitle">Monitor de funcionamiento, conexion y rutas JSON para Web React y App movil.</p>
    </section>

    <section class="grid">
      <article class="card">
        <h2>Funcionamiento</h2>
        <div id="health-status" class="status">Cargando...</div>
        <p class="small" id="health-details"></p>
      </article>
      <article class="card">
        <h2>Conexion DB</h2>
        <p class="small" id="db-engine">Cargando...</p>
        <p class="small" id="db-path"></p>
        <p class="small" id="db-status"></p>
      </article>
      <article class="card">
        <h2>Accesos rapidos</h2>
        <p class="small"><a class="muted-link" href="/api/health" target="_blank" rel="noreferrer">GET /api/health</a></p>
        <p class="small"><a class="muted-link" href="/api/meta/routes" target="_blank" rel="noreferrer">GET /api/meta/routes</a></p>
        <p class="small"><a class="muted-link" href="/api/meta/connection" target="_blank" rel="noreferrer">GET /api/meta/connection</a></p>
      </article>
    </section>

    <section class="card">
      <h3>Rutas disponibles y JSON de ejemplo</h3>
      <div class="routes" id="routes"></div>
    </section>
  </main>

  <script>
    const routes = ${routesJson};

    function renderRoutes() {
      const root = document.getElementById('routes');

      root.innerHTML = routes
        .map(function(route, idx) {
          return (
            '<article class="route">' +
              '<div>' +
                '<span class="method">' + route.method + '</span>' +
                '<strong>' + route.path + '</strong>' +
              '</div>' +
              '<div class="small">' + route.description + '</div>' +
              '<div class="small"><strong>Auth:</strong> ' + route.auth + '</div>' +
              '<button onclick="toggleSample(' + idx + ')">Ver JSON</button>' +
              '<pre id="sample-' + idx + '" style="display:none"></pre>' +
            '</article>'
          );
        })
        .join('');
    }

    window.toggleSample = function(idx) {
      const route = routes[idx];
      const node = document.getElementById('sample-' + idx);
      const sample = {
        request: route.sampleRequest || null,
        response: route.sampleResponse || null
      };

      if (node.style.display === 'none') {
        node.style.display = 'block';
        node.textContent = JSON.stringify(sample, null, 2);
      } else {
        node.style.display = 'none';
      }
    }

    async function loadHealth() {
      const statusNode = document.getElementById('health-status');
      const detailsNode = document.getElementById('health-details');

      try {
        const data = await fetch('/api/health').then(r => r.json());
        statusNode.textContent = data.ok ? 'API operando' : 'API con fallas';
        statusNode.className = data.ok ? 'status' : 'status down';
        detailsNode.textContent = 'Uptime: ' + data.uptimeSeconds + 's | Timestamp: ' + data.timestamp;
      } catch (error) {
        statusNode.textContent = 'No disponible';
        statusNode.className = 'status down';
        detailsNode.textContent = 'No fue posible consultar /api/health';
      }
    }

    async function loadConnection() {
      const engineNode = document.getElementById('db-engine');
      const pathNode = document.getElementById('db-path');
      const statusNode = document.getElementById('db-status');

      try {
        const data = await fetch('/api/meta/connection').then(r => r.json());
        engineNode.textContent = 'Engine: ' + data.connection.engine;
        pathNode.textContent = 'Ruta: ' + data.connection.databasePath;
        statusNode.textContent = 'Estado: ' + data.connection.status;
        statusNode.style.color = data.connection.status === 'connected' ? '#28d17c' : '#ff5c7a';
      } catch (error) {
        engineNode.textContent = 'Engine: no disponible';
        pathNode.textContent = 'Ruta: no disponible';
        statusNode.textContent = 'Estado: desconectado';
        statusNode.style.color = '#ff5c7a';
      }
    }

    renderRoutes();
    loadHealth();
    loadConnection();
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
