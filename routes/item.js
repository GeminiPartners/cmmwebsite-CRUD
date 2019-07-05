const express = require('express');
const router = express.Router();
const User = require('../db/user');
const Community = require('../db/community');
const Item = require('../db/item');
const Item_category = require('../db/item_category')
const Shared = require('../shared');

router.get('/:id', (req, res) => {
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
});
    
  

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

router.post('/create', (req, res, next) => {
  Shared.allowOrigin(res, req);
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
        return Item.create(item, uniq(add_item_categories), decoded.user_id);
      } else throw new Error('Invalid item!') 
  }).then(ids => {
    res.json({"message" : "Item created!"})
  })
  .catch(err => {
    console.log(err, err.message)
    resError(res, 404, err.message);
  });
});

router.patch('/:id', (req, res) => {
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
});

router.post('/delete/:id', (req, res) => {
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
});

router.post('/addtocategories/:id', (req, res) => {
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
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;