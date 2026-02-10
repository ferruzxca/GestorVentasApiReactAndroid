# API - GestorTecnologia

API REST para inventario de accesorios de computo.

## Base de datos obligatoria

La API usa **MySQL remoto (Aiven)** via `DATABASE_URL`.
No usa SQLite.

Script SQL de inicializacion:
- `sql/aiven_init.sql`

Ejecutar en Aiven:

```bash
mysql \
  --host="$AIVEN_HOST" \
  --port="$AIVEN_PORT" \
  --user="$AIVEN_USER" \
  --password \
  --ssl-mode=REQUIRED \
  "$AIVEN_DB" < sql/aiven_init.sql
```

## Inicio rapido (desarrollo)

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
- `DATABASE_URL` (Aiven MySQL)
- `MYSQL_SSL`
- `MYSQL_SSL_REJECT_UNAUTHORIZED`
- `AUTO_INIT_DB`
- `SEED_INITIAL_DATA`
