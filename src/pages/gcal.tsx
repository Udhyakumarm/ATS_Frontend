import React, { useEffect, useState } from "react";
import { axiosInstance, axiosInstanceAuth } from "./api/axiosApi";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import toastcomp from "@/components/toast";
export default function SignIn() {
	// "https://www.googleapis.com/auth/calendar.events",
	// "https://www.googleapis.com/auth/calendar.events.readonly",
	// "https://www.googleapis.com/auth/calendar.readonly"
	const scopes = [
		"https://www.googleapis.com/auth/calendar",
		"https://www.googleapis.com/auth/calendar.app.created"
	].join(" ");

	// async function openGoogleLoginPage() {
	// 	// const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
	// 	// const redirectUri = "api/v1/auth/login/google/";

	// 	// // const scope = [
	// 	// //   'https://www.googleapis.com/auth/userinfo.email',
	// 	// //   'https://www.googleapis.com/auth/userinfo.profile'
	// 	// // ].join(' ');

	// 	// const params = {
	// 	// 	response_type: "code",
	// 	// 	client_id: REACT_APP_GOOGLE_CLIENT_ID,
	// 	// 	redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
	// 	// 	prompt: "select_account",
	// 	// 	access_type: "offline",
	// 	// 	scopes
	// 	// };

	// 	// const urlParams = new URLSearchParams(params).toString();

	// 	// window.location = `${googleAuthUrl}?${urlParams}`;
	// 	await axiosInstance.get("gcal/connect-google-calendar/").then((res) => {
	// 		if (res.data.data) {
	// 			window.location = `${res.data.data}`;
	// 		}
	// 	});
	// }

	const router = useRouter();
	const { data: session } = useSession();
	const [token, settoken] = useState("");

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	// useEffect(() => {
	// 	if (token && token.length > 0) {
	// 		loadTodo();
	// 		loadAnalytics();
	// 		loadActivityLog();
	// 	}
	// }, [token]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function connectGoogle() {
		await axiosInstanceAuth2.post("gcal/connect-google/").then((res) => {
			if (res.data.authorization_url) {
				router.replace(`${res.data.authorization_url}`);
			} else if (res.data.res === "success") {
				router.replace(`http://localhost:3000/gcal?success=True`);
			}
		});
	}

	async function disconnectGoogle() {
		await axiosInstanceAuth2.post("gcal/disconnect-google/").then((res) => {
			if (res.data.res) {
				router.replace(`http://localhost:3000/gcal`);
				toastcomp(res.data.res, "success");
			}
		});
	}

	const { success } = router.query;
	const { error } = router.query;

	return (
		<main className="py-8">
			<div className="md:px-26 mx-auto flex h-full w-full max-w-[1920px] items-center justify-center px-4 lg:px-40 ">
				<div className=" rounded-normal bg-white p-6 dark:bg-gray-800">
					<div className="text-center text-sm ">
						{success === "True" ? (
							<p className="mb-5 text-lg font-bold">Google Calendar Connected</p>
						) : (
							<>
								<p className="mb-5 text-lg font-bold"> Google Calendar Not Connected </p>
								{error === "1" && (
									<>
										Reason : One GoogleCalander Object Found.
										<br />
										Try Again after some time.
									</>
								)}
								{error === "2" && (
									<>
										Reason : Selected Email Address is Not Org User In ATS.
										<br />
										Try Again after some time.
									</>
								)}
								{error === "3" && (
									<>
										Reason : Selected Email Address is Not Current User Email Address.
										<br />
										Select Current User Email Address.
										<br />
										Try Again after some time.
									</>
								)}
								{error === "4" && (
									<>
										Reason : Refresh Token Error Try Again.
										<br />
										Try Again after some time.
									</>
								)}
								<hr />
							</>
						)}
					</div>
					<div className="text-center">
						{success === "True" ? (
							<button
								className="my-2 w-auto min-w-[60px] rounded border border-primary px-2 py-1 text-[12px] text-primary hover:border-gradDarkBlue hover:bg-gradDarkBlue hover:text-white disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400 disabled:text-white dark:border-gray-300 dark:text-gray-300"
								onClick={disconnectGoogle}
							>
								Disconnect Google
							</button>
						) : (
							<button
								className="my-2 w-auto min-w-[60px] rounded border border-primary px-2 py-1 text-[12px] text-primary hover:border-gradDarkBlue hover:bg-gradDarkBlue hover:text-white disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400 disabled:text-white dark:border-gray-300 dark:text-gray-300"
								onClick={connectGoogle}
							>
								Connect Google
							</button>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
