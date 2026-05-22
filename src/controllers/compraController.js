const pool = require('../config/database');

function getBranchCondition(user) {
  return user?.tipo_usuario === 'jefe_sucursal' && user?.Id_ubicacion ? Number(user.Id_ubicacion) : null;
}

function getBaseSelect() {
  return `SELECT
      c.Id_compra,
      c.fecha_compra,
      c.producto,
      c.Id_proveedor,
      p.nombre_proveedor,
      c.precio,
      c.fin_garantia,
      c.Id_trabajador,
      t.nombre_trabajador,
      t.Id_ubicacion,
      u.nombre_ubicacion,
      c.serial_number
    FROM compra c
    LEFT JOIN proveedores p ON p.Id_proveedor = c.Id_proveedor
    LEFT JOIN trabajador t ON t.Id_trabajador = c.Id_trabajador
    LEFT JOIN ubicaciones u ON u.Id_ubicacion = t.Id_ubicacion`;
}

module.exports = {
  getAll: async (req, res) => {
    try {
      const branchId = getBranchCondition(req.user);
      const query = branchId
        ? `${getBaseSelect()}
           WHERE t.Id_ubicacion = ?
           ORDER BY c.Id_compra DESC`
        : `${getBaseSelect()}
           ORDER BY c.Id_compra DESC`;
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
      const query = branchId
        ? `${getBaseSelect()}
           WHERE c.Id_compra=? AND t.Id_ubicacion=?
           LIMIT 1`
        : `${getBaseSelect()}
           WHERE c.Id_compra=?
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
    if (req.user?.tipo_usuario === 'jefe_sucursal') {
      return res.status(403).json({ message: 'El panel de equipos es de solo lectura para jefe de sucursal' });
    }

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
    if (req.user?.tipo_usuario === 'jefe_sucursal') {
      return res.status(403).json({ message: 'El panel de equipos es de solo lectura para jefe de sucursal' });
    }

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
    if (req.user?.tipo_usuario === 'jefe_sucursal') {
      return res.status(403).json({ message: 'El panel de equipos es de solo lectura para jefe de sucursal' });
    }

    const id = req.params.id;
    try {
      const [result] = await pool.query('DELETE FROM compra WHERE Id_compra=?', [id]);
      res.json({ affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
