import { DIVIDER } from './messages-wrapper.js'
import { type MessageEntity } from '@grammyjs/types/message.js'

export class BotHelper {
  static builder (): BotHelper {
    return new BotHelper()
  }

  public getCaptionEntity (offset: number, length: number, url: string): MessageEntity {
    return {
      offset,
      length,
      type: 'text_link',
      url
    }
  }

  /* public nextWithEmptyText(ctx: Context<Update> ,next: () => Promise<void>): Promise<void> {
        (ctx.message as Message.TextMessage).text = ''; // NOTE: empty text before returning
        return next();
    } */

  public getCaption (messageText: string, signText: string, replaceLeft: string, replaceRight: string): { caption: string, caption_entities: MessageEntity[] } {
    const caption = messageText + DIVIDER + DIVIDER + signText
    const original = { caption, caption_entities: [] }

    if (!replaceLeft || !replaceRight) {
      return original
    }

    const offset = caption.indexOf(replaceLeft)

    if (offset < 0) {
      return original
    }

    const caption_entities = [
      this.getCaptionEntity(offset, replaceLeft.length, replaceRight)
    ]

    return { caption, caption_entities }
  }
}
