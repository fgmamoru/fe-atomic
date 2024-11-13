import { ReactNode } from "react";
import { LineChart } from "../LineChart";
import style from './index.module.css';
import { useStatisticsModel } from "@/components/Services/Model";
import { IChartProps } from "@/types";

export const LargestBundlesBySigner = ({ range }: IChartProps): ReactNode => {
  const model = useStatisticsModel();
  return <div className={style.TotalBundlesChart}>
    <LineChart
      labels={model.tvlHistory.map(([date, value]) => date)}
      datasets={[{
        label: 'Bundles',
        data: model.tvlHistory.map(([date, value]) => value),
        borderColor: '#EA8C00',
        backgroundColor: '#EA8C001A',
      }
      ]}
      range={range}
    />
  </div>

} 