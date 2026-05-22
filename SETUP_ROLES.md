# Instrucciones de Configuración - Sistema de Roles

## Paso 1: Ejecutar Migraciones SQL

Ejecuta el siguiente script SQL en tu base de datos DeviceControlDB:

```sql
-- src/migrations/add_user_roles.sql
ALTER TABLE usuarios 
ADD COLUMN tipo_usuario VARCHAR(50) DEFAULT 'trabajador' NOT NULL;

UPDATE usuarios SET tipo_usuario = 'admin' WHERE usuario_admin = 1;
UPDATE usuarios SET tipo_usuario = 'trabajador' WHERE usuario_admin = 0 AND tipo_usuario = 'trabajador';

CREATE INDEX idx_tipo_usuario ON usuarios(tipo_usuario);

-- Cambiar contraseñas a texto plano para testing
UPDATE usuarios SET tipo_usuario = 'jefe_sucursal' WHERE Id_usuario = 4;  -- carlos.martinez
UPDATE usuarios SET tipo_usuario = 'usuario_comun' WHERE Id_usuario = 5;  -- ana.rodriguez

-- Opcional: Cambiar contraseñas de hash a texto plano
UPDATE usuarios SET password = 'admin123' WHERE Id_usuario = 1;          -- miguel.torres
UPDATE usuarios SET password = 'jefe123' WHERE Id_usuario = 4;           -- carlos.martinez
UPDATE usuarios SET password = 'trabajador123' WHERE Id_usuario = 6;     -- luis.hernandez
UPDATE usuarios SET password = 'usuario123' WHERE Id_usuario = 5;        -- ana.rodriguez
```

## 🔐 Usuarios Disponibles Para Testing

Tu base de datos ya tiene usuarios. Usa estos credenciales:

### Administrador (Acceso Total)
- **Usuario:** miguel.torres
- **Contraseña:** admin123 (después de ejecutar SQL anterior)
- **O:** hash_admin_001 (contraseña original hasheada)

### Jefe de Sucursal
- **Usuario:** carlos.martinez
- **Contraseña:** jefe123 (después de ejecutar SQL anterior)
- **O:** hash_user_001 (contraseña original hasheada)
- **Acceso:** Solo Tickets y el listado de Equipos de su sucursal (sin crear/editar/eliminar)

### Trabajador
- **Usuario:** luis.hernandez
- **Contraseña:** trabajador123 (después de ejecutar SQL anterior)
- **O:** hash_user_003 (contraseña original hasheada)

### Usuario Común
- **Usuario:** ana.rodriguez
- **Contraseña:** usuario123 (después de ejecutar SQL anterior)
- **O:** hash_user_002 (contraseña original hasheada)

## Paso 5: Verificar Funcionamiento

1. **Inicia sesión** con `carlos.martinez / jefe123`
2. **Verifica** que solo ves estos módulos en la barra lateral:
   - Tickets
   - Equipos
3. **Comprueba** que el chip de usuario muestra "Jefe de Sucursal" y su sucursal
4. **Intenta crear/editar/eliminar en Equipos** - debería bloquearse
5. **Intenta acceder** directamente a un módulo no permitido (ej: Usuarios) - debería ser bloqueado

## Estructura de Datos

### Tabla: `usuarios`

Nuevos campos:
- `tipo_usuario` (VARCHAR(50)) - Tipo de rol del usuario

Valores válidos:
- `admin` - Administrador del sistema
- `jefe_sucursal` - Jefe de sucursal
- `trabajador` - Trabajador/empleado
- `usuario_comun` - Usuario final

## Notas Importantes

⚠️ **NOTA:** Las contraseñas en tu BD originalmente estaban hasheadas. Si ejecutaste el SQL anterior, ahora son texto plano. En producción, implementa bcrypt.

📝 **Para agregar más usuarios con roles:**
```sql
-- Cambiar rol de un usuario existente
UPDATE usuarios SET tipo_usuario = 'jefe_sucursal' WHERE Id_usuario = 8;

-- Ver cambios
SELECT Id_usuario, username, tipo_usuario FROM usuarios;
```

📝 **Para cambiar el rol de un usuario:**
```sql
UPDATE usuarios SET tipo_usuario = 'admin' WHERE Id_usuario = 3;
```

## Troubleshooting

**Problema:** No puedo ingresar
**Solución:** Verifica que usas el usuario y contraseña correctos de la tabla anterior. Puedes también revisar con: `SELECT * FROM usuarios WHERE username = 'carlos.martinez';`

**Problema:** Un usuario ve más módulos de los permitidos
**Solución:** Reinicia el servidor Node.js. Verifica que el usuario tiene `tipo_usuario` correcto y que su `Id_ubicacion` existe.

**Problema:** No veo la sucursal en el chip
**Solución:** Verifica que `usuarios.Id_trabajador` tenga relación con `trabajador.Id_ubicacion`.

**Problema:** Las credenciales dicen "inválidas"
**Solución:** Verifica que ejecutaste el SQL anterior para cambiar contraseñas a texto plano. O usa los hashes originales: `hash_admin_001`, `hash_user_001`, etc.
