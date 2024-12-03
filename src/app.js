import { Telegraf, Scenes, session } from 'telegraf'

import * as dotenv from 'dotenv'
import { botContent, mathScene } from './bot.js'

dotenv.config()

export const bot = new Telegraf(process.env.BOT_KEY)

const stage = new Scenes.Stage([mathScene], {
	ttl: 600
})

bot.use(session(), stage.middleware())

bot.use(botContent(bot))

bot.launch()
