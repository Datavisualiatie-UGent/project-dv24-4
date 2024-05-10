import * as Plot from "npm:@observablehq/plot";

export function overviewYear(data, year, site, width) {
    // Only use the data of the correct year and site
    let filtered = data.filter((d) =>
        new Date(d.dag).getFullYear() === year &&
        d.siteID === site)

    // create the plot
    return Plot.plot({
        title: "Jaaroverzicht",
        padding: 0,
        color: {type: "linear", scheme: "Greens"},
        width: width,
        y: {tickFormat: Plot.formatMonth("en", "short")}, // labels will be names instead of numbers
        marks: [
            Plot.cell(filtered, {
                x: d => new Date(d.dag).getDate(),
                y: d => new Date(d.dag).getMonth(),
                fill: "aantal",
                tip: true,
                inset: 0.5
            })
        ]
    })
}