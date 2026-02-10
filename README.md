# GestorTecnologia

Proyecto de gestion de **Accesorios de Computo** con:
- API REST (para web y app movil)
- Web React (solo Administrador)
- Despliegue en Docker y Render

No incluye desarrollo de app movil (solo API para surtirla).

## Estructura

```
GestorTecnologia/
  api/                  # API Node.js + Express + SQLite
  web/                  # Dashboard web React (Administrador)
  docker-compose.yml    # Levantar API + Web en local
  render.yaml           # Blueprint Render
```

## Reglas de rol

- `Administrador`: acceso a pagina web y gestion de inventario.
- `Vendedor`: acceso esperado para app movil (no desarrollada aqui).

La web valida rol y bloquea usuarios `Vendedor`.

## Base de datos

La API crea automaticamente las tablas requeridas:

### Tabla `accesorios`
- `id`
- `nombre`
- `marca`
- `descripcion`
- `cantidad_stock`
- `precio`
- `status`

### Tabla `usuarios`
- `id`
- `nombre`
- `rol` (`Administrador` | `Vendedor`)
- `status`

Datos semilla:
- `Admin Principal` (`Administrador`)
- `Vendedor Demo` (`Vendedor`)

## Dashboard de API

Al iniciar API abre:
- `GET /dashboard`

Incluye:
- visor de funcionamiento (`/api/health`)
- datos de conexion (`/api/meta/connection`)
- rutas disponibles y JSON de ejemplo (`/api/meta/routes`)

## Endpoints principales

Publicos:
- `GET /api/health`
- `GET /api/meta/connection`
- `GET /api/meta/routes`
- `POST /api/auth/login`

Con token (`Authorization: Bearer <token>`):
- `GET /api/auth/profile`
- `GET /api/productos`
- `GET /api/productos/:id`

Solo Administrador:
- `POST /api/productos`
- `PUT /api/productos/:id`
- `PATCH /api/productos/:id/stock`
- `DELETE /api/productos/:id` (borrado logico)
- `GET /api/usuarios`
- `POST /api/usuarios`

## Como consumir la API (breve)

1. Login:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Admin Principal"}'
```

2. Guarda `token` de la respuesta.

3. Consulta inventario:
```bash
curl http://localhost:4000/api/productos \
  -H "Authorization: Bearer TU_TOKEN"
```

4. Crear producto (Administrador):
```bash
curl -X POST http://localhost:4000/api/productos \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Teclado Mecanico",
    "marca":"TechPro",
    "descripcion":"Switch rojo",
    "cantidad_stock":20,
    "precio":999,
    "status":"activo"
  }'
```

## Ejecutar en local

### Opcion 1: Docker Compose
```bash
docker compose up --build
```

Servicios:
- API: `http://localhost:4000`
- Dashboard API: `http://localhost:4000/dashboard`
- Web React: `http://localhost:5173`

### Opcion 2: modo desarrollo
Terminal 1:
```bash
cd api
cp .env.example .env
npm install
npm run dev
```

Terminal 2:
```bash
cd web
cp .env.example .env
npm install
npm run dev
```

## Deploy en Render

Este repo incluye `render.yaml` con 2 servicios Docker:
- `gestor-tecnologia-api`
- `gestor-tecnologia-web`

Pasos:
1. Subir repo a GitHub.
2. En Render, crear servicio con **Blueprint** apuntando al repo.
3. Confirmar que `VITE_API_URL` del web apunte a tu URL real de API.
4. Confirmar `CORS_ORIGIN` en API con URL real de web.

## Flujo de ramas solicitado

Desde `main`:

```bash
git checkout -b api
# trabajo API

git checkout main
git checkout -b web
# trabajo web

git checkout main
git checkout -b mobile
# rama reservada para app movil (sin implementacion por ahora)
```

Merge final sugerido:

```bash
git checkout main
git merge api
git merge web
git merge mobile
```

Luego push:

```bash
git push -u origin main
git push -u origin api
git push -u origin web
git push -u origin mobile
```
