const knex = require('./connection');
const amqp = require('amqplib/callback_api');
const connString = 'amqp://hcktxhys:nfHt2kNtc8dImNkmrMJSYEuI9Noaw8ug@cat.rmq.cloudamqp.com/hcktxhys'
const async = require('async')
const CustomFields = require('./customfieldModel')

module.exports = {

  getByUser: function(id) {
    return knex('item').where('owner_id', id);
  },
  getOneByName: function (name) {
    return knex('item').where({'itemname' : name}).first();
  },
  getOne: function (id) {
    console.log('about to return item ', id)
    return knex('item').where({'id' : id}).first();
  },
  getOneToUpdate: function (id, user_id) {
    return knex('item').where({'id' : id, 'owner_id': user_id}).first();
  },
  create: function(item,  add_user_id) {
    const add_item = {
      itemname: item.itemname,
      itemdescription: item.itemdescription,
      itemtype_id: item.itemtype_id,
      price: item.price,
      fields: JSON.stringify(item.fields),
      owner_id: add_user_id,
      created_at: new Date()
    }
    return knex('item').insert(add_item, 'id')
      .then(ids => {
        amqp.connect(connString, function(error0, connection) {
          if (error0) {
              throw error0;
          }
          connection.createChannel(function(error1, channel) {
              if (error1) {
                  throw error1;
              }
      
              const queue = 'hello';
              const msgObj = {action: 'loadItemFields', item_id: ids[0]};
              const msg = JSON.stringify(msgObj)
      
              channel.assertQueue(queue, {
                  durable: false
              });
              channel.sendToQueue(queue, Buffer.from(msg));
      
              console.log(" [x] Sent %s", msg);
          });
          setTimeout(function() {
              connection.close();
              // process.exit(0);
          }, 500);
          console.log('IDs logged by Item Create: ', ids)          
      });
      return ids
      })
  },
  update: function(item) {
    console.log(item);
    return knex('item').where({'id' : item.id}).update({
        'itemname': item.itemname,
        'itemdescription': item.itemdescription,
        'price': item.price,
        'updated_at': new Date()
    })
  },
  delete: function(id, user_id) {
    console.log('in the db function: ', id, ', ', user_id);
    return knex('item').where({'id' : id}).del().then(function (result) {
      console.log('result: ',result);      
    });
  },
  addToItem_Categories: function(id, item_categories){
    var item_category_items = [];
    for (i in item_categories) {
      item_category_items.push({item_id : id, item_category_id : item_categories[i], created_at: new Date()})
    };
    return knex('item_category_item').insert(item_category_items, 'id').then (ids => {
      return ids;
    });
  },
  updateCustomFields: function(id){    
    // Take all of the custom fields from an item's custom fields column and update the custom fields tables
    // to match.
    console.log('about to get Item ', id)
    const deleteFields = CustomFields.deleteFieldInstances(id);
    const returnItem = knex('item').where({'id' : id}).first()
    return Promise
      .all([deleteFields, returnItem])
      .then(results => {
        console.log('results of promise dete return: ', results)
        item = results[1]
        let textFields = []
        let numberFields = []
        let dateFields = []
        item.fields.forEach(field => {
          switch(field.fielddatatype) {
            case 0:
              console.log('Text field Name: ', field.fieldname, ' value: ', field.value) 
              textField = {
                textfield_id: field.id,
                textfieldvalue: field.value,
                textfielditem_id: id
              }
              textFields.push(textField)
              console.log('text field example: ', item)
              break;
            case 1:
              console.log('Number field Name: ', field.fieldname, ' value: ', field.value) 
              numberField = {
                numberfield_id: field.id,
                numberfieldvalue: field.value,
                numberfielditem_id: id
              }
              numberFields.push(numberField)
              break;
            case 2:
              console.log('Date field Name: ', field.fieldname, ' value: ', field.value) 
              dateField = {
                datefield_id: field.id,
                datefieldvalue: field.value,
                datefielditem_id: id
              }
              dateFields.push(dateField)
            default:
              // code block
          }
        });
        const addTextFields = CustomFields.addTextFieldInstance(textFields);
        const addNumberFields = CustomFields.addNumberFieldInstance(numberFields);
        const addDateFields = CustomFields.addDateFieldInstance(dateFields)

        return Promise
          .all([addTextFields, addNumberFields, addDateFields])

      })
  },
  validItem: function(item, user_id) {
    const validName = item.name.trim() != '';
    const validDescription = item.description.trim() != ''; 
      
    return validName && validDescription; 
}
}
