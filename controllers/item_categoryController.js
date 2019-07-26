const express = require('express');
const router = express.Router();
const Item = require('../db/item');
const Community = require('../db/community');
const Item_category = require('../db/item_category');
const Shared = require('../shared');



function getItem_category (req, res) {
  if (!isNaN(req.params.id)) {
    Shared.allowOrigin(res, req);
    const decoded = Shared.decodeToken(req);
    Item_category.getOne(req.params.id, decoded.user_id).then(item_category => {
      if (item_category) {
        res.json(item_category);
      } else {
        resError(res, 404, "Item_category Not Found");
      }
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
};

function validItem_category(item_category) {
    const validName = item_category.name.trim() != '';
    return validName 
};

function createItem_category (req, res, next) {
  const decoded = Shared.decodeToken(req);
    if(validItem_category(req.body)) {
        Shared.allowOrigin(res, req);
        const item_category = {
            name: req.body.name,
            order: req.body.order,
            community_id: req.body.community_id,
            created_at: new Date()
        };

        Community.getOneToUpdate(item_category.community_id, decoded.user_id)
        .then(community => {
          console.log('community is: ', community);
          if (community && community.role > 0) {
            return Community.getItem_categories(item_category.community_id)
          } else {
            throw new Error('Cannot post to the community')
          }
        })
        .then(item_categories => {
          let result = item_categories.map(a => a.name);
          if (!result.includes(item_category.name)) {
            return Item_category.create(item_category) 
          } else {
            throw new Error('A category with that name exists in the community')
          }          
        })    
        .then(id => {
                res.json({
                    id,
                    message: 'item_category posted'
                    });
        })
        .catch(err => {
          console.log(err, err.message)
          resError(res, 404, err.message);
        })
        // redirect
    } else {
        next(new Error('Invalid item_category'))
    }
};

function updateItem_category (req, res) {
  const decoded = Shared.decodeToken(req);
  const item_category_update = {
    id: req.params.id,
    name: req.body.name,
    order: req.body.order    
  };
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res, req);
      Item_category
      .getOne(req.params.id, decoded.user_id)
      .then(item_category => {
        console.log('item category returned', item_category);
        if (item_category) {
          return Community.getOne(item_category.community_id, decoded.user_id);
        } else {
          throw new Error('Item Category not found.')
        }
      })      
      .then(community => {
        if (community && community.role > 0) {
          console.log('my community: ', community)
          return Community.getItem_categories(community.id)
        } else {
          throw new Error('Cannot post to the community')
        }
      })
      .then(item_categories => {
        console.log('and the item categories: ', item_categories)
        let result = item_categories.map(a => a.name);
        if (!result.includes(item_category_update.name)) {
          return Item_category.update(item_category_update);
        } else {
          throw new Error('A category with that name exists in the community')
        }          
      }) 
      .then(item_category => {      
                  res.json({
                      message: 'item_category updated'
                      });
          })
      .catch(err => {
        resError(res, 404, err.message);
      });
  } else {
      resError(res, 500, "Invalid ID");
  }
};

function getItem_categoryItems (req,res) {
  const decoded = Shared.decodeToken(req);
  Shared.allowOrigin(res, req);
  if (!isNaN(req.params.id)) {
    Shared.allowOrigin(res, req);
    Item
    .getByItem_category(req.params.id, decoded.user_id)
    .then(items => {
      if(items) {
        res.json(items)
      } else {
        throw new Error('No items in this category')
      }
    })
    .catch(err => {
      resError(res, 404, err.message)
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
};


function deleteItem_category (req, res) {
  const decoded = Shared.decodeToken(req);
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res, req);
      Item_category
      .getOneToUpdate(req.params.id, decoded.user_id)
      .then(item_category => {
      if (item_category && item_category.role > 0) {
          Item_category.delete(req.params.id).then(id => {
            res.json({
                message: 'item_category deleted'
                });
              });
      } else {
          resError(res, 404, "Cannot delete item category");
      }
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
  getItem_category,
  validItem_category,
  createItem_category,
  updateItem_category,
  getItem_categoryItems,
  deleteItem_category,
  resError
};