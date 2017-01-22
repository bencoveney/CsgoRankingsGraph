"use strict";
const fs = require("fs");
const sass = require("node-sass");
const css = sass.renderSync({ file: "css/styles.scss" }).css;
fs.writeFileSync("css/styles.css", css);
