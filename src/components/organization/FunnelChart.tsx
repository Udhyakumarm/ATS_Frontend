import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import funnel from "highcharts/modules/funnel";

export default function FunnelChart({ data }: any) {
	const [chartOptions, setchartOptions] = useState({});
	useEffect(() => {
		// Create the spline chart configuration
		setchartOptions({
			chart: {
				type: "funnel"
			},
			title: {
				text: ""
			},
			plotOptions: {
				series: {
					dataLabels: {
						enabled: true,
						format: "<b>{point.name}</b> ({point.y})"
					},
					neckWidth: "30%",
					neckHeight: "25%",
					width: "70%",
					height: "80%"
				}
			},
			series: [
				{
					name: "Funnel",
					data: data
				}
			]
		});
	}, []);

	funnel(Highcharts);

	return (
		<div>
			<HighchartsReact highcharts={Highcharts} options={chartOptions} />
		</div>
	);
}
