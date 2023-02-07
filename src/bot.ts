import {Scenes, session, Telegraf} from 'telegraf';
import {BotHelper} from "./helpers/bot-helper.js";
import {ENV_CONFIG} from "./env/env.config.js";
import {BotCommands} from "./helpers/bot-commands.js";
import {MyContext} from "./session/index.js";
import {CHANNEL_DETAILS_SCENE} from "./scenes/channel-details/channel-details.scene.js";
import {MAIN_BUTTONS} from "./scenes/main/main.keyboard.js";
import {CHANNEL_ADD_SCENE} from "./scenes/channel-add/channel-add.scene.js";

const botHelper = BotHelper.builder();
const botCommands = new BotCommands(botHelper);
const stage = new Scenes.Stage<MyContext>([
    CHANNEL_ADD_SCENE,
    CHANNEL_DETAILS_SCENE
]);

export const bot = new Telegraf<MyContext>(ENV_CONFIG.BOT_TOKEN);

bot.use(session());
bot.use(stage.middleware());
bot.start(botCommands.onStart);
bot.use(botCommands.initSession);
bot.on('channel_post', botCommands.handleChannelMessage);
bot.hears(MAIN_BUTTONS.ADD_CHANNEL, botCommands.gotoAddChannelScene);
bot.hears(MAIN_BUTTONS.VIEW_CHANNELS, botCommands.viewChannels);
bot.action(/channelId=(.+)/gm, botCommands.editChannel)
bot.use(botCommands.otherMessagesHandler);



