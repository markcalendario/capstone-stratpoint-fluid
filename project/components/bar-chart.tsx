"use client";

import {
  Bar,
  BarChart as Chart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function BarChart({ data }: { data: any }) {
  return (
    <ResponsiveContainer
      width="100%"
      height={400}>
      <Chart
        data={data}
        width={730}
        height={250}
        barCategoryGap="20%"
        barGap={4}>
        <XAxis
          type="category"
          dataKey="name"
        />
        <YAxis
          type="number"
          domain={[0, 100]}
        />
        <Tooltip cursor={{ opacity: "10%" }} />
        <Legend />
        <Bar
          dataKey="Done"
          stackId="a"
          fill="#0d542b"
          unit="%"
        />
        <Bar
          dataKey="Pending"
          stackId="a"
          fill="#e37837"
          unit="%"
        />
      </Chart>
    </ResponsiveContainer>
  );
}
