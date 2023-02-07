export const CHANNEL_DETAILS_MESSAGES = {
    startMessage: (channelTitle: string) => `Реагування каналу ${channelTitle}`,

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


}
