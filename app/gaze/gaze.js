var REFRESH_EVERY = 0; // 0 is disabled
var MARKER_SIZE = 0; // 0 is disabled

var xprediction, yprediction;
var prevXprediction=null, prevYprediction=null;
var predictionTstamp = -1;
var prevPredictionTstamp = -1;

// Kalman Filter defaults to on. Can be toggled by user.
window.applyKalmanFilter = true;
// Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = true;

window.onbeforeunload = function () {
	console.log('webgazer.end()');
	webgazer.end();
}

function webgazerSetup() {
	webgazer.setRegression('ridge')
		.setTracker('TFFacemesh')
		.showPredictionPoints(false)
		.showVideo(false)
		.showFaceOverlay(false)
		.showFaceFeedbackBox(false)
		.setGazeListener((data, elapsedTime) => {
			if (data == null) {
				return;
			}
			xprediction = data.x; //these x coordinates are relative to the viewport
			yprediction = data.y; //these y coordinates are relative to the viewport
			predictionTstamp = millis();
		}).begin();
	setTimeout(checkIfReady, 100);
}

function checkIfReady() {
	console.log('checkIfReady()');
	if (webgazer.isReady()) {
		webgazer.clearData();
		resetCalibrationPoints();
  		calibrationMessage1()
	} else {
		setTimeout(checkIfReady, 100);
	}
}



var GAZE_SPEED_SOOTHING = 0.5;
let gazeMaxSpeed = 0;
let avgGazeSpeed = 0;
let gazePoints = []
function updateGazeAndNose() {
	if (xprediction && yprediction) {
		noStroke();
		fill(255, 0, 255);
		ellipse(xprediction, yprediction, MARKER_SIZE, MARKER_SIZE);
		if (prevXprediction == null && prevYprediction == null){
			prevXprediction = xprediction;
			prevYprediction = yprediction;
		} else if (xprediction != prevXprediction || yprediction != prevYprediction) {
			const gazeSpeed = dist(prevXprediction, prevYprediction, xprediction, yprediction)
			prevXprediction = xprediction;
			prevYprediction = yprediction;
			avgGazeSpeed = round(GAZE_SPEED_SOOTHING * avgGazeSpeed + (1.0 - GAZE_SPEED_SOOTHING) * gazeSpeed);
			gazeMaxSpeed = Math.max(gazeMaxSpeed, avgGazeSpeed)
			gazePoints.push(avgGazeSpeed / gazeMaxSpeed)
			if (gazePoints.length > 30) gazePoints.splice(0, 1)
		}
	}
	updateNose(webgazer.getTracker().getPositions()[1])
}

function plotGaze() {
	plotGraph(height * 0.5,gazePoints,"Eye Gaze:")
}