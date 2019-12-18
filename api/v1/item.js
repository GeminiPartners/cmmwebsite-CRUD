const express = require('express');
const router = express.Router();
const item_controller = require('./controllers/itemController');

router.get('/user', (req, res) => {
  console.log("right so far")
  item_controller.getItemsByUser(req,res)
});

router.get('/:id', (req, res) => {
  console.log("this one works")
  item_controller.getItem(req,res)
});

router.post('/create', (req, res, next) => {
  item_controller.createItem(req, res, next)
});

router.patch('/:id', (req, res) => {
 item_controller.updateItem(req, res)
});

router.post('/delete/multiple', (req, res) => {
  item_controller.deleteMultiple(req, res)
});

router.post('/delete/:id', (req, res) => {
  item_controller.deleteItem(req, res)
});


function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;