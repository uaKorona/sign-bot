import {Telegraf} from 'telegraf';
import {BotHelper} from "./helpers/bot-helper.js";
import {ENV_CONFIG} from "./env/env.config.js";
import {BotCommands} from "./helpers/bot-commands.js";
import {MyContext} from "./session/index.js";

const botHelper = BotHelper.builder();
const botCommands = new BotCommands(botHelper);
export const bot = new Telegraf<MyContext>(ENV_CONFIG.BOT_TOKEN);

bot.on('channel_post', botCommands.handleChannelMessage);



