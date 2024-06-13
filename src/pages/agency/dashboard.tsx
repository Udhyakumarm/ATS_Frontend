import Head from "next/head";
import React, { useRef, Fragment, useState, useEffect } from "react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Dialog, Popover, Transition } from "@headlessui/react";
import Button from "@/components/Button";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import userImg1 from "/public/images/user-image1.jpeg";
import customizeApplicants from "/public/images/icons/customize_applicants.png";
import customizeActivity from "/public/images/icons/customize_activity.png";
import customizeAnalytics from "/public/images/icons/customize_analytics.png";
import customizeRecent from "/public/images/icons/customize_recent.png";
import customizeTodo from "/public/images/icons/customize_todo.png";
import customizeUpcoming from "/public/images/icons/customize_upcoming.png";
import nodata_1 from "/public/images/no-data/icon-1.png";
import nodata_2 from "/public/images/no-data/icon-2.png";
import nodata_3 from "/public/images/no-data/icon-3.png";
import nodata_4 from "/public/images/no-data/icon-4.png";
import nodata_5 from "/public/images/no-data/icon-5.png";
import nodata_6 from "/public/images/no-data/icon-6.png";
import { useSession } from "next-auth/react";
import ChatAssistance from "@/components/ChatAssistance";
import JobCard_1 from "@/components/JobCard-1";
import FormField from "@/components/FormField";
import Link from "next/link";
import googleIcon from "/public/images/social/google-icon.png";
import PreviewJob from "@/components/organization/PreviewJob";
import { useRouter } from "next/router";
import { axiosInstanceAuth } from "../api/axiosApi";
import moment from "moment";
import { useApplicantStore, useDashboardStore } from "@/utils/code";
import Applicants from "./applicants";
import JobCard_2 from "@/components/JobCard-2";
import toastcomp from "@/components/toast";
import UpcomingComp from "@/components/organization/upcomingComp";
import PermiumComp from "@/components/organization/premiumComp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import Joyride, { STATUS } from "react-joyride";
import useJoyrideStore from "@/utils/joyride";
import AnalyticsChart from "@/components/organization/AnalyticsChart";
import Novus from "@/components/Novus";
import OrgRSideBar from "@/components/organization/RSideBar";
import { useNewNovusStore } from "@/utils/novus";
import HiringChart from "@/components/Charts/HiringChart";
import Button2 from "@/components/Button2";

