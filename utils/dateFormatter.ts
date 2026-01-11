import { format, parseISO, isValid, formatDistanceToNow } from "date-fns";

/**
 * Formats a date string or Date object to a readable format
 * @param date - ISO string or Date object
 * @param formatStr - Format pattern (default: "MMM dd, yyyy")
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date | null | undefined,
  formatStr: string = "MMM dd, yyyy"
): string => {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return "-";
    }

    return format(dateObj, formatStr);
  } catch (error) {
    console.warn("Invalid date:", date);
    return "-";
  }
};

/**
 * Formats a date to display with time (e.g., "Jan 15, 2025 3:30 PM")
 */
export const formatDateTime = (
  date: string | Date | null | undefined
): string => {
  return formatDate(date, "MMM dd, yyyy h:mm a");
};

/**
 * Formats a date to short format (e.g., "01/15/2025")
 */
export const formatDateShort = (
  date: string | Date | null | undefined
): string => {
  return formatDate(date, "MM/dd/yyyy");
};

/**
 * Formats a date to long format (e.g., "January 15, 2025")
 */
export const formatDateLong = (
  date: string | Date | null | undefined
): string => {
  return formatDate(date, "MMMM dd, yyyy");
};

/**
 * Formats a date for input fields (e.g., "2025-01-15")
 */
export const formatDateInput = (
  date: string | Date | null | undefined
): string => {
  return formatDate(date, "yyyy-MM-dd");
};

/**
 * Formats a date to relative time (e.g., "2 days ago")
 * Note: Use date-fns formatDistanceToNow for this
 */
export const formatDateRelative = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return "-";
    }

    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.warn("Invalid date:", date);
    return "-";
  }
};

/**
 * Formats a date to time only (e.g., "3:30 PM")
 */
export const formatTime = (
  date: string | Date | null | undefined
): string => {
  return formatDate(date, "h:mm a");
};

/**
 * Check if a date is expired
 */
export const isDateExpired = (
  date: string | Date | null | undefined
): boolean => {
  if (!date) return true;

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return true;
    }

    return dateObj < new Date();
  } catch (error) {
    return true;
  }
};

/**
 * Format date range (e.g., "Jan 15 - Jan 20, 2025")
 */
export const formatDateRange = (
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined
): string => {
  const start = formatDate(startDate, "MMM dd");
  const end = formatDate(endDate, "MMM dd, yyyy");

  if (start === "-" || end === "-") return "-";

  return `${start} - ${end}`;
};
