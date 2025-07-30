import AnalyticsCard from "@/components/analytics-card";
import CumulativeFlowDiagram from "@/components/area-chart";
import BarChart from "@/components/bar-chart";
import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import { BarChart3, Clock, TrendingUp, Users } from "lucide-react";

const metrics = [
  {
    title: "Project Velocity",
    value: "8.5",
    unit: "tasks/week",
    icon: TrendingUp,
    color: "blue"
  },
  {
    title: "Team Efficiency",
    value: "92%",
    unit: "completion rate",
    icon: BarChart3,
    color: "green"
  },
  {
    title: "Active Users",
    value: "24",
    unit: "this week",
    icon: Users,
    color: "purple"
  },
  {
    title: "Avg. Task Time",
    value: "2.3",
    unit: "days",
    icon: Clock,
    color: "red"
  }
] as const;

const data = [
  {
    name: "TaskFlow Capstone Project",
    Done: 30,
    Pending: 100 - 30
  },
  {
    name: "Stratpoint Website Redesign",
    Done: 68,
    Pending: 100 - 68
  }
];

const cfdData = [
  { date: "2025-07-01", Todo: 5, InProgress: 3, QA: 1, Review: 0, Done: 5 },
  { date: "2025-07-02", Todo: 4, InProgress: 4, QA: 0, Review: 1, Done: 0 },
  { date: "2025-07-03", Todo: 2, InProgress: 5, QA: 0, Review: 2, Done: 0 },
  { date: "2025-07-04", Todo: 1, InProgress: 3, QA: 0, Review: 0, Done: 0 }
];

export default function AnalyticsPage() {
  return (
    <DashboardContent
      title="Analytics"
      description="Track project performance and team productivity">
      <div className="space-y-6">
        <div>
          <h1 className="text-outer_space-500 dark:text-platinum-500 text-3xl font-bold">
            Analytics
          </h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">
            Track project performance and team productivity
          </p>
        </div>

        {/* Implementation Tasks Banner */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
            📊 Analytics Implementation Tasks
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            <li>
              • Task 6.6: Optimize performance and implement loading states
            </li>
            <li>• Task 8.5: Set up performance monitoring and analytics</li>
          </ul>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <AnalyticsCard
              key={index}
              {...metric}
              className="bg-white dark:bg-neutral-800"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="outline-primary/20 rounded-sm bg-white p-6 outline-2 dark:bg-neutral-800">
            <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Project Progress
            </h3>
            <BarChart data={data} />
          </div>

          <div className="outline-primary/20 rounded-sm bg-white p-6 outline-2 dark:bg-neutral-800">
            <h3 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Team Activity
            </h3>
            <CumulativeFlowDiagram data={cfdData} />
          </div>
        </div>
      </div>
    </DashboardContent>
  );
}
