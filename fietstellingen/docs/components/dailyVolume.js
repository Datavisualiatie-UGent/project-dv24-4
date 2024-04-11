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

export function tmpDailyVolumeChart(data, total, {width, m} = {}) {
  return Plot.plot({
    width: width,
    marks: [
      Plot.barY(
        data,
        Plot.groupX({y: "mean"}, {x: "timeslot", y: "value", tip: true})
      ),
      Plot.line(
        total,
        {x: "name", y: "value", stroke: "#0000ff", tip:true}
        // Plot.groupX({y: "mean"}, {x: "timeslot", stroke: "#0000ff", y: "value", tip: true})
      ),
      Plot.ruleY([0, m])
    ]
  })
}