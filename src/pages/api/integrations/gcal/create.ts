// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Integration } from "@/utils/serverUtils";

const scopes = [
	"https://www.googleapis.com/auth/calendar",
	// "https://www.googleapis.com/auth/calendar.events",
	// "https://www.googleapis.com/auth/calendar.events.readonly",
	// "https://www.googleapis.com/auth/calendar.readonly"
	"https://www.googleapis.com/auth/calendar.app.created"
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const url = Integration.googleCalendarOAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes
	});

	res.redirect(url);
}
