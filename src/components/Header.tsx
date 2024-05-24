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
import moment from "moment";
import toast from "react-hot-toast";
import Joyride,{STATUS} from "react-joyride";
import useJoyrideStore from "@/utils/joyride";
import { title } from "process";
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
	const reminder = useNotificationStore((state: { reminder: any }) => state.reminder);
	const togglereminderMode = useNotificationStore((state: { togglereminderMode: any }) => state.togglereminderMode);
	const { shouldShowJoyride, isJoyrideCompleted, showJoyride, completeJoyride,resetTour } = useJoyrideStore();
	useEffect(() => {
		if (!isJoyrideCompleted && role==="Candidate") {
			showJoyride();
		}
	}, [isJoyrideCompleted, showJoyride]);
	// console.log("shouldshowjoyride", shouldShowJoyride)
	// console.log("isjouride completed", isJoyrideCompleted)
	const joyrideSteps=[
		{
			target: ".searchjob",
			disableBeacon: true,
			title:srcLang === "ja" ? "求人検索" : "Search Jobs",
			content: "This section has all the active jobs available for you to apply. You can search for jobs based on your preferences and apply for them directly from here.",
			placement: "bottom",
			disableOverlayClose: true,
			// hideCloseButton: true,
			styles: {
				options: {
					zIndex: 10000
				}
			}
		},
		{
			target: ".dashboard",
			disableBeacon: true,
			title:srcLang === "ja" ? "ダッシュボード" : "Dashboard",
			content:"Here you can see all the jobs you have applied for and the status of your applications. You can also see the jobs you have been shortlisted for and the jobs you have been rejected for and see the offers you have received.",
			placement: "bottom",
			disableOverlayClose: true,
			hideCloseButton: true,
			styles: {
				options: {
					zIndex: 10000
				}
			}
		},
		{
			target: ".settings",
			disableBeacon: true,
			title:"Profile",
			content:"Click on this profile icon to view your profile settings. You can also logout from here.",
			placement: "bottom",
			disableOverlayClose: true,
			spotlightClicks: true,
			hideCloseButton: true,
			styles: {
				options: {
					zIndex: 10000
				}
			}
		},
		// {
		// 	target: ".last",
		// 	disableBeacon: true,
		// 	title:"Settings",
		// 	content:"Click here to view your profile settings",
		// 	placement: "left",
		// 	disableOverlayClose: true,
		// 	spotlightClicks: true,
		// 	hideCloseButton: true,
		// 	hideFooter: true,
		// 	styles: {
		// 		options: {
		// 			zIndex: 10000
		// 		}
		// 	}
		// },
		
	]

	// useEffect(() => {
	// 	if ((token && token.length > 0) || load) {
	// 		loadNotificationCount();
	// 		if (load) toggleLoadMode(false);
	// 		if (reminder.length > 0) reminderPopUp(reminder);
	// 	}
	// }, [token, load, reminder]);

	// function reminderPopUp(rdate: any) {
	// 	let daysCOunt = moment(rdate).add(60, "days").diff(moment(), "days") + " Days Left";
	// 	toast(daysCOunt, {
	// 		duration: 4000,
	// 		position: "top-right",
	// 		style: {
	// 			background: "#363636",
	// 			color: "#fff"
	// 		},
	// 		icon: <i className="fa-solid fa-bell"></i>,
	// 		ariaProps: {
	// 			role: "status",
	// 			"aria-live": "polite"
	// 		}
	// 	});
	// 	togglereminderMode("");
	// }

	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsOpen(false);
		}
	}, [router]);

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
				<header className="hello  bg-white shadow-normal dark:bg-gray-800">
				<Joyride
							steps={joyrideSteps}
							run={shouldShowJoyride}
							styles={{
								options: {
									arrowColor: "#0066ff", // Set to primary color
									backgroundColor: "#F5F8FA", // Set to lightBlue
									overlayColor: "rgba(0, 0, 0, 0.4)", // Adjusted to match your styling
									primaryColor: "#0066ff", // Set to primary color
									textColor: "#3358c5", // Set to secondary color
									// width: 100, // Adjust as needed
									zIndex: 1000 // Set as needed
								}
							}}
							continuous={true}
							showProgress={true}
							// showSkipButton={true}
							callback={(data: any) => {
								const { action, status, step } = data;
								
								// if ((action === "next" || action === "back") && status === "ready") {
								// 	if (action === "next" && status === "running") {
								// 		setStepIndex((prevStep) => prevStep + 1);
								// 	} else if (action === "back") {
								// 		setStepIndex((prevStep) => Math.max(prevStep - 1, 0)); // Ensure currentStep doesn't go below 0
								// 	}
								// }
								if([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
									completeJoyride();
								}
								// if (action === "close") {
								// 	setIsTourOpen(false);
								// 	setTourCompleted(true);
								// 	// setShowSidebarTour(false);
								// 	// localStorage.setItem(TOUR_STATUS_KEY, JSON.stringify(true)); // Mark the tour as completed when the user closes it
								// }
								// if (action === "skip") {
								// 	setIsTourOpen(false);
								// 	setTourCompleted(true);
								// 	// setShowSidebarTour(false);
								// 	// localStorage.setItem(TOUR_STATUS_KEY, JSON.stringify(true)); // Mark the tour as completed when the user closes it
								// }
							}}
						/>
					<div className="mx-auto flex w-full max-w-[1920px] items-center justify-between  px-4 py-3 md:px-10 lg:px-14">
						{/*  */}	
						<div className="flex items-center  max-md:hidden">
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
								<li className="mx-3 searchjob">
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
									<li className="mx-3 dashboard">
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
						<div className=" flex items-center  max-md:hidden">
						<i
					className="fas fa-question-circle my-1 cursor-pointer rounded-l bg-white px-1  text-xl font-bold mx-6 text-gray-500 transition-colors duration-300 hover:text-slate-800"
					onClick={() => {
						resetTour();
					}}
				/>
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
											<button type="button" className="h-[35px] w-[35px] rounded-full bg-darkGray text-white settings">
												{role === "Candidate" ? user[0]["first_name"].charAt(0) : <>S</>}
											</button>
										</Popover.Button>
										<Popover.Panel className="absolute right-0 z-10 w-[150px] overflow-hidden rounded bg-white shadow-normal dark:bg-gray-700">
											<ul className="text-sm">
												<li>
													<Link
														href={`/organization/${cname}/settings`}
														className="block w-full px-4 py-1 py-2 font-bold hover:bg-gray-200 dark:hover:text-black last"
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
						<div className="hidden w-full  max-md:block ">
							<div className="flex items-center justify-between">
								{orgdetail["OrgProfile"] && (
									<Image
										src={
											process.env.NODE_ENV === "production"
												? process.env.NEXT_PUBLIC_PROD_BACKEND + orgdetail["OrgProfile"][0]["logo"]
												: process.env.NEXT_PUBLIC_DEV_BACKEND + orgdetail["OrgProfile"][0]["logo"]
										}
										alt={"Somhako"}
										width={1000}
										height={1000}
										className="mr-8 max-h-[80px] w-auto"
										onClick={() => {
											router.push("/organization/" + cname);
										}}
									/>
								)}
								<div className="flex items-center gap-2">
									<ThemeChange />
									<ToggleLang />
									<button onClick={() => setIsOpen(!isOpen)} className="flex h-full items-center rounded  px-3 py-3">
										<svg
											className={`h-7 w-7 fill-black dark:fill-white ${isOpen ? "hidden" : "block"}`}
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
										</svg>
										<svg
											className={`h-7 w-7 fill-black dark:fill-white ${isOpen ? "block" : "hidden"}`}
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
										</svg>
									</button>
								</div>
							</div>

							<div
								className={`border-input block w-full border-t-2  p-3 px-1 text-sm text-black dark:text-lightBlue lg:flex lg:w-auto lg:items-center lg:justify-center lg:gap-6 ${
									isOpen ? " mt-4 block  lg:mt-0" : "hidden"
								}`}
							>
								<div className="flex flex-col gap-1 text-base font-semibold">
									<Link
										href={"/organization/" + cname + "/search-jobs"}
										className={
											`w-full rounded-lg bg-gray-50 px-1 py-2 text-center hover:bg-gray-100 hover:text-primary dark:bg-gray-700 dark:hover:bg-gray-800` +
											" " +
											(router.pathname == "/organization/" + cname + "/search-jobs"
												? "border-2 border-b-primary text-primary"
												: "border-b-transparent")
										}
									>
										{srcLang === "ja" ? "求人検索" : "Search Jobs"}
									</Link>
									{auth && (
										<>
											<Link
												href={"/organization/" + cname + "/dashboard"}
												className={
													`w-full rounded-lg bg-gray-50 px-1 py-2 text-center hover:bg-gray-100 hover:text-primary dark:bg-gray-700 dark:hover:bg-gray-800 ` +
													" " +
													(router.pathname == "/organization/" + cname + "/dashboard"
														? "border-2 border-b-primary text-primary"
														: "border-b-transparent")
												}
											>
												{srcLang === "ja" ? "ダッシュボード" : "Dashboard"}
											</Link>
											<Link
												href={`/organization/${cname}/settings`}
												className={
													`w-full rounded-lg bg-gray-50 px-1 py-2 text-center hover:bg-gray-100 hover:text-primary dark:bg-gray-700 dark:hover:bg-gray-800 ` +
													" " +
													(router.pathname == "/organization/" + cname + "/settings"
														? "border-2 border-b-primary text-primary"
														: "border-b-transparent")
												}
											>
												{srcLang === "ja" ? "設定" : "Settings"}
											</Link>
											<div
												className={`flex w-full cursor-pointer justify-center gap-1 rounded-lg border-b-transparent bg-gray-50 px-1 py-2 text-center hover:bg-gray-100 hover:text-primary dark:bg-gray-700 dark:hover:bg-gray-800`}
												onClick={() => notification()}
											>
												{srcLang === "ja" ? "お知らせ" : "Notifications"}
												<span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
													{count}
												</span>
											</div>
											<button
												type="button"
												className={`dark:hover:bg-gray-800border-b-transparent w-full rounded-lg bg-gray-50 px-1 py-2 text-center text-red-500 hover:bg-gray-100 hover:text-red-700 dark:bg-gray-700`}
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
										</>
									)}
									{!auth && (
										<Link
											href={"/organization/" + cname + "/candidate/signin"}
											className={
												`w-full rounded-lg bg-gray-50 px-1 py-2 text-center hover:bg-gray-100 hover:text-primary dark:bg-gray-700 dark:hover:bg-gray-800 ` +
												" " +
												(router.pathname == "/organization/" + cname + "/auth/signin"
													? "border-2 border-b-primary text-primary"
													: "border-b-transparent")
											}
										>
											Sign In
										</Link>
									)}
								</div>
							</div>
						</div>
					</div>
				</header>
			</>
		);
	} else if (router.asPath == "/organization" || router.asPath == "/agency") {
		return (
			<>
				<header className="test bg-white shadow-normal dark:bg-gray-800">
					<div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-4 py-3 md:px-10 lg:px-14">
						<Logo url="/" width={205} />

						<div className="flex items-center">
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
