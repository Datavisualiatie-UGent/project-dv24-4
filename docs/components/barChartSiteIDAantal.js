import * as Plot from "npm:@observablehq/plot";

export function barChart(groupedData, {width} = {}) {
  return Plot.plot({
    title: "Aantal fietstellingen per site",
    width: width,
    x: {label: "siteID"},
    y: {label: "Aantal fietsers"},
    marks: [
      Plot.rectY(groupedData, {
        y: "aantal",
        x: "siteID"
      })
    ]
  });
}