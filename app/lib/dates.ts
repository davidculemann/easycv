import { format, parseISO } from "date-fns";

export function formatDate(dateString: string) {
	return format(parseISO(dateString), "PPP"); // e.g., "April 29, 2023"
	// or use other format strings:
	// 'PP' -> "Apr 29, 2023"
	// 'p' -> "12:00 AM"
	// 'Pp' -> "Apr 29, 2023, 12:00 AM"
}
