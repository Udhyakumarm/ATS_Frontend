import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { axiosInstance } from "@/utils";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import { addNotifyLog, axiosInstance2, axiosInstanceAuth, axiosInstanceAuth22 } from "@/pages/api/axiosApi";
import { useEffect, useState, Fragment } from "react";
import { useApplicantStore, useNotificationStore, useUserStore } from "@/utils/code";
import Button from "@/components/Button";
import Image from "next/image";
import { Tab, Transition } from "@headlessui/react";
import jobIcon from "/public/images/icons/jobs.png";
import TeamMembers from "@/components/TeamMembers";
import userImg from "/public/images/user-image.png";
import moment from "moment";
import CardLayout_1 from "@/components/CardLayout-1";
import { Listbox } from "@headlessui/react";
import toastcomp from "@/components/toast";
import favIcon from "/public/favicon-white.ico";

const people = [
	{ id: 1, name: "Sourced", unavailable: false },
	{ id: 2, name: "Applied", unavailable: false },
	{ id: 3, name: "Phone Screen", unavailable: false },
	{ id: 4, name: "Assessment", unavailable: false },
	{ id: 5, name: "Interview", unavailable: false },
	{ id: 6, name: "Offered Letter", unavailable: false },
	{ id: 7, name: "Hired", unavailable: false }
];

