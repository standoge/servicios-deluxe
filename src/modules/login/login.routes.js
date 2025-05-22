import { Router } from 'express';
import { createRequire } from 'module';
import sequelize from '../../config/sequelize.js';
const require = createRequire(import.meta.url);
const initModelsFunction = require('../../models/init-models.cjs');

const models = initModelsFunction(sequelize);
const User = models.users;

const router = Router();

router.get('/', (req, res) => {
	res.render('login/login', { title: 'Login', layout: false });
});

router.post('/authenticate', async (req, res) => { // Make the handler async
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ where: { username: username } });

		if (user) {
			if (password === user.password) {
				// req.session.user = { username: user.username, id: user.user_id }; // Store user in session
				// For now, let's just send a success message or redirect
				// res.redirect('/vehiculos'); 
				res.json({ success: true, message: 'Login successful', userId: user.user_id });
			} else {
				res.status(401).json({ success: false, message: 'Invalid username or password' });
			}
		} else {
			res.status(401).json({ success: false, message: 'Invalid username or password' });
		}
	} catch (error) {
		console.error('Error during authentication:', error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
});

export default router;