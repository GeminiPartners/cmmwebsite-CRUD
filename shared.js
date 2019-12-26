require('dotenv-safe').config();
const UuidEncoder= require('uuid-encoder')
const encoder = new UuidEncoder('base64url')
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

function UUID(
    a                  // placeholder
  ){
    return a           // if the placeholder was passed, return
      ? (              // a random number from 0 to 15
        a ^            // unless b is 8,
        Math.random()  // in which case
        * 16           // a random number from
        >> a/4         // 8 to 11
        ).toString(16) // in hexadecimal
      : (              // or otherwise a concatenated string:
        [1e7] +        // 10000000 +
        -1e3 +         // -1000 +
        -4e3 +         // -4000 +
        -8e3 +         // -80000000 +
        -1e11          // -100000000000,
        ).replace(     // replacing
          /[018]/g,    // zeroes, ones, and eights with
          UUID            // random hex digits
        )
  };

  function encodeID(id) {
    return encoder.encode(id)
  };

  function decodeID(hash) {
    return encoder.decode(hash)
  };

module.exports = {
    allowOrigin,
    decode,
    decodeToken,
    encodeID,
    decodeID,
    whitelistCheck,
    UUID
}