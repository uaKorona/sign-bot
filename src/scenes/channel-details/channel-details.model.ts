import {ChannelModel} from "../../session/index.js";

export class ChannelDetailsModel implements ChannelModel {
    readonly channelId: number;
    readonly title: string;
    signText?: string;
    replaces?: string[];

    constructor(channelId: string, model: ChannelModel) {
        this.channelId = parseInt(channelId, 10);
        this.title = model.title;
        this.signText = model.signText ?? ''
        this.replaces = Array.isArray(model.replaces) ? [...model.replaces]: [];
    }

    static builder(channelId: string, model: ChannelModel): ChannelDetailsModel {
        return new ChannelDetailsModel(channelId, model);
    }

    setParams(channelId: number | null, channelTitle: string = ''): void {
    }

}