var NOSE_SPEED_SOOTHING = 0.5;
let faceMaxSpeed = 0;
let avgFaceSpeed = 0;
let facePoints = []

let prevNosePosition = null;

function updateNose(nosePosition) {
  if (nosePosition != prevNosePosition) {
    if (prevNosePosition) {
      const noseSpeed = dist(nosePosition[0], nosePosition[1], prevNosePosition[0], prevNosePosition[1])
      if (typeof (noseSpeed == 'number')) {
        avgFaceSpeed = round(NOSE_SPEED_SOOTHING * avgFaceSpeed + (1.0 - NOSE_SPEED_SOOTHING) * noseSpeed);
        faceMaxSpeed = Math.max(faceMaxSpeed, avgFaceSpeed)
        facePoints.push(avgFaceSpeed / faceMaxSpeed)
        if (facePoints.length > 30) facePoints.splice(0, 1)
      }
    }
    prevNosePosition = nosePosition;
  }
}


function plotNose() {
  plotGraph(height * 0.35, facePoints, "Head Position:", NOSE_APATHY_THRESHOLD)
}

