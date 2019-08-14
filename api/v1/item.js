const express = require('express');
const router = express.Router();
const item_controller = require('../../controllers/itemController')
// const Item = require('../db/item');
// const Item_category = require('../db/item_category')
// const Shared = require('../shared');

router.get('/:id', (req, res) => {
  item_controller.getItem(req,res)
});

router.get('/user', (req, res) => {
  item_controller.getItem(req,res)
});

router.post('/create', (req, res, next) => {
  item_controller.createItem(req, res, next)
});

router.patch('/:id', (req, res) => {
 item_controller.updateItem(req, res)
});

router.post('/delete/:id', (req, res) => {
  item_controller.deleteItem(req, res)
});


function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;