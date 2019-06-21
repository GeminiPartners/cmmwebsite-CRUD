const express = require('express');
const router = express.Router();
const User = require('../db/user');
const Sticker = require('../db/sticker');
const Item = require('../db/item');
const Shared = require('../shared');
const jwt = require('jwt-simple');
const JWT_SECRET = "kittens"; //change to environment variable


router.get('/', (req, res) => {
  const decoded = Shared.decode(req.headers['auth_token']);
  if (!isNaN(decoded.user_id)) {
    Shared.allowOrigin(res);
    User.getOne(decoded["user_id"]).then(user => {
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
  const decoded = Shared.decode(req.headers['auth_token']);
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
