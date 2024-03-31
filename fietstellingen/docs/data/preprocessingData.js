import {csvFormat, csvParse} from "d3-dsv";
import {promises as fs} from 'fs';

const filePath = 'docs/data.csv';

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

let year = startDate.year;
let month = startDate.month;

// csv header
let dataCsv = "siteID,richting,type,van,tot,aantal\n";

while (year < endDate.year || (year === endDate.year && month <= endDate.month)) {
    dataCsv += await text(`https://opendata.apps.mow.vlaanderen.be/fietstellingen/data-${year}-${String(month).padStart(2, '0')}.csv`);
    month++;
    if (month > 12) {
        year++;
        month = 1;
    }
}

const data = csvParse(dataCsv, (d) => ({
    siteID: d.siteID,
    richting: d.richting,
    type: d.type,
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



