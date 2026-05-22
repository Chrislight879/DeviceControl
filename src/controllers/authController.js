const crypto = require('crypto');
const pool = require('../config/database');
const sessions = require('../config/sessionStore');

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    Id_usuario: user.Id_usuario,
    Id_trabajador: user.Id_trabajador,
    Id_ubicacion: user.Id_ubicacion,
    nombre_ubicacion: user.nombre_ubicacion,
    username: user.username,
    usuario_admin: user.usuario_admin,
    tipo_usuario: user.tipo_usuario || (user.usuario_admin ? 'admin' : 'trabajador'),
  };
}

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username y password son obligatorios' });
    }

    try {
      const [rows] = await pool.query(
        `SELECT u.Id_usuario, u.Id_trabajador, u.username, u.usuario_admin, u.tipo_usuario, t.Id_ubicacion, ub.nombre_ubicacion
         FROM usuarios u
         LEFT JOIN trabajador t ON t.Id_trabajador = u.Id_trabajador
         LEFT JOIN ubicaciones ub ON ub.Id_ubicacion = t.Id_ubicacion
         WHERE u.username=? AND u.password=?
         LIMIT 1`,
        [username, password]
      );

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const user = sanitizeUser(rows[0]);
      const token = crypto.randomUUID();
      sessions.set(token, user);

      return res.json({ token, user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  me: async (req, res) => {
    return res.json({ user: sanitizeUser(req.user) });
  },

  logout: async (req, res) => {
    const token = req.authToken;

    if (token) {
      sessions.delete(token);
    }

    return res.json({ message: 'Sesión cerrada correctamente' });
  },
};