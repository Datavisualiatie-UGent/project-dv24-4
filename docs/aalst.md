---
title: Aalst
---

```js
const jaaroverzicht = FileAttachment("data/jaaroverzicht.csv").csv({typed: true});
const sites = FileAttachment("data/sites.csv").csv({typed: true});
const in_out = FileAttachment("data/inOutData.csv").csv({typed: true});

import {doubleBarHorizontal} from "./components/dailyVolume.js";
import {overviewYearWeekday} from "./components/overviewYear.js";
import {createMap} from "./components/mapUtils.js";

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
        Laten we een diepgaande blik werpen op de gemeente Aalst, met name op de locatie Aalst 1. Deze bevindt zich langs een fietsautostrade (F414 Aalst – Zottegem). Aangezien dit een belangrijke verbindingsweg is, verwachten we dat deze locatie veel gebruikt wordt door fietsers.
        </p>
        <p>
            
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

## Jaaroverzicht
```html
<div>
    <div>
        Het jaaroverzicht bevestigt het vermoeden dat deze fietsroute vaak wordt gebruikt, met dagelijkse aantallen variërend van ongeveer 100 tot 1000. Bovendien blijkt dat er tijdens de warmere maanden meer fietsers op de weg zijn, wat duidelijk wordt door de donkerdere plekken in het midden van het jaar. Echter, dit is niet het enige opvallende. Op 27/03/2022 is er aanzienlijk meer activiteit van fietsers dan op andere momenten. Een mogelijke verklaring hiervoor is een grootschalig wielerevenement, zoals blijkt uit een beetje onderzoek. Het blijkt dat op die dag de <a href="https://valckenier.be/nl/nieuws/1700-deelnemers-en-veel-sfeer-dit-was-de-valckenier-classic-2022-xxl">Valckenier Classic 2022 XXL</a> plaatsvond, waarvan het parcours ook door Aalst liep.
    </div>
    <div class="grid grid-cols-1">
        <div class="card">
            ${resize((width) => overviewYearWeekday(jaaroverzicht, parseInt(19), width))}
        </div>
    </div>
</div>
```

## Inkomend en uitgaand verkeer

```js
const inOutData = in_out.filter(item => item.siteID === 19).sort((a, b) => new Date(a.timeframe) > new Date(b.timeframe))
```

```html
<div>
    <div>
        Overigens is deze locatie wel een mooi voorbeeld van ochtend en avondspits.
        Zo zie je dat er 's ochtends vooral uitgaand verkeer is en 's avonds vooral inkomend.
    </div>
    <div class="grid grid-cols-1">
        <div class="card">${resize((width) => doubleBarHorizontal(inOutData, {width}))}</div>
    </div>
</div>
```