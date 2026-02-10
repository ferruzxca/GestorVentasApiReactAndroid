# Web - GestorTecnologia

Panel React para rol `Administrador`.

## Configuracion

Variables (`.env`):

```env
VITE_API_URL=https://TU_API.onrender.com
```

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Deploy en Render

Este proyecto se despliega con Docker (`web/Dockerfile`).
En Render configura `VITE_API_URL` apuntando al servicio API desplegado en Render.

## Alcance

- Login por nombre usando API.
- Bloquea acceso a rol `Vendedor`.
- Gestion de inventario (CRUD).
- Visor de estado y rutas JSON de la API.
