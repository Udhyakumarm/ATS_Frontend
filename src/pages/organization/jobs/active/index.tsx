import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils";
import { useSession } from "next-auth/react";
import HeaderBar from "@/components/HeaderBar";
import JobCard_2 from "@/components/JobCard-2";
import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Image from "next/image";
import bulbIcon from "/public/images/icons/bulb.png";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import noActivedata from "/public/images/no-data/iconGroup-1.png";
import Link from "next/link";
import FormField from "@/components/FormField";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { useNewNovusStore } from "@/utils/novus";
import OrgRSideBar from "@/components/organization/RSideBar";
import Confetti from "react-confetti";
import Button from "@/components/Button";

export default function JobsActive({ atsVersion, userRole, upcomingSoon }: any) {

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
	const [sklLoad] = useState(true);
	const router = useRouter();
	const { data: session } = useSession();
	const [active, setActiveJobs] = useState([]);
	const [factive, setFActiveJobs] = useState([]);
	const [token, settoken] = useState("");
	const [search, setsearch] = useState("");
	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);
	const getActiveJobs = async () => {
		await axiosInstance.api
			.get("/job/list-job", { headers: { authorization: "Bearer " + session?.accessToken } })
			.then((response) => {
				let arr = [];

				response.data.map((job: any) => job.jobStatus === "Active" && arr.push(job));

				setActiveJobs(arr);
				setFActiveJobs(arr);
				console.log("&", "jobs", arr);
			})
			.catch((error) => {
				console.log({ error });
				return null;
			});

		// setDraftedJobs(newDraftedJobs);
	};
	useEffect(() => {
		session && getActiveJobs();
	}, [session]);

	useEffect(() => {
		if (search.length > 0) {
			let localSearch = search.toLowerCase();
			let arr = [];
			for (let i = 0; i < active.length; i++) {
				if (active[i]["jobTitle"].toLowerCase().includes(localSearch)) {
					arr.push(active[i]);
				}
			}
			setFActiveJobs(arr);
		} else {
			setFActiveJobs(active);
		}
	}, [search]);

	return (
		<>
			<Head>
				<title>{t("Words.ActiveJobs")}</title>
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
					<div className="rounded-normal bg-white shadow-normal dark:bg-gray-800">
						<div className="border-b py-4">
							<div className="mx-auto w-full max-w-[1100px] px-4">
								<div className="flex flex-wrap items-center justify-start py-2">
									<button
										onClick={() => router.back()}
										className="mr-10 justify-self-start text-darkGray dark:text-gray-400"
									>
										<i className="fa-solid fa-arrow-left text-xl"></i>
									</button>
									<h2 className="flex items-center text-lg font-bold">
										<div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded bg-[#B2E3FF] p-3">
											<Image src={bulbIcon} alt="Active Job" height={20} />
										</div>
										<span>{t("Words.ActiveJobs")}</span>
									</h2>
								</div>
							</div>
						</div>
						<div className="mx-auto w-full max-w-[980px] px-4 py-8">
							<div className="mb-6">
								<FormField
									fieldType="input"
									inputType="search"
									placeholder={t("Words.Search")}
									icon={<i className="fa-solid fa-search"></i>}
									value={search}
									handleChange={(e) => setsearch(e.target.value)}
								/>
							</div>
							{factive && factive.length > 0 ? (
								<div className="mx-[-15px] flex flex-wrap">
									{factive.map(
										(job: any, i) =>
											job && (
												<div className="mb-[30px] w-full px-[15px] filter xl:max-w-[50%]" key={i}>
													<JobCard_2
														key={i}
														job={job}
														// handleView={() => {
														// 	router.push("/organization/jobs/active/" + job.refid);
														// }}
														axiosInstanceAuth2={axiosInstanceAuth2}
														loadJob={getActiveJobs}
														userRole={userRole}
														setShowConfetti={setShowConfetti}
													/>
												</div>
											)
									)}
								</div>
							) : (
								<div className="mx-auto w-full max-w-[300px] py-8 text-center">
									<div className="mb-6 p-2">
										<Image
											src={noActivedata}
											alt="No Data"
											width={300}
											className="mx-auto max-h-[200px] w-auto max-w-[200px]"
										/>
									</div>
									<h5 className="mb-4 text-lg font-semibold">
										{t("Select.No")} {t("Words.ActiveJobs")}
									</h5>
									<p className="mb-2 text-sm text-darkGray">
										{srcLang === "ja"
											? "アクティブなジョブはありません。アクティブなジョブを管理するには、新しいジョブを投稿してください"
											: "There are no Active Jobs , Post a New Job to manage active Jobs"}
									</p>
									<Link
										href={"/organization/jobs/create"}
										className="my-2 inline-block min-w-[60px] rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-3 py-2 text-[14px] text-white hover:from-gradDarkBlue hover:to-gradDarkBlue"
									>
										{t("Words.PostNewJob")}
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
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
