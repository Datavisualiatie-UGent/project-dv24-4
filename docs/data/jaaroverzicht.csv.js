import * as d3 from "d3";
import fs from "node:fs/promises"
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = __dirname + '/tellingen.csv';

const data = d3.csvParse(await fs.readFile(filePath, "utf8"));
const grouped = d3.group(data, d => d.siteID)

const new_map = new Map();
grouped.forEach((value, key) => {
        const r = d3.rollups(value, v => d3.sum(v, d => d.aantal), d => {
            const date = new Date(d.van)
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        })

        new_map.set(key, r)
    }
)

// Write results to stdout
process.stdout.write("siteID,dag,aantal\n");

new_map.forEach((value, key) => {
    value.forEach(value => {
        process.stdout.write(`${key},${value[0]},${value[1]}\n`);
    })
})