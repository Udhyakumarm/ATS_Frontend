import React from "react";
import { axiosInstance } from "./api/axiosApi";
export default function SignIn() {
	// "https://www.googleapis.com/auth/calendar.events",
	// "https://www.googleapis.com/auth/calendar.events.readonly",
	// "https://www.googleapis.com/auth/calendar.readonly"
	const scopes = [
		"https://www.googleapis.com/auth/calendar",
		"https://www.googleapis.com/auth/calendar.app.created"
	].join(" ");

	async function openGoogleLoginPage() {
		// const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
		// const redirectUri = "api/v1/auth/login/google/";

		// // const scope = [
		// //   'https://www.googleapis.com/auth/userinfo.email',
		// //   'https://www.googleapis.com/auth/userinfo.profile'
		// // ].join(' ');

		// const params = {
		// 	response_type: "code",
		// 	client_id: REACT_APP_GOOGLE_CLIENT_ID,
		// 	redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
		// 	prompt: "select_account",
		// 	access_type: "offline",
		// 	scopes
		// };

		// const urlParams = new URLSearchParams(params).toString();

		// window.location = `${googleAuthUrl}?${urlParams}`;
		await axiosInstance.get("gcal/connect-google-calendar/").then((res) => {
			if (res.data.data) {
				window.location = `${res.data.data}`;
			}
		});
	}

	return (
		<main className="py-8">
			<div className="md:px-26 mx-auto flex h-[100vh] w-full max-w-[1920px] items-center justify-center px-4 lg:px-40 ">
				<div className=" rounded-normal bg-white p-6 dark:bg-gray-800">
					<div className="text-justify text-sm ">
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium esse perferendis dignissimos aliquid
						vero voluptatem, maiores suscipit beatae! Rerum distinctio dicta nemo quae, ex odit esse consectetur
						voluptatem vero libero? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur voluptatibus
						adipisci quam qui totam ratione possimus? Voluptatum assumenda, architecto quisquam odio ab tenetur.
					</div>
					<div className="text-center">
						<button
							className="my-2 w-auto min-w-[60px] rounded border border-primary px-2 py-1 text-[12px] text-primary hover:border-gradDarkBlue hover:bg-gradDarkBlue hover:text-white disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400 disabled:text-white dark:border-gray-300 dark:text-gray-300"
							onClick={openGoogleLoginPage}
						>
							Connect Google
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
