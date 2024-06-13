import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../Logo";
import Favicon from "/public/favicon.ico";
import FaviconWhite from "/public/favicon-white.ico";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import clientsIcon from "/public/images/icons/clients.png";
import inboxesIcon from "/public/images/icons/inboxes.png";
import settingsIcon from "/public/images/icons/settings.png";
import clientsIconWhite from "/public/images/icons-white/clients.png";
import inboxesIconWhite from "/public/images/icons-white/inboxes.png";
import settingsIconWhite from "/public/images/icons-white/settings.png";
import { useCarrierStore, useLangStore, useUserStore, useVersionStore } from "@/utils/code";
import UpcomingComp from "../organization/upcomingComp";
import { Dialog, Transition } from "@headlessui/react";
import { isMobile } from "react-device-detect";
import Joyride, { STATUS } from "react-joyride";
import useJoyrideStore from "@/utils/joyride";

export default function VendorSideBar({ShouldshowSidebar}) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const { theme } = useTheme();
	const [show, setShow] = useState(false);
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

	const vid = useCarrierStore((state: { vid: any }) => state.vid);
	const role = useUserStore((state: { role: any }) => state.role);
	const version = useVersionStore((state: { version: any }) => state.version);

	function comOrNot(name: any) {
		return name === "Inboxes";
	}

	const menu = [
		{
			title: srcLang === "ja" ? "クライアント" : "Clients",
			url: `/vendor/[vrefid]/clients`,
			url2: `/vendor/${vid}/clients`,
			img: clientsIcon,
			imgWhite: clientsIconWhite,
			com: comOrNot("Clients")
		},
		{
			title: srcLang === "ja" ? "インボックス" : "Inboxes",
			url: `/vendor/[vrefid]/inbox`,
			url2: `/vendor/${vid}/inbox`,
			img: inboxesIcon,
			imgWhite: inboxesIconWhite,
			com: comOrNot("Inboxes")
		},
		{
			title: srcLang === "ja" ? "設定" : "Settings",
			url: `/vendor/[vrefid]/settings`,
			url2: `/vendor/${vid}/settings`,
			img: settingsIcon,
			imgWhite: settingsIconWhite,
			com: comOrNot("Settings")
		}
	];

	useEffect(() => {
		// console.log(router.pathname);
	});

	const [title, settitle] = useState("");
	const [comingSoon, setComingSoon] = useState(false);
	const cancelButtonRef = useRef(null);
	const { shouldShowJoyride, isJoyrideCompleted, showJoyride, completeJoyride } = useJoyrideStore();
	useEffect(() => {
		if (!isJoyrideCompleted) {
			showJoyride();
		}
	}, [isJoyrideCompleted, showJoyride]);
	const joyrideSteps = [
		{
			target: ".menuItem-0",
			title:  "Clients",
			content: "Clients tab is where you can see the list of clients and their details",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true,
			// hideFooter: true,
		},
		{
			target: ".menuItem-2",
			title: "Settings",
			content: "Settings tab is where you can change your account settings and preferences",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true,
			spotlightClicks: true,
			hideFooter: true,
		},
	]

	function handleClickLink(url, com, title) {
		settitle(title);
		if (com) {
			setComingSoon(true);
		} else {
			router.push(url);
		}
	}

	return (
		<>
			{vid && vid.length > 0 && (
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
						{ShouldshowSidebar && (
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
								if (action === "close") {
									setIsTourOpen(false);
									setTourCompleted(true);
									// setShowSidebarTour(false);
									// localStorage.setItem(TOUR_STATUS_KEY, JSON.stringify(true)); // Mark the tour as completed when the user closes it
								}
								if (action === "skip") {
									setIsTourOpen(false);
									setTourCompleted(true);
									// setShowSidebarTour(false);
									// localStorage.setItem(TOUR_STATUS_KEY, JSON.stringify(true)); // Mark the tour as completed when the user closes it
								}
							}}
						/>
					)}
							<ul>
								{menu.map((menuItem, i) => (
									<>
										{!menuItem.com && (
											<li className={`my-[12px] menuItem-${i}` + " " + (show ? "my-[24px]" : "")} key={i}>
												<div
													onClick={() => handleClickLink(menuItem.url2, menuItem.com, menuItem.title)}
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
															className={"mx-auto max-h-[20px] w-auto"}
														/>
													</span>
													{show ? "" : menuItem.title}
												</div>
											</li>
										)}
									</>
								))}
							</ul>
						</div>
					</div>

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
			)}
		</>
	);
}
