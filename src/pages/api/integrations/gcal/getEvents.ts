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
	google.options({
		auth: googleCalendarOAuth2Client
	});

	const calendar = google.calendar({ version: "v3" });

	const eventsList = await calendar.events.list({ calendarId: googleCalendarIntegration.calendar_id });

	console.log({ eventsList: eventsList.data });
	return res.json(eventsList.data);
}
