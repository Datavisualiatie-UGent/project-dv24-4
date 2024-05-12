import * as Plot from "npm:@observablehq/plot";

export function estimatedOverview(data, k, width) {
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
        ymin:0,

        marks: [
            Plot.lineY(data, Plot.windowY({k: k, reduce: "mean"}, {x: (d) => new Date(d.datum), y: "aantal", stroke: "grey", curve:"basis"})),
        ]
    })
}