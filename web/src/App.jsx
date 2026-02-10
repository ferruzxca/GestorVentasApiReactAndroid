import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

const EMPTY_FORM = {
  nombre: '',
  marca: '',
  descripcion: '',
  cantidad_stock: 0,
  precio: 0,
  status: 'activo'
};

function asNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function App() {
  const [loginNombre, setLoginNombre] = useState('Admin Principal');
  const [token, setToken] = useState(localStorage.getItem('gt_token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('gt_user');
    return raw ? JSON.parse(raw) : null;
  });

  const [health, setHealth] = useState(null);
  const [connection, setConnection] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [openRouteIndex, setOpenRouteIndex] = useState(-1);

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const [healthRes, connRes, routesRes] = await Promise.all([
          api.get('/api/health'),
          api.get('/api/meta/connection'),
          api.get('/api/meta/routes')
        ]);
        setHealth(healthRes.data);
        setConnection(connRes.data.connection);
        setRoutes(routesRes.data.routes || []);
      } catch (_error) {
        setMessage({ type: 'error', text: 'No se pudo cargar estado publico de la API.' });
      }
    };

    loadPublicData();
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadPrivateData = async () => {
      setLoading(true);
      try {
        const [profileRes, productsRes, usersRes] = await Promise.all([
          api.get('/api/auth/profile', authHeaders),
          api.get('/api/productos', authHeaders),
          api.get('/api/usuarios', authHeaders)
        ]);

        setUser(profileRes.data.user);
        setProducts(productsRes.data.data || []);
        setUsers(usersRes.data.data || []);
      } catch (_error) {
        setToken('');
        setUser(null);
        localStorage.removeItem('gt_token');
        localStorage.removeItem('gt_user');
        setMessage({ type: 'error', text: 'Sesion invalida. Vuelve a iniciar sesion.' });
      } finally {
        setLoading(false);
      }
    };

    loadPrivateData();
  }, [token, authHeaders]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await api.post('/api/auth/login', { nombre: loginNombre });

      if (data.user.rol !== 'Administrador') {
        setMessage({
          type: 'error',
          text: 'Solo rol Administrador puede entrar a la web. Vendedor es para app movil.'
        });
        return;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('gt_token', data.token);
      localStorage.setItem('gt_user', JSON.stringify(data.user));
      setMessage({ type: 'ok', text: `Bienvenido ${data.user.nombre}` });
    } catch (_error) {
      setMessage({ type: 'error', text: 'No se pudo iniciar sesion con ese usuario.' });
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setProducts([]);
    setUsers([]);
    localStorage.removeItem('gt_token');
    localStorage.removeItem('gt_user');
    setMessage({ type: '', text: '' });
  };

  const refreshPrivateData = async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    try {
      const [productsRes, usersRes, healthRes] = await Promise.all([
        api.get('/api/productos', authHeaders),
        api.get('/api/usuarios', authHeaders),
        api.get('/api/health')
      ]);
      setProducts(productsRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setHealth(healthRes.data);
      setMessage({ type: 'ok', text: 'Datos actualizados.' });
    } catch (_error) {
      setMessage({ type: 'error', text: 'No se pudieron actualizar datos.' });
    } finally {
      setLoading(false);
    }
  };

  const onFormChange = (event) => {
    const { name, value } = event.target;

    if (name === 'cantidad_stock' || name === 'precio') {
      setForm((prev) => ({ ...prev, [name]: asNumber(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingId) {
        await api.put(`/api/productos/${editingId}`, form, authHeaders);
        setMessage({ type: 'ok', text: 'Producto actualizado.' });
      } else {
        await api.post('/api/productos', form, authHeaders);
        setMessage({ type: 'ok', text: 'Producto creado.' });
      }

      resetForm();
      const productsRes = await api.get('/api/productos', authHeaders);
      setProducts(productsRes.data.data || []);
    } catch (_error) {
      setMessage({ type: 'error', text: 'No se pudo guardar el producto.' });
    } finally {
      setBusy(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingId(product.id);
    setForm({
      nombre: product.nombre,
      marca: product.marca,
      descripcion: product.descripcion,
      cantidad_stock: product.cantidad_stock,
      precio: product.precio,
      status: product.status
    });
  };

  const handleDeactivateProduct = async (productId) => {
    setBusy(true);
    try {
      await api.delete(`/api/productos/${productId}`, authHeaders);
      const productsRes = await api.get('/api/productos', authHeaders);
      setProducts(productsRes.data.data || []);
      setMessage({ type: 'ok', text: 'Producto desactivado.' });
    } catch (_error) {
      setMessage({ type: 'error', text: 'No se pudo desactivar el producto.' });
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <p className="badge">Gestor Tecnologia</p>
          <h1>Panel Web Administrador</h1>
          <p className="helper">
            Proyecto de gestion de accesorios de computo. Usa por defecto el usuario <strong>Admin Principal</strong>.
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <label htmlFor="nombre">Nombre de usuario</label>
            <input
              id="nombre"
              type="text"
              value={loginNombre}
              onChange={(event) => setLoginNombre(event.target.value)}
              placeholder="Admin Principal"
              required
            />
            <button type="submit" disabled={busy}>
              {busy ? 'Entrando...' : 'Iniciar sesion'}
            </button>
          </form>

          <p className="helper">La API de prueba tambien incluye: Vendedor Demo (solo movil).</p>
          {message.text && <p className={`flash ${message.type}`}>{message.text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="badge">Gestor Accesorios</p>
          <h1>Dashboard Administrador</h1>
          <p className="helper small-gap">Conectado como {user?.nombre || 'Administrador'}.</p>
        </div>
        <div className="actions">
          <button onClick={refreshPrivateData} disabled={loading || busy}>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <a href={`${API_URL}/dashboard`} target="_blank" rel="noreferrer" className="link-button">
            Ver dashboard API
          </a>
          <button onClick={handleLogout} className="ghost-button">
            Cerrar sesion
          </button>
        </div>
      </header>

      {message.text && <p className={`flash ${message.type}`}>{message.text}</p>}

      <section className="status-grid">
        <article className="status-card">
          <h2>Funcionamiento API</h2>
          <p className={`status ${health?.ok ? 'ok' : 'error'}`}>
            {health?.ok ? 'Operando' : 'Sin respuesta'}
          </p>
          <p>Uptime: {health?.uptimeSeconds ?? '-'}s</p>
          <p>Timestamp: {health?.timestamp || '-'}</p>
        </article>

        <article className="status-card">
          <h2>Conexion DB</h2>
          <p>Engine: {connection?.engine || '-'}</p>
          <p>Ruta: {connection?.databasePath || '-'}</p>
          <p>
            Estado: <span className={connection?.status === 'connected' ? 'ok' : 'error'}>{connection?.status || '-'}</span>
          </p>
        </article>

        <article className="status-card">
          <h2>Resumen</h2>
          <p>Productos: {products.length}</p>
          <p>Usuarios: {users.length}</p>
          <p>Rol web habilitado: Administrador</p>
        </article>
      </section>

      <main className="content-grid">
        <section className="panel">
          <h2>{editingId ? 'Editar producto' : 'Nuevo producto'}</h2>
          <form onSubmit={handleSubmitProduct} className="product-form">
            <label>
              Nombre
              <input name="nombre" value={form.nombre} onChange={onFormChange} required />
            </label>
            <label>
              Marca
              <input name="marca" value={form.marca} onChange={onFormChange} required />
            </label>
            <label>
              Descripcion
              <textarea name="descripcion" value={form.descripcion} onChange={onFormChange} required rows={3} />
            </label>
            <label>
              Stock
              <input
                name="cantidad_stock"
                type="number"
                min="0"
                value={form.cantidad_stock}
                onChange={onFormChange}
                required
              />
            </label>
            <label>
              Precio
              <input
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={onFormChange}
                required
              />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={onFormChange}>
                <option value="activo">activo</option>
                <option value="inactivo">inactivo</option>
              </select>
            </label>
            <div className="form-buttons">
              <button type="submit" disabled={busy}>{editingId ? 'Guardar cambios' : 'Crear producto'}</button>
              {editingId ? (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="panel wide">
          <h2>Inventario</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Status</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.nombre}</td>
                    <td>{product.marca}</td>
                    <td>{product.cantidad_stock}</td>
                    <td>${product.precio}</td>
                    <td>
                      <span className={product.status === 'activo' ? 'ok' : 'error'}>{product.status}</span>
                    </td>
                    <td className="action-cell">
                      <button type="button" onClick={() => handleEditProduct(product)}>Editar</button>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => handleDeactivateProduct(product.id)}
                      >
                        Desactivar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <h2>Usuarios y roles</h2>
          <ul className="list">
            {users.map((item) => (
              <li key={item.id}>
                <span>{item.nombre}</span>
                <span>{item.rol}</span>
                <span className={item.status === 'activo' ? 'ok' : 'error'}>{item.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel wide">
          <h2>Rutas API para consumir</h2>
          <div className="routes-list">
            {routes.map((route, index) => (
              <article className="route-card" key={`${route.method}-${route.path}`}>
                <div>
                  <span className="method">{route.method}</span>
                  <strong>{route.path}</strong>
                </div>
                <p>{route.description}</p>
                <p className="small-gap">Auth: {route.auth}</p>
                <button
                  type="button"
                  onClick={() => setOpenRouteIndex(openRouteIndex === index ? -1 : index)}
                >
                  {openRouteIndex === index ? 'Ocultar JSON' : 'Ver JSON de ejemplo'}
                </button>
                {openRouteIndex === index ? (
                  <pre>
                    {JSON.stringify(
                      {
                        request: route.sampleRequest || null,
                        response: route.sampleResponse || null
                      },
                      null,
                      2
                    )}
                  </pre>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
