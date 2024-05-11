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

```html

<style>
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

p {
    max-width: 100vw !important;
}
</style>

<div>
    <div>
        <h1>Fietstellingen</h1>
    </div>
    <p>
        Er wordt dagelijks veel gefiets in België. Dit voor het plezier, 
        maar ook heel veel woon-werk verkeer of studenten die van/naar school gaan.
        Om dit beter in kaart te kunnen brengen heeft Agentschap wegen & verkeer Vlaanderen een 140tal fietspunten geplaats in vlaanderen.
        Hierdoor hebben ze meer zicht op bijvoorbeeld volgende dingen: hoeveel fietsers rijden er per jaar, Wat is het aantal op piekmomenten, etc.
    </p>
    <p>
        Wij hebben ons gefocused om volgende feiten te bekijken:
    </p>
        <div>
            <ul>
                <li>Drukte van fietsers doorheen de jaren</li>
                <li>Het verschil tussen inkomend en uitgaand verkeer</li>
                <li>De drukte op 1 bepaald meetpunt</li>
                <li>Verandering van drukte op een meetpunt</li>
            </ul>
        </div>
    <p>
        Deze data is door Vlaanderen openbaar gemaakt als open data. 
        Je kan de volledige data <a href="https://opendata.apps.mow.vlaanderen.be/fietstellingen/index.html">hier</a> vinden.
    </p>
</div>
<div>
    <h2>Meetpunten</h2>
    <p>
        Op deze map zijn alle meetpunten zichtbaar. Voor elk meetpunt is volgende info beschikbaar:
    </p>

    <div>
        <ul>
            <li>Naam van de site</li>
            <li>De gemeente</li>
            <li>Datum van de eerste telling</li>
        </ul>
    </div>
    <div class="center-map" style="width: 100%">
        <div id="map" class="style-map"></div>
    </div>
</div>
<hr>
```

```js
// Imports
const totalCounts = FileAttachment("data/totalCounts.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const richtingen = FileAttachment("data/richtingen.csv").csv({typed: true});
const in_out = FileAttachment("data/inOutData.csv").csv({typed: true});
const jaaroverzicht = FileAttachment("data/jaaroverzicht.csv").csv({typed: true});
const cumulatieveCounts = FileAttachment("data/cumulativeMeanPerMonth.json").json();

import {overviewYearMonth, overviewYearWeekday} from "./components/overviewYear.js";
import {createMap} from "./components/mapUtils.js";
import {barChart} from "./components/barChartSiteIDAantal.js";
import {doubleBarHorizontal} from "./components/dailyVolume.js";
import {plotNormalizedData, getTrendCompareData, getFistAndSecondTrendYears} from './components/historyPlot.js';
```

```js
createMap(sites);
```

## Aantal tellingen

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => barChart(totalCounts, {width}))}</div>
</div>

```js
const siteIDs = new Map();
let names = [];

for(let item of sites){
  siteIDs.set(item.naam,item.siteID);
  names.push(item.naam);
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
let data = in_out.filter(item => item.siteID === ids).sort((a, b) => new Date(a.timeframe) > new Date(b.timeframe))
```

<div class="grid grid-cols-1">

  <div class="card">${resize((width) => doubleBarHorizontal(data, {width}))}</div>

</div>

### Jaaroverzicht
```js
let all_years = [... new Set(jaaroverzicht.map(d => new Date(d.dag).getFullYear().toString()))]
let all_sites = [... new Set(jaaroverzicht.map(d => d.siteID.toString()))].sort((a, b) => a-b)
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
const possibleFirstTrends = Object.keys(cumulatieveCounts.resultJSON[year].normalizedSiteCumulativeCountsGemeente)

const firstTrend = view(Inputs.select(possibleFirstTrends), {value: possibleFirstTrends[0]})
```

```js
const possibleSencondTrends = Object.keys(cumulatieveCounts.resultJSON[year].normalizedSiteCumulativeCountsGemeente).filter(gemeente => gemeente !== firstTrend)
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

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.firstTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, trendCompareData.totalMothsCount, {width: width}, fistAndSecondTrendYears.firstTrendActiveSince))}</div>
</div>

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.secondTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, trendCompareData.totalMothsCount, {width: width}, fistAndSecondTrendYears.secondTrendActiveSince))}</div>
</div>

<!-- 
TREND 
-->
