var  jsonfp = require('jsonfp');

jsonfp.init();

var  words = ['json', 'node', 'jumbo', 'functional', 'json', 'node', 'json'];

var  wcExpr = {
	"->": [
		{map:
			{
				key: '$in',
				count: 1
			}
		},
		{"$expr": {
			def: {
				"if": [{"->": [{size: null}, {">": 1}]},
					{
						"->": [
							{
								"$pivot": {head: null},
								mapred: {
									"->": [
										[
											[{
												key: "$pivot.key",
												count: {
													"->": [
														{filter: 
															{"->": [
																{getter: "key"},
																{"==": "$pivot.key"}
															]}
														},
														{map: {getter: "count"}},
														{reduce: "add"}
													]
												}
											}],
											{"->": [
												{filter:
													{"->": [
														{getter: "key"},
														{"!=": "$pivot.key"}
													]}
												},
												"$expr"
											]}
										],
										{reduce: "add"}
									]
								}
							},
							{getter: "mapred"}
						]
					},
					"$in"
				]
			}
		},
		wcount: "$expr"}
	]
};

var  wcount = jsonfp.apply(words, wcExpr).wcount;
console.log('The word count result is\n%s', JSON.stringify(wcount, null, 4));