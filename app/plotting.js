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
	initPlot()
}


let followMePos, followMeTarget, followMeMove=false
function plotFollowMe() {
	if (!followMePos) {
		followMePos = createVector(width/2,height/2)
		followMeTarget = followMePos
	}
	if (followMeMove) {	
		followMePos = p5.Vector.lerp(followMePos, followMeTarget, 0.2);
		if (p5.Vector.dist(followMePos, followMeTarget) < 20)
			followMeTarget = createVector(random(0, width), random(0, height))
	}
	onlyFill()
	textAlign(CENTER)
	text(follow_me_text1, followMePos.x, followMePos.y)
	text(follow_me_text2, width/2+textWidth(follow_me_text1+" ")/2 + textWidth(follow_me_text2+" ")/2, height/2)
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
	textSize(logo_text_size)
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

function plotTexts() {
	let screenString = total_time_text
	screenString += totalScreenTime > 120 ? str(floor(totalScreenTime / 60)) + " min" : str(floor(totalScreenTime)) + " sec"
	let passiveString = total_time_apathy_text
	passiveString += totalApathyTime > 120 ? str(floor(totalApathyTime / 60)) + " min" : str(floor(totalApathyTime)) + " sec"
	textSize(total_text_size)
	textStyle(BOLD);
	textAlign(LEFT, BASELINE);
	onlyFill()
	text(screenString, gutter, plotTotalsY - 30)
	text(passiveString, gutter, plotTotalsY)
}


let gazePlotPoint = [-30, -30]
function plotGazePoint() {
	onlyFill()
	circle(gazePlotPoint[0], gazePlotPoint[1], gaze_indicator_size);
}

function plotApathy() {
	noStroke()
	fill(255, 0, 255, 165)
	const apathyPercentage = apathyTime / (MINUTES_TO_VIDEO * 60)
	rect(0, height - height * apathyPercentage, width, height * apathyPercentage)
}