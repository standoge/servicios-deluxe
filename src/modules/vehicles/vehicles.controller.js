// vehicles.controller.js

import {
  createVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle
} from './vehicles.service.js';

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
        const nuevoVehiculo = {
            ...req.body
        };
        await createVehicle(nuevoVehiculo);

        res.redirect('/vehiculos/list?success=created');

    } catch (error) {
        console.log('Error al crear vehículo',error);
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

        const indice = vehicles.findIndex((vehiculo) => vehiculo.vehicle_id === id);
        if(indice !== -1){
            await updateVehicle(id, req.body);
        };

        res.redirect('/vehiculos/list?success=updated');

    } catch (error) {
        console.log('Error al actualizar vehículo',error);
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

        const indice = vehicles.findIndex((vehiculo) => vehiculo.vehicle_id === id);

        if(indice !== -1){
            await deleteVehicle(id);
        };

        res.redirect('/vehiculos/list?success=deleted');

    } catch (error) {
        console.log('Error al eliminar vehículo',error);
        res.status(500).render('error', { 
            message: "Error al eliminar vehículo",
            error: error
        });
    }
}
 

export {
    crearVehiculo,
    listarVehiculos,
    actualizarVehiculo,
    eliminarVehiculo
};