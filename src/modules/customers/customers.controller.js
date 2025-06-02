
// customers.controller.js

import {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} from './customers.service.js';
import ExcelJS from 'exceljs';

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

const formularioClienteNuevo = async (req, res) => {
    try {
        const datosVista = { 
                accion: '/clientes',
                metodo: 'POST',
                cliente: {
                    customer_id: '',
                    name: '',
                    lastname: '',
                    dui: '',
                    email: '',
                    phone: '',
                    location: '',
                    comments: '',
                }
        };

        return res.render('customers/form', datosVista);
    } catch (error) {
        console.log('Error al mostrar formulario nuevo', error);
        res.status(500).render('error', { 
            message: "Error al mostrar formulario nuevo",
            error: error
        });
    }
};

const formularioClienteEdicion = async (req, res) => {
    try {
        const cliente = await getCustomerById(req.params.id);
        if (!cliente) {
            return res.status(404).render('error', { 
                message: "Cliente no encontrado"
            });
        }

        const datosVista = { 
                cliente,
                accion: '/clientes/' + cliente.customer_id,
                metodo: 'POST',
        };
        return res.render('customers/form', datosVista);
    } catch (error) {
        console.log('Error al mostrar formulario de edición', error);
        res.status(500).render('error', { 
            message: "Error al mostrar formulario de edición",
            error: error
        });
    }
};

const generarReporte = async (req, res) => {
    try {
        // Obtener los datos de la base de datos
        const clientes = await getAllCustomers();

        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();

        // Agregar una nueva hoja al libro
        const worksheet = workbook.addWorksheet('Clientes');

        // Escribir los encabezados de la tabla en la primera fila
        worksheet.columns = [
            { header: 'ID', key: 'customer_id', width: 5 },
            { header: 'DUI', key: 'dui', width: 15 },
            { header: 'Nombre', key: 'name', width: 20  },
            { header: 'Apellido', key: 'lastname', width: 20  },
            { header: 'Teléfono', key: 'phone', width: 15  },
            { header: 'Correo Electrónico', key: 'email', width: 20  },
            { header: 'Ubicacion', key: 'location', width: 20  },
            { header: 'Comentarios', key: 'comment', width: 20  },
        ];

        // Escribir los datos de la tabla en las siguientes filas
        clientes.forEach((cliente) => {
            worksheet.addRow({
                customer_id: cliente.customer_id,
                dui: cliente.dui,
                name: cliente.name,
                lastname: cliente.lastname,
                phone: cliente.phone,
                email: cliente.email,
                location: cliente.location,
                comment: cliente.comment
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=Clientes_reporte.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
        
    } catch (error) {
        console.log('Error generar reporte', error);
        res.status(500).send('Error al generar el reporte');
    }
};

export {
    listarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    formularioClienteNuevo,
    formularioClienteEdicion,
    generarReporte
};

