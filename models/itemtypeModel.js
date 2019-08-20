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
    return knex('itemtype')        
    .whereIn('id', function() {
      this.select('itemtype_id')
          .from('marketItemtypeAuth')
          .where('role', '>', '0')
          .where({'user_id': user_id})
          .whereIn('itemtype_id', ids)
    })
    .del()    
  },
  validItemtype: function(itemtype, user_id) {
    const itemtypenameNotEmtpy = itemtype.itemtypename.trim() != "";
    const itemtypeorderIsNumber = !isNaN(itemtype.itemtypeorder)
    const itemtypenameUnique = knex('itemtype')
      .where('itemtypemarket', itemtype.itemtypemarket)
      .where('itemtypename', itemtype.itemtypename)
      .then(result => {
        console.log('result of itemtypename check', result)
        return result.length === 0
      });
    const itemtypeMarketIsValid = knex('marketItemtypeAuth')
      .where('user_id', user_id)
      .where('market_id', itemtype.itemtypemarket)
      .where('role', '>', 0)
      .then(result => {
        console.log('itemtypemarketisvalid result', result)
        if (result.length === 0) {
          return false
        } else {
          return true
        }        
      })
    return Promise
      .all([itemtypenameNotEmtpy, itemtypenameUnique, itemtypeorderIsNumber, itemtypeMarketIsValid])
      .then(values => {
        console.log('promise values: ', values)
        return values
      })
  }
}