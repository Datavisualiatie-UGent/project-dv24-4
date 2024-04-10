---
title: Fietstellingen
toc: false
theme: dashboard
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
 <!-- Make sure you put this AFTER Leaflet's CSS -->
 <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

.center-map {
    margin-left: auto;
    margin-right: auto;
    width: 65%;
}

</style>
<div class="hero">
  <h1>Fietstellingen</h1>
</div>

<div class="center-map">
    <div id="map" style="height: 600px;"></div>
</div>

```js
const sites = FileAttachment("data/sites.csv").csv({typed: true});
import {createPopUp} from "./components/marker.js";
```
```js
var map = L.map('map').setView([51.0000, 4.3000], 9); // De coördinaten zijn voor het middelpunt van België
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add markers
sites.forEach((d) => {
    L.marker([d.lat, d.long]).addTo(map)
        .bindPopup(createPopUp(d))
        .bindTooltip(d.naam);
});
```



```js
const data = FileAttachment("data/data.csv").csv({typed: true});
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
```

### Richtingen
```js
display(richtingen);
```

### Sites
```js
display(sites);
```
