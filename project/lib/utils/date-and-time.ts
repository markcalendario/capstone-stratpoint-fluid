export function isFutureDate(date: string) {
  const targetDate = new Date(date);
  const currentDate = new Date();

  // Time is set to 00:00 to compare only the date part.
  currentDate.setHours(0, 0, 0, 0);

  return targetDate >= currentDate;
}

export function formatDate(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function formatDateTime(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";

  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

export function getDaysRemaining(dueDate: string | Date): string {
  const today = new Date();
  const due = new Date(dueDate);

  // Zero out the time for accurate day comparison
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffInMs = due.getTime() - today.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} left`;
  } else if (diffInDays < 0) {
    const overdueDays = Math.abs(diffInDays);
    return `${overdueDays} day${overdueDays === 1 ? "" : "s"} ago`;
  } else {
    return "Due today";
  }
}

export function getTimeDifference(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime(); // in milliseconds

  const isFuture = diff > 0;
  const absDiff = Math.abs(diff);

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return isFuture ? `in ${seconds}s` : `${seconds}s ago`;
  } else if (minutes < 60) {
    return isFuture ? `in ${minutes}m` : `${minutes}m ago`;
  } else if (hours < 24) {
    return isFuture ? `in ${hours}h` : `${hours}h ago`;
  } else {
    return isFuture ? `$in {days}d` : `${days} days ago`;
  }
}

export function isOverdue(dueDate: string | Date): boolean {
  const today = new Date();
  const due = new Date(dueDate);

  // Zero out time parts for accurate date-only comparison
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return due < today;
}

export function dayStartOfWeek() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;

  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function formatToHTMLDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
