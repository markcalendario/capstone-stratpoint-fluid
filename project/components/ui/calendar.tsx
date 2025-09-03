import moment from "moment";
import { useCallback, useState } from "react";
import {
  Calendar as BigCalendar,
  Event,
  momentLocalizer,
  View
} from "react-big-calendar";
import withDragAndDrop, {
  EventInteractionArgs
} from "react-big-calendar/lib/addons/dragAndDrop";
import "./calendar.css";
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

interface CalendarProps {
  events: Event[];
  onEventDrop: (event: EventInteractionArgs<Event>) => void;
  onSelectEvent: (event: Event) => void;
}

export default function Calendar({
  events,
  onEventDrop,
  onSelectEvent
}: CalendarProps) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const onNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const onView = useCallback((newView: View) => {
    setView(newView);
  }, []);

  return (
    <div className="outline-primary/20 rounded-xs bg-white p-7 outline-1 dark:bg-neutral-800">
      <DragAndDropCalendar
        localizer={momentLocalizer(moment)}
        style={{ height: "500px" }}
        events={events}
        view={view}
        views={["month", "agenda"]}
        date={date}
        onEventDrop={onEventDrop}
        onSelectEvent={onSelectEvent}
        onNavigate={onNavigate}
        onView={onView}
      />
    </div>
  );
}
