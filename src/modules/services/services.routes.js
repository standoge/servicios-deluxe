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
router.get('/list', listarServicios);
router.get('/nuevo', mostrarFormularioViaje);
router.get('/editar/:id', mostrarFormularioEdicion);

// Rutas para CRUD
router.post('/crear', crearServicio);
router.post('/actualizar/:id', actualizarServicio);
router.delete('/eliminar/:id', eliminarServicio);

export default router;
