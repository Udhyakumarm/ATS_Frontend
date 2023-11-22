import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Head from "next/head";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import postedJobsIcon from "/public/images/icons/post-new-job.png";
import bulbIcon from "/public/images/icons/bulb.png";
import folderIcon from "/public/images/icons/folder.png";
import sourcedIcon from "/public/images/icons/sourced.png";
import calendarIcon from "/public/images/icons/calendar.png";
import thumbsUpIcon from "/public/images/icons/thumbs-up.png";
import thumbsDownIcon from "/public/images/icons/thumbs-down.png";
import FormField from "@/components/FormField";
import bambooHrIcon from "/public/images/social/bambooHr-icon.png";
import linkedInIcon from "/public/images/social/linkedin-icon.png";
import UpcomingComp from "@/components/organization/upcomingComp";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import nodata_2 from "/public/images/no-data/icon-2.png";
import AnalyticsChart from "@/components/organization/AnalyticsChart";
import SourceChart from "@/components/organization/SourceChart";
import ColumnChart from "@/components/organization/ColumnChart";
import PermiumComp from "@/components/organization/premiumComp";
import FunnelChart from "@/components/organization/FunnelChart";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { useNewNovusStore } from "@/utils/novus";
import OrgRSideBar from "@/components/organization/RSideBar";

