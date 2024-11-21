import { API_SCHEME, API_URL } from '@/services/config.service';
import { IBundle, IExplorerStatistics, JsonAPIResponse, PaginatedResult, TimeRange } from '@/types';
import { QueryClient } from '@tanstack/react-query'


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
        },

    },
});


function generateSampleData(timeRange: TimeRange): HistoricalData {
    const data: HistoricalData = [];
    const today = new Date();
    let days;

    // Determine the number of days based on the time range
    switch (timeRange) {
        case TimeRange.DAY:
            days = 1;
            break;
        case TimeRange.WEEK:
            days = 7;
            break;
        case TimeRange.MONTH:
            days = 30;
            break;
        case TimeRange.YEAR:
            days = 365;
            break;
        case TimeRange.ALL:
        default:
            days = 365; // You can adjust this as needed
            break;
    }
    if (timeRange === TimeRange.ALL)
        days = 365 * 2; // You can adjust this as needed

    if (timeRange === TimeRange.DAY) {
        // Generate one data point per hour
        for (let i = 0; i < 24; i++) {
            const date = new Date(today);
            date.setHours(today.getHours() - i);
            data.push([date, Math.floor(Math.random() * 100_000 + 20_000)]); // Random number between 0 and 100_000
        }
    } else {
        // Generate one data point per day
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            data.push([date, Math.floor(Math.random() * 100_000) + 20_000]); // Random number between 0 and 100_000

        }
    }


    return data.reverse(); // Reverse to get ascending dates
}


export const queryStatistics = (range: TimeRange) => queryClient.fetchQuery({
    queryKey: ['statistics', range],
    queryFn: async () => {
        // try {
        const url = `$${getRootUrl()}}/api/statistics?since=${range}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
        // } catch (error) {
        // return {
        //   tvl: 12343223423,
        //   tvlHistory: generateSampleData(range),

        //   bundles: 1584431,
        //   bundlesHistory: generateSampleData(range),

        //   apy: 1584431,
        //   apyHistory: generateSampleData(range),

        //   mevRecords: 1584431,
        //   mevRecordsHistory: generateSampleData(range),
        // }
        // }?)

    }
})

type DateNumberTuple = [Date, number];
type HistoricalData = DateNumberTuple[];


function transformToHistoricalData(data: Array<[string, number]>): HistoricalData {
    return data.map(([date, value]) => {

        return [new Date(date), value] as DateNumberTuple;
    }) as HistoricalData
}

export const queryBundles = () => queryClient.fetchQuery<PaginatedResult<IBundle>>({
    queryKey: ['bundles'],
    queryFn: async () => {
        try {
            const url = `${API_SCHEME}://${API_URL}/api/bundles`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            return {
                items: [],
                page: 1,
                pageSize: 1000,
                next: null,
            }
        }
    }
})

export const queryExplorerStatistics = () => queryClient.fetchQuery<JsonAPIResponse<IExplorerStatistics>>({
    queryKey: ['explorer-statistics'],
    queryFn: async (): Promise<JsonAPIResponse<IExplorerStatistics>> => {
        const url = `${getRootUrl()}/api/explorer-statistics`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
})

export function getRootUrl() {
    return `${API_SCHEME}://${API_URL}`;
}