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
var northEast = L.latLng(51.6, 6.05),
    southWest = L.latLng(50.4, 2.5),
    bounds = L.latLngBounds(southWest, northEast);

var centerLat = (southWest.lat + northEast.lat) / 2;
var centerLng = (southWest.lng + northEast.lng) / 2;


var map = L.map('map', {
    center: [centerLat, centerLng],
    bounds: bounds,
    maxBoundsViscosity: 0.5,
    zoomControl: false,
}).setView([centerLat, centerLng], 9);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',    subdomains: 'abcd',
    minZoom: 9
}).addTo(map);

const markers = [];

// add markers
sites.forEach((d) => {
    const marker = L.marker([d.lat, d.long]).addTo(map)
        .bindPopup(createPopUp(d))
        .bindTooltip(d.naam);
    markers.push(marker);
});
// fixes bug where tooltips opened by dragging would not close
map.on('dragend', function(e) {
    markers.forEach((d) => {
        d.closeTooltip();
    });
});
// fixes bug where tooltips opened by zooming would not close
map.on('zoomend', function(e) {
    markers.forEach((d) => {
        d.closeTooltip();
    });
});

function makeSmallerBounds(bounds, shrinkAmount) {
    var northEast = bounds.getNorthEast();
    var southWest = bounds.getSouthWest();

    var smallerNorthEast = L.latLng(northEast.lat - shrinkAmount, northEast.lng - shrinkAmount);
    var smallerSouthWest = L.latLng(southWest.lat + shrinkAmount, southWest.lng + shrinkAmount);

    return L.latLngBounds(smallerSouthWest, smallerNorthEast);
}


/**
 * Returns the point that is within the bounds
**/
function limitToBounds(point, bounds) {
    var lat = Math.max(Math.min(point.lat, bounds.getNorth()), bounds.getSouth());
    var lng = Math.max(Math.min(point.lng, bounds.getEast()), bounds.getWest());
    return L.latLng(lat, lng);
}

function checkBounds() {
    console.log("checkBounds");
    var newCenter = map.getCenter();
    if (!bounds.contains(newCenter)) {
        newCenter = limitToBounds(newCenter, makeSmallerBounds(bounds, 0.2));
        map.panTo(newCenter, { animate: true, duration: 1 });
    }
}

map.on('moveend', checkBounds);
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
