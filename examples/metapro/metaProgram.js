var  jsonfp = require('jsonfp');

/* This example is doing the same thing as bbPitcher/BasePitchers.js
 * except that we'll be using formula to reuse part of the program.
 */
var  pitchers = [
	{name: 'Ventura', era: 3.2, salary: 500500},
	{name: 'Price', era: 3.26, salary: 19750000},
	{name: 'Kershaw', era: 1.77, salary: 32517428},
	{name: 'Gray', era: 3.08, salary: 505000},
	{name: 'Liriano', era: 3.38, salary: 11666666},
	{name: 'Hammel', era: 3.47, salary: 23500000},
	{name: 'Lester', era: 2.46, salary: 20000000},
	{name: 'Bumgarner', era: 2.98, salary: 6950000},
	{name: 'Chen', era: 3.54, salary: 4750000},
	{name: 'Norris', era: 3.65, salary: 8800000}
];


// avgFormula is a JSON-FP formula to calcualte the average of a pitcher property
// where '@prop' can be 'era' or 'salary'.
var  avgFormula = {
	formula: {
		var: '@prop',
		expr: {
			'->': [
				[
					{'->': [
						{map: {getter: '@prop'}},
						{reduce: 'add'}
					]},
					{size: null}
				],
				{reduce: 'divide'}
			]
		}
	}
};


// Instead of using expressons to calculate the average era or salary, we'll use
// the 'avgFormula' to do so.
var  expr = {
	$stat: {
		era: {
			convert: {
				var: {'@prop': 'era'},
				formula: avgFormula
			}
		},
		salary: {
			convert: {
				var: {'@prop': 'salary'},
				formula: avgFormula
			}
		}
	},
	pitchers: {
		filter: {
			'->': [
				[
					{'->': [
						{getter: 'era'},
						{'<': '$stat.era'}
					]},
					{'->': [
						{getter: 'salary'},
						{'<': '$stat.salary'}
					]}
				],
				{reduce: 'and'}
			]
		}
	}
};


var  ctx = {},
	 result = jsonfp.apply(ctx, pitchers, expr);
console.log('The pitchers whose era and salary are both below average are:\n%s', JSON.stringify(result, null, 2) );
console.log('...and the context becomes:\n%s', JSON.stringify(ctx, null, 2));