import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

/**
 * This function calculates the number of months between two dates.
 * @param date1
 * @param date2
 * @returns {number}
 */
export function calculateMonthsBetween(date1, date2) {
    const startDate = new Date(date1);
    const endDate = new Date(date2);

    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();

    return years * 12 + months;
}

export function plotNormalizedData(normalizedSiteCumulativeCountsGemeente, {width, m} = {}) {

    const colors = d3.schemeCategory10;


    const lines = Array.from(normalizedSiteCumulativeCountsGemeente.entries()).map(([gemeente, counts], i) => {
        const data = counts.map((value, timeslot) => ({timeslot, value, gemeente}));
        return Plot.lineY(data, {
            x: "timeslot",
            y: "value",
            stroke: colors[i % colors.length],
            title: "gemeente",
        });
    });

    const minY = d3.min(lines, line => d3.min(line.data, d => d.value));
    const maxY = d3.max(lines, line => d3.max(line.data, d => d.value));

    const minX = d3.min(lines, line => d3.min(line.data, d => d.timeslot));
    const maxX = d3.max(lines, line => d3.max(line.data, d => d.timeslot));

    const stepSize = 0.1;  // Pas dit aan aan uw behoeften
    const ticks = Math.ceil((maxY - minY) / stepSize);

    return Plot.plot({
        width: width,
        y: {
            percent: true, grid: true,
            ticks: ticks
        },
        x: {ticks: Math.ceil(maxX) - Math.floor(minX)},
        marks: [
            ...lines,
        ]
    });
}