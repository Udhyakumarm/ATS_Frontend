import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function AnalyticsChart({ data }: any) {
	const [chartOptions, setchartOptions] = useState({});
	useEffect(() => {
		// Generate random data for the chart
		var arr = data.map(Number);
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		// Create the spline chart configuration
		setchartOptions({
			chart: {
				type: "spline"
			},
			title: {
				text: ""
			},
			xAxis: {
				categories: months
			},
			series: [
				{
					name: "Hiring Trends",
					data: arr
				}
			]
		});

		// // Render the chart
		// Highcharts.chart('chartContainer', chartOptions);
	}, []);

	return (
		<div>
			<HighchartsReact highcharts={Highcharts} options={chartOptions} />
		</div>
	);
}
