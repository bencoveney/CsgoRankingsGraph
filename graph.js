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

function drawText(string, x, y, color, fontSize, className, opacity)
{
	var text = document.createElementNS(svgNs, "text");

	text.innerHTML = string;

	text.setAttribute("x", x);
	text.setAttribute("y", y);
	text.setAttribute("font-family", "Arial");
	text.setAttribute("font-size", fontSize);
	text.setAttribute("text-anchor", "middle");
	text.setAttribute("fill", color);
	text.setAttribute("class", className);
	text.setAttribute("fill-opacity", opacity);

	graph.appendChild(text);
}

// Set the dimensions
var width = 2500;
var height = 700;
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
var paddingTop = 100;
var paddingLeft = 50;
var paddingRight = 50;
var paddingBottom = 50;
var remainingHeight = height - paddingTop - paddingBottom;
var remainingWidth = width - paddingLeft - paddingRight;

// Distribute the vertical space between the number of rankings.
var numberOfRankings = data.rankings.length;
var spacingPerRanking = remainingWidth / (numberOfRankings - 1);

// Distribute the horizontal space between the number of ranks.
var numberOfRanks = data.rankings[0].ranks.length;
var spacingPerRank = remainingHeight / (numberOfRanks - 1);

var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

// Draw horizontal gridlines.
data.rankings.forEach(function(ranking, rankingIndex)
{ 
	var xPosition = (rankingIndex * spacingPerRanking) + paddingLeft;

	drawLine(xPosition, 0, xPosition, height, "#333333", 1, "5, 5");

	var dayAndMonth = ranking.date.getDate() + " " + months[ranking.date.getMonth()];
	var year = ranking.date.getFullYear().toString();

	drawText(dayAndMonth, xPosition, 20, "white", 12, "", 1);
	drawText(year, xPosition, 40, "white", 12, "", 1);
});

// Draw vertical gridlines.
data.rankings[0].ranks.forEach(function(ranking, rankingIndex)
{ 
	var yPosition = (rankingIndex * spacingPerRank) + paddingTop;

	drawLine(0, yPosition, width, yPosition, "#333333", 1, "5, 5");
});

// Declare some opactiy constants.
var normalOpacity = 0.5;
var highlightOpacity = 1;
var lowlightOpacity = 0.2;

// Draw team series.
data.teams.forEach(function(team)
{
	// Gets the rank for a team in the given set of rankings.
	function getRank(rankingIndex)
	{
		// We might be pointing to a ranking which doesn't exist.
		// Duplicate the ranking to keep a flat line at the graph's edges.
		rankingIndex = Math.min(Math.max(rankingIndex, 0), numberOfRankings - 1);

		// Find the rank at the given rankings.
		var rank = team.ranks[rankingIndex];

		// If there was no rank then put the team off the bottom.
		return rank === null ? numberOfRanks + 1 : rank;
	}

	// Calculate the line's x position at the given ranking.
	function getXPosition(rankIndex)
	{
		return (rankIndex * spacingPerRanking) + paddingLeft;
	}

	// Calculate the line's y position at the given ranking.
	function getYPosition(rank)
	{
		// Decrement the rankings so that it is 0-based rather than 1-based.
		rank = rank - 1;

		return (rank * spacingPerRank) + paddingTop;
	}

	// Create a safe team name to use in CSS/HTML identifiers.
	team.safeTeamName = team.name.replace(new RegExp("[\. ]", "g"), "_");

	// Iterate through the gaps on either side of the rankings.
	for (var j = 0; j < (numberOfRankings + 1); j++)
	{
		// Find the index before and after the gap.
		var rankingIndexBefore = j - 1;
		var rankingIndexAfter = j;

		// Calculate how to place the curve anchor points.
		var curveSoftness = spacingPerRanking * 0.75;

		var rankBefore = getRank(rankingIndexBefore);
		var rankAfter = getRank(rankingIndexAfter);

		// Calculate the y position before and after the transition.
		var yPositionBefore = getYPosition(rankBefore);
		var yPositionAfter = getYPosition(rankAfter);

		// Calculate the y position before and after the transition.
		var xPositionBefore = getXPosition(rankingIndexBefore);
		var xPositionAfter = getXPosition(rankingIndexAfter);

		if(j < numberOfRankings && rankAfter <= numberOfRanks)
		{
			var labelClass = "team-" + team.safeTeamName;
			var labelText = team.name + " (" + rankAfter + ")";
			var labelColor = team.textColor || team.color;

			drawText(labelText, xPositionAfter, yPositionAfter - 20, labelColor, "12", labelClass, normalOpacity);
		}

		// Add the curve.
		// TODO: Create long lines for big flat gaps.
		var pathDefinition = "M" + xPositionBefore + " "
		pathDefinition += yPositionBefore + " ";
		pathDefinition += " C ";
		pathDefinition += (xPositionBefore + curveSoftness) + " ";
		pathDefinition += yPositionBefore + ", ";
		pathDefinition += (xPositionAfter - curveSoftness) + " ";
		pathDefinition += yPositionAfter + ", ";
		pathDefinition += xPositionAfter + " ";
		pathDefinition += yPositionAfter;

		// Create the curve element.
		var line = document.createElementNS(svgNs, "path");
		line.setAttribute("d", pathDefinition);
		line.setAttribute("stroke", team.color);
		line.setAttribute("fill", "transparent");
		line.setAttribute("stroke-width", 10);
		line.setAttribute("stroke-opacity", normalOpacity);
		line.setAttribute("class", "team-" + team.safeTeamName);
		line.setAttribute("onmouseover", "handleMouseOver(\"" + team.safeTeamName + "\");");
		line.setAttribute("onmouseout", "handleMouseOut(\"" + team.safeTeamName + "\");");
		graph.appendChild(line);
	}
});

// Prepare a gradient for the bottom of the graph to fade to black.
var gradientHeight = paddingBottom;
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
		path.setAttribute("fill-opacity", opacity);
	});
}

// Highlights the specified team's path.
function handleMouseOver(teamName)
{
	console.log("Highlighting " + teamName);

	data.teams.forEach(function(team)
	{
		var opacity = teamName === team.safeTeamName ? highlightOpacity : lowlightOpacity;
		
		changeTeamOpacity(team.safeTeamName, opacity);
	});
}

// Lowlights the specified team's path.
function handleMouseOut(teamName)
{
	console.log("Lowlighting " + teamName);

	data.teams.forEach(function(team)
	{
		changeTeamOpacity(team.safeTeamName, normalOpacity);
	});
}

function showTeamLabels()
{

}
