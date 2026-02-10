import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-this';
const TOKEN_PREFIX = 'Bearer ';

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      nombre: user.nombre,
      rol: user.rol,
      status: user.status
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(TOKEN_PREFIX)) {
    return res.status(401).json({
      ok: false,
      message: 'Token requerido. Usa Authorization: Bearer <token>'
    });
  }

  const token = authHeader.slice(TOKEN_PREFIX.length).trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Token invalido o expirado'
    });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, message: 'No autenticado' });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        ok: false,
        message: `Rol no autorizado. Requerido: ${roles.join(' o ')}`
      });
    }

    return next();
  };
}
