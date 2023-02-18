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

export const CHANNEL_DETAILS_SCENE = new Scenes.BaseScene<MyContext>(SCENES_ID.CHANNEL_DETAILS_SCENE_ID);
let _botHelper: BotHelper;
let _channel: ChannelDetailsModel;

CHANNEL_DETAILS_SCENE.enter(async (ctx,) => {
    // @ts-ignore
    const id: string = ctx.scene.state[CHANNEL_ID];
    // @ts-ignore
    const model: ChannelModel = ctx.scene.state.model;

    _botHelper = BotHelper.builder();
    _channel = ChannelDetailsModel.builder(id, model);
    console.log('details', ctx.scene.state);

    const keyboard = DETAILS_KEYBOARD(_channel.isSignSet());

    return ctx.replyWithHTML(CHANNEL_DETAILS_MESSAGES.startMessage(_channel.title), keyboard);
});

CHANNEL_DETAILS_SCENE.hears(REPLACEMENT_REGEXP, async (ctx) => {
    _channel.setReplacement(ctx.match[1], ctx.match[2]);
    console.log('автозамініа:', _channel);
});

CHANNEL_DETAILS_SCENE.hears(TEXT_BUTTONS.TEXT_PREVIEW,
    async (ctx) => {
        const extra = _botHelper.getCaption(
            _channel.signText as string,
            _channel.replaceLeft as string,
            _channel.replaceRight as string
        );

        return ctx.reply(extra.caption, {entities: extra.caption_entities, /*...SAVE_KEYBOARD*/});
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

function _saveResultToSession(ctx: MyContext, channelDetails: ChannelDetailsModel): void {
    const {channelId, ...channel} = channelDetails;
    ctx.session.channels.set(String(channelId), channel)
}

/**
 * TODO:
 * 1. do case-insensitive replacement
 * 2. add message on success replacement save
 * 3. Rename channels preview to channels edit
 * 3.1 Stop reaction button on channel edit
 * 4. Add channel delete button
 */