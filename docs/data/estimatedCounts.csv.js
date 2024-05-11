
import * as d3 from "d3";
import fs from "node:fs/promises"
import path from 'path';
import url from 'url';
import {sites} from "./sitesUtils.js";
import {csvFormat} from "d3-dsv";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = __dirname + '/tellingen.csv';
const tellingen = d3.csvParse(await fs.readFile(filePath, "utf8"));

// counts for a date how many sites were added. Only the dates where there is actually one added are used.
const sites_added_date = d3.rollup(sites, v => d3.count(v, d => d.siteID), d => {
    const date = new Date(d.datum_van)
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
})

// counts the active sites at a given date. Date is in the format: yyyy-mm-dd
function before(date) {
    let tot = 0
    sites_added_date.forEach((value, key, map) => {
        if (new Date(key) <= new Date(date)) {
            tot += value
        }
    })
    return tot
}

// for every date, the amount of counts that were registered
const counts = d3.rollup(tellingen, v => d3.sum(v, d => d.aantal), d => {
    const date = new Date(d.van)
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
})

// The total amount of sites
const total_sites = sites.length

// weighted counts for every date.
const weighted_counts = [...counts.keys()].map(date => {
    const b = before(date)
    const tot = b > 0 ? ((total_sites / before(date)) * counts.get(date)).toFixed(2) : 0
    return {datum:date, aantal:tot}
}).sort((a, b) => new Date(b.datum) - new Date(a.datum))

process.stdout.write(csvFormat(weighted_counts));
