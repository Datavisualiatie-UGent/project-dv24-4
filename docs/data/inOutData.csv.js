import {promises as fs} from 'fs';


const startDate = ({
  year: 2020,
  month: 1
});

const endDate = ({
  year: 2020,
  month: 6
});

async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return response.text();
}

// TODO terug naar fetch
async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`readFile failed: ${error}`);
  }
}

let year = startDate.year;
let month = startDate.month;

// csv header
let dataCsv = ["siteID,richting,type,van,tot,aantal"];

while (year < endDate.year || (year === endDate.year && month <= endDate.month)) {
  // TODO terug naar fetch
  // const dataSet = await text(`https://opendata.apps.mow.vlaanderen.be/fietstellingen/data-${year}-${String(month).padStart(2, '0')}.csv`);
  const dataSet = await readFile(`./dataset/data/data-${year}-${String(month).padStart(2, '0')}.csv`);

  const rows = dataSet.split('\n');
  for (let row of rows) {
    dataCsv.push(row);
  }
  month++;
  if (month > 12) {
    year++;
    month = 1;
  }
}

function filterData(data) {
  // remove zero counts
  if (data[5] === "0") {
    return false;
  }

  return data[2] === "FIETSERS";

}

// filter data
dataCsv = dataCsv.filter((row, index) => {
  const values = row.split(',');
  return filterData(values) || index === 0;
});

const getLabel = (index) => {
  // return hourLabels[index]
  return index.toString().padStart(2, "0")
}

function parseLine(line){
  const splitted = line.split(",")
  if(!splitted[5]){
    splitted[5] = 0
  }
  return {
    siteID: parseInt(splitted[0]),
    richting: splitted[1],
    type: splitted[2],
    van: splitted[3],
    tot: splitted[4],
    aantal: parseInt(splitted[5]) ?? 0,
  }
}
const filterFunction = (line) => {
  const d = parseLine(line)
  let date = new Date(d.van)
  return date.getUTCHours() * 4 + date.getUTCMinutes() / 15;
}
// console.log(dataCsv.slice(1))

let DATA = Array.from(d3.group(dataCsv.slice(1), filterFunction), ([key, values]) => {
  return ({
    name: getLabel(key),
    data: values.reduce((total, line) => {
      const d = parseLine(line)
      if(!total[d.siteID]){
        total[d.siteID] = {in:0, out:0}
      }
      if(d.richting === "IN") {
        total[d.siteID].in = total[d.siteID].in + d.aantal
      }
      if(d.richting === "OUT") {
        total[d.siteID].out = total[d.siteID].out - d.aantal
      }
      return total
    }, {})
  })
})
DATA = DATA.flatMap(item => {
  let name = item.name
  let out = []
  for(let id of Object.keys(item.data)){
    out.push(`${name},${id},${item.data[id].in},${item.data[id].out}`)
  }
  return out;
})
// map data to remove FIETSERS is always the same
//dataCsv = dataCsv.map(row => row.replace(/,FIETSERS,/g, ',,'));

// write to file
// process.stdout.write(dataCsv.join('\n') + "\n");
import url from 'url';
import path from 'path';
import * as d3 from "../.observablehq/cache/_npm/d3-array@3.2.4/_esm.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = __dirname + '/inOutData.csv';
await fs.writeFile(filePath, "timeframe,siteID,in,out\n" + DATA.join('\n') + "\n");
//process.stdout.write("timeframe,siteID,in,out\n" + DATA.join('\n') + "\n");