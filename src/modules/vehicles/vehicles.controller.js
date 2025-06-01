// vehicles.controller.js

import {
  createVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  getVehicleById
} from './vehicles.service.js';
import ExcelJS from 'exceljs';

//Controlador para listar vehículos
const listarVehiculos = async (req, res) => {
    try {
        const vehiculos = await getAllVehicles()

        const datosVista = {
            vehiculos
        };

        res.render('vehicles/list', datosVista);

    } catch (error) {
        console.log('Error al listar vehículos',error);
        res.status(500).render('error', { 
            message: "Error al listar vehículos",
            error: error
        });
    }
};

// Controlador para crear un vehículo
const crearVehiculo = async (req, res) => {
    try {
        const nuevoVehiculo = { ...req.body };

        nuevoVehiculo.vehicle_id = parseInt(nuevoVehiculo.vehicle_id) || 0;

        await createVehicle(nuevoVehiculo);

        if (req.headers['content-type'] === 'application/json') {
            return res.status(200).json({ success: true });
        }
        res.redirect('/vehiculos/list?success=created');
    } catch (error) {
        if (req.headers['content-type'] === 'application/json') {
            return res.status(400).send(error.message || 'Error al crear vehículo');
        }
        res.status(500).render('error', { 
            message: "Error al crear vehículo",
            error: error
        });
    }
};

// Controlador para actualizar vehiculo
const actualizarVehiculo = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const indice = await getVehicleById(id);
        if(indice !== -1){
            await updateVehicle(id, req.body);
        }
        if (req.headers['content-type'] === 'application/json') {
            return res.status(200).json({ success: true });
        }
        res.redirect('/vehiculos/list?success=updated');
    } catch (error) {
        if (req.headers['content-type'] === 'application/json') {
            return res.status(400).send(error.message || 'Error al actualizar vehículo');
        }
        res.status(500).render('error', { 
            message: "Error al actualizar vehículo",
            error: error
        });
    }
};

// Controlador para elminar vehiculo
const eliminarVehiculo = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const indice = await getVehicleById(id);

        if (indice !== -1) {
            await deleteVehicle(id);
            // Respuesta JSON para fetch/AJAX
            return res.status(200).json({ success: true, message: "Vehículo eliminado correctamente" });
        } else {
            return res.status(404).json({ success: false, message: "Vehículo no encontrado" });
        }
    } catch (error) {
        console.log('Error al eliminar vehículo', error);
        return res.status(500).json({
            success: false,
            message: "Error al eliminar vehículo",
            error: error.message || error
        });
    }
}

const generarReporte = async (req, res) => {
    try {
        const vehiculos = await getAllVehicles();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Vehículos');

        worksheet.columns = [
            { header: 'Placa', key: 'placa', width: 15 },
            { header: 'Marca', key: 'marca', width: 15 },
            { header: 'Modelo', key: 'modelo', width: 15 },
            { header: 'Año', key: 'anio', width: 10 },
            { header: 'Color', key: 'color', width: 12 },
            { header: 'Tipo', key: 'tipo_vehiculo', width: 15 },
            { header: 'Estado', key: 'estado', width: 12 },
            { header: 'Fecha Compra', key: 'fecha_compra', width: 15 },
            { header: 'Último Mantenimiento', key: 'ultimo_mantenimiento', width: 20 }
        ];

        vehiculos.forEach(v => worksheet.addRow({
            placa: v.placa,
            marca: v.marca,
            modelo: v.modelo,
            anio: v.anio,
            color: v.color,
            tipo_vehiculo: v.tipo_vehiculo,
            estado: v.estado,
            fecha_compra: v.fecha_compra
                ? new Date(v.fecha_compra).toLocaleDateString('es-ES')
                : '',
            ultimo_mantenimiento: v.ultimo_mantenimiento
                ? new Date(v.ultimo_mantenimiento).toLocaleDateString('es-ES')
                : ''
        }));

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=vehiculos_reporte.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).send('Error al generar el reporte');
    }
};

const mostrarFormularioVehiculo = async (req, res) => {
    try {
        let vehiculo = null;
        if (req.params.id) {
            vehiculo = await getVehicleById(req.params.id);
        }
        res.render('vehicles/form', { vehiculo });
    } catch (error) {
        res.status(500).render('error', {
            message: "Error al mostrar el formulario de vehículo",
            error: error
        });
    }
};


export {
    crearVehiculo,
    listarVehiculos,
    actualizarVehiculo,
    eliminarVehiculo,
    generarReporte,
    mostrarFormularioVehiculo
};