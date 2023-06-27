import Button from "@/components/Button";
import FormField from "@/components/FormField";
import HeaderBar from "@/components/HeaderBar";
import Link from "next/link";
import { axiosInstance, axiosInstanceAuth } from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";
import { debounce } from "lodash";
import { axiosInstance as axis } from "@/utils";
import moment from "moment";
import { useCarrierStore } from "@/utils/code";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getProviders, useSession } from "next-auth/react";
import router from "next/router";
import {
	Fragment,
	JSXElementConstructor,
	Key,
	ReactElement,
	ReactFragment,
	ReactPortal,
	useEffect,
	useState,
	useRef,
	useMemo,
	ChangeEvent,
	FormEvent
} from "react";
import { Combobox, Dialog, Tab, Transition } from "@headlessui/react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";

export default function CanCareerJobDetail({ upcomingSoon }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [sklLoad] = useState(true);
	const { data: session } = useSession();
	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const setcid = useCarrierStore((state: { setcid: any }) => state.setcid);
	const orgdetail = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);
	const setorgdetail = useCarrierStore((state: { setorgdetail: any }) => state.setorgdetail);
	const jid = useCarrierStore((state: { jid: any }) => state.jid);
	const setjid = useCarrierStore((state: { setjid: any }) => state.setjid);
	const jdata = useCarrierStore((state: { jdata: any }) => state.jdata);
	const setjdata = useCarrierStore((state: { setjdata: any }) => state.setjdata);

	const [token, settoken] = useState("");
	const [btndis, setbtndis] = useState(false);

	useEffect(() => {
		if (
			(orgdetail && Object.keys(orgdetail).length === 0) ||
			(jdata && Object.keys(jdata).length === 0) ||
			(jid && jid == "")
		) {
			if (cname == "" || cid == "") router.replace(`/organization/${cname}`);
			else router.back();
		}
	}, [cid, orgdetail, jid, jdata, cname]);

	useEffect(() => {
		if (jdata) console.log(jdata);
	}, [jdata]);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	async function checkApplicant() {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		await axiosInstanceAuth2
			.get(`/job/applicant/check/${jid}/`)
			.then(async (res) => {
				console.log("!", res.data);
				if (res.data["Message"] == 1) {
					setbtndis(true);
				} else {
					setbtndis(false);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		if (token && token.length > 0 && jid && jid.length > 0) {
			checkApplicant();
		}
	}, [token, jid]);

	//add
	const cancelButtonRef = useRef(null);
	const [addCand, setAddCand] = useState(false);
	const [addSocial, setAddSocial] = useState(false);
	const [resume, setresume] = useState<File | null>(null);
	const [fname, setfname] = useState("");
	const [lname, setlname] = useState("");
	const [email, setemail] = useState("");
	const [phone, setphone] = useState("");

	//link
	const [links, setlinks] = useState([]);
	const [link, setlink] = useState("");

	function deleteLink(id: any) {
		var arr = links;
		arr = arr.splice(1, parseInt(id));
		setlinks(arr);
		setlink("");
	}

	function verifylink() {
		return link.length > 0;
	}

	function addlink() {
		let arr = links;
		arr.push(link);
		setlinks(arr);
		setAddSocial(false);
		setlink("");
	}

	const [summary, setsummary] = useState("");
	const [csalary, setcsalary] = useState("");
	const [esalary, setesalary] = useState("");
	const [notice, setnotice] = useState("");
	const [msg, setmsg] = useState("");
	const [skill, setskill] = useState("");

	function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files && event.target.files[0];
			setresume(file);
		}
	}

	const [ski, setski] = useState([]);
	// const [load, setload] = useState(false);

	const debouncedSearchResults = useMemo(() => {
		return debounce(searchSkill, 300);
	}, []);

	useEffect(() => {
		return () => {
			debouncedSearchResults.cancel();
		};
	}, [debouncedSearchResults]);

	//exp
	const [newgre, setnewgre] = useState(false);
	const [expcount, setexpcount] = useState(1);
	const [expid, setexpid] = useState(["expBlock1"]);

	const [educount, seteducount] = useState(0);
	const [eduid, seteduid] = useState([]);

	const [certcount, setcertcount] = useState(0);
	const [certid, setcertid] = useState([]);

	async function searchSkill(value) {
		await axis.marketplace_api
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

	async function addCandidateApplicant(refid: any) {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		await axiosInstanceAuth2
			.post(`/job/applicant/apply/${refid}/`)
			.then((res) => {
				toastcomp(res.data.Message, "success");
			})
			.catch((err) => {
				toastcomp("Candidate Applicant Not Created", "error");
				console.log("@", err);
			});

		setAddCand(false);
		// checkApplicant()
		router.push(`/organization/${cname}/dashboard`);
		// loadVendorAppDetail(vjdata[vjobclick]["refid"], vrefid);
	}

	async function addCandidateCert(refid: any, fd: any) {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		await axiosInstanceAuth2
			.post(`/candidate/candidatecertificate/${refid}/`, fd)
			.then((res) => {
				toastcomp("Candidate Cert Created", "success");
			})
			.catch((err) => {
				toastcomp("Candidate Cert Not Created", "error");
				console.log("@", err);
			});
	}

	async function addCandidateEdu(refid: any, fd: any) {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		await axiosInstanceAuth2
			.post(`/candidate/candidateeducation/${refid}/`, fd)
			.then((res) => {
				toastcomp("Candidate Edu Created", "success");
			})
			.catch((err) => {
				toastcomp("Candidate Edu Not Created", "error");
				console.log("@", err);
			});
	}

	async function addCandidateExp(refid: any, fd: any) {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		await axiosInstanceAuth2
			.post(`/candidate/candidateexperience/${refid}/`, fd)
			.then((res) => {
				toastcomp("Candidate Exp Created", "success");
			})
			.catch((err) => {
				toastcomp("Candidate Exp Not Created", "error");
				console.log("@", err);
			});
	}

	async function addCandidateLink(refid: any, title: any) {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		const fd = new FormData();
		fd.append("title", title);

		await axiosInstanceAuth2
			.post(`/candidate/candidatelink/${refid}/`, fd)
			.then((res) => {
				toastcomp("Candidate Link Created", "success");
			})
			.catch((err) => {
				toastcomp("Candidate Link Not Created", "error");
				console.log("@", err);
			});
	}

	async function addCandidateProfile(refid: any) {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		const fd = new FormData();
		fd.append("first_name", fname);
		fd.append("last_name", lname);
		// fd.append("email", email);
		fd.append("resume", resume);
		fd.append("skills", skill);
		if (!newgre) fd.append("current_salary", csalary);
		if (!newgre) fd.append("notice_period", notice);
		if (phone && phone.length > 0) fd.append("mobile", phone);
		if (summary && summary.length > 0) fd.append("summary", summary);
		if (esalary && esalary.length > 0) fd.append("expected_salary", esalary);
		if (msg && msg.length > 0) fd.append("recuriter_message", msg);

		await axiosInstanceAuth2
			.post(`/candidate/candidateprofile/${refid}/`, fd)
			.then(async (res) => {
				if (res.data["msg"] && res.data["msg"].length > 0) {
					toastcomp(res.data["msg"], "error");
				} else {
					console.log("$", res.data);
					// let vcrefid = res.data.data[0]["vcrefid"];
					toastcomp("Candidate Profile Created", "success");
					for (let i = 0; i < links.length; i++) {
						addCandidateLink(refid, links[i]);
					}

					if (!newgre) {
						for (let i = 0; i < expid.length; i++) {
							var fd = new FormData();
							fd.append("title", document.getElementById(`title${expid[i]}`).value);
							fd.append("company", document.getElementById(`cname${expid[i]}`).value);
							fd.append("year_of_join", document.getElementById(`sdate${expid[i]}`).value);
							fd.append("year_of_end", document.getElementById(`edate${expid[i]}`).value);
							fd.append("expbody", document.getElementById(`desc${expid[i]}`).value);
							fd.append("type", document.getElementById(`jtype${expid[i]}`).value);
							addCandidateExp(refid, fd);
						}
					}

					for (let i = 0; i < eduid.length; i++) {
						var fd = new FormData();
						fd.append("title", document.getElementById(`title${eduid[i]}`).value);
						fd.append("college", document.getElementById(`cname${eduid[i]}`).value);
						fd.append("yearofjoin", document.getElementById(`sdate${eduid[i]}`).value);
						fd.append("yearofend", document.getElementById(`edate${eduid[i]}`).value);
						fd.append("edubody", document.getElementById(`desc${eduid[i]}`).value);
						addCandidateEdu(refid, fd);
					}

					for (let i = 0; i < certid.length; i++) {
						var fd = new FormData();
						fd.append("title", document.getElementById(`title${certid[i]}`).value);
						fd.append("company", document.getElementById(`cname${certid[i]}`).value);
						fd.append("yearofissue", document.getElementById(`sdate${certid[i]}`).value);
						fd.append("yearofexp", document.getElementById(`edate${certid[i]}`).value);
						fd.append("creid", document.getElementById(`cid${certid[i]}`).value);
						fd.append("creurl", document.getElementById(`curl${certid[i]}`).value);
						addCandidateCert(refid, fd);
					}

					addCandidateApplicant(refid);
				}
			})
			.catch((err) => {
				// toastcomp("Vendor Candidate Profile Not Created", "error");
				toastcomp("Email ALreday Exist", "error");
				console.log("error:", err);
			});
	}

	function addApp(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		var check = 0;

		if (fname.length <= 0 || lname.length <= 0 || skill.length <= 0 || resume === null) {
			check = 4;
		} else if (!newgre) {
			for (let i = 0; i < expid.length; i++) {
				if (
					!document.getElementById(`title${expid[i]}`).value ||
					!document.getElementById(`cname${expid[i]}`).value ||
					!document.getElementById(`jtype${expid[i]}`).value ||
					!document.getElementById(`sdate${expid[i]}`).value ||
					!document.getElementById(`edate${expid[i]}`).value ||
					!document.getElementById(`desc${expid[i]}`).value ||
					document.getElementById(`title${expid[i]}`).value.length <= 0 ||
					document.getElementById(`cname${expid[i]}`).value.length <= 0 ||
					document.getElementById(`jtype${expid[i]}`).value.length <= 0 ||
					document.getElementById(`sdate${expid[i]}`).value.length <= 0 ||
					document.getElementById(`edate${expid[i]}`).value.length <= 0 ||
					document.getElementById(`desc${expid[i]}`).value.length <= 0
				) {
					check = 1;
				}
			}
		}

		for (let i = 0; i < eduid.length; i++) {
			if (
				!document.getElementById(`title${eduid[i]}`).value ||
				!document.getElementById(`cname${eduid[i]}`).value ||
				!document.getElementById(`sdate${eduid[i]}`).value ||
				!document.getElementById(`edate${eduid[i]}`).value ||
				!document.getElementById(`desc${eduid[i]}`).value ||
				document.getElementById(`title${eduid[i]}`).value.length <= 0 ||
				document.getElementById(`cname${eduid[i]}`).value.length <= 0 ||
				document.getElementById(`sdate${eduid[i]}`).value.length <= 0 ||
				document.getElementById(`edate${eduid[i]}`).value.length <= 0 ||
				document.getElementById(`desc${eduid[i]}`).value.length <= 0
			) {
				check = 2;
			}
		}

		for (let i = 0; i < certid.length; i++) {
			if (
				!document.getElementById(`title${certid[i]}`).value ||
				!document.getElementById(`cname${certid[i]}`).value ||
				!document.getElementById(`sdate${certid[i]}`).value ||
				!document.getElementById(`edate${certid[i]}`).value ||
				!document.getElementById(`cid${certid[i]}`).value ||
				!document.getElementById(`curl${certid[i]}`).value ||
				document.getElementById(`title${certid[i]}`).value.length <= 0 ||
				document.getElementById(`cname${certid[i]}`).value.length <= 0 ||
				document.getElementById(`sdate${certid[i]}`).value.length <= 0 ||
				document.getElementById(`edate${certid[i]}`).value.length <= 0 ||
				document.getElementById(`cid${certid[i]}`).value.length <= 0 ||
				document.getElementById(`curl${certid[i]}`).value.length <= 0
			) {
				check = 3;
			}
		}

		console.log(check);
		if (check === 0) addCandidateProfile(jid);
		else if (check === 4) toastcomp("Fill Up Required Fields", "error");
		else if (check === 1) toastcomp("Fill Up Exp", "error");
		else if (check === 2) toastcomp("Fill Up Edu", "error");
		else if (check === 3) toastcomp("Fill Up Cert", "error");
	}

	return (
		<>
			<Head>
				<title>{t("Words.JobDetails")}</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main className="py-8">
				<div className="container flex flex-wrap">
					<div className="sticky top-0 h-[calc(100vh-120px)] w-[300px] rounded-normal border border-slate-300 bg-white shadow-normal dark:bg-gray-800">
						<div className="border-b px-6 py-2">
							<div className="relative">
								<input
									type={"search"}
									id={"jobSearch"}
									className={`w-full rounded border-0 pl-8 text-sm focus:ring-0 dark:bg-gray-800`}
									placeholder="Search for Jobs"
								/>
								<span className="absolute left-0 top-[2px] text-lg">
									<i className="fa-solid fa-magnifying-glass"></i>
								</span>
							</div>
						</div>
						<div className="px-6 py-4">
							<h2 className="mb-2 font-semibold">Filters</h2>
							<div className="py-2">
								<FormField fieldType="select" placeholder="Location" />
								<FormField fieldType="select" placeholder="Experience" />
								<FormField fieldType="select" placeholder="Job Type" />
							</div>
						</div>
						{upcomingSoon && (
							<div className="absolute left-0 top-0 z-[1] flex h-full w-full cursor-pointer items-center justify-center bg-[rgba(0,0,0,0.1)] p-6 backdrop-blur-md">
								<div className="rounded-normal bg-[rgba(0,0,0,0.5)] p-6 text-center text-white transition hover:scale-[1.05]">
									<h3 className="mb-1 text-lg font-extrabold">
										Job Filters
										<br />
										Coming Soon
									</h3>
									<p className="text-[12px]">We are working on this and it will ready for you soon.</p>
								</div>
							</div>
						)}
					</div>
					{jdata && (
						<div className="w-[calc(100%-300px)] pl-8">
							<div className="mb-6 rounded-normal bg-white shadow-normal dark:bg-gray-800">
								<div className="overflow-hidden rounded-t-normal">
									<HeaderBar handleBack={() => router.back()} />
								</div>
								<div className="px-8 py-4">
									<h3 className="mb-4 text-lg font-bold">
										{jdata["jobTitle"]} ({jdata["jobWorktype"]})
									</h3>
									<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
										{jdata["jobEmploymentType"] && <li className="mr-4">{jdata["jobEmploymentType"]}</li>}
										{jdata["jobCurrency"] && jdata["jobFromSalary"] && jdata["jobToSalary"] && (
											<li className="mr-4">
												{jdata["jobCurrency"]} {jdata["jobFromSalary"]} to {jdata["jobToSalary"]}
											</li>
										)}
										{jdata["jobVacancy"] && <li className="mr-4">Vacancy - {jdata["jobVacancy"]}</li>}
									</ul>
									{btndis ? (
										<>
											{/* <div className="flex flex-wrap">
												<p className="mr-4 text-[12px] text-darkGray dark:text-gray-400">
													Already Applied on 28 Jan 2023
												</p>
												<ul className="flex list-inside list-disc text-[12px] text-darkGray dark:text-gray-400">
													<li>In Review</li>
												</ul>
											</div> */}
											<Button
												btnStyle="sm"
												label={t("Btn.AlreadyApplied")}
												loader={false}
												btnType="button"
												// disabled={btndis}
											/>
										</>
									) : (
										<>
											<Button
												btnStyle="sm"
												label={t("Btn.ApplyHere")}
												loader={false}
												btnType="button"
												handleClick={() => {
													if (session) {
														setAddCand(true);
													} else {
														router.push(`/organization/${cname}/candidate/signin`);
													}
												}}
												disabled={btndis}
											/>
										</>
									)}

									<hr className="my-4" />
									<aside className="mb-4">
										<h3 className="mb-2 text-lg font-bold">{t("Words.DepartmentInformation")}</h3>
										<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
											{jdata["jobFunction"] && <li className="mr-4">{jdata["jobFunction"]} Functions</li>}
											{jdata["jobDepartment"] && <li className="mr-4">{jdata["jobDepartment"]} Department</li>}
											{jdata["jobIndustry"] && <li className="mr-4">{jdata["jobIndustry"]} Industry</li>}
											{jdata["jobGroupDivision"] && (
												<li className="mr-4">{jdata["jobGroupDivision"]} Group/Division</li>
											)}
										</ul>
									</aside>
									<hr className="my-4" />
									<aside className="mb-4">
										<h3 className="mb-2 text-lg font-bold">{t('Words.Department')} {t('Form.Description')}</h3>
										<article className="text-darkGray dark:text-gray-400 text-sm">
											{jdata["jobDeptDescription"] ? (
												<>
													<div dangerouslySetInnerHTML={{ __html: jdata["jobDeptDescription"] }}></div>
												</>
											) : (
												<>N/A</>
											)}
										</article>
									</aside>
									<hr className="my-4" />

									<aside className="mb-4">
										<h3 className="mb-2 text-lg font-bold">{t('Words.JobDescription')}</h3>
										<article className="text-darkGray dark:text-gray-400 jd_article text-sm">
											{jdata["jobDescription"] ? (
												<>
													<div dangerouslySetInnerHTML={{ __html: jdata["jobDescription"] }}></div>
												</>
											) : (
												<>N/A</>
											)}
										</article>
									</aside>

									<hr className="my-4" />
									<aside className="mb-4">
										<h3 className="mb-2 text-lg font-bold">{t("Words.Skills")}</h3>
										{jdata["jobSkill"] ? (
											<article className="text-[12px] text-darkGray dark:text-gray-400">
												<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
													{jdata["jobSkill"].split(",").map((item: any, i: any) => (
														<li className="mr-4 capitalize" key={i}>
															{item}
														</li>
													))}
												</ul>
											</article>
										) : (
											<p>N/A</p>
										)}
									</aside>
									<hr className="my-4" />
									<aside className="mb-4">
										<h3 className="mb-2 text-lg font-bold">{t("Words.EmploymentDetails")}</h3>
										<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
											{jdata["jobEmploymentType"] && <li className="mr-4">{jdata["jobEmploymentType"]}</li>}
											{jdata["jobQualification"] && <li className="mr-4">{jdata["jobQualification"]}</li>}
											{jdata["jobLocation"] && <li className="mr-4">{jdata["jobLocation"]}</li>}
											{jdata["jobExperience"] && <li className="mr-4">{jdata["jobExperience"]} of Experience</li>}
										</ul>
									</aside>
									<hr className="my-4" />
									<aside className="mb-4">
										<h3 className="mb-2 text-lg font-bold">{t("Words.Benefits")}</h3>
										<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
											{jdata["jobRelocation"] == "Yes" && <li className="mr-4">{t("Words.PaidRelocation")}</li>}
											{jdata["jobVisa"] == "Yes" && <li className="mr-4">{t("Words.VisaSponsorship")}</li>}
											{jdata["jobWorktype"] && <li className="mr-4">{jdata["jobWorktype"]} Working</li>}
										</ul>
									</aside>
								</div>
							</div>
							{/* <h3 className="mb-6 text-lg font-bold">Similar Jobs</h3>
							<div className="mx-[-7px] flex flex-wrap">
								{sklLoad
									? Array(4).fill(
											<div className="mb-[15px] w-full px-[7px] md:max-w-[50%]">
												<div className="h-full rounded-[10px] bg-white p-5 shadow-normal dark:bg-gray-800">
													<h4 className="mb-3 text-lg font-bold">Software Engineer</h4>
													<ul className="mb-3 flex flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
														<li className="mr-8">
															<i className="fa-solid fa-location-dot mr-2"></i>
															Remote
														</li>
														<li className="mr-8">
															<i className="fa-regular fa-clock mr-2"></i>
															Full Time
														</li>
														<li>
															<i className="fa-solid fa-dollar-sign mr-2"></i>
															50-55k
														</li>
													</ul>
													<div className="flex flex-wrap items-center justify-between">
														<div className="mr-4">
															<Button btnStyle="sm" label="View" loader={false} />
														</div>
														<p className="text-[12px] font-bold text-darkGray dark:text-gray-400">29 min ago</p>
													</div>
												</div>
											</div>
									  )
									: Array(4).fill(
											<div className="mb-[15px] w-full px-[7px] md:max-w-[50%]">
												<div className="h-full rounded-[10px] bg-white p-5 shadow-normal dark:bg-gray-800">
													<h4 className="mb-3 text-lg font-bold">
														<Skeleton width={160} />
													</h4>
													<ul className="mb-3 flex flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
														<li className="mr-8">
															<Skeleton width={40} />
														</li>
														<li className="mr-8">
															<Skeleton width={40} />
														</li>
														<li>
															<Skeleton width={40} />
														</li>
													</ul>
													<div className="flex flex-wrap items-center justify-between">
														<div className="mr-4">
															<Skeleton width={80} height={25} />
														</div>
														<p className="text-[12px] font-bold text-darkGray dark:text-gray-400">
															<Skeleton width={60} />
														</p>
													</div>
												</div>
											</div>
									  )}
							</div> */}
						</div>
					)}
				</div>
			</main>

			<Transition.Root show={addCand} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddCand}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-white text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">{t('Words.ApplyJob')}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddCand(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<form
										action=""
										method="post"
										onSubmit={(e) => {
											addApp(e);
										}}
									>
										<div className="p-8">
											{resume === null ? (
												<label
													htmlFor="uploadCV"
													className="mb-6 block cursor-pointer rounded-normal border p-6 text-center"
												>
													<h5 className="mb-2 text-darkGray">{t('Words.DragDropResumeHere')}</h5>
													<p className="mb-2 text-sm">
														Or <span className="font-semibold text-primary dark:text-white">{t('Words.ClickHereToUpload')}</span>
													</p>
													<p className="text-sm text-darkGray">Maximum File Size: 5 MB</p>
													<input type="file" className="hidden" id="uploadCV" onChange={handleFileInputChange} />
												</label>
											) : (
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
																	style={{ width: "99%" }}
																></span>
															</div>
														</div>
													</div>
												</div>
											)}

											<div className="mx-[-10px] flex flex-wrap">
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label={t('Form.FirstName')}
														value={fname}
														handleChange={(e) => setfname(e.target.value)}
														placeholder={t('Form.FirstName')}
														required
													/>
												</div>
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label={t('Form.LastName')}
														placeholder={t('Form.LastName')}
														value={lname}
														handleChange={(e) => setlname(e.target.value)}
														required
													/>
												</div>
											</div>
											{/* <div className="mx-[-10px] flex flex-wrap">
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="email"
														label="Email"
														placeholder="Email"
														value={email}
														handleChange={(e) => setemail(e.target.value)}
														required
													/>
												</div>
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="number"
														label="Phone Number"
														placeholder="Phone Number"
														value={phone}
														handleChange={(e) => setphone(e.target.value)}
													/>
												</div>
											</div> */}
											<div className="mb-4">
												<div className="mb-2 flex flex-wrap items-center justify-between">
													<label className="mb-1 inline-block font-bold">{t('Words.AddSocialLogins')}</label>
													<button
														type="button"
														className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
														onClick={() => setAddSocial(true)}
													>
														<i className="fa-regular fa-plus"></i>
													</button>
												</div>
												<div className="flex flex-wrap">
													{links &&
														links.map((data, i) => (
															<div className="relative mb-4 mr-6 p-1" key={i}>
																<Link href={data} target="_blank" className="text-center">
																	<span className="mx-auto mb-1 block h-8 w-8 rounded bg-white p-1 shadow-normal dark:bg-gray-500">
																		<i className={`fa-brand fa-link`}></i>
																	</span>
																	{/* <p className="text-[12px] font-bold capitalize">Link {i}</p> */}
																</Link>
																<button
																	type="button"
																	className="absolute right-[0px] top-[-5px] rounded-full text-center text-[12px] font-bold text-red-500 dark:text-white"
																	onClick={() => deleteLink(i)}
																>
																	<i className="fa-solid fa-circle-xmark"></i>
																</button>
															</div>
														))}
												</div>
											</div>
											<FormField
												fieldType="textarea"
												label={t('Words.Summary')}
												placeholder={t('Words.Summary')}
												value={summary}
												handleChange={(e) => setsummary(e.target.value)}
											/>
											<FormField
												options={ski}
												onSearch={searchSkill}
												fieldType="select2"
												id="skills"
												handleChange={setskill}
												label={t('Words.Skills')}
												required
											/>

											{/* exp */}
											<hr className="mb-4 mt-8" />
											<div className="relative mb-4">
												<label htmlFor="newGraduate" className="absolute right-12 top-0 text-sm font-bold">
													<input
														type="checkbox"
														id="newGraduate"
														name="newGraduate"
														className="mb-[3px] mr-2"
														checked={newgre}
														onChange={(e) => setnewgre(e.target.checked)}
													/>
													{t('Words.NewGraduate')}
												</label>
												<div className="mb-0">
													<label className="mb-1 inline-block font-bold">
														{t('Words.Experience')} <sup className="text-red-500">*</sup>
													</label>
													<div className="flex" style={{ display: newgre === true ? "none" : "flex" }}>
														<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor px-3 py-1">
															{expid &&
																expid.map((data, i) => (
																	<article className="border-b last:border-b-0" key={i} id={data}>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[90%]">
																				<input
																					type="text"
																					placeholder={t('Words.Title')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`title${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[10%] pl-4 text-right">
																				<button
																					type="button"
																					className="pr-4 text-red-500"
																					disabled={expid.length === 1}
																					onClick={() => {
																						setexpcount(expcount - 1);
																						const newExpid = expid.filter((id) => id !== data);
																						setexpid(newExpid);
																					}}
																				>
																					<i className="fa-solid fa-trash-can"></i>
																				</button>
																			</div>
																		</div>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[50%]">
																				<input
																					type="text"
																					placeholder={t('Form.CompanyName')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`cname${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[50%] pl-4">
																				<input
																					type="text"
																					placeholder={t('Words.JobType')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`jtype${data}`}
																				/>
																			</div>
																		</div>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[50%]">
																				<input
																					type="date"
																					placeholder={t('Form.StartDate')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`sdate${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[50%] pl-4">
																				<input
																					type="date"
																					placeholder={t('Form.EndDate')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`edate${data}`}
																				/>
																			</div>
																		</div>
																		<textarea
																			placeholder={t('Form.Description')}
																			className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																			id={`desc${data}`}
																		></textarea>
																	</article>
																))}
														</div>
														<div className="w-[40px] text-right">
															<button
																type="button"
																className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
																onClick={() => {
																	setexpid([...expid, `expBlock${expcount + 1}`]);
																	setexpcount(expcount + 1);
																}}
																disabled={newgre}
															>
																<i className="fa-regular fa-plus"></i>
															</button>
														</div>
													</div>
												</div>
											</div>

											{/* edu */}
											<hr className="mb-4 mt-8" />
											<div className="relative mb-4">
												<div className="mb-0">
													<label className="mb-1 inline-block font-bold">{t('Words.Education')}</label>
													<div className="flex">
														<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor px-3 py-1">
															{eduid &&
																eduid.map((data, i) => (
																	<article className="border-b last:border-b-0" key={i} id={data}>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[90%]">
																				<input
																					type="text"
																					placeholder={t('Words.Title')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`title${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[10%] pl-4 text-right">
																				<button
																					type="button"
																					className="pr-4 text-red-500"
																					// disabled={expid.length === 1}
																					onClick={() => {
																						seteducount(educount - 1);
																						const neweduid = eduid.filter((id) => id !== data);
																						seteduid(neweduid);
																					}}
																				>
																					<i className="fa-solid fa-trash-can"></i>
																				</button>
																			</div>
																		</div>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[33%]">
																				<input
																					type="text"
																					placeholder={t('Form.CollegeName')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`cname${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[33%] pl-4">
																				<input
																					type="date"
																					placeholder={t('Form.StartDate')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`sdate${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[33%] pl-4">
																				<input
																					type="date"
																					placeholder={t('Form.EndDate')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`edate${data}`}
																				/>
																			</div>
																		</div>
																		<textarea
																			placeholder={t('Form.Description')}
																			className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																			id={`desc${data}`}
																		></textarea>
																	</article>
																))}
														</div>
														<div className="w-[40px] text-right">
															<button
																type="button"
																className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
																onClick={() => {
																	seteduid([...eduid, `eduBlock${educount + 1}`]);
																	seteducount(educount + 1);
																}}
															>
																<i className="fa-regular fa-plus"></i>
															</button>
														</div>
													</div>
												</div>
											</div>

											{/* cer */}
											<hr className="mb-4 mt-8" />
											<div className="relative mb-4">
												<div className="mb-0">
													<label className="mb-1 inline-block font-bold">{t('Form.Certificate')}</label>
													<div className="flex">
														<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor px-3 py-1">
															{certid &&
																certid.map((data, i) => (
																	<article className="border-b last:border-b-0" key={i} id={data}>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[90%]">
																				<input
																					type="text"
																					placeholder={t('Words.Title')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`title${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[10%] pl-4 text-right">
																				<button
																					type="button"
																					className="pr-4 text-red-500"
																					// disabled={expid.length === 1}
																					onClick={() => {
																						setcertcount(certcount - 1);
																						const newcertid = certid.filter((id) => id !== data);
																						setcertid(newcertid);
																					}}
																				>
																					<i className="fa-solid fa-trash-can"></i>
																				</button>
																			</div>
																		</div>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[33%]">
																				<input
																					type="text"
																					placeholder={t('Form.CompanyIssuedName')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`cname${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[33%] pl-4">
																				<input
																					type="date"
																					placeholder={t('Form.StartDate')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`sdate${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[33%] pl-4">
																				<input
																					type="date"
																					placeholder={t('Form.EndDate')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`edate${data}`}
																				/>
																			</div>
																		</div>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[50%]">
																				<input
																					type="text"
																					placeholder={t('Form.CredentialsID')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`cid${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[50%] pl-4">
																				<input
																					type="text"
																					placeholder={t('Form.CredentialURL')}
																					className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																					id={`curl${data}`}
																				/>
																			</div>
																		</div>
																	</article>
																))}
														</div>
														<div className="w-[40px] text-right">
															<button
																type="button"
																className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
																onClick={() => {
																	setcertid([...certid, `certBlock${certcount + 1}`]);
																	setcertcount(certcount + 1);
																}}
															>
																<i className="fa-regular fa-plus"></i>
															</button>
														</div>
													</div>
												</div>
											</div>

											{/* edu */}
											{/* <hr className="mt-8 mb-4" />
											<div className="mb-4">
												<label className="mb-1 inline-block font-bold">Education</label>
												<div className="flex">
													<div className="min-h-[45px] w-[calc(100%-40px)]">
														{Array(2).fill(
															<article className="mb-2 border-b pb-2 last:border-b-0">
																<div className="flex flex-wrap items-center text-sm">
																	<div className="my-2 w-[30%]">
																		<input
																			type="text"
																			placeholder="Company Name"
																			className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																		/>
																	</div>
																	<div className="my-2 w-[60%] pl-4">
																		<input
																			type="text"
																			placeholder="2021 Sep - 2022 Nov"
																			className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																		/>
																	</div>
																	<div className="my-2 w-[10%] pl-4 text-right">
																		<button type="button" className="pr-4 text-red-500">
																			<i className="fa-solid fa-trash-can"></i>
																		</button>
																	</div>
																</div>
																<textarea
																	placeholder="Description"
																	className="h-[120px] w-full resize-none rounded-normal border border-borderColor text-sm"
																></textarea>
															</article>
														)}
													</div>
													<div className="w-[40px] text-right">
														<button
															type="button"
															className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
														>
															<i className="fa-regular fa-plus"></i>
														</button>
													</div>
												</div>
											</div>

											<div className="mb-4">
												<label className="mb-1 inline-block font-bold">Certifications</label>
												<div className="flex">
													<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor py-1 px-3">
														{Array(2).fill(
															<article className="border-b last:border-b-0">
																<div className="flex flex-wrap items-center text-sm">
																	<div className="my-2 w-[30%]">
																		<input
																			type="text"
																			placeholder="Company Name"
																			className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																		/>
																	</div>
																	<div className="my-2 w-[60%] pl-4">
																		<input
																			type="text"
																			placeholder="2021 Sep - 2022 Nov"
																			className="w-full rounded-normal border border-borderColor text-sm dark:border-gray-600 dark:bg-gray-700"
																		/>
																	</div>
																	<div className="my-2 w-[10%] pl-4 text-right">
																		<button type="button" className="pr-4 text-red-500">
																			<i className="fa-solid fa-trash-can"></i>
																		</button>
																	</div>
																</div>
																<textarea
																	placeholder="Description"
																	className="h-[120px] w-full resize-none rounded-normal border border-borderColor text-sm"
																></textarea>
															</article>
														)}
													</div>
													<div className="w-[40px] text-right">
														<button
															type="button"
															className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
														>
															<i className="fa-regular fa-plus"></i>
														</button>
													</div>
												</div>
											</div> */}

											<div className="mx-[-10px] flex flex-wrap">
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label={t('Form.CurrentSalary')}
														placeholder={t('Form.CurrentSalary')}
														value={csalary}
														handleChange={(e) => setcsalary(e.target.value)}
														disabled={newgre}
													/>
												</div>
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label={t('Form.ExpectedSalary')}
														placeholder={t('Form.ExpectedSalary')}
														value={esalary}
														handleChange={(e) => setesalary(e.target.value)}
													/>
												</div>
											</div>
											<div className="mx-[-10px] flex flex-wrap">
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="number"
														label={t('Form.PhoneNumber')}
														placeholder={t('Form.PhoneNumber')}
														value={phone}
														handleChange={(e) => setphone(e.target.value)}
													/>
												</div>
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label={t('Form.NoticePeriod')}
														placeholder={t('Form.NoticePeriod')}
														value={notice}
														handleChange={(e) => setnotice(e.target.value)}
														readOnly={newgre}
													/>
												</div>
											</div>
											<FormField
												fieldType="reactquill"
												label={srcLang==='ja'?'採用担当者へのメッセージ':'Any Message to Recruiter'}
												value={msg}
												handleChange={setmsg}
												handleOnBlur={setmsg}
											/>
											<Button label={t('Btn.Add')} loader={false} btnType={"submit"} />
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={addSocial} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddSocial}>
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
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">{t('Words.AddSocialLogins')}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddSocial(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{/* <FormField
                                            fieldType="select"
                                            inputType="text"
                                            label="Choose social media"
                                            singleSelect
                                            options={[
                                                { name: "Facebook" },
                                                { name: "Twitter" }
                                            ]}
                                        /> */}
										<FormField
											fieldType="input"
											inputType="text"
											label="Add URL"
											value={link}
											handleChange={(e) => setlink(e.target.value)}
										/>
										<div className="text-center">
											<Button label={t('Btn.Add')} btnType={"button"} disabled={!verifylink()} handleClick={addlink} />
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
export async function getServerSideProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	return {
		props: {
			...translations
		}
	};
}
CanCareerJobDetail.noAuth = true;
