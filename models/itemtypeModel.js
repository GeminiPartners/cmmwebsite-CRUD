const knex = require('./connection');

module.exports = {    
  getOne: function (id) {
    console.log('about to return itemtype ', id)
    return knex('itemtype').where({'id' : id}).first();
  },
  create: function (itemtype, add_user_id) {
    const add_itemtype= {
      itemtypename: itemtype.itemtypename,
      itemtypedescription: itemtype.itemtypedescription,
      itemtypeorder: itemtype.itemtypeorder,
      itemtypemarket: itemtype.itemtypemarket,
      created_at: new Date()
    }
    return knex('itemtype').insert(add_itemtype, 'id')
  },  
  delete: function(id, user_id) {
    console.log('in the db function: ', id, ', ', user_id);
    return knex('item').whereIn('id', [13, 14]).del().then(function (result) {
      console.log('result: ',result);      
    });
  }
}