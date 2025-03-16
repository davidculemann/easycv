import { format, parseISO } from "date-fns";

export const DATE_FORMATS = {
	full: "PPP",
	short: "PP",
	time: "p",
	fullTime: "PPPp",
};

export function formatDate(dateString: string, formatString = DATE_FORMATS.full) {
	return format(parseISO(dateString), formatString);
}
