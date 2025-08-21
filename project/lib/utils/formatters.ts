export function stripHTML(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

export function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
