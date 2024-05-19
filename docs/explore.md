---
title: Explore it yourself
---

```html
<style>
    p {
        max-width: 100vw !important;
    }
</style>
```

```js
// Imports
const totalCounts = FileAttachment("data/totalCounts.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const in_out = FileAttachment("data/inOutData.csv").csv({typed: true});
const jaaroverzicht = FileAttachment("data/jaaroverzicht.csv").csv({typed: true});
const cumulatieveCounts = FileAttachment("data/cumulativeMeanPerMonth.json").json();

import {createMap} from "./components/mapUtils.js";
import {overviewYearMonth, overviewYearWeekday} from "./components/overviewYear.js";
import {doubleBarHorizontal} from "./components/dailyVolume.js";
import {generalOverview} from "./components/generalOverview.js";
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
    <p>
        Hier kan je zelf experimenteren. 
        De volgende visualisaties zijn afhankelijk van welke site je kiest.
    </p>
</div>
```

## Selecteer site
```js
let selectedSite = view(Inputs.select(names, {value: "Gent"}))
```
```js
let selectedSiteId = siteIDs.get(selectedSite)
```

## Drukte

```js
const drukte_data = jaaroverzicht.filter(d => d.siteID === selectedSiteId).sort((a,b) => new Date(b.datum) - new Date(a.datum))
```

```js
const overviewTitle= `Drukte benadering in ${selectedSite}`
const overviewSubtitle = "Benadering van het aantal fietsers die dit meetpunt voorbij fietsen."
```

```html
<div>
    <div>
        <p>
            Om een idee te krijgen van wanneer de drukke periodes zijn bij een bepaald telpunt, hebben we volgende grafiek gemaakt.
            Hierop kan je zien hoeveel fietsers er ongeveer op deze plaats passeren op een bepaalde periode.
            Het is hier direct mogelijk om te zien wanneer de drukke en rustigere periodes zijn.
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

## Gemiddeld aantal inkomende en uitgaande fietsers

```js
const inOutData = in_out.filter(item => item.siteID === selectedSiteId).sort((a, b) => new Date(a.timeframe) > new Date(b.timeframe))
```

```html
    <div>
        <p>
            Er wordt ook bijgehouden in welke richting fietsers passeren langs een telpunt.
            Dit wordt weergegeven in de volgende grafiek.
            Hier tonen we het gemiddelde aantal fietsers, opgesplitst naar de richting waarin ze fietsen.
            Deze grafiek kan worden gebruikt om te beoordelen of dit fietspad voornamelijk wordt gebruikt tijdens de ochtend- en avondspits.
        </p>
        <p>
            Sommige meetpunetn liggen echter langs een brede baan, waardoor ze gesplitst zijn.
            Hierdoor kan er dus soms asymmetrie zijn tussen het binnenkomende en uitgaande verkeer.
            Een paar voorbeelden hiervan zijn 'Ardooie teller 1' en 'Ardooie teller 2'.
            Ook de oriëntatie van de teller is ook niet altijd consistent zoals bijvoorbeeld bij 'Brasschaat 2' en 'Brasschaat 1'
        </p>
    </div>
    <div class="grid grid-cols-1">
      <div class="card">${resize((width) => doubleBarHorizontal(inOutData, {width}))}</div>
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

```js
const jaarMonthTitle = `Jaaroverzicht van ${selectedSite} in ${parseInt(selectedYear)} - per maand`
const jaarMonthSubtitle = "Het totaal aantal fietsers op één dag is weergegeven. Elke rij is één maand."

const jaarWeekTitle = `Jaaroverzicht van ${selectedSite} - per week`
const jaarWeekSubtitle = "Het totaal aantal fietsers op één dag is weergegeven. Elke rij is een weekdag."
```

```html
<div>
    <div>
        <p>
            Je zou verwachten dat er in de data zeker patronen zijn te herkennen,
            zoals dat er meer gefietst zou worden in de zomer dan de winter of dat er bijvoorbeeld meer fietsers in de week zijn dan in het weekend.
            Om dit te kunnen weergeven hebben we twee jaaroverzichten voorzien.
        </p>

        <p>
            De eerste grafiek geeft een overzicht van één jaar waar elke dag van het jaar wordt weergegeven door het aantal fietsers op die dag.
            De dagen zijn hier geordend per maand, zo is 1 rij gelijk aan 1 maand.
            Dagen met meer fietsers zijn donkerder gekleurd.
            Het jaar dat wordt weergegeven kan je zelf kiezen aan de hand van onderstaande dropdown.
        </p>

        <p>
            De tweede grafiek geeft een overzicht van alle jaren in de data.
            Maar hier wordt de data geordend per week i.p.v. per maand.
            Zo zijn patronen die afhankelijk zijn per week beter zichtbaar.
        </p>
    </div>
    
    <div>
        <div>${SelectedYearInput}</div>
    </div>

    <div class="grid grid-cols-1">
        <div class="card">
            ${resize((width) => overviewYearMonth(
                                    jaaroverzicht, 
                                    parseInt(selectedYear), 
                                    parseInt(selectedSiteId),
                                    jaarMonthTitle,
                                    jaarMonthSubtitle,
                                    width
                                )
            )}
        </div>
    </div>

    <div class="grid grid-cols-1">
        <div class="card">
            ${resize((width) => overviewYearWeekday(
                                    jaaroverzicht, 
                                    parseInt(selectedSiteId),
                                    jaarWeekTitle,
                                    jaarWeekSubtitle,
                                    width
                                )
            )}
        </div>
    </div>
</div>
<hr>

```


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
const fistAndSecondTrendYears = getFistAndSecondTrendYears(cumulatieveCounts, firstTrend, secondTrend)
```

</div>
    <div class="grid grid-cols-1">
      <div class="card">${resize((width) => plotNormalizedData(trendCompareData.filteredObj, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, trendCompareData.totalMothsCount, {width: width}))}</div>
    </div>

```html
<div>
    <p>
        Naast de vergelijking tussen 2 gemeentes, hebben we ook een trend die eenzelfde gemeente vergelijkt door de jaren heen.
    </p>
</div>

<div class="grid grid-cols-2">
    <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.firstTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.firstTrendActiveSince, fistAndSecondTrendYears.minY, fistAndSecondTrendYears.maxY))}</div>
    <div class="card">${resize((width) => plotNormalizedData(fistAndSecondTrendYears.secondTrendsYears, trendCompareData.startDate, trendCompareData.gemeenteActiveSince, fistAndSecondTrendYears.totalMothsCount, {width: width}, fistAndSecondTrendYears.secondTrendActiveSince, fistAndSecondTrendYears.minY, fistAndSecondTrendYears.maxY))}</div>
</div>

<div>
    <p>
        Mogelijks is ook het effect van de coronaperiode waarneembaar.
        In 2020 zien we duidelijk een zwakke groei en soms zelfs een daling in maart. 
        Dit kan erop wijzen dat de lockdown net begon en mensen binnen bleven. 
        Opvallend is echter de enorme groei die we zien in april. 
        Dit zou de oorzaak kunnen zijn van mensen die na verloop van tijd in lockdown veel zijn gaan fietsen.
    </p>
</div>
```

