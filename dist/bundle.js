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
    setDropDownDates(data.rankings[data.rankings.length - 11], data.rankings[data.rankings.length - 1]);
}
window.showDefaultData = showDefaultData;
function showAllData() {
    setDropDownDates(data.rankings[0], data.rankings[data.rankings.length - 1]);
}
window.showAllData = showAllData;
showDefaultData();
document.querySelector(".flyout .toggle").addEventListener("click", () => {
    document.querySelector(".flyout .body").classList.toggle("hidden");
});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2MxNzcwNjg4OTU3OTliMjNkYTMiLCJ3ZWJwYWNrOi8vLy4vZ3JhcGgvdXRpbGl0aWVzLnRzIiwid2VicGFjazovLy8uL2dyYXBoL2NhbnZhcy50cyIsIndlYnBhY2s6Ly8vLi9ncmFwaC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ2hFQTtBQUFBLGdDQUFnQztBQUNoQyxzQkFBNkIsT0FBZ0I7SUFDM0MsT0FBTyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztBQUNILENBQUM7Ozs7Ozs7OztBQ0x1QztBQUl4QztJQWtCRSxZQUFvQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2xDLG9FQUFvRTtRQUNwRSxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sTUFBTSxHQUFHLE1B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LElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RyxDQUFDO0FBQ0EsTUFBYyxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFFbEQ7SUFDRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBQ0EsTUFBYyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFFMUMsZUFBZSxFQUFFLENBQUM7QUFFbEIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtJQUNsRSxRQUFRLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckUsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiLi9kaXN0L2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDNjMTc3MDY4ODk1Nzk5YjIzZGEzIiwiLy8gRnVuY3Rpb24gdG8gY2xlYXIgYW4gZWxlbWVudC5cclxuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5RWxlbWVudChlbGVtZW50OiBFbGVtZW50KSB7XHJcbiAgd2hpbGUgKGVsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG4gICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3NvdXJjZS1tYXAtbG9hZGVyIS4vZ3JhcGgvdXRpbGl0aWVzLnRzIiwiaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gXCIuL3V0aWxpdGllc1wiO1xyXG5cclxudHlwZSBBdHRyaWJ1dGVUeXBlID0geyBbYXR0cmlidXRlOiBzdHJpbmddOiBzdHJpbmcgfTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW52YXMge1xyXG4gIHB1YmxpYyBzdGF0aWMgbm9ybWFsT3BhY2l0eSA9IDAuMjtcclxuICBwdWJsaWMgc3RhdGljIGhpZ2hsaWdodE9wYWNpdHkgPSAxO1xyXG4gIHB1YmxpYyBzdGF0aWMgbG93bGlnaHRPcGFjaXR5ID0gMC4xO1xyXG4gIHByaXZhdGUgc3RhdGljIHN2Z05zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyBzZXRBdHRyaWJ1dGVzKGVsZW1lbnQ6IEVsZW1lbnQsIGF0dHJpYnV0ZXM6IEF0dHJpYnV0ZVR5cGUpIHtcclxuICAgIGZvciAoY29uc3QgYXR0cmlidXRlIG9mIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpKSB7XHJcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgYXR0cmlidXRlc1thdHRyaWJ1dGVdKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIGNyZWF0ZU5zRWxlbWVudChuYW1lOiBzdHJpbmcpOiBFbGVtZW50IHtcclxuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoQ2FudmFzLnN2Z05zLCBuYW1lKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZGVmaW5pdGlvbnM6IEVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogRWxlbWVudCkge1xyXG4gICAgLy8gQWRkIGEgZGVmaW5pdGlvbnMgc2VjdGlvbiB0byB0aGUgZ3JhcGggZm9yIGdyYWRpZW50IGRlY2xhcmF0aW9ucy5cclxuICAgIHRoaXMuZGVmaW5pdGlvbnMgPSBDYW52YXMuY3JlYXRlTnNFbGVtZW50KFwiZGVmc1wiKTtcclxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRlZmluaXRpb25zKTtcclxuXHJcbiAgICBjb25zdCBzdHlsZXMgPSBDYW52YXMuY3JlYXRlTnNFbGVtZW50KFwic3R5bGVcIik7XHJcbiAgICBzdHlsZXMuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHQvY3NzXCIpO1xyXG4gICAgc3R5bGVzLmlubmVySFRNTCA9IGBcclxuPCFbQ0RBVEFbXHJcbiAgLmNsaWNrZWQge1xyXG4gICAgc3Ryb2tlLW9wYWNpdHk6IDE7XHJcbiAgICBmaWxsLW9wYWNpdHk6IDE7XHJcbiAgfVxyXG5dXT5gO1xyXG4gICAgdGhpcy5kZWZpbml0aW9ucy5hcHBlbmRDaGlsZChzdHlsZXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG4gICAgVXRpbGl0aWVzLmVtcHR5RWxlbWVudCh0aGlzLmVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldERpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCB3aWR0aC50b1N0cmluZygpKTtcclxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgaGVpZ2h0LnRvU3RyaW5nKCkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZFRleHQoXHJcbiAgICB2YWx1ZTogc3RyaW5nLFxyXG4gICAgeDogbnVtYmVyLFxyXG4gICAgeTogbnVtYmVyLFxyXG4gICAgY29sb3I6IHN0cmluZyxcclxuICAgIGZvbnRTaXplOiBudW1iZXIsXHJcbiAgICBjbGFzc05hbWU6IHN0cmluZyxcclxuICAgIG9wYWNpdHk6IG51bWJlcixcclxuICApIHtcclxuICAgIGNvbnN0IHRleHQgPSBDYW52YXMuY3JlYXRlTnNFbGVtZW50KFwidGV4dFwiKTtcclxuXHJcbiAgICBDYW52YXMuc2V0QXR0cmlidXRlcyhcclxuICAgICAgdGV4dCxcclxuICAgICAge1xyXG4gICAgICAgIFwiY2xhc3NcIjogY2xhc3NOYW1lLFxyXG4gICAgICAgIFwiZmlsbFwiOiBjb2xvcixcclxuICAgICAgICBcImZpbGwtb3BhY2l0eVwiOiBvcGFjaXR5LnRvU3RyaW5nKCksXHJcbiAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkFyaWFsXCIsXHJcbiAgICAgICAgXCJmb250LXNpemVcIjogZm9udFNpemUudG9TdHJpbmcoKSxcclxuICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsXHJcbiAgICAgICAgXCJ4XCI6IHgudG9TdHJpbmcoKSxcclxuICAgICAgICBcInlcIjogeS50b1N0cmluZygpLFxyXG4gICAgICB9LFxyXG4gICAgKTtcclxuXHJcbiAgICB0ZXh0LmlubmVySFRNTCA9IHZhbHVlO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRMaW5lKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIGNvbG9yOiBzdHJpbmcsIHdpZHRoOiBudW1iZXIsIGRhc2hlczogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBsaW5lID0gQ2FudmFzLmNyZWF0ZU5zRWxlbWVudChcImxpbmVcIik7XHJcblxyXG4gICAgQ2FudmFzLnNldEF0dHJpYnV0ZXMoXHJcbiAgICAgIGxpbmUsXHJcbiAgICAgIHtcclxuICAgICAgICBcInN0cm9rZVwiOiBjb2xvcixcclxuICAgICAgICBcInN0cm9rZS1kYXNoYXJyYXlcIjogZGFzaGVzLFxyXG4gICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IHdpZHRoLnRvU3RyaW5nKCksXHJcbiAgICAgICAgXCJ4MVwiOiB4MS50b1N0cmluZygpLFxyXG4gICAgICAgIFwieDJcIjogeDIudG9TdHJpbmcoKSxcclxuICAgICAgICBcInkxXCI6IHkxLnRvU3RyaW5nKCksXHJcbiAgICAgICAgXCJ5MlwiOiB5Mi50b1N0cmluZygpLFxyXG4gICAgICB9LFxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQobGluZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY3JlYXRlTGluZWFyR3JhZGllbnQoXHJcbiAgICBpZDogc3RyaW5nLFxyXG4gICAgeDE6IG51bWJlcixcclxuICAgIHkxOiBudW1iZXIsXHJcbiAgICB4MjogbnVtYmVyLFxyXG4gICAgeTI6IG51bWJlcixcclxuICAgIHN0YXJ0Q29sb3I6IHN0cmluZyxcclxuICAgIHN0YXJ0T3BhY2l0eTogbnVtYmVyLFxyXG4gICAgc3RvcENvbG9yOiBzdHJpbmcsXHJcbiAgICBzdG9wT3BhY2l0eTogbnVtYmVyLFxyXG4gICkge1xyXG4gICAgLy8gQWRkIGEgbmV3IGdyYWRpZW50IHRvIHRoZSBkZWZpbml0aW9ucy5cclxuICAgIGNvbnN0IGdyYWRpZW50ID0gQ2FudmFzLmNyZWF0ZU5zRWxlbWVudChcImxpbmVhckdyYWRpZW50XCIpO1xyXG4gICAgQ2FudmFzLnNldEF0dHJpYnV0ZXMoXHJcbiAgICAgIGdyYWRpZW50LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICBcIngxXCI6IHgxLnRvU3RyaW5nKCksXHJcbiAgICAgICAgXCJ4MlwiOiB4Mi50b1N0cmluZygpLFxyXG4gICAgICAgIFwieTFcIjogeTEudG9TdHJpbmcoKSxcclxuICAgICAgICBcInkyXCI6IHkyLnRvU3RyaW5nKCksXHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG4gICAgdGhpcy5kZWZpbml0aW9ucy5hcHBlbmRDaGlsZChncmFkaWVudCk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHRoZSB0cmFuc3BhcmVudCBncmFkaWVudCBzdG9wLlxyXG4gICAgY29uc3QgdG9wU3RvcCA9IENhbnZhcy5jcmVhdGVOc0VsZW1lbnQoXCJzdG9wXCIpO1xyXG4gICAgQ2FudmFzLnNldEF0dHJpYnV0ZXMoXHJcbiAgICAgIHRvcFN0b3AsXHJcbiAgICAgIHtcclxuICAgICAgICBcIm9mZnNldFwiOiBcIjAlXCIsXHJcbiAgICAgICAgXCJzdG9wLWNvbG9yXCI6IHN0YXJ0Q29sb3IsXHJcbiAgICAgICAgXCJzdG9wLW9wYWNpdHlcIjogc3RhcnRPcGFjaXR5LnRvU3RyaW5nKCksXHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG4gICAgZ3JhZGllbnQuYXBwZW5kQ2hpbGQodG9wU3RvcCk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHRoZSBzb2xpZCBncmFkaWVudCBzdG9wLlxyXG4gICAgY29uc3QgYm90dG9tU3RvcCA9IENhbnZhcy5jcmVhdGVOc0VsZW1lbnQoXCJzdG9wXCIpO1xyXG4gICAgQ2FudmFzLnNldEF0dHJpYnV0ZXMoXHJcbiAgICAgIGJvdHRvbVN0b3AsXHJcbiAgICAgIHtcclxuICAgICAgICBcIm9mZnNldFwiOiBcIjEwMCVcIixcclxuICAgICAgICBcInN0b3AtY29sb3JcIjogc3RvcENvbG9yLFxyXG4gICAgICAgIFwic3RvcC1vcGFjaXR5XCI6IHN0b3BPcGFjaXR5LnRvU3RyaW5nKCksXHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG4gICAgZ3JhZGllbnQuYXBwZW5kQ2hpbGQoYm90dG9tU3RvcCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkQ3VydmUoXHJcbiAgICB4MTogbnVtYmVyLFxyXG4gICAgeTE6IG51bWJlcixcclxuICAgIHgyOiBudW1iZXIsXHJcbiAgICB5MjogbnVtYmVyLFxyXG4gICAgY29sb3I6IHN0cmluZyxcclxuICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBzb2Z0bmVzczogbnVtYmVyLFxyXG4gICk6IHZvaWQge1xyXG4gICAgLy8gQWRkIHRoZSBjdXJ2ZS5cclxuICAgIGxldCBwYXRoRGVmaW5pdGlvbiA9IGBNICR7eDF9ICR7eTF9IEMgJHt4MSArIHNvZnRuZXNzfSAke3kxfSwgJHt4MiAtIHNvZnRuZXNzfSAke3kyfSwgJHt4Mn0gJHt5Mn1gO1xyXG5cclxuICAgIC8vIENyZWF0ZSB0aGUgY3VydmUgZWxlbWVudC5cclxuICAgIGNvbnN0IGxpbmUgPSBDYW52YXMuY3JlYXRlTnNFbGVtZW50KFwicGF0aFwiKTtcclxuICAgIENhbnZhcy5zZXRBdHRyaWJ1dGVzKFxyXG4gICAgICBsaW5lLFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJjbGFzc1wiOiBgdGVhbS0ke25hbWV9YCxcclxuICAgICAgICBcImRcIjogcGF0aERlZmluaXRpb24sXHJcbiAgICAgICAgXCJmaWxsXCI6IFwidHJhbnNwYXJlbnRcIixcclxuICAgICAgICBcIm9uY2xpY2tcIjogYGhhbmRsZUNsaWNrKFwiJHtuYW1lfVwiKTtgLFxyXG4gICAgICAgIFwib25tb3VzZW91dFwiOiBgaGFuZGxlTW91c2VPdXQoXCIke25hbWV9XCIpO2AsXHJcbiAgICAgICAgXCJvbm1vdXNlb3ZlclwiOiBgaGFuZGxlTW91c2VPdmVyKFwiJHtuYW1lfVwiKTtgLFxyXG4gICAgICAgIFwic3Ryb2tlXCI6IGNvbG9yLFxyXG4gICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogQ2FudmFzLm5vcm1hbE9wYWNpdHkudG9TdHJpbmcoKSxcclxuICAgICAgICBcInN0cm9rZS13aWR0aFwiOiB3aWR0aC50b1N0cmluZygpLFxyXG4gICAgICB9LFxyXG4gICAgKTtcclxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChsaW5lKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRDdXJ2ZVJlY3QoXHJcbiAgICB4OiBudW1iZXIsXHJcbiAgICB5OiBudW1iZXIsXHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICBjb2xvcjogc3RyaW5nLFxyXG4gICAgb3BhY2l0eTpcclxuICAgIG51bWJlcixcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICApIHtcclxuICAgIGNvbnN0IHJlY3QgPSBDYW52YXMuY3JlYXRlTnNFbGVtZW50KFwicmVjdFwiKTtcclxuXHJcbiAgICBDYW52YXMuc2V0QXR0cmlidXRlcyhcclxuICAgICAgcmVjdCxcclxuICAgICAge1xyXG4gICAgICAgIFwiY2xhc3NcIjogXCJ0ZWFtLVwiICsgbmFtZSxcclxuICAgICAgICBcImZpbGxcIjogY29sb3IsXHJcbiAgICAgICAgXCJmaWxsLW9wYWNpdHlcIjogb3BhY2l0eS50b1N0cmluZygpLFxyXG4gICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodC50b1N0cmluZygpLFxyXG4gICAgICAgIFwib25jbGlja1wiOiBgaGFuZGxlQ2xpY2soXCIke25hbWV9XCIpO2AsXHJcbiAgICAgICAgXCJvbm1vdXNlb3V0XCI6IGBoYW5kbGVNb3VzZU91dChcIiR7bmFtZX1cIik7YCxcclxuICAgICAgICBcIm9ubW91c2VvdmVyXCI6IGBoYW5kbGVNb3VzZU92ZXIoXCIke25hbWV9XCIpO2AsXHJcbiAgICAgICAgXCJ3aWR0aFwiOiB3aWR0aC50b1N0cmluZygpLFxyXG4gICAgICAgIFwieFwiOiB4LnRvU3RyaW5nKCksXHJcbiAgICAgICAgXCJ5XCI6IHkudG9TdHJpbmcoKSxcclxuICAgICAgfSxcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHJlY3QpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZFJlY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjb2xvcjogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZWN0ID0gQ2FudmFzLmNyZWF0ZU5zRWxlbWVudChcInJlY3RcIik7XHJcblxyXG4gICAgQ2FudmFzLnNldEF0dHJpYnV0ZXMoXHJcbiAgICAgIHJlY3QsXHJcbiAgICAgIHtcclxuICAgICAgICBmaWxsOiBjb2xvcixcclxuICAgICAgICBoZWlnaHQ6IGhlaWdodC50b1N0cmluZygpLFxyXG4gICAgICAgIHdpZHRoOiB3aWR0aC50b1N0cmluZygpLFxyXG4gICAgICAgIHg6IHgudG9TdHJpbmcoKSxcclxuICAgICAgICB5OiB5LnRvU3RyaW5nKCksXHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChyZWN0KTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9zb3VyY2UtbWFwLWxvYWRlciEuL2dyYXBoL2NhbnZhcy50cyIsImltcG9ydCB7Q2FudmFzfSBmcm9tIFwiLi9jYW52YXNcIjtcclxuaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gXCIuL3V0aWxpdGllc1wiO1xyXG5cclxuZGVjbGFyZSB2YXIgZGF0YTogRGF0YUZvcm1hdDtcclxuXHJcbmNvbnN0IGdyYXBoID0gbmV3IENhbnZhcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyYXBoXCIpKTtcclxuXHJcbi8vIFBhcnNlIGRhdGVzIGFuZCBmaW5kIHRoZSBoaWdoZXN0IG51bWJlciBvZiByYW5rcy5cclxubGV0IGhpZ2hlc3ROdW1iZXJPZlJhbmtzID0gMDtcclxuZGF0YS5yYW5raW5ncy5mb3JFYWNoKChyYW5raW5nKSA9PiB7XHJcbiAgaGlnaGVzdE51bWJlck9mUmFua3MgPSBNYXRoLm1heChoaWdoZXN0TnVtYmVyT2ZSYW5rcywgcmFua2luZy5yYW5rcy5sZW5ndGgpO1xyXG4gIHJhbmtpbmcuZGF0ZSA9IG5ldyBEYXRlKHJhbmtpbmcuZGF0ZSk7XHJcbn0pO1xyXG5cclxuLy8gRW5zdXJlIHRoZSByYW5raW5ncyBhcmUgc29ydGVkLlxyXG5kYXRhLnJhbmtpbmdzID0gZGF0YS5yYW5raW5ncy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgcmV0dXJuIChhLmRhdGUgYXMgRGF0ZSkuZ2V0VGltZSgpIC0gKGIuZGF0ZSBhcyBEYXRlKS5nZXRUaW1lKCk7XHJcbn0pO1xyXG5cclxuLy8gR3JhYiB0aGUgZHJvcC1kb3ducyBmcm9tIHRoZSBET00uXHJcbmNvbnN0IGRhdGVGcm9tRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGF0ZUZyb21cIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbmNvbnN0IGRhdGVUb0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RhdGVUb1wiKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuY29uc3QgdG9wTlJhbmtzRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdG9wTlJhbmtzXCIpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cclxuLy8gRnVuY3Rpb24gdG8gZm9ybWF0IGRhdGVzIGluIHRoZSBmb3JtYXQgZm9yIGRyb3AtZG93bnMuXHJcbmZ1bmN0aW9uIGdldERyb3BEb3duRGF0ZShkYXRlOiBEYXRlKTogc3RyaW5nIHtcclxuICByZXR1cm4gZGF0ZS50b0RhdGVTdHJpbmcoKS5zdWJzdHJpbmcoNCk7XHJcbn1cclxuXHJcbmxldCB0b3BOUmFua3MgPSAzMDtcclxuXHJcbi8vIEZ1bmN0aW9uIHRvIHVwZGF0ZSB0aGUgZGF0ZXMgZHJvcGRvd24gbGlzdCBhbmQgcmUtZGlzcGxheSB0aGUgZ3JhcGguXHJcbmZ1bmN0aW9uIHNldERyb3BEb3duRGF0ZXMoZmlyc3QsIGxhc3QpIHtcclxuICBmdW5jdGlvbiBhZGREYXRlVG9TZWxlY3RvcihkYXRlOiBEYXRlLCBzZWxlY3RvcjogSFRNTFNlbGVjdEVsZW1lbnQsIGlzU2VsZWN0ZWQ6IGJvb2xlYW4sIGlzRW5hYmxlZDogYm9vbGVhbikge1xyXG4gICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBnZXREcm9wRG93bkRhdGUoZGF0ZSk7XHJcbiAgICBvcHRpb24udGV4dCA9IGRhdGVTdHJpbmc7XHJcbiAgICBvcHRpb24udmFsdWUgPSBkYXRlU3RyaW5nO1xyXG4gICAgb3B0aW9uLnNlbGVjdGVkID0gaXNTZWxlY3RlZDtcclxuICAgIG9wdGlvbi5kaXNhYmxlZCA9ICFpc0VuYWJsZWQ7XHJcbiAgICBzZWxlY3Rvci5hZGQob3B0aW9uKTtcclxuICB9XHJcblxyXG4gIFV0aWxpdGllcy5lbXB0eUVsZW1lbnQoZGF0ZUZyb21FbGVtZW50KTtcclxuICBVdGlsaXRpZXMuZW1wdHlFbGVtZW50KGRhdGVUb0VsZW1lbnQpO1xyXG5cclxuICBkYXRhLnJhbmtpbmdzLmZvckVhY2goKHJhbmtpbmcpID0+IHtcclxuICAgIGFkZERhdGVUb1NlbGVjdG9yKHJhbmtpbmcuZGF0ZSBhcyBEYXRlLCBkYXRlRnJvbUVsZW1lbnQsIHJhbmtpbmcgPT09IGZpcnN0LCByYW5raW5nLmRhdGUgPCBsYXN0LmRhdGUpO1xyXG4gICAgYWRkRGF0ZVRvU2VsZWN0b3IocmFua2luZy5kYXRlIGFzIERhdGUsIGRhdGVUb0VsZW1lbnQsIHJhbmtpbmcgPT09IGxhc3QsIHJhbmtpbmcuZGF0ZSA+IGZpcnN0LmRhdGUpO1xyXG4gIH0pO1xyXG5cclxuICBkaXNwbGF5R3JhcGgoZmlyc3QsIGxhc3QpO1xyXG59XHJcblxyXG4vLyBGdW5jdGlvbiB0byBhc3Nlc3MgZHJvcGRvd25zIGFuZCByZWxvYWQgdGhlIGdyYXBoLlxyXG5mdW5jdGlvbiByZWZyZXNoR3JhcGgoKSB7XHJcbiAgZnVuY3Rpb24gZmluZFJhbmtpbmcoZGF0ZVN0cmluZzogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZGF0YS5yYW5raW5ncy5maW5kKChyYW5raW5nKSA9PiB7XHJcbiAgICAgIHJldHVybiBnZXREcm9wRG93bkRhdGUocmFua2luZy5kYXRlIGFzIERhdGUpID09PSBkYXRlU3RyaW5nO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkcm9wRG93blJhbmtzKHBhcnNlSW50KHRvcE5SYW5rc0VsZW1lbnQudmFsdWUsIDEwKSk7XHJcblxyXG4gIHNldERyb3BEb3duRGF0ZXMoZmluZFJhbmtpbmcoZGF0ZUZyb21FbGVtZW50LnZhbHVlKSwgZmluZFJhbmtpbmcoZGF0ZVRvRWxlbWVudC52YWx1ZSkpO1xyXG59XHJcblxyXG4vLyBGdW5jdGlvbiB0byB1cGRhdGUgdGhlIHRvcCBuIHJhbmtzIGRyb3Bkb3duLlxyXG5mdW5jdGlvbiBkcm9wRG93blJhbmtzKHNlbGVjdGVkKSB7XHJcbiAgdG9wTlJhbmtzID0gc2VsZWN0ZWQ7XHJcblxyXG4gIGZ1bmN0aW9uIGFkZFJhbmsocmFua051bWJlcikge1xyXG4gICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgIGNvbnN0IHJhbmtTdHJpbmcgPSByYW5rTnVtYmVyLnRvU3RyaW5nKCk7XHJcbiAgICBvcHRpb24udGV4dCA9IHJhbmtTdHJpbmc7XHJcbiAgICBvcHRpb24udmFsdWUgPSByYW5rU3RyaW5nO1xyXG4gICAgb3B0aW9uLnNlbGVjdGVkID0gc2VsZWN0ZWQgPT09IHJhbmtOdW1iZXI7XHJcbiAgICB0b3BOUmFua3NFbGVtZW50LmFkZChvcHRpb24pO1xyXG4gIH1cclxuXHJcbiAgVXRpbGl0aWVzLmVtcHR5RWxlbWVudCh0b3BOUmFua3NFbGVtZW50KTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gaGlnaGVzdE51bWJlck9mUmFua3M7IGkrKykge1xyXG4gICAgYWRkUmFuayhpKTtcclxuICB9XHJcbn1cclxuXHJcbmRyb3BEb3duUmFua3MoMTApO1xyXG5cclxuY29uc3QgcGFkZGluZ1RvcCA9IDEwMDtcclxuY29uc3QgcGFkZGluZ0xlZnQgPSA1MDtcclxuY29uc3QgcGFkZGluZ1JpZ2h0ID0gNTA7XHJcbmNvbnN0IHBhZGRpbmdCb3R0b20gPSA1MDtcclxuXHJcbmNvbnN0IG1vbnRocyA9IG5ldyBBcnJheShcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiKTtcclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlHcmFwaChmaXJzdFJhbmtpbmcsIGxhc3RSYW5raW5nKSB7XHJcbiAgZ3JhcGguY2xlYXIoKTtcclxuXHJcbiAgbGV0IHNlbGVjdGluZyA9IGZhbHNlO1xyXG4gIGNvbnN0IGFjdGl2ZVJhbmtpbmdzID0gZGF0YS5yYW5raW5ncy5maWx0ZXIoKHJhbmtpbmcpID0+IHtcclxuICAgIGlmIChyYW5raW5nID09PSBmaXJzdFJhbmtpbmcpIHtcclxuICAgICAgc2VsZWN0aW5nID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3VsdCA9IHNlbGVjdGluZztcclxuICAgIGlmIChyYW5raW5nID09PSBsYXN0UmFua2luZykge1xyXG4gICAgICBzZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSk7XHJcblxyXG4gIC8vIERpc3RyaWJ1dGUgdGhlIHZlcnRpY2FsIHNwYWNlIGJldHdlZW4gdGhlIG51bWJlciBvZiByYW5raW5ncy5cclxuICBjb25zdCBudW1iZXJPZlJhbmtpbmdzID0gYWN0aXZlUmFua2luZ3MubGVuZ3RoO1xyXG4gIGNvbnN0IHNwYWNpbmdQZXJSYW5raW5nID0gMTYwO1xyXG5cclxuICAvLyBEaXN0cmlidXRlIHRoZSBob3Jpem9udGFsIHNwYWNlIGJldHdlZW4gdGhlIG51bWJlciBvZiByYW5rcy5cclxuICBjb25zdCBudW1iZXJPZlJhbmtzID0gdG9wTlJhbmtzO1xyXG4gIGNvbnN0IHNwYWNpbmdQZXJSYW5rID0gNjA7XHJcblxyXG4gIC8vIFNldCB0aGUgZGltZW5zaW9uc1xyXG4gIGNvbnN0IGdyYXBoV2lkdGggPSBzcGFjaW5nUGVyUmFua2luZyAqIG51bWJlck9mUmFua2luZ3M7XHJcbiAgY29uc3QgZ3JhcGhIZWlnaHQgPSBzcGFjaW5nUGVyUmFuayAqIG51bWJlck9mUmFua3M7XHJcbiAgZ3JhcGguc2V0RGltZW5zaW9ucyhncmFwaFdpZHRoLCBncmFwaEhlaWdodCk7XHJcblxyXG4gIC8vIEFwcGx5IHNvbWUgcGFkZGluZyB0byB0aGUgZ3JhcGggYXJlYSBzbyB0aGF0IHRoZSBwb2ludHMgYXJlIG5vdCBwcmVzc2VkIHVwIGFnYWluc3QgdGhlIHNpZGUuXHJcbiAgY29uc3QgcmVtYWluaW5nSGVpZ2h0ID0gZ3JhcGhIZWlnaHQgLSBwYWRkaW5nVG9wIC0gcGFkZGluZ0JvdHRvbTtcclxuICBjb25zdCByZW1haW5pbmdXaWR0aCA9IGdyYXBoV2lkdGggLSBwYWRkaW5nTGVmdCAtIHBhZGRpbmdSaWdodDtcclxuXHJcbiAgLy8gUG9wdWxhdGUgYSBjb2xsZWN0aW9uIGNvbnRhaW5pbmcgYWxsIHRoZSBwbGF5ZXJzLlxyXG4gIC8vIE5vdCBjdXJyZW50bHkgdXNlZC5cclxuICBhY3RpdmVSYW5raW5ncy5mb3JFYWNoKChyYW5raW5nKSA9PiB7XHJcbiAgICByYW5raW5nLnJhbmtzLmZvckVhY2goKHJhbmssIHJhbmtJbmRleCkgPT4ge1xyXG4gICAgICByYW5rLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcbiAgICAgICAgLy8gQXR0ZW1wdCB0byBmaW5kIHRoZSBleGlzdGluZyBwbGF5ZXIuXHJcbiAgICAgICAgbGV0IG5ld1BsYXllcjtcclxuICAgICAgICBpZiAoZGF0YS5wbGF5ZXJzW3BsYXllci5wbGF5ZXJdKSB7XHJcbiAgICAgICAgICBuZXdQbGF5ZXIgPSBkYXRhLnBsYXllcnNbcGxheWVyLnBsYXllcl07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIFBvcHVsYXRlIGEgZnJlc2ggcGxheWVyIHdpdGggZW1wdHkgcmFua2luZ3MuXHJcbiAgICAgICAgICBuZXdQbGF5ZXIgPSB7XHJcbiAgICAgICAgICAgIHRlYW1zOiBbXSxcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgYWN0aXZlUmFua2luZ3MuZm9yRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIG5ld1BsYXllci50ZWFtcy5wdXNoKG51bGwpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGF0YS5wbGF5ZXJzW3BsYXllci5wbGF5ZXJdID0gbmV3UGxheWVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUHV0IHRoZSB0ZWFtIGludG8gdGhlIHBsYXllcidzIGhpc3RvcnkuXHJcbiAgICAgICAgbmV3UGxheWVyLnRlYW1zW3JhbmtJbmRleF0gPSByYW5rLnRlYW07XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIERlbm9ybWFsaXplIHRoZSByYW5rIG9mIGVhY2ggdGVhbSBmb3IgZXZlcnkgcmFua2luZy5cclxuICBkYXRhLnRlYW1zLmZvckVhY2goKHRlYW0pID0+IHtcclxuICAgIC8vIEdldCB0aGVpciByYW5raW5ncy5cclxuICAgIHRlYW0ucmFua3MgPSBbXTtcclxuICAgIGFjdGl2ZVJhbmtpbmdzLmZvckVhY2goKHJhbmtpbmcpID0+IHtcclxuICAgICAgLy8gQWRkIHRoZSB0ZWFtJ3MgcmFuaywgb3RoZXJ3aXNlIG51bGwuXHJcbiAgICAgIGNvbnN0IGZvdW5kUmFuayA9IHJhbmtpbmcucmFua3MuZmluZCgocmFuaykgPT4ge1xyXG4gICAgICAgIHJldHVybiByYW5rLnRlYW0gPT09IHRlYW0ubmFtZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0ZWFtLnJhbmtzLnB1c2goZm91bmRSYW5rID8gZm91bmRSYW5rLnBvc2l0aW9uIDogbnVsbCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgLy8gRHJhdyBob3Jpem9udGFsIGdyaWRsaW5lcy5cclxuICBhY3RpdmVSYW5raW5ncy5mb3JFYWNoKChyYW5raW5nLCByYW5raW5nSW5kZXgpID0+IHtcclxuICAgIGNvbnN0IHhQb3NpdGlvbiA9IChyYW5raW5nSW5kZXggKiBzcGFjaW5nUGVyUmFua2luZykgKyBwYWRkaW5nTGVmdDtcclxuXHJcbiAgICBncmFwaC5hZGRMaW5lKHhQb3NpdGlvbiwgMCwgeFBvc2l0aW9uLCBncmFwaEhlaWdodCwgXCIjMzMzMzMzXCIsIDEsIFwiNSwgNVwiKTtcclxuXHJcbiAgICBjb25zdCByYW5raW5nRGF0ZSA9IHJhbmtpbmcuZGF0ZSBhcyBEYXRlO1xyXG4gICAgY29uc3QgZGF5QW5kTW9udGggPSByYW5raW5nRGF0ZS5nZXREYXRlKCkgKyBcIiBcIiArIG1vbnRoc1tyYW5raW5nRGF0ZS5nZXRNb250aCgpXTtcclxuICAgIGNvbnN0IHllYXIgPSByYW5raW5nRGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgZ3JhcGguYWRkVGV4dChkYXlBbmRNb250aCwgeFBvc2l0aW9uLCAyMCwgXCJ3aGl0ZVwiLCAxMiwgXCJcIiwgMSk7XHJcbiAgICBncmFwaC5hZGRUZXh0KHllYXIsIHhQb3NpdGlvbiwgNDAsIFwid2hpdGVcIiwgMTIsIFwiXCIsIDEpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBEcmF3IHZlcnRpY2FsIGdyaWRsaW5lcy5cclxuICBhY3RpdmVSYW5raW5nc1swXS5yYW5rcy5mb3JFYWNoKChyYW5raW5nLCByYW5raW5nSW5kZXgpID0+IHtcclxuICAgIGNvbnN0IHlQb3NpdGlvbiA9IChyYW5raW5nSW5kZXggKiBzcGFjaW5nUGVyUmFuaykgKyBwYWRkaW5nVG9wO1xyXG5cclxuICAgIGdyYXBoLmFkZExpbmUoMCwgeVBvc2l0aW9uLCBncmFwaFdpZHRoLCB5UG9zaXRpb24sIFwiIzMzMzMzM1wiLCAxLCBcIjUsIDVcIik7XHJcbiAgfSk7XHJcblxyXG4gIC8vIENhbGN1bGF0ZSBob3cgdG8gcGxhY2UgdGhlIGN1cnZlIGFuY2hvciBwb2ludHMuXHJcbiAgY29uc3QgY3VydmVTb2Z0bmVzcyA9IHNwYWNpbmdQZXJSYW5raW5nICogMC43NTtcclxuICBjb25zdCBjdXJ2ZVdpZHRoID0gMTA7XHJcbiAgY29uc3QgY3VydmVGYWRlID0gc3BhY2luZ1BlclJhbmtpbmcgKiAwLjI1O1xyXG5cclxuICAvLyBHZXRzIHRoZSByYW5rIGZvciBhIHRlYW0gaW4gdGhlIGdpdmVuIHNldCBvZiByYW5raW5ncy5cclxuICBmdW5jdGlvbiBnZXRSYW5rKHRlYW0sIHJhbmtpbmdJbmRleCkge1xyXG4gICAgLy8gV2UgbWlnaHQgYmUgcG9pbnRpbmcgdG8gYSByYW5raW5nIHdoaWNoIGRvZXNuJ3QgZXhpc3QuXHJcbiAgICAvLyBEdXBsaWNhdGUgdGhlIHJhbmtpbmcgdG8ga2VlcCBhIGZsYXQgbGluZSBhdCB0aGUgZ3JhcGgncyBlZGdlcy5cclxuICAgIHJhbmtpbmdJbmRleCA9IE1hdGgubWluKE1hdGgubWF4KHJhbmtpbmdJbmRleCwgMCksIG51bWJlck9mUmFua2luZ3MgLSAxKTtcclxuXHJcbiAgICAvLyBGaW5kIHRoZSByYW5rIGF0IHRoZSBnaXZlbiByYW5raW5ncy5cclxuICAgIHJldHVybiB0ZWFtLnJhbmtzW3JhbmtpbmdJbmRleF07XHJcbiAgfVxyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIGxpbmUncyB4IHBvc2l0aW9uIGF0IHRoZSBnaXZlbiByYW5raW5nLlxyXG4gIGZ1bmN0aW9uIGdldFhQb3NpdGlvbihyYW5rSW5kZXgpIHtcclxuICAgIHJldHVybiAocmFua0luZGV4ICogc3BhY2luZ1BlclJhbmtpbmcpICsgcGFkZGluZ0xlZnQ7XHJcbiAgfVxyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIGxpbmUncyB5IHBvc2l0aW9uIGF0IHRoZSBnaXZlbiByYW5raW5nLlxyXG4gIGZ1bmN0aW9uIGdldFlQb3NpdGlvbihyYW5rKSB7XHJcbiAgICAvLyBEZWNyZW1lbnQgdGhlIHJhbmtpbmdzIHNvIHRoYXQgaXQgaXMgMC1iYXNlZCByYXRoZXIgdGhhbiAxLWJhc2VkLlxyXG4gICAgcmFuayA9IHJhbmsgLSAxO1xyXG5cclxuICAgIHJldHVybiAocmFuayAqIHNwYWNpbmdQZXJSYW5rKSArIHBhZGRpbmdUb3A7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVMYWJlbCh0ZWFtLCByYW5raW5nSW5kZXgsIHJhbmspIHtcclxuICAgIGlmIChyYW5raW5nSW5kZXggPCBudW1iZXJPZlJhbmtpbmdzICYmIHJhbmsgPD0gbnVtYmVyT2ZSYW5rcykge1xyXG4gICAgICBjb25zdCB5UG9zaXRpb24gPSBnZXRZUG9zaXRpb24ocmFuayk7XHJcbiAgICAgIGNvbnN0IHhQb3NpdGlvbiA9IGdldFhQb3NpdGlvbihyYW5raW5nSW5kZXgpO1xyXG5cclxuICAgICAgY29uc3QgbGFiZWxDbGFzcyA9IFwidGVhbS1cIiArIHRlYW0uc2FmZVRlYW1OYW1lO1xyXG4gICAgICBjb25zdCBsYWJlbFRleHQgPSB0ZWFtLm5hbWUgKyBcIiAoXCIgKyByYW5rICsgXCIpXCI7XHJcbiAgICAgIGNvbnN0IGxhYmVsQ29sb3IgPSB0ZWFtLnRleHRDb2xvciB8fCB0ZWFtLmNvbG9yO1xyXG5cclxuICAgICAgZ3JhcGguYWRkVGV4dChsYWJlbFRleHQsIHhQb3NpdGlvbiwgeVBvc2l0aW9uIC0gMjAsIGxhYmVsQ29sb3IsIDEyLCBsYWJlbENsYXNzLCBDYW52YXMubm9ybWFsT3BhY2l0eSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVDdXJ2ZShyYW5raW5nSW5kZXhCZWZvcmUsIHJhbmtpbmdJbmRleEFmdGVyLCByYW5rQmVmb3JlLCByYW5rQWZ0ZXIsIHRlYW0pIHtcclxuICAgIGNyZWF0ZUxhYmVsKHRlYW0sIHJhbmtpbmdJbmRleEFmdGVyLCByYW5rQWZ0ZXIpO1xyXG5cclxuICAgIGdyYXBoLmFkZEN1cnZlKFxyXG4gICAgICBnZXRYUG9zaXRpb24ocmFua2luZ0luZGV4QmVmb3JlKSxcclxuICAgICAgZ2V0WVBvc2l0aW9uKHJhbmtCZWZvcmUpLFxyXG4gICAgICBnZXRYUG9zaXRpb24ocmFua2luZ0luZGV4QWZ0ZXIpLFxyXG4gICAgICBnZXRZUG9zaXRpb24ocmFua0FmdGVyKSxcclxuICAgICAgdGVhbS5jb2xvcixcclxuICAgICAgY3VydmVXaWR0aCxcclxuICAgICAgdGVhbS5zYWZlVGVhbU5hbWUsXHJcbiAgICAgIGN1cnZlU29mdG5lc3MsXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlRmFkZU91dChyYW5raW5nSW5kZXhCZWZvcmUsIHJhbmtCZWZvcmUsIHRlYW0pIHtcclxuICAgIGNvbnN0IHlQb3NpdGlvbiA9IGdldFlQb3NpdGlvbihyYW5rQmVmb3JlKSAtIChjdXJ2ZVdpZHRoIC8gMik7XHJcbiAgICBjb25zdCBoZWlnaHQgPSBjdXJ2ZVdpZHRoO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSB0aGUgeSBwb3NpdGlvbiBiZWZvcmUgYW5kIGFmdGVyIHRoZSB0cmFuc2l0aW9uLlxyXG4gICAgY29uc3QgeFBvc2l0aW9uID0gZ2V0WFBvc2l0aW9uKHJhbmtpbmdJbmRleEJlZm9yZSk7XHJcbiAgICBjb25zdCB3aWR0aCA9IGN1cnZlRmFkZTtcclxuXHJcbiAgICBjb25zdCBncmFkaWVudE5hbWUgPSB0ZWFtLnNhZmVUZWFtTmFtZSArIFwiX2JlZm9yZV9cIiArIHJhbmtpbmdJbmRleEJlZm9yZTtcclxuICAgIGdyYXBoLmNyZWF0ZUxpbmVhckdyYWRpZW50KGdyYWRpZW50TmFtZSwgMCwgMCwgMSwgMCwgdGVhbS5jb2xvciwgMSwgdGVhbS5jb2xvciwgMCk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHRoZSByZWN0YW5nbGUgd2l0aCB0aGUgZ3JhZGllbnQgYXBwbGllZC5cclxuICAgIGdyYXBoLmFkZEN1cnZlUmVjdChcclxuICAgICAgeFBvc2l0aW9uLFxyXG4gICAgICB5UG9zaXRpb24sXHJcbiAgICAgIHdpZHRoLFxyXG4gICAgICBoZWlnaHQsXHJcbiAgICAgIGB1cmwoIyR7Z3JhZGllbnROYW1lfSlgLFxyXG4gICAgICBDYW52YXMubm9ybWFsT3BhY2l0eSxcclxuICAgICAgdGVhbS5zYWZlVGVhbU5hbWUsXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlRmFkZUluKHJhbmtpbmdJbmRleEFmdGVyLCByYW5rQWZ0ZXIsIHRlYW0pIHtcclxuICAgIGNyZWF0ZUxhYmVsKHRlYW0sIHJhbmtpbmdJbmRleEFmdGVyLCByYW5rQWZ0ZXIpO1xyXG5cclxuICAgIGNvbnN0IHlQb3NpdGlvbiA9IGdldFlQb3NpdGlvbihyYW5rQWZ0ZXIpIC0gKGN1cnZlV2lkdGggLyAyKTtcclxuICAgIGNvbnN0IGhlaWdodCA9IGN1cnZlV2lkdGg7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSB5IHBvc2l0aW9uIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIHRyYW5zaXRpb24uXHJcbiAgICBjb25zdCB4UG9zaXRpb24gPSBnZXRYUG9zaXRpb24ocmFua2luZ0luZGV4QWZ0ZXIpIC0gY3VydmVGYWRlO1xyXG4gICAgY29uc3Qgd2lkdGggPSBjdXJ2ZUZhZGU7XHJcblxyXG4gICAgY29uc3QgZ3JhZGllbnROYW1lID0gdGVhbS5zYWZlVGVhbU5hbWUgKyBcIl9hZnRlcl9cIiArIHJhbmtpbmdJbmRleEFmdGVyO1xyXG4gICAgZ3JhcGguY3JlYXRlTGluZWFyR3JhZGllbnQoZ3JhZGllbnROYW1lLCAxLCAwLCAwLCAwLCB0ZWFtLmNvbG9yLCAxLCB0ZWFtLmNvbG9yLCAwKTtcclxuXHJcbiAgICAvLyBDcmVhdGUgdGhlIHJlY3RhbmdsZSB3aXRoIHRoZSBncmFkaWVudCBhcHBsaWVkLlxyXG4gICAgZ3JhcGguYWRkQ3VydmVSZWN0KFxyXG4gICAgICB4UG9zaXRpb24sXHJcbiAgICAgIHlQb3NpdGlvbixcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodCxcclxuICAgICAgYHVybCgjJHtncmFkaWVudE5hbWV9KWAsXHJcbiAgICAgIENhbnZhcy5ub3JtYWxPcGFjaXR5LFxyXG4gICAgICB0ZWFtLnNhZmVUZWFtTmFtZSxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvLyBEcmF3IHRlYW0gc2VyaWVzLlxyXG4gIGRhdGEudGVhbXMuZm9yRWFjaCgodGVhbSkgPT4ge1xyXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSBnYXBzIG9uIGVpdGhlciBzaWRlIG9mIHRoZSByYW5raW5ncy5cclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgKG51bWJlck9mUmFua2luZ3MgKyAxKTsgaisrKSB7XHJcbiAgICAgIC8vIEZpbmQgdGhlIGluZGV4IGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdhcC5cclxuICAgICAgY29uc3QgcmFua2luZ0luZGV4QmVmb3JlID0gaiAtIDE7XHJcbiAgICAgIGNvbnN0IHJhbmtpbmdJbmRleEFmdGVyID0gajtcclxuXHJcbiAgICAgIGNvbnN0IHJhbmtCZWZvcmUgPSBnZXRSYW5rKHRlYW0sIHJhbmtpbmdJbmRleEJlZm9yZSk7XHJcbiAgICAgIGNvbnN0IHJhbmtBZnRlciA9IGdldFJhbmsodGVhbSwgcmFua2luZ0luZGV4QWZ0ZXIpO1xyXG5cclxuICAgICAgaWYgKHJhbmtCZWZvcmUgIT09IG51bGwpIHtcclxuICAgICAgICBpZiAocmFua0FmdGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBjcmVhdGVDdXJ2ZShyYW5raW5nSW5kZXhCZWZvcmUsIHJhbmtpbmdJbmRleEFmdGVyLCByYW5rQmVmb3JlLCByYW5rQWZ0ZXIsIHRlYW0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjcmVhdGVGYWRlT3V0KHJhbmtpbmdJbmRleEJlZm9yZSwgcmFua0JlZm9yZSwgdGVhbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHJhbmtBZnRlciAhPT0gbnVsbCkge1xyXG4gICAgICAgIGNyZWF0ZUZhZGVJbihyYW5raW5nSW5kZXhBZnRlciwgcmFua0FmdGVyLCB0ZWFtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBQcmVwYXJlIGEgZ3JhZGllbnQgZm9yIHRoZSBib3R0b20gb2YgdGhlIGdyYXBoIHRvIGZhZGUgdG8gYmxhY2suXHJcbiAgY29uc3QgZ3JhZGllbnRIZWlnaHQgPSBwYWRkaW5nQm90dG9tO1xyXG4gIGNvbnN0IGdyYWRpZW50VG9wID0gZ3JhcGhIZWlnaHQgLSBncmFkaWVudEhlaWdodDtcclxuICBjb25zdCBncmFkaWVudEJvdHRvbSA9IGdyYXBoSGVpZ2h0O1xyXG5cclxuICBncmFwaC5jcmVhdGVMaW5lYXJHcmFkaWVudChcImJvdHRvbVwiLCAwLCAwLCAwLCAxLCBcImJsYWNrXCIsIDAsIFwiYmxhY2tcIiwgMSk7XHJcblxyXG4gIC8vIENyZWF0ZSB0aGUgcmVjdGFuZ2xlIHdpdGggdGhlIGdyYWRpZW50IGFwcGxpZWQuXHJcbiAgZ3JhcGguYWRkUmVjdCgwLCBncmFkaWVudFRvcCwgZ3JhcGhXaWR0aCwgZ3JhZGllbnRIZWlnaHQsIFwidXJsKCNib3R0b20pXCIpO1xyXG59XHJcblxyXG4vLyBDaGFuZ2VzIHRoZSBvcGFjaXR5IGZvciBhbGwgcGF0aHMgbWF0Y2hpbmcgdGhlIHRlYW0gbmFtZS5cclxuZnVuY3Rpb24gY2hhbmdlVGVhbU9wYWNpdHkodGVhbU5hbWUsIG9wYWNpdHkpIHtcclxuICBjb25zdCB0ZWFtU2VyaWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZWFtLVwiICsgdGVhbU5hbWUpO1xyXG4gIFtdLmZvckVhY2guY2FsbCh0ZWFtU2VyaWVzLCAocGF0aCkgPT4ge1xyXG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utb3BhY2l0eVwiLCBvcGFjaXR5KTtcclxuICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbC1vcGFjaXR5XCIsIG9wYWNpdHkpO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vLyBIaWdobGlnaHRzIHRoZSBzcGVjaWZpZWQgdGVhbSdzIHBhdGguXHJcbmZ1bmN0aW9uIGhhbmRsZU1vdXNlT3Zlcih0ZWFtTmFtZSkge1xyXG4gIGRhdGEudGVhbXMuZm9yRWFjaCgodGVhbSkgPT4ge1xyXG4gICAgY29uc3Qgb3BhY2l0eSA9IHRlYW1OYW1lID09PSB0ZWFtLnNhZmVUZWFtTmFtZSA/IENhbnZhcy5oaWdobGlnaHRPcGFjaXR5IDogQ2FudmFzLmxvd2xpZ2h0T3BhY2l0eTtcclxuXHJcbiAgICBjaGFuZ2VUZWFtT3BhY2l0eSh0ZWFtLnNhZmVUZWFtTmFtZSwgb3BhY2l0eSk7XHJcbiAgfSk7XHJcbn1cclxuKHdpbmRvdyBhcyBhbnkpLmhhbmRsZU1vdXNlT3ZlciA9IGhhbmRsZU1vdXNlT3ZlcjtcclxuXHJcbi8vIExvd2xpZ2h0cyB0aGUgc3BlY2lmaWVkIHRlYW0ncyBwYXRoLlxyXG5mdW5jdGlvbiBoYW5kbGVNb3VzZU91dCh0ZWFtTmFtZSkge1xyXG4gIGRhdGEudGVhbXMuZm9yRWFjaCgodGVhbSkgPT4ge1xyXG4gICAgY2hhbmdlVGVhbU9wYWNpdHkodGVhbS5zYWZlVGVhbU5hbWUsIENhbnZhcy5ub3JtYWxPcGFjaXR5KTtcclxuICB9KTtcclxufVxyXG4od2luZG93IGFzIGFueSkuaGFuZGxlTW91c2VPdXQgPSBoYW5kbGVNb3VzZU91dDtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKHRlYW1OYW1lKSB7XHJcbiAgY29uc29sZS5sb2codGVhbU5hbWUpO1xyXG4gIGNvbnN0IHRlYW1TZXJpZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRlYW0tXCIgKyB0ZWFtTmFtZSk7XHJcbiAgW10uZm9yRWFjaC5jYWxsKHRlYW1TZXJpZXMsIChwYXRoOiBFbGVtZW50KSA9PiB7XHJcbiAgICBwYXRoLmNsYXNzTGlzdC50b2dnbGUoXCJjbGlja2VkXCIpO1xyXG4gIH0pO1xyXG59XHJcbih3aW5kb3cgYXMgYW55KS5oYW5kbGVDbGljayA9IGhhbmRsZUNsaWNrO1xyXG5cclxuZnVuY3Rpb24gc2hvd0RlZmF1bHREYXRhKCkge1xyXG4gIHNldERyb3BEb3duRGF0ZXMoZGF0YS5yYW5raW5nc1tkYXRhLnJhbmtpbmdzLmxlbmd0aCAtIDExXSwgZGF0YS5yYW5raW5nc1tkYXRhLnJhbmtpbmdzLmxlbmd0aCAtIDFdKTtcclxufVxyXG4od2luZG93IGFzIGFueSkuc2hvd0RlZmF1bHREYXRhID0gc2hvd0RlZmF1bHREYXRhO1xyXG5cclxuZnVuY3Rpb24gc2hvd0FsbERhdGEoKSB7XHJcbiAgc2V0RHJvcERvd25EYXRlcyhkYXRhLnJhbmtpbmdzWzBdLCBkYXRhLnJhbmtpbmdzW2RhdGEucmFua2luZ3MubGVuZ3RoIC0gMV0pO1xyXG59XHJcbih3aW5kb3cgYXMgYW55KS5zaG93QWxsRGF0YSA9IHNob3dBbGxEYXRhO1xyXG5cclxuc2hvd0RlZmF1bHREYXRhKCk7XHJcblxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZseW91dCAudG9nZ2xlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mbHlvdXQgLmJvZHlcIikuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGRlblwiKTtcclxufSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vc291cmNlLW1hcC1sb2FkZXIhLi9ncmFwaC9tYWluLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==