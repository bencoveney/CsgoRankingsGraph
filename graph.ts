// Get the graph renderer.
var graph = document.getElementById("graph");
var svgNs = "http://www.w3.org/2000/svg";

// Parse dates and find the highest number of ranks.
var highestNumberOfRanks = 0;
data.rankings.forEach(function(ranking)
{
  highestNumberOfRanks = Math.max(highestNumberOfRanks, ranking.ranks.length);
  ranking.date = new Date(ranking.date);
});

// Ensure the rankings are sorted.
data.rankings = data.rankings.sort(function(a, b)
{
  return (a.date as Date).getTime() - (b.date as Date).getTime();
});

var dateFromElement = document.querySelector("#dateFrom") as HTMLSelectElement;
var dateToElement = document.querySelector("#dateTo") as HTMLSelectElement;

function getDropDownDate(date: Date): string {
  return date.toDateString().substring(4);
}

function emptyElement(element: Element) {
  while(element.firstChild)
  {
    element.removeChild(element.firstChild);
  }
}

function setDropDownDates(first, last) {
  function addDateToSelector(date: Date, selector: HTMLSelectElement, isSelected: boolean, isEnabled: boolean) {
    var option = document.createElement("option");
    var dateString = getDropDownDate(date);
    option.text = dateString;
    option.value = dateString;
    option.selected = isSelected;
    option.disabled = !isEnabled;
    selector.add(option);
  }

  emptyElement(dateFromElement);
  emptyElement(dateToElement);

  data.rankings.forEach((ranking) => {
    addDateToSelector(ranking.date as Date, dateFromElement, ranking === first, ranking.date < last.date);
    addDateToSelector(ranking.date as Date, dateToElement, ranking === last, ranking.date > first.date);
  })

  displayGraph(first, last, 30);
}

function refreshDateRanges() {
  function findRanking(dateString: string) {
    return data.rankings.find(function(ranking) {
      return getDropDownDate(ranking.date as Date) === dateString;
    });
  }

  setDropDownDates(findRanking(dateFromElement.value), findRanking(dateToElement.value));
}

function dropDownRanks(selected) {
  var ranksElement = document.querySelector("#topNRanks") as HTMLSelectElement
  function addRank(rankNumber) {
    var option = document.createElement("option");
    var rankString = rankNumber.toString();
    option.text = rankString;
    option.value = rankString;
    option.selected = selected === rankNumber;
    ranksElement.add(option);
  }
  for(var i = 1; i <= highestNumberOfRanks; i++)
  {
    addRank(i);
  }
}

dropDownRanks(10);

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

// Declare some opactiy constants.
var normalOpacity = 0.5;
var highlightOpacity = 1;
var lowlightOpacity = 0.2;

var paddingTop = 100;
var paddingLeft = 50;
var paddingRight = 50;
var paddingBottom = 50;

var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

