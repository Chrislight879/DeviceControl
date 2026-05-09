const pool = require('../config/database');

module.exports = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM ticket');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await pool.query('SELECT * FROM ticket WHERE Id_ticket=?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    const { Id_ticket, fecha_emision, fecha_salida, fecha_entrada, Id_compra, Id_usuario_comun, Id_usuario_it, Id_estado_ticket, problema_presentado } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO ticket (Id_ticket,fecha_emision,fecha_salida,fecha_entrada,Id_compra,Id_usuario_comun,Id_usuario_it,Id_estado_ticket,problema_presentado) VALUES (?,?,?,?,?,?,?,?,?)',
        [Id_ticket, fecha_emision, fecha_salida, fecha_entrada, Id_compra, Id_usuario_comun, Id_usuario_it, Id_estado_ticket, problema_presentado]
      );
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { fecha_emision, fecha_salida, fecha_entrada, Id_compra, Id_usuario_comun, Id_usuario_it, Id_estado_ticket, problema_presentado } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE ticket SET fecha_emision=?, fecha_salida=?, fecha_entrada=?, Id_compra=?, Id_usuario_comun=?, Id_usuario_it=?, Id_estado_ticket=?, problema_presentado=? WHERE Id_ticket=?',
        [fecha_emision, fecha_salida, fecha_entrada, Id_compra, Id_usuario_comun, Id_usuario_it, Id_estado_ticket, problema_presentado, id]
      );
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    const id = req.params.id;
    try {
      const [result] = await pool.query('DELETE FROM ticket WHERE Id_ticket=?', [id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
