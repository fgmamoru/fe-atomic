'use client';
import { ReactNode } from 'react';
import { Bar, Line, } from 'react-chartjs-2';
import { DeepPartial, TimeRange } from '@/types';
import { TimeScaleTimeOptions } from 'chart.js/auto';
import { format } from 'date-fns';
import { abbreviateNumber, isMobileDevice } from '@/utils';

import "chart.js/auto";
import 'chartjs-adapter-date-fns';
import '../../../services/chartjs/vertical-line-plugin';
import '../../../services/chartjs/graph-background-color-plugin';
import { graphBackgroundColor } from '../../../services/chartjs/graph-background-color-plugin';

type DatasetConfig = {
  label: string,
  data: number[],
  borderColor?: string,
  backgroundColor?: string,
}


const getDefaultDatasetConfig = (dataset: DatasetConfig) => {
  return {
    fill: true,
    backgroundColor: '#16EA9E',
    borderColor: '#16EA9E',
    pointRadius: 0,
    xAxisID: 'x',
    yAxisID: 'y',
    borderWidth: 1,
    ...dataset,
  }
}


export const BarChart = (props: {
  datasets: DatasetConfig[],
  labels?: Date[] | string[] | number[],
  unit?: string,
  showLabels?: boolean,
  backgroundColor?: string,
}): ReactNode => {
  const dataset = props.datasets?.map(dataset => getDefaultDatasetConfig(dataset));
  const max = Math.max(...dataset[0].data);
  const min = Math.min(...dataset[0].data);

  return <Bar
    data={{
      // @ts-ignore
      labels: props.labels || [],
      datasets: [dataset[0]]
    }}

    options={{
      maintainAspectRatio: false,
      responsive: true,
      borderColor: 'red',
      backgroundColor: props.backgroundColor || 'black',

      plugins: {
        legend: {
          display: false,
        },
        filler: {
          propagate: false,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          enabled: true,
          callbacks: {
            /**
             * example Aug 20, 2021
             */
            title: function (tooltipItem) {
              try {
                // const date = parseCustomDate(tooltipItem[0].label);
                // return format(date, 'MMM d, yyyy');
              } catch (error) {
                return tooltipItem[0].label;
              }
            },
            label: function (tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}${props.unit ? ` ${props.unit}` : ''}`;
            }
          }
        },

      },
      hover: {
        mode: 'index',
        intersect: false,
      },
      scales: {

        // x: {
        //   type: 'time',
        //   time: getXTicksConfig(props.range),
        //   ticks: {
        //     color: '#F7F7F8',
        //     padding: 12,
        //     font: {
        //       size: 12,
        //     },
        //     maxTicksLimit: xTicks,
        //     autoSkip: true,
        //     source: 'auto',
        //   },
        // },
        // y: {
        //   ticks: {
        //     color: '#F7F7F8',
        //     padding: 12,
        //     font: {
        //       size: 12,
        //     },
        //     display: true,

        //     maxTicksLimit: 5,
        //     callback(tickValue, index, ticks) {
        //       return abbreviateNumber(tickValue as number);
        //     },
        //   },
        //   suggestedMin: min,
        //   suggestedMax: max
        // },
        // yright: {
        //   position: 'right',
        //   suggestedMin: min,
        //   suggestedMax: max,
        //   display: !isMobileDevice(),

        //   ticks: {
        //     callback(tickValue, index, ticks) {
        //       return abbreviateNumber(tickValue as number);
        //     },
        //     color: '#F7F7F8',
        //     padding: 10,
        //     font: {
        //       size: 10,
        //     },

        //     maxTicksLimit: 5,

        //     source: 'auto',
        //   },
        // },
      },

      onResize: function (chart, size) {
        // show/hide labels based on chart width
        const showLabels = size.width > 500;
        // if (chart.options.scales?.y) {
        //   chart.options.scales.y.display = showLabels;
        // }
        if (chart.options.scales?.yright) {
          chart.options.scales.yright.display = showLabels;
        }

      }
    }}

  />
}

const getXTicksPerRange = (range: TimeRange) => {
  switch (range) {
    case TimeRange.DAY:
      return 6;
    case TimeRange.WEEK:
      return 7;
    case TimeRange.MONTH:
      return 4;
    case TimeRange.YEAR:
      return 6;
    case TimeRange.ALL:
      return 6;
    default:
      return 6;
  }
}

const getXTicksConfig = (range: TimeRange): DeepPartial<TimeScaleTimeOptions> => {
  switch (range) {
    case TimeRange.DAY:
      return {
        unit: 'hour',
        displayFormats: {
          hour: 'HH:mm',
        },
      };
    case TimeRange.WEEK:
      return {
        unit: 'day',
        displayFormats: {
          day: 'MMM d',
        },
      };
    case TimeRange.MONTH:
      return {
        unit: 'day',
        displayFormats: {
          day: 'MMM d',
        },
      };
    case TimeRange.YEAR:
      return {
        unit: 'month',
        displayFormats: {
          // month: 'MMM YYYY',
        },
      };
    case TimeRange.ALL:
      return {
        unit: 'month',
        displayFormats: {
          // month: 'MMM',
        },
      };
    default:
      return {
        unit: 'day',
        displayFormats: {
          day: 'MMM d',
        },
      };
  }
}

function parseCustomDate(dateString: string) {
  // Remove any extra spaces and ensure proper case
  const cleanedString = dateString.replace('p.m.', 'PM').replace('a.m.', 'AM');

  // Parse the cleaned string into a Date object
  const date = new Date(cleanedString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  return date;
}

function formatFor1Day(date: Date) {
  return format(date, 'MMM d, HH:mm');
}

