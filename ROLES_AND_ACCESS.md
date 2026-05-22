# Control de Acceso por Roles - DeviceControl

## Tipos de Usuarios y sus Accesos

### 1. **Administrador** (`admin`)
Acceso completo a todos los módulos del sistema.

**Módulos permitidos:**
- ✅ Productos
- ✅ Compras
- ✅ Tickets
- ✅ Mantenimientos
- ✅ Usuarios
- ✅ Proveedores
- ✅ Categorías
- ✅ Ubicaciones
- ✅ Estados
- ✅ Trabajadores

**Descripción:** Usuario con permisos totales. Puede crear, editar y eliminar registros en todos los módulos. Acceso a gestión de usuarios.

---

### 2. **Jefe de Sucursal** (`jefe_sucursal`)
Acceso a módulos de gestión operativa de la sucursal.

**Módulos permitidos:**
- ✅ Tickets
- ✅ Equipos (solo listado)

**Descripción:** Usuario responsable de la sucursal. Solo puede ver y gestionar tickets de su propia sucursal y ver el listado de equipos. No puede crear, editar ni eliminar equipos. No tiene acceso a configuración de sistema ni a otros módulos.

---

### 3. **Trabajador** (`trabajador`)
Acceso limitado a módulos de incidencias y mantenimiento.

**Módulos permitidos:**
- ✅ Tickets
- ✅ Mantenimientos

**Descripción:** Empleado que puede reportar y seguimiento de tickets, así como registrar mantenimientos de equipos. Acceso restringido a sus funciones operativas.

---

### 4. **Usuario Común** (`usuario_comun`)
Acceso mínimo, solo para reportar incidencias.

**Módulos permitidos:**
- ✅ Tickets

**Descripción:** Usuario final que solo puede crear y ver sus propios tickets de soporte. Acceso más restrictivo del sistema.

---

## Credenciales de Prueba

Los siguientes usuarios ya existen en tu base de datos:

### Administrador
- **Usuario:** miguel.torres
- **Contraseña:** hash_admin_001 (o `admin123` si ejecutaste UPDATE)
- **Rol:** admin
- **Módulos:** Todos

### Jefe de Sucursal
- **Usuario:** carlos.martinez
- **Contraseña:** hash_user_001 (o `jefe123` si ejecutaste UPDATE)
- **Rol:** jefe_sucursal
- **Módulos:** Tickets, Equipos (solo listado)

### Trabajador
- **Usuario:** luis.hernandez
- **Contraseña:** hash_user_003 (o `trabajador123` si ejecutaste UPDATE)
- **Rol:** trabajador
- **Módulos:** Tickets, Mantenimientos

### Usuario Común
- **Usuario:** ana.rodriguez
- **Contraseña:** hash_user_002 (o `usuario123` si ejecutaste UPDATE)
- **Rol:** usuario_comun
- **Módulos:** Tickets

---

## Estructura de la Base de Datos

Campo agregado a tabla `usuarios`:
```sql
tipo_usuario VARCHAR(50) DEFAULT 'trabajador' NOT NULL
```

Valores válidos:
- `admin`
- `jefe_sucursal`
- `trabajador`
- `usuario_comun`

---

## Implementación en Frontend

El control de acceso se realiza en `main.js`:

- **`roleAccess` object**: Define qué módulos puede acceder cada rol
- **`getAccessibleModules(userRole)`**: Función que retorna solo los módulos permitidos
- **`renderModuleNav()`**: Renderiza solo botones para módulos accesibles y renombra Compras a Equipos para jefe de sucursal
- **`loadModule(moduleKey)`**: Valida que el módulo sea accesible antes de cargar
- **`updateUserChip()`**: Muestra el tipo de usuario y su sucursal

---

## Implementación en Backend

El backend valida tokens en `/src/middlewares/authMiddleware.js`, retorna `tipo_usuario` e `Id_ubicacion` en `/api/auth/me`, y filtra compras/tickets por la sucursal del jefe.

---

## Futuras Mejoras

- [ ] Permisos más granulares (crear/editar/eliminar por módulo)
- [ ] Sistema de roles personalizados
- [ ] Auditoría de acciones por usuario
- [ ] Restricciones por ubicación/sucursal
- [ ] Panel de administración de roles
