import moment from "moment";
import {
  Calendar as BigCalendar,
  Event,
  momentLocalizer,
  NavigateAction,
  View
} from "react-big-calendar";
import "./calendar.css";

interface CalendarProps {
  events: Event[];
  onSelectEvent: (event: Event, e: React.SyntheticEvent<HTMLElement>) => void;
  onNavigate?:
    | ((newDate: Date, view: View, action: NavigateAction) => void)
    | undefined;
  defaultView?: View;
}

export default function Calendar({
  events,
  onSelectEvent,
  onNavigate,
  defaultView = "month"
}: CalendarProps) {
  return (
    <div className="outline-primary/20 rounded-sm bg-white p-7 outline-2 dark:bg-neutral-800">
      <BigCalendar
        localizer={momentLocalizer(moment)}
        style={{ height: "500px" }}
        events={events}
        onSelectEvent={onSelectEvent}
        onNavigate={onNavigate}
        defaultView={defaultView}
      />
    </div>
  );
}
