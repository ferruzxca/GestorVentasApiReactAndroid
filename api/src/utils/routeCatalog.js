export const ROUTE_CATALOG = [
  {
    method: 'GET',
    path: '/api/health',
    auth: 'Publica',
    description: 'Estado general de la API y conexion a base de datos.',
    sampleResponse: {
      ok: true,
      api: 'gestor-tecnologia',
      db: 'connected',
      uptimeSeconds: 123.45,
      timestamp: '2026-02-10T18:30:00.000Z'
    }
  },
  {
    method: 'GET',
    path: '/api/meta/connection',
    auth: 'Publica',
    description: 'Informacion de conexion actual de base de datos.',
    sampleResponse: {
      ok: true,
      connection: {
        engine: 'sqlite',
        databasePath: 'data/gestor.db',
        status: 'connected'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/meta/routes',
    auth: 'Publica',
    description: 'Lista de rutas disponibles y JSON de ejemplo.',
    sampleResponse: {
      ok: true,
      routes: [
        {
          method: 'GET',
          path: '/api/productos',
          auth: 'Token Administrador o Vendedor',
          description: 'Lista productos del inventario.'
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    auth: 'Publica',
    description: 'Autenticacion por nombre de usuario activo.',
    sampleRequest: {
      nombre: 'Admin Principal'
    },
    sampleResponse: {
      ok: true,
      token: '<jwt>',
      user: {
        id: 1,
        nombre: 'Admin Principal',
        rol: 'Administrador',
        status: 'activo'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/auth/profile',
    auth: 'Token Administrador o Vendedor',
    description: 'Regresa datos del usuario autenticado.',
    sampleResponse: {
      ok: true,
      user: {
        id: 1,
        nombre: 'Admin Principal',
        rol: 'Administrador',
        status: 'activo'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/productos',
    auth: 'Token Administrador o Vendedor',
    description: 'Consulta inventario de accesorios.',
    sampleResponse: {
      ok: true,
      total: 2,
      data: [
        {
          id: 1,
          nombre: 'Mouse RGB',
          marca: 'HyperTech',
          descripcion: 'Mouse optico con iluminacion',
          cantidad_stock: 24,
          precio: 649.9,
          status: 'activo'
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/productos',
    auth: 'Token Administrador',
    description: 'Crea un producto en inventario.',
    sampleRequest: {
      nombre: 'Teclado mecanico',
      marca: 'TechPro',
      descripcion: 'Switch rojo',
      cantidad_stock: 20,
      precio: 999,
      status: 'activo'
    },
    sampleResponse: {
      ok: true,
      message: 'Producto creado correctamente',
      data: {
        id: 9,
        nombre: 'Teclado mecanico',
        marca: 'TechPro',
        descripcion: 'Switch rojo',
        cantidad_stock: 20,
        precio: 999,
        status: 'activo'
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/productos/:id',
    auth: 'Token Administrador',
    description: 'Actualiza producto existente.',
    sampleRequest: {
      nombre: 'Teclado mecanico 2',
      marca: 'TechPro',
      descripcion: 'Version 2',
      cantidad_stock: 18,
      precio: 1049,
      status: 'activo'
    },
    sampleResponse: {
      ok: true,
      message: 'Producto actualizado correctamente'
    }
  },
  {
    method: 'PATCH',
    path: '/api/productos/:id/stock',
    auth: 'Token Administrador',
    description: 'Ajusta unicamente el stock de un producto.',
    sampleRequest: {
      cantidad_stock: 30
    },
    sampleResponse: {
      ok: true,
      message: 'Stock actualizado'
    }
  },
  {
    method: 'DELETE',
    path: '/api/productos/:id',
    auth: 'Token Administrador',
    description: 'Desactiva producto (borrado logico).',
    sampleResponse: {
      ok: true,
      message: 'Producto desactivado correctamente'
    }
  },
  {
    method: 'GET',
    path: '/api/usuarios',
    auth: 'Token Administrador',
    description: 'Lista usuarios y roles.',
    sampleResponse: {
      ok: true,
      total: 2,
      data: [
        {
          id: 1,
          nombre: 'Admin Principal',
          rol: 'Administrador',
          status: 'activo'
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/usuarios',
    auth: 'Token Administrador',
    description: 'Crea usuario para web o app movil.',
    sampleRequest: {
      nombre: 'Vendedor Norte',
      rol: 'Vendedor',
      status: 'activo'
    },
    sampleResponse: {
      ok: true,
      message: 'Usuario creado correctamente'
    }
  }
];
