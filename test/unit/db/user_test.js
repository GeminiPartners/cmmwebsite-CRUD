// load environment variables first
require('dotenv-safe').config();
const environment = process.env.NODE_ENV || 'development';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// set up the assertion library
chai.use(chaiAsPromised);
var should = require('chai').should() 

//require modules to be tested
const User = require('../../../db/user');



const config = require('../../../knexfile')[environment];
module.exports = require('knex')(config);



describe('Unit : db.user.create', function() {
    const newUser = {
        email: "newTest4@newTest.com",
        username: "my new test4",
        password: "123456",
        location: "here"
    };
    after(function() {
        return User
        .deleteByEmail(newUser.email)
        .then(response => {
            console.log('deleted it ', response)
            return response
        })
        .catch(error => {
            return(error)
        })
    })        
    context('Create new user', function() {
        it('should return a success message', function() {
            return User.create(newUser).should.eventually.be.a('number')
        });  
    });   
});
