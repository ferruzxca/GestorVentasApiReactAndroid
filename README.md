# GestorTecnologia

Proyecto de gestion de **Accesorios de Computo** con:
- API REST (para web React y aplicacion movil)
- Web React (solo para rol `Administrador`)
- Deploy en Render
- Base de datos **MySQL en Aiven**

No incluye desarrollo de app movil en este alcance.

## Estructura

```
GestorTecnologia/
  api/
    sql/aiven_init.sql      # Script SQL para Aiven MySQL
  web/
  docker-compose.yml        # Ejecuta web + api, usando DB remota
  render.yaml               # Blueprint para Render
```

## Roles

- `Administrador`: puede entrar a la web y gestionar inventario.
- `Vendedor`: pensado para consumir API desde app movil.

## Base de datos (Aiven MySQL)

Tablas requeridas:

### `accesorios`
- `id`
- `nombre`
- `marca`
- `descripcion`
- `cantidad_stock`
- `precio`
- `status`

### `usuarios`
- `id`
- `nombre`
- `rol`
- `status`

Script oficial de inicializacion:
- `api/sql/aiven_init.sql`

Ejecutalo en Aiven (MySQL CLI):

```bash
mysql \
  --host="$AIVEN_HOST" \
  --port="$AIVEN_PORT" \
  --user="$AIVEN_USER" \
  --password \
  --ssl-mode=REQUIRED \
  "$AIVEN_DB" < api/sql/aiven_init.sql
```

Datos semilla incluidos:
- `Admin Principal` (`Administrador`)
- `Vendedor Demo` (`Vendedor`)

## API y dashboard

- Dashboard API: `GET /dashboard`
- Salud API: `GET /api/health`
- Conexion DB: `GET /api/meta/connection`
- Catalogo de rutas + JSON ejemplo: `GET /api/meta/routes`

## Consumo rapido

1. Login:
```bash
curl -X POST https://TU_API.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Admin Principal"}'
```

2. Usa el token en headers:
```bash
Authorization: Bearer TU_TOKEN
```

3. Consultar inventario:
```bash
curl https://TU_API.onrender.com/api/productos \
  -H "Authorization: Bearer TU_TOKEN"
```

## Deploy en Render (API + Web)

Este repo ya incluye `render.yaml`.

1. Sube repo a GitHub.
2. En Render usa **Blueprint** apuntando al repo.
3. En servicio API define `DATABASE_URL` con la cadena `mysql://...` de Aiven.
4. En API define:
   - `MYSQL_SSL=true`
   - `MYSQL_SSL_REJECT_UNAUTHORIZED=false` (o `true` si montas CA)
5. Ajusta `CORS_ORIGIN` con la URL real del frontend en Render.
6. En servicio web confirma `VITE_API_URL` con la URL real de la API.

## Variables importantes API

- `DATABASE_URL` (Aiven MySQL)
- `JWT_SECRET`
- `CORS_ORIGIN`
- `MYSQL_SSL`
- `MYSQL_SSL_REJECT_UNAUTHORIZED`
- `AUTO_INIT_DB`
- `SEED_INITIAL_DATA`

## Ramas Git solicitadas

Ya existe flujo con ramas:
- `api`
- `web`
- `mobile`

Y merge final a `main`.
