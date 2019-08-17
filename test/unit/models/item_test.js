
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
        foundItem = items.find(element => {
          return element.id = 1;
        })          
        foundItem.itemname.should.equal(expectedResult);
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

describe('Unit: Item.getMultipleToUpdate', function() {
  context('With 2 valid ids and 1 id not allowed to edit', function() {
    const owner_id = 1;
    const item_ids =[1,2,3]
    const expectedResult = 2;
    it('should return 2 items', function() {
      return Item
      .getMultipleToUpdate(item_ids, owner_id)
      .then(items => {    
        items.length.should.equal(expectedResult);
        });    
      });  
    });
 

});

describe('Unit: Item.create', function() {
    const newItem = [{
        itemname: "She Hulk 127",
        itemdescription: "A She-hulk comic",
        itemtype_id: 1,
        price: 15.25,
        fields: JSON.stringify([   
          {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 'The Sensational She-Hulk'}, 
          {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 20}, 
          {id: 3, fieldname:'Volume', fielddatatype: 1, fieldorder: 2, value: 1}, 
          {id: 4, fieldname:'Cover Date', fielddatatype: 2, fieldorder: 3, value: '1983-03-31'} 
        ]),
        owner_id: 1
    }]
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
          item.ids[0].should.be.an.integer();          
          });    
        });  
    });     
});

describe('Unit: Item.update', function() {
  //This is just creating an item???
    const newItem = {
        itemname: "She Hulk 127",
        itemdescription: "A She-hulk comic",
        itemtype_id: 1,
        price: 15.25,
        fields: JSON.stringify([
          {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 'The Sensational She-Hulk'},
          {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 20},
          {id: 3, fieldname:'Volume', fielddatatype: 1, fieldorder: 2, value: 1},
          {id: 4, fieldname:'Cover Date', fielddatatype: 2, fieldorder: 3, value: '1983-03-31'}
        ]),
        owner_id: 1
    }
    const updateItem = {
        itemname: "NEW: She Hulk 127",
        itemdescription: "NEW: A She-hulk comic",
        price: 25.25,
        fields: [
          {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 'New: Sensational She-Hulk'},
          {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 22},
          {id: 3, fieldname:'Volume', fielddatatype: 1, fieldorder: 2, value: 1},
          {id: 4, fieldname:'Cover Date', fielddatatype: 2, fieldorder: 3, value: '1985-05-31'}
        ]
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
        .then(result => {
          result.ids[0].should.be.an.integer();          
          });    
        });  
    });     
});

