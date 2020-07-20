const GAZE_APATHY_THRESHOLD = 0.4
const NOSE_APATHY_THRESHOLD = 0.5
const MOVE_APATHY_THRESHOLD = 0.8

let apathyLevel = 0;

function setup() {
	print("start setup")
	resizeCanvas(window.innerWidth, window.innerHeight)
	webgazerSetup();
	// facetrackSetup();
	motionSetup();

	changeLogo()
}

let plotting = false
let measuring = false

function startPlotting() {
	plotting = true
}

function draw() {
	background(255)
	if (plotting) {
		plotImage()

		updateGazeAndNose()
		updateMovement()

		plotGaze()
		plotNose()
		plotMovement()
	}
	if (measuring) {
		if (gazePoints[29] < GAZE_APATHY_THRESHOLD &&
			facePoints[29] < NOSE_APATHY_THRESHOLD &&
			movementPoints[29] < MOVE_APATHY_THRESHOLD) {
			apathyLevel += 0.01
			if (apathyLevel >= 1) apathyLevel = 0
		}
		noStroke()
		fill(255, 0, 255, 100)
		rect(0, height - height * apathyLevel, width, height * apathyLevel)
	}

	drawLogo()
}

function keyPressed() {
	if (keyCode == ENTER) measuring = !measuring
}

function plotImage() {
	image(motionCapture, width * 0.5, height * 0.2, width * 0.4, motionCapture.height * (width * 0.4 / motionCapture.width))
}

function dottedLine(x, w, y) {
	for (let i = 0; i < 30; i++) {
		const startX = x + i * w / 30
		const endX = startX + w / 60
		line(startX, y, endX, y)
	}
}

const letters = ['M', 'O', 'V', 'E', 'M', 'E', 'N', 'T']
let letterPlaces = Array(letters.length).fill(0)
const logoPosX = 40
const logoPosY = 40
function drawLogo() {
	noStroke()
	fill(0)
	textSize(20)
	textStyle(BOLD);
	text('UN_APATHY', logoPosX, logoPosY)
	if (frameCount % 30 == 0) changeLogo()
	letters.forEach((letter, index) => {
		text(letter, letterPlaces[index].x, letterPlaces[index].y)
	})
}

function changeLogo() {
	const sw = textWidth('UN_APATHY    ')
	const lw = textWidth('M')
	for (let i = 0; i < letterPlaces.length; i++) {
		letterPlaces[i] = createVector(logoPosX + sw + i * lw + random(-5, 5), logoPosY + random(-10, 20))
	}
}



function plotGraph(y, graphPoints,txt) {
	const plotPos = createVector(width * 0.1, y)
	const plotSize = createVector(width * 0.25, height * 0.1)

	noStroke()
	textSize(14)
	textStyle(NORMAL);
	fill(255, 0, 255)
	text(txt, plotPos.x, plotPos.y - 7)
	noFill()
	stroke(255, 0, 255)
	rect(plotPos.x, plotPos.y, plotSize.x, plotSize.y)
	dottedLine(plotPos.x, plotSize.x, plotPos.y + (1 - NOSE_APATHY_THRESHOLD) * plotSize.y)
	beginShape()
	graphPoints.forEach((graphPoint, index) => {
		const x = plotPos.x + plotSize.x * (index / 29)
		const y = plotPos.y + plotSize.y * (1 - graphPoint)
		curveVertex(x, y)
	})
	endShape()
}