import * as Plot from "npm:@observablehq/plot";

function calculateLabel(timeframe) {
    let hour = timeframe.getUTCHours().toString().padStart(2, "0")
    let quarter = ["00", "15", "30", "45"][Math.floor(timeframe.getUTCMinutes() / 15)]
    return `${hour}:${quarter}`
}

export function doubleBarHorizontal(data, {width}) {
    return Plot.plot({
        title: "Inkomende en uitgaande fietsers.",
        width: width,
        y: {grid: true},
        x: {
            label: null,
            tickFormat: (x) => {
                let minutes = new Date(x).getUTCMinutes()
                if(minutes === 0){
                    return `${new Date(x).getUTCHours().toString().padStart(2, "0")}:00`
                }
                return ""
            },
            type:"band"
        },
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 50,
        color: {
            scheme: "PiYg",
            type: "ordinal",
            legend: true
        },
        marks: [
            Plot.axisY({anchor: "left", label: "aantal fietsers"}),
            Plot.rectY(
                data,
                {y: "out", x: "timeframe", fill: (d) => "Uitgaand"}
            ),
            Plot.rectY(
                data,
                {y: "in", x: "timeframe", fill: (d) => "Inkomend"},
            ),
            Plot.ruleY([0]),
            Plot.tip(data, Plot.pointer({
                y: "out",
                x: "timeframe",
                title: (d) => [`Uur: ${calculateLabel(new Date(d.timeframe))}`, `Inkomend: ${d.in}`, `Uitgaand: ${d.out}`].join("\n\n"),
                fill: (d) => "Uitgaand"
            })),
            Plot.tip(data, Plot.pointer({
                y: "in",
                x: "timeframe",
                title: (d) => [`Uur: ${calculateLabel(new Date(d.timeframe))}`, `Inkomend: ${d.in}`, `Uitgaand: ${d.out}`].join("\n\n"),
                fill: (d) => "Inkomend"
            })),
        ]
    })
}