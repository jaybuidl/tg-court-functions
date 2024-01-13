import humanizeDuration from "humanize-duration";

export const humanizer = (startFromNowInSeconds: bigint, endFromNowInSeconds?: bigint) => {
    if (!endFromNowInSeconds) {
        if (startFromNowInSeconds == 0n) return "is about to start";
        if (startFromNowInSeconds < 0n) return "has already started";
    }
    else if (endFromNowInSeconds > 0n) {
        if (startFromNowInSeconds == 0n) return "is about to start and will end in " + humanizeDuration(Number(endFromNowInSeconds) * 1000);
        if (startFromNowInSeconds < 0n) return "has already started and will end in " + humanizeDuration(Number(endFromNowInSeconds) * 1000);
    }
    else if (endFromNowInSeconds <= 0n || endFromNowInSeconds <= startFromNowInSeconds) {
        return "has already ended";
    }
    return "is starting in " + humanizeDuration(Number(startFromNowInSeconds) * 1000);
};
