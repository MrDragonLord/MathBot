import fs from 'fs'

export const sendImage = async (context, canvas) => {
	const image = canvas.toBuffer('image/png')
	const imageName = `${context.message.from.id}.${new Date().getTime()}.png`

	fs.writeFileSync(imageName, image)

	await context.replyWithPhoto({
		source: imageName
	})

	fs.unlinkSync(imageName)

	return context.scene.leave()
}

const plusSymbol = '+'
const equallySymbol = '='

export const drawTerms = ({
	canvas,
	contextCanvas,
	terms,
	xPos,
	yPos,
	expression
}) => {
	const plusSymbolWidth = contextCanvas.measureText(plusSymbol).width
	const equallySymbolWidth = contextCanvas.measureText(equallySymbol).width

	for (let index = 0; index < terms.length; index++) {
		const term = terms[index]
		const textWidth = contextCanvas.measureText(term).width

		if (xPos + textWidth > 800) {
			xPos = 50 + contextCanvas.measureText(expression).width
			yPos += 25
		}

		contextCanvas.fillText(term, xPos, yPos)
		xPos += textWidth

		if (index < terms.length - 1) {
			if (xPos + plusSymbolWidth > 800) {
				xPos = 50 + contextCanvas.measureText(expression).width
				yPos += 25
			}

			contextCanvas.fillText(plusSymbol, xPos, yPos)
			xPos += plusSymbolWidth
		}

		if (index === terms.length - 1 || (terms.length === 1 && index === 0)) {
			if (xPos + equallySymbolWidth > canvas.width - 20) {
				xPos = 50 + contextCanvas.measureText(expression).width
				yPos += 25
			}

			contextCanvas.fillText(equallySymbol, xPos, yPos)
			xPos += equallySymbolWidth
		}
	}

	return [xPos, yPos]
}

export const drawFX = ({ contextCanvas, terms, xPos, yPos }) => {
	for (let index = 0; index < terms.length; index++) {
		const term = terms[index]

		contextCanvas.fillText(term, xPos, yPos)
		yPos += 20
	}

	return [xPos, yPos]
}

const drawArrow = ({ contextCanvas, x, y, arrowLength }) => {
	const endX = x + arrowLength

	contextCanvas.beginPath()
	contextCanvas.moveTo(x, y)
	contextCanvas.lineTo(endX, y + 5)
	contextCanvas.stroke()

	contextCanvas.beginPath()
	contextCanvas.moveTo(x, y)
	contextCanvas.lineTo(endX, y - 5)
	contextCanvas.stroke()
}

const drawInvertArrow = ({ contextCanvas, x, y, arrowLength }) => {
	const endX = x - arrowLength

	contextCanvas.beginPath()
	contextCanvas.moveTo(x, y)
	contextCanvas.lineTo(endX, y - 5)
	contextCanvas.stroke()

	contextCanvas.beginPath()
	contextCanvas.moveTo(x, y)
	contextCanvas.lineTo(endX, y + 5)
	contextCanvas.stroke()
}

const drawVertArrow = ({ contextCanvas, x, y, arrowLength }) => {
	const endY = y + arrowLength

	contextCanvas.beginPath()
	contextCanvas.moveTo(x, y)
	contextCanvas.lineTo(x + 5, endY)
	contextCanvas.stroke()

	contextCanvas.beginPath()
	contextCanvas.moveTo(x, y)
	contextCanvas.lineTo(x - 5, endY)
	contextCanvas.stroke()
}

