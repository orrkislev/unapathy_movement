let totalApathyTime = 0
let totalScreenTime = 0
let apathyTime = 0;

let moveGraph = new Graph(graph_text_move, graph_smooth_move)
let faceGraph = new Graph(graph_text_face, graph_smooth_face)
let gazeGraph = new Graph(graph_text_gaze, graph_smooth_gaze)



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

let savingData = true
let plotting = false // false
let followMe = false
let practicing = false // false
let learning = true // true
let viewing = false // false
let done = false

function draw() {
	background(255)

	const newMotion = updateMovement()
	const [newGaze, newFacePos] = updateGazeAndNose()
	const newFace = updateNose(newFacePos)

	if (savingData) {
		moveGraph.addValue(newMotion)
		gazeGraph.addValue(newGaze)
		faceGraph.addValue(newFace)
	}

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
			if (moveGraph.isApathy() && faceGraph.isApathy() && gazeGraph.isApathy()) {
				apathyTime += deltaTime / 1000
				totalApathyTime += deltaTime / 1000
				if (apathyTime > MINUTES_TO_VIDEO * 60) {
					new Notification('You are passive', { body: 'see what you can do' });
					passiveTooLong()
				}
				if (apathyTime > MINUTES_TO_VIDEO / 10) {
					moveGraph.limitMax = true
					faceGraph.limitMax = true
					gazeGraph.limitMax = true
				}
			}
		}
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
function startPlotting() {
	plotting = true;
	initPlot()
	savingData = true;
}
function stopPlotting() {
	plotting = false
	savingData = false
	hideHovers()
}
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

function skip(){
	learning=false
	hideMsg()
	resetTimers()
	startPlotting()
}


let mouseOnLogo = false
let mouseStartHover = 0
let mouseHover
function checkMouse() {
	mouseOnLogo = isMouseBetween(gutter, gutter + textWidth('UN_APATHY    MOVEMENT') + 10, gutter, gutter + 30)
	cursor(mouseOnLogo ? HAND : ARROW)

	if (plotting) {
		checkHover(gutter, gutter + graphPlotWidth, plotCaptureY, gazeGraph.plotY + graphPlotHeight, 'graphs')
		checkHover(gutter, gutter + graphPlotWidth, plotTotalsY-50, plotTotalsY, "totals")
		const apathyOverlaySize = height * (apathyTime / (MINUTES_TO_VIDEO * 60))
		checkHover(width/2-textWidth('Apathy Level: 40%'), width/2, height-apathyOverlaySize-20, height-apathyOverlaySize+20, "apathy")
		checkHover(plotCaptureX, plotCaptureX+width * PLOT_CAPTURE_SCALE, plotCaptureY, motionCapture.height * plotCaptureScale, "image")
	}
}

function isMouseBetween(x1, x2, y1, y2) {
	return (x1 < mouseX && mouseX < x2 && y1 < mouseY && mouseY < y2)
}
function hideHovers(){
	$("#hover_graphs").css('bottom', -height)
	$("#hover_totals").css('bottom', -height)
	$("#hover_apathy").css('bottom', -height)
	$("#hover_image").css('bottom', -height)
}
function checkHover(x1, x2, y1, y2, name) {
	if (isMouseBetween(x1, x2, y1, y2)) {
		if (mouseHover != name) {
			mouseHover = name
			mouseStartHover = millis()
		} else {
			if (millis() - mouseStartHover > 300) {
				$("#hover_" + name).show()
				$("#hover_" + name).css('bottom', height - mouseY - 10)
				$("#hover_" + name).css('left', mouseX + 10)
			}
		}
	} else if (mouseHover == name) {
		mouseHover = null
		$("#hover_" + name).hide()
	}
}

function mousePressed() {
	if (mouseOnLogo)
		location.reload()
}