import { useCarrierStore, useNotificationStore, useUserStore } from "@/utils/code";
import ThemeChange from "../ThemeChange";
import { signOut, useSession } from "next-auth/react";
import ToggleLang from "../ToggleLang";
import { useState, useEffect } from "react";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useRouter } from "next/router";

export default function VendorTopBar() {
	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);
	const vid = useCarrierStore((state: { vid: any }) => state.vid);
	const type = useUserStore((state: { type: any }) => state.type);
	const role = useUserStore((state: { role: any }) => state.role);
	const user = useUserStore((state: { user: any }) => state.user);
	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [count, setcount] = useState(0);
	const router = useRouter();

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadNotificationCount() {
		await axiosInstanceAuth2
			.get(`/chatbot/external-get-notification-count/`)
			.then(async (res) => {
				// console.log("!", res.data);
				setcount(res.data.length);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	async function notification() {
		await axiosInstanceAuth2
			.get(`/chatbot/external-read-notification-count/`)
			.then(async (res) => {
				// console.log("!", res.data);
				setcount(res.data.length);
				router.push(`/vendor/${vid}/notifications`);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	const load = useNotificationStore((state: { load: any }) => state.load);
	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	useEffect(() => {
		if ((token && token.length > 0) || load) {
			loadNotificationCount();
			if (load) toggleLoadMode(false);
		}
	}, [token, load]);

	return (
		<>
			<div
				id="topbar"
				className="fixed left-0 top-0 z-[12] flex h-[65px] w-full items-center justify-end bg-white px-6 py-3 shadow transition dark:bg-gray-800 lg:left-[270px] lg:w-[calc(100%-270px)]"
			>
				<ThemeChange />
				<div
					className="relative mr-6 cursor-pointer uppercase text-darkGray dark:text-gray-400"
					onClick={() => notification()}
				>
					<i className="fa-regular fa-bell text-[20px]"></i>
					<span className="absolute right-[-10px] top-[-7px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
						{count}
					</span>
				</div>
				<ToggleLang />
				<button
					type="button"
					className="ml-4 rounded text-xl text-red-500 hover:text-red-600"
					onClick={() => {
						signOut({ callbackUrl: `/vendor/${vid}/signin` });

						settype("");
						setrole("");
						setuser([]);
					}}
				>
					<i className="fa-solid fa-right-from-bracket"></i>
				</button>
			</div>
		</>
	);
}