describe('Unit: Item.validItem', function() {
  const itemtypeFields = [
    {
        id: 1,
        fieldname: "Title",
        fielddescription: "The title of the comic",
        fielditemtype_id: 1,
        fieldorder: 0,
        fielddatatype: 0,
        created_at: "2019-08-11T18:24:00.092Z",
        updated_at: "2019-08-11T18:24:00.094Z"
    },
    {
        id: 2,
        fieldname: "Issue",
        fielddescription: "Number of the comic",
        fielditemtype_id: 1,
        fieldorder: 1,
        fielddatatype: 1,
        created_at: "2019-08-11T18:24:00.092Z",
        updated_at: "2019-08-11T18:24:00.094Z"
    },
    {
        id: 3,
        fieldname: "Volume",
        fielddescription: "Number of the comic",
        fielditemtype_id: 1,
        fieldorder: 2,
        fielddatatype: 1,
        created_at: "2019-08-11T18:24:00.092Z",
        updated_at: "2019-08-11T18:24:00.094Z"
    },
    {
        id: 4,
        fieldname: "Cover Date",
        fielddescription: "Date put on the cover by the publisher for December 1990, use 12/1/1990",
        fielditemtype_id: 1,
        fieldorder: 3,
        fielddatatype: 2,
        created_at: "2019-08-11T18:24:00.092Z",
        updated_at: "2019-08-11T18:24:00.094Z"
    }
]
  const newItem = {
    itemname: "She Hulk 127",
    itemdescription: "A She-hulk comic",
    itemtype_id: 1,
    price: 15.25,
    fields: JSON.stringify([
      {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 'The Sensational She-Hulk'},
      {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 20},
      {id: 3, fieldname:'Volume', fielddatatype: 1, fieldorder: 2, value: 1},
      {id: 4, fieldname:'Cover Date', fielddatatype: 2, fieldorder: 3, value: '1989-03-31'}
    ]),
    owner_id: 1
  }

  let badName = Object.assign({}, newItem);
  badName.itemname = "";

  let badDescription = Object.assign({}, newItem);
  badDescription.itemdescription = "";

  let badPrice = Object.assign({}, newItem);
  badPrice.price = "Fred";

  let badTextField = Object.assign({}, newItem);
  badTextField.fields = JSON.stringify([
    {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 10},
    {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 20},
    {id: 3, fieldname:'Volume', fielddatatype: 1, fieldorder: 2, value: 1},
    {id: 4, fieldname:'Cover Date', fielddatatype: 2, fieldorder: 3, value: '1989-03-31'}
  ]);  
  
  let badNumberField = Object.assign({}, newItem);
  badNumberField.fields = JSON.stringify([
    {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 'The Sensational She-Hulk'},
    {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 20},
    {id: 3, fieldname:'Volume', fielddatatype: 1, fieldorder: 2, value: "Fred"},
    {id: 4, fieldname:'Cover Date', fielddatatype: 2, fieldorder: 3, value: '1989-03-31'}
  ]);  
  
  let badDateField = Object.assign({}, newItem);
  badDateField.fields = JSON.stringify([
    {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 'The Sensational She-Hulk'},
    {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 20},
    {id: 3, fieldname:'Volume', fielddatatype: 1, fieldorder: 2, value: 1},
    {id: 4, fieldname:'Cover Date', fielddatatype: 2, fieldorder: 3, value: 'Fred'}
  ]);  
  
  let badFielddatatype = Object.assign({}, newItem);
  badFielddatatype.fields = JSON.stringify([
    {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 'The Sensational She-Hulk'},
    {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 20},
    {id: 3, fieldname:'Volume', fielddatatype: 2, fieldorder: 2, value: 1},
    {id: 4, fieldname:'Cover Date', fielddatatype: 1, fieldorder: 3, value: '1989-03-31'}
  ]);



  context('With valid item info', function() {

    it('returns true for valid info', function() {
        Item.validItem([newItem], itemtypeFields).should.eql([ { item: 
            { itemname: 'She Hulk 127',
              itemdescription: 'A She-hulk comic',
              itemtype_id: 1,
              price: 15.25,
              fields: '[{"id":1,"fieldname":"Title","fielddatatype":0,"fieldorder":0,"value":"The Sensational She-Hulk"},{"id":2,"fieldname":"Issue","fielddatatype":1,"fieldorder":1,"value":20},{"id":3,"fieldname":"Volume","fielddatatype":1,"fieldorder":2,"value":1},{"id":4,"fieldname":"Cover Date","fielddatatype":2,"fieldorder":3,"value":"1989-03-31"}]',
              owner_id: 1 },
            valid: true,
            message: [ 'Item is valid' ] } ])  
    })     
  });    
   

  context('With invalid name', function() {

    it('returns error message for bad name', function() {
      return Item.validItem([badName], itemtypeFields).should.eql([ { item: 
        { itemname: '',
          itemdescription: 'A She-hulk comic',
          itemtype_id: 1,
          price: 15.25,
          fields: '[{"id":1,"fieldname":"Title","fielddatatype":0,"fieldorder":0,"value":"The Sensational She-Hulk"},{"id":2,"fieldname":"Issue","fielddatatype":1,"fieldorder":1,"value":20},{"id":3,"fieldname":"Volume","fielddatatype":1,"fieldorder":2,"value":1},{"id":4,"fieldname":"Cover Date","fielddatatype":2,"fieldorder":3,"value":"1989-03-31"}]',
          owner_id: 1 },
       valid: false,
       message: [ 'Enter a valid name.' ] } ])       
    });    
  }); 

  context('With invalid description', function() {

    it('returns returns error message for bad description', function() {
      return Item.validItem([badDescription], itemtypeFields).should.eql([ { item: 
        { itemname: 'She Hulk 127',
          itemdescription: '',
          itemtype_id: 1,
          price: 15.25,
          fields: '[{"id":1,"fieldname":"Title","fielddatatype":0,"fieldorder":0,"value":"The Sensational She-Hulk"},{"id":2,"fieldname":"Issue","fielddatatype":1,"fieldorder":1,"value":20},{"id":3,"fieldname":"Volume","fielddatatype":1,"fieldorder":2,"value":1},{"id":4,"fieldname":"Cover Date","fielddatatype":2,"fieldorder":3,"value":"1989-03-31"}]',
          owner_id: 1 },
       valid: false,
       message: [ 'Enter a valid description.' ] } ])       
    });    
  }); 

  context('With invalid price', function() {

    it('returns error message for bad price', function() {
      return Item.validItem([badPrice], itemtypeFields).should.eql([ { item: 
        { itemname: 'She Hulk 127',
          itemdescription: 'A She-hulk comic',
          itemtype_id: 1,
          price: 'Fred',
          fields: '[{"id":1,"fieldname":"Title","fielddatatype":0,"fieldorder":0,"value":"The Sensational She-Hulk"},{"id":2,"fieldname":"Issue","fielddatatype":1,"fieldorder":1,"value":20},{"id":3,"fieldname":"Volume","fielddatatype":1,"fieldorder":2,"value":1},{"id":4,"fieldname":"Cover Date","fielddatatype":2,"fieldorder":3,"value":"1989-03-31"}]',
          owner_id: 1 },
       valid: false,
       message: [ 'Enter a valid price.' ] } ])       
    });    
  }); 

  context('With invalid text field', function() {

    it('returns error message for bad text field', function() {
      return Item.validItem([badTextField], itemtypeFields).should.eql([ { item: 
        { itemname: 'She Hulk 127',
          itemdescription: 'A She-hulk comic',
          itemtype_id: 1,
          price: 15.25,
          fields: '[{"id":1,"fieldname":"Title","fielddatatype":0,"fieldorder":0,"value":10},{"id":2,"fieldname":"Issue","fielddatatype":1,"fieldorder":1,"value":20},{"id":3,"fieldname":"Volume","fielddatatype":1,"fieldorder":2,"value":1},{"id":4,"fieldname":"Cover Date","fielddatatype":2,"fieldorder":3,"value":"1989-03-31"}]',
          owner_id: 1 },
       valid: false,
       message: [ 'invalid fields: Title value is not a string' ] } ])       
    });    
  }); 

  context('With invalid number field', function() {

    it('returns error message for bad number field', function() {
      return Item.validItem([badNumberField], itemtypeFields).should.eql([ { item: 
        { itemname: 'She Hulk 127',
          itemdescription: 'A She-hulk comic',
          itemtype_id: 1,
          price: 15.25,
          fields: '[{"id":1,"fieldname":"Title","fielddatatype":0,"fieldorder":0,"value":"The Sensational She-Hulk"},{"id":2,"fieldname":"Issue","fielddatatype":1,"fieldorder":1,"value":20},{"id":3,"fieldname":"Volume","fielddatatype":1,"fieldorder":2,"value":"Fred"},{"id":4,"fieldname":"Cover Date","fielddatatype":2,"fieldorder":3,"value":"1989-03-31"}]',
          owner_id: 1 },
       valid: false,
       message: [ 'invalid fields: Volume value is not a number' ] } ])       
    });    
  });  

  context('With invalid date field', function() {

    it('returns error message for bad number field', function() {
      return Item.validItem([badDateField], itemtypeFields).should.eql([ { item: 
        { itemname: 'She Hulk 127',
          itemdescription: 'A She-hulk comic',
          itemtype_id: 1,
          price: 15.25,
          fields: '[{"id":1,"fieldname":"Title","fielddatatype":0,"fieldorder":0,"value":"The Sensational She-Hulk"},{"id":2,"fieldname":"Issue","fielddatatype":1,"fieldorder":1,"value":20},{"id":3,"fieldname":"Volume","fielddatatype":1,"fieldorder":2,"value":1},{"id":4,"fieldname":"Cover Date","fielddatatype":2,"fieldorder":3,"value":"Fred"}]',
          owner_id: 1 },
       valid: false,
       message: [ 'invalid fields: Cover Date value is not a date (format \'YYYY-MM-DD\')' ] } ])       
    });    
  });  

  context('With invalid Fielddatatype', function() {

    it('returns error message for bad fielddatatype', function() {
      return Item.validItem([badFielddatatype], itemtypeFields).should.eql([ { item: 
        { itemname: 'She Hulk 127',
          itemdescription: 'A She-hulk comic',
          itemtype_id: 1,
          price: 15.25,
          fields: '[{"id":1,"fieldname":"Title","fielddatatype":0,"fieldorder":0,"value":"The Sensational She-Hulk"},{"id":2,"fieldname":"Issue","fielddatatype":1,"fieldorder":1,"value":20},{"id":3,"fieldname":"Volume","fielddatatype":2,"fieldorder":2,"value":1},{"id":4,"fieldname":"Cover Date","fielddatatype":1,"fieldorder":3,"value":"1989-03-31"}]',
          owner_id: 1 },
       valid: false,
       message: [ 'invalid fields: Volume datatype does not match the datatype 1: Cover Date datatype does not match the datatype 2' ] } ])       
    });    
  }); 

     
});

