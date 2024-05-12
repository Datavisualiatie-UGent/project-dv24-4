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
import {estimatedOverview} from "./components/estimatedOverview.js";
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
let selectedSiteId = siteIDs.get(selectedSite)
```

<p>
    Over het algemeen is bij de meeste punten de volgende trend te zien: 
rond 8h is er een toename van fietsers in beide richtingen, dit zal de ochtendspits zijn van iedereen die naar het werk moet.
De avondspits is meer uitgesmeerd aangezien sommige mensen langer werken of misschien nog een activiteit hebben na het werk.
Sommige meetpunten liggen langs een grote baan, en zijn gesplitst in 2 stations. Hierdoor is er een asymmetrie tussen het binnenkomende en uitgaande verkeer.
Een paar voorbeelden hiervan zijn 'Ardooie teller 1' en 'Ardooie teller 2'. 
De oriëntatie van de teller is ook niet altijd consistent zoals bijvoorbeeld bij 'Brasschaat 2' en 'Brasschaat 1'
</p>

<h3>${selectedSite}:</h3>

```js
let data = in_out.filter(item => item.siteID === selectedSiteId).sort((a, b) => new Date(a.timeframe) > new Date(b.timeframe))
```

<div class="grid grid-cols-1">

  <div class="card">${resize((width) => doubleBarHorizontal(data, {width}))}</div>

</div>

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

```js
// get all possible years
const all_years = [... new Set(jaaroverzicht.filter(d => d.siteID == selectedSiteId).map(d => new Date(d.datum).getFullYear().toString()))]

const SelectedYearInput = Inputs.select(all_years)
const selectedYear = Generators.input(SelectedYearInput)
```


<div class="card" style="display: flex; gap: 0.5rem;">
    <div>${SelectedYearInput}</div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => overviewYearMonth(jaaroverzicht, parseInt(selectedYear), parseInt(selectedSiteId), width))}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => overviewYearWeekday(jaaroverzicht, parseInt(selectedSiteId), width))}
  </div>
</div>



<!-- 
TREND 
-->
## Trend fietstellingen

<div>Patronen, in dit geval trends genoemd, worden zichtbaar gedurende een bepaalde periode. We concentreren ons hier op trends die zich binnen één jaar voordoen. Door deze trends te onderzoeken, kunnen we veel leren over de groei en afname van fietsers in een bepaalde gemeente gedurende deze periode.</div>
<br/>
<div>Bij het analyseren van trends letten we op de helling van de stijging of daling tussen twee opeenvolgende maanden. Een steilere helling wijst op een krachtigere groei, terwijl hetzelfde geldt voor een daling in omgekeerde richting.</div>

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

<div>Over het algemeen is opmerkelijk dat er een aanzienlijke groei is tijdens de lente- en zomermaanden, naarmate het weer verbetert. Bovendien is er een duidelijke overgang naar de koudere herfst- en wintermaanden te zien, gekenmerkt door een significante neerwaartse trend.</div>

```js
// all years after year for first trend
const fistAndSecondTrendYears = getFistAndSecondTrendYears(cumulatieveCounts, firstTrend, secondTrend)
```

<div class="grid grid-cols-2">
  <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.firstTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.firstTrendActiveSince, fistAndSecondTrendYears.minY, fistAndSecondTrendYears.maxY))}</div>
  <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.secondTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.secondTrendActiveSince, fistAndSecondTrendYears.minY, fistAndSecondTrendYears.maxY))}</div>
</div>

<div>Ook het effect van de coronaperiode is waarneembaar. In 2020 begint de groei van fietsgebruik langzamer, wat toe te wijten is aan de start van de lockdown in maart. Dit fenomeen is ook duidelijk zichtbaar in de grafiek van de drukte. In latere jaren blijft de groei meestal rond dezelfde maanden plaatsvinden.</div>

<!-- 
TREND 
-->