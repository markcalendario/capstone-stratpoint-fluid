"use client";

import {
  Bar,
  CartesianGrid,
  BarChart as Chart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type GroupedDataItem = {
  name: string;
  done: number;
  pending: number;
};

interface GroupedBarChartProps {
  data: GroupedDataItem[];
}

export default function StatusByPriorityChart({ data }: GroupedBarChartProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height={400}>
      <Chart
        data={data}
        width={730}
        height={250}
        barGap={4}
        barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="category"
          dataKey="name"
        />
        <YAxis
          type="number"
          allowDecimals={false}
        />
        <Tooltip cursor={{ opacity: "10%" }} />
        <Legend />
        <Bar
          dataKey="done"
          name="Done"
          fill="#00C49F"
          opacity="70%"
          stroke="#00C49F"
        />
        <Bar
          dataKey="pending"
          name="Pending"
          fill="#ffc658"
          opacity="70%"
          stroke="#ffc658"
        />
      </Chart>
    </ResponsiveContainer>
  );
}
