import fs from 'fs';
import path from 'path';
import url from 'url';

const startDate = ({
    year:2019,
    month:8
});

const endDate = ({
    year:2024,
    month: 4
});


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = __dirname + '/tellingen.csv';

async function readData(filePath) {
    try {
        return fs.readFileSync(filePath, "utf-8");
    } catch (error) {
        throw new Error(`readFile failed: ${error}`);
    }
}

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return response.text();
}

let year = startDate.year;
let month = startDate.month;

const logStream = fs.createWriteStream(filePath, {flags: 'w'});

// csv header
logStream.write("siteID,richting,van,tot,aantal\n");


function filterRows(data){
    // remove zero counts
    const row = data.split(',');
    if (row[5] === "0" || row[5] === ""){
        return false;
    } else if (row[2] !== "FIETSERS") {
        return false;
    }
    return true;
}

while (year < endDate.year || (year === endDate.year && month <= endDate.month)) {
    console.log(`year:${year} month:${month}`)
    console.log(`\tFetching`)


    const dataSet = await fetchData(`https://opendata.apps.mow.vlaanderen.be/fietstellingen/data-${year}-${String(month).padStart(2, '0')}.csv`);
    // const dataSet = await readData(`./dataset/data/data-${year}-${String(month).padStart(2, '0')}.csv`);

    let rows = dataSet.split('\n');

    console.log("\tFiltering")
    rows = rows.filter(filterRows);
    rows = rows.map(row => row.replace(/,FIETSERS,/g, ','));


    console.log("\tWriting\n")
    logStream.write(rows.join("\n") + "\n")

    month++;
    if (month > 12) {
        year++;
        month = 1;
    }
}

logStream.close()
