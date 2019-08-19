const Auth = require('../../../models/authModel');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiInteger = require('chai-integer');

// set up the middleware
chai.use(chaiAsPromised);
chai.use(chaiInteger);
const should = require('chai').should() 



describe('Unit: auth.MarketItemTypeAuth', function() {
  context('With valid id', function() {
    const expectedResult = "Eyepieces";
    const user_id = 2
    it('should return an itemtype', function() {
      return Auth
        .marketItemtypeAuth(user_id)
        .then(results => {
          console.log('market auth results: ', results)
          results[0].itemtypename.should.equal(expectedResult);
        });    
    });  
  });
});