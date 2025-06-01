// customers.routes.js

import express from 'express';
import {
    crearCliente,
    listarClientes,
    actualizarCliente,
    eliminarCliente
} from './customers.controller.js';

const router = express.Router();

// Rutas para la interfaz web
router.get('/list', listarClientes);

// Rutas para el CRUD de clientes
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;