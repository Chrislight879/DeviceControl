const pool = require('../config/database');

module.exports = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM productos');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await pool.query('SELECT * FROM productos WHERE Id_producto=?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    const { Id_producto, nombre_producto, precio, Id_categoria, Id_proveedor } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO productos (Id_producto,nombre_producto,precio,Id_categoria,Id_proveedor) VALUES (?,?,?,?,?)',
        [Id_producto, nombre_producto, precio, Id_categoria, Id_proveedor]
      );
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { nombre_producto, precio, Id_categoria, Id_proveedor } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE productos SET nombre_producto=?, precio=?, Id_categoria=?, Id_proveedor=? WHERE Id_producto=?',
        [nombre_producto, precio, Id_categoria, Id_proveedor, id]
      );
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    const id = req.params.id;
    try {
      const [result] = await pool.query('DELETE FROM productos WHERE Id_producto=?', [id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
