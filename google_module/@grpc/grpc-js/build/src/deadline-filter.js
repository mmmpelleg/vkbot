"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("./channel");
const constants_1 = require("./constants");
const filter_1 = require("./filter");
const units = [['m', 1], ['S', 1000], ['M', 60 * 1000], ['H', 60 * 60 * 1000]];
function getDeadline(deadline) {
    const now = (new Date()).getTime();
    const timeoutMs = Math.max(deadline - now, 0);
    for (const [unit, factor] of units) {
        const amount = timeoutMs / factor;
        if (amount < 1e8) {
            return String(Math.ceil(amount)) + unit;
        }
    }
    throw new Error('Deadline is too far in the future');
}
class DeadlineFilter extends filter_1.BaseFilter {
    constructor(channel, callStream) {
        super();
        this.channel = channel;
        this.callStream = callStream;
        this.timer = null;
        const callDeadline = callStream.getDeadline();
        if (callDeadline instanceof Date) {
            this.deadline = callDeadline.getTime();
        }
        else {
            this.deadline = callDeadline;
        }
        const now = (new Date()).getTime();
        let timeout = this.deadline - now;
        if (timeout < 0) {
            timeout = 0;
        }
        if (this.deadline !== Infinity) {
            this.timer = setTimeout(() => {
                callStream.cancelWithStatus(constants_1.Status.DEADLINE_EXCEEDED, 'Deadline exceeded');
            }, timeout);
            callStream.on('status', () => clearTimeout(this.timer));
        }
    }
    sendMetadata(metadata) {
        if (this.deadline === Infinity) {
            return metadata;
        }
        return new Promise((resolve, reject) => {
            if (this.channel.getConnectivityState(false) ===
                channel_1.ConnectivityState.READY) {
                resolve(metadata);
            }
            else {
                const handleStateChange = (newState) => {
                    if (newState === channel_1.ConnectivityState.READY) {
                        resolve(metadata);
                        this.channel.removeListener('connectivityStateChanged', handleStateChange);
                        this.callStream.removeListener('status', handleStatus);
                    }
                };
                const handleStatus = () => {
                    reject(new Error('Call ended'));
                    this.channel.removeListener('connectivityStateChanged', handleStateChange);
                };
                this.channel.on('connectivityStateChanged', handleStateChange);
                this.callStream.once('status', handleStatus);
            }
        })
            .then((finalMetadata) => {
            const timeoutString = getDeadline(this.deadline);
            finalMetadata.set('grpc-timeout', timeoutString);
            return finalMetadata;
        });
    }
}
exports.DeadlineFilter = DeadlineFilter;
class DeadlineFilterFactory {
    constructor(channel) {
        this.channel = channel;
    }
    createFilter(callStream) {
        return new DeadlineFilter(this.channel, callStream);
    }
}
exports.DeadlineFilterFactory = DeadlineFilterFactory;
//# sourceMappingURL=deadline-filter.js.map