let captureRatioForPractice = null
const targetRadius = 40;
let practiceThreshold = 40
let practiceTargets = []
let practiceTargetHeight = 40

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

    if (webgazer.getTracker().getPositions() !== null){
        const dist = abs(webgazer.getTracker().getPositions()[205][0] - webgazer.getTracker().getPositions()[425][0]) 
        const mid = (webgazer.getTracker().getPositions()[205][0] + webgazer.getTracker().getPositions()[425][0])/2
        practiceTargets = [mid-dist*2,mid+dist*2 ]
    }
}

function drawDot(pos){
    onlyFill()
    circle(width * 0.2 + (motionCapture.width - pos[0]) * captureRatioForPractice,
           height * 0.2 + pos[1] * captureRatioForPractice,10)
}

function checkTarget() {
    practiceTargets.forEach(targetX => {
        if (flow.flow) {
            let totalFlow = 0
            flow.flow.zones.forEach(zone => {
                if (abs(zone.x - targetX) < targetRadius * captureRatioForPractice &&
                    abs(zone.y - practiceTargetHeight) < targetRadius * captureRatioForPractice) {
                    totalFlow += sqrt(zone.u * zone.u + zone.v * zone.v)
                }
            })
            if (totalFlow > practiceThreshold) {
                onlyFill()
            } else {
                onlyStroke()
            }
            circle(width * 0.2 + (motionCapture.width - targetX) * captureRatioForPractice,
                height * 0.2 + practiceTargetHeight * captureRatioForPractice,
                targetRadius)
        }
    })
}


$('#donePracticeBtn').on('click',() => {
    $('#donePractice').hide()
    practicing = false
    donePracticeMessage()
})