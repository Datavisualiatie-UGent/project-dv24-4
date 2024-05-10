import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

/**
 * This function calculates the month when adding an index to a start date.
 * @param startDate
 * @param index
 * @param withYear
 * @returns {string}
 */
function getMonth(startDate, index, withYear = true) {
    const monthNames = Array.from({length: 12}, (_, i) => new Date(0, i + 1, 0).toLocaleString('default', {month: 'short'}));

    let newDate = new Date(startDate);

    newDate.setMonth(newDate.getMonth() + index);
    if (!withYear) {
        return monthNames[newDate.getMonth()];
    }
    return monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear();
}

/**
 * This function plots the normalized data.
 * @param normalizedSiteCumulativeCountsGemeente object containing per gemeente the normalized the cumulative counts normalized by month 0
 * @param startDate the start date of the data
 * @param gemeentenActiveSince
 * @param gemeenteActiveSince the date when the gemeente started
 * @param totalMothsCount the total number of months
 * @param width the width of the plot
 * @returns {*}
 */
export function plotNormalizedData(normalizedSiteCumulativeCountsGemeente, startDate, gemeentenActiveSince, totalMothsCount, {width} = {}, gemeenteActiveSince = undefined) {

    const lines = Array.from(Object.entries(normalizedSiteCumulativeCountsGemeente)).map(([gemeente, counts], i) => {
        let data;
        if (gemeenteActiveSince === undefined) {
            data = counts.map((value, timeslot) => ({
                timeslot,
                value,
                gemeente
            })).filter((value, timeslot) => timeslot >= gemeentenActiveSince[gemeente])
        } else {
            data = counts.map((value, timeslot) => ({
                timeslot,
                value,
                gemeente
            })).filter((value, timeslot) => timeslot >= gemeenteActiveSince)
        }

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
            label: "Maanden",
            tickFormat: (d => {
                if (gemeenteActiveSince === undefined) return getMonth(startDate, d);
                else return getMonth(startDate, d, false);
            }),
            grid: true,
        },
        marks: [
            ...lines,
        ],
        title: "Gemiddelde Cumulatieve Procentuele Verandering in Tellingen per Gemeente vanaf Maand Eén"
    });
}


/**
 * this function gets the trend compare data.
 * @param cumulatieveCounts
 * @param year
 * @param firstTrend
 * @param secondTrend
 * @returns {{filteredObj: {[p: string]: *}, totalMothsCount: (*|number), gemeenteActiveSince: (*|{[p: string]: any}), startDate: *}}
 */
export function getTrendCompareData(cumulatieveCounts, year, firstTrend, secondTrend) {
    const startDate = cumulatieveCounts.resultJSON[year].startDate;
    const gemeenteActiveSince = cumulatieveCounts.resultJSON[year].gemeenteActiveSince;
    const totalMothsCount = cumulatieveCounts.resultJSON[year].totalMothsCount;
    const compare = cumulatieveCounts.resultJSON[year].normalizedSiteCumulativeCountsGemeente

    const filteredObj = Object.fromEntries(
        Object.entries(compare).filter(([key, value]) => (key === firstTrend || key === secondTrend))
    );

    return {
        filteredObj,
        startDate,
        gemeenteActiveSince,
        totalMothsCount
    }
}


/**
 * This function gets the first and second trend years.
 * @param cumulatieveCounts
 * @param year
 * @param firstTrend
 * @param secondTrend
 * @returns {{secondTrendActiveSince: *, firstTrendsYears: {}, firstTrendActiveSince: *, secondTrendsYears: {}}}
 */
export function getFistAndSecondTrendYears(cumulatieveCounts, year, firstTrend, secondTrend) {
    const firstTrendsYears = {}
    const secondTrendsYears = {}
    const indexYear = Object.keys(cumulatieveCounts.resultJSON).indexOf(year)
    for (let i = indexYear; i < Object.keys(cumulatieveCounts.resultJSON).length; i++) {
        firstTrendsYears[firstTrend + " " + Object.keys(cumulatieveCounts.resultJSON)[i]] = cumulatieveCounts.resultJSON[Object.keys(cumulatieveCounts.resultJSON)[i]].normalizedSiteCumulativeCountsGemeente[firstTrend]
        secondTrendsYears[secondTrend + " " + Object.keys(cumulatieveCounts.resultJSON)[i]] = cumulatieveCounts.resultJSON[Object.keys(cumulatieveCounts.resultJSON)[i]].normalizedSiteCumulativeCountsGemeente[secondTrend]
    }
    const firstTrendActiveSince = cumulatieveCounts.resultJSON[year].gemeenteActiveSince[firstTrend]
    const secondTrendActiveSince = cumulatieveCounts.resultJSON[year].gemeenteActiveSince[secondTrend]

    return {
        firstTrendsYears,
        secondTrendsYears,
        firstTrendActiveSince,
        secondTrendActiveSince
    }
}