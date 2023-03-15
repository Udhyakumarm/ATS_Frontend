// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_INTEGRATION_CLIENT_ID,
	process.env.GOOGLE_INTEGRATION_CLIENT_SECRET,
	(process.env.NODE_ENV === "production"
		? process.env.NEXT_PUBLIC_PROD_FRONTEND
		: process.env.NEXT_PUBLIC_DEV_FRONTEND) + "/api/integration/gcal"
);

const scopes = [
	"https://www.googleapis.com/auth/calendar",
	"https://www.googleapis.com/auth/calendar.events",
	"https://www.googleapis.com/auth/calendar.events.readonly",
	"https://www.googleapis.com/auth/calendar.readonly"
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes
	});

	res.redirect(url);
}
