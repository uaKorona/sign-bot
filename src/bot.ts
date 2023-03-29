import { Bot } from 'grammy'
import { ENV_CONFIG } from './env/env.config.js'
import { BotHelper } from './helpers/bot-helper.js'
// import {BotCommands} from "./helpers/bot-commands.js";

const _botHelper = BotHelper.builder()
// const botCommands = new BotCommands(botHelper);

export const bot = new Bot(ENV_CONFIG.BOT_TOKEN)
bot.on('channel_post:media', async (ctx, next) => {
  const originalText = ctx.channelPost?.caption ?? ''
  const markup = ctx.channelPost?.reply_markup
  console.log('original text:', originalText ?? 'NO TEXT')
  const signText = 'Котики-Собачки'
  const fullText = signText + ' 🐈🐕'
  const url = 'https://t.me/catsplusdogs'
  const { caption, caption_entities } = _botHelper.getCaption(originalText, fullText, signText, url)

  if (originalText === caption) {
    console.log('no changes')
    await next(); return
  }

  try {
    await ctx.editMessageCaption({ caption, caption_entities })
  } catch (e) {
    console.log('-=== ERROR:', e, 'caption:', caption, 'caption_entities:', caption_entities)
  }
})

bot.on('message', async (ctx, next) => {
  await ctx.reply('This is a sign bot')

  next()
})
// bot.on('channel_post', botCommands.handleChannelMessage);
// bot.use(botCommands.otherMessagesHandler);
