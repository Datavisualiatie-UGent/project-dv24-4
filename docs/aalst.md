---
title: Aalst
---

```js
const jaaroverzicht = FileAttachment("data/jaaroverzicht.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const cumulatieveCounts = FileAttachment("data/cumulativeMeanPerMonth.json").json();

import {estimatedOverview} from "./components/estimatedOverview.js";
import {overviewYearWeekday} from "./components/overviewYear.js";
import {createMap} from "./components/mapUtils.js";
import {plotNormalizedData, getTrendCompareData, getFistAndSecondTrendYears} from './components/historyPlot.js';
```

# Aalst

```html
<style>
    .center-map {
        margin-left: auto;
        margin-right: auto;
        width: 100%;
    }

    .style-map {
        border-radius: 25px;
        border: 2px solid lightgray;
        height: 300px;
    }

</style>

<div class="grid grid-cols-2">
    <div>
        <p>
            Hier bekijken we specifiek de info over de Aalst 1 site.
        </p>
    </div>
    <div class="center-map" style="width: 100%">
        <div id="map" class="style-map"></div>
    </div>
</div>
<hr>
```

```js
createMap(sites, 19);
```