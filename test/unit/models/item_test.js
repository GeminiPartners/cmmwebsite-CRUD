
const Item = require('../../../models/itemModel');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiInteger = require('chai-integer');

// set up the middleware
chai.use(chaiAsPromised);
chai.use(chaiInteger);
var should = require('chai').should() 



describe('Unit: Item.getByUser', function() {
  context('With valid id', function() {
    const owner_id = 1;
    const expectedResult = "Amazing Spider-Man 135";
    it('should return items', function() {
      return Item
      .getByUser(owner_id)
      .then(items => {
        items[0].itemname.should.equal(expectedResult);
        });    
      });  
    });
 
  context('With invalid id', function() {
    const owner_id = 2000;
    const expectedResult = [];
    it('should be null results', function() {
      return Item.getByUser(owner_id).should.eventually.eql(expectedResult)
    });
  });
});

describe('Unit: Item.create', function() {
    const newItem = {
        itemname: "She Hulk 127",
        itemdescription: "A She-hulk comic",
        itemtype_id: 1,
        price: 15.25,
        fields: [
          {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 'The Sensational She-Hulk'},
          {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 20},
          {id: 3, fieldname:'Volume', fielddatatype: 1, fieldorder: 2, value: 1},
          {id: 4, fieldname:'Cover Date', fielddatatype: 2, fieldorder: 3, value: '1983-03-31'}
        ]
    }
    context('With valid item info', function() {
      const owner_id = 1;
      after(function() {
        return Item
        .getOneByName(newItem.itemname)
        .then(item => {
            console.log('item: ', item)
            Item.delete(item.id, owner_id)
        })
        .then(response => {
            return response
        })
        .catch(error => {
            return(error)
        })
      });   
      it('should return item id for the created item', function() {
        return Item
        .create(newItem, owner_id)
        .then(item => {
          item.should.be.an.integer();          
          });    
        });  
    });     
});

describe('Unit: Item.update', function() {
    const newItem = {
        itemname: "She Hulk 127",
        itemdescription: "A She-hulk comic",
        itemtype_id: 1,
        price: 15.25
    }
    const updateItem = {
        itemname: "NEW: She Hulk 127",
        itemdescription: "NEW: A She-hulk comic",
        price: 25.25
    }
    context('With valid item info', function() {
      const owner_id = 1;
      after(function() {
        return Item
        .getOneByName(newItem.itemname)
        .then(item => {
            Item.delete(item.id, owner_id)
        })
        .then(response => {
            return response
        })
        .catch(error => {
            return(error)
        })
      })   
      it('should return item id for the created item', function() {
        return Item
        .create(newItem, owner_id)
        .then(item => {
          item.should.be.an.integer();          
          });    
        });  
    });     
});
