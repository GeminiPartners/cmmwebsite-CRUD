const Shared = require('../../shared');


const chai = require('chai');

const chaiAsPromised = require('chai-as-promised');

// set up the middleware
chai.use(chaiAsPromised);

var should = require('chai').should() 



describe('Shared.whitelistCheck', function() {
    context('With whitelisted origin', function() {
        const hostName="http://localhost:8080";
        const expectedResult = hostName;
        it('should return the host that was input', function() {
            Shared.whitelistCheck(hostName).should.equal(expectedResult)
        });  
    });  
    context('With unknown origin', function() {
        const hostName="http://localhost:8081";
        const expectedResult = hostName;
        it('should return empty string', function() {
            Shared.whitelistCheck(hostName).should.equal("")
        });  
    });  
});


