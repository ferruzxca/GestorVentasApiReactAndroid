import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateProductPayload, validateStockPayload } from '../utils/validators.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const { status, marca, nombre } = req.query;
  const filters = [];
  const values = [];

  if (status) {
    filters.push('status = ?');
    values.push(status);
  }

  if (marca) {
    filters.push('marca LIKE ?');
    values.push(`%${marca}%`);
  }

  if (nombre) {
    filters.push('nombre LIKE ?');
    values.push(`%${nombre}%`);
  }

  const where = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  try {
    const result = await query(
      `SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status
       FROM accesorios
       ${where}
       ORDER BY id DESC`,
      values
    );

    return res.json({
      ok: true,
      total: result.rows.length,
      data: result.rows
    });
  } catch (_error) {
    return res.status(500).json({ ok: false, message: 'No fue posible consultar productos' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ ok: false, message: 'id invalido' });
  }

  try {
    const result = await query(
      'SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status FROM accesorios WHERE id = ?',
      [id]
    );

    const row = result.rows[0] || null;

    if (!row) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    return res.json({ ok: true, data: row });
  } catch (_error) {
    return res.status(500).json({ ok: false, message: 'No fue posible consultar el producto' });
  }
});

router.post('/', requireRole('Administrador'), async (req, res) => {
  const errors = validateProductPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, message: 'Validacion fallida', errors });
  }

  try {
    const insertResult = await query(
      `INSERT INTO accesorios (nombre, marca, descripcion, cantidad_stock, precio, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.body.nombre.trim(),
        req.body.marca.trim(),
        req.body.descripcion.trim(),
        req.body.cantidad_stock,
        req.body.precio,
        req.body.status
      ]
    );

    const readResult = await query(
      'SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status FROM accesorios WHERE id = ?',
      [insertResult.insertId]
    );

    return res.status(201).json({
      ok: true,
      message: 'Producto creado correctamente',
      data: readResult.rows[0] || null
    });
  } catch (_error) {
    return res.status(500).json({ ok: false, message: 'No fue posible crear el producto' });
  }
});

router.put('/:id', requireRole('Administrador'), async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ ok: false, message: 'id invalido' });
  }

  const errors = validateProductPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, message: 'Validacion fallida', errors });
  }

  try {
    const updateResult = await query(
      `UPDATE accesorios
       SET nombre = ?,
           marca = ?,
           descripcion = ?,
           cantidad_stock = ?,
           precio = ?,
           status = ?
       WHERE id = ?`,
      [
        req.body.nombre.trim(),
        req.body.marca.trim(),
        req.body.descripcion.trim(),
        req.body.cantidad_stock,
        req.body.precio,
        req.body.status,
        id
      ]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    const readResult = await query(
      'SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status FROM accesorios WHERE id = ?',
      [id]
    );

    return res.json({
      ok: true,
      message: 'Producto actualizado correctamente',
      data: readResult.rows[0] || null
    });
  } catch (_error) {
    return res.status(500).json({ ok: false, message: 'No fue posible actualizar el producto' });
  }
});

router.patch('/:id/stock', requireRole('Administrador'), async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ ok: false, message: 'id invalido' });
  }

  const errors = validateStockPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, message: 'Validacion fallida', errors });
  }

  try {
    const updateResult = await query(
      `UPDATE accesorios
       SET cantidad_stock = ?
       WHERE id = ?`,
      [req.body.cantidad_stock, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    const readResult = await query(
      'SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status FROM accesorios WHERE id = ?',
      [id]
    );

    return res.json({ ok: true, message: 'Stock actualizado', data: readResult.rows[0] || null });
  } catch (_error) {
    return res.status(500).json({ ok: false, message: 'No fue posible actualizar el stock' });
  }
});

router.delete('/:id', requireRole('Administrador'), async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ ok: false, message: 'id invalido' });
  }

  try {
    const updateResult = await query(
      "UPDATE accesorios SET status = 'inactivo' WHERE id = ?",
      [id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    return res.json({ ok: true, message: 'Producto desactivado correctamente' });
  } catch (_error) {
    return res.status(500).json({ ok: false, message: 'No fue posible desactivar el producto' });
  }
});

export default router;
