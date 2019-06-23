const knex = require('./connection');
const Item_category = require('./item_category')

module.exports = {

  getByUser: function(id) {
    return knex('item').where('user_id', id);
  },
  getByCommunity: function(id) {
    return knex('item').join('item_category_item', 'item.id', 'item_category_item.item_id')
      .join('item_category', 'item_category_item.item_category_id', 'item_category.id')
      .select('item.name', 'item.description', 'item.instructions', 'item.default_instructions_suppress', 'item.created_at', 'item.updated_at')
      .where('item_category.community_id', id);
  },
  getOneByCommunity: function(id, community_id) {
    return knex('item').join('item_category_item', 'item.id', 'item_category_item.item_id')
      .join('item_category', 'item_category_item.item_category_id', 'item_category.id')
      .where({'item_category.community_id' : community_id, 'item.id' : id});
  },
  getOneToUpdate: function (id, user_id) {
    return knex('item').where({'id' : id, 'user_id': user_id}).first();
  },
  getOne: function(id, user_id) {
    return knex('item')      
      .join('item_category_item', 'item.id', 'item_category_item.item_id')
      .join('item_category', 'item_category_item.item_category_id', 'item_category.id')
      .join('user_community', 'item_category.community_id', 'user_community.community_id')
      .select('item.name', 'item.description', 'item.default_instructions_suppress', 'item.instructions', 'item.user_id', 'item.created_at', 'item.updated_at')
      .where({'item.id' : id, 'user_community.user_id' : user_id}).first();
  },
  getCategories: function(id) {
    return knex('item')
      .join('item_category_item', 'item.id', 'item_category_item.item_id')
      .where({'item.id' : id});
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
    console.log(item);
    return knex('item').where({'id' : item.id}).update({
        'name': item.name,        
        'description': item.description,
        'instructions': item.instructions,
        'default_instructions_suppress': item.default_instructions_suppress,
        'updated_at': new Date()
    })
  },
  delete: function(id, user_id) {
    console.log('in the db function: ', id, ', ', user_id);
    return knex('item').where({'id' : id}).del().then(function (result) {
      console.log('result: ',result);      
    });
  },
  addToItem_Categories: function(id, item_categories){
    var item_category_items = [];
    for (i in item_categories) {
      item_category_items.push({item_id : id, item_category_id : item_categories[i], created_at: new Date()})
    };
    return knex('item_category_item').insert(item_category_items, 'id').then (ids => {
      return ids;
    });
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
