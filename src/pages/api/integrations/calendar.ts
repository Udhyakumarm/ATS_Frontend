// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { axiosInstance } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { google } from "googleapis";
import { Integration } from "@/utils/serverUtils";
import axios from "axios";

interface Integration {
	// 	id: 1,
	//   calendar_id: 'iodp5pe34ea9m8nopqudjd20pc@group.calendar.google.com',
	//   created_at: '2023-07-10T11:13:49.766072Z',
	//   access_token: 'ya29.a0AbVbY6NHWdkEGyJF7NkKVubosD3qs_ufEih43DqzYEVt_kSi3oooac-OEPhb4328ee8MhPbHCPpNAOTLL9mT7EENp9GF5Xpixm1EQ4nTxwaKH14_EliihcdE_HeQPVHY-OLyaXN-weaoBzQ7JbXtjfOREoOXaCgYKASsSARMSFQFWKvPlThQd4lsVulq4UtBqn55ykw0163',
	//   refresh_token: '1//0gvCs93IhlCaVCgYIARAAGBASNwF-L9Ire_RRZcPQYdMwZ22JXsAfFcMTab7XDA1rhOPxo_OpBtCiun8m_Q68biAQriiRaZ5JLA8',
	//   expires_in: 3591518,
	//   is_expired: false,
	//   provider: 'google',
	//   scope: 'https://www.googleapis.com/auth/calendar.app.created https://www.googleapis.com/auth/calendar',
	//   user: 3
	id: number;
	calendar_id: string;
	created_at: string;
	access_token: string;
	refresh_token: string;
	expires_in: number;
	is_expired: boolean;
	provider: string;
	scope: string;
	user: number;
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
						: process.env.NEXT_PUBLIC_DEV_FRONTEND) + "/api/integrations/gcal/refresh",
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
			console.log(err);
			return { data: { success: false } };
		});

	// const { integrations }: { integrations: Array<Integration> } = await axiosInstance.api
	// 	.get("/organization/integrations/calendar/" + unique_id + "/", {
	// 		headers: { authorization: "Bearer " + session?.accessToken }
	// 	})
	// 	.then((response) => response.data)
	// 	.catch((err) => {
	// 		console.log(err);
	// 		return { data: { success: false } };
	// 	});

	const { integrations }: { integrations: Array<any> } = await axiosInstance.api
		.get("/organization/gcal_integrations/calendar/", {
			headers: { authorization: "Bearer " + session?.accessToken }
		})
		.then((response) => response.data)
		.catch((err) => {
			// console.log(err);
			return { data: { success: false } };
		});

	console.log("$", "gcla", "integrations", integrations);

	if (!integrations) return res.status(200).json({ validatedIntegrations: [] });

	const validatedIntegrations = await Promise.all(
		integrations.map(async (integration) => await validateIntegration(integration, req.headers.cookie))
	);

	return res.status(200).json({ validatedIntegrations });
}
