import { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import Button from "./Button";
import { useRouter } from "next/router";
import toastcomp from "./toast";
import FormField from "./FormField";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useUserStore, useNotificationStore } from "@/utils/code";
import moment from "moment";
import { addActivityLog, addNotifyJobLog, axiosInstanceOCR } from "@/pages/api/axiosApi";
import UpcomingComp from "./organization/upcomingComp";
import { useLangStore } from "@/utils/code";
import {
	LinkedinShareButton,
	TwitterShareButton,
	FacebookShareButton,
	TelegramShareButton,
	EmailShareButton
} from "react-share";
import Button2 from "./Button2";
import noActivedata from "/public/images/no-data/iconGroup-1.png";
import Image from "next/image";

export default function JobCard_2({ job, handleView, axiosInstanceAuth2, sklLoad, dashbaord, loadJob, userRole, setShowConfetti }: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [starred, setStarred] = useState(false);
	const cancelButtonRef = useRef(null);
	const [previewPopup, setPreviewPopup] = useState(false);
	const [addCand, setAddCand] = useState(false);
	const [shareJob, shareJobPopupOpen] = useState(false);
	const [count1, setcount1] = useState(0);
	const [count2, setcount2] = useState(0);
	const [shareCN, setshareCN] = useState("");
	const router = useRouter();

	const userState = useUserStore((state: { user: any }) => state.user);
	
	const companytype = useUserStore((state: { type: any }) => state.type);

	useEffect(() => {
		console.log("^^^", "JD", job);
	}, [job]);

	function emailExists(email: any) {
		console.log("^^^", "emailExists", email);
		return job.team.some((member) => member.email === email);
	}

	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);
	const [comingSoon, setComingSoon] = useState(false);
	const [recPop, setrecPop] = useState(false);
	const [rjobLoader, setrjobLoader] = useState(0);
	const [rjob, setrjob] = useState([]);

// 	async function loadRecomandedJob() {
// 		var url = ''
// 		if(companytype === "Agency"){url = `/ocr/new2/${job.refid}/`;}
// 		else{url = `/ocr/new1/${job.refid}/`;}
// 		await axiosInstanceAuth2
// 			.post(url)
// 			.then(async (res) => {
// 				if (res.data && res.data.message) {
// 					setrjobLoader(-1);
// 				}
// 				if(res.data.length > 0){

// 				setrjob(res.data);
// 				setrjobLoader(1);
// 				}
// 				else{
// setrjob([]);
// setrjobLoader(-1);
// 				}
// 				console.log("$", "timeline", res.data);
// 			})
// 			.catch((err) => {
// 				console.log("!", err);
// 				setrjob([]);
// 				setrjobLoader(-1);
// 			});
// 	}

