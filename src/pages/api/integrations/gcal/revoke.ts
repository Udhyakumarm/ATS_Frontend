// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { google } from "googleapis";
import { axiosInstance } from "@/utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { Integration } from "@/utils/serverUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(200).redirect("/");

	const { unique_id } = await axiosInstance.api
		.get("/organization/listorganizationprofile/", { headers: { authorization: "Bearer " + session.accessToken } })
		.then((response) => response.data[0]);

	const { integrations }: { integrations: Array<any> } = await axiosInstance.api
		.get("/organization/integrations/calendar/" + unique_id + "/", {
			headers: { authorization: "Bearer " + session?.accessToken }
		})
		.then((response) => response.data)
		.catch((err) => {
			console.log({ err: err.data });
			return { data: { success: false } };
		});

	const googleCalendarIntegration = integrations.find(
		(integration: { provider: string }) => integration.provider == "google"
	);

	const expiry_date = Number(googleCalendarIntegration.expires_in) + Date.now();

	Integration.googleCalendarOAuth2Client.setCredentials({
		...googleCalendarIntegration,
		expiry_date,
		token_type: "Bearer"
	});

	google.options({
		auth: Integration.googleCalendarOAuth2Client
	});

	const calendar = google.calendar({ version: "v3" });

	const deletionResp = await calendar.calendars
		.delete({
			calendarId: googleCalendarIntegration.calendar_id
		})
		.then((resp) => resp.data)
		.catch((err) => err);

	await Integration.googleCalendarOAuth2Client.revokeCredentials();

	const response = await axiosInstance.api
		.post("/organization/delete_calendar_integration/" + googleCalendarIntegration.id + "/", {
			headers: { authorization: "Bearer " + session.accessToken, "Content-Type": "application/json" }
		})
		.then((res) => res.data)
		.catch((err) => {
			console.log(err);
			return { data: { success: false } };
		});

	res.json({ success: true, deletionResp, response });
}
