const knex = require('./connection');
const Auth = require('./authModel')

module.exports = {    
  getOne: function (id) {
    console.log('about to return itemtype ', id)
    return knex('itemtype').where({'id' : id}).first();
  },    
  getOneByName: function (name) {
    console.log('about to return itemtype ', name)
    return knex('itemtype').where({'itemtypename' : name}).first();
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
  delete: function(ids, user_id) {
    // const authIds = knex.select(itemtype)
    // clause = []
    // ids.forEach(id => {
    //   clause.push([user_id, id, 2])
    // })
    return knex('itemtype')        
    .whereIn('id', function() {
      this.select('itemtype_id')
          .from('marketItemtypeAuth')
          .where('role', '>', '0')
          .where({'user_id': user_id})
          .whereIn('itemtype_id', ids)
    })
    .del()
   
    
  }
}