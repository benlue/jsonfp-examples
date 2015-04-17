var  jsonfp = require('jsonfp');

jsonfp.init();

// Example 1: sum up 1 to 100
var  expr = {
		'->': [
	    	{'stream/iterator': {start: 1, end: 100}},
	    	{reduce: 'add'}
	    ]
	 };

console.log('1 adds to 100 is ' + jsonfp.apply(null, expr));


// Example 2: Monte Carlo PI
var  squareExpr = {
		'->': [
			{random: null},
			{multiply:
				{clone: null}
			}
		]
	 };

var  jexpr = {
		'->': [
			[
				{'->': [
			       	{'stream/iterator': {start: 1, end: '$in'}},
					{'->': [
					    {map:
					    	{'->': [
								[squareExpr, squareExpr],
								{reduce: 'add'},
								{'<=': 1}
							]}
					    },
					    {reduce: 'add'}
					]}
				]},
				'$in'
			],
			{reduce: 'divide'}
		]
	 };

// iterate 1000 times
var  pi = jsonfp.apply(1000, jexpr);
console.log('PI estimate: %d', pi * 4  );