CsgoRankingsGraph
=================

[![CircleCI](https://circleci.com/gh/bencoveney/CsgoRankingsGraph.svg?style=svg)](https://circleci.com/gh/bencoveney/CsgoRankingsGraph)

Preview at https://bencoveney.github.io/CsgoRankingsGraph/

Visualisation of HLTV team rankings over time.

Instructions
------------
To install all dependencies run `npm install`.

To scrape the data run `npm run load`. This will download all rankings listed in `loader.ts`.

To build the website code run `npm run test`.

To-do List
----------
- Refactor the code to be less messy and split it up into files.
- Improve performance
  - Long lines for large selections.
  - Precompute more data.
- Map player curves from team to team.
  - Width should be amount of players moved e.g. 5 Luminosity -> SK
- Generalise the codebase to be applicable to other sets of rankings.
- Dropdown for highlighting teams.
  - All
  - None
  - Countries
