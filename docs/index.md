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
const in_out = FileAttachment("data/inOutData.csv").csv({typed: true});

import {createMap} from "./components/mapUtils.js";
import {barChart} from "./components/barChartSiteIDAantal.js";
import {overviewYear} from "./components/overviewYear.js";
import {dailyVolumeChart, doubleBar} from "./components/dailyVolume.js";
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
console.log(sites)
// const _tmp = Array.from(sites, ([key, values]) => ({
//   name: key,
//   ids: values.reduce((total, d) => total.concat(d.siteID), [])
// }));

const siteIDs = new Map();
let names = [];

for(let item of sites){
  siteIDs.set(item.name,item.siteID);
  names.push(item.name);
}
names = names.sort()
```

## Gemiddeld aantal tellingen per meetpunt

```js
let gemeente = view(Inputs.select(names, {value: "Gent"}))
```
```js
let ids = siteIDs.get(gemeente) ?? []
```


<h2>${gemeente}</h2>
<p>${ids}</p>


```js
function calculateLabel(timeframe){
  let hour = (Math.floor(timeframe / 4)).toString().padStart(2, "0")
  let quarter = ["00", "15", "30", "45"][timeframe % 4]
  return `${hour}:${quarter}`
}
let data = in_out.filter(item => item.siteID === ids).sort((a,b) => a.timeframe > b.timeframe)
console.log(data)
data = data.map(item => {
  item.timeframe = calculateLabel(item.timeframe)
  return item
})
console.log(data)
```


<div class="grid grid-cols-1">

  <div class="card">${resize((width) => doubleBar(data, {width}))}</div>

</div>


[//]: # (<div class="grid grid-cols-1">)

[//]: # (  <div class="card">${resize&#40;&#40;width&#41; => dailyVolumeChart&#40;OUT, OUT_TOTAL, {width, m}&#41;&#41;}</div>)

[//]: # (</div>)


### Jaaroverzicht
```js
let all_years = [... new Set(tellingen.map(d => new Date(d.van).getFullYear().toString()))]
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
    ${resize((width) => overviewYear(tellingen, parseInt(selectedYear), parseInt(SelectedSite), width))}
  </div>
</div>
