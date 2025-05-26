import bcrypt from 'bcrypt';
import { Router } from 'express';
import { createRequire } from 'module';
import sequelize from '../../config/sequelize.js';
const require = createRequire(import.meta.url);
const initModelsFunction = require('../../models/init-models.cjs');

const models = initModelsFunction(sequelize);
const User = models.users;

const router = Router();

// HOME
router.get('/login', (req, res) => {
	res.render('login/login', { title: 'Login', layout: false }); //login/login es views/login/login.hbs
});

// AUTH
router.post('/autenticar', async (req, res) => {
	const { username, password } = req.body;

	try {
		// Verificar que es usuario activo
		const user = await User.findOne({
			where: {
				username: username,
				active: true
			}
		});

		if (user) {
			//Verificar contraseña encriptada
			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (isPasswordValid) {
				req.session.user = {
					username: user.username,
					id: user.user_id,
					role_id: user.role_id
				};

				//Acá deben de hacerlo redireccionarse al home
				res.json({
					success: true,
					message: 'Bienvenido',
					userId: user.user_id,
					roleId: user.role_id
				});
			} else {
				res.status(401).json({ success: false, message: 'Usuario o contraseña inválida' });
			}
		} else {
			res.status(401).json({ success: false, message: 'Usuario o contraseña inválida' });
		}
	} catch (error) {
		console.error('No fue posible realizar la autenticación:', error);
		res.status(500).json({ success: false, message: 'Error en servidor' });
	}
});

// CREATE 
router.post('/', async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({
			success: false,
			message: 'El nombre de usuario y la contraseña son obligatorios'
		});
	}

	try {
		const existingUser = await User.findOne({ where: { username } });
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: 'El usuario ya existe'
			});
		}

		//Hashing
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const newUser = await User.create({
			username,
			password: hashedPassword,
			active: true
		});

		res.status(201).json({
			success: true,
			message: 'Usuario creado éxitosamente',
			user: {
				user_id: newUser.user_id,
				username: newUser.username,
				active: newUser.active
			}
		});
	} catch (error) {
		console.error('El usuario no pudo ser creado:', error);
		res.status(500).json({
			success: false,
			message: 'Error en la creación del usuario'
		});
	}
});

// UPDATE 
router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { username, password } = req.body;

	try {
		const user = await User.findOne({
			where: {
				user_id: id,
				active: true
			}
		});

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'EL usuario no fue encontrado'
			});
		}

		const updateData = {};

		// Actualizacion de nombre de usuario
		if (username) {
			const existingUser = await User.findOne({
				where: {
					username,
					user_id: { [sequelize.Sequelize.Op.ne]: id } // Buscar usuarios con el mismo nombre de usuario, pero diferente ID
				}
			});

			if (existingUser) {
				return res.status(409).json({
					success: false,
					message: 'No se puede actualizar el usuario, ya que el nombre de usuario ya existe'
				});
			}

			updateData.username = username;
		}

		// Actualizacion de contraseña
		if (password) {
			const saltRounds = 10;
			updateData.password = await bcrypt.hash(password, saltRounds);
		}

		await user.update(updateData);

		res.json({
			success: true,
			message: 'Usuario actualizado',
			user: {
				user_id: user.user_id,
				username: user.username,
				active: user.active
			}
		});
	} catch (error) {
		console.error('Error al actualizar el usuario:', error);
		res.status(500).json({
			success: false,
			message: 'Error al actualizar el usuario'
		});
	}
});

// DELETE 
router.delete('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findOne({
			where: {
				user_id: id,
				active: true
			}
		});

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		// Logical deletion - set active to false
		await user.update({ active: false });

		res.json({
			success: true,
			message: 'User deleted successfully'
		});
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).json({
			success: false,
			message: 'Error deleting user'
		});
	}
});

export default router;