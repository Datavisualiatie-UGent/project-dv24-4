---
title: hist-test
---


```js
// Imports
const tellingen = FileAttachment("data/allData.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const richtingen = FileAttachment("data/richtingen.csv").csv({typed: true});

import { calculateMonthsBetween } from './components/historyUtils.js';
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

//const sitesInTellingsData = Array.from(new Set(tellingen.map(d => d.siteID)));
//const months = Array.from({length: 12}, (_, i) => new Date(0, i+1, 0).toLocaleString('default', { month: 'long' }));


const totalMothsCount = calculateMonthsBetween(tellingen[0].van, tellingen[tellingen.length - 1].tot);

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
    
    for (let i = 0; i < counts.length; i++) {
        let cumulativeCount = 0;
        for (let j = 0; j <= i; j++) {
            cumulativeCount += counts[j];
        }
        cumulativeCounts[i] = cumulativeCount / (i + 1);
    }
    siteCumulativeCounts.set(siteID, cumulativeCounts);
}


console.log(siteTotalCounts);
console.log(siteCumulativeCounts);
```
