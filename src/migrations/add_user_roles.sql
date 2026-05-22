-- Agregar campo tipo_usuario a la tabla usuarios
-- Tipos: 'admin', 'jefe_sucursal', 'trabajador', 'usuario_comun'

ALTER TABLE usuarios 
ADD COLUMN tipo_usuario VARCHAR(50) DEFAULT 'trabajador' NOT NULL;

-- Actualizar usuarios existentes
UPDATE usuarios SET tipo_usuario = 'admin' WHERE usuario_admin = 1;
UPDATE usuarios SET tipo_usuario = 'trabajador' WHERE usuario_admin = 0 AND tipo_usuario = 'trabajador';

-- Crear índice para búsquedas rápidas
CREATE INDEX idx_tipo_usuario ON usuarios(tipo_usuario);

-- Datos de prueba
-- Usuario Administrador
INSERT IGNORE INTO usuarios (Id_usuario, Id_trabajador, username, password, usuario_admin, tipo_usuario) 
VALUES (1, 1, 'admin@empresa.com', 'admin123', 1, 'admin');

-- Usuario Jefe de Sucursal
INSERT IGNORE INTO usuarios (Id_usuario, Id_trabajador, username, password, usuario_admin, tipo_usuario) 
VALUES (2, 2, 'jefe@sucursal.com', 'jefe123', 0, 'jefe_sucursal');

-- Usuario Trabajador
INSERT IGNORE INTO usuarios (Id_usuario, Id_trabajador, username, password, usuario_admin, tipo_usuario) 
VALUES (3, 3, 'trabajador@empresa.com', 'trabajador123', 0, 'trabajador');

-- Usuario Común
INSERT IGNORE INTO usuarios (Id_usuario, Id_trabajador, username, password, usuario_admin, tipo_usuario) 
VALUES (4, 4, 'usuario@empresa.com', 'usuario123', 0, 'usuario_comun');
