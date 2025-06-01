import { Router } from 'express';
import {
	mostrarListadoConductores,
	renderDriverForm,
	createDriver,
	getDriverById,
	updateDriver
} from './drivers.controller.js';

const router = Router();

// Ruta: http://localhost:3000/conductores/list
router.get('/list', mostrarListadoConductores);

// Ruta: http://localhost:3000/conductores/nuevo
router.get('/nuevo', renderDriverForm);

// Ruta POST para guardar nuevo conductor
router.post('/nuevo', createDriver);

// Ruta: http://localhost:3000/conductores/editar/:id
router.get('/editar/:id', getDriverById);

// Ruta POST para actualizar conductor
router.post('/editar/:id', updateDriver);

// ✅ Exportar después de haber definido todo
export default router;
