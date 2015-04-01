Using "Streams" As Data Generators
==================================

A stream is a sequence of data. Some people think of streams as data lists of infinite length. However, if we can accept that streams can also be data lists of finite length, we can make streams more useful.

## The Iterator Stream
Usually we think of streams as data flows coming in or out of file streams or network connections. Here we'll talk about another kind of streams: the iterator stream. An interator stream can generate a sequence of integers in a predefined order, such as generating an integer sequence from 1 to 10. Using that concept, we can replace the commonly used for-loop statement with the iterator steam. For example, assume you want to sum up integer from 1 to 10. With imperative programming, you usually do the following:

    var  sum = 0;
    for (var i = 1; i <= 10; i++)
      sum += i;

In JSON-FP, you can do it more elegantly:

    {
		'->': [
	    	{'stream/iterator': {start: 1, end: 10}},
	    	{reduce: 'add'}
	    ]
	};

As you may have already figured, the code:

    {'stream/iterator': {start: 1, end: 10}}

produces a list of integers as shown below:

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

### PI Calculation
In the next example, we'll try to calculate PI using the Monte Carlo method. First of all, let's write a little expression to calculate x^2:

    var  squareExpr = {
		'->': [
			{random: null},
			{multiply:
				{clone: null}
			}
		]
	};

In the above expression, we generate a random number and duplicate it, so we can multiply the random number by itself. With the square expression ready, we can do:

    {
		'->': [
			[squareExpr, squareExpr],
			{reduce: 'add'},
			{'<=': 1}
		]
	}

That will tell us whether a randomly generated point is inside a circle. Since we'll be using the Monte Carlo method, we probably should at least generate one thousand random points to get a rough estimation. Now it's a good time to apply the iterator stream we've just learned:

	{'->': [
       	{'stream/iterator': {start: 1, end: 1000}},
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
	]}

The result of the above expression will be the number of points falling inside the area of a circle out of the 1000 random points. To get an approximate PI value, you can divide the result with the total number of points (1000) and multiply it by four.

## The Complete Source
The complete source code can be found here: [https://github.com/benlue/jsonfp-examples/blob/master/examples/stream/stream.js](https://github.com/benlue/jsonfp-examples/blob/master/examples/stream/stream.js).