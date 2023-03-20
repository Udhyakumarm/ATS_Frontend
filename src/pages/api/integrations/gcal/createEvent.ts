// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { axiosInstance } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { google } from "googleapis";
import { Integration } from "@/utils/serverUtils";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(401).json({ success: false, error: "Unauthorized" });

	const googleCalendarOAuth2Client = Integration.googleCalendarOAuth2Client;

	const { googleCalendarIntegration } = req.body;

	const expiry_date = Number(googleCalendarIntegration.expires_in) + Date.now();

	googleCalendarOAuth2Client.setCredentials({
		...googleCalendarIntegration,
		expiry_date,
		token_type: "Bearer"
	});

	const event = {
		summary: "Somhako ATS Meeting",
		// location: "800 Howard St., San Francisco, CA 94103",
		description: "Meeting.",
		start: {
			dateTime: new Date().toISOString(),
			timeZone: "America/Los_Angeles"
		},
		end: {
			dateTime: new Date().toISOString(),
			timeZone: "America/Los_Angeles"
		},
		// recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
		// attendees: [{ email: "lpage@example.com" }, { email: "sbrin@example.com" }],
		reminders: {
			useDefault: false,
			overrides: [
				{ method: "email", minutes: 24 * 60 },
				{ method: "popup", minutes: 10 }
			]
		}
	};

	google.options({
		auth: googleCalendarOAuth2Client
	});

	const calendar = google.calendar({ version: "v3" });

	await calendar.events.insert({ calendarId: googleCalendarIntegration.calendar_id, requestBody: event });

	return res.json(googleCalendarIntegration);
}
