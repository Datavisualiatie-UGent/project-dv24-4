---
title: Gent
---

```js
const jaaroverzicht = FileAttachment("data/jaaroverzicht.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const cumulatieveCounts = FileAttachment("data/cumulativeMeanPerMonth.json").json();

import {estimatedOverview} from "./components/estimatedOverview.js";
import {overviewYearWeekday} from "./components/overviewYear.js";
import {createMap} from "./components/mapUtils.js";
import {plotNormalizedData, getTrendCompareData, getFistAndSecondTrendYears} from './components/historyPlot.js';
```

# Gent

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
        height: 300px;
    }

</style>

<div class="grid grid-cols-2">
    <p>
        Tekstje over gent
    </p>
    <div class="center-map" style="width: 100%">
        <div id="map" class="style-map"></div>
    </div>
</div>
<hr>
```

```js
createMap(sites, 13);
```

## Drukte
```js
const drukte_data = jaaroverzicht.filter(d => d.siteID === 13).sort((a,b) => new Date(b.datum) - new Date(a.datum))
```
```html

<div>
    <div>
        <p>tekst</p>
    </div>
    <div class="grid grid-cols-1">
        <div class="card">
            ${resize((width) => estimatedOverview(drukte_data, 20, width))}
        </div>
    </div>
</div>
<hr>
```

## Jaaroverzicht

```html
<div>
    <div>
        <p>Tekst over grafiek</p>
        <div>
            <ul>
                <li>verschil weekend</li>
                <li>Verschil zomer/schoolweek</li>
                <li>vakanties</li>
            </ul>
        </div>
    </div>
    <div class="grid grid-cols-1">
        <div class="card">
            ${resize((width) => overviewYearWeekday(jaaroverzicht, parseInt(13), width))}
        </div>
    </div>
</div>
<hr>
```

## Trend

```js
// all years after year for first trend
const firstTrend = "Gent"
const secondTrend = "Gent"
const trendCompareData = getTrendCompareData(cumulatieveCounts, 2020, firstTrend, secondTrend);
const fistAndSecondTrendYears = getFistAndSecondTrendYears(cumulatieveCounts, firstTrend, secondTrend)
```
<div>
    <div>
    <p>tekst</p>
    </div>
    <div class="grid grid-cols-1">
      <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.firstTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.firstTrendActiveSince))}</div>
    </div>
</div>
