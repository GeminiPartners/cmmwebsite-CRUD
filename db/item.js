const knex = require('./connection');

module.exports = {

  getByUser: function(id){
    return knex('item').where('user_id', id);
  },
  getOne: function (id) {
    return knex('item').where('id', id).first();
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
    
    console.log('finished query')
  }
}
