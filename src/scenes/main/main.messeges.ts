import {MAIN_BUTTONS} from "./main.keyboard.js";

export const MAIN_MESSAGES = {
    mainKeyboardDescription: () => `Давай налаштуємо твої канали`,

    startMessage: (name: string) => [
        `Привіт, <b>${name}</b>!`,
        MAIN_MESSAGES.mainKeyboardDescription(),
        MAIN_MESSAGES.addChannel(),
    ].join('\n\n'),

    addChannel: () => `Натисни "${MAIN_BUTTONS.ADD_CHANNEL}", щоб додати новий канал`,

    unSupportType: () => `Вибач, я ще не вмію обробляти такі повідомленя, я тільки вчуся 😘`,

    channelsList: () => `Список каналів:`,
}
