import { ReactNode } from "react";
import { LineChart } from "../LineChart";
import style from './index.module.css';
import { useStatisticsModel } from "@/components/Services/Model";
import { IChartProps, TimeRange } from "@/types";
// import { useApiGetStats } from "@/services/api.service";


export const TVLChart = ({ range }: IChartProps): ReactNode => {

  const model = useStatisticsModel();
  const data = model.tvlHistory;

  return <div className={style.TVLChart}>
    <LineChart
      labels={data.map(([date, value]) => date)}
      datasets={[{
        label: 'Total Staked Amount',
        data: data.map(([date, value]) => value),
        backgroundColor: '#16ea9c14',
        borderColor: '#16EA9E',
      }]}
      backgroundColor="#181818"
      range={range}
      unit={'TON'}
    />
  </div>

} 