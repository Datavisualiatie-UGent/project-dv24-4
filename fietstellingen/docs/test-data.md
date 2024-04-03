---
title: Test csv data
theme: dashboard
toc: false
execute:
  echo: false
---

```js
const data = await FileAttachment("data.csv").csv({typed: true});
const sites = await FileAttachment("data/sites.csv").csv({typed: true});
import {barChart} from "./components/barChartSiteIDAantal.js";
import * as Plot from "npm:@observablehq/plot";
```

```js
import dailyVolumeChart from "./components/dailyVolume.js";
```

```js
const groupedData = Array.from(d3.group(data, d => d.siteID), ([key, values]) => ({
  siteID: key,
  aantal: values.reduce((total, d) => total + d.aantal, 0)
}));

const tmp = Array.from(d3.group(sites, d=>d.gemeente), ([key, values]) => ({
  name: key,
  ids: values.reduce((total, d) => total.concat(d.siteID), [])
}));

const siteIDs = new Map();
let names = [];

for(let item of tmp){
  siteIDs.set(item.name,item.ids);
  names.push(item.name);
}
```

### Data

The current time is ${new Date(now).toLocaleTimeString("en-US")}.


```js
let gemeente = view(Inputs.select(names, {value: "Gent"}))
```

```js
let ids = siteIDs.get(gemeente)
```

```js
const richtingen = d3.group(d3.group(data, d => ids.includes(d.siteID)).get(true), d => d.richting, d => {
  const date = new Date(d.van)
  return String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0")
})
```
```js
const IN = Array.from(richtingen.get("IN"), ([key, values]) => ({
  timeslot: key,
  aantal: values.reduce((total, d) => (total[d.van] ?? 0) + d.aantal, {})
}));
```
```js
const OUT = Array.from(richtingen.get("OUT"), ([key, values]) => ({
  timeslot: key,
  aantal: values.reduce((total, d) => (total[d.van] ?? 0) + d.aantal, {})
}));
```

<h2>${gemeente}</h2>

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => dailyVolumeChart(IN, {width}))}</div>
</div>

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => dailyVolumeChart(OUT, {width}))}</div>
</div>
