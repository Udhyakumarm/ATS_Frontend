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
import { addActivityLog, addNotifyJobLog, axiosInstanceOCR } from "@/pages/api/axiosApi";
import UpcomingComp from "./organization/upcomingComp";
import { useLangStore } from "@/utils/code";
import {
	LinkedinShareButton,
	TwitterShareButton,
	FacebookShareButton,
	TelegramShareButton,
	EmailShareButton
} from "react-share";

export default function JobCard_3({ job, axiosInstanceAuth2, arefid, loadRecomandedJob }: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const cancelButtonRef = useRef(null);
	const [previewPopup, setPreviewPopup] = useState(false);
	const [loader, setloader] = useState(false);

	async function applyJob(){
		setloader(true)
		const fd = new FormData();
		fd.append("refid",job.refid)
		fd.append("arefid",arefid)
		await axiosInstanceAuth2
			.post(`/ocr/recommend-apply/`,fd)
			.then(async (res) => {
				console.log("res",res.data.success)
				if (res.data["success"] === 0) {
					toastcomp("Not applied", "error");
				}
				else if (res.data["success"] === 1) {
					toastcomp("Applied successfully", "success");
				}
				setloader(false)
				loadRecomandedJob()
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("Not applied", "error");
				setloader(false);
				loadRecomandedJob()
			});
	}

	const router = useRouter();

	useEffect(() => {
		console.log("^^^", "JD", job);
	}, [job]);

	return (
		<>
			<div className="h-full rounded-normal bg-white px-3 py-2 shadow-normal dark:bg-gray-700">
				<div className="flex w-full flex-row-reverse gap-1">
					<div className="flex w-auto gap-1 flex-nowrap">
						<Button
							btnStyle="outlined"
							btnType="button"
							label={srcLang === "ja" ? "みる" : "View"}
							handleClick={() => setPreviewPopup(true)}
						/>
						<Button
							btnStyle="outlined"
							btnType="button"
							label={loader ? "" : "Apply"}
							loader={loader}
							handleClick={applyJob}
						/>
					</div>
					<div className="flex w-full flex-wrap items-center">
						<h4 className="font-bold capitalize">{job.jobTitle}</h4>
					</div>
				</div>
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
		</>
	);
}
