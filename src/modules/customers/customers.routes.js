// customers.routes.js

import express from 'express';
import {
    crearCliente,
    listarClientes,
    actualizarCliente,
    eliminarCliente,
    generarReporte
} from './customers.controller.js';

const router = express.Router();

// Rutas para la interfaz web
router.get('/list', listarClientes);
router.get('/reporte', generarReporte);

// Rutas para el CRUD de clientes
router.post('/', crearCliente);
router.post('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;