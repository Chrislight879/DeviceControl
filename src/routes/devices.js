const express = require('express');
const router = express.Router();

const productos = require('../controllers/productosController');
const compra = require('../controllers/compraController');
const ticket = require('../controllers/ticketController');
const mantenimiento = require('../controllers/mantenimientoController');
const usuarios = require('../controllers/usuariosController');
const proveedores = require('../controllers/proveedoresController');
const categorias = require('../controllers/categoriasController');
const ubicaciones = require('../controllers/ubicacionesController');
const estados = require('../controllers/estadosController');
const trabajador = require('../controllers/trabajadorController');
const requireAuth = require('../middlewares/authMiddleware');

router.use(requireAuth);

function blockBranchManager(req, res, next) {
	if (req.user?.tipo_usuario === 'jefe_sucursal') {
		return res.status(403).json({ message: 'Acceso restringido para jefe de sucursal' });
	}

	return next();
}

// Productos
router.use('/productos', blockBranchManager);
router.get('/productos', productos.getAll);
router.get('/productos/:id', productos.getById);
router.post('/productos', productos.create);
router.put('/productos/:id', productos.update);
router.delete('/productos/:id', productos.remove);

// Compra
router.get('/compra', compra.getAll);
router.get('/compra/:id', compra.getById);
router.post('/compra', compra.create);
router.put('/compra/:id', compra.update);
router.delete('/compra/:id', compra.remove);

// Ticket
router.get('/ticket', ticket.getAll);
router.get('/ticket/:id', ticket.getById);
router.post('/ticket', ticket.create);
router.put('/ticket/:id', ticket.update);
router.delete('/ticket/:id', ticket.remove);

// Mantenimiento
router.use('/mantenimiento', blockBranchManager);
router.get('/mantenimiento', mantenimiento.getAll);
router.get('/mantenimiento/:id', mantenimiento.getById);
router.post('/mantenimiento', mantenimiento.create);
router.put('/mantenimiento/:id', mantenimiento.update);
router.delete('/mantenimiento/:id', mantenimiento.remove);

// Usuarios
router.use('/usuarios', blockBranchManager);
router.get('/usuarios', usuarios.getAll);
router.get('/usuarios/:id', usuarios.getById);
router.post('/usuarios', usuarios.create);
router.put('/usuarios/:id', usuarios.update);
router.delete('/usuarios/:id', usuarios.remove);

// Proveedores
router.use('/proveedores', blockBranchManager);
router.get('/proveedores', proveedores.getAll);
router.get('/proveedores/:id', proveedores.getById);
router.post('/proveedores', proveedores.create);
router.put('/proveedores/:id', proveedores.update);
router.delete('/proveedores/:id', proveedores.remove);

// Categorias
router.use('/categorias', blockBranchManager);
router.get('/categorias', categorias.getAll);
router.get('/categorias/:id', categorias.getById);
router.post('/categorias', categorias.create);
router.put('/categorias/:id', categorias.update);
router.delete('/categorias/:id', categorias.remove);

// Ubicaciones
router.use('/ubicaciones', blockBranchManager);
router.get('/ubicaciones', ubicaciones.getAll);
router.get('/ubicaciones/:id', ubicaciones.getById);
router.post('/ubicaciones', ubicaciones.create);
router.put('/ubicaciones/:id', ubicaciones.update);
router.delete('/ubicaciones/:id', ubicaciones.remove);

// Estados
router.use('/estados', blockBranchManager);
router.get('/estados', estados.getAll);
router.get('/estados/:id', estados.getById);
router.post('/estados', estados.create);
router.put('/estados/:id', estados.update);
router.delete('/estados/:id', estados.remove);

// Trabajador
router.use('/trabajador', blockBranchManager);
router.get('/trabajador', trabajador.getAll);
router.get('/trabajador/:id', trabajador.getById);
router.post('/trabajador', trabajador.create);
router.put('/trabajador/:id', trabajador.update);
router.delete('/trabajador/:id', trabajador.remove);

module.exports = router;
