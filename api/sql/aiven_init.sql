-- GestorTecnologia - Aiven MySQL schema
-- Ejecutar este script en la base de datos de Aiven antes de desplegar la API en Render.

CREATE TABLE IF NOT EXISTS accesorios (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  rol ENUM('Administrador', 'Vendedor') NOT NULL,
  status ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO usuarios (nombre, rol, status)
VALUES
  ('Admin Principal', 'Administrador', 'activo'),
  ('Vendedor Demo', 'Vendedor', 'activo');

INSERT INTO accesorios (nombre, marca, descripcion, cantidad_stock, precio, status)
SELECT 'Mouse RGB', 'HyperTech', 'Mouse optico con 7 botones programables', 24, 649.90, 'activo'
WHERE NOT EXISTS (SELECT 1 FROM accesorios);

INSERT INTO accesorios (nombre, marca, descripcion, cantidad_stock, precio, status)
SELECT 'Audifonos Gamer', 'NovaSound', 'Audio envolvente y microfono desmontable', 16, 1299.00, 'activo'
WHERE (SELECT COUNT(*) FROM accesorios) = 1;
