const express = require('express');
const router = express.Router();
const Item = require('../db/item');
const Sticker = require('../db/sticker');
const Item_category = require('../db/item_category');
const Shared = require('../shared');

router.get('/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
    Shared.allowOrigin(res);
    Item_category.getOne(req.params.id).then(item_category => {
      if (item_category) {
        res.json(item_category);
      } else {
        resError(res, 404, "Item_category Not Found");
      }
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
});

function validItem_category(item_category) {
    const validName = item_category.name.trim() != '';
    return validName 
}

router.post('/create', (req, res, next) => {
    if(validItem_category(req.body)) {
        Shared.allowOrigin(res);
        const item_category = {
            name: req.body.name,
            order: req.body.order,
            community_id: req.body.community_id,
            created_at: new Date()
        };

        Item_category
            .create(item_category)
            .then(id => {
                res.json({
                    id,
                    message: 'item_category posted'
                    });
        });
        // redirect
        } else {
            next(new Error('Invalid item_category'))
        }
        });

router.patch('/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res);
      Item_category.getOneToUpdate(req.params.id, req.body.community_id).then(item_category => {
      if (item_category) {
          const item_category = {
              id: req.params.id,
              name: req.body.name,
              order: req.body.order,
              community_id: req.body.community_id
          };
          Item_category
              .update(item_category)
              .then(id => {
                  res.json({
                      message: 'item_category updated'
                      });
          }); //can probably simplify this function; don't need the id
      } else {
          resError(res, 404, "Item_category Not Found");
      }
      });
  } else {
      resError(res, 500, "Invalid ID");
  }
});

router.post('/delete/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res);
      Item_category.getOneToUpdate(req.params.id, req.body.community_id).then(item_category => {
      if (item_category) {
          Item_category.delete(req.params.id).then(id => {
            res.json({
                message: 'item_category deleted'
                });
              });
      } else {
          resError(res, 404, "Item_category Not Found");
      }
      });
  } else {
      resError(res, 500, "Invalid ID");
  }
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;