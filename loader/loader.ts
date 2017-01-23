// tslint:disable-next-line
var console = require("better-console") as Console;

import * as config from "config";
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

// Provide teams with a best-guessed colour (from their logo) for graph lines.
const teamColors = config.get("teamColors") as { [teamName: string]: string };

// The end format of the downloaded data.
const data: DataFormat = JSON.parse(fs.readFileSync("loader/output.json", "utf8"));

const jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf-8");

function loadPageLoop(files) {
  const file = files.pop();

  const monthName = months[file.month - 1];

  let path = "http://www.hltv.org/ranking/teams/";
  path += file.year + "/";
  path += monthName + "/";
  path += file.day + "/";

  const dateString = monthName + " " + file.day + ", " + file.year;

  const date = new Date(dateString);

  console.log("Rankings for " + date.toISOString());

  const alreadyLoaded = data.rankings.some((ranking) => {
    return ranking.date === dateString;
  });

  function loadNext() {
    if (files.length > 0) {
      loadPageLoop(files);
    } else {
      writeData();
    }
  }

  if (alreadyLoaded) {
    console.info("Already loaded");
    loadNext();
    return;
  }

  jsdom.env({
    done: (err, window) => {
      console.log("page loaded");

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

      loadNext();
    },
    src: [jquery],
    url: path,
  });
}

function writeData() {
  const outputFile = "loader/output.json";

  fs.writeFile(
    outputFile,
    JSON.stringify(data, null, 2),
    (error) => {
      if (error) {
        return console.log(error);
      }

      console.log("Output written to " + outputFile);
    },
  );
}

// Dates for which rankings will be downloaded.
type RatingDate = { year: number, month: number, day: number };
const rankingDates = config.get("dates") as RatingDate[];

loadPageLoop(rankingDates);
