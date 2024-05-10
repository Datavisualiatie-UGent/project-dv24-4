import {promises as fs} from 'fs';
import * as d3 from "d3";
import url from "url";
import path from "path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = __dirname + '/tellingen.csv';
const data = d3.csvParse(await fs.readFile(filePath, "utf8"));

// group data per siteID and per 15 minutes
let grouped = d3.groups(data, d=> d.siteID, d => {
  const date = new Date(d.van)
  return date.getHours() * 4 + date.getMinutes() / 15;
})

// concat the IN and OUT per 15min per site
grouped = grouped.map(([siteID, value]) => {
  return [siteID, value.map(([timeframe, v2]) => {
    return [timeframe, v2.reduce((acc, curr) => {
      if (curr.richting === "IN"){
        acc.in += parseInt(curr.aantal)
      }
      if (curr.richting === "OUT"){
        acc.out -= parseInt(curr.aantal)
      }
      return acc
    }, {in:0, out:0})]
  })]
})

// Write in csv format
process.stdout.write("siteID,timeframe,in,out\n");
for (const [siteID, vvv] of grouped) {
  for (const [timeframe, v] of vvv) {
    process.stdout.write(`${siteID},${timeframe},${v.in},${v.out}\n`);
  }
}
