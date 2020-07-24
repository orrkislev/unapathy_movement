let graphPlotLength = 100
let RESPONSIVE_SMALL = 570
let GUTTER_SCALE = 0.045
let PLOT_CAPTURE_SCALE = 0.45
let ALIGN_TOP_SCALE = 0.2

let gutter
let plotCaptureScale, plotCaptureX,plotCaptureY
let plotGraphY_movement, plotGraphY_face, plotGraphY_gaze
let plotTotalsY

function initPlot() {
	gutter = width * GUTTER_SCALE
	if (motionCapture) {
		const plotCaptureWidth = width * PLOT_CAPTURE_SCALE
		plotCaptureScale = plotCaptureWidth / motionCapture.width
		const plotCaptureHeight = motionCapture.height * plotCaptureScale
		plotCaptureX = width - gutter - plotCaptureWidth
		plotCaptureY = height * ALIGN_TOP_SCALE

		plotGraphY_movement = plotCaptureY
		plotGraphY_face = plotCaptureY + gutter + 50
		plotGraphY_gaze = plotCaptureY + (gutter + 50) * 2

		plotTotalsY = plotTotalsY + plotCaptureHeight
	}
	$("#aboutContainer").css('top',gutter-3)
}

let plotSmall = false
function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	plotSmall = window.innerWidth < RESPONSIVE_SMALL
	initPlot()
}


let followMePos, followMeTarget
function plotFollowMe(){
	if (!followMePos) {
		followMePos = createVector(random(0,width), random(0,height))
		followMeTarget = createVector(random(0,width), random(0,height))
	}
	followMePos = p5.Vector.lerp(followMePos, followMeTarget, 0.1);
	if (p5.Vector.dist(followMePos, followMeTarget) < 10)
		followMeTarget = createVector(random(0,width), random(0,height))
	onlyFill()
	text('follow me', followMePos.x,followMePos.y)
}

let opticalFlow = true
function plotImage(isDone) {
	if (!plotSmall) {
		if (flow.flow) {
			onlyStroke()
			flow.flow.zones.forEach((zone, index) => {
				const x = plotCaptureX + zone.x * plotCaptureScale
				const y = plotCaptureY + zone.y * plotCaptureScale
				line(x, y, x + zone.u * 3, y + zone.v * 3)
			})
		}
	}
}

function dottedLine(x, w, y) {
	onlyStroke()
	for (let i = 0; i < 30; i++) {
		const startX = x + i * w / 30
		const endX = startX + w / 60
		line(startX, y, endX, y)
	}
}

const letters = ['M', 'O', 'V', 'E', 'M', 'E', 'N', 'T']
let letterPlaces = Array(letters.length).fill(0)

function drawLogo() {
	noStroke()
	fill(0)
	textAlign(LEFT, TOP);
	textSize(plotSmall ? 14 : 26)
	textStyle(BOLD);
	text('UN_APATHY', gutter, gutter)
	if (frameCount % 30 == 0) changeLogo()
	letters.forEach((letter, index) => {
		text(letter, letterPlaces[index].x, letterPlaces[index].y)
	})
}

function changeLogo() {
	const sw = textWidth('UN_APATHY    ')
	const lw = textWidth('M')
	for (let i = 0; i < letterPlaces.length; i++) {
		letterPlaces[i] = createVector(gutter + sw + i * lw + random(-5, 5), gutter + random(-10, 20))
	}
}

function plotGraph(graphY, graphPoints, txt, threshold, maxVal) {
	const plotSize = (plotSmall) ? createVector(width * 0.8, height * 0.1) : createVector(width * 0.25, height * 0.1)

	textSize(18)
	textStyle(NORMAL);
	textAlign(LEFT, BASELINE);
	onlyFill()
	text(txt, gutter, graphY - 2)
	onlyStroke()
	rect(gutter, graphY, plotSize.x, plotSize.y)
	dottedLine(gutter, plotSize.x, graphY + (1 - threshold / maxVal) * plotSize.y)
	beginShape()
	graphPoints.forEach((graphPoint, index) => {
		const x = gutter + plotSize.x * (index / (graphPlotLength - 1))
		const y = graphY + plotSize.y * (1 - graphPoint / maxVal)
		curveVertex(x, y)
	})
	endShape()
}

function plotTexts() {
	let screenString = "Total time in front of screen: "
	screenString += screenTime > 120 ? str(floor(screenTime / 60)) + " min" : str(floor(screenTime)) + " sec"
	let passiveString = "Total passive moments: "
	passiveString += apathyTime > 120 ? str(floor(apathyTime / 60)) + " min" : str(floor(apathyTime)) + " sec"
	textSize(21)
	textStyle(BOLD);
	textAlign(LEFT, BASELINE);
	onlyFill()
	text(screenString, gutter, plotTotalsY-30)
	text(passiveString, gutter, plotTotalsY)
}

let gazePlotPointSize = 15
let gazePlotPoint = [-30, -30]
function plotGazePoint() {
	onlyFill()
	circle(gazePlotPoint[0], gazePlotPoint[1], gazePlotPointSize);
}