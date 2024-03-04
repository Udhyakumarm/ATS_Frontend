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

	const applicantlist = useApplicantStore((state: { applicantlist: any }) => state.applicantlist);
	const applicantdetail = useApplicantStore((state: { applicantdetail: any }) => state.applicantdetail);
	const setapplicantlist = useApplicantStore((state: { setapplicantlist: any }) => state.setapplicantlist);

	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	


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

					{refresh === 2 && applicantlist && applicantlist.length < 0 ? (
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
											<div className="mr-3 flex">
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
												<div className="ml-3">
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
												{!upcomingSoon && (
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
												)}
												<TeamMembers selectedData={selectedJob} axiosInstanceAuth2={axiosInstanceAuth2} />
											</aside>
										</div>

										<Canban
											applicantlist={applicantlist}
											atsVersion={atsVersion}
											token={token}
											setcardarefid={setcardarefid}
											setcardstatus={setcardstatus}
										/>
									</>
								)}
							</div>
						</>
					)}
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
