const express = require('express');
const router = express.Router();
const User = require('../db/user');
const Sticker = require('../db/sticker');
const Item = require('../db/item');
const Shared = require('../shared');
const jwt = require('jwt-simple');
const JWT_SECRET = "kittens"; //change to environment variable

function decodeToken(req) {
  if (req.headers['auth_token']) {
    return Shared.decode(req.headers['auth_token']);
  } else {
    return Shared.decode(req.signedCookies['auth_token'])
  }
}

router.get('/', (req, res) => {

  const decoded = decodeToken(req);
  res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.set('Access-Control-Allow-Credentials', 'true');

  console.log('haha decoded: ', decoded)

  if (!isNaN(decoded.user_id)) {    
    User.getOne(decoded.user_id).then(user => {
      if (user) {
        delete user.password;
        res.json(user);
      } else {
        resError(res, 404, "User Not Found");
      }
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
});

router.get('/item', (req,res)=>{
  const decoded = decodeToken(req);
  res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.set('Access-Control-Allow-Credentials', 'true');
  if (!isNaN(decoded.user_id)) {
    Shared.allowOrigin(res);
    Item.getByUser(decoded.user_id).then(items => {
      res.json(items);
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
})

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;
