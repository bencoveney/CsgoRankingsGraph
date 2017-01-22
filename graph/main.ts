import {Canvas} from "./canvas";
import * as Utilities from "./utilities";

declare var data: DataFormat;

const graph = new Canvas(document.getElementById("graph"));

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

  Utilities.emptyElement(dateFromElement);
  Utilities.emptyElement(dateToElement);

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

  Utilities.emptyElement(topNRanksElement);

  for (let i = 1; i <= highestNumberOfRanks; i++) {
    addRank(i);
  }
}

dropDownRanks(10);

const paddingTop = 100;
const paddingLeft = 50;
const paddingRight = 50;
const paddingBottom = 50;

const months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

function displayGraph(firstRanking, lastRanking) {
  graph.clear();

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
  graph.setDimensions(graphWidth, graphHeight);

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

    graph.addLine(xPosition, 0, xPosition, graphHeight, "#333333", 1, "5, 5");

    const rankingDate = ranking.date as Date;
    const dayAndMonth = rankingDate.getDate() + " " + months[rankingDate.getMonth()];
    const year = rankingDate.getFullYear().toString();

    graph.addText(dayAndMonth, xPosition, 20, "white", 12, "", 1);
    graph.addText(year, xPosition, 40, "white", 12, "", 1);
  });

  // Draw vertical gridlines.
  activeRankings[0].ranks.forEach((ranking, rankingIndex) => {
    const yPosition = (rankingIndex * spacingPerRank) + paddingTop;

    graph.addLine(0, yPosition, graphWidth, yPosition, "#333333", 1, "5, 5");
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

      graph.addText(labelText, xPosition, yPosition - 20, labelColor, 12, labelClass, Canvas.normalOpacity);
    }
  }

  function createCurve(rankingIndexBefore, rankingIndexAfter, rankBefore, rankAfter, team) {
    createLabel(team, rankingIndexAfter, rankAfter);

    graph.addCurve(
      getXPosition(rankingIndexBefore),
      getYPosition(rankBefore),
      getXPosition(rankingIndexAfter),
      getYPosition(rankAfter),
      team.color,
      curveWidth,
      team.safeTeamName,
      curveSoftness,
    );
  }

  function createFadeOut(rankingIndexBefore, rankBefore, team) {
    const yPosition = getYPosition(rankBefore) - (curveWidth / 2);
    const height = curveWidth;

    // Calculate the y position before and after the transition.
    const xPosition = getXPosition(rankingIndexBefore);
    const width = curveFade;

    const gradientName = team.safeTeamName + "_before_" + rankingIndexBefore;
    graph.createLinearGradient(gradientName, 0, 0, 1, 0, team.color, 1, team.color, 0);

    // Create the rectangle with the gradient applied.
    graph.addCurveRect(
      xPosition,
      yPosition,
      width,
      height,
      `url(#${gradientName})`,
      Canvas.normalOpacity,
      team.safeTeamName,
    );
  }

  function createFadeIn(rankingIndexAfter, rankAfter, team) {
    createLabel(team, rankingIndexAfter, rankAfter);

    const yPosition = getYPosition(rankAfter) - (curveWidth / 2);
    const height = curveWidth;

    // Calculate the y position before and after the transition.
    const xPosition = getXPosition(rankingIndexAfter) - curveFade;
    const width = curveFade;

    const gradientName = team.safeTeamName + "_after_" + rankingIndexAfter;
    graph.createLinearGradient(gradientName, 1, 0, 0, 0, team.color, 1, team.color, 0);

    // Create the rectangle with the gradient applied.
    graph.addCurveRect(
      xPosition,
      yPosition,
      width,
      height,
      `url(#${gradientName})`,
      Canvas.normalOpacity,
      team.safeTeamName,
    );
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

  graph.createLinearGradient("bottom", 0, 0, 0, 1, "black", 0, "black", 1);

  // Create the rectangle with the gradient applied.
  graph.addRect(0, gradientTop, graphWidth, gradientHeight, "url(#bottom)");
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
    const opacity = teamName === team.safeTeamName ? Canvas.highlightOpacity : Canvas.lowlightOpacity;

    changeTeamOpacity(team.safeTeamName, opacity);
  });
}
(window as any).handleMouseOver = handleMouseOver;

// Lowlights the specified team's path.
function handleMouseOut(teamName) {
  data.teams.forEach((team) => {
    changeTeamOpacity(team.safeTeamName, Canvas.normalOpacity);
  });
}
(window as any).handleMouseOut = handleMouseOut;

function handleClick(teamName) {
  console.log(teamName);
  const teamSeries = document.querySelectorAll(".team-" + teamName);
  [].forEach.call(teamSeries, (path: Element) => {
    path.classList.toggle("clicked");
  });
}
(window as any).handleClick = handleClick;

function showDefaultData() {
  setDropDownDates(data.rankings[data.rankings.length - 11], data.rankings[data.rankings.length - 1]);
}
(window as any).showDefaultData = showDefaultData;

function showAllData() {
  setDropDownDates(data.rankings[0], data.rankings[data.rankings.length - 1]);
}
(window as any).showAllData = showAllData;

showDefaultData();

document.querySelector(".flyout .toggle").addEventListener("click", () => {
  document.querySelector(".flyout .body").classList.toggle("hidden");
});
