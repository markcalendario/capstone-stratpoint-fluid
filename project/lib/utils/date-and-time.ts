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
