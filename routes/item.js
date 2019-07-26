const express = require('express');
const router = express.Router();
const item_controller = require('../controllers/itemController')
const Item = require('../db/item');
const Item_category = require('../db/item_category')
const Shared = require('../shared');

router.get('/:id', (req, res) => {
  item_controller.getItem(req,res)
});
    
  

// function validCategories(item_categories, add_item_categories) {
   
//     console.log(item_categories)
//     var item_category_ids = new Array;
//     var validCategories = true;
//     for (o in item_categories) {
//       item_category_ids.push(item_categories[o].item_category_id);  
//     };
//     console.log(item_category_ids);
    

//     for (i in add_item_categories) {
//       if (!item_category_ids.includes(add_item_categories[i])) {
//         console.log(add_item_categories[i])
//         validCategories = false;
//       };
//       console.log('valid categories: ',validCategories);
      
//     };
//     console.log('valid cats to be returned: ', validCategories)
//     return validCategories
   
  
// };

// function validItem(item) {
//   console.log('here is the item: ',item);
//     const validName = item.name.trim() != '';
//     const validDescription = item.description.trim() != '';     
//     console.log('validItem func: ', validName, validDescription)
//     return validName && validDescription 
// };

// function uniq(a) {
//   return a.sort().filter(function(item, pos, ary) {
//       return !pos || item != ary[pos - 1];
//   })
// };

router.post('/create', (req, res, next) => {
  item_controller.createItem(req, res, next)
});

router.patch('/:id', (req, res) => {
 item_controller.updateItem(req, res)
});

router.post('/delete/:id', (req, res) => {
  item_controller.deleteItem(req, res)
});

router.post('/addtocategories/:id', (req, res) => {
  item_controller.addItemToCategories(req, res)
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;