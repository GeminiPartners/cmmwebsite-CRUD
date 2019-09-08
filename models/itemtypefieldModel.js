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
    return knex('itemtypefield')
      .insert(itemtypefields, 'id')
  },
  update: function(itemtypefield, user_id) {
    console.log('about to update: ', itemtypefield)
    return knex('itemtypefield') 
      .where('id', itemtypefield.id)
      .whereIn('fielditemtype_id', function() {
        this.select('itemtype_id')
            .from('marketItemtypeAuth')
            .where('role', '>', '0')
            .where({'user_id': user_id})
            .where('fielditemtype_id', itemtypefield.fielditemtype_id)
      })
      .update({
        'fieldname': itemtypefield.fieldname,
        'fielddescription': itemtypefield.fielddescription,
        'fieldorder': itemtypefield.fieldorder
      })
      .then(result => {
        return result
      })
    
  },
  validItemtypeField: function (itemtypefields, user_id) {
    let countOfresults = []
    let itemtypefieldsResults = [];
    console.log('itemtypefields is array: ', Array.isArray(itemtypefields))    

    if (Array.isArray(itemtypefields)){
      itemtypefields.forEach(itemtypefield => {
        countOfresults.push(1)
        const itemtypefield_id = itemtypefield.id || 0;
        console.log('itemtypefield_id: ', itemtypefield_id);
        console.log('itemtypefields passed in: ', itemtypefield)
        const validFieldname = itemtypefield.fieldname.trim() != '';
        const fieldnameUnique = knex('itemtypefield')
          .where('fielditemtype_id', itemtypefield.fielditemtype_id)
          .where('fieldname', itemtypefield.fieldname)
          .where('id', '!=', itemtypefield_id)
          .then(result => {
            console.log('result of id query: ', result)
            return result.length === 0
          });
        const validDescription = itemtypefield.fielddescription.trim() != '';     
        const validFielditemtype_id = knex('marketItemtypeAuth')
          .where('itemtype_id', itemtypefield.fielditemtype_id)
          .where('user_id', user_id)
          .where('role', '>', 0)
          .then(result => {
            return result.length > 0
          });
        const validFieldorder = !isNaN(itemtypefield.fieldorder);
        const validfielddatatype = [0,1,2].includes(itemtypefield.fielddatatype)
        itemtypefieldsResults.push(Promise
          .all([validFieldname, fieldnameUnique, validDescription, validFielditemtype_id, validFieldorder, validfielddatatype])
          .then(values => {
            console.log('validation values: ', values)
            if (values.every(el => {return el})){
              return {
                itemtypefield: itemtypefield,
                valid: true,
                messages: ["Itemtypefield is valid"]
              }              
            } else {
              let messages = []
              if (!values[0]) {
                messages.push('Field name is invalid')
              };
              if (!values[1]) {
                messages.push(itemtypefield.fieldname.concat(': This itemtype already has a field with this name'))
              };
              if (!values[2]) {
                messages.push(itemtypefield.fieldname.concat(': Field description is not valid'))
              };
              if (!values[3]) {
                messages.push(itemtypefield.fieldname.concat(': Field itemtype id is not valid'))
              };
              if (!values[4]) {
                messages.push(itemtypefield.fieldname.concat(': Field order is not valid'))
              };
              if (!values[5]) {
                messages.push(itemtypefield.fieldname.concat(': Field data type is not valid'))
              }
              return {
                itemtypefield: itemtypefield,
                valid: false,
                messages: messages              
              }
            }
            
          })   
        )       
      })     
      console.log('results: ', itemtypefieldsResults.length, itemtypefieldsResults)
      return Promise
        .all(itemtypefieldsResults)
        .then((results) => {return results})
      // return knex('itemtypefield').insert(itemtypefields, 'id')
         
    } else {
      return [{
        valid: false,
        message: "Valid items not provided"
      }]
    }
    
  }

}