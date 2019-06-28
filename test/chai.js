var should = require('chai').should() //actually call the function
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

  Community = require('../routes/community')

  describe('validCommunity(community)', function() {
    context('With valid strings in Name and Description', function() {
        community = {
            name: "Foo",
            description: "Bar"
        }
      it('should return true', function() {
        Community.validCommunity(community).should.be.true;
      });
    });
  });

foo.should.be.a('string');
foo.should.equal('bar');
foo.should.have.lengthOf(3);
beverages.should.have.property('tea').with.lengthOf(3);
