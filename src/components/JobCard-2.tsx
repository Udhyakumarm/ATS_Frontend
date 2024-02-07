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
import { addActivityLog, addNotifyJobLog } from "@/pages/api/axiosApi";
import UpcomingComp from "./organization/upcomingComp";
import { useLangStore } from "@/utils/code";
import {
	LinkedinShareButton,
	TwitterShareButton,
	FacebookShareButton,
	TelegramShareButton,
	EmailShareButton
} from "react-share";

export default function JobCard_2({ job, handleView, axiosInstanceAuth2, sklLoad, dashbaord, loadJob, userRole }: any) {
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

	useEffect(() => {
		console.log("^^^", "JD", job);
	}, [job]);

	function emailExists(email: any) {
		console.log("^^^", "emailExists", email);
		return job.team.some((member) => member.email === email);
	}

	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);
	const [comingSoon, setComingSoon] = useState(false);

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
				addNotifyJobLog(axiosInstanceAuth2, title, "Job", refid, `/organization/jobs/${status.toLowerCase()}/`);
				toggleLoadMode(true);

				router.push(`/organization/jobs/${status.toLowerCase()}/`);
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
							{userRole != "Hiring Manager" && (
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
															{/* temp hide naman */}
															{/* <Menu.Item>
													<button
														type="button"
														className="relative w-full cursor-pointer px-6 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
														// onClick={() => setAddCand(true)}
														onClick={() => setComingSoon(true)}
													>
														{srcLang === "ja" ? "レジュメをアップロード (pdf/doc)" : "Upload Resume (PDF/DOC)"}
													</button>
												</Menu.Item> */}
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
				<Button
					btnStyle="outlined"
					btnType="button"
					label={srcLang === "ja" ? "みる" : "View"}
					handleClick={() => router.push(`/organization/jobs/preview/${shareCN}/${job.refid}`)}
				/>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Add Applicant</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddCand(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<label
											htmlFor="uploadCV"
											className="mb-6 block cursor-pointer rounded-normal border p-6 text-center"
										>
											<h5 className="mb-2 text-darkGray">Drag and Drop Resume Here</h5>
											<p className="mb-2 text-sm">
												Or <span className="font-semibold text-primary">Click Here To Upload</span>
											</p>
											<p className="text-sm text-darkGray">Maximum File Size: 5 MB</p>
											<input type="file" className="hidden" id="uploadCV" />
										</label>
										<div className="mx-[-10px] flex flex-wrap">
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField fieldType="input" inputType="text" label="First Name" placeholder="First Name" />
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField fieldType="input" inputType="text" label="Last Name" placeholder="Last Name" />
											</div>
										</div>
										<div className="mx-[-10px] flex flex-wrap">
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField fieldType="input" inputType="email" label="Email" placeholder="Email" required />
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="number"
													label="Phone Number"
													placeholder="Phone Number"
												/>
											</div>
										</div>
										<div className="mb-4">
											<label className="mb-1 inline-block font-bold">Social Links</label>
											<div className="flex items-center">
												<div className="flex min-h-[45px] w-[calc(100%-40px)] items-center rounded-normal border border-borderColor px-3 py-1">
													<div className="text-lg">
														<i className="fa-brands fa-behance mr-5"></i>
														<i className="fa-brands fa-stack-overflow mr-5"></i>
														<i className="fa-brands fa-linkedin-in mr-5"></i>
														<i className="fa-brands fa-github mr-5"></i>
													</div>
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
										<FormField fieldType="textarea" label="Summary" placeholder="Summary" />
										<div className="mb-4">
											<label className="mb-1 inline-block font-bold">Skills</label>
											<div className="flex">
												<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor px-3 py-1">
													<div className="text-sm">
														<p className="my-1">Skill 1</p>
														<p className="my-1">Skill 2</p>
														<p className="my-1">Skill 3</p>
														<p className="my-1">Skill 4</p>
													</div>
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
											<label className="mb-1 inline-block font-bold">Education</label>
											<div className="flex">
												<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor px-3 py-1">
													{Array(2).fill(
														<article className="border-b last:border-b-0">
															<div className="flex flex-wrap text-sm">
																<div className="my-2 w-[30%]">
																	<h4 className="font-bold">XYZ Group</h4>
																</div>
																<div className="my-2 w-[70%] pl-4">
																	<p className="font-semibold">2021 Sep - 2022 Nov</p>
																</div>
															</div>
															<p className="mb-2 text-sm">
																<b>Description -</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
																eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
																quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
																aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
															</p>
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
												<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor px-3 py-1">
													{Array(2).fill(
														<article className="border-b last:border-b-0">
															<div className="flex flex-wrap text-sm">
																<div className="my-2 w-[30%]">
																	<h4 className="font-bold">XYZ Group</h4>
																</div>
																<div className="my-2 w-[70%] pl-4">
																	<p className="font-semibold">2021 Sep - 2022 Nov</p>
																</div>
															</div>
															<p className="mb-2 text-sm">
																<b>Description -</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
																eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
																quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
																aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
															</p>
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
										<hr className="mb-4 mt-8" />
										<div className="relative mb-4">
											<label htmlFor="newGraduate" className="absolute right-12 top-0 text-sm font-bold">
												<input type="checkbox" id="newGraduate" name="newGraduate" className="mb-[3px] mr-2" />
												New Graduate
											</label>
											<div className="mb-0">
												<label className="mb-1 inline-block font-bold">Education</label>
												<div className="flex">
													<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor px-3 py-1">
														{Array(2).fill(
															<article className="border-b last:border-b-0">
																<div className="flex flex-wrap text-sm">
																	<div className="my-2 w-[30%]">
																		<h4 className="font-bold">XYZ Group</h4>
																	</div>
																	<div className="my-2 w-[70%] pl-4">
																		<p className="font-semibold">2021 Sep - 2022 Nov</p>
																	</div>
																</div>
																<p className="mb-2 text-sm">
																	<b>Description -</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
																	eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
																	quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
																	Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
																</p>
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
										</div>
										<div className="mx-[-10px] flex flex-wrap">
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Current Salary"
													placeholder="Current Salary"
												/>
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Expected Salary"
													placeholder="Expected Salary"
												/>
											</div>
										</div>
										<FormField fieldType="input" inputType="text" label="Notice Period" placeholder="Notice Period" />
										<FormField fieldType="reactquill" label="Any Message to Recruiter" placeholder="Notice Period" />
										<Button label="Add" loader={false} btnType="button" />
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
