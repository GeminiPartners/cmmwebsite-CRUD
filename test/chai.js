var should = require('chai').should() //actually call the function
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

  Community = require('../routes/community')

const chai = require('chai');

const chaiAsPromised = require('chai-as-promised');

// set up the middleware
chai.use(chaiAsPromised);


foo.should.be.a('string');
foo.should.equal('bar');
foo.should.have.lengthOf(3);
beverages.should.have.property('tea').with.lengthOf(3);
