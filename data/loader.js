var fs = require("fs");
var http = require("http");

var months = [
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december"
]

var files = [
	{ year: 2016, month: 10, day: 24 },
	{ year: 2016, month: 10, day: 17 },
	{ year: 2016, month: 10, day: 10 },
	{ year: 2016, month: 10, day: 3 },
/*
	{ year: 2016, month: 9, day: 26 },
	{ year: 2016, month: 9, day: 19 },
	{ year: 2016, month: 9, day: 12 },
	{ year: 2016, month: 9, day: 5 },

	{ year: 2016, month: 8, day: 29 },
	{ year: 2016, month: 8, day: 22 },
	{ year: 2016, month: 8, day: 15 },
	{ year: 2016, month: 8, day: 8 },
	{ year: 2016, month: 8, day: 1 },

	{ year: 2016, month: 7, day: 26 },
	{ year: 2016, month: 7, day: 19 },
	{ year: 2016, month: 7, day: 11 },
	{ year: 2016, month: 7, day: 4 },

	{ year: 2016, month: 6, day: 27 },
	{ year: 2016, month: 6, day: 21 },
	{ year: 2016, month: 6, day: 13 },
	{ year: 2016, month: 6, day: 6 },
	{ year: 2016, month: 6, day: 1 },

	{ year: 2016, month: 5, day: 23 },
	{ year: 2016, month: 5, day: 17 },
	{ year: 2016, month: 5, day: 9 },
	{ year: 2016, month: 5, day: 2 },

	{ year: 2016, month: 4, day: 25 },
	{ year: 2016, month: 4, day: 18 },
	{ year: 2016, month: 4, day: 11 },
	{ year: 2016, month: 4, day: 5 },

	{ year: 2016, month: 3, day: 28 },
	{ year: 2016, month: 3, day: 21 },
	{ year: 2016, month: 3, day: 14 },
	{ year: 2016, month: 3, day: 7 },
	{ year: 2016, month: 3, day: 1 },

	{ year: 2016, month: 2, day: 22 },
	{ year: 2016, month: 2, day: 15 },
	{ year: 2016, month: 2, day: 9 },
	{ year: 2016, month: 2, day: 1 },

	{ year: 2016, month: 1, day: 25 },
	{ year: 2016, month: 1, day: 18 },
	{ year: 2016, month: 1, day: 11 },
	{ year: 2016, month: 1, day: 5 },

	{ year: 2015, month: 12, day: 28 },
	{ year: 2015, month: 12, day: 21 },
	{ year: 2015, month: 12, day: 14 },
	{ year: 2015, month: 12, day: 8 },
	{ year: 2015, month: 12, day: 1 },

	{ year: 2015, month: 11, day: 24 },
	{ year: 2015, month: 11, day: 16 },
	{ year: 2015, month: 11, day: 9 },
	{ year: 2015, month: 11, day: 3 },

	{ year: 2015, month: 10, day: 26 },
	{ year: 2015, month: 10, day: 19 },
	{ year: 2015, month: 10, day: 12 },
	{ year: 2015, month: 10, day: 5 },
	{ year: 2015, month: 10, day: 1 },
*/
]

files.forEach(function(file)
{
	var path = "/ranking/teams/";
	path += file.year + "/";
	path += months[file.month - 1] + "/";
	path += file.day + "/";

	var options = {
		host: "www.hltv.org",
		port: 80,
		path: path
	};

	console.log("Loading page: " + options.host + options.path);

	http.get(
		options,
		function(response)
		{
			console.log("Got response: " + response.statusCode);

			var body = "";

			response.on(
				"data",
				function(d)
				{
					body += d;
				}
			);

			response.on(
				"end",
				function()
				{
					var monthNumber = file.month.toString();
					if (monthNumber.length < 2)
					{
						monthNumber = "0" + monthNumber;
					}

					var dayNumber = file.day.toString();
					if (dayNumber.length < 2)
					{
						dayNumber = "0" + dayNumber;
					}

					var filePath = "./"
					filePath += file.year + "_";
					filePath += monthNumber + "_";
					filePath += dayNumber + ".txt";

					fs.writeFile(
						filePath,
						body,
						function(error)
						{
							if(error)
							{
								return console.log(error);
							}

							console.log("Saved to " + filePath);
						}
					);
				}
			);

		}
	).on(
		"error",
		function(e)
		{
			console.log("Got error: " + e.message);
		}
	);

});
