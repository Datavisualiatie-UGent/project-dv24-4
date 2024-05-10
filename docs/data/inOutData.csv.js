import {promises as fs} from 'fs';
import * as d3 from "d3";
import url from "url";
import path from "path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = __dirname + '/tellingen.csv';
const data = d3.csvParse(await fs.readFile(filePath, "utf8"));

// counts
let counts = new Map(d3.groups(data, d => d.siteID, d=> {
  const dd = new Date(d.van)
  return `${dd.getFullYear()}-${dd.getMonth()+1}-${dd.getDate()}`
}).map(([siteID, counts], _) => {
  return [parseInt(siteID), counts.length]
}))

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

function calculateLabel(timeframe) {
  let hour = (Math.floor(timeframe / 4)).toString().padStart(2, "0")
  let quarter = ["00", "15", "30", "45"][timeframe % 4]
  return `${hour}:${quarter}`
}

// Write in csv format
process.stdout.write("siteID,timeframe,in,out\n");
for (const [siteID, vvv] of grouped) {
  for (const [timeframe, v] of vvv) {
    const tt = new Date(`2024-01-01 ${calculateLabel(timeframe)}:00 UTC`)
    const ins = v.in / parseInt(siteID);
    const out = v.out / parseInt(siteID);
    process.stdout.write(`${siteID},${tt},${ins},${out}\n`);
  }
}
