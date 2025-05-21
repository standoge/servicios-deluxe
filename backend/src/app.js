const express = require('express');
const app = express();
app.use(express.json());

const vehiculosRoutes = require('./modules/vehiculos/vehiculos.routes');
app.use('/api/vehiculos', vehiculosRoutes);
module.exports = app;