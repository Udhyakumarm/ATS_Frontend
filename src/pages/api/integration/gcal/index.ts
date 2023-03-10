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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { code, error } = req.query;

	const session = await getServerSession(req, res, authOptions);

	console.log({ session, code, error });
	if (!session || !code || error) {
		//TODO Route to calendar
		return res.redirect("/");
	}

	const { tokens } = await oauth2Client.getToken(code as string);

	const { unique_id } = await axiosInstance.api
		.get("/organization/listorganisationprofile/", { headers: { authorization: "Bearer " + session.accessToken } })
		.then((response) => response.data[0]);

	const expires_in = Number(tokens.expiry_date) - Date.now();

	const response = await axiosInstance.api.post(
		"/organization/create_integration/" + unique_id + "/",
		{
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			expires_in: expires_in,
			scope: tokens.scope,
			provider: "google"
		},
		{ headers: { authorization: "Bearer " + session.accessToken, "Content-Type": "application/json" } }
	);

	const { success } = response.data;

	if (success) {
		return res.redirect("/test");
	} else {
		return res.redirect("/test?error=AuthFailed");
	}
	res.status(200).json({ name: "John Doe" });
}
