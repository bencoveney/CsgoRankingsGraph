// Get the graph renderer.
var graph = document.getElementById("graph");
var svgNs = "http://www.w3.org/2000/svg";

// Creates a line on the graph.
function drawLine(x1, y1, x2, y2, color, width, dashes)
{
	var line = document.createElementNS(svgNs, "line");

	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	line.setAttribute("stroke", color);
	line.setAttribute("stroke-width", width);
	line.setAttribute("stroke-dasharray", dashes);

	graph.appendChild(line);
}

// Set the dimensions
var width = 3000;
var height = 900;
graph.setAttribute('width', width);
graph.setAttribute('height', height);

// Ensure the rankings are sorted.
data.rankings = data.rankings.sort(function(a, b)
{
	return a.date - b.date;
});

// Populate a collection containing all the players.
data.players = {};
data.rankings.forEach(function(ranking)
{
	ranking.ranks.forEach(function(rank, rankIndex)
	{
		rank.players.forEach(function(playerName)
		{
			// Attempt to find the existing player.
			var player;
			if (data.players[playerName])
			{
				player = data.players[playerName];
			}
			else
			{
				// Populate a fresh player with empty rankings.
				player = {
					teams: []
				};

				data.rankings.forEach(function()
				{
					player.teams.push(null);
				});

				data.players[playerName] = player
			}

			// Put the team into the player's history.
			player.teams[rankIndex] = rank.team;
		});
	});
});

// Denormalize the rank of each team for every ranking.
data.teams.forEach(function(team)
{
	// Get their rankings.
	team.ranks = [];
	data.rankings.forEach(function(ranking)
	{
		// Add the team's rank, otherwise null.
		var foundRank = ranking.ranks.find(function(rank)
		{
			return rank.team == team.name;
		});

		team.ranks.push(foundRank ? foundRank.position : null);
	});
});

// Apply some padding to the graph area so that the points are not pressed up against the side.
var padding = 50;
var remainingHeight = height - (padding * 2);
var remainingWidth = width - (padding * 2);

// Distribute the vertical space between the number of rankings.
var numberOfRankings = data.rankings.length;
var spacingPerRanking = remainingWidth / (numberOfRankings - 1);

// Distribute the horizontal space between the number of ranks.
var numberOfRanks = data.rankings[0].ranks.length;
var spacingPerRank = remainingHeight / (numberOfRanks - 1);

// Draw vertical gridlines.
data.rankings.forEach(function(ranking, rankingIndex)
{ 
	var xPosition = (rankingIndex * spacingPerRanking) + padding;

	drawLine(xPosition, 0, xPosition, height, "grey", 1, "5, 5");
});

// Draw horizontal gridlines.
data.rankings[0].ranks.forEach(function(ranking, rankingIndex)
{ 
	var yPosition = (rankingIndex * spacingPerRank) + padding;

	drawLine(0, yPosition, width, yPosition, "grey", 1, "5, 5");
});

