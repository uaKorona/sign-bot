import {DIVIDER, messagesWrapper} from "../../helpers/messages-wrapper.js";

export const CHANNEL_ADD_MESSAGES = {
    startMessage: () => messagesWrapper([
        `Надішли посилання на телеграм канал у одному з форматів:`,
        DIVIDER,
        '<pre>@НАЗВА КАНАЛУ</pre>',
        'або',
        '<pre>https://t.me/НАЗВА КАНАЛУ</pre>',
        DIVIDER,
        'Наприклад:',
        '@catsplusdogs або https://t.me/catsplusdogs',
    ]),

    channelGetSuccess: (channelTitle: string) => `${channelTitle} знайдено успішно ✔️`,
    chatGetFail: (failText: string) => `❌ Не вдалося розпізнати канал: ${failText}`,

    unSupportType: () => `Вибач, я не вмію обробляти такі повідомленя 🥰`
}