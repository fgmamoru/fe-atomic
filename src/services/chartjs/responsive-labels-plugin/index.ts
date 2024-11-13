import { Chart, Plugin } from "chart.js";


export const responsiveLabelsPlugin: Plugin = {
    id: 'responsiveLabels',
    afterLayout: function (chart) {
        // Check if the screen is small (e.g., below 600px width)
        if (window.innerWidth < 600) {
            // Hide Y-axis on small screens
            //@ts-ignore
            // chart.options.scales.y.display = false;
            //@ts-ignore
            chart.options.scales.yright.display = false;
        } else {
            // Show Y-axis on larger screens
            //@ts-ignore
            // chart.options.scales.y.display = true;
            //@ts-ignore
            chart.options.scales.yright.display = true;

        }
        // chart.draw(); // Ensure the chart gets updated with new scale display options
    }
}

Chart.register(responsiveLabelsPlugin);