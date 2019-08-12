const express = require('express');
const router = express.Router();

const Item = require('../models/itemModel');
const Item_category = require('../db/item_category')
const Itemtypefield = require('../models/itemtypefieldModel')
const Shared = require('../shared');

function getItem(req, res) {
  if (!isNaN(req.params.id)) {
    const decoded = Shared.decode(req.headers['auth_token']);
    Shared.allowOrigin(res, req);
    Item.getOne(req.params.id, decoded.user_id)
    .then(item => {
      console.log('here is our item: ', item)
      if (item) {
        console.log('item: ',item)
        res.json(item);
      } else {
        resError(res, 404, "Item Not Found");
      }
    });
  }else {
    resError(res, 500, "Invalid ID");
  }
};
    
  

function validCategories(item_categories, add_item_categories) {
   
    console.log(item_categories)
    var item_category_ids = new Array;
    var validCategories = true;
    for (o in item_categories) {
      item_category_ids.push(item_categories[o].item_category_id);  
    };
    console.log(item_category_ids);
    

    for (i in add_item_categories) {
      if (!item_category_ids.includes(add_item_categories[i])) {
        console.log(add_item_categories[i])
        validCategories = false;
      };
      console.log('valid categories: ',validCategories);
      
    };
    console.log('valid cats to be returned: ', validCategories)
    return validCategories
   
  
};

function validItem(item) {
  console.log('here is the item: ',item);
    const validName = item.name.trim() != '';
    const validDescription = item.description.trim() != '';     
    console.log('validItem func: ', validName, validDescription)
    return validName && validDescription 
};

function uniq(a) {
  return a.sort().filter(function(item, pos, ary) {
      return !pos || item != ary[pos - 1];
  })
};

function createItem(req, res, next) {
  Shared.allowOrigin(res, req);
  const decoded = Shared.decode(req.headers['auth_token']);
  let items = req.body.items
  let itemtype_ids = []
  items.forEach(item => {
    item.owner_id = decoded.user_id;
    item.fields = JSON.stringify(item.fields)
    itemtype_ids.push(item.itemtype_id)
  })
  console.log('itemtype_id array: ', itemtype_ids)

  Itemtypefield
    .getByItemtype(uniq(itemtype_ids))
    .then(itemtypefields => {
      console.log('itemtypefields: ',itemtypefields)
      return Item.validItem(items, itemtypefields)
    })
    .then(results => {
      validitems = []
      errorMessages = []
      results.forEach(result => {
        if (result.valid) {
          validitems.push(result.item)
        } else {
          errorMessages.push(result.message)
        }
        console.log('error messages: ', errorMessages)
        console.log('valid items: ', validitems)
      })
      return Item
      .create(validitems)
      .then(result => {
        res.json({"message" : "Item created!", "ids": result.ids, errorMessages: errorMessages})
      })
      .catch(err => {
        console.log(err, err.message)
        resError(res, 404, err.message);
      });
    })


};

function updateItem (req, res) {
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res, req);
      const decoded = Shared.decode(req.headers['auth_token']);
      Item.getOneToUpdate(req.params.id, decoded.user_id).then(returned_item => {
      if (returned_item) {
        console.log('item to update: ', returned_item)
          const item_update = {
              id: req.params.id,
              itemname: req.body.itemname,
              itemdescription: req.body.itemdescription,
              price: req.body.price,
              fields: JSON.stringify(req.body.fields),
              user_id: decoded.user_id
          };
          Item
              .update(item_update, decoded.user_id)
              .then(id => {
                  res.json({
                      message: 'item updated',
                      id: id
                      });
          }); //can probably simplify this function; don't need the id
      } else {
          resError(res, 404, "Item Not Found");
      }
      });
  } else {
      resError(res, 500, "Invalid ID");
  }
};

function deleteItem (req, res) {
  if (!isNaN(req.params.id)) {
    const decoded = Shared.decode(req.headers['auth_token']);
    Shared.allowOrigin(res, req);
    Item.getOneToUpdate(req.params.id, decoded.user_id).then(item => {
    if (item) {
        Item.delete(req.params.id, decoded.user_id).then(id => {
          res.json({
              message: 'item deleted'
              });
            });
    } else {
        resError(res, 404, "Item Not Found");
    }
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
};

function addItemToCategories (req, res) {
  if (!isNaN(req.params.id)) {
    Shared.allowOrigin(res, req);
    const decoded = Shared.decode(req.headers['auth_token']);    
    const add_item_categories = req.body.item_categories;
    console.log('these are our ids: ', add_item_categories);
  
    Item_category.getByUser(decoded.user_id)
    .then(item_categories => {
      console.log('item_categories: ',item_categories, 'add_item_categories: ', add_item_categories);
      return validCategories(item_categories, add_item_categories)
    })
    .then(categories_are_valid => {
      if (categories_are_valid) {
        return Item.getCategories(req.params.id);
      } else throw new Error('Invalid category!');  
    })
    .then(existingCategories => {
      console.log('our existing categories: ', existingCategories, 'add_item_categories: ', add_item_categories); 
      var noDuplicateCategories = true;
      for(i in existingCategories){
        if (add_item_categories.includes(existingCategories[i].item_category_id)) {
          noDuplicateCategories = false
        };
      };
        if (noDuplicateCategories) {
          return Item.addToItem_Categories(req.params.id, req.body.item_categories);
          console.log('item in categories: ',item)
        } else throw new Error('Item already added to category!');  })
    .then(ids => {
      res.json({ids, "message" : "Item added to categories!"})
    })
    .catch(err => {
      console.log(err, err.message)
      resError(res, 404, err.message);
    });
      
  }
};

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = {
    getItem,
    validCategories,
    validItem,
    uniq,
    createItem,
    updateItem,
    deleteItem,
    addItemToCategories
}