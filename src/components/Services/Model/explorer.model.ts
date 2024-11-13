import { IBundle, IExplorerStatistics, JsonAPIResponse, PaginatedResult, TimeRange } from "@/types";
import { create } from "zustand";
import { queryBundles, queryExplorerStatistics } from "../mevton-api";


export const useExplorerModel = create<ExplorerModel>((set, get) => ({
    selectedTimeRange: TimeRange.DAY,
    bundles: {
        data: [],
        meta: {
            page: 1,
            pageSize: 1000,
        }
    },
    statistics: {
        data: {
            tipsPerDay: {
                range: '',
                elements: []
            },
            tipsPerWeek: {
                range: '',
                elements: []
            },
            tipsPerMonth: {
                range: '',
                elements: []
            },
            tipsPerYear: {
                range: '',
                elements: []
            },
            bundlePerDay: {
                range: '',
                elements: []
            },
            bundlePerWeek: {
                range: '',
                elements: []
            },
            bundlePerMonth: {
                range: '',
                elements: []
            },
            bundlePerYear: {
                range: '',
                elements: []
            },
            tipsLast100Seqno: {
                range: '',
                elements: []
            },
            bundleLast100Seqno: {
                range: '',
                elements: []
            },
            totalBundleCount: {
                value: 0,
            },
            totalTipAmount: {
                value: 0,
            },
        },
        meta: {
            page: 1,
            pageSize: 1000,
        }
    },
    initialLoad: false,
    getBundles: async () => {
        const bundlesResponse = await queryBundles();
        set({ bundles: bundlesResponse });
    },
    getExplorerStatistics: async () => {
        const statistics = await queryExplorerStatistics();
        set({ statistics });

    },
    init: async () => {
        if (get().initialLoad) return;
        try {
            await get().getBundles();
            await get().getExplorerStatistics();
        } catch (error) {

        } finally {
            set({ initialLoad: true });
        }
    },
}));

type ExplorerModel = {
    getExplorerStatistics(): Promise<void>;
    selectedTimeRange: TimeRange;
    bundles: PaginatedResult<IBundle>;
    initialLoad: boolean;
    statistics: JsonAPIResponse<IExplorerStatistics>;
    getBundles: () => Promise<void>;
    init: () => Promise<void>;
}