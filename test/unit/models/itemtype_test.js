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
        console.log('item types: ',itemtypes)
        itemtypes.itemtypename.should.equal(expectedResult);
        });    
      });  
    });
 
  // context('With invalid id', function() {
  //   const itemtype_id = 2000;
  //   const expectedResult = [];
  //   it('should be null results', function() {
  //     return Itemtype.
  //     getOne(itemtype_id)
  //     .then(result => {
  //         console.log('get itemtype null: ', result)
  //         result.should.eventually.equal(expectedResult)
  //     })      
  //   });
  // });
});
