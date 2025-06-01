export function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    // Si quieres, puedes guardar la ruta original para redirigir después del login
    console.log('PROTECT ROUTE!!!');
    req.session.redirectTo = req.originalUrl;
    res.redirect('/');
}