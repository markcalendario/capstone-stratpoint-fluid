"use client";

import { TaskStatus } from "@/types/tasks";
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

export type BarChartData<T> = T[];

interface BarChart {
  data: BarChartData<TaskStatus>;
}

export default function BarChart({ data }: BarChart) {
  return (
    <ResponsiveContainer
      width="100%"
      height={400}>
      <Chart
        data={data}
        width={730}
        height={250}
        barGap={4}>
        <CartesianGrid strokeDasharray="3 3" />
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
          fill="#00C49F"
          unit="%"
          opacity="70%"
          stroke="#00C49F"
        />
        <Bar
          dataKey="Pending"
          stackId="a"
          fill="#ffc658"
          unit="%"
          opacity="70%"
          stroke="#ffc658"
        />
      </Chart>
    </ResponsiveContainer>
  );
}
