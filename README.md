# Device Control

Sistema de control de dispositivos desarrollado con Node.js, Express y MySQL.

## Estructura del Proyecto

```
DeviceControl/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de conexión a MySQL
│   ├── routes/
│   │   └── devices.js            # Rutas API para dispositivos
│   ├── controllers/              # Controladores (para expansión futura)
│   ├── middlewares/              # Middlewares personalizados
│   └── server.js                 # Archivo principal del servidor
├── public/
│   ├── html/
│   │   └── index.html            # Página principal
│   ├── css/
│   │   └── style.css             # Estilos CSS
│   └── js/
│       └── main.js               # JavaScript del cliente
├── package.json                  # Dependencias del proyecto
├── .env                          # Variables de entorno
├── .env.example                  # Ejemplo de variables de entorno
└── README.md                     # Este archivo
```

## Instalación

1. **Descargar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar base de datos:**
   - Editar el archivo `.env` con los datos de su MySQL
   - Crear la base de datos y tabla:
   

3. **Iniciar el servidor:**
   ```bash
   npm start
   ```
   
   Para desarrollo con hot-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Autenticación

- `POST /api/auth/login` — recibe `username` y `password`, devuelve `token` y `user`.
- `GET /api/auth/me` — valida la sesión actual.
- `POST /api/auth/logout` — cierra la sesión actual.

### Panel protegido

Todas las rutas bajo ` /api/devices` requieren autenticación con token Bearer.

### Acceso al frontend

La interfaz web solicita login antes de mostrar el panel administrativo. Usa un usuario existente de la tabla `usuarios`.

## Dependencias

- **express** - Framework web
- **mysql2** - Driver para MySQL
- **cors** - Middleware CORS
- **body-parser** - Parser de request
- **dotenv** - Gestión de variables de entorno
- **nodemon** (dev) - Hot-reload para desarrollo

## Acceso a la aplicación

El servidor se ejecuta en `http://localhost:3000`
