import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const RadarCharts = ({ data }: any) => (
	<ResponsiveContainer width="100%" height={400}>
		<RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
			<PolarGrid />
			<PolarAngleAxis dataKey="stage" />
			<PolarRadiusAxis />
			<Radar name="Count" dataKey="count" stroke="#0066ff" fill="#67a0ea" fillOpacity={0.3} strokeWidth={2} />
		</RadarChart>
	</ResponsiveContainer>
);

export default RadarCharts;