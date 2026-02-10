import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res) => {
  const { nombre } = req.body || {};

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({
      ok: false,
      message: 'nombre es requerido para iniciar sesion'
    });
  }

  const user = db
    .prepare('SELECT id, nombre, rol, status FROM usuarios WHERE nombre = ?')
    .get(nombre.trim());

  if (!user || user.status !== 'activo') {
    return res.status(401).json({
      ok: false,
      message: 'Usuario no encontrado o inactivo'
    });
  }

  const token = signToken(user);

  return res.json({
    ok: true,
    token,
    user
  });
});

router.get('/profile', requireAuth, (req, res) => {
  const dbUser = db
    .prepare('SELECT id, nombre, rol, status FROM usuarios WHERE id = ?')
    .get(req.user.id);

  if (!dbUser || dbUser.status !== 'activo') {
    return res.status(401).json({
      ok: false,
      message: 'Usuario invalido o inactivo'
    });
  }

  return res.json({
    ok: true,
    user: dbUser
  });
});

export default router;
