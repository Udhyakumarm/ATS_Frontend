interface CalendarEvent {
	summary: string;
	description: string;
	platform: Array<{ name: "Google Meet" | "Telephonic" | "" }>;
	type: Array<{ name: "Interview" | "General Meeting" | "" }>;
	start: Date;
	end: Date;
}
