import { createCanvas, loadImage } from 'canvas'
import { drawFX, drawGraph, drawTerms, sendImage } from './utils.js'

export const task1 = async ({ message, context }) => {
	try {
		const table = message
			.split('\n')
			.map(item => item.split(':').map(item => Number(item)))

		const canvas = createCanvas(1500, 600)
		const contextCanvas = canvas.getContext('2d')
		contextCanvas.font = '16px Times new Roman'
		contextCanvas.lineWidth = 2
		let xPos = 50
		let yPos = 50

		drawGraph({
			contextCanvas,
			startGraphPosX: 900,
			startGraphPosY: 500,
			step: 40,
			table: table
		})

		const fx = []
		let fxSum = 0

		for (let index = 0; index < table.length; index++) {
			const element = table[index][0]

			if (index === 0) {
				fx.push(`${fxSum}, x ≤ ${element}`)
				fxSum += table[index][1]
			} else
				fx.push(
					`${fxSum.toFixed(4)}, ${
						table[index - 1][0]
					} < x ≤ ${element}`
				)

			if (index !== 0) fxSum += table[index][1]
		}
		fx.push(`${fxSum.toFixed(4)}, x > ${table[table.length - 1][0]}`)

		const heightFX = 16 * fx.length + 20 * fx.length

		contextCanvas.fillText('ƒ(x)=', xPos, heightFX / 2)
		contextCanvas.font = `${heightFX / 2}px Arial`
		contextCanvas.fillText('{', xPos + 40, heightFX / 2 + 16)
		contextCanvas.font = `16px Times new Roman`
		;[xPos, yPos] = drawFX({
			contextCanvas: contextCanvas,
			terms: fx,
			xPos: xPos + 80,
			yPos: yPos
		})

		xPos = 50

		const maxPi = Math.max(...table.map(item => item[1]))
		const middleIndex = Math.floor(table.length / 2)
		const MeXIndexes =
			table.length % 2 === 0
				? [table[middleIndex - 1], table[middleIndex]]
				: [table[middleIndex]]
		const MoXandMeX = `MoX=${
			table.find(item => item[1] === maxPi)[0]
		} MeX=${
			MeXIndexes.reduce((sum, item) => sum + item[0], 0) /
			MeXIndexes.length
		}`
		contextCanvas.fillText(MoXandMeX, xPos, yPos)

		const MXExpression = 'MX= '
		yPos += 30
		xPos = contextCanvas.measureText(MXExpression).width + 50

		const MX = table
			.reduce((sum, item) => sum + item[0] * item[1], 0)
			.toFixed(4)
		contextCanvas.fillText(MXExpression, 50, yPos)
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(item => `(${item[0]} * ${item[1]})`),
			xPos: xPos,
			yPos: yPos,
			expression: MXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(item => (item[0] * item[1]).toFixed(4)),
			xPos: xPos,
			yPos: yPos,
			expression: MXExpression
		})
		contextCanvas.fillText(MX, xPos, yPos)

		const DXExpression = 'DX= '
		let DX = table
			.reduce((sum, item) => sum + item[0] ** 2 * item[1], 0)
			.toFixed(4)
		xPos = 50 + contextCanvas.measureText(DXExpression).width
		yPos += 30

		contextCanvas.fillText(DXExpression, 50, yPos)
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(item => `((${item[0]} ^ 2) * ${item[1]})`),
			xPos: xPos,
			yPos: yPos,
			expression: DXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(
				item => `(${(item[0] ** 2).toFixed(4)} * ${item[1]})`
			),
			xPos: xPos,
			yPos: yPos,
			expression: DXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(item =>
				((item[0] ** 2).toFixed(4) * item[1]).toFixed(4)
			),
			xPos: xPos,
			yPos: yPos,
			expression: DXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: [`${DX} - ${MX} ^ 2`],
			xPos: xPos,
			yPos: yPos,
			expression: DXExpression
		})
		DX = (DX - MX ** 2).toFixed(4)
		contextCanvas.fillText(DX, xPos, yPos)
		xPos = 50
		yPos += 20

		const stdDev = Math.sqrt(DX).toFixed(4)
		contextCanvas.fillText(`σ=√${DX}=${stdDev}`, xPos, yPos)

		const AXExpression = 'A= '
		let AX = table
			.reduce((sum, item) => sum + (item[0] - MX) ** 3 * item[1], 0)
			.toFixed(4)
		xPos = 50 + contextCanvas.measureText(AXExpression).width
		yPos += 30
		contextCanvas.fillText(AXExpression, 50, yPos)
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(
				item => `(((${item[0]} - ${MX}) ^ 3) * ${item[1]})`
			),
			xPos: xPos,
			yPos: yPos,
			expression: AXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(
				item => `((${(item[0] - MX).toFixed(4)} ^ 3) * ${item[1]})`
			),
			xPos: xPos,
			yPos: yPos,
			expression: AXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(
				item => `(((${((item[0] - MX) ** 3).toFixed(4)} * ${item[1]})`
			),
			xPos: xPos,
			yPos: yPos,
			expression: AXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(item =>
				((item[0] - MX) ** 3 * item[1]).toFixed(4)
			),
			xPos: xPos,
			yPos: yPos,
			expression: AXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: [`${AX}/${stdDev} ^ 3`],
			xPos: xPos,
			yPos: yPos,
			expression: AXExpression
		})
		AX = (AX / stdDev ** 3).toFixed(4)
		contextCanvas.fillText(AX, xPos, yPos)

		const EXExpression = 'E= '
		let EX = table
			.reduce((sum, item) => sum + (item[0] - MX) ** 4 * item[1], 0)
			.toFixed(4)
		xPos = 50 + contextCanvas.measureText(EXExpression).width
		yPos += 30
		contextCanvas.fillText(EXExpression, 50, yPos)
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(
				item => `(((${item[0]} - ${MX}) ^ 4) * ${item[1]})`
			),
			xPos: xPos,
			yPos: yPos,
			expression: EXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(
				item => `((${(item[0] - MX).toFixed(4)} ^ 4) * ${item[1]})`
			),
			xPos: xPos,
			yPos: yPos,
			expression: EXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(
				item => `(((${((item[0] - MX) ** 4).toFixed(4)} * ${item[1]})`
			),
			xPos: xPos,
			yPos: yPos,
			expression: EXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: table.map(item =>
				((item[0] - MX) ** 4 * item[1]).toFixed(4)
			),
			xPos: xPos,
			yPos: yPos,
			expression: EXExpression
		})
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: [`${EX}/${stdDev} ^ 4`],
			xPos: xPos,
			yPos: yPos,
			expression: EXExpression
		})
		EX = (EX / stdDev ** 4).toFixed(4)
		;[xPos, yPos] = drawTerms({
			canvas: canvas,
			contextCanvas: contextCanvas,
			terms: [`${EX} - 3`],
			xPos: xPos,
			yPos: yPos,
			expression: EXExpression
		})
		EX = (EX - 3).toFixed(4)
		contextCanvas.fillText(EX, xPos, yPos)

		return await sendImage(context, canvas)
	} catch (error) {
		console.error(error)
		context.reply('Ошибка ввода!')
	}
}
