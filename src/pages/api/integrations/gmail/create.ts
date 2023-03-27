// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Integration } from "@/utils/serverUtils";

const scopes = ["https://www.googleapis.com/auth/gmail.modify", "https://www.googleapis.com/auth/gmail.labels"];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const url = Integration.gmailOAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes
	});

	res.redirect(url);
}
