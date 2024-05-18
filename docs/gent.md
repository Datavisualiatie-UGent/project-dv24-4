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

import {generalOverview} from "./components/generalOverview.js";
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
            Hier bekijken we specifiek de info over de Gent-site.
            Dit meetpunt bevindt zich langs de fietssnelweg naast de R4 rond Gent en bestaat al sinds 22 augustus 2019.
        </p>
        <p>
            Je zou veronderstellen dat dit soort fietspaden voornamelijk gebruikt worden voor woon-werkverkeer en studenten.
            Dit is ook wat we in de onderstaande grafieken zullen illustreren.
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

```js
const overviewTitle= "Drukte benadering in Gent"
const overviewSubtitle = "Benadering van het aantal fietsers die dit meetpunt voorbij fietsen."
```

```html

<div>
    <div>
        <p>
            De grafiek toont de algemene drukte op het fietspad gedurende de periode dat het meetpunt operationeel is. 
            Het is meteen duidelijk dat het fietspad voornamelijk wordt gebruikt tussen de maanden april tot juni en september tot november. 
            Bovendien valt op dat er bijna elk jaar een aanzienlijke daling van de drukte te zien is tijdens de zomermaanden.
        </p>
    </div>
    <div class="grid grid-cols-1">
        <div class="card">
            ${resize((width) => generalOverview(drukte_data, 20,overviewTitle,overviewSubtitle, width))}
        </div>
    </div>
</div>
<hr>
```

## Jaaroverzicht

```js
const jaarWeekTitle = "Jaaroverzicht van Gent - per week"
const jaarWeekSubtitle = "Het totaal aantal fietsers op één dag is weergegeven. Elke rij is een weekdag."
```

```html
<div>
    <div>
        <p>
            Deze grafiek geeft een jaaroverzicht dat geordend is per weekdag. Zo staat een bepaalde weekdag op eenzelfde lijn.
            Het is hier meteen duidelijk dat dit fietspad aanzienlijk meer wordt gebruikt op maandag tot en met vrijdag dan in het weekend.
        </p>
        <p>
            We zien hier opnieuw goed dat dit fietspad vooral gebruikt wordt tussen april tot juni en september tot november. 
            De maanden dat de meeste studenten rondfietsen in Gent.
        </p>
        <p>
            Ten slotte vallen ook de vakantieperiodes op. 
            Zo is te zien dat er tijdens de herfstvakantie aanzienelijk minder fietsers zijn.        
        </p>
    </div>
    <div class="grid grid-cols-1">
        <div class="card">
            ${resize((width) => overviewYearWeekday(jaaroverzicht, parseInt(13),jaarWeekTitle,jaarWeekSubtitle, width))}
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
            Opnieuw zien we hier wat we al op andere grafieken hebben waargenomen.
        </p>
    </div>
    <div class="grid grid-cols-1">
      <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.firstTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.firstTrendActiveSince))}</div>
    </div>
</div>
```
