import { useState, Fragment, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../Logo";
import Favicon from "/public/favicon.ico";
import FaviconWhite from "/public/favicon-white.ico";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
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
import { useTranslation } from 'next-i18next'
import { useLangStore } from "@/utils/code";
import Button from "../Button";

export default function OrgSideBar() {
	const router = useRouter();
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const { theme } = useTheme();
	const [show, setShow] = useState(false);
	function toggleSidebar() {
		document.querySelector("main")?.classList.toggle("sidebarToggled");
		setShow(!show);
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
		return name === "Inboxes" || name === "Analytics";
	}

	const menu = [
		{
			title: srcLang === 'ja' ? 'ダッシュボード' : 'Dashboard',
			url: "/organization/dashboard",
			img: dashboardIcon,
			imgWhite: dashboardIconWhite,
			pre: preOrNot("Dashboard"),
			com: comOrNot("Dashboard")
		},
		{
			title: srcLang === 'ja' ? '求人' : 'Jobs',
			url: "/organization/jobs",
			img: jobsIcon,
			imgWhite: jobsIconWhite,
			pre: preOrNot("Jobs"),
			com: comOrNot("Jobs")
		},
		{
			title: srcLang === 'ja' ? '候補者' : 'Applicants',
			url: "/organization/applicants",
			img: applicantsIcon,
			imgWhite: applicantsIconWhite,
			pre: preOrNot("Applicants"),
			com: comOrNot("Applicants")
		},
		{
			title: srcLang === 'ja' ? 'オファー管理' : 'Offer Management',
			url: "/organization/offer-management",
			img: offerManageIcon,
			imgWhite: offerManageIconWhite,
			pre: preOrNot("Offer Management"),
			com: comOrNot("Offer Management")
		},
		{
			title: srcLang === 'ja' ? '面接' : 'Interviews',
			url: "/organization/interviews",
			img: interviewsIcon,
			imgWhite: interviewsIconWhite,
			pre: preOrNot("Interviews"),
			com: comOrNot("Interviews")
		},
		{
			title: srcLang === 'ja' ? 'アナリティクス' : 'Analytics',
			url: "/organization/analytics",
			img: analyticsIcon,
			imgWhite: analyticsIconWhite,
			pre: preOrNot("Analytics"),
			com: comOrNot("Analytics")
		},
		{
			title: srcLang === 'ja' ? 'インボックス' : 'Inboxes',
			url: "/organization/inbox",
			img: inboxesIcon,
			imgWhite: inboxesIconWhite,
			pre: preOrNot("Inboxes"),
			com: comOrNot("Inboxes")
		},
		{
			title: srcLang === 'ja' ? '設定' : 'Settings',
			url: "/organization/settings",
			img: settingsIcon,
			imgWhite: settingsIconWhite,
			pre: preOrNot("Settings"),
			com: comOrNot("Settings")
		}
	];

    function handleClickLink(url,com,pre,title){
        settitle(title)
        if(com){
            setComingSoon(true)
		}
        else if(pre){
            setUpgradePlan(true)
        }
        else{
            router.push(url)
        }
    }
	return (
		<>
			<div
				id="sidebar"
				className={
					`fixed top-0 z-[13] h-full w-[270px] bg-white shadow transition dark:bg-gray-800 lg:left-0` +
					" " +
					(show ? "left-[-50px]" : "left-0")
				}
			>
				<div className="relative flex h-[65px] items-center p-3">
					<button
						type="button"
						className={
							`absolute right-[-16px] top-[50%] h-[30px] w-[30px] translate-y-[-50%] rounded-full bg-white shadow dark:bg-gray-700` +
							" " +
							(show ? "right-[-31px] rounded-[6px] rounded-bl-[0] rounded-tl-[0]" : <></>)
						}
						onClick={toggleSidebar}
					>
						<i className={`fa-solid fa-chevron-left` + " " + (show ? "fa-chevron-right" : <></>)}></i>
					</button>
					{show ? (
						<>
							<Image src={theme === "dark" ? FaviconWhite : Favicon} alt="Somhako" />
						</>
					) : (
						<>
							<Logo width="188" />
						</>
					)}
				</div>
				<div className="h-[calc(100%-65px)] overflow-y-auto p-3">
					<ul className={show ? "" : "border-b pb-4"}>
						{menu.map((menuItem, i) => (
							<li className={`my-[12px]` + " " + (show ? "my-[24px]" : "")} key={i}>
								<div
									onClick={()=>handleClickLink(menuItem.url,menuItem.com,menuItem.pre,menuItem.title)}
									className={
										`flex items-center rounded-[8px] font-semibold hover:bg-lightBlue dark:hover:bg-gray-900 cursor-pointer` +
										" " +
										(router.pathname == menuItem.url
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
											className={"mx-auto max-h-[20px] w-auto"}
										/>
									</span>
									{show ? "" : menuItem.title}
								</div>
							</li>
						))}
					</ul>
					{
						version != "enterprise" && !show && (
							<div className="py-4">
								<div className="bg-gradient-to-b from-gradLightBlue to-gradDarkBlue rounded-large p-6 text-white">
									<div className="flex items-center mb-2">
										<h6 className="font-bold text-xl my-2">{srcLang === 'ja' ? 'プランをアップグレード' : 'Upgrade to Premium'}</h6>
										<Image src={'/images/upgrade_launch.png'} alt="Upgrade" width={80} height={80} className="w-auto ml-auto" />
									</div>
									<p className="mb-2">{srcLang === 'ja' ? 'プレミアムプランの詳細はこちら' : 'Check out the Power of Premium Account'}</p>
									<h6 className="font-bold text-xl my-2">{srcLang === 'ja' ? '20%オフキャンペーン実施中' : '20% Off'}</h6>
									<Button
									btnStyle="white"
									btnType="button"
									label={srcLang === 'ja' ? 'アップグレード' : 'Upgrade'}
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
						)
					}
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
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
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
										<h4 className="flex items-center font-semibold leading-none">{srcLang === 'ja' ? 'プランをアップグレードする' : 'Upgrade Your Plan'}</h4>
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
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
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
