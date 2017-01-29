import {Canvas} from "./canvas";
import {Form} from "./form";

// Require typings conflict with node ones. Use a dirty one out of laziness.
declare function require(path: string): Rankings;
// tslint:disable-next-line
let data = require("../loader/output.json");

const graph = new Canvas(document.getElementById("graph"));

// Parse dates.
data.rankings.forEach((ranking) => {
  ranking.date = new Date(ranking.date);
});

// Ensure the rankings are sorted.
data.rankings = data.rankings.sort((a, b) => {
  return (a.date as Date).getTime() - (b.date as Date).getTime();
});

const paddingTop = 100;
const paddingLeft = 50;
const paddingRight = 50;
const paddingBottom = 0;

const months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

function displayGraph(firstRanking: Ranking, lastRanking: Ranking, topNRanks: number) {
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
  const graphHeight = (spacingPerRank * numberOfRanks) + paddingTop + paddingBottom;
  graph.setDimensions(graphWidth, graphHeight);

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
    const rank = team.ranks[rankingIndex];

    return rank && rank > topNRanks ? null : rank;
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

      const labelClass = "curve curve-" + team.safeTeamName;
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
  const gradientHeight = 50;
  const gradientTop = graphHeight - gradientHeight;
  const gradientBottom = graphHeight;

  graph.createLinearGradient("bottom", 0, 0, 0, 1, "black", 0, "black", 1);

  // Create the rectangle with the gradient applied.
  graph.addRect(0, gradientTop, graphWidth, gradientHeight, "url(#bottom)");
}

const form = new Form(data, displayGraph);
