const knex = require('./connection');

module.exports = {

  getByUser: function(id){
    return knex('item_category')
        .select(knex.raw(`*, item_category.id as item_category_id`))
        .join('community', 'item_category.community_id', 'community.id')
        .join('user_community', 'community.id', 'user_community.community_id')
        .where('user_community.user_id', id);
  },
  getOne: function (id) {
    return knex('item_category').where('id', id).first();
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
    return knex('item_category').where({'id' : item_category.id, 'community_id' : item_category.community_id}).update({
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
