const express = require('express');
const router = express.Router();
const User = require('../db/user');
const Community = require('../db/community');
const Item = require('../db/item');
const Item_category = require('../db/item_category')
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

function validCategories(item_categories, add_item_categories) {
   
    console.log(item_categories)
    var item_category_ids = new Array;
    for (o in item_categories) {
      item_category_ids.push(item_categories[o].item_category_id);
    };
    console.log(item_category_ids);
    var validCategories = true;

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
}

router.post('/create', (req, res, next) => {
  const decoded = Shared.decode(req.headers['auth_token']);
  const item = {
    name: req.body.name,
    description: req.body.description,
    instructions: req.body.instructions,
    default_instructions_suppress: req.body.default_instructions_suppress
  }  ;
  const add_item_categories = req.body.item_categories;

  console.log('req body: ',item);

  Item_category.getByUser(decoded.user_id)
  .then(item_categories => {
    return validCategories(item_categories, req.body.item_categories)
  })  
  .then(categories_are_valid => {
    console.log('valid cats returned: ', categories_are_valid)
      if (categories_are_valid) {
        return validItem(item);
        console.log('item in categories: ',item)
      } else throw new Error('Invalid category!');  })
  .then(item_is_valid => {
      if (item_is_valid) {
        return Item.create(item, add_item_categories, decoded.user_id);
      } else throw new Error('Invalid item!') 
  }).then(ids => {
    res.json({"message" : "Item created!"})
  })
  .catch(err => {
    console.log(err, err.message)
    resError(res, 404, err.message);
  })
 
  
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