import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const dbRelativePath = process.env.DB_PATH || 'data/gestor.db';
const dbPath = path.resolve(process.cwd(), dbRelativePath);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS accesorios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  marca TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  cantidad_stock INTEGER NOT NULL CHECK(cantidad_stock >= 0),
  precio REAL NOT NULL CHECK(precio >= 0),
  status TEXT NOT NULL CHECK(status IN ('activo', 'inactivo')) DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL CHECK(rol IN ('Administrador', 'Vendedor')),
  status TEXT NOT NULL CHECK(status IN ('activo', 'inactivo')) DEFAULT 'activo'
);
`);

const userCount = db.prepare('SELECT COUNT(*) as total FROM usuarios').get();
if (userCount.total === 0) {
  const seedUsers = db.prepare(`
    INSERT INTO usuarios (nombre, rol, status)
    VALUES (@nombre, @rol, @status)
  `);

  seedUsers.run({ nombre: 'Admin Principal', rol: 'Administrador', status: 'activo' });
  seedUsers.run({ nombre: 'Vendedor Demo', rol: 'Vendedor', status: 'activo' });
}

const productCount = db.prepare('SELECT COUNT(*) as total FROM accesorios').get();
if (productCount.total === 0) {
  const seedProducts = db.prepare(`
    INSERT INTO accesorios (nombre, marca, descripcion, cantidad_stock, precio, status)
    VALUES (@nombre, @marca, @descripcion, @cantidad_stock, @precio, @status)
  `);

  seedProducts.run({
    nombre: 'Mouse RGB',
    marca: 'HyperTech',
    descripcion: 'Mouse optico con 7 botones programables',
    cantidad_stock: 24,
    precio: 649.9,
    status: 'activo'
  });

  seedProducts.run({
    nombre: 'Audifonos Gamer',
    marca: 'NovaSound',
    descripcion: 'Audio envolvente y microfono desmontable',
    cantidad_stock: 16,
    precio: 1299,
    status: 'activo'
  });
}

export function checkDbConnection() {
  try {
    db.prepare('SELECT 1 as ok').get();
    return { connected: true, engine: 'sqlite', databasePath: dbRelativePath };
  } catch (error) {
    return {
      connected: false,
      engine: 'sqlite',
      databasePath: dbRelativePath,
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}
