Baseball Pitchers
=================

This example shows how to calculate the average era and salary of MLB baseball pitchers and find out who have both era and salary lower than the average.

First of all, the data samples:

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
    
### Calculating the average ERA
The average ERA can be calculated by summing up every pitcher's ERA and dividing it with the total count of pitchers. Below is how to do it with JSON-FP:

    var  eraExpr =
        {
            '->': [
                [
                    {'->': [
                        {map: {getter: 'era'}},
                        {reduce: 'add'}
                    ]},
                    {size: null}
                ],
                {reduce: 'divide'}
            ]
        };
		
'->' is a chaining operator. The first chaining operator will find out the sum total of every pitcher's ERA and total number of pitchers, and then feed those two numbers (which are enclosed in an array) to the reduce operator _{reduce: 'divide'}_ to get the average ERA.

If we look deeper into the expression, we'll find out the sum total of ERA is obtained with the following expression:

    {'->': [
	    {map: {getter: 'era'}},
	    {reduce: 'add'}
	]}
	
It uses the 'getter' operator to get the ERA of each pitcher and the resulting array is fed to the _{reduce: 'add'}_ expression to be summed up.

The average salary can be found in a similar way as shown below:

    var  salaryExpr =
        {
            '->': [
                [
                    {'->': [
                        {map: {getter: 'salary'}},
                        {reduce: 'add'}
                    ]},
                    {size: null}
                ],
                {reduce: 'divide'}
            ]
        };
		
### The pitcher who is good and whose salary is below average
To find out pitchers whose ERA and salary are below average, we can apply the same pattern as we've developed in the [Object Query](https://github.com/benlue/jsonfp-examples/blob/master/examples/ObjectQuery/ObjectQuery.js) example. The idea is to collect the result of every query condition into an array, and use the _{reduce: 'and'}_ expression to get the logical 'AND' of all query conditions. The following code shows just that:

    {
        '->': [
            [
                {'->': [
                    {getter: 'era'},
                    {'<': 3.0}
                ]},
                {'->': [
                    {getter: 'salary'},
                    {'<': 5000000}
                ]}
            ],
            {reduce: 'and'}
        ]
    }
	
The expression will tell us if any pitcher whose ERA is below 3.0 and salary is lower than $5,000,000. 

We can further tweak the above expression so the ERA and salary criteria are taken from input instead of hard-coded numbers. That can be done by referring to the input variable as shown below:

    var  expr = {
            '->': [
                [
                    {'->': [
                        {getter: 'era'},
                        {'<': '$in.era'}
                    ]},
                    {'->': [
                        {getter: 'salary'},
                        {'<': '$in.salary'}
                    ]}
                ],
                {reduce: 'and'}
            ]
        };
	
and the same result (era < 3.0 AND salary < 5000000) can be obtained by:

    var  input = {
    	era: 3.0,
    	salary: 5000000
    };
    
    jsonfp.apply(input, expr);
    
Now we can put things together and below is the complete program to find out the pitchers we want:

    var  jsonfp = require('jsonfp');
    
    // first, defines the expression to calculate the average ERA and salary
    var  eraExpr =
        {
            '->': [
                [
                    {'->': [
                        {map: {getter: 'era'}},
                        {reduce: 'add'}
                    ]},
                    {size: null}
                ],
                {reduce: 'divide'}
            ]
        };
		
	var  salaryExpr =
        {
            '->': [
                [
                    {'->': [
                        {map: {getter: 'salary'}},
                        {reduce: 'add'}
                    ]},
                    {size: null}
                ],
                {reduce: 'divide'}
            ]
        };
		
		
	// the second step is to apply the expression to get the number.
	var  avgERA = jsonfp.apply(pitchers, eraExpr),
             avgSalary = jsonfp.apply(pitchers, salaryExpr);
		 
		 
	// we'll define the the third expresssion to get the final result:
	var  expr = {
                filter: {
                    '->': [
                        [
                            {'->': [
                                {getter: 'era'},
                                {'<': '$in.era'}
                            ]},
                            {'->': [
                                {getter: 'salary'},
                                {'<': '$in.salary'}
                            ]}
                        ],
                        {reduce: 'and'}
                    ]
		}
            };
	
	
	// finally, feed the numbers and get the result
	jsonfp.apply({era: avgERA, salary: avgSalary}, expr);
	
### All in one expression
The above program can help us understand what are the necessary steps to achieve the result we want. However, the whole program introduced quite a few variables and that would increase the possibility of errors. We might want to accomplish them all in one JSON-FP expression. Below we'll show how that can be done.

First of all, instead of taking the average ERA and salary from input, we want to calculate those numbers within the expression and refer to them when necessary. This can be done by saving the calculation results to the context variable as shown below:

    {
        $stat: {
            era: 3.0,
            salary: 8000000
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
    }
	
The '$stat' property name starts with a '$' sign to indicate it will become part of a context variable instead of part of the return value. As a result, we can later refer to its property values as '$stat.era' and '$stat.salary'. Also the return value will be:

	{
	    "pitchers": [
	        {
	            "name": "Bumgarner",
	            "era": 2.98,
	            "salary": 6950000
	        }
	    ]
	}
	
As explained, '$stat' does not show up as part of the return object.

At this point, we've almost enclosed every required task in a single JSON-FP expression except that the compared numbers of ERA and salary are hard coded. We can simply replace those numbers with calculated results and every thing is done. Below is the complete expression:

    {
	$stat: {
            era: {
                '->': [
                    [
                        {'->': [
                            {map: {getter: 'era'}},
                            {reduce: 'add'}
                        ]},
                        {size: null}
                    ],
                    {reduce: 'divide'}
                ]
            },
            salary: {
                '->': [
                    [
                        {'->': [
                            {map: {getter: 'salary'}},
                            {reduce: 'add'}
                        ]},
                        {size: null}
                    ],
                    {reduce: 'divide'}
                ]
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

## Source code
The complete source code can be found [here](https://github.com/benlue/jsonfp-examples/blob/master/examples/bbPitcher/BaseballPitchers.js).