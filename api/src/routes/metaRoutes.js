import { Router } from 'express';
import { checkDbConnection } from '../db.js';
import { ROUTE_CATALOG } from '../utils/routeCatalog.js';

const router = Router();

router.get('/health', (_req, res) => {
  const dbStatus = checkDbConnection();

  return res.status(dbStatus.connected ? 200 : 500).json({
    ok: dbStatus.connected,
    api: 'gestor-tecnologia',
    db: dbStatus.connected ? 'connected' : 'disconnected',
    uptimeSeconds: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString()
  });
});

router.get('/meta/connection', (_req, res) => {
  const connection = checkDbConnection();

  return res.status(connection.connected ? 200 : 500).json({
    ok: connection.connected,
    connection: {
      engine: connection.engine,
      databasePath: connection.databasePath,
      status: connection.connected ? 'connected' : 'disconnected',
      error: connection.error || null
    }
  });
});

router.get('/meta/routes', (_req, res) => {
  return res.json({
    ok: true,
    total: ROUTE_CATALOG.length,
    routes: ROUTE_CATALOG
  });
});

export default router;
