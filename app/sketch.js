let totalApathyTime = 0
let totalScreenTime = 0
let apathyTime = 0;

let moveGraph = new Graph('General Movement',graph_smooth_move)
let faceGraph = new Graph('Head Position',graph_smooth_face)
let gazeGraph = new Graph('Eye Gaze',graph_smooth_gaze)



let jugglingSound;
function preload() {
	soundFormats('mp3');
	jugglingSound = loadSound('sound.mp3');
}

function setup() {
	Notification.requestPermission();
	welcomeMessage()
	resizeCanvas(window.innerWidth, window.innerHeight)
	webgazerSetup();
	motionSetup();
	initPlot()
}

let plotting = false // false
let followMe = false
let practicing = false // false
let learning = true // true
let viewing = false // false
let done = false

function draw() {
	background(255)

	updateMovement()
	const isFacingCamera = updateGazeAndNose()

	if (learning) {
		plotGazePoint()

		moveGraph.learn()
		faceGraph.learn()
		gazeGraph.learn()
	}

	if (followMe) plotFollowMe()

	if (plotting) {
		plotGazePoint()
		plotImage()
		moveGraph.plot()
		faceGraph.plot()
		gazeGraph.plot()

		plotTexts()
			if (apathyTime < MINUTES_TO_VIDEO * 60) {

				if (moveGraph.isApathy() && faceGraph.isApathy() && gazeGraph.isApathy()){
					apathyTime += deltaTime / 1000
					totalApathyTime += deltaTime / 1000
					if (apathyTime > MINUTES_TO_VIDEO * 60) {
						new Notification('You are passive', { body: 'see what you can do' });
						passiveTooLong()
					}
				}
			}
		// }
		totalScreenTime += deltaTime / 1000
		plotApathy()
	}
	if (viewing) {
		if (videoPlayer.currentTime() > 20 && videoPlayer.remainingTime() < 1) {
			stopVideo()
			endVideoMessage(currVideoIndex)
		}
	}
	if (practicing) practice()
	if (done) plotImage()

	drawLogo()
	checkMouse()
}

function resetTimers() {
	apathyTime = 0;
}
function startPlotting() { plotting = true; initPlot() }
function stopPlotting() { plotting = false }
function startPracticing() {
	practicing = true;
	$('#donePractice').show()
	$('#donePracticeBtn').on('click', donePracticeMessage)
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
let currVideoIndex
function startVideo(numBalls) {
	$("#videoConrainer").show()
	$('#videoConrainer').css('width', $('#videoPlayer').height() * 1.78)
	videoPlayer = videojs('videoPlayer')
	if (numBalls > 1)
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

function stopVideo() {
	videoPlayer.pause()
	videoPlayer.currentTime(2)
	viewing = false
	$("#videoConrainer").hide()
}

function startFollowMe() {
	followMe = true
	setTimeout(() => {
		followMeMove = true
	}, follow_me_start_time)
	setTimeout(() => {
		followMe = false
		learning = false
		resetTimers()
		startPlotting()
		startPlottingMessage();
	}, follow_me_time)
}


let mouseOnLogo = false
function checkMouse() {
	mouseOnLogo = (mouseX > gutter &&
		mouseX < gutter + textWidth('UN_APATHY    MOVEMENT') + 10 &&
		mouseY > gutter &&
		mouseY < gutter + 30)
	cursor(mouseOnLogo ? HAND : ARROW)
}

function mousePressed() {
	if (mouseOnLogo)
		location.reload()
}