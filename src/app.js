// Load environment variables
import 'dotenv/config';
import { requireAuth } from './middleware/auth.js';
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import session from 'express-session';

// Endpoints
import clientesRoutes from './modules/customers/customers.routes.js';
import loginRoutes from './modules/login/login.routes.js';
import vehiculosRoutes from './modules/vehicles/vehicles.routes.js';
import serviciosRoutes from './modules/services/services.routes.js';
// import mantenimientoRoutes from './modules/mantenimiento/mantenimiento.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import {registerHandlebarsHelpers} from './modules/services/services.controller.js'


// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express();

// Set Content Security Policy
app.use((req, res, next) => {
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap; img-src 'self' data:; font-src 'self' https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap;"
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
	helpers: registerHandlebarsHelpers(),
	runtimeOptions: {
		allowProtoMethodsByDefault: true,
		allowProtoPropertiesByDefault: true
	}
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

// JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'tu_clave_secreta', // cámbiala por una clave segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Usa true solo si usas HTTPS
}));

// Endpoints use
app.use('/', loginRoutes);

// Protege todas las rutas de vehículos y servicios
app.use('/clientes', requireAuth, clientesRoutes);
app.use('/vehiculos', requireAuth, vehiculosRoutes);
// app.use('/servicios', requireAuth, mantenimientoRoutes);
app.use('/viajes',serviciosRoutes);

// Protege el panel de bienvenida
app.get('/panelhome', requireAuth, (req, res) => {
    res.render('panelhome', { title: 'Panel de Bienvenida' });
});


export default app;