// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { axiosInstance } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { google } from "googleapis";
import { Integration } from "@/utils/serverUtils";
import axios from "axios";

interface Integration {
	organization: string;
	created_at: string;
	access_token: string;
	refresh_token: string;
	expires_in: number;
	is_expired: boolean;
	provider: string;
	scope: string;
	calendar_id: string;
}

const validateIntegration = async (integration: Integration, cookie: string | undefined) => {
	switch (integration.provider) {
		case "google": {
			const oauth2Client = Integration.googleCalendarOAuth2Client;
			const expiry_date = Number(integration.expires_in) + Date.now();

			oauth2Client.setCredentials({
				...integration,
				expiry_date,
				token_type: "Bearer"
			});

			const refreshedIntegration = await axios
				.get(
					(process.env.NODE_ENV === "production"
						? process.env.NEXT_PUBLIC_PROD_FRONTEND
						: process.env.NEXT_PUBLIC_DEV_FRONTEND) + "/api/integrations/gmail/refresh",
					{
						headers: {
							"Content-Type": "application/json",
							cookie: cookie
						}
					}
				)
				.then((response) => response.data);
			if (refreshedIntegration.success) return refreshedIntegration.newIntegration;
		}
	}
	return;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(200).redirect("/");

	const { unique_id } = await axiosInstance.api
		.get("/organization/listorganizationprofile/", { headers: { authorization: "Bearer " + session?.accessToken } })
		.then((response) => response.data[0])
		.catch((err) => {
			// console.log(err);
			return { data: { success: false } };
		});

	const { integrations }: { integrations: Array<Integration> } = await axiosInstance.api
		.get("/organization/integrations/mail/" + unique_id + "/", {
			headers: { authorization: "Bearer " + session?.accessToken }
		})
		.then((response) => response.data)
		.catch((err) => {
			// console.log(err);
			return { data: { success: false } };
		});

	if (!integrations) return res.status(200).json({ validatedIntegrations: [] });

	const validatedIntegrations = await Promise.all(
		integrations.map(async (integration) => await validateIntegration(integration, req.headers.cookie))
	);

	return res.status(200).json({ validatedIntegrations });
}
