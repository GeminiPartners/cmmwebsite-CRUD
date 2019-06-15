const jwt = require('jwt-simple');
const JWT_SECRET = "kittens"; //change to environment variable

function ensureLoggedIn(req, res, next) {
    console.log(req.headers['auth_token']);
    const decoded = jwt.decode(req.headers['auth_token'], JWT_SECRET);
    
    console.log(decoded);
    if(decoded.is_active) {
        next();
        console.log('should be working')
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