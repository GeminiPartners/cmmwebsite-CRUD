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
  },
  validItemtypeField(itemtypefields, user_id) {
    itemtypefield = itemtypefields[0]
    console.log('here is the item: ',itemtypefield);
    const itemtypefield_id = itemtypefield.id || 0;
    const validFieldname = itemtypefield.fieldname.trim() != '';
    const fieldnameUnique = knex('itemtypefield')
      .where('fielditemtype_id', itemtypefield.fielditemtype_id)
      .where('fieldname', itemtypefield.fieldname)
      .where('id', '!=', itemtypefield_id)
      .then(result => {
        console.log('result of itemtypefieldname unique check', result)
        return result.length === 0
      });
    const validDescription = itemtypefield.fielddescription.trim() != '';     
    const validFielditemtype_id = knex('marketItemtypeAuth')
      .where('itemtype_id', itemtypefield.fielditemtype_id)
      .where('user_id', user_id)
      .where('role', '>', 0)
      .then(result => {
        console.log('validfielditemtypeid result: ', result)
        return result.length > 0
      });
    const validFieldorder = !isNaN(itemtypefield.fieldorder);
    const validfielddatatype = [0,1,2].includes(itemtypefield.fielddatatype)
    return Promise
      .all([validFieldname, fieldnameUnique, validDescription, validFielditemtype_id, validFieldorder, validfielddatatype])
      .then(values => {
        console.log('itemtypefield validation: ', values)
        return values
      })

  }
}