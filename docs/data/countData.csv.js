import {promises as fs} from 'fs';
import * as d3 from "d3";
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = __dirname + '/tellingen.csv';
const data = d3.csvParse(await fs.readFile(filePath, "utf8"));

let grouped = d3.groups(data, d => d.siteID, d=> {
    const dd = new Date(d.van)
    return `${dd.getFullYear()}-${dd.getMonth()+1}-${dd.getDate()}`
}).map(([siteID, counts], _) => {
    return [siteID, counts.length]
}).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))

process.stdout.write("siteID,count\n" + grouped.join('\n') + "\n");
