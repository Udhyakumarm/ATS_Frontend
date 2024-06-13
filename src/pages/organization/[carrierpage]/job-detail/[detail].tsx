//@collapse
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import HeaderBar from "@/components/HeaderBar";
import Link from "next/link";
import {
	addExternalNotifyLog,
	axiosInstance,
	axiosInstance2,
	axiosInstanceAuth,
	axiosInstanceOCR
} from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";
import { debounce } from "lodash";
import { axiosInstance as axis } from "@/utils";
import moment from "moment";
import { useCarrierStore, useNotificationStore } from "@/utils/code";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getProviders, useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
import { EmailShareButton, FacebookShareButton, LinkedinShareButton } from "react-share";
import TwitterShareButton from "react-share/lib/TwitterShareButton";
import TelegramShareButton from "react-share/lib/TelegramShareButton";
import CandFooter from "@/components/candidate/footer";
import toastcomp2 from "@/components/toast2";
import Confetti from "react-confetti";

export default function CanCareerJobDetail(props) {
	const [windowSize, setWindowSize] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0
	});

	// useEffect to update window size when it changes
	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		// Add event listener for window resize
		window.addEventListener("resize", handleResize);

		// Initial cleanup function to remove the event listener
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const [showConfetti, setShowConfetti] = useState(false);

	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [sklLoad] = useState(true);
	const { data: session } = useSession();
	const router = useRouter();
	const { detail } = router.query;
	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const setcname = useCarrierStore((state: { setcname: any }) => state.setcname);
	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const setcid = useCarrierStore((state: { setcid: any }) => state.setcid);
	const orgdetail = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);
	const setorgdetail = useCarrierStore((state: { setorgdetail: any }) => state.setorgdetail);
	const jid = useCarrierStore((state: { jid: any }) => state.jid);
	const setjid = useCarrierStore((state: { setjid: any }) => state.setjid);

	const [jdata, setjdata] = useState({});
	const [step, setstep] = useState(0);

	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	const [token, settoken] = useState("");
	const [btndis, setbtndis] = useState(false);
	const [mainShareJob, mainShareJobOpen] = useState(false);

	const { carrierpage } = router.query;
	const [load, setload] = useState(false);

	async function loadOrgDetail(carrierID: any) {
		await axiosInstance
			.get(`/organization/get/organizationprofile/carrier/${carrierID}/`)
			.then((res) => {
				setorgdetail(res.data);
				// console.log("@", res.data);
			})
			.catch((err) => {
				// console.log(err);
				setorgdetail({});
			});
	}

	async function getcid(cname: any) {
		await axiosInstance.get(`/organization/get/organizationprofilecid/carrier/${cname}/`).then((res) => {
			// console.log(res.data);
			// console.log(res.data["OrgProfile"]);
			// console.log(res.data["OrgProfile"][0]["unique_id"]);
			setcid(res.data["OrgProfile"][0]["unique_id"]);
			loadOrgDetail(res.data["OrgProfile"][0]["unique_id"]);
			setload(true);
		});
	}

	useEffect(() => {
		if (carrierpage && carrierpage.length > 0 && !load) {
			setcname(carrierpage);
			setcid("");
			getcid(carrierpage);
		}
	}, [cname, carrierpage, load]);

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
			.get(`/applicant/career-applicant/check/${detail}/`)
			.then(async (res) => {
				// console.log("!", res.data);
				if (res.data["Message"] == 1) {
					setbtndis(true);
				} else {
					setbtndis(false);
				}
			})
			.catch((err) => {
				// console.log(err);
			});
	}

	useEffect(() => {
		if (token && token.length > 0 && detail && detail.length > 0) {
			checkApplicant();
		}
	}, [token, detail]);

	useEffect(() => {
		setjid(detail);
		loadJobDetail(detail);
	}, [detail]);

	//add
	const cancelButtonRef = useRef(null);
	const [addCand, setAddCand] = useState(false);
	const [addSocial, setAddSocial] = useState(false);
	const [sadApply, setsadApply] = useState(false);
	const [ocrLoader, setocrLoader] = useState(false);
	const [noAuth, setnoAuth] = useState(false);
	const [resume, setresume] = useState<File | null>(null);
	const [fname, setfname] = useState("");
	const [lname, setlname] = useState("");
	const [email, setemail] = useState("");
	const [summary, setsummary] = useState("");
	const [version, setversion] = useState("");
	const [step1Data, setstep1Data] = useState({});

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

	async function loadJobDetail(refid: any) {
		await axiosInstance2
			.get(`/job/detail-job/${refid}/`)
			.then((res) => {
				// toastcomp("job load", "success");
				setjdata(res.data[0]);
			})
			.catch((err) => {
				// console.log("@", err);
			});
	}

	async function step1(refid: any, fd: any) {
		setocrLoader(true);
		await axiosInstanceOCR
			.post(`/applicant/step-1/${refid}/`, fd)
			.then(async (res) => {
				toastcomp("step 1", "success");
				const dataObj = res.data;
				// console.log("!!!", "step1", dataObj);
				// console.log("!!!", "step1", dataObj["Email"]);

				if (res.data.version === "enterprise") {
					if (res.data.Qualified === "Perfect") {
						// setocrLoader(false);
						// setstep(1);

						//rating is 40% required
						let rating = res.data["Percentage"];
						let frating = res.data["rating"];

						if (frating && frating != undefined) {
							if (typeof frating === "string") {
								frating = parseInt(frating);
							}
						} else {
							frating = 40;
						}

						if (rating && rating != undefined) {
							if (typeof rating === "string") {
								rating = parseInt(rating);
							}
						} else {
							setAddCand(false);
							setocrLoader(false);
							setsadApply(true);
							return false;
						}

						if (rating > frating) {
							if (noAuth) {
								//no auth
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
								) {
									//all data
									//direct apply
									toastcomp("step 2", "success");
									applyApplicantForNoAuth(refid, data);
								} else {
									//some data missing
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
							} else {
								const data = res.data;
								if (data["Summary"] && data["Summary"].length > 0) {
									setsummary(data["Summary"]);
								}
								if (data["version"] && data["version"].length > 0) {
									setversion(data["version"]);
								}
								setstep1Data(data);
								applyApplicantForAuth(data);
							}
						} else {
							setAddCand(false);
							setocrLoader(false);
							setsadApply(true);
							return false;
						}
					} else if (res.data.Qualified === "Under Qualified") {
						setstep1Data(dataObj);
						setAddCand(false);
						setocrLoader(false);
						toastcomp(res.data.Qualified, "error");
						setsadApply(true);
						return false;
					} else if (res.data.Qualified === "Over Qualified") {
						setstep1Data(dataObj);
						setAddCand(false);
						setocrLoader(false);
						toastcomp(res.data.Qualified, "error");
						setsadApply(true);
						return false;
					}
				} else {
					//other version

					// setocrLoader(false);
					// setstep(1);
					if (noAuth) {
						//no auth
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
						) {
							//all data
							//direct apply
							toastcomp("step 2", "success");
							applyApplicantForNoAuth(refid, data);
						} else {
							//some data missing
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
					} else {
						const data = res.data;
						if (data["Summary"] && data["Summary"].length > 0) {
							setsummary(data["Summary"]);
						}
						if (data["version"] && data["version"].length > 0) {
							setversion(data["version"]);
						}
						setstep1Data(data);
						applyApplicantForAuth(data);
					}
				}
			})
			.catch((err) => {
				toastcomp("step 1", "error");
				// console.log("!!!", "step1 errr", err);
				resetState();
			});
	}

	async function applyApplicantForNoAuth(refid: any, data: any) {
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

		await axiosInstance2
			.post(`/applicant/carrer-apply/${refid}/`, fd)
			.then((res) => {
				// console.log("!!!", "apply noauth", res.data);
				if (res.data.success === 1) {
					toastcomp("Applied Successfully", "success");
					setShowConfetti(true);
				} else if (res.data.success === 2) {
					toastcomp("Email Account Already Exist", "error");
				} else {
					setbtndis(true);
					toastcomp("Already Applied", "error");
				}
				resetState();
				setocrLoader(false);
				setAddCand(false);
			})
			.catch((err) => {
				toastcomp("step 1", "error");
				// console.log("!!!", "apply noauth err", err);
				resetState();
				setocrLoader(false);
				setAddCand(false);
			});
	}

	async function applyApplicantForNoAuthMD() {
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

		await axiosInstance2
			.post(`/applicant/carrer-apply/${detail}/`, fd)
			.then((res) => {
				// console.log("!!!", "apply noauth md", res.data);
				if (res.data.success === 1) {
					toastcomp("Applied Successfully", "success");
					setShowConfetti(true);
				} else {
					setbtndis(true);
					toastcomp("Already Applied", "error");
				}
				resetState();
				setocrLoader(false);
				setAddCand(false);
			})
			.catch((err) => {
				toastcomp("step 1", "error");
				// console.log("!!!", "apply noauth err", err);
				resetState();
				setocrLoader(false);
				setAddCand(false);
			});
	}

	async function applyApplicantForAuth(data: any) {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		toastcomp("step Auth", "success");
		setocrLoader(true);
		const fd = new FormData();

		if (fname && fname.length > 0) {
			fd.append("fname", fname);
		} else if (data["First Name"] && data["First Name"].length > 0) {
			fd.append("fname", data["First Name"]);
		}

		if (lname && lname.length > 0) {
			fd.append("lname", lname);
		} else if (data["Last Name"] && data["Last Name"].length > 0) {
			fd.append("lname", data["Last Name"]);
		}

		if (summary && summary.length > 0) {
			fd.append("summary", summary);
		} else if (data["Summary"] && data["Summary"].length > 0) {
			fd.append("summary", data["Summary"]);
		}

		if (data["rtext"] && data["rtext"].length > 0) {
			fd.append("rtext", data["rtext"]);
		}

		if (data["Percentage"]) {
			fd.append("percent", data["Percentage"]);
		}
		fd.append("resume", resume);

		await axiosInstanceAuth2
			.post(`/applicant/carrer-apply/${detail}/`, fd)
			.then((res) => {
				// console.log("!!!", "apply noauth md", res.data);
				if (res.data.success === 1) {
					toastcomp("Applied Successfully", "success");
					setShowConfetti(true);
					router.push(`/organization/${cname}/dashboard`);
				} else {
					setbtndis(true);
					toastcomp("Already Applied", "error");
				}
				resetState();
				setocrLoader(false);
				setAddCand(false);
			})
			.catch((err) => {
				toastcomp("step 1", "error");
				// console.log("!!!", "apply noauth err", err);
				resetState();
				setocrLoader(false);
				setAddCand(false);
			});
	}

	useEffect(() => {
		if (resume != null && jdata["refid"].length > 0) {
			// console.log("$", "Step1", "Resume Changed Useeffect...");
			const fd = new FormData();
			fd.append("resume", resume);
			step1(jdata["refid"], fd);
		}
	}, [resume]);

	async function loadSettings() {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		await axiosInstanceAuth2
			.get(`/candidate/get-candidate-settings/`)
			.then(async (res) => {
				// console.log("&", "Settings", res.data);
				setfname(res.data[0]["first_name"]);
				setlname(res.data[0]["last_name"]);
			})
			.catch((err) => {
				// console.log("&", "Settings", err);
			});
	}

	return (
		<>
			<Head>
				<title>{props.title}</title>
				<meta property="og:title" content={props.ogtitle} />
				<meta property="og:description" content={props.ogdescription} />
				<meta property="og:image" content={props.ogimage} />
				<meta property="og:url" content={props.ogurl} />

				<meta property="twitter:site" content={props.tsite} />
				<meta property="twitter:card" content={props.tcard} />
				<meta property="twitter:title" content={props.ttitle} />
				<meta property="twitter:description" content={props.tdesc} />
				<meta property="twitter:image:src" content={props.timg} />

				<meta itemprop="image" content={props.ogimage} />
				<meta itemprop="url" content={props.ogtitle} />
			</Head>
			<main className="py-8">
				<div className="container flex flex-wrap">
					{/* temp hide naman */}
					{/* <div className="sticky top-0 h-[calc(100vh-120px)] w-[300px] rounded-normal border border-slate-300 bg-white shadow-normal dark:bg-gray-800">
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
						{props.upcomingSoon && (
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
					</div> */}
					<div className="text-center">
						{process.env.NODE_ENV != "production" && (
							<Button
								btnStyle={"sm"}
								btnType="button"
								handleClick={() => setShowConfetti(true)}
								disabled={showConfetti}
								label={"Test Confetti"}
							/>
						)}
						{showConfetti && (
							<Confetti
								recycle={false}
								width={windowSize.width}
								height={windowSize.height}
								onConfettiComplete={(confetti: Confetti) => setShowConfetti(false)}
							/>
						)}
					</div>
					{jdata && (
						// temp hide naman
						// <div className="w-[calc(100%-300px)] pl-8">
						<div className="w-[calc(100%)]">
							<div className="mb-6 rounded-normal bg-white shadow-normal dark:bg-gray-800">
								<div className="flex justify-between overflow-hidden rounded-t-normal">
									<HeaderBar handleBack={() => router.back()} />
									<button
										type="button"
										className="mr-6 flex items-center text-sm text-gray-400"
										onClick={() => mainShareJobOpen(true)}
									>
										<span className="mr-2">{srcLang === "ja" ? "シェアジョブ" : "Share job"}</span>
										<i className="fa-solid fa-share"></i>
									</button>
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
											<Button
												btnStyle="sm"
												label={t("Btn.AlreadyApplied")}
												loader={false}
												btnType="button"
												disabled={btndis}
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
													setnoAuth(false);
													// setnoAuthCount(0);
													if (session) {
														setnoAuth(false);
														loadSettings();
														setAddCand(true);
														// setnoAuthCount(0);
													} else {
														setnoAuth(true);
														// setnoAuthCount(1);
														setAddCand(true);
														// router.push(`/organization/${cname}/candidate/signin`);
													}
												}}
												disabled={btndis}
											/>
										</>
									)}
									<br />
									<small className="text-secondary opacity-75">
										{srcLang === "ja"
											? "注：ダッシュボードでは、任意の文書をアップロードすることができます。"
											: "Note: Optional documents can be uploaded in the dashboard."}
									</small>

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
										<h3 className="mb-2 text-lg font-bold">
											{t("Words.Department")} {t("Form.Description")}
										</h3>
										<article className="text-sm text-darkGray dark:text-gray-400">
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
										<h3 className="mb-2 text-lg font-bold">{t("Words.JobDescription")}</h3>
										<article className="jd_article text-sm text-darkGray dark:text-gray-400">
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
						</div>
					)}
				</div>
			</main>
			<CandFooter />

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
										<h4 className="font-semibold leading-none">{t("Words.ApplyJob")}</h4>
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
												<h5 className="mb-2 text-darkGray">{t("Words.DragDropResumeHere")}</h5>
												<p className="mb-2 text-sm">
													Or{" "}
													<span className="font-semibold text-primary dark:text-white">
														{t("Words.ClickHereToUpload")}
													</span>
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

												{noAuth && (
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
												)}

												<div className="mx-[-10px] flex flex-wrap">
													<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
														<FormField
															fieldType="input"
															inputType="text"
															label={t("Form.FirstName")}
															value={fname}
															handleChange={(e) => setfname(e.target.value)}
															placeholder={t("Form.FirstName")}
															required
															readOnly={!noAuth}
														/>
													</div>
													<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
														<FormField
															fieldType="input"
															inputType="text"
															label={t("Form.LastName")}
															placeholder={t("Form.LastName")}
															value={lname}
															handleChange={(e) => setlname(e.target.value)}
															required
															readOnly={!noAuth}
														/>
													</div>
												</div>

												<FormField
													fieldType="textarea"
													label={t("Words.Summary")}
													placeholder={t("Words.Summary")}
													value={summary}
													handleChange={(e) => setsummary(e.target.value)}
												/>

												<Button
													label={"Apply"}
													loader={false}
													btnType={"button"}
													disabled={!disBtnApply()}
													handleClick={noAuth && applyApplicantForNoAuthMD}
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

			<Transition.Root show={sadApply} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setsadApply}>
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
									<div className="p-8">
										<div className="flex flex-col items-center justify-center gap-2 text-[50px] font-thin">
											<i className="fa-regular fa-face-frown"></i>
											{step1Data && step1Data["Qualified"] && step1Data["Qualified"].length > 0 && (
												<h3 className="text-center text-lg font-bold">{step1Data["Qualified"]}</h3>
											)}
											<span className="text-center text-base font-semibold">
												Thank you for submitting your application. Regrettably, your resume does not meet this
												job&apos;s requirements. We encourage you to consider applying for other positions that align
												more closely with your skills.{" "}
												{/* {rdata != null && rdata.Qualified != null && <>Your Resume is {rdata.Qualified}</>} */}
											</span>
										</div>
										<div className="text-center">
											<Button label={"Try Again"} btnType={"button"} handleClick={() => setsadApply(false)} />
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={mainShareJob} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={mainShareJobOpen}>
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
											onClick={() => mainShareJobOpen(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<ul className="flex flex-wrap items-center justify-center text-center text-xl text-[#6D27F9] dark:text-[#fff]">
											<li className="mb-2 w-[33.33%] px-[10px]">
												<LinkedinShareButton
													url={`https://ats.somhako.com/organization/${cname}/job-detail/${detail}`}
													title="LOREM"
													summary="LOREM2"
													source="LOREM333"
												>
													<i className="fa-brands fa-linkedin-in hover:text-black"></i>
												</LinkedinShareButton>
											</li>
											<li className="mb-2 w-[33.33%] px-[10px]">
												<TwitterShareButton url={`https://ats.somhako.com/organization/${cname}/job-detail/${detail}`}>
													<i className="fa-brands fa-twitter hover:text-black"></i>
												</TwitterShareButton>
												{/* <button type="button" className="hover:text-black">
											<i className="fa-brands fa-twitter"></i>
										</button> */}
											</li>
											<li className="mb-2 w-[33.33%] px-[10px]">
												<FacebookShareButton
													url={`https://ats.somhako.com/organization/${cname}/job-detail/${detail}`}
													hashtag={jdata.jobSkill}
												>
													<i className="fa-brands fa-facebook-f hover:text-black"></i>
												</FacebookShareButton>
												{/* <button type="button" className="hover:text-black">
											<i className="fa-brands fa-facebook-f"></i>
										</button> */}
											</li>
											<li className="mb-2 w-[33.33%] px-[10px]">
												<EmailShareButton
													subject={jdata.jobTitle}
													url={`https://ats.somhako.com/organization/${cname}/job-detail/${detail}`}
												>
													<i className="fa-solid fa-envelope hover:text-black"></i>
												</EmailShareButton>
												{/* <button type="button" className="hover:text-black">
											<i className="fa-brands fa-telegram"></i>
										</button> */}
											</li>
											<li className="mb-2 w-[33.33%] px-[10px]">
												<button
													type="button"
													className="hover:text-black"
													onClick={(e) => {
														navigator.clipboard
															.writeText(`https://ats.somhako.com/organization/${cname}/job-detail/${detail}`)
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	// console.log("#", context.query);
	const { carrierpage } = context.query;
	const { detail } = context.query;
	var ftitle = "";
	var otitle = "";
	var oimg = "";
	var odescription = "";
	var ourl = "https://ats.somhako.com/organization/" + carrierpage + "/job-detail/" + detail;
	var tsite = "https://ats.somhako.com/organization/" + carrierpage + "/job-detail/" + detail;
	var tcard = "photo";
	var ttitle = "";
	var tdesc = "";
	var timg = "";
	const translations = await serverSideTranslations(context.locale, ["common"]);
	await axiosInstance
		.get(`/job/detail-job/${detail}/`)
		.then(async (res) => {
			// // console.log(res.data)
			var arr = res.data;
			ftitle = arr[0]["jobTitle"];
			otitle = arr[0]["jobTitle"];
			odescription = arr[0]["jobLocation"];
			tdesc = arr[0]["jobLocation"];

			// "https://somhako-marketplace.s3.ap-northeast-1.amazonaws.com/media/linkedin-somhako-xs.jpg"
			ttitle = arr[0]["jobTitle"];

			// "https://somhako-marketplace.s3.ap-northeast-1.amazonaws.com/media/linkedin-somhako-xs.jpg"

			await axiosInstance.get(`/organization/get/organizationprofilecid/carrier/${carrierpage}/`).then(async (res) => {
				await axiosInstance
					.get(`/organization/get/organizationprofile/carrier/${res.data["OrgProfile"][0]["unique_id"]}/`)
					.then((res2) => {
						oimg =
							process.env.NODE_ENV === "production"
								? process.env.NEXT_PUBLIC_PROD_BACKEND + res2.data["OrgProfile"][0]["logo"]
								: process.env.NEXT_PUBLIC_DEV_BACKEND + res2.data["OrgProfile"][0]["logo"];
						timg =
							process.env.NODE_ENV === "production"
								? process.env.NEXT_PUBLIC_PROD_BACKEND + res2.data["OrgProfile"][0]["logo"]
								: process.env.NEXT_PUBLIC_DEV_BACKEND + res2.data["OrgProfile"][0]["logo"];
					});
			});
		})
		.catch((err) => {
			// console.log("err");
		});

	return {
		props: {
			...translations,
			title: ftitle,
			ogtitle: otitle,
			ogdescription: odescription,
			ogimage: oimg,
			ogurl: ourl,
			tsite: tsite,
			tcard: tcard,
			ttitle: ttitle,
			tdesc: tdesc,
			timg: timg
		}
	};
};

CanCareerJobDetail.noAuth = true;
CanCareerJobDetail.mobileEnabled = true;
