const knex = require('./connection');

module.exports = {    
  getOne: function (id) {
    return knex('itemtypefield').where({'id' : id}).first();
  },
  getByItemtype: function (id) {
    if ((typeof id) === "number") {
      return knex('itemtypefield').where({'fielditemtype_id' : id});
    } else {
      return knex('itemtypefield').whereIn('fielditemtype_id', id);
    }
    
  },
  create: function (itemtypefields, add_user_id) {
    return knex('itemtypefield').insert(itemtypefields, 'id')
  }
}