export default function ApplicantsDetail() {
	const router = useRouter();

	const applicantlist = useApplicantStore((state: { applicantlist: any }) => state.applicantlist);
	const setapplicantlist = useApplicantStore((state: { setapplicantlist: any }) => state.setapplicantlist);
	const applicantdetail = useApplicantStore((state: { applicantdetail: any }) => state.applicantdetail);
	const setapplicantdetail = useApplicantStore((state: { setapplicantdetail: any }) => state.setapplicantdetail);
	const jobid = useApplicantStore((state: { jobid: any }) => state.jobid);
	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const canid = useApplicantStore((state: { canid: any }) => state.canid);
	const setcanid = useApplicantStore((state: { setcanid: any }) => state.setcanid);

	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [refersh, setrefersh] = useState(1);
	const [refersh1, setrefersh1] = useState(0);
	const [refersh2, setrefersh2] = useState(0);
	const [jtitle, setjtitle] = useState("");
	const [aid, setaid] = useState("");

	const [selectedFeedBack, setSelectedFeedBack] = useState(false);
	const [feedBack, setFeedBack] = useState(true);
	const [updateFeedBack, setUpdateFeedBack] = useState(false);

	const [selectedPerson, setSelectedPerson] = useState({});

	//feedback
	const [currentUser, setcurrentUser] = useState([]);
	const [feedbackList, setfeedbackList] = useState([]);
	const [editfeedback, seteditfeedback] = useState(false);
	const [editfeedbackTA, seteditfeedbackTA] = useState("");
	const [feedbackreload, setfeedbackreload] = useState(true);
	const [currentUserFeedback, setcurrentUserFeedback] = useState(false);

	//ai
	const [aires, setaires] = useState("");
	const [aiquestion, setaiquestion] = useState([]);
	const [ailoader, setailoader] = useState(false);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);
	const axiosInstanceAuth21 = axiosInstanceAuth22(token);

	async function loadApplicantDetail() {
		await axiosInstanceAuth2
			.get(`/candidate/listuser/${canid}/${jobid}`)
			.then(async (res) => {
				console.log(res.data);
				setapplicantdetail(res.data);
				setrefersh(0);
			})
			.catch((err) => {
				console.log(err);
				setrefersh(0);
			});
	}

	async function loadAIInterviewQuestion() {
		// setailoader(true);
		// await axiosInstanceAuth21
		// 	.get(`/chatbot/interview-question-generator/${canid}/`)
		// 	.then(async (res) => {
		// 		setaires(res.data["res"]);
		// 		setaiquestion(res.data["res"].split("\n"));
		// 		setailoader(false);
		// 	})
		// 	.catch((err) => {
		// 		console.log("!", err);
		// 		setailoader(false);
		// 	});
	}

	useEffect(() => {
		console.log(token);
		console.log(jobid);
		console.log(canid);
		console.log(refersh);
		if (token.length > 0 && jobid.length > 0 && canid.length > 0 && refersh > 0) {
			loadApplicantDetail();
			loadAIInterviewQuestion();
		}
	}, [token, refersh, jobid, canid]);

	async function loadApplicant() {
		await axiosInstanceAuth2
			.get(`/job/listapplicant/`)
			.then(async (res) => {
				// console.log(res.data)
				setapplicantlist(res.data);
				setrefersh1(0);
			})
			.catch((err) => {
				console.log(err);
				setrefersh1(0);
			});
	}

	useEffect(() => {
		if (refersh1 != 0) {
			loadApplicant();
		}
	}, [refersh1]);

	async function chnageStatus(status: string | Blob, arefid: any) {
		const fdata = new FormData();
		fdata.append("status", status);
		await axiosInstanceAuth2
			.put(`/job/applicant/${arefid}/update/`, fdata)
			.then((res) => {
				setrefersh1(1);
				toastcomp("Status Changed", "success");
			})
			.catch((err) => {
				console.log(err);
				toastcomp("Status Not Change", "error");
				setrefersh1(1);
			});
	}

	// useEffect(() => {
	// 	if (applicantdetail && applicantlist && refersh2 <= 0) {
	// 		for (let i = 0; i < applicantlist.length; i++) {
	// 			if (applicantlist[i]["user"]["erefid"] === applicantdetail["CandidateProfile"][0]["user"]["erefid"]) {
	// 				console.log("*", applicantlist[i]);
	// 				setjtitle(applicantlist[i]["job"]["job_title"]);
	// 				for (let j = 0; j < people.length; j++) {
	// 					if (people[j]["name"] === applicantlist[i]["status"]) {
	// 						setSelectedPerson(people[j]);
	// 						setaid(applicantlist[i]["arefid"]);
	// 						setrefersh2(1);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// 	console.log(applicantdetail);
	// }, [applicantdetail, applicantlist, refersh2]);

	useEffect(() => {
		if (refersh2 != 0 && aid.length > 0) {
			console.log("&", "status change");
			chnageStatus(selectedPerson["name"], aid);
		}
	}, [selectedPerson]);

	async function loadFeedback(arefid: any) {
		await axiosInstance2
			.get(`/job/listfeedback/${arefid}/`)
			.then((res) => {
				setfeedbackList(res.data);
				console.log("@", res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function getcurrentUser() {
		await axiosInstanceAuth2
			.get(`/job/currentuser/`)
			.then((res) => {
				setcurrentUser(res.data);
				console.log("@", res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function updateFeedback(pk) {
		const fdata = new FormData();
		fdata.append("feedback", editfeedbackTA);
		await axiosInstanceAuth2
			.put(`/job/feedback/${pk}/update/`, fdata)
			.then((res) => {
				toastcomp("Feedback Updated", "success");
				seteditfeedback(false);
				setfeedbackreload(true);
			})
			.catch((err) => {
				toastcomp("Feedback Not Updated", "error");
				seteditfeedback(false);
				setfeedbackreload(true);
			});
	}

	const userState = useUserStore((state: { user: any }) => state.user);

	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	async function createFeedback(status) {
		const fdata = new FormData();
		fdata.append("status", status);
		await axiosInstanceAuth2
			.post(`/job/feedback/${aid}/create/`, fdata)
			.then((res) => {
				toastcomp("Feedback Created", "success");
				let title = `Feedback Added By ${userState[0]["name"]} (${userState[0]["email"]}) to Applicant ${canid})`;

				addNotifyLog(axiosInstanceAuth2, title, "");
				toggleLoadMode(true);

				seteditfeedback(false);
				setfeedbackreload(true);
			})
			.catch((err) => {
				toastcomp("Feedback Not Created", "error");
				seteditfeedback(false);
				setfeedbackreload(true);
			});
	}

	useEffect(() => {
		if (aid.length > 0 && feedbackreload) {
			loadFeedback(aid);
			getcurrentUser();
			setfeedbackreload(false);
		}
	}, [aid, feedbackreload]);

	useEffect(() => {
		if (feedbackList.length > 0 && currentUser.length > 0) {
			for (let i = 0; i < feedbackList.length; i++) {
				if (feedbackList[i]["user"]["email"] === currentUser[0]["email"]) {
					seteditfeedbackTA(feedbackList[i]["feedback"]);
					setcurrentUserFeedback(true);
				}
			}
		}
	}, [feedbackList, currentUser]);

	return (
		<>
			<Head>
				<title>Applicant Detail</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<Orgsidebar />
				<Orgtopbar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className="layoutWrap p-4 lg:p-8">
					<div className="relative">
						<div className="flex flex-wrap">
							<div className="w-full lg:max-w-[400px]">
								<div className="mb-4 flex items-center rounded-large border-2 border-slate-300 bg-white p-5 shadow-normal dark:border-gray-700 dark:bg-gray-800">
									<button
										className="mr-5 justify-self-start text-darkGray dark:text-gray-400"
										onClick={() => {
											router.back();
										}}
									>
										<i className="fa-solid fa-arrow-left text-2xl"></i>
									</button>
									<h2 className="text-xl font-bold">
										<span>Profile</span>
									</h2>
								</div>
								{applicantdetail["CandidateProfile"] &&
									applicantdetail["CandidateProfile"].map((data: any, i: React.Key) => (
										<div
											className="mb-4 rounded-large border-2 border-slate-300 bg-white p-5 shadow-normal dark:border-gray-700 dark:bg-gray-800"
											key={i}
										>
											<div className="mb-4 border-b pb-4">
												<div className="mb-4 border-b pb-2 text-center">
													<Image
														src={`http://127.0.0.1:8000${data["profile"]}`}
														alt="User"
														width={90}
														height={90}
														className="mx-auto mb-3 h-[90px] rounded-full object-cover shadow-normal"
													/>
													<h3 className="mb-2 font-bold">
														{data["first_name"]} {data["last_name"]}
													</h3>
													<p className="mb-2 text-sm text-darkGray">Product Manager - ID 43108</p>
													<p className="mb-2 text-sm text-darkGray">
														Source - &nbsp;
														<span className="font-semibold text-primary">
															<i className="fa-brands fa-linkedin"></i> LinkedIn
														</span>
													</p>
												</div>
												<div className="flex flex-wrap items-center justify-between">
													<div className="my-1 flex items-center">
														<div className="mr-2 block h-[26px] w-[30px] rounded border border-white bg-red-100 text-center leading-[23px] text-red-500 shadow-normal">
															<i className="fa-regular fa-envelope"></i>
														</div>
														<p className="text-[11px] font-semibold text-darkGray">{data["user"]["email"]}</p>
													</div>
													<div className="my-1 flex items-center">
														<div className="mr-2 block h-[26px] w-[30px] rounded border border-white bg-teal-100 text-center leading-[23px] text-teal-500 shadow-normal">
															<i className="fa-solid fa-phone text-[14px]"></i>
														</div>
														<p className="text-[11px] font-semibold text-darkGray">{data["mobile"]}</p>
													</div>
												</div>
												{applicantdetail["Link"] && (
													<div className="flex flex-wrap items-center justify-center text-2xl">
														{applicantdetail["Link"].map((data: any, i: React.Key) => (
															<Link href={`https://${data["title"]}`} target="_blank" className="m-3 mb-0" key={i}>
																<i className="fa-brands fa-behance"></i>
															</Link>
														))}
													</div>
												)}
											</div>
											<div className="mb-4 border-b pb-4">
												<h3 className="mb-4 text-lg font-semibold">Details</h3>
												<ul className="flex flex-wrap text-[12px] text-darkGray">
													<li className="mb-2 w-[50%] pr-2">Current Salary - {data["current_salary"]}</li>
													<li className="mb-2 w-[50%] pr-2">Expected Salary - {data["expected_salary"]}</li>
												</ul>
											</div>
											<div className="mb-4 border-b pb-4">
												<h3 className="mb-4 text-lg font-semibold">Summary</h3>
												<p className="text-[12px] text-darkGray">{`${data["summary"]}`}</p>
											</div>
											<div className="mb-4 border-b pb-4">
												<h3 className="mb-4 text-lg font-semibold">Skills</h3>
												{applicantdetail["Skill"] && (
													<ul className="flex flex-wrap rounded-normal border p-2 text-[12px] shadow">
														{applicantdetail["Skill"].map((data: any, i: React.Key) => (
															<li className="m-1 min-w-[75px] rounded-[30px] bg-gray-100 px-4 py-2 text-center" key={i}>
																{data["title"]}
															</li>
														))}
													</ul>
												)}
											</div>
											<div className="mb-4 border-b pb-4">
												<h3 className="mb-4 text-lg font-semibold">Education</h3>
												{applicantdetail["Education"] &&
													applicantdetail["Education"].map((data: any, i: React.Key) => (
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
													))}
											</div>
											<div className="mb-4 border-b pb-4">
												<h3 className="mb-4 text-lg font-semibold">Certifications</h3>
												{applicantdetail["Certification"] &&
													applicantdetail["Certification"].map((data: any, i: React.Key) => (
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
													))}
											</div>
											<div className="mb-4 border-b pb-4">
												<h3 className="mb-4 text-lg font-semibold">Experience</h3>
												{applicantdetail["Experience"] &&
													applicantdetail["Experience"].map((data: any, i: React.Key) => (
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
													))}
											</div>
											<div className="mb-4 border-b pb-4">
												<h3 className="mb-4 text-lg font-semibold">Message from Vendor</h3>
												<div className="mb-2 rounded-normal border p-3 text-[12px] text-darkGray shadow last:mb-0">
													<p>{data["recuriter_message"]}</p>
												</div>
											</div>
										</div>
									))}
							</div>
							<div className="w-full lg:max-w-[calc(100%-400px)] lg:pl-8">
								<div className="overflow-hidden rounded-large border-2 border-slate-300 bg-white shadow-normal dark:border-gray-700 dark:bg-gray-800">
									<div className="jusitfy-between relative z-10 flex flex-wrap items-center p-5 shadow">
										<aside className="flex items-center">
											<Image src={jobIcon} alt="Jobs" width={20} className="mr-3 dark:invert" />
											<h2 className="text-lg font-bold">
												<span>{jtitle}</span>
											</h2>
										</aside>
										<aside className="flex grow items-center justify-end">
											<div className="mr-4">
												<Button
													btnType="button"
													btnStyle="iconLeftBtn"
													label="Schedule Interview"
													iconLeft={<i className="fa-solid fa-calendar-plus"></i>}
													handleClick={() => {
														router.push("/organization/applicants/schedule-interview");
													}}
												/>
											</div>
											<div className="mr-4">
												<Listbox value={selectedPerson} onChange={setSelectedPerson}>
													<Listbox.Button className={"rounded border border-slate-300 text-sm font-bold"}>
														<span className="px-3 py-2">Move Applicant</span>
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
															{people.map((person) => (
																<Listbox.Option
																	key={person.id}
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
											<TeamMembers />
										</aside>
									</div>
									<div className="">
										<Tab.Group>
											<Tab.List className={"border-b px-4"}>
												<Tab as={Fragment}>
													{({ selected }) => (
														<button
															className={
																"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
																" " +
																(selected
																	? "border-primary text-primary"
																	: "border-transparent text-darkGray dark:text-gray-400")
															}
														>
															Profile
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
																	? "border-primary text-primary"
																	: "border-transparent text-darkGray dark:text-gray-400")
															}
														>
															Assessment
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
																	? "border-primary text-primary"
																	: "border-transparent text-darkGray dark:text-gray-400")
															}
														>
															Feedback
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
																	? "border-primary text-primary"
																	: "border-transparent text-darkGray dark:text-gray-400")
															}
														>
															Timeline
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
																	? "border-primary text-primary"
																	: "border-transparent text-darkGray dark:text-gray-400")
															}
														>
															AI Generated Interview
														</button>
													)}
												</Tab>
											</Tab.List>
											<Tab.Panels>
												<Tab.Panel className={"min-h-[calc(100vh-250px)]"}>
													{applicantdetail["Resume"] &&
														applicantdetail["Resume"].map((data, i) => (
															<div
																className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm"
																key={i}
															>
																<p className="my-2">{data["file"].split("/").pop()}</p>
																<Link
																	href={`http://127.0.0.1:8000${data["file"]}`}
																	className="my-2 inline-block font-bold text-primary hover:underline"
																	download={data["file"].split("/").pop()}
																>
																	<i className="fa-solid fa-download mr-2"></i>
																	Download
																</Link>
															</div>
														))}
													{/* <div className="px-8">Preview Here</div> */}
													{applicantdetail["Resume"] &&
														applicantdetail["Resume"].map((data, i) => (
															<iframe
																src={`http://127.0.0.1:8000${data["file"]}`}
																key={i}
																className="h-[100vh] w-[100%]"
															></iframe>
														))}
												</Tab.Panel>
												<Tab.Panel className={"min-h-[calc(100vh-250px)] px-8 py-6"}>
													<div className="mx-[-15px] flex flex-wrap">
														{Array(6).fill(
															<div className="mb-[30px] w-full px-[15px] md:max-w-[50%]">
																<CardLayout_1 isBlank={true} />
															</div>
														)}
													</div>
												</Tab.Panel>
												<Tab.Panel className={"min-h-[calc(100vh-250px)] px-8 py-6"}>
													{!currentUserFeedback && (
														<>
															<div className="relative mt-6 border-t pt-6 first:mt-0 first:border-t-0 first:pt-0">
																<div className="mb-8 flex w-[280px] items-center rounded-br-[30px] rounded-tr-[30px] bg-lightBlue shadow-normal dark:bg-gray-700">
																	<div
																		className="group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]"
																		onClick={(e) => {
																			createFeedback("Hire");
																		}}
																	>
																		<i
																			className={
																				"fa-solid fa-user text-sm" +
																				" " +
																				"text-darkGray group-hover:text-green-500 dark:text-gray-400"
																			}
																		></i>
																		<p
																			className={
																				"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																				" " +
																				"hidden group-hover:block group-hover:text-green-500"
																			}
																		>
																			Hire
																		</p>
																	</div>
																	<div
																		className="group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]"
																		onClick={(e) => {
																			createFeedback("On Hold");
																		}}
																	>
																		<i
																			className={
																				"fa-solid fa-circle-pause text-sm" +
																				" " +
																				"text-darkGray group-hover:text-yellow-500 dark:text-gray-400"
																			}
																		></i>
																		<p
																			className={
																				"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																				" " +
																				"hidden group-hover:block group-hover:text-yellow-500"
																			}
																		>
																			On Hold
																		</p>
																	</div>
																	<div
																		className="group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]"
																		onClick={(e) => {
																			createFeedback("Shortlist");
																		}}
																	>
																		<i
																			className={
																				"fa-solid fa-thumbs-up text-sm" +
																				" " +
																				"text-darkGray group-hover:text-primary dark:text-gray-400"
																			}
																		></i>
																		<p
																			className={
																				"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																				" " +
																				"hidden group-hover:block group-hover:text-primary"
																			}
																		>
																			Shortlist
																		</p>
																	</div>
																	<div
																		className="group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]"
																		onClick={(e) => {
																			createFeedback("Reject");
																		}}
																	>
																		<i
																			className={
																				"fa-solid fa-thumbs-down text-sm" +
																				" " +
																				"text-darkGray group-hover:text-red-500 dark:text-gray-400"
																			}
																		></i>
																		<p
																			className={
																				"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																				" " +
																				"hidden group-hover:block group-hover:text-red-500"
																			}
																		>
																			Reject
																		</p>
																	</div>
																</div>
															</div>
														</>
													)}

													{feedbackList &&
														feedbackList.map((data, i) => (
															<div
																className="relative mt-6 border-t pt-6 first:mt-0 first:border-t-0 first:pt-0"
																key={i}
															>
																<div className="mb-8 flex w-[280px] items-center rounded-br-[30px] rounded-tr-[30px] bg-lightBlue shadow-normal dark:bg-gray-700">
																	{data["status"] !== "Hire" ? (
																		<div className="group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]">
																			<i
																				className={
																					"fa-solid fa-user text-sm" +
																					" " +
																					"text-darkGray group-hover:text-green-500 dark:text-gray-400"
																				}
																			></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"hidden group-hover:block group-hover:text-green-500"
																				}
																			>
																				Hire
																			</p>
																		</div>
																	) : (
																		<div className="group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]">
																			<i className={"fa-solid fa-user text-sm" + " " + "text-green-500"}></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"block bg-gradDarkBlue text-white"
																				}
																			>
																				Hire
																			</p>
																		</div>
																	)}

																	{data["status"] !== "On Hold" ? (
																		<div className="cursor-normal group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]">
																			<i
																				className={
																					"fa-solid fa-circle-pause text-sm" +
																					" " +
																					"text-darkGray group-hover:text-yellow-500 dark:text-gray-400"
																				}
																			></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"hidden group-hover:block group-hover:text-yellow-500"
																				}
																			>
																				On Hold
																			</p>
																		</div>
																	) : (
																		<div className="group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]">
																			<i className={"fa-solid fa-circle-pause text-sm" + " " + "text-yellow-500"}></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"block bg-gradDarkBlue text-white"
																				}
																			>
																				On Hold
																			</p>
																		</div>
																	)}

																	{data["status"] !== "Shortlist" ? (
																		<div className="cursor-normal group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]">
																			<i
																				className={
																					"fa-solid fa-thumbs-up text-sm" +
																					" " +
																					"text-darkGray group-hover:text-primary dark:text-gray-400"
																				}
																			></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"hidden group-hover:block group-hover:text-primary"
																				}
																			>
																				Shortlist
																			</p>
																		</div>
																	) : (
																		<div className="group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]">
																			<i className={"fa-solid fa-thumbs-up text-sm" + " " + "text-primary"}></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"block bg-gradDarkBlue text-white"
																				}
																			>
																				Shortlist
																			</p>
																		</div>
																	)}

																	{data["status"] !== "Reject" ? (
																		<div className="cursor-normal group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]">
																			<i
																				className={
																					"fa-solid fa-thumbs-down text-sm" +
																					" " +
																					"text-darkGray group-hover:text-red-500 dark:text-gray-400"
																				}
																			></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"hidden group-hover:block group-hover:text-red-500"
																				}
																			>
																				Reject
																			</p>
																		</div>
																	) : (
																		<div className="group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]">
																			<i className={"fa-solid fa-thumbs-down text-sm" + " " + "text-red-500"}></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"block bg-gradDarkBlue text-white"
																				}
																			>
																				Reject
																			</p>
																		</div>
																	)}
																</div>

																{data["user"]["email"] === currentUser[0]["email"] ? (
																	<>
																		<div className="overflow-hidden rounded-normal border dark:border-gray-500">
																			<label
																				htmlFor="addFeedback"
																				className="block bg-lightBlue px-4 py-2 font-bold dark:bg-gray-700"
																			>
																				<span className="flex items-center">
																					Feedback
																					{!editfeedback && (
																						<button
																							type="button"
																							className="ml-5 text-darkGray dark:text-gray-400"
																							onClick={(e) => {
																								seteditfeedback(true);
																							}}
																						>
																							<i className="fa-solid fa-pen-to-square"></i>
																						</button>
																					)}
																				</span>
																			</label>
																			<textarea
																				name="addFeedback"
																				id="addFeedback"
																				className={
																					"dark:placeholder w-full resize-none border-0 px-4 py-2 align-middle text-sm focus:ring-0 dark:bg-gray-600 dark:text-white" +
																					" " +
																					"min-h-[100px]"
																				}
																				placeholder="Enter feedback here ..."
																				value={editfeedbackTA}
																				onChange={(e) => seteditfeedbackTA(e.target.value)}
																				readOnly={!editfeedback}
																			></textarea>
																			<div className="bg-lightBlue px-4 dark:bg-gray-700">
																				{!editfeedback ? (
																					<>
																						<div className="flex items-center justify-between py-2 text-sm">
																							{/* <h6 className="font-bold">By - Steve Paul :  Collaborator</h6> */}
																							<h6 className="font-bold">By - {data["user"]["email"]}</h6>
																							<p className="text-[12px] text-darkGray dark:text-gray-400">
																								{moment(data["timestamp"]).format("Do MMM YYYY")}
																							</p>
																						</div>
																					</>
																				) : (
																					<>
																						<Button
																							btnStyle="sm"
																							label={data["feedback"] && data["feedback"].length > 0 ? "Update" : "Add"}
																							btnType={"button"}
																							handleClick={(e) => {
																								updateFeedback(data["id"]);
																							}}
																						/>
																					</>
																				)}
																			</div>
																		</div>
																	</>
																) : (
																	<>
																		<div className="overflow-hidden rounded-normal border dark:border-gray-500">
																			<label
																				htmlFor="addFeedback"
																				className="block bg-lightBlue px-4 py-2 font-bold dark:bg-gray-700"
																			>
																				<span className="flex items-center">Feedback</span>
																			</label>
																			<textarea
																				name="addFeedback"
																				id="addFeedback"
																				className={
																					"dark:placeholder w-full resize-none border-0 px-4 py-2 align-middle text-sm focus:ring-0 dark:bg-gray-600 dark:text-white" +
																					" " +
																					"min-h-[100px]"
																				}
																				placeholder="Enter feedback here ..."
																				value={data["feedback"]}
																				readOnly={true}
																			></textarea>
																			<div className="bg-lightBlue px-4 dark:bg-gray-700">
																				{
																					<>
																						<div className="flex items-center justify-between py-2 text-sm">
																							{/* <h6 className="font-bold">By - Steve Paul :  Collaborator</h6> */}
																							<h6 className="font-bold">By - {data["user"]["email"]}</h6>
																							<p className="text-[12px] text-darkGray dark:text-gray-400">
																								{moment(data["timestamp"]).format("Do MMM YYYY")}
																							</p>
																						</div>
																					</>
																				}
																			</div>
																		</div>
																	</>
																)}
															</div>
														))}
													{/* <div className="border dark:border-gray-500 rounded-normal overflow-hidden">
																<label htmlFor="addFeedback" className="bg-lightBlue dark:bg-gray-700 py-2 px-4 block font-bold">
																	{
																		feedBack
																		?
																		<>
																		<span className="flex items-center">
																			Feedback
																			<button type="button" className="ml-5 text-darkGray dark:text-gray-400">
																				<i className="fa-solid fa-pen-to-square"></i>
																			</button>
																		</span>
																		</>
																		:
																		<>
																		Add Feedback <sup className="text-red-500">*</sup>
																		</>
																	}
																</label>
																<textarea name="addFeedback" id="addFeedback" className={'align-middle dark:bg-gray-600 dark:text-white dark:placeholder py-2 px-4 border-0 resize-none w-full text-sm focus:ring-0' + ' ' + (feedBack ? 'min-h-[100px]' : 'h-[200px]')} placeholder="Enter feedback here ..." readOnly={feedBack ? true : false}></textarea>
																<div className="px-4 bg-lightBlue dark:bg-gray-700">
																	{
																		feedBack
																		?
																		<>
																		<div className="py-2 flex items-center justify-between text-sm">
																			<h6 className="font-bold">By - Steve Paul :  Collaborator</h6>
																			<p className="text-darkGray dark:text-gray-400 text-[12px]">13 Feb 2023, 3:00 PM</p>
																		</div>
																		</>
																		:
																		<>
																		<Button btnStyle="sm" label={updateFeedBack ? 'Update' : 'Save'} />
																		</>
																	}
																</div>
															</div> */}

													{/* {Array(2).fill(
													<div className="relative border-t pt-6 mt-6 first:border-t-0 first:pt-0 first:mt-0">
														<div className="flex items-center bg-lightBlue dark:bg-gray-700 shadow-normal rounded-tr-[30px] rounded-br-[30px] mb-8 w-[280px]">
															<div className="relative text-[12px] text-center w-[70px] h-[40px] leading-[40px] cursor-pointer group">
																<i className={'fa-solid fa-thumbs-up text-sm' + ' ' + (!selectedFeedBack ? 'text-green-500' : 'text-darkGray dark:text-gray-400 group-hover:text-green-500') }></i>
																<p className={'whitespace-nowrap block w-full font-semibold absolute left-[50%] translate-x-[-50%] bottom-[-22px] px-2 py-[2px] rounded-b-[8px] leading-normal' + ' ' + (!selectedFeedBack ? 'block bg-gradDarkBlue text-white' : 'hidden group-hover:block group-hover:text-green-500') }>Hire</p>
															</div>
															<div className="relative text-[12px] text-center w-[70px] h-[40px] leading-[40px] cursor-pointer group">
																<i className={'fa-solid fa-circle-pause text-sm' + ' ' + (selectedFeedBack ? 'text-yellow-400' : 'text-darkGray dark:text-gray-400 group-hover:text-yellow-400') }></i>
																<p className={'whitespace-nowrap block w-full font-semibold absolute left-[50%] translate-x-[-50%] bottom-[-22px] px-2 py-[2px] rounded-b-[8px] leading-normal' + ' ' + (selectedFeedBack ? 'block bg-gradDarkBlue text-white' : 'hidden group-hover:block group-hover:text-yellow-400') }>On Hold</p>
															</div>
															<div className="relative text-[12px] text-center w-[70px] h-[40px] leading-[40px] cursor-pointer group">
																<i className={'fa-solid fa-thumbs-up text-sm' + ' ' + (selectedFeedBack ? 'text-primary' : 'text-darkGray dark:text-gray-400 group-hover:text-primary') }></i>
																<p className={'whitespace-nowrap block w-full font-semibold absolute left-[50%] translate-x-[-50%] bottom-[-22px] px-2 py-[2px] rounded-b-[8px] leading-normal' + ' ' + (selectedFeedBack ? 'block bg-gradDarkBlue text-white' : 'hidden group-hover:block group-hover:text-primary') }>Shortlist</p>
															</div>
															<div className="relative text-[12px] text-center w-[70px] h-[40px] leading-[40px] cursor-pointer group">
																<i className={'fa-solid fa-thumbs-up text-sm' + ' ' + (selectedFeedBack ? 'text-red-500' : 'text-darkGray dark:text-gray-400 group-hover:text-red-500') }></i>
																<p className={'whitespace-nowrap block w-full font-semibold absolute left-[50%] translate-x-[-50%] bottom-[-22px] px-2 py-[2px] rounded-b-[8px] leading-normal' + ' ' + (selectedFeedBack ? 'block bg-gradDarkBlue text-white' : 'hidden group-hover:block group-hover:text-red-500') }>Reject</p>
															</div>
														</div>
														<div className="border dark:border-gray-500 rounded-normal overflow-hidden">
															<label htmlFor="addFeedback" className="bg-lightBlue dark:bg-gray-700 py-2 px-4 block font-bold">
																{
																	feedBack
																	?
																	<>
																	<span className="flex items-center">
																		Feedback
																		<button type="button" className="ml-5 text-darkGray dark:text-gray-400">
																			<i className="fa-solid fa-pen-to-square"></i>
																		</button>
																	</span>
																	</>
																	:
																	<>
																	Add Feedback <sup className="text-red-500">*</sup>
																	</>
																}
															</label>
															<textarea name="addFeedback" id="addFeedback" className={'align-middle dark:bg-gray-600 dark:text-white dark:placeholder py-2 px-4 border-0 resize-none w-full text-sm focus:ring-0' + ' ' + (feedBack ? 'min-h-[100px]' : 'h-[200px]')} placeholder="Enter feedback here ..." readOnly={feedBack ? true : false}></textarea>
															<div className="px-4 bg-lightBlue dark:bg-gray-700">
																{
																	feedBack
																	?
																	<>
																	<div className="py-2 flex items-center justify-between text-sm">
																		<h6 className="font-bold">By - Steve Paul :  Collaborator</h6>
																		<p className="text-darkGray dark:text-gray-400 text-[12px]">13 Feb 2023, 3:00 PM</p>
																	</div>
																	</>
																	:
																	<>
																	<Button btnStyle="sm" label={updateFeedBack ? 'Update' : 'Save'} />
																	</>
																}
															</div>
														</div>
													</div>
													)} */}
												</Tab.Panel>
												<Tab.Panel className={"min-h-[calc(100vh-250px)] px-8 py-6"}>
													<div className="relative max-h-[455px] overflow-y-auto before:absolute before:left-[80px] before:top-0 before:h-[100%] before:w-[1px] before:bg-gray-600 before:bg-slate-200 before:content-['']">
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
														</div>
													</div>
												</Tab.Panel>
												<Tab.Panel className={"min-h-[calc(100vh-250px)] px-8 py-6"}>
													<div>
														<div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-2">
															<Image src={favIcon} alt="Somhako" width={30} />
														</div>
														<p className="mb-4 text-center text-darkGray dark:text-gray-400">
															Ask Questions Related to the Candidate
														</p>
														<div className="mx-auto w-full max-w-[650px]">
															<div className="rounded-normal bg-lightBlue shadow-normal dark:bg-gray-600">
																<div className="px-10 py-4">
																	{aiquestion &&
																		aiquestion.map((data, i) => (
																			<div
																				className="my-2 rounded border bg-white px-4 py-2 shadow-normal dark:border-gray-600 dark:bg-gray-700"
																				key={i}
																			>
																				<h5 className="text-sm text-darkGray dark:text-gray-400">{data}</h5>
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
																		{ailoader ? <>In Progress</> : <>Regenerate</>}
																	</button>
																</div>
															</div>
														</div>
													</div>
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

							{applicantdetail["Resume"] &&
								applicantdetail["Resume"].map((data, i) => (
									<iframe src={`http://127.0.0.1:8000${data["file"]}`} key={i} />
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
		</>
	);
}
