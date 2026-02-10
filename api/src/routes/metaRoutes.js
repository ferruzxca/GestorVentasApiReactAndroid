import { Router } from 'express';
import { checkDbConnection, query } from '../db.js';
import { ROUTE_CATALOG } from '../utils/routeCatalog.js';

const router = Router();

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

router.get('/health', async (_req, res) => {
  const dbStatus = await checkDbConnection();
  const memory = process.memoryUsage();

  return res.status(dbStatus.connected ? 200 : 500).json({
    ok: dbStatus.connected,
    api: 'gestor-tecnologia',
    db: dbStatus.connected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    memory: {
      rssMB: Number((memory.rss / 1024 / 1024).toFixed(2)),
      heapUsedMB: Number((memory.heapUsed / 1024 / 1024).toFixed(2)),
      heapTotalMB: Number((memory.heapTotal / 1024 / 1024).toFixed(2))
    },
    uptimeSeconds: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString()
  });
});

router.get('/meta/connection', async (_req, res) => {
  const connection = await checkDbConnection();

  return res.status(connection.connected ? 200 : 500).json({
    ok: connection.connected,
    connection: {
      engine: connection.engine,
      host: connection.host || null,
      port: connection.port || null,
      database: connection.database || null,
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

router.get('/meta/stats', async (_req, res) => {
  try {
    const productSummaryResult = await query(`
      SELECT
        COUNT(*) AS products_total,
        SUM(CASE WHEN status = 'activo' THEN 1 ELSE 0 END) AS products_active,
        SUM(CASE WHEN status = 'inactivo' THEN 1 ELSE 0 END) AS products_inactive,
        COALESCE(SUM(cantidad_stock), 0) AS stock_total,
        COALESCE(SUM(cantidad_stock * precio), 0) AS inventory_value,
        SUM(CASE WHEN cantidad_stock <= 5 THEN 1 ELSE 0 END) AS low_stock_total
      FROM accesorios
    `);

    const userSummaryResult = await query(`
      SELECT
        COUNT(*) AS users_total,
        SUM(CASE WHEN rol = 'Administrador' THEN 1 ELSE 0 END) AS admins_total,
        SUM(CASE WHEN rol = 'Vendedor' THEN 1 ELSE 0 END) AS vendedores_total,
        SUM(CASE WHEN status = 'activo' THEN 1 ELSE 0 END) AS users_active,
        SUM(CASE WHEN status = 'inactivo' THEN 1 ELSE 0 END) AS users_inactive
      FROM usuarios
    `);

    const productStatusResult = await query(`
      SELECT status, COUNT(*) AS total
      FROM accesorios
      GROUP BY status
      ORDER BY status ASC
    `);

    const roleDistributionResult = await query(`
      SELECT rol, COUNT(*) AS total
      FROM usuarios
      GROUP BY rol
      ORDER BY rol ASC
    `);

    const topStockResult = await query(`
      SELECT id, nombre, marca, cantidad_stock, precio, status
      FROM accesorios
      ORDER BY cantidad_stock DESC, id DESC
      LIMIT 8
    `);

    const lowStockResult = await query(`
      SELECT id, nombre, marca, cantidad_stock, precio, status
      FROM accesorios
      WHERE cantidad_stock <= 5
      ORDER BY cantidad_stock ASC, id DESC
      LIMIT 8
    `);

    const productSummary = productSummaryResult.rows[0] || {};
    const userSummary = userSummaryResult.rows[0] || {};

    return res.json({
      ok: true,
      summary: {
        products_total: toNumber(productSummary.products_total),
        products_active: toNumber(productSummary.products_active),
        products_inactive: toNumber(productSummary.products_inactive),
        stock_total: toNumber(productSummary.stock_total),
        inventory_value: Number(toNumber(productSummary.inventory_value).toFixed(2)),
        low_stock_total: toNumber(productSummary.low_stock_total),
        users_total: toNumber(userSummary.users_total),
        admins_total: toNumber(userSummary.admins_total),
        vendedores_total: toNumber(userSummary.vendedores_total),
        users_active: toNumber(userSummary.users_active),
        users_inactive: toNumber(userSummary.users_inactive)
      },
      productStatus: productStatusResult.rows.map((row) => ({
        status: row.status,
        total: toNumber(row.total)
      })),
      roleDistribution: roleDistributionResult.rows.map((row) => ({
        rol: row.rol,
        total: toNumber(row.total)
      })),
      topStock: topStockResult.rows.map((row) => ({
        ...row,
        cantidad_stock: toNumber(row.cantidad_stock),
        precio: Number(toNumber(row.precio).toFixed(2))
      })),
      lowStock: lowStockResult.rows.map((row) => ({
        ...row,
        cantidad_stock: toNumber(row.cantidad_stock),
        precio: Number(toNumber(row.precio).toFixed(2))
      })),
      timestamp: new Date().toISOString()
    });
  } catch (_error) {
    return res.status(500).json({
      ok: false,
      message: 'No fue posible generar estadisticas del dashboard'
    });
  }
});

export default router;
