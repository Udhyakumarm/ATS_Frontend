import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import dashboardIcon from "/public/images/icons/dashboard.png";
import jobsIcon from "/public/images/icons/jobs.png";
import analyticsIcon from "/public/images/icons/analytics.png";
import vendorsIcon from "/public/images/icons/vendors.png";
import applicantsIcon from "/public/images/icons/applicants.png";
import settingsIcon from "/public/images/icons/settings.png";
import offerManageIcon from "/public/images/icons/offer-manage.png";
import interviewsIcon from "/public/images/icons/interviews.png";

export default function Organization() {
	const [hover, setHover] = useState(false);
	const quicklinks = [
		{
			name: "Dashboard",
			icon: dashboardIcon,
			link: "/organization/dashboard"
		},
		{
			name: "Jobs",
			icon: jobsIcon,
			link: "/organization/jobs"
		},
		{
			name: "Applicants",
			icon: applicantsIcon,
			link: "/organization/applicants"
		},
		{
			name: "Offer Management",
			icon: offerManageIcon,
			link: "/organization/offer-management",
			blur: true
		},
		{
			name: "Interviews",
			icon: interviewsIcon,
			link: "/organization/interviews"
		},
		{
			name: "Analytics",
			icon: analyticsIcon,
			link: "/organization/analytics"
		},
		{
			name: "Vendors",
			icon: vendorsIcon,
			link: "/organization/settings/vendors"
		},
		{
			name: "Settings",
			icon: settingsIcon,
			link: "/organization/settings"
		}
	];
	return (
		<>
			<Head>
				<title>Home</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main className="py-8">
				<div className="md:px-26 mx-auto w-full max-w-[1920px] px-4 lg:px-40">
					<div className="rounded-normal bg-white p-6 dark:bg-gray-800">
						<div className="mx-auto w-full max-w-[1100px]">
							<div className="-mx-4 flex flex-wrap items-center">
								{quicklinks.map((links, i) => (
									<div key={i} className="mb-8 w-full px-4 md:max-w-[50%] lg:max-w-[33.33%]">
										<Link
											href={links.blur ? 'javascript:void(0)' : links.link}
											className=" flex w-full items-center rounded-normal bg-white p-6 shadow-normal hover:bg-lightBlue dark:bg-gray-700 dark:hover:bg-gray-600 relative overflow-hidden"
										>
											<div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded bg-[#B2E3FF] p-3">
												<Image src={links.icon} alt={links.name} width={30} height={30} />
											</div>
											<span className="text-lg font-bold">{links.name}</span>
											{
												links.blur
												&&
												<>
													<div className="absolute z-[1] left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.2)]">
														<div
														className="absolute left-2 top-2"
														onMouseEnter={()=> setHover(true)} onMouseLeave={()=> setHover(false)}
														>
															<button type="button" className="py-1 px-2 rounded text-[10px] font-bold text-center text-white bg-yellow-600">
																<i className="fa-solid fa-question"></i>
															</button>
															{
																hover
																&&
																<div className="ml-8">
																	<div className="py-1 px-2 min-w-[100px] w-max rounded absolute left-full top-[2px] bg-white text-center before:content-[''] before:w-[9px] before:h-[9px] before:rotate-45 before:bg-white before:absolute before:top-[6px] before:left-[-4px]">
																		<p className="text-[12px] font-bold uppercase">Upgrade your plan</p>
																		<Link href={'#'} className="inline-block p-1 rounded text-[8px] font-bold bg-primary text-white">Learn More</Link>
																	</div>
																</div>
															}
														</div>
													</div>
												</>
											}
										</Link>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useState } from "react";

export async function getServerSideProps(context: any) {
	const session: any = await getServerSession(context.req, context.res, authOptions);
	if (!session)
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false
			}
		};

	return {
		props: {}
	};
}
