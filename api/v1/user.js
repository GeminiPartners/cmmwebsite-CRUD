const express = require('express');
const router = express.Router();
// const User = require('../db/user');
// const Community = require('../db/community');
// const Item = require('../db/item');
const Shared = require('../../shared');
// const jwt = require('jwt-simple');
// const JWT_SECRET = "kittens"; //change to environment variable
const user_controller = require('../../controllers/userController')

function decodeToken(req) {
  if (req.headers['auth_token']) {
    return Shared.decode(req.headers['auth_token']);
  } else {
    return Shared.decode(req.signedCookies['auth_token'])
  }
}

router.get('/', (req, res) => {
  user_controller.getUser(req, res)
});

router.get('/item', (req,res)=>{
  user_controller.getUserItems(req, res)
});

router.get('/community', (req, res)=>{
  user_controller.getUserCommunities(req, res)
});

router.post('/delete', (req, res) => {
  user_controller.deleteUser(req, res)
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;
