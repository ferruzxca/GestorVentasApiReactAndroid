import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateUserPayload } from '../utils/validators.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('Administrador'));

router.get('/', async (_req, res) => {
  try {
    const result = await query('SELECT id, nombre, rol, status FROM usuarios ORDER BY id DESC');
    return res.json({ ok: true, total: result.rows.length, data: result.rows });
  } catch (_error) {
    return res.status(500).json({ ok: false, message: 'No fue posible consultar usuarios' });
  }
});

router.post('/', async (req, res) => {
  const errors = validateUserPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, message: 'Validacion fallida', errors });
  }

  try {
    const insertResult = await query(
      `INSERT INTO usuarios (nombre, rol, status)
       VALUES (?, ?, ?)`,
      [req.body.nombre.trim(), req.body.rol, req.body.status]
    );

    const readResult = await query(
      'SELECT id, nombre, rol, status FROM usuarios WHERE id = ?',
      [insertResult.insertId]
    );

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente',
      data: readResult.rows[0] || null
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un usuario con ese nombre'
      });
    }

    return res.status(500).json({ ok: false, message: 'Error al crear usuario' });
  }
});

export default router;
