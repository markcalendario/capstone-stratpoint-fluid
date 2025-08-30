import {
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  isSameDay,
  isValid,
  parseISO,
  startOfDay,
  startOfWeek
} from "date-fns";

/**
 * Check if a date is today or in the future.
 */
export function isFutureDate(date: string): boolean {
  const targetDate = startOfDay(parseISO(date));
  const currentDate = startOfDay(new Date());

  return isAfter(targetDate, currentDate) || isSameDay(targetDate, currentDate);
}

/**
 * Format a date into "MMM DD, YYYY".
 */
export function formatDate(date: string): string {
  const d = parseISO(date);
  return isValid(d) ? format(d, "MMM d, yyyy") : "Invalid Date";
}

/**
 * Format a date and time into "MMM DD, YYYY, HH:mm AM/PM".
 */
export function formatDateTime(date: string): string {
  const d = parseISO(date);
  return isValid(d) ? format(d, "MMM d, yyyy, h:mm a") : "Invalid Date";
}

/**
 * Return the number of days remaining until a due date.
 */
export function getDaysRemaining(dueDate: string | Date): string {
  const today = startOfDay(new Date());
  const due = startOfDay(
    typeof dueDate === "string" ? parseISO(dueDate) : dueDate
  );

  const diff = differenceInCalendarDays(due, today);

  if (diff > 0) {
    return `${diff} day${diff === 1 ? "" : "s"} left`;
  } else if (diff < 0) {
    const overdueDays = Math.abs(diff);
    return `${overdueDays} day${overdueDays === 1 ? "" : "s"} ago`;
  } else {
    return "Due today";
  }
}

/**
 * Get human-readable time difference (e.g. "in 2 days", "3h ago").
 */
export function getTimeDifference(date: string | Date): string {
  const target = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(target)) return "Invalid Date";

  return formatDistanceToNow(target, { addSuffix: true });
}

/**
 * Check if a due date is overdue (i.e. before today).
 */
export function isOverdue(dueDate: string | Date): boolean {
  const today = startOfDay(new Date());
  const due = startOfDay(
    typeof dueDate === "string" ? parseISO(dueDate) : dueDate
  );

  return isBefore(due, today);
}

/**
 * Get the start of the current week (Monday).
 */
export function dayStartOfWeek(): Date {
  return startOfWeek(new Date(), { weekStartsOn: 1 });
}

/**
 * Format a date as `yyyy-MM-dd` (for HTML input[type="date"]).
 */
export function formatToHTMLDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) ? format(d, "yyyy-MM-dd") : "Invalid Date";
}
