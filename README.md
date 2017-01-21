CsgoRankingsGraph
=================

Preview at https://bencoveney.github.io/CsgoRankingsGraph/

Visualisation of HLTV team rankings over time.

Instructions
------------
To install all dependencies run `npm install`.

To scrape the data run `npm run load`. This will download all rankings listed in `loader.ts`.

To build the website code run `npm run build`.

To-do List
----------
- Make number-of-ranks dropdown actually work.
- Refactor the code to be less messy and split it up into files.
- Improve rendering performance for large selections.
- Map player curves from team to team.
  - Width should be amount of players moved e.g. 5 Luminosity -> SK
- Port CSS to SCSS.
- Generalise the codebase to be applicable to other sets of rankings.
- CI and publish somewhere.
- Condense subsequent straight lines into a single element.
- Dropdown for highlighting teams.
  - All
  - None
  - Countries
- Move ranking dates & team colours to config file.
