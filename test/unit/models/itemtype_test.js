const Itemtype = require('../../../models/itemtypeModel');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiInteger = require('chai-integer');

// set up the middleware
chai.use(chaiAsPromised);
chai.use(chaiInteger);
const should = require('chai').should() 



describe('Unit: Itemtype.getOne', function() {
  context('With valid id', function() {
    const expectedResult = "Comics";
    const itemtype_id = 1
    it('should return an itemtype', function() {
      return Itemtype
        .getOne(itemtype_id)
        .then(itemtypes => {
          itemtypes.itemtypename.should.equal(expectedResult);
        });    
    });  
  });
});

describe('Unit: Itemtype.create', function() {
  const itemtype = {
    itemtypename: "New Type",
    itemtypedescription: "A new item type",
    itemtypeorder: 5,
    itemtypemarket: 1
  }
  after(function() {
    return Itemtype
      .getOneByName(itemtype.itemtypename)
      .then(result => {
        console.log('result of getonebyname: ', result)
        return Itemtype.delete([result.id], 1)
      })
      .then(result => {
        console.log('result of delete: ', result)
      })
  });
  context('With valid info', function() {
    const expectedResult = "Comics";

    it('should return an integer', function() {
      return Itemtype
        .create(itemtype)
        .then(result => {
          console.log(result)
          result.should.be.an.integer;
          ItemtypeCreateID = result
        });    
    });  
  });
});
