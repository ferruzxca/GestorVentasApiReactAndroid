import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateProductPayload, validateStockPayload } from '../utils/validators.js';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res) => {
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

  const rows = db
    .prepare(`SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status FROM accesorios ${where} ORDER BY id DESC`)
    .all(...values);

  return res.json({
    ok: true,
    total: rows.length,
    data: rows
  });
});

router.get('/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ ok: false, message: 'id invalido' });
  }

  const row = db
    .prepare('SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status FROM accesorios WHERE id = ?')
    .get(id);

  if (!row) {
    return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
  }

  return res.json({ ok: true, data: row });
});

router.post('/', requireRole('Administrador'), (req, res) => {
  const errors = validateProductPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, message: 'Validacion fallida', errors });
  }

  const stmt = db.prepare(`
    INSERT INTO accesorios (nombre, marca, descripcion, cantidad_stock, precio, status)
    VALUES (@nombre, @marca, @descripcion, @cantidad_stock, @precio, @status)
  `);

  const result = stmt.run(req.body);

  const created = db
    .prepare('SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status FROM accesorios WHERE id = ?')
    .get(result.lastInsertRowid);

  return res.status(201).json({
    ok: true,
    message: 'Producto creado correctamente',
    data: created
  });
});

router.put('/:id', requireRole('Administrador'), (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ ok: false, message: 'id invalido' });
  }

  const errors = validateProductPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, message: 'Validacion fallida', errors });
  }

  const existing = db.prepare('SELECT id FROM accesorios WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
  }

  db.prepare(`
    UPDATE accesorios
    SET nombre = @nombre,
        marca = @marca,
        descripcion = @descripcion,
        cantidad_stock = @cantidad_stock,
        precio = @precio,
        status = @status
    WHERE id = @id
  `).run({ ...req.body, id });

  const updated = db
    .prepare('SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status FROM accesorios WHERE id = ?')
    .get(id);

  return res.json({
    ok: true,
    message: 'Producto actualizado correctamente',
    data: updated
  });
});

router.patch('/:id/stock', requireRole('Administrador'), (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ ok: false, message: 'id invalido' });
  }

  const errors = validateStockPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, message: 'Validacion fallida', errors });
  }

  const exists = db.prepare('SELECT id FROM accesorios WHERE id = ?').get(id);
  if (!exists) {
    return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
  }

  db.prepare('UPDATE accesorios SET cantidad_stock = ? WHERE id = ?').run(req.body.cantidad_stock, id);

  const updated = db
    .prepare('SELECT id, nombre, marca, descripcion, cantidad_stock, precio, status FROM accesorios WHERE id = ?')
    .get(id);

  return res.json({ ok: true, message: 'Stock actualizado', data: updated });
});

router.delete('/:id', requireRole('Administrador'), (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ ok: false, message: 'id invalido' });
  }

  const exists = db.prepare('SELECT id FROM accesorios WHERE id = ?').get(id);
  if (!exists) {
    return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
  }

  db.prepare("UPDATE accesorios SET status = 'inactivo' WHERE id = ?").run(id);

  return res.json({ ok: true, message: 'Producto desactivado correctamente' });
});

export default router;
