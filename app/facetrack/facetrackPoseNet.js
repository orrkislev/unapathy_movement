let facetrackCapture;
let poseNet;
let poses = [];
var wi = 640, he = 480;
var prevNosePosition;
var prevNoseMeasurementTstamp;
var noseMeasurementTstamp;
var newFacetrackMeasurement = false;

function facetrackSetup() {
  console.log("face track setup")
  facetrackCapture = createCapture(VIDEO);
  facetrackCapture.size(wi, he);
  poseNet = ml5.poseNet(facetrackCapture, facetrackModelReady);
  poseNet.on('pose', function (results) {
    poses = results;
    noseMeasurementTstamp = millis();
    newFacetrackMeasurement = true;
  });
  facetrackCapture.hide();
}

function facetrackModelReady() {
  console.log('PoseNet Model Loaded');
}

var NOSE_SPEED_SOOTHING = 0;
let faceMaxSpeed = 0;
let avgFaceSpeed = 0;
let facePoints = []
function updateNose() {
  if (!webgazerCalibrated) return;

  if (newFacetrackMeasurement && poses && poses.length > 0) {
    let pose = poses[0].pose;
    let leftEyePosition = _.first(_.filter(_.first(poses).pose.keypoints, d => d.part === 'leftEye')).position
    let rightEyePosition = _.first(_.filter(_.first(poses).pose.keypoints, d => d.part === 'rightEye')).position
    nosePosition = _.first(_.filter(_.first(poses).pose.keypoints, d => d.part === 'nose')).position

    if (prevNosePosition) {
      const noseSpeed = dist(nosePosition.x, nosePosition.y, prevNosePosition.x, prevNosePosition.y)
      avgFaceSpeed = round(NOSE_SPEED_SOOTHING * avgFaceSpeed + (1.0 - NOSE_SPEED_SOOTHING) * noseSpeed);
      faceMaxSpeed = Math.max(faceMaxSpeed, avgFaceSpeed)
      facePoints.push(avgFaceSpeed / faceMaxSpeed)
      if (facePoints.length > 30) facePoints.splice(0, 1)
    }
    prevNosePosition = nosePosition;
    newFacetrackMeasurement = false;
  }
}

function plotNose() {
  const plotPos = createVector(width * 0.1, height * 0.35)
  const plotSize = createVector(width * 0.25, height * 0.1)

  noStroke()
  fill(255, 0, 255)
  text("Head Position:", plotPos.x, plotPos.y - 10)
  noFill()
  stroke(255, 0, 255)
  rect(plotPos.x, plotPos.y, plotSize.x, plotSize.y)
  dottedLine(plotPos.x, plotSize.x, plotPos.y + (1 - NOSE_APATHY_THRESHOLD) * plotSize.y)
  beginShape()
  facePoints.forEach((facePoint, index) => {
    const x = plotPos.x + plotSize.x * (index / 29)
    const y = plotPos.y + plotSize.y * (1 - facePoint)
    curveVertex(x, y)
  })
  endShape()
}

function updateNose2(nosePosition) {
  if (nosePosition != prevNosePosition) {
    if (prevNosePosition) {
      const noseSpeed = dist(nosePosition[0], nosePosition[1], prevNosePosition[0], prevNosePosition[1])
      avgFaceSpeed = round(NOSE_SPEED_SOOTHING * avgFaceSpeed + (1.0 - NOSE_SPEED_SOOTHING) * noseSpeed);
      faceMaxSpeed = Math.max(faceMaxSpeed, avgFaceSpeed)
      facePoints.push(avgFaceSpeed / faceMaxSpeed)
      if (facePoints.length > 30) facePoints.splice(0, 1)
    }
    prevNosePosition = nosePosition;
  }
}