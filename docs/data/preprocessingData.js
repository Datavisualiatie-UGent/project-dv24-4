import {csvFormat, csvParse} from "d3-dsv";
import {promises as fs} from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = __dirname + '/data.csv';

const startDate = ({
    year:2020,
    month:1
});

const endDate = ({
    year:2020,
    month:6
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

    console.log("Loaded data for " + year + "-" + String(month).padStart(2, '0'));

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

console.log(dataCsv.length + " rows loaded");

function filterData(data){
    // remove zero counts
    if (data[5] === "0"){
        return false;
    }

    return data[2] === "FIETSERS";

}

console.log(dataCsv[0]);
// filter data
dataCsv = dataCsv.filter((row, index) => {
    const values = row.split(',');
    return filterData(values) || index === 0;
});
console.log(dataCsv[0]);
// map data
//dataCsv = dataCsv.map(row => row.replace(/,FIETSERS,/g, ',,'));

console.log(dataCsv.length + " rows after filtering");

const data = csvParse(dataCsv.join('\n'), (d) => ({
    siteID: d.siteID,
    richting: d.richting,
    // type: d.type,
    van: d.van,
    tot: d.tot,
    aantal: d.aantal
}));

// TODO add filtering

delete data.columns;

// delete file if exists
try {
  await fs.access(filePath, fs.constants.F_OK);
  await fs.unlink(filePath);
} catch (error) {
  // file does not exist
}
// write to file
await fs.writeFile(filePath, csvFormat(data));