export default function Analytics({ atsVersion, userRole, upcomingSoon, currentUser }: any) {
	useEffect(() => {
		if (currentUser.is_expired) {
			router.push("/organization/settings/pricing");
		}
	}, [currentUser]);
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [sklLoad] = useState(true);
	const tabHeading_1 = [
		{
			title: t("Words.Overview"),
			hide: false
		},
		{
			title: t("Words.Performance"),
			hide: true
		}
	];

	const [quickLinkData, setquickLinkData] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
	const quicklinks = [
		{
			name: (
				<>
					{srcLang === "ja" ? (
						"求人公開数"
					) : (
						<>
							Jobs <br /> Posted
						</>
					)}
				</>
			),
			icon: postedJobsIcon
		},
		{
			name: (
				<>
					{srcLang === "ja" ? (
						"公開中の求人"
					) : (
						<>
							Active <br /> Jobs
						</>
					)}
				</>
			),
			icon: bulbIcon
		},
		{
			name: (
				<>
					{srcLang === "ja" ? (
						"アーカイブ求人"
					) : (
						<>
							Archive <br /> Jobs
						</>
					)}
				</>
			),
			icon: folderIcon
		},
		{
			name: (
				<>
					{srcLang === "ja" ? (
						"ドラフトジョブ"
					) : (
						<>
							Draft <br /> Jobs
						</>
					)}
				</>
			),
			icon: folderIcon
		},
		{
			name: (
				<>
					{srcLang === "ja" ? (
						"応募数"
					) : (
						<>
							Sourced <br /> Applicants
						</>
					)}
				</>
			),
			icon: sourcedIcon
		},
		{
			name: (
				<>
					{srcLang === "ja" ? (
						"面接調整数"
					) : (
						<>
							Interview <br /> Scheduled
						</>
					)}
				</>
			),
			icon: calendarIcon
		},
		{
			name: (
				<>
					{srcLang === "ja" ? (
						"入社までの平均日数"
					) : (
						<>
							Hire <br /> Applicants
						</>
					)}
				</>
			),
			icon: thumbsUpIcon
		},
		{
			name: (
				<>
					{srcLang === "ja" ? (
						"選考終了までの平均日数"
					) : (
						<>
							Rejected <br /> Applicants
						</>
					)}
				</>
			),
			icon: thumbsDownIcon
		}
	];

	const router = useRouter();
	const { data: session } = useSession();
	const [token, settoken] = useState("");

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);
	const [hiringAnalytics, sethiringAnalytics] = useState([]);
	const [interviewAnalytics, setinterviewAnalytics] = useState([]);
	const [tapp, settapp] = useState(0);
	const [analyticsSource, setanalyticsSource] = useState([]);
	const [analyticsColumn, setanalyticsColumn] = useState([]);
	const [analyticsFunnel, setanalyticsFunnel] = useState([]);

	async function loadAnalytics() {
		await axiosInstanceAuth2
			.get(`/organization/get_analytics/`)
			.then(async (res) => {
				console.log("$", res.data);
				// setactivityLog(res.data);
				// setapplicantDetail(res.data["Applicants"]);
				// settApp(res.data["Applicants"]["totalApplicants"]);
				// setsApp(res.data["Applicants"]["sourced"]);
				// setrApp(res.data["Applicants"]["review"]);
				// setiApp(res.data["Applicants"]["interview"]);
				// setshApp(res.data["Applicants"]["shortlisted"]);
				// setoApp(res.data["Applicants"]["offer"]);
				// sethApp(res.data["Applicants"]["hired"]);
				// setreApp(res.data["Applicants"]["rejected"]);

				// setrecentJob(res.data["recentJob"]);
				// setupcomingInterview(res.data["Interview"]);
				sethiringAnalytics(res.data["HiringAnalytics"]);
				setinterviewAnalytics(res.data["InterviewAnalytics"]);
				setanalyticsSource(res.data["AnalyticsSource"]);
				setanalyticsColumn(res.data["AnalyticsColumn"]);
				setanalyticsFunnel(res.data["AnalyticsFunnel"]);
				let arr = [];
				arr.push(res.data["Jobs"]["total"]);
				arr.push(res.data["Jobs"]["Active"]);
				arr.push(res.data["Jobs"]["Archive"]);
				arr.push(res.data["Jobs"]["Draft"]);
				arr.push(res.data["Applicants"]["sourced"]);
				arr.push(res.data["AInterview"].length);
				arr.push(res.data["Applicants"]["hired"]);
				arr.push(res.data["Applicants"]["rejected"]);
				setquickLinkData(arr);
				settapp(res.data["Applicants"]["totalApplicants"]);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	useEffect(() => {
		if (token && token.length > 0) {
			loadAnalytics();
		}
	}, [token]);
	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	return (
		<>
			<Head>
				<title>{t("Words.Analytics")}</title>
			</Head>
			{currentUser && !currentUser.is_expired && (
				<main>
					<OrgSideBar />
					<OrgTopBar />
					{token && token.length > 0 && <OrgRSideBar axiosInstanceAuth2={axiosInstanceAuth2} />}
					<div
						id="overlay"
						className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
					></div>
					<div className={`layoutWrap p-4` + " " + (visible && "mr-[calc(27.6%+1rem)]")}>
						<div className="rounded-normal bg-white shadow-normal dark:bg-gray-800">
							<Tab.Group>
								<div className={"border-b px-4 pt-3"}>
									<Tab.List className={"mx-auto w-full max-w-[1100px]"}>
										{tabHeading_1.map((item, i) => (
											<Tab key={i} as={Fragment}>
												{({ selected }) => (
													<button
														className={
															"mr-16 border-b-4 py-3 font-semibold focus:outline-none" +
															" " +
															(selected
																? "border-primary text-primary dark:border-white dark:text-white"
																: "border-transparent text-darkGray dark:text-gray-400") +
															" " +
															(item.hide && "display-none")
														}
													>
														{item.title}
													</button>
												)}
											</Tab>
										))}
									</Tab.List>
								</div>
								<Tab.Panels className={"mx-auto w-full max-w-[1100px] px-4 py-8"}>
									<Tab.Panel>
										<div className="mb-6 rounded-normal border p-10 pb-4 dark:border-gray-400">
											<div className="-mx-3 flex flex-wrap">
												{quicklinks.map((item, i) => (
													<div className="mb-6 w-full px-3 md:max-w-[33.3333%] 2xl:max-w-[25%]" key={i}>
														<div className="flex h-full items-start rounded-normal border p-6 shadow-normal dark:border-gray-400">
															<div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded bg-[#B2E3FF] p-3">
																<Image src={item.icon} alt={"Icon"} width={30} height={30} />
															</div>
															<aside>
																<span className="mb-4 block font-semibold text-darkGray dark:text-gray-400">
																	{item.name}
																</span>
																<h4 className="text-3xl font-bold">{quickLinkData[i]}</h4>
															</aside>
														</div>
													</div>
												))}
											</div>
										</div>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-6 w-full px-3 xl:max-w-[50%]">
												<div className="h-full rounded-normal border shadow-normal dark:border-gray-400">
													<div className="flex min-h-[80px] items-center border-b p-4 dark:border-gray-400">
														<h2 className="grow font-bold">{t("Words.ApplicantPipeline")}</h2>
														{/* <div className="w-[180px]">
														<FormField fieldType="select" placeholder={t("Words.AllApplicants")} />
													</div> */}
													</div>
													<div className="p-8">
														{analyticsFunnel && analyticsFunnel.length > 0 && tapp > 0 ? (
															<FunnelChart data={analyticsFunnel} />
														) : (
															<div className="py-8 text-center">
																<div className="mx-auto mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-200 p-2">
																	<Image
																		src={nodata_2}
																		alt="No Data"
																		width={300}
																		className="max-h-[60px] w-auto max-w-[60px]"
																	/>
																</div>
																<p className="text-sm text-darkGray">
																	{srcLang === "ja" ? "応募者のパイプラインがありません" : "No Applicant Pipeline"}
																</p>
															</div>
														)}
													</div>
												</div>
											</div>
											<div className="mb-6 w-full px-3 xl:max-w-[50%]">
												<div className="h-full rounded-normal border shadow-normal dark:border-gray-400">
													<div className="flex min-h-[80px] items-center border-b p-4 dark:border-gray-400">
														<h2 className="grow font-bold">{t("Words.HiringAnalytics")}</h2>
														{/* <div className="w-[180px]">
														<FormField fieldType="select" placeholder="All Time" />
													</div> */}
													</div>
													<div className="p-8">
														{hiringAnalytics &&
														hiringAnalytics.length > 0 &&
														hiringAnalytics.some((item) => item > 0) ? (
															// <HighchartsReact highcharts={Highcharts} options={options} />
															<AnalyticsChart data={hiringAnalytics} text="Hiring Trends" />
														) : (
															// <AnalyticsChart />
															<>
																<div className="py-8 text-center">
																	<div className="mx-auto mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-200 p-2">
																		<Image
																			src={nodata_2}
																			alt="No Data"
																			width={300}
																			className="max-h-[60px] w-auto max-w-[60px]"
																		/>
																	</div>
																	<p className="text-sm text-darkGray">
																		{srcLang === "ja" ? "採用分析は不要" : "No Hiring Analytics"}
																	</p>
																</div>
															</>
														)}
													</div>
												</div>
											</div>
											<div className="mb-6 w-full px-3 xl:max-w-[50%]">
												<div className="h-full rounded-normal border shadow-normal dark:border-gray-400">
													<div className="flex min-h-[80px] items-center border-b p-4 dark:border-gray-400">
														<h2 className="grow font-bold">
															{srcLang === "ja" ? "応募経路" : "Average Source of Candidate"}
														</h2>
													</div>
													<div className="p-8">
														{analyticsSource && analyticsSource.length > 0 && tapp > 0 ? (
															<SourceChart data={analyticsSource} />
														) : (
															<div className="py-8 text-center">
																<div className="mx-auto mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-200 p-2">
																	<Image
																		src={nodata_2}
																		alt="No Data"
																		width={300}
																		className="max-h-[60px] w-auto max-w-[60px]"
																	/>
																</div>
																<p className="text-sm text-darkGray">
																	{srcLang === "ja" ? "候補者の情報源なし" : "No Source of Candidate"}
																</p>
															</div>
														)}
													</div>
												</div>
											</div>
											<div className="mb-6 w-full px-3 xl:max-w-[50%]">
												<div className="h-full rounded-normal border shadow-normal dark:border-gray-400">
													<div className="flex min-h-[80px] items-center border-b p-4 dark:border-gray-400">
														<h2 className="grow font-bold">
															{srcLang === "ja" ? "面接実施推移" : "Average Interviews Schedule"}
														</h2>
														{/* <div className="w-[180px]">
														<FormField fieldType="select" placeholder={srcLang === "ja" ? "全期間" : "All Time"} />
													</div> */}
													</div>
													<div className="p-8">
														{interviewAnalytics &&
														interviewAnalytics.length > 0 &&
														interviewAnalytics.some((item) => item > 0) ? (
															// <HighchartsReact highcharts={Highcharts} options={options} />
															<AnalyticsChart data={interviewAnalytics} text="Interview Trends" />
														) : (
															// {analyticsColumn && analyticsColumn.length > 0 && quickLinkData[5] > 0 ? (
															// 	<ColumnChart data={analyticsColumn} />
															// )
															<div className="py-8 text-center">
																<div className="mx-auto mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-200 p-2">
																	<Image
																		src={nodata_2}
																		alt="No Data"
																		width={300}
																		className="max-h-[60px] w-auto max-w-[60px]"
																	/>
																</div>
																<p className="text-sm text-darkGray">
																	{srcLang === "ja" ? "面接なし" : "No Interview"}
																</p>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>
									</Tab.Panel>
									<Tab.Panel>
										{upcomingSoon ? (
											<UpcomingComp />
										) : (
											<>
												<div className="mb-6 rounded-normal border dark:border-gray-400">
													<div className="flex items-center border-b p-4 dark:border-gray-400">
														<h2 className="grow font-bold">{t("Words.VendorsPerformance")}</h2>
													</div>
													<div className="p-8">
														<div className="max-h-[405px] overflow-auto">
															<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
																<thead>
																	<tr>
																		<th className="border-b px-3 py-2 text-left">{t("Form.FullName")}</th>
																		<th className="border-b px-3 py-2 text-left">{t("Words.TotalSubmissions")}</th>
																		<th className="border-b px-3 py-2 text-left">{t("Words.Conversions")}</th>
																		<th className="border-b px-3 py-2 text-left">{t("Words.Hiring")} (%)</th>
																	</tr>
																</thead>
																<tbody className="text-sm font-semibold">
																	{sklLoad
																		? Array(10).fill(
																				<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
																					<td className="px-3 py-2 text-left">
																						<Image
																							src={bambooHrIcon}
																							alt="BambooHR"
																							width={150}
																							className="max-h-[25px] w-auto"
																						/>
																					</td>
																					<td className="px-3 py-2 text-left">100</td>
																					<td className="px-3 py-2 text-left">40</td>
																					<td className="px-3 py-2 text-left">61.4%</td>
																				</tr>
																		  )
																		: Array(6).fill(
																				<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
																					<td className="px-3 py-2 text-left">
																						<Skeleton width={100} height={25} />
																					</td>
																					<td className="px-3 py-2 text-left">
																						<Skeleton width={100} height={25} />
																					</td>
																					<td className="px-3 py-2 text-left">
																						<Skeleton width={100} height={25} />
																					</td>
																					<td className="px-3 py-2 text-left">
																						<Skeleton width={100} height={25} />
																					</td>
																				</tr>
																		  )}
																</tbody>
															</table>
														</div>
													</div>
												</div>
												<div className="mb-6 rounded-normal border dark:border-gray-400">
													<div className="flex items-center border-b p-4 dark:border-gray-400">
														<h2 className="grow font-bold">{t("Words.ApplicantSourced")}</h2>
														<div className="w-[180px]">
															<FormField fieldType="select" placeholder={t("Words.AllApplicants")} />
														</div>
													</div>
													<div className="p-8">Body Graph Here</div>
												</div>
												<hr className="mb-6" />
												<div className="mb-6 rounded-normal border dark:border-gray-400">
													<div className="flex items-center border-b p-4 dark:border-gray-400">
														<h2 className="grow font-bold">{t("Words.JobBoards")}</h2>
													</div>
													<div className="p-8">
														<div className="max-h-[405px] overflow-auto">
															<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
																<thead>
																	<tr>
																		<th className="border-b px-3 py-2 text-left">{t("Form.FullName")}</th>
																		<th className="border-b px-3 py-2 text-left">{t("Words.TotalSubmissions")}</th>
																		<th className="border-b px-3 py-2 text-left">{t("Words.Conversions")}</th>
																		<th className="border-b px-3 py-2 text-left">{t("Words.Hiring")} (%)</th>
																	</tr>
																</thead>
																<tbody className="text-sm font-semibold">
																	{sklLoad
																		? Array(10).fill(
																				<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
																					<td className="px-3 py-2 text-left">
																						<Image
																							src={linkedInIcon}
																							alt="LinkedIn"
																							width={150}
																							className="max-h-[25px] w-auto"
																						/>
																					</td>
																					<td className="px-3 py-2 text-left">100</td>
																					<td className="px-3 py-2 text-left">40</td>
																					<td className="px-3 py-2 text-left">61.4%</td>
																				</tr>
																		  )
																		: Array(6).fill(
																				<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
																					<td className="px-3 py-2 text-left">
																						<Skeleton width={100} height={25} />
																					</td>
																					<td className="px-3 py-2 text-left">
																						<Skeleton width={100} height={25} />
																					</td>
																					<td className="px-3 py-2 text-left">
																						<Skeleton width={100} height={25} />
																					</td>
																					<td className="px-3 py-2 text-left">
																						<Skeleton width={100} height={25} />
																					</td>
																				</tr>
																		  )}
																</tbody>
															</table>
														</div>
													</div>
												</div>
												<div className="mb-6 rounded-normal border dark:border-gray-400">
													<div className="flex items-center border-b p-4 dark:border-gray-400">
														<h2 className="grow font-bold">{t("Words.ApplicantSourced")}</h2>
														<div className="w-[180px]">
															<FormField fieldType="select" placeholder={t("Words.AllApplicants")} />
														</div>
													</div>
													<div className="p-8">Body Graph Here</div>
												</div>
											</>
										)}
									</Tab.Panel>
								</Tab.Panels>
							</Tab.Group>
						</div>
					</div>
				</main>
			)}
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
