import { ReactNode } from "react";
import { LineChart } from "../LineChart";
import style from './index.module.css';
import { useStatisticsModel } from "@/components/Services/Model";
import { IChartProps } from "@/types";

export const ApyChart = ({range}: IChartProps): ReactNode => {
  const model = useStatisticsModel();

  const data = model.apyHistory;

  return <div className={style.ApyChart}>
    <LineChart
      labels={data.map(([date, value]) => date)}
      range={range}
      unit={'%'}
      datasets={[{
        label: 'APY',
        data: data.map(([date, value]) => value),
        borderColor: '#0088EA',
        backgroundColor: '#0088EA1A',
      }]}
    />
  </div>

} 