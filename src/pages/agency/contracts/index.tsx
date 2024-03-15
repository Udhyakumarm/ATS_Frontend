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

	const tabHeading_1 = [
		{
			title: "New Contract"
		},
		{
			title: "Contract List"
		}
	];

	//new vendor state & fun
	const [cname, setcname] = useState("");
	const [email, setemail] = useState("");
	const [contact, setcontact] = useState("");
	const [agreement, setagreement] = useState<File | null>(null);
	const [file, setfile] = useState(false);
	const [aedate, setaedate] = useState("");
	const [add, setadd] = useState("");

	const [fcontracts, setfcontracts] = useState([]);
	const [filterContract, setFilterContract] = useState([]);
	const [search, setsearch] = useState("");

	function checkFormNewContract() {
		return cname.length > 0 && email.length > 0 && aedate.length > 0 && file;
	}

	function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files && event.target.files[0];
			setagreement(file);
			setfile(true);
		}
	}

	async function addContract() {
		var formData = new FormData();
		formData.append("cname", cname);
		formData.append("email", email);
		formData.append("contract", agreement);
		if(add && add.length > 0){formData.append("address", add);}
		if(contact && contact.length > 0){formData.append("contact", contact);}
		formData.append("expire", aedate);
		let url = `/applicant/create-contract/`;
		toastcomp(url, "success");
		await axiosInstanceAuth2
			.post(url, formData)
			.then(async (res) => {
				toastcomp("Contract Send", "success");
				setagreement(null);
				setcname("");
				setemail("");
				setcontact("");
				setadd("");
				setaedate("");
				setfile(false);
				console.log("!", res);
				loadContracts();
			})
			.catch((err) => {
				if (err.response.data.err) {
					seterrMsg(err.response.data.err);
					seterr(true);
					toastcomp(err.response.data.err, "error");
				} else {
					toastcomp("New Agreement Not Send", "error");
				}
				console.log(err);
				setagreement(null);
				setcname("");
				setemail("");
				setcontact("");
				setadd("");
				setaedate("");
				setfile(false);
				console.log("!", res);
				loadContracts();
			});
	}

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

    async function delAccount(acrefid: any) {
			await axiosInstanceAuth2
				.delete(`/applicant/delete-contract/${acrefid}/`)
				.then(async (res) => {
					toastcomp("Contract Deleted", "success");
					loadContracts();
				})
				.catch((err) => {
					console.log(err);
					toastcomp("Contract Not Deleted", "error");
					// setAccountDelete(false);
				});
		}

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
									<span>Contracts</span>
								</h2>
							</div>
							<Tab.Group>
								<div className={"border-b px-4"}>
									<Tab.List className={"mx-auto w-full max-w-[950px]"}>
										{tabHeading_1.map((item, i) => (
											<Tab key={i} as={Fragment}>
												{({ selected }) => (
													<button
														className={
															"mr-16 border-b-4 py-2 font-semibold focus:outline-none" +
															" " +
															(selected
																? "border-primary text-primary dark:border-white dark:text-white"
																: "border-transparent text-darkGray dark:text-gray-400")
														}
													>
														{item.title}
													</button>
												)}
											</Tab>
										))}
									</Tab.List>
								</div>
								<Tab.Panels className={"mx-auto w-full max-w-[980px] px-4 py-8"}>
									<Tab.Panel>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3">
												<FormField
													label={t("Form.Email")}
													fieldType="input"
													inputType="email"
													value={email}
													handleChange={(e) => setemail(e.target.value)}
													required
												/>
											</div>
										</div>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.CompanyName")}
													fieldType="input"
													inputType="text"
													value={cname}
													handleChange={(e) => setcname(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={"Contact"}
													fieldType="input"
													inputType="text"
													value={contact}
													handleChange={(e) => setcontact(e.target.value)}
												/>
											</div>
										</div>
										<div className="-mx-3 flex flex-wrap items-start">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<h6 className="mb-1 font-bold">
													Contract
													<sup className="text-red-500">*</sup>
												</h6>
												{!file ? (
													<div className="relative min-h-[45px] w-full rounded-normal border border-borderColor p-3 pr-9 text-sm focus:bg-red-500 dark:border-gray-600 dark:bg-gray-700">
														<input
															type="file"
															className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
															accept=".pdf,.doc,.docx"
															onChange={handleFileInputChange}
														/>
														<span className="absolute right-3 top-[12px] text-lightGray">
															<i className="fa-solid fa-paperclip"></i>
														</span>
														<span className="absolute left-5 top-[12px] text-darkGray dark:text-gray-400">
															Pdf, Docx etc...
														</span>
													</div>
												) : (
													<div className="my-2 flex">
														<div className="">
															{agreement.type === "application/pdf" && (
																<i className="fa-solid fa-file-pdf text-[50px] text-red-500"></i>
															)}
															{agreement.type === "application/msword" ||
																(agreement.type ===
																	"application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
																	<i className="fa-solid fa-file-word text-[50px] text-indigo-800"></i>
																))}
														</div>
														<div className="my-auto flex grow flex-col pl-4">
															<div className="flex items-center justify-between text-base">
																<span className="flex w-[50%] items-center">
																	<small className="clamp_1 mr-2">{agreement.name && agreement.name}</small>(
																	{agreement.size && <>{(agreement.size / (1024 * 1024)).toFixed(2)} MB</>})
																</span>
																<aside>
																	<button
																		type="button"
																		className="hover:text-underline text-primary"
																		title="View"
																		onClick={() => {
																			if (agreement) {
																				const fileUrl = URL.createObjectURL(agreement);
																				window.open(fileUrl, "_blank");
																			}
																		}}
																	>
																		<i className="fa-solid fa-eye"></i>
																	</button>
																	<button
																		type="button"
																		className="hover:text-underline ml-4 text-red-500"
																		title="Delete"
																		onClick={() => {
																			setfile(false);
																			setagreement(null);
																		}}
																	>
																		<i className="fa-solid fa-trash"></i>
																	</button>
																</aside>
															</div>
															{/* <div className="relative pt-4">
																			<div className="relative h-2 w-full overflow-hidden rounded border bg-gray-100">
																				<span
																					className="absolute left-0 top-0 h-full w-full bg-primary transition-all"
																					style={{ width: "99%" }}
																				></span>
																			</div>
																		</div> */}
														</div>
													</div>
												)}
											</div>
											<div className="flex w-full flex-wrap px-3 md:max-w-[50%]">
												<div className="mb-4 w-full md:pl-2">
													<FormField
														label={t("Form.EndDate")}
														fieldType="input"
														inputType="date"
														value={aedate}
														handleChange={(e) => setaedate(e.target.value)}
														required
													/>
												</div>
											</div>
										</div>

                                        <div className="mb-4 w-full md:pl-2">
													<FormField
														label={"Address"}
														fieldType="textarea"
														value={add}
														handleChange={(e) => setadd(e.target.value)}
													/>
												</div>

										<Button
											label={srcLang === "ja" ? "契約書を送付" : "Send Contract"}
											btnType="button"
											handleClick={addContract}
											disabled={!checkFormNewContract()}
										/>
									</Tab.Panel>

									<Tab.Panel>
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
															data={data}
															key={i}
															delAccount={delAccount}
															loadContracts={loadContracts}
															axiosInstanceAuth2={axiosInstanceAuth2}
														/>
													))}
												</div>
											</>
										)}
									</Tab.Panel>
								</Tab.Panels>
							</Tab.Group>
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
