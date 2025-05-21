const express = require('express');
const router = express.Router();
// Login
router.get('/login', (req, res) => res.render('login/login'));
// Vehiculos
router.get('/vehiculos', (req, res) => res.render('vehicles/list'));
router.get('/vehiculos/registro', (req, res) => res.render('vehicles/form'));
// Clientes
router.get('/clientes', (req, res) => res.render('customers/list'));
router.get('/clientes/registro', (req, res) => res.render('customers/form'));
// Conductores
router.get('/conductores', (req, res) => res.render('drivers/list'));
router.get('/conductores/registro', (req, res) => res.render('drivers/form'));
// Servicios
router.get('/servicios', (req, res) => res.render('services/list'));
router.get('/servicios/registro', (req, res) => res.render('services/form'));

module.exports = router;