// Draw team series.
data.teams.forEach(function(team)
{
	function getXPosition(rankIndex)
	{
		return (rankIndex * spacingPerRanking) + padding;
	}

	function getYPosition(rankIndex)
	{
		// We might be pointing to a ranking which doesn't exist.
		// Duplicate the ranking to keep a flat line at the graph's edges.
		rankIndex = Math.min(Math.max(rankIndex, 0), numberOfRankings - 1);

		// Find the rank at the given rankings.
		var rank = team.ranks[rankIndex];

		// If there was no rank then put the team off the bottom.
		rank = rank === null ? numberOfRanks + 1 : rank;

		// Decrement the rankings so that it is 0-based rather than 1-based.
		rank = rank - 1;

		return (rank * spacingPerRank) + padding;
	}

	// Iterate through the gaps on either side of the rankings.
	for (var j = 0; j < (numberOfRankings + 1); j++)
	{
		// Find the index before and after the gap.
		var rankIndexBefore = j - 1;
		var rankIndexAfter = j;

		// Calculate how to place the curve anchor points.
		var curveSoftness = spacingPerRanking * 0.75;

		// Calculate the y position before and after the transition.
		var yPositionBefore = getYPosition(rankIndexBefore);
		var yPositionAfter = getYPosition(rankIndexAfter);

		// Calculate the y position before and after the transition.
		var xPositionBefore = getXPosition(rankIndexBefore);
		var xPositionAfter = getXPosition(rankIndexAfter);

		// If there is no existing path then create the starting point.
		if (!team.pathDefinition) {
			team.pathDefinition = "M" + xPositionBefore + " "
			team.pathDefinition += yPositionBefore + " ";
		}

		// Add the curve.
		team.pathDefinition += " C ";
		team.pathDefinition += (xPositionBefore + curveSoftness) + " ";
		team.pathDefinition += yPositionBefore + ", ";
		team.pathDefinition += (xPositionAfter - curveSoftness) + " ";
		team.pathDefinition += yPositionAfter + ", ";
		team.pathDefinition += xPositionAfter + " ";
		team.pathDefinition += yPositionAfter;
	}

	// Create a safe team name to use in CSS/HTML identifiers.
	team.safeTeamName = team.name.replace(new RegExp("[\. ]", "g"), "_");

	// Create the curve element.
	var line = document.createElementNS(svgNs, "path");
	line.setAttribute("d", team.pathDefinition);
	line.setAttribute("stroke", team.color);
	line.setAttribute("fill", "transparent");
	line.setAttribute("stroke-width", 40);
	line.setAttribute("stroke-opacity", 0.7);
	line.setAttribute("class", "team-" + team.safeTeamName);
	line.setAttribute("onmouseover", "handleMouseOver(\"" + team.safeTeamName + "\");");
	line.setAttribute("onmouseout", "handleMouseOut(\"" + team.safeTeamName + "\");");
	graph.appendChild(line);
});

// Prepare a gradient for the bottom of the graph to fade to black.
var gradientHeight = padding;
var gradientTop = height - gradientHeight;
var gradientBottom = height;

// Add a definitions section to the graph for gradient declarations.
var definitions = document.createElementNS(svgNs, "defs");
graph.appendChild(definitions);

// Add a new gradient to the definitions.
var gradient = document.createElementNS(svgNs, "linearGradient");
gradient.setAttribute("id", "bottom");
gradient.setAttribute("x1", 0);
gradient.setAttribute("y1", 0);
gradient.setAttribute("x2", 0);
gradient.setAttribute("y2", 1);
definitions.appendChild(gradient);

// Create the transparent gradient stop.
var topStop = document.createElementNS(svgNs, "stop");
topStop.setAttribute("offset", "0%");
topStop.setAttribute("stop-color", "black");
topStop.setAttribute("stop-opacity", 0);
gradient.appendChild(topStop);

// Create the solid gradient stop.
var bottomStop = document.createElementNS(svgNs, "stop");
bottomStop.setAttribute("offset", "100%");
bottomStop.setAttribute("stop-color", "black");
bottomStop.setAttribute("stop-opacity", 1);
gradient.appendChild(bottomStop);

// Create the rectangle with the gradient applied.
var gradientArea = document.createElementNS(svgNs, "rect");
gradientArea.setAttribute("x", 0);
gradientArea.setAttribute("y", gradientTop);
gradientArea.setAttribute("width", width);
gradientArea.setAttribute("height", gradientHeight);
gradientArea.setAttribute("fill", "url(#bottom)");
graph.appendChild(gradientArea);

// Changes the opacity for all paths matching the team name.
function changeTeamOpacity(teamName, opacity)
{
	var teamSeries = document.querySelectorAll(".team-" + teamName);
	teamSeries.forEach(function(path) {
		path.setAttribute("stroke-opacity", opacity);
	});
}

// Highlights the specified team's path.
function handleMouseOver(teamName)
{
	changeTeamOpacity(teamName, 1);
}

// Lowlights the specified team's path.
function handleMouseOut(teamName)
{
	changeTeamOpacity(teamName, 0.7);
}
