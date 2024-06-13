import Button from "@/components/Button";
import { Dialog, Transition } from "@headlessui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { Fragment, useState, useEffect, useRef } from "react";
import userImg1 from "/public/images/user-image1.jpeg";
import googleIcon from "/public/images/social/google-icon.png";
import Link from "next/link";
import moment from "moment";
import { useLangStore, useNotificationStore, useUserStore, useVersionStore } from "@/utils/code";
import toastcomp from "../toast";
import TImeSlot from "../TimeSlot";
import { debounce } from "lodash";
import Button2 from "../Button2";

const CalendarIntegrationOptions = [
	{ provider: "Google Calendar", icon: googleIcon, link: "/api/integrations/gcal/create" }
];

function UserProfile({ data, axiosInstanceAuth2 }) {
	const [profileUrl, setProfileUrl] = useState("");

	useEffect(() => {
		async function fetchProfile(id) {
			var profile = "";
			await axiosInstanceAuth2.get(`/organization/get/profile/${id}/`).then((res) => {
				profile = res.data[0]["profile"];
				// console.log("$", id, res.data);
				// console.log("$", id, profile);
				setProfileUrl(profile);
			});
		}

		fetchProfile(data.id);
	}, [data.id]);

	if (profileUrl.length > 0) {
		return <Image src={profileUrl} alt="User" width={40} height={40} className="h-[40px] rounded-full object-cover" />;
	} else {
		return <Image src={userImg1} alt="User" width={40} height={40} className="h-[40px] rounded-full object-cover" />;
	}
}

