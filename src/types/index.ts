import { AtomicPool } from "@/services/AtomicDex/AtomicDex.service";

/**
 * Represents a ticket with various properties.
 * 
 * @interface ITicket
 * 
 * @property {boolean} unlocked - Indicates if the ticket is unlocked.
 * @property {string} name - The name associated with the ticket.
 * @property {number} amount - The amount related to the ticket.
 * @property {string} [formattedAmount] - The formatted amount as a string (optional).
 * @property {string} eta - The estimated time of arrival for the ticket.
 */
export interface ITicket {
    unlocked: boolean;
    name: string;
    amount: number;
    formattedAmount?: string;

    eta: string;
}

export enum TimeRange {
    DAY = "1d",
    WEEK = "7d",
    MONTH = "30d",
    YEAR = "365d",
    ALL = "all",
}

export enum DayOrEpoch {
    DAY = "day",
    EPOCH = "epoch",
}

export interface IChartProps {
    range: TimeRange
}

export type DeepPartial<T> = T extends Function
    ? T
    : T extends Array<infer U>
    ? _DeepPartialArray<U>
    : T extends object
    ? _DeepPartialObject<T>
    : T | undefined;

type _DeepPartialArray<T> = Array<DeepPartial<T>>
type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };


/**
 * Represents the type of unstake operation.
 * 
 * - `recommended`: A recommended unstake operation, 
 *                  this happen throughout our on Liquid Staking implementation, 
 *                  and the user have to wait for the staking round to end.
 * 
 * - `instant`:     An instant unstake operation.
 *                  This happens through a 3rd party service, (ston.fi in our case) 
 *                  and the user can unstake at any time.
 */
export type UnstakeType = 'recommended' | 'instant';

export interface IBundle {
    id: number;
    peer_id: number;
    messages: string;
    produced_peer_id: number;
    produced_validator_address: string;
    block_id: string;
    tip_amount: number;
    version: number;
    catchain_seqno: number;
    createdAt: Date;

}

export interface IStatistic {
    range: string;
    elements: Array<{
        date: string;
        value: number;
    }>;
}

export interface ISingleStatistic {
    value: number;
}

export interface IExplorerStatistics {
    tipsPerDay: IStatistic;
    tipsPerWeek: IStatistic;
    tipsPerMonth: IStatistic;
    tipsPerYear: IStatistic;
    bundlePerDay: IStatistic;
    bundlePerWeek: IStatistic;
    bundlePerMonth: IStatistic;
    bundlePerYear: IStatistic;
    tipsLast100Seqno: IStatistic;
    bundleLast100Seqno: IStatistic;

    totalTipAmount: ISingleStatistic;
    totalBundleCount: ISingleStatistic;
}

export interface JsonAPIResponse<OutputDto> {
    data: OutputDto;
}

export interface ErrorResponse {
    message: string;
    error: string;
    statusCode: number;
}

export interface PaginatedResult<OutputDto> {
    data: OutputDto[];
    meta: {
        page: number;
        pageSize: number;
    };
    links?: {
        next?: string | null;
    };
}

export interface PaginatedResultWithTotals<OutputDto>
    extends PaginatedResult<OutputDto> {
    meta: PaginatedResult<OutputDto>['meta'] & {
        count: number;
        pages: number;
    };
}

type CurrencyBalanceName = `balance${number}`;

export type Currency = {
    symbol: string,
    icon: string,
    name: string,
    id: bigint,
    balanceKey: CurrencyBalanceName
}

export type AtomicPoolCurrencyMapItem = {
    token0: Currency;
    token1: Currency;
    curveType: CurveTypes;
}

export type AtomicPoolContract = {
    contractId: string;
}

export enum CurveTypes {
    Unbalanced = 0,
    Balanced = 1,
}

export enum RouteSpeed {
    Slow = 'slow',
    Fast = 'fast',
}

export type ExpandedAtomicPool = Omit<AtomicPool, 'curveType'> & AtomicPoolCurrencyMapItem & AtomicPoolContract;

export type ExchangeRateKey = `${string}-${string}`;
