import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
	process.env.DB_DATABASE,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
		dialect: 'postgres',
		logging: console.log, 
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		}
	}
);

export default sequelize;
