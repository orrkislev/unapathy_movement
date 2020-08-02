let prevNosePosition = null;

function updateNose(nosePosition) {
  if (nosePosition == null) return null
  if (prevNosePosition) {
    const noseSpeed = dist(nosePosition[0], nosePosition[1], prevNosePosition[0], prevNosePosition[1])
    return noseSpeed
  }
  prevNosePosition = nosePosition;
}