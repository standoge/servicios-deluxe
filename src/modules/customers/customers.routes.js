import express from 'express';
import {
    mostrarListadoClientes,
    renderCustomerForm,
    createCustomer,
    getCustomerById,
    updateCustomer
} from './customers.controller.js';

const router = express.Router();

//Ruta: http://localhost:3000/clientes/list
router.get('/list', mostrarListadoClientes);

// Ruta para mostrar el formulario de registro de nuevo cliente
router.get('/nuevo', renderCustomerForm);

// Ruta para guardar un nuevo cliente
router.post('/nuevo', createCustomer);

// Ruta para mostrar el formulario de edición de un cliente existente
router.get('/editar/:id', getCustomerById);

// Ruta para actualizar los datos de un cliente
router.post('/editar/:id', updateCustomer);

export default router;


/*
// Rutas para la interfaz web
router.get('/list/', listarServicios);
router.get('/form/add', mostrarFormularioNuevo);
router.get('/form/:id', mostrarFormularioEdicion);

// Rutas para CRUD
router.post('/', crearServicio);
router.post('/:id', actualizarServicio);
router.delete('/:id', eliminarServicio);

*/


