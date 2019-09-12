const knex = require('./connection');
const amqp = require('amqplib/callback_api');
const connString = 'amqp://hcktxhys:nfHt2kNtc8dImNkmrMJSYEuI9Noaw8ug@cat.rmq.cloudamqp.com/hcktxhys'
const async = require('async')
const CustomFields = require('./customfieldModel')
const Itemtypefield = require('./itemtypefieldModel')

module.exports = { 

  getByUser: function(id) {
    return knex('item').where('owner_id', id);
  },
  getOneByName: function (name) {
    console.log('about to return item by name: ', name)
    return knex('item').where({'itemname' : name}).first();
  },
  getOne: function (id) {
    return knex('item').where({'id' : id}).first();
  },
  getAllOfType: function (itemtype_id) {
    return knex('item').where({'itemtype_id' : itemtype_id});
  },
  getMultipleOffset: function (itemtype_id, limit, offset) {
    return knex('item')
      .where({'itemtype_id' : itemtype_id})
      .limit(limit)
      .offset(offset)
  },
  countAllOfType: function (itemtype_id) {
    return knex('item').where({'itemtype_id' : itemtype_id}).count({count: '*'});
  },
  getOneToUpdate: function (id, user_id) {
    return knex('item').where({'id' : id, 'owner_id': user_id}).first();
  },
  getMultipleToUpdate: function (ids, user_id) {
    //Create a clause for the whereIn with the ownerId and item id of each
    clause = []
    ids.forEach(id => {
      clause.push([user_id, id])
    })
    return knex('item').whereIn(['owner_id', 'id'], clause);
  },
  create: function(items,  errorMessages) {

    return knex('item').insert(items, 'id')
      .then(ids => {
        itemfields = []
        let i = 0;
        for (i = 0; i < items.length; i++) { 
          itemfields.push({id: ids[i], fields: items[i].fields});
        }
        amqp.connect(connString, function(error0, connection) {
          if (error0) {
              throw error0;
          }
          connection.createChannel(function(error1, channel) {
              if (error1) {
                  throw error1;
              }
      
              const queue = 'task_queue';
              const msgObj = {action: 'loadItemFields', item_fields: itemfields};
              const msg = JSON.stringify(msgObj)
              console.log('create message', msg)
      
              channel.assertQueue(queue, {
                  durable: true
              });
              channel.sendToQueue(queue, Buffer.from(msg), {
                persistent: true
              });
      
              console.log(" [x] Sent %s", msg);
          });
          setTimeout(function() {
              connection.close();
              // process.exit(0);
          }, 500);
          console.log('IDs logged by Item Create: ', ids)          
      });
      return {
        ids: ids
      }  
      })
  },
  update: function(item, user_id) {
    return knex('item').where({'id': item.id, 'owner_id': user_id}).update({
        'itemname': item.itemname,
        'itemdescription': item.itemdescription,
        'price': item.price,
        'fields': item.fields,
        'updated_at': new Date()
    })
    .then(id => {      
      let myitemfields = []
      myitemfields.push({id: id, fields: item.fields})
      
      amqp.connect(connString, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
    
            const queue = 'task_queue';
            const msgObj = {action: 'loadItemFields', item_fields: myitemfields};
            const msg = JSON.stringify(msgObj)
            console.log('update message: ', msg)
    
            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(msg), {
              persistent: true
            });
    
            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function() {
            connection.close();
            // process.exit(0);
        }, 500);
        console.log('IDs logged by Item Update: ', id)          
    });
    return {
      id: id
    }  
    })
  },
  delete: function(ids, user_id) {
    return knex('item')
    .where('owner_id', user_id)
    .whereIn('id', ids)
    .del() 
  },
  updateCustomFields: function(item_fields){    
    // Take all of the custom fields from an item's custom fields column and update the custom fields tables
    // to match.
    console.log('about to get Item ', item_fields)
    let ids = []
    item_fields.forEach(item => {
      ids.push(item.id)
    })
    console.log('ids extracted from item_fields: ', ids)
    CustomFields
      .deleteFieldInstances(ids)
      .then(results => {
        console.log('results of promise dete return: ', results)
        let textFields = []
        let numberFields = []
        let dateFields = []
        item_fields.forEach(item =>{
          console.log('item from forEach: ',item)
          const fields = JSON.parse(item.fields) 
          fields.forEach(field => {
            item_id = item.id
            switch(field.fielddatatype) {
              case 0:
                console.log('Text field Name: ', field.fieldname, ' value: ', field.value) 
                textField = {
                  textfield_id: field.id,
                  textfieldvalue: field.value,
                  textfielditem_id: item_id
                }
                textFields.push(textField)
                console.log('text field example: ', item)
                break;
              case 1:
                console.log('Number field Name: ', field.fieldname, ' value: ', field.value) 
                numberField = {
                  numberfield_id: field.id,
                  numberfieldvalue: field.value,
                  numberfielditem_id: item_id
                }
                numberFields.push(numberField)
                break;
              case 2:
                console.log('Date field Name: ', field.fieldname, ' value: ', field.value) 
                dateField = {
                  datefield_id: field.id,
                  datefieldvalue: field.value,
                  datefielditem_id: item_id
                }
                dateFields.push(dateField)
              default:
                // code block
            }
          });
        })

        const addTextFields = CustomFields.addTextFieldInstance(textFields);
        const addNumberFields = CustomFields.addNumberFieldInstance(numberFields);
        const addDateFields = CustomFields.addDateFieldInstance(dateFields)

        return Promise
          .all([addTextFields, addNumberFields, addDateFields])

      })
  },
  updateItemWithFieldDetails: function(item, itemtypefield) {
    let fields = item.fields;
    if (fields) {
      const index = fields.findIndex(element => element.id === itemtypefield.id);
      const oldField = fields[index];
      const newField = {
        id: oldField.id, 
        value: oldField.value, 
        fieldname: itemtypefield.fieldname, 
        fieldorder: itemtypefield.fieldorder,
        fielddatatype: oldField.fielddatatype
      };
      console.log('update new field: ', newField, ', item id: ', item.id)
      fields.splice(index, 1, newField);
      return  knex('item')
        .where({'id' : item.id})
        .update({
          fields: JSON.stringify(fields)
        });
    } else {
      return true
    }
    
    
  },
  validItem: function(items, itemtypefields) {
    let itemsResults = []
    items.forEach(item => {
      //validate Item fields and the custom fields associated with an item
      const validName = item.itemname.trim() != '';
      const validDescription = item.itemdescription.trim() != ''; 
      const validPrice = !isNaN(item.price);

      //Initially, we set validFields to true and msg to "Item is valid".
      //The code below changes the message and validFields property if an error 
      //is found in the custom fields.
      validFields = true
      
      let fields = JSON.parse(item.fields)

      //If any errors are found in the fields array, they are appended to the fieldmsg variable.
      fieldMsg = "invalid fields"
      fields.forEach(field => {
        const itemtypefield = itemtypefields.find(element => element.id  === field.id);
        field.fieldname = itemtypefield.fieldname;
        field.fieldorder = itemtypefield.fieldorder;
        const validFielddatatype = itemtypefield.fielddatatype === field.fielddatatype;
        //The itemtypefield.fieldatatype determines the criteria used to validate the field.
        //This validation only ensures that the data is the proper type; further validation rules for custom fields
        //such as high and low limites for numbers are only enforced at the UI.
        switch (itemtypefield.fielddatatype) {
          case 0:
            if (typeof(field.value) != "string") {
              validFields = false
              fieldMsg = fieldMsg.concat(": ", field.fieldname, " value is not a string")
            };
            break;
          case 1:
            if (typeof(field.value) != "number") {
              validFields =  false
              fieldMsg = fieldMsg.concat(": ", field.fieldname, " value is not a number")
            };
            break;
          case 2:
            if ((new Date(field.value)).toString() === "Invalid Date") {
              fieldMsg = fieldMsg.concat(": ", field.fieldname, " value is not a date (format 'YYYY-MM-DD')")
              validFields = false
            };
            break;
        }
        //Ensure that the Fielddatatype is correct.
        if (!validFielddatatype) {
          validFields = false
          fieldMsg = fieldMsg.concat(": ", field.fieldname, " datatype does not match the datatype ", itemtypefield.fielddatatype)
        }
      })
      item.fields = JSON.stringify(fields)
      const isValidItem = validName && validDescription && validPrice && validFields
      let msg = []
      if (isValidItem) {
        msg.push("Item is valid")
      } else {
        if (!validName) {
          msg.push("Enter a valid name.") 
        } 
        if (!validDescription) {
          msg.push("Enter a valid description.")
        } 
        if (!validPrice) {
          msg.push("Enter a valid price.")
        } 
        if (!validFields) {
          msg.push(fieldMsg)
        }
      }
      
      itemsResults.push({
        item: item,
        valid: isValidItem,
        message: msg
      }); 
    })
    return itemsResults
  }
}
