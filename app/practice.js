let captureRatioForPractice = null
const targetRadius = 40;
let practiceThreshold = 20

function initPractice(ballNum) {
    
}

function practice() {
    if (captureRatioForPractice==null) captureRatioForPractice = (width * 0.6 / motionCapture.width)
    scale(-1, 1)
    image(motionCapture,
        -width * 0.2, height * 0.2,
        -motionCapture.width * captureRatioForPractice,
        motionCapture.height * captureRatioForPractice)
    resetMatrix()
    updateMovement()

    checkTarget()
}

function checkTarget() {
    [createVector(160, 50), createVector(560, 50)].forEach(target => {
        if (flow.flow) {
            let totalFlow = 0
            flow.flow.zones.forEach(zone => {
                if (abs(zone.x - target.x) < targetRadius * captureRatioForPractice &&
                    abs(zone.y - target.y) < targetRadius * captureRatioForPractice) {
                    totalFlow += sqrt(zone.u * zone.u + zone.v * zone.v)
                }
            })
            if (totalFlow > practiceThreshold) {
                onlyFill()
            } else {
                onlyStroke()
            }
            circle(width * 0.2 + (motionCapture.width - target.x) * captureRatioForPractice,
                height * 0.2 + target.y * captureRatioForPractice,
                targetRadius)
        }
    })
}


$('#donePracticeBtn').on('click',() => {
    $('#donePractice').hide()
    practicing = false
    donePracticeMessage()
})