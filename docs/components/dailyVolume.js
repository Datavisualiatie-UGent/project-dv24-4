import * as Plot from "npm:@observablehq/plot";

export function dailyVolumeChart(data, total, {width, m} = {}) {
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