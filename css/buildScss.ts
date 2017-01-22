import * as fs from "fs";
import * as sass from "node-sass";

const css = sass.renderSync({ file: "css/styles.scss" }).css;

fs.writeFileSync("css/styles.css", css);
