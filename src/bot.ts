import { Bot } from "grammy";
import {ENV_CONFIG} from "./env/env.config.js";
import {BotHelper} from "./helpers/bot-helper.js";
//import {BotCommands} from "./helpers/bot-commands.js";


const _botHelper = BotHelper.builder();
//const botCommands = new BotCommands(botHelper);

export const bot = new Bot(ENV_CONFIG.BOT_TOKEN);
bot.on('channel_post:media', async (ctx, next) => {
    const originalText = ctx.channelPost?.caption ?? '';
    console.log('original text:', originalText ?? 'NO TEXT');
    const signText = 'Котики-Собачки';
    const fullText = signText + ' 🐈🐕';
    const url = 'https://t.me/catsplusdogs';
    const {caption, caption_entities} = _botHelper.getCaption(originalText, fullText, signText, url);

    if (originalText === caption) {
        console.log('no changes');
        return next();
    }

    return ctx.editMessageCaption({caption, caption_entities})
});

bot.on("message", async (ctx) => {
    await ctx.reply('This is a sign bot');
});
//bot.on('channel_post', botCommands.handleChannelMessage);
//bot.use(botCommands.otherMessagesHandler);



