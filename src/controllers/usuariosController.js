const pool = require('../config/database');

module.exports = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE Id_usuario=?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    const { Id_usuario, Id_trabajador, username, password, usuario_admin } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO usuarios (Id_usuario,Id_trabajador,username,password,usuario_admin) VALUES (?,?,?,?,?)',
        [Id_usuario, Id_trabajador, username, password, usuario_admin]
      );
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { Id_trabajador, username, password, usuario_admin } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE usuarios SET Id_trabajador=?, username=?, password=?, usuario_admin=? WHERE Id_usuario=?',
        [Id_trabajador, username, password, usuario_admin, id]
      );
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    const id = req.params.id;
    try {
      const [result] = await pool.query('DELETE FROM usuarios WHERE Id_usuario=?', [id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
