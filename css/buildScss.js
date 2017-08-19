"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const sass = require("node-sass");
const css = sass.renderSync({ file: "css/styles.scss" }).css;
fs.writeFileSync("css/styles.css", css);
