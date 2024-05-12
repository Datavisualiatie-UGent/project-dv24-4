import * as Plot from "npm:@observablehq/plot";

export function estimatedOverview(data, width) {
    return Plot.plot({
        title: "Drukte benadering",
        width: width,
        x: {
            label: "datum"
        },
        y: {
            label: "drukte",
            grid: true
        },

        marks: [
            Plot.lineY(data, Plot.windowY({k: 50, reduce: "mean"}, {x: (d) => new Date(d.datum), y: "aantal", stroke: "grey", curve:"basis"})),
        ]
    })
}