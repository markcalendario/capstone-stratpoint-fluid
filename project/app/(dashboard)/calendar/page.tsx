"use client";

import EventsCalendar from "@/components/sections/calendar/events-calendar";
import DeadlineBar from "@/components/ui/deadline-bar";
import { Fragment } from "react";

export default function CalendarPage() {
  return (
    <Fragment>
      <EventsCalendar />
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
    </Fragment>
  );
}
