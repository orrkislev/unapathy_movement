const practiceFunctions = {
    'first':1
}
let curPractice = practiceFunctions.first

function practice(){
    if (curPractice == practiceFunctions.first) practice1()
}

function practice1() {
    const ratio = (width * 0.6 / motionCapture.width)
    const target = createVector(360, 50)
    const targetRadius = 20;
    scale(-1, 1)
    image(motionCapture, -width * 0.2, height * 0.2, -motionCapture.width * ratio, motionCapture.height * ratio)
    resetMatrix()
    updateMovement()
    if (flow.flow) {
        let totalFlow = 0
        flow.flow.zones.forEach((zone, index) => {
            if (abs(zone.x - target.x) < targetRadius * ratio && abs(zone.y - target.y) < targetRadius * ratio) {
                totalFlow += sqrt(zone.u * zone.u + zone.v * zone.v)
            }
        })
        if (totalFlow > 20) {
            noStroke()
            fill(255, 0, 255)
        } else {
            noFill()
            stroke(255, 0, 255)
        }
        circle(width * 0.2 + (motionCapture.width - target.x) * ratio, height * 0.2 + target.y * ratio, targetRadius)
    }
}