// 	useEffect(()=>{
// 		if(recPop){
// 			setrjobLoader(0)
// 			setrjob([])
// 			loadRecomandedJob()
// 		}
// 		else{
// 			setrjobLoader(0);
// 			setrjob([]);
// 		}
// 	},[recPop])



	async function statusUpdate(status: string, refid: string) {
		const formData = new FormData();
		formData.append("jobStatus", status);
		await axiosInstanceAuth2
			.put(`/job/update-job-other/${refid}/`, formData)
			.then((res) => {
				toastcomp(`${status} Successfully`, "success");

				let aname = `${job.job_title} Job is now ${status} by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;
				let title = `${userState[0]["name"]} (${userState[0]["email"]}) has ${status} a Job`;

				addActivityLog(axiosInstanceAuth2, aname);
				addNotifyJobLog(axiosInstanceAuth2, title, "Job", refid, `/agency/jobs/${status.toLowerCase()}/`);
				toggleLoadMode(true);

				router.push(`/agency/jobs/${status.toLowerCase()}/`);
			})
			.catch((err) => {
				toastcomp(`${status} Not Successfully`, "error");
			});
	}

	if (sklLoad === true) {
		return (
			<div className="h-full rounded-normal bg-white px-5 py-2 shadow-normal dark:bg-gray-700">
				<div className="mb-2 flex flex-wrap items-center justify-between">
					<div className="my-2 flex items-center">
						<h4 className="font-bold capitalize">
							<Skeleton width={160} />
						</h4>
					</div>
					<div className="flex text-right text-gray-400">
						<div>
							<Skeleton width={10} height={20} />
						</div>
						<div className="ml-4">
							<Skeleton width={10} height={20} />
						</div>
					</div>
				</div>
				<ul className="mb-4 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
					<li className="mr-3 list-none capitalize">
						<Skeleton width={40} />
					</li>
					<li className="mr-3 capitalize">
						<Skeleton width={40} />
					</li>
				</ul>
				<div className="mx-[-15px] mb-4 flex flex-wrap text-sm">
					<div className="w-full max-w-[calc(100%/3)] border-r px-[15px]">
						<h5 className="mb-1 text-darkGray dark:text-gray-400">
							{srcLang === "ja" ? (
								"総応募"
							) : (
								<>
									Total <br />
									Candidates
								</>
							)}
						</h5>
						<h6 className="text-lg font-semibold">
							<Skeleton width={40} height={16} />
						</h6>
					</div>
					<div className="w-full max-w-[calc(100%/3)] border-r px-[15px]">
						<h5 className="mb-1 text-darkGray dark:text-gray-400">
							{srcLang === "ja" ? (
								"選考中"
							) : (
								<>
									Active <br />
									Candidates
								</>
							)}
						</h5>
						<h6 className="text-lg font-semibold">
							<Skeleton width={40} height={16} />
						</h6>
					</div>
					<div className="w-full max-w-[calc(100%/3)] px-[15px]">
						<h5 className="mb-1 text-darkGray dark:text-gray-400">
							{srcLang === "ja" ? (
								"求人ID"
							) : (
								<>
									Job <br />
									ID
								</>
							)}
						</h5>
						<h6 className="clamp_1 break-all text-lg font-semibold">
							<Skeleton width={40} height={16} />
						</h6>
					</div>
				</div>
				<Skeleton width={80} height={28} />
			</div>
		);
	}

	async function getCount() {
		await axiosInstanceAuth2
			.post(`/applicant/jobCard-applicant-count/${job.refid}/`)
			.then((res) => {
				setcount1(res.data.total);
				setcount2(res.data.active);
			})
			.catch((err) => {
				setcount1(0);
				setcount2(0);
			});
	}

	async function loadOrganizationProfile() {
		await axiosInstanceAuth2
			.get(`/organization/listorganizationprofile/`)
			.then(async (res) => {
				setshareCN(res.data[0]["user"]["company_name"]);
			})
			.catch((err) => {
				console.log("@", "oprofile", err);
			});
	}

	useEffect(() => {
		getCount();
		loadOrganizationProfile();
	}, []);

	async function updateJob(star: any, refid: any) {
		const fd = new FormData();
		fd.append("star", star);
		await axiosInstanceAuth2
			.put(`/job/update-job-other/${refid}/`, fd)
			.then(async (res) => {
				toastcomp("Bookmarked Successfully", "success");
				loadJob();
			})
			.catch((err) => {
				toastcomp("Bookmarked Not Succeessfully", "error");
				loadJob();
			});
	}


	//add applicant state
	const [resume, setresume] = useState<File | null>(null);
	const [fname, setfname] = useState("");
	const [lname, setlname] = useState("");
	const [email, setemail] = useState("");
	const [summary, setsummary] = useState("");
	const [ocrLoader, setocrLoader] = useState(false);
	const [step1Data, setstep1Data] = useState({});
	const [version, setversion] = useState("");
	const [step, setstep] = useState(0);

	function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files && event.target.files[0];
			setresume(file);
		}
	}

	function resetState() {
		setresume(null);
		setfname("");
		setlname("");
		setemail("");
		setstep(0);
		setsummary("");
		setstep1Data({});
		setversion("");
	}

	function disBtnApply() {
		return (
			fname.length > 0 &&
			lname.length > 0 &&
			email.length > 0 &&
			summary.length > 0 &&
			resume != null &&
			step1Data["rtext"] &&
			step1Data["rtext"].length > 0
		);
	}

	useEffect(() => {
		if (addCand) {
			//add
			setresume(null);
			setfname("");
			setlname("");
			setemail("");
			setstep(0);
			setsummary("");
			setstep1Data({});
			setversion("");
			setocrLoader(false);
		}
	}, [addCand]);

	useEffect(() => {
		if (resume != null && job.refid.length > 0) {
			console.log("$", "Step1", "Resume Changed Useeffect...");
			const fd = new FormData();
			fd.append("resume", resume);
			step1(job.refid, fd);
		}
	}, [resume]);

	async function step1(refid: any, fd: any) {
		setocrLoader(true);
		await axiosInstanceOCR
			.post(`/applicant/step-1/${refid}/`, fd)
			.then(async (res) => {
				toastcomp("step 1", "success");
				const dataObj = res.data;
				console.log("!!!", "step1", dataObj);
				console.log("!!!", "step1", dataObj["Email"]);
				const data = res.data;

				
				if (
					data["Email"] &&
					data["Email"].length > 0 &&
					data["First Name"] &&
					data["First Name"].length > 0 &&
					data["Last Name"] &&
					data["Last Name"].length > 0 &&
					((data["Summary"] && data["Summary"].length > 0) ||
						(data["Candidate Summary"] && data["Candidate Summary"].length > 0)) &&
					data["rtext"] &&
					data["rtext"].length > 0
				){
					//alldata
					toastcomp("step 2", "success");
					applyApplicantForAutomate(refid, data);
				}
				else{
					//somedata missing
					toastcomp("step 2", "success");
							if (data["Email"] && data["Email"].length > 0) {
								setemail(data["Email"]);
							}
							if (data["First Name"] && data["First Name"].length > 0) {
								setfname(data["First Name"]);
							}
							if (data["Last Name"] && data["Last Name"].length > 0) {
								setlname(data["Last Name"]);
							}
							if (data["Summary"] && data["Summary"].length > 0) {
								setsummary(data["Summary"]);
							}
							if (data["Candidate Summary"] && data["Candidate Summary"].length > 0) {
								setsummary(data["Candidate Summary"]);
							}
							if (data["version"] && data["version"].length > 0) {
								setversion(data["version"]);
							}
							setstep1Data(data);
							setocrLoader(false);
							setstep(2);
				}

				
			})
			.catch((err) => {
				toastcomp("step 1", "error");
				console.log("!!!", "step1 errr", err);
				resetState();
			});
	}

	
	async function applyApplicantForAutomate(refid: any, data: any) {
		toastcomp("step 3", "success");
		setocrLoader(true);
		const fd = new FormData();
		if (data["Email"] && data["Email"].length > 0) {
			fd.append("email", data["Email"]);
		}
		if (data["First Name"] && data["First Name"].length > 0) {
			fd.append("fname", data["First Name"]);
		}
		if (data["Last Name"] && data["Last Name"].length > 0) {
			fd.append("lname", data["Last Name"]);
		}
		if (data["rtext"] && data["rtext"].length > 0) {
			fd.append("rtext", data["rtext"]);
		}
		if (data["Summary"] && data["Summary"].length > 0) {
			fd.append("summary", data["Summary"]);
		}
		if (data["Candidate Summary"] && data["Candidate Summary"].length > 0) {
			fd.append("summary", data["Candidate Summary"]);
		}
		if (data["Percentage"]) {
			fd.append("percent", data["Percentage"]);
		}
		fd.append("resume", resume);

		await axiosInstanceAuth2
			.post(`/applicant/team-apply/${refid}/`, fd)
			.then((res) => {
				console.log("!!!!","applyApplicantForAutomate",res.data)
				if (res.data.success === 1) {
					toastcomp("Applied Successfully", "success");
					setShowConfetti(true);
				} else if (res.data.success === 2) {
					toastcomp("Email already refered by other team member", "error");
				}else if (res.data.success === 3) {
					toastcomp("Email Account Already Exist", "error");
				} else {
					toastcomp("Already Applied", "error");
				}
				getCount()
				resetState();
				setocrLoader(false);
				setAddCand(false);
			})
			.catch((err) => {
				toastcomp("step 1", "error");
				console.log("!!!", "apply noauth err", err);
				resetState();
				setocrLoader(false);
				setAddCand(false);
			});
	}

	async function applyApplicantForManual() {
		toastcomp("step 3", "success");
		setocrLoader(true);
		const fd = new FormData();
		fd.append("email", email);
		fd.append("fname", fname);
		fd.append("lname", lname);
		fd.append("summary", summary);

		if (step1Data["rtext"] && step1Data["rtext"].length > 0) {
			fd.append("rtext", step1Data["rtext"]);
		}

		if (step1Data["Percentage"]) {
			fd.append("percent", step1Data["Percentage"]);
		}
		fd.append("resume", resume);

		await axiosInstanceAuth2
			.post(`/applicant/team-apply/${job.refid}/`, fd)
			.then((res) => {
				console.log("!!!!","applyApplicantForManual",res.data)
				if (res.data.success === 1) {
					toastcomp("Applied Successfully", "success");
					setShowConfetti(true);
				} else if (res.data.success === 2) {
					toastcomp("Email already refered by other team member", "error");
				}else if (res.data.success === 3) {
					toastcomp("Email Account Already Exist", "error");
				} else {
					toastcomp("Already Applied", "error");
				}
				getCount();
				resetState();
				setocrLoader(false);
				setAddCand(false);
			})
			.catch((err) => {
				toastcomp("step 1", "error");
				console.log("!!!", "apply noauth err", err);
				resetState();
				setocrLoader(false);
				setAddCand(false);
			});
	}

	const [loader, setloader] = useState(false);

	async function applyJob(arefid) {
		setloader(true);
		const fd = new FormData();
		fd.append("refid", job.refid);
		fd.append("arefid", arefid);
		await axiosInstanceAuth2
			.post(`/ocr/recommend-apply/`, fd)
			.then(async (res) => {
				console.log("res", res.data.success);
				if (res.data["success"] === 0) {
					toastcomp("Not applied", "error");
				} else if (res.data["success"] === 1) {
					toastcomp("Applied successfully", "success");
				}
				setloader(false);
				loadRecomandedJob();
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("Not applied", "error");
				setloader(false);
				loadRecomandedJob();
			});
	}



	return (
		<>
			<div className="h-full rounded-normal bg-white px-5 py-2 shadow-normal dark:bg-gray-700">
				<div className="mb-2 flex flex-wrap items-center justify-between">
					<div className="my-2 flex items-center">
						<button type="button" onClick={() => updateJob(!job.star, job.refid)}>
							<i
								className={
									"mr-2" + " " + (job.star ? "fa-solid fa-star text-yellow-400" : "fa-solid fa-star text-gray-200")
								}
							/>
						</button>
						<h4 className="font-bold capitalize">{job.jobTitle}</h4>
					</div>
					{!dashbaord && (
						<div className="text-right text-gray-400">
							{job.jobStatus === "Active" && (
								<>
									<button type="button" className="mr-2 text-sm" onClick={() => shareJobPopupOpen(true)}>
										<i className="fa-solid fa-share"></i>
									</button>
								</>
							)}
							{userRole != "Hiring Manager" ? (
								<>
									{(userRole === "Recruiter" && emailExists(userState[0]["email"])) ||
									userRole === "Collaborator" ||
									userRole === "Super Admin" ? (
										<Menu as="div" className="relative inline-block">
											<Menu.Button className={"p-2"}>
												<i className="fa-solid fa-ellipsis-vertical"></i>
											</Menu.Button>
											<Transition
												as={Fragment}
												enter="transition ease-out duration-100"
												enterFrom="transform opacity-0 scale-95"
												enterTo="transform opacity-100 scale-100"
												leave="transition ease-in duration-75"
												leaveFrom="transform opacity-100 scale-100"
												leaveTo="transform opacity-0 scale-95"
											>
												<Menu.Items
													className={
														"absolute right-0 top-[100%] w-[200px] rounded-normal bg-white py-2 text-darkGray shadow-normal dark:bg-black dark:text-gray-200"
													}
												>
													{job.jobStatus === "Active" && (
														<>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={(e) => {
																		router.push(`edit/${job.refid}`);
																	}}
																>
																	{srcLang === "ja" ? "求人を編集" : "Edit Job"}
																</button>
															</Menu.Item>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={(e) => {
																		router.push(`clone/${job.refid}`);
																	}}
																>
																	{srcLang === "ja" ? "求人を複製" : "Clone Job"}
																</button>
															</Menu.Item>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={() => statusUpdate("Archived", job.refid)}
																>
																	{srcLang === "ja" ? "求人をアーカイブ" : "Archieve Job"}
																</button>
															</Menu.Item>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={() => statusUpdate("Closed", job.refid)}
																>
																	{srcLang === "ja" ? "求人をクローズ" : "Delete Job"}
																</button>
															</Menu.Item>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={() => setAddCand(true)}
																>
																	{srcLang === "ja" ? "レジュメをアップロード (pdf/doc)" : "Upload Resume (PDF/DOC)"}
																</button>
															</Menu.Item>
														</>
													)}

													{job.jobStatus === "Draft" && (
														<>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={(e) => {
																		router.push(`edit/${job.refid}`);
																	}}
																>
																	{srcLang === "ja" ? "求人を編集" : "Edit Job"}
																</button>
															</Menu.Item>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={(e) => {
																		router.push(`clone/${job.refid}`);
																	}}
																>
																	{srcLang === "ja" ? "求人を複製" : "Clone Job"}
																</button>
															</Menu.Item>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={() => statusUpdate("Closed", job.refid)}
																>
																	{srcLang === "ja" ? "求人をクローズ" : "Delete Job"}
																</button>
															</Menu.Item>
														</>
													)}

													{job.jobStatus === "Archived" && (
														<>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={(e) => {
																		router.push(`edit/${job.refid}`);
																	}}
																>
																	{srcLang === "ja" ? "求人を編集" : "Edit Job"}
																</button>
															</Menu.Item>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={(e) => {
																		router.push(`clone/${job.refid}`);
																	}}
																>
																	{srcLang === "ja" ? "求人を複製" : "Clone Job"}
																</button>
															</Menu.Item>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={() => statusUpdate("Closed", job.refid)}
																>
																	{srcLang === "ja" ? "求人をクローズ" : "Delete Job"}
																</button>
															</Menu.Item>
														</>
													)}

													{job.jobStatus === "Closed" && (
														<>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={(e) => {
																		router.push(`clone/${job.refid}`);
																	}}
																>
																	{srcLang === "ja" ? "求人を複製" : "Clone Job"}
																</button>
															</Menu.Item>
														</>
													)}
												</Menu.Items>
											</Transition>
										</Menu>
									) : (
										<></>
									)}
								</>
							) : (
								<Menu as="div" className="relative inline-block">
									<Menu.Button className={"p-2"}>
										<i className="fa-solid fa-ellipsis-vertical"></i>
									</Menu.Button>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items
											className={
												"absolute right-0 top-[100%] w-[200px] rounded-normal bg-white py-2 text-darkGray shadow-normal dark:bg-black dark:text-gray-200"
											}
										>
											{job.jobStatus === "Active" && (
												<>
													<Menu.Item>
														<button
															type="button"
															className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
															onClick={() => setAddCand(true)}
														>
															{srcLang === "ja" ? "レジュメをアップロード (pdf/doc)" : "Upload Resume (PDF/DOC)"}
														</button>
													</Menu.Item>
												</>
											)}
										</Menu.Items>
									</Transition>
								</Menu>
							)}
						</div>
					)}
				</div>
				<ul className="mb-4 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
					<li className="mr-3 list-none capitalize">{job.jobWorktype ? job.jobWorktype : <>Not Disclosed</>}</li>
					<li className="mr-3 capitalize">{job.jobEmploymentType ? job.jobEmploymentType : <>Not Disclosed</>}</li>
				</ul>
				<div className="mx-[-15px] mb-4 flex flex-wrap text-sm">
					<div className="mb-2 grow border-r px-[15px]">
						<h5 className="mb-1 text-darkGray dark:text-gray-400">
							{srcLang === "ja" ? (
								"総応募"
							) : (
								<>
									Total <br />
									Candidates
								</>
							)}
						</h5>
						<h6 className="text-lg font-semibold">{count1}</h6>
					</div>
					<div className="mb-2 grow border-r px-[15px]">
						<h5 className="mb-1 text-darkGray dark:text-gray-400">
							{srcLang === "ja" ? (
								"選考中"
							) : (
								<>
									Active <br />
									Candidates
								</>
							)}
						</h5>
						<h6 className="text-lg font-semibold">{count2}</h6>
					</div>
					<div className="mb-2 grow px-[15px]">
						<h5 className="mb-1 text-darkGray dark:text-gray-400">
							{srcLang === "ja" ? (
								"求人ID"
							) : (
								<>
									Job <br />
									ID
								</>
							)}
						</h5>
						<h6 className="clamp_1 w-[100px] break-all text-lg font-semibold">{job.refid}</h6>
					</div>
				</div>
				<div className="flex items-center justify-start">
					<Button2
						btnStyle="outlined"
						btnType="button"
						label={srcLang === "ja" ? "みる" : "View"}
						handleClick={() => router.push(`/agency/jobs/preview/${shareCN}/${job.refid}`)}
						small
					/>
					{/* {job.jobStatus === "Active" && ( 
						 <>
						 	<Button2
						 		btnStyle="outlined"
						 		btnType="button"
						 		label={srcLang === "ja" ? "みる" : "Recommendations"}
						 		handleClick={() => setrecPop(true)}
						 		small
						 	/>
						 </>
					)} */}
				</div>
			</div>

			<Transition.Root show={previewPopup} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setPreviewPopup}>
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
								<Dialog.Panel className="relative min-h-screen w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:max-w-full">
									<div className="flex items-center justify-between border-b px-8 py-3 dark:border-b-gray-600">
										<aside>
											<h4 className="text-lg font-bold leading-none">
												{job.jobTitle ? job.jobTitle : <>{srcLang === "ja" ? "求人タイトル" : "Job Title"}</>}
											</h4>
											<ul className="flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold">
												<li className="mr-3 list-none">
													{job.jobEmploymentType ? job.jobEmploymentType : <>Employment Type Not Disclosed</>}
												</li>
												<li className="mr-3">
													{job.jobCurrency && job.jobFromSalary && job.jobToSalary ? (
														<>
															{job.jobCurrency} {job.jobFromSalary} to {job.jobToSalary}
														</>
													) : (
														<>Salary Not Disclosed</>
													)}
												</li>
												<li className="mr-3">Vacancy - {job.jobVacancy ? job.jobVacancy : <>Not Disclosed</>}</li>
											</ul>
										</aside>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setPreviewPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="px-8">
										<div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">{srcLang === "ja" ? "求人票" : "Job Description"}</h5>
												<article className="jd_article">
													{job.jobDescription ? (
														<>
															<div dangerouslySetInnerHTML={{ __html: job.jobDescription }}></div>
														</>
													) : (
														<>Not Filled</>
													)}
												</article>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">{srcLang === "ja" ? "部門情報" : "Department Information"}</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													<li className="mr-3 list-none">
														{"Job Function: "}
														{job.jobFunction ? job.jobFunction : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{"Department: "}
														{job.jobDepartment ? job.jobDepartment : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{"Industry: "}
														{job.jobIndustry ? job.jobIndustry : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{"Group / Division: "}
														{job.jobGroupDivision ? job.jobGroupDivision : <>Not Disclosed</>}
													</li>
												</ul>
												<article className="mt-3">
													<h5 className="mb-2 font-bold">
														{srcLang === "ja" ? "部門案内文" : "Department Description"}
													</h5>
													{job.jobDeptDescription ? (
														<>
															<p dangerouslySetInnerHTML={{ __html: job.jobDeptDescription }}></p>
														</>
													) : (
														<>Not Disclosed</>
													)}
												</article>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">{srcLang === "ja" ? "スキル" : "Skills"}</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													{job.jobSkill ? (
														job.jobSkill.split(",").map((data, i) =>
															i === 0 ? (
																<li className={`mr-3 list-none`} key={i}>
																	{data}
																</li>
															) : (
																<li className={`mr-3`} key={i}>
																	{data}
																</li>
															)
														)
													) : (
														<li className="mr-3 list-none">Not Disclosed</li>
													)}
												</ul>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">{srcLang === "ja" ? "基本要件" : "Employment Details"}</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													<li className="mr-3 list-none">
														{job.jobEmploymentType ? job.jobEmploymentType : <>Not Disclosed</>}
													</li>
													<li className="mr-3">{job.jobQualification ? job.jobQualification : <>Not Disclosed</>}</li>
													<li className="mr-3">{job.jobLocation ? job.jobLocation : <>Not Disclosed</>}</li>
													<li className="mr-3">Exp : {job.jobExperience ? job.jobExperience : <>Not Disclosed</>}</li>
												</ul>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">{srcLang === "ja" ? "想定年収" : "Annual Salary"}</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													<li className="mr-3 list-none">
														{job.jobCurrency && job.jobFromSalary && job.jobToSalary ? (
															<>
																{job.jobCurrency} {job.jobFromSalary} to {job.jobToSalary}
															</>
														) : (
															<>Not Disclosed</>
														)}
													</li>
												</ul>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">{srcLang === "ja" ? "待遇面" : "Benefits"}</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													<li className="mr-3 list-none">
														{srcLang === "ja" ? "引越し費用負担" : "Paid Relocation: "}
														{job.jobRelocation ? job.jobRelocation : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{srcLang === "ja" ? "VISAサポート" : "Visa Sposnership: "}
														{job.jobVisa && job.jobVisa.length > 0 ? job.jobVisa : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{job.jobWorktype && job.jobWorktype.length > 0 ? (
															<>{job.jobWorktype} Working</>
														) : (
															<>Not Disclosed Work Type</>
														)}
													</li>
												</ul>
											</div>
										</div>
										<div className="py-4">
											<Button
												label={srcLang === "ja" ? "近い" : "Close"}
												btnType="button"
												handleClick={() => setPreviewPopup(false)}
											/>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={addCand} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-40"
					initialFocus={cancelButtonRef}
					onClose={() => {}}
					static
					open={false}
				>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-white text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									{ocrLoader && (
										<div className="absolute left-0 top-0 z-[1] flex h-full w-full cursor-pointer items-center justify-center bg-[rgba(0,0,0,0.1)] p-6 pt-3 backdrop-blur-md">
											<div className="text-center">
												<i className="fa-solid fa-spinner fa-spin"></i>
												<p className="my-2 font-bold">Kindly hold on for a moment while we process your request.</p>
											</div>
										</div>
									)}

									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Refer Applicant</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddCand(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{resume === null || step === 0 ? (
											<label
												htmlFor="uploadCV"
												className="mb-6 block cursor-pointer rounded-normal border p-6 text-center"
											>
												<h5 className="mb-2 text-darkGray">Drag and Drop Resume Here</h5>
												<p className="mb-2 text-sm">
													Or <span className="font-semibold text-primary dark:text-white">Click Here To Upload</span>
												</p>
												<p className="text-sm text-darkGray">Maximum File Size: 5 MB</p>
												<input
													type="file"
													accept=".doc, .docx,.pdf"
													className="hidden"
													id="uploadCV"
													onChange={handleFileInputChange}
												/>
											</label>
										) : (
											<>
												<div className="my-2 mb-5 flex pb-5">
													<div className="">
														{resume.type === "application/pdf" && (
															<i className="fa-solid fa-file-pdf text-[50px] text-red-500"></i>
														)}
														{resume.type === "application/msword" ||
															(resume.type ===
																"application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
																<i className="fa-solid fa-file-word text-[50px] text-indigo-800"></i>
															))}
													</div>
													<div className="flex grow flex-col justify-between pl-4">
														<div className="flex items-center justify-between text-[15px]">
															<span className="flex w-[50%] items-center">
																<p className="clamp_1 mr-2">{resume.name && resume.name}</p>(
																{resume.size && <>{(resume.size / (1024 * 1024)).toFixed(2)} MB</>})
															</span>
															<aside>
																<button
																	type="button"
																	className="hover:text-underline text-primary"
																	title="View"
																	onClick={() => {
																		if (resume) {
																			const fileUrl = URL.createObjectURL(resume);
																			window.open(fileUrl, "_blank");
																		}
																	}}
																>
																	<i className="fa-solid fa-eye"></i>
																</button>
																<button
																	type="button"
																	className="hover:text-underline ml-4 text-red-500"
																	title="Delete"
																	onClick={() => {
																		setresume(null);
																		setstep(0);
																	}}
																>
																	<i className="fa-solid fa-trash"></i>
																</button>
															</aside>
														</div>
														<div className="relative pt-4">
															<div className="relative h-2 w-full overflow-hidden rounded border bg-gray-100">
																<span
																	className="absolute left-0 top-0 h-full w-full bg-primary transition-all"
																	style={{ width: "100%" }}
																></span>
															</div>
														</div>
													</div>
												</div>

												<div className="mx-[-10px] flex flex-wrap">
													<div className="mb-[20px] w-full px-[10px] md:max-w-[100%]">
														<FormField
															fieldType="input"
															inputType="email"
															label={"Email"}
															value={email}
															handleChange={(e) => setemail(e.target.value)}
															placeholder={"Email"}
															required
														/>
													</div>
												</div>

												<div className="mx-[-10px] flex flex-wrap">
													<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
														<FormField
															fieldType="input"
															inputType="text"
															label={"First Name"}
															value={fname}
															handleChange={(e) => setfname(e.target.value)}
															placeholder={"First Name"}
															required
														/>
													</div>
													<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
														<FormField
															fieldType="input"
															inputType="text"
															label={"Last Name"}
															placeholder={"Last Name"}
															value={lname}
															handleChange={(e) => setlname(e.target.value)}
															required
														/>
													</div>
												</div>

												<FormField
													fieldType="textarea"
													label={"Summary"}
													placeholder={"Summary"}
													value={summary}
													handleChange={(e) => setsummary(e.target.value)}
													required
												/>

												<Button
													label={"Apply"}
													loader={false}
													btnType={"button"}
													disabled={!disBtnApply()}
													handleClick={applyApplicantForManual}
												/>
											</>
										)}
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
										<UpcomingComp title={"Upload Manually Candidate Feature"} setComingSoon={setComingSoon} />
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={recPop} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setrecPop}>
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
										<h4 className="flex items-center font-semibold leading-none">Recommendation applicants</h4>
										<button type="button" className="leading-none hover:text-gray-700" onClick={() => setrecPop(false)}>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="relative min-h-[100px] overflow-auto border-2 border-slate-300 bg-white p-5 shadow-normal dark:border-gray-700 dark:bg-gray-800">
										{loader && (
											<div className="absolute left-0 top-0 z-[1] flex h-full w-full cursor-pointer items-start justify-center bg-[rgba(0,0,0,0.1)] backdrop-blur-md">
												<div className="flex h-full flex-col items-center justify-center text-center">
													<i className="fa-solid fa-spinner fa-spin"></i>
													<p className="my-2 font-bold">Applying in progress...</p>
												</div>
											</div>
										)}
										{rjobLoader === 0 && (
											<div className="absolute left-0 top-0 z-[1] flex h-full w-full cursor-pointer items-start justify-center bg-[rgba(0,0,0,0.1)] backdrop-blur-md">
												<div className="flex h-full flex-col items-center justify-center text-center">
													<i className="fa-solid fa-spinner fa-spin"></i>
													<p className="my-2 font-bold">Loading recommendation applicants...</p>
												</div>
											</div>
										)}
										{rjobLoader === -1 && (
											<div className="mx-auto w-full py-2 text-center">
												<div className="mb-6 p-2">
													<Image
														src={noActivedata}
														alt="No Data"
														width={150}
														className="mx-auto max-h-[200px] w-auto "
													/>
												</div>
												<h5 className="mb-4 text-lg font-semibold">No recommendation candidates</h5>
												<p className="mb-2 text-sm text-darkGray">
													{srcLang === "ja"
														? "アクティブなジョブはありません。アクティブなジョブを管理するには、新しいジョブを投稿してください"
														: "There are not suitable any Candidates for recommendation "}
												</p>
											</div>
										)}
										{rjobLoader === 1 && (
											<h3 className="mb-4 text-lg font-semibold">
												Recommendation Applicants from {companytype === "Agency" ? "Pipeline Database" : "kanban"}
											</h3>
										)}
										{rjobLoader === 1 && rjob.length > 0 && (
											<div>
												{rjob.map((data, i) => (
													<div className="mb-[15px] w-full px-[7px] py-1 last:mb-0 xl:max-w-[100%]" key={i}>
														<div className="h-full rounded-normal bg-white px-3 py-2 shadow-normal dark:bg-gray-700">
															<div className="flex w-full flex-row-reverse gap-1">
																<div className="flex w-fit gap-1">
																	<Button
																		btnStyle="outlined"
																		btnType="button"
																		label={srcLang === "ja" ? "みる" : "View"}
																		handleClick={() => {
																			window.open(
																				process.env.NODE_ENV === "production"
																					? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/media/${data["resume"]}`
																					: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/media/${data["resume"]}`,
																				"_blank"
																			);
																		}}
																	/>
																	<Button
																		btnStyle="outlined"
																		btnType="button"
																		label={srcLang === "ja" ? "みる" : "Apply"}
																		handleClick={() => applyJob(companytype === "Agency" ? data.trefid : data.arefid)}
																	/>
																</div>
																<div className="flex w-full flex-wrap items-center">
																	<h4 className="font-bold">
																		{data.email}&nbsp;|&nbsp;{companytype === "Agency" ? data.trefid : data.arefid}
																	</h4>
																</div>
															</div>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={shareJob} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={shareJobPopupOpen}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#fff] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-md">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "ジョブを共有する" : "Share Job Via"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => shareJobPopupOpen(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<ul className="flex flex-wrap items-center justify-center text-center text-xl text-[#6D27F9] dark:text-[#fff]">
											<li className="mb-2 w-[33.33%] px-[10px]">
												<LinkedinShareButton
													url={`https://ats.somhako.com/organization/${shareCN}/job-detail/${job.refid}`}
												>
													<i className="fa-brands fa-linkedin-in hover:text-black"></i>
												</LinkedinShareButton>
											</li>
											<li className="mb-2 w-[33.33%] px-[10px]">
												<TwitterShareButton
													url={`https://ats.somhako.com/organization/${shareCN}/job-detail/${job.refid}`}
												>
													<i className="fa-brands fa-twitter hover:text-black"></i>
												</TwitterShareButton>
											</li>
											<li className="mb-2 w-[33.33%] px-[10px]">
												<FacebookShareButton
													url={`https://ats.somhako.com/organization/${shareCN}/job-detail/${job.refid}`}
													hashtag={job.jobSkill}
												>
													<i className="fa-brands fa-facebook-f hover:text-black"></i>
												</FacebookShareButton>
											</li>
											<li className="mb-2 w-[33.33%] px-[10px]">
												<EmailShareButton
													subject={job.jobTitle}
													url={`https://ats.somhako.com/organization/${shareCN}/job-detail/${job.refid}`}
												>
													<i className="fa-solid fa-envelope hover:text-black"></i>
												</EmailShareButton>
											</li>
											<li className="mb-2 w-[33.33%] px-[10px]">
												<button
													type="button"
													className="hover:text-black"
													onClick={(e) => {
														navigator.clipboard
															.writeText(`https://www.ats.somhako.com/organization/${shareCN}/job-detail/${job.refid}`)
															.then((e) => {
																toastcomp("Copid Successfully", "Success");
															})
															.catch((e) => {
																toastcomp("Copid Unsuccessfully", "error");
															});
													}}
												>
													<i className="fa-regular fa-copy"></i>
												</button>
											</li>
										</ul>
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
