var NOSE_SPEED_SOOTHING = 0.5;
let faceMaxSpeed = 0;
let avgFaceSpeed = 0;
let facePoints = []
let faceMidLine=0
let prevNosePosition = null;

function updateNose(nosePosition) {
  if (nosePosition != prevNosePosition) {
    if (prevNosePosition) {
      const noseSpeed = dist(nosePosition[0], nosePosition[1], prevNosePosition[0], prevNosePosition[1])
      if (typeof (noseSpeed == 'number')) {
        avgFaceSpeed = NOSE_SPEED_SOOTHING * avgFaceSpeed + (1.0 - NOSE_SPEED_SOOTHING) * noseSpeed
        // faceMaxSpeed = Math.max(faceMaxSpeed, avgFaceSpeed)
        facePoints.push(avgFaceSpeed)
        if (facePoints.length > graphPlotLength) facePoints.shift()
        // if (facePoints.length > 30*15) facePoints.shift()
        faceMidLine = (faceMidLine * frameRate() * 15 + avgFaceSpeed) / (frameRate() * 15+1)
      }
    }
    prevNosePosition = nosePosition;
  }
}


function plotNose() {
  plotGraph(plotGraphY_face, facePoints, "Head Position:", faceMidLine, faceMaxSpeed)
}

