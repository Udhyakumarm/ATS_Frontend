// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { axiosInstance } from "@/utils";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
type Data = {
	name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	// console.log(req.query);
	const { code, error } = req.query;

	const session = await getServerSession(req, res, authOptions);

	if (!session || error) {
		return res.redirect("/organization/jobs/create?error=AuthFailed");
	}

	const redirect_uri =
		(process.env.NODE_ENV === "production"
			? process.env.NEXT_PUBLIC_PROD_FRONTEND
			: process.env.NEXT_PUBLIC_DEV_FRONTEND) + "/api/integration/indeed";

	const indeedResponse: any = await axios.post(
		"https://apis.indeed.com/oauth/v2/tokens",
		{
			grant_type: "authorization_code",
			code,
			client_id: process.env.INDEED_CLIENT_ID,
			client_secret: process.env.INDEED_CLIENT_SECRET,
			redirect_uri: redirect_uri
		},
		{ headers: { "Content-Type": "application/x-www-form-urlencoded" } }
	);

	const { unique_id } = await axiosInstance.api
		.get("/organization/listorganizationprofile/", { headers: { authorization: "Bearer " + session.accessToken } })
		.then((response) => response.data[0]);

	const response = await axiosInstance.api.post(
		"/organization/create_integration/" + unique_id + "/",
		{
			access_token: indeedResponse.data.access_token,
			expires_in: indeedResponse.data.expires_in,
			scope: indeedResponse.data.scope,
			provider: "indeed"
		},
		{ headers: { authorization: "Bearer " + session.accessToken, "Content-Type": "application/json" } }
	);

	const { success } = response.data;

	if (success) {
		return res.redirect("/organization/jobs/create");
	} else {
		return res.redirect("/organization/jobs/create?error=AuthFailed");
	}
}
