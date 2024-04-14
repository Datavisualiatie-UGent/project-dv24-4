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
import {dailyVolumeChart} from "./components/dailyVolume.js";
```

```js
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
const getLabel = (index) => {
  // return hourLabels[index]
  return index.toString().padStart(2, "0")
}
const filterFunction = (d) => {
  let date = new Date(d.van)
  return date.getUTCHours() * 4 + date.getUTCMinutes() / 15;
}
let IN = []
let IN_TOTAL = Array.from(d3.group(data, filterFunction), ([key, values]) => {
  let v= values.filter(elem => elem.richting == "IN");
    return ({
      name: getLabel(key),
      value: v.reduce((total, d) => total + d.aantal, 0) / v.length
    })
  }
).sort((a,b) => a.name - b.name);
let OUT = [];
let OUT_TOTAL = Array.from(d3.group(data, filterFunction), ([key, values]) => {
  let v= values.filter(elem => elem.richting == "OUT");
  return ({
    name: getLabel(key),
    value: v.reduce((total, d) => total + d.aantal, 0) / v.length
  })
}
).sort((a,b) => a.name - b.name);
d3.bin().value(filterFunction)(data).forEach((value, index) => {
  value.forEach((v) => {
      const item = {timeslot: getLabel(filterFunction(v)), value: v.aantal}
      if(v.richting === "IN"){
        if(ids.includes(v.siteID)){
          IN.push(item)
        }
      } else {
        if(ids.includes(v.siteID)){
          OUT.push(item)
        }
      }
  })
});
const m = 20;
```


<div class="grid grid-cols-1">
  <div class="card">${resize((width) => dailyVolumeChart(IN, IN_TOTAL, {width, m}))}</div>
</div>

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => dailyVolumeChart(OUT, OUT_TOTAL, {width, m}))}</div>
</div>
