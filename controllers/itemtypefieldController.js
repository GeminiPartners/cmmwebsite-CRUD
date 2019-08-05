const express = require('express');

const Item = require('../models/itemModel');
const Itemtypefield = require('../models/itemtypefieldModel')
const Shared = require('../shared');

function getItemtypefield(req, res) {
  if (!isNaN(req.params.id)) {
    const decoded = Shared.decode(req.headers['auth_token']);
    Shared.allowOrigin(res, req);
    Itemtypefield.getOne(req.params.id)
    .then(itemtypefield => {
      console.log('here is our itemtypefield: ', itemtypefield)
      if (itemtypefield) {
        console.log('item: ',itemtypefield)
        res.json(itemtypefield);
      } else {
        resError(res, 404, "Item Not Found");
      }
    });
  }else {
    resError(res, 500, "Invalid ID");
  }
}; 

function getItemtypefieldsByItemtype(req, res) {
    if (!isNaN(req.params.id)) {
      const decoded = Shared.decode(req.headers['auth_token']);
      Shared.allowOrigin(res, req);
      Itemtypefield.getByItemtype(req.params.id)
      .then(itemtypefields => {
        console.log('here is our itemtypefield: ', itemtypefields)
        if (itemtypefields) {
          console.log('item: ',itemtypefields)
          res.json(itemtypefields);
        } else {
          resError(res, 404, "Item Not Found");
        }
      });
    }else {
      resError(res, 500, "Invalid ID");
    }
  }; 
  



function validItemType(itemtype) {
  console.log('here is the item: ',item);
    const validName = itemtype.itemtypename.trim() != '';
    const validDescription = itemtype.itemtypedescription.trim() != '';     
    console.log('validItem func: ', validName, validDescription)
    return validName && validDescription 
};

function uniq(a) {
  return a.sort().filter(function(item, pos, ary) {
      return !pos || item != ary[pos - 1];
  })
};

function createItemtype(req, res, next) {
  Shared.allowOrigin(res, req);
  const decoded = Shared.decode(req.headers['auth_token']);
  console.log('body of request: ', req.body)
  const itemtype = {
    itemtypename: req.body.itemtypename,
    itemtypedescription: req.body.itemtypedescription,
    itemtypeorder: req.body.itemtypeorder,
    itemtypemarket: req.body.itemtypemarket
  };
  
 
  // if (item_is_valid) {
  //       return 
  // } else throw new Error('Invalid item!')}
  Itemtype
    .create(itemtype, decoded.user_id)
    .then(ids => {
      console.log('controller ids: ',ids)
      res.json({"message" : "Itemtype created!", "id": ids})
    })
    .catch(err => {
      console.log(err, err.message)
      resError(res, 404, err.message);
    });
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
              name: req.body.name,
              description: req.body.description,
              instructions: req.body.instructions,
              default_instructions_suppress: req.body.default_instructions_suppress,
              user_id: decoded.user_id
          };
          Item
              .update(item_update, decoded.user_id)
              .then(id => {
                  res.json({
                      message: 'item updated'
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
    getItemtypefield,
    getItemtypefieldsByItemtype
}