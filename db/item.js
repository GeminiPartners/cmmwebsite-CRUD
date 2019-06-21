const knex = require('./connection');
const Item_category = require('./item_category')

module.exports = {

  getByUser: function(id) {
    return knex('item').where('user_id', id);
  },
  getByCommunity: function(id) {
    return knex('item').join('item_category_item', 'item.id', 'item_category_item.item_id')
      .join('item_category', 'item_category_item.item_category_id', 'item_category.id')
      .where('item_category.community_id', id);
  },
  getOne: function(id, community_id) {
    return knex('item').join('item_category_item', 'item.id', 'item_category_item.item_id')
      .join('item_category', 'item_category_item.item_category_id', 'item_category.id')
      .where({'item_category.community_id' : community_id, 'item.id' : id});
  },
  getOneToUpdate: function (id, user_id) {
    return knex('item').where({'id' : id, 'user_id': user_id}).first();
  },
  create: function(item, item_categories, add_user_id) {
    const add_item = {
      name: item.name,
      description: item.description,
      instructions: item.description,
      default_instructions_suppress: item.default_instructions_suppress,
      user_id: add_user_id,
      created_at: new Date()
    }
    return knex('item').insert(add_item, 'id')
      .then (ids => {     
        var item_category_items = [];
        for (i in item_categories) {
          item_category_items.push({item_id : ids[0], item_category_id : item_categories[i], created_at: new Date()})
        };
        console.log(item_category_items)
        return knex('item_category_item').insert(item_category_items);
      }).then(ids => {
        return ids
      });
  },
  update: function(item) {
    return knex('item').where({'id' : item.id, 'user_id' : item.user_id}).update({
        'name': item.name,        
        'description': item.description,
        'instructions': item.instructions,
        'default_instructions_suppress': item.default_instructions_suppress
    })
  },
  delete: function(id, user_id) {
    console.log('in the db function: ', id, ', ', user_id);
    return knex('item').where({'id' : id}).del().then(function (result) {
      console.log('result: ',result);      
    });
  },
  addToItem_Category: function(item_category_item){
    return knex('item_category_item').insert(item_category_item, 'id').then (ids => {
      return ids[0];
    })
  },
  validItem: function(item, user_id) {
    const validName = item.name.trim() != '';
    const validDescription = item.description.trim() != ''; 
    var validCategories = true;
    console.log('set validCategories: ', validCategories)
    Item_category.getByUser(user_id).then(item_categories => {
      console.log(item_categories)
      var item_category_ids = new Array;
      for (o in item_categories) {
        item_category_ids.push(item_categories[o].item_category_id);
      };
      console.log(item_category_ids)
      for (i in item.item_categories) {
        if (!item_category_ids.includes(item.item_categories[i])) {
          console.log(item.item_categories[i])
          validCategories = false;
        };
        console.log('valid categories: ',validCategories);
        
      };
      console.log(validName , validDescription , validCategories)
      
    });    
    return validName && validDescription && validCategories; 
}
}
