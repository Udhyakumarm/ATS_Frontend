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
import UpcomingComp from "@/components/organization/upcomingComp";
import userImg1 from "/public/images/user-image1.jpeg";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";

const people = [
	{ name: "Sourced", unavailable: false },
	{ name: "Review", unavailable: false },
	{ name: "Interview", unavailable: false },
	{ name: "Shortlisted", unavailable: false },
	{ name: "Offer", unavailable: false },
	{ name: "Hired", unavailable: false },
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

	const axiosInstanceAuth2 = axiosInstanceAuth(token);
	const axiosInstanceAuth21 = axiosInstanceAuth22(token);

	const [selectedPerson, setSelectedPerson] = useState(people[3]);

	//ai interview question
	const [aires, setaires] = useState("");
	const [aiquestion, setaiquestion] = useState([]);
	const [ailoader, setailoader] = useState(false);

	//applicant detail
	const [profileData, setprofileData] = useState({});
	const [linkData, setlinkData] = useState([]);
	const [educationData, seteducationData] = useState([]);
	const [experienceData, setexperienceData] = useState([]);
	const [certificateData, setcertificateData] = useState([]);

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
		if (type === "career") {
			await axiosInstanceAuth2
				.get(`/job/listsapplicant/${arefid}/`)
				.then((res) => {
					setappdata(res.data[0]);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		if (type === "vendor") {
			await axiosInstanceAuth2
				.get(`/job/listsvapplicant/${arefid}/`)
				.then((res) => {
					setappdata(res.data[0]);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	async function chnageStatus(status: string, arefid: any) {
		if (type === "career") {
			const fdata = new FormData();
			fdata.append("status", status);
			await axiosInstanceAuth2
				.put(`/job/applicant/${arefid}/update/`, fdata)
				.then((res) => {
					toastcomp("Status Changed", "success");
					loadNEWAPPDATA(arefid);
				})
				.catch((err) => {
					console.log(err);
					toastcomp("Status Not Change", "error");
				});
		}
		if (type === "vendor") {
			const fdata = new FormData();
			fdata.append("status", status);
			await axiosInstanceAuth2
				.put(`/job/vapplicant/${arefid}/update/`, fdata)
				.then((res) => {
					toastcomp("Status Changed", "success");
					loadNEWAPPDATA(arefid);
				})
				.catch((err) => {
					console.log(err);
					toastcomp("Status Not Change", "error");
				});
		}
	}

	function moveApplicant(v) {
		setSelectedPerson(v);
		chnageStatus(v["name"], appid);
	}

	async function loadAIInterviewQuestion() {
		setailoader(true);
		let canid = "";
		if (type === "career") {
			canid = appdata["user"]["erefid"];
		}
		if (type === "vendor") {
			canid = appdata["applicant"]["vcrefid"];
		}

		await axiosInstanceAuth21
			.get(`/chatbot/interview-question-generator/${canid}/${jobid}/`)
			.then(async (res) => {
				setaires(res.data["res"]);
				setaiquestion(res.data["res"].split("\n"));
				setailoader(false);
			})
			.catch((err) => {
				console.log("!", err);
				setailoader(false);
			});
	}

	async function loadApplicantDetail() {
		if (type === "career") {
			let canid = appdata["user"]["erefid"];
			await axiosInstanceAuth21
				.get(`/candidate/listuser/${canid}/${jobid}/`)
				.then(async (res) => {
					setprofileData(res.data["CandidateProfile"][0]);
					setlinkData(res.data["Link"]);
					setexperienceData(res.data["Experience"]);
					seteducationData(res.data["Education"]);
					setcertificateData(res.data["Certification"]);
					console.log("$", res.data);
				})
				.catch((err) => {
					console.log("!", err);
					setprofileData({});
					setlinkData([]);
					setexperienceData([]);
					seteducationData([]);
					setcertificateData([]);
				});
		}
		if (type === "vendor") {
			let canid = appdata["applicant"]["vcrefid"];
			await axiosInstanceAuth21
				.get(`/vendors/vendoruser/${jobid}/${canid}/`)
				.then(async (res) => {
					setprofileData(res.data["VendorCandidateProfile"][0]);
					setlinkData(res.data["Link"]);
					setexperienceData(res.data["Experience"]);
					seteducationData(res.data["Education"]);
					setcertificateData(res.data["Certification"]);
					console.log("$", res.data);
				})
				.catch((err) => {
					console.log("!", err);
					setprofileData({});
					setlinkData([]);
					setexperienceData([]);
					seteducationData([]);
					setcertificateData([]);
				});
		}
	}

	async function loadFeedback() {
		let canid = appdata["arefid"];
		let url = "";
		if (type === "career") {
			url = `/job/listfeedback/${canid}/`;
		}
		if (type === "vendor") {
			url = `/job/listvfeedback/${canid}/`;
		}

		await axiosInstanceAuth21
			.get(url)
			.then(async (res) => {
				console.log("@@", res.data);
				setfeedbackList(res.data);
				seteditfeedback(false);
			})
			.catch((err) => {
				console.log("!", err);
				setfeedbackList([]);
			});
	}

	useEffect(() => {
		if (token && token.length > 0 && aiquestion.length <= 0) {
			loadApplicantDetail();
			loadFeedback();
			loadAIInterviewQuestion();
		}
	}, [token]);

	function checkDis() {
		return feedbackStatus.length > 0 && feedbackTA.length > 0;
	}

	async function createFeedback() {
		let url = "";
		if (type === "career") {
			url = `/job/feedback/${appdata["arefid"]}/create/`;
		}
		if (type === "vendor") {
			url = `/job/vfeedback/${appdata["arefid"]}/create/`;
		}

		const fdata = new FormData();
		fdata.append("status", feedbackStatus);
		fdata.append("feedback", feedbackTA);
		await axiosInstanceAuth2
			.post(url, fdata)
			.then((res) => {
				toastcomp("Feedback Created", "success");
				let title = `Feedback Added By ${currentUser[0]["name"]} (${currentUser[0]["email"]}) to Applicant ${appdata["arefid"]}`;

				addNotifyLog(axiosInstanceAuth2, title, "");
				toggleLoadMode(true);
				loadFeedback();
				if (feedbackStatus === "Reject") {
					chnageStatus("Rejected", appdata["arefid"]);
				}
				if (feedbackStatus === "Shortlist") {
					if (feedbackList.length > 0) {
						let ch = true;
						for (let i = 0; i < feedbackList.length; i++) {
							if (feedbackList[i]["status"] != "Shortlisted") {
								ch = false;
							}
						}
						if (ch) {
							chnageStatus("Interview", appdata["arefid"]);
						}
					} else {
						chnageStatus("Interview", appdata["arefid"]);
					}
				}
			})
			.catch((err) => {
				toastcomp("Feedback Not Created", "error");
			});
	}

	async function updateFeedback(pk) {
		if (selectedPerson["name"] != "Review") {
			toastcomp("At this stage of applicant you cant able to update feedback", "error");
			seteditfeedback(false);
			loadFeedback();
		} else {
			let url = "";
			if (type === "career") {
				url = `/job/feedback/${pk}/update/`;
			}
			if (type === "vendor") {
				url = `/job/vfeedback/${pk}/update/`;
			}

			const fdata = new FormData();
			fdata.append("feedback", editfeedbackTA);
			await axiosInstanceAuth2
				.put(url, fdata)
				.then((res) => {
					toastcomp("Feedback Updated", "success");
					let title = `Feedback Updated By ${currentUser[0]["name"]} (${currentUser[0]["email"]}) to Applicant ${appdata["arefid"]}`;

					addNotifyLog(axiosInstanceAuth2, title, "");
					toggleLoadMode(true);
					loadFeedback();
				})
				.catch((err) => {
					toastcomp("Feedback Not Updated", "error");
				});
		}
	}

	async function updateFeedbackStatus(pk, status) {
		if (selectedPerson["name"] != "Review") {
			toastcomp("At this stage of applicant you cant able to update feedback", "error");
			seteditfeedback(false);
			loadFeedback();
		} else {
			let url = "";
			if (type === "career") {
				url = `/job/feedback/${pk}/update/`;
			}
			if (type === "vendor") {
				url = `/job/vfeedback/${pk}/update/`;
			}
			const fdata = new FormData();
			fdata.append("status", status);
			await axiosInstanceAuth2
				.put(url, fdata)
				.then((res) => {
					toastcomp("Feedback Status Updated", "success");
					let title = `Feedback Status change to ${status} By ${currentUser[0]["name"]} (${currentUser[0]["email"]}) to Applicant ${appdata["arefid"]}`;

					addNotifyLog(axiosInstanceAuth2, title, "");
					toggleLoadMode(true);
					loadFeedback();
					if (status === "Reject") {
						chnageStatus("Rejected", appdata["arefid"]);
					}
					if (status === "Shortlist") {
						if (feedbackList.length > 0) {
							let ch = true;
							for (let i = 0; i < feedbackList.length; i++) {
								if (feedbackList[i]["status"] != "Shortlisted") {
									ch = false;
								}
							}
							if (ch) {
								chnageStatus("Interview", appdata["arefid"]);
							}
						} else {
							chnageStatus("Interview", appdata["arefid"]);
						}
					}
				})
				.catch((err) => {
					toastcomp("Feedback Status Not Updated", "error");
				});
		}
	}

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

	// const applicantlist = useApplicantStore((state: { applicantlist: any }) => state.applicantlist);
	// const setapplicantlist = useApplicantStore((state: { setapplicantlist: any }) => state.setapplicantlist);
	// const applicantdetail = useApplicantStore((state: { applicantdetail: any }) => state.applicantdetail);
	// const setapplicantdetail = useApplicantStore((state: { setapplicantdetail: any }) => state.setapplicantdetail);
	// const jobid = useApplicantStore((state: { jobid: any }) => state.jobid);
	// const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	// const canid = useApplicantStore((state: { canid: any }) => state.canid);
	// const setcanid = useApplicantStore((state: { setcanid: any }) => state.setcanid);
	// const appid = useApplicantStore((state: { appid: any }) => state.appid);
	// const setappid = useApplicantStore((state: { setappid: any }) => state.setappid);
	// const type = useApplicantStore((state: { type: any }) => state.type);
	// const settype = useApplicantStore((state: { settype: any }) => state.settype);

	// const [refersh, setrefersh] = useState(1);
	// const [refersh1, setrefersh1] = useState(0);
	// const [refersh2, setrefersh2] = useState(0);
	// const [jtitle, setjtitle] = useState("");
	// const [aid, setaid] = useState("");

	// const [selectedFeedBack, setSelectedFeedBack] = useState(false);
	// const [feedBack, setFeedBack] = useState(true);
	// const [updateFeedBack, setUpdateFeedBack] = useState(false);

	//feedback
	// const [currentUser, setcurrentUser] = useState([]);
	// const [feedbackList, setfeedbackList] = useState([]);
	// const [editfeedback, seteditfeedback] = useState(false);
	// const [editfeedbackTA, seteditfeedbackTA] = useState("");
	// const [feedbackreload, setfeedbackreload] = useState(true);
	// const [currentUserFeedback, setcurrentUserFeedback] = useState(false);

	// useEffect(() => {
	// 	if (session) {
	// 		settoken(session.accessToken as string);
	// 	} else if (!session) {
	// 		settoken("");
	// 	}
	// }, [session]);

	// const axiosInstanceAuth2 = axiosInstanceAuth(token);
	// const axiosInstanceAuth21 = axiosInstanceAuth22(token);

	// async function loadApplicantDetail() {
	// 	if(type === "carrier"){
	// 		let candidateId = ""
	// 		for(let i=0;i<applicantlist.length;i++){
	// 			if(appid === applicantlist[i]["arefid"]){
	// 				candidateId=applicantlist[i]["user"]["erefid"]
	// 			}
	// 		}
	// 		await axiosInstanceAuth2
	// 			.get(`/candidate/listuser/${candidateId}/${jobid}`)
	// 			.then(async (res) => {
	// 				console.log(res.data);
	// 				setapplicantdetail(res.data);
	// 				setrefersh(0);
	// 			})
	// 			.catch((err) => {
	// 				console.log(err);
	// 				setrefersh(0);
	// 			});
	// 	}
	// }

	// async function loadApplicant() {
	// 	await axiosInstanceAuth2
	// 		.get(`/job/listapplicant/`)
	// 		.then(async (res) => {
	// 			// console.log(res.data)
	// 			setapplicantlist(res.data);
	// 			setrefersh1(0);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 			setrefersh1(0);
	// 		});
	// }

	// useEffect(() => {
	// 	if (refersh1 != 0) {
	// 		loadApplicant();
	// 	}
	// }, [refersh1]);

	// async function chnageStatus(status: string | Blob, arefid: any) {
	// 	const fdata = new FormData();
	// 	fdata.append("status", status);
	// 	await axiosInstanceAuth2
	// 		.put(`/job/applicant/${arefid}/update/`, fdata)
	// 		.then((res) => {
	// 			setrefersh1(1);
	// 			toastcomp("Status Changed", "success");
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 			toastcomp("Status Not Change", "error");
	// 			setrefersh1(1);
	// 		});
	// }

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

	// async function loadFeedback(arefid: any) {
	// 	await axiosInstance2
	// 		.get(`/job/listfeedback/${arefid}/`)
	// 		.then((res) => {
	// 			setfeedbackList(res.data);
	// 			console.log("@", res.data);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// }

	// async function getcurrentUser() {
	// 	await axiosInstanceAuth2
	// 		.get(`/job/currentuser/`)
	// 		.then((res) => {
	// 			setcurrentUser(res.data);
	// 			console.log("@", res.data);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// }

	// async function updateFeedback(pk) {
	// 	const fdata = new FormData();
	// 	fdata.append("feedback", editfeedbackTA);
	// 	await axiosInstanceAuth2
	// 		.put(`/job/feedback/${pk}/update/`, fdata)
	// 		.then((res) => {
	// 			toastcomp("Feedback Updated", "success");
	// 			seteditfeedback(false);
	// 			setfeedbackreload(true);
	// 		})
	// 		.catch((err) => {
	// 			toastcomp("Feedback Not Updated", "error");
	// 			seteditfeedback(false);
	// 			setfeedbackreload(true);
	// 		});
	// }

	// const userState = useUserStore((state: { user: any }) => state.user);

	// const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	// async function createFeedback(status) {
	// 	const fdata = new FormData();
	// 	fdata.append("status", status);
	// 	await axiosInstanceAuth2
	// 		.post(`/job/feedback/${aid}/create/`, fdata)
	// 		.then((res) => {
	// 			toastcomp("Feedback Created", "success");
	// 			let title = `Feedback Added By ${userState[0]["name"]} (${userState[0]["email"]}) to Applicant ${canid})`;

	// 			addNotifyLog(axiosInstanceAuth2, title, "");
	// 			toggleLoadMode(true);

	// 			seteditfeedback(false);
	// 			setfeedbackreload(true);
	// 		})
	// 		.catch((err) => {
	// 			toastcomp("Feedback Not Created", "error");
	// 			seteditfeedback(false);
	// 			setfeedbackreload(true);
	// 		});
	// }

	// useEffect(() => {
	// 	if (aid.length > 0 && feedbackreload) {
	// 		loadFeedback(aid);
	// 		getcurrentUser();
	// 		setfeedbackreload(false);
	// 	}
	// }, [aid, feedbackreload]);

	return (
		<>
			<Head>
				<title>{t("Words.ApplicantDetails")}</title>
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
							<div className="w-full xl:max-w-[300px] 2xl:max-w-[400px]">
								<div className="mb-4 flex items-center rounded-large border-2 border-slate-300 bg-white p-5 shadow-normal dark:border-gray-700 dark:bg-gray-800">
									<button
										className="mr-5 justify-self-start text-darkGray dark:text-gray-400"
										onClick={() => {
											router.back();
										}}
									>
										<i className="fa-solid fa-arrow-left text-xl"></i>
									</button>
									<h2 className="text-lg font-bold">
										<span>{t("Words.Profile")}</span>
									</h2>
								</div>
								<div className="mb-4 rounded-large border-2 border-slate-300 bg-white p-5 shadow-normal dark:border-gray-700 dark:bg-gray-800 max-h-[500px] overflow-auto xl:max-h-[inherit]">
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
												{profileData["first_name"]} {profileData["last_name"]}
											</h3>
											<p className="mb-2 text-sm text-darkGray">{appdata["arefid"]}</p>
											<p className="mb-2 text-sm text-darkGray">
												{t("Words.Source")} - &nbsp;
												<span className="font-semibold uppercase text-primary">{type}</span>
											</p>
										</div>
										<div className="flex flex-wrap items-center justify-between">
											<div className="my-1 flex items-center">
												<div className="mr-2 block h-[26px] w-[30px] rounded border border-white bg-red-100 text-center leading-[23px] text-red-500 shadow-normal">
													<i className="fa-regular fa-envelope"></i>
												</div>
												<p className="text-[11px] font-semibold text-darkGray">
													{type === "career" && profileData["user"] && profileData["user"]["email"]}
													{type === "vendor" && profileData["email"] && profileData["email"]}
												</p>
											</div>
											<div className="my-1 flex items-center">
												<div className="mr-2 block h-[26px] w-[30px] rounded border border-white bg-teal-100 text-center leading-[23px] text-teal-500 shadow-normal">
													<i className="fa-solid fa-phone text-[14px]"></i>
												</div>
												<p className="text-[11px] font-semibold text-darkGray">{profileData["mobile"]}</p>
											</div>
										</div>
										{linkData && linkData.length > 0 && (
											<div className="flex flex-wrap items-center justify-center text-2xl">
												{linkData.map((data: any, i: React.Key) => (
													<Link href={`https://${data["title"]}`} target="_blank" className="m-3 mb-0" key={i}>
														<i className="fa-solid fa-link"></i>
													</Link>
												))}
											</div>
										)}
									</div>
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">{t("Words.Details")}</h3>
										<ul className="flex flex-wrap text-[12px] text-darkGray">
											<li className="mb-2 w-[50%] pr-2">
												{t("Form.CurrentSalary")} - {profileData["current_salary"]}
											</li>
											<li className="mb-2 w-[50%] pr-2">
												{t("Form.ExpectedSalary")} - {profileData["expected_salary"]}
											</li>
										</ul>
									</div>
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">{t("Words.Summary")}</h3>
										<p className="text-[12px] text-darkGray">{`${profileData["summary"]}`}</p>
									</div>
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">{t("Words.Skills")}</h3>
										{profileData["skills"] && profileData["skills"].length > 0 ? (
											<ul className="flex flex-wrap rounded-normal border p-2 text-[12px] shadow">
												{profileData["skills"].split(",").map((data: any, i: React.Key) => (
													<li className="m-1 min-w-[75px] rounded-[30px] bg-gray-100 px-4 py-2 text-center" key={i}>
														{data}
													</li>
												))}
											</ul>
										) : (
											<p className="text-[12px] text-darkGray">
												{t("Select.No")} {t("Words.Skills")}
											</p>
										)}
									</div>
									<div className="mb-4 border-b pb-4">
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
									</div>
									<div className="mb-4 border-b pb-4">
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
									</div>
									<div className="mb-4 border-b pb-4">
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
									</div>
									{type === "vendor" && (
										<div className="mb-4 border-b pb-4">
											<h3 className="mb-4 text-lg font-semibold">{t("Words.MessageFromVendor")}</h3>
											<div className="mb-2 rounded-normal border p-3 text-[12px] text-darkGray shadow last:mb-0">
												{profileData["recuriter_message"] && profileData["recuriter_message"].length > 0 ? (
													<p dangerouslySetInnerHTML={{ __html: profileData["recuriter_message"] }}></p>
												) : (
													<p>
														{t("Select.No")} {t("Words.MessageFromVendor")}
													</p>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
							<div className="w-full xl:max-w-[calc(100%-300px)] 2xl:max-w-[calc(100%-400px)] xl:pl-8">
								<div className="overflow-hidden rounded-large border-2 border-slate-300 bg-white shadow-normal dark:border-gray-700 dark:bg-gray-800">
									<div className="relative z-10 flex flex-wrap items-center justify-between p-5 shadow">
										<aside className="flex items-center">
											<Image src={jobIcon} alt="Jobs" width={20} className="mr-3 dark:invert" />
											<h2 className="text-lg font-bold">
												<span>{appdata["job"]["job_title"]}</span>
											</h2>
										</aside>
										<aside className="flex items-center">
											<div className="mr-4">
												<Button
													btnType="button"
													btnStyle="iconLeftBtn"
													label={t("Words.ScheduleInterview")}
													iconLeft={<i className="fa-solid fa-calendar-plus"></i>}
													handleClick={() => {
														router.push("/organization/applicants/schedule-interview");
													}}
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
											<Tab.List className={"border-b px-4 overflow-auto"}>
												<div className="flex w-[700px]">
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
																		? "border-primary text-primary"
																		: "border-transparent text-darkGray dark:text-gray-400")
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
																		? "border-primary text-primary"
																		: "border-transparent text-darkGray dark:text-gray-400")
																}
															>
																{t("Form.Feedback")}
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
																		? "border-primary text-primary"
																		: "border-transparent text-darkGray dark:text-gray-400")
																}
															>
																{t("Words.AIGeneratedInterview")}
															</button>
														)}
													</Tab>
												</div>
											</Tab.List>
											<Tab.Panels>
												<Tab.Panel className={"min-h-[calc(100vh-250px)]"}>
													{profileData["resume"] && profileData["resume"].length > 0 && (
														<>
															<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm">
																<p className="my-2">{profileData["resume"].split("/").pop()}</p>
																<Link
																	href={
																		process.env.NODE_ENV === "production"
																			? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE + profileData["resume"]
																			: process.env.NEXT_PUBLIC_DEV_BACKEND + profileData["resume"]
																	}
																	className="my-2 inline-block font-bold text-primary hover:underline"
																	download={profileData["resume"].split("/").pop()}
																>
																	<i className="fa-solid fa-download mr-2"></i>
																	{t("Btn.Download")}
																</Link>
															</div>
															<iframe
																src={
																	process.env.NODE_ENV === "production"
																		? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE + profileData["resume"]
																		: process.env.NEXT_PUBLIC_DEV_BACKEND + profileData["resume"]
																}
																className="h-[100vh] w-[100%]"
															></iframe>
														</>
													)}
													{/* <div className="px-8">Preview Here</div> */}
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
													{!currentUserFeedback &&
														selectedPerson["name"] === "Review" &&
														((atsVersion === "enterprise" && userRole === "Hiring Manager") ||
															atsVersion != "enterprise") && (
															<div className="relative mt-6 border-t pb-8 pt-6 first:mt-0 first:border-t-0 first:pt-0">
																<h3 className="mb-5">GIVE FEEDBACK FIRST</h3>
																<div className="mb-8 flex w-[210px] items-center rounded-br-[30px] rounded-tr-[30px] bg-lightBlue shadow-normal dark:bg-gray-700">
																	{feedbackStatus !== "Shortlist" ? (
																		<div
																			className={`group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]`}
																			onClick={(e) => {
																				setfeedbackStatus("Shortlist");
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
																				{t("Btn.Shortlist")}
																			</p>
																		</div>
																	) : (
																		<div className="cursor-normal group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]">
																			<i className={"fa-solid fa-thumbs-up text-sm" + " " + "text-primary"}></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"block bg-gradDarkBlue text-white"
																				}
																			>
																				{t("Btn.Shortlist")}
																			</p>
																		</div>
																	)}

																	{feedbackStatus !== "On Hold" ? (
																		<div
																			className={`group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]`}
																			onClick={(e) => {
																				setfeedbackStatus("On Hold");
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
																				{t("Btn.OnHold")}
																			</p>
																		</div>
																	) : (
																		<div className="cursor-normal group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]">
																			<i className={"fa-solid fa-circle-pause text-sm" + " " + "text-yellow-500"}></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"block bg-gradDarkBlue text-white"
																				}
																			>
																				{t("Btn.OnHold")}
																			</p>
																		</div>
																	)}

																	{feedbackStatus !== "Reject" ? (
																		<div
																			className={`group relative h-[40px] w-[70px] cursor-pointer text-center text-[12px] leading-[40px]`}
																			onClick={(e) => {
																				setfeedbackStatus("Reject");
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
																				{t("Btn.Reject")}
																			</p>
																		</div>
																	) : (
																		<div className="cursor-normal group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]">
																			<i className={"fa-solid fa-thumbs-down text-sm" + " " + "text-red-500"}></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"block bg-gradDarkBlue text-white"
																				}
																			>
																				{t("Btn.Reject")}
																			</p>
																		</div>
																	)}
																</div>
																{feedbackStatus.length > 0 && (
																	<div className="overflow-hidden rounded-normal border dark:border-gray-500">
																		<label
																			htmlFor="addFeedback"
																			className="block bg-lightBlue px-4 py-2 font-bold dark:bg-gray-700"
																		>
																			<span className="flex items-center">{t("Form.Feedback")}</span>
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
																			value={feedbackTA}
																			onChange={(e) => setfeedbackTA(e.target.value)}
																		></textarea>
																		<div className="bg-lightBlue px-4 dark:bg-gray-700">
																			<Button
																				btnStyle="sm"
																				label={t("Btn.Add")}
																				btnType={"button"}
																				disabled={!checkDis()}
																				handleClick={() => createFeedback()}
																			/>
																		</div>
																	</div>
																)}
															</div>
														)}

													{/* {!currentUserFeedback && (
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
													)} */}

													{feedbackList &&
														feedbackList.map((data, i) => (
															<div
																className="relative mt-6 border-t pt-6 first:mt-0 first:border-t-0 first:pt-0"
																key={i}
															>
																<div className="mb-8 flex w-[210px] items-center rounded-br-[30px] rounded-tr-[30px] bg-lightBlue shadow-normal dark:bg-gray-700">
																	{data["status"] !== "Shortlist" ? (
																		<div
																			className={`${
																				data["user"]["email"] === currentUser[0]["email"]
																					? "cursor-pointer"
																					: "cursor-normal"
																			} group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]`}
																			onClick={() => {
																				if (data["user"]["email"] === currentUser[0]["email"]) {
																					updateFeedbackStatus(data["id"], "Shortlist");
																				}
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
																				{t("Btn.Shortlist")}
																			</p>
																		</div>
																	) : (
																		<div className="cursor-normal group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]">
																			<i className={"fa-solid fa-thumbs-up text-sm" + " " + "text-primary"}></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"block bg-gradDarkBlue text-white"
																				}
																			>
																				{t("Btn.Shortlist")}
																			</p>
																		</div>
																	)}

																	{data["status"] !== "On Hold" ? (
																		<div
																			className={`${
																				data["user"]["email"] === currentUser[0]["email"]
																					? "cursor-pointer"
																					: "cursor-normal"
																			} group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]`}
																			onClick={() => {
																				if (data["user"]["email"] === currentUser[0]["email"]) {
																					updateFeedbackStatus(data["id"], "On Hold");
																				}
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
																				{t("Btn.OnHold")}
																			</p>
																		</div>
																	) : (
																		<div className="cursor-normal group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]">
																			<i className={"fa-solid fa-circle-pause text-sm" + " " + "text-yellow-500"}></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"block bg-gradDarkBlue text-white"
																				}
																			>
																				{t("Btn.OnHold")}
																			</p>
																		</div>
																	)}

																	{data["status"] !== "Reject" ? (
																		<div
																			className={`${
																				data["user"]["email"] === currentUser[0]["email"]
																					? "cursor-pointer"
																					: "cursor-normal"
																			} group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]`}
																			onClick={() => {
																				if (data["user"]["email"] === currentUser[0]["email"]) {
																					updateFeedbackStatus(data["id"], "Reject");
																				}
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
																			></p>
																		</div>
																	) : (
																		<div className="cursor-normal group relative h-[40px] w-[70px] text-center text-[12px] leading-[40px]">
																			<i className={"fa-solid fa-thumbs-down text-sm" + " " + "text-red-500"}></i>
																			<p
																				className={
																					"absolute bottom-[-22px] left-[50%] block w-full translate-x-[-50%] whitespace-nowrap rounded-b-[8px] px-2 py-[2px] font-semibold leading-normal" +
																					" " +
																					"block bg-gradDarkBlue text-white"
																				}
																			>
																				{t("Btn.Reject")}
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
																					{t("Form.Feedback")}
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
																							label={
																								data["feedback"] && data["feedback"].length > 0
																									? t("Btn.Update")
																									: t("Btn.Add")
																							}
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
																				<span className="flex items-center">{t("Form.Feedback")}</span>
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

													{/* {feedbackList &&
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
														))} */}
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
													{upcomingSoon ? (
														<UpcomingComp />
													) : (
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
													)}
												</Tab.Panel>
												<Tab.Panel className={"min-h-[calc(100vh-250px)] px-8 py-6"}>
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
																		{ailoader ? <>{t("Btn.InProgress")}</> : <>{t("Btn.Regenerate")}</>}
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
export async function getStaticProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	return {
		props: {
			...translations
		}
	};
}
