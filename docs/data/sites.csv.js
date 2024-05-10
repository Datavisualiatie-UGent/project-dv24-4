import {csvFormat} from "d3-dsv";
import {sites} from "./sitesUtils.js";

// csv
process.stdout.write(csvFormat(sites));

// json
//console.log(data);