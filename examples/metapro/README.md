Metaprogramming -- Formula & Variable Substitution
==================================================

In this example, we'll rewrite the [Baseball Pitchers](https://github.com/benlue/jsonfp-examples/blob/master/examples/bbPitcher/README.md) example using the JSON-FP formula.

In the "Baseball Pitchers" example, the average ERA and salary of MLB pitchers have to be calculated in order to find out who has the better ERA and lower salary. The expressions used to calculate the average ERA and salary are pretty much the same except they use different property values of a pitcher. Trying to make programs more clearly and concisely, we can generalize those expressions into a formula and invoke that formula like we do with functions in imperative programming languages.

## Defining a formula
A formula to calculate the average number of an input property can be coded as:

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

As you can see a JSON-FP formula is also a JSON-FP expression. The **formula** operator declares that its option is an JSON-FP expression template. The option to a **formula** operator has two properties:

+ **var**: denotes the substitutable variable(s) in the expression template. This property can be a single variable name (string) or an array of variable names (if you want to substitute more than one variable in the expression template).

+ **expr**: this is the expression template with substitutable variables which are specified in the **var** property as explained above.

## Applying formulae

With the average-calculation formula defined, let's see how to apply that formula. A formula can be invoked by the **convert** operator as shown below:

    {
        convert: {
            var: {'@prop1': 'value1', '@prop2': 'value2', ...},
            formula: the_formula_to_be_applied
        }
    }

In our example, we can find out the average salary of MLB pitchers by:

    {
        convert: {
            var: {'@prop': 'salary'},
            formula: avgFormula
        }
    }

That's actually the same as:

    {
        eval: {
            eval: {
                _input: 'salary',
                _expr: avgFormula
            }
        }
    }

So the **convert** operator is not a must but more like a syntactic sugar. It makes formula application easier to read and express.

## Putting things all together

Using JSON-FP formula, we can reduce the original 45 lines program into a 33 lines program as shown below:

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

As you can see, using formulae can not just make JSON-FP programs shorter but also make your programs easier to read and maintain.

## Source code
The complete source code can be found [here](https://github.com/benlue/jsonfp-examples/blob/master/examples/metapro/metaProgram.js).