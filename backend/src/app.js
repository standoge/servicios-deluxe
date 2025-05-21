import 'dotenv/config'; // Load environment variables

import express from 'express';
const app = express();
app.use(express.json());

// Import route modules - ensure these files also use ESM or are compatible
// For example, if vehiculos.routes.js is also converted to ESM:
import vehiculosRoutes from './modules/vehiculos/vehiculos.routes.js';
// If vehiculos.routes.js remains CommonJS, this import might need adjustment
// or the routes file itself needs to be converted. Assuming conversion for now.

app.use('/api/vehiculos', vehiculosRoutes);

export default app;