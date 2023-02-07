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
        console.log('from channel', ctx.channelPost);
        // @ts-ignore
        const caption = ctx.channelPost?.caption ?? '';

        return ctx.telegram.editMessageCaption(ctx.channelPost.chat.id, ctx.channelPost.message_id, undefined, 'new cap')

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
        console.log('txt', text);

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

    private _getCaption(ctx: MyContext): { caption: string, caption_entities: MessageEntity[], /*reply_markup: InlineKeyboardMarkup*/ } {
        const divider = '\n\n';

        const firstPart = [
            // ctx.session.text,
            divider
        ];

        const secondPart = [
            MAIN_MESSAGES.sendJokeFooter(),
            divider
        ];

        const thirdPart = [
            MAIN_MESSAGES.groupName(),
            MAIN_MESSAGES.inviteEnd(),
        ];

        const jokeOffset: number = this._getOffset(firstPart);
        const inviteOffset: number = jokeOffset + this._getOffset(secondPart);

        const caption_entities = [
            this._botHelper.getCaptionEntityInvite(inviteOffset),
            this._botHelper.getCaptionEntityJoke(jokeOffset)
        ];

        const caption = [...firstPart, ...secondPart, ...thirdPart].join('');

        return {caption, caption_entities, /*...MAIN_PUBLISH_KEYBOARD*/};
    }

    private _isSessionNotEmpty(ctx: MyContext): boolean {
        return ctx.session.channels.size > 0;
    }

    private _getOffset(texts: string[]): number {
        return texts.reduce((res, curr) => {
            if (curr == null) {
                console.log(texts);
            }

            return res + (curr ?? '').length;
        }, 0);
    }
}