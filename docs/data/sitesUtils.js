import {csvParse} from "d3-dsv";

async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  const csvHeader = "siteID,siteNR,long,lat,naam,domein,wegnr,district,gemeente,interval,datum_van\n";
  return csvHeader + await response.text();
}

const sites = csvParse(await text("https://opendata.apps.mow.vlaanderen.be/fietstellingen/sites.csv"), (d) => ({
    siteID: d.siteID,
    siteNR: d.siteNR,
    long: d.long,
    lat: d.lat,
    naam: d.naam,
    domein: d.domein,
    wegnr: d.wegnr,
    district: d.district,
    gemeente: d.gemeente,
    interval: d.interval,
    datum_van: d.datum_van
})).filter(d => d.interval !== "0");

delete sites.columns;

export {sites};