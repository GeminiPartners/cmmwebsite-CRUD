const express = require('express');
const router = express.Router();
// const User = require('../db/user');
// const Item_category = require('../db/item_category');
// const Community = require('../db/community');
// const Item = require('../db/item');
// const Shared = require('../shared');
const community_controller = require('../controllers/communityController')

router.get('/:id', (req, res) => {  
  community_controller.getCommunity(req, res)
});


router.post('/create', (req, res, next) => {
  community_controller.createCommunity(req, res, next)
});

router.get('/:id/item', (req, res)=>{
  community_controller.getCommunityItems(req, res)
});

router.get('/:id/category', (req, res)=>{
  community_controller.getCommunityCategories(req, res)
});

router.patch('/:id', (req, res) => {
  community_controller.updateCommunity(req, res)
});

router.post('/delete/:id', (req, res) => {
  community_controller.deleteCommunity(req, res)
});

router.post('/addUser/:id', (req, res, next) => {
  community_controller.addUserToCommunity(req, res, next)
});

router.post('/removeUser/:id', (req, res) => {
  community_controller.removeUserFromCommunity(req, res)
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
};

module.exports =  router;