const knex = require('./connection');

module.exports = {
  getOne: function (id) {
    return knex('user').where('id', id).first();
  },
  getOneByEmail: function (email) {
    return knex('user').where('email', email).first();
  },
  create: function(user) {
    user.created_at = new Date()
    return knex('user')
      .insert(user, 'id')
      .then (ids => 
        {return ids[0];
        });
  },
  deleteByEmail: function(email) {
    if(process.env.NODE_ENV = 'development'){
      return knex('user').where({'email' : email}).del()   
    } else {
      return {"message" : "not a valid function"}
    }
       
  }
}
