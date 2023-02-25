import {Scenes} from 'telegraf';
import {MyContext} from "../../session/index.js";
import {SCENES_ID} from "../index.js";
import {BotHelper} from "../../helpers/bot-helper.js";
import {CHANNEL_ADD_MESSAGES} from "./channel-add.messeges.js";
import {DEFAULT_ADD_CHANNEL_KEYBOARD, SAVE_ADD_CHANNEL_KEYBOARD, TEXT_BUTTONS} from "./channel-add.keyboard.js";
import {MessageTypes} from "../../message-types.enum.js";
import {CHANNEL_REGEXP} from "./channel-add.consts.js";
import {ChatFromGetChat} from "typegram/manage.js";
import {ChannelAddModel} from "./channel-add.model.js";

export const CHANNEL_ADD_SCENE = new Scenes.BaseScene<MyContext>(SCENES_ID.CHANNEL_ADD_SCENE_ID);
let _botHelper: BotHelper;
let _channel: ChannelAddModel;

CHANNEL_ADD_SCENE.enter(async (ctx) => {
    _botHelper = BotHelper.builder();
    _channel = ChannelAddModel.builder();

    return _initScene(ctx);
});

CHANNEL_ADD_SCENE.hears(CHANNEL_REGEXP, async (ctx) => {
    const channelRegExp = new RegExp(CHANNEL_REGEXP);
    const matches = [...ctx.message.text.matchAll(channelRegExp)][0];
    const channelName = Array.isArray(matches) ? matches[2] : '';

    if (!channelName) {
        return ctx.reply(CHANNEL_ADD_MESSAGES.chatGetFail(ctx.message.text))
    }

    return ctx.telegram.getChat(`@${channelName}`)
        .then((chat: ChatFromGetChat) => {
            // @ts-ignore
            const {id, title} = chat;
            _channel.setParams(id, title);

            return ctx.reply(CHANNEL_ADD_MESSAGES.channelGetSuccess(title), SAVE_ADD_CHANNEL_KEYBOARD);
        })
        .catch(() => ctx.reply(CHANNEL_ADD_MESSAGES.chatGetFail(ctx.message.text), DEFAULT_ADD_CHANNEL_KEYBOARD));
});

CHANNEL_ADD_SCENE.hears(TEXT_BUTTONS.TEXT_NEXT, async (ctx, next: () => Promise<void>) => {
    _saveResultToSession(ctx, _channel);

    return next();
});

CHANNEL_ADD_SCENE.on(MessageTypes.text, async (ctx, next) => {
    const {text} = ctx.message;

    switch (text) {
        case TEXT_BUTTONS.TEXT_NEXT:
        case TEXT_BUTTONS.TEXT_CANCEL:
        {
            await ctx.scene.leave();

            return _botHelper.nextWithEmptyText(ctx, next);
        }

        default:
            return _initScene(ctx);
    }

});

function _initScene(ctx: MyContext) {
    const extra = {
        ...DEFAULT_ADD_CHANNEL_KEYBOARD,
        disable_web_page_preview: true
    }

    return ctx.replyWithHTML(CHANNEL_ADD_MESSAGES.startMessage(), extra);
}

function _saveResultToSession(ctx: MyContext, channel: ChannelAddModel): void {
    const id = String(channel.channelId);
    if (ctx.session.channels.get(id)) {
        console.warn('channel has already added');
        return;
    }

    ctx.session.channels.set(id, {title: channel.channelTitle });
}