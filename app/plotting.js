let RESPONSIVE_SMALL = 570

let plotSmall = false
function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight);
	plotSmall = window.innerWidth < RESPONSIVE_SMALL
}

let opticalFlow = true
function plotImage() {
	if (!plotSmall) {
		if (opticalFlow) {
			if (flow.flow) {
				const imageScaling = width * 0.4 / motionCapture.width
				onlyStroke()
				flow.flow.zones.forEach((zone, index) => {
					const x = width * 0.4 - zone.x * imageScaling + width * 0.5
					const y = zone.y * imageScaling + height * 0.2
					line(x, y, x + zone.u * 3, y + zone.v * 3)
				})
			}
		} else {
			image(motionCapture, width * 0.5, height * 0.2, width * 0.4, motionCapture.height * (width * 0.4 / motionCapture.width))
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
const logoPosX = 40
const logoPosY = 40
function drawLogo() {
	noStroke()
	fill(0)
	textSize(plotSmall ? 14 : 20)
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



function plotGraph(y, graphPoints, txt, threshold) {
	const plotPos =  createVector(width * 0.1, y)
	const plotSize = (plotSmall) ? createVector(width * 0.8, height * 0.1) : createVector(width * 0.25, height * 0.1)

	textSize(14)
	textStyle(NORMAL);
	onlyFill()
	text(txt, plotPos.x, plotPos.y - 7)
	onlyStroke()
	rect(plotPos.x, plotPos.y, plotSize.x, plotSize.y)
	dottedLine(plotPos.x, plotSize.x, plotPos.y + (1 - threshold) * plotSize.y)
	beginShape()
	graphPoints.forEach((graphPoint, index) => {
		const x = plotPos.x + plotSize.x * (index / 29)
		const y = plotPos.y + plotSize.y * (1 - graphPoint)
		curveVertex(x, y)
	})
	endShape()
}

function plotTexts() {
	const currTime = new Date()
	const totalTime = (currTime - startTime) / 1000
	let totalString = "Total time in front of screen: "
	totalString += totalTime > 120 ? str(floor(totalTime / 60)) + " min" : str(floor(totalTime)) + " sec"
	let passiveString = "Total passive moments: "
	passiveString += apathyLevel > 120 ? str(floor(apathyLevel / 60)) + " min" : str(floor(apathyLevel)) + " sec"
	textSize(17)
	textStyle(BOLD);
	onlyFill()
	text(totalString, width * 0.1, height * 0.65)
	text(passiveString, width * 0.1, height * 0.65 + 20)
}