# API - GestorTecnologia

API REST para inventario de accesorios de computo.

## Inicio rapido

```bash
npm install
cp .env.example .env
npm run dev
```

- API: `http://localhost:4000`
- Dashboard: `http://localhost:4000/dashboard`

## Usuarios demo

- `Admin Principal` (Administrador)
- `Vendedor Demo` (Vendedor)

## Autenticacion

1. `POST /api/auth/login`
2. Usar `Authorization: Bearer <token>`

## Variables de entorno

- `PORT` (default `4000`)
- `JWT_SECRET`
- `CORS_ORIGIN`
- `DB_PATH` (default `data/gestor.db`)
