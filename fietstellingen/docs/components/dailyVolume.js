import * as Plot from "npm:@observablehq/plot";
import * as d3_arr from "../.observablehq/cache/_npm/d3-array@3.2.4/_esm.js";
// import * as d3 from "../.observablehq/cache/_npm/d3-time@3.1.0/_esm.js";

export function dailyVolumeChart(data, {width} = {}) {
  return Plot.plot({
    width: width,
    // x: {domain: [0, 96]},
    // x: {axis: null, label: "time"},
    marks: [
      Plot.rectY(data, {
        y: "aantal",
        x: "timeslot"
      })
    ]
  });
}

export function tmpDailyVolumeChart(data, {width} = {}) {
  return Plot.plot({
    width: width,
    // x: {domain: [0, 96]},
    // x: {axis: null},
    marks: [
      Plot.barY(data, {
        y: "value",
        x: "timeslot"
      }),
      // Plot.gridX({interval: 2, stroke: "black", strokeOpacity: 0.5}),
      // Plot.axisX(d3_arr.ticks(0, 24, 24), {color: "white"}),
    ]
  });
}