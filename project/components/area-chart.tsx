"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface CFDProps {
  data: { [key: string]: number | string }[];
}

// Default color palette
const defaultColors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#00C49F",
  "#a78bfa",
  "#facc15",
  "#f87171",
  "#10b981",
  "#3b82f6"
];

export default function CumulativeFlowDiagram({ data }: CFDProps) {
  const keys = Object.keys(data[0] || {}).filter((k) => k !== "date");

  return (
    <ResponsiveContainer
      width="100%"
      height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {keys.map((key, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="1"
            stroke={defaultColors[index % defaultColors.length]}
            fill={defaultColors[index % defaultColors.length]}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
