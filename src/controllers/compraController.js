const pool = require('../config/database');

module.exports = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM compra');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await pool.query('SELECT * FROM compra WHERE Id_compra=?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    const { Id_compra, fecha_compra, producto, Id_proveedor, precio, fin_garantia, Id_trabajador, serial_number } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO compra (Id_compra,fecha_compra,producto,Id_proveedor,precio,fin_garantia,Id_trabajador,serial_number) VALUES (?,?,?,?,?,?,?,?)',
        [Id_compra, fecha_compra, producto, Id_proveedor, precio, fin_garantia, Id_trabajador, serial_number]
      );
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { fecha_compra, producto, Id_proveedor, precio, fin_garantia, Id_trabajador, serial_number } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE compra SET fecha_compra=?, producto=?, Id_proveedor=?, precio=?, fin_garantia=?, Id_trabajador=?, serial_number=? WHERE Id_compra=?',
        [fecha_compra, producto, Id_proveedor, precio, fin_garantia, Id_trabajador, serial_number, id]
      );
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    const id = req.params.id;
    try {
      const [result] = await pool.query('DELETE FROM compra WHERE Id_compra=?', [id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
