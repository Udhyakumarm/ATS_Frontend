import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import HeaderBar from "@/components/HeaderBar";
import Link from "next/link";
import { addExternalNotifyLog, axiosInstance, axiosInstance2, axiosInstanceAuth } from "@/pages/api/axiosApi";
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
import { Combobox, Dialog, Menu, Tab, Transition } from "@headlessui/react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { EmailShareButton, FacebookShareButton, LinkedinShareButton } from "react-share";
import TwitterShareButton from "react-share/lib/TwitterShareButton";
import TelegramShareButton from "react-share/lib/TelegramShareButton";
import OrgRSideBar from "@/components/organization/RSideBar";
import { useNewNovusStore } from "@/utils/novus";

export default function RecPreivew(props) {
	const { t } = useTranslation("common");
	const cancelButtonRef = useRef(null);
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [sklLoad] = useState(true);
	const { data: session } = useSession();
	const router = useRouter();
	const { detail } = router.query;
	const orgdetail = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);

	const [jdata, setjdata] = useState({});
	const [cname, setcname] = useState("");

	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	const [token, settoken] = useState("");
	const [btndis, setbtndis] = useState(false);
	const [mainShareJob, mainShareJobOpen] = useState(false);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);
	useEffect(() => {
		// setjid(detail)
		loadJobDetail(detail);
	}, [detail]);
	async function loadJobDetail(refid: any) {
		await axiosInstance2
			.get(`/job/detail-job/${refid}/`)
			.then((res) => {
				toastcomp("job load", "success");
				setjdata(res.data[0]);
			})
			.catch((err) => {
				console.log("@", err);
			});
	}

	async function loadOrganizationProfile() {
		await axiosInstanceAuth2
			.get(`/organization/listorganizationprofile/`)
			.then(async (res) => {
				setcname(res.data[0]["user"]["company_name"]);
			})
			.catch((err) => {
				console.log("@", "oprofile", err);
			});
	}
	useEffect(() => {
		if (token && token.length > 0) {
			loadOrganizationProfile();
		}
	}, [token]);
	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	async function statusUpdate(status: string, refid: string) {
		const formData = new FormData();
		formData.append("jobStatus", status);
		await axiosInstanceAuth2
			.put(`/job/update-job/${refid}/`, formData)
			.then((res) => {
				toastcomp(`${status} Successfully`, "success");

				let aname = `${job.job_title} Job is now ${status} by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;
				let title = `${userState[0]["name"]} (${userState[0]["email"]}) has ${status} a Job`;

				addActivityLog(axiosInstanceAuth2, aname);
				addNotifyJobLog(axiosInstanceAuth2, title, "Job", refid);
				toggleLoadMode(true);

				router.push(`/organization/jobs/${status.toLowerCase()}/`);
			})
			.catch((err) => {
				toastcomp(`${status} Not Successfully`, "error");
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
			<main>
				<OrgSideBar />
				<OrgTopBar />
				{token && token.length > 0 && <OrgRSideBar axiosInstanceAuth2={axiosInstanceAuth2} />}
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className={`layoutWrap p-4` + " " + (visible && "mr-[calc(27.6%+1rem)]")}>
					{/* <div className="container flex flex-wrap"> */}
					{jdata && (
						<div className="w-full">
							<div className="mb-6 rounded-normal bg-white shadow-normal dark:bg-gray-800">
								<div className="flex justify-between overflow-hidden rounded-t-normal">
									<HeaderBar handleBack={() => router.back()} />
									<div className="text-md flex gap-2">
										<button
											type="button"
											onClick={() => mainShareJobOpen(true)}
											className="flex cursor-pointer items-center justify-center gap-1 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
										>
											<i className="fa-solid fa-share"></i>
											<div className="whitespace-nowrap">{srcLang === "ja" ? "求人を編集" : "Share Job"}</div>
										</button>
										{jdata.jobStatus === "Active" && (
											<>
												<button
													type="button"
													className="flex cursor-pointer items-center justify-center gap-1 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
													onClick={(e) => {
														router.push(`/organization/jobs/edit/${jdata.refid}`);
													}}
												>
													<i className="fa-solid fa-pen"></i>
													<div className="whitespace-nowrap">{srcLang === "ja" ? "求人を編集" : "Edit Job"}</div>
												</button>
												<button
													type="button"
													className="flex cursor-pointer items-center justify-center gap-1 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
													onClick={(e) => {
														router.push(`/organization/jobs/clone/${jdata.refid}`);
													}}
												>
													<i className="fa-solid fa-clone"></i>
													<div className="whitespace-nowrap">{srcLang === "ja" ? "求人を複製" : "Clone Job"}</div>
												</button>
												<button
													type="button"
													className="flex cursor-pointer items-center justify-center gap-1 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
													onClick={() => statusUpdate("Archived", jdata.refid)}
												>
													<i className="fa-solid fa-box-archive"></i>
													<div className="whitespace-nowrap">
														{srcLang === "ja" ? "求人をアーカイブ" : "Archieve Job"}
													</div>
												</button>
												<button
													type="button"
													className="flex cursor-pointer items-center justify-center gap-1 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
													onClick={() => statusUpdate("Closed", jdata.refid)}
												>
													<i className="fa-solid fa-trash"></i>
													<div className="whitespace-nowrap">{srcLang === "ja" ? "求人をクローズ" : "Delete Job"}</div>
												</button>
											</>
										)}

										{(jdata.jobStatus === "Draft" || jdata.jobStatus === "Archived") && (
											<>
												<button
													type="button"
													className="flex cursor-pointer items-center justify-center gap-1 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
													onClick={(e) => {
														router.push(`/organization/jobs/edit/${jdata.refid}`);
													}}
												>
													<i className="fa-solid fa-pen"></i>
													<div className="whitespace-nowrap">{srcLang === "ja" ? "求人を編集" : "Edit Job"}</div>
												</button>
												<button
													type="button"
													className="flex cursor-pointer items-center justify-center gap-1 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
													onClick={(e) => {
														router.push(`/organization/jobs/clone/${jdata.refid}`);
													}}
												>
													<i className="fa-solid fa-clone"></i>
													<div className="whitespace-nowrap">{srcLang === "ja" ? "求人を複製" : "Clone Job"}</div>
												</button>
												<button
													type="button"
													className="flex cursor-pointer items-center justify-center gap-1 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
													onClick={() => statusUpdate("Closed", jdata.refid)}
												>
													<i className="fa-solid fa-trash"></i>
													<div className="whitespace-nowrap">{srcLang === "ja" ? "求人をクローズ" : "Delete Job"}</div>
												</button>
											</>
										)}

										{jdata.jobStatus === "Closed" && (
											<>
												<button
													type="button"
													className="flex cursor-pointer items-center justify-center gap-1 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
													onClick={(e) => {
														router.push(`/organization/jobs/clone/${jdata.refid}`);
													}}
												>
													<i className="fa-solid fa-clone"></i>
													<div className="whitespace-nowrap">{srcLang === "ja" ? "求人を複製" : "Clone Job"}</div>
												</button>
											</>
										)}

										{/*
										<Menu as="div" className="text-md relative mr-6 inline-block">
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
												
													

													{jdata.jobStatus === "Draft" && (
														<>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={(e) => {
																		router.push(`edit/${jdata.refid}`);
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
																		router.push(`clone/${jdata.refid}`);
																	}}
																>
																	{srcLang === "ja" ? "求人を複製" : "Clone Job"}
																</button>
															</Menu.Item>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={() => statusUpdate("Closed", jdata.refid)}
																>
																	{srcLang === "ja" ? "求人をクローズ" : "Delete Job"}
																</button>
															</Menu.Item>
														</>
													)}

													{jdata.jobStatus === "Archived" && (
														<>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={(e) => {
																		router.push(`edit/${jdata.refid}`);
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
																		router.push(`clone/${jdata.refid}`);
																	}}
																>
																	{srcLang === "ja" ? "求人を複製" : "Clone Job"}
																</button>
															</Menu.Item>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={() => statusUpdate("Closed", jdata.refid)}
																>
																	{srcLang === "ja" ? "求人をクローズ" : "Delete Job"}
																</button>
															</Menu.Item>
														</>
													)}

													{jdata.jobStatus === "Closed" && (
														<>
															<Menu.Item>
																<button
																	type="button"
																	className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																	onClick={(e) => {
																		router.push(`clone/${jdata.refid}`);
																	}}
																>
																	{srcLang === "ja" ? "求人を複製" : "Clone Job"}
																</button>
															</Menu.Item>
														</>
													)} 
												</Menu.Items>
											</Transition>
										</Menu>*/}
									</div>
								</div>
								<div className="px-8 py-4">
									<h3 className="mb-4 text-lg font-bold">
										{jdata["jobTitle"]} ({jdata["jobWorktype"]})
									</h3>
									{jdata["jobEmploymentType"] && jdata["jobCurrency"] && jdata["jobVacancy"] && (
										<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
											{jdata["jobEmploymentType"] && <li className="mr-4">{jdata["jobEmploymentType"]}</li>}
											{jdata["jobCurrency"] && jdata["jobFromSalary"] && jdata["jobToSalary"] && (
												<li className="mr-4">
													{jdata["jobCurrency"]} {jdata["jobFromSalary"]} to {jdata["jobToSalary"]}
												</li>
											)}
											{jdata["jobVacancy"] && <li className="mr-4">Vacancy - {jdata["jobVacancy"]}</li>}
										</ul>
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
	console.log("#", context.query);
	const { cname } = context.query;
	const { detail } = context.query;

	var ftitle = "";
	var otitle = "";
	var oimg = "";
	var odescription = "";
	var ourl = "https://ats.somhako.com/organization/" + cname + "/job-detail/" + detail;
	var tsite = "https://ats.somhako.com/organization/" + cname + "/job-detail/" + detail;
	var tcard = "photo";
	var ttitle = "";
	var tdesc = "";
	var timg = "";
	const translations = await serverSideTranslations(context.locale, ["common"]);
	await axiosInstance
		.get(`/job/detail-job/${detail}/`)
		.then(async (res) => {
			// console.log(res.data)
			var arr = res.data;
			ftitle = arr[0]["jobTitle"];
			otitle = arr[0]["jobTitle"];
			odescription = arr[0]["jobLocation"];
			tdesc = arr[0]["jobLocation"];

			// "https://somhako-marketplace.s3.ap-northeast-1.amazonaws.com/media/linkedin-somhako-xs.jpg"
			ttitle = arr[0]["jobTitle"];

			// "https://somhako-marketplace.s3.ap-northeast-1.amazonaws.com/media/linkedin-somhako-xs.jpg"

			await axiosInstance.get(`/organization/get/organizationprofilecid/carrier/${cname}/`).then(async (res) => {
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
			console.log("err");
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

RecPreivew.noAuth = true;
