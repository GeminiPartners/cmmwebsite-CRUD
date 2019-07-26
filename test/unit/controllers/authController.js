// load environment variables first
require('dotenv-safe').config();
const environment = process.env.NODE_ENV || 'development';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// set up the assertion library
chai.use(chaiAsPromised);
var should = require('chai').should() 

//require modules to be tested
const User = require('../../../models/userModel');
const Auth = require('../../../controllers/authController')



const config = require('../../../knexfile')[environment];




// describe('Unit : Controllers.authController.signup', function() {
//     const newUser = {
//         email: "newTest41@newTest.com",
//         username: "my new test41",
//         password: "123456",
//         location: "here"
//     };
//     var req = {}
//     req.body = newUser;
//     req.headers={}
//     req.headers.req_type = "gmAPI"
//     req.header = function(h){return "abc"}
//     after(function() {
//         return User
//         .deleteByEmail(newUser.email)
//         .then(response => {
//             return response
//         })
//         .catch(error => {
//             return(error)
//         })
//     })        
//     context('Sign up new valid user', function() {
//         it('should return a success message', function() {
//             return Auth.postSignup(req).should.eventually.have.deep.property('message', 'post')
//         });  
//     });   
// });
