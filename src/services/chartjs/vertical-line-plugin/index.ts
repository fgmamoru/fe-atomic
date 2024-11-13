import { Chart, Plugin } from "chart.js";

declare module 'chart.js' {
  interface Chart {
    verticalLineOnHover: {
      x: number;
      draw?: boolean;
    };
  }
}

const verticalLinePlugin: Plugin = {
  id: 'verticalLineOnHover',
  defaults: {
    width: 2,
    color: '#FFFFFF66',
    dash: [3, 3],
  },
  afterInit: (chart, args, opts) => {
    chart.verticalLineOnHover = {
      x: 0,
    }
  },
  afterEvent: (chart, args) => {
    const { inChartArea } = args
    const { type, x, y } = args.event
    // x position of tooltip
    const xTooltip = chart?.tooltip?.dataPoints?.[0]?.element?.x


    chart.verticalLineOnHover = { x: xTooltip as number, draw: inChartArea }
    chart.draw()
  },


  beforeDatasetsDraw: (chart, args, opts) => {
    const { ctx } = chart
    const { top, bottom, left, right } = chart.chartArea
    const { x, draw } = chart.verticalLineOnHover
    if (!draw) return

    ctx.save()

    ctx.beginPath()
    ctx.lineWidth = opts.width
    ctx.strokeStyle = opts.color
    ctx.setLineDash(opts.dash)
    ctx.moveTo(x, bottom)
    ctx.lineTo(x, top)
    // ctx.moveTo(left, y)
    // ctx.lineTo(right, y)
    ctx.stroke()

    ctx.restore()
  }
};

Chart.register(verticalLinePlugin);
