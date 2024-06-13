import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { axiosInstance } from "@/utils";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import {
	addNotifyApplicantLog,
	addNotifyLog,
	axiosInstance2,
	axiosInstanceAuth,
	axiosInstanceAuth22
} from "@/pages/api/axiosApi";
import { useEffect, useState, useRef, Fragment } from "react";
import { useApplicantStore, useCalStore, useNotificationStore, useUserStore } from "@/utils/code";
import Button from "@/components/Button";
import Image from "next/image";
import jobIcon from "/public/images/icons/jobs.png";
import TeamMembers from "@/components/TeamMembers";
import userImg from "/public/images/user-image.png";
import moment from "moment";
import CardLayout_1 from "@/components/CardLayout-1";
import toastcomp from "@/components/toast";
import favIcon from "/public/favicon-white.ico";
import UpcomingComp from "@/components/organization/upcomingComp";
import userImg1 from "/public/images/user-image1.jpeg";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import googleIcon from "/public/images/social/google-icon.png";
import TImeSlot from "@/components/TimeSlot";
import { Tab, Listbox, Transition, Dialog } from "@headlessui/react";
import { useNewNovusStore } from "@/utils/novus";
import OrgRSideBar from "@/components/organization/RSideBar";
import FormField from "@/components/FormField";
import PermiumComp from "@/components/organization/premiumComp";

const CalendarIntegrationOptions = [
	{ provider: "Google Calendar", icon: googleIcon, link: "/api/integrations/gcal/create" }
];

const people = [
	{ name: "Sourced", unavailable: false },
	{ name: "Interview(Optional)", unavailable: false },
	{ name: "Share", unavailable: false },
	{ name: "Interview", unavailable: false },
	{ name: "Offer", unavailable: false },
	{ name: "Hired", unavailable: false },
	{ name: "OfferDeclined", unavailable: false },
	{ name: "Rejected", unavailable: false }
];

