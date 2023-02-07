import {Context} from "telegraf";
import {Update} from "typegram";
import {Message} from "typegram/message";
import {MessageEntity} from "telegraf/typings/core/types/typegram.js";

export class BotHelper {
    static builder(): BotHelper {
        return new BotHelper(
        );
    };


    public getCaptionEntityInvite(offset: number): MessageEntity {
        const url = 'https://t.me/catsplusdogs';
        return {
            offset,
            length: url.length,
            type: 'text_link',
            url //this._inviteLink
        };
    }

    public getCaptionEntityJoke(offset: number): MessageEntity {
        const url = 'https://t.me/catsplusdogs';
        return {
            offset,
            length: url.length,
            type: 'text_link',
            url //this._inviteLink
        };
    }

    public nextWithEmptyText(ctx: Context<Update> ,next: () => Promise<void>): Promise<void> {
        (ctx.message as Message.TextMessage).text = ''; // NOTE: empty text before returning
        return next();
    }

}
