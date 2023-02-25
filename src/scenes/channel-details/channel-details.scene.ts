import {Scenes} from 'telegraf';
import {DETAILS_KEYBOARD, SAVE_KEYBOARD, TEXT_BUTTONS} from "./channel-details.keyboard.js";
import {ChannelModel, MyContext} from "../../session/index.js";
import {CHANNEL_DETAILS_MESSAGES} from "./channel-details.messeges.js";
import {MessageTypes} from "../../message-types.enum.js";
import {SCENES_ID} from "../index.js";
import {BotHelper} from "../../helpers/bot-helper.js";
import {ChannelDetailsModel} from "./channel-details.model.js";
import {CHANNEL_ID} from "../../consts/channel.consts.js";
import {REPLACEMENT_REGEXP} from "./channel-details.consts.js";
import { Markup } from 'telegraf/typings/telegram-types.js';
import { ReplyKeyboardMarkup } from 'typegram';

export const CHANNEL_DETAILS_SCENE = new Scenes.BaseScene<MyContext>(SCENES_ID.CHANNEL_DETAILS_SCENE_ID);
let _botHelper: BotHelper;
let _channel: ChannelDetailsModel;

CHANNEL_DETAILS_SCENE.enter(async (ctx,) => {
    return _initScene(ctx);
});

CHANNEL_DETAILS_SCENE.hears(REPLACEMENT_REGEXP, async (ctx) => {
    _channel.setReplacement(ctx.match[1], ctx.match[2]);
    return ctx.reply(CHANNEL_DETAILS_MESSAGES.replacementSuccess(), SAVE_KEYBOARD);
});

CHANNEL_DETAILS_SCENE.hears(TEXT_BUTTONS.TEXT_PREVIEW,
    async (ctx) => {
        return getSignPreview(
            ctx,
            _channel.signText as string,
            _channel.replaceLeft,
            _channel.replaceRight
        );
    });

CHANNEL_DETAILS_SCENE.hears(TEXT_BUTTONS.TEXT_REPLACEMENT, async (ctx) => {
    const extra = {
        ...SAVE_KEYBOARD,
        disable_web_page_preview: true
    }

    return ctx.replyWithHTML(CHANNEL_DETAILS_MESSAGES.replacementExample(), extra);
});

CHANNEL_DETAILS_SCENE.hears(TEXT_BUTTONS.TEXT_NEXT,
    async (ctx, next: () => Promise<void>) => {
        _saveResultToSession(ctx, _channel);

        return next();
    });

CHANNEL_DETAILS_SCENE.on(MessageTypes.text, async (ctx, next) => {
    const {text} = ctx.message;

    switch (text) {
        case TEXT_BUTTONS.TEXT_NEXT:
        case TEXT_BUTTONS.TEXT_CANCEL: {
            console.log('leave CHANNEL_DETAILS_SCENE')
            await ctx.scene.leave();

            return _botHelper.nextWithEmptyText(ctx, next);
        }

        default:
            _channel.setSign(text);

            return ctx.replyWithHTML(CHANNEL_DETAILS_MESSAGES.signChange(), SAVE_KEYBOARD);
    }

});

function getSignPreview(ctx: MyContext, signText: string, replaceLeft: string | undefined, replaceRight: string | undefined, keyboard?:  Markup<ReplyKeyboardMarkup>) {
    const captionData = _botHelper.getCaption(signText, replaceLeft, replaceRight);
    let extra = {
        entities: captionData.caption_entities,
        disable_web_page_preview: true
    };

    if (keyboard) {
        extra = {...extra, ...keyboard};
    }

    return ctx.reply(captionData.caption, extra);
}

function _initScene(ctx: MyContext) {
    // @ts-ignore
    const id: string = ctx.scene.state[CHANNEL_ID];
    // @ts-ignore
    const model: ChannelModel = ctx.scene.state.model;

    _botHelper = BotHelper.builder();
    _channel = ChannelDetailsModel.builder(id, model);

    const isSignSet = _channel.isSignSet();
    const keyboard = DETAILS_KEYBOARD(isSignSet);

    if (!isSignSet) {
        const text = CHANNEL_DETAILS_MESSAGES.startNewMessage(_channel.title);

        return ctx.reply(text, keyboard);
    }

    const updateMessage = CHANNEL_DETAILS_MESSAGES.startUpdateMessage(_channel.title);
    const fullMessage = updateMessage + _channel.signText;

    return getSignPreview(ctx, fullMessage, _channel.replaceLeft, _channel.replaceRight, keyboard);
}

function _saveResultToSession(ctx: MyContext, channelDetails: ChannelDetailsModel): void {
    const {channelId, ...channel} = channelDetails;
    ctx.session.channels.set(String(channelId), channel)
}

/**
 * TODO:
 * 4. Add channel delete button
 * 5. Add second message for channel edit
 */