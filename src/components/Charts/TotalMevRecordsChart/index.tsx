import { ReactNode } from "react";
import { LineChart } from "../LineChart";
import style from './index.module.css';
import { useStatisticsModel } from "@/components/Services/Model";
import { IChartProps } from "@/types";

export const TotalMevRecordsChart = ({range}: IChartProps): ReactNode => {

  const model = useStatisticsModel();
  const data = model.bundlesHistory
  

  return <div className={style.TotalMevRecordsChart}>
    <LineChart
      labels={data.map(([date, value]) => date)}
      datasets={[{
          label: 'Records',
          data: data.map(([date, value]) => value),
          borderColor: '#EA8C00',
          backgroundColor: '#EA8C001A',
        }
      ]}
      unit={'TON'}
      range={range}
    />
  </div>

} 