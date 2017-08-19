/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Function to clear an element.
    function emptyElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    exports.emptyElement = emptyElement;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports) {


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Utilities) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            Utilities.emptyElement(this.element);
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
                "class": `curve curve-${name}`,
                "d": pathDefinition,
                "fill": "none",
                "stroke": color,
                "stroke-opacity": Canvas.normalOpacity.toString(),
                "stroke-width": width.toString(),
            });
            this.bindListeners(line, name);
            this.element.appendChild(line);
        }
        addCurveRect(x, y, width, height, color, opacity, name) {
            const rect = Canvas.createNsElement("rect");
            Canvas.setAttributes(rect, {
                "class": "curve curve-" + name,
                "fill": color,
                "fill-opacity": opacity.toString(),
                "height": height.toString(),
                "width": width.toString(),
                "x": x.toString(),
                "y": y.toString(),
            });
            this.bindListeners(rect, name);
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
        // Binds an event listener to the specified element.
        bindListeners(element, name) {
            element.addEventListener("click", () => this.toggleFocus(name));
            element.addEventListener("mouseout", () => this.removeHighlight(name));
            element.addEventListener("mouseover", () => this.addHighlight(name));
        }
        // Adds the highlight for the specified curve.
        addHighlight(teamName) {
            this.changeOpacity(`.curve.curve-${teamName}`, Canvas.highlightOpacity);
            this.changeOpacity(`.curve:not(.curve-${teamName})`, Canvas.lowlightOpacity);
        }
        // Removes the highlight for the specified curve.
        removeHighlight(teamName) {
            this.changeOpacity(".curve", Canvas.normalOpacity);
        }
        // Toggles focus on the specified curve.
        toggleFocus(teamName) {
            const allClicked = document.querySelectorAll(".curve-" + teamName);
            [].forEach.call(allClicked, (path) => {
                path.classList.toggle("clicked");
            });
        }
        // Changes the opacity for all elements matching the selector.
        changeOpacity(selector, opacity) {
            const targets = document.querySelectorAll(selector);
            [].forEach.call(targets, (path) => {
                path.setAttribute("stroke-opacity", opacity);
                path.setAttribute("fill-opacity", opacity);
            });
        }
    }
    Canvas.normalOpacity = 0.2;
    Canvas.highlightOpacity = 1;
    Canvas.lowlightOpacity = 0.1;
    Canvas.svgNs = "http://www.w3.org/2000/svg";
    exports.Canvas = Canvas;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Utilities) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Form {
        constructor(allData, onSelection) {
            this.dateFromElement = document.querySelector("#dateFrom");
            this.dateToElement = document.querySelector("#dateTo");
            this.topNRanksElement = document.querySelector("#topNRanks");
            this.data = allData;
            this.onSelection = onSelection;
            // Find the highest number of ranks.
            this.highestNumberOfRanks = 0;
            this.data.rankings.forEach((ranking) => {
                this.highestNumberOfRanks = Math.max(this.highestNumberOfRanks, ranking.ranks.length);
            });
            Form.setUpFormToggle();
            this.setUpDropDowns();
            this.setUpAllDataButton();
            this.setUpDefaultDataButton();
            this.showDefaultData();
        }
        // Function to format dates in the format for drop-downs.
        static getDropDownDate(date) {
            return date.toDateString().substring(4);
        }
        static setUpFormToggle() {
            document.querySelector(".flyout .toggle").addEventListener("click", () => {
                document.querySelector(".flyout .body").classList.toggle("hidden");
            });
        }
        // Function to update the top n ranks dropdown.
        dropDownRanks(selected) {
            const addRank = (rankNumber) => {
                const option = document.createElement("option");
                const rankString = rankNumber.toString();
                option.text = rankString;
                option.value = rankString;
                option.selected = selected === rankNumber;
                this.topNRanksElement.add(option);
            };
            Utilities.emptyElement(this.topNRanksElement);
            for (let i = 1; i <= this.highestNumberOfRanks; i++) {
                addRank(i);
            }
        }
        // Function to update the dates dropdown list and re-display the graph.
        setDropDownDates(first, last) {
            const addDateToSelector = (date, selector, isSelected, isEnabled) => {
                const option = document.createElement("option");
                const dateString = Form.getDropDownDate(date);
                option.text = dateString;
                option.value = dateString;
                option.selected = isSelected;
                option.disabled = !isEnabled;
                selector.add(option);
            };
            Utilities.emptyElement(this.dateFromElement);
            Utilities.emptyElement(this.dateToElement);
            this.data.rankings.forEach((ranking) => {
                addDateToSelector(ranking.date, this.dateFromElement, ranking === first, ranking.date < last.date);
                addDateToSelector(ranking.date, this.dateToElement, ranking === last, ranking.date > first.date);
            });
        }
        setUpDefaultDataButton() {
            document.querySelector("#showDefaultData").addEventListener("click", () => {
                this.showDefaultData();
            });
        }
        setUpAllDataButton() {
            document.querySelector("#showAllData").addEventListener("click", () => {
                this.showAllData();
            });
        }
        setUpDropDowns() {
            const setUpChangeListener = (dropDown) => {
                dropDown.addEventListener("change", () => this.showSelectedData());
            };
            setUpChangeListener(this.dateFromElement);
            setUpChangeListener(this.dateToElement);
            setUpChangeListener(this.topNRanksElement);
        }
        // Function to assess dropdowns and reload the graph.
        showSelectedData() {
            const findRanking = (dateString) => {
                return this.data.rankings.find((ranking) => {
                    return Form.getDropDownDate(ranking.date) === dateString;
                });
            };
            this.updateGraph(findRanking(this.dateFromElement.value), findRanking(this.dateToElement.value), parseInt(this.topNRanksElement.value, 10));
        }
        showDefaultData() {
            this.updateGraph(this.data.rankings[this.data.rankings.length - 11], this.data.rankings[this.data.rankings.length - 1], 10);
        }
        showAllData() {
            this.updateGraph(this.data.rankings[0], this.data.rankings[this.data.rankings.length - 1], this.highestNumberOfRanks);
        }
        updateGraph(from, to, numberOfRanks) {
            this.dropDownRanks(numberOfRanks);
            this.setDropDownDates(from, to);
            this.onSelection(from, to, numberOfRanks);
        }
    }
    exports.Form = Form;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, canvas_1, form_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // tslint:disable-next-line
    let data = __webpack_require__(1);
    const graph = new canvas_1.Canvas(document.getElementById("graph"));
    // Parse dates.
    data.rankings.forEach((ranking) => {
        ranking.date = new Date(ranking.date);
    });
    // Ensure the rankings are sorted.
    data.rankings = data.rankings.sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
    });
    const paddingTop = 100;
    const paddingLeft = 50;
    const paddingRight = 50;
    const paddingBottom = 0;
    const months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    function displayGraph(firstRanking, lastRanking, topNRanks) {
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
                const labelClass = "curve curve-" + team.safeTeamName;
                const labelText = team.name + " (" + rank + ")";
                const labelColor = team.textColor || team.color;
                graph.addText(labelText, xPosition, yPosition - 20, labelColor, 12, labelClass, canvas_1.Canvas.normalOpacity);
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
            graph.addCurveRect(xPosition, yPosition, width, height, `url(#${gradientName})`, canvas_1.Canvas.normalOpacity, team.safeTeamName);
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
            graph.addCurveRect(xPosition, yPosition, width, height, `url(#${gradientName})`, canvas_1.Canvas.normalOpacity, team.safeTeamName);
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
    const form = new form_1.Form(data, displayGraph);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);