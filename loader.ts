var fs = require("fs");
var http = require("http");
var jsdom = require("jsdom");

var console = (require("better-console") as Console);

var months: string[] = [
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
  "december"
];

// Dates for which rankings will be downloaded.
type RatingDate = { year: number, month: number, day: number };
var ratingDates: RatingDate[] = [
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
var teamColors: { [teamName: string]: string } = {
  "Virtus.pro": "#F36801",
  "SK": "#2D498E",
  "Natus Vincere": "#FEE821",
  "NiP": "#A98C66",
  "dignitas": "#F8C700",
  "Cloud9": "#1D9DD8",
  "G2": "#A8A8A8",
  "Liquid": "#5B76AF",
  "EnVyUs": "#576DA5",
  "GODSENT": "#F5C92E",
  "Astralis": "#EF3742",
  "Immortals": "#01B2AA",
  "Heroic": "#3EB243",
  "mousesports": "#C12E50",
  "fnatic": "#F19E33",
  "TSM": "#EFEFEF",
  "CLG": "#008FEA",
  "FlipSid3": "#73EB2A",
  "Titan": "#80B8C7",
  "E-frag.net": "#4383BF",
  "HellRaisers": "#EC1C23",
  "Renegades": "#87202A",
  "Vexed": "#CD2029",
  "CSGL": "#DB8328",
  "Immunity": "#C9C9CA",
  "Conquest": "#D08685",
  "?": "#EFEFEF",
  "OpTic": "#98D106",
  "ex-Titan": "#80B8C7",
  "FaZe": "#E91E25",
  "Tempo Storm": "#3373BA",
  "Gambit": "#F00815",
  "NRG": "#ED2B7E",
  "AGG": "#EA001C",
  "Selfless": "#D79153",
  "TyLoo": "#D53A31",
  "Epsilon": "#0A5499",
  "X": "#EFEFEF",
  "Space Soldiers": "#F7E300",
  "MK": "#027C03",
  "VG.CyberZen": "#BC3728",
  "Luminosity": "#0A9FBD",
  "Winterfox": "#505283",
  "compLexity": "#870000",
  "Enemy": "#CC0000",
  "Method": "#F6872B",
  "Games Academy": "#71B6E1",
  "SKDC": "#79CED3",
  "Torqued": "#ED6B1D",
  "Nexus": "#A81C1F",
  "CLG Red": "#DC0031",
  "Splyce": "#EDBA00",
  "CyberZen": "#BC3728",
  "Leader-1": "#E60108",
  "Obey.Alliance": "#4CB0C8",
  "EZG": "#105CA0",
  "Arcade": "#A61280",
  "Rebels": "#DE0005",
  "eXplosive": "#FED54F",
  "Quest": "#FFAE64",
  "Fluffy Gangsters": "#3C66AE",
  "Binary Dragons": "#E10012",
  "LDLC White": "#EFEFEF",
  "PENTA": "#EFEFEF",
  "TheMongolz": "#CDCDCD",
  "PixelFire": "#E46016",
  "Chiefs": "#3996D9",
  "DenDD": "#EFEFEF",
  "Lemondogs": "#FFD900",
  "MVP.karnal": "#CF0103",
  "ENCE": "#865D31",
  "Orgless": "#EFEFEF",
  "CPH Wolves": "#FCBA2F",
  "RCTIC": "#00B5E7",
  "LDLC Blue": "#0099CF",
  "Epiphany Bolt": "#E8CC4F",
  "Millenium": "#9968FF",
  "gBots": "#3D7BB8",
  "x6tence": "#FD6200",
  "ALTERNATE aTTaX": "#E30714",
  "Ancient": "#EFEFEF",
  "Preparation": "#FF00CA",
  "Publiclir.se": "#47D3E2",
  "Escape": "#FF8B1C",
  "Dobry&Gaming": "#FFF382",
  "Orbit": "#28B0C8",
  "Kinguin": "#FE9901",
  "Spirit": "#067D47",
  "Echo Fox": "#E07026",
  "Crowns": "#E3DB9A",
  "iGame.com": "#39A2DB",
  "Platinium": "#AD0C1D",
  "Vega Squadron": "#0083E8",
  "fnatic Academy": "#F19E33"
}

// The end format of the downloaded data.
type DataFormat = {
  rankings: {
    link: string,
    date: string | Date,
    ranks: {
      position: number,
      team: string,
      points: number,
      link: string,
      players: {
        player: string,
        link: string,
        nationality: string
      }[]
    }[]
  }[],
  teams: {
    name: string,
    color: string,
    safeTeamName: string,
    ranks?: number[]
  }[],
  players: {
    teams?: string[]
  }
}
var data: DataFormat = {
  rankings: [],
  teams: [],
  players: {}
};

function loadPageLoop(files)
{
  var file = files.pop();

  var monthName = months[file.month - 1]

  var path = "http://www.hltv.org/ranking/teams/";
  path += file.year + "/";
  path += monthName + "/";
  path += file.day + "/";

  var jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf-8");

  jsdom.env({
    url: path,
    src: [jquery],
    done: function (err, window)
    {
      var dateString = monthName + " " + file.day + ", " + file.year;
      var date = new Date(dateString);

      console.log("Rankings for " + date.toISOString());

      var ranking = {
        link: path,
        date: dateString,
        ranks: []
      }

      data.rankings.push(ranking);

      var $ = window.$ as JQueryStatic;
      $(".ranking-box .ranking-logo").each(function ()
      {
        var thisElement =  $(this);

        var rankNumber = thisElement.find(".ranking-number").text().substring(1);

        var teamName = thisElement.find(".ranking-teamName > a").text().trim();

        var points = thisElement.find(".ranking-teamName > span").text().match(/([\d]+)/g)[0];

        var details = "http://www.hltv.org" + thisElement.find(".ranking-teamName > span > a").attr('href');

        var rank = {
          position: rankNumber,
          team: teamName,
          points: points,
          link: details,
          players: []
        };

        ranking.ranks.push(rank);

        thisElement.find(".ranking-lineup .ranking-playerNick > a").each(function ()
        {
          var playerName = $(this).text().trim();
          var playerUrl = "http://www.hltv.org" + $(this).attr("href");
          var playerNationality = $(this).find("img").attr("src").match(/\/([a-zA-Z]+).gif$/)[1];

          // Some player names (seang@res specifically) break the parsing
          if (playerName.length > 30)
          {
            playerName = "Broken_player_name";
          }

          rank.players.push({
            player: playerName,
            link: playerUrl,
            nationality: playerNationality
          })
        });

        if (!data.teams.some(function(team) {
          return team.name === teamName
        }))
        {
          var color = teamColors[teamName] || "white";

          data.teams.push({
            name: teamName,
            color,
            safeTeamName: teamName.replace(new RegExp("[\. ?!,()/\\\|<>&$%^#*;@+-]", "g"), "_")
          });
        };

        var numberOfPlayers = rank.players.length;
        if (rank.players.length !== 5)
        {
          console.warn(`Team ${teamName} had an unexpected number of players: ${numberOfPlayers}`)
        }
      });

      if (files.length > 0)
      {
        loadPageLoop(files);
      }
      else
      {
        writeData();
      }
    }
  });
}

function writeData() {
  var outputFile = "output.js";

  fs.writeFile(
    outputFile,
    "var data = " + JSON.stringify(data, null, 2) + ";",
    function (error)
    {
      if (error)
      {
        return console.log(error);
      }

      console.log("Output written to " + outputFile);
    }
  );
}

loadPageLoop(ratingDates);
