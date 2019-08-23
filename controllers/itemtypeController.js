const express = require('express');

const Item = require('../models/itemModel');
const Itemtype = require('../models/itemtypeModel')
const Shared = require('../shared');

function getItemtype(req, res) {
  if (!isNaN(req.params.id)) {
    const decoded = Shared.decode(req.headers['auth_token']);
    Shared.allowOrigin(res, req);
    Itemtype.getOne(req.params.id)
    .then(itemtype => {
      console.log('here is our itemtype: ', itemtype)
      if (itemtype) {
        console.log('item: ',itemtype)
        res.json(itemtype);
      } else {
        resError(res, 404, "Item Not Found");
      }
    });
  }else {
    resError(res, 500, "Invalid ID");
  }
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
 
  Itemtype
    .validItemtype(itemtype, decoded.user_id)
    .then(result => {
      if (result.valid){
        console.log('Itemtype create')
        return Itemtype.create(result.itemtype, decoded.user_id)
      } else {
        throw new Error(result.message)
      }      
    })
    .then(ids => {
      console.log('controller ids: ',ids)
      res.json({"message" : "Itemtype created!", "id": ids})
    })
    .catch(err => {
      console.log(err, err.message)
      resError(res, 404, err.message);
    });
  };

function updateItemtype (req, res) {
  if (!isNaN(req.params.id)) {
    Shared.allowOrigin(res, req);
    const decoded = Shared.decode(req.headers['auth_token']);  
    const itemtype_update = {
        id: req.params.id,
        itemtypename: req.body.itemtypename,
        itemtypedescription: req.body.itemtypedescription,
        itemtypeorder: req.body.itemtypeorder,
        itemtypemarket: req.body.itemtypemarket
    };
    Itemtype
        .update(itemtype_update, decoded.user_id)
        .then(result => {
            res.json({
                message: 'item updated'
                });
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


function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = {
    getItemtype,
    createItemtype,
    updateItemtype
}