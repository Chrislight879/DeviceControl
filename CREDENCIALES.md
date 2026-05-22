# ✅ CREDENCIALES ACTUALES - SISTEMA DE ROLES

## Usuarios Existentes en la Base de Datos

Tu BD ya tiene 4 usuarios configurados con roles. Estos son los credenciales correctos:

### 🔐 ADMIN (Acceso Total)
```
Usuario: miguel.torres
Contraseña: hash_admin_001
```

### 👔 JEFE DE SUCURSAL
```
Usuario: carlos.martinez
Contraseña: hash_user_001
Módulos: Compras, Tickets, Mantenimientos, Productos, Trabajadores
```

### 👷 TRABAJADOR
```
Usuario: luis.hernandez
Contraseña: hash_user_003
Módulos: Tickets, Mantenimientos
```

### 👤 USUARIO COMÚN
```
Usuario: ana.rodriguez
Contraseña: hash_user_002
Módulos: Tickets
```

---

## ⚡ Para Usar Contraseñas Simples (Recomendado para Testing)

Ejecuta esto en MySQL:

```sql
UPDATE usuarios SET password = 'admin123' WHERE Id_usuario = 1;
UPDATE usuarios SET password = 'jefe123' WHERE Id_usuario = 4;
UPDATE usuarios SET password = 'trabajador123' WHERE Id_usuario = 6;
UPDATE usuarios SET password = 'usuario123' WHERE Id_usuario = 5;
```

Luego usa:
- `miguel.torres / admin123`
- `carlos.martinez / jefe123`
- `luis.hernandez / trabajador123`
- `ana.rodriguez / usuario123`

---

## 🔍 Verificar en BD

```sql
SELECT Id_usuario, username, password, tipo_usuario 
FROM usuarios 
WHERE Id_usuario IN (1, 4, 5, 6);
```

Debe mostrar los 4 usuarios con sus respectivos tipos.

---

## ✨ Qué se Implementó

✅ **Backend:** authController retorna `tipo_usuario` en login
✅ **Frontend:** main.js filtra módulos según rol del usuario
✅ **Database:** Campo `tipo_usuario` agregado a tabla usuarios
✅ **Filtrado:** Cada rol solo ve sus módulos permitidos
✅ **UI:** Chip muestra nombre + tipo de usuario

---

## 🎯 Próximo Paso

1. Ingresa con `carlos.martinez / jefe123`
2. Verifica que SOLO ves 5 módulos
3. El chip debe decir "carlos.martinez · Jefe de Sucursal"
4. Intenta acceder a "Usuarios" - debería ser bloqueado
