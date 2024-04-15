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

<div class="center-map" style="width: 100%">
    <div id="map" class="style-map"></div>
</div>

```js
// Imports
const sites = FileAttachment("data/sites.csv").csv({typed: true});
let tellingen = FileAttachment("data/data.csv").csv({typed: true});
const richtingen = FileAttachment("data/richtingen.csv").csv({typed: true});

import {createMap} from "./components/mapUtils.js";
import {barChart} from "./components/barChartSiteIDAantal.js";
import {overviewYear} from "./components/overviewYear.js";
```

```js
createMap(sites);
```

### Overzicht
```js
const groupedData = Array.from(d3.group(tellingen, d => d.siteID), ([key, values]) => ({
  siteID: key,
  aantal: values.reduce((total, d) => total + d.aantal, 0)
}));
```

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => barChart(groupedData, {width}))}</div>
</div>


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
