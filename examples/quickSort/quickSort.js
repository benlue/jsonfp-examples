var  jsonfp = require('jsonfp');

jsonfp.init();

// this is the input (data to be sorted)
var  seq = [5, 7, 3, 20, 88, 15, 6, 2, 50];

var  expr = {
	'$expr': {
		def: {
			if: [{'->': [{size: null}, {'>': 1}]},
					{'->': [
						{
							'$pivot': {head: null},
							qsort:
								{'->': [
									{
										bucket: [
											[{"<": "$pivot"}, "$expr"],
											{"==": "$pivot"},
											[{">": "$pivot"}, "$expr"]
										]
									},
									{reduce: "add"}
								]}
						},
						{getter: "qsort"}
					]},
					'$in'
				]
		}
	},
	qsort: '$expr'
};

jsonfp.apply(seq, expr).then(function(result) {
	console.log( 'After sort: %s', JSON.stringify(result.qsort) );
});