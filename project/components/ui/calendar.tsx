import moment from "moment";
import { useCallback, useState } from "react";
import {
  Calendar as BigCalendar,
  Event,
  momentLocalizer,
  View
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "./calendar.css";
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

interface CalendarProps {
  events: Event[];
  onSelectEvent: (event: Event, e: React.SyntheticEvent<HTMLElement>) => void;
}

export default function Calendar({ events, onSelectEvent }: CalendarProps) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const onNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const onView = useCallback((newView: View) => {
    setView(newView);
  }, []);

  return (
    <div className="outline-primary/20 rounded-sm bg-white p-7 outline-2 dark:bg-neutral-800">
      <DragAndDropCalendar
        localizer={momentLocalizer(moment)}
        style={{ height: "500px" }}
        events={events}
        view={view}
        date={date}
        onSelectEvent={onSelectEvent}
        onNavigate={onNavigate}
        onView={onView}
      />
    </div>
  );
}
