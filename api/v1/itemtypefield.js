const express = require('express');
const router = express.Router();
const itemtypefield_controller = require('./controllers/itemtypefieldController')
// const Item = require('../db/item');
// const Item_category = require('../db/item_category')
// const Shared = require('../shared');

router.get('/:id', (req, res) => {
  itemtypefield_controller.getItemtypefield(req,res)
});

router.get('/itemtype/:id', (req, res) => {
    itemtypefield_controller.getItemtypefieldsByItemtype(req,res)
});

router.post('/create', (req, res, next) => {
  itemtypefield_controller.createItemtypeFields(req, res, next)
});

router.patch('/:id', (req, res) => {
 itemtypefield_controller.updateItemtypeField(req, res)
});

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