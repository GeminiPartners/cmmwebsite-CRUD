const knex = require('./connection');

module.exports = {

  getByUser: function(id){
    return knex('item_category')
        .select(knex.raw(`*, item_category.id as item_category_id`))
        .join('community', 'item_category.community_id', 'community.id')
        .join('user_community', 'community.id', 'user_community.community_id')
        .where('user_community.user_id', id);
  },
  getOne: function (id, user_id) {
    return knex('item_category')
    .join('user_community', 'item_category.community_id', 'user_community.community_id')
    .select('item_category.id', 'item_category.name', 'item_category.order', 'item_category.community_id')
    .where({'item_category.id' : id, 'user_community.user_id' : user_id}).first();
  },
  getOneToUpdate: function (id, community_id) {
    return knex('item_category').where({'id' : id, 'community_id': community_id}).first();
  },
  create: function(item_category) {
    return knex('item_category').insert(item_category, 'id').then (ids => {
      return ids[0];
    });
  },
  update: function(item_category) {
    console.log('item category here: ',item_category)
    return knex('item_category').where({'id' : item_category.id}).update({
          name: item_category.name,
          order: item_category.order,
          updated_at: new Date()
    })
  },
  delete: function(id, community_id) {
      return knex('item_category').where({'id' : id}).del().then(function (result) {   
    });
    
  }
}
