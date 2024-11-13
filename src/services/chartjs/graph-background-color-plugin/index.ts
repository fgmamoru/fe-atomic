import { Chart, Plugin } from "chart.js";

export const graphBackgroundColor: Plugin = {
  id: 'custom_canvas_background_color',
  beforeDraw: (chart, args, options) => {
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y },
    } = chart;
    // ctx.save();
    // ctx.globalCompositeOperation = 'destination-over';

    // // draw rounded corners
    // const cornerRadius = 24;
    // ctx.beginPath();
    // ctx.moveTo(left + cornerRadius, top);
    // ctx.lineTo(right - cornerRadius, top);
    // ctx.quadraticCurveTo(right, top, right, top + cornerRadius);
    // ctx.lineTo(right, bottom - cornerRadius);
    // ctx.quadraticCurveTo(right, bottom, right - cornerRadius, bottom);
    // ctx.lineTo(left + cornerRadius, bottom);
    // ctx.quadraticCurveTo(left, bottom, left, bottom - cornerRadius);

    // ctx.lineTo(left, top + cornerRadius);
    // ctx.quadraticCurveTo(left, top, left + cornerRadius, top);
    // ctx.closePath();
    // ctx.clip();
    // console.log("GRAPH OPTIONS", options.get('backgroundColor'));
    // // get from background color config
    // ctx.fillStyle = options.backgroundColor || 'black';
    // ctx.fillRect(left, top, width, height);


    ctx.restore();
  }
};

Chart.register(graphBackgroundColor);