import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/catalogo', async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const marca = typeof req.query.marca === 'string' ? req.query.marca.trim() : '';

  const filters = ["status = 'activo'"];
  const values = [];

  if (search) {
    filters.push('(nombre LIKE ? OR marca LIKE ? OR descripcion LIKE ?)');
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (marca) {
    filters.push('marca LIKE ?');
    values.push(`%${marca}%`);
  }

  const where = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  try {
    const result = await query(
      `SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status
       FROM accesorios
       ${where}
       ORDER BY nombre ASC`,
      values
    );

    const data = result.rows.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      marca: item.marca,
      descripcion: item.descripcion,
      precio: Number(item.precio),
      disponible: Number(item.cantidad_stock) > 0,
      stock: Number(item.cantidad_stock)
    }));

    return res.json({
      ok: true,
      total: data.length,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (_error) {
    return res.status(500).json({
      ok: false,
      message: 'No fue posible consultar el catalogo publico'
    });
  }
});

export default router;
