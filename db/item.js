const knex = require('./connection');

module.exports = {

  getByUser: function(id){
    return knex('item').where('user_id', id);
  }
}
