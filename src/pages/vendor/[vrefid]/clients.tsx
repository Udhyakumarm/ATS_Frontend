import VendorSideBar from "@/components/vendor/Sidebar";
import VendorTopBar from "@/components/vendor/TopBar";
import Head from "next/head";
import { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState, useMemo } from "react";
import { Combobox, Dialog, Tab, Transition } from "@headlessui/react";
import Button from "@/components/Button";
import Link from "next/link";
import FormField from "@/components/FormField";
import Image from "next/image";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import userImg from "public/images/user-image.png";
import gall2 from "public/images/gall-2.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
	addExternalNotifyLog,
	axiosInstance,
	axiosInstanceAuth,
	axiosInstanceOCR,
	axiosInstance2
} from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";
import { debounce } from "lodash";
import { axiosInstance as axis } from "@/utils";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore, useNotificationStore } from "@/utils/code";
import Confetti from "react-confetti";
import Joyride, { STATUS } from "react-joyride";
import useJoyrideStore from "@/utils/joyride";


const people = [
	{ id: 1, name: "Wade Cooper" },
	{ id: 2, name: "Arlene Mccoy" },
	{ id: 3, name: "Devon Webb" },
	{ id: 4, name: "Tom Cook" },
	{ id: 5, name: "Tanya Fox" },
	{ id: 6, name: "Hellen Schmidt" }
];

