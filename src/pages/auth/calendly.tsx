import Button from "@/components/Button";
import { NextApiRequest, NextApiResponse } from "next";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import qs from "qs";

export default function CalendyInt() {
	const [connect, setconnect] = useState(0);

	var clientID = "bybfSdSD7J1bU1E-R8XN43-r-4_L75HuEeanrfibt1s";
	var clientSecert = "S6HHIPUJ1X2plK0KhuNVpamC1F1hzLyd19it2X1V9MU";
	var webhookSigninKey = "gfSOsfglZLItWs3jxmCFKrYHBUxb9w-3-b3CBLJBNV8";

	const router = useRouter();

	const { code } = router.query;
	// const code = "123";

	function step1() {
		let baseURL = "https://auth.calendly.com/oauth/authorize";
		let client_id = "bybfSdSD7J1bU1E-R8XN43-r-4_L75HuEeanrfibt1s";
		let response_type = "code";
		let redirect_uri = "http://localhost:3000/auth/calendly";
		router.push(`${baseURL}?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}`);
	}

	async function step2(code: any) {
		let data = qs.stringify({
			grant_type: "authorization_code",
			code: code,
			redirect_uri: "http://localhost:3000/auth/calendly"
		});
		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://auth.calendly.com/oauth/token",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic YnliZlNkU0Q3SjFiVTFFLVI4WE40My1yLTRfTDc1SHVFZWFucmZpYnQxczpTNkhISVBVSjFYMnBsSzBLaHVOVnBhbUMxRjFoekx5ZDE5aXQyWDFWOU1V"
			},
			data: data
		};

		try {
			const response = await axios.request(config);
			console.log(JSON.stringify(response.data));
		} catch (error) {
			console.log(error);
			router.push("/auth/calendly");
		}
	}

	useEffect(() => {
		console.log("$", "router", router);
	}, [router]);

	return (
		<>
			<Head>
				<title>{"Calendy Integreation"}</title>
			</Head>
			<main className="h-[100vh] py-8">
				<div className="flex h-full w-full items-center justify-center px-4">
					<div className="max-w-[550px] rounded-large bg-white p-6 shadow-normal dark:bg-gray-800 md:px-12 md:py-8">
						<div className="font-bold">Calendly Integration</div>
						<div className="mt-4 flex justify-center">
							{!code && <Button label="Step 1" btnType="button" btnStyle="outlined" handleClick={step1} />}
							{code && <Button label="Step 2" btnType="button" btnStyle="outlined" handleClick={() => step2(code)} />}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

CalendyInt.noAuth = true;
