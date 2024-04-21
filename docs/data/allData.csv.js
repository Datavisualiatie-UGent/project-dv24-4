import {promises as fs} from 'fs';


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

function filterData(data){
    // remove zero counts
    if (data[5] === "0"){
        return false;
    }

    return data[2] === "FIETSERS";

}

// filter data
dataCsv = dataCsv.filter((row, index) => {
    const values = row.split(',');
    return filterData(values) || index === 0;
});

// map data to remove FIETSERS is always the same
//dataCsv = dataCsv.map(row => row.replace(/,FIETSERS,/g, ',,'));

// write to file
process.stdout.write(dataCsv.join('\n') + "\n");