function displayGraph(firstRanking, lastRanking, topNRanks) {
  emptyElement(graph);

  var selecting = false;
  var activeRankings = data.rankings.filter(function(ranking) {
    if(ranking === firstRanking)
    {
      selecting = true;
    }
    var result = selecting;
    if (ranking === lastRanking)
    {
      selecting = false
    }
    return result;
  });

  // Distribute the vertical space between the number of rankings.
  var numberOfRankings = activeRankings.length;
  var spacingPerRanking = 160;

  // Distribute the horizontal space between the number of ranks.
  var numberOfRanks = activeRankings[numberOfRankings - 1].ranks.length;
  var spacingPerRank = 60;

  // Set the dimensions
  var width = spacingPerRanking * numberOfRankings;
  var height = spacingPerRank * numberOfRanks;
  graph.setAttribute('width', width.toString());
  graph.setAttribute('height', height.toString());

  // Apply some padding to the graph area so that the points are not pressed up against the side.
  var remainingHeight = height - paddingTop - paddingBottom;
  var remainingWidth = width - paddingLeft - paddingRight;

  // Populate a collection containing all the players.
  // Not currently used.
  activeRankings.forEach(function(ranking)
  {
    ranking.ranks.forEach(function(rank, rankIndex)
    {
      rank.players.forEach(function(player)
      {
        // Attempt to find the existing player.
        var newPlayer;
        if (data.players[player.player])
        {
          newPlayer = data.players[player.player];
        }
        else
        {
          // Populate a fresh player with empty rankings.
          newPlayer = {
            teams: []
          };

          activeRankings.forEach(function()
          {
            newPlayer.teams.push(null);
          });

          data.players[player.player] = newPlayer
        }

        // Put the team into the player's history.
        newPlayer.teams[rankIndex] = rank.team;
      });
    });
  });

  // Denormalize the rank of each team for every ranking.
  data.teams.forEach(function(team)
  {
    // Get their rankings.
    team.ranks = [];
    activeRankings.forEach(function(ranking)
    {
      // Add the team's rank, otherwise null.
      var foundRank = ranking.ranks.find(function(rank)
      {
        return rank.team == team.name;
      });

      team.ranks.push(foundRank ? foundRank.position : null);
    });
  });

  // Draw horizontal gridlines.
  activeRankings.forEach(function(ranking, rankingIndex)
  { 
    var xPosition = (rankingIndex * spacingPerRanking) + paddingLeft;

    drawLine(xPosition, 0, xPosition, height, "#333333", 1, "5, 5");

    var rankingDate = ranking.date as Date;
    var dayAndMonth = rankingDate.getDate() + " " + months[rankingDate.getMonth()];
    var year = rankingDate.getFullYear().toString();

    drawText(dayAndMonth, xPosition, 20, "white", 12, "", 1);
    drawText(year, xPosition, 40, "white", 12, "", 1);
  });

  // Draw vertical gridlines.
  activeRankings[0].ranks.forEach(function(ranking, rankingIndex)
  { 
    var yPosition = (rankingIndex * spacingPerRank) + paddingTop;

    drawLine(0, yPosition, width, yPosition, "#333333", 1, "5, 5");
  });

  // Calculate how to place the curve anchor points.
  var curveSoftness = spacingPerRanking * 0.75;
  var curveWidth = 10
  var curveFade = spacingPerRanking * 0.25;

  // Gets the rank for a team in the given set of rankings.
  function getRank(team, rankingIndex)
  {
    // We might be pointing to a ranking which doesn't exist.
    // Duplicate the ranking to keep a flat line at the graph's edges.
    rankingIndex = Math.min(Math.max(rankingIndex, 0), numberOfRankings - 1);

    // Find the rank at the given rankings.
    return team.ranks[rankingIndex];
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

  function createLabel(team, rankingIndex, rank)
  {
    if(rankingIndex < numberOfRankings && rank <= numberOfRanks)
    {
      var yPosition = getYPosition(rank);
      var xPosition = getXPosition(rankingIndex);

      var labelClass = "team-" + team.safeTeamName;
      var labelText = team.name + " (" + rank + ")";
      var labelColor = team.textColor || team.color;

      drawText(labelText, xPosition, yPosition - 20, labelColor, "12", labelClass, normalOpacity);
    }
  }

  function createCurve(rankingIndexBefore, rankingIndexAfter, rankBefore, rankAfter, team)
  {
    // Calculate the y position before and after the transition.
    var yPositionBefore = getYPosition(rankBefore);
    var yPositionAfter = getYPosition(rankAfter);

    // Calculate the y position before and after the transition.
    var xPositionBefore = getXPosition(rankingIndexBefore);
    var xPositionAfter = getXPosition(rankingIndexAfter);

    createLabel(team, rankingIndexAfter, rankAfter);

    if(rankingIndexAfter < numberOfRankings && rankAfter <= numberOfRanks)
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
    line.setAttribute("stroke-width", curveWidth.toString());
    line.setAttribute("stroke-opacity", normalOpacity.toString());
    line.setAttribute("class", "team-" + team.safeTeamName);
    line.setAttribute("onmouseover", "handleMouseOver(\"" + team.safeTeamName + "\");");
    line.setAttribute("onmouseout", "handleMouseOut(\"" + team.safeTeamName + "\");");
    graph.appendChild(line);
  }

  // Add a definitions section to the graph for gradient declarations.
  var definitions = document.createElementNS(svgNs, "defs");
  graph.appendChild(definitions);

  function createLinearGradient(id, x1, y1, x2, y2, startColor, startOpacity, stopColor, stopOpacity)
  {
    // Add a new gradient to the definitions.
    var gradient = document.createElementNS(svgNs, "linearGradient");
    gradient.setAttribute("id", id);
    gradient.setAttribute("x1", x1);
    gradient.setAttribute("y1", y1);
    gradient.setAttribute("x2", x2);
    gradient.setAttribute("y2", y2);
    definitions.appendChild(gradient);

    // Create the transparent gradient stop.
    var topStop = document.createElementNS(svgNs, "stop");
    topStop.setAttribute("offset", "0%");
    topStop.setAttribute("stop-color", startColor);
    topStop.setAttribute("stop-opacity", startOpacity);
    gradient.appendChild(topStop);

    // Create the solid gradient stop.
    var bottomStop = document.createElementNS(svgNs, "stop");
    bottomStop.setAttribute("offset", "100%");
    bottomStop.setAttribute("stop-color", stopColor);
    bottomStop.setAttribute("stop-opacity", stopOpacity);
    gradient.appendChild(bottomStop);
  }

  function createFadeOut(rankingIndexBefore, rankBefore, team)
  {
    var yPosition = getYPosition(rankBefore) - (curveWidth / 2);
    var height = curveWidth;

    // Calculate the y position before and after the transition.
    var xPosition = getXPosition(rankingIndexBefore);
    var width = curveFade;

    var gradientName = team.safeTeamName + "_before_" + rankingIndexBefore;
    createLinearGradient(gradientName, 0, 0, 1, 0, team.color, 1, team.color, 0);

    // Create the rectangle with the gradient applied.
    // TODO: Create rect function.
    var rect = document.createElementNS(svgNs, "rect");

    rect.setAttribute("x", xPosition.toString());
    rect.setAttribute("y", yPosition.toString());
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill-opacity", normalOpacity.toString());
    rect.setAttribute("class", "team-" + team.safeTeamName);
    rect.setAttribute("fill", "url(#" + gradientName + ")");
    rect.setAttribute("onmouseover", "handleMouseOver(\"" + team.safeTeamName + "\");");
    rect.setAttribute("onmouseout", "handleMouseOut(\"" + team.safeTeamName + "\");");

    graph.appendChild(rect);
  }

  function createFadeIn(rankingIndexAfter, rankAfter, team)
  {
    createLabel(team, rankingIndexAfter, rankAfter);

    var yPosition = getYPosition(rankAfter) - (curveWidth / 2);
    var height = curveWidth;

    // Calculate the y position before and after the transition.
    var xPosition = getXPosition(rankingIndexAfter) - curveFade;
    var width = curveFade;

    var gradientName = team.safeTeamName + "_after_" + rankingIndexAfter;
    createLinearGradient(gradientName, 1, 0, 0, 0, team.color, 1, team.color, 0);

    // Create the rectangle with the gradient applied.
    // TODO: Create rect function.
    var rect = document.createElementNS(svgNs, "rect");

    rect.setAttribute("x", xPosition.toString());
    rect.setAttribute("y", yPosition.toString());
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("class", "team-" + team.safeTeamName);
    rect.setAttribute("fill", "url(#" + gradientName + ")");
    rect.setAttribute("onmouseover", "handleMouseOver(\"" + team.safeTeamName + "\");");
    rect.setAttribute("onmouseout", "handleMouseOut(\"" + team.safeTeamName + "\");");

    graph.appendChild(rect);
  }

  // Draw team series.
  data.teams.forEach(function(team)
  {
    // Iterate through the gaps on either side of the rankings.
    for (var j = 0; j < (numberOfRankings + 1); j++)
    {
      // Find the index before and after the gap.
      var rankingIndexBefore = j - 1;
      var rankingIndexAfter = j;

      var rankBefore = getRank(team, rankingIndexBefore);
      var rankAfter = getRank(team, rankingIndexAfter);

      if (rankBefore !== null)
      {
        if (rankAfter !== null)
        {
          createCurve(rankingIndexBefore, rankingIndexAfter, rankBefore, rankAfter, team);
        }
        else
        {
          createFadeOut(rankingIndexBefore, rankBefore, team);
        }
      }
      else if (rankAfter !== null)
      {
        createFadeIn(rankingIndexAfter, rankAfter, team);
      }
    }
  });

  // Prepare a gradient for the bottom of the graph to fade to black.
  var gradientHeight = paddingBottom;
  var gradientTop = height - gradientHeight;
  var gradientBottom = height;

  createLinearGradient("bottom", 0, 0, 0, 1, "black", 0, "black", 1);

  // Create the rectangle with the gradient applied.
  var gradientArea = document.createElementNS(svgNs, "rect");
  gradientArea.setAttribute("x", (0).toString());
  gradientArea.setAttribute("y", gradientTop.toString());
  gradientArea.setAttribute("width", width.toString());
  gradientArea.setAttribute("height", gradientHeight.toString());
  gradientArea.setAttribute("fill", "url(#bottom)");
  graph.appendChild(gradientArea);
}

// Changes the opacity for all paths matching the team name.
function changeTeamOpacity(teamName, opacity)
{
  var teamSeries = document.querySelectorAll(".team-" + teamName);
  [].forEach.call(teamSeries, function(path) {
    path.setAttribute("stroke-opacity", opacity);
    path.setAttribute("fill-opacity", opacity);
  });
}


// Highlights the specified team's path.
function handleMouseOver(teamName)
{
  data.teams.forEach(function(team)
  {
    var opacity = teamName === team.safeTeamName ? highlightOpacity : lowlightOpacity;
    
    changeTeamOpacity(team.safeTeamName, opacity);
  });
}

// Lowlights the specified team's path.
function handleMouseOut(teamName)
{
  data.teams.forEach(function(team)
  {
    changeTeamOpacity(team.safeTeamName, normalOpacity);
  });
}

function showDefaultData() {
  setDropDownDates(data.rankings[data.rankings.length - 11], data.rankings[data.rankings.length - 1]);
}

function showAllData() {
  setDropDownDates(data.rankings[0], data.rankings[data.rankings.length - 1]);
}

showDefaultData();

document.querySelector(".flyout .toggle").addEventListener("click", function() {
  document.querySelector(".flyout .body").classList.toggle("hidden")
});
