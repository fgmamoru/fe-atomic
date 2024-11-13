import { TimeRange } from "@/types";
import { create, StateCreator } from "zustand";
import { queryStatistics } from "../mevton-api";

type DateNumberTuple = [Date, number];

type HistoricalData = DateNumberTuple[];

type StatisticsModel = {
    tvl: number;
    tvlHistory: HistoricalData;

    bundles: number;
    bundlesHistory: HistoricalData;

    apy: number;
    apyHistory: HistoricalData;

    mevRecords: number;
    mevRecordsHistory: HistoricalData;

    getStatistics: () => void;
    selectedTimeRange: TimeRange;
    setSelectedTimeRange: (timeRange: TimeRange) => void;
}

export const useStatisticsModel = create<StatisticsModel>((set, get) => ({
    tvl: 0,
    tvlHistory: [],
    bundles: 0,
    bundlesHistory: [],
    apy: 0,
    apyHistory: [],
    mevRecords: 0,
    mevRecordsHistory: [],
    selectedTimeRange: TimeRange.DAY,

    setSelectedTimeRange: (timeRange: TimeRange) => {
        set({ selectedTimeRange: timeRange });
        get().getStatistics();
    },

    getStatistics: async () => {
        const res = await queryStatistics(get().selectedTimeRange);
        const data = await res;
        set(data)
    }
}));

function transformToHistoricalData(data: Array<[string, number]>): HistoricalData {
    return data.map(([date, value]) => {

        return [new Date(date), value] as DateNumberTuple;
    }) as HistoricalData
}

