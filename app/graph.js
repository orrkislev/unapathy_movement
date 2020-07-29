let graphPlotLength = 100
let graphPointsMax = 100

class Graph {
    constructor(_title, _smoothing) {
        this.title = _title
        this.smoothing = _smoothing
        this.plotY = 0
        this.points = [0]
        this.avg = 0
        this.maxVal = 0
        this.threshold = 0
    }
    addValue(newVal) {
        const lastVal = this.points[this.points.length - 1]
        newVal = this.smoothing * lastVal +
            (1.0 - this.smoothing) * newVal
        if (this.points.length > 30)
            this.maxVal = Math.max(this.maxVal, newVal)
        this.points.push(newVal)
        if (this.points.length > graphPointsMax) this.points.shift()

        const sum = this.points.reduce((a, b) => a + b, 0);
        this.avg = (sum / this.points.length) || 0;
    }
    addEmpty() {
        this.points.push(this.points[this.points.length - 1])
        if (this.points.length > graphPointsMax) this.points.shift()
    }
    learn() {
        this.threshold = lerp(this.threshold, this.points[this.points.length - 1] * 0.8, 0.02)
    }
    isApathy() {
        return this.avg < this.threshold
    }
    plot() {
        const plotSize = (plotSmall) ? createVector(width * 0.8, height * 0.1) : createVector(width * 0.25, height * 0.1)
        textSize(18)
        textStyle(NORMAL);
        textAlign(LEFT, BASELINE);
        onlyFill()
        text(this.title, gutter, this.plotY - 5)
        onlyStroke()
        if (this.isApathy()) strokeWeight(3)
        rect(gutter, this.plotY, plotSize.x, plotSize.y)
        strokeWeight(1)
        onlyStroke()
        // dottedLine(gutter, plotSize.x, graphY + plotSize.y * (1 - avg / maxVal))
        line(gutter, this.plotY + plotSize.y * (1 - this.avg / this.maxVal),
            gutter + plotSize.x, this.plotY + plotSize.y * (1 - this.avg / this.maxVal))
        stroke(255, 0, 255, 100)
        dottedLine(gutter, plotSize.x, this.plotY + plotSize.y * (1 - this.threshold / this.maxVal))
        onlyStroke()
        beginShape()
        for (let i = 0; i < graphPlotLength; i++) {
            const x = gutter + plotSize.x * (i / (graphPlotLength - 1))
            const y = this.plotY + plotSize.y * (1 - this.points[this.points.length - graphPlotLength + i] / this.maxVal)
            curveVertex(x, y)
        }
        endShape()
    }
}