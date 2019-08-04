
const Item = require('../../../models/itemModel');
const CustomField = require('../../../models/customfieldModel');
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

describe('Unit: CustomField.deleteFieldInstances', function() {
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
  context('Where fields exist', function() {
    const itemID= 1;
    // after(function() {
    //   return Item
    //   .getOneByName(newItem.itemname)
    //   .then(item => {
    //       Item.delete(item.id, owner_id)
    //   })
    //   .then(response => {
    //       return response
    //   })
    //   .catch(error => {
    //       return(error)
    //   })
    // })   
    it('should delete the fields for the specified item', function() {
      return CustomField
      .deleteFieldInstances(itemID)
      .then(results => {
        console.log('test results of delete: ', results)
        results[0].should.equal(1);          
        });    
      });  
  });     
});

describe('Unit: CustomField.addTextFieldInstance', function() {
  const newTextField = {
      textfield_id: 1,
      textfieldvalue: "My test",
      textfielditem_id: 2
  }

  context('With valid field info', function() {
    // after(function() {
    //   return Item
    //   .getOneByName(newItem.itemname)
    //   .then(item => {
    //       Item.delete(item.id, owner_id)
    //   })
    //   .then(response => {
    //       return response
    //   })
    //   .catch(error => {
    //       return(error)
    //   })
    // })   
    it('should add a text item and receive an ID', function() {
      return CustomField
      .addTextFieldInstance(newTextField)
      .then(ids => {
        console.log('test results of text field add: ', ids)
        ids[0].should.be.an.integer()        
        });    
      });  
  });     
});

describe('Unit: CustomField.addNumberFieldInstance', function() {
  const newNumberField = {
      numberfield_id: 2,
      numberfieldvalue: 777,
      numberfielditem_id: 2
  }

  context('With valid field info', function() {
    // after(function() {
    //   return Item
    //   .getOneByName(newItem.itemname)
    //   .then(item => {
    //       Item.delete(item.id, owner_id)
    //   })
    //   .then(response => {
    //       return response
    //   })
    //   .catch(error => {
    //       return(error)
    //   })
    // })   
    it('should add a text item and receive an ID', function() {
      return CustomField
      .addNumberFieldInstance(newNumberField)
      .then(ids => {
        console.log('test results of number add: ', ids)
        ids[0].should.be.an.integer()        
        });    
      });  
  });     
});

describe('Unit: CustomField.addDateFieldInstance', function() {
  const newDateField = {
      datefield_id: 4,
      datefieldvalue: "2018-01-01",
      datefielditem_id: 2
  }

  context('With valid field info', function() {
    // after(function() {
    //   return Item
    //   .getOneByName(newItem.itemname)
    //   .then(item => {
    //       Item.delete(item.id, owner_id)
    //   })
    //   .then(response => {
    //       return response
    //   })
    //   .catch(error => {
    //       return(error)
    //   })
    // })   
    it('should add a text item and receive an ID', function() {
      return CustomField
      .addDateFieldInstance(newDateField)
      .then(ids => {
        console.log('test results of date field: ', ids)
        ids[0].should.be.an.integer()        
        });    
      });  
  });     
});