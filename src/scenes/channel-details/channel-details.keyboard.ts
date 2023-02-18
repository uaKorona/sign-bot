import {Markup} from 'telegraf';

export enum TEXT_BUTTONS {
    TEXT_CANCEL = '↩️ Назад',
    TEXT_NEXT = '✅ Зберегти',
    TEXT_PREVIEW = '😍 Переглянути',
    TEXT_REPLACEMENT = '🧬 Автозаміна'
}

const EMPTY_BOARD = [TEXT_BUTTONS.TEXT_CANCEL];
const PREVIEW_BOARD = [
    [TEXT_BUTTONS.TEXT_REPLACEMENT, TEXT_BUTTONS.TEXT_PREVIEW],
    [TEXT_BUTTONS.TEXT_CANCEL]
];
const PREVIEW_SAVE_BOARD = [
    [TEXT_BUTTONS.TEXT_REPLACEMENT, TEXT_BUTTONS.TEXT_PREVIEW],
    [TEXT_BUTTONS.TEXT_CANCEL, TEXT_BUTTONS.TEXT_NEXT]
];


export const DETAILS_KEYBOARD = (withPreview: boolean) => {
    const buttons = withPreview ? PREVIEW_BOARD : EMPTY_BOARD;

    // @ts-ignore
    return Markup.keyboard(buttons).resize();
}

export const SAVE_KEYBOARD = Markup.keyboard(PREVIEW_SAVE_BOARD).resize()
