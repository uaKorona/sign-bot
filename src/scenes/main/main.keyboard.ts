import {Markup} from 'telegraf';

export enum MAIN_BUTTONS {
    VIEW_CHANNELS = '😍 Переглянути канали',
    ADD_CHANNEL = '🧩 Додати канал',
    PUBLISHED = 'Опубліковано ✅'
}

export const MAIN_KEYBOARD = Markup.keyboard([
    [MAIN_BUTTONS.ADD_CHANNEL]
]).resize();

export const MAIN_KEYBOARD_WITH_PREVIEW = Markup.keyboard([
    [MAIN_BUTTONS.VIEW_CHANNELS],
    [MAIN_BUTTONS.ADD_CHANNEL]
]).resize();