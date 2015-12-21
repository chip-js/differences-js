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

    it('should return change records when two objects are different', function() {
      var current = { foo: 'bar', test2: 'a value' };
      var old = { foo: 'bam', test1: true };
      var changes = [
        { object: current, type: 'update', 'name': 'foo', oldValue: 'bam' },
        { object: current, type: 'delete', 'name': 'test1', oldValue: true },
        { object: current, type: 'add', 'name': 'test2', oldValue: undefined }
      ];
      expect(diff.values(current, old)).to.deep.equal(changes);
    });

    it('should return splice records when two arrays are different', function() {
      var current = [1, 2, 4, 5, 6, 3];
      var old = [1, 2, 3, 4, 5, 6];
      var splices = [
        { object: current, type: 'splice', 'name': '2', oldValue: undefined, index: 2, removed: [3], addedCount: 0 },
        { object: current, type: 'splice', 'name': '5', oldValue: undefined, index: 5, removed: [], addedCount: 1}
      ];
      expect(diff.values(current, old)).to.deep.equal(splices);
    });

    // TODO add more tests
  });

});
