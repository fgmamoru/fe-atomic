export const bigIntClamp = (value: bigint, min: bigint, max?: bigint): bigint => {
    if (value < min) {
        return min;
    }

    if (max != undefined && value > max) {
        return max;
    }

    return value;
}