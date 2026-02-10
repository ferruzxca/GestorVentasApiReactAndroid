import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateUserPayload } from '../utils/validators.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('Administrador'));

router.get('/', (_req, res) => {
  const rows = db
    .prepare('SELECT id, nombre, rol, status FROM usuarios ORDER BY id DESC')
    .all();

  return res.json({ ok: true, total: rows.length, data: rows });
});

router.post('/', (req, res) => {
  const errors = validateUserPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, message: 'Validacion fallida', errors });
  }

  try {
    const result = db
      .prepare('INSERT INTO usuarios (nombre, rol, status) VALUES (?, ?, ?)')
      .run(req.body.nombre.trim(), req.body.rol, req.body.status);

    const user = db
      .prepare('SELECT id, nombre, rol, status FROM usuarios WHERE id = ?')
      .get(result.lastInsertRowid);

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente',
      data: user
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un usuario con ese nombre'
      });
    }

    return res.status(500).json({ ok: false, message: 'Error al crear usuario' });
  }
});

export default router;
