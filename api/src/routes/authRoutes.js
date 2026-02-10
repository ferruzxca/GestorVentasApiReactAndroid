import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { nombre } = req.body || {};

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({
      ok: false,
      message: 'nombre es requerido para iniciar sesion'
    });
  }

  try {
    const result = await query(
      'SELECT id, nombre, rol, status FROM usuarios WHERE nombre = ?',
      [nombre.trim()]
    );

    const user = result.rows[0] || null;

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
  } catch (_error) {
    return res.status(500).json({
      ok: false,
      message: 'No fue posible autenticar el usuario'
    });
  }
});

router.get('/profile', requireAuth, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, nombre, rol, status FROM usuarios WHERE id = ?',
      [req.user.id]
    );

    const dbUser = result.rows[0] || null;

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
  } catch (_error) {
    return res.status(500).json({
      ok: false,
      message: 'No fue posible consultar el perfil'
    });
  }
});

export default router;
