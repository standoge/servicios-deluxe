import { Pool } from 'pg';

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

pool.on('connect', () => {
	console.log('Conectado a POSTGRESQL!');
});

pool.on('error', (err) => {
	console.error('Error en la conexión a la base de datos', err);
	process.exit(-1);
});

const db = {
	query: (text, params) => pool.query(text, params),
	pool,
};

export default db;
