const jwt = require('jwt-simple');
const JWT_SECRET = "kittens"; //change to environment variable

function decode (token) {
    return(jwt.decode(token, JWT_SECRET));
}

function allowOrigin(res) {
    res.set('Access-Control-Expose-Headers', 'Access-Control-Allow-Origin');
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    res.set('Access-Control-Allow-Credentials', 'true');
    };



module.exports = {
    allowOrigin,
    decode
}