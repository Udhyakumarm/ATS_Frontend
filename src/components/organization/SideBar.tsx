import { useState, Fragment, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../Logo";
import LogoImg from "/public/images/noAuth/headerLogo.png";
import Favicon from "/public/favicon.ico";
import FaviconWhite from "/public/favicon-white.ico";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import dashboardIcon from "/public/images/icons/dashboard.png";
import interviewsIcon from "/public/images/icons/interviews.png";
import jobsIcon from "/public/images/icons/jobs.png";
import analyticsIcon from "/public/images/icons/analytics.png";
import inboxesIcon from "/public/images/icons/inboxes.png";
import applicantsIcon from "/public/images/icons/applicants.png";
import settingsIcon from "/public/images/icons/settings.png";
import dashboardIconWhite from "/public/images/icons-white/dashboard.png";
import interviewsIconWhite from "/public/images/icons-white/interviews.png";
import jobsIconWhite from "/public/images/icons-white/jobs.png";
import analyticsIconWhite from "/public/images/icons-white/analytics.png";
import inboxesIconWhite from "/public/images/icons-white/inboxes.png";
import applicantsIconWhite from "/public/images/icons-white/applicants.png";
import settingsIconWhite from "/public/images/icons-white/settings.png";
import upgradeBadge from "/public/images/upgrade-badge.png";
import offerManageIcon from "/public/images/icons/offer-manage.png";
import offerManageIconWhite from "/public/images/icons-white/offer-manage.png";
import { Dialog, Transition } from "@headlessui/react";
import { useUserStore, useVersionStore } from "@/utils/code";
import UpcomingComp from "./upcomingComp";
import PermiumComp from "./premiumComp";
import toastcomp from "../toast";
import { useTranslation } from "next-i18next";
import { useLangStore } from "@/utils/code";
import Button from "../Button";
import { isMobile } from "react-device-detect";
import { useNewNovusStore } from "@/utils/novus";
import { axiosInstance2, axiosInstanceAuth } from "@/pages/api/axiosApi";

export default function OrgSideBar() {
	const router = useRouter();
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const { theme } = useTheme();
	const [show, setShow] = useState(false);
	const { data: session } = useSession();
	const [token, settoken] = useState("");

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	useEffect(() => {
		if (token && token.length > 0 && !isExpired) {
			// Call the async function immediately when the component mounts

			console.log("!!!", "timeout1");
			fetchCount();

			// Set up an interval to call the async function every 5 seconds
			const intervalId = setInterval(() => {
				console.log("!!!", "timeout2");
				fetchCount();
			}, 10000); // 5000 milliseconds = 5 seconds

			// Clean up the interval when the component unmounts to avoid memory leaks
			return () => {
				clearInterval(intervalId);
			};
		}
	}, [token]);

	// useEffect(() => {
	// 	if (token && token.length > 0) {
	// 		fetchCount();
	// 	}
	// }, [token]);

	// useEffect(() => {
	// 	// Creating a timeout within the useEffect hook
	// 	setTimeout(() => {
	// 		console.log("!!!", "timeout");
	// 		fetchCount();
	// 	}, 5000);
	// }, []);

	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const currentUser = useUserStore((state: { user: any }) => state.user);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);
	const user = useUserStore((state: { user: any }) => state.user);
	const [isExpired, setisExpired] = useState(false);
	useEffect(() => {
		if (user && user.length > 0) {
			if (user[0]["is_expired"]) {
				setisExpired(true);
			}
		}
	}, [user]);

	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	useEffect(() => {
		if (visible) {
			setShow(true);
			document.querySelector("main")?.classList.add("desktopSidebar");
		} else {
			setShow(false);
			document.querySelector("main")?.classList.remove("desktopSidebar");
		}
	}, [visible]);

	function toggleSidebar() {
		if (!isMobile) {
			document.querySelector("main")?.classList.toggle("desktopSidebar");
			setShow(!show);
		}
	}
	function mobileSidebarToggle() {
		if (isMobile) {
			document.querySelector("main")?.classList.toggle("mobileSidebar");
		}
	}
	const cancelButtonRef = useRef(null);
	const [upgradePlan, setUpgradePlan] = useState(false);
	const [comingSoon, setComingSoon] = useState(false);
	const [title, settitle] = useState("");
	const role = useUserStore((state: { role: any }) => state.role);
	const version = useVersionStore((state: { version: any }) => state.version);

	function preOrNot(name: any) {
		if (version === "starter") {
			return name === "Offer Management" || name === "Analytics" || name === "Vendors";
		}
		if (version === "premium") {
			return name === "Offer Management" || name === "Vendors";
		}
		if (version === "enterprise") {
			return false;
		}
	}

	function comOrNot(name: any) {
		// return name === "Inboxes" || name === "Analytics";
		return false;
	}

	const menu = [
		{
			title: srcLang === "ja" ? "ダッシュボード" : "Dashboard",
			url: "/organization/dashboard",
			img: dashboardIcon,
			imgWhite: dashboardIconWhite,
			pre: preOrNot("Dashboard"),
			com: comOrNot("Dashboard"),
			expired: isExpired
		},
		{
			title: srcLang === "ja" ? "求人" : "Jobs",
			url: "/organization/jobs",
			img: jobsIcon,
			imgWhite: jobsIconWhite,
			pre: preOrNot("Jobs"),
			com: comOrNot("Jobs"),
			expired: isExpired
		},
		{
			title: srcLang === "ja" ? "候補者" : "Applicants",
			url: "/organization/applicants",
			img: applicantsIcon,
			imgWhite: applicantsIconWhite,
			pre: preOrNot("Applicants"),
			com: comOrNot("Applicants"),
			expired: isExpired
		},
		{
			title: srcLang === "ja" ? "オファー管理" : "Offer Management",
			url: "/organization/offer-management",
			img: offerManageIcon,
			imgWhite: offerManageIconWhite,
			pre: preOrNot("Offer Management"),
			com: comOrNot("Offer Management"),
			expired: isExpired
		},
		{
			title: srcLang === "ja" ? "面接" : "Interviews",
			url: "/organization/interviews",
			img: interviewsIcon,
			imgWhite: interviewsIconWhite,
			pre: preOrNot("Interviews"),
			com: comOrNot("Interviews"),
			expired: isExpired
		},
		{
			title: srcLang === "ja" ? "アナリティクス" : "Analytics",
			url: "/organization/analytics",
			img: analyticsIcon,
			imgWhite: analyticsIconWhite,
			pre: preOrNot("Analytics"),
			com: comOrNot("Analytics"),
			expired: isExpired
		},
		{
			title: srcLang === "ja" ? "インボックス" : "Inboxes",
			url: "/organization/inbox",
			img: inboxesIcon,
			imgWhite: inboxesIconWhite,
			pre: preOrNot("Inboxes"),
			com: comOrNot("Inboxes"),
			expired: isExpired
		},
		{
			title: srcLang === "ja" ? "設定" : "Settings",
			url: "/organization/settings",
			img: settingsIcon,
			imgWhite: settingsIconWhite,
			pre: preOrNot("Settings"),
			com: comOrNot("Settings"),
			expired: false
		}
	];

	function handleClickLink(url, com, pre, title) {
		settitle(title);
		if (com) {
			setComingSoon(true);
		} else if (pre) {
			setUpgradePlan(true);
		} else {
			router.push(url);
		}
	}

	const [count, setcount] = useState(0);

	async function fetchCount() {
		await axiosInstanceAuth2
			.get(`/inbox/total-unread-count/`)
			.then(async (res) => {
				console.log("!!!", res.data);
				setcount(res.data["total"]);
			})
			.catch((err) => {
				setcount(0);
				console.log("!", err);
			});
	}

	async function removeLogin(email: any) {
		var fd = new FormData();
		fd.append("email", email);
		await axiosInstance2
			.post(`/organization/after-logout/`, fd)
			.then((res) => {
				console.log("$", "res", res.data);
			})
			.catch((err) => {
				console.log("$", "err", err);
			});
	}

	return (
		<>
			<div
				id="sidebar"
				className={
					`fixed top-0 z-[13] h-full bg-white shadow transition dark:bg-gray-800 lg:left-0` +
					" " +
					(show ? "left-[-50px] w-[50px]" : "left-0 w-[270px]")
				}
			>
				<div className="relative flex h-[65px] items-center p-3">
					{(!visible || isMobile) && (
						<button
							type="button"
							id="btnToggle"
							className={
								`absolute right-[-16px] top-[50%] h-[30px] w-[30px] translate-y-[-50%] rounded-full bg-white shadow dark:bg-gray-700` +
								" " +
								(show ? "right-[-31px] rounded-[6px] rounded-bl-[0] rounded-tl-[0]" : <></>)
							}
							onClick={isMobile ? mobileSidebarToggle : toggleSidebar}
						>
							<i className={`fa-solid fa-chevron-left` + " " + (show ? "fa-chevron-right" : <></>)}></i>
						</button>
					)}
					{show ? (
						<>
							{/* <Image src={theme === "dark" ? FaviconWhite : Favicon} alt="Somhako" /> */}
							<Image src={LogoImg} alt="Somhako" />
						</>
					) : (
						<>
							<Logo width="188" />
						</>
					)}
				</div>
				<div className="h-[calc(100%-65px)] overflow-y-auto p-3">
					<ul className={"sideMenu" + " " + show ? "" : "border-b pb-4"}>
						{menu.map((menuItem, i) => (
							<li
								className={`relative my-[12px]` + " " + (show ? "my-[24px]" : "")}
								key={i}
								data-te-toggle="tooltip"
								data-te-placement="right"
								data-te-ripple-init
								data-te-ripple-color="light"
								title={show ? menuItem.title : ""}
							>
								<div
									onClick={() => {
										if (!menuItem.expired) {
											handleClickLink(menuItem.url, menuItem.com, menuItem.pre, menuItem.title);
										} else {
											toastcomp("Plan Expired", "error");
											router.push("/organization/settings/pricing");
										}
									}}
									className={
										`flex cursor-pointer items-center rounded-[8px] font-semibold hover:bg-lightBlue dark:hover:bg-gray-900` +
										" " +
										(router.route.includes(menuItem.url)
											? "border-r-gradDarkBlue bg-lightBlue text-primary dark:bg-gray-900 dark:text-white"
											: "border-r-transparent bg-transparent") +
										" " +
										(show
											? "justify-center bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
											: "border-r-[10px] px-4 py-2")
									}
								>
									<span className={`inline-block h-[20px] w-[20px]` + " " + (show ? "text-center" : "mr-4")}>
										<Image
											src={theme === "dark" ? menuItem.imgWhite : menuItem.img}
											alt={menuItem.title}
											width={100}
											className={"mx-auto h-[20px] w-auto"}
										/>
									</span>
									{show ? "" : menuItem.title}
									{show ? (
										""
									) : (
										<>
											{menuItem.url === "/organization/inbox" && (
												<span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-white">
													{count}
												</span>
											)}
										</>
									)}
									{menuItem.expired && (
										<>
											<div className="group absolute left-0 top-0 flex h-full w-full items-center justify-center bg-red-400/[0.05] backdrop-blur-[1px]"></div>
										</>
									)}
								</div>
							</li>
						))}

						<li className={`my-[12px]` + " " + (show ? "my-[24px]" : "")}>
							<div
								onClick={() => {
									toastcomp(currentUser[0]["email"], "success");
									removeLogin(currentUser[0]["email"]);
									signOut();

									settype("");
									setrole("");
									setuser([]);
								}}
								className={
									`flex cursor-pointer items-center rounded-[8px] border-r-transparent bg-transparent font-semibold text-red-500 hover:bg-lightBlue hover:text-red-600 dark:hover:bg-gray-900` +
									" " +
									(show
										? "justify-center bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
										: "border-r-[10px] px-4 py-2")
								}
							>
								<span className={`inline-block h-[20px] w-[20px]` + " " + (show ? "text-center" : "mr-4")}>
									<i className="fa-solid fa-right-from-bracket mx-auto h-[20px] w-auto"></i>
								</span>
								{show ? "" : srcLang === "ja" ? "ログアウト" : "Logout"}
							</div>
						</li>
					</ul>
					{version != "enterprise" && !show && (
						<div className="py-4">
							<div className="rounded-large bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-6 text-white">
								<div className="mb-2 flex items-center">
									<h6 className="my-2 text-lg font-bold">
										{srcLang === "ja" ? "プランをアップグレード" : "Upgrade to Premium"}
									</h6>
									<Image
										src={"/images/upgrade_launch.png"}
										alt="Upgrade"
										width={80}
										height={80}
										className="ml-auto w-auto"
									/>
								</div>
								<p className="mb-2">
									{srcLang === "ja" ? "プレミアムプランの詳細はこちら" : "Check out the Power of Premium Account"}
								</p>
								<h6 className="my-2 text-lg font-bold">{srcLang === "ja" ? "20%オフキャンペーン実施中" : "20% Off"}</h6>
								<Button
									btnStyle="white"
									btnType="button"
									label={srcLang === "ja" ? "アップグレード" : "Upgrade"}
									handleClick={() => {
										if (role === "Super Admin") {
											router.push("/organization/settings/pricing");
										} else {
											toastcomp("Kindly Contact Your Super Admin", "warning");
										}
									}}
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			<Transition.Root show={upgradePlan} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setUpgradePlan}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#fff] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "プランをアップグレードする" : "Upgrade Your Plan"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setUpgradePlan(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<PermiumComp userRole={role} title={title} setUpgradePlan={setUpgradePlan} />
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={comingSoon} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setComingSoon}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#fff] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">Coming Soon</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setComingSoon(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<UpcomingComp title={title} setComingSoon={setComingSoon} />
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}
