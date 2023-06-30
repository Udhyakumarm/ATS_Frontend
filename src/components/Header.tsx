import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useCarrierStore, useLangStore, useNotificationStore, useUserStore, useVersionStore } from "@/utils/code";
import Image from "next/image";
import ThemeChange from "./ThemeChange";
import { Popover } from "@headlessui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ToggleLang from "./ToggleLang";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";

export default function Header() {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const { data: session, status: sessionStatus } = useSession();

	const [auth, setauth] = useState(false);

	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);

	const type = useUserStore((state: { type: any }) => state.type);
	const role = useUserStore((state: { role: any }) => state.role);
	const user = useUserStore((state: { user: any }) => state.user);
	const version = useVersionStore((state: { version: any }) => state.version);

	useEffect(() => {
		if (session) {
			setauth(true);
		} else {
			setauth(false);
		}
	}, [session]);

	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const setcname = useCarrierStore((state: { setcname: any }) => state.setcname);
	const jid = useCarrierStore((state: { jid: any }) => state.jid);
	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const vid = useCarrierStore((state: { vid: any }) => state.vid);
	const setcid = useCarrierStore((state: { setcid: any }) => state.setcid);
	const orgdetail: any = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);
	const setorgdetail = useCarrierStore((state: { setorgdetail: any }) => state.setorgdetail);

	const [token, settoken] = useState("");
	const [count, setcount] = useState(0);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	async function loadNotificationCount() {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
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
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		await axiosInstanceAuth2
			.get(`/chatbot/external-read-notification-count/`)
			.then(async (res) => {
				// console.log("!", res.data);
				setcount(res.data.length);
				router.push(`/organization/${cname}/notifications`);
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

	if (
		cname &&
		cname.length > 0 &&
		(router.asPath == "/organization/" + cname ||
			router.asPath == "/organization/" + cname + "/search-jobs" ||
			router.asPath == "/organization/" + cname + "/dashboard" ||
			router.asPath == "/organization/" + cname + "/job-detail" ||
			router.asPath == "/organization/" + cname + "/job-detail/" + jid ||
			router.asPath == "/organization/" + cname + "/job-apply" ||
			router.asPath == "/organization/" + cname + "/notifications" ||
			router.asPath == "/organization/" + cname + "/settings")
	) {
		return (
			<>
				<header className="hello bg-white shadow-normal dark:bg-gray-800">
					<div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-4 py-3 md:px-10 lg:px-14">
						<div className="flex items-center">
							{orgdetail["OrgProfile"] && (
								<Image
									src={
										process.env.NODE_ENV === "production"
											? process.env.NEXT_PUBLIC_PROD_BACKEND + orgdetail["OrgProfile"][0]["logo"]
											: process.env.NEXT_PUBLIC_DEV_BACKEND + orgdetail["OrgProfile"][0]["logo"]
									}
									alt={"Somhako"}
									width={200}
									height={200}
									className="mr-8 max-h-[40px] w-auto"
									onClick={() => {
										router.push("/organization/" + cname);
									}}
								/>
							)}
							<ul className="flex text-sm font-semibold">
								<li className="mx-3">
									<Link
										href={"/organization/" + cname + "/search-jobs"}
										className={
											`inline-block border-b-2 px-2 py-[10px] hover:text-primary` +
											" " +
											(router.pathname == "/organization/" + cname + "/search-jobs"
												? "border-b-primary text-primary"
												: "border-b-transparent")
										}
									>
										{srcLang === "ja" ? "求人検索" : "Search Jobs"}
									</Link>
								</li>
								{auth && (
									<li className="mx-3">
										<Link
											href={"/organization/" + cname + "/dashboard"}
											className={
												`inline-block border-b-2 px-2 py-[10px] hover:text-primary` +
												" " +
												(router.pathname == "/organization/" + cname + "/search-jobs"
													? "border-b-primary text-primary"
													: "border-b-transparent")
											}
										>
											{srcLang === "ja" ? "ダッシュボード" : "Dashboard"}
										</Link>
									</li>
								)}
							</ul>
						</div>
						<div className="flex items-center">
							<p className="bg-blue-500 p-1 text-white">
								{type}&nbsp;{role}
							</p>
							<ThemeChange />
							<ToggleLang />
							{!auth && (
								<Link
									href={"/organization/" + cname + "/candidate/signin"}
									className={
										`ml-4 inline-block border-b-2 px-2 py-[10px] hover:text-primary dark:hover:text-white dark:hover:underline` +
										" " +
										(router.pathname == "/organization/" + cname + "/candidate/signin"
											? "border-b-primary text-primary"
											: "border-b-transparent")
									}
								>
									Sign In
								</Link>
							)}
							{auth && (
								<>
									<div
										className="relative mr-6 cursor-pointer uppercase text-darkGray dark:text-gray-400"
										onClick={() => notification()}
									>
										<i className="fa-regular fa-bell text-[20px]"></i>
										<span className="absolute right-[-10px] top-[-7px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
											{count}
										</span>
									</div>
									{/* <Popover className="relative ml-4 mr-6">
										<Popover.Button>
											<button type="button" className="relative uppercase text-darkGray dark:text-gray-400">
												<i className="fa-regular fa-bell text-[20px]"></i>
												<span className="absolute right-[-10px] top-[-7px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
													99+
												</span>
											</button>
										</Popover.Button>
										<Popover.Panel className="absolute right-0 z-10 w-[280px] rounded bg-white p-4 shadow-normal dark:bg-gray-700">
											<h4 className="mb-3 text-lg font-bold">Notifications</h4>
											<ul className="max-h-[300px] list-disc overflow-y-auto px-4 text-sm font-semibold text-darkGray dark:text-gray-400">
												<li className="py-2">You have applied For Job</li>
												<li className="py-2">Your Profile has been Shortlisted for this Job</li>
												<li className="py-2">Your Profile has been Rejected for this Job</li>
											</ul>
										</Popover.Panel>
									</Popover> */}

									<Popover className="relative">
										<Popover.Button>
											<button type="button" className="h-[35px] w-[35px] rounded-full bg-darkGray text-white">
												{role === "Candidate" ? user[0]["first_name"].charAt(0) : <>S</>}
											</button>
										</Popover.Button>
										<Popover.Panel className="absolute right-0 z-10 w-[150px] overflow-hidden rounded bg-white shadow-normal dark:bg-gray-700">
											<ul className="text-sm">
												<li>
													<Link
														href={`/organization/${cname}/settings`}
														className="block w-full px-4 py-1 py-2 font-bold hover:bg-gray-200 dark:hover:text-black"
													>
														<i className="fa-solid fa-gear mr-3"></i>
														{srcLang === "ja" ? "設定" : "Settings"}
													</Link>
												</li>
												<li>
													<button
														type="button"
														className="block w-full px-4 py-1 py-2 text-left font-bold text-red-500 hover:bg-gray-200"
														onClick={() => {
															signOut({ callbackUrl: `/organization/${cname}` });

															settype("");
															setrole("");
															setuser([]);
														}}
													>
														<i className="fa-solid fa-right-from-bracket mr-3"></i>{" "}
														{srcLang === "ja" ? "ログアウト" : "Logout"}
													</button>
												</li>
											</ul>
										</Popover.Panel>
									</Popover>
								</>
							)}
						</div>
					</div>
				</header>
			</>
		);
	} else if (router.asPath == "/organization") {
		return (
			<>
				<header className="test bg-white shadow-normal dark:bg-gray-800">
					<div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-4 py-3 md:px-10 lg:px-14">
						<Logo url="/" width={205} />
						<div className="flex items-center">
							<p className="bg-blue-500 p-1 text-white">
								{type} | {role}
							</p>

							<p className="bg-green-500 p-1 uppercase text-white">{version}</p>
							<ThemeChange />
							<ToggleLang />
							<button
								type="button"
								className="ml-4 rounded text-xl text-red-500 hover:text-red-600"
								onClick={() => {
									signOut();

									settype("");
									setrole("");
									setuser([]);
								}}
							>
								<i className="fa-solid fa-right-from-bracket"></i>
							</button>
						</div>
					</div>
				</header>
			</>
		);
	}
	// else if (
	// 	vid &&
	// 	vid.length > 0 &&
	// 	(router.asPath == "/vendor/" + vid + "/signup" ||
	// 		router.asPath == "/vendor/" + vid + "/clients" ||
	// 		router.asPath == "/vendor/" + vid + "/inbox" ||
	// 		router.asPath == "/vendor/" + vid + "/settings" ||
	// 		router.asPath == "/vendor/" + vid + "/signin")
	// ) {
	// 	return (
	// 		<>
	// 			<ToggleLang />
	// 			<header className="test2 bg-white shadow-normal dark:bg-gray-800">
	// 				<div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-4 py-3 md:px-10 lg:px-14">
	// 					<Logo url="/" width={205} />
	// 					<div className="flex items-center">
	// 						<p className="bg-blue-500 p-1 text-white">
	// 							{type}&nbsp;{role}
	// 						</p>
	// 						<ThemeChange />
	// 						<button
	// 							type="button"
	// 							className="h-[30px] w-[30px] rounded bg-red-500 text-sm text-white hover:bg-red-600"
	// 							onClick={() => {
	// 								signOut();

	// 								settype("");
	// 								setrole("");
	// 								setuser([]);
	// 							}}
	// 						>
	// 							<i className="fa-solid fa-right-from-bracket"></i>
	// 						</button>
	// 					</div>
	// 				</div>
	// 			</header>
	// 		</>
	// 	);
	// }
	return <></>;
}
