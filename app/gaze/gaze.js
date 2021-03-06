var REFRESH_EVERY = 0; // 0 is disabled
var MARKER_SIZE = 15; // 0 is disabled

var xprediction=null, yprediction=null;
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
		.showVideo(false)
		.showFaceOverlay(false)
		.showFaceFeedbackBox(false)
		.setGazeListener((data, elapsedTime) => {
			if (data == null) return;
			xprediction = data.x; //these x coordinates are relative to the viewport
			yprediction = data.y; //these y coordinates are relative to the viewport
			predictionTstamp = millis();
		}).begin();
	webgazer.showPredictionPoints(false)
	setTimeout(checkIfReady, 100);
}

function checkIfReady() {
	console.log('checkIfReady()');
	if (webgazer.isReady()) {
		// webgazer.clearData();
		resetCalibrationPoints();
  		// calibrationMessage1()
	} else {
		setTimeout(checkIfReady, 100);
	}
}


function updateGazeAndNose() {
	let newGaze = null, newFacePos = null
	if (xprediction && yprediction) {
		gazePlotPoint[0] = lerp(gazePlotPoint[0],xprediction,0.3)
		gazePlotPoint[1] = lerp(gazePlotPoint[1],yprediction,0.3)
		if (xprediction != prevXprediction || yprediction != prevYprediction)
			newGaze = dist(prevXprediction, prevYprediction, xprediction, yprediction)	
		prevXprediction = xprediction;
		prevYprediction = yprediction;
		if (webgazer.getTracker().getPositions().length>=2)
			newFacePos = webgazer.getTracker().getPositions()[1]
		xprediction = null
	}
	return [newGaze,newFacePos]
}