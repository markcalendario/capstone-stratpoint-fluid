"use client";

import EventsCalendar from "@/components/sections/calendar/events-calendar";
import UpcomingDeadlines from "@/components/sections/calendar/upcoming-deadlines";
import { Fragment } from "react";

export default function CalendarPage() {
  return (
    <Fragment>
      <EventsCalendar />
      <UpcomingDeadlines />
    </Fragment>
  );
}
