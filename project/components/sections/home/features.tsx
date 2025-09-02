import IconCard from "@/components/ui/icon-card";
import {
  Calendar,
  ChartArea,
  Kanban,
  Lock,
  MessageCircleCode,
  Users
} from "lucide-react";

export default function Features() {
  return (
    <div className="bg-neutral-100 py-[100px] dark:bg-neutral-800">
      <div className="container">
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-neutral m-auto text-2xl font-black tracking-tight md:max-w-[700px] md:text-5xl dark:text-neutral-100">
              All the Tools You Need to Stay in Flow
            </p>
            <p className="text-md m-auto mt-3 md:max-w-[700px] md:text-xl dark:text-neutral-300">
              Fluid brings together everything your team needs — Kanban boards,
              task discussions, analytics, calendars, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 md:grid-cols-3">
            <IconCard
              icon={Kanban}
              title="Live Kanban Boards"
              description="Track tasks with live updates across dynamic boards."
            />

            <IconCard
              icon={ChartArea}
              title="Project Analytics"
              description="Get instant insights into team progress and performance."
            />

            <IconCard
              icon={Users}
              title="Team Management"
              description="Collaborate in real-time with full team visibility."
            />

            <IconCard
              icon={MessageCircleCode}
              title="In-Task Discussion"
              description="Comment and communicate directly on tasks to stay aligned."
            />

            <IconCard
              icon={Calendar}
              title="Smart Calendar"
              description="Visualize project timelines and key deadlines at a glance."
            />

            <IconCard
              icon={Lock}
              title="Enterprise Security"
              description="Your data is protected with Clerk authentication."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
