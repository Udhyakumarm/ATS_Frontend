// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { axiosInstance } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { google } from "googleapis";
import { Integration } from "@/utils/index";

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
const validateIntegration = (integration: Integration) => {
	return integration;
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

	const { integrations }: { integrations: Array<Integration> } = await axiosInstance.api
		.get("/organization/integrations/calendar/" + unique_id + "/", {
			headers: { authorization: "Bearer " + session?.accessToken }
		})
		.then((response) => response.data)
		.catch((err) => {
			console.log(err);
			return { data: { success: false } };
		});

	const validatedIntegrations = integrations.map((integration) => validateIntegration(integration));

	res.status(200).json({ validatedIntegrations });
}
