const knex = require('./connection');

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
  create: function(item) {
    return knex('item').insert(item, 'id').then (ids => {      
      return ids[0];
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
  }
}