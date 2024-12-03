import { Composer, Markup, Scenes } from 'telegraf'
import { task1 } from './task1.js'
import { task2 } from './task2.js'

const regex = new RegExp(/Задание (.+)/i)

const tasks = {
	task1: 'ДСВ',
	task2: 'НСВ'
}

export const botContent = bot => {
	bot.start(ctx =>
		ctx.reply(
			'Добро пожаловать',
			Markup.keyboard([
				[`Задание ${tasks.task1}`, `Задание ${tasks.task2}`]
			]).resize()
		)
	)

	bot.hears(regex, context => context.scene.enter('math'))
}

const mathHandlerFirst = new Composer()

mathHandlerFirst.hears(regex, async context => {
	context.wizard.state.message = context.match[1]
	await context.reply(`Введите текст задания ${context.match[1]}`)

	return context.wizard.next()
})

const mathHandlerSecond = new Composer()

mathHandlerSecond.on('text', async context => {
	const textTask = context.wizard.state.message
	if (textTask === tasks.task1)
		return await task1({
			context: context,
			message: context.message.text
		})
	else if (textTask === tasks.task2)
		return await task2({
			context: context,
			message: context.message.text
		})

	context.wizard.leave()
	return await context.reply('Ошибка ввода')
})

export const mathScene = new Scenes.WizardScene(
	'math',
	mathHandlerFirst,
	mathHandlerSecond
)
