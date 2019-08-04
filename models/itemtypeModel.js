const knex = require('./connection');

module.exports = {
    getOne: function (id) {
        console.log('about to return itemtype ', id)
        return knex('itemtype').where({'id' : id}).first();
      },
}