declare var data: DataFormat;

// Get the graph renderer.
const graph = document.getElementById("graph");
const svgNs = "http://www.w3.org/2000/svg";

// Parse dates and find the highest number of ranks.
let highestNumberOfRanks = 0;
data.rankings.forEach((ranking) => {
  highestNumberOfRanks = Math.max(highestNumberOfRanks, ranking.ranks.length);
  ranking.date = new Date(ranking.date);
});

// Ensure the rankings are sorted.
data.rankings = data.rankings.sort((a, b) => {
  return (a.date as Date).getTime() - (b.date as Date).getTime();
});

// Grab the drop-downs from the DOM.
const dateFromElement = document.querySelector("#dateFrom") as HTMLSelectElement;
const dateToElement = document.querySelector("#dateTo") as HTMLSelectElement;
const topNRanksElement = document.querySelector("#topNRanks") as HTMLSelectElement;

// Function to format dates in the format for drop-downs.
function getDropDownDate(date: Date): string {
  return date.toDateString().substring(4);
}

// Function to clear an element.
function emptyElement(element: Element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

let topNRanks = 30;

// Function to update the dates dropdown list and re-display the graph.
function setDropDownDates(first, last) {
  function addDateToSelector(date: Date, selector: HTMLSelectElement, isSelected: boolean, isEnabled: boolean) {
    const option = document.createElement("option");
    const dateString = getDropDownDate(date);
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
  });

  displayGraph(first, last);
}

// Function to assess dropdowns and reload the graph.
function refreshGraph() {
  function findRanking(dateString: string) {
    return data.rankings.find((ranking) => {
      return getDropDownDate(ranking.date as Date) === dateString;
    });
  }

  dropDownRanks(parseInt(topNRanksElement.value, 10));

  setDropDownDates(findRanking(dateFromElement.value), findRanking(dateToElement.value));
}

// Function to update the top n ranks dropdown.
function dropDownRanks(selected) {
  topNRanks = selected;

  function addRank(rankNumber) {
    const option = document.createElement("option");
    const rankString = rankNumber.toString();
    option.text = rankString;
    option.value = rankString;
    option.selected = selected === rankNumber;
    topNRanksElement.add(option);
  }

  emptyElement(topNRanksElement);

  for (let i = 1; i <= highestNumberOfRanks; i++) {
    addRank(i);
  }
}

dropDownRanks(10);

// Creates a line on the graph.
function drawLine(x1, y1, x2, y2, color, width, dashes) {
  const line = document.createElementNS(svgNs, "line");

  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", width);
  line.setAttribute("stroke-dasharray", dashes);

  graph.appendChild(line);
}

