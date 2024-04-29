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
    const data = counts.map((value, timeslot) => ({ timeslot, value, gemeente }));
    return Plot.line(data, {
      x: "timeslot",
      y: "value",
      stroke: colors[i % colors.length],
      title: "gemeente",
    });
  });

  return Plot.plot({
    width: width,
    marks: [
      ...lines,
      Plot.ruleY([0, m])
    ]
  });
}