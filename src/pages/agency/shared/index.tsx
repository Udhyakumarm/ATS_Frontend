import { Dialog, Menu, Tab, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { useSession } from "next-auth/react";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import Head from "next/head";
import OrgSideBar from "@/components/organization/SideBar";
import OrgRSideBar from "@/components/organization/RSideBar";
import OrgTopBar from "@/components/organization/TopBar";
import { useRouter } from "next/router";
import { useNewNovusStore } from "@/utils/novus";
import integrationIcon from "/public/images/icons/integration.png";
import Image from "next/image";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import toastcomp from "@/components/toast";
import ACard from "@/components/agency/acard";

export default function index({ atsVersion, userRole }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
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
	const [fcontracts, setfcontracts] = useState([]);
	const [filterContract, setFilterContract] = useState([]);
	const [search, setsearch] = useState("");
	
	async function loadContracts() {
		await axiosInstanceAuth2
			.get(`/applicant/list-contract/`)
			.then(async (res) => {
				console.log("!-", res.data);
				setFilterContract(res.data);
				setfcontracts(res.data);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	useEffect(() => {
		if (search.length > 0) {
			let localSearch = search.toLowerCase();
			let arr = [];
			for (let i = 0; i < fcontracts.length; i++) {
				if (
					fcontracts[i]["cname"].toLowerCase().includes(localSearch) ||
					fcontracts[i]["email"].toLowerCase().includes(localSearch)
				) {
					arr.push(fcontracts[i]);
				}
			}
			setFilterContract(arr);
		} else {
			setFilterContract(fcontracts);
		}
	}, [search]);

	useEffect(() => {
		if (token && token.length > 0) loadContracts();
	}, [token]);


	return (
		<>
			<Head>
				<title>Contracts</title>
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
					<div className="rounded-normal bg-white shadow-normal dark:bg-gray-800">
						<div className="py-4">
							<div className="mx-auto mb-4 flex w-full max-w-[1100px] flex-wrap items-center justify-start px-4 py-2">
								<button
									onClick={() => router.back()}
									className="mr-10 justify-self-start text-darkGray dark:text-gray-400"
								>
									<i className="fa-solid fa-arrow-left text-xl"></i>
								</button>
								<h2 className="flex items-center text-lg font-bold">
									<div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded bg-[#B2E3FF] p-3">
										<Image src={integrationIcon} alt="Active Job" height={20} />
									</div>
									<span>Shared Application</span>
								</h2>
							</div>
                            <div className={"border-t px-4"}>
                                <div className={"mx-auto w-full max-w-[980px] px-4 py-8"}>
{fcontracts && fcontracts.length <= 0 ? (
											<p className="text-center text-darkGray dark:text-gray-400">
												{srcLang === "ja" ? (
													<>現在ベンダーはありません。新しいベンダーを追加してください</>
												) : (
													<>There are no Contracts as of now , Add a New Contract</>
												)}
											</p>
										) : (
											<>
												<div className="mb-6 flex flex-wrap items-center justify-between">
													<div className="w-[350px] pr-2">
														<FormField
															fieldType="input"
															inputType="search"
															placeholder={t("Words.Search")}
															icon={<i className="fa-solid fa-magnifying-glass"></i>}
															value={search}
															handleChange={(e) => setsearch(e.target.value)}
														/>
													</div>
												</div>
												<div className="mx-[-15px] flex flex-wrap">
													{filterContract.map((data, i) => (
														<ACard
                                                            allocate={true}
															data={data}
															key={i}
															loadContracts={loadContracts}
															axiosInstanceAuth2={axiosInstanceAuth2}
														/>
													))}
												</div>
											</>
										)}
                                </div>
                            </div>
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
