const express = require('express');
const router = express.Router();
const User = require('../db/user');
const Community = require('../db/community');
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

function getUser (req, res) {
  Shared.allowOrigin(res, req);
  const decoded = Shared.decodeToken(req);

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
};

function getUserItems (req,res) {
  Shared.allowOrigin(res, req);
  const decoded = Shared.decodeToken(req);
  if (!isNaN(decoded.user_id)) {
    Shared.allowOrigin(res, req);
    Item.getByUser(decoded.user_id).then(items => {
      res.json(items);
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
};

function getUserCommunities (req, res) {
  Shared.allowOrigin(res, req);
  const decoded = Shared.decodeToken(req);
  console.log(decoded);
  if (!isNaN(decoded.user_id)) {
    Community.getByUser(decoded.user_id).then(communities => {
      res.json(communities);
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
};

function deleteUser (req, res) {
  Shared.allowOrigin(res, req);

  const decoded = Shared.decodeToken(req);
  console.log('req.body')
  if (!isNaN(decoded.user_id)) {    
    User
      .deleteByEmail(req.body.email)
      .then(response => {
        res.json({"message" : "item deleted"})
      })
    }else {
    resError(res, 500, "Invalid ID");
  }
};

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = {
    decodeToken,
    getUser,
    getUserItems,
    getUserCommunities,
    deleteUser,
    resError
};
