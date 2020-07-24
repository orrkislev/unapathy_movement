let GAZE_APATHY_THRESHOLD = 0.4
let NOSE_APATHY_THRESHOLD = 0.5
let MOVE_APATHY_THRESHOLD = 0.8

let MINUTES_TO_VIDEO = 0.005
let totalApathyTime = 0
let totalScreenTime = 0
let apathyTime = 0;
let screenTime = 0

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

	// noFill()
	// stroke(0,60)
	// for (i=0;i<width;i+=30){
	// 	line(i,0,i,height)
	// }
	// for (i=0;i<height;i+=30){
	// 	line(0,i,width,i)
	// }

	updateMovement()
	const isFacingCamera = updateGazeAndNose()

	if (learning) {
		plotGazePoint()
		if (gazePoints.length > 0)
			GAZE_APATHY_THRESHOLD = lerp(GAZE_APATHY_THRESHOLD, gazePoints[gazePoints.length - 1] * 0.8, 0.02)
		if (facePoints.length > 0)
			NOSE_APATHY_THRESHOLD = lerp(NOSE_APATHY_THRESHOLD, facePoints[facePoints.length - 1] * 0.8, 0.02)
		if (movementPoints.length > 0)
			MOVE_APATHY_THRESHOLD = lerp(MOVE_APATHY_THRESHOLD, movementPoints[movementPoints.length - 1] * 0.8, 0.02)
	}
	if (followMe){
		plotFollowMe()
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
		if (videoPlayer.currentTime() > 20 && videoPlayer.remainingTime() < 1) stopVideo()
	}
	if (practicing) {
		practice()
	}
	if (done){
		plotImage(true)
	}

	drawLogo()
}

function resetTimers() {
	totalApathyTime += apathyTime
	totalScreenTime += screenTime
	screenTime = 0;
	apathyTime = 0; 
}
function startPlotting() { plotting = true; initPlot() }
function stopPlotting() { plotting = false }
function startPracticing() {
	practicing = true; 
	$('#donePractice').show() 
	$('#donePracticeBtn').on('click', donePracticeMessage)
}
function stopLearning(){
	learning = false
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
	$("#videoConrainer").show()
	$('#videoConrainer').css('width',$('#videoPlayer').height()*1.78)
	videoPlayer = videojs('videoPlayer')
	if (numBalls>1)
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

function stopVideo(){
	videoPlayer.pause()
	videoPlayer.currentTime(2)
	viewing = false
	$("#videoConrainer").hide()
	endVideoMessage(currVideoIndex)
}

function startFollowMe(){
	followMe = true
	setTimeout(()=>{
		followMe = false
		resetTimers()
        startPlotting()
        startPlottingMessage();
	},10000)
}