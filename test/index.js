
const Item = require('../db/item');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// set up the middleware
chai.use(chaiAsPromised);
var should = require('chai').should() 



describe('Item.getByUser', function() {
  context('With valid id', function() {
    const item_id = 1;
    const expectedResult = "Canoe";
    it('should return items', function() {
      return Item
      .getByUser(item_id)
      .then(items => {
        items[0].name.should.equal(expectedResult);
        });    
      });  
    });
 
  context('With invalid id', function() {
    const item_id = 2000;
    const expectedResult = [];
    it('should be null results', function() {
      return Item.getByUser(item_id).should.eventually.eql(expectedResult)
    });
  });
});