export default function ApplicantsDetail({ atsVersion, userRole, upcomingSoon }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const jobid = useApplicantStore((state: { jobid: any }) => state.jobid);
	const appid = useApplicantStore((state: { appid: any }) => state.appid);
	const type = useApplicantStore((state: { type: any }) => state.type);
	const appdata = useApplicantStore((state: { appdata: any }) => state.appdata);
	const setappdata = useApplicantStore((state: { setappdata: any }) => state.setappdata);
	const currentUser = useUserStore((state: { user: any }) => state.user);
	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	const { data: session } = useSession();
	const [token, settoken] = useState("");

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [manualInterview, setmanualInterview] = useState(false);
	const cancelButtonRef = useRef(null);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);
	const axiosInstanceAuth21 = axiosInstanceAuth22(token);

	const [selectedPerson, setSelectedPerson] = useState(people[3]);

	//tiemline
	const [timeline, settimeline] = useState([]);

	//ai interview question
	const [aires, setaires] = useState("");
	const [aiquestion, setaiquestion] = useState([]);
	const [ailoader, setailoader] = useState(false);
	//ai c a
	const [ailoader2, setailoader2] = useState(false);

	const [docs, setdocs] = useState([]);
	//feedback
	const [feedbackList, setfeedbackList] = useState([]);
	const [editfeedback, seteditfeedback] = useState(false);
	const [editfeedbackTA, seteditfeedbackTA] = useState("");
	const [feedbackreload, setfeedbackreload] = useState(true);
	const [currentUserFeedback, setcurrentUserFeedback] = useState(false);

	const [feedbackStatus, setfeedbackStatus] = useState("");
	const [feedbackTA, setfeedbackTA] = useState("");

	useEffect(() => {
		// toastcomp(appdata["status"],"success")
		for (let i = 0; i < people.length; i++) {
			if (people[i]["name"] === appdata["status"]) {
				setSelectedPerson(people[i]);
			}
		}
	}, [appdata]);

	async function loadNEWAPPDATA(arefid: any) {
		await axiosInstanceAuth2
			.get(`/applicant/applicant-detail/${arefid}/`)
			.then((res) => {
				// console.log("@@@@@", "applicant-detail", res.data);
				setappdata(res.data[0]);
			})
			.catch((err) => {
				// console.log(err);
			});
	}

	async function loadAppDosc() {
		let arefid = appdata["arefid"];
		await axiosInstanceAuth2
			.get(`/applicant/listdocs/${arefid}/`)
			.then((res) => {
				// console.log("@@@@@", "listdocs", res.data);
				setdocs(res.data);
			})
			.catch((err) => {
				// console.log(err);
			});
	}

	async function chnageStatus(status: string, arefid: any) {
		const fdata = new FormData();
		fdata.append("status", status);
		await axiosInstanceAuth2
			.put(`/applicant/applicant-status/${arefid}/update/`, fdata)
			.then((res) => {
				toastcomp("Status Changed", "success");
				loadNEWAPPDATA(arefid);
				loadTimeLine();
			})
			.catch((err) => {
				// console.log(err);
				toastcomp("Status Not Change", "error");
			});
	}

	function moveApplicant(v) {
		setSelectedPerson(v);
		chnageStatus(v["name"], appid);
	}

	async function loadTimeLine() {
		await axiosInstanceAuth21
			.get(`/applicant/list-applicant-timeline/${appdata["arefid"]}/`)
			.then(async (res) => {
				settimeline(res.data);
				// console.log("$", "timeline", res.data);
			})
			.catch((err) => {
				// console.log("!", err);
				settimeline([]);
			});
	}

	async function loadAIInterviewQuestion() {
		if (!["standard", "starter"].includes(atsVersion)) {
			setailoader(true);

			await axiosInstanceAuth21
				.get(`/applicant/interview-question-generator/${appdata["arefid"]}/${srcLang}/`)
				.then(async (res) => {
					setaires(res.data["res"]);
					setaiquestion(res.data["res"].split("\n"));
					setailoader(false);
				})
				.catch((err) => {
					// console.log("!", err);
					setailoader(false);
				});
		}
	}

	async function genAIFeedback() {
		if (!["standard", "starter"].includes(atsVersion)) {
			setailoader2(true);

			await axiosInstanceAuth21
				.post(`/applicant/ai-feedback/${appdata["arefid"]}/`)
				.then(async (res) => {
					toastcomp("genAIFeedback ", "success");
					loadNEWAPPDATA(appdata["arefid"]);
					setailoader2(false);
				})
				.catch((err) => {
					toastcomp("genAIFeedback ", "error");
					// console.log("!", err);
					setailoader2(false);
				});
		}
	}
	
	useEffect(() => {
		if (token && token.length > 0 && aiquestion.length <= 0 && atsVersion && atsVersion.length > 0) {
			loadTimeLine();
			loadAppDosc();
			// if (!["standard", "starter"].includes(atsVersion)) {
			// 	loadAIInterviewQuestion();
			// }
		}
	}, [token, atsVersion]);

	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	// manual interview
	const [mtitle, setmtitle] = useState("");
	const [mdesc, setmdesc] = useState("");
	const [mlink, setmlink] = useState("");
	const [msdate, setmsdate] = useState("");
	const [medate, setmedate] = useState("");
	const [mfsdate, setmfsdate] = useState("");
	const [mfedate, setmfedate] = useState("");

	function disBtn() {
		return mtitle.length > 0 && mdesc.length > 0 && mlink.length > 0 && mfsdate.length > 0 && mfedate.length > 0;
	}

	useEffect(() => {
		setmfsdate(moment(msdate).format().toString());
	}, [msdate]);

	useEffect(() => {
		setmfedate(moment(medate).format().toString());
	}, [medate]);

	async function starterInterviewSchedule() {
		const fd = new FormData();
		fd.append("date_time_from", mfsdate);
		fd.append("date_time_to", mfedate);
		fd.append("interview_name", mtitle);
		fd.append("description", mdesc);
		fd.append("link", mlink);
		await axiosInstanceAuth2
			// .post(`/job/create-interview/${appdata["arefid"]}/${appdata["job"]["refid"]}/`, fd)
			.post(`/applicant/create-interview/${appdata["arefid"]}/${appdata["job"]["refid"]}/`, fd)
			.then(async (res) => {
				toastcomp("Interview Scheduled", "success");
				loadTimeLine();
				setmanualInterview(false);
				setmtitle("");
				setmdesc("");
				setmlink("");
				setmsdate("");
				setmedate("");
				setmfsdate("");
				setmfedate("");
			})
			.catch((err) => {
				toastcomp("Interview not Scheduled", "error");
				loadTimeLine();
				setmanualInterview(false);
				setmtitle("");
				setmdesc("");
				setmlink("");
				setmsdate("");
				setmedate("");
				setmfsdate("");
				setmfedate("");
			});
	}

	return (
		<>
			<Head>
				<title>{t("Words.ApplicantDetails")}</title>
			</Head>
			<main>
				<Orgsidebar />
				<Orgtopbar />
				{token && token.length > 0 && <OrgRSideBar axiosInstanceAuth2={axiosInstanceAuth2} />}
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className={`layoutWrap p-4` + " " + (visible && "mr-[calc(27.6%+1rem)]")}>
					<div className="relative">
						<div className="flex flex-wrap">
							<div className="w-full xl:max-w-[300px] 2xl:max-w-[400px]">
								<div className="mb-4 flex items-center rounded-large border-2 border-slate-300 bg-white p-5 shadow-normal dark:border-gray-700 dark:bg-gray-800">
									<button
										className="mr-5 justify-self-start text-darkGray dark:text-gray-400"
										onClick={() => {
											router.replace("/agency/applicants");
										}}
									>
										<i className="fa-solid fa-arrow-left text-xl"></i>
									</button>
									<h2 className="text-lg font-bold">
										<span>{t("Words.Profile")}</span>
									</h2>
								</div>
								<div className="mb-4 max-h-[500px] overflow-auto rounded-large border-2 border-slate-300 bg-white p-5 shadow-normal dark:border-gray-700 dark:bg-gray-800 xl:max-h-[inherit]">
									<div className="mb-4 border-b pb-4">
										<div className="mb-4 border-b pb-2 text-center">
											<Image
												src={userImg1}
												alt="User"
												width={90}
												height={90}
												className="mx-auto mb-3 h-[90px] rounded-full object-cover shadow-normal"
											/>
											<h3 className="mb-2 font-bold">
												{appdata["fname"]} {appdata["lname"]}
											</h3>
											<p className="mb-2 text-sm text-darkGray">{appdata["arefid"]}</p>
											<p className="mb-2 text-sm text-darkGray">
												{t("Words.Source")} - &nbsp;
												<span className="font-semibold lowercase text-primary dark:text-white">
													{type}{" "}
													{appdata["vaccount"] && (
														<span className="mb-2 text-sm normal-case text-darkGray ">
															({appdata["vaccount"]["agent_name"]} from {appdata["vaccount"]["company_name"]})
														</span>
													)}
													{appdata["taccount"] && (
														<span className="mb-2 text-sm normal-case text-darkGray ">
															({appdata["taccount"]["email"]})
														</span>
													)}
												</span>
											</p>
										</div>
										<div className="flex flex-wrap items-center justify-between">
											<div className="my-1 flex items-center">
												<div className="mr-2 block h-[26px] w-[30px] rounded border border-white bg-red-100 text-center leading-[23px] text-red-500 shadow-normal">
													<i className="fa-regular fa-envelope"></i>
												</div>
												<p className="text-[11px] font-semibold text-darkGray">{appdata["email"]}</p>
											</div>
											<div className="my-1 flex items-center">
												<div className="mr-2 block h-[26px] w-[30px] rounded border border-white bg-teal-100 text-center leading-[23px] text-teal-500 shadow-normal">
													<i className="fa-solid fa-percent"></i>
												</div>
												<p className="text-[11px] font-semibold text-darkGray">{appdata["percentage_fit"]}</p>
											</div>
										</div>
										{/* {linkData && linkData.length > 0 && (
											<div className="flex flex-wrap items-center justify-center text-2xl">
												{linkData.map((data: any, i: React.Key) => (
													<Link href={`${data["title"]}`} target="_blank" className="m-3 mb-0" key={i}>
														<i className="fa-solid fa-link"></i>
													</Link>
												))}
											</div>
										)} */}
									</div>
									{/* <div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">{t("Words.Details")}</h3>
										<ul className="flex flex-wrap text-[12px] text-darkGray">
											<li className="mb-2 w-[50%] pr-2">
												{t("Form.CurrentSalary")} - {profileData["current_salary"]}
											</li>
											<li className="mb-2 w-[50%] pr-2">
												{t("Form.ExpectedSalary")} - {profileData["expected_salary"]}
											</li>
										</ul>
									</div> */}
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">{t("Words.Summary")}</h3>
										<p className="text-[12px] text-darkGray">{appdata["summary"]}</p>
									</div>
									{/* <div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">{t("Words.Skills")}</h3>
										{profileData["skills"] && profileData["skills"].length > 0 ? (
											<ul className="flex flex-wrap rounded-normal border p-2 text-[12px] shadow">
												{profileData["skills"].split(",").map((data: any, i: React.Key) => (
													<li
														className="m-1 min-w-[75px] rounded-[30px] bg-gray-100 px-4 py-2 text-center dark:bg-gray-700"
														key={i}
													>
														{data}
													</li>
												))}
											</ul>
										) : (
											<p className="text-[12px] text-darkGray">
												{t("Select.No")} {t("Words.Skills")}
											</p>
										)}
									</div> */}
									{/* <div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">{t("Words.Experience")}</h3>
										{experienceData && experienceData.length > 0 ? (
											experienceData.map((data: any, i: React.Key) => (
												<div
													className="mb-2 rounded-normal border p-3 text-[12px] text-darkGray shadow last:mb-0"
													key={i}
												>
													<h4 className="mb-1 font-bold text-black dark:text-white">{data["title"]}</h4>
													<p>{data["company"]}</p>
													<p className="mb-1">
														{moment(data["year_of_join"]).format("MMMM YYYY")} -{" "}
														{data["year_of_end"] ? moment(data["year_of_end"]).format("MMMM YYYY") : <>PRESENT</>}
													</p>
													<p>{data["type"]}</p>
													<p>{data["expbody"]}</p>
												</div>
											))
										) : (
											<p className="text-[12px] text-darkGray">
												{t("Select.No")} {t("Words.Experience")}
											</p>
										)}
									</div> */}
									{/* <div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">{t("Words.Education")}</h3>
										{educationData && educationData.length > 0 ? (
											educationData.map((data: any, i: React.Key) => (
												<div
													className="mb-2 rounded-normal border p-3 text-[12px] text-darkGray shadow last:mb-0"
													key={i}
												>
													<h4 className="mb-1 font-bold text-black dark:text-white">{data["title"]}</h4>
													<p>{data["college"]}</p>
													<p className="mb-1">
														{moment(data["yearofjoin"]).format("MMMM YYYY")} -{" "}
														{data["yearofend"] ? moment(data["yearofend"]).format("MMMM YYYY") : <>PRESENT</>}
													</p>
													<p>{data["edubody"]}</p>
												</div>
											))
										) : (
											<p className="text-[12px] text-darkGray">
												{t("Select.No")} {t("Words.Education")}
											</p>
										)}
									</div> */}
									{/* <div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">{t("Words.Certifications")}</h3>
										{certificateData && certificateData.length > 0 ? (
											certificateData.map((data: any, i: React.Key) => (
												<div
													className="mb-2 rounded-normal border p-3 text-[12px] text-darkGray shadow last:mb-0"
													key={i}
												>
													<h4 className="mb-1 font-bold text-black dark:text-white">{data["title"]}</h4>
													<p>{data["college"]}</p>
													<p className="mb-1">
														{moment(data["yearofissue"]).format("MMMM YYYY")} -{" "}
														{data["yearofexp"] ? moment(data["yearofexp"]).format("MMMM YYYY") : <>NOT EXPIRE</>}
													</p>
													<p>
														URL : {data["creurl"]} <br />
														ID : {data["creid"]}
													</p>
												</div>
											))
										) : (
											<p className="text-[12px] text-darkGray">
												{t("Select.No")} {t("Words.Certifications")}
											</p>
										)}
									</div> */}
									{type === "vendor" && (
										<div className="mb-4 border-b pb-4">
											<h3 className="mb-4 text-lg font-semibold">{t("Words.MessageFromVendor")}</h3>
											<p className="text-[12px] text-darkGray">{appdata["recuriter_message"]}</p>
										</div>
									)}
								</div>
							</div>
							<div className="w-full xl:max-w-[calc(100%-300px)] xl:pl-4 2xl:max-w-[calc(100%-400px)]">
								<div className="overflow-hidden rounded-large border-2 border-slate-300 bg-white shadow-normal dark:border-gray-700 dark:bg-gray-800">
									<div className="relative z-10 flex flex-wrap items-center justify-between p-5 shadow">
										<aside className="flex items-center">
											<Image src={jobIcon} alt="Jobs" width={20} className="mr-3 dark:invert" />
											<h2 className="text-lg font-bold">
												<span>{appdata["job"]["jobTitle"]}</span>
											</h2>
										</aside>
										<aside className="flex items-center">
											<div className="mr-4">
												<Button
													btnType="button"
													btnStyle="iconLeftBtn"
													label="Manual Interview"
													iconLeft={<i className="fa-solid fa-calendar-plus"></i>}
													handleClick={() => setmanualInterview(true)}
												/>
											</div>
											
											<div className="">
												<Listbox value={selectedPerson} onChange={(v) => moveApplicant(v)}>
													<Listbox.Button className={"rounded border border-slate-300 text-sm font-bold"}>
														<span className="px-3 py-2">{t("Words.MoveApplicant")}</span>
														<i className="fa-solid fa-chevron-down ml-2 border-l px-3 py-2 text-sm"></i>
													</Listbox.Button>
													<Transition
														enter="transition duration-100 ease-out"
														enterFrom="transform scale-95 opacity-0"
														enterTo="transform scale-100 opacity-100"
														leave="transition duration-75 ease-out"
														leaveFrom="transform scale-100 opacity-100"
														leaveTo="transform scale-95 opacity-0"
													>
														<Listbox.Options
															className={
																"absolute right-0 top-[100%] mt-2 w-[250px] rounded-normal bg-white py-2 shadow-normal dark:bg-gray-700"
															}
														>
															{people.map((person, i) => (
																<Listbox.Option
																	key={i}
																	value={person}
																	disabled={person.unavailable}
																	className="clamp_1 relative cursor-pointer px-6 py-2 pl-8 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																>
																	{({ selected }) => (
																		<>
																			<span className={` ${selected ? "font-bold" : "font-normal"}`}>
																				{person.name}
																			</span>
																			{selected ? (
																				<span className="absolute left-3">
																					<i className="fa-solid fa-check"></i>
																				</span>
																			) : null}
																		</>
																	)}
																</Listbox.Option>
															))}
														</Listbox.Options>
													</Transition>
												</Listbox>
											</div>
											{!upcomingSoon && <TeamMembers />}
										</aside>
									</div>
									<div className="">
										<Tab.Group>
											<Tab.List className={"overflow-auto border-b px-4"}>
												<div className="flex w-fit">
													<Tab as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
																	" " +
																	(selected
																		? "border-primary text-primary dark:border-white dark:text-white"
																		: "border-transparent text-darkGray dark:text-gray-400")
																}
															>
																{t("Words.Profile")}
															</button>
														)}
													</Tab>
													<Tab as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
																	" " +
																	(selected
																		? "border-primary text-primary dark:border-white dark:text-white"
																		: "border-transparent text-darkGray dark:text-gray-400") +
																	" " +
																	"display-none"
																}
															>
																{t("Words.Assessment")}
															</button>
														)}
													</Tab>
													<Tab as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
																	" " +
																	(selected
																		? "border-primary text-primary dark:border-white dark:text-white"
																		: "border-transparent text-darkGray dark:text-gray-400")
																}
															>
																{t("Words.Timeline")}
															</button>
														)}
													</Tab>
													<Tab as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
																	" " +
																	(selected
																		? "border-primary text-primary dark:border-white dark:text-white"
																		: "border-transparent text-darkGray dark:text-gray-400")
																}
															>
																{t("Words.AIGeneratedInterview")}
															</button>
														)}
													</Tab>
													<Tab as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
																	" " +
																	(selected
																		? "border-primary text-primary dark:border-white dark:text-white"
																		: "border-transparent text-darkGray dark:text-gray-400")
																}
															>
																AI Comparative Analysis
															</button>
														)}
													</Tab>
												</div>
											</Tab.List>
											<Tab.Panels>
												<Tab.Panel className={"min-h-[calc(100vh-250px)]"}>
													{appdata["resume"] && appdata["resume"].length > 0 && (
														<>
															<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-900">
																<p className="my-2">{appdata["resume"].split("/").pop()}</p>
																<Link
																	href={appdata["resume"]}
																	target="_blank"
																	className="my-2 inline-block font-bold text-primary hover:underline dark:text-white"
																	download={appdata["resume"].split("/").pop()}
																>
																	<i className="fa-solid fa-download mr-2"></i>
																	{t("Btn.Download")}
																</Link>
															</div>
															<iframe
																src={appdata["resume"]}
																className="mx-auto h-[100vh] w-[100%] max-w-[800px]"
															></iframe>
														</>
													)}

													{docs && docs.length > 0 && (
														<div className="mb-4 mt-4 border-t p-4 pb-4 dark:border-b-gray-600">
															<label className="mb-1 inline-block font-bold">Optional Document</label>
															<article className="flex flex-col text-sm">
																{docs.map((data, i) => (
																	<Link
																		key={i}
																		href={data["document"]}
																		target="_blank"
																		className="my-1 inline-block font-bold text-primary hover:underline dark:text-white"
																		download={data["document"].split("/").pop()}
																	>
																		<i className="fa-solid fa-download mr-2"></i>
																		{data["document"].split("/").pop()}
																	</Link>
																))}
															</article>
														</div>
													)}

													{/* {docs && docs.length > 0 && (
														<div className="px-1 py-2">
															<small className="mx-4 my-2">Optional Documents :</small>
															{docs.map((data, i) => (
																<>
																	<div
																		className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-900"
																		key={i}
																	>
																		<p className="my-2">{data["document"].split("/").pop()}</p>
																		<Link
																			href={data["document"]}
																			target="_blank"
																			className="my-2 inline-block font-bold text-primary hover:underline dark:text-white"
																			download={data["document"].split("/").pop()}
																		>
																			<i className="fa-solid fa-download mr-2"></i>
																			{t("Btn.Download")}
																		</Link>
																	</div>
																	<iframe
																		src={data["document"]}
																		className="mx-auto h-[60vh] w-[100%] max-w-[800px]"
																	></iframe>
																</>
															))}
														</div>
													)} */}
												</Tab.Panel>
												<Tab.Panel className={"min-h-[calc(100vh-250px)] px-8 py-6"}>
													{upcomingSoon ? (
														<UpcomingComp />
													) : (
														<div className="mx-[-15px] flex flex-wrap">
															{Array(6).fill(
																<div className="mb-[30px] w-full px-[15px] md:max-w-[50%]">
																	<CardLayout_1 isBlank={true} />
																</div>
															)}
														</div>
													)}
												</Tab.Panel>
												<Tab.Panel className={"min-h-[calc(100vh-250px)] px-8 py-6"}>
													{!upcomingSoon ? (
														<UpcomingComp />
													) : (
														<div className="relative max-h-[455px] overflow-y-auto before:absolute before:left-[80px] before:top-0 before:h-[100%] before:w-[1px] before:bg-gray-600 before:bg-slate-200 before:content-['']">
															{timeline && timeline.length > 0 ? (
																<>
																	{timeline.map((data, i) => (
																		<div className="flex items-start" key={i}>
																			<div className="w-[80px] px-2 py-4">
																				<p className="text-sm text-darkGray dark:text-gray-400">
																					{moment(data["timestamp"]).format("D MMM")}
																					<br />
																					<small>{moment(data["timestamp"]).format("h:mm A")}</small>
																				</p>
																			</div>
																			<div className="w-[calc(100%-80px)] pl-6">
																				<div className="border-b dark:border-b-gray-600">
																					<article className="py-4">
																						<h6 className="mb-2 text-sm font-bold">{data["message"]}</h6>
																						<p className="text-[12px] text-darkGray dark:text-gray-400">
																							By - {data["user"]["email"]}
																						</p>
																					</article>
																				</div>
																			</div>
																		</div>
																	))}
																</>
															) : (
																<>
																	<div className="text-center">No Data</div>
																</>
															)}

															{/* <div className="flex items-start">
																<div className="w-[80px] px-2 py-4">
																	<p className="text-sm text-darkGray dark:text-gray-400">
																		8 Feb
																		<br />
																		<small>2:30 PM</small>
																	</p>
																</div>
																<div className="w-[calc(100%-80px)] pl-6">
																	<div className="border-b dark:border-b-gray-600">
																		<article className="py-4">
																			<h6 className="mb-2 text-sm font-bold">
																				Applicant has been shifted to new Job -Software Engineer
																			</h6>
																			<p className="text-[12px] text-darkGray dark:text-gray-400">
																				By - Steve Paul : Collaborator
																			</p>
																		</article>
																		<article className="py-4">
																			<h6 className="mb-2 text-sm font-bold">
																				Applicant has been shifted to new Job -Software Engineer
																			</h6>
																			<p className="text-[12px] text-darkGray dark:text-gray-400">
																				By - Steve Paul : Collaborator
																			</p>
																		</article>
																	</div>
																</div>
															</div>
															<div className="flex items-start">
																<div className="w-[80px] px-2 py-4">
																	<p className="text-sm text-darkGray dark:text-gray-400">
																		8 Feb
																		<br />
																		<small>2:30 PM</small>
																	</p>
																</div>
																<div className="w-[calc(100%-80px)] pl-6">
																	<div className="border-b dark:border-b-gray-600">
																		<article className="py-4">
																			<h6 className="mb-2 text-sm font-bold">
																				Applicant has been shifted to new Job -Software Engineer
																			</h6>
																			<p className="text-[12px] text-darkGray dark:text-gray-400">
																				By - Steve Paul : Collaborator
																			</p>
																		</article>
																	</div>
																</div>
															</div> */}
														</div>
													)}
												</Tab.Panel>
												<Tab.Panel className={"min-h-[calc(100vh-250px)] px-8 py-6"}>
													{["standard", "starter"].includes(atsVersion) ? (
														<PermiumComp userRole={userRole} />
													) : (
														<div>
															<div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-2">
																<Image src={favIcon} alt="Somhako" width={30} />
															</div>
															<p className="mb-4 text-center text-darkGray dark:text-gray-400">
																{t("Words.AskQuestionsRelatedCandidate")}
															</p>
															<div className="mx-auto w-full max-w-[650px]">
																<div className="rounded-normal bg-lightBlue shadow-normal dark:bg-gray-600">
																	<div className="px-10 py-4">
																		{aiquestion &&
																			aiquestion.map((data, i) => (
																				<div
																					className="my-2 rounded border bg-white px-4 py-2 shadow-normal dark:border-gray-600 dark:bg-gray-800"
																					key={i}
																				>
																					<h5 className="text-sm text-darkGray dark:text-gray-100">{data}</h5>
																				</div>
																			))}
																	</div>
																	<div className="border-t px-10 py-4 dark:border-t-gray-600">
																		<button
																			type="button"
																			className="flex items-center justify-center rounded border border-slate-300 px-3 py-2 text-sm hover:bg-primary hover:text-white"
																			disabled={ailoader}
																			onClick={() => {
																				setaiquestion([]);
																				setaires("");
																				loadAIInterviewQuestion();
																			}}
																		>
																			{ailoader && (
																				<span className="mr-2 block">
																					<i className={"fa-solid fa-rotate fa-spin"}></i>
																				</span>
																			)}
																			{ailoader ? <>{t("Btn.InProgress")}</> : <>Generate</>}
																		</button>
																	</div>
																</div>
															</div>
														</div>
													)}
												</Tab.Panel>
												{/* #AISUMMARY */}
												<Tab.Panel className={"min-h-[calc(100vh-250px)] px-8 py-6"}>
													{["standard", "starter"].includes(atsVersion) ? (
														<PermiumComp userRole={userRole} />
													) : (
														<div>
															<div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-2">
																<Image src={favIcon} alt="Somhako" width={30} />
															</div>
															<p className="mb-4 text-center text-darkGray dark:text-gray-400">
																AI Comparative Analysis
															</p>
															<div className="mx-auto w-full max-w-[800px]">
																<div className="rounded-normal bg-lightBlue shadow-normal dark:bg-gray-600">
																	<div className="px-10 py-4">
																		{appdata["ai_text"] && appdata["ai_text"].length > 0 && (
																			<div className="my-2 rounded border bg-white px-4 py-2 shadow-normal dark:border-gray-600 dark:bg-gray-800">
																				<div
																					className=" contentFORAIFeedback text-sm leading-relaxed text-darkGray dark:text-gray-100"
																					dangerouslySetInnerHTML={{ __html: appdata["ai_text"] }}
																				></div>
																			</div>
																		)}
																	</div>
																	{appdata["ai_text"] && appdata["ai_text"].length > 0 ? (
																		<></>
																	) : (
																		<div className="border-t px-10 py-4 dark:border-t-gray-600">
																			<button
																				type="button"
																				className="flex items-center justify-center rounded border border-slate-300 px-3 py-2 text-sm hover:bg-primary hover:text-white"
																				disabled={ailoader2}
																				onClick={genAIFeedback}
																			>
																				{ailoader2 && (
																					<span className="mr-2 block">
																						<i className={"fa-solid fa-rotate fa-spin"}></i>
																					</span>
																				)}
																				{ailoader2 ? (
																					<>{t("Btn.InProgress")}</>
																				) : (
																					<>
																						{appdata["ai_text"] && appdata["ai_text"].length > 0 ? (
																							<>Re-generate</>
																						) : (
																							<>Generate</>
																						)}
																					</>
																				)}
																			</button>
																		</div>
																	)}
																</div>
															</div>
														</div>
													)}
												</Tab.Panel>
											</Tab.Panels>
										</Tab.Group>
									</div>
								</div>
							</div>
						</div>
						{/* <div className="-mx-4">
							<Button
								label="Back"
								loader={false}
								btnType="button"
								handleClick={() => {
									setjobid("");
									setcanid("");
									setapplicantdetail({});
									setapplicantlist([]);
									router.back();
								}}
							/>

							{applicantdetail && applicantlist['Resume'].map((data, i) => (
									<Document file=`${data['file']}` key={i}/>
								))}

							{applicantlist &&
								applicantlist.map(
									(data, i) =>
										data["job"]["refid"] == jobid &&
										data["user"]["erefid"] == canid && (
											<ul
												key={i}
												className="m-4 w-full list-disc rounded-normal bg-white p-4 p-6 shadow-normal hover:bg-lightBlue dark:bg-gray-700 dark:hover:bg-gray-600"
											>
												<li>
													Current Status : <span className="text-lg font-bold">{data["status"]}</span>
												</li>
												<li>
													<Button
														label="Sourced"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Sourced", data["arefid"]);
														}}
													/>
													<Button
														label="Applied"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Applied", data["arefid"]);
														}}
													/>
													<Button
														label="Phone Screen"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Phone Screen", data["arefid"]);
														}}
													/>
													<Button
														label="Assessment"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Assessment", data["arefid"]);
														}}
													/>
													<Button
														label="Interview"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Interview", data["arefid"]);
														}}
													/>
													<Button
														label="Offered"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Offered", data["arefid"]);
														}}
													/>
													<Button
														label="Hired"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Hired", data["arefid"]);
														}}
													/>
												</li>
											</ul>
										)
								)}
						</div> */}
					</div>
				</div>
			</main>

			<Transition.Root show={manualInterview} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setmanualInterview}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-md">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Schedule Manual Interview</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setmanualInterview(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="w-full p-8">
										<FormField
											id={"summary"}
											fieldType="input"
											inputType="text"
											label={"Interview Title"}
											value={mtitle}
											handleChange={(e) => setmtitle(e.target.value)}
											required
										/>
										<FormField
											id={"description"}
											fieldType="textarea"
											label={"Interview Description"}
											value={mdesc}
											handleChange={(e) => setmdesc(e.target.value)}
											required
										/>
										<FormField
											id={"link"}
											fieldType="input"
											label={"Interview Link"}
											value={mlink}
											handleChange={(e) => setmlink(e.target.value)}
											required
										/>
										<div className="mx-[-10px] flex flex-wrap">
											<div className="mb-4 w-full px-[10px] md:max-w-[50%]">
												<FormField
													id={"start"}
													fieldType="date"
													label={"Interview StartTime"}
													singleSelect
													value={msdate}
													handleChange={(e) => setmsdate(e.target.value)}
													showTimeSelect
													showHours
													required
												/>
											</div>
											<div className="mb-4 w-full px-[10px] md:max-w-[50%]">
												<FormField
													id={"end"}
													fieldType="date"
													label={"Interview EndTime"}
													singleSelect
													value={medate}
													handleChange={(e) => setmedate(e.target.value)}
													showTimeSelect
													showHours
													required
												/>
											</div>
										</div>
										<div>
											<Button
												label={t("Btn.SendInvite")}
												btnType={"button"}
												disabled={!disBtn()}
												handleClick={starterInterviewSchedule}
											/>
										</div>
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
export async function getStaticProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	return {
		props: {
			...translations
		}
	};
}
