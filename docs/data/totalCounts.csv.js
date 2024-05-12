import url from "url";
import path from "path";
import * as d3 from "d3";
import fs from "node:fs/promises";
import {csvFormat} from "d3-dsv";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = __dirname + '/tellingen.csv';
const data = d3.csvParse(await fs.readFile(filePath, "utf8"));

const groupedData = Array.from(d3.group(data, d => d.siteID), ([key, values]) => ({
    siteID: key,
    aantal: values.reduce((total, d) => total + parseInt(d.aantal), 0)
}));

process.stdout.write(csvFormat(groupedData));
