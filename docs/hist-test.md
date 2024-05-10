---
title: hist-test
---

```js
// Imports

const cumulatieveCounts = FileAttachment("data/cumulativeMeanPerMonth.json").json();

import {plotNormalizedData} from './components/historyPlot.js';
```




### Trend fietstellingen
<label>Selecteer jaar:</label>
```js
const year = view(Inputs.select(Object.keys(cumulatieveCounts.resultJSON), {value: Object.keys(cumulatieveCounts.resultJSON)[0]}))
```

<label>Selecteer gemeentes:</label>
<div style="display: flex; justify-content: space-between; align-items: center;">


```js
const possibleFirstTrends = Object.keys(cumulatieveCounts.resultJSON[year].normalizedSiteCumulativeCountsGemeente)

const firstTrend = view(Inputs.select(possibleFirstTrends), {value: possibleFirstTrends[0]})
```

```js
const possibleSencondTrends = Object.keys(cumulatieveCounts.resultJSON[year].normalizedSiteCumulativeCountsGemeente).filter(gemeente => gemeente !== firstTrend)
const secondTrend = view(Inputs.select(possibleSencondTrends), {value: possibleSencondTrends[0]})
```

```js
const startDate = cumulatieveCounts.resultJSON[year].startDate;
const gemeenteActiveSince = cumulatieveCounts.resultJSON[year].gemeenteActiveSince;
const totalMothsCount = cumulatieveCounts.resultJSON[year].totalMothsCount;
const compare = cumulatieveCounts.resultJSON[year].normalizedSiteCumulativeCountsGemeente

const filteredObj = Object.fromEntries(
  Object.entries(compare).filter(([key, value]) => (key === firstTrend || key === secondTrend))
);
```
</div>
<div class="grid grid-cols-1">
  <div class="card">${resize((width) => plotNormalizedData(filteredObj, startDate, gemeenteActiveSince, totalMothsCount, {width: width}))}</div>
</div>