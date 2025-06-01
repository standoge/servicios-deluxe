// customers.controller.js

import {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} from './customers.service.js';

// Controlador para listar clientes
const listarClientes = async (req, res) => {
    try {
        const clientes = await getAllCustomers();
        const datosVista = {
            clientes
        };
        res.render('customers/list', datosVista);
    } catch (error) {
        console.log('Error al listar clientes', error);
        res.status(500).render('error', {
            message: "Error al listar clientes",
            error: error
        });
    }
};

// Controlador para crear un cliente
const crearCliente = async (req, res) => {
    try {
        const nuevoCliente = {
            ...req.body
        };
        await createCustomer(nuevoCliente);
        res.redirect('/clientes/list?success=created');

    } catch (error) {
        console.log('Error al crear cliente', error);
        res.status(500).render('error', {
            message: "Error al crear cliente",
            error: error
        });
    }
};

// Controlador para actualizar un cliente
const actualizarCliente = async (req, res) => {
    try {
        const id = req.params.id;
        const indice = getCustomerById(id);
        if (indice !== -1) {
            await updateCustomer(id, req.body);
        }

        res.redirect('/clientes/list?success=updated');
    } catch (error) {
        console.log('Error al actualizar cliente', error);
        res.status(500).render('error', { 
            message: "Error al actualizar cliente",
            error: error
        });
    }
};

// Controlador para eliminar un cliente
const eliminarCliente = async (req, res) => {
    try {
        const id = req.params.id;

        const indice = await getCustomerById(id);
        if (indice !== -1) {
            await deleteCustomer(id);
        }

        res.redirect('/clientes/list?success=deleted');
        
    } catch (error) {
        console.log('Error al eliminar cliente', error);
        res.status(500).render('error', { 
            message: "Error al eliminar cliente",
            error: error
        });
    }
};

export {
    listarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};