describe('Unit: CustomField.deleteFieldInstances', function() {
  const newItem = [{
      itemname: "Ghost Rider 44",
      itemdescription: "A Ghost Rider comic",
      itemtype_id: 1,
      price: 15.22,
      owner_id: 1 
  }];
  const newTextField = {
    textfield_id: 1,
    textfieldvalue: "My test2"
  };
  const newNumberField = {
    numberfield_id: 2,
    numberfieldvalue: 778
  };
  const newDateField = {
    datefield_id: 4,
    datefieldvalue: "2018-02-01"
  };
  newItemID = 0;
  newItemIDs = []
  context('Where fields exist', function() {
    
    before(function() {
      return Item
      .create(newItem, 1)
      .then(result => {
        newItemIDs = result.ids
        newItemID = newItemIDs[0];
        console.log('newItemIDs: ', newItemIDs)
        newTextField.textfielditem_id = newItemID;
        newNumberField.numberfielditem_id = newItemID;
        newDateField.datefielditem_id = newItemID;
        return CustomField.addTextFieldInstance(newTextField)      
      })
      .then(result => {
        console.log('The result of the first textfield', result)
        return CustomField.addNumberFieldInstance(newNumberField)
      })
      .then(result => {CustomField.addDateFieldInstance})
      .then(response => {
        console.log('response for the creation of fields: ', response)
          return response
      })
      .catch(error => {
          return(error)
      })
    })   
    it('should delete the fields for the specified item', function() {
      return CustomField
      .deleteFieldInstances(newItemIDs)
      .then(results => {
        console.log('test results of delete: ', results)
        results.should.eql([1, 1, 0]);          
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