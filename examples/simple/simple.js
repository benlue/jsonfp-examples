var  jsonfp = require('jsonfp');

//////// example 1
// evaluate an array
var  expr = [1, 2, 3],
     result = jsonfp.apply({}, expr);

console.log('If we evaluate an array of numbers such as %s,', JSON.stringify(expr) );
console.log('the result is the same array: %s', JSON.stringify(result));


//////// example 2
// evaluate an array which contains a JSON-FP expression
expr = [1, {add: 2}, 3];
result = jsonfp.apply(1, expr);

// the result is [1, 3, 3]
console.log('\n\nHowever, if any element of the array is a JSON-FP expression like this one: %s', JSON.stringify(expr));
console.log('the JSON-FP runtime will have something to work on and the result becomes %s.', JSON.stringify(result));


//////// example 3
// string concatenation
expr = {add: 'interesting'};
result = jsonfp.apply('very ', expr);

// the result is 'very interesting'
console.log('\n\nJSON-FP expression is %s.', result);


//////// example 4
// let's do some chaining
data = [1, 2, 3];
expr = {
    chain: [
        {union: [3, 4, 5]},
        {reduce: 
            {add: '$reduceValue'}
        }
    ]
};
result = jsonfp.apply({}, data, expr);

// the result of union is [1, 2, 3, 4, 5] and that is chained to reduce/add.
// the result of reduce/add is 1+2+3+4+5 = 15
console.log('\n\nSum of elements out of the union of [1,2,3] and [3,4,5] is %d', result);

// a shorter form of the above example is:
expr = {
    '->': [
    	{union: [3, 4, 5]},
    	{reduce: 'add'}
    ]
};
