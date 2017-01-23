/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = emptyElement;
// Function to clear an element.
function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities__ = __webpack_require__(0);

class Canvas {
    constructor(element) {
        this.element = element;
        this.resetDefinitions();
    }
    static setAttributes(element, attributes) {
        for (const attribute of Object.keys(attributes)) {
            element.setAttribute(attribute, attributes[attribute]);
        }
    }
    static createNsElement(name) {
        return document.createElementNS(Canvas.svgNs, name);
    }
    clear() {
        __WEBPACK_IMPORTED_MODULE_0__utilities__["a" /* emptyElement */](this.element);
        this.resetDefinitions();
    }
    setDimensions(width, height) {
        this.element.setAttribute("width", width.toString());
        this.element.setAttribute("height", height.toString());
    }
    addText(value, x, y, color, fontSize, className, opacity) {
        const text = Canvas.createNsElement("text");
        Canvas.setAttributes(text, {
            "class": className,
            "fill": color,
            "fill-opacity": opacity.toString(),
            "font-family": "Arial",
            "font-size": fontSize.toString(),
            "text-anchor": "middle",
            "x": x.toString(),
            "y": y.toString(),
        });
        text.innerHTML = value;
        this.element.appendChild(text);
    }
    addLine(x1, y1, x2, y2, color, width, dashes) {
        const line = Canvas.createNsElement("line");
        Canvas.setAttributes(line, {
            "stroke": color,
            "stroke-dasharray": dashes,
            "stroke-width": width.toString(),
            "x1": x1.toString(),
            "x2": x2.toString(),
            "y1": y1.toString(),
            "y2": y2.toString(),
        });
        this.element.appendChild(line);
    }
    createLinearGradient(id, x1, y1, x2, y2, startColor, startOpacity, stopColor, stopOpacity) {
        // Add a new gradient to the definitions.
        const gradient = Canvas.createNsElement("linearGradient");
        Canvas.setAttributes(gradient, {
            "id": id,
            "x1": x1.toString(),
            "x2": x2.toString(),
            "y1": y1.toString(),
            "y2": y2.toString(),
        });
        this.definitions.appendChild(gradient);
        // Create the transparent gradient stop.
        const topStop = Canvas.createNsElement("stop");
        Canvas.setAttributes(topStop, {
            "offset": "0%",
            "stop-color": startColor,
            "stop-opacity": startOpacity.toString(),
        });
        gradient.appendChild(topStop);
        // Create the solid gradient stop.
        const bottomStop = Canvas.createNsElement("stop");
        Canvas.setAttributes(bottomStop, {
            "offset": "100%",
            "stop-color": stopColor,
            "stop-opacity": stopOpacity.toString(),
        });
        gradient.appendChild(bottomStop);
    }
    addCurve(x1, y1, x2, y2, color, width, name, softness) {
        // Add the curve.
        let pathDefinition = `M ${x1} ${y1} C ${x1 + softness} ${y1}, ${x2 - softness} ${y2}, ${x2} ${y2}`;
        // Create the curve element.
        const line = Canvas.createNsElement("path");
        Canvas.setAttributes(line, {
            "class": `team-${name}`,
            "d": pathDefinition,
            "fill": "transparent",
            "onclick": `handleClick("${name}");`,
            "onmouseout": `handleMouseOut("${name}");`,
            "onmouseover": `handleMouseOver("${name}");`,
            "stroke": color,
            "stroke-opacity": Canvas.normalOpacity.toString(),
            "stroke-width": width.toString(),
        });
        this.element.appendChild(line);
    }
    addCurveRect(x, y, width, height, color, opacity, name) {
        const rect = Canvas.createNsElement("rect");
        Canvas.setAttributes(rect, {
            "class": "team-" + name,
            "fill": color,
            "fill-opacity": opacity.toString(),
            "height": height.toString(),
            "onclick": `handleClick("${name}");`,
            "onmouseout": `handleMouseOut("${name}");`,
            "onmouseover": `handleMouseOver("${name}");`,
            "width": width.toString(),
            "x": x.toString(),
            "y": y.toString(),
        });
        this.element.appendChild(rect);
    }
    addRect(x, y, width, height, color) {
        const rect = Canvas.createNsElement("rect");
        Canvas.setAttributes(rect, {
            fill: color,
            height: height.toString(),
            width: width.toString(),
            x: x.toString(),
            y: y.toString(),
        });
        this.element.appendChild(rect);
    }
    resetDefinitions() {
        // Add a definitions section to the graph for gradient declarations.
        this.definitions = Canvas.createNsElement("defs");
        this.element.appendChild(this.definitions);
        const styles = Canvas.createNsElement("style");
        styles.setAttribute("type", "text/css");
        styles.innerHTML = `
<![CDATA[
  .clicked {
    stroke-opacity: 1;
    fill-opacity: 1;
  }
]]>`;
        this.definitions.appendChild(styles);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Canvas;

Canvas.normalOpacity = 0.2;
Canvas.highlightOpacity = 1;
Canvas.lowlightOpacity = 0.1;
Canvas.svgNs = "http://www.w3.org/2000/svg";


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__canvas__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities__ = __webpack_require__(0);


const graph = new __WEBPACK_IMPORTED_MODULE_0__canvas__["a" /* Canvas */](document.getElementById("graph"));
// Parse dates and find the highest number of ranks.
let highestNumberOfRanks = 0;
data.rankings.forEach((ranking) => {
    highestNumberOfRanks = Math.max(highestNumberOfRanks, ranking.ranks.length);
    ranking.date = new Date(ranking.date);
});
// Ensure the rankings are sorted.
data.rankings = data.rankings.sort((a, b) => {
    return a.date.getTime() - b.date.getTime();
});
// Grab the drop-downs from the DOM.
const dateFromElement = document.querySelector("#dateFrom");
const dateToElement = document.querySelector("#dateTo");
const topNRanksElement = document.querySelector("#topNRanks");
// Function to format dates in the format for drop-downs.
function getDropDownDate(date) {
    return date.toDateString().substring(4);
}
let topNRanks = 30;
// Function to update the dates dropdown list and re-display the graph.
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
    __WEBPACK_IMPORTED_MODULE_1__utilities__["a" /* emptyElement */](dateFromElement);
    __WEBPACK_IMPORTED_MODULE_1__utilities__["a" /* emptyElement */](dateToElement);
    data.rankings.forEach((ranking) => {
        addDateToSelector(ranking.date, dateFromElement, ranking === first, ranking.date < last.date);
        addDateToSelector(ranking.date, dateToElement, ranking === last, ranking.date > first.date);
    });
    displayGraph(first, last);
}
// Function to assess dropdowns and reload the graph.
function refreshGraph() {
    function findRanking(dateString) {
        return data.rankings.find((ranking) => {
            return getDropDownDate(ranking.date) === dateString;
        });
    }
    dropDownRanks(parseInt(topNRanksElement.value, 10));
    setDropDownDates(findRanking(dateFromElement.value), findRanking(dateToElement.value));
}
window.refreshGraph = refreshGraph;
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
    __WEBPACK_IMPORTED_MODULE_1__utilities__["a" /* emptyElement */](topNRanksElement);
    for (let i = 1; i <= highestNumberOfRanks; i++) {
        addRank(i);
    }
}
dropDownRanks(10);
const paddingTop = 100;
const paddingLeft = 50;
const paddingRight = 50;
const paddingBottom = 0;
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
    const graphHeight = (spacingPerRank * numberOfRanks) + paddingTop + paddingBottom;
    graph.setDimensions(graphWidth, graphHeight);
    // Populate a collection containing all the players.
    // Not currently used.
    activeRankings.forEach((ranking) => {
        ranking.ranks.forEach((rank, rankIndex) => {
            rank.players.forEach((player) => {
                // Attempt to find the existing player.
                let newPlayer;
                if (data.players[player.player]) {
                    newPlayer = data.players[player.player];
                }
                else {
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
        const rankingDate = ranking.date;
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
            const labelClass = "team-" + team.safeTeamName;
            const labelText = team.name + " (" + rank + ")";
            const labelColor = team.textColor || team.color;
            graph.addText(labelText, xPosition, yPosition - 20, labelColor, 12, labelClass, __WEBPACK_IMPORTED_MODULE_0__canvas__["a" /* Canvas */].normalOpacity);
        }
    }
    function createCurve(rankingIndexBefore, rankingIndexAfter, rankBefore, rankAfter, team) {
        createLabel(team, rankingIndexAfter, rankAfter);
        graph.addCurve(getXPosition(rankingIndexBefore), getYPosition(rankBefore), getXPosition(rankingIndexAfter), getYPosition(rankAfter), team.color, curveWidth, team.safeTeamName, curveSoftness);
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
        graph.addCurveRect(xPosition, yPosition, width, height, `url(#${gradientName})`, __WEBPACK_IMPORTED_MODULE_0__canvas__["a" /* Canvas */].normalOpacity, team.safeTeamName);
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
        graph.addCurveRect(xPosition, yPosition, width, height, `url(#${gradientName})`, __WEBPACK_IMPORTED_MODULE_0__canvas__["a" /* Canvas */].normalOpacity, team.safeTeamName);
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
    // Prepare a gradient for the bottom of the graph to fade to black.
    const gradientHeight = 50;
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
        const opacity = teamName === team.safeTeamName ? __WEBPACK_IMPORTED_MODULE_0__canvas__["a" /* Canvas */].highlightOpacity : __WEBPACK_IMPORTED_MODULE_0__canvas__["a" /* Canvas */].lowlightOpacity;
        changeTeamOpacity(team.safeTeamName, opacity);
    });
}
window.handleMouseOver = handleMouseOver;
// Lowlights the specified team's path.
function handleMouseOut(teamName) {
    data.teams.forEach((team) => {
        changeTeamOpacity(team.safeTeamName, __WEBPACK_IMPORTED_MODULE_0__canvas__["a" /* Canvas */].normalOpacity);
    });
}
window.handleMouseOut = handleMouseOut;
function handleClick(teamName) {
    console.log(teamName);
    const teamSeries = document.querySelectorAll(".team-" + teamName);
    [].forEach.call(teamSeries, (path) => {
        path.classList.toggle("clicked");
    });
}
window.handleClick = handleClick;
function showDefaultData() {
    dropDownRanks(10);
    setDropDownDates(data.rankings[data.rankings.length - 11], data.rankings[data.rankings.length - 1]);
}
window.showDefaultData = showDefaultData;
function showAllData() {
    dropDownRanks(highestNumberOfRanks);
    setDropDownDates(data.rankings[0], data.rankings[data.rankings.length - 1]);
}
window.showAllData = showAllData;
showDefaultData();
document.querySelector(".flyout .toggle").addEventListener("click", () => {
    document.querySelector(".flyout .body").classList.toggle("hidden");
});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzg4MGIwMjA1ZGNhZTIyNTlmODQiLCJ3ZWJwYWNrOi8vLy4vZ3JhcGgvdXRpbGl0aWVzLnRzIiwid2VicGFjazovLy8uL2dyYXBoL2NhbnZhcy50cyIsIndlYnBhY2s6Ly8vLi9ncmFwaC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ2hFQTtBQUFBLGdDQUFnQztBQUNoQyxzQkFBNkIsT0FBZ0I7SUFDM0MsT0FBTyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztBQUNILENBQUM7Ozs7Ozs7OztBQ0x1QztBQUl4QztJQWtCRSxZQUFvQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFkRCxPQUFlLGFBQWEsQ0FBQyxPQUFnQixFQUFFLFVBQXlCO1FBQ3RFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxD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O0lBQ25DLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUNBLE1BQWMsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBRTFDO0lBQ0UsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRWxCLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RHLENBQUM7QUFDQSxNQUFjLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUVsRDtJQUNFLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBRXBDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlFLENBQUM7QUFDQSxNQUFjLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUUxQyxlQUFlLEVBQUUsQ0FBQztBQUVsQixRQUFRLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO0lBQ2xFLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyRSxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiIuL2Rpc3QvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMzg4MGIwMjA1ZGNhZTIyNTlmODQiLCIvLyBGdW5jdGlvbiB0byBjbGVhciBhbiBlbGVtZW50LlxyXG5leHBvcnQgZnVuY3Rpb24gZW1wdHlFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcclxuICB3aGlsZSAoZWxlbWVudC5maXJzdENoaWxkKSB7XHJcbiAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9ncmFwaC91dGlsaXRpZXMudHMiLCJpbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSBcIi4vdXRpbGl0aWVzXCI7XHJcblxyXG50eXBlIEF0dHJpYnV0ZVR5cGUgPSB7IFthdHRyaWJ1dGU6IHN0cmluZ106IHN0cmluZyB9O1xyXG5cclxuZXhwb3J0IGNsYXNzIENhbnZhcyB7XHJcbiAgcHVibGljIHN0YXRpYyBub3JtYWxPcGFjaXR5ID0gMC4yO1xyXG4gIHB1YmxpYyBzdGF0aWMgaGlnaGxpZ2h0T3BhY2l0eSA9IDE7XHJcbiAgcHVibGljIHN0YXRpYyBsb3dsaWdodE9wYWNpdHkgPSAwLjE7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgc3ZnTnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIHNldEF0dHJpYnV0ZXMoZWxlbWVudDogRWxlbWVudCwgYXR0cmlidXRlczogQXR0cmlidXRlVHlwZSkge1xyXG4gICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgT2JqZWN0LmtleXMoYXR0cmlidXRlcykpIHtcclxuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlTnNFbGVtZW50KG5hbWU6IHN0cmluZyk6IEVsZW1lbnQge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhDYW52YXMuc3ZnTnMsIG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZWZpbml0aW9uczogRWxlbWVudDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50KSB7XHJcbiAgICB0aGlzLnJlc2V0RGVmaW5pdGlvbnMoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuICAgIFV0aWxpdGllcy5lbXB0eUVsZW1lbnQodGhpcy5lbGVtZW50KTtcclxuICAgIHRoaXMucmVzZXREZWZpbml0aW9ucygpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldERpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCB3aWR0aC50b1N0cmluZygpKTtcclxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgaGVpZ2h0LnRvU3RyaW5nKCkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZFRleHQoXHJcbiAgICB2YWx1ZTogc3RyaW5nLFxyXG4gICAgeDogbnVtYmVyLFxyXG4gICAgeTogbnVtYmVyLFxyXG4gICAgY29sb3I6IHN0cmluZyxcclxuICAgIGZvbnRTaXplOiBudW1iZXIsXHJcbiAgICBjbGFzc05hbWU6IHN0cmluZyxcclxuICAgIG9wYWNpdHk6IG51bWJlcixcclxuICApIHtcclxuICAgIGNvbnN0IHRleHQgPSBDYW52YXMuY3JlYXRlTnNFbGVtZW50KFwidGV4dFwiKTtcclxuXHJcbiAgICBDYW52YXMuc2V0QXR0cmlidXRlcyhcclxuICAgICAgdGV4dCxcclxuICAgICAge1xyXG4gICAgICAgIFwiY2xhc3NcIjogY2xhc3NOYW1lLFxyXG4gICAgICAgIFwiZmlsbFwiOiBjb2xvcixcclxuICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiBvcGFjaXR5LnRvU3RyaW5nKCksXHJcbiAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkFyaWFsXCIsXHJcbiAgICAgICAgXCJmb250LXNpemVcIjogZm9udFNpemUudG9TdHJpbmcoKSxcclxuICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsXHJcbiAgICAgICAgXCJ4XCI6IHgudG9TdHJpbmcoKSxcclxuICAgICAgICBcInlcIjogeS50b1N0cmluZygpLFxyXG4gICAgICB9LFxyXG4gICAgKTtcclxuXHJcbiAgICB0ZXh0LmlubmVySFRNTCA9IHZhbHVlO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRMaW5lKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIGNvbG9yOiBzdHJpbmcsIHdpZHRoOiBudW1iZXIsIGRhc2hlczogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBsaW5lID0gQ2FudmFzLmNyZWF0ZU5zRWxlbWVudChcImxpbmVcIik7XHJcblxyXG4gICAgQ2FudmFzLnNldEF0dHJpYnV0ZXMoXHJcbiAgICAgIGxpbmUsXHJcbiAgICAgIHtcclxuICAgICAgICBcInN0cm9rZVwiOiBjb2xvcixcclxuICAgICAgICBcInN0cm9rZS1kYXNoYXJyYXlcIjogZGFzaGVzLFxyXG4gICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IHdpZHRoLnRvU3RyaW5nKCksXHJcbiAgICAgICAgXCJ4MVwiOiB4MS50b1N0cmluZygpLFxyXG4gICAgICAgIFwieDJcIjogeDIudG9TdHJpbmcoKSxcclxuICAgICAgICBcInkxXCI6IHkxLnRvU3RyaW5nKCksXHJcbiAgICAgICAgXCJ5MlwiOiB5Mi50b1N0cmluZygpLFxyXG4gICAgICB9LFxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQobGluZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY3JlYXRlTGluZWFyR3JhZGllbnQoXHJcbiAgICBpZDogc3RyaW5nLFxyXG4gICAgeDE6IG51bWJlcixcclxuICAgIHkxOiBudW1iZXIsXHJcbiAgICB4MjogbnVtYmVyLFxyXG4gICAgeTI6IG51bWJlcixcclxuICAgIHN0YXJ0Q29sb3I6IHN0cmluZyxcclxuICAgIHN0YXJ0T3BhY2l0eTogbnVtYmVyLFxyXG4gICAgc3RvcENvbG9yOiBzdHJpbmcsXHJcbiAgICBzdG9wT3BhY2l0eTogbnVtYmVyLFxyXG4gICkge1xyXG4gICAgLy8gQWRkIGEgbmV3IGdyYWRpZW50IHRvIHRoZSBkZWZpbml0aW9ucy5cclxuICAgIGNvbnN0IGdyYWRpZW50ID0gQ2FudmFzLmNyZWF0ZU5zRWxlbWVudChcImxpbmVhckdyYWRpZW50XCIpO1xyXG4gICAgQ2FudmFzLnNldEF0dHJpYnV0ZXMoXHJcbiAgICAgIGdyYWRpZW50LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICBcIngxXCI6IHgxLnRvU3RyaW5nKCksXHJcbiAgICAgICAgXCJ4MlwiOiB4Mi50b1N0cmluZygpLFxyXG4gICAgICAgIFwieTFcIjogeTEudG9TdHJpbmcoKSxcclxuICAgICAgICBcInkyXCI6IHkyLnRvU3RyaW5nKCksXHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG4gICAgdGhpcy5kZWZpbml0aW9ucy5hcHBlbmRDaGlsZChncmFkaWVudCk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHRoZSB0cmFuc3BhcmVudCBncmFkaWVudCBzdG9wLlxyXG4gICAgY29uc3QgdG9wU3RvcCA9IENhbnZhcy5jcmVhdGVOc0VsZW1lbnQoXCJzdG9wXCIpO1xyXG4gICAgQ2FudmFzLnNldEF0dHJpYnV0ZXMoXHJcbiAgICAgIHRvcFN0b3AsXHJcbiAgICAgIHtcclxuICAgICAgICBcIm9mZnNldFwiOiBcIjAlXCIsXHJcbiAgICAgICAgXCJzdG9wLWNvbG9yXCI6IHN0YXJ0Q29sb3IsXHJcbiAgICAgICAgXCJzdG9wLW9wYWNpdHlcIjogc3RhcnRPcGFjaXR5LnRvU3RyaW5nKCksXHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG4gICAgZ3JhZGllbnQuYXBwZW5kQ2hpbGQodG9wU3RvcCk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHRoZSBzb2xpZCBncmFkaWVudCBzdG9wLlxyXG4gICAgY29uc3QgYm90dG9tU3RvcCA9IENhbnZhcy5jcmVhdGVOc0VsZW1lbnQoXCJzdG9wXCIpO1xyXG4gICAgQ2FudmFzLnNldEF0dHJpYnV0ZXMoXHJcbiAgICAgIGJvdHRvbVN0b3AsXHJcbiAgICAgIHtcclxuICAgICAgICBcIm9mZnNldFwiOiBcIjEwMCVcIixcclxuICAgICAgICBcInN0b3AtY29sb3JcIjogc3RvcENvbG9yLFxyXG4gICAgICAgIFwic3RvcC1vcGFjaXR5XCI6IHN0b3BPcGFjaXR5LnRvU3RyaW5nKCksXHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG4gICAgZ3JhZGllbnQuYXBwZW5kQ2hpbGQoYm90dG9tU3RvcCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkQ3VydmUoXHJcbiAgICB4MTogbnVtYmVyLFxyXG4gICAgeTE6IG51bWJlcixcclxuICAgIHgyOiBudW1iZXIsXHJcbiAgICB5MjogbnVtYmVyLFxyXG4gICAgY29sb3I6IHN0cmluZyxcclxuICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBzb2Z0bmVzczogbnVtYmVyLFxyXG4gICk6IHZvaWQge1xyXG4gICAgLy8gQWRkIHRoZSBjdXJ2ZS5cclxuICAgIGxldCBwYXRoRGVmaW5pdGlvbiA9IGBNICR7eDF9ICR7eTF9IEMgJHt4MSArIHNvZnRuZXNzfSAke3kxfSwgJHt4MiAtIHNvZnRuZXNzfSAke3kyfSwgJHt4Mn0gJHt5Mn1gO1xyXG5cclxuICAgIC8vIENyZWF0ZSB0aGUgY3VydmUgZWxlbWVudC5cclxuICAgIGNvbnN0IGxpbmUgPSBDYW52YXMuY3JlYXRlTnNFbGVtZW50KFwicGF0aFwiKTtcclxuICAgIENhbnZhcy5zZXRBdHRyaWJ1dGVzKFxyXG4gICAgICBsaW5lLFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJjbGFzc1wiOiBgdGVhbS0ke25hbWV9YCxcclxuICAgICAgICBcImRcIjogcGF0aERlZmluaXRpb24sXHJcbiAgICAgICAgXCJmaWxsXCI6IFwidHJhbnNwYXJlbnRcIixcclxuICAgICAgICBcIm9uY2xpY2tcIjogYGhhbmRsZUNsaWNrKFwiJHtuYW1lfVwiKTtgLFxyXG4gICAgICAgIFwib25tb3VzZW91dFwiOiBgaGFuZGxlTW91c2VPdXQoXCIke25hbWV9XCIpO2AsXHJcbiAgICAgICAgXCJvbm1vdXNlb3ZlclwiOiBgaGFuZGxlTW91c2VPdmVyKFwiJHtuYW1lfVwiKTtgLFxyXG4gICAgICAgIFwic3Ryb2tlXCI6IGNvbG9yLFxyXG4gICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogQ2FudmFzLm5vcm1hbE9wYWNpdHkudG9TdHJpbmcoKSxcclxuICAgICAgICBcInN0cm9rZS13aWR0aFwiOiB3aWR0aC50b1N0cmluZygpLFxyXG4gICAgICB9LFxyXG4gICAgKTtcclxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChsaW5lKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRDdXJ2ZVJlY3QoXHJcbiAgICB4OiBudW1iZXIsXHJcbiAgICB5OiBudW1iZXIsXHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICBjb2xvcjogc3RyaW5nLFxyXG4gICAgb3BhY2l0eTpcclxuICAgIG51bWJlcixcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICApIHtcclxuICAgIGNvbnN0IHJlY3QgPSBDYW52YXMuY3JlYXRlTnNFbGVtZW50KFwicmVjdFwiKTtcclxuXHJcbiAgICBDYW52YXMuc2V0QXR0cmlidXRlcyhcclxuICAgICAgcmVjdCxcclxuICAgICAge1xyXG4gICAgICAgIFwiY2xhc3NcIjogXCJ0ZWFtLVwiICsgbmFtZSxcclxuICAgICAgICBcImZpbGxcIjogY29sb3IsXHJcbiAgICAgICAgXCJmaWxsLW9wYWNpdHlcIjogb3BhY2l0eS50b1N0cmluZygpLFxyXG4gICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodC50b1N0cmluZygpLFxyXG4gICAgICAgIFwib25jbGlja1wiOiBgaGFuZGxlQ2xpY2soXCIke25hbWV9XCIpO2AsXHJcbiAgICAgICAgXCJvbm1vdXNlb3V0XCI6IGBoYW5kbGVNb3VzZU91dChcIiR7bmFtZX1cIik7YCxcclxuICAgICAgICBcIm9ubW91c2VvdmVyXCI6IGBoYW5kbGVNb3VzZU92ZXIoXCIke25hbWV9XCIpO2AsXHJcbiAgICAgICAgXCJ3aWR0aFwiOiB3aWR0aC50b1N0cmluZygpLFxyXG4gICAgICAgIFwieFwiOiB4LnRvU3RyaW5nKCksXHJcbiAgICAgICAgXCJ5XCI6IHkudG9TdHJpbmcoKSxcclxuICAgICAgfSxcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHJlY3QpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZFJlY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjb2xvcjogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZWN0ID0gQ2FudmFzLmNyZWF0ZU5zRWxlbWVudChcInJlY3RcIik7XHJcblxyXG4gICAgQ2FudmFzLnNldEF0dHJpYnV0ZXMoXHJcbiAgICAgIHJlY3QsXHJcbiAgICAgIHtcclxuICAgICAgICBmaWxsOiBjb2xvcixcclxuICAgICAgICBoZWlnaHQ6IGhlaWdodC50b1N0cmluZygpLFxyXG4gICAgICAgIHdpZHRoOiB3aWR0aC50b1N0cmluZygpLFxyXG4gICAgICAgIHg6IHgudG9TdHJpbmcoKSxcclxuICAgICAgICB5OiB5LnRvU3RyaW5nKCksXHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChyZWN0KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVzZXREZWZpbml0aW9ucygpOiB2b2lkIHtcclxuICAgIC8vIEFkZCBhIGRlZmluaXRpb25zIHNlY3Rpb24gdG8gdGhlIGdyYXBoIGZvciBncmFkaWVudCBkZWNsYXJhdGlvbnMuXHJcbiAgICB0aGlzLmRlZmluaXRpb25zID0gQ2FudmFzLmNyZWF0ZU5zRWxlbWVudChcImRlZnNcIik7XHJcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kZWZpbml0aW9ucyk7XHJcblxyXG4gICAgY29uc3Qgc3R5bGVzID0gQ2FudmFzLmNyZWF0ZU5zRWxlbWVudChcInN0eWxlXCIpO1xyXG4gICAgc3R5bGVzLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0L2Nzc1wiKTtcclxuICAgIHN0eWxlcy5pbm5lckhUTUwgPSBgXHJcbjwhW0NEQVRBW1xyXG4gIC5jbGlja2VkIHtcclxuICAgIHN0cm9rZS1vcGFjaXR5OiAxO1xyXG4gICAgZmlsbC1vcGFjaXR5OiAxO1xyXG4gIH1cclxuXV0+YDtcclxuICAgIHRoaXMuZGVmaW5pdGlvbnMuYXBwZW5kQ2hpbGQoc3R5bGVzKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL2dyYXBoL2NhbnZhcy50cyIsImltcG9ydCB7Q2FudmFzfSBmcm9tIFwiLi9jYW52YXNcIjtcclxuaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gXCIuL3V0aWxpdGllc1wiO1xyXG5cclxuZGVjbGFyZSB2YXIgZGF0YTogRGF0YUZvcm1hdDtcclxuXHJcbmNvbnN0IGdyYXBoID0gbmV3IENhbnZhcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyYXBoXCIpKTtcclxuXHJcbi8vIFBhcnNlIGRhdGVzIGFuZCBmaW5kIHRoZSBoaWdoZXN0IG51bWJlciBvZiByYW5rcy5cclxubGV0IGhpZ2hlc3ROdW1iZXJPZlJhbmtzID0gMDtcclxuZGF0YS5yYW5raW5ncy5mb3JFYWNoKChyYW5raW5nKSA9PiB7XHJcbiAgaGlnaGVzdE51bWJlck9mUmFua3MgPSBNYXRoLm1heChoaWdoZXN0TnVtYmVyT2ZSYW5rcywgcmFua2luZy5yYW5rcy5sZW5ndGgpO1xyXG4gIHJhbmtpbmcuZGF0ZSA9IG5ldyBEYXRlKHJhbmtpbmcuZGF0ZSk7XHJcbn0pO1xyXG5cclxuLy8gRW5zdXJlIHRoZSByYW5raW5ncyBhcmUgc29ydGVkLlxyXG5kYXRhLnJhbmtpbmdzID0gZGF0YS5yYW5raW5ncy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgcmV0dXJuIChhLmRhdGUgYXMgRGF0ZSkuZ2V0VGltZSgpIC0gKGIuZGF0ZSBhcyBEYXRlKS5nZXRUaW1lKCk7XHJcbn0pO1xyXG5cclxuLy8gR3JhYiB0aGUgZHJvcC1kb3ducyBmcm9tIHRoZSBET00uXHJcbmNvbnN0IGRhdGVGcm9tRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGF0ZUZyb21cIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbmNvbnN0IGRhdGVUb0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RhdGVUb1wiKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuY29uc3QgdG9wTlJhbmtzRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdG9wTlJhbmtzXCIpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cclxuLy8gRnVuY3Rpb24gdG8gZm9ybWF0IGRhdGVzIGluIHRoZSBmb3JtYXQgZm9yIGRyb3AtZG93bnMuXHJcbmZ1bmN0aW9uIGdldERyb3BEb3duRGF0ZShkYXRlOiBEYXRlKTogc3RyaW5nIHtcclxuICByZXR1cm4gZGF0ZS50b0RhdGVTdHJpbmcoKS5zdWJzdHJpbmcoNCk7XHJcbn1cclxuXHJcbmxldCB0b3BOUmFua3MgPSAzMDtcclxuXHJcbi8vIEZ1bmN0aW9uIHRvIHVwZGF0ZSB0aGUgZGF0ZXMgZHJvcGRvd24gbGlzdCBhbmQgcmUtZGlzcGxheSB0aGUgZ3JhcGguXHJcbmZ1bmN0aW9uIHNldERyb3BEb3duRGF0ZXMoZmlyc3QsIGxhc3QpIHtcclxuICBmdW5jdGlvbiBhZGREYXRlVG9TZWxlY3RvcihkYXRlOiBEYXRlLCBzZWxlY3RvcjogSFRNTFNlbGVjdEVsZW1lbnQsIGlzU2VsZWN0ZWQ6IGJvb2xlYW4sIGlzRW5hYmxlZDogYm9vbGVhbikge1xyXG4gICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBnZXREcm9wRG93bkRhdGUoZGF0ZSk7XHJcbiAgICBvcHRpb24udGV4dCA9IGRhdGVTdHJpbmc7XHJcbiAgICBvcHRpb24udmFsdWUgPSBkYXRlU3RyaW5nO1xyXG4gICAgb3B0aW9uLnNlbGVjdGVkID0gaXNTZWxlY3RlZDtcclxuICAgIG9wdGlvbi5kaXNhYmxlZCA9ICFpc0VuYWJsZWQ7XHJcbiAgICBzZWxlY3Rvci5hZGQob3B0aW9uKTtcclxuICB9XHJcblxyXG4gIFV0aWxpdGllcy5lbXB0eUVsZW1lbnQoZGF0ZUZyb21FbGVtZW50KTtcclxuICBVdGlsaXRpZXMuZW1wdHlFbGVtZW50KGRhdGVUb0VsZW1lbnQpO1xyXG5cclxuICBkYXRhLnJhbmtpbmdzLmZvckVhY2goKHJhbmtpbmcpID0+IHtcclxuICAgIGFkZERhdGVUb1NlbGVjdG9yKHJhbmtpbmcuZGF0ZSBhcyBEYXRlLCBkYXRlRnJvbUVsZW1lbnQsIHJhbmtpbmcgPT09IGZpcnN0LCByYW5raW5nLmRhdGUgPCBsYXN0LmRhdGUpO1xyXG4gICAgYWRkRGF0ZVRvU2VsZWN0b3IocmFua2luZy5kYXRlIGFzIERhdGUsIGRhdGVUb0VsZW1lbnQsIHJhbmtpbmcgPT09IGxhc3QsIHJhbmtpbmcuZGF0ZSA+IGZpcnN0LmRhdGUpO1xyXG4gIH0pO1xyXG5cclxuICBkaXNwbGF5R3JhcGgoZmlyc3QsIGxhc3QpO1xyXG59XHJcblxyXG4vLyBGdW5jdGlvbiB0byBhc3Nlc3MgZHJvcGRvd25zIGFuZCByZWxvYWQgdGhlIGdyYXBoLlxyXG5mdW5jdGlvbiByZWZyZXNoR3JhcGgoKSB7XHJcbiAgZnVuY3Rpb24gZmluZFJhbmtpbmcoZGF0ZVN0cmluZzogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZGF0YS5yYW5raW5ncy5maW5kKChyYW5raW5nKSA9PiB7XHJcbiAgICAgIHJldHVybiBnZXREcm9wRG93bkRhdGUocmFua2luZy5kYXRlIGFzIERhdGUpID09PSBkYXRlU3RyaW5nO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkcm9wRG93blJhbmtzKHBhcnNlSW50KHRvcE5SYW5rc0VsZW1lbnQudmFsdWUsIDEwKSk7XHJcblxyXG4gIHNldERyb3BEb3duRGF0ZXMoZmluZFJhbmtpbmcoZGF0ZUZyb21FbGVtZW50LnZhbHVlKSwgZmluZFJhbmtpbmcoZGF0ZVRvRWxlbWVudC52YWx1ZSkpO1xyXG59XHJcbih3aW5kb3cgYXMgYW55KS5yZWZyZXNoR3JhcGggPSByZWZyZXNoR3JhcGg7XHJcblxyXG4vLyBGdW5jdGlvbiB0byB1cGRhdGUgdGhlIHRvcCBuIHJhbmtzIGRyb3Bkb3duLlxyXG5mdW5jdGlvbiBkcm9wRG93blJhbmtzKHNlbGVjdGVkKSB7XHJcbiAgdG9wTlJhbmtzID0gc2VsZWN0ZWQ7XHJcblxyXG4gIGZ1bmN0aW9uIGFkZFJhbmsocmFua051bWJlcikge1xyXG4gICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgIGNvbnN0IHJhbmtTdHJpbmcgPSByYW5rTnVtYmVyLnRvU3RyaW5nKCk7XHJcbiAgICBvcHRpb24udGV4dCA9IHJhbmtTdHJpbmc7XHJcbiAgICBvcHRpb24udmFsdWUgPSByYW5rU3RyaW5nO1xyXG4gICAgb3B0aW9uLnNlbGVjdGVkID0gc2VsZWN0ZWQgPT09IHJhbmtOdW1iZXI7XHJcbiAgICB0b3BOUmFua3NFbGVtZW50LmFkZChvcHRpb24pO1xyXG4gIH1cclxuXHJcbiAgVXRpbGl0aWVzLmVtcHR5RWxlbWVudCh0b3BOUmFua3NFbGVtZW50KTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gaGlnaGVzdE51bWJlck9mUmFua3M7IGkrKykge1xyXG4gICAgYWRkUmFuayhpKTtcclxuICB9XHJcbn1cclxuXHJcbmRyb3BEb3duUmFua3MoMTApO1xyXG5cclxuY29uc3QgcGFkZGluZ1RvcCA9IDEwMDtcclxuY29uc3QgcGFkZGluZ0xlZnQgPSA1MDtcclxuY29uc3QgcGFkZGluZ1JpZ2h0ID0gNTA7XHJcbmNvbnN0IHBhZGRpbmdCb3R0b20gPSAwO1xyXG5cclxuY29uc3QgbW9udGhzID0gbmV3IEFycmF5KFwiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCIpO1xyXG5cclxuZnVuY3Rpb24gZGlzcGxheUdyYXBoKGZpcnN0UmFua2luZywgbGFzdFJhbmtpbmcpIHtcclxuICBncmFwaC5jbGVhcigpO1xyXG5cclxuICBsZXQgc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgY29uc3QgYWN0aXZlUmFua2luZ3MgPSBkYXRhLnJhbmtpbmdzLmZpbHRlcigocmFua2luZykgPT4ge1xyXG4gICAgaWYgKHJhbmtpbmcgPT09IGZpcnN0UmFua2luZykge1xyXG4gICAgICBzZWxlY3RpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzdWx0ID0gc2VsZWN0aW5nO1xyXG4gICAgaWYgKHJhbmtpbmcgPT09IGxhc3RSYW5raW5nKSB7XHJcbiAgICAgIHNlbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9KTtcclxuXHJcbiAgLy8gRGlzdHJpYnV0ZSB0aGUgdmVydGljYWwgc3BhY2UgYmV0d2VlbiB0aGUgbnVtYmVyIG9mIHJhbmtpbmdzLlxyXG4gIGNvbnN0IG51bWJlck9mUmFua2luZ3MgPSBhY3RpdmVSYW5raW5ncy5sZW5ndGg7XHJcbiAgY29uc3Qgc3BhY2luZ1BlclJhbmtpbmcgPSAxNjA7XHJcblxyXG4gIC8vIERpc3RyaWJ1dGUgdGhlIGhvcml6b250YWwgc3BhY2UgYmV0d2VlbiB0aGUgbnVtYmVyIG9mIHJhbmtzLlxyXG4gIGNvbnN0IG51bWJlck9mUmFua3MgPSB0b3BOUmFua3M7XHJcbiAgY29uc3Qgc3BhY2luZ1BlclJhbmsgPSA2MDtcclxuXHJcbiAgLy8gU2V0IHRoZSBkaW1lbnNpb25zXHJcbiAgY29uc3QgZ3JhcGhXaWR0aCA9IHNwYWNpbmdQZXJSYW5raW5nICogbnVtYmVyT2ZSYW5raW5ncztcclxuICBjb25zdCBncmFwaEhlaWdodCA9IChzcGFjaW5nUGVyUmFuayAqIG51bWJlck9mUmFua3MpICsgcGFkZGluZ1RvcCArIHBhZGRpbmdCb3R0b207XHJcbiAgZ3JhcGguc2V0RGltZW5zaW9ucyhncmFwaFdpZHRoLCBncmFwaEhlaWdodCk7XHJcblxyXG4gIC8vIFBvcHVsYXRlIGEgY29sbGVjdGlvbiBjb250YWluaW5nIGFsbCB0aGUgcGxheWVycy5cclxuICAvLyBOb3QgY3VycmVudGx5IHVzZWQuXHJcbiAgYWN0aXZlUmFua2luZ3MuZm9yRWFjaCgocmFua2luZykgPT4ge1xyXG4gICAgcmFua2luZy5yYW5rcy5mb3JFYWNoKChyYW5rLCByYW5rSW5kZXgpID0+IHtcclxuICAgICAgcmFuay5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xyXG4gICAgICAgIC8vIEF0dGVtcHQgdG8gZmluZCB0aGUgZXhpc3RpbmcgcGxheWVyLlxyXG4gICAgICAgIGxldCBuZXdQbGF5ZXI7XHJcbiAgICAgICAgaWYgKGRhdGEucGxheWVyc1twbGF5ZXIucGxheWVyXSkge1xyXG4gICAgICAgICAgbmV3UGxheWVyID0gZGF0YS5wbGF5ZXJzW3BsYXllci5wbGF5ZXJdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBQb3B1bGF0ZSBhIGZyZXNoIHBsYXllciB3aXRoIGVtcHR5IHJhbmtpbmdzLlxyXG4gICAgICAgICAgbmV3UGxheWVyID0ge1xyXG4gICAgICAgICAgICB0ZWFtczogW10sXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGFjdGl2ZVJhbmtpbmdzLmZvckVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICBuZXdQbGF5ZXIudGVhbXMucHVzaChudWxsKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRhdGEucGxheWVyc1twbGF5ZXIucGxheWVyXSA9IG5ld1BsYXllcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFB1dCB0aGUgdGVhbSBpbnRvIHRoZSBwbGF5ZXIncyBoaXN0b3J5LlxyXG4gICAgICAgIG5ld1BsYXllci50ZWFtc1tyYW5rSW5kZXhdID0gcmFuay50ZWFtO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAvLyBEZW5vcm1hbGl6ZSB0aGUgcmFuayBvZiBlYWNoIHRlYW0gZm9yIGV2ZXJ5IHJhbmtpbmcuXHJcbiAgZGF0YS50ZWFtcy5mb3JFYWNoKCh0ZWFtKSA9PiB7XHJcbiAgICAvLyBHZXQgdGhlaXIgcmFua2luZ3MuXHJcbiAgICB0ZWFtLnJhbmtzID0gW107XHJcbiAgICBhY3RpdmVSYW5raW5ncy5mb3JFYWNoKChyYW5raW5nKSA9PiB7XHJcbiAgICAgIC8vIEFkZCB0aGUgdGVhbSdzIHJhbmssIG90aGVyd2lzZSBudWxsLlxyXG4gICAgICBjb25zdCBmb3VuZFJhbmsgPSByYW5raW5nLnJhbmtzLmZpbmQoKHJhbmspID0+IHtcclxuICAgICAgICByZXR1cm4gcmFuay50ZWFtID09PSB0ZWFtLm5hbWU7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGVhbS5yYW5rcy5wdXNoKGZvdW5kUmFuayA/IGZvdW5kUmFuay5wb3NpdGlvbiA6IG51bGwpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIERyYXcgaG9yaXpvbnRhbCBncmlkbGluZXMuXHJcbiAgYWN0aXZlUmFua2luZ3MuZm9yRWFjaCgocmFua2luZywgcmFua2luZ0luZGV4KSA9PiB7XHJcbiAgICBjb25zdCB4UG9zaXRpb24gPSAocmFua2luZ0luZGV4ICogc3BhY2luZ1BlclJhbmtpbmcpICsgcGFkZGluZ0xlZnQ7XHJcblxyXG4gICAgZ3JhcGguYWRkTGluZSh4UG9zaXRpb24sIDAsIHhQb3NpdGlvbiwgZ3JhcGhIZWlnaHQsIFwiIzMzMzMzM1wiLCAxLCBcIjUsIDVcIik7XHJcblxyXG4gICAgY29uc3QgcmFua2luZ0RhdGUgPSByYW5raW5nLmRhdGUgYXMgRGF0ZTtcclxuICAgIGNvbnN0IGRheUFuZE1vbnRoID0gcmFua2luZ0RhdGUuZ2V0RGF0ZSgpICsgXCIgXCIgKyBtb250aHNbcmFua2luZ0RhdGUuZ2V0TW9udGgoKV07XHJcbiAgICBjb25zdCB5ZWFyID0gcmFua2luZ0RhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpO1xyXG5cclxuICAgIGdyYXBoLmFkZFRleHQoZGF5QW5kTW9udGgsIHhQb3NpdGlvbiwgMjAsIFwid2hpdGVcIiwgMTIsIFwiXCIsIDEpO1xyXG4gICAgZ3JhcGguYWRkVGV4dCh5ZWFyLCB4UG9zaXRpb24sIDQwLCBcIndoaXRlXCIsIDEyLCBcIlwiLCAxKTtcclxuICB9KTtcclxuXHJcbiAgLy8gRHJhdyB2ZXJ0aWNhbCBncmlkbGluZXMuXHJcbiAgYWN0aXZlUmFua2luZ3NbMF0ucmFua3MuZm9yRWFjaCgocmFua2luZywgcmFua2luZ0luZGV4KSA9PiB7XHJcbiAgICBjb25zdCB5UG9zaXRpb24gPSAocmFua2luZ0luZGV4ICogc3BhY2luZ1BlclJhbmspICsgcGFkZGluZ1RvcDtcclxuXHJcbiAgICBncmFwaC5hZGRMaW5lKDAsIHlQb3NpdGlvbiwgZ3JhcGhXaWR0aCwgeVBvc2l0aW9uLCBcIiMzMzMzMzNcIiwgMSwgXCI1LCA1XCIpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBDYWxjdWxhdGUgaG93IHRvIHBsYWNlIHRoZSBjdXJ2ZSBhbmNob3IgcG9pbnRzLlxyXG4gIGNvbnN0IGN1cnZlU29mdG5lc3MgPSBzcGFjaW5nUGVyUmFua2luZyAqIDAuNzU7XHJcbiAgY29uc3QgY3VydmVXaWR0aCA9IDEwO1xyXG4gIGNvbnN0IGN1cnZlRmFkZSA9IHNwYWNpbmdQZXJSYW5raW5nICogMC4yNTtcclxuXHJcbiAgLy8gR2V0cyB0aGUgcmFuayBmb3IgYSB0ZWFtIGluIHRoZSBnaXZlbiBzZXQgb2YgcmFua2luZ3MuXHJcbiAgZnVuY3Rpb24gZ2V0UmFuayh0ZWFtLCByYW5raW5nSW5kZXgpIHtcclxuICAgIC8vIFdlIG1pZ2h0IGJlIHBvaW50aW5nIHRvIGEgcmFua2luZyB3aGljaCBkb2Vzbid0IGV4aXN0LlxyXG4gICAgLy8gRHVwbGljYXRlIHRoZSByYW5raW5nIHRvIGtlZXAgYSBmbGF0IGxpbmUgYXQgdGhlIGdyYXBoJ3MgZWRnZXMuXHJcbiAgICByYW5raW5nSW5kZXggPSBNYXRoLm1pbihNYXRoLm1heChyYW5raW5nSW5kZXgsIDApLCBudW1iZXJPZlJhbmtpbmdzIC0gMSk7XHJcblxyXG4gICAgLy8gRmluZCB0aGUgcmFuayBhdCB0aGUgZ2l2ZW4gcmFua2luZ3MuXHJcbiAgICBjb25zdCByYW5rID0gdGVhbS5yYW5rc1tyYW5raW5nSW5kZXhdO1xyXG5cclxuICAgIHJldHVybiByYW5rICYmIHJhbmsgPiB0b3BOUmFua3MgPyBudWxsIDogcmFuaztcclxuICB9XHJcblxyXG4gIC8vIENhbGN1bGF0ZSB0aGUgbGluZSdzIHggcG9zaXRpb24gYXQgdGhlIGdpdmVuIHJhbmtpbmcuXHJcbiAgZnVuY3Rpb24gZ2V0WFBvc2l0aW9uKHJhbmtJbmRleCkge1xyXG4gICAgcmV0dXJuIChyYW5rSW5kZXggKiBzcGFjaW5nUGVyUmFua2luZykgKyBwYWRkaW5nTGVmdDtcclxuICB9XHJcblxyXG4gIC8vIENhbGN1bGF0ZSB0aGUgbGluZSdzIHkgcG9zaXRpb24gYXQgdGhlIGdpdmVuIHJhbmtpbmcuXHJcbiAgZnVuY3Rpb24gZ2V0WVBvc2l0aW9uKHJhbmspIHtcclxuICAgIC8vIERlY3JlbWVudCB0aGUgcmFua2luZ3Mgc28gdGhhdCBpdCBpcyAwLWJhc2VkIHJhdGhlciB0aGFuIDEtYmFzZWQuXHJcbiAgICByYW5rID0gcmFuayAtIDE7XHJcblxyXG4gICAgcmV0dXJuIChyYW5rICogc3BhY2luZ1BlclJhbmspICsgcGFkZGluZ1RvcDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUxhYmVsKHRlYW0sIHJhbmtpbmdJbmRleCwgcmFuaykge1xyXG4gICAgaWYgKHJhbmtpbmdJbmRleCA8IG51bWJlck9mUmFua2luZ3MgJiYgcmFuayA8PSBudW1iZXJPZlJhbmtzKSB7XHJcbiAgICAgIGNvbnN0IHlQb3NpdGlvbiA9IGdldFlQb3NpdGlvbihyYW5rKTtcclxuICAgICAgY29uc3QgeFBvc2l0aW9uID0gZ2V0WFBvc2l0aW9uKHJhbmtpbmdJbmRleCk7XHJcblxyXG4gICAgICBjb25zdCBsYWJlbENsYXNzID0gXCJ0ZWFtLVwiICsgdGVhbS5zYWZlVGVhbU5hbWU7XHJcbiAgICAgIGNvbnN0IGxhYmVsVGV4dCA9IHRlYW0ubmFtZSArIFwiIChcIiArIHJhbmsgKyBcIilcIjtcclxuICAgICAgY29uc3QgbGFiZWxDb2xvciA9IHRlYW0udGV4dENvbG9yIHx8IHRlYW0uY29sb3I7XHJcblxyXG4gICAgICBncmFwaC5hZGRUZXh0KGxhYmVsVGV4dCwgeFBvc2l0aW9uLCB5UG9zaXRpb24gLSAyMCwgbGFiZWxDb2xvciwgMTIsIGxhYmVsQ2xhc3MsIENhbnZhcy5ub3JtYWxPcGFjaXR5KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUN1cnZlKHJhbmtpbmdJbmRleEJlZm9yZSwgcmFua2luZ0luZGV4QWZ0ZXIsIHJhbmtCZWZvcmUsIHJhbmtBZnRlciwgdGVhbSkge1xyXG4gICAgY3JlYXRlTGFiZWwodGVhbSwgcmFua2luZ0luZGV4QWZ0ZXIsIHJhbmtBZnRlcik7XHJcblxyXG4gICAgZ3JhcGguYWRkQ3VydmUoXHJcbiAgICAgIGdldFhQb3NpdGlvbihyYW5raW5nSW5kZXhCZWZvcmUpLFxyXG4gICAgICBnZXRZUG9zaXRpb24ocmFua0JlZm9yZSksXHJcbiAgICAgIGdldFhQb3NpdGlvbihyYW5raW5nSW5kZXhBZnRlciksXHJcbiAgICAgIGdldFlQb3NpdGlvbihyYW5rQWZ0ZXIpLFxyXG4gICAgICB0ZWFtLmNvbG9yLFxyXG4gICAgICBjdXJ2ZVdpZHRoLFxyXG4gICAgICB0ZWFtLnNhZmVUZWFtTmFtZSxcclxuICAgICAgY3VydmVTb2Z0bmVzcyxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVGYWRlT3V0KHJhbmtpbmdJbmRleEJlZm9yZSwgcmFua0JlZm9yZSwgdGVhbSkge1xyXG4gICAgY29uc3QgeVBvc2l0aW9uID0gZ2V0WVBvc2l0aW9uKHJhbmtCZWZvcmUpIC0gKGN1cnZlV2lkdGggLyAyKTtcclxuICAgIGNvbnN0IGhlaWdodCA9IGN1cnZlV2lkdGg7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSB5IHBvc2l0aW9uIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIHRyYW5zaXRpb24uXHJcbiAgICBjb25zdCB4UG9zaXRpb24gPSBnZXRYUG9zaXRpb24ocmFua2luZ0luZGV4QmVmb3JlKTtcclxuICAgIGNvbnN0IHdpZHRoID0gY3VydmVGYWRlO1xyXG5cclxuICAgIGNvbnN0IGdyYWRpZW50TmFtZSA9IHRlYW0uc2FmZVRlYW1OYW1lICsgXCJfYmVmb3JlX1wiICsgcmFua2luZ0luZGV4QmVmb3JlO1xyXG4gICAgZ3JhcGguY3JlYXRlTGluZWFyR3JhZGllbnQoZ3JhZGllbnROYW1lLCAwLCAwLCAxLCAwLCB0ZWFtLmNvbG9yLCAxLCB0ZWFtLmNvbG9yLCAwKTtcclxuXHJcbiAgICAvLyBDcmVhdGUgdGhlIHJlY3RhbmdsZSB3aXRoIHRoZSBncmFkaWVudCBhcHBsaWVkLlxyXG4gICAgZ3JhcGguYWRkQ3VydmVSZWN0KFxyXG4gICAgICB4UG9zaXRpb24sXHJcbiAgICAgIHlQb3NpdGlvbixcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodCxcclxuICAgICAgYHVybCgjJHtncmFkaWVudE5hbWV9KWAsXHJcbiAgICAgIENhbnZhcy5ub3JtYWxPcGFjaXR5LFxyXG4gICAgICB0ZWFtLnNhZmVUZWFtTmFtZSxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVGYWRlSW4ocmFua2luZ0luZGV4QWZ0ZXIsIHJhbmtBZnRlciwgdGVhbSkge1xyXG4gICAgY3JlYXRlTGFiZWwodGVhbSwgcmFua2luZ0luZGV4QWZ0ZXIsIHJhbmtBZnRlcik7XHJcblxyXG4gICAgY29uc3QgeVBvc2l0aW9uID0gZ2V0WVBvc2l0aW9uKHJhbmtBZnRlcikgLSAoY3VydmVXaWR0aCAvIDIpO1xyXG4gICAgY29uc3QgaGVpZ2h0ID0gY3VydmVXaWR0aDtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgdGhlIHkgcG9zaXRpb24gYmVmb3JlIGFuZCBhZnRlciB0aGUgdHJhbnNpdGlvbi5cclxuICAgIGNvbnN0IHhQb3NpdGlvbiA9IGdldFhQb3NpdGlvbihyYW5raW5nSW5kZXhBZnRlcikgLSBjdXJ2ZUZhZGU7XHJcbiAgICBjb25zdCB3aWR0aCA9IGN1cnZlRmFkZTtcclxuXHJcbiAgICBjb25zdCBncmFkaWVudE5hbWUgPSB0ZWFtLnNhZmVUZWFtTmFtZSArIFwiX2FmdGVyX1wiICsgcmFua2luZ0luZGV4QWZ0ZXI7XHJcbiAgICBncmFwaC5jcmVhdGVMaW5lYXJHcmFkaWVudChncmFkaWVudE5hbWUsIDEsIDAsIDAsIDAsIHRlYW0uY29sb3IsIDEsIHRlYW0uY29sb3IsIDApO1xyXG5cclxuICAgIC8vIENyZWF0ZSB0aGUgcmVjdGFuZ2xlIHdpdGggdGhlIGdyYWRpZW50IGFwcGxpZWQuXHJcbiAgICBncmFwaC5hZGRDdXJ2ZVJlY3QoXHJcbiAgICAgIHhQb3NpdGlvbixcclxuICAgICAgeVBvc2l0aW9uLFxyXG4gICAgICB3aWR0aCxcclxuICAgICAgaGVpZ2h0LFxyXG4gICAgICBgdXJsKCMke2dyYWRpZW50TmFtZX0pYCxcclxuICAgICAgQ2FudmFzLm5vcm1hbE9wYWNpdHksXHJcbiAgICAgIHRlYW0uc2FmZVRlYW1OYW1lLFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIERyYXcgdGVhbSBzZXJpZXMuXHJcbiAgZGF0YS50ZWFtcy5mb3JFYWNoKCh0ZWFtKSA9PiB7XHJcbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggdGhlIGdhcHMgb24gZWl0aGVyIHNpZGUgb2YgdGhlIHJhbmtpbmdzLlxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAobnVtYmVyT2ZSYW5raW5ncyArIDEpOyBqKyspIHtcclxuICAgICAgLy8gRmluZCB0aGUgaW5kZXggYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2FwLlxyXG4gICAgICBjb25zdCByYW5raW5nSW5kZXhCZWZvcmUgPSBqIC0gMTtcclxuICAgICAgY29uc3QgcmFua2luZ0luZGV4QWZ0ZXIgPSBqO1xyXG5cclxuICAgICAgY29uc3QgcmFua0JlZm9yZSA9IGdldFJhbmsodGVhbSwgcmFua2luZ0luZGV4QmVmb3JlKTtcclxuICAgICAgY29uc3QgcmFua0FmdGVyID0gZ2V0UmFuayh0ZWFtLCByYW5raW5nSW5kZXhBZnRlcik7XHJcblxyXG4gICAgICBpZiAocmFua0JlZm9yZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChyYW5rQWZ0ZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgIGNyZWF0ZUN1cnZlKHJhbmtpbmdJbmRleEJlZm9yZSwgcmFua2luZ0luZGV4QWZ0ZXIsIHJhbmtCZWZvcmUsIHJhbmtBZnRlciwgdGVhbSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNyZWF0ZUZhZGVPdXQocmFua2luZ0luZGV4QmVmb3JlLCByYW5rQmVmb3JlLCB0ZWFtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAocmFua0FmdGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgY3JlYXRlRmFkZUluKHJhbmtpbmdJbmRleEFmdGVyLCByYW5rQWZ0ZXIsIHRlYW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIFByZXBhcmUgYSBncmFkaWVudCBmb3IgdGhlIGJvdHRvbSBvZiB0aGUgZ3JhcGggdG8gZmFkZSB0byBibGFjay5cclxuICBjb25zdCBncmFkaWVudEhlaWdodCA9IDUwO1xyXG4gIGNvbnN0IGdyYWRpZW50VG9wID0gZ3JhcGhIZWlnaHQgLSBncmFkaWVudEhlaWdodDtcclxuICBjb25zdCBncmFkaWVudEJvdHRvbSA9IGdyYXBoSGVpZ2h0O1xyXG5cclxuICBncmFwaC5jcmVhdGVMaW5lYXJHcmFkaWVudChcImJvdHRvbVwiLCAwLCAwLCAwLCAxLCBcImJsYWNrXCIsIDAsIFwiYmxhY2tcIiwgMSk7XHJcblxyXG4gIC8vIENyZWF0ZSB0aGUgcmVjdGFuZ2xlIHdpdGggdGhlIGdyYWRpZW50IGFwcGxpZWQuXHJcbiAgZ3JhcGguYWRkUmVjdCgwLCBncmFkaWVudFRvcCwgZ3JhcGhXaWR0aCwgZ3JhZGllbnRIZWlnaHQsIFwidXJsKCNib3R0b20pXCIpO1xyXG59XHJcblxyXG4vLyBDaGFuZ2VzIHRoZSBvcGFjaXR5IGZvciBhbGwgcGF0aHMgbWF0Y2hpbmcgdGhlIHRlYW0gbmFtZS5cclxuZnVuY3Rpb24gY2hhbmdlVGVhbU9wYWNpdHkodGVhbU5hbWUsIG9wYWNpdHkpIHtcclxuICBjb25zdCB0ZWFtU2VyaWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZWFtLVwiICsgdGVhbU5hbWUpO1xyXG4gIFtdLmZvckVhY2guY2FsbCh0ZWFtU2VyaWVzLCAocGF0aCkgPT4ge1xyXG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utb3BhY2l0eVwiLCBvcGFjaXR5KTtcclxuICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbC1vcGFjaXR5XCIsIG9wYWNpdHkpO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vLyBIaWdobGlnaHRzIHRoZSBzcGVjaWZpZWQgdGVhbSdzIHBhdGguXHJcbmZ1bmN0aW9uIGhhbmRsZU1vdXNlT3Zlcih0ZWFtTmFtZSkge1xyXG4gIGRhdGEudGVhbXMuZm9yRWFjaCgodGVhbSkgPT4ge1xyXG4gICAgY29uc3Qgb3BhY2l0eSA9IHRlYW1OYW1lID09PSB0ZWFtLnNhZmVUZWFtTmFtZSA/IENhbnZhcy5oaWdobGlnaHRPcGFjaXR5IDogQ2FudmFzLmxvd2xpZ2h0T3BhY2l0eTtcclxuXHJcbiAgICBjaGFuZ2VUZWFtT3BhY2l0eSh0ZWFtLnNhZmVUZWFtTmFtZSwgb3BhY2l0eSk7XHJcbiAgfSk7XHJcbn1cclxuKHdpbmRvdyBhcyBhbnkpLmhhbmRsZU1vdXNlT3ZlciA9IGhhbmRsZU1vdXNlT3ZlcjtcclxuXHJcbi8vIExvd2xpZ2h0cyB0aGUgc3BlY2lmaWVkIHRlYW0ncyBwYXRoLlxyXG5mdW5jdGlvbiBoYW5kbGVNb3VzZU91dCh0ZWFtTmFtZSkge1xyXG4gIGRhdGEudGVhbXMuZm9yRWFjaCgodGVhbSkgPT4ge1xyXG4gICAgY2hhbmdlVGVhbU9wYWNpdHkodGVhbS5zYWZlVGVhbU5hbWUsIENhbnZhcy5ub3JtYWxPcGFjaXR5KTtcclxuICB9KTtcclxufVxyXG4od2luZG93IGFzIGFueSkuaGFuZGxlTW91c2VPdXQgPSBoYW5kbGVNb3VzZU91dDtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKHRlYW1OYW1lKSB7XHJcbiAgY29uc29sZS5sb2codGVhbU5hbWUpO1xyXG4gIGNvbnN0IHRlYW1TZXJpZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRlYW0tXCIgKyB0ZWFtTmFtZSk7XHJcbiAgW10uZm9yRWFjaC5jYWxsKHRlYW1TZXJpZXMsIChwYXRoOiBFbGVtZW50KSA9PiB7XHJcbiAgICBwYXRoLmNsYXNzTGlzdC50b2dnbGUoXCJjbGlja2VkXCIpO1xyXG4gIH0pO1xyXG59XHJcbih3aW5kb3cgYXMgYW55KS5oYW5kbGVDbGljayA9IGhhbmRsZUNsaWNrO1xyXG5cclxuZnVuY3Rpb24gc2hvd0RlZmF1bHREYXRhKCkge1xyXG4gIGRyb3BEb3duUmFua3MoMTApO1xyXG5cclxuICBzZXREcm9wRG93bkRhdGVzKGRhdGEucmFua2luZ3NbZGF0YS5yYW5raW5ncy5sZW5ndGggLSAxMV0sIGRhdGEucmFua2luZ3NbZGF0YS5yYW5raW5ncy5sZW5ndGggLSAxXSk7XHJcbn1cclxuKHdpbmRvdyBhcyBhbnkpLnNob3dEZWZhdWx0RGF0YSA9IHNob3dEZWZhdWx0RGF0YTtcclxuXHJcbmZ1bmN0aW9uIHNob3dBbGxEYXRhKCkge1xyXG4gIGRyb3BEb3duUmFua3MoaGlnaGVzdE51bWJlck9mUmFua3MpO1xyXG5cclxuICBzZXREcm9wRG93bkRhdGVzKGRhdGEucmFua2luZ3NbMF0sIGRhdGEucmFua2luZ3NbZGF0YS5yYW5raW5ncy5sZW5ndGggLSAxXSk7XHJcbn1cclxuKHdpbmRvdyBhcyBhbnkpLnNob3dBbGxEYXRhID0gc2hvd0FsbERhdGE7XHJcblxyXG5zaG93RGVmYXVsdERhdGEoKTtcclxuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmx5b3V0IC50b2dnbGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZseW91dCAuYm9keVwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIpO1xyXG59KTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL2dyYXBoL21haW4udHMiXSwic291cmNlUm9vdCI6IiJ9