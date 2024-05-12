import * as Plot from "npm:@observablehq/plot";

export function estimatedOverview(data, k, width, showY= true) {
    return Plot.plot({
        title: "Drukte benadering",
        width: width,
        x: {
            label: "datum"
        },
        y: {
            axis: showY ? true : null,
            label: "drukte",
            grid: true
        },

        marks: [
            Plot.ruleY([0], {stroke: "black", fillOpacity: 0, strokeOpacity: 0  }),
            Plot.lineY(data, Plot.windowY({k: k, reduce: "mean"}, {x: (d) => new Date(d.datum), y: "aantal", stroke: "grey", curve:"basis"})),
        ]
    })
}