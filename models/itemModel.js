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
    async.parallel([
      function(callback) {
          CustomFields.deleteFieldInstances(id)
          .then(result => {
              callback(null, result)
          })            
      }
    ],
    function(err, results) {
      console.log(results);
      // the results array will equal [1, 2] even though
      // the second function had a shorter timeout.
    });
    console.log('about to get Item ', id)
    return knex('item').where({'id' : id}).first()
      .then(item => {
        item.fields.forEach(field => {
          switch(field.fielddatatype) {
            case 0:
              console.log('Text field Name: ', field.fieldname, ' value: ', field.value) 
              break;
            case 1:
              console.log('Number field Name: ', field.fieldname, ' value: ', field.value) 
              break;
            case 2:
              console.log('Date field Name: ', field.fieldname, ' value: ', field.value) 
            default:
              // code block
          }
        });
      })
  },
  validItem: function(item, user_id) {
    const validName = item.name.trim() != '';
    const validDescription = item.description.trim() != ''; 
      
    return validName && validDescription; 
}
}
