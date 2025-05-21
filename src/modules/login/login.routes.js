import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	res.render('login/login', { title: 'Login', loyout: false });
});

export default router;