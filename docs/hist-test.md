---
title: hist-test
---

```js
// Imports

const cumulatieveCounts = FileAttachment("data/cumulativeMeanPerMonth.json").json();

import {plotNormalizedData} from './components/historyPlot.js';
```


```js

const year = "2020";

const startDate = cumulatieveCounts.resultJSON[year].startDate;
const gemeenteActiveSince = cumulatieveCounts.resultJSON[year].gemeenteActiveSince;
const totalMothsCount = cumulatieveCounts.resultJSON[year].totalMothsCount;
const compare = cumulatieveCounts.resultJSON[year].normalizedSiteCumulativeCountsGemeente

const filteredObj = Object.fromEntries(
  Object.entries(compare).filter(([key, value]) => (key === "Bree" || key === "Machelen"))
);
console.log(compare)
```


<div class="grid grid-cols-1">
  <div class="card">${resize((width) => plotNormalizedData(filteredObj, startDate, gemeenteActiveSince, totalMothsCount, {width: width}))}</div>
</div>