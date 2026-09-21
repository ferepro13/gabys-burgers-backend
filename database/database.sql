CREATE DATABASE gabys_burgers;
USE gabys_burgers;

-- Tabla de productos (hamburguesas)
CREATE TABLE productos (
  uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'Otros',
  imageUrl VARCHAR(255) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  isAvailable BOOLEAN GENERATED ALWAYS AS (stock > 0) STORED, -- Se actualiza automáticamente
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de extras (ingredientes adicionales)
CREATE TABLE extras (
  uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  -- imageUrl VARCHAR(255) NULL,
  price DECIMAL(10,2) NOT NULL,
  -- stock INT NOT NULL DEFAULT 10000,
  isAvailable BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE pedidos (
  uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clientName VARCHAR(100) NOT NULL,
  clientPhone VARCHAR(20) NOT NULL,
  atDate DATE NOT NULL,               -- Fecha en que se hace el pedido (hoy)
  toDate DATE NOT NULL,               -- Fecha de entrega
  time TIME NOT NULL,                 -- Hora de entrega
  direction TEXT NOT NULL,            -- Dirección de entrega
  orderDetails JSON NOT NULL,                -- Detalle del pedido: { productos: [{uuid, name, quantity, extras: [{uuid, name, quantity}] }] }
  orderTotalCost DECIMAL(10,2) NOT NULL,
  orderState ENUM('pendiente', 'hecho') DEFAULT 'pendiente',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deliveryData JSON NOT NULL,
  notes TEXT NULL -- revisar nombre, agregar a modelo y controller
);

-- Índices para consultas rápidas
CREATE INDEX idx_pedidos_orderState ON pedidos(orderState);
CREATE INDEX idx_pedidos_atDate ON pedidos(atDate);
CREATE INDEX idx_pedidos_toDate ON pedidos(toDate);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE domicilio (
  uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  locationName VARCHAR(50) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL
)