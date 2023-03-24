import { google } from "googleapis";

export namespace Integration {
	export const googleCalendarOAuth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_INTEGRATION_CLIENT_ID,
		process.env.GOOGLE_INTEGRATION_CLIENT_SECRET,
		(process.env.NODE_ENV === "production"
			? process.env.NEXT_PUBLIC_PROD_FRONTEND
			: process.env.NEXT_PUBLIC_DEV_FRONTEND) + "/api/integrations/gcal"
	);

	export const gmailOAuth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_INTEGRATION_CLIENT_ID,
		process.env.GOOGLE_INTEGRATION_CLIENT_SECRET,
		(process.env.NODE_ENV === "production"
			? process.env.NEXT_PUBLIC_PROD_FRONTEND
			: process.env.NEXT_PUBLIC_DEV_FRONTEND) + "/api/integrations/gmail"
	);
}
