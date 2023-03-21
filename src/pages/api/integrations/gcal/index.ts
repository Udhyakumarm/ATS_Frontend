// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { axiosInstance } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { google } from "googleapis";
import { Integration } from "@/utils/serverUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { code, error } = req.query;

	const session = await getServerSession(req, res, authOptions);

	if (!session || !code || error) {
		return res.redirect("/");
	}

	//Get user tokens from google
	const { tokens } = await Integration.googleCalendarOAuth2Client.getToken(code as string);

	const { unique_id } = await axiosInstance.api
		.get("/organization/listorganizationprofile/", { headers: { authorization: "Bearer " + session.accessToken } })
		.then((response) => response.data[0]);

	Integration.googleCalendarOAuth2Client.setCredentials(tokens);

	google.options({
		auth: Integration.googleCalendarOAuth2Client
	});

	await Integration.googleCalendarOAuth2Client.refreshAccessToken();

	const calendar = google.calendar({ version: "v3" });

	//Create new calendar
	const somhakoCalendar = await calendar.calendars
		.insert({
			requestBody: { summary: "Somhako ATS Calendar" }
		})
		.then((resp) => resp.data);

	const expires_in = Number(tokens.expiry_date) - Date.now();

	const response = await axiosInstance.api
		.post(
			"/organization/create_calendar_integration/" + unique_id + "/",
			{
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				expires_in: expires_in,
				scope: tokens.scope,
				provider: "google",
				calendar_id: somhakoCalendar.id
			},
			{ headers: { authorization: "Bearer " + session.accessToken, "Content-Type": "application/json" } }
		)
		.catch((err) => {
			console.log(err);
			return { data: { success: false } };
		});

	const { success } = response.data;

	if (success) {
		return res.redirect("/test");
	} else {
		return res.redirect("/test?error=AuthFailed");
	}
	res.status(200).json({ name: "John Doe" });
}
