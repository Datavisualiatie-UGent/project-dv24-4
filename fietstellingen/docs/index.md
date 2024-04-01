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

```js
const sites = FileAttachment("data/sites.csv").csv({typed: true});
import {createPopUp} from "./components/marker.js";
```


<style>
.center-map {
    margin-left: auto;
    margin-right: auto;
    width: 65%;
}

</style>

<div class="center-map">
    <div id="map" style="height: 600px;"></div>
</div>
 

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