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


    it('should return no change for two NaN values', function() {
      var changed = diff.values(NaN, NaN);
      expect(changed).to.be.false;
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

  });


  describe('diff.objects', function() {

    it('should return no change records for identical objects', function() {
      var changes = diff.objects({ name: 'test', age: 100 }, { name: 'test', age: 100 });
      expect(changes).to.be.empty;
    });


    it('should return change records for additions', function() {
      var changes = diff.objects({ name: 'test', age: 100, height: 6 }, { name: 'test', age: 100 });
      expect(changes.length).to.equal(1);

      var change = changes.pop();
      expect(change.type).to.equal('add');
      expect(change.name).to.equal('height');
      expect(change.oldValue).to.not.exist;
    });


    it('should return change records for deletions', function() {
      var changes = diff.objects({ name: 'test', age: 100 }, { name: 'test', age: 100, height: 6 });
      expect(changes.length).to.equal(1);

      var change = changes.pop();
      expect(change.type).to.equal('delete');
      expect(change.name).to.equal('height');
      expect(change.oldValue).to.equal(6);
    });


    it('should return change records for updates', function() {
      var changes = diff.objects({ name: 'test', age: 100 }, { name: 'test', age: 102 });
      expect(changes.length).to.equal(1);

      var change = changes.pop();
      expect(change.type).to.equal('update');
      expect(change.name).to.equal('age');
      expect(change.oldValue).to.equal(102);
    });


    it('should return multiple change records for multiple changes', function() {
      var changes = diff.objects({ name: 'testing', age: 100, height: 6 }, { name: 'test', age: 102, color: 'green' });
      expect(changes.length).to.equal(4);
    });

  });

  describe('diff.arrays', function() {

    it('should return no splices for identical arrays', function() {
      var splices = diff.arrays([1, 2, 3], [1, 2, 3]);
      expect(splices).to.be.empty;
    });


    it('should return a splice for a pop', function() {
      var arr = [1, 2, 3];
      var newArr = arr.slice();
      newArr.pop();
      var splices = diff.arrays(newArr, arr);
      expect(splices.length).to.equal(1);

      var splice = splices.pop();
      expect(splice.index).to.equal(2);
      expect(splice.addedCount).to.equal(0);
      expect(splice.removed.length).to.equal(1);
      expect(splice.removed[0]).to.equal(3);
    });


    it('should return a splice for a shift', function() {
      var arr = [1, 2, 3];
      var newArr = arr.slice();
      newArr.shift();
      var splices = diff.arrays(newArr, arr);
      expect(splices.length).to.equal(1);

      var splice = splices.pop();
      expect(splice.index).to.equal(0);
      expect(splice.addedCount).to.equal(0);
      expect(splice.removed.length).to.equal(1);
      expect(splice.removed[0]).to.equal(1);
    });


    it('should return a splice for a splice', function() {
      var arr = [1, 2, 3];
      var newArr = arr.slice();
      newArr.splice(1, 1, 'test');
      var splices = diff.arrays(newArr, arr);
      expect(splices.length).to.equal(1);

      var splice = splices.pop();
      expect(splice.index).to.equal(1);
      expect(splice.addedCount).to.equal(1);
      expect(splice.removed.length).to.equal(1);
      expect(splice.removed[0]).to.equal(2);
    });


    it('should return a splice for a completely new array', function() {;
      var arr = [1, 2, 3];
      var newArr = [4, 5, 6, 7, 8];
      var splices = diff.arrays(newArr, arr);
      expect(splices.length).to.equal(1);

      var splice = splices.pop();
      expect(splice.index).to.equal(0);
      expect(splice.addedCount).to.equal(5);
      expect(splice.removed.length).to.equal(3);
    });


    it('should return at least one splice for a sorted array of random numbers', function() {
      var arr = [
        Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
        Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
        Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()
      ];
      var newArr = arr.slice();
      newArr.sort();
      var splices = diff.arrays(newArr, arr);
      expect(splices).to.not.be.empty;
    });
  });


});
