import express from 'express';
import {
  listarServicios,
  mostrarFormularioEdicion,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
  mostrarFormularioViaje
} from './services.controller.js'
const router = express.Router();
// Rutas para la interfaz web
router.get('/list/', listarServicios);
router.get('/', mostrarFormularioViaje);
// router.get('/form/:id', mostrarFormularioEdicion);

// Rutas para CRUD
router.post('/', crearServicio);
router.post('/:id', actualizarServicio);
router.delete('/:id', eliminarServicio);

export default router;
