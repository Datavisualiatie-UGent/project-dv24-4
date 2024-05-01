---
title: hist-test
---


```js
// Imports
const tellingen = FileAttachment("data/allData.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const richtingen = FileAttachment("data/richtingen.csv").csv({typed: true});

import { calculateMonthsBetween, plotNormalizedData } from './components/historyUtils.js';
```


```js
const siteIDs = new Map();
let names = [];

for (let [key, values] of d3.group(sites, d => d.gemeente)) {
  const ids = values.map(d => d.siteID);
  siteIDs.set(key, ids);
  names.push(key);
}
```

```js
// TODO cumulatieve gemiddelde aantal tellingen voor elke maand
// per meetpunt en hierover het gemiddelde nemen om te zorgen dat nieuwe meetpunten niet te veel invloed hebben

const sitesInTellingsData = Array.from(new Set(tellingen.map(d => d.siteID)));
// + 1 because we want to include the last month
const totalMothsCount = calculateMonthsBetween(tellingen[0].van, tellingen[tellingen.length - 1].tot) + 1;

const siteActiveSince = new Map();

for (let site of sites) {
    const monthsBetween = calculateMonthsBetween(tellingen[0].van, site.datum_van);
    if (monthsBetween < 0) {
        siteActiveSince.set(site.siteID, 0);
    } else {
        siteActiveSince.set(site.siteID, monthsBetween);
    }
}

const gemeenteActiveSince = new Map();
for (let [gemeente, sites] of siteIDs) {
    const firstActiveMonth = d3.min(sites.map(siteID => siteActiveSince.get(siteID)));
    if (firstActiveMonth < 0) {
        gemeenteActiveSince.set(gemeente, 0);
    } else {
        gemeenteActiveSince.set(gemeente, firstActiveMonth);
    }
}


const siteTotalCounts = new Map();
const siteTotalCountsDates = new Map();
// hier uit kan je de index halen en totaal aantal maanden

for (let telling of tellingen) {
    if (!siteTotalCounts.has(telling.siteID)) {
        siteTotalCounts.set(telling.siteID, Array.from({length: totalMothsCount}, () => 0));
        siteTotalCountsDates.set(telling.siteID, Array.from({length: totalMothsCount}, () => null));
    }
    
    const diffMonth = calculateMonthsBetween(tellingen[0].van, telling.van);
    
    const siteCountsDate = siteTotalCountsDates.get(telling.siteID);
    
    if (siteCountsDate[diffMonth] === null) {
        siteCountsDate[diffMonth] = new Date(telling.van);
    }
    
    let siteCounts = siteTotalCounts.get(telling.siteID);
    siteCounts[diffMonth] += telling.aantal;
    
    if (siteCountsDate[diffMonth] > new Date(telling.van)){
        siteCountsDate[diffMonth] = new Date(telling.van);
    }
}

function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

const siteTotalCountsMeanPerMonth = new Map();
for (let [siteID, counts] of siteTotalCounts) {
    siteTotalCountsMeanPerMonth.set(siteID, Array.from({length: totalMothsCount}, () => 0));
    
    const siteCountsDate = siteTotalCountsDates.get(siteID);
    
    for (let i = 0; i < counts.length; i++) {
        
        if (siteCountsDate[i] === null) continue;
        
        siteTotalCountsMeanPerMonth.get(siteID)[i] = counts[i] / getDaysInMonth(siteCountsDate[i].getMonth(), siteCountsDate[i].getFullYear())
    }
}

const siteCumulativeCounts = new Map();
for (let [siteID, counts] of siteTotalCountsMeanPerMonth) {
    let cumulativeCounts = Array.from({length: totalMothsCount}, () => 0);
    
    const firstActiveMonth = siteActiveSince.get(siteID);
    // if the site is not active yet, we don't need to calculate the cumulative average
    if (firstActiveMonth >= cumulativeCounts.length) continue;
    
    cumulativeCounts[firstActiveMonth] = counts[firstActiveMonth];
    for (let i = firstActiveMonth + 1; i < cumulativeCounts.length; i++) {
        // look at the previous month divided by 2 to get the better trend
        cumulativeCounts[i] = (counts[i] + cumulativeCounts[i - 1])/2;
    }
    
    // other way to calculate the cumulative average
    /*for (let i = firstActiveMonth; i < cumulativeCounts.length; i++) {
        let cumulativeCount = 0;
        for (let j = firstActiveMonth; j <= i; j++) {
            cumulativeCount += counts[j];
        }
        cumulativeCounts[i] = cumulativeCount / (i + 1);
    }*/
    siteCumulativeCounts.set(siteID, cumulativeCounts);
}


//console.log(siteTotalCounts);
//console.log(siteCumulativeCounts);

const siteCumulativeCountsGemeente = new Map();
for (let [gemeente, sites] of siteIDs) {
    
    let gemeenteCounts = Array.from({length: totalMothsCount}, () => 0)
    
    for (let index = 0; index < gemeenteCounts.length; index++){
        let total = 0;
        let devide = 0;
        for (let site of sites){
            if (siteActiveSince.get(site) <= index) {
                total += siteCumulativeCounts.get(site)[index];
                devide++;
            }
        }
        if (devide !== 0){
            gemeenteCounts[index] = total / devide;
        } else {
            gemeenteCounts[index] = 0;
        }
    }
    if (gemeenteCounts.some(count => count > 0)){
        siteCumulativeCountsGemeente.set(gemeente, gemeenteCounts);
    }
}

//console.log(siteIDs);
//console.log(siteCumulativeCounts);
//console.log(siteCumulativeCountsGemeente);

//normalize the data
const normalizedSiteCumulativeCountsGemeente = new Map();
for (let [gemeente, counts] of siteCumulativeCountsGemeente) {
    const firstCount = counts[gemeenteActiveSince.get(gemeente)];
    
    normalizedSiteCumulativeCountsGemeente.set(gemeente, counts.map(d => {
        if (d === 0) return 0;
        let percentageChange = ((d - firstCount) / firstCount);
        return percentageChange;
    }));
}

let iterator = normalizedSiteCumulativeCountsGemeente.entries();

console.log(normalizedSiteCumulativeCountsGemeente)

let compare = new Map(Array.from(normalizedSiteCumulativeCountsGemeente).filter(([key, value]) => key === "Bree" || key === "Machelen"));

//console.log(compare);
```

```js

```

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => plotNormalizedData(compare, tellingen[0].van, gemeenteActiveSince, totalMothsCount, {width: width}))}</div>
</div>