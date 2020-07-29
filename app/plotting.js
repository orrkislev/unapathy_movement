let RESPONSIVE_SMALL = 1000
let GUTTER_SCALE = 0.035
let PLOT_CAPTURE_SCALE = 0.45
let ALIGN_TOP_SCALE = 0.2

let gutter
let plotCaptureScale, plotCaptureX, plotCaptureY
let plotTotalsY

function initPlot() {
	gutter = width * GUTTER_SCALE
	if (motionCapture) {
		const plotCaptureWidth = width * PLOT_CAPTURE_SCALE
		plotCaptureScale = plotCaptureWidth / motionCapture.width
		const plotCaptureHeight = motionCapture.height * plotCaptureScale
		plotCaptureX = (done) ? gutter : width - gutter - plotCaptureWidth
		plotCaptureY = height * ALIGN_TOP_SCALE

		if (!plotSmall) {
			moveGraph.plotY = plotCaptureY
			faceGraph.plotY = plotCaptureY + plotCaptureHeight * 0.25
			gazeGraph.plotY = plotCaptureY + plotCaptureHeight * 0.5
			plotTotalsY = plotCaptureY + plotCaptureHeight
		} else {
			moveGraph.plotY = plotCaptureY
			faceGraph.plotY = plotGraphY_movement + height * 0.15
			gazeGraph.plotY = plotGraphY_face + height * 0.15
			plotTotalsY = height - gutter
		}
	}
	$("#aboutContainer").css('top', gutter - 3)
}

let plotSmall = false
function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	plotSmall = window.innerWidth < RESPONSIVE_SMALL
	// $("#aboutBtn").css('font-size',plotSmall ? '0.6em' : '1.5em')
	initPlot()
}


let followMePos, followMeTarget, followMeMove=false
function plotFollowMe() {
	if (!followMePos) {
		followMePos = createVector(random(0, width), random(0, height))
		followMeTarget = createVector(random(0, width), random(0, height))
	}
	if (followMeMove) {	
		followMePos = p5.Vector.lerp(followMePos, followMeTarget, 0.1);
		if (p5.Vector.dist(followMePos, followMeTarget) < 20)
			followMeTarget = createVector(random(0, width), random(0, height))
	}
	onlyFill()
	text('follow me', followMePos.x, followMePos.y)
}

let opticalFlow = true
function plotImage() {
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
	// textSize(plotSmall ? 14 : 26)
	textSize(26)
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

function plotGraph(graphY, graphPoints, txt, maxVal, threshold) {
	const plotSize = (plotSmall) ? createVector(width * 0.8, height * 0.1) : createVector(width * 0.25, height * 0.1)
	const sum = graphPoints.reduce((a, b) => a + b, 0);
	const avg = (sum / graphPoints.length) || 0;
	// maxVal = Math.max(threshold*3, avg*3) /// experimental 
	textSize(18)
	textStyle(NORMAL);
	textAlign(LEFT, BASELINE);
	onlyFill()
	text(txt, gutter, graphY - 5)
	onlyStroke()
	rect(gutter, graphY, plotSize.x, plotSize.y)
	onlyStroke()
	// dottedLine(gutter, plotSize.x, graphY + plotSize.y * (1 - avg / maxVal))
	line(gutter,graphY + plotSize.y * (1 - avg / maxVal),gutter+plotSize.x,graphY + plotSize.y * (1 - avg / maxVal))
	stroke(255,0,255,100)
	dottedLine(gutter, plotSize.x, graphY + plotSize.y * (1 - threshold / maxVal))
	onlyStroke()
	beginShape()
	for (i = 0; i < graphPlotLength; i++) {
		const x = gutter + plotSize.x * (i / (graphPlotLength - 1))
		// const y = graphY + plotSize.y * (1 - graphPoints[graphPoints.length - graphPlotLength + i] / maxVal)
		const y = graphY + plotSize.y * (1 - Math.min(graphPoints[graphPoints.length - graphPlotLength + i],maxVal) / maxVal) // experimental
		curveVertex(x, y)
	}
	// graphPoints.forEach((graphPoint, index) => {
	// 	const x = gutter + plotSize.x * (index / (graphPlotLength - 1))
	// 	const y = graphY + plotSize.y * (1 - graphPoint / maxVal)
	// 	curveVertex(x, y)
	// })
	endShape()
}

function plotTexts() {
	let screenString = "Total time in front of screen: "
	screenString += totalScreenTime > 120 ? str(floor(totalScreenTime / 60)) + " min" : str(floor(totalScreenTime)) + " sec"
	let passiveString = "Total passive moments: "
	passiveString += totalApathyTime > 120 ? str(floor(totalApathyTime / 60)) + " min" : str(floor(totalApathyTime)) + " sec"
	textSize(21)
	textStyle(BOLD);
	textAlign(LEFT, BASELINE);
	onlyFill()
	text(screenString, gutter, plotTotalsY - 30)
	text(passiveString, gutter, plotTotalsY)
}

let gazePlotPointSize = 15
let gazePlotPoint = [-30, -30]
function plotGazePoint() {
	onlyFill()
	circle(gazePlotPoint[0], gazePlotPoint[1], gazePlotPointSize);
}

function plotApathy() {
	noStroke()
	fill(255, 0, 255, 165)
	const apathyPercentage = apathyTime / (MINUTES_TO_VIDEO * 60)
	rect(0, height - height * apathyPercentage, width, height * apathyPercentage)
}