function drawText(value, x, y, color, fontSize, className, opacity) {
  const text = document.createElementNS(svgNs, "text");

  text.innerHTML = value;

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
const normalOpacity = 0.2;
const highlightOpacity = 1;
const lowlightOpacity = 0.1;

const paddingTop = 100;
const paddingLeft = 50;
const paddingRight = 50;
const paddingBottom = 50;

const months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

function displayGraph(firstRanking, lastRanking) {
  emptyElement(graph);

  let selecting = false;
  const activeRankings = data.rankings.filter((ranking) => {
    if (ranking === firstRanking) {
      selecting = true;
    }
    const result = selecting;
    if (ranking === lastRanking) {
      selecting = false;
    }
    return result;
  });

  // Distribute the vertical space between the number of rankings.
  const numberOfRankings = activeRankings.length;
  const spacingPerRanking = 160;

  // Distribute the horizontal space between the number of ranks.
  const numberOfRanks = topNRanks;
  const spacingPerRank = 60;

  // Set the dimensions
  const graphWidth = spacingPerRanking * numberOfRankings;
  const graphHeight = spacingPerRank * numberOfRanks;
  graph.setAttribute("width", graphWidth.toString());
  graph.setAttribute("height", graphHeight.toString());

  // Apply some padding to the graph area so that the points are not pressed up against the side.
  const remainingHeight = graphHeight - paddingTop - paddingBottom;
  const remainingWidth = graphWidth - paddingLeft - paddingRight;

  // Populate a collection containing all the players.
  // Not currently used.
  activeRankings.forEach((ranking) => {
    ranking.ranks.forEach((rank, rankIndex) => {
      rank.players.forEach((player) => {
        // Attempt to find the existing player.
        let newPlayer;
        if (data.players[player.player]) {
          newPlayer = data.players[player.player];
        } else {
          // Populate a fresh player with empty rankings.
          newPlayer = {
            teams: [],
          };

          activeRankings.forEach(() => {
            newPlayer.teams.push(null);
          });

          data.players[player.player] = newPlayer;
        }

        // Put the team into the player's history.
        newPlayer.teams[rankIndex] = rank.team;
      });
    });
  });

  // Denormalize the rank of each team for every ranking.
  data.teams.forEach((team) => {
    // Get their rankings.
    team.ranks = [];
    activeRankings.forEach((ranking) => {
      // Add the team's rank, otherwise null.
      const foundRank = ranking.ranks.find((rank) => {
        return rank.team === team.name;
      });

      team.ranks.push(foundRank ? foundRank.position : null);
    });
  });

  // Draw horizontal gridlines.
  activeRankings.forEach((ranking, rankingIndex) => {
    const xPosition = (rankingIndex * spacingPerRanking) + paddingLeft;

    drawLine(xPosition, 0, xPosition, graphHeight, "#333333", 1, "5, 5");

    const rankingDate = ranking.date as Date;
    const dayAndMonth = rankingDate.getDate() + " " + months[rankingDate.getMonth()];
    const year = rankingDate.getFullYear().toString();

    drawText(dayAndMonth, xPosition, 20, "white", 12, "", 1);
    drawText(year, xPosition, 40, "white", 12, "", 1);
  });

  // Draw vertical gridlines.
  activeRankings[0].ranks.forEach((ranking, rankingIndex) => {
    const yPosition = (rankingIndex * spacingPerRank) + paddingTop;

    drawLine(0, yPosition, graphWidth, yPosition, "#333333", 1, "5, 5");
  });

  // Calculate how to place the curve anchor points.
  const curveSoftness = spacingPerRanking * 0.75;
  const curveWidth = 10;
  const curveFade = spacingPerRanking * 0.25;

  // Gets the rank for a team in the given set of rankings.
  function getRank(team, rankingIndex) {
    // We might be pointing to a ranking which doesn't exist.
    // Duplicate the ranking to keep a flat line at the graph's edges.
    rankingIndex = Math.min(Math.max(rankingIndex, 0), numberOfRankings - 1);

    // Find the rank at the given rankings.
    return team.ranks[rankingIndex];
  }

  // Calculate the line's x position at the given ranking.
  function getXPosition(rankIndex) {
    return (rankIndex * spacingPerRanking) + paddingLeft;
  }

  // Calculate the line's y position at the given ranking.
  function getYPosition(rank) {
    // Decrement the rankings so that it is 0-based rather than 1-based.
    rank = rank - 1;

    return (rank * spacingPerRank) + paddingTop;
  }

  function createLabel(team, rankingIndex, rank) {
    if (rankingIndex < numberOfRankings && rank <= numberOfRanks) {
      const yPosition = getYPosition(rank);
      const xPosition = getXPosition(rankingIndex);

      const labelClass = "team-" + team.safeTeamName;
      const labelText = team.name + " (" + rank + ")";
      const labelColor = team.textColor || team.color;

      drawText(labelText, xPosition, yPosition - 20, labelColor, "12", labelClass, normalOpacity);
    }
  }

  function createCurve(rankingIndexBefore, rankingIndexAfter, rankBefore, rankAfter, team) {
    // Calculate the y position before and after the transition.
    const yPositionBefore = getYPosition(rankBefore);
    const yPositionAfter = getYPosition(rankAfter);

    // Calculate the y position before and after the transition.
    const xPositionBefore = getXPosition(rankingIndexBefore);
    const xPositionAfter = getXPosition(rankingIndexAfter);

    createLabel(team, rankingIndexAfter, rankAfter);

    // Add the curve.
    // TODO: Create long lines for big flat gaps.
    let pathDefinition = "M" + xPositionBefore + " ";
    pathDefinition += yPositionBefore + " ";
    pathDefinition += " C ";
    pathDefinition += (xPositionBefore + curveSoftness) + " ";
    pathDefinition += yPositionBefore + ", ";
    pathDefinition += (xPositionAfter - curveSoftness) + " ";
    pathDefinition += yPositionAfter + ", ";
    pathDefinition += xPositionAfter + " ";
    pathDefinition += yPositionAfter;

    // Create the curve element.
    const line = document.createElementNS(svgNs, "path");
    line.setAttribute("d", pathDefinition);
    line.setAttribute("stroke", team.color);
    line.setAttribute("fill", "transparent");
    line.setAttribute("stroke-width", curveWidth.toString());
    line.setAttribute("stroke-opacity", normalOpacity.toString());
    line.setAttribute("class", "team-" + team.safeTeamName);
    line.setAttribute("onmouseover", "handleMouseOver(\"" + team.safeTeamName + "\");");
    line.setAttribute("onmouseout", "handleMouseOut(\"" + team.safeTeamName + "\");");
    line.setAttribute("onclick", "handleClick(\"" + team.safeTeamName + "\");");
    graph.appendChild(line);
  }

  // Add a definitions section to the graph for gradient declarations.
  const definitions = document.createElementNS(svgNs, "defs");
  graph.appendChild(definitions);

  const styles = document.createElementNS(svgNs, "style");
  styles.setAttribute("type", "text/css");
  styles.innerHTML = `
<![CDATA[
  .clicked {
    stroke-opacity: 1;
    fill-opacity: 1;
  }
]]>`;
  definitions.appendChild(styles);

  function createLinearGradient(id, x1, y1, x2, y2, startColor, startOpacity, stopColor, stopOpacity) {
    // Add a new gradient to the definitions.
    const gradient = document.createElementNS(svgNs, "linearGradient");
    gradient.setAttribute("id", id);
    gradient.setAttribute("x1", x1);
    gradient.setAttribute("y1", y1);
    gradient.setAttribute("x2", x2);
    gradient.setAttribute("y2", y2);
    definitions.appendChild(gradient);

    // Create the transparent gradient stop.
    const topStop = document.createElementNS(svgNs, "stop");
    topStop.setAttribute("offset", "0%");
    topStop.setAttribute("stop-color", startColor);
    topStop.setAttribute("stop-opacity", startOpacity);
    gradient.appendChild(topStop);

    // Create the solid gradient stop.
    const bottomStop = document.createElementNS(svgNs, "stop");
    bottomStop.setAttribute("offset", "100%");
    bottomStop.setAttribute("stop-color", stopColor);
    bottomStop.setAttribute("stop-opacity", stopOpacity);
    gradient.appendChild(bottomStop);
  }

  function createFadeOut(rankingIndexBefore, rankBefore, team) {
    const yPosition = getYPosition(rankBefore) - (curveWidth / 2);
    const height = curveWidth;

    // Calculate the y position before and after the transition.
    const xPosition = getXPosition(rankingIndexBefore);
    const width = curveFade;

    const gradientName = team.safeTeamName + "_before_" + rankingIndexBefore;
    createLinearGradient(gradientName, 0, 0, 1, 0, team.color, 1, team.color, 0);

    // Create the rectangle with the gradient applied.
    // TODO: Create rect function.
    const rect = document.createElementNS(svgNs, "rect");

    rect.setAttribute("x", xPosition.toString());
    rect.setAttribute("y", yPosition.toString());
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill-opacity", normalOpacity.toString());
    rect.setAttribute("class", "team-" + team.safeTeamName);
    rect.setAttribute("fill", "url(#" + gradientName + ")");
    rect.setAttribute("onmouseover", "handleMouseOver(\"" + team.safeTeamName + "\");");
    rect.setAttribute("onmouseout", "handleMouseOut(\"" + team.safeTeamName + "\");");
    rect.setAttribute("onclick", "handleClick(\"" + team.safeTeamName + "\");");

    graph.appendChild(rect);
  }

  function createFadeIn(rankingIndexAfter, rankAfter, team) {
    createLabel(team, rankingIndexAfter, rankAfter);

    const yPosition = getYPosition(rankAfter) - (curveWidth / 2);
    const height = curveWidth;

    // Calculate the y position before and after the transition.
    const xPosition = getXPosition(rankingIndexAfter) - curveFade;
    const width = curveFade;

    const gradientName = team.safeTeamName + "_after_" + rankingIndexAfter;
    createLinearGradient(gradientName, 1, 0, 0, 0, team.color, 1, team.color, 0);

    // Create the rectangle with the gradient applied.
    // TODO: Create rect function.
    const rect = document.createElementNS(svgNs, "rect");

    rect.setAttribute("x", xPosition.toString());
    rect.setAttribute("y", yPosition.toString());
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill-opacity", normalOpacity.toString());
    rect.setAttribute("class", "team-" + team.safeTeamName);
    rect.setAttribute("fill", "url(#" + gradientName + ")");
    rect.setAttribute("onmouseover", "handleMouseOver(\"" + team.safeTeamName + "\");");
    rect.setAttribute("onmouseout", "handleMouseOut(\"" + team.safeTeamName + "\");");
    rect.setAttribute("onclick", "handleClick(\"" + team.safeTeamName + "\");");

    graph.appendChild(rect);
  }

  // Draw team series.
  data.teams.forEach((team) => {
    // Iterate through the gaps on either side of the rankings.
    for (let j = 0; j < (numberOfRankings + 1); j++) {
      // Find the index before and after the gap.
      const rankingIndexBefore = j - 1;
      const rankingIndexAfter = j;

      const rankBefore = getRank(team, rankingIndexBefore);
      const rankAfter = getRank(team, rankingIndexAfter);

      if (rankBefore !== null) {
        if (rankAfter !== null) {
          createCurve(rankingIndexBefore, rankingIndexAfter, rankBefore, rankAfter, team);
        } else {
          createFadeOut(rankingIndexBefore, rankBefore, team);
        }
      } else if (rankAfter !== null) {
        createFadeIn(rankingIndexAfter, rankAfter, team);
      }
    }
  });

  // Prepare a gradient for the bottom of the graph to fade to black.
  const gradientHeight = paddingBottom;
  const gradientTop = graphHeight - gradientHeight;
  const gradientBottom = graphHeight;

  createLinearGradient("bottom", 0, 0, 0, 1, "black", 0, "black", 1);

  // Create the rectangle with the gradient applied.
  const gradientArea = document.createElementNS(svgNs, "rect");
  gradientArea.setAttribute("x", (0).toString());
  gradientArea.setAttribute("y", gradientTop.toString());
  gradientArea.setAttribute("width", graphWidth.toString());
  gradientArea.setAttribute("height", gradientHeight.toString());
  gradientArea.setAttribute("fill", "url(#bottom)");
  graph.appendChild(gradientArea);
}

// Changes the opacity for all paths matching the team name.
function changeTeamOpacity(teamName, opacity) {
  const teamSeries = document.querySelectorAll(".team-" + teamName);
  [].forEach.call(teamSeries, (path) => {
    path.setAttribute("stroke-opacity", opacity);
    path.setAttribute("fill-opacity", opacity);
  });
}

// Highlights the specified team's path.
function handleMouseOver(teamName) {
  data.teams.forEach((team) => {
    const opacity = teamName === team.safeTeamName ? highlightOpacity : lowlightOpacity;

    changeTeamOpacity(team.safeTeamName, opacity);
  });
}

// Lowlights the specified team's path.
function handleMouseOut(teamName) {
  data.teams.forEach((team) => {
    changeTeamOpacity(team.safeTeamName, normalOpacity);
  });
}

function handleClick(teamName) {
  console.log(teamName);
  const teamSeries = document.querySelectorAll(".team-" + teamName);
  [].forEach.call(teamSeries, (path: Element) => {
    path.classList.toggle("clicked");
  });
}

function showDefaultData() {
  setDropDownDates(data.rankings[data.rankings.length - 11], data.rankings[data.rankings.length - 1]);
}

function showAllData() {
  setDropDownDates(data.rankings[0], data.rankings[data.rankings.length - 1]);
}

showDefaultData();

document.querySelector(".flyout .toggle").addEventListener("click", () => {
  document.querySelector(".flyout .body").classList.toggle("hidden");
});
