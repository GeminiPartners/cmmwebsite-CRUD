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
    Item
    .getOne(req.params.id, decoded.user_id)
    .then(item => {
      console.log('here is our item: ', item)
      if (item) {
        console.log('item: ',item)
        res.json(item);
      } else {
        resError(res, 404, "Item Not Found");
      }
    })
    .catch(err => {
      console.log(err, err.message)
      resError(res, 404, err.message);
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
    .catch(err => {
      console.log(err, err.message)
      resError(res, 404, err.message);
    });


};

function updateItem (req, res) {
  console.log('update item controller start')
  if (!isNaN(req.params.id)) {
    console.log('parm is a number')
      Shared.allowOrigin(res, req);
      const decoded = Shared.decode(req.headers['auth_token']);
      const itemRequest = Item.getOneToUpdate(req.params.id, decoded.user_id)
      const itemtypefieldsRequest = Itemtypefield.getByItemtype(req.body.itemtype_id)
      console.log('params for itemRequest: ',req.params.id, ', ', decoded.user_id)
      //Retrieve the item and fields in order to validate
      return Promise.all([itemRequest, itemtypefieldsRequest])
      .then(values=> {
        console.log('got through the promis all', values)
        const returned_item = values[0]
        const itemtypefields = values[1]
        if (returned_item) {
            const item_update = {
                id: req.params.id,
                itemname: req.body.itemname,
                itemdescription: req.body.itemdescription,
                price: req.body.price,
                fields: JSON.stringify(req.body.fields),
                user_id: decoded.user_id
            };
            //If the item exists and the user can edit it, verify that it and all its fields are valid
            validateItem = Item.validItem([item_update], itemtypefields)
            //The validateItem function ensures that the item's field properties are set to the itemtype definition
            Item
                .update(validateItem[0].item, decoded.user_id)
                .then(id => {
                    res.json({
                        message: 'item updated'
                        });
            })
            .catch(err => {
              console.log(err, err.message)
              resError(res, 404, err.message);
            }); 
        } else {
            resError(res, 404, "Item Not Found");
        }
        })
        .catch(err => {
          console.log(err, err.message)
          resError(res, 404, err.message);
        });;
  } else {
      resError(res, 500, "Invalid ID");
  }
};

function deleteMultiple (req, res) {
  if (!isNaN(req.body.ids[0])) {
    let item_ids = req.body.ids
    const decoded = Shared.decode(req.headers['auth_token']);
    Shared.allowOrigin(res, req);
    Item
    .getMultipleToUpdate(req.body.ids, decoded.user_id)
    .then(items =>{
      let deleteIDs = []
      items.forEach(item => {
        console.log('here are the items: ', item.id)
        deleteIDs.push(parseInt(item.id))        
      })
      console.log('first id: ', deleteIDs[0])
      return deleteIDs
    })
    .then(deleteIDs => {
      console.log('returned delete ids: ', deleteIDs)
      let diff = item_ids.filter(x => !deleteIDs.includes(x))
      if (deleteIDs.length === 0) {
        resError(res, 404, "Items Not Found");
      } else if (deleteIDs.length === item_ids.length) {
        console.log('about to attempt delete: ', deleteIDs)
        Item.delete(deleteIDs, decoded.user_id).then(id => {
          res.json({
            message: 'items deleted'
          });
        });
      } else {
        Item.delete(deleteIDs, decoded.user_id).then(id => {
          res.json({
            message: 'Some items were not deleted due to permissions, or item did not exist',
            deletedItems: deleteIDs,
            notDeleted: diff
          });
        });
      }
      })
      .catch(err => {
        console.log(err, err.message)
        resError(res, 404, err.message);
      });
  } else {
    resError(res, 500, "Invalid ID");
  }
};

function deleteItem (req, res) {
  if (!isNaN(req.params.id)) {
    const decoded = Shared.decode(req.headers['auth_token']);
    Shared.allowOrigin(res, req);
    Item
    .getOneToUpdate(req.params.id, decoded.user_id)
    .then(item => {
    if (item) {
        Item
        .delete([req.params.id], decoded.user_id)
        .then(id => {
          res.json({
              message: 'item deleted'
              });
            })
            .catch(err => {
              console.log(err, err.message)
              resError(res, 404, err.message);
            });
    } else {
        resError(res, 404, "Item Not Found");
    }
    })
    .catch(err => {
      console.log(err, err.message)
      resError(res, 404, err.message);
    });
  } else {
    resError(res, 500, "Invalid ID");
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
    deleteMultiple
}