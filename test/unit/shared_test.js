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

describe('Shared.EncodeUUID', function() {
    context('Valid UID', function() {
        const myUUID = '1048370e-d128-44e4-811e-384c7c461914';
        const expectedResult = 'GI3SEqIX4v84UE4nyHXaK';
        console.log('myUUID', myUUID)
        console.log('base64: ', Shared.encodeID(myUUID))
        it('should return the UUID encoded as base64', function() {
            Shared.encodeID(myUUID).should.equal(expectedResult)
        });  
    });  

});

describe('Shared.DecodeUUID', function() {
    context('Valid UID', function() {
        const myHash = 'GI3SEqIX4v84UE4nyHXaK';
        const expectedResult = '1048370e-d128-44e4-811e-384c7c461914';
        it('should return the decoded UUID', function() {
            Shared.decodeID(myHash).should.equal(expectedResult)
        });  
    });  

});



