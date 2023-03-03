import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import dashboardIcon from "/public/images/icons/dashboard.png";
import integrationIcon from "/public/images/icons/integration.png";
import jobsIcon from "/public/images/icons/jobs.png";
import analyticsIcon from "/public/images/icons/analytics.png";
import vendorsIcon from "/public/images/icons/vendors.png";
import applicantsIcon from "/public/images/icons/applicants.png";
import collectionIcon from "/public/images/icons/collection.png";

export default function Home() {}

import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export async function getServerSideProps(context: any) {
	const session: any = await getServerSession(context.req, context.res, authOptions);
	if (!session)
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false
			}
		};

	return {
		redirect: {
			destination: session.user_type !== "candidate" ? "/organization" : "/candidate",
			permanent: false
		}
	};

	return {
		props: {}
	};
}
