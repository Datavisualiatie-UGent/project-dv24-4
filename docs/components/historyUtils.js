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


/**
 * This function calculates the month when adding an index to a start date.
 * @param startDate
 * @param index
 * @returns {string}
 */
function getMonth(startDate, index) {
    const monthNames = Array.from({length: 12}, (_, i) => new Date(0, i+1, 0).toLocaleString('default', { month: 'short' }));

    let newDate = new Date(startDate);

    newDate.setMonth(newDate.getMonth() + index);

    return monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear();
}
export function plotNormalizedData(normalizedSiteCumulativeCountsGemeente, startDate, {width} = {}) {

    const lines = Array.from(normalizedSiteCumulativeCountsGemeente.entries()).map(([gemeente, counts], i) => {
        const data = counts.map((value, timeslot) => ({timeslot, value, gemeente}));
        return Plot.lineY(data, {
            x: "timeslot",
            y: "value",
            stroke: "gemeente",
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
        color: {legend: true},
        y: {
            percent: true,
            grid: true,
            ticks: ticks,
            label: "Percentage (%)",
        },
        x: {
            ticks: Math.ceil(maxX) - Math.floor(minX),
            label: "Maanden na startdatum",
            tickFormat: (d => getMonth(startDate, d)),
        },
        marks: [
            ...lines,
        ],
        title: "Percentage verandering van tellingen per gemeente vanaf de eerste maand"
    });
}