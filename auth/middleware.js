const Shared = require('../shared');

function ensureLoggedIn(req, res, next) {
    const decoded = Shared.decodeToken(req);//jwt.decode(req.headers['auth_token'], JWT_SECRET);
    console.log('decoded is: ',decoded);
    //if(decoded.is_active) {
    if(decoded.is_active) {
        next();
    } else {
        // res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
        // res.set('Access-Control-Allow-Credentials', 'true');
        res.status(401);
        next(new Error('Un-Authorized'));
    }
}

// function allowAccess(req, res, next) {
//     if(req.signedCookies.user_id==req.params.id) {
//         next();
//         console.log('should be working')
//     } else {
//         res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
//         res.set('Access-Control-Allow-Credentials', 'true');
//         res.status(401);
//         next(new Error('Un-Authorized'));
//     }
// }


module.exports = {
    ensureLoggedIn
}