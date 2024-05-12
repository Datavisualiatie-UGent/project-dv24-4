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
const estimatedCounts = FileAttachment("data/estimatedCounts.csv").csv({typed: true});
const totalCounts = FileAttachment("data/totalCounts.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const in_out = FileAttachment("data/inOutData.csv").csv({typed: true});
const jaaroverzicht = FileAttachment("data/jaaroverzicht.csv").csv({typed: true});
const cumulatieveCounts = FileAttachment("data/cumulativeMeanPerMonth.json").json();

import {estimatedOverview} from "./components/estimatedOverview.js"
import {overviewYearMonth, overviewYearWeekday} from "./components/overviewYear.js";
import {createMap} from "./components/mapUtils.js";
import {barChart} from "./components/barChartSiteIDAantal.js";
import {doubleBarHorizontal} from "./components/dailyVolume.js";
import {plotNormalizedData, getTrendCompareData, getFistAndSecondTrendYears} from './components/historyPlot.js';
```

```js
createMap(sites);
```

## Drukte benadering

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => estimatedOverview(estimatedCounts, width))}
  </div>
</div>

```js
const siteIDs = new Map();

const activeSiteIds = new Set(totalCounts.map(d => d.siteID))
for (let item of sites) {
    if (activeSiteIds.has(item.siteID)) {
        if (siteIDs.has(item.naam)) {
            siteIDs.set(item.naam + " + id: " + item.siteID, item.siteID);
        } else {
            siteIDs.set(item.naam, item.siteID);
        }
    }
}
const names = Array.from(siteIDs.keys()).sort();
```

### Selecteer site:
```js
let selectedSite = view(Inputs.select(names, {value: "Gent"}))
```


## Aantal tellingen

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => barChart(totalCounts, {width}))}</div>
</div>



## Gemiddeld aantal tellingen per meetpunt
```js
let ids = siteIDs.get(selectedSite) ?? []
```


<h3>${selectedSite}:</h3>

```js
let data = in_out.filter(item => item.siteID === ids).sort((a, b) => new Date(a.timeframe) > new Date(b.timeframe))
```

<div class="grid grid-cols-1">

  <div class="card">${resize((width) => doubleBarHorizontal(data, {width}))}</div>

</div>

### Jaaroverzicht

```js
const SelectedSite = siteIDs.get(selectedSite)

// get all possible years
const all_years = [... new Set(jaaroverzicht.filter(d => d.siteID == SelectedSite).map(d => new Date(d.dag).getFullYear().toString()))]

const SelectedYearInput = Inputs.select(all_years)
const selectedYear = Generators.input(SelectedYearInput)
```


<div class="card" style="display: flex; gap: 0.5rem;">
    <div>${SelectedYearInput}</div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => overviewYearMonth(jaaroverzicht, parseInt(selectedYear), parseInt(SelectedSite), width))}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => overviewYearWeekday(jaaroverzicht, parseInt(selectedYear), parseInt(SelectedSite), width))}
  </div>
</div>



<!-- 
TREND 
-->
### Trend fietstellingen
<label>Selecteer jaar:</label>
```js
const year = view(Inputs.select(Object.keys(cumulatieveCounts.resultJSON), {value: Object.keys(cumulatieveCounts.resultJSON)[0]}))
```

<label>Selecteer gemeentes:</label>
<div style="display: flex; justify-content: space-between; align-items: center;">


```js
const possibleFirstTrends = Object.keys(cumulatieveCounts.resultJSON[year].normalizedSiteCumulativeCountsGemeente).sort()

const firstTrend = view(Inputs.select(possibleFirstTrends), {value: possibleFirstTrends[0]})
```

```js
const possibleSencondTrends = possibleFirstTrends.filter(gemeente => gemeente !== firstTrend)
const secondTrend = view(Inputs.select(possibleSencondTrends), {value: possibleSencondTrends[0]})
```

```js
const trendCompareData = getTrendCompareData(cumulatieveCounts, year, firstTrend, secondTrend);
```
</div>
<div class="grid grid-cols-1">
  <div class="card">${resize((width) => plotNormalizedData(trendCompareData.filteredObj, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, trendCompareData.totalMothsCount, {width: width}))}</div>
</div>

```js
// all years after year for first trend
const fistAndSecondTrendYears = getFistAndSecondTrendYears(cumulatieveCounts, year, firstTrend, secondTrend)
```

<div class="grid grid-cols-2">
  <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.firstTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.firstTrendActiveSince, fistAndSecondTrendYears.minY, fistAndSecondTrendYears.maxY))}</div>
  <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.secondTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.secondTrendActiveSince, fistAndSecondTrendYears.minY, fistAndSecondTrendYears.maxY))}</div>
</div>


<!-- 
TREND 
-->
