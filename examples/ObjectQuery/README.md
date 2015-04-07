How To Do Object Query
======================

Assuming you have a list of objects, what would you do if you need to find out objects which meet some criteria? Consider the following sample data:

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

If we want to find out who has earned more than $100000 per year, we may:

    var  result = [];

    for (var i in samples)  {
        ver  person = samples[i];
        if (person.salary > 100000)
            result.push( person );
    }

The above code works quite nicely. What if we ask a bit more complicated question like finding out persons whose hobby is reading and who earned more than $100000 per year? We can still solve the problem by changing the 'if' statement above to reflect the new query conditions. However, what if we do not know the query conditions beforehand but need to construct a program to answer object queries regardless what query conditions are thrown at us? This would be a tedious problem to solve using imperative programming languages, but is just a piece of cake for JSON-FP. To back up the claim, let's show how it can be done in JSON-FP.

## The Object Query Boilerplate

First of all, let's build a boilerplate for object query:

    1  var  expr = {
    2      filter: {
    3          "->": [
    4              [
    5                  {"->": [
    6                      {getter: 'property_to_be_exampled'},
    7                      {_put_your_query_condition_here}    // e.g. {'>': 1000}
    8                  ]}
    9              ],
    10             {reduce: "and"}
    11         ]
    12     }
    13 };

Line 4 ~ 9 is an array containing the required query conditions. In the above sample code, only one query condition is demonstrated. In reality, you can put as many query conditions as you need into the array. When the above JSON-FP expression is evaluated, the array of query expressions will become an array of true or false. As a result, line 10 can be used to sum up the result to see if an object meets the required conditions.

Sine line 4 ~ 9 specify an array of query conditions, we can perform some code abstraction by moving that array specification out of the boilerplate:

    1  var  queries = [
    2           {"->": [
    3               {getter: "salary"},
    4               {">": 100000}
    5           ]},
    6           {"->": [
    7               {getter: "hobby"},
    8               {"=": "reading"}
    9           ]}
    10      ];

So the boilerplate will be simplified to:

    1  var  expr = {
    2      filter: {
    3          "->": [
    4              queries,
    5              {reduce: "and"}
    6          ]
    7      }
    8  };

Now the boilerplate looks quite simple and easy for our eyes. You can further extend the boilerplate to support compounded query conditions (AND/OR). The key point is that every query condition is nothing more than a JSON object, so you can stack up or build your customized query conditions quite easily. This feature is referred to as "homoiconic".

## The Complete Source
You can find here a working [source code for object query](https://github.com/benlue/jsonfp-examples/blob/master/examples/ObjectQuery/ObjectQuery.js).

## How To Run The Example
Retrieve the source code as ObjectQuery.js and type the following in your command line:

    node ObjectQuery
