// Load environment variables
import 'dotenv/config';

import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

// Endpoints
import loginRoutes from './modules/login/login.routes.js';
import vehiculosRoutes from './modules/vehicles/vehicles.routes.js';
import serviciosRoutes from './modules/services/services.routes.js';
import {registerHandlebarsHelpers} from './modules/services/services.controller.js'
import conductoresRoutes from './modules/drivers/drivers.routes.js';
import clientesRoutes from './modules/customers/customers.routes.js';




// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express();

// Set Content Security Policy
app.use((req, res, next) => {
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
	);
	next();
});

app.use(express.static(path.join(__dirname, '../public')));

// Configure Handlebars
app.engine('hbs', engine({
	defaultLayout: 'main', //En este layout podria ponerse el header o algo asi
	layoutsDir: path.join(__dirname, '../views/layouts'),
	partialsDir: path.join(__dirname, '../views/partials'),
	extname: '.hbs',
	helpers: registerHandlebarsHelpers()
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

// JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints use
app.use('/', loginRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/servicios', serviciosRoutes);
app.use('/conductores', conductoresRoutes);
app.use('/clientes', clientesRoutes);

// app.use(methodOverride('_method'));



export default app;