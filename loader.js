var fs = require("fs");
var http = require("http");
var jsdom = require("jsdom");

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
];

var ratingDates = [
	{ year: 2016, month: 10, day: 24 },
	{ year: 2016, month: 10, day: 17 },
	{ year: 2016, month: 10, day: 10 },
	{ year: 2016, month: 10, day: 3 },

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
];

var data = {
	rankings: [],
	teams: [
		{ name: "Virtus.pro", color: "#F36801" },
		{ name: "SK", color: "#2D498E" },
		{ name: "Natus Vincere", color: "#FEE821" },
		{ name: "NiP", color: "#A98C66" },
		{ name: "dignitas", color: "#F8C700" },
		{ name: "Cloud9", color: "#1D9DD8" },
		{ name: "G2", color: "#A8A8A8" },
		{ name: "Liquid", color: "#5B76AF" },
		{ name: "EnVyUs", color: "#576DA5" },
		{ name: "GODSENT", color: "#F5C92E" },
		{ name: "Astralis", color: "#EF3742" },
		{ name: "Immortals", color: "#01B2AA" },
		{ name: "Heroic", color: "#3EB243" },
		{ name: "mousesports", color: "#C12E50" },
		{ name: "fnatic", color: "#F19E33" },
		{ name: "TSM", color: "#EFEFEF" },
		{ name: "CLG", color: "#008FEA" },
		{ name: "FlipSid3", color: "#73EB2A" },
		{ name: "Titan", color: "#80B8C7" },
		{ name: "E-frag.net", color: "#4383BF" },
		{ name: "HellRaisers", color: "#EC1C23" },
		{ name: "Renegades", color: "#87202A" },
		{ name: "Vexed", color: "#CD2029" },
		{ name: "CSGL", color: "#DB8328" },
		{ name: "Immunity", color: "#C9C9CA" },
		{ name: "Conquest", color: "#D08685" },
		{ name: "?", color: "#EFEFEF" },
		{ name: "OpTic", color: "#98D106" },
		{ name: "ex-Titan", color: "#80B8C7" },
		{ name: "FaZe", color: "#E91E25" },
		{ name: "Tempo Storm", color: "#3373BA" },
		{ name: "Gambit", color: "#F00815" },
		{ name: "NRG", color: "#ED2B7E" },
		{ name: "AGG", color: "#EA001C" },
		{ name: "Selfless", color: "#D79153" },
		{ name: "TyLoo", color: "#D53A31" },
		{ name: "Epsilon", color: "#0A5499" },
		{ name: "X", color: "#EFEFEF" },
		{ name: "Space Soldiers", color: "#F7E300" },
		{ name: "MK", color: "#027C03" },
		{ name: "VG.CyberZen", color: "#BC3728" },
	]
};

function loadPageLoop(files)
{
	var file = files.pop();

	var monthName = months[file.month - 1]

	var path = "http://www.hltv.org/ranking/teams/";
	path += file.year + "/";
	path += monthName + "/";
	path += file.day + "/";

	var jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf-8");

	jsdom.env({
		url: path,
		src: [jquery],
		done: function (err, window)
		{
			var dateString = monthName + " " + file.day + ", " + file.year;
			var date = new Date(dateString);

			console.log("Rankings for " + date.toISOString());

			var ranking = {
				link: path,
				date: dateString,
				ranks: []
			}

			data.rankings.push(ranking);

			var $ = window.$;
			$(".ranking-box .ranking-logo").each(function ()
			{
				var thisElement =  $(this);

				var rankNumber = thisElement.find(".ranking-number").text().substring(1);

				var teamName = thisElement.find(".ranking-teamName > a").text().trim();

				var points = thisElement.find(".ranking-teamName > span").text().match(/([\d]+)/g)[0];

				var details = "http://www.hltv.org" + thisElement.find(".ranking-teamName > span > a").attr('href');

				console.log(rankNumber + " - " + teamName + " - Points: " + points);
				console.log(details);

				var rank = {
					position: rankNumber,
					team: teamName,
					points: points,
					link: details,
					players: []
				};

				ranking.ranks.push(rank);

				var rosterList = "Roster: ";

				thisElement.find(".ranking-lineup .ranking-playerNick > a").each(function ()
				{
					var playerName = $(this).text().trim();
					var playerUrl = "http://www.hltv.org" + $(this).attr("href");

					console.log(playerUrl);

					// Some player names (seang@res specifically) break the parsing
					if (playerName.length > 30)
					{
						playerName = "Broken_player_name";
					}

					rank.players.push({
						player: playerName,
						link: playerUrl
					})

					rosterList += playerName + ", ";
				});

				if (!data.teams.some(function(team) {
					return team.name === teamName
				}))
				{
					data.teams.push({
						name: teamName,
						color: "white"
					})
				}

				console.log(rosterList);
			});

			if (files.length > 0)
			{
				loadPageLoop(files);
			}
			else
			{
				writeData();
			}
		}
	});
}

function writeData() {
	var outputFile = "output.js";

	fs.writeFile(
		outputFile,
		"var data = " + JSON.stringify(data, null, "	") + ";",
		function (error)
		{
			if (error)
			{
				return console.log(error);
			}

			console.log("Output written to " + outputFile);
		}
	);
}

loadPageLoop(ratingDates);
