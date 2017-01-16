// tslint:disable-next-line
var console = require("better-console") as Console;

import * as fs from "fs";
import * as http from "http";
import * as jsdom from "jsdom";

const months: string[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// Dates for which rankings will be downloaded.
type RatingDate = { year: number, month: number, day: number };
const ratingDates: RatingDate[] = [
  { year: 2017, month: 12, day: 16 },
  { year: 2017, month: 12, day: 9 },
  { year: 2017, month: 12, day: 2 },

  { year: 2016, month: 12, day: 26 },
  { year: 2016, month: 12, day: 19 },
  { year: 2016, month: 12, day: 12 },
  { year: 2016, month: 12, day: 5 },

  { year: 2016, month: 11, day: 28 },
  { year: 2016, month: 11, day: 21 },
  { year: 2016, month: 11, day: 14 },
  { year: 2016, month: 11, day: 7 },
  { year: 2016, month: 11, day: 1 },

  { year: 2016, month: 10, day: 24 },
  { year: 2016, month: 10, day: 17 },
  { year: 2016, month: 10, day: 10 },
  { year: 2016, month: 10, day: 3 },
/*
  { year: 2016, month: 9, day: 26 },
  { year: 2016, month: 9, day: 19 },
  { year: 2016, month: 9, day: 12 },
  { year: 2016, month: 9, day: 5 },

  { year: 2016, month: 8, day: 29 },
  { year: 2016, month: 8, day: 22 },
  { year: 2016, month: 8, day: 15 },
  { year: 2016, month: 8, day: 8 },
  { year: 2016, month: 8, day: 1 },

  { year: 2016, month: 7, day: 26 },
  { year: 2016, month: 7, day: 19 },
  { year: 2016, month: 7, day: 11 },
  { year: 2016, month: 7, day: 4 },

  { year: 2016, month: 6, day: 27 },
  { year: 2016, month: 6, day: 21 },
  { year: 2016, month: 6, day: 13 },
  { year: 2016, month: 6, day: 6 },
  { year: 2016, month: 6, day: 1 },

  { year: 2016, month: 5, day: 23 },
  { year: 2016, month: 5, day: 17 },
  { year: 2016, month: 5, day: 9 },
  { year: 2016, month: 5, day: 2 },

  { year: 2016, month: 4, day: 25 },
  { year: 2016, month: 4, day: 18 },
  { year: 2016, month: 4, day: 11 },
  { year: 2016, month: 4, day: 5 },

  { year: 2016, month: 3, day: 28 },
  { year: 2016, month: 3, day: 21 },
  { year: 2016, month: 3, day: 14 },
  { year: 2016, month: 3, day: 7 },
  { year: 2016, month: 3, day: 1 },

  { year: 2016, month: 2, day: 22 },
  { year: 2016, month: 2, day: 15 },
  { year: 2016, month: 2, day: 9 },
  { year: 2016, month: 2, day: 1 },

  { year: 2016, month: 1, day: 25 },
  { year: 2016, month: 1, day: 18 },
  { year: 2016, month: 1, day: 11 },
  { year: 2016, month: 1, day: 5 },

  { year: 2015, month: 12, day: 28 },
  { year: 2015, month: 12, day: 21 },
  { year: 2015, month: 12, day: 14 },
  { year: 2015, month: 12, day: 8 },
  { year: 2015, month: 12, day: 1 },

  { year: 2015, month: 11, day: 24 },
  { year: 2015, month: 11, day: 16 },
  { year: 2015, month: 11, day: 9 },
  { year: 2015, month: 11, day: 3 },

  { year: 2015, month: 10, day: 26 },
  { year: 2015, month: 10, day: 19 },
  { year: 2015, month: 10, day: 12 },
  { year: 2015, month: 10, day: 5 },
  { year: 2015, month: 10, day: 1 },
*/
];

// Provide teams with a best-guessed colour (from their logo) for graph lines.
// tslint:disable:object-literal-sort-keys
const teamColors: { [teamName: string]: string } = {
  "AGG": "#EA001C",
  "ALTERNATE aTTaX": "#E30714",
  "Ancient": "#EFEFEF",
  "Arcade": "#A61280",
  "Astralis": "#EF3742",
  "Binary Dragons": "#E10012",
  "Chiefs": "#3996D9",
  "CLG": "#008FEA",
  "CLG Red": "#DC0031",
  "Cloud9": "#1D9DD8",
  "compLexity": "#870000",
  "Conquest": "#D08685",
  "CPH Wolves": "#FCBA2F",
  "Crowns": "#E3DB9A",
  "CSGL": "#DB8328",
  "CyberZen": "#BC3728",
  "DenDD": "#EFEFEF",
  "Dobry&Gaming": "#FFF382",
  "dignitas": "#F8C700",
  "Echo Fox": "#E07026",
  "EnVyUs": "#576DA5",
  "Epiphany Bolt": "#E8CC4F",
  "Epsilon": "#0A5499",
  "Escape": "#FF8B1C",
  "ENCE": "#865D31",
  "Enemy": "#CC0000",
  "eXplosive": "#FED54F",
  "ex-Titan": "#80B8C7",
  "E-frag.net": "#4383BF",
  "EZG": "#105CA0",
  "FaZe": "#E91E25",
  "FlipSid3": "#73EB2A",
  "Fluffy Gangsters": "#3C66AE",
  "fnatic": "#F19E33",
  "fnatic Academy": "#F19E33",
  "Gambit": "#F00815",
  "Games Academy": "#71B6E1",
  "gBots": "#3D7BB8",
  "GODSENT": "#F5C92E",
  "G2": "#A8A8A8",
  "HellRaisers": "#EC1C23",
  "Heroic": "#3EB243",
  "iGame.com": "#39A2DB",
  "Immortals": "#01B2AA",
  "Immunity": "#C9C9CA",
  "Kinguin": "#FE9901",
  "LDLC Blue": "#0099CF",
  "Lemondogs": "#FFD900",
  "LDLC White": "#EFEFEF",
  "Leader-1": "#E60108",
  "Liquid": "#5B76AF",
  "Luminosity": "#0A9FBD",
  "Method": "#F6872B",
  "Millenium": "#9968FF",
  "mousesports": "#C12E50",
  "MK": "#027C03",
  "MVP.karnal": "#CF0103",
  "Natus Vincere": "#FEE821",
  "Nexus": "#A81C1F",
  "NiP": "#A98C66",
  "NRG": "#ED2B7E",
  "Obey.Alliance": "#4CB0C8",
  "Orbit": "#28B0C8",
  "Orgless": "#EFEFEF",
  "PENTA": "#EFEFEF",
  "PixelFire": "#E46016",
  "Platinium": "#AD0C1D",
  "Preparation": "#FF00CA",
  "Publiclir.se": "#47D3E2",
  "OpTic": "#98D106",
  "Quest": "#FFAE64",
  "RCTIC": "#00B5E7",
  "Rebels": "#DE0005",
  "Selfless": "#D79153",
  "SK": "#2D498E",
  "SKDC": "#79CED3",
  "Space Soldiers": "#F7E300",
  "Spirit": "#067D47",
  "Splyce": "#EDBA00",
  "Tempo Storm": "#3373BA",
  "TheMongolz": "#CDCDCD",
  "Titan": "#80B8C7",
  "Torqued": "#ED6B1D",
  "TSM": "#EFEFEF",
  "TyLoo": "#D53A31",
  "Renegades": "#87202A",
  "Winterfox": "#505283",
  "X": "#EFEFEF",
  "x6tence": "#FD6200",
  "Vega Squadron": "#0083E8",
  "Vexed": "#CD2029",
  "Virtus.pro": "#F36801",
  "VG.CyberZen": "#BC3728",
  "?": "#EFEFEF",
};
// tslint:enable:object-literal-sort-keys

// The end format of the downloaded data.
const data: DataFormat = {
  players: {},
  rankings: [],
  teams: [],
};

function loadPageLoop(files) {
  const file = files.pop();

  const monthName = months[file.month - 1];

  let path = "http://www.hltv.org/ranking/teams/";
  path += file.year + "/";
  path += monthName + "/";
  path += file.day + "/";

  const jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf-8");

  jsdom.env({
    done: (err, window) => {
      const dateString = monthName + " " + file.day + ", " + file.year;
      const date = new Date(dateString);

      console.log("Rankings for " + date.toISOString());

      const ranking = {
        date: dateString,
        link: path,
        ranks: [],
      };

      data.rankings.push(ranking);

      const $ = (window as any).$ as JQueryStatic;
      $(".ranking-box .ranking-logo").each((index: number, element: Element) => {
        const thisElement =  $(element);

        const rankNumber = thisElement.find(".ranking-number").text().substring(1);

        const teamName = thisElement.find(".ranking-teamName > a").text().trim();

        const points = thisElement.find(".ranking-teamName > span").text().match(/([\d]+)/g)[0];

        const details = "http://www.hltv.org" + thisElement.find(".ranking-teamName > span > a").attr("href");

        const rank = {
          link: details,
          players: [],
          points,
          position: rankNumber,
          team: teamName,
        };

        ranking.ranks.push(rank);

        thisElement.find(".ranking-lineup .ranking-playerNick > a").each(
          (playerIndex: number, playerElement: Element) => {
            let playerName = $(playerElement).text().trim();
            const playerUrl = "http://www.hltv.org" + $(playerElement).attr("href");
            const playerNationality = $(playerElement).find("img").attr("src").match(/\/([a-zA-Z]+).gif$/)[1];

            // Some player names (seang@res specifically) break the parsing
            if (playerName.length > 30) {
              playerName = "Broken_player_name";
            }

            rank.players.push({
              link: playerUrl,
              nationality: playerNationality,
              player: playerName,
            });
          },
        );

        if (!data.teams.some((team) => {
          return team.name === teamName;
        })) {
          const color = teamColors[teamName] || "white";

          data.teams.push({
            color,
            name: teamName,
            safeTeamName: teamName.replace(new RegExp("[\. ?!,()/\\\|<>&$%^#*;@+-]", "g"), "_"),
          });
        }

        const numberOfPlayers = rank.players.length;
        if (rank.players.length !== 5) {
          console.warn(`Team ${teamName} had an unexpected number of players: ${numberOfPlayers}`);
        }
      });

      if (files.length > 0) {
        loadPageLoop(files);
      } else {
        writeData();
      }
    },
    src: [jquery],
    url: path,
  });
}

function writeData() {
  const outputFile = "output.js";

  fs.writeFile(
    outputFile,
    "var data = " + JSON.stringify(data, null, 2) + ";",
    (error) => {
      if (error) {
        return console.log(error);
      }

      console.log("Output written to " + outputFile);
    },
  );
}

loadPageLoop(ratingDates);
