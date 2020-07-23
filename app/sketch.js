let GAZE_APATHY_THRESHOLD = 0.4
let NOSE_APATHY_THRESHOLD = 0.5
let MOVE_APATHY_THRESHOLD = 0.8

let MINUTES_TO_VIDEO = 1
let apathyTime = 0;
let screenTime = 0

function setup() {
	Notification.requestPermission();
	print("start setup")
	resizeCanvas(window.innerWidth, window.innerHeight)
	webgazerSetup();
	motionSetup();
}

let plotting = false // false
let practicing = false // false
let learning = true // true
let viewing = false // false

function startPlotting() { plotting = true }
function resetTimers() { screenTime = 0; apathyTime = 0; }
function stopPlotting() { plotting = false }
function startPracticing() { practicing = true; webgazer.begin() }

let isFacingCamera = false
function draw() {
	background(255)
	updateMovement()
	isFacingCamera = updateGazeAndNose()

	if (learning) {
		plotGazePoint()
		if (gazePoints.length > 0)
			GAZE_APATHY_THRESHOLD = lerp(GAZE_APATHY_THRESHOLD, gazePoints[gazePoints.length - 1] * 0.8, 0.02)
		if (facePoints.length > 0)
			NOSE_APATHY_THRESHOLD = lerp(NOSE_APATHY_THRESHOLD, facePoints[facePoints.length - 1] * 0.8, 0.02)
		if (movementPoints.length > 0)
			MOVE_APATHY_THRESHOLD = lerp(MOVE_APATHY_THRESHOLD, movementPoints[movementPoints.length - 1] * 0.8, 0.02)
	}
	if (plotting) {
		plotGazePoint()
		plotImage()
		plotGaze()
		plotNose()
		plotMovement()
		plotTexts()
		if (isFacingCamera) {
			if (apathyTime < MINUTES_TO_VIDEO * 60) {
				if (gazePoints[gazePoints.length - 1] < GAZE_APATHY_THRESHOLD &&
					facePoints[facePoints.length - 1] < NOSE_APATHY_THRESHOLD &&
					movementPoints[movementPoints.length - 1] < MOVE_APATHY_THRESHOLD) {
					apathyTime += deltaTime / 1000
					if (apathyTime > MINUTES_TO_VIDEO * 60) {
						new Notification('You are passive', { body: 'see what you can do' });
						passiveTooLong()
					}
				}
			}
			screenTime += deltaTime / 1000
		}
		noStroke()
		fill(255, 0, 255, 165)
		const apathyPercentage = apathyTime / (MINUTES_TO_VIDEO * 60)
		rect(0, height - height * apathyPercentage, width, height * apathyPercentage)
	}
	if (viewing) {
		background(255, 0, 255)
		if (videoPlayer.currentTime() > 20 && videoPlayer.remainingTime() < 1) {
			videoPlayer.pause()
			videoPlayer.currentTime(2)
			viewing = false
			$('#videoPlayer').hide()
			endVideoMessage(currVideoIndex)
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
const youtubeLinks = ['',
	'https://www.youtube.com/watch?v=Br1isK0b17s',
	'https://www.youtube.com/watch?v=uaG0xreSyls',
	'https://www.youtube.com/watch?v=0awTfH62ar8'
]
let currVideoIndex
function startVideo(numBalls) {
	$('#videoPlayer').show()
	videoPlayer = videojs('videoPlayer')
	videoPlayer.src({
		type: "video/youtube",
		src: youtubeLinks[numBalls],
		youtube: {
			"ytControls": 2,
			"modestbranding": "1",
			"fs": "0",
			"showinfo": "0"
		}
	})
	videoPlayer.currentTime(0);
	videoPlayer.play()
	currVideoIndex = numBalls
	viewing = true
}


function resetTimers() {
	apathyTime = 0
	startTime = new Date()
}