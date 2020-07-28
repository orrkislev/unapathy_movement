const targetRadius = 40;
let practiceThreshold = 60
let practiceTargetHeight = 70
let offsets = [35,65];


function practice() {
    const imagePosX = width/2 - motionCapture.width*plotCaptureScale/2
    // const imagePosY = height-gutter - motionCapture.height*plotCaptureScale
    const imagePosY = plotCaptureY
    scale(-1, 1)
    image(motionCapture,
        -imagePosX,imagePosY ,
        -motionCapture.width * plotCaptureScale,
        motionCapture.height * plotCaptureScale)
    resetMatrix()
    updateMovement()

    onlyFill()
	textAlign(LEFT, BASELINE);
	textSize(20)
	textStyle(BOLD);
    text("Move away from the screen, until the dots are in a good position and play!",imagePosX, imagePosY-10)
    offsets.forEach(offset => {
        const posX = motionCapture.width * offset / 100
        if (flow.flow) {
            let totalFlow = 0
            flow.flow.zones.forEach(zone => {
                if (abs(zone.x - posX) < targetRadius * plotCaptureScale &&
                    abs(zone.y - practiceTargetHeight) < targetRadius * plotCaptureScale) {
                    totalFlow += sqrt(zone.u * zone.u + zone.v * zone.v)
                }
            })
            onlyFill()
            circle(imagePosX + posX * plotCaptureScale,
                   imagePosY + practiceTargetHeight * plotCaptureScale,
                   targetRadius)
            if (totalFlow>practiceThreshold && !jugglingSound.isPlaying())
            jugglingSound.play()
        }
    })
}

$('#donePracticeBtn').on('click',() => {
    $('#donePractice').hide()
    practicing = false
    donePracticeMessage()
})