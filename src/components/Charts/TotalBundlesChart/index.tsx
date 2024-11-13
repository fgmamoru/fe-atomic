import { ReactNode, useEffect, useState } from "react";
import { LineChart } from "../LineChart";
import style from './index.module.css';
import { IChartProps, TimeRange } from "@/types";
import { useExplorerModel } from "@/components/Services/Model/explorer.model";

export const TotalBundlesChart = ({ range }: IChartProps): ReactNode => {
  const model = useExplorerModel();
  const [data, setData] = useState(model?.statistics?.data?.bundlePerWeek?.elements || []);
  useEffect(() => {
    switch (range) {
      case TimeRange.WEEK:
        setData(model?.statistics?.data?.bundlePerWeek?.elements || []);
        break;
      case TimeRange.MONTH:
        setData(model?.statistics?.data?.bundlePerMonth?.elements || []);
        break;
      case TimeRange.YEAR:
        setData(model?.statistics?.data?.bundlePerYear?.elements || []);
        break;
      default:
        setData(model?.statistics?.data?.bundlePerWeek?.elements || []);
        break;
    }
  }, [model.statistics, range]);

  return <div className={style.TotalBundlesChart}>
    <LineChart
      labels={data.map((el) => el.date)}
      datasets={[{
        label: 'Bundles',
        data: data.map((el) => el.value),
        borderColor: '#00eac7',
        backgroundColor: '#00eac72c',
      }
      ]}
      range={range}
    />
  </div>

} 