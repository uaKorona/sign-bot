import {DIVIDER, messagesWrapper} from "../../helpers/messages-wrapper.js";
import {TEXT_BUTTONS} from "./channel-details.keyboard.js";

export const CHANNEL_DETAILS_MESSAGES = {
    startNewMessage: (channelTitle: string) => messagesWrapper([
        `Реагування каналу: ${channelTitle}`,
        DIVIDER,
        'Надішли текст, щоб задати новий підпис'
    ]),

    startUpdateMessage: (channelTitle: string) => messagesWrapper([
        `Реагування каналу: ${channelTitle}`,
        DIVIDER,
        'Поточний підпис:',
        DIVIDER
    ]),

    signChange: () => messagesWrapper([
        `Для перегляду тисни "${TEXT_BUTTONS.TEXT_PREVIEW}"`,
        DIVIDER,
        'Або надішли текст нового підпису'
    ]),

    onPhoto: () => `Можна змінити розташування водяного знаку за допомогою стрілок`,

    onVideo: () => `Відео завантажено ✔️`,

    unSupportType: () => `Вибач, я не вмію обробляти такі повідомленя 🥰`,

    unknownFileId: () => [
        `Не вдалося визначити file Id`,
        `звернись до адміна, будь ласка`
    ].join('\n\n'),

    proceeding: () => `Обробка...`,

    unknownFileUrl: () => [
        `Не вдалося визначити file url`,
        `звернись до адміна, будь ласка`
    ].join('\n\n'),

    replacementExample: () => messagesWrapper([
        'Надішли текст автозаміни у форматі:',
        'текст=посилання',
        DIVIDER,
        'Наприклад:',
        'Підпишись=https://t.me/catsplusdogs',
        ]),

    replacementSuccess: () => `Автозаміна додана успішно 💚`,
}
