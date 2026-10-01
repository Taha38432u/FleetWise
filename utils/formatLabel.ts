export function formatLabel(value: unknown) {
  if (value === null || typeof value === "undefined" || value === "") {
    return "Not available";
  }

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
