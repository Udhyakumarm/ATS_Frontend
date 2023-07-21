import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { axiosInstance } from "@/utils";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useEffect, Fragment, useRef, useState, Key } from "react";
import { useApplicantStore, useCalStore } from "@/utils/code";
import Button from "@/components/Button";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import Image from "next/image";
import userImg from "/public/images/user-image.png";
import socialIcon from "/public/images/social/linkedin-icon.png";
import boardIcon from "/public/images/board-icon.png";
import FormField from "@/components/FormField";
import { Menu } from "@headlessui/react";
import TeamMembers from "@/components/TeamMembers";
import moment from "moment";
import Canban from "@/components/organization/applicant/Canban";
import ChatAssistance from "@/components/ChatAssistance";
import noApplicantdata from "/public/images/no-data/iconGroup-2.png";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { useNovusStore } from "@/utils/novus";
import googleIcon from "/public/images/social/google-icon.png";
import TImeSlot from "@/components/TimeSlot";

const CalendarIntegrationOptions = [
	{ provider: "Google Calendar", icon: googleIcon, link: "/api/integrations/gcal/create" }
];

export default function Applicants({ atsVersion, userRole, upcomingSoon }: any) {
	const router = useRouter();

	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);

	const cancelButtonRef = useRef(null);
	const [createBoard, setCreateBoard] = useState(false);

	const applicantlist = useApplicantStore((state: { applicantlist: any }) => state.applicantlist);
	const applicantdetail = useApplicantStore((state: { applicantdetail: any }) => state.applicantdetail);
	const setapplicantlist = useApplicantStore((state: { setapplicantlist: any }) => state.setapplicantlist);
	const jobid = useApplicantStore((state: { jobid: any }) => state.jobid);
	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const canid = useApplicantStore((state: { canid: any }) => state.canid);
	const setcanid = useApplicantStore((state: { setcanid: any }) => state.setcanid);
	const setappid = useApplicantStore((state: { setappid: any }) => state.setappid);
	const setappdata = useApplicantStore((state: { setappdata: any }) => state.setappdata);
	const settype = useApplicantStore((state: { settype: any }) => state.settype);
	const setanimation = useNovusStore((state: { setanimation: any }) => state.setanimation);
	const setkanbanAID = useNovusStore((state: { setkanbanAID: any }) => state.setkanbanAID);

	const listOfApplicant = useNovusStore((state: { listOfApplicant: any }) => state.listOfApplicant);
	const setlistOfApplicant = useNovusStore((state: { setlistOfApplicant: any }) => state.setlistOfApplicant);

	//int
	const integration = useCalStore((state: { integration: any }) => state.integration);
	const setIntegration = useCalStore((state: { setIntegration: any }) => state.setIntegration);

	const [jobd, setjobd] = useState([{ id: 1, name: "All", refid: "ALL", unavailable: false }]);

	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [refresh, setrefresh] = useState(0);
	const [joblist, setjoblist] = useState(0);
	const [selectedJob, setSelectedJob] = useState(jobd[0]);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	const [applicantList, setapplicantList] = useState([]);
	// await axiosInstance.api
	// 			.get("/job/list-job", { headers: { authorization: "Bearer " + session?.accessToken } })
	// 			.then((response) => {
	// 				let arr = [];

	// 				response.data.map((job: any) => job.jobStatus === "Active" && arr.push(job));

	// 				setActiveJobs(arr);
	// 				setFActiveJobs(arr);
	// 				console.log("&", "jobs", arr);
	// 			})
	// 			.catch((error) => {
	// 				console.log({ error });
	// 				return null;
	// 			});

	async function loadJobFiter() {
		try {
			let arr = [];
			var [res] = await Promise.all([axiosInstanceAuth2.get(`/job/list-job/`)]);

			let jobsArr = [{ id: 1, name: "All", refid: "ALL", unavailable: false }];
			res.data.map(
				(job: any, i: any) =>
					job.jobStatus === "Active" &&
					jobsArr.push({ id: i + 2, name: job.jobTitle, refid: job.refid, unavailable: false })
			);

			console.info("data", "applicant filter", jobsArr);
			setjobd(jobsArr);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}

	async function loadApplicant() {
		try {
			let arr = [];
			var [res1, res2] = await Promise.all([
				axiosInstanceAuth2.get(`/job/listapplicant/`),
				axiosInstanceAuth2.get(`/job/listvendorapplicant/`)
			]);

			arr = res1.data
				.map((data: any) => ({ ...data, type: "career" }))
				.concat(res2.data.map((data: any) => ({ ...data, type: "vendor" })));

			arr = arr.sort((a, b) => b.percentage_fit - a.percentage_fit);

			console.info("data", "applicant list", arr);
			setapplicantlist(arr);
			setapplicantList(arr);
			setrefresh(2);
		} catch (error) {
			setapplicantlist([]);
			setapplicantList([]);
			setrefresh(2);

			console.error("Error fetching data:", error);
		}
	}

	useEffect(() => {
		if (token && token.length > 0 && refresh === 0) {
			loadJobFiter();
			loadApplicant();
		}
	}, [token, refresh]);

	useEffect(() => {
		console.log("applicantdetail", applicantdetail);
		console.log("applicantlist", applicantlist);
	}, [applicantdetail, applicantlist]);

	useEffect(() => {
		setrefresh(0);
	}, [listOfApplicant]);

	const [cardarefid, setcardarefid] = useState("");
	const [cardstatus, setcardstatus] = useState("");

	//work
	useEffect(() => {
		if (cardstatus.length > 0) {
			if (cardstatus === "Interview" && cardarefid.length > 0) {
				setIsCalendarOpen(true);
				// setanimation(true);
				// setkanbanAID(cardarefid);
				// setTimeout(() => {
				// 	setanimation(false);
				// 	setkanbanAID("");
				// }, 10000);
			}
		}
	}, [cardstatus]);

	function getAverage(num: any) {
		return (num / tApp) * 100;
	}
	function getColor(num: any) {
		num = (num / tApp) * 100;
		if (num > 66) {
			return "#58E700";
		} else if (num > 33 && num <= 66) {
			return "#FFF616";
		} else {
			return "#FE8F66";
		}
	}

	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	// const [integration, setIntegration] = useState([]);

	//timeslot

	return (
		<>
			<Head>
				<title>{t("Words.Applicants")}</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<Orgsidebar />
				<Orgtopbar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>

				{refresh === 2 && applicantlist && applicantlist.length < 0 ? (
					<div className="layoutWrap p-4 lg:p-8">
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
								{/* <Link href={'/organization/jobs/create'} className="my-2 min-w-[60px] inline-block rounded py-2 px-3 text-white text-[14px] bg-gradient-to-b from-gradLightBlue to-gradDarkBlue hover:from-gradDarkBlue hover:to-gradDarkBlue">{t('Words.PostNewJob')}</Link> */}
							</div>
						</div>
					</div>
				) : (
					<>
						{atsVersion === "starter" && refresh === 2 ? (
							<div className="layoutWrap p-4 lg:p-8">
								<div className="rounded-normal bg-white p-6 shadow-normal dark:bg-gray-800">
									<h2 className="mb-6 text-lg font-bold">{srcLang === "ja" ? "すべての応募" : "All Applicants"}</h2>
									<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
										<thead>
											<tr>
												<th className="border-b px-3 py-2 text-center text-sm">{t("Form.FullName")}</th>
												<th className="border-b px-3 py-2 text-center text-sm">ID</th>
												<th className="border-b px-3 py-2 text-center text-sm">{t("Words.Source")}</th>
												<th className="border-b px-3 py-2 text-center text-sm">{t("Form.Email")}</th>
												<th className="border-b px-3 py-2 text-center text-sm">{t("Form.NoticePeriod")}</th>
												<th className="border-b px-3 py-2 text-center text-sm">{t("Words.Status")}</th>
												<th className="border-b px-3 py-2 text-center text-sm">{t("Words.Profile")}</th>
											</tr>
										</thead>
										<tbody>
											{applicantlist &&
												applicantlist.length > 0 &&
												applicantlist.map((data, i) => (
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600" key={i}>
														<td className="px-3 py-2 text-center text-[12px]">
															<button
																type="button"
																className="rounded px-3 py-2 hover:bg-gradDarkBlue hover:text-white"
															>
																{data["type"] === "career" && (
																	<>
																		{data["user"]["first_name"]} {data["user"]["last_name"]}
																	</>
																)}
																{data["type"] === "vendor" && (
																	<>
																		{data["applicant"]["first_name"]} {data["applicant"]["last_name"]}
																	</>
																)}
															</button>
														</td>
														<td className="px-3 py-2 text-center text-[12px]">
															<button
																type="button"
																className="rounded px-3 py-2 hover:bg-gradDarkBlue hover:text-white"
															>
																{data["arefid"]}
															</button>
														</td>
														<td className="px-3 py-2 text-center text-[12px]">{data["type"]}</td>
														<td className="px-3 py-2 text-center text-[12px]">
															<span className="break-all">
																{data["type"] === "career" && data["user"]["email"]}
																{data["type"] === "vendor" && data["applicant"]["email"]}
															</span>
														</td>
														<td className="px-3 py-2 text-center text-[12px]">
															{data["type"] === "career" && data["user"]["notice_period"]}
															{data["type"] === "vendor" && data["applicant"]["notice_period"]}
														</td>
														<td className="px-3 py-2 text-center text-[12px]">
															{data["status"] === "Shortlisted" ? (
																<span
																	className="inline-block min-w-[110px] rounded-lg border px-4 py-1 text-center text-[12px]"
																	style={{
																		["border-color" as any]: `#4ea818`,
																		["color" as any]: `#4ea818`
																	}}
																>
																	{data["status"]}
																</span>
															) : (
																<>
																	{data["status"] === "Rejected" ? (
																		<span
																			className="inline-block min-w-[110px] rounded-lg border px-4 py-1 text-center text-[12px]"
																			style={{
																				["border-color" as any]: `#FE8F66`,
																				["color" as any]: `#FE8F66`
																			}}
																		>
																			{data["status"]}
																		</span>
																	) : (
																		<span
																			className="inline-block min-w-[110px] rounded-lg border px-4 py-1 text-center text-[12px]"
																			style={{
																				["border-color" as any]: `#a9a30d`,
																				["color" as any]: `#a9a30d`
																			}}
																		>
																			{data["status"]}
																		</span>
																	)}
																</>
															)}
														</td>
														<td className="px-3 py-2 text-center text-[12px]">
															<Button
																btnStyle="sm"
																label={srcLang === "ja" ? "閲覧する" : "View"}
																btnType="button"
																handleClick={() => {
																	setjobid(data["job"]["refid"]);
																	// setcanid(data["user"]["erefid"]);
																	setappid(data["arefid"]);
																	settype(data["type"]);
																	setappdata(data);
																	router.push("applicants/detail");
																}}
															/>
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							</div>
						) : (
							<div className="layoutWrap">
								{upcomingSoon && (
									<div className="relative z-[2] flex flex-wrap items-center justify-between bg-white px-4 py-4 shadow-normal dark:bg-gray-800 lg:px-8">
										<div className="mr-3">
											<Listbox value={selectedJob} onChange={setSelectedJob}>
												<Listbox.Button className={"text-lg font-bold"}>
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
																			<span className={`clamp_1 ${selected ? "font-bold" : "font-normal"}`}>{item.name}</span>
																			{selected ? (
																				<span className="absolute top-[10px] left-3">
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
										<aside className="flex items-center">
											<div className="mr-4 flex items-center">
												<p className="mr-3 font-semibold">Add Board</p>
												<button
													type="button"
													className="h-7 w-7 rounded bg-gray-400 text-sm text-white hover:bg-gray-700"
													onClick={() => setCreateBoard(true)}
												>
													<i className="fa-solid fa-plus"></i>
												</button>
											</div>
											<TeamMembers alen={applicantlist.length} />
											{/* <div className="flex items-center">
									<div className="-mr-4">
										<Image src={userImg} alt="User" width={40} className="h-[40px] rounded-full object-cover" />
									</div>
									<div className="-mr-4">
										<Image src={userImg} alt="User" width={40} className="h-[40px] rounded-full object-cover" />
									</div>
									<Menu as="div" className="relative flex">
										<Menu.Button className={"relative"}>
											<Image src={userImg} alt="User" width={40} className="h-[40px] rounded-full object-cover" />
											<span className="absolute left-0 top-0 block flex h-full w-full items-center justify-center rounded-full bg-[rgba(0,0,0,0.5)] text-sm text-white">
												{applicantlist && <>+{applicantlist.length}</>}
											</span>
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
													"absolute right-0 top-[100%] mt-2 max-h-[400px] w-[250px] overflow-y-auto rounded-normal bg-white py-2 shadow-normal"
												}
											>
												<Menu.Item>
													<div className="p-3">
														<h6 className="border-b pb-2 font-bold">Team Members</h6>
														<div>
															{Array(5).fill(
																<div className="mt-4 flex items-center">
																	<Image
																		src={userImg}
																		alt="User"
																		width={40}
																		className="h-[40px] rounded-full object-cover"
																	/>
																	<aside className="pl-4 text-sm">
																		<h5 className="font-bold">Anne Jacob</h5>
																		<p className="text-darkGray">Hiring Manager</p>
																	</aside>
																</div>
															)}
														</div>
													</div>
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
								</div> */}
										</aside>
									</div>
								)}
								{refresh === 2 && (
									<Canban
										applicantlist={applicantlist}
										token={token}
										setcardarefid={setcardarefid}
										setcardstatus={setcardstatus}
									/>
								)}
							</div>
						)}
					</>
				)}
			</main>
			<Transition.Root show={createBoard} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setCreateBoard}>
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
										<h4 className="flex items-center font-semibold leading-none">
											<Image src={boardIcon} alt="Add" width={24} className="mr-3" />
											Add Board
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setCreateBoard(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<FormField
											fieldType="input"
											inputType="text"
											label="Board Title"
											placeholder="Assign new board title"
										/>
										<div className="text-center">
											<Button label={t("Btn.Save")} />
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={isCalendarOpen} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setIsCalendarOpen}>
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
								{integration && integration.length <= 0 ? (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-md">
										<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
											<h4 className="font-semibold leading-none">Integrate Calendar</h4>
											<button
												type="button"
												className="leading-none hover:text-gray-700"
												onClick={() => setIsCalendarOpen(false)}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										</div>
										<div className="p-8">
											<div className="flex flex-wrap">
												{CalendarIntegrationOptions.map((integration, i) => (
													<div key={i} className="my-2 w-full overflow-hidden rounded-normal border">
														<Link
															href={integration.link}
															className="flex w-full items-center justify-between p-4 hover:bg-lightBlue"
														>
															<Image
																src={integration.icon}
																alt={integration.provider}
																width={150}
																className="mr-4 max-h-[24px] w-auto"
															/>
															<span className="min-w-[60px] rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-2 py-1 text-[12px] text-white hover:from-gradDarkBlue hover:to-gradDarkBlue">
																{`Integrate ${integration.provider}`}
															</span>
														</Link>
													</div>
												))}
											</div>
										</div>
									</Dialog.Panel>
								) : (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-md">
										<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
											<h4 className="font-semibold leading-none">Schedule Interview</h4>
											<button
												type="button"
												className="leading-none hover:text-gray-700"
												onClick={() => setIsCalendarOpen(false)}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										</div>
										<div className="p-8">
											<TImeSlot
												cardarefid={cardarefid}
												axiosInstanceAuth2={axiosInstanceAuth2}
												setIsCalendarOpen={setIsCalendarOpen}
												type={"interview"}
											/>
										</div>
									</Dialog.Panel>
								)}
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
