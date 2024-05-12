---
title: Fietstellingen
---
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
 <!-- Make sure you put this AFTER Leaflet's CSS -->
 <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>

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
    height: 600px;
}

p {
    max-width: 100vw !important;
}
</style>
```

# Fietstellingen
```html
<div>
    <p>
        Er wordt dagelijks veel gefiets in België. Dit voor het plezier, 
        maar ook heel veel woon-werk verkeer of studenten die van/naar school gaan.
        Om dit beter in kaart te kunnen brengen heeft Agentschap wegen & verkeer Vlaanderen een 140tal fietspunten geplaats in vlaanderen.
        Hierdoor hebben ze meer zicht op bijvoorbeeld volgende dingen: hoeveel fietsers rijden er per jaar, Wat is het aantal op piekmomenten, etc.
    </p>
    <p>
        Wij hebben ons gefocused om volgende feiten te bekijken:
    </p>
        <div>
            <ul>
                <li>Drukte van fietsers doorheen de jaren</li>
                <li>Het verschil tussen inkomend en uitgaand verkeer</li>
                <li>De drukte op 1 bepaald meetpunt</li>
                <li>Verandering van drukte op een meetpunt</li>
            </ul>
        </div>
    <p>
        Deze data is door Vlaanderen openbaar gemaakt als open data. 
        Je kan de volledige data <a href="https://opendata.apps.mow.vlaanderen.be/fietstellingen/index.html">hier</a> vinden.
    </p>
</div>
<hr>
```

## Meetpunten
```html
<div>
    <p>
        Op deze map zijn alle meetpunten zichtbaar. Voor elk meetpunt is volgende info beschikbaar:
    </p>

    <div>
        <ul>
            <li>Naam van de site</li>
            <li>De gemeente</li>
            <li>Datum van de eerste telling</li>
        </ul>
    </div>
    <div class="center-map" style="width: 100%">
        <div id="map" class="style-map"></div>
    </div>
</div>
<hr>
```

```js
// Imports
const estimatedCounts = FileAttachment("data/estimatedCounts.csv").csv({typed: true});
const totalCounts = FileAttachment("data/totalCounts.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});

import {estimatedOverview} from "./components/estimatedOverview.js"
import {createMap} from "./components/mapUtils.js";
import {barChart} from "./components/barChartSiteIDAantal.js";
```

```js
createMap(sites);
```

## Drukte benadering
```html
<div>
    <div>
        <p>TODO</p>
    </div>
    <div class="grid grid-cols-1">
    <div class="card">
        ${resize((width) => estimatedOverview(estimatedCounts,50, width))}
    </div>
    </div>
</div>
```
