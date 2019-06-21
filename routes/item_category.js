const express = require('express');
const router = express.Router();
const Item = require('../db/item');
const Community = require('../db/community');
const Item_category = require('../db/item_category');
const Shared = require('../shared');



router.get('/:id', (req, res) => {
  if (!isNaN(req.params.id)) {
    Shared.allowOrigin(res);
    const decoded = Shared.decode(req.headers['auth_token']);
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
});

function validItem_category(item_category) {
    const validName = item_category.name.trim() != '';
    return validName 
}

router.post('/create', (req, res, next) => {
  const decoded = Shared.decode(req.headers['auth_token']);
    if(validItem_category(req.body)) {
        Shared.allowOrigin(res);
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
        });

router.patch('/:id', (req, res) => {
  const decoded = Shared.decode(req.headers['auth_token']);
  const item_category_update = {
    id: req.params.id,
    name: req.body.name,
    order: req.body.order    
  };
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res);
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
});


router.post('/delete/:id', (req, res) => {
  const decoded = Shared.decode(req.headers['auth_token']);
  if (!isNaN(req.params.id)) {
      Shared.allowOrigin(res);
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
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;