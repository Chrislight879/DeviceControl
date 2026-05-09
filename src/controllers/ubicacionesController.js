const pool = require('../config/database');

module.exports = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM ubicaciones');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await pool.query('SELECT * FROM ubicaciones WHERE Id_ubicacion=?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    const { Id_ubicacion, nombre_ubicacion } = req.body;
    try {
      const [result] = await pool.query('INSERT INTO ubicaciones (Id_ubicacion,nombre_ubicacion) VALUES (?,?)', [Id_ubicacion, nombre_ubicacion]);
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { nombre_ubicacion } = req.body;
    try {
      const [result] = await pool.query('UPDATE ubicaciones SET nombre_ubicacion=? WHERE Id_ubicacion=?', [nombre_ubicacion, id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    const id = req.params.id;
    try {
      const [result] = await pool.query('DELETE FROM ubicaciones WHERE Id_ubicacion=?', [id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
