import bcrypt from 'bcrypt';
import { Router } from 'express';
import { createRequire } from 'module';
import sequelize from '../../config/sequelize.js';
import { requireAuth } from '../../middleware/auth.js';
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
                // Redirigir al panel de bienvenida
                return res.redirect('/panelhome');
            } else {
                return res.status(401).render('login/login', { 
                    title: 'Login', 
                    layout: false, 
                    error: 'Usuario o contraseña inválida' 
                });
            }
        } else {
            return res.status(401).render('login/login', { 
                title: 'Login', 
                layout: false, 
                error: 'Usuario o contraseña inválida' 
            });
        }
    } catch (error) {
        console.error('No fue posible realizar la autenticación:', error);
        return res.status(500).render('login/login', { 
            title: 'Login', 
            layout: false, 
            error: 'Error en servidor' 
        });
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

		// Redireccionar si es con éxito
		return res.redirect('/panelhome');
	} catch (error) {
		console.error('El usuario no pudo ser creado:', error);
		res.status(500).json({
			success: false,
			message: 'Error en la creación del usuario'
		});
	}
});

// UPDATE 
router.put('/:id', requireAuth ,async (req, res) => {
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

	} catch (error) {
		console.error('Error al actualizar el usuario:', error);
		res.status(500).json({
			success: false,
			message: 'Error al actualizar el usuario'
		});
	}
});

// DELETE 
router.delete('/:id',requireAuth ,async (req, res) => {
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