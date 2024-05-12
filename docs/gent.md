---
title: Gent
---

```js
const jaaroverzicht = FileAttachment("data/jaaroverzicht.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
import {overviewYearWeekday} from "./components/overviewYear.js";
import {createMap} from "./components/mapUtils.js";
```

# Gent

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
    <p>
        Tekstje over gent
    </p>
    <div class="center-map" style="width: 100%">
        <div id="map" class="style-map"></div>
    </div>
</div>

```

```js
createMap(sites, 13);
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => overviewYearWeekday(jaaroverzicht, parseInt(13), width))}
  </div>
</div>