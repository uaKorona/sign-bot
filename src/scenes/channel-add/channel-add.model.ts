export class ChannelAddModel {
    channelId: number | null = null;
    channelTitle: string = 'Unknown channel';

    static builder(): ChannelAddModel {
        return new ChannelAddModel();
    }

    setParams(channelId: number | null, channelTitle: string = ''): void {
        this.channelId = channelId;

        if (channelId != null) {
            this.channelTitle = channelTitle
        }
    }
}