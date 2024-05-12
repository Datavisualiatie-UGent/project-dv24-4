import * as Plot from "npm:@observablehq/plot";

export function estimatedOverview(data, k, width, showY= true) {
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
            showY ? Plot.axisY() : Plot.axisY({ticks:1, textStroke:"black", textStrokeOpacity:1, textStrokeWidth: 1}),
            Plot.ruleY([0], {stroke: "red"}),
            Plot.lineY(data, Plot.windowY({k: k, reduce: "mean"}, {x: (d) => new Date(d.datum), y: "aantal", stroke: "grey", curve:"basis"})),
        ]
    })
}