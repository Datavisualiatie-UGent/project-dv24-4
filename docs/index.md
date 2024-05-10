---
title: Fietstellingen
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
 <!-- Make sure you put this AFTER Leaflet's CSS -->
 <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

.center-map {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
}

.style-map {
    border-radius: 25px;
    border: 2px solid lightgray;
    height: 600px;
}

</style>
<div class="hero">
  <h1>Fietstellingen</h1>
</div>

## Meetpunten
<div class="center-map" style="width: 100%">
    <div id="map" class="style-map"></div>
</div>

```js
// Imports
const tellingen = FileAttachment("data/allData.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const richtingen = FileAttachment("data/richtingen.csv").csv({typed: true});
const jaaroverzicht = FileAttachment("data/jaaroverzicht.csv").csv({typed: true});

import {overviewYear} from "./components/overviewYear.js";
import {createMap} from "./components/mapUtils.js";
import {barChart} from "./components/barChartSiteIDAantal.js";
import {dailyVolumeChart} from "./components/dailyVolume.js";
```

```js
createMap(sites);
```

## Aantal tellingen

```js
const groupedData = Array.from(d3.group(tellingen, d => d.siteID), ([key, values]) => ({
  siteID: key,
  aantal: values.reduce((total, d) => total + d.aantal, 0)
}));
```

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => barChart(groupedData, {width}))}</div>
</div>

```js
const _tmp = Array.from(d3.group(sites, d=>d.gemeente), ([key, values]) => ({
  name: key,
  ids: values.reduce((total, d) => total.concat(d.siteID), [])
}));

const siteIDs = new Map();
let names = [];

for(let item of _tmp){
  siteIDs.set(item.name,item.ids);
  names.push(item.name);
}
```

## Gemiddeld aantal tellingen per meetpunt

```js
let gemeente = view(Inputs.select(names, {value: "Gent"}))
```
```js
let ids = siteIDs.get(gemeente) ?? []
```


<h2>${gemeente}</h2>

```js
const hourLabels = [
"00:00", 
"01:00", 
"02:00", 
"03:00", 
"04:00", 
"05:00", 
"06:00", 
"07:00", 
"08:00", 
"09:00", 
"10:00", 
"11:00", 
"12:00", 
"13:00", 
"14:00", 
"15:00", 
"16:00", 
"17:00", 
"18:00", 
"19:00", 
"20:00", 
"21:00", 
"22:00", 
"23:00", 
]
const getLabel = (index) => {
  // return hourLabels[index]
  return index.toString().padStart(2, "0")
}
const filterFunction = (d) => {
  let date = new Date(d.van)
  return date.getUTCHours() * 4 + date.getUTCMinutes() / 15;
}
let IN = []
let IN_TOTAL = Array.from(d3.group(tellingen, filterFunction), ([key, values]) => {
  let v= values.filter(elem => elem.richting == "IN");
    return ({
      name: getLabel(key),
      value: v.reduce((total, d) => total + d.aantal, 0) / v.length
    })
  }
).sort((a,b) => a.name - b.name);
let OUT = [];
let OUT_TOTAL = Array.from(d3.group(tellingen, filterFunction), ([key, values]) => {
  let v= values.filter(elem => elem.richting == "OUT");
  return ({
    name: getLabel(key),
    value: v.reduce((total, d) => total + d.aantal, 0) / v.length
  })
}
).sort((a,b) => a.name - b.name);
d3.bin().value(filterFunction)(tellingen).forEach((value, index) => {
  value.forEach((v) => {
      const item = {timeslot: getLabel(filterFunction(v)), value: v.aantal}
      if(v.richting === "IN"){
        if(ids.includes(v.siteID)){
          IN.push(item)
        }
      } else {
        if(ids.includes(v.siteID)){
          OUT.push(item)
        }
      }
  })
});
const m = 20;
```


<div class="grid grid-cols-1">
  <div class="card">${resize((width) => dailyVolumeChart(IN, IN_TOTAL, {width, m}))}</div>
</div>

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => dailyVolumeChart(OUT, OUT_TOTAL, {width, m}))}</div>
</div>


### Jaaroverzicht
```js
let all_years = [... new Set(jaaroverzicht.map(d => new Date(d.dag).getFullYear().toString()))]
let all_sites = [... new Set(sites.map(d => d.siteID.toString()))]
```

```js
// input fields
const SelectedYearInput = Inputs.select(all_years)
const selectedYear = Generators.input(SelectedYearInput)
const SelectedSiteInput = Inputs.select(all_sites)
const SelectedSite = Generators.input(SelectedSiteInput)
```


<div class="card" style="display: flex; gap: 0.5rem;">
    <div>${SelectedYearInput}</div>
    <div>${SelectedSiteInput}</div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => overviewYear(jaaroverzicht, parseInt(selectedYear), parseInt(SelectedSite), width))}
  </div>
</div>
