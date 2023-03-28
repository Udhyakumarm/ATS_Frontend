// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { axiosInstance } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { google } from "googleapis";
import { Integration } from "@/utils/serverUtils";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(401).json({ success: false, error: "Unauthorized" });

	const gmailOAuth2Client = Integration.gmailOAuth2Client;

	const { gmailIntegration, message } = req.body;

	const expiry_date = Number(gmailIntegration.expires_in) + Date.now();

	gmailOAuth2Client.setCredentials({
		...gmailIntegration,
		expiry_date,
		token_type: "Bearer"
	});

	google.options({
		auth: gmailOAuth2Client
	});

	const subject = message.subject;
	const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
	const messageParts = [
		// "From: " + message.from,
		"To: " + message.to,
		"Content-Type: text/html; charset=utf-8",
		"MIME-Version: 1.0",
		`Subject: ${utf8Subject}`,
		"",
		message.content
	];
	const newMessage = messageParts.join("\n");

	// The body needs to be base64url encoded.
	const encodedMessage = Buffer.from(newMessage)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");

	const gmail = google.gmail({ version: "v1" });

	const response = await gmail.users.messages.send({
		userId: "me",

		requestBody: {
			raw: encodedMessage,
			labelIds: [gmailIntegration.label_id, "Somhako ATS", "somhako-ats"]
		}
	});

	return res.json({ success: true, response: response.data });
}
