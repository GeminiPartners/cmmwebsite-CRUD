require('dotenv-safe').config();
const jwt = require('jwt-simple');
const JWT_SECRET = process.env.JWT_SECRET

function decode (token) {
    return(jwt.decode(token, JWT_SECRET));
}

function whitelistCheck(site) {
    const whitelist = process.env.WHITELIST  
    if (whitelist.includes(site)) {
        return site
    } else {
        return ""
    } 
};

function allowOrigin(res, req) {
    const originSite = whitelistCheck(req.header("origin"));
    res.set('Access-Control-Expose-Headers', 'Access-Control-Allow-Origin');
    res.set('Access-Control-Allow-Origin', originSite);
    res.set('Access-Control-Allow-Credentials', 'true');
    return res
};

function decodeToken(req) {
    if (req.headers['auth_token']) {
        console.log('from the header', req.headers['auth_token'])
        return decode(req.headers['auth_token']);
    } else {
        console.log('from the cookies: ', req.signedCookies['auth_token'])
        return decode(req.signedCookies['auth_token'])
    }
};

module.exports = {
    allowOrigin,
    decode,
    decodeToken,
    whitelistCheck
}