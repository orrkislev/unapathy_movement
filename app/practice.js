let captureRatioForPractice = null
const targetRadius = 40;
let practiceThreshold = 40
let practiceTargets = [100,400]
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
        const noseHeight = webgazer.getTracker().getPositions()[1][1]
        const dist = abs(webgazer.getTracker().getPositions()[205][0] - webgazer.getTracker().getPositions()[425][0]) 
        const mid = (webgazer.getTracker().getPositions()[205][0] + webgazer.getTracker().getPositions()[425][0])/2
        practiceTargetHeight = lerp(practiceTargetHeight,max(noseHeight-dist*5,targetRadius),0.3)
        practiceTargets = [
            lerp(practiceTargets[0],mid-dist*2,0.3),
            lerp(practiceTargets[1],mid+dist*2,0.3)
        ]
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