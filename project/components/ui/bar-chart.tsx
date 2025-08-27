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

export type ProjectProgressChartData<T> = T[];

interface ProjectProgressChartProps {
  data: ProjectProgressChartData<TaskStatus>;
}

export default function ProjectProgressChart({
  data
}: ProjectProgressChartProps) {
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
          dataKey="done"
          name="Done"
          stackId="stack"
          fill="#00C49F"
          unit="%"
          opacity="70%"
          stroke="#00C49F"
        />
        <Bar
          dataKey="pending"
          name="Pending"
          stackId="stack"
          fill="#ffc658"
          unit="%"
          opacity="70%"
          stroke="#ffc658"
        />
      </Chart>
    </ResponsiveContainer>
  );
}
