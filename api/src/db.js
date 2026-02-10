import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
const AUTO_INIT_DB = process.env.AUTO_INIT_DB !== 'false';
const SEED_INITIAL_DATA = process.env.SEED_INITIAL_DATA !== 'false';
const MYSQL_SSL = process.env.MYSQL_SSL !== 'false';
const MYSQL_SSL_REJECT_UNAUTHORIZED = process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== 'false';

function parseDatabaseUrl() {
  if (!DATABASE_URL) {
    return null;
  }

  const parsed = new URL(DATABASE_URL);

  return {
    host: parsed.hostname,
    port: Number(parsed.port || '3306'),
    user: decodeURIComponent(parsed.username || ''),
    password: decodeURIComponent(parsed.password || ''),
    database: parsed.pathname.replace('/', ''),
    protocol: parsed.protocol.replace(':', '')
  };
}

function buildSslConfig() {
  if (!MYSQL_SSL) {
    return undefined;
  }

  const certPath = process.env.MYSQL_CA_CERT_PATH;
  const certRaw = process.env.MYSQL_CA_CERT;

  if (certPath) {
    const absolutePath = path.resolve(process.cwd(), certPath);
    const ca = fs.readFileSync(absolutePath, 'utf8');

    return {
      rejectUnauthorized: MYSQL_SSL_REJECT_UNAUTHORIZED,
      ca
    };
  }

  if (certRaw) {
    return {
      rejectUnauthorized: MYSQL_SSL_REJECT_UNAUTHORIZED,
      ca: certRaw.replace(/\\n/g, '\n')
    };
  }

  return {
    rejectUnauthorized: MYSQL_SSL_REJECT_UNAUTHORIZED
  };
}

const connectionInfo = parseDatabaseUrl();

if (!connectionInfo && process.env.NODE_ENV !== 'test') {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL no definido. La API no podra iniciar.');
}

export const pool = mysql.createPool({
  host: connectionInfo?.host,
  port: connectionInfo?.port,
  user: connectionInfo?.user,
  password: connectionInfo?.password,
  database: connectionInfo?.database,
  ssl: buildSslConfig(),
  waitForConnections: true,
  connectionLimit: Number.parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  decimalNumbers: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const SCHEMA_QUERIES = [
  `CREATE TABLE IF NOT EXISTS accesorios (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad_stock INT NOT NULL,
    precio DECIMAL(12,2) NOT NULL,
    status ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    PRIMARY KEY (id),
    CONSTRAINT chk_stock_non_negative CHECK (cantidad_stock >= 0),
    CONSTRAINT chk_precio_non_negative CHECK (precio >= 0)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    rol ENUM('Administrador', 'Vendedor') NOT NULL,
    status ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_nombre (nombre)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
];

const SEED_QUERIES = [
  `INSERT IGNORE INTO usuarios (nombre, rol, status)
   VALUES
     ('Admin Principal', 'Administrador', 'activo'),
     ('Vendedor Demo', 'Vendedor', 'activo')`,
  `INSERT INTO accesorios (nombre, marca, descripcion, cantidad_stock, precio, status)
   SELECT 'Mouse RGB', 'HyperTech', 'Mouse optico con 7 botones programables', 24, 649.90, 'activo'
   WHERE NOT EXISTS (SELECT 1 FROM accesorios)`,
  `INSERT INTO accesorios (nombre, marca, descripcion, cantidad_stock, precio, status)
   SELECT 'Audifonos Gamer', 'NovaSound', 'Audio envolvente y microfono desmontable', 16, 1299.00, 'activo'
   WHERE (SELECT COUNT(*) FROM accesorios) = 1`
];

function getConnectionMetadata() {
  if (!connectionInfo) {
    return {
      engine: 'mysql',
      host: null,
      port: null,
      database: null,
      databasePath: null
    };
  }

  return {
    engine: 'mysql',
    host: connectionInfo.host,
    port: String(connectionInfo.port),
    database: connectionInfo.database,
    databasePath: connectionInfo.database
  };
}

export async function query(text, params = []) {
  const [rows] = await pool.execute(text, params);

  if (Array.isArray(rows)) {
    return { rows };
  }

  return {
    rows: [],
    insertId: rows.insertId ?? null,
    affectedRows: rows.affectedRows ?? 0
  };
}

export async function initDatabase() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL es requerido para conectar la API con Aiven MySQL');
  }

  if (connectionInfo && connectionInfo.protocol !== 'mysql') {
    throw new Error('DATABASE_URL invalido: debe iniciar con mysql://');
  }

  await query('SELECT 1');

  if (AUTO_INIT_DB) {
    for (const sql of SCHEMA_QUERIES) {
      await query(sql);
    }
  }

  if (AUTO_INIT_DB && SEED_INITIAL_DATA) {
    for (const sql of SEED_QUERIES) {
      await query(sql);
    }
  }
}

export async function checkDbConnection() {
  const connection = getConnectionMetadata();

  try {
    await query('SELECT 1');

    return {
      connected: true,
      ...connection
    };
  } catch (error) {
    return {
      connected: false,
      ...connection,
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}
