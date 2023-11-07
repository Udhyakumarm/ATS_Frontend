import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import googleIcon from "/public/images/social/google-icon.png";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { axiosInstanceAuth } from "../api/axiosApi";
import moment from "moment";
import { useLangStore, useNotificationStore, useUserStore } from "@/utils/code";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OrgNotifications() {
	const router = useRouter();
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const { data: session } = useSession();
	const [loader, setloader] = useState(true);
	const [token, settoken] = useState("");
	const [notification, setnotification] = useState([]);

	const load = useNotificationStore((state: { load: any }) => state.load);
	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);
	const role = useUserStore((state: { role: any }) => state.role);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadNotification() {
		if (role === "Super Admin") {
			await axiosInstanceAuth2
				.get(`/chatbot/list-notification-admin/`)
				.then(async (res) => {
					console.log("!", res.data);
					setnotification(res.data);
					setloader(false);
				})
				.catch((err) => {
					console.log("!", err);
					setloader(false);
				});
		} else {
			await axiosInstanceAuth2
				.get(`/chatbot/list-notification/`)
				.then(async (res) => {
					console.log("!", res.data);
					setnotification(res.data);
					setloader(false);
				})
				.catch((err) => {
					console.log("!", err);
					setloader(false);
				});
		}
	}

	useEffect(() => {
		if ((token && token.length > 0 && role && role.length > 0) || load) {
			loadNotification();
			if (load) toggleLoadMode();
		}
	}, [token, role, load]);

	return (
		<>
			<Head>
				<title>{srcLang === "ja" ? "お知らせ" : "Notifications"}</title>
			</Head>
			<main>
				<OrgSideBar />
				<OrgTopBar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className="layoutWrap p-4 lg:p-8">
					<div className="rounded-normal border bg-white shadow-normal dark:border-gray-600 dark:bg-gray-800">
						<div className="border-b dark:border-gray-600">
							<div className="mx-auto w-full max-w-[1100px] px-4 py-4">
								<h1 className="text-xl font-bold">Notifications</h1>
							</div>
						</div>
						<div className="mx-auto w-full max-w-[1100px] px-4 py-4">
							{loader ? (
								Array(6).fill(
									<>
										<div className="mb-4 overflow-hidden rounded-normal bg-lightBlue px-8 py-4 last:mb-0 dark:bg-gray-600">
											<Skeleton width={600} style={{ maxWidth: "100%" }} />
											<Skeleton width={170} style={{ maxWidth: "100%" }} />
										</div>
									</>
								)
							) : (
								<>
									{notification && notification.length > 0 ? (
										notification.map((data, i) =>
											data["notification_type"] === null || data["notification_type"] === "" ? (
												<div
													className="mb-4 overflow-hidden rounded-normal bg-lightBlue last:mb-0 dark:bg-gray-600"
													key={i}
												>
													<div className="px-8 py-4">
														<h3 className="mb-1 font-bold">{data["title"]}</h3>
														<p className="text-sm text-darkGray dark:text-gray-400">
															{moment(data["timestamp"]).format("MMMM DD, YYYY")} at{" "}
															{moment(data["timestamp"]).format("h:mm a")}
														</p>
													</div>
												</div>
											) : (
												<>
													{data["notification_type"] === "Job" && (
														<div
															className="mb-4 overflow-hidden rounded-normal bg-lightBlue last:mb-0 dark:bg-gray-600"
															key={i}
														>
															<div className="border-b px-8 py-4 dark:border-gray-500">
																<h3 className="mb-1 font-bold">{data["title"]}</h3>
																<p className="text-sm text-darkGray dark:text-gray-400">
																	{moment(data["timestamp"]).format("MMMM DD, YYYY")} at
																	{moment(data["timestamp"]).format("h:mm a")}
																</p>
															</div>
															<div className="px-8 py-4">
																<div className="mb-4 flex flex-wrap">
																	<div className="mr-4 w-full pr-4 lg:max-w-[20%]">
																		<h6 className="text-sm font-bold">Scheduled by</h6>
																		<p className="text-[12px] text-darkGray dark:text-gray-400">
																			{data["to_user"]["email"]}
																		</p>
																	</div>
																	<div className="w-full pl-4 lg:max-w-[20%]">
																		<h6 className="text-sm font-bold">Job ID</h6>
																		<p className="text-[12px] text-darkGray dark:text-gray-400">
																			{data["job"]["refid"]}
																		</p>
																	</div>
																</div>
															</div>
														</div>
													)}

													{data["notification_type"] === "Applicant" && (
														<div className="mb-4 overflow-hidden rounded-normal bg-green-100 last:mb-0" key={i}>
															<div className="border-b border-green-200 px-8 py-4">
																<h3 className="mb-1 font-bold dark:text-black">{data["title"]}</h3>
																<p className="text-sm text-darkGray">
																	{moment(data["timestamp"]).format("MMMM DD, YYYY")} at{" "}
																	{moment(data["timestamp"]).format("h:mm a")}
																</p>
															</div>
															<div className="px-8 py-4">
																<div className="mb-4 flex flex-wrap">
																	<div className="mr-4 w-full pr-4 lg:max-w-[20%]">
																		<h6 className="text-sm font-bold dark:text-black">Scheduled by</h6>
																		<p className="text-[12px] text-darkGray">{data["to_user"]["email"]}</p>
																	</div>
																	<div className="mr-4 w-full pl-4 lg:max-w-[20%]">
																		<h6 className="text-sm font-bold dark:text-black">Job ID</h6>
																		<p className="text-[12px] text-darkGray">{data["applicant"]["job"]["refid"]}</p>
																	</div>
																	<div className="w-full pl-4 lg:max-w-[20%]">
																		<h6 className="text-sm font-bold dark:text-black">Applicant ID</h6>
																		<p className="text-[12px] text-darkGray">{data["applicant"]["arefid"]}</p>
																	</div>
																</div>
															</div>
														</div>
													)}
												</>
											)
										)
									) : (
										<>
											<div>No Notification</div>
										</>
									)}
								</>
							)}

							{/* <div className="mb-4 overflow-hidden rounded-normal bg-lightBlue last:mb-0 dark:bg-gray-600">
								<div className="border-b px-8 py-4 dark:border-gray-500">
									<h3 className="mb-1 font-bold">Video Interview has been scheduled</h3>
									<p className="text-sm text-darkGray dark:text-gray-400">March 23, 2023 at 6:00 pm</p>
								</div>
								<div className="px-8 py-4">
									<div className="mb-4 flex flex-wrap">
										<div className="mr-4 w-full pr-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold">Scheduled by</h6>
											<p className="text-[12px] text-darkGray dark:text-gray-400">Admin Smith</p>
										</div>
										<div className="w-full pl-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold">Job ID</h6>
											<p className="text-[12px] text-darkGray dark:text-gray-400">54123</p>
										</div>
									</div>
									<div className="mb-4 flex flex-wrap">
										<div className="mr-4 w-full border-r pr-4 dark:border-gray-500 lg:max-w-[20%]">
											<h6 className="text-sm font-bold">Interview Type</h6>
											<p className="text-[12px] text-darkGray dark:text-gray-400">Video Interview</p>
										</div>
										<div className="w-full pl-4 lg:max-w-[20%]">
											<div className="flex items-center">
												<Image
													src={googleIcon}
													alt="Google"
													width={100}
													className="h-[30px] w-auto rounded-full object-cover"
												/>
												<aside className="pl-3 text-[12px]">
													<h5 className="text-sm font-bold">Google Meet</h5>
													<Link href="www.googlemeet.com" target="_blank" className="text-primary">
														www.googlemeet.com
													</Link>
												</aside>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mb-4 overflow-hidden rounded-normal bg-red-100 last:mb-0">
								<div className="border-b border-red-200 px-8 py-4">
									<h3 className="mb-1 font-bold dark:text-black">
										Applicant Profile is <span className="text-red-700">Rejected</span>
									</h3>
									<p className="text-sm text-darkGray">March 23, 2023 at 6:00 pm</p>
								</div>
								<div className="px-8 py-4">
									<div className="mb-4 flex flex-wrap">
										<div className="mr-4 w-full pr-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold dark:text-black">Scheduled by</h6>
											<p className="text-[12px] text-darkGray">Admin Smith</p>
										</div>
										<div className="w-full pl-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold dark:text-black">Job ID</h6>
											<p className="text-[12px] text-darkGray">54123</p>
										</div>
									</div>
								</div>
							</div>
							<div className="mb-4 overflow-hidden rounded-normal bg-green-100 last:mb-0">
								<div className="border-b border-green-200 px-8 py-4">
									<h3 className="mb-1 font-bold dark:text-black">
										Applicant Profile is <span className="text-green-700">Shortlisted</span>
									</h3>
									<p className="text-sm text-darkGray">March 23, 2023 at 6:00 pm</p>
								</div>
								<div className="px-8 py-4">
									<div className="mb-4 flex flex-wrap">
										<div className="mr-4 w-full pr-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold dark:text-black">Scheduled by</h6>
											<p className="text-[12px] text-darkGray">Admin Smith</p>
										</div>
										<div className="w-full pl-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold dark:text-black">Job ID</h6>
											<p className="text-[12px] text-darkGray">54123</p>
										</div>
									</div>
								</div>
							</div>
							<div className="mb-4 overflow-hidden rounded-normal bg-lightBlue last:mb-0 dark:bg-gray-600">
								<div className="px-8 py-4">
									<h3 className="mb-1 font-bold">Vendor (Name) has been successfully logged in</h3>
									<p className="text-sm text-darkGray dark:text-gray-400">March 23, 2023 at 6:00 pm</p>
								</div>
							</div>
							<div className="mb-4 overflow-hidden rounded-normal bg-lightBlue last:mb-0 dark:bg-gray-600">
								<div className="px-8 py-4">
									<h3 className="mb-1 font-bold">New Team Member (Name) has been successfully logged in</h3>
									<p className="text-sm text-darkGray dark:text-gray-400">March 23, 2023 at 6:00 pm</p>
								</div>
							</div>
							<div className="mb-4 overflow-hidden rounded-normal bg-lightBlue last:mb-0 dark:bg-gray-600">
								<div className="border-b px-8 py-4 dark:border-gray-500">
									<h3 className="mb-1 font-bold">Jane Cooper has posted a new job</h3>
									<p className="text-sm text-darkGray dark:text-gray-400">March 23, 2023 at 6:00 pm</p>
								</div>
								<div className="px-8 py-4">
									<div className="mb-4 flex flex-wrap">
										<div className="mr-4 w-full pr-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold">Scheduled by</h6>
											<p className="text-[12px] text-darkGray dark:text-gray-400">Admin Smith</p>
										</div>
										<div className="w-full pl-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold">Job ID</h6>
											<p className="text-[12px] text-darkGray dark:text-gray-400">54123</p>
										</div>
									</div>
								</div>
							</div>
							<div className="mb-4 overflow-hidden rounded-normal bg-lightBlue last:mb-0 dark:bg-gray-600">
								<div className="border-b px-8 py-4 dark:border-gray-500">
									<h3 className="mb-1 font-bold">Applicant has been shifted to Offer Management</h3>
									<p className="text-sm text-darkGray dark:text-gray-400">March 23, 2023 at 6:00 pm</p>
								</div>
								<div className="px-8 py-4">
									<div className="mb-4 flex flex-wrap">
										<div className="mr-4 w-full pr-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold">Scheduled by</h6>
											<p className="text-[12px] text-darkGray dark:text-gray-400">Admin Smith</p>
										</div>
										<div className="w-full pl-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold">Job ID</h6>
											<p className="text-[12px] text-darkGray dark:text-gray-400">54123</p>
										</div>
									</div>
								</div>
							</div>
							<div className="mb-4 overflow-hidden rounded-normal bg-red-100 last:mb-0">
								<div className="border-b border-red-200 px-8 py-4">
									<h3 className="mb-1 font-bold dark:text-black">
										Jane Cooper has <span className="text-red-700">Closed</span> a job
									</h3>
									<p className="text-sm text-darkGray">March 23, 2023 at 6:00 pm</p>
								</div>
								<div className="px-8 py-4">
									<div className="mb-4 flex flex-wrap">
										<div className="mr-4 w-full pr-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold dark:text-black">Scheduled by</h6>
											<p className="text-[12px] text-darkGray">Admin Smith</p>
										</div>
										<div className="w-full pl-4 lg:max-w-[20%]">
											<h6 className="text-sm font-bold dark:text-black">Job ID</h6>
											<p className="text-[12px] text-darkGray">54123</p>
										</div>
									</div>
								</div>
							</div> */}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
