-- ========================================
-- ESQUEMA DE BASE DE DATOS - AUTORDER
-- ========================================
-- Copia y ejecuta este script en PostgreSQL para crear la estructura

-- ========================================
-- TABLA: users (Usuarios del sistema)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(12) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ventas',
    locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: clientes (Clientes del negocio)
-- ========================================
CREATE TABLE IF NOT EXISTS clientes (
    id VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: vehiculos (Vehículos de los clientes)
-- ========================================
CREATE TABLE IF NOT EXISTS vehiculos (
    placa VARCHAR(10) PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INTEGER NOT NULL,
    kilometraje INTEGER DEFAULT 0,
    motor DECIMAL(5,2),
    transmision VARCHAR(20),
    cliente_id VARCHAR(12) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- ========================================
-- TABLA: prodserv (Productos/Servicios)
-- ========================================
CREATE TABLE IF NOT EXISTS prodserv (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    precio DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: ordenes (Órdenes de servicio)
-- ========================================
CREATE TABLE IF NOT EXISTS ordenes (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL,
    cliente_id VARCHAR(12) NOT NULL,
    vehiculo_placa VARCHAR(10) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (vehiculo_placa) REFERENCES vehiculos(placa) ON DELETE CASCADE
);

-- ========================================
-- TABLA: detalle_ordenes (Detalles de órdenes)
-- ========================================
CREATE TABLE IF NOT EXISTS detalle_ordenes (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES prodserv(id) ON DELETE CASCADE
);

-- ========================================
-- TABLA: ordenes_del (Backup de órdenes eliminadas)
-- ========================================
CREATE TABLE IF NOT EXISTS ordenes_del (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL,
    cliente_id VARCHAR(12),
    vehiculo_placa VARCHAR(10),
    total DECIMAL(12,2),
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA: detalle_ordenes_del (Backup de detalles eliminados)
-- ========================================
CREATE TABLE IF NOT EXISTS detalle_ordenes_del (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER,
    producto_id INTEGER,
    cantidad INTEGER,
    precio_unitario DECIMAL(10,2),
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ÍNDICES (Para mejorar consultas)
-- ========================================
CREATE INDEX IF NOT EXISTS idx_vehiculos_cliente ON vehiculos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_cliente ON ordenes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_vehiculo ON ordenes(vehiculo_placa);
CREATE INDEX IF NOT EXISTS idx_detalle_ordenes_orden ON detalle_ordenes(orden_id);
CREATE INDEX IF NOT EXISTS idx_detalle_ordenes_producto ON detalle_ordenes(producto_id);

-- ========================================
-- DATOS DE PRUEBA (Opcional)
-- ========================================

-- Usuario de prueba
INSERT INTO users (id, name, password, role)
VALUES ('1234567890', 'Admin Test', '$2b$10$YR3p03oDv7uHa1.gC/oKP.DqLsLlzDOhf7PzqLfpLf0Oj1B6zYiqm', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Clientes de prueba
INSERT INTO clientes (id, nombre, telefono, email)
VALUES 
    ('98765432', 'Carlos Mendez', '3001234567', 'carlos@email.com'),
    ('87654321', 'Maria Garcia', '3015555555', 'maria@email.com')
ON CONFLICT (id) DO NOTHING;

-- Vehículos de prueba
INSERT INTO vehiculos (placa, marca, modelo, anio, cliente_id)
VALUES 
    ('ABC1234', 'Toyota', 'Corolla', 2020, '98765432'),
    ('XYZ9876', 'Honda', 'Civic', 2019, '98765432'),
    ('DEF5678', 'Chevrolet', 'Spark', 2018, '87654321')
ON CONFLICT (placa) DO NOTHING;

-- Productos de prueba
INSERT INTO prodserv (nombre, precio)
VALUES 
    ('Cambio de aceite y filtro', 75000),
    ('Filtro de aire', 35000),
    ('Balatas de freno', 120000),
    ('Bujías', 25000)
ON CONFLICT (nombre) DO NOTHING;

-- ========================================
-- CONSULTAS ÚTILES
-- ========================================

-- Ver todas las órdenes con información del cliente
-- SELECT o.id, o.fecha, c.nombre, c.telefono, v.placa, o.total
-- FROM ordenes o
-- JOIN clientes c ON o.cliente_id = c.id
-- JOIN vehiculos v ON o.vehiculo_placa = v.placa
-- ORDER BY o.fecha DESC;

-- Ver detalles de una orden específica
-- SELECT dto.id, dto.cantidad, p.nombre, dto.precio_unitario, (dto.cantidad * dto.precio_unitario) as total
-- FROM detalle_ordenes dto
-- JOIN prodserv p ON dto.producto_id = p.id
-- WHERE dto.orden_id = 1;

-- Ingresos totales por cliente
-- SELECT c.nombre, SUM(o.total) as total_ingresos
-- FROM ordenes o
-- JOIN clientes c ON o.cliente_id = c.id
-- GROUP BY c.id, c.nombre
-- ORDER BY total_ingresos DESC;

-- Vehículos por cliente con órdenes
-- SELECT c.nombre, v.placa, v.marca, v.modelo, COUNT(o.id) as num_ordenes
-- FROM vehiculos v
-- JOIN clientes c ON v.cliente_id = c.id
-- LEFT JOIN ordenes o ON v.placa = o.vehiculo_placa
-- GROUP BY c.id, c.nombre, v.placa, v.marca, v.modelo
-- ORDER BY c.nombre, v.placa;
