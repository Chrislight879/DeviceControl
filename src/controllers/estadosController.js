const pool = require('../config/database');

module.exports = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM estados_ticket');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await pool.query('SELECT * FROM estados_ticket WHERE Id_estado_ticket=?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    const { Id_estado_ticket, nombre_estado_ticket } = req.body;
    try {
      const [result] = await pool.query('INSERT INTO estados_ticket (Id_estado_ticket,nombre_estado_ticket) VALUES (?,?)', [Id_estado_ticket, nombre_estado_ticket]);
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { nombre_estado_ticket } = req.body;
    try {
      const [result] = await pool.query('UPDATE estados_ticket SET nombre_estado_ticket=? WHERE Id_estado_ticket=?', [nombre_estado_ticket, id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    const id = req.params.id;
    try {
      const [result] = await pool.query('DELETE FROM estados_ticket WHERE Id_estado_ticket=?', [id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