export default function OrganizationDashboard({ atsVersion, userRole, upcomingSoon, currentUser }: any) {
	useEffect(() => {
		if (currentUser.is_expired) {
			router.push("/organization/settings/pricing");
		}
	}, [currentUser]);
	const [sklLoad] = useState(true);

	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);

	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const setappid = useApplicantStore((state: { setappid: any }) => state.setappid);
	const setappdata = useApplicantStore((state: { setappdata: any }) => state.setappdata);
	const settype = useApplicantStore((state: { settype: any }) => state.settype);

	const cancelButtonRef = useRef(null);
	const [activityLogPopup, setActivityLogPopup] = useState(false);
	const settings = {
		dots: false,
		arrows: true,
		infinite: false,
		speed: 500,
		slidesToShow: 2.5,
		slidesToScroll: 1,
		rows: 2,
		prevArrow: (
			<button type="button" className="slick-arrow">
				<i className="fa-solid fa-chevron-left"></i>
			</button>
		),
		nextArrow: (
			<button type="button" className="slick-arrow">
				<i className="fa-solid fa-chevron-right"></i>
			</button>
		)
	};

	const [tApp, settApp] = useState(0);
	const [sApp, setsApp] = useState(0);
	const [rApp, setrApp] = useState(0);
	const [iApp, setiApp] = useState(0);
	const [shApp, setshApp] = useState(0);
	const [oApp, setoApp] = useState(0);
	const [hApp, sethApp] = useState(0);
	const [reApp, setreApp] = useState(0);

	const aplc_status = [
		{
			title: srcLang === "ja" ? "パイプライン" : "Total Pipelines",
			number: tApp,
			icon: <i className="fa-solid fa-timeline"></i>
		},
		{
			title: srcLang === "ja" ? "コンタクト数" : "Total Sourced",
			number: sApp,
			icon: <i className="fa-solid fa-circle-pause"></i>
		},
		{
			title: srcLang === "ja" ? "総レビュー数" : "Total Reviewed",
			number: rApp,
			icon: <i className="fa-solid fa-users"></i>
		},
		{
			title: srcLang === "ja" ? "面接数" : "Total Interview",
			number: iApp,
			icon: <i className="fa-solid fa-circle-check"></i>
		},
		{
			title: srcLang === "ja" ? "最終候補者リストに残った合計" : "Total Shortlisted",
			number: shApp,
			icon: <i className="fa-solid fa-users"></i>
		},
		{
			title: srcLang === "ja" ? "オファー数" : "Total Offer",
			number: oApp,
			icon: <i className="fa-solid fa-clipboard-question"></i>
		},
		{
			title: srcLang === "ja" ? "入社数" : "Total Hired",
			number: hApp,
			icon: <i className="fa-solid fa-users"></i>
		},
		{
			title: srcLang === "ja" ? "不合格数" : "Total Rejected",
			number: reApp,
			icon: <i className="fa-solid fa-circle-xmark"></i>
		}
	];

	// function handleGaugeBtn() {
	// 	document.querySelector("html").classList.add('overflow-hidden')
	// }

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

	const check1 = useDashboardStore((state: { check1: any }) => state.check1);
	const check2 = useDashboardStore((state: { check2: any }) => state.check2);
	const check3 = useDashboardStore((state: { check3: any }) => state.check3);
	const check4 = useDashboardStore((state: { check4: any }) => state.check4);
	const check5 = useDashboardStore((state: { check5: any }) => state.check5);
	const check6 = useDashboardStore((state: { check6: any }) => state.check6);

	const setcheck1 = useDashboardStore((state: { setcheck1: any }) => state.setcheck1);
	const setcheck2 = useDashboardStore((state: { setcheck2: any }) => state.setcheck2);
	const setcheck3 = useDashboardStore((state: { setcheck3: any }) => state.setcheck3);
	const setcheck4 = useDashboardStore((state: { setcheck4: any }) => state.setcheck4);
	const setcheck5 = useDashboardStore((state: { setcheck5: any }) => state.setcheck5);
	const setcheck6 = useDashboardStore((state: { setcheck6: any }) => state.setcheck6);

	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	const [applicantDetail, setapplicantDetail] = useState({});
	const [hiringAnalytics, sethiringAnalytics] = useState([]);
	const [upcomingInterview, setupcomingInterview] = useState([]);
	const [todoList, settodoList] = useState([]);
	const [recentJob, setrecentJob] = useState([]);
	const [activityLog, setactivityLog] = useState([]);

	const [interview, setInterview] = useState([]);

	async function loadActivityLog() {
		await axiosInstanceAuth2
			.get(`/organization/list-activity-log/`)
			.then(async (res) => {
				// console.log("!", res.data);
				setactivityLog(res.data);
			})
			.catch((err) => {
				// console.log("!", err);
			});
	}

	const [todos, settodos] = useState([]);
	const [nctodos, setnctodos] = useState([]);
	const [todoLoadMore, settodoLoadMore] = useState(false);
	const [tourCompleted, setTourCompleted] = useState(false);
	const [isTourOpen, setIsTourOpen] = useState(false);
	const [shouldShowSidebarTour, setShouldShowSidebarTour] = useState(false);
	const { shouldShowJoyride, isJoyrideCompleted, showJoyride, completeJoyride } = useJoyrideStore();


	async function loadTodo() {
		await axiosInstanceAuth2
			.get(`/chatbot/list-todo/`)
			.then(async (res) => {
				// console.log("!", "TODO", res.data);
				settodos(res.data);
				var data = res.data;
				let arr = [];
				for (let i = 0; i < data.length; i++) {
					if (!data[i]["compelete"]) {
						arr.push(data[i]);
					}
				}
				setnctodos(arr);
			})
			.catch((err) => {
				// console.log("!", err);
			});
	}

	async function loadAnalytics() {
		await axiosInstanceAuth2
			.get(`/applicant/get_analytics/`)
			.then(async (res) => {
				// console.log("!", res.data);
				// setactivityLog(res.data);
				setapplicantDetail(res.data["Applicants"]);
				settApp(res.data["Applicants"]["totalApplicants"]);
				setsApp(res.data["Applicants"]["sourced"]);
				setrApp(res.data["Applicants"]["review"]);
				setiApp(res.data["Applicants"]["interview"]);
				setshApp(res.data["Applicants"]["shortlisted"]);
				setoApp(res.data["Applicants"]["offer"]);
				sethApp(res.data["Applicants"]["hired"]);
				setreApp(res.data["Applicants"]["rejected"]);

				setrecentJob(res.data["recentJob"]);
				setupcomingInterview(res.data["Interview"]);
				sethiringAnalytics(res.data["shiftHiring"]);
			})
			.catch((err) => {
				// console.log("!", err);
			});
	}

	function getAverage(num: any) {
		return Math.round((num / tApp) * 100);
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
	const joyrideSteps = [
		{
			target: ".dashboardSlider",
			content: "This section displays important details regarding applicants.",
			placement: "bottom",
			disableBeacon: true,
			title: "Welcome to Dashboard!",
			disableOverlayClose: true,
			// hideCloseButton: true,
			styles: {
				options: {
					zIndex: 10000
				}
			}
		},
		{
			target: ".hiring-analytics-section",
			content:
				"This section displays hiring analytics through graphs, providing insights into hiring trends and performance.",
			placement: "top",
			title: "Hiring Analytics",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true,
			styles: {
				options: {
					zIndex: 10000
				}
			}
		},
		{
			target: ".upcoming-interviews-section",
			content:
				"This section displays upcoming interviews or meetings with applicants. You can view details such as the applicant's name, job title, and interview schedule here.",
			placement: "top",
			disableBeacon: true,
			title: "Upcoming Interviews",
			disableOverlayClose: true,
			hideCloseButton: true,
			styles: {
				options: {
					zIndex: 10000
				}
			}
		},
		{
			target: ".todo-list-section",
			content: "This is your ToDo List section where you can see your tasks and priority markers.",
			placement: "top",
			disableBeacon: true,
			title: "Todo List",
			disableOverlayClose: true,
			hideCloseButton: true,
			styles: {
				options: {
					zIndex: 10000
				}
			}
		},
		{
			target: ".recent-jobs",
			content: "This section displays your recent job postings along with their details.",
			placement: "top",
			disableBeacon: true,
			title: "Recent Jobs",
			disableOverlayClose: true,
			hideCloseButton: true,
			styles: {
				options: {
					zIndex: 10000
				}
			}
		},
		{
			target: ".activity-log",
			content: "This section displays all recent activities, including logins, hiring updates, and applicant updates",
			placement: "top",
			disableBeacon: true,
			title: "Activity Log",
			disableOverlayClose: true,
			hideCloseButton: true,
			styles: {
				options: {
					zIndex: 10000
				}
			}
		},
		
		{
			target:atsVersion==="enterprise" || atsVersion==="free"? ".popover":".upgrade",
			content:atsVersion==="enterprise" || atsVersion==="free"?"This section displays the customization options for your dashboard.":"Upgrade to Enterprise for more features",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true,
			// hideFooter: true,
			spotlightClicks: true,
			// event: "click",
			title:atsVersion==="enterprise" ||atsVersion==="free"? "Click here to customize your Dashboard.":" Upgrade to Enterprise",
			styles: {
				options: {
					zIndex: 10000
				}
			}
		}
		
	];
	useEffect(() => {
		if (!isJoyrideCompleted) {
			showJoyride();
		}
	}, [isJoyrideCompleted, showJoyride]);
	useEffect(() => {
		if (token && token.length > 0) {
			loadTodo();
			loadAnalytics();
			loadActivityLog();
		}
	}, [token]);

	return (
		<>
			<Head>
				<title>{t("Words.Dashboard")}</title>
			</Head>
			{currentUser && !currentUser.is_expired && (
				<main>
					{/* <Novus /> */}
					{session && !upcomingSoon && <ChatAssistance accessToken={session.accessToken} />}
					<Orgsidebar shouldShowSidebarTour={shouldShowSidebarTour} currentStep={undefined} />
					<Orgtopbar todoLoadMore={todoLoadMore} settodoLoadMore={settodoLoadMore} loadTodo={loadTodo} />
					{token && token.length > 0 && <OrgRSideBar axiosInstanceAuth2={axiosInstanceAuth2} />}
					<div
						id="overlay"
						className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
					></div>
					<div className={`layoutWrap p-4 xl:pl-4 xl:pr-0 xl:pt-4` + " " + (visible && "mr-[calc(27.6%+1rem)]")}>
						<div id={!["standard", "starter"].includes(atsVersion) ? "dashboard" : ""} className="relative">
							<div className="flex flex-wrap gap-4">
								{check1 ? (
									<div className=" w-full xl:max-w-[calc(50%-1rem)] ">
										<div className="h-full rounded-normal bg-white shadow dark:bg-gray-800">
											<div className="flex items-center justify-between p-6">
												<h2 className="text-lg font-bold">{t("Words.ApplicantDetails")}</h2>
												{!["standard", "starter"].includes(atsVersion) && (
													<aside className="flex items-center justify-end">
														{/* <div className="mr-4 w-[140px]">
													<FormField fieldType="select" />
												</div> */}
														{/* <button
														type="button"
														className="relative z-[1] h-[30px] w-[30px] cursor-grab rounded-full bg-darkGray text-gray-300"
													>
														<i className="fa-regular fa-hand"></i>
													</button> */}
													</aside>
												)}
											</div>
											<div className="dashboardSlider p-6 pt-0">
												{applicantDetail && applicantDetail["totalApplicants"] > 0 ? (
													<Slider {...settings}>
														{aplc_status.map((item, i) => (
															<div key={i}>
																<div className="px-2 py-3">
																	<div className="relative rounded-normal border-b-[4px] border-lightGray bg-white p-3 pr-5 shadow-highlight dark:bg-gray-700">
																		<div className="mb-2 flex items-center justify-between">
																			<h4 className="grow pr-4 text-xl font-extrabold">
																				{/* {item.number || <Skeleton width={40} />} */}
																				{item.number}
																			</h4>
																			<div className="rounded bg-lightGray px-2 py-1 text-[12px] text-white">
																				{item.icon}
																			</div>
																		</div>
																		<p className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
																			{item.title}
																		</p>
																		<div style={{ width: 40, height: 40 }}>
																			<CircularProgressbar
																				value={getAverage(item.number)}
																				text={`${getAverage(item.number)}`}
																				styles={buildStyles({
																					pathColor: getColor(item.number),
																					textSize: "26px",
																					textColor: "#727272"
																				})}
																			/>
																		</div>
																		<div
																			className={`absolute right-0 top-[50%] block h-[74px] w-[15px] translate-y-[-50%] border-[14px] border-transparent`}
																			style={{ borderRightColor: getColor(item.number) }}
																		></div>
																	</div>
																</div>
															</div>
														))}
													</Slider>
												) : (
													<div className="py-8 text-center">
														<div className="mx-auto mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-200 p-2">
															<Image
																src={nodata_1}
																alt="No Data"
																width={300}
																className="max-h-[60px] w-auto max-w-[60px]"
															/>
														</div>
														<p className="text-sm text-darkGray">
															{srcLang === "ja" ? "有効なデータはありません" : "No Applicants"}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								) : (
									<></>
								)}
								{check2 ? (
									<div className="hiring-analytics-section w-full xl:max-w-[calc(50%-1rem)] ">
										{/* <div className="h-full rounded-normal bg-white shadow dark:bg-gray-800"> */}
										<div className="relative h-full overflow-hidden rounded-normal bg-white shadow dark:bg-gray-800">
											<div className="flex items-center justify-between p-6">
												<h2 className="text-lg font-bold">{t("Words.HiringAnalytics")}</h2>
												{!["standard", "starter"].includes(atsVersion) && (
													<aside>
														{/* <button
														type="button"
														className="h-[30px] w-[30px] cursor-grab rounded-full bg-darkGray text-gray-300"
													>
														<i className="fa-regular fa-hand"></i>
													</button> */}
													</aside>
												)}
											</div>
											<div className="p-6 pt-0">
												{hiringAnalytics && hiringAnalytics.length > 0  ? (
													<div className="pr-8">
														<HiringChart
															data={hiringAnalytics}
														/>
													</div>
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
																{srcLang === "ja" ? "有効なデータはありません" : "No Hiring Analytics"}
															</p>
														</div>
													</>
												)}
											</div>
											{/* {atsVersion === "starter" && (
											<div
												className="absolute left-0 top-0 z-[1] flex h-full w-full cursor-pointer items-center justify-center bg-[rgba(0,0,0,0.1)] p-6 backdrop-blur-md"
												onClick={() => {
													if (userRole === "Super Admin") {
														router.push("/organization/settings/pricing");
													} else {
														toastcomp("Kindly Contact Your Super Admin", "warning");
													}
												}}
											>
												<div className="rounded-normal bg-[rgba(0,0,0,0.5)] p-6 text-center text-white transition hover:scale-[1.05]">
													<h3 className="mb-1 text-lg font-extrabold">Hiring Analytics Is A Premium Feature</h3>
													<p className="text-[12px]">If you want to use this feature kindly upgrade your plan.</p>
												</div>
											</div>
										)} */}
										</div>
									</div>
								) : (
									<></>
								)}
								{check3 ? (
									<div className="upcoming-interviews-section w-full xl:max-w-[calc(50%-1rem)] ">
										<div className="h-full rounded-normal bg-white shadow dark:bg-gray-800">
											<div className="flex items-center justify-between p-6">
												<h2 className="text-lg font-bold">{t("Words.UpcomingInterviews")}</h2>
												{!["standard", "starter"].includes(atsVersion) && (
													<aside>
														{/* <button
														type="button"
														className="h-[30px] w-[30px] cursor-grab rounded-full bg-darkGray text-gray-300"
													>
														<i className="fa-regular fa-hand"></i>
													</button> */}
													</aside>
												)}
											</div>
											<div className="p-6 pt-0">
												{upcomingInterview && upcomingInterview.length > 0 ? (
													<div className="max-h-[330px] overflow-y-auto">
														{upcomingInterview.slice(0, 5).map((data, i) => (
															<div className="mb-3 flex flex-wrap items-center rounded-[10px] border px-3 py-2" key={i}>
																<div className="flex w-[250px] items-center py-1 pr-2">
																	<Image
																		src={userImg1}
																		alt="User"
																		className="rounded-full object-cover"
																		width={30}
																		height={30}
																	/>
																	<div className="grow pl-2">
																		<h5 className="text-sm font-bold">
																			{data["applicant"] != null && (
																				<>
																					{data["applicant"]["fname"]}&nbsp;
																					{data["applicant"]["lname"]}
																					&nbsp;({data["applicant"]["type"]})
																				</>
																			)}
																		</h5>
																		<p className="text-[12px] text-darkGray">{data["job"]["job_title"]}</p>
																	</div>
																</div>
																<div className="flex grow">
																	<div className="grow py-1 pr-2">
																		<h5 className="text-sm font-bold">
																			{moment(data["date_time_from"]).format("DD MMM YYYY")}
																		</h5>
																		<p className="text-[12px] text-darkGray">
																			{moment(data["date_time_from"]).format(" h:mm a")}
																		</p>
																	</div>
																	<div className="grow py-1 pr-2">
																		<h5 className="text-sm font-bold">
																			{moment(data["date_time_to"]).format("DD MMM YYYY")}
																		</h5>
																		<p className="text-[12px] text-darkGray">
																			{moment(data["date_time_to"]).format(" h:mm a")}
																		</p>
																	</div>
																</div>
																<div className="grow py-1 text-right">
																	<Button
																		btnStyle="outlined"
																		label={t("Btn.View")}
																		loader={false}
																		btnType="button"
																		handleClick={() => {
																			if (data["applicant"] != null) {
																				settype("career");
																				setappdata(data["applicant"]);
																				setappid(data["applicant"]["arefid"]);
																				setjobid(data["applicant"]["job"]["refid"]);
																			} else {
																				settype("vendor");
																				setappdata(data["vapplicant"]);
																				setappid(data["vapplicant"]["arefid"]);
																				setjobid(data["vapplicant"]["job"]["refid"]);
																			}
																			router.push("applicants/detail");
																		}}
																	/>
																</div>
															</div>
														))}
													</div>
												) : (
													<div className="py-8 text-center">
														<div className="mx-auto mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-200 p-2">
															<Image
																src={nodata_3}
																alt="No Data"
																width={300}
																className="max-h-[60px] w-auto max-w-[60px]"
															/>
														</div>
														<p className="text-sm text-darkGray">
															{srcLang === "ja" ? "予定している面接・面談はありません" : "No Upcoming Interviews"}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								) : (
									<></>
								)}
								{check4 ? (
									<div className="todo-list-section w-full xl:max-w-[calc(50%-1rem)] ">
										<div className="relative h-full overflow-hidden rounded-normal bg-white shadow dark:bg-gray-800">
											<div className="flex items-center justify-between p-6">
												<h2 className="text-lg font-bold">{t("Words.ToDoList")}</h2>
												{!["standard", "starter"].includes(atsVersion) && (
													<aside>
														{/* <button
														type="button"
														className="h-[30px] w-[30px] cursor-grab rounded-full bg-darkGray text-gray-300"
													>
														<i className="fa-regular fa-hand"></i>
													</button> */}
													</aside>
												)}
											</div>
											<div className="p-6 pt-0">
												{nctodos && nctodos.length > 0 ? (
													<>
														<div className="max-h-[330px] overflow-y-auto">
															{nctodos.slice(0, 5).map((data, i) => (
																<div className="mb-3 flex flex-wrap rounded-[10px] border" key={i}>
																	{/* <div className="flex w-[65%] items-center px-3 py-2"> */}
																	<div className="w-[65%] px-8 py-4">
																		<h5 className="mb-2 font-bold">{data["title"]}</h5>
																		<p
																			className="text-sm text-darkGray dark:text-gray-400"
																			dangerouslySetInnerHTML={{ __html: data["desc"] }}
																		></p>
																	</div>
																	<div className="relative flex w-[35%] items-center justify-center bg-lightBlue px-3 py-6 dark:bg-gray-700">
																		<span className="mr-2 flex items-center justify-center rounded bg-[#000] p-2 text-lg leading-normal text-white dark:bg-gray-800">
																			<i className="fa-regular fa-square-check"></i>
																		</span>
																		<h5 className="font-bold">{moment(data["deadline"]).format("DD MMM YYYY")}</h5>
																		<div className="absolute right-1 top-1">
																			{data["priority"] === "High" && (
																				<p className="rounded-full bg-red-500 px-2 py-1 text-[10px] leading-[1.2] text-white">
																					High
																				</p>
																			)}
																			{data["priority"] === "Medium" && (
																				<p className="rounded-full bg-yellow-500 px-2 py-1 text-[10px] leading-[1.2] text-white">
																					Medium
																				</p>
																			)}
																			{data["priority"] === "Low" && (
																				<p className="rounded-full bg-gray-500 px-2 py-1 text-[10px] leading-[1.2] text-white">
																					Low
																				</p>
																			)}
																		</div>
																	</div>
																</div>
															))}
															{/* {sklLoad
															? Array(6).fill(
																	<div className="mb-3 flex flex-wrap rounded-[10px] border">
																		<div className="flex w-[65%] items-center px-3 py-2">
																			<p className="clamp_2 text-sm">
																				Being able to rename and edit users lorem rename and edit users Being able to
																				rename and edit users lorem rename and edit users Being able to rename and edit
																				users lorem rename and edit users
																			</p>
																		</div>
																		<div className="relative flex w-[35%] items-center justify-center bg-lightBlue px-3 py-6 dark:bg-gray-700">
																			<span className="mr-2 flex items-center justify-center rounded bg-[#FF8A00] p-2 text-lg leading-normal text-white dark:bg-gray-800">
																				<i className="fa-regular fa-square-check"></i>
																			</span>
																			<h5 className="font-bold">20 Nov 2023</h5>
																			<div className="absolute right-1 top-1">
																				<p className="rounded-full bg-red-500 px-2 py-1 text-[10px] leading-[1.2] text-white">
																					High
																				</p>
																				<p className="rounded-full bg-yellow-500 px-2 py-1 text-[10px] leading-[1.2] text-white">
																					Medium
																				</p>
																				<p className="rounded-full bg-gray-500 px-2 py-1 text-[10px] leading-[1.2] text-white">
																					Low
																				</p>
																			</div>
																		</div>
																	</div>
															  )
															: Array(6).fill(
																	<div className="mb-3 flex flex-wrap rounded-[10px] border">
																		<div className="flex w-[65%] items-center px-3 py-2">
																			<Skeleton containerClassName="grow" count={2} />
																		</div>
																		<div className="flex w-[35%] items-center justify-center bg-lightBlue px-3 py-6 dark:bg-gray-700">
																			<span className="mr-2 flex items-center justify-center rounded bg-[#FF8A00] p-2 text-lg leading-normal text-white dark:bg-gray-800">
																				<i className="fa-regular fa-square-check"></i>
																			</span>
																			<h5 className="grow font-bold">
																				<Skeleton height={12} />
																			</h5>
																		</div>
																	</div>
															  )} */}
														</div>
														<div className="pt-4">
															<Button
																btnStyle="outlined"
																label={t("Btn.LoadMore")}
																btnType="button"
																handleClick={() => settodoLoadMore(true)}
															/>
														</div>
													</>
												) : (
													<div className="py-8 text-center">
														<div className="mx-auto mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-200 p-2">
															<Image
																src={nodata_4}
																alt="No Data"
																width={300}
																className="max-h-[60px] w-auto max-w-[60px]"
															/>
														</div>
														<p className="text-sm text-darkGray">
															{srcLang === "ja" ? "未完了のタスクはありません" : "Nothing In To Do List"}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								) : (
									<></>
								)}
								{check5 ? (
									<div className="w-full xl:max-w-[calc(50%-1rem)] ">
										<div className="recent-jobs h-full rounded-normal bg-white shadow dark:bg-gray-800">
											<div className="flex items-center justify-between p-6">
												<h2 className="text-lg font-bold">{t("Words.RecentJobs")}</h2>
												{!["standard", "starter"].includes(atsVersion) && (
													<aside>
														{/* <button
														type="button"
														className="h-[30px] w-[30px] cursor-grab rounded-full bg-darkGray text-gray-300"
													>
														<i className="fa-regular fa-hand"></i>
													</button> */}
													</aside>
												)}
											</div>
											<div className="p-6 pt-0">
												{recentJob && recentJob.length > 0 ? (
													<div className="mx-[-7px] flex max-h-[330px] flex-wrap overflow-y-auto">
														{/* {sklLoad
														? Array(5).fill(
																<div className="mb-[15px] w-full px-[7px] md:max-w-[50%]">
																	<JobCard_1 />
																</div>
														  )
														: Array(5).fill(
																<div className="mb-[15px] w-full px-[7px] md:max-w-[50%]">
																	<JobCard_1 sklLoad={true} />
																</div>
														  )} */}

														{/* {recentJob.slice(0, 5).map((data, i) => (
														<div className="mb-[15px] w-full px-[7px] md:max-w-[100%]" key={i}>
															<JobCard_1 data={data} handleClick={() => router.push("jobs/active")} />
														</div>
													))} */}
														{recentJob.slice(0, 5).map((data, i) => (
															<div className="mb-[15px] w-full px-[7px] py-1 xl:max-w-[100%]" key={i}>
																<JobCard_2
																	job={data}
																	dashbaord={true}
																	axiosInstanceAuth2={axiosInstanceAuth2}
																	loadJob={loadAnalytics}
																/>
															</div>
														))}
													</div>
												) : (
													<div className="py-8 text-center">
														<div className="mx-auto mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-200 p-2">
															<Image
																src={nodata_5}
																alt="No Data"
																width={300}
																className="max-h-[60px] w-auto max-w-[60px]"
															/>
														</div>
														<p className="text-sm text-darkGray">
															{srcLang === "ja" ? "掲載されている求人はありません" : "No Job has been posted yet"}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								) : (
									<></>
								)}
								{["standard", "starter"].includes(atsVersion) && (
									<div className="w-full xl:max-w-[calc(50%-1rem)]">
										<div className="flex h-full items-center justify-center rounded-large bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-6 text-white">
											<div className="mx-auto w-full max-w-[400px]">
												<div className="mb-2 flex items-center">
													<h6 className="my-2 mr-3 text-4xl font-bold">
														{srcLang === "ja" ? "プランをアップグレード" : "Upgrade to Enterprise"}
													</h6>
													<Image
														src={"/images/upgrade_launch.png"}
														alt="Upgrade"
														width={200}
														height={200}
														className="ml-auto w-auto max-w-[150px]"
													/>
												</div>
												<p className="mb-4 text-lg">
													{srcLang === "ja"
														? "プレミアムプランの詳細はこちら"
														: "Check out the Power of Enterprise Account"}
												</p>
												<h6 className="my-2 text-xl font-bold">
													{srcLang === "ja" ? "20%オフキャンペーン実施中" : "22% Off"}
												</h6>
												<Button
													btnStyle="white"
													btnType="button"
													label={srcLang === "ja" ? "アップグレード" : "Upgrade"}
													handleClick={() => {
														if (userRole === "Super Admin") {
															router.push("/organization/settings/pricing");
														} else {
															toastcomp("Kindly Contact Your Super Admin", "warning");
														}
													}}
												/>
											</div>
										</div>
									</div>
								)}
								{check6 ? (
									<div className="activity-log w-full xl:max-w-[calc(50%-1rem)]">
										<div className="h-full rounded-normal bg-white shadow dark:bg-gray-800">
											<div className="flex items-center justify-between p-6">
												<h2 className="text-lg font-bold">{t("Words.ActivityLog")}</h2>
												{!["standard", "starter"].includes(atsVersion) && (
													<aside>
														{/* <button
														type="button"
														className="h-[30px] w-[30px] cursor-grab rounded-full bg-darkGray text-gray-300"
													>
														<i className="fa-regular fa-hand"></i>
													</button> */}
													</aside>
												)}
											</div>
											<div className="p-6 pt-0">
												{activityLog && activityLog.length > 0 ? (
													<>
														<div className="max-h-[330px] overflow-y-auto">
															{activityLog.slice(0, 5).map((data, i) =>
																i % 2 == 0 ? (
																	<div
																		className="mb-3 flex flex-wrap items-center rounded-[10px] border px-2 py-1"
																		key={i}
																	>
																		<div className="flex items-center justify-center p-3">
																			<span className="mr-2 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gradDarkBlue text-lg leading-normal text-white">
																				<i className="fa-solid fa-briefcase"></i>
																			</span>
																			<p className="w-[calc(100%-40px)] text-sm">{data["aname"]}</p>
																		</div>
																	</div>
																) : (
																	<div
																		className="mb-3 flex flex-wrap items-center rounded-[10px] border px-2 py-1"
																		key={i}
																	>
																		<div className="flex items-center justify-center p-3">
																			<div className="mr-2 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FF930F] text-lg leading-normal text-white">
																				<i className="fa-solid fa-star"></i>
																			</div>
																			<p className="w-[calc(100%-40px)] text-sm">{data["aname"]}</p>
																		</div>
																	</div>
																)
															)}
														</div>
														<div className="pt-4">
															<Button2
																btnStyle="outlined"
																label={t("Btn.LoadMore")}
																btnType="button"
																handleClick={() => setActivityLogPopup(true)}
																small
															/>
														</div>
													</>
												) : (
													<div className="py-8 text-center">
														<div className="mx-auto mb-2 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-200 p-2">
															<Image
																src={nodata_6}
																alt="No Data"
																width={300}
																className="max-h-[60px] w-auto max-w-[60px]"
															/>
														</div>
														<p className="text-sm text-darkGray">
															{srcLang === "ja" ? "有効なデータはありません" : "Nothing in the Activity Log"}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								) : (
									<></>
								)}
							</div>
							<Joyride
								steps={tourCompleted ? [] : joyrideSteps}
								run={shouldShowJoyride}
								// scrollOffset={5}
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
								continuous={true}
								showProgress={true}
								showSkipButton={true}
								callback={(data: any) => {
									const { action, status, type } = data;
									// // console.log("yeh hai status", status);
									if ([STATUS.FINISHED, STATUS.SKIPPED, STATUS.READY].includes(status)) {
										// // console.log("finish toh ho gya!!");
										// // console.log("type to yeh hai", type);
										// // Check if the completed step is the last step of the main dashboard
										// if (data.step === joyrideSteps.length - 1) {
										// setTourCompleted(true);
										setShouldShowSidebarTour(true);
										// console.log("completed this tour");
										// }
									}
									if (action === "close") {
										setIsTourOpen(false);
										setTourCompleted(true);
									}
								}}
							/>
							{!["standard", "starter"].includes(atsVersion) && (
								<aside className=" popover absolute left-0 top-0 rounded-br-normal rounded-tl-normal bg-lightBlue p-3 dark:bg-gray-700">
									<Popover className="relative">
										<Popover.Button
											className={`flex h-[45px] w-[45px] items-center justify-center rounded-[10px] bg-gradient-to-b from-gradLightBlue to-gradDarkBlue text-xl text-white hover:from-gradDarkBlue hover:to-gradDarkBlue focus:outline-none`}
										>
											<i className="fa-solid fa-gauge"></i>
										</Popover.Button>
										<Popover.Overlay className="fixed inset-0 left-0 top-0 z-30 h-full w-full bg-black opacity-30 dark:bg-white dark:opacity-50" />
										<Popover.Panel className="absolute z-40 w-[300px] overflow-hidden rounded-normal shadow-normal">
											<div className="flex flex-wrap">
												<label
													htmlFor="cust_applicants"
													className="relative h-[100px] w-[100px] cursor-pointer overflow-hidden bg-gradient-to-r from-[#DCFFFB] to-[#A3CEFF] p-3 dark:from-gray-700 dark:to-gray-500"
												>
													<input
														type="checkbox"
														name="cust_dashboard"
														id="cust_applicants"
														className="hidden"
														onClick={() => setcheck1(!check1)}
													/>
													{/* <Image src={customizeApplicants} alt="Applicants" className="mb-2 w-auto h-[18px]" /> */}
													<i className="fa-solid fa-users-viewfinder mb-3 text-[18px] leading-[1px]"></i>
													<p className="text-[12px] font-bold">{t("Words.ApplicantDetails")}</p>
													<i
														className={`fa-solid ${
															check1 ? "fa-eye" : "fa-eye-slash"
														} absolute right-2 top-4 text-[12px] leading-[1px]`}
													></i>
												</label>
												<label
													htmlFor="cust_hiring"
													className="relative h-[100px] w-[100px] cursor-pointer overflow-hidden bg-gradient-to-r from-[#DCFFFB] to-[#A3CEFF] p-3 dark:from-gray-700 dark:to-gray-500"
												>
													<input
														type="checkbox"
														name="cust_dashboard"
														id="cust_hiring"
														className="hidden"
														onChange={() => setcheck2(!check2)}
													/>
													{/* <Image src={customizeAnalytics} alt="Hiring Analytics" className="mb-2 w-auto h-[18px]" /> */}
													<i className="fa-solid fa-chart-line mb-3 text-[18px] leading-[1px]"></i>
													<p className="text-[12px] font-bold">{t("Words.HiringAnalytics")}</p>
													<i
														className={`fa-solid ${
															check2 ? "fa-eye" : "fa-eye-slash"
														} absolute right-2 top-4 text-[12px] leading-[1px]`}
													></i>
												</label>
												<label
													htmlFor="cust_upcoming"
													className="relative h-[100px] w-[100px] cursor-pointer overflow-hidden bg-gradient-to-r from-[#A3CEFF] to-[#DCFFFB] p-3 dark:from-gray-700 dark:to-gray-500"
												>
													<input
														type="checkbox"
														name="cust_dashboard"
														id="cust_upcoming"
														className="hidden"
														onChange={() => setcheck3(!check3)}
													/>
													{/* <Image src={customizeUpcoming} alt="Upcoming Interviews" className="mb-2 w-auto h-[18px]" /> */}
													<i className="fa-solid fa-calendar-days mb-3 text-[18px] leading-[1px]"></i>
													<p className="text-[12px] font-bold">{t("Words.UpcomingInterviews")}</p>
													<i
														className={`fa-solid ${
															check3 ? "fa-eye" : "fa-eye-slash"
														} absolute right-2 top-4 text-[12px] leading-[1px]`}
													></i>
												</label>
												<label
													htmlFor="cust_todo"
													className="relative h-[100px] w-[100px] cursor-pointer overflow-hidden bg-gradient-to-r from-[#DCFFFB] to-[#A3CEFF] p-3 dark:from-gray-500 dark:to-gray-700"
												>
													<input
														type="checkbox"
														name="cust_dashboard"
														id="cust_todo"
														className="hidden"
														onChange={() => setcheck4(!check4)}
													/>
													{/* <Image src={customizeTodo} alt="To Do List" className="mb-2 w-auto h-[18px]" /> */}
													<i className="fa-solid fa-list mb-3 text-[18px] leading-[1px]"></i>
													<p className="max-w-[55px] text-[12px] font-bold">{t("Words.ToDoList")}</p>
													<i
														className={`fa-solid ${
															check4 ? "fa-eye" : "fa-eye-slash"
														} absolute right-2 top-4 text-[12px] leading-[1px]`}
													></i>
												</label>
												<div className="relative flex h-[100px] w-[100px] flex-col items-center justify-center overflow-hidden bg-white p-2 text-center dark:bg-gray-900">
													<p className="text-[12px] font-bold">
														{srcLang === "ja" ? (
															<>
																カスタマイズ <br /> ダッシュボード
															</>
														) : (
															<>
																Customize <br /> Your <br /> Dashboard
															</>
														)}
													</p>
												</div>
												<label
													htmlFor="cust_recent"
													className="relative h-[100px] w-[100px] cursor-pointer overflow-hidden bg-gradient-to-r from-[#A3CEFF] to-[#DCFFFB] p-3 dark:from-gray-500 dark:to-gray-700"
												>
													<input
														type="checkbox"
														name="cust_dashboard"
														id="cust_recent"
														className="hidden"
														onChange={() => setcheck5(!check5)}
													/>
													{/* <Image src={customizeRecent} alt="Recent Jobs" className="mb-2 w-auto h-[18px]" /> */}
													<i className="fa-solid fa-briefcase mb-3 text-[18px] leading-[1px]"></i>
													<p className="max-w-[60px] text-[12px] font-bold">{t("Words.RecentJobs")}</p>
													<i
														className={`fa-solid ${
															check5 ? "fa-eye" : "fa-eye-slash"
														} absolute right-2 top-4 text-[12px] leading-[1px]`}
													></i>
												</label>
												<label
													htmlFor="cust_activity"
													className="relative h-[100px] w-[100px] cursor-pointer overflow-hidden bg-gradient-to-r from-[#DCFFFB] to-[#A3CEFF] p-3 dark:from-gray-700 dark:to-gray-500"
												>
													<input
														type="checkbox"
														name="cust_dashboard"
														id="cust_activity"
														className="hidden"
														onChange={() => setcheck6(!check6)}
													/>
													{/* <Image src={customizeActivity} alt="Activity Log" className="mb-2 w-auto h-[18px]" /> */}
													<i className="fa-solid fa-clock mb-3 text-[18px] leading-[1px]"></i>
													<p className="max-w-[60px] text-[12px] font-bold">{t("Words.ActivityLog")}</p>
													<i
														className={`fa-solid ${
															check6 ? "fa-eye" : "fa-eye-slash"
														} absolute right-2 top-4 text-[12px] leading-[1px]`}
													></i>
												</label>
												<div className="relative flex h-[100px] w-[100px] flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-[#DCFFFB] to-[#A3CEFF] p-2 text-center dark:from-gray-700 dark:to-gray-500"></div>
												<div className="relative flex h-[100px] w-[100px] flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-[#DCFFFB] to-[#A3CEFF] p-2 text-center dark:from-gray-700 dark:to-gray-500"></div>
											</div>
										</Popover.Panel>
									</Popover>
								</aside>
							)}
						</div>
					</div>
				</main>
			)}
			<Transition.Root show={activityLogPopup} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setActivityLogPopup}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#fff] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">{t("Words.ActivityLog")}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setActivityLogPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{activityLog && activityLog.length > 0 && (
											<>
												<div className="max-h-[75vh] overflow-y-auto">
													{activityLog.slice(0, -1).map((data, i) =>
														i % 2 == 0 ? (
															<div className="mb-3 flex flex-wrap items-center rounded-[10px] border px-2 py-1" key={i}>
																<div className="flex items-center justify-center p-3">
																	<span className="mr-2 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gradDarkBlue text-lg leading-normal text-white">
																		<i className="fa-solid fa-briefcase"></i>
																	</span>
																	<p className="w-[calc(100%-40px)] text-sm">{data["aname"]}</p>
																</div>
															</div>
														) : (
															<div className="mb-3 flex flex-wrap items-center rounded-[10px] border px-2 py-1" key={i}>
																<div className="flex items-center justify-center p-3">
																	<div className="mr-2 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FF930F] text-lg leading-normal text-white">
																		<i className="fa-solid fa-star"></i>
																	</div>
																	<p className="w-[calc(100%-40px)] text-sm">{data["aname"]}</p>
																</div>
															</div>
														)
													)}
												</div>
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
