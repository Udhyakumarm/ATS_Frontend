import Button from "@/components/Button";
import { Transition } from "@headlessui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { Fragment, useState } from "react";
import userImg from "/public/images/user-image.png";
import googleIcon from "/public/images/social/google-icon.png";
import Link from "next/link";
import moment from "moment";
import { useLangStore, useNotificationStore, useUserStore, useVersionStore } from "@/utils/code";

export default function InterviewComp({ sklLoad, data }: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [accordionOpen, setAccordionOpen] = useState(false);
	const version = useVersionStore((state: { version: any }) => state.version);

	if (sklLoad === true) {
		return (
			<>
				<div className="border-b py-6 last:border-b-0">
					<h6 className="mb-2 text-darkGray dark:text-gray-400">
						<Skeleton width={120} />
					</h6>
					<div className="mb-3 rounded border text-sm">
						<div className="flex flex-wrap items-center px-4">
							<div className="w-full px-2 py-3 lg:max-w-[25%]">
								<Skeleton width={80} />
								<Skeleton width={120} />
							</div>
							<div className="w-full px-2 py-3 lg:max-w-[25%]">
								<Skeleton width={80} />
								<Skeleton width={120} />
							</div>
							<div className="w-full px-2 py-3 lg:max-w-[25%]">
								<Skeleton width={80} />
								<Skeleton width={120} />
							</div>
							<div className="w-full py-3 lg:max-w-[10%]">
								<Skeleton width={80} height={25} />
							</div>
							<div className="w-full py-3 text-right lg:max-w-[15%]">
								<Skeleton width={80} height={25} />
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
	return (
		<>
			<div className="py-3">
				{/* <div className="border-b py-6 last:border-b-0"> */}
				{/* <h6 className="mb-2 text-darkGray dark:text-gray-400">
					<b className="text-black dark:text-white">Today:</b> 8 Feb
				</h6> */}
				<div className={"rounded border text-sm" + " " + (accordionOpen ? "border-slate-300" : "")}>
					<div className="flex flex-wrap items-center px-4">
						<div className="w-full px-2 py-3 lg:max-w-[20%]">
							<h6 className="font-bold">{srcLang==='ja' ? '求人' : 'Job'}</h6>
							<p className="text-[12px] text-darkGray dark:text-gray-400">{data["job"]["job_title"]}</p>
						</div>
						<div className="w-full px-2 py-3 lg:max-w-[25%]">
							<h6 className="font-bold">{srcLang==='ja' ? '候補者' : 'Candidate'}</h6>
							<p className="clamp_1 break-all text-[12px] text-darkGray dark:text-gray-400">
								{data["applicant"]["user"]["first_name"]}&nbsp;{data["applicant"]["user"]["last_name"]}
								&nbsp;-&nbsp;ID&nbsp;{data["applicant"]["user"]["erefid"]}
							</p>
						</div>
						<div className="w-full px-2 py-3 lg:max-w-[35%]">
							<h6 className="font-bold">{srcLang==='ja' ? '実施時間' : 'Scheduled Time'}</h6>
							<p className="text-[12px] text-darkGray dark:text-gray-400">
								{moment(data["date_time_from"]).format("DD MMM YYYY h:mm a")} to{" "}
								{moment(data["date_time_to"]).format("h:mm a")}
							</p>
						</div>
						{/* <div className="w-full px-2 py-3 lg:max-w-[25%]">
							<h6 className="font-bold">Scheduled Start Time</h6>
							<p className="text-[12px] text-darkGray dark:text-gray-400">2:00 PM to 3:00 PM</p>
						</div>
						<div className="w-full px-2 py-3 lg:max-w-[25%]">
							<h6 className="font-bold">Scheduled End Time</h6>
							<p className="text-[12px] text-darkGray dark:text-gray-400">2:00 PM to 3:00 PM</p>
						</div> */}
						<div className="w-full py-3 lg:max-w-[10%]">
							<Button
								btnStyle="sm"
								label={srcLang==='ja' ? '参加' : 'Join'}
								btnType="button"
								handleClick={() => {
									window.open(
										data["link"],
										"_blank" // <- This is what makes it open in a new window.
									);
								}}
							/>
						</div>
						{version != "starter" && (
							<div className="w-full py-3 text-right lg:max-w-[10%]">
								<button
									type="button"
									className="font-semibold text-darkGray dark:text-gray-400"
									onClick={() => setAccordionOpen(!accordionOpen)}
								>
									{srcLang==='ja' ? '詳細をみる' : 'View More'}
									<i className={"fa-solid ml-2" + " " + (accordionOpen ? "fa-chevron-up" : "fa-chevron-down")}></i>
								</button>
							</div>
						)}
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
								<div className="flex flex-wrap">
									<div className="w-full border-r md:max-w-[75%]">
										<div className="px-6 py-4">
											<div className="mb-4 flex flex-wrap">
												<div className="mr-4 w-full pr-4 lg:max-w-[25%]">
													<h6 className="font-bold">{srcLang==='ja' ? '設定者' : 'Scheduled by'}</h6>
													<p className="text-[12px] text-darkGray dark:text-gray-400">{data["user"]["email"]}</p>
												</div>
												<div className="w-full pl-4 lg:max-w-[50%]">
													<h6 className="font-bold">{srcLang==='ja' ? '求人ID' : 'Job ID'}</h6>
													<p className="text-[12px] text-darkGray dark:text-gray-400">{data["job"]["refid"]}</p>
												</div>
											</div>
											<div className="mb-4 flex flex-wrap">
												<div className="mr-4 w-full border-r pr-4 lg:max-w-[25%]">
													<h6 className="font-bold">{srcLang==='ja' ? '面接方法' : 'Interview Type'}</h6>
													<p className="text-[12px] text-darkGray dark:text-gray-400">{data["platform"]}</p>
												</div>
												<div className="w-full pl-4 lg:max-w-[50%]">
													<div className="flex items-center">
														<Image
															src={googleIcon}
															alt="Google"
															width={100}
															className="h-[30px] w-auto rounded-full object-cover"
														/>
														<aside className="pl-3 text-[12px]">
															<h5 className="font-bold">{data["platform"]}</h5>
															<Link href={data["link"]} target="_blank" className="text-primary">
																{data["link"]}
															</Link>
														</aside>
													</div>
												</div>
											</div>
											<div className="mb-4 flex flex-wrap">
												<div className="w-full">
													<h6 className="font-bold">{srcLang==='ja' ? '面接官' : 'Interviewers'}</h6>
													<ul className="mb-2 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
														{data["add_interviewer"] && data["add_interviewer"].length > 0 ? (
															data["add_interviewer"].map((data, i) =>
																i === 0 ? (
																	<li className="mr-3 list-none" key={i}>
																		{data["name"]}
																	</li>
																) : (
																	<li className="mr-3" key={i}>
																		{data["name"]}
																	</li>
																)
															)
														) : (
															<li className="mr-3 list-none">None</li>
														)}
													</ul>
												</div>
											</div>
											<div className="mb-2 flex flex-wrap">
												<div className="w-full">
													<h6 className="font-bold">{srcLang==='ja' ? '面接概要' : 'Event Name'}</h6>
													<p className="text-[12px] text-darkGray dark:text-gray-400">{data["interview_name"]}</p>
												</div>
											</div>
											<div className="flex flex-wrap">
												<div className="my-1 mr-4 last:mr-0">
													<Button btnStyle="success" label={srcLang==='ja' ? '再調整' : 'Reschedule'} />
												</div>
												<div className="my-1 mr-4 last:mr-0">
													<Button btnStyle="danger" label={srcLang==='ja' ? 'キャンセル' : 'Cancel'}  />
												</div>
											</div>
										</div>
									</div>
									<div className="w-full md:max-w-[25%]">
										<div className="border-b p-3 text-center">
											<h3 className="font-bold">{srcLang==='ja' ? 'チームメンバー' : 'Team Members'} </h3>
										</div>
										<div className="max-h-[270px] overflow-y-auto py-2">
											{data["add_interviewer"] && data["add_interviewer"].length > 0 ? (
												data["add_interviewer"].map((data, i) => (
													<div className="flex items-center px-4 py-2" key={i}>
														<Image src={userImg} alt="User" width={40} className="h-[40px] rounded-full object-cover" />
														<aside className="pl-4 text-[12px]">
															<h5 className="font-bold">{data["name"]}</h5>
															<p className="text-darkGray dark:text-gray-400">{data["role"]}</p>
														</aside>
													</div>
												))
											) : (
												<p className="text-center">{srcLang==='ja' ? 'チームメンバーがいません' : 'No Team Members'}</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</Transition.Child>
					</Transition.Root>
				</div>
			</div>
		</>
	);
}
