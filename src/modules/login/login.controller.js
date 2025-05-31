import { getUserByUsername } from './login.service.js';

const renderLogin = (req, res) => {
    res.render('login/login', { title: 'Login', layout: false });
};

const renderRegister = (req, res) => {
    res.render('login/register', { title: 'Crear Cuenta', layout: false });
};

const authenticateUser = (User) => async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await getUserByUsername(User, username);
        if (user) {
            if (password === user.password) {
                // req.session.user = { username: user.username, id: user.user_id };
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
};

export { renderLogin, renderRegister, authenticateUser };