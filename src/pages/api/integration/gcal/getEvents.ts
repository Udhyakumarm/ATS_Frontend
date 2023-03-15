// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { axiosInstance } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_INTEGRATION_CLIENT_ID,
	process.env.GOOGLE_INTEGRATION_CLIENT_SECRET,
	(process.env.NODE_ENV === "production"
		? process.env.NEXT_PUBLIC_PROD_FRONTEND
		: process.env.NEXT_PUBLIC_DEV_FRONTEND) + "/api/integration/gcal"
);

oauth2Client.on("tokens", (tokens) => {
	if (tokens.refresh_token) {
		// store the refresh_token in my database!
		console.log({ refresh: tokens.refresh_token });
	}
	console.log({ access_token: tokens.access_token });
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { code, error } = req.query;

	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(200).json({ success: false, error: "Not authenticated" });

	const { unique_id } = await axiosInstance.api
		.get("/organization/listorganisationprofile/", { headers: { authorization: "Bearer " + session?.accessToken } })
		.then((response) => response.data[0])
		.catch((err) => {
			console.log(err);
			return { data: { success: false } };
		});

	const { integrations }: { integrations: Array<any> } = await axiosInstance.api
		.get("/organization/integrations/" + unique_id + "/", {
			headers: { authorization: "Bearer " + session?.accessToken }
		})
		.then((response) => response.data)
		.catch((err) => {
			console.log(err);
			return { data: { success: false } };
		});

	const googleAuth = integrations.find((integration: { provider: string }) => integration.provider == "google");

	// console.log({ googleAuth, expired :  Number(googleAuth.expires_in) + Date.now() > Date});
	if (!googleAuth) return res.status(200).json({ success: false, error: "No provider found" });
	const expiry_date = Number(googleAuth.expires_in) + Date.now();

	oauth2Client.setCredentials({
		...googleAuth,
		expiry_date,
		token_type: "Bearer"
	});

	google.options({
		auth: oauth2Client
	});

	const calendar = await google.calendar({ version: "v3" });

	const resp = await calendar.events
		.list({
			calendarId: "primary"
			// Specifies an event ID in the iCalendar format to be provided in the response. Optional. Use this if you want to search for an event by its iCalendar ID.
		})
		.catch((err) => {
			console.log({ error: err.errors });
			return { data: null };
		});
	res.status(200).json({ data: resp?.data });
}