export default function VendorClients() {
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
	const router = useRouter();
	const { vrefid } = router.query;

	const [load, setload] = useState(false);
	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [vdata, setvdata] = useState({});

	const [vjdata, setvjdata] = useState([]);
	const [showOffer, setshowOffer] = useState(false);
	const [offerDetails, setofferDetails] = useState([]);
	const [addSocial, setAddSocial] = useState(false);
	const [sadApply, setsadApply] = useState(false);
	const [vjobclick, setvjobclick] = useState(-1);
	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);
	const [tourCompleted, setTourCompleted] = useState(false);
	const [isTourOpen, setIsTourOpen] = useState(false);
	const { shouldShowJoyride, isJoyrideCompleted, showJoyride, completeJoyride } = useJoyrideStore();
	const [shouldShowTopBar,setShouldShowTopBar]=useState(false);
	const [shouldShowSidebarTour, setShouldShowSidebarTour] = useState(false);

	async function offerVisible(arefid: any) {
		await axiosInstanceAuth2
			.get(`/applicant/list-offer/${arefid}/`)
			.then(async (res) => {
				console.log("!", "Offer Detail", res.data);
				setofferDetails(res.data);
				setshowOffer(true);
				// setvjdata(res.data);
			})
			.catch((err) => {
				console.log("!", err);
				setofferDetails([]);
			});
	}

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadVendorJobData(id: string) {
		await axiosInstanceAuth2
			.get(`/vendors/vendor_job_data/${id}/`)
			.then(async (res) => {
				console.log("!", res.data);
				setvjdata(res.data);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}
	useEffect(()=>{
		if(vjdata&& vjdata.length>0){
			setShouldShowTopBar(true)
	}},[vjdata])
	

	useEffect(() => {
		if (vrefid && vrefid.length > 0 && token && token.length > 0) {
			loadVendorJobData(vrefid);
		}
	}, [vrefid, token]);

	const cancelButtonRef = useRef(null);
	const [addCand, setAddCand] = useState(false);
	const [viewApplicant, setViewApplicant] = useState(false);
	const [odocs, setodocs] = useState(false);
	const [odocsapp, setodocsapp] = useState({});
	const [odocsresume, setodocsresume] = useState([]);
	const [selected, setSelected] = useState(people[0]);
	const [query, setQuery] = useState("");

	const [popuprefid, setpopuprefid] = useState("");
	const [popupvcrefid, setpopupvcrefid] = useState("");
	const filteredPeople =
		query === ""
			? people
			: people.filter((person) =>
					person.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""))
			  );

	const tabHeading_1 = [
		{
			title: t("Words.JobDescription")
		},
		{
			title: t("Words.AboutOrganization")
		},
		{
			title: t("Words.AllApplicants")
		}
	];

	const [orgdetail, setorgdetail] = useState({});
	const [venapp, setvenapp] = useState([]);

	const [venappdetail, setvenappdetail] = useState({});

	const [docs, setdocs] = useState([]);
	async function loadAppDosc(arefid: any) {
		await axiosInstanceAuth2
			.get(`/applicant/listdocs/${arefid}/`)
			.then((res) => {
				console.log("@@@@@", "listdocs", res.data);
				setdocs(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function delAppDocs(pk: any) {
		await axiosInstanceAuth2
			.delete(`/applicant/deletedocs/${pk}/`)
			.then((res) => {
				setodocs(false);
				toastcomp("Document deleted", "success");
			})
			.catch((err) => {
				setodocs(false);
				toastcomp("Document not deleted", "error");
				console.log(err);
			});
	}

	async function addAppDocs(arefid: any) {
		try {
			for (let i = 0; i < odocsresume.length; i++) {
				const formData = new FormData();
				formData.append("document", odocsresume[i]); // Append the current resume to FormData

				// Make the POST request with axios
				const response = await axiosInstanceAuth2.post(`/applicant/createdocs/${arefid}/`, formData);

				// Handle response for each request
				console.log(`Response for resume ${i + 1}:`, response.data);
			}
			setodocs(false);
			toastcomp(`${odocsresume.length} documets added`, "success");
		} catch (error) {
			// Handle error
			setodocs(false);
			toastcomp(`doc upload error`, "success");
			console.error("Error:", error);
		}
	}

	function handleODOCSFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files.length > 0) {
			const files = event.target.files;

			// setodocsresume((prevArray) => [...prevArray, ...files]);
			setodocsresume((prevArray) => {
				const uniqueItems = new Map();
				prevArray.forEach((item) => uniqueItems.set(item.name, item));
				Array.from(files).forEach((item) => uniqueItems.set(item.name, item));
				return Array.from(uniqueItems.values());
			});
		}
	}

	useEffect(() => {
		console.log("####", "odocsresume", odocsresume);
	}, [odocsresume]);

	useEffect(() => {
		if (odocs) {
			setodocsresume([]);
		}
	}, [odocs]);

	async function loadOrgDetail(pk: any) {
		await axiosInstance
			.get(`/organization/get/organizationprofile/vendor/${pk.toString()}/`)
			.then((res) => {
				setorgdetail(res.data);
				console.log("@", res.data);
			})
			.catch((err) => {
				console.log("@", err);
			});
	}

	async function loadVendorAppDetail(refid: any, vrefid: any) {
		await axiosInstance
			.get(`/vendors/vendor-list2/${refid}/${vrefid}/`)
			.then((res) => {
				setvenapp(res.data);
				console.log("&", res.data);
			})
			.catch((err) => {
				setvenapp([]);
				console.log("&", err);
			});
	}

	// async function loadVendorSingleAppDetail(refid: any, vcrefid: any) {
	// 	await axiosInstance
	// 		.get(`/vendors/vendoruser/${refid}/${vcrefid}/`)
	// 		.then((res) => {
	// 			setvenappdetail(res.data);
	// 			console.log("&", res.data);
	// 		})
	// 		.catch((err) => {
	// 			setvenappdetail({});
	// 			console.log("&", err);
	// 		});
	// }

	useEffect(() => {
		if (vjobclick != -1) {
			loadOrgDetail(vjdata[vjobclick]["user"]);
			loadVendorAppDetail(vjdata[vjobclick]["refid"], vrefid);
		}
	}, [vjobclick]);

	useEffect(() => {
		if (!addCand) {
			setpopuprefid("");
		}
	}, [addCand]);

	// useEffect(() => {
	// 	if (viewApplicant) {
	// 		console.log("NA");
	// 		loadVendorSingleAppDetail(vjdata[vjobclick]["refid"], popupvcrefid);
	// 	}
	// }, [viewApplicant]);

	//add applicant state
	const [resume, setresume] = useState<File | null>(null);
	const [fname, setfname] = useState("");
	const [lname, setlname] = useState("");
	const [email, setemail] = useState("");
	const [summary, setsummary] = useState("");
	const [msg, setmsg] = useState("");
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
		setmsg("");
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
			msg.length > 0 &&
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
			setmsg("");
		}
	}, [addCand]);

	useEffect(() => {
		if (resume != null && popuprefid.length > 0) {
			console.log("$", "Step1", "Resume Changed Useeffect...");
			const fd = new FormData();
			fd.append("resume", resume);
			step1(popuprefid, fd);
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
			})
			.catch((err) => {
				toastcomp("step 1", "error");
				console.log("!!!", "step1 errr", err);
				resetState();
			});
	}

	async function applyVendorApplicant() {
		toastcomp("step 3", "success");
		setocrLoader(true);
		const fd = new FormData();
		fd.append("email", email);
		fd.append("fname", fname);
		fd.append("lname", lname);
		fd.append("summary", summary);
		fd.append("rmsg", msg);

		if (step1Data["rtext"] && step1Data["rtext"].length > 0) {
			fd.append("rtext", step1Data["rtext"]);
		}

		if (step1Data["Percentage"]) {
			fd.append("percent", step1Data["Percentage"]);
		}
		fd.append("resume", resume);

		await axiosInstanceAuth2
			.post(`/applicant/vendor-apply/${popuprefid}/${vrefid}/`, fd)
			.then((res) => {
				console.log("!!!", "apply noauth md", res.data);
				if (res.data.success === 1) {
					toastcomp("Applied Successfully", "success");
					setShowConfetti(true);
				} else if (res.data.success === 2) {
					toastcomp("Vendor ID Not found", "error");
				} else {
					toastcomp("This Resume Already Applied", "error");
				}
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
	useEffect(() => {
		// Call completeJoyride when the component mounts
		completeJoyride();
	  }, [completeJoyride]);
	useEffect(() => {
		if (!isJoyrideCompleted) {
			showJoyride();
		}
	}, [isJoyrideCompleted, showJoyride]);
	console.log("joride ki value ", isJoyrideCompleted);
	console.log("should showjoyride ki value ", shouldShowJoyride)
	const joyrideSteps = [
		{
			target: ".jobs-0",
			title:  t("Words.Jobs"),
			content: "Click here to Manage ,handle and recommend candidates for active jobs",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true,
			// hideFooter: true,
			spotlightClicks: true
		},
		{
			target: ".tab-heading-0",
			title: t("Words.JobDescription"),
			content: "Job description tab is where you can see the job description and other details of the job",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true,
			spotlightClicks: true
		},
		{
			target: ".tab-heading-1",
			title: t("Words.AboutOrganization"),
			content: "About organization tab is where you can see the organization details and other details of the organization",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true,
			spotlightClicks: true
		},
		{
			target: ".tab-heading-2",
			title: t("Words.AllApplicants"),
			content: "All applicants tab is where you can see the list of all the applicants for the job",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true,
			spotlightClicks: true
		},
		{
			target: ".recommendButton",
			title: "Recommend Candidates",
			content: " Click here to recommend candidates for the jobs by adding their resumes to the list",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true,
			spotlightClicks: true
		},
		
	];
	// recommendButton
	return (
		<>
			<Head>
				<title>
					{t("Words.Vendors")} | {t("Words.Clients")}
				</title>
			</Head>
			<main>
			
				<VendorSideBar ShouldshowSidebar={shouldShowSidebarTour} />
				<VendorTopBar ShouldshowTopbar={shouldShowTopBar} />
				<Joyride
						steps={joyrideSteps}
						run={shouldShowJoyride}
						continuous={true}
						styles={{
							options: {
								arrowColor: "#0066ff", // Set to primary color
								backgroundColor: "#F5F8FA", // Set to lightBlue
								overlayColor: "rgba(0, 0, 0, 0.4)", // Adjusted to match your styling
								primaryColor: "#0066ff", // Set to primary color
								textColor: "#3358c5", // Set to secondary color
								// width: 100, // Adjust as needed
								zIndex: 1000 // Set as needed
							}
						}}
						showProgress={true}
						showSkipButton={false}
						callback={(data: any) => {
							const { action, status, step } = data;
							if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status) ) {
								setShouldShowSidebarTour(true);
							}
							if (action === "close") {
								setIsTourOpen(false);
								setTourCompleted(true); 
							}
						}}
					/>
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className="layoutWrap">
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
					<div className="flex flex-wrap p-4 lg:p-8">
						<div className="mb-4 w-full xl:mb-0 xl:max-w-[300px]">
							<div className="rounded-normal border bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
								{/* <Combobox value={selected} onChange={setSelected}>
									<div className="relative mb-6">
										<div className="relative w-full cursor-default overflow-hidden rounded-[6px] border dark:border-gray-600">
											<Combobox.Input
												className="w-full border-none py-2 pl-3 pr-12 text-sm leading-5 text-gray-900 focus:ring-0 dark:bg-gray-800 dark:text-gray-400"
												displayValue={(person) => person.name}
												onChange={(event) => setQuery(event.target.value)}
											/>
											<Combobox.Button className="absolute inset-y-0 right-0 flex items-center border-l px-3 dark:border-gray-600 dark:text-gray-400">
												<i className="fa-solid fa-chevron-down"></i>
											</Combobox.Button>
										</div>
										<Transition
											as={Fragment}
											leave="transition ease-in duration-100"
											leaveFrom="opacity-100"
											leaveTo="opacity-0"
											afterLeave={() => setQuery("")}
										>
											<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 sm:text-sm">
												{filteredPeople.length === 0 && query !== "" ? (
													<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
														Nothing found.
													</div>
												) : (
													filteredPeople.map((person) => (
														<Combobox.Option
															key={person.id}
															className={
																"clamp_1 relative cursor-pointer px-6 py-2 pl-8 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
															}
															value={person}
														>
															{({ selected, active }) => (
																<>
																	<span className={` ${selected ? "font-bold" : "font-normal"}`}>{person.name}</span>
																	{selected ? (
																		<span className="absolute left-3">
																			<i className="fa-solid fa-check"></i>
																		</span>
																	) : null}
																</>
															)}
														</Combobox.Option>
													))
												)}
											</Combobox.Options>
										</Transition>
									</div>
								</Combobox> */}

								<h4 className="mb-2 text-lg font-bold">{t("Words.Jobs")}</h4>
								<div className="max-h-[400px] overflow-auto xl:max-h-[inherit]">
									{vjdata &&
										vjdata.length > 0 &&
										vjdata.map((data, i) => (
											<div
												className={
													`border border-transparent border-b-slate-200 px-3 py-4 last:border-b-0 hover:shadow-highlight dark:border-b-gray-600 dark:hover:bg-gray-900 jobs-${i}`
												}
												key={i}
												onClick={() => {
													setvjobclick(i);
												}}
											>
												<h4 className="mb-2 text-sm font-bold">
													{data["jobTitle"] && data["jobTitle"].length > 0 ? data["jobTitle"] : <>N/A</>}
												</h4>
												<ul className="flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
													<li className="mr-3 list-none">
														{data["jobIndustry"] && data["jobIndustry"].length > 0 ? data["jobIndustry"] : <>N/A</>}
													</li>
													<li className="mr-3">
													{srcLang === "ja" ? "空き" : "Vacancy"} -{" "}
														{data["jobVacancy"] && data["jobVacancy"].length > 0 ? data["jobVacancy"] : <>0</>}
													</li>
												</ul>
											</div>
										))}
									{/* {Array(8).fill(
										<div
											className={
												"border border-transparent border-b-slate-200 px-3 py-4 last:border-b-0 hover:shadow-highlight dark:border-b-gray-600 dark:hover:bg-gray-900"
											}
										>
											<h4 className="mb-2 text-sm font-bold">Software Developer</h4>
											<ul className="flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
												<li className="mr-3 list-none">Engineer</li>
												<li className="mr-3">Vacancy - 50</li>
											</ul>
										</div>
									)} */}
								</div>
							</div>
						</div>
						{vjobclick != -1 && (
							<div className="w-full xl:max-w-[calc(100%-300px)] xl:pl-6">
								<div className="rounded-normal bg-white dark:bg-gray-800">
									<div className="mx-auto flex w-full max-w-[800px] flex-wrap justify-between px-4 py-4">
										<aside>
											<h2 className="mb-2 text-lg font-bold">
												{vjdata[vjobclick]["jobTitle"] && vjdata[vjobclick]["jobTitle"]} (
												{vjdata[vjobclick]["jobWorktype"] && vjdata[vjobclick]["jobWorktype"]})
											</h2>
											<ul className="mb-2 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
												<li className="mr-3 list-none">
													{vjdata[vjobclick]["jobEmploymentType"] ? vjdata[vjobclick]["jobEmploymentType"] : <>N/A</>}
												</li>
												<li className="mr-3">
													{vjdata[vjobclick]["jobCurrency"] &&
													vjdata[vjobclick]["jobFromSalary"] &&
													vjdata[vjobclick]["jobToSalary"] ? (
														<>
															{vjdata[vjobclick]["jobCurrency"]} {vjdata[vjobclick]["jobFromSalary"]} to{" "}
															{vjdata[vjobclick]["jobToSalary"]}
														</>
													) : (
														<> {srcLang === "ja" ? "給与非公開" : "Salary Not Disclosed"}</>
													)}
												</li>
												<li className="mr-3">
												{srcLang === "ja" ? "空き" : "Vacancy"} - {vjdata[vjobclick]["jobVacancy"] ? vjdata[vjobclick]["jobVacancy"] : <>N/A</>}
												</li>
											</ul>
										</aside>
										<div className="recommendButton">
										<Button
											label={"Recommend Candidate"}
											btnType="button"
											handleClick={() => {
												setAddCand(true);
												setpopuprefid(vjdata[vjobclick]["refid"]);
											}}
										/>
										</div>
									</div>
									<Tab.Group>
										<div className="border-b dark:border-b-gray-600">
											<Tab.List className={"mx-auto w-full max-w-[800px] px-4"}>
												{tabHeading_1.map((item, i) => (
													<Tab key={i} as={Fragment} className={`tab-heading-${i}`}>
														{({ selected }) => (
															<button
																className={
																	"mr-16 border-b-4 py-3 font-semibold focus:outline-none" +
																	" " +
																	(selected
																		? "border-primary text-primary dark:border-white dark:text-white"
																		: "border-transparent text-darkGray dark:text-gray-400")
																}
															>
																{item.title}
															</button>
														)}
													</Tab>
												))}
											</Tab.List>
										</div>
										<Tab.Panels>
											<Tab.Panel>
												<div className="mx-auto w-full max-w-[800px] px-4 py-4">
													<aside className="mb-4">
														<h3 className="mb-2 font-bold">{t("Words.DepartmentInformation")}</h3>
														<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
															{vjdata[vjobclick]["jobFunction"] && (
																<li className="mr-4">{vjdata[vjobclick]["jobFunction"]} Functions</li>
															)}
															{vjdata[vjobclick]["jobDepartment"] && (
																<li className="mr-4">{vjdata[vjobclick]["jobDepartment"]} Department</li>
															)}
															{vjdata[vjobclick]["jobIndustry"] && (
																<li className="mr-4">{vjdata[vjobclick]["jobIndustry"]} Industry</li>
															)}
															{vjdata[vjobclick]["jobGroupDivision"] && (
																<li className="mr-4">{vjdata[vjobclick]["jobGroupDivision"]} Group/Division</li>
															)}
														</ul>
													</aside>
													<hr className="my-4" />
													<aside className="mb-4">
														<h3 className="mb-2 font-bold">
															{t("Words.Department")} {t("Form.Description")}
														</h3>
														<article className="text-sm text-darkGray dark:text-gray-400">
															{vjdata[vjobclick]["jobDeptDescription"] ? (
																<>
																	<div
																		dangerouslySetInnerHTML={{ __html: vjdata[vjobclick]["jobDeptDescription"] }}
																	></div>
																</>
															) : (
																<>N/A</>
															)}
														</article>
													</aside>
													<hr className="my-4" />

													<aside className="mb-4">
														<h3 className="mb-2 font-bold">{t("Words.JobDescription")}</h3>
														<article className="jd_article text-sm">
															{vjdata[vjobclick]["jobDescription"] ? (
																<>
																	<div dangerouslySetInnerHTML={{ __html: vjdata[vjobclick]["jobDescription"] }}></div>
																</>
															) : (
																<>N/A</>
															)}
														</article>
													</aside>
													<hr className="my-4" />
													<aside className="mb-4">
														<h3 className="mb-2 font-bold">{t("Words.Skills")}</h3>
														{vjdata[vjobclick]["jobSkill"] ? (
															<article className="text-[12px] text-darkGray dark:text-gray-400">
																<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
																	{vjdata[vjobclick]["jobSkill"].split(",").map((item: any, i: any) => (
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
														<h3 className="mb-2 font-bold">{t("Words.EmploymentDetails")}</h3>
														<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
															{vjdata[vjobclick]["jobEmploymentType"] && (
																<li className="mr-4">{vjdata[vjobclick]["jobEmploymentType"]}</li>
															)}
															{vjdata[vjobclick]["jobQualification"] && (
																<li className="mr-4">{vjdata[vjobclick]["jobQualification"]}</li>
															)}
															{vjdata[vjobclick]["jobLocation"] && (
																<li className="mr-4">{vjdata[vjobclick]["jobLocation"]}</li>
															)}
															{vjdata[vjobclick]["jobExperience"] && (
																<li className="mr-4">{vjdata[vjobclick]["jobExperience"]} of Experience</li>
															)}
														</ul>
													</aside>
													<hr className="my-4" />
													<aside className="mb-4">
														<h3 className="mb-2 font-bold">{t("Words.Benefits")}</h3>
														<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
															{vjdata[vjobclick]["jobRelocation"] == "Yes" && (
																<li className="mr-4">{t("Words.PaidRelocation")}</li>
															)}
															{vjdata[vjobclick]["jobVisa"] == "Yes" && (
																<li className="mr-4">{t("Words.VisaSponsorship")}</li>
															)}
															{vjdata[vjobclick]["jobWorktype"] && (
																<li className="mr-4">{vjdata[vjobclick]["jobWorktype"]} Working</li>
															)}
														</ul>
													</aside>
													{/* <Button label="Download Job Description" btnStyle="gray" /> */}
												</div>
											</Tab.Panel>
											<Tab.Panel>
												{orgdetail &&
													orgdetail["OrgProfile"] &&
													orgdetail["OrgProfile"].map((data: any, j: React.Key | null | undefined) => (
														<div className="mx-auto w-full max-w-[800px] px-4 py-4" key={j}>
															{orgdetail["Founder"].length > 0 && (
																<div className="mb-3 flex flex-wrap rounded-normal border p-4 pb-0">
																	{orgdetail["Founder"].map((data: any, i: any) => (
																		<div
																			className="mb-3 w-full pr-4 text-center md:max-w-[calc(100%/3)] lg:max-w-[calc(100%/4)] xl:max-w-[calc(100%/5)]"
																			key={i}
																		>
																			<Image
																				src={
																					process.env.NODE_ENV === "production"
																						? process.env.NEXT_PUBLIC_PROD_BACKEND + data["image"]
																						: process.env.NEXT_PUBLIC_DEV_BACKEND + data["image"]
																				}
																				alt="User"
																				width={80}
																				height={80}
																				className="mx-auto mb-2 h-[80px] rounded-full object-cover"
																			/>
																			<p className="mb-1 text-sm font-bold">{data["name"]}</p>
																			<p className="text-sm text-darkGray">{data["designation"]}</p>
																		</div>
																	))}
																</div>
															)}
															<ul className="mb-6 flex list-inside list-disc flex-wrap items-center font-semibold text-darkGray dark:text-gray-400">
																<li className="mr-3 list-none">
																	{data["org_Url"] && data["org_Url"] != "" ? (
																		<Link
																			href={`${data["org_Url"]}`}
																			target="_blank"
																			className="text-primary hover:underline dark:text-white"
																		>
																			<i className="fa-solid fa-globe mr-2"></i> {data["org_Url"]}
																		</Link>
																	) : (
																		<>
																			Company URL <small>Not Disclosed</small>
																		</>
																	)}
																</li>
																<li className="mr-3">
																	{data["contact_Number"] && data["contact_Number"] != "" ? (
																		<>Company Contact : {data["contact_Number"]}</>
																	) : (
																		<>
																			Company Contact <small>Not Disclosed</small>
																		</>
																	)}
																</li>
																<li className="mr-3">
																	{data["company_Size"] && data["company_Size"] != "" ? (
																		<>Company Size : {data["company_Size"]} Employees</>
																	) : (
																		<>
																			Company Size <small>Not Disclosed</small>
																		</>
																	)}
																</li>
																<li className="mr-3">
																	{data["workplace_Type"] && data["workplace_Type"] != "" ? (
																		<>Workplace Culture : {data["workplace_Type"]}</>
																	) : (
																		<>
																			Workplace Culture <small>Not Disclosed</small>
																		</>
																	)}
																</li>
															</ul>
															<hr className="mb-6" />
															<h2 className="mb-3 text-lg font-bold">{t("Words.AboutOrganization")}</h2>
															{data["about_org"] && data["about_org"] != "" ? (
																<article
																	className="mb-6"
																	dangerouslySetInnerHTML={{ __html: data["about_org"] }}
																></article>
															) : (
																<small>Not Disclosed</small>
															)}
															<hr className="mb-6" />
															<h2 className="mb-3 text-lg font-bold">{t("Form.AboutTheFounder")}</h2>
															{data["about_founder"] && data["about_founder"] != "" ? (
																<article
																	className="mb-6"
																	dangerouslySetInnerHTML={{ __html: data["about_founder"] }}
																></article>
															) : (
																<small>Not Disclosed</small>
															)}
															<hr className="mb-6" />
															<h2 className="mb-3 text-lg font-bold">Other Information</h2>
															<h4 className="mb-2">
																{data["headquarter_Location"] && data["headquarter_Location"] != "" ? (
																	<>Headquarter Location : {data["headquarter_Location"]}</>
																) : (
																	<>
																		Headquarter Location : <small>Not Disclosed</small>
																	</>
																)}
															</h4>
															<h4 className="mb-2">
																{data["branch_Office"] && data["branch_Office"] != "" ? (
																	<>Branch Office : {data["branch_Office"]}</>
																) : (
																	<>
																		Branch Office : <small>Not Disclosed</small>
																	</>
																)}
															</h4>
															<h4 className="mb-2">
																{data["funding_Details"] && data["funding_Details"] != "" ? (
																	<>Funding Details : {data["funding_Details"]}</>
																) : (
																	<>
																		Funding Details : <small>Not Disclosed</small>
																	</>
																)}
															</h4>
															<h4 className="mb-2">
																{data["organization_Benefits"] && data["organization_Benefits"] != "" ? (
																	<>Organization Benefits : {data["organization_Benefits"]}</>
																) : (
																	<>
																		Organization Benefits : <small>Not Disclosed</small>
																	</>
																)}
															</h4>

															<hr className="mb-6" />
															{orgdetail["Gallery"] && (
																<div>
																	<h2 className="mb-3 text-lg font-bold">{t("Words.WorkplaceCulture")}</h2>
																	<div className="rounded-large border p-6">
																		<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
																			<Masonry>
																				{orgdetail["Gallery"].map(
																					(data: { image: any }, i: React.Key | null | undefined) => (
																						<Image
																							src={
																								process.env.NODE_ENV === "production"
																									? process.env.NEXT_PUBLIC_PROD_BACKEND + data["image"]
																									: process.env.NEXT_PUBLIC_DEV_BACKEND + data["image"]
																							}
																							alt="Office"
																							width={1000}
																							height={1000}
																							className="w-full rounded-normal p-2"
																							key={i}
																						/>
																					)
																				)}
																			</Masonry>
																		</ResponsiveMasonry>
																	</div>
																</div>
															)}
														</div>
													))}
											</Tab.Panel>
											<Tab.Panel>
												<div className="mx-auto w-full max-w-[800px] px-4 py-4">
													<div className="max-h-[405px] overflow-auto">
														<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
															<thead>
																<tr>
																	<th className="border-b px-3 py-2 text-left">{t("Words.Applicants")}</th>
																	<th className="border-b px-3 py-2 text-left">{t("Words.Status")}</th>
																	<th className="border-b px-3 py-2 text-left">{t("Words.Applied")}</th>
																	<th className="border-b px-3 py-2 text-left">{t("Words.Profile")}</th>
																	<th className="border-b px-3 py-2 text-left">Optional Documents</th>
																</tr>
															</thead>
															<tbody className="text-sm font-semibold">
																{venapp &&
																	venapp.map((data, i) => (
																		<tr className=" odd:bg-gray-100 dark:odd:bg-gray-600" key={i}>
																			<td className="px-3 py-2 text-left">
																				{data["fname"]}&nbsp;{data["lname"]}
																			</td>
																			{data["status"] === "Offer" || data["status"] === "Hired" ? (
																				<>
																					<td
																						className={`cursor-pointer px-3 py-2 text-left hover:underline`}
																						onClick={() => offerVisible(data["arefid"])}
																					>
																						{data["status"]}
																						<i className="fa-solid fa-eye ml-2"></i>
																					</td>
																				</>
																			) : (
																				<>
																					<td className="px-3 py-2 text-left">{data["status"]}</td>
																				</>
																			)}

																			<td className="px-3 py-2 text-left">{moment(data["created_at"]).fromNow()}</td>
																			<td className="px-3 py-2 text-left">
																				<button
																					type="button"
																					className="text-primary hover:underline dark:text-white"
																					onClick={() => {
																						setvenappdetail(data);
																						loadAppDosc(data["arefid"]);
																						setViewApplicant(true);
																					}}
																				>
																					{t("Btn.View")}
																				</button>
																			</td>
																			<td className="px-3 py-2 text-left">
																				<button
																					type="button"
																					className="text-primary hover:underline dark:text-white"
																					onClick={() => {
																						setodocsapp(data);
																						loadAppDosc(data["arefid"]);
																						setodocs(true);
																					}}
																				>
																					Change
																				</button>
																			</td>
																		</tr>
																	))}
															</tbody>
														</table>
													</div>
												</div>
											</Tab.Panel>
										</Tab.Panels>
									</Tab.Group>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
			<Transition.Root show={showOffer} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setshowOffer}>
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
								<Dialog.Panel className=" w-full transform overflow-hidden rounded-[30px] bg-white text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Offer Details</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setshowOffer(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{offerDetails && offerDetails.length > 0 ? (
											<>
												{offerDetails.map((data, i) => (
													<>
														{data["step"] >= 2 ? (
															<>
																<div key={i}>
																	{!data["candidate_visibility"] || data["step"] === 2 || data["step"] === 3 ? (
																		<>
																			<section className="">
																				<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																					<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																					{data["step"] === 3 && (
																						<p className="text-lg">Offer In A Disscussion Stage </p>
																					)}
																					{data["step"] === 2 && (
																						<p className="text-lg">Offer In A Finalization Stage </p>
																					)}
																					{data["step"] === 3 && (
																						<small className="font-semibold">
																							You can view the offer letter once the recruiter makes it visible to you.
																						</small>
																					)}
																				</div>
																			</section>
																		</>
																	) : (
																		<>
																			<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
																				<p className="my-2 font-bold">Offer Letter</p>
																				<button
																					className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																					onClick={() => {
																						if (data["finalofferLetter"] && data["finalofferLetter"].length > 0) {
																							window.open(data["finalofferLetter"], "_blank");
																						} else if (data["offerLetter"] && data["offerLetter"].length > 0) {
																							window.open(data["offerLetter"], "_blank");
																						}
																					}}
																				>
																					<i className="fa-solid fa-download mr-2"></i>
																					Download
																				</button>
																			</div>

																			{data["step"] >= 4 && (
																				<>
																					<div className="mx-auto w-full max-w-[700px] py-4">
																						<p className="text-center">
																							{data["finalofferLetter"] && data["finalofferLetter"].length > 0 ? (
																								<iframe
																									src={`${data["finalofferLetter"]}`}
																									className="h-[50vh] w-[100%]"
																								></iframe>
																							) : (
																								<iframe
																									src={`${data["offerLetter"]}`}
																									className="h-[50vh] w-[100%]"
																								></iframe>
																							)}
																						</p>
																					</div>
																					{data["candidate_status"] === "Pending" ? (
																						<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																							<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																							<p className="text-lg">Candidate Offer Status Pending </p>
																						</div>
																					) : (
																						<div className="my-6 rounded-normal bg-green-100 px-6 py-8 text-center font-bold text-gray-700">
																							<i className="fa-solid fa-check-circle mb-2 text-[40px] text-green-700"></i>
																							<p className="mb-2 text-lg text-green-700">{t("Words.OfferAccepted")}</p>
																						</div>
																					)}
																				</>
																			)}
																		</>
																	)}
																</div>
															</>
														) : (
															<section>
																<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																	<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																	<p className="text-lg">Offer In A Prepration Stage </p>
																</div>
															</section>
														)}
													</>
												))}
											</>
										) : (
											<>
												<section className="">
													<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
														<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
														<p className="text-lg">No Offer</p>
														<small className="font-semibold">Right Now There Are No Offers For This Candidate.</small>
													</div>
												</section>
											</>
										)}
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

												<FormField
													fieldType="textarea"
													label={t("Words.Summary")}
													placeholder={t("Words.Summary")}
													value={summary}
													handleChange={(e) => setsummary(e.target.value)}
													required
												/>

												<FormField
													fieldType="textarea"
													label={t("Form.AnyMessageRecruiter")}
													placeholder={t("Form.AnyMessageRecruiter")}
													value={msg}
													handleChange={(e) => setmsg(e.target.value)}
													required
												/>

												<Button
													label={"Apply"}
													loader={false}
													btnType={"button"}
													disabled={!disBtnApply()}
													handleClick={applyVendorApplicant}
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

			<Transition.Root show={viewApplicant} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setViewApplicant}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">{t("Words.ApplicantProfile")}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setViewApplicant(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									{venappdetail && (
										<div className="p-8">
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<p className="mx-auto w-full max-w-[600px] text-center">
													<iframe src={venappdetail["resume"]} className="h-[100vh] w-[100%]"></iframe>
												</p>
											</div>
											{docs && docs.length > 0 && (
												<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
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
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">Candidate Information</label>
												<article className="text-sm">
													Name :{" "}
													{venappdetail["fname"] &&
													venappdetail["fname"].length > 0 &&
													venappdetail["lname"] &&
													venappdetail["lname"].length > 0 ? (
														<>
															{venappdetail["fname"]}&nbsp;{venappdetail["lname"]}
														</>
													) : (
														<>N/A</>
													)}
												</article>
												<article className="text-sm">
													Email :{" "}
													{venappdetail["email"] && venappdetail["email"].length > 0 ? venappdetail["email"] : <>N/A</>}
												</article>
												<article className="text-sm">
													Rating : {venappdetail["percentage_fit"] ? <>{venappdetail["percentage_fit"]}%</> : <>N/A</>}
												</article>
											</div>
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">{t("Words.Summary")}</label>
												<article className="text-sm">
													{venappdetail["summary"] && venappdetail["summary"].length > 0 ? (
														venappdetail["summary"]
													) : (
														<>N/A</>
													)}
												</article>
											</div>
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">{t("Words.MessageFromVendor")}</label>
												<article className="text-sm">
													{venappdetail["recuriter_message"] && venappdetail["recuriter_message"].length > 0 ? (
														venappdetail["recuriter_message"]
													) : (
														<>N/A</>
													)}
												</article>
											</div>
										</div>
									)}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={odocs} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setodocs}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">{t("Words.ApplicantProfile")}</h4>
										<button type="button" className="leading-none hover:text-gray-700" onClick={() => setodocs(false)}>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{odocsapp && (
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">Candidate Information</label>
												<article className="text-sm">
													Name :{" "}
													{odocsapp["fname"] &&
													odocsapp["fname"].length > 0 &&
													odocsapp["lname"] &&
													odocsapp["lname"].length > 0 ? (
														<>
															{odocsapp["fname"]}&nbsp;{odocsapp["lname"]}
														</>
													) : (
														<>N/A</>
													)}
												</article>
												<article className="text-sm">
													Email : {odocsapp["email"] && odocsapp["email"].length > 0 ? odocsapp["email"] : <>N/A</>}
												</article>
												<article className="text-sm">
													Rating : {odocsapp["percentage_fit"] ? <>{odocsapp["percentage_fit"]}%</> : <>N/A</>}
												</article>
											</div>
										)}

										{docs && docs.length > 0 && (
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">Current Optional Document</label>
												<article className="flex flex-col text-sm">
													{docs.map((data, i) => (
														<div key={i} className="flex items-center justify-between">
															<Link
																href={data["document"]}
																target="_blank"
																className="my-1 inline-block font-bold text-primary hover:underline dark:text-white"
																download={data["document"].split("/").pop()}
															>
																<i className="fa-solid fa-download mr-2"></i>
																{data["document"].split("/").pop()}
															</Link>

															<button
																type="button"
																className={`my-1 w-auto min-w-[40px] rounded bg-red-200 px-2 py-1 text-[12px] text-red-600 hover:bg-red-600  hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-500`}
																onClick={() => delAppDocs(data["id"])}
															>
																<i className="fa-solid fa-trash"></i>
															</button>
														</div>
													))}
												</article>
											</div>
										)}

										<label
											htmlFor="uploadCV"
											className="mb-6 block cursor-pointer rounded-normal border p-6 text-center"
										>
											<p className="mb-2 text-sm">
												<span className="font-semibold text-primary dark:text-white">
													Click here to Upload Single or Multiple Optional Documents
												</span>
											</p>
											<p className="text-sm text-darkGray">Maximum File Size: 5 MB</p>
											<input
												type="file"
												className="hidden"
												id="uploadCV"
												onChange={handleODOCSFileInputChange}
												multiple
											/>
										</label>

										{odocsresume && odocsresume.length > 0 && (
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">New Optional Document</label>
												<article className="flex flex-col text-sm">
													{odocsresume.map((data, i) => (
														<div key={i} className="flex items-center justify-between">
															<button
																onClick={() => {
																	if (data) {
																		const fileUrl = URL.createObjectURL(data);
																		window.open(fileUrl, "_blank");
																	}
																}}
																className="my-1 inline-block font-bold text-primary hover:underline dark:text-white"
															>
																<i className="fa-solid fa-download mr-2"></i>
																{data["name"]}
															</button>

															<button
																type="button"
																className={`my-1 w-auto min-w-[40px] rounded bg-red-200 px-2 py-1 text-[12px] text-red-600 hover:bg-red-600  hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-500`}
																onClick={() =>
																	setodocsresume((prevArray) => {
																		// Make a copy of the previous array
																		const newArray = [...prevArray];
																		// Remove the item at the specified index
																		newArray.splice(i, 1);
																		return newArray;
																	})
																}
															>
																<i className="fa-solid fa-trash"></i>
															</button>
														</div>
													))}
												</article>
												<Button btnType="button" label="Save" handleClick={() => addAppDocs(odocsapp["arefid"])} />
											</div>
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
											<span className="text-center text-base font-semibold">
												Thank you for submitting your application. Regrettably, your resume does not meet our
												organization&apos;s requirements. We encourage you to consider applying for other positions that
												align more closely with your skills.
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
