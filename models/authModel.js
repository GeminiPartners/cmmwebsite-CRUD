const knex = require('./connection');

module.exports = {    
  ItemtypeAuthQuery: function (id) 
    return knex('itemtype')
        .where({'id' : id}).;
  }
}