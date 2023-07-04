import Button from "@/components/Button";
import { NextApiRequest, NextApiResponse } from "next";
import React, { useState } from "react";
import axios from "axios";

export default function CalendyInt() {
	const [connect, setconnect] = useState(0);

	var clientID = "bybfSdSD7J1bU1E-R8XN43-r-4_L75HuEeanrfibt1s";
	var clientSecert = "S6HHIPUJ1X2plK0KhuNVpamC1F1hzLyd19it2X1V9MU";
	var webhookSigninKey = "gfSOsfglZLItWs3jxmCFKrYHBUxb9w-3-b3CBLJBNV8";

	const axiosInstance2 = axios.create({
		baseURL: "https://auth.calendly.com/oauth/token",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: "Basic bybfSdSD7J1bU1E-R8XN43-r-4_L75HuEeanrfibt1s:S6HHIPUJ1X2plK0KhuNVpamC1F1hzLyd19it2X1V9MU"
		}
	});

	async function handleCLick() {
		// axiosInstance2
		// 	.post("", {
		// 		grant_type: "authorization_code",
		// 		code: "gfSOsfglZLItWs3jxmCFKrYHBUxb9w-3-b3CBLJBNV8",
		// 		redirect_uri: "http://localhost:3000/auth/calendly"
		// 	})
		// 	.then(function (response) {
		// 		console.log("$", response.data);
		// 	})
		// 	.catch(function (error) {
		// 		console.error("$", error);
		// 	});
		const options = {
			method: "GET",
			url: "https://auth.calendly.com/oauth/authorize",
			params: {
				client_id: "bybfSdSD7J1bU1E-R8XN43-r-4_L75HuEeanrfibt1s",
				response_type: "code",
				redirect_uri: "http://localhost:3000/auth/calendly"
			},
			headers: { "Content-Type": "application/json" }
		};

		axios
			.request(options)
			.then(function (response) {
				console.log("$", response.data);
			})
			.catch(function (error) {
				console.error("$", error);
			});
	}

	return (
		<>
			<div>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos, impedit? Saepe voluptatum iure animi minima odit,
				at doloremque velit nemo quo officiis similique nostrum eum mollitia beatae ad illo blanditiis!
			</div>
			<br />
			<br />
			<div>Calendy Integreation : {connect}</div>
			<Button label="connect calendy" btnType="button" btnStyle="outlined" handleClick={handleCLick} />
		</>
	);
}

CalendyInt.noAuth = true;
