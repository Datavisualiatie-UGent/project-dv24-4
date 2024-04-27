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
      {x: "name", y: "value", stroke: "#0000ff", tip: true}
      // Plot.groupX({y: "mean"}, {x: "timeslot", stroke: "#0000ff", y: "value", tip: true})
      ),
      Plot.ruleY([0, m])
    ]
  })
}

export function doubleBar(data, {width}) {
  return Plot.plot({
    width: width,
    x: {grid: true},
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 50,
    color: {
      scheme: "PiYg",
      type: "ordinal"
    },
    marks: [
      Plot.axisX({anchor: "top", label: "aantal fietsers"}),
      Plot.axisX({anchor: "bottom", label: "aantal fietsers"}),
      Plot.barX(
        data,
        Plot.groupY({x: "sum"}, {x: "in", y: "timeframe", fill: (d) => Math.sign(d.in)}),
      ),
      Plot.barX(
        data,
        Plot.groupY({x: "sum"}, {x: "out", y: "timeframe", fill: (d) => Math.sign(d.out)})
      ),
      Plot.ruleX([0]),
      Plot.tip(data, Plot.pointer({
        x: "out",
        y: "timeframe",
        title: (d) => [`Hour: ${d.timeframe}`, `arrived: ${d.in}`, `departed: ${d.out}`].join("\n\n"),
        fill: (d) => Math.sign(d.in)
      })),
      Plot.tip(data, Plot.pointer({
        x: "in",
        y: "timeframe",
        title: (d) => [`Hour: ${d.timeframe}`, `arrived: ${d.in}`, `departed: ${d.out}`].join("\n\n"),
        fill: (d) => Math.sign(d.in)
      })),
    ]
  })
}