export const drawGraph = ({
	contextCanvas,
	startGraphPosX,
	startGraphPosY,
	step,
	table
}) => {
	let graphPosX = startGraphPosX
	let graphPosY = startGraphPosY
	let fxSum = 0
	let nonNegativePos = 0
	let nonNegativeState = false

	for (let index = 0; index < table.length; index++) {
		const element = table[index][0]

		contextCanvas.lineWidth = 4
		contextCanvas.beginPath()
		contextCanvas.moveTo(graphPosX, graphPosY)
		contextCanvas.lineTo(graphPosX + step * 2, graphPosY)
		contextCanvas.stroke()

		contextCanvas.lineWidth = 2

		drawArrow({
			contextCanvas: contextCanvas,
			x: graphPosX,
			y: graphPosY,
			arrowLength: 10
		})

		graphPosX += step * 2
		graphPosY -= step * 2

		contextCanvas.fillText(element, graphPosX, startGraphPosY + step)

		if (element > 0 && !nonNegativeState && index !== 0) {
			nonNegativeState = true

			nonNegativePos = graphPosX - step
		} else if (element > 0 && !nonNegativeState) {
			nonNegativeState = true

			nonNegativePos = startGraphPosX
		}

		contextCanvas.setLineDash([5, 3])

		contextCanvas.beginPath()
		contextCanvas.moveTo(graphPosX, graphPosY)
		contextCanvas.lineTo(graphPosX, startGraphPosY)
		contextCanvas.stroke()

		contextCanvas.setLineDash([0, 0])

		if (index === 0) {
			fxSum += table[index][1]
		} else if (index === table.length - 1) {
			contextCanvas.beginPath()
			contextCanvas.moveTo(startGraphPosX, startGraphPosY)
			contextCanvas.lineTo(graphPosX + step * 2 + 20, startGraphPosY)
			contextCanvas.stroke()

			drawInvertArrow({
				contextCanvas: contextCanvas,
				x: graphPosX + step * 2 + 20,
				y: startGraphPosY,
				arrowLength: 10
			})
			contextCanvas.fillText(
				'x',
				graphPosX + 20 + step * 2,
				startGraphPosY + 10
			)

			contextCanvas.beginPath()
			contextCanvas.moveTo(nonNegativePos, startGraphPosY)
			contextCanvas.lineTo(nonNegativePos, graphPosY + 20 - step * 2)
			contextCanvas.stroke()

			drawVertArrow({
				contextCanvas: contextCanvas,
				x: nonNegativePos,
				y: graphPosY + 20 - step * 2,
				arrowLength: 10
			})
			contextCanvas.fillText(
				'F(X)',
				nonNegativePos + 10,
				graphPosY + 30 - step * 2
			)
			contextCanvas.fillText('0', nonNegativePos, startGraphPosY + step)
		}
	}

	contextCanvas.lineWidth = 4
	contextCanvas.beginPath()
	contextCanvas.moveTo(graphPosX, graphPosY)
	contextCanvas.lineTo(graphPosX + step * 2, graphPosY)
	contextCanvas.stroke()

	contextCanvas.lineWidth = 2

	drawArrow({
		contextCanvas: contextCanvas,
		x: graphPosX,
		y: graphPosY,
		arrowLength: 10
	})

	fxSum = 0
	graphPosY = startGraphPosY - step * 2

	for (let index = 0; index < table.length; index++) {
		fxSum += table[index][1]
		contextCanvas.fillText(fxSum, nonNegativePos - step * 2, graphPosY)
		graphPosY -= step * 2
	}
}

export const drawIntegral = ({ contextCanvas, up, down, xPos, yPos }) => {
	contextCanvas.fillText('∫', xPos, yPos)
	contextCanvas.fillText(up, xPos, yPos + 18)
	contextCanvas.fillText(down, xPos, yPos - 18)
}

export const drawFraction = ({
	contextCanvas,
	fractionUp,
	fractionDown,
	x,
	y
}) => {
	contextCanvas.fillText(fractionUp, x, y - 10)

	const length = contextCanvas.measureText(
		Math.max(fractionDown.length, fractionDown.length).toString()
	).width

	contextCanvas.beginPath()
	contextCanvas.moveTo(x, y)
	contextCanvas.lineTo(x + length + 10, y)
	contextCanvas.stroke()

	contextCanvas.fillText(fractionDown, x, y + 20)
}
