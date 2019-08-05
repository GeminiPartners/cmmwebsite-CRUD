const knex = require('./connection');

module.exports = {    
  getOne: function (id) {
    console.log('about to return itemtype ', id)
    return knex('itemtypefield').where({'id' : id}).first();
  },
  getByItemtype: function (id) {
    console.log('about to return itemtype ', id)
    return knex('itemtypefield').where({'fielditemtype_id' : id});
  },
  create: function (itemtypefields, add_user_id) {
    return knex('itemtypefield').insert(itemtypefields, 'id')
  }
}