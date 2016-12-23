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
- Fix visual bugs around the first element in a curve.
- Refactor the code to be less messy and split it up into files.
- Configure and fun TsLint as part of the build.
- Improve rendering performance for large selections.
- Allow toggling on/off team highlights.
- Map player curves from team to team.
- Port CSS to SCSS.
- Split TypeScript compilation up properly.
- Generalise the codebase to be applicable to other sets of rankings.
- CI and publish somewhere.
- Condense subsequent straight lines into a single element.
- Add buttons to highlight all/no teams.
