import express from 'express';
import {
  crearVehiculo,
  listarVehiculos,
  actualizarVehiculo,
  eliminarVehiculo
} from './vehicles.controller.js';

const router = express.Router();

// Rutas para la interfaz web
router.get('/list/', listarVehiculos)

// Rutas para CRUD 
router.post('/', crearVehiculo);
router.post('/:id', actualizarVehiculo);
router.delete('/:id', eliminarVehiculo);

export default router;