import * as Plot from "npm:@observablehq/plot";

export function overviewYear(data, year, site, width) {
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