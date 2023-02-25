import {Context} from "telegraf";
import {Update} from "typegram";
import {Message} from "typegram/message";
import {MessageEntity} from "telegraf/typings/core/types/typegram.js";
import {DIVIDER} from "./messages-wrapper.js";

export class BotHelper {
    static builder(): BotHelper {
        return new BotHelper(
        );
    };


    public getCaptionEntity(offset: number, length: number,  url: string): MessageEntity {
        return {
            offset,
            length,
            type: 'text_link',
            url
        };
    }

    public nextWithEmptyText(ctx: Context<Update> ,next: () => Promise<void>): Promise<void> {
        (ctx.message as Message.TextMessage).text = ''; // NOTE: empty text before returning
        return next();
    }

    public getCaption(signText: string, replaceLeft: string | undefined, replaceRight: string | undefined): { caption: string, caption_entities: MessageEntity[]} {
        const caption = DIVIDER + signText;
        const original = {caption: DIVIDER + signText, caption_entities: []};

        if (!replaceLeft || !replaceRight) {
            return original;
        }

        const offset = caption.toLocaleLowerCase().indexOf(replaceLeft.toLocaleLowerCase());

        if (offset < 0) {
            return original;
        }

        const caption_entities = [
            this.getCaptionEntity(offset, replaceLeft.length, replaceRight)
        ];

        return {caption, caption_entities};
    }
}
