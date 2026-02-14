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
      environment: 'production',
      nodeVersion: 'v22.14.0',
      memory: {
        rssMB: 86.73,
        heapUsedMB: 29.17,
        heapTotalMB: 39.42
      },
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
        engine: 'mysql',
        host: 'mysql-xxxx.aivencloud.com',
        port: '12970',
        database: 'defaultdb',
        databasePath: 'defaultdb',
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
    method: 'GET',
    path: '/api/meta/stats',
    auth: 'Publica',
    description: 'Estadisticas agregadas para dashboard: productos, stock, roles y tablas top/bajo stock.',
    sampleResponse: {
      ok: true,
      summary: {
        products_total: 18,
        products_active: 15,
        products_inactive: 3,
        stock_total: 177,
        inventory_value: 83456.9,
        low_stock_total: 4,
        users_total: 5,
        admins_total: 2,
        vendedores_total: 3,
        users_active: 5,
        users_inactive: 0
      },
      productStatus: [
        { status: 'activo', total: 15 },
        { status: 'inactivo', total: 3 }
      ],
      roleDistribution: [
        { rol: 'Administrador', total: 2 },
        { rol: 'Vendedor', total: 3 }
      ],
      topStock: [
        {
          id: 1,
          nombre: 'Mouse RGB',
          marca: 'HyperTech',
          cantidad_stock: 24,
          precio: 649.9,
          status: 'activo'
        }
      ],
      lowStock: [
        {
          id: 8,
          nombre: 'SSD NVMe 1TB',
          marca: 'FastCore',
          cantidad_stock: 2,
          precio: 1599,
          status: 'activo'
        }
      ],
      timestamp: '2026-02-10T18:30:00.000Z'
    }
  },
  {
    method: 'GET',
    path: '/api/public/catalogo',
    auth: 'Publica',
    description: 'Catalogo simplificado para clientes (sin autenticacion).',
    sampleResponse: {
      ok: true,
      total: 2,
      data: [
        {
          id: 1,
          nombre: 'Mouse RGB',
          marca: 'HyperTech',
          descripcion: 'Mouse optico con iluminacion',
          precio: 649.9,
          disponible: true,
          stock: 24
        }
      ],
      timestamp: '2026-02-10T18:30:00.000Z'
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
