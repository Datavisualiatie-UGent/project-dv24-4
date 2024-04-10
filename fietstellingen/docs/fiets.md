---
title: Fiets
toc: false
---

# Fietstellingen 🚲

```js
let tellingen = FileAttachment("data.csv").csv({typed: true});
let sites = FileAttachment("data/sites.csv").csv({typed: true});
```


### Tellingen
```js
let all_years = [... new Set(tellingen.map(d => new Date(d.van).getFullYear().toString()))]
let all_sites = [... new Set(sites.map(d => d.siteID.toString()))]
```

```js
const SelectedYearInput = Inputs.select(all_years)
const selectedYear = Generators.input(SelectedYearInput)
const SelectedSiteInput = Inputs.select(all_sites)
const SelectedSite = Generators.input(SelectedSiteInput)
```

<div class="card" style="display: flex; gap: 0.5rem;">
  <div>${SelectedYearInput}</div>
  <div>${SelectedSiteInput}</div>
</div>


```js
function overviewYear(data, year, site, width) {
    let filtered = data.filter((d) => 
        new Date(d.van).getFullYear() === year &&
        d.siteID === site && 
        d.type === "FIETSERS")

    return Plot.plot({
        title: "Jaaroverzicht",
        padding: 0,
        color: {type: "linear", scheme: "Greens"},
        width: width,
        y: {tickFormat: Plot.formatMonth("en", "short")},
        marks: [
            Plot.cell(filtered, Plot.group({fill: "sum"}, {
                x: d => new Date(d.van).getDate(),
                y: d => new Date(d.van).getMonth(),
                fill: "aantal",
                tip: true, 
                inset: 0.5
            }))
        ]
    })
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => overviewYear(tellingen, parseInt(selectedYear), parseInt(SelectedSite), width))}
  </div>
</div>
