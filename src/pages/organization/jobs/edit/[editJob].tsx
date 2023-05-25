import Head from "next/head";
import { useRouter } from "next/router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Fragment, useEffect, useMemo, useReducer, useRef, useState } from "react";
import FormField from "@/components/FormField";
import Validator, { Rules } from "validatorjs";
import { axiosInstance } from "@/utils";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import CardLayout_1 from "@/components/CardLayout-1";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import CardLayout_2 from "@/components/CardLayout-2";
import { addActivityLog, axiosInstanceAuth } from "@/pages/api/axiosApi";
import Button from "@/components/Button";
import { debounce } from "lodash";
import toastcomp from "@/components/toast";
import moment from "moment";
import { useUserStore } from "@/utils/code";

const JobActionButton = ({ label, handleClick, icon, iconBg }: any) => {
	return (
		<button
			onClick={handleClick}
			className="mr-3 flex items-center justify-center rounded border border-gray-400 px-6 py-2 text-sm font-bold last:mr-0 hover:bg-lightBlue dark:hover:text-black"
			type="button"
		>
			<span className={"mr-2 block h-[20px] w-[20px] rounded-full text-[10px] text-white" + " " + iconBg}>{icon}</span>
			{label}
		</button>
	);
};

const StickyLabel = ({ label }: any) => (
	<h2 className="inline-block min-w-[250px] rounded-br-normal rounded-tl-normal bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-4 text-center font-semibold text-white shadow-lg">
		{label}
	</h2>
);

const tabTitles = ["Job Details", "Assessment", "Team Members", "Vendors", "Job Boards"];

