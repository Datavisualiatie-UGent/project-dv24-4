import * as Plot from "npm:@observablehq/plot";

export default function dailyVolumeChart(data, {width} = {}) {
  return Plot.plot({
    width: width,
    marks: [
      Plot.rectY(data, {
        y: "aantal",
        x: "timeslot"
      })
    ]
  });
}