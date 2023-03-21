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
	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(200).redirect("/");

	const { unique_id } = await axiosInstance.api
		.get("/organization/listorganizationprofile/", { headers: { authorization: "Bearer " + session?.accessToken } })
		.then((response) => response.data[0])
		.catch((err) => {
			console.log(err);
			return { data: { success: false } };
		});

	const { integrations }: { integrations: Array<any> } = await axiosInstance.api
		.get("/organization/integrations/calendar/" + unique_id + "/", {
			headers: { authorization: "Bearer " + session?.accessToken }
		})
		.then((response) => response.data)
		.catch((err) => {
			console.log(err);
			return { data: { success: false } };
		});

	const googleCalendarIntegration = integrations.find(
		(integration: { provider: string }) => integration.provider == "google"
	);

	if (!googleCalendarIntegration) return res.status(200).json({ success: false, error: "No provider found" });

	const expiry_date = Number(googleCalendarIntegration.expires_in) + Date.now();

	oauth2Client.setCredentials({
		...googleCalendarIntegration,
		expiry_date,
		token_type: "Bearer"
	});

	google.options({
		auth: oauth2Client
	});

	const calendar = google.calendar({ version: "v3" });

	const somhakoCalendar = await calendar.calendars
		.get({ calendarId: googleCalendarIntegration.calendar_id })
		.catch((err) => {
			return err;
		});

	if (somhakoCalendar.errors) {
		if (somhakoCalendar.errors[0].reason == "authError") {
		}
		return res.status(200).json({ success: false, error: somhakoCalendar.errors });
	}

	console.log({ resp: somhakoCalendar });
	// const resp = await calendar.events
	// 	.list({
	// 		calendarId: "primary"
	// Specifies an event ID in the iCalendar format to be provided in the response. Optional. Use this if you want to search for an event by its iCalendar ID.
	// 	})
	// 	.catch((err) => {
	// 		console.log({ error: err.errors });
	// 		return { data: err };
	// 	});

	// if (resp.data.errors && resp.data.errors[0].reason == "authError")
	// 	return res.status(200).redirect("/api/integration/gcal/create");

	res.status(200).json({ data: somhakoCalendar });
}
