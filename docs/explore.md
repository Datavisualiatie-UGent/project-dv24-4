---
title: Explore it yourself
---

```js
// Imports
const totalCounts = FileAttachment("data/totalCounts.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const in_out = FileAttachment("data/inOutData.csv").csv({typed: true});
const jaaroverzicht = FileAttachment("data/jaaroverzicht.csv").csv({typed: true});
const cumulatieveCounts = FileAttachment("data/cumulativeMeanPerMonth.json").json();

import {overviewYearMonth, overviewYearWeekday} from "./components/overviewYear.js";
import {doubleBarHorizontal} from "./components/dailyVolume.js";
import {plotNormalizedData, getTrendCompareData, getFistAndSecondTrendYears} from './components/historyPlot.js';
```

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

# Explore it yourself
```html
<div>
    <p>Hier kan je zelf spelen</p>
</div>
```

## Selecteer site
```js
let selectedSite = view(Inputs.select(names, {value: "Gent"}))
```


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

## Jaaroverzicht

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
## Trend fietstellingen
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

<div class="grid grid-cols-2">
  <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.firstTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.firstTrendActiveSince, fistAndSecondTrendYears.minY, fistAndSecondTrendYears.maxY))}</div>
  <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.secondTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.secondTrendActiveSince, fistAndSecondTrendYears.minY, fistAndSecondTrendYears.maxY))}</div>
</div>


<!-- 
TREND 
-->