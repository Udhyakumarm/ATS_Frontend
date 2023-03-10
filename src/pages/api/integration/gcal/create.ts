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
	"https://www.googleapis.com/auth/calendar.app.created"
	// "https://www.googleapis.com/auth/blogger",
	// "https://www.googleapis.com/auth/blogger",
	// "https://www.googleapis.com/auth/blogger"
];
export default function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log(req);
	const url = oauth2Client.generateAuthUrl({
		// 'online' (default) or 'offline' (gets refresh_token)
		access_type: "offline",

		// If you only need one scope you can pass it as a string
		scope: scopes
	});

	res.redirect(url);
}
