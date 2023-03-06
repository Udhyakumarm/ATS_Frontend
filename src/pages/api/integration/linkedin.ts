// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { axiosInstance } from "@/utils";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

type Data = {
	name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	console.log(req.query);
	const { code, error } = req.query;

	const session = await getSession();

	if (!session) {
		return res.redirect("/organization/jobs/create?error=AuthFailed");
	}

	const linkedinResponse: any = await axios.post(
		"https://www.linkedin.com/oauth/v2/accessToken",
		{
			grant_type: "authorization_code",
			code,
			client_id: process.env.LINKEDIN_APP_CLIENT_ID,
			client_secret: process.env.LINKEDIN_APP_CLIENT_SECRET,
			redirect_uri: "http://localhost:3000/api/integration/linkedin"
		},
		{ headers: { "Content-Type": "application/x-www-form-urlencoded" } }
	);

	const { orefid } = await axiosInstance.api
		.get("/organization/listorganisationaccount/", { headers: { authorization: "Bearer " + session.accessToken } })
		.then((response) => response.data[0]);

	console.log({ orefid });

	const response = await axiosInstance.api.post("/organization/create_integration/" + orefid + "/", {
		access_token: linkedinResponse.data.access_token,
		expires_in: linkedinResponse.data.expires_in,
		scope: linkedinResponse.data.scope,
		provider: "linkedin"
	});

	const { success } = response.data;

	if (success) {
		return res.redirect("/organization/jobs/create");
	} else {
		return res.redirect("/organization/jobs/create?error=AuthFailed");
	}
}
