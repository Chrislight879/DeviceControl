const pool = require('../config/database');

function getBranchCondition(user) {
  return user?.tipo_usuario === 'jefe_sucursal' && user?.Id_ubicacion ? Number(user.Id_ubicacion) : null;
}

function getBaseSelect() {
  return `SELECT
      tk.Id_ticket,
      tk.fecha_emision,
      tk.fecha_salida,
      tk.fecha_entrada,
      tk.Id_compra,
      c.producto AS nombre_compra,
      c.serial_number,
      tk.Id_usuario_comun,
      uc.username AS nombre_usuario_comun,
      tk.Id_usuario_it,
      ui.username AS nombre_usuario_it,
      tk.Id_estado_ticket,
      et.nombre_estado_ticket,
      tk.problema_presentado
    FROM ticket tk
    LEFT JOIN compra c ON c.Id_compra = tk.Id_compra
    LEFT JOIN usuarios uc ON uc.Id_usuario = tk.Id_usuario_comun
    LEFT JOIN usuarios ui ON ui.Id_usuario = tk.Id_usuario_it
    LEFT JOIN estados_ticket et ON et.Id_estado_ticket = tk.Id_estado_ticket`;
}

module.exports = {
  getAll: async (req, res) => {
    try {
      const branchId = getBranchCondition(req.user);
      const isItUser = req.user?.tipo_usuario === 'trabajador';

      // IT users should only see active (pending) tickets created by users
      if (isItUser) {
        const query = `${getBaseSelect()} WHERE tk.Id_estado_ticket = 1 AND tk.Id_usuario_comun IS NOT NULL ORDER BY tk.Id_ticket DESC`;
        const [rows] = await pool.query(query);
        return res.json(rows);
      }

      const query = branchId
        ? `${getBaseSelect()}
           INNER JOIN trabajador t ON t.Id_trabajador = c.Id_trabajador
           WHERE t.Id_ubicacion = ?
           ORDER BY tk.Id_ticket DESC`
        : `${getBaseSelect()}
           ORDER BY tk.Id_ticket DESC`;
      const params = branchId ? [branchId] : [];
      const [rows] = await pool.query(query, params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const branchId = getBranchCondition(req.user);
      const isItUser = req.user?.tipo_usuario === 'trabajador';

      if (isItUser) {
        // IT can view ticket only if it's active (pending) or assigned to them
        const queryIt = `${getBaseSelect()} WHERE tk.Id_ticket=? AND (tk.Id_estado_ticket = 1 OR tk.Id_usuario_it = ?) LIMIT 1`;
        const [rows] = await pool.query(queryIt, [id, req.user?.Id_usuario]);
        if (rows.length === 0) return res.status(403).json({ message: 'No tienes permiso para ver este ticket' });
        return res.json(rows[0]);
      }

      const query = branchId
        ? `${getBaseSelect()}
           INNER JOIN trabajador t ON t.Id_trabajador = c.Id_trabajador
           WHERE tk.Id_ticket=? AND t.Id_ubicacion=?
           LIMIT 1`
        : `${getBaseSelect()}
           WHERE tk.Id_ticket=?
           LIMIT 1`;
      const params = branchId ? [id, branchId] : [id];
      const [rows] = await pool.query(query, params);
      if (rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    const { Id_ticket, fecha_emision, fecha_salida, fecha_entrada, Id_compra, Id_usuario_comun, Id_usuario_it, Id_estado_ticket, problema_presentado } = req.body;
    try {
      if (req.user?.tipo_usuario === 'jefe_sucursal') {
        const branchId = getBranchCondition(req.user);
        const [purchases] = await pool.query(
          `SELECT c.Id_compra
           FROM compra c
           INNER JOIN trabajador t ON t.Id_trabajador = c.Id_trabajador
           WHERE c.Id_compra=? AND t.Id_ubicacion=?
           LIMIT 1`,
          [Id_compra, branchId]
        );

        if (purchases.length === 0) {
          return res.status(403).json({ message: 'No puedes crear tickets fuera de tu sucursal' });
        }
      }

      const isBranchUser = req.user?.tipo_usuario === 'jefe_sucursal';
      const finalFechaEmision = fecha_emision || new Date().toISOString().slice(0, 10);
      const finalEstado = isBranchUser ? 1 : (Id_estado_ticket ?? 1);
      const finalUsuarioComun = isBranchUser ? req.user?.Id_usuario : Id_usuario_comun;
      const finalUsuarioIt = isBranchUser ? null : (Id_usuario_it ?? req.user?.Id_usuario ?? null);
      const finalProblema = isBranchUser ? null : (problema_presentado ?? null);
      const finalFechaSalida = isBranchUser ? null : (fecha_salida ?? null);
      const finalFechaEntrada = isBranchUser ? null : (fecha_entrada ?? null);

      const [result] = await pool.query(
        'INSERT INTO ticket (Id_ticket,fecha_emision,fecha_salida,fecha_entrada,Id_compra,Id_usuario_comun,Id_usuario_it,Id_estado_ticket,problema_presentado) VALUES (?,?,?,?,?,?,?,?,?)',
        [Id_ticket, finalFechaEmision, finalFechaSalida, finalFechaEntrada, Id_compra, finalUsuarioComun, finalUsuarioIt, finalEstado, finalProblema]
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
      const branchId = getBranchCondition(req.user);
      if (branchId) {
        const [currentRows] = await pool.query(
          `SELECT tk.Id_ticket
           FROM ticket tk
           INNER JOIN compra c ON c.Id_compra = tk.Id_compra
           INNER JOIN trabajador t ON t.Id_trabajador = c.Id_trabajador
           WHERE tk.Id_ticket=? AND t.Id_ubicacion=?
           LIMIT 1`,
          [id, branchId]
        );

        if (currentRows.length === 0) {
          return res.status(403).json({ message: 'No puedes modificar tickets de otra sucursal' });
        }
      }

      const isItUser = req.user?.tipo_usuario === 'trabajador';
      const finalUsuarioIt = isItUser ? req.user?.Id_usuario : Id_usuario_it;
      const [result] = await pool.query(
        'UPDATE ticket SET fecha_emision=?, fecha_salida=?, fecha_entrada=?, Id_compra=?, Id_usuario_comun=?, Id_usuario_it=?, Id_estado_ticket=?, problema_presentado=? WHERE Id_ticket=?',
        [fecha_emision, fecha_salida, fecha_entrada, Id_compra, Id_usuario_comun, finalUsuarioIt, Id_estado_ticket, problema_presentado, id]
      );
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    const id = req.params.id;
    try {
      const branchId = getBranchCondition(req.user);
      if (branchId) {
        const [currentRows] = await pool.query(
          `SELECT tk.Id_ticket
           FROM ticket tk
           INNER JOIN compra c ON c.Id_compra = tk.Id_compra
           INNER JOIN trabajador t ON t.Id_trabajador = c.Id_trabajador
           WHERE tk.Id_ticket=? AND t.Id_ubicacion=?
           LIMIT 1`,
          [id, branchId]
        );

        if (currentRows.length === 0) {
          return res.status(403).json({ message: 'No puedes eliminar tickets de otra sucursal' });
        }
      }

      const [result] = await pool.query('DELETE FROM ticket WHERE Id_ticket=?', [id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
