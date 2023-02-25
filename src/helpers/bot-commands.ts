import {Context, Markup} from "telegraf";
import {Update} from "typegram";
import {BotHelper} from "./bot-helper.js";
import {Message} from "typegram/message";
import {ChannelModel, MyContext} from "../session/index.js";
import {MAIN_BUTTONS, MAIN_KEYBOARD, MAIN_KEYBOARD_WITH_PREVIEW} from "../scenes/main/main.keyboard.js";
import {MAIN_MESSAGES} from "../scenes/main/main.messeges.js";
import {MessageEntity} from "telegraf/typings/core/types/typegram.js";
import {SCENES_ID} from "../scenes/index.js";
import {InlineKeyboardButton} from "telegraf/src/core/types/typegram.js";
import {CHANNEL_ID} from "../consts/channel.consts.js";
import {DIVIDER, messagesWrapper} from "./messages-wrapper.js";

export class BotCommands {
    constructor(
        private readonly _botHelper: BotHelper,
    ) {
    }

    onStart(ctx: Context<Update>) {
        return ctx.replyWithHTML(
            MAIN_MESSAGES.startMessage(ctx?.from?.first_name ?? 'guest'),
            MAIN_KEYBOARD
        );
    }

    initSession(ctx: MyContext, next: ()=> void): void {
        ctx.session.channels ??= new Map<string, ChannelModel>();

        return next();
    }

    handleChannelMessage = async (ctx: Context<Update.ChannelPostUpdate>, next: () => Promise<void>) => {
        // @ts-ignore
        const text = ctx.channelPost?.caption ?? '';
        console.log('from channel', text);
        const signText = 'Котики-Собачки';
        const fullText = signText + ' 🐈🐕';
        const url = 'https://t.me/catsplusdogs';
        const {caption, caption_entities} = this._botHelper.getCaption(text, fullText, signText, url);

        return ctx.telegram.editMessageCaption(ctx.channelPost.chat.id, ctx.channelPost.message_id, undefined, caption, {caption_entities})
    }

    gotoAddChannelScene = async (ctx: MyContext) => {
        return ctx.scene.enter(SCENES_ID.CHANNEL_ADD_SCENE_ID);
    }

    viewChannels(ctx: MyContext) {
        const channelsButtons: InlineKeyboardButton.CallbackButton[] = [];

        ctx.session.channels.forEach((value, key, channels) => {
            channelsButtons.push(Markup.button.callback(value.title, `${CHANNEL_ID}=${key}`));
            console.log('channel:', value.title, ' : ', key );
        });

        return ctx.reply(
            MAIN_MESSAGES.channelsList(),
            Markup.inlineKeyboard(channelsButtons)
        )
    }

    editChannel(ctx: MyContext) {
        // @ts-ignore
        const id = ctx.match[1];
        const model = ctx.session.channels.get(id)

        return ctx.scene.enter(SCENES_ID.CHANNEL_DETAILS_SCENE_ID, {[CHANNEL_ID]: id, model});
    }

    publishPost = async (ctx: MyContext, next: () => Promise<void>) => {
        await ctx.editMessageReplyMarkup({inline_keyboard: []});
        await ctx.reply(MAIN_BUTTONS.PUBLISHED);

        return next();
    }

    otherMessagesHandler = async (ctx: MyContext) => {
        const {text} = ctx.message as Message.TextMessage ?? {};
        console.log('txt', text, ctx.session.channels);

        /*  switch (text) {
              case MAIN_BUTTONS.MEDIA:
                  return ctx.scene.enter(SCENES_ID.CHANNEL_DETAILS_SCENE_ID);

              case MAIN_BUTTONS.CANCEL:
                   this._emptySession(ctx);
                   break;

              case MAIN_BUTTONS.PREVIEW:
                  const extra = this._getCaption(ctx);

                  if (ctx.session.photo) {
                      return ctx.replyWithPhoto(ctx.session.photo, extra)
                  }

                  if (ctx.session.video) {
                      return ctx.replyWithVideo(ctx.session.video, extra)
                  }

                  return ctx.reply(extra.caption, {entities: extra.caption_entities});

              default: {
                  if (TypeGuardsHelper.isString(text) && text.length) {
                      ctx.session.text = text; //TODO: sanitize
                  }
              }

          }*/

        if (this._isSessionNotEmpty(ctx)) {
            return ctx.reply(
                MAIN_MESSAGES.addChannel(),
                MAIN_KEYBOARD_WITH_PREVIEW)
        }

        return ctx.reply(MAIN_MESSAGES.mainKeyboardDescription(), MAIN_KEYBOARD)
    }

    private _isSessionNotEmpty(ctx: MyContext): boolean {
        return ctx.session.channels.size > 0;
    }
}