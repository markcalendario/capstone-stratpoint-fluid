export const priorities = ["low", "medium", "high"] as const;

export const projectTypes = [
  "development",
  "design",
  "quality assurance",
  "testing",
  "devops",
  "data",
  "artificial intelligence",
  "maintenance"
] as const;

export const priorityColors = {
  low: "success",
  medium: "warning",
  high: "error"
} as const;
