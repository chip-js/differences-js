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

## Contributions and Issues

Please open a ticket for any bugs or feature requests.

Contributions are welcome. Please fork and send a pull-request.
