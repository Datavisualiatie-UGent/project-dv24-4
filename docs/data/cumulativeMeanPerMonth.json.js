import fs from "node:fs/promises"
import {sites} from "../components/sitesUtiles.js";
import * as d3 from "d3";
import {getResult,} from "../components/historyUtils.js";


//const data = (await fs.readFile("./tellingen.csv", "utf8")).split("\n")
const data = (await fs.readFile("./docs/data/tellingen.csv", "utf8")).split("\n")


const header = data[0].split(",")
const tellingen = data.slice(1, -1);

// get all years in different arrays
const years = tellingen.reduce((acc, telling) => {
    const year = telling.split(",")[2].split("-")[0]
    if (!acc[year]){
        acc[year] = []
    }
    acc[year].push(telling)
    return acc
}, {})


// group the sites by gemeente
const siteIDs = new Map();
// save the names of the gemeentes
let names = [];
for (let [key, values] of d3.group(sites, d => d.gemeente)) {
  const ids = values.map(d => d.siteID);
  siteIDs.set(key, ids);
  names.push(key);
}

// create the resultJSON of all years
const resultJSON = {};
for (let [year, data] of Object.entries(years)) {
    resultJSON[year] = getResult(header, data, siteIDs, sites);
}

console.log(JSON.stringify({
    resultJSON
}))
