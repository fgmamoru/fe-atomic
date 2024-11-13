import { ReactNode, useEffect, useState } from "react";
import { LineChart } from "../LineChart";
import style from './index.module.css';
import { useStatisticsModel } from "@/components/Services/Model";
import { IChartProps, TimeRange } from "@/types";
import { useExplorerModel } from "@/components/Services/Model/explorer.model";

export const TotalTipsChart = ({ range }: IChartProps): ReactNode => {
  const model = useExplorerModel();
  const [data, setData] = useState(model.statistics?.data?.tipsPerWeek?.elements || []);
  useEffect(() => {
    switch (range) {
      case TimeRange.WEEK:
        setData(model.statistics?.data?.tipsPerWeek?.elements || []);
        break;
      case TimeRange.MONTH:
        setData(model.statistics?.data?.tipsPerMonth?.elements || []);
        break;
      case TimeRange.YEAR:
        setData(model.statistics?.data?.tipsPerYear?.elements || []);
        break;
      default:
        setData(model.statistics?.data?.tipsPerWeek?.elements || []);
        break;
    }
  }, [model.statistics, range]);

  return <div className={style.TotalBundlesChart}>
    <LineChart
      labels={data.map((el) => el.date)}
      datasets={[{
        label: 'Tips',
        data: data.map((el) => el.value),
        borderColor: '#9046f1',
        backgroundColor: '#9046f12c',
      }
      ]}
      unit="TON"
      range={range}
    />
  </div>
} 