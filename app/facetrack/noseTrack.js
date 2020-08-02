let prevNosePosition = null;

function updateNose(nosePosition) {
  if (nosePosition == null) return null

  let noseSpeed = null
  if (prevNosePosition) 
    noseSpeed = dist(nosePosition[0], nosePosition[1], prevNosePosition[0], prevNosePosition[1])
  prevNosePosition = nosePosition;
  return noseSpeed
}