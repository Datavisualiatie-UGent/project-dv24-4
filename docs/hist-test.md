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
//const months = Array.from({length: 12}, (_, i) => new Date(0, i+1, 0).toLocaleString('default', { month: 'long' }));
const totalMothsCount = calculateMonthsBetween(tellingen[0].van, tellingen[tellingen.length - 1].tot);
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
// hier uit kan je de index halen en totaal aantal maanden

for (let telling of tellingen) {
    if (!siteTotalCounts.has(telling.siteID)) {
        siteTotalCounts.set(telling.siteID, Array.from({length: totalMothsCount}, () => 0));
    }
    
    let siteCounts = siteTotalCounts.get(telling.siteID);
    siteCounts[calculateMonthsBetween(tellingen[0].van, telling.tot)] += telling.aantal;
}


const siteCumulativeCounts = new Map();
for (let [siteID, counts] of siteTotalCounts) {
    let cumulativeCounts = Array.from({length: totalMothsCount}, () => 0);
    
    const firstActiveMonth = siteActiveSince.get(siteID);
    // if the site is not active yet, we don't need to calculate the cumulative average
    if (firstActiveMonth >= cumulativeCounts.length) continue;
    
    /*cumulativeCounts[firstActiveMonth] = counts[firstActiveMonth];
    for (let i = firstActiveMonth + 1; i < cumulativeCounts.length; i++) {
        // look at the previous month divided by 2 to get the better trend
        cumulativeCounts[i] = (counts[i] + cumulativeCounts[i - 1])/2;
    }*/
    
    // other way to calculate the cumulative average
    for (let i = firstActiveMonth; i < cumulativeCounts.length; i++) {
        let cumulativeCount = 0;
        for (let j = firstActiveMonth; j <= i; j++) {
            cumulativeCount += counts[j];
        }
        cumulativeCounts[i] = cumulativeCount / (i + 1);
    }
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
console.log(siteCumulativeCountsGemeente);

//normalize the data
const normalizedSiteCumulativeCountsGemeente = new Map();
for (let [gemeente, counts] of siteCumulativeCountsGemeente) {
    const firstCount = counts[gemeenteActiveSince.get(gemeente)];
    
    normalizedSiteCumulativeCountsGemeente.set(gemeente, counts.map(d => {
        if (d === 0) return 0;
        let percentageChange = ((d - firstCount) / firstCount) * 100;
        return percentageChange;
    }));
}
console.log(normalizedSiteCumulativeCountsGemeente);
```

```js

```

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => plotNormalizedData(normalizedSiteCumulativeCountsGemeente, {width: 800, m: 1}))}</div>
</div>