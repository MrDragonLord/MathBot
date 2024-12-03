import { createCanvas, loadImage } from 'canvas'
import {
	drawFX,
	drawFraction,
	drawGraph,
	drawIntegral,
	drawTerms,
	sendImage
} from './utils.js'

export const task2 = async ({ message, context }) => {
	try {
		const [line1, line2] = message.split('\n').map(item => {
			const items = item.split(':')
			return {
				equation: items[0],
				limits: { up: items[1], down: items[2] }
			}
		})

		const canvas = createCanvas(1500, 600)
		const contextCanvas = canvas.getContext('2d')
		contextCanvas.font = '16px Times new Roman'
		contextCanvas.lineWidth = 2
		let xPos = 50
		let yPos = 50

		const AXExpression = 'A= '
		contextCanvas.fillText(AXExpression, 50, yPos)
		xPos += contextCanvas.measureText(AXExpression).width
		drawIntegral({
			contextCanvas,
			up: line1.limits.up,
			down: line1.limits.down,
			xPos: xPos,
			yPos: yPos
		})
		xPos += 10
		const fraction = line1.equation.substring(
			line1.equation.indexOf('(') + 1,
			line1.equation.indexOf(')')
		)
		const [fractionUp, fractionDown] = fraction.split('/')

		drawFraction({
			contextCanvas: contextCanvas,
			fractionUp: fractionUp,
			fractionDown: fractionDown,
			x: xPos,
			y: yPos
		})

		xPos += contextCanvas.measureText(fraction).width
		const equationString = `${line1.equation.substr(
			fraction.length + 2
		)} dx=`
		contextCanvas.fillText(equationString, xPos, yPos)
		xPos += contextCanvas.measureText(equationString).width

		//TODO

		return await sendImage(context, canvas)
	} catch (error) {
		console.error(error)
		context.reply('Ошибка ввода!')
	}
}
