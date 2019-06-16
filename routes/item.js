const express = require('express');
const router = express.Router();
const User = require('../db/user');
const Community = require('../db/community');
const Item = require('../db/item');
const Shared = require('../shared');

router.get('/:id', (req, res) => {
  if (!isNaN(req.params.id) && !isNaN(req.body.community_id)) {
    const decoded = Shared.decode(req.headers['auth_token']);
    Shared.allowOrigin(res);
    Community.getOne(req.body.community_id, decoded.user_id).then(community => {
      if(community){
        console.log(community);
        Item.getOne(req.params.id, req.body.community_id).then(item => {
          if (item[0]) {
            console.log('item: ',item)
            res.json(item[0]);
          } else {
            resError(res, 404, "Item Not Found");
          }
        });
      } else {
        resError(res, 404, "Item Not Found");
      }

    })
    
  } else {
    resError(res, 500, "Invalid ID");
  }
});

function validItem(item) {
    const validName = item.name.trim() != '';
    const validDescription = item.description.trim() != ''; 
    return validName && validDescription
}

router.post('/create', (req, res, next) => {
    if(validItem(req.body)) {
        Shared.allowOrigin(res);
        const decoded = Shared.decode(req.headers['auth_token']);
        const item = {
            name: req.body.name,
            description: req.body.description,
            instructions: req.body.instructions,
            default_instructions_suppress: req.body.default_instructions_suppress,
            instructions: req.body.instructions,
            user_id: decoded.user_id,
            created_at: new Date()
        };
//Do more work to check validity of item category ids
        Item
            .create(item)
            .then(id => {
              for (i in req.body.item_categories) {
                var item_category_item = {
                  item_id: id,
                  item_category_id: req.body.item_categories[i],
                  created_at: new Date()
                };
                Item.addToItem_Category(item_category_item);
              };
              res.json({
                  id,
                  message: 'item posted'
                  });
        });
        // redirect
        } else {
            next(new Error('Invalid item'))
        }
        });

router.patch('/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res);
      Item.getOneToUpdate(req.params.id, req.body.user_id).then(item => {
      if (item) {
          const item = {
              id: req.params.id,
              name: req.body.name,
              description: req.body.description,
              instructions: req.body.instructions,
              default_instructions_suppress: req.body.default_instructions_suppress,
              user_id: req.body.user_id
          };
          Item
              .update(item)
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
});

router.post('/delete/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res);
      Item.getOneToUpdate(req.params.id, req.body.user_id).then(item => {
      if (item) {
          Item.delete(req.params.id, req.body.user_id).then(id => {
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
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;