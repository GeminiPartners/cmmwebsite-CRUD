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
      .validItemtype(itemtype_update,decoded.user_id)
      .then(result => {
        console.log('valid item type result: ', result)
        console.log('is result valid: ', result.valid)
        if (result.valid === true){
          console.log('item update is run')
          return Itemtype.update(result.itemtype, decoded.user_id)
        } else {
          console.log('res error is run')
          throw new Error(result.message)
        }
      })        
      .then(result => {
        if (result > 0) {
          res.json({
            message: 'item updated'
          });
        } else {
          resError(res, 404, "Item not found, or no permission to update")
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

function deleteItemtype (req, res) {
  if (validIDs(req.body.ids)) {
    const decoded = Shared.decode(req.headers['auth_token']);
    Shared.allowOrigin(res, req);
    Itemtype
    .delete(req.body.ids, decoded.user_id)
    .then(results => {    
      console.log('delete results: ', results)
      if (results === req.body.ids.length) {
        res.json({
          message: 'item deleted'
        });
      } else if (results > 0) {
        res.json({
          message: 'some itemtypes were not deleted; itemtype not found or user did not have permissions'
        })
      } else {
        resError(res, 404, "Itemtype Not Found");
      }

    })
    .catch(err => {
      resError(res, 404, err.message);
    });;
  } else {
    resError(res, 500, "Invalid ID");
  }
};

function validIDs (ids) {
  if (Array.isArray(ids)) {
    return ids.every(element => {return !isNaN(element)}) 
  } else {
    return false
  }
}


function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = {
    getItemtype,
    createItemtype,
    updateItemtype,
    deleteItemtype
}