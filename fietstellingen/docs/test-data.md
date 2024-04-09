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
import {dailyVolumeChart, tmpDailyVolumeChart} from "./components/dailyVolume.js";
```

```js
const groupedData = Array.from(d3.group(data, d => d.siteID), ([key, values]) => ({
  siteID: key,
  aantal: values.reduce((total, d) => total + d.aantal, 0)
}));

const _tmp = Array.from(d3.group(sites, d=>d.gemeente), ([key, values]) => ({
  name: key,
  ids: values.reduce((total, d) => total.concat(d.siteID), [])
}));

const siteIDs = new Map();
let names = [];

for(let item of _tmp){
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
let ids = siteIDs.get(gemeente) ?? []
```


<h2>${gemeente}</h2>

```js
const richtingen = d3.group(d3.group(data, d => ids.includes(d.siteID)).get(true), d => d.richting, d => {
  const date = new Date(d.van)
  return Number(date.getHours()) * 4 + Number(date.getMinutes()) / 15
})
```

```js
const _IN = Array.from(richtingen.get("IN"), ([key, values]) => ({
  timeslot: key,
  aantal: values.reduce((total, d) => (total[d.van] ?? 0) + d.aantal, {}),
  date: values.map((value) => (value.van))
}));
```

```js
const _OUT = Array.from(richtingen.get("OUT"), ([key, values]) => ({
  timeslot: key,
  aantal: values.reduce((total, d) => (total[d.van] ?? 0) + d.aantal, {})
}));
```

[//]: # (<div class="grid grid-cols-1">)

[//]: # (  <div class="card">${resize&#40;&#40;width&#41; => dailyVolumeChart&#40;IN, {width}&#41;&#41;}</div>)

[//]: # (</div>)

```js
const hourLabels = [
"00:00", 
"01:00", 
"02:00", 
"03:00", 
"04:00", 
"05:00", 
"06:00", 
"07:00", 
"08:00", 
"09:00", 
"10:00", 
"11:00", 
"12:00", 
"13:00", 
"14:00", 
"15:00", 
"16:00", 
"17:00", 
"18:00", 
"19:00", 
"20:00", 
"21:00", 
"22:00", 
"23:00", 
]
let tmp = new Map();
d3.bin().value(d => new Date(d.van).getHours())(data).forEach((value, index) => {
    tmp.set(index, value.filter((d) => ids.includes(d.siteID)))
});
```

```js
const IN = Array.from(tmp, ([key, values]) => {
  return ({
    timeslot: hourLabels[key],
    value: values.reduce((total, d) => {
      if(d.richting === "IN"){
        return total + d.aantal;
      } else {
        return total;
      }
    }, 0)
  })
})
```

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => tmpDailyVolumeChart(IN, {width}))}</div>
</div>


```js
const OUT = Array.from(tmp, ([key, values]) => {
  return ({
    timeslot: hourLabels[key],
    value: values.reduce((total, d) => {
      if(d.richting === "OUT"){
        return total + d.aantal;
      } else {
        return total;
      }
    }, 0)
  })
})
```

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => tmpDailyVolumeChart(OUT, {width}))}</div>
</div>
