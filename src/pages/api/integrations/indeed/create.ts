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
	const redirect_uri =
		(process.env.NODE_ENV === "production"
			? process.env.NEXT_PUBLIC_PROD_FRONTEND
			: process.env.NEXT_PUBLIC_DEV_FRONTEND) + "/api/integration/indeed";

	const indeedUrl =
		"https://secure.indeed.com/oauth/v2/authorize?response_type=" +
		"code" +
		"&client_id=" +
		process.env.INDEED_CLIENT_ID +
		"&redirect_uri=" +
		encodeURIComponent(redirect_uri) +
		"&scope=" +
		"email+offline_access+employer_access" +
		"&prompt=" +
		"select_employer";

	return res.redirect(indeedUrl);
}
