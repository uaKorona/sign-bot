import {Scenes} from 'telegraf';
import {DETAILS_EMPTY_KEYBOARD, TEXT_BUTTONS} from "./channel-details.keyboard.js";
import {ChannelModel, MyContext} from "../../session/index.js";
import {CHANNEL_DETAILS_MESSAGES} from "./channel-details.messeges.js";
import {MessageTypes} from "../../message-types.enum.js";
import {SCENES_ID} from "../index.js";
import {BotHelper} from "../../helpers/bot-helper.js";
import {ChannelDetailsModel} from "./channel-details.model.js";
import {CHANNEL_ID} from "../../consts/channel.consts.js";

export const CHANNEL_DETAILS_SCENE = new Scenes.BaseScene<MyContext>(SCENES_ID.CHANNEL_DETAILS_SCENE_ID);
let _botHelper: BotHelper;
let _channel: ChannelDetailsModel;

CHANNEL_DETAILS_SCENE.enter(async (ctx, ) => {
    // @ts-ignore
    const id: string = ctx.scene.state[CHANNEL_ID];
    // @ts-ignore
    const model: ChannelModel = ctx.scene.state.model;

    _botHelper = BotHelper.builder();
    _channel = ChannelDetailsModel.builder(id, model );
    console.log('details', ctx.scene.state)

    return ctx.replyWithHTML(CHANNEL_DETAILS_MESSAGES.startMessage(_channel.title), DETAILS_EMPTY_KEYBOARD)
});



CHANNEL_DETAILS_SCENE.on("message", async (ctx, next) => {
    if (TEXT_BUTTONS.TEXT_NEXT || TEXT_BUTTONS.TEXT_CANCEL) {
        await ctx.scene.leave();

        return _botHelper.nextWithEmptyText(ctx, next);
    }

    return ctx.replyWithHTML(CHANNEL_DETAILS_MESSAGES.unSupportType());
});