import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import userIcon from "/public/images/icons/user.png";
import integrationIcon from "/public/images/icons/integration.png";
import vendorsIcon from "/public/images/icons/vendors.png";
import calendarIcon from "/public/images/icons/calendar.png";
import teamUsersIcon from "/public/images/icons/team-users.png";
import bellIcon from "/public/images/icons/bell.png";
import pricingIcon from "/public/images/icons/pricing.png";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore, useUserStore } from "@/utils/code";
import moment from "moment";
import { useNewNovusStore } from "@/utils/novus";
import OrgRSideBar from "@/components/organization/RSideBar";
import { useSession } from "next-auth/react";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";

export default function Settings({ atsVersion, userRole, comingSoon, currentUser }: any) {
	const { t } = useTranslation("common");
	// const currentuser = useUserStore((state: { user: any }) => state.user);
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [hover, setHover] = useState(0);
	const [rdate, setrdate] = useState("");
	function blurOrNot(name: any) {
		// if (atsVersion === "starter") {
		// 	return name === "Integrations" || name === "Vendors" || name === "Calendar" || name === "Team Members";
		// }
		// if (atsVersion === "premium") {
		// 	return name === "Integrations" || name === "Vendors" || name === "Calendar";
		// }
		// if (atsVersion === "enterprise") {
		// }
		// if (atsVersion === "standard") {
		// 	return name === "Vendors";
		// } else {
		return false;
		// }
	}
	function hideOrNot(name: any) {
		if (name === "Integrations" || name === "Calendar" || name === "Notifications") {
			return true;
		}
		if (userRole != "Super Admin" && (name === "Plans & Pricing" || name === "Team Members" || name === "Vendors")) {
			return true;
		}
		return false;
	}

	useEffect(() => {
		console.log("!!!", "currentuser", currentUser);
		// if (userRole === "Super Admin" && currentuser && currentuser.length > 0) {
		// 	if (currentuser[0]["register_date"]) {
		// 		setrdate(currentuser[0]["register_date"]);
		// 	} else {
		// 		setrdate("");
		// 	}
		// } else {
		// 	setrdate("");
		// }
	}, [currentUser]);

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
	function isExpired(name: any) {
		return name != "Plans & Pricing" && currentUser.is_expired;
	}

	const quicklinks = [
		{
			name: t("Words.Profile"),
			icon: userIcon,
			link: "/organization/settings/profile",
			color: "#B2E3FF",
			blur: blurOrNot("Profile"),
			hide: hideOrNot("Profile"),
			expired: isExpired("Profile")
		},
		{
			name: t("Words.Integrations"),
			icon: integrationIcon,
			link: "/organization/settings/integrations",
			color: "#D7C9FF",
			blur: blurOrNot("Integrations"),
			hide: hideOrNot("Integrations"),
			expired: isExpired("Integrations")
		},
		{
			name: t("Words.Vendors"),
			icon: vendorsIcon,
			link: "/organization/settings/vendors",
			color: "#90DEFF",
			blur: blurOrNot("Vendors"),
			hide: hideOrNot("Vendors"),
			expired: isExpired("Vendors")
		},
		{
			name: t("Words.Calendar"),
			icon: calendarIcon,
			link: "/organization/settings/calendar",
			color: "#FFC0D3",
			blur: blurOrNot("Calendar"),
			hide: hideOrNot("Calendar"),
			expired: isExpired("Calendar")
		},
		{
			name: t("Words.TeamMembers"),
			icon: teamUsersIcon,
			link: "/organization/settings/team-members",
			color: "#C0D1FF",
			blur: blurOrNot("Team Members"),
			hide: hideOrNot("Team Members"),
			expired: isExpired("Team Members")
		},
		{
			name: t("Words.Notifications"),
			icon: bellIcon,
			link: "/organization/settings/notifications",
			color: "#FFC0C0",
			blur: blurOrNot("Notifications"),
			hide: hideOrNot("Notifications"),
			expired: isExpired("Notifications")
		},
		{
			name: t("Words.Plans_Pricing"),
			icon: pricingIcon,
			link: "/organization/settings/pricing",
			color: "#FFC0E9",
			blur: blurOrNot("Plans & Pricing"),
			hide: hideOrNot("Plans & Pricing"),
			expired: isExpired("Plans & Pricing")
		}
	];
	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);
	return (
		<>
			<Head>
				<title>{t("Words.Settings")}</title>
			</Head>
			<main>
				<OrgSideBar />
				<OrgTopBar />
				{token && token.length > 0 && <OrgRSideBar axiosInstanceAuth2={axiosInstanceAuth2} />}
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className={`layoutWrap p-4` + " " + (visible && "mr-[calc(27.6%+1rem)]")}>
					<div className="relative rounded-normal bg-white p-10 dark:bg-gray-800">
						<h1 className="mb-6 text-xl font-bold">{t("Words.Settings")}</h1>
						<div className="-mx-4 flex flex-wrap items-center">
							{quicklinks.map((links, i) =>
								userRole != "Super Admin" && links.name === "Plans & Pricing" ? (
									<></>
								) : (
									<>
										{!links.hide && (
											<div key={i} className="mb-8 w-full px-4 md:max-w-[50%] xl:max-w-[33.3333%] 2xl:max-w-[25%]">
												<Link
													href={links.blur || links.expired ? "/organization/settings/pricing" : links.link}
													className={`relative block overflow-hidden rounded-normal p-6 shadow-normal dark:bg-gray-700 dark:hover:bg-gray-600`}
												>
													<div className="mb-10 flex w-full items-center">
														<div
															className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded p-3"
															style={{ backgroundColor: links.color }}
														>
															<Image src={links.icon} alt={links.name} width={100} />
														</div>
														<span className="text-lg font-bold">{links.name}</span>
													</div>
													<span className="flex items-center justify-between text-sm text-primary dark:text-gray-300">
														<div>
															{t("Words.GoTo")} <i className="fa-solid fa-arrow-right ml-2 text-[12px]"></i>
														</div>
														{links.link === "/organization/settings/pricing" && currentUser.expire_date && (
															<p className="rounded-lg bg-primary/75 px-2 py-1 text-center font-bold text-white">
																{currentUser.is_expired ? (
																	<>0 days left</>
																) : (
																	<>
																		{moment(currentUser.expire_date).diff(moment(), "days") <= 0
																			? "0"
																			: moment(currentUser.expire_date).diff(moment(), "days")}
																		&nbsp;days left
																	</>
																)}
															</p>
														)}
													</span>
													{links.expired && (
														<>
															<div className="group absolute left-0 top-0 flex h-full w-full items-center justify-center bg-red-400/[0.1] backdrop-blur-[0.8px] transition hover:bg-red-300/[0.2] hover:backdrop-blur-[2px]">
																<span className="hidden cursor-pointer items-center gap-2 rounded-md bg-red-200 p-2 duration-100 group-hover:flex">
																	<i className="fa-solid fa-business-time text-red-900"></i>
																	<span className="pr-1 text-sm font-bold text-red-900">
																		{srcLang === "ja" ? "プランを購入する" : "Buy Plan"}
																	</span>
																</span>
															</div>
														</>
													)}
													{links.blur && !links.expired && (
														<>
															<div className="group absolute left-0 top-0 flex h-full w-full items-center justify-center bg-blue-200/[0.3] backdrop-blur-[0.8px] transition hover:bg-blue-300/[0.2] hover:backdrop-blur-[2px]">
																<span className="hidden cursor-pointer items-center gap-2 rounded-md bg-gradLightBlue p-2 duration-100 group-hover:flex">
																	<i className="fa-solid fa-business-time text-blue-900"></i>
																	<span className="pr-1 text-sm font-bold text-blue-900">
																		{srcLang === "ja" ? "プランを購入する" : "Upgrade Plan"}
																	</span>
																</span>
															</div>
														</>
													)}
												</Link>
											</div>
										)}
									</>
								)
							)}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
export async function getStaticProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	return {
		props: {
			...translations
		}
	};
}
