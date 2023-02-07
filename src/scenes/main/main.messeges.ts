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

    logoNotFound: () => [
        `Вибач, не можу знайти логотип`,
        `звернись до адміна, будь ласка`
    ].join('\n\n'),

    groupName: () => 'Підписатися на Міксер',
    inviteEnd: () => ' 🥰',

    sendJoke: () => `Прислати жартик`,
    sendJokeFooter: () => MAIN_MESSAGES.sendJoke() + ' ⚡',
}
