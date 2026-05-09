const pool = require('../config/database');

module.exports = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM proveedores');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await pool.query('SELECT * FROM proveedores WHERE Id_proveedor=?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    const { Id_proveedor, nombre_proveedor, contacto } = req.body;
    try {
      const [result] = await pool.query('INSERT INTO proveedores (Id_proveedor,nombre_proveedor,contacto) VALUES (?,?,?)', [Id_proveedor, nombre_proveedor, contacto]);
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { nombre_proveedor, contacto } = req.body;
    try {
      const [result] = await pool.query('UPDATE proveedores SET nombre_proveedor=?, contacto=? WHERE Id_proveedor=?', [nombre_proveedor, contacto, id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    const id = req.params.id;
    try {
      const [result] = await pool.query('DELETE FROM proveedores WHERE Id_proveedor=?', [id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
