import { Router } from 'express';
import { createRequire } from 'module';
import sequelize from '../../config/sequelize.js';
const require = createRequire(import.meta.url);
const initModelsFunction = require('../../models/init-models.cjs');

import { renderLogin, renderRegister, authenticateUser,logout } from './login.controller.js';

const models = initModelsFunction(sequelize);
const User = models.users;

const router = Router();

router.get('/', renderLogin);

router.post('/authenticate', authenticateUser(User));

router.get('/register', renderRegister);

router.get('/logout',logout);

export default router;