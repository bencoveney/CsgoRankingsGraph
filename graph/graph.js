const graph = document.getElementById("graph");
const svgNs = "http://www.w3.org/2000/svg";
let highestNumberOfRanks = 0;
data.rankings.forEach((ranking) => {
    highestNumberOfRanks = Math.max(highestNumberOfRanks, ranking.ranks.length);
    ranking.date = new Date(ranking.date);
});
data.rankings = data.rankings.sort((a, b) => {
    return a.date.getTime() - b.date.getTime();
});
const dateFromElement = document.querySelector("#dateFrom");
const dateToElement = document.querySelector("#dateTo");
function getDropDownDate(date) {
    return date.toDateString().substring(4);
}
function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
function setDropDownDates(first, last) {
    function addDateToSelector(date, selector, isSelected, isEnabled) {
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
        addDateToSelector(ranking.date, dateFromElement, ranking === first, ranking.date < last.date);
        addDateToSelector(ranking.date, dateToElement, ranking === last, ranking.date > first.date);
    });
    displayGraph(first, last, 30);
}
function refreshDateRanges() {
    function findRanking(dateString) {
        return data.rankings.find((ranking) => {
            return getDropDownDate(ranking.date) === dateString;
        });
    }
    setDropDownDates(findRanking(dateFromElement.value), findRanking(dateToElement.value));
}
function dropDownRanks(selected) {
    const ranksElement = document.querySelector("#topNRanks");
    function addRank(rankNumber) {
        const option = document.createElement("option");
        const rankString = rankNumber.toString();
        option.text = rankString;
        option.value = rankString;
        option.selected = selected === rankNumber;
        ranksElement.add(option);
    }
    for (let i = 1; i <= highestNumberOfRanks; i++) {
        addRank(i);
    }
}
dropDownRanks(10);
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
const normalOpacity = 0.2;
const highlightOpacity = 1;
const lowlightOpacity = 0.1;
const paddingTop = 100;
const paddingLeft = 50;
const paddingRight = 50;
const paddingBottom = 50;
const months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
function displayGraph(firstRanking, lastRanking, topNRanks) {
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
    const numberOfRankings = activeRankings.length;
    const spacingPerRanking = 160;
    const numberOfRanks = activeRankings[numberOfRankings - 1].ranks.length;
    const spacingPerRank = 60;
    const graphWidth = spacingPerRanking * numberOfRankings;
    const graphHeight = spacingPerRank * numberOfRanks;
    graph.setAttribute("width", graphWidth.toString());
    graph.setAttribute("height", graphHeight.toString());
    const remainingHeight = graphHeight - paddingTop - paddingBottom;
    const remainingWidth = graphWidth - paddingLeft - paddingRight;
    activeRankings.forEach((ranking) => {
        ranking.ranks.forEach((rank, rankIndex) => {
            rank.players.forEach((player) => {
                let newPlayer;
                if (data.players[player.player]) {
                    newPlayer = data.players[player.player];
                }
                else {
                    newPlayer = {
                        teams: [],
                    };
                    activeRankings.forEach(() => {
                        newPlayer.teams.push(null);
                    });
                    data.players[player.player] = newPlayer;
                }
                newPlayer.teams[rankIndex] = rank.team;
            });
        });
    });
    data.teams.forEach((team) => {
        team.ranks = [];
        activeRankings.forEach((ranking) => {
            const foundRank = ranking.ranks.find((rank) => {
                return rank.team === team.name;
            });
            team.ranks.push(foundRank ? foundRank.position : null);
        });
    });
    activeRankings.forEach((ranking, rankingIndex) => {
        const xPosition = (rankingIndex * spacingPerRanking) + paddingLeft;
        drawLine(xPosition, 0, xPosition, graphHeight, "#333333", 1, "5, 5");
        const rankingDate = ranking.date;
        const dayAndMonth = rankingDate.getDate() + " " + months[rankingDate.getMonth()];
        const year = rankingDate.getFullYear().toString();
        drawText(dayAndMonth, xPosition, 20, "white", 12, "", 1);
        drawText(year, xPosition, 40, "white", 12, "", 1);
    });
    activeRankings[0].ranks.forEach((ranking, rankingIndex) => {
        const yPosition = (rankingIndex * spacingPerRank) + paddingTop;
        drawLine(0, yPosition, graphWidth, yPosition, "#333333", 1, "5, 5");
    });
    const curveSoftness = spacingPerRanking * 0.75;
    const curveWidth = 10;
    const curveFade = spacingPerRanking * 0.25;
    function getRank(team, rankingIndex) {
        rankingIndex = Math.min(Math.max(rankingIndex, 0), numberOfRankings - 1);
        return team.ranks[rankingIndex];
    }
    function getXPosition(rankIndex) {
        return (rankIndex * spacingPerRanking) + paddingLeft;
    }
    function getYPosition(rank) {
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
        const yPositionBefore = getYPosition(rankBefore);
        const yPositionAfter = getYPosition(rankAfter);
        const xPositionBefore = getXPosition(rankingIndexBefore);
        const xPositionAfter = getXPosition(rankingIndexAfter);
        createLabel(team, rankingIndexAfter, rankAfter);
        if (rankingIndexAfter < numberOfRankings && rankAfter <= numberOfRanks) {
            const labelClass = "team-" + team.safeTeamName;
            const labelText = team.name + " (" + rankAfter + ")";
            const labelColor = team.textColor || team.color;
            drawText(labelText, xPositionAfter, yPositionAfter - 20, labelColor, "12", labelClass, normalOpacity);
        }
        let pathDefinition = "M" + xPositionBefore + " ";
        pathDefinition += yPositionBefore + " ";
        pathDefinition += " C ";
        pathDefinition += (xPositionBefore + curveSoftness) + " ";
        pathDefinition += yPositionBefore + ", ";
        pathDefinition += (xPositionAfter - curveSoftness) + " ";
        pathDefinition += yPositionAfter + ", ";
        pathDefinition += xPositionAfter + " ";
        pathDefinition += yPositionAfter;
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
        const gradient = document.createElementNS(svgNs, "linearGradient");
        gradient.setAttribute("id", id);
        gradient.setAttribute("x1", x1);
        gradient.setAttribute("y1", y1);
        gradient.setAttribute("x2", x2);
        gradient.setAttribute("y2", y2);
        definitions.appendChild(gradient);
        const topStop = document.createElementNS(svgNs, "stop");
        topStop.setAttribute("offset", "0%");
        topStop.setAttribute("stop-color", startColor);
        topStop.setAttribute("stop-opacity", startOpacity);
        gradient.appendChild(topStop);
        const bottomStop = document.createElementNS(svgNs, "stop");
        bottomStop.setAttribute("offset", "100%");
        bottomStop.setAttribute("stop-color", stopColor);
        bottomStop.setAttribute("stop-opacity", stopOpacity);
        gradient.appendChild(bottomStop);
    }
    function createFadeOut(rankingIndexBefore, rankBefore, team) {
        const yPosition = getYPosition(rankBefore) - (curveWidth / 2);
        const height = curveWidth;
        const xPosition = getXPosition(rankingIndexBefore);
        const width = curveFade;
        const gradientName = team.safeTeamName + "_before_" + rankingIndexBefore;
        createLinearGradient(gradientName, 0, 0, 1, 0, team.color, 1, team.color, 0);
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
        const xPosition = getXPosition(rankingIndexAfter) - curveFade;
        const width = curveFade;
        const gradientName = team.safeTeamName + "_after_" + rankingIndexAfter;
        createLinearGradient(gradientName, 1, 0, 0, 0, team.color, 1, team.color, 0);
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
    data.teams.forEach((team) => {
        for (let j = 0; j < (numberOfRankings + 1); j++) {
            const rankingIndexBefore = j - 1;
            const rankingIndexAfter = j;
            const rankBefore = getRank(team, rankingIndexBefore);
            const rankAfter = getRank(team, rankingIndexAfter);
            if (rankBefore !== null) {
                if (rankAfter !== null) {
                    createCurve(rankingIndexBefore, rankingIndexAfter, rankBefore, rankAfter, team);
                }
                else {
                    createFadeOut(rankingIndexBefore, rankBefore, team);
                }
            }
            else if (rankAfter !== null) {
                createFadeIn(rankingIndexAfter, rankAfter, team);
            }
        }
    });
    const gradientHeight = paddingBottom;
    const gradientTop = graphHeight - gradientHeight;
    const gradientBottom = graphHeight;
    createLinearGradient("bottom", 0, 0, 0, 1, "black", 0, "black", 1);
    const gradientArea = document.createElementNS(svgNs, "rect");
    gradientArea.setAttribute("x", (0).toString());
    gradientArea.setAttribute("y", gradientTop.toString());
    gradientArea.setAttribute("width", graphWidth.toString());
    gradientArea.setAttribute("height", gradientHeight.toString());
    gradientArea.setAttribute("fill", "url(#bottom)");
    graph.appendChild(gradientArea);
}
function changeTeamOpacity(teamName, opacity) {
    const teamSeries = document.querySelectorAll(".team-" + teamName);
    [].forEach.call(teamSeries, (path) => {
        path.setAttribute("stroke-opacity", opacity);
        path.setAttribute("fill-opacity", opacity);
    });
}
function handleMouseOver(teamName) {
    data.teams.forEach((team) => {
        const opacity = teamName === team.safeTeamName ? highlightOpacity : lowlightOpacity;
        changeTeamOpacity(team.safeTeamName, opacity);
    });
}
function handleMouseOut(teamName) {
    data.teams.forEach((team) => {
        changeTeamOpacity(team.safeTeamName, normalOpacity);
    });
}
function handleClick(teamName) {
    console.log(teamName);
    const teamSeries = document.querySelectorAll(".team-" + teamName);
    [].forEach.call(teamSeries, (path) => {
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
