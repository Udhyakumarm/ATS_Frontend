import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useEffect, Fragment, useRef, useState, Key, useMemo } from "react";
import { useApplicantStore, useCalStore } from "@/utils/code";
import Button from "@/components/Button";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import Image from "next/image";
import FormField from "@/components/FormField";
import TeamMembers from "@/components/TeamMembers";
import Canban from "@/components/organization/applicant/Canban";
import noApplicantdata from "/public/images/no-data/iconGroup-2.png";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { useNewNovusStore, useNovusStore } from "@/utils/novus";
import TImeSlot from "@/components/TimeSlot";
import { debounce } from "lodash";
import toastcomp from "@/components/toast";
import OrgRSideBar from "@/components/organization/RSideBar";
import moment from "moment";
import Button2 from "@/components/Button2";
import GradientButton from "@/components/Button2";

const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timer on each value change (cleanup function)
		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
};

export default function Index({ atsVersion, userRole, upcomingSoon, currentUser }: any) {
	useEffect(() => {
		if (currentUser.is_expired) {
			router.push("/organization/settings/pricing");
		}
	}, [currentUser]);
	const router = useRouter();

	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);

	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [refresh, setrefresh] = useState(0);

	const cancelButtonRef = useRef(null);

	const visible = useNewNovusStore((state: { visible: any }) => state.visible);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	const [fresumeList, setfresumeList] = useState({});

	async function loadResumes() {
		await axiosInstanceAuth2
			.get(`/applicant/list-db/`)
			.then(async (res) => {
				console.log("data", "applicant list", res.data);
				setfresumeList(res.data);
				setrefresh(2);
			})
			.catch((err) => {
				console.log("Error fetching data:", err);
				setfresumeList({});
				setrefresh(2);
			});
	}

	async function loadResumes2(link: any) {
		await axiosInstanceAuth2
			.get(link)
			.then(async (res) => {
				console.log("data", "applicant list", res.data);
				setfresumeList(res.data);
				setrefresh(2);
			})
			.catch((err) => {
				console.log("Error fetching data:", err);
				setfresumeList({});
				setrefresh(2);
			});
	}

	function getLink() {
		let link = "/applicant/list-db/";

		link = link + `?query1=${debouncedSearchTerm}`;

		link = link.replaceAll("null", "");

		console.log("data2", "LINK", link);
		return link;
	}

	async function loadResumes3() {
		let link = getLink();

		await axiosInstanceAuth2
			.get(link)
			.then(async (res) => {
				console.log("data", "applicant list", res.data);
				setfresumeList(res.data);
				setrefresh(2);
			})
			.catch((err) => {
				console.log("Error fetching data:", err);
				setfresumeList({});
				setrefresh(2);
			});
	}

	useEffect(() => {
		if (token && token.length > 0 && refresh === 0 && atsVersion && atsVersion.length > 0) {
			loadResumes();
		}
	}, [token, refresh, atsVersion]);

	const [search, setsearch] = useState("");
	const debouncedSearchTerm = useDebounce(search, 500);

	useEffect(() => {
		console.log("debouncedSearchTerm", debouncedSearchTerm);
		loadResumes3();
	}, [debouncedSearchTerm]);

	const handleInputChange = (event: any) => {
		const { value } = event.target;
		setsearch(value);
	};

	const getColorCode = (number) => {
		// Function to convert an RGB array to a hex color code
		const rgbToHex = (rgb) =>
			"#" + rgb.map((value) => Math.min(255, Math.max(0, value)).toString(16).padStart(2, "0")).join("");

		let colorVariant = [255, 0, 0]; // Default red color

		if (number > 70) {
			const greenValue = Math.round((number - 70) * 5.1); // Map 70-100 to 0-255
			colorVariant = [255 - greenValue, 255, 0]; // Bright green variant
		} else if (number > 50) {
			const yellowValue = Math.round((number - 50) * 5.1); // Map 50-70 to 0-255
			colorVariant = [255, 255 - yellowValue, 0]; // Yellow variant
		} else {
			// const redValue = Math.round((75 - number) * 5.1); // Map 0-50 to 0-255
			const redValue = Math.round((number - 0) * 5.1); // Map 0-40 to 0-255
			colorVariant = [255, 255 - redValue, 0]; // Yellow variant
		}

		// Convert the RGB array to a hex color code
		const hexColor = rgbToHex(colorVariant);
		if (atsVersion === "starter") {
			return "transpert";
		} else {
			return hexColor;
		}
	};

	//share
	const [sc, setsc] = useState([]);

	const handleCheckboxChange = (event: any, trefid: any) => {
		event.stopPropagation();
		if (event.target.checked === true) {
			if (!sc.includes(trefid)) {
				setsc([...sc, trefid]);
			}
		} else {
			if (sc.includes(trefid)) {
				const updatedValues = sc.filter((value) => value !== trefid);
				setsc(updatedValues);
			}
		}
	};
	const [sc2, setsc2] = useState([]);

	const handleCheckboxChange2 = (event: any, refid: any) => {
		event.stopPropagation();
		if (event.target.checked === true) {
			if (!sc2.includes(refid)) {
				setsc2([...sc2, refid]);
			}
		} else {
			if (sc2.includes(refid)) {
				const updatedValues = sc2.filter((value) => value !== refid);
				setsc2(updatedValues);
			}
		}
	};

	function disShareButton() {
		return sc.length > 0 && sc2.length > 0;
	}

	const [shareJob, setshareJob] = useState(false);
	const [publishThanks, setPublishThanks] = useState(false);
	const [fcontracts, setfcontracts] = useState([]);

	async function loadJobs() {
		await axiosInstanceAuth2
			.get("/job/list-job")
			.then(async (res) => {
				let arr = [];
				res.data.map((job: any) => job.jobStatus === "Active" && arr.push(job));
				setfcontracts(arr);
				console.log("&", "jobs", arr);
			})
			.catch((err) => {
				console.log("!", err);
				setfcontracts();
			});
	}

	useEffect(() => {
		if (shareJob) {
			loadJobs();
		}
	}, [shareJob]);

	async function uploadResumeFinalStep(trefid: any, refid: any) {
		const fd = new FormData();
		fd.append("jid", refid);
		fd.append("trefid", trefid);
		await axiosInstanceAuth2
			.post(`/applicant/pipeline-applicant-apply/`, fd)
			.then(async (res) => {
				console.log("!-", res.data);
				if (res.data.success === 1) {
					toastcomp("Applicant added", "sucess");
				} else {
					toastcomp("Applicant not added", "error");
				}
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("Applicant not added", "error");
			});
	}

	async function shareAppToCon() {
		setocrLoader2(true);
		let requests = [];
		for (let i = 0; i < sc2.length; i++) {
			//job

			for (let j = 0; j < sc.length; j++) {
				//resume
				const fd = new FormData();
				fd.append("jid", sc2[i]);
				fd.append("trefid", sc[j]);
				const abc = axiosInstanceAuth2.post(`/applicant/pipeline-applicant-apply/`, fd);
				requests.push(abc);
			}
		}

		Promise.all(requests)
			.then((responses) => {
				console.log("responses", "@@@", responses);
				let success = 0;
				let error = 0;

				setocrLoader2(false);
				// Responses from all requests
				for (let i = 0; i < responses.length; i++) {
					if (responses[i].data.success === 1) {
						success = success + 1;
					} else {
						error = error + 1;
					}
				}

				if (success != 0) {
					toastcomp(`${success} Applicants added`, "sucess");
				}

				if (error != 0) {
					toastcomp(`${error} Applicants already exists`, "sucess");
				}

				setsc([]);
				setsc2([]);
				setshareJob(false);

				// const [response1, response2, response3] = responses;
				// console.log("Response 1:", response1.data);
				// console.log("Response 2:", response2.data);
				// console.log("Response 3:", response3.data);
			})
			.catch((error) => {
				console.error("Error fetching data:", "@@@", error);
				toastcomp("Applicant not added fun collapsed", "error");
				setocrLoader2(false);
				setsc([]);
				setsc2([]);
				setshareJob(false);
			});
	}

	// add resume

	const [addCand, setAddCand] = useState(false);
	const [ocrLoader, setocrLoader] = useState(false);
	const [ocrLoader2, setocrLoader2] = useState(false);
	const [noAuth, setnoAuth] = useState(false);
	const [resume, setresume] = useState<File | null>(null);
	const [fname, setfname] = useState("");
	const [lname, setlname] = useState("");
	const [email, setemail] = useState("");
	const [step1Data, setstep1Data] = useState({});
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
		setstep1Data({});

		setsearch("");
		loadResumes();
		setsc([]);
		setsc2([]);
	}

	function disBtnApply() {
		return (
			fname.length > 0 &&
			lname.length > 0 &&
			email.length > 0 &&
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

			setstep1Data({});
			setocrLoader(false);
		}
	}, [addCand]);

	useEffect(() => {
		if (resume != null) {
			console.log("$", "Step1", "Resume Changed Useeffect...");
			const fd = new FormData();
			fd.append("resume", resume);
			addResumeStep1(fd);
		}
	}, [resume]);

	async function addResumeStep1(fd: any) {
		setocrLoader(true);
		await axiosInstanceAuth2
			.post(`/applicant/get-emailname/`, fd)
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
					data["rtext"] &&
					data["rtext"].length > 0
				) {
					//all data
					//direct apply
					toastcomp("step 2", "success");
					uploadResumeStep2_1(data);
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

	async function uploadResumeStep2_1(data: any) {
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
			fd.append("r_text", data["rtext"]);
		}
		fd.append("resume", resume);

		await axiosInstanceAuth2
			.post(`/applicant/create-db/`, fd)
			.then((res) => {
				if (res.data.success === 1) {
					toastcomp("Resume Added Successfully", "success");
				} else {
					toastcomp("The resume already exists in the Database.", "error");
				}
				resetState();
				setocrLoader(false);
				setAddCand(false);
			})
			.catch((err) => {
				toastcomp("resume add fun1 error", "error");
				console.log("!!!", "resume add fun1 error", err);
				resetState();
				setocrLoader(false);
				setAddCand(false);
			});
	}

	async function uploadResumeStep2_2() {
		toastcomp("step 3", "success");
		setocrLoader(true);
		const fd = new FormData();
		fd.append("email", email);
		fd.append("fname", fname);
		fd.append("lname", lname);

		if (step1Data["rtext"] && step1Data["rtext"].length > 0) {
			fd.append("r_text", step1Data["rtext"]);
		}

		fd.append("resume", resume);

		await axiosInstanceAuth2
			.post(`/applicant/create-db/`, fd)
			.then((res) => {
				console.log("!!!", "apply noauth md", res.data);
				if (res.data.success === 1) {
					toastcomp("Resume Added Successfully", "success");
				} else {
					toastcomp("The resume already exists in the Database.", "error");
				}
				resetState();
				setocrLoader(false);
				setAddCand(false);
			})
			.catch((err) => {
				toastcomp("resume add fun2 error", "error");
				console.log("!!!", "apply noauth err", err);
				resetState();
				setocrLoader(false);
				setAddCand(false);
			});
	}

	return (
		<>
			<Head>
				<title>Pipeline DB</title>
			</Head>
			{currentUser && !currentUser.is_expired && (
				<main>
					<Orgsidebar />
					<Orgtopbar />
					{token && token.length > 0 && (
						<OrgRSideBar axiosInstanceAuth2={axiosInstanceAuth2} setrefresh={setrefresh} refresh={refresh} />
					)}
					<div
						id="overlay"
						className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
					></div>
					{/* <button className={`layoutWrap p-4`} onClick={() => setrefresh(0)}>
					Refresh
				</button> */}

					{refresh != 2 ? (
						<div className={`layoutWrap p-4` + " " + (visible && "mr-[calc(27.6%+1rem)]")}>
							<div className="flex min-h-[calc(100vh-130px)] items-center justify-center rounded-normal bg-white shadow-normal dark:bg-gray-800">
								<div className="mx-auto w-full max-w-[400px] py-8 text-center">
									<div className="mb-6 p-2">
										<Image
											src={noApplicantdata}
											alt="No Data"
											width={300}
											className="mx-auto max-h-[200px] w-auto max-w-[200px]"
										/>
									</div>
									<h5 className="mb-4 text-lg font-semibold">There are no resumes in the pipeline.</h5>
									<p className="mb-2 text-sm text-darkGray">
										{srcLang === "ja" ? (
											<>現在応募者はいません。新しい求人を投稿して応募者を獲得してください</>
										) : (
											<>
												Currently, there are no resumes on file. Please upload a new resume to be included in the
												pipeline.
											</>
										)}
									</p>
								</div>
							</div>
						</div>
					) : (
						<>
							<div className={`layoutWrap p-4` + " " + (visible && "mr-[calc(27.6%+1rem)]")}>
								{refresh === 2 && (
									<>
										<div className="relative z-[2] flex flex-wrap items-center justify-between bg-white px-4 py-4 shadow-normal dark:bg-gray-800 lg:px-8">
											<div className="mr-3 flex gap-2">
												<div>
													<FormField
														fieldType="input"
														inputType="search"
														placeholder={t("Words.Search")}
														icon={<i className="fa-solid fa-magnifying-glass"></i>}
														value={search}
														// handleChange={(e) => setsearch(e.target.value)}
														handleChange={handleInputChange}
													/>
												</div>
											</div>
											<aside className="flex items-center gap-4">
												<Button2
													label={"Upload Resume"}
													btnType="button"
													btnStyle="primary"
													handleClick={() => setAddCand(true)}
													transitionClass="leading-pro ease-soft-in tracking-tight-soft active:opacity-85 transition-all duration-300 hover:scale-105"
													small
												/>
												<TeamMembers
													selectedData={{ id: 1, name: "Job", refid: null, unavailable: false }}
													axiosInstanceAuth2={axiosInstanceAuth2}
												/>
											</aside>
										</div>

										{sc && sc.length > 0 && (
											<>
												<div className="mt-8 flex items-center justify-between bg-white px-4 py-2 dark:bg-gray-800">
													<div className="">
														{sc.map((data, i) => (
															<button
																key={i}
																type="button"
																className="leading-pro ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 active:opacity-85 font-base my-2 mr-3 inline-flex cursor-pointer items-center justify-between rounded-lg border-2 border-blue-400 from-blue-400 to-indigo-700 px-4 py-2 text-center align-middle text-sm uppercase text-gradLightBlue transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:bg-gradient-to-tr hover:text-pink-200 hover:shadow-lg"
															>
																<span>{data}</span>
																<svg
																	className="ml-2 h-4 w-4 cursor-pointer text-gray-400 transition-colors duration-200 hover:text-red-500"
																	onClick={(e) => {
																		e.stopPropagation();
																		const updatedValues = sc.filter((value) => value !== data);
																		setsc(updatedValues);
																	}}
																	viewBox="0 0 20 20"
																	fill="currentColor"
																>
																	<path
																		fillRule="evenodd"
																		d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
																		clipRule="evenodd"
																	/>
																</svg>
															</button>
														))}
													</div>
													<div>
														<Button2 label={"apply"} btnStyle="link" handleClick={() => setshareJob(true)} small />
													</div>
												</div>
											</>
										)}

										{fresumeList && fresumeList["results"] && fresumeList["results"].length > 0 ? (
											<div className="mt-8 flex h-[calc(100vh-207px)] flex-col justify-between overflow-auto bg-white p-4 py-10 dark:bg-gray-800 lg:p-8">
												<table cellPadding={"0"} cellSpacing={"0"} className="h-fit w-full min-w-[948px]">
													<thead>
														<tr>
															<th className="border-b px-3 py-2 text-left">ID</th>
															<th className="border-b px-3 py-2 text-left">resume</th>
															<th className="border-b px-3 py-2 text-left">email</th>
															<th className="border-b px-3 py-2 text-left">name</th>
															<th className="border-b px-3 py-2 text-left">upload date</th>
															<th className="border-b px-3 py-2 text-left"></th>
														</tr>
													</thead>
													<tbody>
														{fresumeList["results"].map((data, i) => (
															<tr key={i} className="h-auto cursor-pointer">
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		window.open(data["resume"], "_blank");
																	}}
																>
																	{data["trefid"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		window.open(data["resume"], "_blank");
																	}}
																>
																	{data["resume"].split("/").pop()}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		window.open(data["resume"], "_blank");
																	}}
																>
																	{data["email"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		window.open(data["resume"], "_blank");
																	}}
																>
																	{data["fname"]}&nbsp;{data["lname"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		window.open(data["resume"], "_blank");
																	}}
																>
																	{moment(data["created_at"]).format("MM/DD/YYYY")}
																</td>

																<td className="border-b px-3 py-2 text-right">
																	<input
																		type="checkbox"
																		checked={sc.includes(data["trefid"])}
																		onChange={(e) => handleCheckboxChange(e, data["trefid"])}
																	/>
																</td>
															</tr>
														))}
													</tbody>
												</table>
												{/* <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
													<div style={{ marginBottom: "20px" }}>
														<Button2 label="Primary Button" btnStyle="primary" />
														<Button2 label="Secondary Button" btnStyle="secondary" />
														<Button2
															label="Icon Left Button"
															btnStyle="iconLeftBtn"
															iconLeft={<i className="fa-solid fa-heart"></i>}
														/>
														<Button2
															label="Icon Right Button"
															btnStyle="iconRightBtn"
															iconRight={<i className="fa-solid fa-heart"></i>}
														/>
														<Button2 label="Success Button" btnStyle="success" />
														<Button2 label="Danger Button" btnStyle="danger" />
														<Button2 label="Gray Button" btnStyle="gray" />
														<Button2 label="Ghost Button" btnStyle="ghost" />
														<Button2 label="Link Button" btnStyle="link" />
														<Button2 loader label="Outlined" btnStyle="outlined" />
														<Button2 disabled label="Disabled Button" />
													</div>
													<hr />
													<div>
														<Button2 label="Primary Button" btnStyle="primary" small />
														<Button2 label="Secondary Button" btnStyle="secondary" small />
														<Button2
															label="Icon Left Button"
															btnStyle="iconLeftBtn"
															small
															iconLeft={<i className="fa-solid fa-heart"></i>}
														/>
														<Button2
															label="Icon Right Button"
															btnStyle="iconRightBtn"
															small
															iconRight={<i className="fa-solid fa-heart"></i>}
														/>
														<Button2 label="Success Button" btnStyle="success" small />
														<Button2 label="Danger Button" btnStyle="danger" small />
														<Button2 label="Gray Button" btnStyle="gray" small />
														<Button2 label="Ghost Button" btnStyle="ghost" small />
														<Button2 label="Link Button" btnStyle="link" small />
														<Button2 loader label="Outlined" btnStyle="outlined" small />
														<Button2 disabled label="Disabled Button" small />
													</div>
												</div> */}

												<div className="m-2 flex items-center justify-between border-t-2 border-borderColor">
													{fresumeList["count"] && (
														<div className="text-sm">
															{srcLang === "ja" ? "合計" : "total"} {fresumeList["count"]} {t("Words.Applicants")},{" "}
															<>
																{srcLang === "ja" ? "現在のページ" : "Current Page"} : {fresumeList["current_page"]} of{" "}
																{fresumeList["total_pages"]}
															</>
														</div>
													)}
													<div className="flex justify-end gap-2">
														<Button
															btnType="button"
															btnStyle="sm"
															label={srcLang === "ja" ? "前へ" : "Previous"}
															disabled={!(fresumeList["previous"] && fresumeList["previous"].length > 0)}
															handleClick={() => loadResumes2(fresumeList["previous"])}
														/>
														<Button
															btnType="button"
															btnStyle="sm"
															label={srcLang === "ja" ? "次のページ" : "Next"}
															disabled={!(fresumeList["next"] && fresumeList["next"].length > 0)}
															handleClick={() => loadResumes2(fresumeList["next"])}
														/>
													</div>
												</div>
											</div>
										) : (
											<div className="flex h-[calc(100vh-207px)]  items-center justify-center rounded-normal bg-white shadow-normal dark:bg-gray-800">
												<div className="mx-auto w-full max-w-[400px] py-8 text-center">
													<div className="mb-6 p-2">
														<Image
															src={noApplicantdata}
															alt="No Data"
															width={300}
															className="mx-auto max-h-[200px] w-auto max-w-[200px]"
														/>
													</div>
													<h5 className="mb-4 text-lg font-semibold">Resumes not found.</h5>
												</div>
											</div>
										)}
									</>
								)}
							</div>
						</>
					)}
				</main>
			)}

			<Transition.Root show={shareJob} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setshareJob}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									{ocrLoader2 && (
										<div className="absolute left-0 top-0 z-[1] flex h-full w-full cursor-pointer items-center justify-center bg-[rgba(0,0,0,0.1)] p-6 pt-3 backdrop-blur-md">
											<div className="text-center">
												<i className="fa-solid fa-spinner fa-spin"></i>
												<p className="my-2 font-bold">Kindly hold on for a moment while we process your request.</p>
											</div>
										</div>
									)}
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "詳細" : "Share Applicant"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setshareJob(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div>
											{fcontracts && fcontracts.length > 0 ? (
												<>
													<table cellPadding={"0"} cellSpacing={"0"} className="h-fit w-full">
														<thead>
															<tr>
																<th className="border-b px-3 py-2 text-left">Job title</th>
																{/* <th className="border-b px-3 py-2 text-left">Company Name</th> */}
																<th className="border-b px-3 py-2 text-left"></th>
															</tr>
														</thead>
														<tbody>
															{fcontracts.map((data, i) => (
																<tr key={i} className="h-auto cursor-pointer">
																	<td className="border-b px-3 py-2 text-sm">{data["jobTitle"]}</td>
																	{/* <td className="border-b px-3 py-2 text-sm">{data["cname"]}</td> */}
																	<td className="border-b px-3 py-2 text-right">
																		<input
																			type="checkbox"
																			checked={sc2.includes(data["refid"])}
																			onChange={(e) => handleCheckboxChange2(e, data["refid"])}
																		/>
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</>
											) : (
												<p className="text-center text-darkGray dark:text-gray-400">
													{srcLang === "ja" ? (
														<>現在ベンダーはありません。新しいベンダーを追加してください</>
													) : (
														<>There are no Contracts as of now , Add a New Contract</>
													)}
												</p>
											)}
										</div>
										<div className="mt-8 flex w-full justify-center">
											<Button
												label={srcLang === "ja" ? "近い" : "Apply"}
												btnType="button"
												btnStyle={"sm"}
												disabled={!disShareButton()}
												handleClick={shareAppToCon}
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
											{srcLang === "ja" ? "求人が公開されました" : "Applicants has been Shared"}
										</h4>
										<p className="text-sm">
											{srcLang === "ja" ? (
												<>
													<Link
														href="/agency/contracts"
														onClick={() => setPublishThanks(false)}
														className="font-bold text-primary hover:underline dark:text-white"
													>
														公開中の求人を確認する
													</Link>
												</>
											) : (
												<>
													<Link
														href="/agency/contracts"
														onClick={() => setPublishThanks(false)}
														className="font-bold text-primary hover:underline dark:text-white"
													>
														Check shared applicants
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
															label={t("Form.FirstName")}
															value={fname}
															handleChange={(e) => setfname(e.target.value)}
															placeholder={t("Form.FirstName")}
															required
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
														/>
													</div>
												</div>

												<Button
													label={"Add"}
													loader={false}
													btnType={"button"}
													disabled={!disBtnApply()}
													handleClick={uploadResumeStep2_2}
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