export default function InterviewComp({ sklLoad, data, axiosInstanceAuth2, upcome, loadUpcomingInterview }: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [accordionOpen, setAccordionOpen] = useState(false);
	const version = useVersionStore((state: { version: any }) => state.version);
	const user = useUserStore((state: { user: any }) => state.user);
	const cancelButtonRef = useRef(null);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	if (sklLoad === true) {
		return (
			<>
				<div className="border-b py-6 last:border-b-0">
					<h6 className="mb-2 text-darkGray dark:text-gray-400">
						<Skeleton width={120} />
					</h6>
					<div className="mb-3 rounded border text-sm">
						<div className="flex flex-wrap items-center px-4">
							<div className="w-full px-2 py-3 lg:max-w-[25%]">
								<Skeleton width={80} />
								<Skeleton width={120} />
							</div>
							<div className="w-full px-2 py-3 lg:max-w-[25%]">
								<Skeleton width={80} />
								<Skeleton width={120} />
							</div>
							<div className="w-full px-2 py-3 lg:max-w-[25%]">
								<Skeleton width={80} />
								<Skeleton width={120} />
							</div>
							<div className="w-full py-3 lg:max-w-[10%]">
								<Skeleton width={80} height={25} />
							</div>
							<div className="w-full py-3 text-right lg:max-w-[15%]">
								<Skeleton width={80} height={25} />
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

	function rescheduleEvent(eventID: any, arefid: any) {
		seteventID(eventID);
		setcardarefid(arefid);
		checkGCAL();
	}

	async function deleteEvent(eventID: any) {
		const fd = new FormData();
		fd.append("eventID", eventID);
		await axiosInstanceAuth2.post("/gcal/event/delete/", fd).then((res) => {
			toastcomp(res.data.res, res.data.type);
			loadUpcomingInterview();
		});
	}

	const [gcall, setgcall] = useState(false);
	const [cardarefid, setcardarefid] = useState("");
	const [eventID, seteventID] = useState("");

	async function checkGCAL() {
		setgcall(false);
		await axiosInstanceAuth2
			.post("gcal/connect-google/")
			.then((res) => {
				if (res.data.res === "success") {
					setgcall(true);
				}
				setIsCalendarOpen(true);
			})
			.catch(() => {
				setIsCalendarOpen(true);
			});
	}

	async function coonectGoogleCal() {
		setgcall(false);
		await axiosInstanceAuth2.post("gcal/connect-google/").then((res) => {
			if (res.data.authorization_url) {
				router.replace(`${res.data.authorization_url}`);
			} else if (res.data.res === "success") {
				// router.replace(`http://localhost:3000/organization/dashboard?gcal=success`);
				// setIsCalendarOpen(true);
				setgcall(true);
			}
		});
		// .catch((res) => {
		// 	if (res.data.authorization_url) {
		// 		router.replace(`${res.data.authorization_url}`);
		// 	} else if (res.data.res === "success") {
		// 		router.replace(`http://localhost:3000/organization/dashboard?gcal=success`);
		// 	}
		// });
	}

	return (
		<>
			<div className="py-3">
				{/* <div className="border-b py-6 last:border-b-0"> */}
				{/* <h6 className="mb-2 text-darkGray dark:text-gray-400">
					<b className="text-black dark:text-white">Today:</b> 8 Feb
				</h6> */}
				<div className={"rounded border text-sm" + " " + (accordionOpen ? "border-slate-300" : "")}>
					<div className="flex flex-wrap items-center px-4">
						<div className="w-full px-2 py-3 lg:max-w-[20%]">
							<h6 className="font-bold">{srcLang === "ja" ? "求人" : "Job"}</h6>
							<p className="text-[12px] text-darkGray dark:text-gray-400">{data["job"]["jobTitle"]}</p>
						</div>
						<div className="w-full px-2 py-3 lg:max-w-[25%]">
							<h6 className="font-bold">{srcLang === "ja" ? "候補者" : "Candidate"}</h6>
							<p className="clamp_1 break-all text-[12px] text-darkGray dark:text-gray-400">
								{data["applicant"] != null && (
									<>
										{data["applicant"]["fname"]}&nbsp;{data["applicant"]["lname"]}
										&nbsp;({data["applicant"]["type"]})
									</>
								)}
								{/* {data["applicant"]["user"]["first_name"] && data["applicant"]["user"]["first_name"]}&nbsp;
								{data["applicant"]["user"]["last_name"] && data["applicant"]["user"]["last_name"]} */}
								{/* &nbsp;-&nbsp;ID&nbsp;{data["arefid"]} */}
							</p>
						</div>
						<div className="w-full px-2 py-3 lg:max-w-[35%]">
							<h6 className="font-bold">{srcLang === "ja" ? "実施時間" : "Scheduled Time"}</h6>
							<p className="text-[12px] text-darkGray dark:text-gray-400">
								{moment(data["date_time_from"]).format("DD MMM YYYY h:mm a")} to{" "}
								{moment(data["date_time_to"]).format("h:mm a")}
							</p>
						</div>
						{/* <div className="w-full px-2 py-3 lg:max-w-[25%]">
							<h6 className="font-bold">Scheduled Start Time</h6>
							<p className="text-[12px] text-darkGray dark:text-gray-400">2:00 PM to 3:00 PM</p>
						</div>
						<div className="w-full px-2 py-3 lg:max-w-[25%]">
							<h6 className="font-bold">Scheduled End Time</h6>
							<p className="text-[12px] text-darkGray dark:text-gray-400">2:00 PM to 3:00 PM</p>
						</div> */}
						<div className="w-full py-3 lg:max-w-[10%]">
							<Button2
								small
								label={srcLang === "ja" ? "参加" : "Join"}
								btnStyle="primary"
								btnType="button"
								handleClick={() => {
									window.open(
										data["link"],
										"_blank" // <- This is what makes it open in a new window.
									);
								}}
							/>
						</div>
						{!["standard", "starter"].includes(version) && (
							<div className="w-full py-3 text-right lg:max-w-[100px]">
								<button
									type="button"
									className="flex items-center font-semibold text-darkGray dark:text-gray-400"
									onClick={() => setAccordionOpen(!accordionOpen)}
								>
									{srcLang === "ja" ? "詳細をみる" : "View More"}
									<i className={"fa-solid ml-2" + " " + (accordionOpen ? "fa-chevron-up" : "fa-chevron-down")}></i>
								</button>
							</div>
						)}
					</div>
					<Transition.Root show={accordionOpen} as={Fragment}>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="border-t">
								<div className="flex flex-wrap">
									<div className="w-full border-r md:max-w-[75%]">
										<div className="px-6 py-4">
											<div className="mb-4 flex flex-wrap">
												<div className="my-1 mr-4 w-full pr-4 lg:max-w-[25%]">
													<h6 className="mb-1 font-bold">{srcLang === "ja" ? "設定者" : "Scheduled by"}</h6>
													<p className="text-[12px] text-darkGray dark:text-gray-400">{data["user"]["email"]}</p>
												</div>
												<div className="my-1 w-full lg:max-w-[50%] lg:pl-4">
													<h6 className="mb-1 font-bold">{srcLang === "ja" ? "求人ID" : "Job ID"}</h6>
													<p className="text-[12px] text-darkGray dark:text-gray-400">{data["job"]["refid"]}</p>
												</div>
											</div>
											<div className="mb-4 flex flex-wrap">
												<div className="mr-4 w-full border-r pr-4 lg:max-w-[25%]">
													<h6 className="mb-1 font-bold">{srcLang === "ja" ? "面接方法" : "Interview Type"}</h6>
													<p className="text-[12px] text-darkGray dark:text-gray-400">{data["platform"]}</p>
												</div>
												<div className="w-full lg:max-w-[50%] lg:pl-4">
													<div className="flex items-center">
														<Image
															src={googleIcon}
															alt="Google"
															width={100}
															className="h-[30px] w-auto rounded-full object-cover"
														/>
														<aside className="pl-3 text-[12px]">
															<h5 className="font-bold">{data["platform"]}</h5>
															<Link href={data["link"]} target="_blank" className="text-primary">
																{data["link"]}
															</Link>
														</aside>
													</div>
												</div>
											</div>
											<div className="mb-4 flex flex-wrap">
												<div className="w-full">
													<h6 className="mb-1 font-bold">{srcLang === "ja" ? "面接官" : "Interviewers"}</h6>
													<ul className="mb-2 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
														{data["add_interviewer"] && data["add_interviewer"].length > 0 ? (
															data["add_interviewer"].map((data, i) =>
																i === 0 ? (
																	<li className="mr-3 list-none" key={i}>
																		{data["name"]}
																	</li>
																) : (
																	<li className="mr-3" key={i}>
																		{data["name"]}
																	</li>
																)
															)
														) : (
															<li className="mr-3 list-none">None</li>
														)}
													</ul>
												</div>
											</div>
											<div className="mb-2 flex flex-wrap">
												<div className="w-full">
													<h6 className="mb-1 font-bold">{srcLang === "ja" ? "面接概要" : "Event Name"}</h6>
													<p className="text-[12px] text-darkGray dark:text-gray-400">{data["interview_name"]}</p>
												</div>
											</div>
											{upcome &&
												user[0]["email"] === data["user"]["email"] &&
												data["event_id"] &&
												data["event_id"].length > 0 && (
													<div className="flex flex-wrap">
														<div className="my-1 mr-4 last:mr-0">
															<Button
																btnStyle="success"
																label={srcLang === "ja" ? "再調整" : "Reschedule"}
																btnType="button"
																handleClick={() => rescheduleEvent(data["event_id"], data["applicant"]["arefid"])}
															/>
														</div>
														<div className="my-1 mr-4 last:mr-0">
															<Button
																btnStyle="danger"
																label={srcLang === "ja" ? "キャンセル" : "Cancel"}
																btnType="button"
																handleClick={() => deleteEvent(data["event_id"])}
															/>
														</div>
													</div>
												)}
										</div>
									</div>
									<div className="w-full md:max-w-[25%]">
										<div className="border-b p-3 text-center">
											<h3 className="font-bold">{srcLang === "ja" ? "チームメンバー" : "Team Members"} </h3>
										</div>
										<div className="max-h-[270px] overflow-y-auto py-2">
											{data["add_interviewer"] && data["add_interviewer"].length > 0 ? (
												data["add_interviewer"].map((data, i) => (
													<div className="flex items-center px-4 py-2" key={i}>
														<UserProfile data={data} axiosInstanceAuth2={axiosInstanceAuth2} />

														<aside className="pl-4 text-[12px]">
															<h5 className="font-bold">{data["name"]}</h5>
															<p className="text-darkGray dark:text-gray-400">{data["role"]}</p>
														</aside>
													</div>
												))
											) : (
												<p className="text-center">
													{srcLang === "ja" ? "チームメンバーがいません" : "No Team Members"}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</Transition.Child>
					</Transition.Root>
				</div>
			</div>

			<Transition.Root show={isCalendarOpen} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setIsCalendarOpen}>
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
								{gcall ? (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-md">
										<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
											<h4 className="font-semibold leading-none">Re-Schedule Interview</h4>
											<button
												type="button"
												className="leading-none hover:text-gray-700"
												onClick={() => setIsCalendarOpen(false)}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										</div>
										<div className="p-8">
											<TImeSlot
												cardarefid={cardarefid}
												eventID={eventID}
												loadUpcomingInterview={loadUpcomingInterview}
												axiosInstanceAuth2={axiosInstanceAuth2}
												setIsCalendarOpen={setIsCalendarOpen}
												type={"interview"}
											/>
										</div>
									</Dialog.Panel>
								) : (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-md">
										<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
											<h4 className="font-semibold leading-none">Integrate Calendar</h4>
											<button
												type="button"
												className="leading-none hover:text-gray-700"
												onClick={() => setIsCalendarOpen(false)}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										</div>
										<div className="p-8">
											<div className="flex flex-wrap">
												{CalendarIntegrationOptions.map((integration, i) => (
													<div key={i} className="my-2 w-full cursor-pointer overflow-hidden rounded-normal border">
														<div
															onClick={coonectGoogleCal}
															className="flex w-full items-center justify-between p-4 hover:bg-lightBlue hover:dark:bg-gray-900"
														>
															<Image
																src={integration.icon}
																alt={integration.provider}
																width={150}
																className="mr-4 max-h-[24px] w-auto"
															/>
															<span className="min-w-[60px] rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-2 py-1 text-[12px] text-white hover:from-gradDarkBlue hover:to-gradDarkBlue">
																{`Integrate ${integration.provider}`}
															</span>
														</div>
													</div>
												))}
											</div>
										</div>
									</Dialog.Panel>
								)}
								{/* {integration && integration.length > 0 ? (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-5xl">
										<OrganizationCalendar integration={integration[0]} />
									</Dialog.Panel>
								) : (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-md">
										<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
											<h4 className="font-semibold leading-none">Integrate Calendar</h4>
											<button
												type="button"
												className="leading-none hover:text-gray-700"
												onClick={() => setIsCalendarOpen(false)}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										</div>
										<div className="p-8">
											<div className="flex flex-wrap">
												{CalendarIntegrationOptions.map((integration, i) => (
													<div key={i} className="my-2 w-full overflow-hidden rounded-normal border">
														<Link
															href={integration.link}
															className="flex w-full items-center justify-between p-4 hover:bg-lightBlue"
														>
															<Image
																src={integration.icon}
																alt={integration.provider}
																width={150}
																className="mr-4 max-h-[24px] w-auto"
															/>
															<span className="min-w-[60px] rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-2 py-1 text-[12px] text-white hover:from-gradDarkBlue hover:to-gradDarkBlue">
																{`Integrate ${integration.provider}`}
															</span>
														</Link>
													</div>
												))}
											</div>
										</div>
									</Dialog.Panel>
								)} */}
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}
