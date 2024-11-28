import { ReactNode, useEffect, useState } from "react";
import style from './index.module.css';
import { useExplorerModel } from "@/components/Services/Model/explorer.model";
import { BarChart } from "../BarChart";
import { CustomSelector } from "../TimeRangeSelector";

export const TotalBundlesPerSlothBarChart = (): ReactNode => {
    const model = useExplorerModel();
    const [data, setData] = useState(model?.statistics?.data?.bundleLast100Seqno?.elements || []);
    const [option, setOption] = useState('Bundle #');
    const [colors, setColors] = useState(['#46f1a4', '#46f1a42c']);

    useEffect(() => {
        switch (option) {
            case 'Bundle #':
                setColors(['#46f1a4', '#46f1a42c']);
                setData(model?.statistics?.data?.bundleLast100Seqno?.elements.slice(0, 75) || []);
                break;

            case 'Tips':
                setColors(['#f1eb46', '#f1eb462c']);
                setData(model?.statistics?.data?.tipsLast100Seqno?.elements.slice(0, 75) || []);
                break;
        }
    }, [model.statistics, option]);


    return <div className={style.TotalBundlesChart}>
        <div className={style.Switch}>
            <CustomSelector
                options={[{ label: 'Bundle #' }, { label: 'Tips' }]}
                onChange={(value) => setOption(value)}
            />
        </div>
        <BarChart
            labels={data.map((el) => parseInt(el.date))}
            datasets={[{
                label: 'Tips',
                data: data.map((el) => el.value),
                borderColor: colors[0],
                backgroundColor: colors[1],
            }
            ]}
        />
    </div>
} 