const knex = require('./connection');

module.exports = {

//   getByUser: function(id){
//     return knex('community').where('user_id', id);
//   },
  getOne: function (id, user_id) {
    return knex('community').join('user_community', 'community.id', 'user_community.community_id').where({'community.id' : id, 'user_community.user_id' : user_id}).first();
  },
  getOneByName: function(name) {
    return knex('community').where('name', name).first()
  },
  getOneToUpdate: function (id, user_id) {
    return knex('community').join('user_community', 'community.id', 'user_community.community_id').where({'community.id' : id, 'user_community.user_id' : user_id}).first();
  },
  create: function(community) {
    return knex('community').insert(community, 'id').then (ids => {
      return ids[0];
    });
  },
  update: function(community) {
    return knex('community').where({'id' : community.id}).update({
        'name': community.name,        
        'description': community.description,
        'community_type': community.community_type
    })
  },
  delete: function(id, user_id) {
    return knex('community').where({'id' : id}).del().then(function (result) {
      console.log('result: ',result);      
    });    
  },
  getUserCommunity: function(user_id, community_id) {
    return knex('user_community').where({'user_id' : user_id, 'community_id' : community_id}).first()
  },
  addUser: function(user_community) {
    return knex('user_community').insert(user_community, 'id').then (ids => {
      return ids[0];
    });
  },
  removeUser: function(id) {
    return knex('user_community').where({'id' : id}).del().then(function (result) {  
    });   
  }
}
