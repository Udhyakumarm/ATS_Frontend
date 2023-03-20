// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { google } from "googleapis";
import { axiosInstance } from "@/utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

import { Integration } from "@/utils/serverUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(401).json({ success: false, error: "Unauthorized" });

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

	if (!googleCalendarIntegration) return res.json({ success: false, message: "No google provider found." });

	const expiry_date = Number(googleCalendarIntegration.expires_in) + Date.now();

	Integration.googleCalendarOAuth2Client.setCredentials({
		...googleCalendarIntegration,
		expiry_date,
		token_type: "Bearer"
	});

	const refreshedToken = await Integration.googleCalendarOAuth2Client
		.refreshAccessToken()
		.then((response) => response.res?.data)
		.catch((err) => {
			if (err.toString().match("invalid_grant")) return null;
		});

	if (!refreshedToken) {
		const response = await axiosInstance.api
			.post("/organization/delete_calendar_integration/" + googleCalendarIntegration.id + "/", {
				headers: { authorization: "Bearer " + session.accessToken, "Content-Type": "application/json" }
			})
			.then((res) => res.data)
			.catch((err) => {
				console.log(err);
				return { data: { success: false } };
			});

		return res.json({ success: true, response });
	}
	const expires_in = Number(refreshedToken.expiry_date) - Date.now();

	const response = await axiosInstance.api
		.post(
			"/organization/create_calendar_integration/" + unique_id + "/",
			{
				access_token: refreshedToken.access_token,
				refresh_token: refreshedToken.refresh_token,
				expires_in: expires_in,
				scope: refreshedToken.scope,
				provider: "google",
				calendar_id: googleCalendarIntegration.calendar_id
			},
			{ headers: { authorization: "Bearer " + session.accessToken, "Content-Type": "application/json" } }
		)
		.then((res) => res.data)
		.catch((err) => {
			console.log(err);
			return { data: { creationSuccess: false } };
		});

	res.json({ success: true, ...response });
}
