import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

/**
 * Filter the given data. Only keep the enties with the given year and site.
 * @param data All the data that needs to be filtered.
 * @param {number} year The year it needs to keep.
 * @param {*} site The site it needs to keep.
 */
function filterData(data, year=null, site=null) {
    return data.filter((d) => {
        const y = year !== null ? new Date(d.datum).getFullYear() === year : true
        const s = site !== null ? d.siteID === site : true
        return y && s
    }
    )
}

/**
 * This function will make a graph
 * @param {*} data
 * @param {number} year
 * @param {*} site
 */
export function overviewYearMonth(data, year, site, width) {
    // Only use the data of the correct year and site
    const filtered = filterData(data, year, site)

    // create the plot
    return Plot.plot({
        title: "Jaaroverzicht - maand",
        padding: 0,
        color: {type: "linear", scheme: "Greens"},
        width: width,
        y: {tickFormat: Plot.formatMonth("nl", "short")}, // labels will be names instead of numbers
        marks: [
            Plot.cell(filtered, {
                x: d => new Date(d.datum).getDate(),
                y: d => new Date(d.datum).getMonth(),
                fill: "aantal",
                channels: {
                    Datum: "datum",
                },
                tip: {
                    format: {
                        aantal: true,
                        channels: true,
                        x: false,
                        y: false
                    }
                },
                inset: 0.5
            })
        ]
    })
}

/**
 * @param {*} data
 * @param {*} site
 */
export function overviewYearWeekday(data, site, width) {
    // Only use the data of the correct year and site
    // const filtered = filterData(data, year, site)
    const filtered = filterData(data, undefined, site)
    // create the plot
    return Plot.plot({
        title: "Jaaroverzicht - weekdag",
        padding: 0,
        color: {type: "linear", scheme: "Greens"},
        width: width,
        x: {
            axis: "both",
            tickSize: "0",
            tickFormat: (x) => {
                let d = new Date(new Date().getFullYear(), 0, 1);
                d.setDate(d.getDate() + (parseInt(x))*7)

                if (d.getDate() < 8 && d.getFullYear() === new Date().getFullYear()) {
                    return d.toLocaleString('nl-be',{month:'short'})
                } else {
                    return ""
                }
            },
        },
        y: {tickFormat: Plot.formatWeekday("nl", "short"), tickSize: 0}, // labels will be names instead of numbers
        fy: {tickFormat: "", padding:0.07},
        marks: [
            Plot.cell(filtered, {
                x: (d) => d3.utcWeek.count(d3.timeYear(new Date(d.datum)), new Date(d.datum)),
                y: d => new Date(d.datum).getDay() !== 0 ? new Date(d.datum).getDay() : 7,
                fy: (d) => new Date(d.datum).getFullYear(),
                channels: {
                    Datum: "datum",
                },
                fill: "aantal",
                tip: {
                    format: {
                        aantal: true,
                        channels: true,
                        x: false,
                        y: false,
                        fy: false
                    }
                },
                inset: 0.5
            })
        ]
    })
}