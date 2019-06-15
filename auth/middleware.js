const Shared = require('../shared');

function ensureLoggedIn(req, res, next) {
    const decoded = Shared.decode(req.headers['auth_token']);//jwt.decode(req.headers['auth_token'], JWT_SECRET);
    
    if(decoded.is_active) {
        next();
    } else {
        res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
        res.set('Access-Control-Allow-Credentials', 'true');
        res.status(401);
        next(new Error('Un-Authorized'));
    }
}



module.exports = {
    ensureLoggedIn
}