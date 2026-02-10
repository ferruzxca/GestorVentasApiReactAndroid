import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dashboardRoutes from './routes/dashboardRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import metaRoutes from './routes/metaRoutes.js';

const app = express();
const PORT = Number.parseInt(process.env.PORT || '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map((origin) => origin.trim())
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.use('/api', metaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/', dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

app.use((error, _req, res, _next) => {
  // Keep consistent API errors and hide stack traces from clients.
  const message = error instanceof Error ? error.message : 'Error interno del servidor';
  res.status(500).json({ ok: false, message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API lista en http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Dashboard en http://localhost:${PORT}/dashboard`);
});
