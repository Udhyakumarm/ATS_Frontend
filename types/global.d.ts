interface CalendarEvent {
	summary: string;
	description: string;
	platform: Array<{ name: "Google Meet" | "Telephonic" | "" }>;
	type: Array<{ name: "Interview" | "General Meeting" | "" }>;
	start: Date;
	end: Date;
}

interface Integration {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	is_expired: boolean;
	provider: string;
	scope: string;
}

interface CalendarIntegration extends Integration {
	calendar_id: string;
}

interface MailIntegration extends Integration {
	labelId: string;
}
