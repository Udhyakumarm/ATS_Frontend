import Button from "@/components/Button";
import FormField from "@/components/FormField";
import UploadProfile from "@/components/UploadProfile";
import { Dialog, Transition } from "@headlessui/react";
import { useState, useRef, Fragment, useEffect } from "react";
import UpcomingComp from "@/components/organization/upcomingComp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import toastcomp from "@/components/toast";
import { addExternalNotifyLog, axiosInstanceAuth } from "@/pages/api/axiosApi";
import { signOut, useSession } from "next-auth/react";
import { useCarrierStore, useLangStore, useUserStore, useVersionStore, useNotificationStore } from "@/utils/code";
import CandFooter from "@/components/candidate/footer";

export default function CandSettings({ upcomingSoon }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);
	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const cancelButtonRef = useRef(null);
	const [changePass, setChangePass] = useState(false);
	const [accountDelete, setAccountDelete] = useState(false);
	const [profileimg, setProfileImg] = useState();

	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [fname, setfname] = useState("");
	const [lname, setlname] = useState("");
	const [bfname, setbfname] = useState("");
	const [blname, setblname] = useState("");
	const [data, setdata] = useState({});

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

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
				let title = `Password Changed`;
				addExternalNotifyLog(axiosInstanceAuth2, title);
				toggleLoadMode(true);
			})
			.catch((err) => {
				console.log("@", "gallery", err);
				toastcomp("Password Not Change", "error");
				setChangePass(false);
				setpass("");
				setcpass("");
			});
	}

	async function loadSettings() {
		await axiosInstanceAuth2
			.get(`/candidate/get-candidate-settings/`)
			.then(async (res) => {
				console.log("&", "Settings", res.data);
				setdata(res.data[0]);
				setfname(res.data[0]["first_name"]);
				setlname(res.data[0]["last_name"]);
			})
			.catch((err) => {
				console.log("&", "Settings", err);
			});
	}

	useEffect(() => {
		if (token && token.length > 0) {
			loadSettings();
		}
	}, [token]);

	async function saveSettings(formData: any) {
		await axiosInstanceAuth2
			.put(`/candidate/update-candidate-settings/${data["erefid"]}/`, formData)
			.then(async (res) => {
				toastcomp("Settings Updated", "success");
				loadSettings();

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
		if (data) {
			var formData = new FormData();
			if (data["first_name"] != bfname && bfname.length > 0) {
				formData.append("first_name", bfname);
			}
			if (data["last_name"] != blname && blname.length > 0) {
				formData.append("last_name", blname);
			}
			if (profileimg) {
				formData.append("profile", profileimg);
			}

			if (Array.from(formData.keys()).length > 0) {
				saveSettings(formData);
			}
		}
	}, [bfname, blname, profileimg]);

	async function delAccount() {
		await axiosInstanceAuth2
			.get(`/candidate/delete-candidate/${data["erefid"]}/${cid}/`)
			.then(async (res) => {
				toastcomp("Account Deleted", "success");
				setAccountDelete(false);
				signOut({ callbackUrl: `/organization/${cname}` });

				settype("");
				setrole("");
				setuser([]);
			})
			.catch((err) => {
				console.log(err);
				toastcomp("Account Not Deleted", "error");
				setAccountDelete(false);
			});
	}

	return (
		<>
			<main className="py-8">
				<div className="container">
					<div className="rounded-normal bg-white p-6 shadow-normal dark:bg-gray-800">
						{!upcomingSoon ? (
							<UpcomingComp />
						) : (
							<>
								<div className="mb-4">
									<UploadProfile
										note="Supported Formats 2MB  : png , jpg "
										purl={data["profile"]}
										handleChange={(e) => setProfileImg(e.target.files[0])}
									/>
								</div>
								<div className="-mx-4 flex flex-wrap">
									<div className="mb-4 w-full px-4 md:max-w-[50%]">
										<FormField
											fieldType="input"
											inputType="input"
											label={t("Form.FirstName")}
											value={fname}
											handleChange={(e) => setfname(e.target.value)}
											handleOnBlur={(e) => setbfname(e.target.value)}
										/>
									</div>
									<div className="mb-4 w-full px-4 md:max-w-[50%]">
										<FormField
											fieldType="input"
											inputType="input"
											label={t("Form.LastName")}
											value={lname}
											handleChange={(e) => setlname(e.target.value)}
											handleOnBlur={(e) => setblname(e.target.value)}
										/>
									</div>
								</div>
								<FormField fieldType="input" inputType="email" label={t("Form.Email")} value={data["email"]} readOnly />
								<div className="mb-4">
									<h6 className="mb-1 inline-block font-bold">Unique ID</h6>
									<div className="flex w-full items-center rounded-normal border border-borderColor p-1 dark:border-gray-600 dark:bg-gray-700">
										<input
											type="text"
											className="grow border-0 text-sm focus:ring-0 dark:bg-gray-700"
											value={data["erefid"]}
											readOnly
										/>
										<button
											type="button"
											className="w-[50px] py-2"
											onClick={() => {
												navigator.clipboard.writeText(data["erefid"]);
												toastcomp("ID Copied to clipboard", "success");
											}}
										>
											<i className="fa-solid fa-copy"></i>
										</button>
									</div>
								</div>
								<hr className="my-4" />
								<div>
									<h6 className="mb-1 font-bold">
										{t("Form.Password")} {t("Words.Settings")}
									</h6>
									<Button btnType="button" label={t("Btn.ChangePassword")} handleClick={() => setChangePass(true)} />
								</div>
								<hr className="my-4" />
								<Button
									btnType="submit"
									btnStyle="danger"
									label={t("Btn.DeleteAccount")}
									handleClick={() => setAccountDelete(true)}
								/>
							</>
						)}
					</div>
				</div>
			</main>
			<CandFooter />
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
			<Transition.Root show={accountDelete} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAccountDelete}>
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
										<h4 className="flex items-center font-semibold leading-none">{t("Btn.DeleteAccount")}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAccountDelete(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<h3 className="mb-4 text-center text-lg font-bold">
											{srcLang === "ja"
												? "アカウントを削除してもよろしいですか?"
												: "Are you sure want to delete your account?"}
										</h3>
										<div className="flex flex-wrap justify-center">
											<div className="my-1 mr-4 last:mr-0">
												<Button
													btnStyle="gray"
													label={t("Select.No")}
													btnType="button"
													handleClick={() => setAccountDelete(false)}
												/>
											</div>
											<div className="my-1 mr-4 last:mr-0">
												<Button btnStyle="danger" label={t("Select.Yes")} btnType="button" handleClick={delAccount} />
											</div>
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

CandSettings.mobileEnabled = true;
