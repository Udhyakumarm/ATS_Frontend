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

	const { googleCalendarIntegration, event: newEvent } = req.body;

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

	if (newEvent.platform === "Google Meet") {
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
			dateTime: newEvent.start
		},
		end: {
			dateTime: newEvent.end
		},
		// recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
		// attendees: [{ email: "lpage@example.com" }, { email: "sbrin@example.com" }],
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
		calendarId: googleCalendarIntegration.calendar_id as string,
		requestBody: newGoogleEvent,
		conferenceDataVersion: 1
	});

	return res.json(saveEvent);
}
