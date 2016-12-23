var graph = document.getElementById("graph");
var svgNs = "http://www.w3.org/2000/svg";
var highestNumberOfRanks = 0;
data.rankings.forEach(function (ranking) {
    highestNumberOfRanks = Math.max(highestNumberOfRanks, ranking.ranks.length);
    ranking.date = new Date(ranking.date);
});
data.rankings = data.rankings.sort(function (a, b) {
    return a.date.getTime() - b.date.getTime();
});
var dateFromElement = document.querySelector("#dateFrom");
var dateToElement = document.querySelector("#dateTo");
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
        addDateToSelector(ranking.date, dateFromElement, ranking === first, ranking.date < last.date);
        addDateToSelector(ranking.date, dateToElement, ranking === last, ranking.date > first.date);
    });
    displayGraph(first, last, 30);
}
function refreshDateRanges() {
    function findRanking(dateString) {
        return data.rankings.find(function (ranking) {
            return getDropDownDate(ranking.date) === dateString;
        });
    }
    setDropDownDates(findRanking(dateFromElement.value), findRanking(dateToElement.value));
}
function dropDownRanks(selected) {
    var ranksElement = document.querySelector("#topNRanks");
    function addRank(rankNumber) {
        var option = document.createElement("option");
        var rankString = rankNumber.toString();
        option.text = rankString;
        option.value = rankString;
        option.selected = selected === rankNumber;
        ranksElement.add(option);
    }
    for (var i = 1; i <= highestNumberOfRanks; i++) {
        addRank(i);
    }
}
dropDownRanks(10);
function drawLine(x1, y1, x2, y2, color, width, dashes) {
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
function drawText(string, x, y, color, fontSize, className, opacity) {
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
var normalOpacity = 0.2;
var highlightOpacity = 1;
var lowlightOpacity = 0.1;
var paddingTop = 100;
var paddingLeft = 50;
var paddingRight = 50;
var paddingBottom = 50;
var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
function displayGraph(firstRanking, lastRanking, topNRanks) {
    emptyElement(graph);
    var selecting = false;
    var activeRankings = data.rankings.filter(function (ranking) {
        if (ranking === firstRanking) {
            selecting = true;
        }
        var result = selecting;
        if (ranking === lastRanking) {
            selecting = false;
        }
        return result;
    });
    var numberOfRankings = activeRankings.length;
    var spacingPerRanking = 160;
    var numberOfRanks = activeRankings[numberOfRankings - 1].ranks.length;
    var spacingPerRank = 60;
    var width = spacingPerRanking * numberOfRankings;
    var height = spacingPerRank * numberOfRanks;
    graph.setAttribute('width', width.toString());
    graph.setAttribute('height', height.toString());
    var remainingHeight = height - paddingTop - paddingBottom;
    var remainingWidth = width - paddingLeft - paddingRight;
    activeRankings.forEach(function (ranking) {
        ranking.ranks.forEach(function (rank, rankIndex) {
            rank.players.forEach(function (player) {
                var newPlayer;
                if (data.players[player.player]) {
                    newPlayer = data.players[player.player];
                }
                else {
                    newPlayer = {
                        teams: []
                    };
                    activeRankings.forEach(function () {
                        newPlayer.teams.push(null);
                    });
                    data.players[player.player] = newPlayer;
                }
                newPlayer.teams[rankIndex] = rank.team;
            });
        });
    });
    data.teams.forEach(function (team) {
        team.ranks = [];
        activeRankings.forEach(function (ranking) {
            var foundRank = ranking.ranks.find(function (rank) {
                return rank.team == team.name;
            });
            team.ranks.push(foundRank ? foundRank.position : null);
        });
    });
    activeRankings.forEach(function (ranking, rankingIndex) {
        var xPosition = (rankingIndex * spacingPerRanking) + paddingLeft;
        drawLine(xPosition, 0, xPosition, height, "#333333", 1, "5, 5");
        var rankingDate = ranking.date;
        var dayAndMonth = rankingDate.getDate() + " " + months[rankingDate.getMonth()];
        var year = rankingDate.getFullYear().toString();
        drawText(dayAndMonth, xPosition, 20, "white", 12, "", 1);
        drawText(year, xPosition, 40, "white", 12, "", 1);
    });
    activeRankings[0].ranks.forEach(function (ranking, rankingIndex) {
        var yPosition = (rankingIndex * spacingPerRank) + paddingTop;
        drawLine(0, yPosition, width, yPosition, "#333333", 1, "5, 5");
    });
    var curveSoftness = spacingPerRanking * 0.75;
    var curveWidth = 10;
    var curveFade = spacingPerRanking * 0.25;
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
            var yPosition = getYPosition(rank);
            var xPosition = getXPosition(rankingIndex);
            var labelClass = "team-" + team.safeTeamName;
            var labelText = team.name + " (" + rank + ")";
            var labelColor = team.textColor || team.color;
            drawText(labelText, xPosition, yPosition - 20, labelColor, "12", labelClass, normalOpacity);
        }
    }
    function createCurve(rankingIndexBefore, rankingIndexAfter, rankBefore, rankAfter, team) {
        var yPositionBefore = getYPosition(rankBefore);
        var yPositionAfter = getYPosition(rankAfter);
        var xPositionBefore = getXPosition(rankingIndexBefore);
        var xPositionAfter = getXPosition(rankingIndexAfter);
        createLabel(team, rankingIndexAfter, rankAfter);
        if (rankingIndexAfter < numberOfRankings && rankAfter <= numberOfRanks) {
            var labelClass = "team-" + team.safeTeamName;
            var labelText = team.name + " (" + rankAfter + ")";
            var labelColor = team.textColor || team.color;
            drawText(labelText, xPositionAfter, yPositionAfter - 20, labelColor, "12", labelClass, normalOpacity);
        }
        var pathDefinition = "M" + xPositionBefore + " ";
        pathDefinition += yPositionBefore + " ";
        pathDefinition += " C ";
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
        line.setAttribute("stroke-width", curveWidth.toString());
        line.setAttribute("stroke-opacity", normalOpacity.toString());
        line.setAttribute("class", "team-" + team.safeTeamName);
        line.setAttribute("onmouseover", "handleMouseOver(\"" + team.safeTeamName + "\");");
        line.setAttribute("onmouseout", "handleMouseOut(\"" + team.safeTeamName + "\");");
        line.setAttribute("onclick", "handleClick(\"" + team.safeTeamName + "\");");
        graph.appendChild(line);
    }
    var definitions = document.createElementNS(svgNs, "defs");
    graph.appendChild(definitions);
    var styles = document.createElementNS(svgNs, "style");
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
        var gradient = document.createElementNS(svgNs, "linearGradient");
        gradient.setAttribute("id", id);
        gradient.setAttribute("x1", x1);
        gradient.setAttribute("y1", y1);
        gradient.setAttribute("x2", x2);
        gradient.setAttribute("y2", y2);
        definitions.appendChild(gradient);
        var topStop = document.createElementNS(svgNs, "stop");
        topStop.setAttribute("offset", "0%");
        topStop.setAttribute("stop-color", startColor);
        topStop.setAttribute("stop-opacity", startOpacity);
        gradient.appendChild(topStop);
        var bottomStop = document.createElementNS(svgNs, "stop");
        bottomStop.setAttribute("offset", "100%");
        bottomStop.setAttribute("stop-color", stopColor);
        bottomStop.setAttribute("stop-opacity", stopOpacity);
        gradient.appendChild(bottomStop);
    }
    function createFadeOut(rankingIndexBefore, rankBefore, team) {
        var yPosition = getYPosition(rankBefore) - (curveWidth / 2);
        var height = curveWidth;
        var xPosition = getXPosition(rankingIndexBefore);
        var width = curveFade;
        var gradientName = team.safeTeamName + "_before_" + rankingIndexBefore;
        createLinearGradient(gradientName, 0, 0, 1, 0, team.color, 1, team.color, 0);
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
        rect.setAttribute("onclick", "handleClick(\"" + team.safeTeamName + "\");");
        graph.appendChild(rect);
    }
    function createFadeIn(rankingIndexAfter, rankAfter, team) {
        createLabel(team, rankingIndexAfter, rankAfter);
        var yPosition = getYPosition(rankAfter) - (curveWidth / 2);
        var height = curveWidth;
        var xPosition = getXPosition(rankingIndexAfter) - curveFade;
        var width = curveFade;
        var gradientName = team.safeTeamName + "_after_" + rankingIndexAfter;
        createLinearGradient(gradientName, 1, 0, 0, 0, team.color, 1, team.color, 0);
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
        rect.setAttribute("onclick", "handleClick(\"" + team.safeTeamName + "\");");
        graph.appendChild(rect);
    }
    data.teams.forEach(function (team) {
        for (var j = 0; j < (numberOfRankings + 1); j++) {
            var rankingIndexBefore = j - 1;
            var rankingIndexAfter = j;
            var rankBefore = getRank(team, rankingIndexBefore);
            var rankAfter = getRank(team, rankingIndexAfter);
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
    var gradientHeight = paddingBottom;
    var gradientTop = height - gradientHeight;
    var gradientBottom = height;
    createLinearGradient("bottom", 0, 0, 0, 1, "black", 0, "black", 1);
    var gradientArea = document.createElementNS(svgNs, "rect");
    gradientArea.setAttribute("x", (0).toString());
    gradientArea.setAttribute("y", gradientTop.toString());
    gradientArea.setAttribute("width", width.toString());
    gradientArea.setAttribute("height", gradientHeight.toString());
    gradientArea.setAttribute("fill", "url(#bottom)");
    graph.appendChild(gradientArea);
}
function changeTeamOpacity(teamName, opacity) {
    var teamSeries = document.querySelectorAll(".team-" + teamName);
    [].forEach.call(teamSeries, function (path) {
        path.setAttribute("stroke-opacity", opacity);
        path.setAttribute("fill-opacity", opacity);
    });
}
function handleMouseOver(teamName) {
    data.teams.forEach(function (team) {
        var opacity = teamName === team.safeTeamName ? highlightOpacity : lowlightOpacity;
        changeTeamOpacity(team.safeTeamName, opacity);
    });
}
function handleMouseOut(teamName) {
    data.teams.forEach(function (team) {
        changeTeamOpacity(team.safeTeamName, normalOpacity);
    });
}
function handleClick(teamName) {
    console.log(teamName);
    var teamSeries = document.querySelectorAll(".team-" + teamName);
    [].forEach.call(teamSeries, function (path) {
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
document.querySelector(".flyout .toggle").addEventListener("click", function () {
    document.querySelector(".flyout .body").classList.toggle("hidden");
});
