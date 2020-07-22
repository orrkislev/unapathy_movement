let GAZE_APATHY_THRESHOLD = 0.4
let NOSE_APATHY_THRESHOLD = 0.5
let MOVE_APATHY_THRESHOLD = 0.8

let MINUTES_TO_VIDEO = 30
let apathyLevel = 0;

let startTime

function setup() {
	print("start setup")
	resizeCanvas(window.innerWidth, window.innerHeight)
	webgazerSetup();
	motionSetup();
}

let plotting = false
let gathering = true
let measuring = false
let practicing = false
let learning = true
let viewing = false

function startPlotting() { plotting = true; measuring = true }
function startGatheringData() { gathering = true; startTime = new Date() }
function stopAll() { gathering = false; plotting = false; measuring = false }
function startPracticing() { practicing = true; }

function draw() {
	background(255)
	if (gathering) {
		updateMovement()
		updateGazeAndNose()
	}
	if (learning) {
		if (gazePoints.length > 0)
			GAZE_APATHY_THRESHOLD = lerp(GAZE_APATHY_THRESHOLD, gazePoints[gazePoints.length - 1] * 0.8, 0.02)
		if (facePoints.length > 0)
			NOSE_APATHY_THRESHOLD = lerp(NOSE_APATHY_THRESHOLD, facePoints[facePoints.length - 1] * 0.8, 0.02)
		if (movementPoints.length > 0)
			MOVE_APATHY_THRESHOLD = lerp(MOVE_APATHY_THRESHOLD, movementPoints[movementPoints.length - 1] * 0.8, 0.02)
	}
	if (plotting) {
		plotImage()
		plotGaze()
		plotNose()
		plotMovement()
		plotTexts()
	}
	if (measuring) {
		if (apathyLevel < MINUTES_TO_VIDEO * 60) {
			if (gazePoints[gazePoints.length - 1] < GAZE_APATHY_THRESHOLD &&
				facePoints[facePoints.length - 1] < NOSE_APATHY_THRESHOLD &&
				movementPoints[movementPoints.length - 1] < MOVE_APATHY_THRESHOLD) {
				apathyLevel += deltaTime / 1000
				if (apathyLevel > MINUTES_TO_VIDEO * 60) {
					passiveTooLong()
				}
			}
		}
		noStroke()
		fill(255, 0, 255, 165)
		const apathyPercentage = apathyLevel / (MINUTES_TO_VIDEO * 60)
		rect(0, height - height * apathyPercentage, width, height * apathyPercentage)
	}
	if (viewing) {
		if (videoPlayer.currentTime()>30){
			videoPlayer.pause()
			viewing = false
			$('#videoPlayer').hide()
			endTutorial1()
		}
	}
	if (practicing) {
		practice()
	}

	drawLogo()
}

function keyPressed() {
	if (keyCode == ENTER) opticalFlow = !opticalFlow
}

function onlyFill() {
	noStroke()
	fill(255, 0, 255)
}

function onlyStroke() {
	noFill()
	stroke(255, 0, 255, 200)
}

let videoPlayer
function startViewing() {
	$('#videoPlayer').show()
	videoPlayer = videojs('videoPlayer')
	videoPlayer.play()
	viewing = true
}


function resetTimers(){
	apathyLevel = 0
	startTime = new Date()
}