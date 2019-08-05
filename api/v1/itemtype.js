const express = require('express');
const router = express.Router();
const itemtype_controller = require('../../controllers/itemtypeController')
// const Item = require('../db/item');
// const Item_category = require('../db/item_category')
// const Shared = require('../shared');

router.get('/:id', (req, res) => {
  itemtype_controller.getItemtype(req,res)
});

router.post('/create', (req, res, next) => {
  itemtype_controller.createItemtype(req, res, next)
});

// router.patch('/:id', (req, res) => {
//  item_controller.updateItem(req, res)
// });

// router.post('/delete/:id', (req, res) => {
//   item_controller.deleteItem(req, res)
// });

// router.post('/addtocategories/:id', (req, res) => {
//   item_controller.addItemToCategories(req, res)
// });

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;