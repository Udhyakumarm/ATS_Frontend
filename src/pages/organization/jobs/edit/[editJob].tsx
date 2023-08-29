import Head from "next/head";
import { useRouter } from "next/router";
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
import { Tab, Dialog, Listbox, Transition } from "@headlessui/react";
import CardLayout_2 from "@/components/CardLayout-2";
import { addActivityLog, addNotifyJobLog, axiosInstanceAuth } from "@/pages/api/axiosApi";
import Button from "@/components/Button";
import { debounce } from "lodash";
import toastcomp from "@/components/toast";
import moment from "moment";
import { useNotificationStore, useUserStore } from "@/utils/code";
import UpcomingComp from "@/components/organization/upcomingComp";
import PermiumComp from "@/components/organization/premiumComp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import Link from "next/link";
import favIcon from "/public/favicon-white.ico";
import { useNewNovusStore } from "@/utils/novus";
import OrgRSideBar from "@/components/organization/RSideBar";

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

export default function JobsEdit({ atsVersion, userRole, upcomingSoon }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [aiLoader, setAiLoader] = useState(false);
	const [sklLoad] = useState(true);
	const router = useRouter();
	const cancelButtonRef = useRef(null);
	const [previewPopup, setPreviewPopup] = useState(false);
	const [publishThanks, setPublishThanks] = useState(false);
	const [index, setIndex] = useState(0);
	const [skillOptions, setSkillOptions] = useState<any>([]);
	const { editJob } = router.query;

	const [accordionOpen, setAccordionOpen] = useState(false);

	//job create state
	const [jtitle, setjtitle] = useState("");
	const [jskill, setjskill] = useState("");
	const [jfsalary, setjfsalary] = useState("");
	const [jesalary, setjesalary] = useState("");
	const [jcurr, setjcurr] = useState("");
	const [jdesc, setjdesc] = useState("");
	const [jfunction, setjfunction] = useState("");
	const [jdept, setjdept] = useState("");
	const [jind, setjind] = useState("");
	const [jgrp, setjgrp] = useState("");
	const [jdeptinfo, setjdeptinfo] = useState("");
	const [jetype, setjetype] = useState("");
	const [jexp, setjexp] = useState("");
	const [jedu, setjedu] = useState("");
	const [jlang, setjlang] = useState("");
	const [jvac, setjvac] = useState("");
	const [jloc, setjloc] = useState("");
	const [jreloc, setjreloc] = useState("");
	const [jvisa, setjvisa] = useState("");
	const [jwtype, setjwtype] = useState("");

	const [jrecruiter, setjrecruiter] = useState(false);
	const [jcollaborator, setjcollaborator] = useState(false);
	const [jtm, setjtm] = useState([]);
	const [ujtm, setujtm] = useState([]);
	const [jfv, setjfv] = useState([]);

	const [integrationList, setIntegrationList] = useState({
		LinkedIn: { access: null },
		Indeed: { access: null },
		Somhako: { access: null },
		GlassDoor: { access: null },
		Twitter: { access: null }
	});

	const jobActions = [
		{
			label: t("Btn.Preview"),
			action: previewJob,
			icon: <i className="fa-solid fa-play" />,
			iconBg: "bg-gradient-to-r from-[#FF930F] to-[#FFB45B]"
		},
		{
			label: t("Btn.SaveAsDraft"),
			action: draftJob,
			icon: <i className="fa-regular fa-bookmark"></i>,
			iconBg: "bg-gradient-to-r from-gradLightBlue to-gradDarkBlue"
		},
		{
			label: t("Btn.Publish"),
			action: publishJob,
			icon: <i className="fa-solid fa-paper-plane"></i>,
			iconBg: "bg-gradient-to-r from-[#6D27F9] to-[#9F09FB] text-[8px]"
		}
	];
	const TeamTableHead = [
		{
			title: t("Words.UserName")
		},
		{
			title: t("Words.Department_Title")
		},
		{
			title: t("Form.Email")
		},
		{
			title: t("Words.Access")
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
	const [filterTeam, setFilterTeam] = useState([]);
	const [search, setsearch] = useState("");
	const [filterVendors, setFilterVendors] = useState([]);
	const [search2, setsearch2] = useState("");

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
					console.log("#", "job load data", res.data);
					var jobData = data[0];
					if (jobData["jobTitle"]) {
						setjtitle(jobData["jobTitle"]);
					}
					if (jobData["jobSkill"]) {
						setjskill(jobData["jobSkill"]);
					}
					if (jobData["jobCurrency"]) {
						setjcurr(jobData["jobCurrency"]);
					}
					if (jobData["jobFromSalary"]) {
						setjfsalary(jobData["jobFromSalary"]);
					}
					if (jobData["jobToSalary"]) {
						setjesalary(jobData["jobToSalary"]);
					}
					if (jobData["jobDescription"]) {
						setjdesc(jobData["jobDescription"]);
					}
					if (jobData["jobFunction"]) {
						setjfunction(jobData["jobFunction"]);
					}
					if (jobData["jobDepartment"]) {
						setjdept(jobData["jobDepartment"]);
					}
					if (jobData["jobIndustry"]) {
						setjind(jobData["jobIndustry"]);
					}
					if (jobData["jobGroupDivision"]) {
						setjgrp(jobData["jobGroupDivision"]);
					}
					if (jobData["jobDeptDescription"]) {
						setjdeptinfo(jobData["jobDeptDescription"]);
					}
					if (jobData["jobEmploymentType"]) {
						setjetype(jobData["jobEmploymentType"]);
					}
					if (jobData["jobExperience"]) {
						setjexp(jobData["jobExperience"]);
					}
					if (jobData["jobQualification"]) {
						setjedu(jobData["jobQualification"]);
					}
					if (jobData["jobLanguage"]) {
						setjlang(jobData["jobLanguage"]);
					}
					if (jobData["jobVacancy"]) {
						setjvac(jobData["jobVacancy"]);
					}
					if (jobData["jobLocation"]) {
						setjloc(jobData["jobLocation"]);
					}
					if (jobData["jobRelocation"]) {
						setjreloc(jobData["jobRelocation"]);
					}
					if (jobData["jobVisa"]) {
						setjvisa(jobData["jobVisa"]);
					}
					if (jobData["jobWorktype"]) {
						setjwtype(jobData["jobWorktype"]);
					}

					var arr = [];
					if (jobData["team"] && jobData["team"].length > 0) {
						let abc2 = jtm;
						for (let j = 0; j < jobData["team"].length; j++) {
							if (jobData["team"][j]["verified"] !== false) {
								arr.push(jobData["team"][j]["id"]);
								if (jobData["team"][j]["role"] === "Collaborator") {
									setjcollaborator(true);
								}
								if (jobData["team"][j]["role"] === "Recruiter") {
									setjrecruiter(true);
								}
								abc2.push(jobData["team"][j]["id"].toString());
							}
						}
						setjtm(abc2);
					}
					setujtm(arr);
					var arr2 = [];
					if (jobData["vendor"] && jobData["vendor"].length > 0) {
						for (let j = 0; j < jobData["vendor"].length; j++) {
							arr2.push(jobData["vendor"][j]["id"].toString());
						}
					}
					setjfv(arr2);
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
				setFilterTeam(res.data);
				console.log("#", ujtm);
			})
			.catch((err) => {
				console.log("@", "listorguser", err);
			});
	}

	useEffect(() => {
		if (search.length > 0) {
			let localSearch = search.toLowerCase();
			let arr = [];
			for (let i = 0; i < tm.length; i++) {
				if (tm[i]["name"].toLowerCase().includes(localSearch) || tm[i]["email"].toLowerCase().includes(localSearch)) {
					arr.push(tm[i]);
				}
			}
			setFilterTeam(arr);
		} else {
			setFilterTeam(tm);
		}
	}, [search]);

	const [vendors, setvendors] = useState([]);
	const [pvendors, setpvendors] = useState([]);
	const [fvendors, setfvendors] = useState([]);

	async function loadVendors() {
		await axiosInstanceAuth2
			.get(`/vendors/list_vendors/`)
			.then(async (res) => {
				console.log("!", res.data);
				setvendors(res.data);
				const data = res.data;
				var arr = [];
				var arr2 = [];
				for (let i = 0; i < data.length; i++) {
					if (!data[i]["onboard"]) {
						arr.push(data[i]);
					} else {
						arr2.push(data[i]);
					}
				}
				setpvendors(arr);
				setfvendors(arr2);
				setFilterVendors(arr2);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	useEffect(() => {
		if (search2.length > 0) {
			let localSearch = search2.toLowerCase();
			let arr = [];
			for (let i = 0; i < fvendors.length; i++) {
				if (
					fvendors[i]["agent_name"].toLowerCase().includes(localSearch) ||
					fvendors[i]["company_name"].toLowerCase().includes(localSearch) ||
					fvendors[i]["email"].toLowerCase().includes(localSearch)
				) {
					arr.push(fvendors[i]);
				}
			}
			setFilterVendors(arr);
		} else {
			setFilterVendors(fvendors);
		}
	}, [search2]);

	useEffect(() => {
		if (token && token.length > 0) {
			loadTeamMember();
			loadVendors();
		}
	}, [token]);

	const userState = useUserStore((state: { user: any }) => state.user);
	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);
	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	async function addJob(formData: any, type: any) {
		await axiosInstanceAuth2
			.put(`/job/update-job/${editJob}/`, formData)
			.then(async (res) => {
				toastcomp("Job Updated Successfully", "success");
				let aname = "";
				let title = "";
				if (type === "active") {
					aname = `${jtitle} Job is updated & published by ${userState[0]["name"]} (${
						userState[0]["email"]
					}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;
					title = `${userState[0]["name"]} (${userState[0]["email"]}) has Edit and posted a Job`;
				}

				if (type === "draft") {
					aname = `${jtitle} Job is updated & drafted by ${userState[0]["name"]} (${
						userState[0]["email"]
					}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;
					title = `${userState[0]["name"]} (${userState[0]["email"]}) has Edit and draft a Job`;
				}

				addActivityLog(axiosInstanceAuth2, aname);
				addNotifyJobLog(axiosInstanceAuth2, title, "Job", res.data["refid"]);
				toggleLoadMode(true);
				if (type === "active") {
					setPublishThanks(true);
					setTimeout(() => {
						setPublishThanks(false);
						router.push(`/organization/jobs/${type}/`);
					}, 3000);
				} else {
					router.push(`/organization/jobs/${type}/`);
				}
			})
			.catch((err) => {
				toastcomp("Job Not Updated", "error");
			});
	}

	function publishJob() {
		if (
			jtitle.length <= 0 ||
			jskill.length <= 0 ||
			jfunction.length <= 0 ||
			jdept.length <= 0 ||
			jlang.length <= 0 ||
			jloc.length <= 0 ||
			(!jcollaborator && atsVersion === "enterprise") ||
			(!jrecruiter && atsVersion === "enterprise")
		) {
			if (jtitle.length <= 0) {
				toastcomp("Job Title Required", "error");
			}
			if (jskill.length <= 0) {
				toastcomp("Job Skills Required", "error");
			}
			if (jlang.length <= 0) {
				toastcomp("Job Spoken Langauge Required", "error");
			}
			if (jloc.length <= 0) {
				toastcomp("Job Location Required", "error");
			}
			if (jfunction.length <= 0) {
				toastcomp("Job Function Required", "error");
			}
			if (jdept.length <= 0) {
				toastcomp("Job Department Required", "error");
			}
			if (!jcollaborator && atsVersion === "enterprise") {
				toastcomp("One Collaborator Required", "error");
			}
			if (!jrecruiter && atsVersion === "enterprise") {
				toastcomp("One Recruiter Required", "error");
			}
		} else {
			const fd = new FormData();
			if (jtitle) {
				fd.append("jobTitle", jtitle);
			}
			if (jskill) {
				fd.append("jobSkill", jskill);
			}
			if (jcurr) {
				fd.append("jobCurrency", jcurr);
			}
			if (jfsalary) {
				fd.append("jobFromSalary", jfsalary);
			}
			if (jesalary) {
				fd.append("jobToSalary", jesalary);
			}
			if (jdesc) {
				fd.append("jobDescription", jdesc);
			}
			if (jfunction) {
				fd.append("jobFunction", jfunction);
			}
			if (jdept) {
				fd.append("jobDepartment", jdept);
			}
			if (jind) {
				fd.append("jobIndustry", jind);
			}
			if (jgrp) {
				fd.append("jobGroupDivision", jgrp);
			}
			if (jdeptinfo) {
				fd.append("jobDeptDescription", jdeptinfo);
			}
			if (jetype) {
				fd.append("jobEmploymentType", jetype);
			}
			if (jexp) {
				fd.append("jobExperience", jexp);
			}
			if (jedu) {
				fd.append("jobQualification", jedu);
			}
			if (jlang) {
				fd.append("jobLanguage", jlang);
			}
			if (jvac) {
				fd.append("jobVacancy", jvac);
			}
			if (jloc) {
				fd.append("jobLocation", jloc);
			}
			if (jreloc) {
				fd.append("jobRelocation", jreloc);
			}
			if (jvisa) {
				fd.append("jobVisa", jvisa);
			}
			if (jwtype) {
				fd.append("jobWorktype", jwtype);
			}

			fd.append("jobStatus", "Active");
			if (jtm.length > 0) {
				fd.append("teamID", jtm.join("|"));
			}
			if (jfv.length > 0) {
				fd.append("vendorID", jfv.join("|"));
			}
			// console.log("jtitle", jtitle);
			// console.log("jfunction", jfunction);
			// console.log("jdept", jdept);
			// console.log("jind", jind);
			// console.log("jgrp", jgrp);
			// console.log("jvac", jvac);
			// console.log("jdeptinfo", jdeptinfo);
			// console.log("jres", jres);
			// console.log("jlooking", jlooking);
			// console.log("jskill", jskill);
			// console.log("jetype", jetype);
			// console.log("jexp", jexp);
			// console.log("jedu", jedu);
			// console.log("jlang", jlang);
			// console.log("jloc", jloc);
			// console.log("jsalary", jsalary);
			// console.log("jcurr", jcurr);
			// console.log("jreloc", jreloc);
			// console.log("jvisa", jvisa);
			// console.log("jwtype", jwtype);
			addJob(fd, "active");
		}
	}

	function draftJob() {
		if (
			jtitle.length <= 0 ||
			jskill.length <= 0 ||
			jfunction.length <= 0 ||
			jdept.length <= 0 ||
			jlang.length <= 0 ||
			jloc.length <= 0
		) {
			if (jtitle.length <= 0) {
				toastcomp("Job Title Required", "error");
			}
			if (jskill.length <= 0) {
				toastcomp("Job Skills Required", "error");
			}
			if (jlang.length <= 0) {
				toastcomp("Job Spoken Langauge Required", "error");
			}
			if (jloc.length <= 0) {
				toastcomp("Job Location Required", "error");
			}
			if (jfunction.length <= 0) {
				toastcomp("Job Function Required", "error");
			}
			if (jdept.length <= 0) {
				toastcomp("Job Department Required", "error");
			}
		} else {
			const fd = new FormData();
			if (jtitle) {
				fd.append("jobTitle", jtitle);
			}
			if (jskill) {
				fd.append("jobSkill", jskill);
			}
			if (jcurr) {
				fd.append("jobCurrency", jcurr);
			}
			if (jfsalary) {
				fd.append("jobFromSalary", jfsalary);
			}
			if (jesalary) {
				fd.append("jobToSalary", jesalary);
			}
			if (jdesc) {
				fd.append("jobDescription", jdesc);
			}
			if (jfunction) {
				fd.append("jobFunction", jfunction);
			}
			if (jdept) {
				fd.append("jobDepartment", jdept);
			}
			if (jind) {
				fd.append("jobIndustry", jind);
			}
			if (jgrp) {
				fd.append("jobGroupDivision", jgrp);
			}
			if (jdeptinfo) {
				fd.append("jobDeptDescription", jdeptinfo);
			}
			if (jetype) {
				fd.append("jobEmploymentType", jetype);
			}
			if (jexp) {
				fd.append("jobExperience", jexp);
			}
			if (jedu) {
				fd.append("jobQualification", jedu);
			}
			if (jlang) {
				fd.append("jobLanguage", jlang);
			}
			if (jvac) {
				fd.append("jobVacancy", jvac);
			}
			if (jloc) {
				fd.append("jobLocation", jloc);
			}
			if (jreloc) {
				fd.append("jobRelocation", jreloc);
			}
			if (jvisa) {
				fd.append("jobVisa", jvisa);
			}
			if (jwtype) {
				fd.append("jobWorktype", jwtype);
			}

			fd.append("jobStatus", "Draft");
			if (jtm.length > 0) {
				fd.append("teamID", jtm.join("|"));
			}
			if (jfv.length > 0) {
				fd.append("vendorID", jfv.join("|"));
			}
			// console.log("jtitle", jtitle);
			// console.log("jfunction", jfunction);
			// console.log("jdept", jdept);
			// console.log("jind", jind);
			// console.log("jgrp", jgrp);
			// console.log("jvac", jvac);
			// console.log("jdeptinfo", jdeptinfo);
			// console.log("jres", jres);
			// console.log("jlooking", jlooking);
			// console.log("jskill", jskill);
			// console.log("jetype", jetype);
			// console.log("jexp", jexp);
			// console.log("jedu", jedu);
			// console.log("jlang", jlang);
			// console.log("jloc", jloc);
			// console.log("jsalary", jsalary);
			// console.log("jcurr", jcurr);
			// console.log("jreloc", jreloc);
			// console.log("jvisa", jvisa);
			// console.log("jwtype", jwtype);
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
				if (arr.length <= 0 && value.length > 0) {
					arr.push(value.toLowerCase().replace(/\s/g, ""));
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

	function onChnageCheck2(e) {
		e.preventDefault();
		let arr = jfv;
		if (e.target.checked) {
			let value2 = e.target.dataset.pk2;

			if (e.target.dataset.id === "Vendor") {
			}

			arr.push(value2);
		} else {
			let value2 = e.target.dataset.pk2;

			if (e.target.dataset.id === "Vendor") {
			}
			arr = arr.filter((item) => item !== value2);
		}

		console.log("!", arr);
		// console.log("!", e.target.dataset.pk);
		setjfv(arr);
	}

	useEffect(() => {
		console.log("#", router.query);
	}, [router]);

	function checkHideOrNot(title: any) {
		// if (atsVersion === "starter" && title === "Job Details") {
		// 	return true;
		// } else if (atsVersion === "premium" && (title === "Job Details" || title === "Team Members")) {
		// 	return true;
		// } else if (atsVersion === "enterprise") {
		// 	return true;
		// }
		return true;
	}

	async function onAIGenerateHandler() {
		if (jtitle && jskill) {
			setAiLoader(true);
			// const prompt = `Write a Job description of ${jtitle} with skills are ${jskill} having salary of range 10 to 12 LPA withun 150 words in english language`;
			var prompt = "";
			setjdesc("");
			if (srcLang === "ja") {
				if (jfsalary && jesalary && jcurr) {
					prompt = `Write a Job description in japanese language for ${jtitle} with skills ${jskill}  having annual salary range ${jfsalary} to ${jesalary} in ${jcurr}`;
				} else {
					prompt = `Write a Job description in japanese language for ${jtitle} with skills ${jskill}`;
				}
			} else if (srcLang === "en") {
				if (jfsalary && jesalary && jcurr) {
					prompt = `Write a Job description for ${jtitle} with skills ${jskill} having annual salary range ${jfsalary} to ${jesalary} in ${jcurr}`;
				} else {
					prompt = `Write a Job description for ${jtitle} with skills ${jskill}`;
				}
			}

			const fd = new FormData();
			console.log("!", "Prompt", prompt);
			fd.append("prompt", prompt);
			await axiosInstanceAuth2
				.post(`/job/ai-description-job/`, fd)
				.then(async (res) => {
					toastcomp("Job description generated", "success");
					if (res.data.message) {
						let data = res.data.message;
						data = data.replaceAll("\n\n", "<br />");
						setjdesc(data);
					}
					console.log("!", "desc", res.data);
					setAiLoader(false);
				})
				.catch((err) => {
					toastcomp("Job description not generated, try again later", "error");
					setAiLoader(false);
				});
		} else {
			toastcomp("Please add title and skill to generate discription", "error");
		}
	}

	const tabHeading_1 = [
		{
			title: t("Words.JobDetails"),
			hide: checkHideOrNot("Job Details")
		},
		{
			title: t("Words.Assessment"),
			hide: checkHideOrNot("Assessment")
		},
		{
			title: t("Words.TeamMembers"),
			hide: checkHideOrNot("Team Members")
		},
		{
			title: t("Words.Vendors"),
			hide: checkHideOrNot("Vendors")
		},
		{
			title: t("Words.JobBoards"),
			hide: checkHideOrNot("Job Boards")
		}
	];
	const tabHeading_2 = [
		{
			title: t("Words.AllTeamMembers"),
			icon: <i className="fa-solid fa-users"></i>
		},
		{
			title: t("Words.Divison"),
			icon: <i className="fa-solid fa-table-cells"></i>
		}
	];
	const VendorTableHead = [
		{
			title: t("Form.AgentName")
		},
		{
			title: t("Form.CompanyName")
		},
		{
			title: t("Form.Email")
		},
		{
			title: " "
		}
	];

	return (
		<>
			<Head>
				<title>{t("Words.EditJob")}</title>
				<meta name="description" content="Generated by create next app" />
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
						<Tab.Group>
							<div className="mb-8 rounded-t-normal bg-white shadow-normal dark:bg-gray-800">
								<div className="flex flex-wrap items-center justify-between p-6">
									<div className="flex flex-wrap items-center justify-start py-2">
										<button
											className="mr-5 justify-self-start text-darkGray dark:text-gray-400"
											onClick={() => router.replace("/organization/jobs")}
										>
											<i className="fa-solid fa-arrow-left text-xl"></i>
										</button>
										<h2 className="text-lg font-bold">
											<span>{jtitle && jtitle.length > 0 ? jtitle : <>{t("Words.JobTitle")}</>}</span>
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
								<Tab.List className={"mx-auto w-full max-w-[1100px] overflow-auto"}>
									<div className="flex w-[820px]">
										{tabHeading_1.map((item, i) => (
											<Tab key={i} as={Fragment}>
												{({ selected }) => (
													<button
														className={
															"border-b-4 px-10 py-3 font-semibold focus:outline-none" +
															" " +
															(selected
																? "border-primary text-primary"
																: "border-transparent text-darkGray dark:text-gray-400") +
															" " +
															(!item.hide && "display-none")
														}
													>
														{item.title}
													</button>
												)}
											</Tab>
										))}
									</div>
								</Tab.List>
							</div>
							<Tab.Panels>
								<Tab.Panel>
									<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
										<StickyLabel label={t("Words.BasicInformation")} />
										<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
											<FormField
												fieldType="input"
												inputType="text"
												label={t("Words.JobTitle")}
												id="job_title"
												value={jtitle}
												handleChange={(e) => setjtitle(e.target.value)}
												required
											/>
											<FormField
												options={ski}
												onSearch={searchSkill}
												fieldType="select2"
												id="skills"
												value={jskill}
												handleChange={setjskill}
												label={t("Words.Skills")}
												required
											/>
										</div>
									</div>
									<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
										<StickyLabel label={t("Words.AnnualSalary")} />
										<div className="relative mx-auto w-full max-w-[1055px] px-4 py-8">
											<div className="-mx-3 flex flex-wrap">
												<div className="mb-4 w-full px-3 md:max-w-[25%]">
													<FormField
														fieldType="input"
														inputType="number"
														label={t("Words.From")}
														id="salary"
														value={parseInt(jfsalary)}
														handleChange={(e) => setjfsalary(e.target.value)}
														icon={<i className="fa-regular fa-money-bill-alt"></i>}
													/>
												</div>
												<div className="mb-4 w-full px-3 md:max-w-[25%]">
													<FormField
														fieldType="input"
														inputType="number"
														label={t("Words.To")}
														id="salary"
														value={jesalary}
														handleChange={(e) => setjesalary(e.target.value)}
														icon={<i className="fa-regular fa-money-bill-alt"></i>}
													/>
												</div>
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="select2"
														label={t("Words.Currency")}
														id="currency"
														options={[
															"USD $",
															"CAD CA$",
															"EUR €",
															"AED AED",
															"AFN Af",
															"ALL ALL",
															"AMD AMD",
															"ARS AR$",
															"AUD AU$",
															"AZN man.",
															"BAM KM",
															"BDT Tk",
															"BGN BGN",
															"BHD BD",
															"BIF FBu",
															"BND BN$",
															"BOB Bs",
															"BRL R$",
															"BWP BWP",
															"BYN Br",
															"BZD BZ$",
															"CDF CDF",
															"CHF CHF",
															"CLP CL$",
															"CNY CN¥",
															"COP CO$",
															"CRC ₡",
															"CVE CV$",
															"CZK Kč",
															"DJF Fdj",
															"DKK Dkr",
															"DOP RD$",
															"DZD DA",
															"EEK Ekr",
															"EGP EGP",
															"ERN Nfk",
															"ETB Br",
															"GBP £",
															"GEL GEL",
															"GHS GH₵",
															"GNF FG",
															"GTQ GTQ",
															"HKD HK$",
															"HNL HNL",
															"HRK kn",
															"HUF Ft",
															"IDR Rp",
															"ILS ₪",
															"INR ₹",
															"IQD IQD",
															"IRR IRR",
															"ISK Ikr",
															"JMD J$",
															"JOD JD",
															"JPY ¥",
															"KES Ksh",
															"KHR KHR",
															"KMF CF",
															"KRW ₩",
															"KWD KD",
															"KZT KZT",
															"LBP L.L.",
															"LKR SLRs",
															"LTL Lt",
															"LVL Ls",
															"LYD LD",
															"MAD MAD",
															"MDL MDL",
															"MGA MGA",
															"MKD MKD",
															"MMK MMK",
															"MOP MOP$",
															"MUR MURs",
															"MXN MX$",
															"MYR RM",
															"MZN MTn",
															"NAD N$",
															"NGN ₦",
															"NIO C$",
															"NOK Nkr",
															"NPR NPRs",
															"NZD NZ$",
															"OMR OMR",
															"PAB B/.",
															"PEN S/.",
															"PHP ₱",
															"PKR PKRs",
															"PLN zł",
															"PYG ₲",
															"QAR QR",
															"RON RON",
															"RSD din.",
															"RUB RUB",
															"RWF RWF",
															"SAR SR",
															"SDG SDG",
															"SEK Skr",
															"SGD S$",
															"SOS Ssh",
															"SYP SY£",
															"THB ฿",
															"TND DT",
															"TOP T$",
															"TRY TL",
															"TTD TT$",
															"TWD NT$",
															"TZS TSh",
															"UAH ₴",
															"UGX USh",
															"UYU $U",
															"UZS UZS",
															"VEF Bs.F.",
															"VND ₫",
															"XAF FCFA",
															"XOF CFA",
															"YER YR",
															"ZAR R",
															"ZMK ZK",
															"ZWL ZWL$"
														]}
														singleSelect
														value={jcurr}
														handleChange={setjcurr}
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
										<StickyLabel label={t("Words.JobDescription")} />
										<div className="mx-auto w-full max-w-[1055px] px-4 pb-8 pt-2">
											<div className="mb-4 w-full text-right">
												<button
													type="button"
													onClick={() => onAIGenerateHandler()}
													className="ml-auto flex min-h-[46px] items-center rounded bg-white p-2 px-4 text-sm shadow-highlight hover:shadow-normal dark:bg-gray-700 md:mt-[-45px]"
												>
													<span className="mr-3">{t("Words.GenerateDescription")}</span>
													{aiLoader ? (
														<i className="fa-solid fa-spinner fa-spin-pulse mx-2"></i>
													) : (
														<div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-[6px] shadow-normal">
															<Image src={favIcon} alt="AI" width={100} height={100} className="" />
														</div>
													)}
												</button>
											</div>
											<FormField
												fieldType="reactquill"
												id="description"
												value={jdesc}
												handleChange={setjdesc}
												handleOnBlur={setjdesc}
												readOnly={aiLoader}
											/>
										</div>
									</div>
									<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
										<StickyLabel label={t("Words.DepartmentInformation")} />
										<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
											<div className="-mx-3 flex flex-wrap">
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label={t("Words.JobFunction")}
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
														label={t("Words.Department")}
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
														label={t("Words.Industry")}
														value={jind}
														handleChange={(e) => setjind(e.target.value)}
														id="industry"
													/>
												</div>
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label={t("Words.Group") + " / " + t("Words.Division")}
														id="group_or_division"
														value={jgrp}
														handleChange={(e) => setjgrp(e.target.value)}
													/>
												</div>
											</div>
											<FormField
												label={t("Words.Department") + " " + t("Form.Description")}
												fieldType="reactquill"
												id="description"
												value={jdeptinfo}
												handleChange={setjdeptinfo}
												handleOnBlur={setjdeptinfo}
											/>
										</div>
									</div>
									<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
										<StickyLabel label={t("Words.EmploymentDetails")} />
										<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
											<div className="-mx-3 flex flex-wrap">
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="select2"
														label={t("Words.EmploymentType")}
														id="employment_type"
														singleSelect
														options={[
															t("Select.FullTime"),
															t("Select.PartTime"),
															t("Select.Contract"),
															t("Select.Temporary"),
															t("Select.Internship")
														]}
														value={jetype}
														handleChange={setjetype}
													/>
												</div>
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label={t("Words.Experience")}
														value={jexp}
														handleChange={(e) => setjexp(e.target.value)}
														id="experience"
													/>
												</div>
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label={"Qualification"}
														value={jedu}
														handleChange={(e) => setjedu(e.target.value)}
														id="qualification"
													/>
												</div>
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label={t("Words.Language")}
														value={jlang}
														handleChange={(e) => setjlang(e.target.value)}
														id="language"
														required
													/>
												</div>
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="number"
														value={jvac}
														handleChange={(e) => setjvac(e.target.value)}
														label={t("Words.NoOfVacancy")}
														id="vacancy"
													/>
												</div>
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														options={locf}
														onSearch={searchLoc}
														fieldType="select2"
														id="location"
														label={t("Words.JobLocation")}
														handleChange={setjloc}
														value={jloc}
														required
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="relative rounded-normal bg-white shadow-normal dark:bg-gray-800">
										<StickyLabel label={t("Words.Benefits")} />
										<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
											<div className="-mx-3 flex flex-wrap">
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="select2"
														label={t("Words.PaidRelocation")}
														id="relocation"
														singleSelect
														options={[t("Select.Yes"), t("Select.No")]}
														value={jreloc}
														handleChange={setjreloc}
													/>
												</div>
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="select2"
														label={t("Words.VisaSponsorship")}
														id="visa"
														singleSelect
														options={[t("Select.Yes"), t("Select.No")]}
														value={jvisa}
														handleChange={setjvisa}
													/>
												</div>
												<div className="mb-4 w-full px-3 md:max-w-[50%]">
													<FormField
														fieldType="select2"
														label={t("Words.WorkplaceType")}
														id="work_type"
														singleSelect
														options={[t("Select.Remote"), t("Select.Office"), t("Select.Hybrid")]}
														value={jwtype}
														handleChange={setjwtype}
													/>
												</div>
											</div>
										</div>
									</div>
								</Tab.Panel>
								<Tab.Panel>
									{upcomingSoon ? (
										<UpcomingComp />
									) : (
										<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
											<StickyLabel label={t("Words.Assessment")} />
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
									)}
								</Tab.Panel>
								<Tab.Panel>
									{atsVersion === "starter" ? (
										<PermiumComp userRole={userRole} />
									) : (
										<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
											<StickyLabel label={t("Words.TeamMembers")} />
											<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
												<Tab.Group>
													<Tab.List className={"mb-6 flex border-b"}>
														{tabHeading_2.map((item, i) => (
															<Tab key={i} as={Fragment}>
																{({ selected }) => (
																	<button
																		type="button"
																		className={
																			"mr-6 inline-flex items-center border-b-4 px-4 py-2 font-semibold focus:outline-none" +
																			" " +
																			(selected
																				? "border-primary text-primary"
																				: "border-transparent text-darkGray dark:text-gray-400")
																		}
																	>
																		<div className="mr-2">{item.icon}</div>
																		{item.title}
																	</button>
																)}
															</Tab>
														))}
													</Tab.List>
													<Tab.Panels>
														<Tab.Panel>
															<div className="mb-6 flex flex-wrap items-center justify-between">
																<div className="w-[350px] pr-2">
																	<FormField
																		fieldType="input"
																		inputType="search"
																		placeholder={t("Words.Search")}
																		icon={<i className="fa-solid fa-magnifying-glass"></i>}
																		value={search}
																		handleChange={(e) => setsearch(e.target.value)}
																	/>
																</div>
																{!upcomingSoon && (
																	<div className="flex grow items-center justify-end">
																		<div className="mr-3 w-[150px]">
																			<FormField
																				fieldType="select"
																				placeholder={t("Words.Sort")}
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
																				<span>{t("Words.SelectAll")}</span>
																				<input type="checkbox" id="teamSelectAll" />
																			</label>
																		</div>
																	</div>
																)}
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
																		{filterTeam &&
																			ujtm &&
																			filterTeam.map(
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
														</Tab.Panel>
														<Tab.Panel>
															{upcomingSoon ? (
																<UpcomingComp />
															) : (
																<div>
																	{Array(4).fill(
																		<label
																			htmlFor="checkDivison"
																			className={
																				"mb-3 block rounded border text-sm" +
																				" " +
																				(accordionOpen ? "border-slate-300" : "")
																			}
																		>
																			<div className="flex flex-wrap items-center px-4">
																				<h6 className="grow py-3 font-bold">Software Developer</h6>
																				<div className="py-3 text-right">
																					<input type="checkbox" id="checkDivison" />
																					<button
																						type="button"
																						className="ml-4 text-darkGray dark:text-gray-400"
																						onClick={() => setAccordionOpen(!accordionOpen)}
																					>
																						<i
																							className={
																								"fa-solid" + " " + (accordionOpen ? "fa-chevron-up" : "fa-chevron-down")
																							}
																						></i>
																					</button>
																				</div>
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
																						<div className="overflow-x-auto">
																							<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
																								<thead>
																									<tr>
																										{TeamTableHead.map((item, i) => (
																											<th className="border-b px-4 py-2 text-left" key={i}>
																												{item.title}
																											</th>
																										))}
																									</tr>
																								</thead>
																								<tbody>
																									{Array(6).fill(
																										<tr>
																											<td className="border-b px-4 py-2 text-sm">Jane Cooper</td>
																											<td className="border-b px-4 py-2 text-sm">Recruiter</td>
																											<td className="border-b px-4 py-2 text-sm">jane@microsoft.com</td>
																											<td className="border-b px-4 py-2 text-sm">On Pending</td>
																											<td className="border-b px-4 py-2 text-sm">Hiring Manager</td>
																										</tr>
																									)}
																								</tbody>
																							</table>
																						</div>
																					</div>
																				</Transition.Child>
																			</Transition.Root>
																		</label>
																	)}
																</div>
															)}
														</Tab.Panel>
													</Tab.Panels>
												</Tab.Group>
											</div>
										</div>
									)}
								</Tab.Panel>
								<Tab.Panel>
									{atsVersion != "enterprise" ? (
										<PermiumComp userRole={userRole} />
									) : (
										<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
											<StickyLabel label={t("Words.Vendors")} />
											<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
												<div className="mb-6 flex flex-wrap items-center justify-between">
													<div className="w-[350px] pr-2">
														<FormField
															fieldType="input"
															inputType="search"
															placeholder={t("Words.Search")}
															icon={<i className="fa-solid fa-magnifying-glass"></i>}
															value={search2}
															handleChange={(e) => setsearch2(e.target.value)}
														/>
													</div>
													{!upcomingSoon && (
														<div className="flex grow items-center justify-end">
															<div className="mr-3 w-[150px]">
																<FormField
																	fieldType="select"
																	placeholder={t("Words.Sort")}
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
																	<span>{t("Words.SelectAll")}</span>
																	<input type="checkbox" id="teamSelectAll" />
																</label>
															</div>
														</div>
													)}
												</div>
												<div className="overflow-x-auto">
													<table cellPadding={"0"} cellSpacing={"0"} className="w-full" id="tableV">
														<thead>
															<tr>
																{VendorTableHead.map((item, i) => (
																	<th className="border-b px-3 py-2 text-left" key={i}>
																		{item.title}
																	</th>
																))}
															</tr>
														</thead>
														<tbody>
															{filterVendors &&
																filterVendors.map((data, i) => (
																	<tr key={i}>
																		<td className="border-b px-3 py-2 text-sm">{data["agent_name"]}</td>
																		<td className="border-b px-3 py-2 text-sm">{data["company_name"]}</td>
																		<td className="border-b px-3 py-2 text-sm">{data["email"]}</td>
																		<td className="border-b px-3 py-2 text-right">
																			<input
																				type="checkbox"
																				value={data["email"]}
																				data-id={"vendor"}
																				data-pk2={data["id"]}
																				checked={jfv.includes(data["id"].toString())}
																				onChange={(e) => onChnageCheck2(e)}
																			/>
																		</td>
																	</tr>
																))}
														</tbody>
													</table>
												</div>
												{/* <div className="mx-[-15px] flex flex-wrap">
													{fvendors &&
														fvendors.map((data, i) => (
															<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] xl:max-w-[33.3333%]" key={i}>
																<CardLayout_2 data={data} />
															</div>
														))}
												</div> */}
											</div>
										</div>
									)}
								</Tab.Panel>
								<Tab.Panel>
									{upcomingSoon ? (
										<UpcomingComp />
									) : (
										<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
											<StickyLabel label="Job Boards" />
											<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
												<div className="mx-[-15px] flex flex-wrap">
													{Object.keys(integrationList).map((key: any) => (
														<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] xl:max-w-[33.3333%]" key={key}>
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
									)}
								</Tab.Panel>
							</Tab.Panels>
						</Tab.Group>
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
												{jtitle ? jtitle : <>{srcLang === "ja" ? "求人タイトル" : "Job Title"}</>}
											</h4>
											<ul className="flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold">
												<li className="mr-3 list-none">{jetype ? jetype : <>Employment Type Not Disclosed</>}</li>
												<li className="mr-3">
													{jcurr && jfsalary && jesalary ? (
														<>
															{jcurr} {jfsalary} to {jesalary}
														</>
													) : (
														<>Salary Not Disclosed</>
													)}
												</li>
												<li className="mr-3">Vacancy - {jvac ? jvac : <>Not Disclosed</>}</li>
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
												<h5 className="mb-2 font-bold">{t("Words.JobDescription")}</h5>
												<article className="jd_article">
													{jdesc ? (
														<>
															<div dangerouslySetInnerHTML={{ __html: jdesc }}></div>
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
														{jfunction ? jfunction : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{"Department: "}
														{jdept ? jdept : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{"Industry: "}
														{jind ? jind : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{"Group / Division: "}
														{jgrp ? jgrp : <>Not Disclosed</>}
													</li>
												</ul>
												<article className="mt-3">
													<h5 className="mb-2 font-bold">
														{t("Words.Department")} {t("Form.Description")}
													</h5>
													{jdeptinfo ? (
														<>
															<p dangerouslySetInnerHTML={{ __html: jdeptinfo }}></p>
														</>
													) : (
														<>Not Disclosed</>
													)}
												</article>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">{srcLang === "ja" ? "スキル" : "Skills"}</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													{jskill ? (
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
														<li className="mr-3 list-none">Not Disclosed</li>
													)}
												</ul>
											</div>
											<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
												<h5 className="mb-2 font-bold">{srcLang === "ja" ? "基本要件" : "Employment Details"}</h5>
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
												<h5 className="mb-2 font-bold">{srcLang === "ja" ? "想定年収" : "Annual Salary"}</h5>
												<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
													<li className="mr-3 list-none">
														{jcurr && jfsalary && jesalary ? (
															<>
																{jcurr} {jfsalary} to {jesalary}
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
														{jreloc && jreloc.length > 0 ? jreloc : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{srcLang === "ja" ? "VISAサポート" : "Visa Sposnership: "}
														{jvisa && jvisa.length > 0 ? jvisa : <>Not Disclosed</>}
													</li>
													<li className="mr-3">
														{jwtype && jwtype.length > 0 ? <>{jwtype} Working</> : <>Not Disclosed Work Type</>}
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
			<Transition.Root show={publishThanks} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setPublishThanks}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-lg">
									<div className="px-8 py-2 text-right">
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setPublishThanks(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8 pt-0 text-center">
										<i className="fa-solid fa-circle-check mb-4 text-[50px] text-green-500"></i>
										<h4 className="mb-2 text-lg font-bold">
											{srcLang === "ja" ? "求人が公開されました" : "Job has been Published"}
										</h4>
										<p className="text-sm">
											{srcLang === "ja" ? (
												<>
													<Link
														href="/organization/jobs/active"
														onClick={() => setPublishThanks(false)}
														className="font-bold text-primary hover:underline dark:text-white"
													>
														公開中の求人を確認する
													</Link>
												</>
											) : (
												<>
													<Link
														href="/organization/jobs/active"
														onClick={() => setPublishThanks(false)}
														className="font-bold text-primary hover:underline dark:text-white"
													>
														Check open jobs
													</Link>
												</>
											)}
										</p>
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
export async function getServerSideProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	return {
		props: {
			...translations
		}
	};
}
