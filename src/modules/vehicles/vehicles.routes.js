import express from 'express';
import {
  crearVehiculo,
  listarVehiculos,
  actualizarVehiculo,
  eliminarVehiculo,
  generarReporte,
  mostrarFormularioVehiculo // <-- Agrega este controlador
} from './vehicles.controller.js';

const router = express.Router();

// Rutas para la interfaz web
router.get('/list/', listarVehiculos);
router.get('/reporte', generarReporte);
router.get('/form', mostrarFormularioVehiculo); // Para agregar
router.get('/form/:id', mostrarFormularioVehiculo); // Para modificar

// Rutas para CRUD 
router.post('/', crearVehiculo);
router.post('/:id', actualizarVehiculo);
router.delete('/:id', eliminarVehiculo);

export default router;