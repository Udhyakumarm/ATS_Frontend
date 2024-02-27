import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InterviewChart = ({ data }:any) => {
  const formatYAxis = (tickItem:any) => {
    return Math.round(tickItem);
  };

  let maxHires = 0;

	data.forEach((item:any) => {
		if (item.interview > maxHires) {
			maxHires = item.interview;
		}
	});

  if(maxHires > 10){
    maxHires = 10
  }

  return (
		<ResponsiveContainer height={400}>
			<LineChart width={800} height={400} data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" />
				<YAxis domain={[0, "auto"]} tickCount={maxHires} />
				<Tooltip />
				<Legend />
				<Line type="monotone" dataKey="interview" stroke="#0066ff" strokeWidth={2} />
			</LineChart>
		</ResponsiveContainer>
	);
}

export default InterviewChart;
