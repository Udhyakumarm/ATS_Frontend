import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Head from "next/head";
import Image from "next/image";
import { Dialog, Menu, Tab, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import integrationIcon from "/public/images/icons/integration.png";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";
import { addActivityLog, addNotifyLog, axiosInstanceAuth } from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";
import VCard from "@/components/vendor/vcard";
import { useNotificationStore, useUserStore } from "@/utils/code";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { useNewNovusStore } from "@/utils/novus";
import OrgRSideBar from "@/components/organization/RSideBar";
import PermiumComp from "@/components/organization/premiumComp";

export default function Vendors({ atsVersion, userRole }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
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

	const userState = useUserStore((state: { user: any }) => state.user);

	const cancelButtonRef = useRef(null);
	const [sentAgreement, setSentAgreement] = useState(false);

	const tabHeading_1 = [
		{
			title: t("Words.OnBoard")
		},
		{
			title: t("Words.VendorsList")
		}
	];
	const tabHeading_2 = [
		{
			title: t("Words.NewVendor"),
			icon: <i className="fa-solid fa-user-plus"></i>
		},
		{
			title: t("Words.PendingVendors"),
			icon: <i className="fa-solid fa-clock"></i>
		}
	];

	//new vendor state & fun
	const [cname, setcname] = useState("");
	const [email, setemail] = useState("");
	const [phone, setphone] = useState("");
	const [aname, setaname] = useState("");
	const [msg, setmsg] = useState("");
	const [agreement, setagreement] = useState<File | null>(null);
	const [file, setfile] = useState(false);
	const [asdate, setasdate] = useState("");
	const [aedate, setaedate] = useState("");

	const [nvlink, setnvlink] = useState("");
	const [err, seterr] = useState(false);
	const [errMsg, seterrMsg] = useState("");

	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	function checkFormNewVendor() {
		return (
			cname.length > 0 &&
			email.length > 0 &&
			phone.length > 0 &&
			aname.length > 0 &&
			msg.length > 0 &&
			asdate.length > 0 &&
			aedate.length > 0 &&
			file
		);
	}

	function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files && event.target.files[0];
			setagreement(file);
			setfile(true);
		}
	}

	async function loadVendorData(email: string) {
		await axiosInstanceAuth2
			.get(`/vendors/vendor_data1/${email}/`)
			.then(async (res) => {
				console.log("!", res.data);
				if (res.data && res.data.length > 0) {
					if (res.data[0]["vrefid"]) {
						if (process.env.NODE_ENV === "production") {
							setnvlink(`${process.env.NEXT_PUBLIC_PROD_FRONTEND}/vendor/${res.data[0]["vrefid"]}/signup`);
						} else {
							setnvlink(`${process.env.NEXT_PUBLIC_DEV_FRONTEND}/vendor/${res.data[0]["vrefid"]}/signup`);
						}
					}
				}
				setSentAgreement(true);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	async function addAgreement() {
		var formData = new FormData();
		formData.append("company_name", cname);
		formData.append("email", email);
		formData.append("contact_number", phone);
		formData.append("agent_name", aname);
		formData.append("message", msg);
		formData.append("agreement", agreement);
		formData.append("agreement_valid_start_date", asdate);
		formData.append("agreement_valid_end_date", aedate);
		await axiosInstanceAuth2
			.post(`/vendors/new_vendor/`, formData)
			.then(async (res) => {
				toastcomp("New Agreement Send", "success");

				let aname2 = `New Vendor ${aname} (${email}) Agreement Sent by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname2);

				let title = `New Vendor ${aname} (${email}) Agreement Sent by ${userState[0]["name"]} (${userState[0]["email"]}) `;

				addNotifyLog(axiosInstanceAuth2, title, "", "/organization/settings/vendors");
				toggleLoadMode(true);

				setagreement(null);
				setcname("");
				// setemail("");
				setphone("");
				setaname("");
				setmsg("");
				setasdate("");
				setaedate("");
				setfile(false);
				console.log("!", res);
				loadVendorData(email);
				loadVendors();
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
				setphone("");
				setaname("");
				setmsg("");
				setasdate("");
				setaedate("");
				setfile(false);
				console.log("!", err);
				loadVendors();
			});
	}

	//pending vendor state & fun
	const [vendors, setvendors] = useState([]);
	const [pvendors, setpvendors] = useState([]);
	const [fvendors, setfvendors] = useState([]);

	const [filterVendors, setFilterVendors] = useState([]);
	const [search, setsearch] = useState("");

	async function loadVendors() {
		await axiosInstanceAuth2
			.get(`/vendors/list_vendors/`)
			.then(async (res) => {
				console.log("!-", res.data);
				setvendors(res.data);
				setFilterVendors(res.data);
				const data = res.data;
				var arr = [];
				var arr2 = [];
				for (let i = 0; i < data.length; i++) {
					if (!data[i]["onboard"]) {
						arr.push(data[i]);
					} else {
						arr2.push(data[i]);
					}
				}
				setpvendors(arr);
				setfvendors(arr2);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	useEffect(() => {
		if (search.length > 0) {
			let localSearch = search.toLowerCase();
			let arr = [];
			for (let i = 0; i < vendors.length; i++) {
				if (
					vendors[i]["company_name"].toLowerCase().includes(localSearch) ||
					vendors[i]["email"].toLowerCase().includes(localSearch) ||
					vendors[i]["agent_name"].toLowerCase().includes(localSearch)
				) {
					arr.push(vendors[i]);
				}
			}
			setFilterVendors(arr);
		} else {
			setFilterVendors(vendors);
		}
	}, [search]);

	useEffect(() => {
		if (token && token.length > 0) loadVendors();
	}, [token]);

	async function onBoardVendor(vid: string) {
		await axiosInstanceAuth2
			.post(`/vendors/onboard_vendors/${vid}/`)
			.then(async (res) => {
				console.log("!", res.data);

				if (res.data.message === "Onboard Successfully") {
					let aname2 = `Vendor ${vid} Onboard by ${userState[0]["name"]} (${
						userState[0]["email"]
					}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

					addActivityLog(axiosInstanceAuth2, aname2);

					let title = `Vendor ${vid} Onboard by ${userState[0]["name"]} (${userState[0]["email"]})`;

					addNotifyLog(axiosInstanceAuth2, title, "", "/organization/settings/vendors");
					toggleLoadMode(true);
				}

				toastcomp(res.data.message, "success");
				loadVendors();
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("Server Error", "error");
				loadVendors();
			});
	}

	async function activateVendor(vid: string, activate: any) {
		const fd = new FormData();
		fd.append("activate", activate);
		await axiosInstanceAuth2
			.post(`/vendors/activate_vendors/${vid}/`, fd)
			.then(async (res) => {
				console.log("!", res.data);

				if (res.data.message === "Update Successfully" && activate) {
					let aname2 = `Vendor ${vid} Activate by ${userState[0]["name"]} (${
						userState[0]["email"]
					}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

					addActivityLog(axiosInstanceAuth2, aname2);

					let title = `Vendor ${vid} Activate by ${userState[0]["name"]} (${userState[0]["email"]}) `;

					addNotifyLog(axiosInstanceAuth2, title, "", "/organization/settings/vendors");
					toggleLoadMode(true);
				}

				if (res.data.message === "Update Successfully" && !activate) {
					let aname2 = `Vendor ${vid} Deactivate by ${userState[0]["name"]} (${
						userState[0]["email"]
					}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

					addActivityLog(axiosInstanceAuth2, aname2);

					let title = `Vendor ${vid} Deactivate by ${userState[0]["name"]} (${userState[0]["email"]}) `;

					addNotifyLog(axiosInstanceAuth2, title, "", "/organization/settings/vendors");
					toggleLoadMode(true);
				}

				toastcomp(res.data.message, "success");
				loadVendors();
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("Server Error", "error");
				loadVendors();
			});
	}

	// const [accountDelete, setAccountDelete] = useState(false);
	async function delAccount(vrefid: any) {
		await axiosInstanceAuth2
			.delete(`/vendors/delete/${vrefid}/`)
			.then(async (res) => {
				toastcomp("Vendor Account Deleted", "success");
				// setAccountDelete(false);
				loadVendors();
				// signOut({ callbackUrl: `/organization/${cname}` });

				// settype("");
				// setrole("");
				// setuser([]);
			})
			.catch((err) => {
				console.log(err);
				toastcomp("Vendor Account Not Deleted", "error");
				// setAccountDelete(false);
			});
	}

	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	return (
		<>
			<Head>
				<title>{t("Words.Vendors")}</title>
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
									<span>{t("Words.Vendors")}</span>
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
										<Tab.Group>
											<Tab.List className={"mb-6 border-b"}>
												{tabHeading_2.map((item, i) => (
													<Tab key={i} as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"mr-6 inline-flex items-center border-b-4 px-4 py-2 font-semibold focus:outline-none" +
																	" " +
																	(selected
																		? "border-primary text-primary dark:border-white dark:text-white"
																		: "border-transparent text-darkGray dark:text-gray-400")
																}
															>
																<div className="mr-2">{item.icon}</div>
																{item.title}
															</button>
														)}
													</Tab>
												))}
											</Tab.List>
											<Tab.Panels>
												<Tab.Panel>
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
																label={t("Form.PhoneNumber")}
																fieldType="input"
																inputType="text"
																value={phone}
																handleChange={(e) => setphone(e.target.value)}
																required
															/>
														</div>
														<div className="mb-4 w-full px-3 md:max-w-[50%]">
															<FormField
																label={t("Form.AgentName")}
																fieldType="input"
																inputType="text"
																value={aname}
																handleChange={(e) => setaname(e.target.value)}
																required
															/>
														</div>
													</div>
													<FormField
														label={t("Form.Message")}
														fieldType="textarea"
														value={msg}
														handleChange={(e) => setmsg(e.target.value)}
														required
													/>
													<div className="-mx-3 flex flex-wrap items-start">
														<div className="mb-4 w-full px-3 md:max-w-[50%]">
															<h6 className="mb-1 font-bold">
																{t("Form.Agreement")}
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
																	<div className="flex grow flex-col justify-between pl-4">
																		<div className="flex items-center justify-between text-[12px]">
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
																		<div className="relative pt-4">
																			<div className="relative h-2 w-full overflow-hidden rounded border bg-gray-100">
																				<span
																					className="absolute left-0 top-0 h-full w-full bg-primary transition-all"
																					style={{ width: "99%" }}
																				></span>
																			</div>
																		</div>
																	</div>
																</div>
															)}
														</div>
														<div className="flex w-full flex-wrap px-3 md:max-w-[50%]">
															{/* <h6 className="mb-1 w-full font-bold">Agreement Validity</h6> */}
															<div className="mb-4 w-full pr-2 md:max-w-[50%]">
																<FormField
																	label={t("Form.StartDate")}
																	fieldType="input"
																	inputType="date"
																	value={asdate}
																	handleChange={(e) => {
																		setasdate(e.target.value);
																	}}
																	required
																/>
															</div>
															<div className="mb-4 w-full md:max-w-[50%] md:pl-2">
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
													<Button
														label={srcLang === "ja" ? "契約書を送付" : "Send Agreement"}
														btnType="button"
														handleClick={addAgreement}
														disabled={!checkFormNewVendor()}
													/>
												</Tab.Panel>
												<Tab.Panel>
													{pvendors && pvendors.length <= 0 ? (
														<p className="text-center text-darkGray dark:text-gray-400">
															{srcLang === "ja" ? (
																<>現在ベンダーはありません。新しいベンダーを追加してください</>
															) : (
																<>There are no Vendors as of now , Add a New Vendor</>
															)}
														</p>
													) : (
														<>
															<div className="mb-6">
																<FormField
																	fieldType="input"
																	inputType="search"
																	placeholder={t("Words.Search")}
																	icon={<i className="fa-solid fa-search"></i>}
																/>
															</div>
															<div className="mx-[-15px] flex flex-wrap">
																{pvendors.map((data, i) => (
																	<VCard
																		data={data}
																		onBoardVendor={onBoardVendor}
																		key={i}
																		axiosInstanceAuth2={axiosInstanceAuth2}
																	/>
																))}
															</div>
														</>
													)}
												</Tab.Panel>
											</Tab.Panels>
										</Tab.Group>
									</Tab.Panel>
									<Tab.Panel>
										{fvendors && fvendors.length <= 0 ? (
											<p className="text-center text-darkGray dark:text-gray-400">
												{srcLang === "ja" ? (
													<>現在ベンダーはありません。新しいベンダーを追加してください</>
												) : (
													<>There are no Vendors as of now , Add a New Vendor</>
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
													{/* <div className="flex grow items-center justify-end">
														<div className="mr-3 w-[150px]">
															<FormField
																fieldType="select"
																placeholder={t("Words.Sort")}
																singleSelect={true}
																options={[
																	{
																		id: "A-to-Z",
																		name: "A to Z"
																	},
																	{
																		id: "Z-to-A",
																		name: "Z to A"
																	}
																]}
															/>
														</div>
														<div className="w-[150px]">
															<label
																htmlFor="teamSelectAll"
																className="flex min-h-[45px] w-full cursor-pointer items-center justify-between rounded-normal border border-borderColor p-3 text-sm text-darkGray dark:border-gray-600 dark:bg-gray-700"
															>
																<span>{t("Words.SelectAll")}</span>
																<input type="checkbox" id="teamSelectAll" />
															</label>
														</div>
													</div> */}
												</div>
												<div className="mx-[-15px] flex flex-wrap">
													{filterVendors.map((data, i) => (
														<VCard
															data={data}
															onBoardVendor={onBoardVendor}
															key={i}
															fvendor={true}
															delAccount={delAccount}
															activateVendor={activateVendor}
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
			<Transition.Root show={sentAgreement} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setSentAgreement}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "契約書を送信しました" : "Agreement Sent"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setSentAgreement(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="mx-auto w-full max-w-[500px] p-8 text-center">
										<i className="fa-solid fa-circle-check mb-2 text-[50px] text-green-500"></i>
										<h4 className="mb-6 text-lg font-bold">
											{srcLang === "ja" ? "契約書は正常に送信されました" : "Agreement Sent Successfully"}
										</h4>
										<p className="mb-2 text-sm text-darkGray dark:text-gray-400">
											{srcLang === "ja"
												? "リンクをコピーしてベンダーと共有します"
												: "Copy link to share this with vendor"}
										</p>
										<div className="relative mb-6">
											<input
												type="text"
												value={nvlink}
												className="min-h-[45px] w-full rounded-normal border border-borderColor p-3 pr-14 text-sm dark:border-gray-600 dark:bg-gray-700"
											/>
											<button
												type="button"
												className="absolute right-0 top-0 h-full w-10 rounded-r-normal bg-slate-300 hover:bg-slate-400"
												onClick={() => {
													navigator.clipboard.writeText(nvlink);
												}}
											>
												<i className="fa-solid fa-copy"></i>
											</button>
										</div>
										<Button label={t("Btn.Close")} btnType="button" handleClick={() => setSentAgreement(false)} />
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={err} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={seterr}>
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
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "プランをアップグレードする" : "Upgrade Your Plan"}
										</h4>
										<button type="button" className="leading-none hover:text-gray-700" onClick={() => seterr(false)}>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{err && errMsg.length > 0 && (
											<PermiumComp userRole={userRole} title={errMsg} setUpgradePlan={seterr} />
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
