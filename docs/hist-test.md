---
title: hist-test
---


```js
// Imports
const tellingen = FileAttachment("data/allData.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const richtingen = FileAttachment("data/richtingen.csv").csv({typed: true});
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

console.log(siteIDs);
```