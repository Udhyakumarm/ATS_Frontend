import "@/styles/globals.css";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect, useState, useRef, Fragment } from "react";
import "nprogress/nprogress.css";
import Router from "next/router";
import NProgress from "nprogress";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { useLangStore, useUserStore, useVersionStore } from "@/utils/code";
import { appWithTranslation } from "next-i18next";
import { Dialog, Transition } from "@headlessui/react";
import PermiumComp from "@/components/organization/premiumComp";
import UpcomingComp from "@/components/organization/upcomingComp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { isMobileOnly } from "react-device-detect";
import Novus from "@/components/Novus";

function App({ Component, pageProps: { session, ...pageProps } }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	useEffect(() => {
		const handleRouteStart = () => NProgress.start();
		const handleRouteDone = () => NProgress.done();

		Router.events.on("routeChangeStart", handleRouteStart);
		Router.events.on("routeChangeComplete", handleRouteDone);
		Router.events.on("routeChangeError", handleRouteDone);

		return () => {
			// Make sure to remove the event handler on unmount!
			Router.events.off("routeChangeStart", handleRouteStart);
			Router.events.off("routeChangeComplete", handleRouteDone);
			Router.events.off("routeChangeError", handleRouteDone);
		};
	}, []);

	const version = useVersionStore((state: { version: any }) => state.version);
	const setversion = useVersionStore((state: { setversion: any }) => state.setversion);
	const role = useUserStore((state: { role: any }) => state.role);

	const [soon, setSoon] = useState(true);

	const cancelButtonRef = useRef(null);
	const [upgradePlan, setUpgradePlan] = useState(false);
	const [comingSoon, setComingSoon] = useState(false);
	const [title, settitle] = useState("");

	return (
		<>
			{isMobileOnly && !Component.mobileEnabled  ? (
				<>
					<div className="flex h-[calc(100vh-80px)] items-center justify-center p-[40px]">
						<div className="mx-auto w-full max-w-[450px] rounded-normal bg-[rgba(255,255,255,0)] p-6 text-center text-white transition hover:scale-[1.05]">
							<h3 className="textGrad mb-4 text-3xl font-extrabold">
								{srcLang === "ja" ? "準備中" : "Mobile View Coming Soon"}
							</h3>
							<p className="text-sm text-darkGray">
								{srcLang === "ja"
									? "もうまもなくリリース予定"
									: "We are working on this and it will ready for you soon."}
							</p>
						</div>
					</div>
				</>
			) : (
				<>
					<Toaster />
					<ThemeProvider attribute="class">
						<SessionProvider session={session}>
							<Head>
								<meta name="viewport" content="viewport-fit=cover" />
								<meta name="viewport" content="width=device-width, initial-scale=1" />
								<link rel="icon" href="/favicon.ico" />
							</Head>
							<Header />
							{Component.noAuth ? (
								<Component {...pageProps} upcomingSoon={soon} />
							) : (
								<>
									<Auth>
										<Component
											{...pageProps}
											atsVersion={version}
											userRole={role}
											upcomingSoon={soon}
											setUpgradePlan={setUpgradePlan}
											setComingSoon={setComingSoon}
											popupTitle={settitle}
										/>
									</Auth>
								</>
							)}

							{/* {!Component.noAuth && <Novus />} */}

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
														<h4 className="flex items-center font-semibold leading-none">{t("Words.ComingSoon")}</h4>
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
						</SessionProvider>
					</ThemeProvider>
					<Analytics />
				</>
			)}
		</>
	);
}

function Auth({ children }: any) {
	const { data: session, status } = useSession();
	const isUser = !!session?.user;
	useEffect(() => {
		if (status == "loading") return; // Do nothing while loading
		if (!isUser) signIn(); // If not authenticated, force log in
	}, [isUser, status]);

	if (isUser) {
		return children;
	}

	return <></>;
}
export async function getStaticProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	return {
		props: {
			...translations
		}
	};
}
export default appWithTranslation(App);
