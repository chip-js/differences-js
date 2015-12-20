var expect = require('chai').expect;
var diff = require('../index');

global.log = function() {
  var args = [].slice.call(arguments);
  args.unshift('\033[36m***');
  args.push('\033[0m');
  console.log.apply(console, args);
}


describe('Differences.js', function() {

  describe('diff.values', function() {

    it('should return truthy when two values that are different', function() {
      expect(diff.values(1, 2)).to.be.ok;
    });

    it('should return false with two values that are the same', function() {
      expect(diff.values(2, 2)).to.equal(false);
    });

    it('should return false with two objects that look the same', function() {
      expect(diff.values({ foo: 'bar' }, { foo: 'bar' })).to.equal(false);
    });

    // TODO add more tests
  });

});
