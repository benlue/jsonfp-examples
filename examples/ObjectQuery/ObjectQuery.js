var  jsonfp = require('jsonfp');

var  samples = [
	{name: 'Mike', dob: '1978-02-12', gender: 1, salary: 110000},
	{name: 'Stacy', dob: '1965-12-30', gender: 0, "hobby": "reading", "weight": 220},
	{name: 'Mark', dob: '1982-10-05', gender: 1, "salary": 250000, "weight": 160},
	{name: 'Johnson', dob: '1962-08-10', gender: 1, "salary": 120000, "hobby": "hiking"},
	{name: 'Eugene', dob: '1988-05-20', gender: 1},
	{name: 'Kate', dob: '1982-11-25', gender: 0, "salary": 150000, "hobby": "hiking"},
	{name: 'Chris', dob: '1992-04-21', gender: 1, "weight": 180},
	{name: 'Donald', dob: '1990-01-31', gender: 1, "salary": 80000},
	{name: 'Michelle', dob: '1983-03-11', gender: 0, "hobby": "music", "weight": 130},
	{name: 'Rebecca', dob: '1972-06-25', gender: 0, "salary": 180000, "weight": 140}
];

// Example #1: look for person whose birthday is later than 1980-01-01
var  expr = {
    filter: {
        chain: [
            {getter: 'dob'},
            {'>': '1980-01-01'}
        ]
    }
};

// The result should have 6 people.
var  result = jsonfp.apply(samples, expr);
console.log( 'Result #1:\n%s', JSON.stringify(result, null, 4) );

// Example #2: anyone who earns more than $100000 and weights less than 150 pounds
expr = {
    filter: {
        chain: [
            {
                salary:
                    {chain: [
                        {getter: 'salary'},
                        {'>': 100000}
                    ]},
                weight:
                    {chain: [
                        {getter: 'weight'},
                        {'<': 150}
                    ]}
            },
            {and: ['salary', 'weight']}
        ]
    }
};

// Rebecca is the only person who earned more than $100000 and weighted less than 150 pounds
var  result = jsonfp.apply(samples, expr);
console.log( 'Result #2:\n%s', JSON.stringify(result, null, 4) );

// Or do it the other way
expr = {
    filter: {
        chain: [
            [
                {chain: [
                    {getter: 'salary'},
                    {'>': 100000}
                ]},
                {chain: [
                    {getter: 'weight'},
                    {'<': 150}
                ]}
            ],
            {reduce: 'and'}
        ]
    }
};

var  result = jsonfp.apply(samples, expr);
console.log( 'Result #2 by another formula:\n%s', JSON.stringify(result, null, 4) );
