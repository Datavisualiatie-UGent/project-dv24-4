---
title: Test csv data
theme: dashboard
toc: false
---

```js
const data = FileAttachment("data.csv").csv({typed: true});
import {barChart} from "./components/barChartSiteIDAantal.js";

```

```js
const groupedData = Array.from(d3.group(data, d => d.siteID), ([key, values]) => ({
  siteID: key,
  aantal: values.reduce((total, d) => total + d.aantal, 0)
}));
```

### Data
<div class="grid grid-cols-1">
  <div class="card">${resize((width) => barChart(groupedData, {width}))}</div>
</div>

```js
const richtingen = FileAttachment("data/richtingen.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
```

### Richtingen
```js
display(richtingen);
```

### Sites
```js
display(sites);
```

```js
