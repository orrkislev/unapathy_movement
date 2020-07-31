var NOSE_SPEED_SOOTHING = 0.5;
let faceMaxSpeed = 0;
let avgFaceSpeed = 0;
let facePoints = [0]
let prevNosePosition = null;

function updateNose(nosePosition) {
  if (nosePosition!=null){
    if (nosePosition != prevNosePosition) {
      if (prevNosePosition) {
        const noseSpeed = dist(nosePosition[0], nosePosition[1], prevNosePosition[0], prevNosePosition[1])
          faceGraph.addValue(noseSpeed)
      }
      prevNosePosition = nosePosition;
    }
  }
}