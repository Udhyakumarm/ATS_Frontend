import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function SourceChart({ data }: any) {
	const [chartOptions, setchartOptions] = useState({});
	useEffect(() => {
		// Generate random data for the chart
		// var arr = data.map(Number);
		// const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		// Create the spline chart configuration
		setchartOptions({
			chart: {
				type: "pie",
				options3d: {
					enabled: true,
					alpha: 45
				}
			},
			title: {
				text: ""
			},
			subtitle: {
				text: ""
			},
			plotOptions: {
				pie: {
					innerSize: 100,
					depth: 45
				}
			},
			series: [
				{
					name: "Applicants",
					data: data
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
