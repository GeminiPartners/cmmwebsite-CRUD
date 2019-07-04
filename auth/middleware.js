const Shared = require('../shared');

function ensureLoggedIn(req, res, next) {
    const decoded = Shared.decodeToken(req);//jwt.decode(req.headers['auth_token'], JWT_SECRET);
    console.log('decoded is: ',decoded);
    //if(decoded.is_active) {
    if(decoded.is_active) {
        next();
    } else {
        res.status(401);
        next(new Error('Un-Authorized'));
    }
}




module.exports = {
    ensureLoggedIn
}