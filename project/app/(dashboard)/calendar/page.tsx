"use client";

import Button from "@/components/button";
import Calendar from "@/components/calendar";
import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import DeadlineBar from "@/components/ui/deadline-bar";
import { Plus } from "lucide-react";

export default function CalendarPage() {
  return (
    <DashboardContent
      title="Calendar"
      description="View project deadlines and team schedules">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button className="bg-primary text-neutral-100 dark:bg-white dark:text-neutral-900">
            <Plus
              size={20}
              className="mr-2"
            />
            Add Event
          </Button>
        </div>

        {/* Implementation Tasks Banner */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
            📅 Calendar Implementation Tasks
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            <li>• Task 6.2: Add task due dates, priorities, and labels</li>
            <li>• Task 6.6: Add bulk task operations and keyboard shortcuts</li>
          </ul>
        </div>

        {/* Calendar Header */}
        <Calendar
          events={[
            {
              title: "Team Meeting",
              start: new Date(2025, 6, 30, 10, 0), // July 30, 2025, 10:00 AM
              end: new Date(2025, 6, 30, 11, 0) // July 30, 2025, 11:00 AM
            }
          ]}
          onSelectEvent={(evt) => console.log("Selected event:", evt)}
        />

        {/* Upcoming Events */}
        <div className="border-primary/20 space-y-3 rounded-sm border-2 bg-white p-5 dark:bg-neutral-800">
          <h3 className="text-neutral-700 dark:text-neutral-200">
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {[
              {
                title: "Website Redesign",
                date: "Dec 15, 2024",
                label: "Project Deadline"
              },
              { title: "Team Meeting", date: "Dec 18, 2024", label: "Meeting" },
              {
                title: "Mobile App Launch",
                date: "Dec 22, 2024",
                label: "Milestone"
              }
            ].map((event, index) => (
              <DeadlineBar
                {...event}
                key={index}
                className="bg-neutral-100 dark:bg-neutral-900"
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardContent>
  );
}
