// Get the canvas.
var canvas = document.getElementById("graph");
var context = canvas.getContext("2d");

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
var remainingHeight = canvas.height - (padding * 2);
var remainingWidth = canvas.width - (padding * 2);

var numberOfRankings = data.rankings.length;
var spacingPerRanking = remainingWidth / (numberOfRankings - 1);

var numberOfRanks = data.rankings[0].ranks.length;
var spacingPerRank = remainingHeight / (numberOfRanks - 1);

// Draw gridlines
for (var i = 0; i < data.rankings.length; i++)
{
	var xPosition = (i * spacingPerRanking) + padding;

	context.save();

	context.strokeStyle = "grey";
	context.lineWidth = 1;
	context.setLineDash([5, 15]);

	context.beginPath();
	context.moveTo(xPosition, 0);
	context.lineTo(xPosition, canvas.height);
	context.closePath();
	context.stroke();

	context.restore();
}

// Draw gridlines
for (var i = 0; i < data.rankings[0].ranks.length; i++)
{
	var yPosition = (i * spacingPerRank) + padding;

	context.save();

	context.strokeStyle = "grey";
	context.lineWidth = 1;
	context.setLineDash([5, 15]);

	context.beginPath();
	context.moveTo(0, yPosition);
	context.lineTo(canvas.width, yPosition);
	context.closePath();
	context.stroke();

	context.restore();
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

		context.save();

		context.strokeStyle = team.color;
		context.lineWidth = 20;

		var curveSoftness = spacingPerRanking * 0.75;
		context.beginPath();
		context.moveTo(xPositionBefore, yPositionBefore);
		context.bezierCurveTo(
			xPositionBefore + curveSoftness, yPositionBefore,
			xPositionAfter - curveSoftness, yPositionAfter,
			xPositionAfter, yPositionAfter
		);
		context.stroke();

		context.restore();
	}
}

// Fade the bottom to black.
var gradientHeight = padding;
var gradientTop = canvas.height - gradientHeight;
var gradientBottom = canvas.height;

context.save();
var gradient = context.createLinearGradient(0, gradientTop, 0, gradientBottom);
gradient.addColorStop(0.000, 'rgba(0, 0, 0, 0.000)');
gradient.addColorStop(1.000, 'rgba(0, 0, 0, 1.000)');
context.fillStyle = gradient;
context.fillRect(0, gradientTop, canvas.width, gradientHeight);
context.restore();
