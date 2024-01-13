export function isFutureTime(timeStr: Date) {
    const inputTime = new Date(timeStr);
    const currentTime = new Date();
    return inputTime > currentTime;
}