let GAZE_APATHY_THRESHOLD = 0.4
let NOSE_APATHY_THRESHOLD = 0.5
let MOVE_APATHY_THRESHOLD = 0.8

let MINUTES_TO_VIDEO = 0.5
let apathyLevel = 0;

let startTime

function setup() {
	print("start setup")
	resizeCanvas(window.innerWidth, window.innerHeight)
	webgazerSetup();
	// facetrackSetup();
	motionSetup();

	changeLogo()
}

let plotting = false
let gathering = false
let measuring = false
let practicing = false

function startPlotting() { plotting = true; measuring = true }
function startGatheringData() { gathering = true; startTime = new Date() }
function stopGatherindData() { gathering = false; plotting = false }
function startPracticing() { practicing = true; }

function draw() {
	background(255)
	if (gathering) {
		updateGazeAndNose()
		updateMovement()

		if (keyIsDown(32)) {
			GAZE_APATHY_THRESHOLD = lerp(GAZE_APATHY_THRESHOLD, gazePoints[29], 0.02)
			NOSE_APATHY_THRESHOLD = lerp(GAZE_APATHY_THRESHOLD, facePoints[29], 0.02)
			MOVE_APATHY_THRESHOLD = lerp(GAZE_APATHY_THRESHOLD, movementPoints[29], 0.02)
		}
	}
	if (plotting) {
		plotImage()
		plotGaze()
		plotNose()
		plotMovement()

		noStroke()
		textSize(14)
		textStyle(NORMAL);
		fill(255, 0, 255)
		const currTime = new Date()
		const totalTime = (currTime - startTime) / 1000
		let totalString = "Total time in front of screen: "
		totalString += totalTime > 120 ? str(floor(totalTime / 60)) + " min" : str(floor(totalTime)) + " sec"
		let passiveString = "Total passive moments: "
		passiveString += apathyLevel > 120 ? str(floor(apathyLevel / 60)) + " min" : str(floor(apathyLevel)) + " sec"
		text(totalString, width * 0.1, height * 0.65)
		text(passiveString, width * 0.1, height * 0.65 + 20)
	}
	if (measuring) {
		if (apathyLevel < MINUTES_TO_VIDEO * 60) {
			if (gazePoints[29] < GAZE_APATHY_THRESHOLD &&
				facePoints[29] < NOSE_APATHY_THRESHOLD &&
				movementPoints[29] < MOVE_APATHY_THRESHOLD) {
				apathyLevel += deltaTime / 1000
				if (apathyLevel > MINUTES_TO_VIDEO * 60) {
					passiveTooLong()
				}
			}
		}
		noStroke()
		fill(255, 0, 255, 200)
		const apathyPercentage = apathyLevel / (MINUTES_TO_VIDEO * 60)
		rect(0, height - height * apathyPercentage, width, height * apathyPercentage)
	}

	if (practicing) {
		practice()
	}

	drawLogo()
}

function keyPressed() {
	if (keyCode == ENTER) opticalFlow = !opticalFlow
}

