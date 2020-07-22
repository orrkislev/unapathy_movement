var motionCapture;
var previousPixels=null;
var flow;
var w = 640, h = 480;
var step = 8;

function motionSetup() {
  motionCapture = createCapture({
    audio: false,
    video: {
      width: w,
      height: h
    }
  }, function () {
    console.log('capture ready.')
    newMotionCapture = true;
  });
  // motionCapture.elt.setAttribute('playsinline', '');
  motionCapture.hide();
  flow = new FlowCalculator(step);
}

function copyImage(src, dst) {
  var n = src.length;
  if (!dst || dst.length != n) dst = new src.constructor(n);
  while (n--) dst[n] = src[n];
  return dst;
}

function same(a1, a2, stride, n) {
  for (var i = 0; i < n; i += stride) {
    if (a1[i] != a2[i]) {
      return false;
    }
  }
  return true;
}

var MOVEMENT_SPEED_SOOTHING = 0.9;
var avgMovement = 0;
let movementMaxSpeed = 0;
let movementPoints = []
function updateMovement() {
  motionCapture.loadPixels();
  if (motionCapture.pixels.length > 0) {
    if (previousPixels){
      if (same(previousPixels, motionCapture.pixels, 8, width)) {
        return;
      }
      flow.calculate(previousPixels, motionCapture.pixels, motionCapture.width, motionCapture.height);
    }
    previousPixels = copyImage(motionCapture.pixels, previousPixels);
    if (flow.flow) {
      const rawMotion = constrain(round(sqrt(pow(flow.flow.u, 2) + pow(flow.flow.v, 2)) / step * 100 * 5), 0, 100);
      avgMovement = round(MOVEMENT_SPEED_SOOTHING * avgMovement + (1.0 - MOVEMENT_SPEED_SOOTHING) * rawMotion);
      movementMaxSpeed = Math.max(movementMaxSpeed, avgMovement)
      // movementPoints.push(avgMovement / movementMaxSpeed)
      movementPoints.push(avgMovement)
      if (movementPoints.length > 30) movementPoints.splice(0, 1)
    }
  }
}


function plotMovement() {
  plotGraph(height * 0.2,movementPoints,"General Movement:",MOVE_APATHY_THRESHOLD, movementMaxSpeed)
}