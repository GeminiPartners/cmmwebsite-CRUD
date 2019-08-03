// load environment variables first
require('dotenv-safe').config();
const environment = process.env.NODE_ENV || 'development';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiInteger = require('chai-integer');

// set up the assertion library
chai.use(chaiAsPromised);
chai.use(chaiInteger)
const should = require('chai').should() 

//require modules to be tested
const User = require('../../../models/userModel');



const config = require('../../../knexfile')[environment];
module.exports = require('knex')(config);



describe('Unit : Models.userModel.create', function() {
    const newUser = {
        email: "newTest41@newTest.com",
        username: "my new test41",
        password: "123456"
    };
    after(function() {
        return User
        .deleteByEmail(newUser.email)
        .then(response => {
            return response
        })
        .catch(error => {
            return(error)
        })
    });        
    context('Create new valid user', function() {
        it('should return a success message', function() {
            return User.create(newUser).should.eventually.be.a('number')
        });  
    });   
});

describe('Unit : Models.userModel.getOne', function() {
      
    context('Retrieve existing user', function() {
        it('should return user', function() {
            return User.getOne(1).should.eventually.have.deep.property('email','hello@hello.com')
        });  
    });   
    context('Retrieve nonexisting user', function() {
        it('should not return an item', function() {
            return User.getOne(100).should.eventually.not.exist
        });
    });   
});

describe('Unit : Models.userModel.getOneByEmail', function() {
      
    context('Retrieve existing user', function() {
        it('should return user', function() {
            return User.getOneByEmail('hello@hello.com').should.eventually.have.deep.property('email','hello@hello.com')
        });  
    });   
    context('Retrieve nonexisting user', function() {
        it('should not return an item', function() {
            return User.getOneByEmail('billgates@microsoft.com').should.eventually.not.exist
        });
    });   
});



