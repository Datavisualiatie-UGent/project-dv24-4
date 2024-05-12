---
title: Gent
---

```html
<style>
    p {
        max-width: 100vw !important;
    }
</style>
```

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
    <div>
        <p>
            Hier bekijken we specifiek de info over de Gent site.
            Dit meetpunt bevindt zich op de fietssnelweg naast de R5 rond Gent en bestaat al sinds 22 augustus 2019.
        </p>
        <p>
            Je zou verwachten dat dit soort fietspaden vooral gebruikt worden door mensen die naar hun werk fietsen en studenten die naar school gaan.
            Dit is ook wat we in onderstaande grafieken zullen aantonen.
        </p>
    </div>
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
        <p>
            Hier zien we algemene drukte van het fietspad over de tijd dat het meetpunt bestaat.
            Het valt hier direct al op dat het fietspad vooral gebruikt wordt tussen de maanden april/juni en september/November.
            Ook valt het op dat er bijna elke zomer een grote daling is van de drukte.
        </p>
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
        <p>
            Hier zien we een jaaroverzicht dat geordend is per weekdag. Zo staan alle zondagen op eenzelfde lijn.
            Hier valt het ook al direct op dat dit fietspad veel meer gebruikt wordt op maandag tot en met vrijdag dan in het weekend.
        </p>
        <p>
            We hier opnieuw goed dat dit fietspad vooral gebruikt wordt tussen april/juni en september/November. 
            De maanden dat er het meeste studenten rondfietsen 
        </p>
        <p>
            Als laatst vallen ook de vakanties enorm op. Zo zien we dat in de herfstvakantie er amper fietsers zijn.
        </p>
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
const firstTrend = "Gent"
const secondTrend = "Gent"
const trendCompareData = getTrendCompareData(cumulatieveCounts, 2020, firstTrend, secondTrend);
const fistAndSecondTrendYears = getFistAndSecondTrendYears(cumulatieveCounts, firstTrend, secondTrend)
```
```html
<div>
    <div>
        <p>
            Als laatst zien we hier ook nog de trends van alle fietspunten gelegen in Gent. 
            Hier zien we opnieuw wat we ook op de andere grafieken zagen.
        </p>
    </div>
    <div class="grid grid-cols-1">
      <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.firstTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.firstTrendActiveSince))}</div>
    </div>
</div>
```
