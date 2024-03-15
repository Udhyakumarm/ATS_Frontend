import Button from "@/components/Button";
import FormField from "@/components/FormField";
import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import { Transition } from "@headlessui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import userImg from "/public/images/user-image.png";
import googleIcon from "/public/images/social/google-icon.png";
import Link from "next/link";
import noInterviewdata from "/public/images/no-data/iconGroup-3.png";
import InterviewComp from "@/components/organization/InterviewComp.";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { useNewNovusStore } from "@/utils/novus";
import OrgRSideBar from "@/components/organization/RSideBar";

export default function Interviews({ upcomingSoon, currentUser }: any) {
	useEffect(() => {
		if (currentUser.is_expired) {
			router.push("/organization/settings/pricing");
		}
	}, [currentUser]);
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [sklLoad, setskLoad] = useState(true);
	const [accordionOpen, setAccordionOpen] = useState(false);
	const [upcomingInterview, setUpcomingInterview] = useState(true);
	const [pastInterview, setPastInterview] = useState(false);
	function handleUpcomingInterview() {
		setUpcomingInterview(true);
		setPastInterview(false);
	}
	function handlePastInterview() {
		setPastInterview(true);
		setUpcomingInterview(false);
	}

	const router = useRouter();
	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [interviewUpcoming, setinterviewUpcoming] = useState([]);
	const [interviewPast, setinterviewPast] = useState([]);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);
	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadUpcomingInterview() {
		await axiosInstanceAuth2
			// .get(`/job/upcoming-listing-interview/`)
			.get(`/applicant/upcoming-listing-interview/`)
			.then(async (res) => {
				console.log("!", "upcome", res.data);
				setinterviewUpcoming(res.data);
			})
			.catch((err) => {
				console.log(err);
				setinterviewUpcoming([]);
			});
	}

	async function loadPastInterview() {
		await axiosInstanceAuth2
			// .get(`/job/past-listing-interview/`)
			.get(`/applicant/past-listing-interview/`)
			.then(async (res) => {
				console.log("!", "past", res.data);
				setinterviewPast(res.data);
			})
			.catch((err) => {
				console.log(err);
				setinterviewPast([]);
			});
	}

	useEffect(() => {
		if (token && token.length > 0) {
			loadUpcomingInterview();
			loadPastInterview();
			setskLoad(false);
		}
	}, [token]);
	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	return (
		<>
			<Head>
				<title>{t("Words.Interviews")}</title>
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
						<div className="flex flex-wrap">
							<div className="mb-4 w-full xl:max-w-[300px] 2xl:max-w-[400px]">
								<div className="rounded-normal border bg-white shadow-normal dark:border-gray-600 dark:bg-gray-800 xl:h-[calc(100vh-130px)]">
									<div className="border-b px-8 py-3">
										<h2 className="text-lg font-bold">{t("Words.Filters")}</h2>
									</div>
									<div className="mb-4 border-b py-2">
										<button
											type="button"
											className={
												"flex w-full items-center px-8 py-3 font-bold hover:bg-lightBlue dark:hover:bg-gray-900" +
												" " +
												(upcomingInterview ? "bg-lightBlue text-primary dark:bg-gray-900 dark:text-white" : "")
											}
											onClick={() => handleUpcomingInterview()}
										>
											<i className="fa-solid fa-calendar-days mr-3"></i>
											{t("Words.UpcomingInterviews")}
										</button>
										<button
											type="button"
											className={
												"flex w-full items-center px-8 py-3 font-bold hover:bg-lightBlue dark:hover:bg-gray-900" +
												" " +
												(pastInterview ? "bg-lightBlue text-primary dark:bg-gray-900 dark:text-white" : "")
											}
											onClick={() => handlePastInterview()}
										>
											<i className="fa-solid fa-clock-rotate-left mr-3"></i>
											{t("Words.PastInterviews")}
										</button>
									</div>
									{!upcomingSoon && (
										<div className="px-8 py-3">
											<FormField fieldType="select" label={t("Words.Jobs")} />
											<FormField fieldType="select" label={t("Words.Time")} />
										</div>
									)}
								</div>
							</div>
							<div className="w-full xl:max-w-[calc(100%-300px)] xl:pl-8 2xl:max-w-[calc(100%-400px)]">
								<div className="overflow-hidden rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<div className="bg-white shadow-normal dark:bg-gray-700">
										<h2 className="inline-block min-w-[200px] rounded-tl-normal bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-4 text-center font-semibold text-white shadow-lg">
											{t("Words.Interviews")}
										</h2>
									</div>
									<div className="h-[calc(100vh-185px)] overflow-y-auto px-8">
										{upcomingInterview &&
											interviewUpcoming &&
											(interviewUpcoming.length > 0 ? (
												interviewUpcoming.map((data, i) => (
													<InterviewComp
														key={i}
														data={data}
														axiosInstanceAuth2={axiosInstanceAuth2}
														upcome={true}
														loadUpcomingInterview={loadUpcomingInterview}
													/>
												))
											) : (
												<div className="flex min-h-full items-center justify-center">
													<div className="mx-auto w-full max-w-[300px] py-8 text-center">
														<div className="mb-6 p-2">
															<Image
																src={noInterviewdata}
																alt="No Data"
																width={300}
																className="mx-auto max-h-[200px] w-auto max-w-[200px]"
															/>
														</div>
														<h5 className="mb-4 text-lg font-semibold">
															{t("Select.No")} {t("Words.UpcomingInterviews")}
														</h5>
														<p className="mb-2 text-sm text-darkGray">
															{srcLang === "ja"
																? "現時点では面接はありません。新しい求人を投稿して応募者との面接をスケジュールしてください"
																: "There are no Interviews as of now , Post a New Job to schedule interview with applicants"}
														</p>
													</div>
												</div>
											))}

										{pastInterview &&
											interviewPast &&
											(interviewPast.length > 0 ? (
												interviewPast.map((data, i) => (
													<InterviewComp key={i} data={data} axiosInstanceAuth2={axiosInstanceAuth2} upcome={false} />
												))
											) : (
												<div className="flex min-h-full items-center justify-center">
													<div className="mx-auto w-full max-w-[300px] py-8 text-center">
														<div className="mb-6 p-2">
															<Image
																src={noInterviewdata}
																alt="No Data"
																width={300}
																className="mx-auto max-h-[200px] w-auto max-w-[200px]"
															/>
														</div>
														<h5 className="mb-4 text-lg font-semibold">
															{t("Select.No")} {t("Words.PastInterviews")}
														</h5>
														<p className="mb-2 text-sm text-darkGray">
															{srcLang === "ja"
																? "現時点では面接はありません。新しい求人を投稿して応募者との面接をスケジュールしてください"
																: "There are no Interviews as of now , Post a New Job to schedule interview with applicants"}
														</p>
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
						</div>
						{/* <div className="flex min-h-[calc(100vh-130px)] items-center justify-center rounded-normal bg-white shadow-normal dark:bg-gray-800">
						<div className="mx-auto w-full max-w-[300px] py-8 text-center">
							<div className="mb-6 p-2">
								<Image
									src={noInterviewdata}
									alt="No Data"
									width={300}
									className="mx-auto max-h-[200px] w-auto max-w-[200px]"
								/>
							</div>
							<h5 className="mb-4 text-lg font-semibold">No Interviews</h5>
							<p className="mb-2 text-sm text-darkGray">
								There are no Interviews as of now , Post a New Job to schedule interview with applicants{" "}
							</p>
						</div>
					</div> */}
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
