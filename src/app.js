// Load environment variables
import 'dotenv/config';

// Libraries
import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

// Endpoints
import userRoutes from './modules/users/users.routes.js';
import vehiculosRoutes from './modules/vehicles/vehicles.routes.js';

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

// Configure Handlebars
app.engine('hbs', engine({
	defaultLayout: 'main', //En este layout podria ponerse el header o algo asi
	layoutsDir: path.join(__dirname, '../views/layouts'),
	partialsDir: path.join(__dirname, '../views/partials'),
	extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

// Session configuration
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false, 
		maxAge: 24 * 60 * 60 * 1000 // 24 hrs
	}
}));

// JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route
app.get('/', (req, res) => {
	if (req.session.user) {
		res.redirect('/inicio'); // Este endpoint no existe, pero deberia de ser la vista principal al entrar (Servicios)
	} else {
		res.redirect('usuarios/login');
	}
});

// Endpoints use
app.use('/usuarios', userRoutes);
app.use('/vehiculos', vehiculosRoutes);

export default app;