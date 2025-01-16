import { TON_TX_VALID_UNTIL } from "@/services/Defaults";
import { PoolModel } from "@/services/Router";
import { Currency, CurveTypes, ExpandedAtomicPool } from "@/types";
import debug from 'debug';

const debugLog = debug('app:utils');

const AMPLIFICATION_FACTOR: bigint = 100n;


const formatter = new Intl.NumberFormat(undefined, {
    // style: 'currency',
    // currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat(undefined, {
    style: 'percent',
    minimumFractionDigits: 2
})

const usdFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

export const formatUSD = (amount: number) => {
    return usdFormatter.format(amount);
}

export const formatCryptoAmountAbbr = (amount: number | string) => {
    if (typeof amount === 'string') {
        amount = parseFloat(amount);
    }
    if (amount < 1000) {
        return amount.toFixed(2);
    } else if (amount < 1000000) {
        return (amount / 1000).toFixed(2) + "K";
    } else if (amount < 1000000000) {
        return (amount / 1000000).toFixed(2) + "M";
    } else {
        return (amount / 1000000000).toFixed(2) + "B";
    }
}

export const abbreviateNumber = (value: number, precision: number = 0) => {
    let newValue = value;
    let suffix = "";
    if (value >= 1000) {
        const suffixes = ["", "K", "M", "B", "T"];
        let suffixNum = 0;
        while (newValue >= 1000) {
            newValue /= 1000;
            suffixNum++;
        }
        suffix = suffixes[suffixNum];
    }
    return newValue.toFixed(precision) + suffix;
}

export const formatCryptoAmount = (amount: number) => {
    return formatter.format(amount);
}

export const formatPercent = (amount: number) => {
    return percentFormatter.format(amount);
}

export const isMobileDevice = () => {
    if (typeof navigator === 'undefined') return false;
    if (!navigator.userAgent) return false;
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

export function calculateExpectedOut(
    expectedIn: bigint,
    pool: PoolModel,
    fromCurrency: Currency,
    // toWallet: bigint,
): bigint {
    const log = debugLog.extend(`calculateExpectedOut:${pool.toString()}:${fromCurrency}:${expectedIn}`);

    log(`calculateExpectedOut ${expectedIn}, ${pool}, ${fromCurrency}`);
    try {
        const currency0: Currency = pool.token0;
        let newReserve0 = 0n;
        let newReserve1 = 0n;
        let fees0 = 0n;
        let fees1 = 0n;
        let outputAmount = 0n;



        if (pool.curveType == CurveTypes.Unbalanced) {

            let amountWithFee = expectedIn * pool.feeNominator / pool.feeDenominator; // Deduct fee

            if (fromCurrency === currency0) {
                log(`unbalanced orig wallet 0`);
                fees0 = expectedIn - amountWithFee;
                newReserve0 = pool.reserve0 + expectedIn;
                newReserve1 = pool.reserve1 - (pool.reserve1 * amountWithFee) / (pool.reserve0 + amountWithFee);

                outputAmount = pool.reserve1 - newReserve1;
            } else {
                log(`unbalanced orig wallet 1`);
                fees1 = expectedIn - amountWithFee;
                newReserve1 = pool.reserve1 + expectedIn;
                newReserve0 = pool.reserve0 - (pool.reserve0 * amountWithFee) / (pool.reserve1 + amountWithFee);

                outputAmount = pool.reserve0 - newReserve0;
            }
        } else {
            let amountWithFee = expectedIn * pool.feeNominator / pool.feeDenominator;

            if (fromCurrency === currency0) {
                log(`balanced orig wallet 0`);
                log(`orig wallet 0`);
                fees0 = expectedIn - amountWithFee;
                log(`fees0 ${fees0}`);
                newReserve0 = pool.reserve0 + amountWithFee;
                log(`newReserve0 ${newReserve0}`);

                let sumReserves = newReserve0 + pool.reserve1;
                let invariantD = calculateInvariantD(newReserve0, pool.reserve1);
                newReserve1 = sumReserves / 2n + AMPLIFICATION_FACTOR * invariantD / (4n * newReserve0);
                log(`newReserve1 ${newReserve1}`);
                log(`outputAmount ${pool.reserve1 - newReserve1}`);
                outputAmount = pool.reserve1 - newReserve1;
            } else {
                log(`balanced orig wallet 1`);
                log(`orig wallet 1`);
                debugLog(`amountWithFee ${amountWithFee}`);
                fees1 = expectedIn - amountWithFee;
                log(`fees1 ${fees1}`);
                newReserve1 = pool.reserve1 + amountWithFee;
                log(`newReserve1 ${newReserve1}`);
                newReserve0 = pool.reserve0 - (pool.reserve0 - pool.reserve1) / (pool.reserve1 + amountWithFee);
            }
        }
        log(`outputAmount ${outputAmount}`);
        return outputAmount - (outputAmount / 100n); // 1 slippage
    } catch (error) {
        console.error(error);
        return 0n
    }

}

export function calculateInvariantD(x: bigint, y: bigint): bigint {
    let sumXY = x + y;
    let productXY = x * y;

    // Apply amplification factor
    let D = (AMPLIFICATION_FACTOR * sumXY) + (productXY / AMPLIFICATION_FACTOR);

    return D;
}

export function getTonTxValidUntil() {
    return Math.floor(Date.now() / 1000) + TON_TX_VALID_UNTIL
}

export function formatDate(date: Date): string {
    return date.toLocaleString(navigator.language, {
        weekday: 'short',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function removeThousandsSeparator(value: string): string {
    return value.replace(/,/g, '');
}