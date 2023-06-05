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
import { useState } from "react";

export default function Settings({ atsVersion, userRole, comingSoon }: any) {
	const [hover, setHover] = useState(0);
	function blurOrNot(name: any) {
		if (atsVersion === "starter") {
			return name === "Integrations" || name === "Vendors" || name === "Calendar" || name === "Team Members";
		}
		if (atsVersion === "premium") {
			return name === "Integrations" || name === "Vendors" || name === "Calendar";
		}
		if (atsVersion === "enterprise") {
			return false;
		}
	}
	const quicklinks = [
		{
			name: "Profile",
			icon: userIcon,
			link: "/organization/settings/profile",
			color: "#B2E3FF",
			blur: blurOrNot("Profile")
		},
		{
			name: "Integrations",
			icon: integrationIcon,
			link: "/organization/settings/integrations",
			color: "#D7C9FF",
			blur: blurOrNot("Integrations")
		},
		{
			name: "Vendors",
			icon: vendorsIcon,
			link: "/organization/settings/vendors",
			color: "#90DEFF",
			blur: blurOrNot("Vendors")
		},
		{
			name: "Calendar",
			icon: calendarIcon,
			link: "/organization/settings/calendar",
			color: "#FFC0D3",
			blur: blurOrNot("Calendar")
		},
		{
			name: "Team Members",
			icon: teamUsersIcon,
			link: "/organization/settings/team-members",
			color: "#C0D1FF",
			blur: blurOrNot("Team Members")
		},
		{
			name: "Notifications",
			icon: bellIcon,
			link: "/organization/settings/notifications",
			color: "#FFC0C0",
			blur: blurOrNot("Notifications")
		},
		{
			name: "Plans & Pricing",
			icon: pricingIcon,
			link: "/organization/settings/pricing",
			color: "#FFC0E9",
			blur: blurOrNot("Plans & Pricing")
		}
	];
	return (
		<>
			<Head>
				<title>Settings</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<OrgSideBar />
				<OrgTopBar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className="layoutWrap p-4 lg:p-8">
					<div className="relative rounded-normal bg-white p-10 dark:bg-gray-800">
						<h1 className="mb-6 text-2xl font-bold">Settings</h1>
						<div className="-mx-4 flex flex-wrap items-center">
							{quicklinks.map((links, i) =>
								userRole != "Super Admin" && links.name === "Plans & Pricing" ? (
									<></>
								) : (
									<div key={i} className="mb-8 w-full px-4 md:max-w-[50%] lg:max-w-[25%]">
										<Link
											href={links.blur ? "javascript:void(0)" : links.link}
											className={`block rounded-normal p-6 shadow-normal dark:bg-gray-700 dark:hover:bg-gray-600 ${
												links.blur ? "cursor-default bg-borderColor" : "bg-white hover:bg-lightBlue"
											}`}
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
											<span className="flex items-center text-sm text-primary dark:text-gray-300">
												{!links.blur ? (
													<>
														Go To <i className="fa-solid fa-arrow-right ml-2 text-[12px]"></i>
													</>
												) : (
													<>
														Premium Required <sup className="text-red-500">*</sup>
													</>
												)}
											</span>
										</Link>
									</div>
								)
							)}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
