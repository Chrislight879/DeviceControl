const pool = require('../config/database');

module.exports = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM mantenimiento');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await pool.query('SELECT * FROM mantenimiento WHERE Id_mantenimiento=?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    const { Id_mantenimiento, recibio_equipo, salio_equipo, Id_ticket, observaciones, diagnostico } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO mantenimiento (Id_mantenimiento,recibio_equipo,salio_equipo,Id_ticket,observaciones,diagnostico) VALUES (?,?,?,?,?,?)',
        [Id_mantenimiento, recibio_equipo, salio_equipo, Id_ticket, observaciones, diagnostico]
      );
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { recibio_equipo, salio_equipo, Id_ticket, observaciones, diagnostico } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE mantenimiento SET recibio_equipo=?, salio_equipo=?, Id_ticket=?, observaciones=?, diagnostico=? WHERE Id_mantenimiento=?',
        [recibio_equipo, salio_equipo, Id_ticket, observaciones, diagnostico, id]
      );
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    const id = req.params.id;
    try {
      const [result] = await pool.query('DELETE FROM mantenimiento WHERE Id_mantenimiento=?', [id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
