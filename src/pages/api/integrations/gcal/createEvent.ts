// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { axiosInstance } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { google } from "googleapis";
import { Integration } from "@/utils/serverUtils";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(401).json({ success: false, error: "Unauthorized" });

	const googleCalendarOAuth2Client = Integration.googleCalendarOAuth2Client;

	const {
		googleCalendarIntegration,
		event: newEvent
	}: { googleCalendarIntegration: CalendarIntegration; event: CalendarEvent } = req.body;

	const expiry_date = Number(googleCalendarIntegration.expires_in) + Date.now();

	googleCalendarOAuth2Client.setCredentials({
		...googleCalendarIntegration,
		expiry_date,
		token_type: "Bearer"
	});

	google.options({
		auth: googleCalendarOAuth2Client
	});

	const calendar = google.calendar({ version: "v3" });

	let conferenceData = {};

	if (newEvent.platform[0].name === "Google Meet") {
		conferenceData = {
			createRequest: {
				requestId: crypto.randomBytes(20).toString("hex"),
				conferenceSolutionKey: {
					type: "hangoutsMeet"
				}
			}
		};
	}

	const newGoogleEvent = {
		summary: newEvent.summary,
		description: newEvent.description + "\n" + "ATS:" + newEvent.type.toString(),
		start: {
			dateTime: newEvent.start.toString()
		},
		end: {
			dateTime: newEvent.end.toString()
		},
		// recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
		attendees: newEvent.attendees,
		reminders: {
			useDefault: false,
			overrides: [
				{ method: "email", minutes: 24 * 60 },
				{ method: "popup", minutes: 10 }
			]
		},
		conferenceData: conferenceData
	};

	const saveEvent = await calendar.events.insert({
		calendarId: googleCalendarIntegration.calendar_id,
		requestBody: newGoogleEvent,
		conferenceDataVersion: 1
	});

	return res.json(saveEvent);
}
