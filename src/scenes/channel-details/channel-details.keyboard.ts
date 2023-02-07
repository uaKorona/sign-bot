import {Markup} from 'telegraf';

export enum TEXT_BUTTONS {
    TEXT_CANCEL = '↩️ Назад',
    TEXT_NEXT = '✅ Зберегти',
    TEXT_PREVIEW = '😍 Переглянути'
}


export const DETAILS_EMPTY_KEYBOARD = Markup.keyboard([
    [TEXT_BUTTONS.TEXT_CANCEL, TEXT_BUTTONS.TEXT_PREVIEW, TEXT_BUTTONS.TEXT_NEXT],
]).resize();
