const express = require('express');
const router = express.Router();
// const Item = require('../db/item');
// const Community = require('../db/community');
// const Item_category = require('../db/item_category');
// const Shared = require('../shared');
const item_category_controller = require('../../controllers/item_categoryController')



router.get('/:id', (req, res) => {
  item_category_controller.getItem_category(req, res)
});

function validItem_category(item_category) {
    const validName = item_category.name.trim() != '';
    return validName 
}

router.post('/create', (req, res, next) => {
  item_category_controller.createItem_category(req, res, next)
});

router.patch('/:id', (req, res) => {
  item_category_controller.updateItem_category(req, res)
});

router.get('/:id/item', (req,res)=>{
  item_category_controller.getItem_categoryItems(req, res)
})

router.post('/delete/:id', (req, res) => {
  item_category_controller.deleteItem_category(req, res)
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;