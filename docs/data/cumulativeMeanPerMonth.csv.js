import fs from "node:fs/promises"
import {sites} from "../components/sitesUtiles.js";

const data = (await fs.readFile("./tellingen.csv", "utf8")).split("\n")

const header = data[0].split(",")

const tellingen = data.slice(1, -1);

console.log(header.join(","))

// get all years in different arrays
const years = tellingen.reduce((acc, telling) => {
    const year = telling.split(",")[2].split("-")[0]
    if (!acc[year]){
        acc[year] = []
    }
    acc[year].push(telling)
    return acc
}, {})

console.log(years)

