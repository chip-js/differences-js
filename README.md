# Differences.js

Differences.js takes two values of any kind and returns true or false if they are different. It also returns the
differences if both values are objects or both values are arrays. Differences.js is used to test if inmutable values
change over time. It assumes the first value is the current value and the second one is the old value when calculating
differences.

## Usage

### Basic

To install Differences.js you can use npm.

```
npm install differences-js
```

To use Differences.js require it in your project.

```
var diff = require('differences-js');
var value1 = 'foo';
var value2 = 'bar';


if (diff.values(value1, value2)) {
  // the values are different
} else {
  // the values are the same
}
```

The API only needs one method. `diff.values(currentValue, oldValue)`

You can find the changes between two objects.

```
var changes = diff.values(obj1, obj2);

if (changes) {
  changes.forEach(function(change) {
    var currentValue = obj1[change.name];
    console.log(change.type, change.name, currentValue, change.oldValue);
  });
}
```

Each change in a list of object changes will have a `type` of `"new"`, `"updated"`, or `"deleted"`.

You can find the changes between two arrays.

```
var splices = diff.values(array1, array2);

if (splices) {
  splices.forEach(function(splice) {
    console.log(splice.index, splice.removed, splice.addedCount);
  });
}
```

### Other Methods

`diff.values` should be enough for most situations. It will even tell if you if two dates are the same date or not. But
other methods may be useful. All of these methods are used by `diff.arrays` after determining the type of the two
values.

`diff.basic` diffs two basic values. If you pass in two arrays or objects it will return true if they are different
instances rather than inspecting them to see if they are the same.

`diff.objects` will return the differences between two objects and may be useful to run on an array if there may have
been changes to its properties, since `diff.values` will default to using `diff.arrays` under the hood and won't check
for property changes. This will throw an error if either value is not an object/array. Will return an empty array if the
objects are equal.

`diff.arrays` checks the difference between two arrays, returning an array of splice objects or false if they are the
same. This will throw an error of eitehr value is not an array. Using `diff.values` should be sufficent for most use
cases. Will return an empty array if the arrays are equal.

## Contributions and Issues

Please open a ticket for any bugs or feature requests.

Contributions are welcome. Please fork and send a pull-request.
