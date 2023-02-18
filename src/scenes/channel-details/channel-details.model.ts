import {ChannelModel} from "../../session/index.js";

export class ChannelDetailsModel implements ChannelModel {
    readonly channelId: number;
    readonly title: string;
    signText?: string;
    replaceLeft?: string;
    replaceRight?: string;

    constructor(channelId: string, model: ChannelModel) {
        this.channelId = parseInt(channelId, 10);
        this.title = model.title;
        this.signText = model.signText ?? '';
        this.replaceLeft = model.replaceLeft ?? '';
        this.replaceRight = model.replaceRight ?? '';
    }

    static builder(channelId: string, model: ChannelModel): ChannelDetailsModel {
        return new ChannelDetailsModel(channelId, model);
    }

    setReplacement(replaceLeft: string, replaceRight: string): void {
        this.replaceLeft = replaceLeft;
        this.replaceRight = replaceRight;
    }

    isSignSet(): boolean {
        return !!this.signText;
    }

    setSign(textForSign: string): void {
        this.signText = textForSign;
    }

}