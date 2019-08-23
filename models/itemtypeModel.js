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
    return knex('marketItemtypeAuth')
      .where('user_id', add_user_id)
      .where('market_id', itemtype.itemtypemarket)
      .where('role', '>', 0)
      .first()
      .then(result => {
        if (result.role > 0) {
          return knex('itemtype').insert(add_itemtype, 'id')
        } else {
          throw new Error('Invalid market ID or user does not have permissions')
        }
        
      })
  },  
  update: function(itemtype, user_id) {
    console.log('itemtype to be updated: ',itemtype);
    return knex('itemtype').where({'id': itemtype.id}).update({
        'itemtypename': itemtype.itemtypename,
        'itemtypedescription': itemtype.itemtypedescription,
        'itemtypeorder': itemtype.itemtypeorder,
        'itemtypemarket': itemtype.itemtypemarket,
        'updated_at': new Date()
    })
    .then(result =>{
      return result
    })
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
        const isValidItemtype = values[0] && values[1] && values[2] && values[3] 
        let msg = []
        if (!values[0]) {
          msg.push('Itemtype Name is empty')
        }
        if (!values[1]) {
          msg.push('Itemtype Name is already in use for this Market')
        }
        if (!values[2]) {
          msg.push('Itemtype Order must be a valid number')
        }
        if (!values[3]) {
          msg.push('Itemtype Market is not vallid or user does not have permissions')
        }
        return {
          itemtype: itemtype,
          valid: isValidItemtype,
          message: msg
        }
      })
  }
}