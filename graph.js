// Get the canvas.
var graph = document.getElementById("graph");
var svgNs = "http://www.w3.org/2000/svg";

var width = 3000;
var height = 900;

graph.setAttribute('width', width);
graph.setAttribute('height', height);

data.rankings = data.rankings.sort(function(a, b) {
	return a.date - b.date;
});

// Populate a collection containing all the players.
data.players = {};
for (var i = 0; i < data.rankings.length; i++)
{
	var ranking = data.rankings[i];

	for (var j = 0; j < ranking.ranks.length; j++)
	{
		var rank = ranking.ranks[j];

		for (var k = 0; k < rank.players.length; k++)
		{
			var playerName = rank.players[k];

			var player;
			if (data.players[playerName])
			{
				player = data.players[playerName];
			}
			else
			{
				player = {};

				player.teams = [];

				for (var l = 0; l < data.rankings.length; l++)
				{
					player.teams.push(null);
				}

				data.players[playerName] = player
			}

			player.teams[j] = rank.team;
		}
	}
}

// Denormalize the rank of each team for every ranking.
for (var i = 0; i < data.teams.length; i++)
{
	// Find the team.
	var team = data.teams[i];

	// Get their rankings.
	team.ranks = [];
	for (var j = 0; j < data.rankings.length; j++)
	{
		// Look for the team in the ranking.
		var ranking = data.rankings[j];

		var foundRank = ranking.ranks.find(function(rank) {
			return rank.team == team.name;
		});

		if (foundRank)
		{
			team.ranks.push(foundRank.position);
		}
		else
		{
			team.ranks.push(null);
		}
	}
}

var padding = 50;
var remainingHeight = height - (padding * 2);
var remainingWidth = width - (padding * 2);

var numberOfRankings = data.rankings.length;
var spacingPerRanking = remainingWidth / (numberOfRankings - 1);

var numberOfRanks = data.rankings[0].ranks.length;
var spacingPerRank = remainingHeight / (numberOfRanks - 1);

// Draw gridlines
for (var i = 0; i < data.rankings.length; i++)
{
	var xPosition = (i * spacingPerRanking) + padding;

	var line = document.createElementNS(svgNs, "line");
	line.setAttribute("x1", xPosition);
	line.setAttribute("y1", 0);
	line.setAttribute("x2", xPosition);
	line.setAttribute("y2", height);
	line.setAttribute("stroke", "grey");
	line.setAttribute("stroke-width", 1);
	line.setAttribute("stroke-dasharray", "5, 5");
	graph.appendChild(line);
}

// Draw gridlines
for (var i = 0; i < data.rankings[0].ranks.length; i++)
{
	var yPosition = (i * spacingPerRank) + padding;

	var line = document.createElementNS(svgNs, "line");
	line.setAttribute("x1", 0);
	line.setAttribute("y1", yPosition);
	line.setAttribute("x2", width);
	line.setAttribute("y2", yPosition);
	line.setAttribute("stroke", "grey");
	line.setAttribute("stroke-width", 1);
	line.setAttribute("stroke-dasharray", "5, 5");
	graph.appendChild(line);
}

// Draw team series.
for (var i = 0; i < data.teams.length; i++)
{
	var team = data.teams[i];

	for (var j = 0; j < (numberOfRankings + 1); j++)
	{
		var rankIndexBefore = j - 1;
		var rankIndexAfter = j;

		if (rankIndexBefore < 0)
		{
			rankIndexBefore = rankIndexAfter;
		}
		else if (rankIndexAfter >= numberOfRankings)
		{
			rankIndexAfter = rankIndexBefore;
		}

		var rankBefore = team.ranks[rankIndexBefore];
		var rankAfter = team.ranks[rankIndexAfter];

		if (rankBefore === null)
		{
			rankBefore = numberOfRanks + 1;
		}
		if (rankAfter === null)
		{
			rankAfter = numberOfRanks + 1;
		}

		yPositionBefore = ((rankBefore - 1) * spacingPerRank) + padding;
		yPositionAfter = ((rankAfter - 1) * spacingPerRank) + padding;

		var xPositionBefore = ((j - 1) * spacingPerRanking) + padding;
		var xPositionAfter = (j * spacingPerRanking) + padding;

		var curveSoftness = spacingPerRanking * 0.75;

		var pathDefinition = "M" + xPositionBefore + " "
		pathDefinition += yPositionBefore + " ";
		pathDefinition += "C ";
		pathDefinition += (xPositionBefore + curveSoftness) + " ";
		pathDefinition += yPositionBefore + ", ";
		pathDefinition += (xPositionAfter - curveSoftness) + " ";
		pathDefinition += yPositionAfter + ", ";
		pathDefinition += xPositionAfter + " ";
		pathDefinition += yPositionAfter;

		var line = document.createElementNS(svgNs, "path");
		line.setAttribute("d", pathDefinition);
		line.setAttribute("stroke", team.color);
		line.setAttribute("fill", "transparent");
		line.setAttribute("stroke-width", 20);
		graph.appendChild(line);
	}
}

// Fade the bottom to black.
var gradientHeight = padding;
var gradientTop = height - gradientHeight;
var gradientBottom = height;

var definitions = document.createElementNS(svgNs, "defs");
graph.appendChild(definitions);

var gradient = document.createElementNS(svgNs, "linearGradient");
gradient.setAttribute("id", "bottom");
gradient.setAttribute("x1", 0);
gradient.setAttribute("y1", 0);
gradient.setAttribute("x2", 0);
gradient.setAttribute("y2", 1);
definitions.appendChild(gradient);

var topStop = document.createElementNS(svgNs, "stop");
topStop.setAttribute("offset", "0%");
topStop.setAttribute("stop-color", "black");
topStop.setAttribute("stop-opacity", 0);
gradient.appendChild(topStop);

var bottomStop = document.createElementNS(svgNs, "stop");
bottomStop.setAttribute("offset", "100%");
bottomStop.setAttribute("stop-color", "black");
bottomStop.setAttribute("stop-opacity", 1);
gradient.appendChild(bottomStop);

var gradientArea = document.createElementNS(svgNs, "rect");
gradientArea.setAttribute("x", 0);
gradientArea.setAttribute("y", gradientTop);
gradientArea.setAttribute("width", width);
gradientArea.setAttribute("height", gradientHeight);
gradientArea.setAttribute("fill", "url(#bottom)");
graph.appendChild(gradientArea);