export default function JobsEdit() {
	const router = useRouter();
	const cancelButtonRef = useRef(null);
	const [previewPopup, setPreviewPopup] = useState(false);
	const [index, setIndex] = useState(0);
	const [skillOptions, setSkillOptions] = useState<any>([]);
	const { editJob } = router.query;

	//job create state
	const [jtitle, setjtitle] = useState("");
	const [jfunction, setjfunction] = useState("");
	const [jdept, setjdept] = useState("");
	const [jind, setjind] = useState("");
	const [jgrp, setjgrp] = useState("");
	const [jvac, setjvac] = useState("");
	const [jdeptinfo, setjdeptinfo] = useState("");
	const [jres, setjres] = useState("");
	const [jlooking, setjlooking] = useState("");
	const [jskill, setjskill] = useState("");
	const [jetype, setjetype] = useState("");
	const [jexp, setjexp] = useState("");
	const [jedu, setjedu] = useState("");
	const [jlang, setjlang] = useState("");
	const [jloc, setjloc] = useState("");
	const [jsalary, setjsalary] = useState("");
	const [jcurr, setjcurr] = useState("");
	const [jreloc, setjreloc] = useState("");
	const [jvisa, setjvisa] = useState("");
	const [jwtype, setjwtype] = useState("");

	const [jrecruiter, setjrecruiter] = useState(false);
	const [jcollaborator, setjcollaborator] = useState(false);
	const [jtm, setjtm] = useState([]);
	const [ujtm, setujtm] = useState([]);

	const [integrationList, setIntegrationList] = useState({
		LinkedIn: { access: null },
		Indeed: { access: null },
		Somhako: { access: null },
		GlassDoor: { access: null },
		Twitter: { access: null }
	});

	const jobActions = [
		{
			label: "Preview",
			action: previewJob,
			icon: <i className="fa-solid fa-play" />,
			iconBg: "bg-gradient-to-r from-[#FF930F] to-[#FFB45B]"
		},
		{
			label: "Save as Draft",
			action: draftJob,
			icon: <i className="fa-regular fa-bookmark"></i>,
			iconBg: "bg-gradient-to-r from-gradLightBlue to-gradDarkBlue"
		},
		{
			label: "Publish",
			action: publishJob,
			icon: <i className="fa-solid fa-paper-plane"></i>,
			iconBg: "bg-gradient-to-r from-[#6D27F9] to-[#9F09FB] text-[8px]"
		}
	];

	const CustomTabs = (currentIndex: number, tabIndex: number) => (
		<Tab key={tabIndex}>
			<button
				type="button"
				className={
					"border-b-4 px-10 py-3 font-semibold focus:outline-none" +
					" " +
					(tabIndex === currentIndex
						? "border-primary text-primary"
						: "border-transparent text-darkGray dark:text-gray-400")
				}
			>
				{tabTitles[tabIndex]}
			</button>
		</Tab>
	);

	const TeamTableHead = [
		{
			title: "User Name"
		},
		{
			title: "Department/Title"
		},
		{
			title: "Email"
		},
		{
			title: "Access"
		},
		{
			title: " "
		}
	];

	//naman
	const { data: session } = useSession();
	const [token, settoken] = useState("");
	//Load TM
	const [tm, settm] = useState([]);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadDetailJob(refid: string) {
		await axiosInstanceAuth2
			.get(`/job/detail-job/${refid}/`)
			.then(async (res) => {
				var data = res.data;
				if (data.length > 0) {
					toastcomp("Job Loaded Successfully", "success");
					console.log("#", res.data);

					setjtitle(data[0]["job_title"]);
					setjfunction(data[0]["job_function"]);
					setjdept(data[0]["department"]);
					setjind(data[0]["industry"]);
					setjgrp(data[0]["group_or_division"]);
					setjvac(data[0]["vacancy"]);
					setjdeptinfo(data[0]["description"]);
					setjlooking(data[0]["looking_for"]);
					setjskill(data[0]["jobSkill"]);
					setjetype(data[0]["employment_type"]);
					setjexp(data[0]["experience"]);
					setjedu(data[0]["education"]);
					setjloc(data[0]["location"]);
					setjres(data[0]["responsibility"]);

					if (data[0]["currency"] && data[0]["currency"].length > 0) {
						var abc = data[0]["currency"].split("");
						setjcurr(abc[0]);
						abc.shift();
						abc = abc.join().replaceAll(",", "");
						abc = parseInt(abc);
						setjsalary(abc);
					}

					var arr = [];
					if (data[0]["team"] && data[0]["team"].length > 0) {
						let abc2 = jtm;
						for (let j = 0; j < data[0]["team"].length; j++) {
							if (data[0]["team"][j]["verified"] !== false) {
								arr.push(data[0]["team"][j]["id"]);
								if (data[0]["team"][j]["role"] === "Collaborator") {
									setjcollaborator(true);
								}
								if (data[0]["team"][j]["role"] === "Recruiter") {
									setjrecruiter(true);
								}
								abc2.push(data[0]["team"][j]["id"].toString());
							}
						}
						setjtm(abc2);
					}
					setujtm(arr);

					setjreloc(data[0]["relocation"]);
					setjvisa(data[0]["visa"]);
					setjwtype(data[0]["worktype"]);
				} else {
					router.back();
				}
			})
			.catch((err) => {
				// toastcomp("Job Not Loaded", "error");
				router.back();
			});
	}

	useEffect(() => {
		if (editJob && editJob.length > 0 && token && token.length > 0) {
			loadDetailJob(editJob);
		} else if (!session) {
			router.back();
		}
	}, [editJob, token]);

	async function loadTeamMember() {
		await axiosInstanceAuth2
			.get(`/organization/listorguser/`)
			.then(async (res) => {
				console.log("@", "listorguser", res.data);
				console.log("#", "listorguser", res.data);
				settm(res.data);
				console.log("#", ujtm);
			})
			.catch((err) => {
				console.log("@", "listorguser", err);
			});
	}

	useEffect(() => {
		if (token && token.length > 0) {
			loadTeamMember();
		}
	}, [token]);

	const userState = useUserStore((state: { user: any }) => state.user);

	async function addJob(formData, type) {
		await axiosInstanceAuth2
			.put(`/job/update-job/${editJob}/`, formData)
			.then(async (res) => {
				toastcomp("Job Updated Successfully", "success");
				let aname = "";
				if (type === "active") {
					aname = `${jtitle} Job is updated & published by ${userState[0]["name"]} (${
						userState[0]["email"]
					}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;
				}

				if (type === "draft") {
					aname = `${jtitle} Job is updated & drafted by ${userState[0]["name"]} (${
						userState[0]["email"]
					}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;
				}

				addActivityLog(axiosInstanceAuth2, aname);
				router.push(`/organization/jobs/${type}/`);
			})
			.catch((err) => {
				toastcomp("Job Not Updated", "error");
			});
	}

	function publishJob() {
		if (jtitle.length <= 0 || jfunction.length <= 0 || jdept.length <= 0 || !jcollaborator || !jrecruiter) {
			if (jtitle.length <= 0) {
				toastcomp("Job Title Required", "error");
			}
			if (jfunction.length <= 0) {
				toastcomp("Job Function Required", "error");
			}
			if (jdept.length <= 0) {
				toastcomp("Job Department Required", "error");
			}
			if (!jcollaborator) {
				toastcomp("One Collaborator Required", "error");
			}
			if (!jrecruiter) {
				toastcomp("One Recruiter Required", "error");
			}
		} else {
			const fd = new FormData();
			if (jtitle && jtitle.length > 0) {
				fd.append("job_title", jtitle);
			}
			if (jfunction && jfunction.length > 0) {
				fd.append("job_function", jfunction);
			}
			if (jdept && jdept.length > 0) {
				fd.append("department", jdept);
			}
			if (jind && jind.length > 0) {
				fd.append("industry", jind);
			}
			if (jgrp && jgrp.length > 0) {
				fd.append("group_or_division", jgrp);
			}
			if (jvac && jvac.length > 0) {
				fd.append("vacancy", jvac);
			}
			if (jdeptinfo && jdeptinfo.length > 0) {
				fd.append("description", jdeptinfo);
			}
			if (jlooking && jlooking.length > 0) {
				fd.append("looking_for", jlooking);
			}
			if (jskill && jskill.length > 0) {
				fd.append("jobSkill", jskill);
			}
			if (jetype && jetype.length > 0) {
				fd.append("employment_type", jetype);
			}
			if (jexp && jexp.length > 0) {
				fd.append("experience", jexp);
			}
			if (jedu && jedu.length > 0) {
				fd.append("education", jedu);
			}
			if (jloc && jloc.length > 0) {
				fd.append("location", jloc);
			}
			if (jsalary && jcurr && jsalary.length > 0 && jcurr.length > 0) {
				fd.append("currency", jcurr + jsalary);
			}
			if (jreloc && jreloc.length > 0) {
				fd.append("relocation", jreloc);
			}
			if (jvisa && jvisa.length > 0) {
				fd.append("visa", jvisa);
			}
			if (jwtype && jwtype.length > 0) {
				fd.append("worktype", jwtype);
			}
			// if(jtitle.length > 0){
			// 	fd.append("deadline",jtitle);
			// }
			fd.append("jobStatus", "Active");
			if (jtm.length > 0) {
				fd.append("teamID", jtm.join("|"));
			}
			console.log("jtitle", jtitle);
			console.log("jfunction", jfunction);
			console.log("jdept", jdept);
			console.log("jind", jind);
			console.log("jgrp", jgrp);
			console.log("jvac", jvac);
			console.log("jdeptinfo", jdeptinfo);
			console.log("jres", jres);
			console.log("jlooking", jlooking);
			console.log("jskill", jskill);
			console.log("jetype", jetype);
			console.log("jexp", jexp);
			console.log("jedu", jedu);
			console.log("jlang", jlang);
			console.log("jloc", jloc);
			console.log("jsalary", jsalary);
			console.log("jcurr", jcurr);
			console.log("jreloc", jreloc);
			console.log("jvisa", jvisa);
			console.log("jwtype", jwtype);
			addJob(fd, "active");
		}
	}

	function draftJob() {
		if (jtitle.length <= 0 || jfunction.length <= 0 || jdept.length <= 0) {
			if (jtitle.length <= 0) {
				toastcomp("Job Title Required", "error");
			}
			if (jfunction.length <= 0) {
				toastcomp("Job Function Required", "error");
			}
			if (jdept.length <= 0) {
				toastcomp("Job Department Required", "error");
			}
		} else {
			const fd = new FormData();
			if (jtitle && jtitle.length > 0) {
				fd.append("job_title", jtitle);
			}
			if (jfunction && jfunction.length > 0) {
				fd.append("job_function", jfunction);
			}
			if (jdept && jdept.length > 0) {
				fd.append("department", jdept);
			}
			if (jind && jind.length > 0) {
				fd.append("industry", jind);
			}
			if (jgrp && jgrp.length > 0) {
				fd.append("group_or_division", jgrp);
			}
			if (jvac && jvac.length > 0) {
				fd.append("vacancy", jvac);
			}
			if (jdeptinfo && jdeptinfo.length > 0) {
				fd.append("description", jdeptinfo);
			}
			if (jlooking && jlooking.length > 0) {
				fd.append("looking_for", jlooking);
			}
			if (jskill && jskill.length > 0) {
				fd.append("jobSkill", jskill);
			}
			if (jetype && jetype.length > 0) {
				fd.append("employment_type", jetype);
			}
			if (jexp && jexp.length > 0) {
				fd.append("experience", jexp);
			}
			if (jedu && jedu.length > 0) {
				fd.append("education", jedu);
			}
			if (jloc && jloc.length > 0) {
				fd.append("location", jloc);
			}
			if (jsalary && jcurr && jsalary.length > 0 && jcurr.length > 0) {
				fd.append("currency", jcurr + jsalary);
			}
			if (jreloc && jreloc.length > 0) {
				fd.append("relocation", jreloc);
			}
			if (jvisa && jvisa.length > 0) {
				fd.append("visa", jvisa);
			}
			if (jwtype && jwtype.length > 0) {
				fd.append("worktype", jwtype);
			}
			// if(jtitle.length > 0){
			// 	fd.append("deadline",jtitle);
			// }
			fd.append("jobStatus", "Draft");
			if (jtm.length > 0) {
				fd.append("teamID", jtm.join("|"));
			}
			console.log("jtitle", jtitle);
			console.log("jfunction", jfunction);
			console.log("jdept", jdept);
			console.log("jind", jind);
			console.log("jgrp", jgrp);
			console.log("jvac", jvac);
			console.log("jdeptinfo", jdeptinfo);
			console.log("jres", jres);
			console.log("jlooking", jlooking);
			console.log("jskill", jskill);
			console.log("jetype", jetype);
			console.log("jexp", jexp);
			console.log("jedu", jedu);
			console.log("jlang", jlang);
			console.log("jloc", jloc);
			console.log("jsalary", jsalary);
			console.log("jcurr", jcurr);
			console.log("jreloc", jreloc);
			console.log("jvisa", jvisa);
			console.log("jwtype", jwtype);
			addJob(fd, "draft");
		}
	}

	function previewJob() {
		setPreviewPopup(true);
	}

	//advance filter
	const [locf, setLocf] = useState([]);
	const [ski, setski] = useState([]);
	const [load, setload] = useState(false);

	const debouncedSearchResults = useMemo(() => {
		return debounce(searchLoc, 300);
	}, []);

	useEffect(() => {
		return () => {
			debouncedSearchResults.cancel();
		};
	}, [debouncedSearchResults]);

	async function searchLoc(value) {
		if (value === "") value = "a";
		await axiosInstance.marketplace_api
			.get(`/job/load/location/?search=${value}`)
			.then(async (res) => {
				let obj = res.data;
				console.log(obj);
				let arr = Object.values(obj);
				// for (const [key, value] of Object.entries(obj)) {
				//   arr.push(value)
				// }
				setLocf(arr);
				setload(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function searchSkill(value) {
		await axiosInstance.marketplace_api
			.get(`/job/load/skills/?search=${value}`)
			.then(async (res) => {
				let obj = res.data;
				let arr = [];
				for (const [key, value] of Object.entries(obj)) {
					arr.push(value);
				}
				setski(arr);
				setload(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function onChnageCheck(e) {
		let arr = jtm;
		let abcd = ujtm;
		let value22 = parseInt(e.target.dataset.pk);
		if (abcd.includes(value22)) {
			abcd = abcd.filter((item) => item !== value22);
		} else {
			abcd.push(value22);
		}
		setujtm(abcd);
		if (e.target.checked) {
			if (e.target.dataset.id === "Collaborator") {
				setjcollaborator(true);
			}

			if (e.target.dataset.id === "Recruiter") {
				setjrecruiter(true);
			}

			let value = e.target.value;
			let value2 = e.target.dataset.pk;

			arr.push(value2);
		} else {
			if (e.target.dataset.id === "Collaborator") {
				setjcollaborator(false);
			}

			if (e.target.dataset.id === "Recruiter") {
				setjrecruiter(false);
			}

			let value = e.target.value;
			let value2 = e.target.dataset.pk;

			arr = arr.filter((item) => item !== value2);
		}

		console.log("!", arr);
		console.log("!", e.target.dataset.pk);

		setjtm(arr);
	}

	useEffect(() => {
		console.log("#", router.query);
	}, [router]);

	return (
		<>
			<Head>
				<title>Edit Job</title>
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
						<Tabs onSelect={(i, l) => setIndex(i)}>
							<div className="mb-8 rounded-t-normal bg-white shadow-normal dark:bg-gray-800">
								<div className="flex flex-wrap items-center justify-between p-6">
									<div className="flex flex-wrap items-center justify-start py-2">
										<button
											className="mr-5 justify-self-start text-darkGray dark:text-gray-400"
											onClick={() => router.replace("/organization/jobs")}
										>
											<i className="fa-solid fa-arrow-left text-2xl"></i>
										</button>
										<h2 className="text-xl font-bold">
											<span>{jtitle && jtitle.length > 0 ? jtitle : <>Job Title</>}</span>
										</h2>
									</div>
									<div className="flex flex-wrap items-center">
										{jobActions.map((action, i) => (
											<JobActionButton
												label={action.label}
												handleClick={action.action}
												icon={action.icon}
												iconBg={action.iconBg}
												key={i}
											/>
										))}
									</div>
								</div>
								<TabList className={"mx-auto flex w-full max-w-[1100px] flex-wrap"}>
									{tabTitles.map((_, i) => CustomTabs(index, i))}
								</TabList>
							</div>
							<TabPanel>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Job Title and Department" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField
											fieldType="input"
											inputType="text"
											label="Job Title"
											id="job_title"
											value={jtitle}
											handleChange={(e) => setjtitle(e.target.value)}
											required
										/>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Job Function"
													id="job_function"
													value={jfunction}
													handleChange={(e) => setjfunction(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Department"
													value={jdept}
													handleChange={(e) => setjdept(e.target.value)}
													id="department"
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Industry"
													value={jind}
													handleChange={(e) => setjind(e.target.value)}
													id="industry"
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Group or Division"
													id="group_or_division"
													value={jgrp}
													handleChange={(e) => setjgrp(e.target.value)}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="number"
													value={jvac}
													handleChange={(e) => setjvac(e.target.value)}
													label="Vacancy"
													id="vacancy"
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Department Information" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField fieldType="reactquill" id="description" value={jdeptinfo} handleChange={setjdeptinfo} />
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Your Responsibilities" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField fieldType="reactquill" id="responsibility" value={jres} handleChange={setjres} />
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="What We are Looking For" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField fieldType="reactquill" id="looking_for" value={jlooking} handleChange={setjlooking} />
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Skills" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField
											options={ski}
											onSearch={searchSkill}
											fieldType="select2"
											id="skills"
											value={jskill}
											handleChange={setjskill}
											label="Skills"
										/>
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Employment Details" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="select2"
													label="Employment Type"
													id="employment_type"
													singleSelect
													options={["Full Time", "Part Time", "Contract", "Temporary", "Internship"]}
													value={jetype}
													handleChange={setjetype}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Experience"
													value={jexp}
													handleChange={(e) => setjexp(e.target.value)}
													id="experience"
												/>
											</div>
										</div>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Education"
													value={jedu}
													handleChange={(e) => setjedu(e.target.value)}
													id="education"
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Language"
													value={jlang}
													handleChange={(e) => setjlang(e.target.value)}
													id="language"
												/>
											</div>
										</div>
									</div>

									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField
											options={locf}
											onSearch={searchLoc}
											fieldType="select2"
											id="location"
											label="Location"
											value={jloc}
											handleChange={setjloc}
										/>
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Annual Salary" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="number"
													label="Salary Starting From"
													id="salary"
													value={jsalary}
													handleChange={(e) => setjsalary(e.target.value)}
													icon={<i className="fa-regular fa-money-bill-alt"></i>}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Currency"
													id="currency"
													value={jcurr}
													handleChange={(e) => setjcurr(e.target.value)}
													icon={<i className="fa-regular fa-money-bill-alt"></i>}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="relative rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Benefits" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="select2"
													label="Relocation"
													id="relocation"
													singleSelect
													options={["yes", "no"]}
													value={jreloc}
													handleChange={setjreloc}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="select2"
													label="Visa Sponsorship"
													id="visa"
													singleSelect
													options={["yes", "no"]}
													value={jvisa}
													handleChange={setjvisa}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="select2"
													label="Work Type"
													id="work_type"
													singleSelect
													options={["remote", "office", "hybrid"]}
													value={jwtype}
													handleChange={setjwtype}
												/>
											</div>
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Assessment" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="mx-[-15px] flex flex-wrap">
											{Array(6).fill(
												<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]">
													<CardLayout_1 isBlank={true} />
												</div>
											)}
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Team Members" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="mb-6 flex flex-wrap items-center justify-between">
											<div className="w-[350px] pr-2">
												<FormField
													fieldType="input"
													inputType="search"
													placeholder="Search"
													icon={<i className="fa-solid fa-magnifying-glass"></i>}
												/>
											</div>
											<div className="flex grow items-center justify-end">
												<div className="mr-3 w-[150px]">
													<FormField
														fieldType="select"
														placeholder="Sort"
														singleSelect={true}
														options={[
															{
																id: "A-to-Z",
																name: "A to Z"
															},
															{
																id: "Z-to-A",
																name: "Z to A"
															}
														]}
													/>
												</div>
												<div className="w-[150px]">
													<label
														htmlFor="teamSelectAll"
														className="flex min-h-[45px] w-full cursor-pointer items-center justify-between rounded-normal border border-borderColor p-3 text-sm text-darkGray dark:border-gray-600 dark:bg-gray-700"
													>
														<span>Select All</span>
														<input type="checkbox" id="teamSelectAll" />
													</label>
												</div>
											</div>
										</div>
										<div className="overflow-x-auto">
											<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
												<thead>
													<tr>
														{TeamTableHead.map((item, i) => (
															<th className="border-b px-3 py-2 text-left" key={i}>
																{item.title}
															</th>
														))}
													</tr>
												</thead>
												<tbody>
													{tm &&
														ujtm &&
														tm.map(
															(data, i) =>
																data["verified"] !== false && (
																	<tr key={i}>
																		<td className="border-b px-3 py-2 text-sm">{data["name"]}</td>
																		<td className="border-b px-3 py-2 text-sm">{data["dept"]}</td>
																		<td className="border-b px-3 py-2 text-sm">{data["email"]}</td>
																		<td className="border-b px-3 py-2 text-sm">{data["role"]}</td>
																		<td className="border-b px-3 py-2 text-right">
																			<input
																				type="checkbox"
																				value={data["email"]}
																				data-id={data["role"]}
																				data-pk={data["id"]}
																				onChange={(e) => onChnageCheck(e)}
																				checked={ujtm.includes(data["id"])}
																			/>
																		</td>
																	</tr>
																)
														)}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Vendors" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="mb-6 flex flex-wrap items-center justify-between">
											<div className="w-[350px] pr-2">
												<FormField
													fieldType="input"
													inputType="search"
													placeholder="Search"
													icon={<i className="fa-solid fa-magnifying-glass"></i>}
												/>
											</div>
											<div className="flex grow items-center justify-end">
												<div className="mr-3 w-[150px]">
													<FormField
														fieldType="select"
														placeholder="Sort"
														singleSelect={true}
														options={[
															{
																id: "A-to-Z",
																name: "A to Z"
															},
															{
																id: "Z-to-A",
																name: "Z to A"
															}
														]}
													/>
												</div>
												<div className="w-[150px]">
													<label
														htmlFor="teamSelectAll"
														className="flex min-h-[45px] w-full cursor-pointer items-center justify-between rounded-normal border border-borderColor p-3 text-sm text-darkGray dark:border-gray-600 dark:bg-gray-700"
													>
														<span>Select All</span>
														<input type="checkbox" id="teamSelectAll" />
													</label>
												</div>
											</div>
										</div>
										<div className="mx-[-15px] flex flex-wrap">
											{Array(6).fill(
												<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]">
													<CardLayout_2 />
												</div>
											)}
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Job Boards" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="mx-[-15px] flex flex-wrap">
											{Object.keys(integrationList).map((key: any) => (
												<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]" key={key}>
													<CardLayout_1
														key={key}
														label={key}
														access={integrationList[key as keyof typeof integrationList].access}
														isBlank={false}
													/>
												</div>
											))}
										</div>
									</div>
								</div>
							</TabPanel>
						</Tabs>
					</div>
				</div>
			</main>
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
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
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
											<h4 className="text-xl font-bold leading-none">
												{jtitle && jtitle.length > 0 ? jtitle : <>Job Title</>}
											</h4>
											<ul className="flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold">
												<li className="mr-3 list-none">
													{jetype && jetype.length > 0 ? jetype : <>Employment Type Not Disclosed</>}
												</li>
												<li className="mr-3">
													{jcurr && jsalary && jcurr.length > 0 && jcurr.length > 0 ? (
														<>
															{jcurr} {jsalary}
														</>
													) : (
														<>Salary Not Disclosed</>
													)}
												</li>
												<li className="mr-3">Vacancy - {jvac && jvac.length > 0 ? jvac : <>Not Disclosed</>}</li>
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
												<h5 className="mb-2 font-bold">Department Information</h5>
												<article className="text-sm">
													{jdeptinfo && jdeptinfo.length > 0 ? (
														<>
															<p dangerouslySetInnerHTML={{ __html: jdeptinfo }}></p>
														</>
													) : (
														<>Not Filled</>
													)}
												</article>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">Your Responsibilities</h5>
												<article className="text-sm">
													{jres && jres.length > 0 ? (
														<>
															<p dangerouslySetInnerHTML={{ __html: jres }}></p>
														</>
													) : (
														<>Not Filled</>
													)}
												</article>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">What We are Looking For</h5>
												<article className="text-sm">
													{jlooking && jlooking.length > 0 ? (
														<>
															<p dangerouslySetInnerHTML={{ __html: jlooking }}></p>
														</>
													) : (
														<>Not Filled</>
													)}
												</article>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">Skills</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													{jskill && jskill.length > 0 ? (
														jskill.split(",").map((data, i) =>
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
														<li className="mr-3 list-none">Not Filled</li>
													)}

													{/* <li className="mr-3">ReactJs</li>
													<li className="mr-3">HTML</li> */}
												</ul>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">Employment Details</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													<li className="mr-3 list-none">
														{jetype && jetype.length > 0 ? jetype : <>Not Disclosed</>}
													</li>
													<li className="mr-3">{jedu && jedu.length > 0 ? jedu : <>Not Disclosed</>}</li>
													<li className="mr-3">{jloc && jloc.length > 0 ? jloc : <>Not Disclosed</>}</li>
													<li className="mr-3">Exp : {jexp && jexp.length > 0 ? jexp : <>Not Disclosed</>}</li>
												</ul>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">Annual Salary</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													<li className="mr-3 list-none">
														{jcurr && jsalary && jcurr.length > 0 && jcurr.length > 0 ? (
															<>
																{jcurr} {jsalary}
															</>
														) : (
															<>Salary Not Disclosed</>
														)}
													</li>
												</ul>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">Benefits</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													<li className="mr-3 list-none">
														Paid Relocation : {jreloc && jreloc.length > 0 ? jreloc : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														Visa Sposnership : {jvisa && jvisa.length > 0 ? jvisa : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{jwtype && jwtype.length > 0 ? <>{jwtype} Working</> : <>Not Disclosed Work Type</>}
													</li>
												</ul>
											</div>
										</div>
										<div className="py-4">
											<Button label="Close" btnType="button" handleClick={() => setPreviewPopup(false)} />
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
