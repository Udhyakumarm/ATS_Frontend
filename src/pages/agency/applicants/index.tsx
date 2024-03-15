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

export default function Applicants({ atsVersion, userRole, upcomingSoon, currentUser }: any) {
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
	const [jobd, setjobd] = useState([{ id: 1, name: "Job", refid: null, unavailable: false }]);
	const [selectedJob, setSelectedJob] = useState(jobd[0]);

	const [typed, settyped] = useState([
		{ id: 1, name: "Type", value: null, unavailable: false },
		{ id: 2, name: "Career", value: "Career", unavailable: false },
		{ id: 3, name: "Vendor", value: "Vendor", unavailable: false },
		{ id: 4, name: "Refer", value: "Refer", unavailable: false }
	]);
	const [selectedType, setSelectedType] = useState(typed[0]);

	const [statusd, setstatusd] = useState([
		{ id: 1, name: "Status", value: null, unavailable: false },
		{ id: 2, name: "Sourced", value: "Sourced", unavailable: false },
		{ id: 3, name: "Interview(Optional)", value: "Interview(Optional)", unavailable: false },
		{ id: 4, name: "Share", value: "Share", unavailable: false },
		{ id: 5, name: "Interview", value: "Interview", unavailable: false },
		{ id: 6, name: "Offer", value: "Offer", unavailable: false },
		{ id: 7, name: "Hired", value: "Hired", unavailable: false },
		{ id: 8, name: "OfferDeclined", value: "OfferDeclined", unavailable: false },
		{ id: 9, name: "Rejected", value: "Rejected", unavailable: false }
	]);
	const [selectedStatus, setSelectedStatus] = useState(statusd[0]);

	const applicantlist = useApplicantStore((state: { applicantlist: any }) => state.applicantlist);
	const applicantdetail = useApplicantStore((state: { applicantdetail: any }) => state.applicantdetail);
	const setapplicantlist = useApplicantStore((state: { setapplicantlist: any }) => state.setapplicantlist);
	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const setcanid = useApplicantStore((state: { setcanid: any }) => state.setcanid);
	const setappid = useApplicantStore((state: { setappid: any }) => state.setappid);
	const setappdata = useApplicantStore((state: { setappdata: any }) => state.setappdata);
	const settype = useApplicantStore((state: { settype: any }) => state.settype);

	const visible = useNewNovusStore((state: { visible: any }) => state.visible);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	const [fapplicantList, setfapplicantList] = useState({});

	async function loadJobFiter() {
		try {
			var [res] = await Promise.all([axiosInstanceAuth2.get(`/job/list-job/`)]);

			res.data.map((job: any, i: any) => {
				if (job.jobStatus === "Active" && !jobd.some((item) => item.refid === job.refid)) {
					setjobd((oldArray) => [...oldArray, { id: i + 2, name: job.jobTitle, refid: job.refid, unavailable: false }]);
				}
			});

			console.info("data", "loadJobFiter", jobd);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}

	async function loadApplicant() {
		await axiosInstanceAuth2
			.get(`/applicant/list-agency-applicant/`)
			.then(async (res) => {
				console.log("data", "applicant list", res.data);
				setfapplicantList(res.data);
				setrefresh(2);
			})
			.catch((err) => {
				console.log("Error fetching data:", err);
				setfapplicantList({});
				setrefresh(2);
			});
	}

	async function loadApplicant2(link: any) {
		await axiosInstanceAuth2
			.get(link)
			.then(async (res) => {
				console.log("data", "applicant list", res.data);
				setfapplicantList(res.data);
				setrefresh(2);
			})
			.catch((err) => {
				console.log("Error fetching data:", err);
				setfapplicantList({});
				setrefresh(2);
			});
	}

	function getLink() {
		let link = "/applicant/list-agency-applicant/";

		link =
			link +
			`?job_refid=${selectedJob.refid}&query1=${debouncedSearchTerm}&type=${selectedType.value}&status=${selectedStatus.value}`;

		link = link.replaceAll("null", "");

		console.log("data2", "LINK", link);
		return link;
	}

	async function loadApplicant3() {
		let link = getLink();

		await axiosInstanceAuth2
			.get(link)
			.then(async (res) => {
				console.log("data", "applicant list", res.data);
				setfapplicantList(res.data);
				setrefresh(2);
			})
			.catch((err) => {
				console.log("Error fetching data:", err);
				setfapplicantList({});
				setrefresh(2);
			});
	}

	useEffect(() => {
		if (token && token.length > 0 && refresh === 0 && atsVersion && atsVersion.length > 0) {
			loadApplicant();
			loadJobFiter();
		}
	}, [token, refresh, atsVersion]);

	useEffect(() => {
		if (selectedJob && fapplicantList && fapplicantList["results"] && fapplicantList["results"].length > 0) {
			console.log("data", "selectedJob", selectedJob);
			setrefresh(1);
			loadApplicant3();
		} else {
			setrefresh(0);
		}
	}, [selectedJob]);

	useEffect(() => {
		if (selectedType && fapplicantList && fapplicantList["results"] && fapplicantList["results"].length > 0) {
			console.log("data", "selectedType", selectedType);
			setrefresh(1);
			loadApplicant3();
		} else {
			setrefresh(0);
		}
	}, [selectedType]);

	useEffect(() => {
		if (selectedStatus && fapplicantList && fapplicantList["results"] && fapplicantList["results"].length > 0) {
			console.log("data", "selectedStatus", selectedStatus);
			setrefresh(1);
			loadApplicant3();
		} else {
			setrefresh(0);
		}
	}, [selectedStatus]);

	const [search, setsearch] = useState("");
	const debouncedSearchTerm = useDebounce(search, 500);

	useEffect(() => {
		console.log("debouncedSearchTerm", debouncedSearchTerm);
		loadApplicant3();
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

	const handleCheckboxChange = (event: any, arefid: any) => {
		event.stopPropagation();
		if (event.target.checked === true) {
			if (!sc.includes(arefid)) {
				setsc([...sc, arefid]);
			}
		} else {
			if (sc.includes(arefid)) {
				const updatedValues = sc.filter((value) => value !== arefid);
				setsc(updatedValues);
			}
		}
	};
	const [sc2, setsc2] = useState([]);

	const handleCheckboxChange2 = (event: any, acrefid: any) => {
		event.stopPropagation();
		if (event.target.checked === true) {
			if (!sc2.includes(acrefid)) {
				setsc2([...sc2, acrefid]);
			}
		} else {
			if (sc2.includes(acrefid)) {
				const updatedValues = sc2.filter((value) => value !== acrefid);
				setsc2(updatedValues);
			}
		}
	};

	function disShareButton() {
		return sc.length > 0 && sc2.length > 0;
	}

	const [shareContract, setshareContract] = useState(false);
	const [publishThanks, setPublishThanks] = useState(false);
	const [fcontracts, setfcontracts] = useState([]);

	async function loadContracts() {
		await axiosInstanceAuth2
			.get(`/applicant/list-contract/`)
			.then(async (res) => {
				console.log("!-", res.data);
				setfcontracts(res.data);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	useEffect(() => {
		if (shareContract) {
			loadContracts();
		}
	}, [shareContract]);

	async function shareAppToCon() {
		const fd = new FormData();
		fd.append("aid", sc.join(","));
		fd.append("cid", sc2.join(","));
		await axiosInstanceAuth2
			.post(`/applicant/share-contract/`, fd)
			.then(async (res) => {
				console.log("!-", res.data);
				setshareContract(false);
				setsc([])
				setsc2([])
				setPublishThanks(true);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	return (
		<>
			<Head>
				<title>{t("Words.Applicants")}</title>
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
								<div className="mx-auto w-full max-w-[300px] py-8 text-center">
									<div className="mb-6 p-2">
										<Image
											src={noApplicantdata}
											alt="No Data"
											width={300}
											className="mx-auto max-h-[200px] w-auto max-w-[200px]"
										/>
									</div>
									<h5 className="mb-4 text-lg font-semibold">
										{t("Select.No")} {t("Words.Applicants")}
									</h5>
									<p className="mb-2 text-sm text-darkGray">
										{srcLang === "ja" ? (
											<>現在応募者はいません。新しい求人を投稿して応募者を獲得してください</>
										) : (
											<>There are no Applicants as of now , Post a New Job to have Applicants</>
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
												<Listbox value={selectedJob} onChange={setSelectedJob}>
													<Listbox.Button className={"mr-2 text-lg font-bold"}>
														{selectedJob["name"]} <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
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
																"absolute left-0 top-[100%] mt-2 w-[250px] rounded-normal bg-white py-2 shadow-normal dark:bg-gray-700"
															}
														>
															{jobd.length > 0 &&
																jobd.map((item) => (
																	<Listbox.Option
																		key={item.id}
																		value={item}
																		disabled={item.unavailable}
																		className="relative cursor-pointer px-6 py-2 pl-8 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	>
																		{({ selected }) => (
																			<>
																				<span className={`clamp_1 ${selected ? "font-bold" : "font-normal"}`}>
																					{item.name}
																				</span>
																				{selected ? (
																					<span className="absolute left-3 top-[10px]">
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
												<Listbox value={selectedType} onChange={setSelectedType}>
													<Listbox.Button className={"mr-2 text-lg font-bold"}>
														{selectedType["name"]} <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
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
																"absolute left-0 top-[100%] mt-2 w-[250px] rounded-normal bg-white py-2 shadow-normal dark:bg-gray-700"
															}
														>
															{typed.length > 0 &&
																typed.map((item) => (
																	<Listbox.Option
																		key={item.id}
																		value={item}
																		disabled={item.unavailable}
																		className="relative cursor-pointer px-6 py-2 pl-8 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	>
																		{({ selected }) => (
																			<>
																				<span className={`clamp_1 ${selected ? "font-bold" : "font-normal"}`}>
																					{item.name}
																				</span>
																				{selected ? (
																					<span className="absolute left-3 top-[10px]">
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
												<Listbox value={selectedStatus} onChange={setSelectedStatus}>
													<Listbox.Button className={"mr-2 text-lg font-bold"}>
														{selectedStatus["name"]} <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
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
																"absolute left-0 top-[100%] mt-2 w-[250px] rounded-normal bg-white py-2 shadow-normal dark:bg-gray-700"
															}
														>
															{statusd.length > 0 &&
																statusd.map((item) => (
																	<Listbox.Option
																		key={item.id}
																		value={item}
																		disabled={item.unavailable}
																		className="relative cursor-pointer px-6 py-2 pl-8 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	>
																		{({ selected }) => (
																			<>
																				<span className={`clamp_1 ${selected ? "font-bold" : "font-normal"}`}>
																					{item.name}
																				</span>
																				{selected ? (
																					<span className="absolute left-3 top-[10px]">
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
											<aside className="flex items-center">
												<TeamMembers selectedData={selectedJob} axiosInstanceAuth2={axiosInstanceAuth2} />
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
																className="leading-pro ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 active:opacity-85 font-base my-2 mr-3 inline-block cursor-pointer rounded-lg bg-gradient-to-tl from-cyan-500 to-indigo-600 px-4 py-2 text-center align-middle text-sm uppercase text-white transition-all hover:rotate-2 hover:scale-110 hover:bg-indigo-700 hover:text-pink-200 hover:shadow-lg"
															>
																{data}
																&nbsp;
																<span
																	className="font-bold text-red-500"
																	onClick={(e) => {
																		e.stopPropagation();
																		const updatedValues = sc.filter((value) => value !== data);
																		setsc(updatedValues);
																	}}
																>
																	X
																</span>
															</button>
														))}
													</div>
													<div>
														<Button
															label={"share"}
															btnType="button"
															btnStyle="sm"
															handleClick={() => setshareContract(true)}
														/>
													</div>
												</div>
											</>
										)}

										{fapplicantList && fapplicantList["results"] && fapplicantList["results"].length > 0 && (
											<div className="mt-8 flex h-[calc(100vh-207px)] flex-col justify-between overflow-auto bg-white p-4 py-10 dark:bg-gray-800 lg:p-8">
												<table cellPadding={"0"} cellSpacing={"0"} className="h-fit w-full min-w-[948px]">
													<thead>
														<tr>
															<th className="border-b px-3 py-2 text-left">AI rating</th>
															<th className="border-b px-3 py-2 text-left">ID</th>
															<th className="border-b px-3 py-2 text-left">name</th>
															<th className="border-b px-3 py-2 text-left">email</th>
															<th className="border-b px-3 py-2 text-left">job title</th>
															<th className="border-b px-3 py-2 text-left">status</th>
															<th className="border-b px-3 py-2 text-left">type</th>
															<th className="border-b px-3 py-2 text-left">application date</th>
															<th className="border-b px-3 py-2 text-left"></th>
														</tr>
													</thead>
													<tbody>
														{fapplicantList["results"].map((data, i) => (
															<tr key={i} className="h-auto cursor-pointer">
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setjobid(data["job"]["refid"]);
																		setappid(data["arefid"]);
																		settype(data["type"]);
																		setappdata(data);
																		window.open("applicants/detail", "_blank");
																	}}
																>
																	{data["percentage_fit"] && (
																		<span
																			className="px-2 py-1"
																			style={{
																				borderColor: getColorCode(data.percentage_fit),
																				borderWidth: ".20rem .05rem .01rem 0",
																				borderRadius: ".5rem 2rem"
																			}}
																		>
																			{data["percentage_fit"]}%
																		</span>
																	)}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setjobid(data["job"]["refid"]);
																		setappid(data["arefid"]);
																		settype(data["type"]);
																		setappdata(data);
																		window.open("applicants/detail", "_blank");
																	}}
																>
																	{data["arefid"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setjobid(data["job"]["refid"]);
																		setappid(data["arefid"]);
																		settype(data["type"]);
																		setappdata(data);
																		window.open("applicants/detail", "_blank");
																	}}
																>
																	{data["fname"]}&nbsp;{data["lname"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setjobid(data["job"]["refid"]);
																		setappid(data["arefid"]);
																		settype(data["type"]);
																		setappdata(data);
																		window.open("applicants/detail", "_blank");
																	}}
																>
																	{data["email"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setjobid(data["job"]["refid"]);
																		setappid(data["arefid"]);
																		settype(data["type"]);
																		setappdata(data);
																		window.open("applicants/detail", "_blank");
																	}}
																>
																	{data["job"]["jobTitle"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setjobid(data["job"]["refid"]);
																		setappid(data["arefid"]);
																		settype(data["type"]);
																		setappdata(data);
																		window.open("applicants/detail", "_blank");
																	}}
																>
																	{data["status"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setjobid(data["job"]["refid"]);
																		setappid(data["arefid"]);
																		settype(data["type"]);
																		setappdata(data);
																		window.open("applicants/detail", "_blank");
																	}}
																>
																	{data["type"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setjobid(data["job"]["refid"]);
																		setappid(data["arefid"]);
																		settype(data["type"]);
																		setappdata(data);
																		window.open("applicants/detail", "_blank");
																	}}
																>
																	{moment(data["created_at"]).format("MM/DD/YYYY")}
																</td>

																<td className="border-b px-3 py-2 text-right">
																	<input
																		type="checkbox"
																		checked={sc.includes(data["arefid"])}
																		onChange={(e) => handleCheckboxChange(e, data["arefid"])}
																	/>
																</td>
															</tr>
														))}
													</tbody>
												</table>

												<div className="m-2 flex items-center justify-between border-t-2 border-borderColor">
													{fapplicantList["count"] && (
														<div className="text-sm">
															{srcLang === "ja" ? "合計" : "total"} {fapplicantList["count"]} {t("Words.Applicants")},{" "}
															<>
																{srcLang === "ja" ? "現在のページ" : "Current Page"} : {fapplicantList["current_page"]}{" "}
																of {fapplicantList["total_pages"]}
															</>
														</div>
													)}
													<div className="flex justify-end gap-2">
														<Button
															btnType="button"
															btnStyle="sm"
															label={srcLang === "ja" ? "前へ" : "Previous"}
															disabled={!(fapplicantList["previous"] && fapplicantList["previous"].length > 0)}
															handleClick={() => loadApplicant2(fapplicantList["previous"])}
														/>
														<Button
															btnType="button"
															btnStyle="sm"
															label={srcLang === "ja" ? "次のページ" : "Next"}
															disabled={!(fapplicantList["next"] && fapplicantList["next"].length > 0)}
															handleClick={() => loadApplicant2(fapplicantList["next"])}
														/>
													</div>
												</div>
											</div>
										)}

										{/* <Canban
											applicantlist={applicantlist}
											atsVersion={atsVersion}
											token={token}
											setcardarefid={setcardarefid}
											setcardstatus={setcardstatus}
										/> */}
									</>
								)}
							</div>
						</>
					)}
				</main>
			)}

			<Transition.Root show={shareContract} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setshareContract}>
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
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "詳細" : "Share Applicant"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setshareContract(false)}
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
																<th className="border-b px-3 py-2 text-left">Email</th>
																<th className="border-b px-3 py-2 text-left">Company Name</th>
																<th className="border-b px-3 py-2 text-left"></th>
															</tr>
														</thead>
														<tbody>
															{fcontracts.map((data, i) => (
																<tr key={i} className="h-auto cursor-pointer">
																	<td className="border-b px-3 py-2 text-sm">{data["email"]}</td>
																	<td className="border-b px-3 py-2 text-sm">{data["cname"]}</td>
																	<td className="border-b px-3 py-2 text-right">
																		<input
																			type="checkbox"
																			checked={sc2.includes(data["acrefid"])}
																			onChange={(e) => handleCheckboxChange2(e, data["acrefid"])}
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
												label={srcLang === "ja" ? "近い" : "Share"}
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
