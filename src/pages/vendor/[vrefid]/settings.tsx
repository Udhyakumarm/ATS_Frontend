import VendorSideBar from "@/components/vendor/Sidebar";
import VendorTopBar from "@/components/vendor/TopBar";
import Head from "next/head";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import UploadProfile from "@/components/UploadProfile";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";
import { addExternalNotifyLog, axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore, useNotificationStore } from "@/utils/code";
import toastcomp from "@/components/toast";

export default function VendorSettings() {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const { vrefid } = router.query;

	const cancelButtonRef = useRef(null);
	const [changePass, setChangePass] = useState(false);
	const tabHeading_1 = [
		{
			title: t("Words.Profile")
		},
		{
			title: t("Form.Agreement")
		}
	];
	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [vdata, setvdata] = useState({});

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	const [purl, setpurl] = useState("");
	const [email, setemail] = useState("");
	const [cname, setcname] = useState("");
	const [phone, setphone] = useState("");
	const [aname, setaname] = useState("");
	const [ophone, setophone] = useState("");
	const [lno, setlno] = useState("");
	const [add, setadd] = useState("");
	const [sdate, setsdate] = useState("");
	const [edate, setedate] = useState("");
	const [aggrement, setaggrement] = useState("");
	// const [sign, setsign] = useState<File | null>(null);
	// const [check1, setcheck1] = useState(false);
	// const [file, setfile] = useState(false);

	const [vdata1, setvdata1] = useState({});
	const [vdata2, setvdata2] = useState({});
	const [img, setimage] = useState();
	const [bphone, setbphone] = useState("");
	const [baname, setbaname] = useState("");
	const [bophone, setbophone] = useState("");
	const [badd, setbadd] = useState("");

	async function loadVendorData(id: string) {
		await axiosInstanceAuth2
			.get(`/vendors/vendor_data/${id}/`)
			.then(async (res) => {
				console.log("!", "vendor", res.data);
				if (res.data && res.data.length > 0) {
					// setvdata(res.data[0]);
					setvdata1(res.data[0]);
					const data = res.data;
					for (let i = 0; i < data.length; i++) {
						setemail(data[i]["email"]);
						setcname(data[i]["company_name"]);
						setphone(data[i]["contact_number"]);
						setbphone(data[i]["contact_number"]);
						setaname(data[i]["agent_name"]);
						setbaname(data[i]["agent_name"]);
						// setmsg(data[i]["message"]);
						setsdate(data[i]["agreement_valid_start_date"]);
						setedate(data[i]["agreement_valid_end_date"]);
						setaggrement(data[i]["agreement"]);
					}
				}
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	async function loadVendorData2(id: string) {
		await axiosInstanceAuth2
			.get(`/vendors/vendor_data2/${id}/`)
			.then(async (res) => {
				console.log("!", "vendor", res.data);
				if (res.data && res.data.length > 0) {
					setvdata(res.data[0]);
					setvdata2(res.data[0]);
					const data = res.data;
					for (let i = 0; i < data.length; i++) {
						setlno(data[i]["license_number"]);
						setophone(data[i]["contact_2"]);
						setadd(data[i]["headquater_address"]);
						setbophone(data[i]["contact_2"]);
						setbadd(data[i]["headquater_address"]);
						setpurl(data[i]["vendor_logo"]);
					}
				}
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	useEffect(() => {
		if (vrefid && vrefid.length > 0 && token && token.length > 0) {
			loadVendorData(vrefid);
			loadVendorData2(vrefid);
		}
	}, [vrefid, token]);

	//change password
	const [pass, setpass] = useState("");
	const [cpass, setcpass] = useState("");

	function verfiyPassword() {
		return pass.length > 8 && pass === cpass;
	}

	async function changePassword() {
		const fd = new FormData();
		fd.append("password", pass);
		fd.append("password2", cpass);
		await axiosInstanceAuth2
			.post(`/auth/change-password/`, fd)
			.then(async (res) => {
				toastcomp("Password Change SucessFully", "success");
				setChangePass(false);
				setpass("");
				setcpass("");
			})
			.catch((err) => {
				console.log("@", "gallery", err);
				toastcomp("Password Not Change", "error");
				setChangePass(false);
				setpass("");
				setcpass("");
			});
	}

	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	async function saveNewVendor(formData: any, vid: any) {
		await axiosInstanceAuth2
			.put(`/vendors/newvendor-update/${vid}/`, formData)
			.then(async (res) => {
				toastcomp("Settings Updated", "success");
				loadVendorData(vid);
				loadVendorData2(vid);

				let title = `Settings Updated`;
				addExternalNotifyLog(axiosInstanceAuth2, title);
				toggleLoadMode(true);
			})
			.catch((err) => {
				console.log(err);
				if (err.message != "Request failed with status code 401") {
					toastcomp("Settings Not Updated", "error");
				}
			});
	}
	async function saveVendorReg(formData: any, vid: any) {
		await axiosInstanceAuth2
			.put(`/vendors/regvendor-update/`, formData)
			.then(async (res) => {
				toastcomp("Settings Updated", "success");
				loadVendorData(vid);
				loadVendorData2(vid);

				let title = `Settings Updated`;
				addExternalNotifyLog(axiosInstanceAuth2, title);
				toggleLoadMode(true);
			})
			.catch((err) => {
				console.log(err);
				if (err.message != "Request failed with status code 401") {
					toastcomp("Settings Not Updated", "error");
				}
			});
	}

	useEffect(() => {
		//img,bophone,badd vdata2

		const fd1 = new FormData();
		const fd2 = new FormData();
		if (img) {
			fd1.append("vendor_logo", img);
		}
		if (vdata2["contact_2"] != bophone) {
			fd1.append("contact_2", bophone);
		}
		if (vdata2["headquater_address"] != badd) {
			fd1.append("headquater_address", badd);
		}

		if (vdata1["contact_number"] != bphone) {
			fd2.append("contact_number", bphone);
		}
		if (vdata2["agent_name"] != baname) {
			fd2.append("agent_name", baname);
		}

		if (Array.from(fd1.keys()).length > 0) {
			saveVendorReg(fd1, vrefid);
		}

		if (Array.from(fd2.keys()).length > 0) {
			saveNewVendor(fd2, vrefid);
		}
	}, [img, bphone, bophone, baname, badd]);

	return (
		<>
			<Head>
				<title>
					{t("Words.Vendors")} | {t("Words.Settings")}
				</title>
			</Head>
			<main>
				<VendorSideBar />
				<VendorTopBar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className="layoutWrap p-4 lg:p-8">
					<div className="relative rounded-normal bg-white shadow-normal dark:bg-gray-800">
						<h1 className="mb-3 p-10 pb-0 text-xl font-bold">{t("Words.Settings")}</h1>
						<Tab.Group>
							<div className="border-b dark:border-b-gray-600">
								<Tab.List className={"mx-auto w-full max-w-[1150px] px-4"}>
									{tabHeading_1.map((item, i) => (
										<Tab key={i} as={Fragment}>
											{({ selected }) => (
												<button
													className={
														"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
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
							<Tab.Panels>
								<Tab.Panel>
									<div className="mx-auto w-full max-w-[1150px] px-4 py-6">
										<div className="mb-4">
											<UploadProfile
												note="Supported Formats 2 mb  : Png , Jpeg"
												purl={purl}
												handleChange={(e) => setimage(e.target.files[0])}
											/>
										</div>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.CompanyName")}
													fieldType="input"
													inputType="text"
													value={cname}
													handleChange={(e) => setcname(e.target.value)}
													readOnly
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.Email")}
													fieldType="input"
													inputType="email"
													readOnly
													value={email}
													handleChange={(e) => setemail(e.target.value)}
												/>
											</div>
										</div>
										<FormField
											label={t("Form.AgentName")}
											fieldType="input"
											inputType="text"
											value={aname}
											handleChange={(e) => setaname(e.target.value)}
											handleOnBlur={(e) => setbaname(e.target.value)}
											// readOnly
										/>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.PhoneNumber")}
													fieldType="input"
													inputType="text"
													value={phone}
													handleChange={(e) => setphone(e.target.value)}
													handleOnBlur={(e) => setbphone(e.target.value)}
													// readOnly
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.PhoneNumberOptional")}
													fieldType="input"
													inputType="text"
													value={ophone}
													handleChange={(e) => setophone(e.target.value)}
													handleOnBlur={(e) => setbophone(e.target.value)}
													// readOnly
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.LicenseNumber")}
													fieldType="input"
													inputType="text"
													value={lno}
													handleChange={(e) => setlno(e.target.value)}
													readOnly
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.HeadquarterLocation")}
													fieldType="input"
													inputType="text"
													// readOnly
													value={add}
													handleChange={(e) => setadd(e.target.value)}
													handleOnBlur={(e) => setbadd(e.target.value)}
												/>
											</div>
										</div>
										<hr className="my-4" />
										<div>
											<h6 className="mb-1 font-bold">{t("Form.Password") + " " + t("Words.Settings")}</h6>
											<Button
												btnType="button"
												label={t("Btn.ChangePassword")}
												handleClick={() => setChangePass(true)}
											/>
										</div>
									</div>
								</Tab.Panel>
								<Tab.Panel>
									<div className="mx-auto w-full max-w-[1150px] px-4 py-6">
										<div className="mx-auto mb-10 w-full max-w-[700px]">
											{aggrement && aggrement.length > 0 && (
												<iframe src={`${aggrement}`} className="h-[60vh] w-[100%] overflow-auto"></iframe>
											)}
										</div>
										<div className="flex max-w-[600px] flex-wrap">
											{/* <h6 className="mb-2 w-full font-bold">Agreement Validity</h6> */}
											<div className="w-full pr-2 md:max-w-[50%]">
												<FormField
													label={t("Form.Agreement") + " " + t("Form.StartDate")}
													fieldType="input"
													inputType="date"
													value={sdate}
													handleChange={(e) => {
														setsdate(e.target.value);
													}}
													readOnly
												/>
											</div>
											<div className="w-full pl-2 md:max-w-[50%]">
												<FormField
													label={t("Form.Agreement") + " " + t("Form.EndDate")}
													fieldType="input"
													inputType="date"
													value={edate}
													handleChange={(e) => {
														setedate(e.target.value);
													}}
													readOnly
												/>
											</div>
										</div>
									</div>
								</Tab.Panel>
							</Tab.Panels>
						</Tab.Group>
					</div>
				</div>
			</main>
			<Transition.Root show={changePass} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setChangePass}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-lg">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">{t("Btn.ChangePassword")}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setChangePass(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{/* <FormField fieldType="input" inputType="password" label={t('Form.OldPassword')} required /> */}
										<FormField
											fieldType="input"
											inputType="password"
											label={t("Form.NewPassword")}
											required
											value={pass}
											handleChange={(e) => setpass(e.target.value)}
										/>
										<FormField
											fieldType="input"
											inputType="password"
											label={t("Form.ConfirmPassword")}
											required
											value={cpass}
											handleChange={(e) => setcpass(e.target.value)}
										/>
										<div className="text-center">
											<Button
												label={t("Btn.Submit")}
												btnType="button"
												disabled={!verfiyPassword()}
												handleClick={changePassword}
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
export async function getServerSideProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	return {
		props: {
			...translations
		}
	};
}
