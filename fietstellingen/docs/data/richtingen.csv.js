import {csvFormat, csvParse} from "d3-dsv";

async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  const csvHeader = "siteID,richting,naam\n";
  return csvHeader + await response.text();
}

// Load and parse data.
const data = csvParse(await text("https://opendata.apps.mow.vlaanderen.be/fietstellingen/richtingen.csv"), (d) => ({
    siteID: d.siteID,
    richting: d.richting,
    naam: d.naam
}));

delete data.columns;

// csv
process.stdout.write(csvFormat(data));

// json
//console.log(data);