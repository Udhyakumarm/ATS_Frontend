import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import { getCsrfToken, getProviders, signIn, useSession } from "next-auth/react";
import { axiosInstance } from "@/utils";
import { useRouter } from "next/router";
import Validator, { Rules } from "validatorjs";
import toastcomp from "@/components/toast";
import { axiosInstance2 } from "../api/axiosApi";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import ToggleLang from "@/components/ToggleLang";
import { motion } from "framer-motion";
import CandFooter from "@/components/candidate/footer";
import ToggleLangBottom from "@/components/ToggleLangBottom";

const signUpInfoRules: Rules = {
	email: "required|email",
	password: ["required", "min:8", "regex:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"],
	passwordConfirm: ["required", "min:8", "regex:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"],
	fullName: "required",
	organizationName: "required",
	companyType: "required"
};

const errorMessages = {
	Signin: "Try signing with a different account.",
	OAuthSignin: "Try signing with a different account.",
	OAuthCallback: "Try signing with a different account.",
	OAuthCreateAccount: "Try signing with a different account.",
	EmailCreateAccount: "Try signing with a different account.",
	Callback: "Try signing with a different account.",
	OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
	EmailSignin: "Check your email address.",
	CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
	default: "Unable to sign in."
};

const AuthError = ({ error }: { error: any }) => {
	const errorMessage = error && (errorMessages[error as keyof typeof errorMessages] ?? errorMessages.default);
	return <div className="mt-1 text-[12px] text-red-500">{errorMessage}</div>;
};

export default function AuthSignUp() {
	const router = useRouter();
	const { error } = useRouter().query;

	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [btnLoader, setBtnLoader] = useState(false);
	const [success, setSuccess] = useState(false);
	const [wrong, setWrong] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [check, setcheck] = useState(false);

	const [formError, setFormError] = useState({
		organizationName: null,
		fullName: null,
		email: null,
		companyType: null,
		password: null,
		passwordConfirm: ""
	});
	const updateSignUpInfo = (
		prevState: {
			email: string;
			password: string;
			passwordConfirm: string;
			fullName: string;
			organizationName: string;
			companyType: string;
		},
		event: { target: { id: string; value: any } }
	) => {
		const { id: key, value } = event.target;

		const validation = new Validator(
			{ [key]: value },
			{ [key]: signUpInfoRules[key] },
			{
				min: "The password must be at least 8 characters long",
				required: "This field is required",
				regex: "Your password must be alphanumeric with at least one upper case letter"
			}
		);

		if (!validation.passes()) setFormError((prev) => ({ ...prev, [key]: validation.errors.first(key) }));
		else setFormError((prev) => ({ ...prev, [key]: null }));

		return { ...prevState, [key]: value };
	};

	const [signUpInfo, dispatch] = useReducer(updateSignUpInfo, {
		organizationName: "",
		fullName: "",
		email: "",
		password: "",
		passwordConfirm: "",
		companyType: ""
	});

	function checkRegFun() {
		return (
			signUpInfo.organizationName.length > 0 &&
			signUpInfo.fullName.length > 0 &&
			signUpInfo.email.length > 0 &&
			signUpInfo.password.length > 0 &&
			signUpInfo.passwordConfirm.length > 0 &&
			signUpInfo.companyType.length > 0 &&
			signUpInfo.passwordConfirm === signUpInfo.password &&
			formError.email === null &&
			formError.password === null &&
			formError.organizationName === null &&
			formError.fullName === null &&
			formError.companyType === null &&
			formError.passwordConfirm === null &&
			check
		);
	}

	useEffect(() => {
		if (
			!formError.passwordConfirm &&
			signUpInfo.passwordConfirm !== "" &&
			signUpInfo.password !== signUpInfo.passwordConfirm
		)
			setFormError((prev) => ({ ...prev, passwordConfirm: "The confirmation password does not match" }));
	}, [formError.passwordConfirm, signUpInfo.password, signUpInfo.passwordConfirm]);

	async function handleSignUp(event: { preventDefault: () => void }) {
		setBtnLoader(true);
		const form = new FormData();
		Object.keys(signUpInfo).map((key) => form.append(key, signUpInfo[key as keyof typeof signUpInfo]));
		event.preventDefault();
		await axiosInstance2
			.post("/organization/registration/superadmin/", {
				email: signUpInfo.email,
				name: signUpInfo.fullName,
				company_name: signUpInfo.organizationName.toLowerCase().replace(/\s/g, ""),
				password: signUpInfo.password,
				password2: signUpInfo.passwordConfirm,
				admin_type:
					signUpInfo.companyType[0]["name"] === "Corporation" ? "Organization" : signUpInfo.companyType[0]["name"]
				// company_type: signUpInfo.companyType
			})
			.then(async (response) => {
				// console.log(response);
				setBtnLoader(false);
				setSuccess(true);
				setWrong(false);
				setErrorMsg("");

				let aname = "";
				let title = "";
				try {
					aname = `${signUpInfo.fullName} (${signUpInfo.email}) has newly sign up at ${moment().format(
						"MMMM Do YYYY, h:mm:ss a"
					)}`;

					await axiosInstance2
						.post("/organization/activity-log/unauth/", {
							email: signUpInfo.email,
							aname: aname
						})
						.then((res) => {
							// toastcomp("Log Add", "success");
						})
						.catch((err) => {
							// toastcomp("Log Not Add", "error");
						});
				} catch (error) {
					// toastcomp("Log Not Add", "error");
				}

				try {
					title = `${signUpInfo.fullName} (${signUpInfo.email}) has newly sign up`;
					// let notification_type = `${}`

					await axiosInstance2
						.post("/applicant/notification/unauth/", {
							email: signUpInfo.email,
							title: title
							// notification_type: notification_type
						})
						.then((res) => {
							// toastcomp("Notify Add", "success");
						})
						.catch((err) => {
							// toastcomp("Notify Not Add", "error");
						});
				} catch (error) {
					// toastcomp("Notify Not Add", "error");
				}

				router.push("/auth/signin");
				// setTimeout(() => {
				// 	console.log("Send verification email");
				// }, 100);

				// toastcomp("Successfully Registerd", "success");
				// setTimeout(() => {
				// 	toastcomp("We Send Verification Email", "info");
				// }, 100);
			})
			.catch((err) => {
				setBtnLoader(false);
				setSuccess(false);
				setWrong(true);
				setErrorMsg("");

				// console.log(err);
				if (err.response.data.errors.non_field_errors) {
					err.response.data.errors.non_field_errors.map((text: any) => setErrorMsg(text));
				} else if (err.response.data.errors.email) {
					err.response.data.errors.email.map((text: any) => setErrorMsg(text));
				} else {
					setErrorMsg("Server Error, Try Again After Few Min ...");
				}
				return false;
			});
	}

	return (
		<>
			<Head>
				<title>{srcLang === "ja" ? "アカウント作成" : "Sign Up"}</title>
				<meta name="description" />
			</Head>
			<main
				className="flex min-h-screen flex-col md:flex-row  bg-gray-50"
				// initial={{ opacity: 0 }}
				// animate={{ opacity: 1 }}
				// exit={{ opacity: 0 }}
			>
				
				<div
					className="flex flex-col justify-center  rounded-lg content-center p-4  md:w-1/2"
					// initial={{ opacity: 0, x: 50 }}
					// animate={{ opacity: 1, x: 0 }}
					// transition={{ duration: 1.8, ease: "easeInOut" }}
				>
					<div className="absolute left-4 top-4  mr-4   flex items-center space-x-4">
						<img src="/images/noAuth/headerLogo1.png" alt="logo" />
					</div>
					<form
						className=" relative ml-34 mt-8 mb-4 min-h-[400px] max-w-md mx-auto rounded-xl border-2  border-neutral-200 bg-white p-6 shadow-normal  md:px-16 md:py-6"
						onSubmit={handleSignUp}
					>
						{/* <div className="mb-4 text-center">
							<Logo width={280} />
						</div> */}
						{/* <div className="absolute right-0 top-0 mr-1 mt-1 inline-block text-center">
							<img src="/images/noAuth/headerLogo.png" alt="logo" className="w-12" />
						</div> */}
						<h1 className="mb-6 mt-6 text-3xl font-bold whitespace-nowrap">
							{srcLang === "ja" ? (
								"アカウント作成"
							) : (
								<>
									Welcome to{" "}
								<span className="bg-gradient-to-r from-blue-700 to-sky-400 bg-clip-text font-extrabold text-transparent">
									Somhako
								</span>
								</>
							)}
						</h1>
						<AuthError error={error} />

						<FormField
							fieldType="input"
							inputType="text"
							// label={t("Form.OrgName")}
							id="organizationName"
							handleChange={dispatch}
							value={signUpInfo.organizationName}
							error={formError.organizationName}
							icon={<i className="fa-regular fa-user"></i>}
							required
							placeholder={t("Form.OrgName")}
						/>
						<FormField
							fieldType="input"
							inputType="text"
							// label={t("Form.FullName")}
							id="fullName"
							value={signUpInfo.fullName}
							error={formError.fullName}
							handleChange={dispatch}
							icon={<i className="fa-regular fa-user"></i>}
							required
							placeholder={t("Form.FullName")}
						/>
						<FormField
							fieldType="input"
							inputType="email"
							// label={t("Form.Email")}
							id="email"
							value={signUpInfo.email}
							handleChange={dispatch}
							error={formError.email}
							icon={<i className="fa-regular fa-envelope"></i>}
							required
							placeholder={t("Form.Email")}
						/>
						<FormField
							fieldType="select"
							inputType="text"
							// label={t("Form.OrgType")}
							id="companyType"
							singleSelect
							value={signUpInfo.companyType}
							// options={[
							// 	{ name: t("Select.Sole_Proprietorship") },
							// 	{ name: t("Select.Corporation") },
							// 	{ name: t("Select.Limited_Liability_Company") }
							// ]}
							options={[{ name: "Agency" }, { name: "Corporation" }]}
							handleChange={dispatch}
							error={formError.companyType}
							icon={<i className="fa-regular fa-envelope"></i>}
							required
						/>
						<div className="-mx-2 mb-2 flex flex-wrap">
							<div className="mb-4 w-full px-2 md:max-w-[50%] ">
								<FormField
									fieldType="input"
									inputType="password"
									// label={t("Form.Password")}
									id="password"
									value={signUpInfo.password}
									error={formError.password}
									handleChange={dispatch}
									required
									placeholder={t("Form.Password")}
								/>
							</div>
							<div className="mb-4 w-full px-2 md:max-w-[50%] ">
								<FormField
									fieldType="input"
									inputType="password"
									// label={t("Form.ConfirmPassword")}
									id="passwordConfirm"
									value={signUpInfo.passwordConfirm}
									error={formError.passwordConfirm}
									handleChange={dispatch}
									required
									placeholder="Confirm"
								/>
							</div>
						</div>
						<div className="flex flex-row items-center text-xs">
							<label htmlFor="rememberMe" className="flex flex-wrap gap-1 text-darkGray">
								<input
									type="checkbox"
									id="rememberMe"
									className="mb-1 rounded border-lightGray"
									checked={check}
									onChange={(e) => setcheck(!check)}
								/>
								<span>I accept the</span>
								<Link href="https://somhako.com/terms-conditions" className="text-primary hover:underline">
									terms and conditions
								</Link>
								<span>as well as the</span>
								<Link href="https://somhako.com/privacy-policy" className="text-primary hover:underline">
									privacy policy
								</Link>
							</label>
						</div>
						<div className="mb-2">
							<Button
								btnType="submit"
								label={t("Btn.CreateAccount")}
								full={true}
								loader={btnLoader}
								disabled={btnLoader || !checkRegFun()}
							/>
						</div>
						{success && (
							<p className="mb-4 text-center text-sm text-green-600">
								<i className="fa-solid fa-check fa-lg mr-2 align-middle"></i> Register Successfully - Verification
								E-Mail Send...
							</p>
						)}
						{wrong && (
							<p className="mb-4 text-center text-sm capitalize text-red-600">
								<i className="fa-solid fa-xmark fa-lg mr-2 align-middle"></i> {errorMsg}
							</p>
						)}
						<p className="text-center text-darkGray">
							{srcLang === "ja" ? "アカウント作成がまだの方は" : "Already have an Account?"}{" "}
							<Link href={"/auth/signin"} className="font-bold text-primary hover:underline dark:text-white">
								{srcLang === "ja" ? "こちら" : "Sign In"}
							</Link>
						</p>
						{/* <div className="pt-2 text-right">
							<ToggleLang />
						</div> */}
					</form>
					<div className="absolute bottom-4 left-4 flex items-center space-x-4">
						<i className="fas fa-globe ml-7 text-2xl text-gray-600"></i>
						<div className="relative">
							<ToggleLangBottom />
						</div>
					</div>

					{/* <div
						className="mx-auto flex flex-col"
						// initial={{ opacity: 0, y: 20 }}
						// animate={{ opacity: 1, y: 0 }}
						// transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
					>
						<CandFooter />
					</div> */}
					
				</div>
				<div
					className="flex items-center justify-center md:w-1/2"
					// initial={{ opacity: 0, x: -50 }}
					// animate={{ opacity: 1, x: 0 }}
					// transition={{ duration: 0.8, ease: "easeInOut" }}
				>
						<div className="flex  h-screen items-center flex-col text-center justify-center">
						<img
							src="/images/signup.svg"
							alt="Image Description"
							className="floating-effect mx-auto mr-44 inline-block h-auto max-w-xl r  border-b-2 border-black  object-contain p-4 opacity-90"
						/>
						<h1 className="bg-gradient-to-r from-blue-300 to-blue-700 bg-clip-text text-transparent mt-8 mr-32 text-4xl font-extra-bold text-gray-800 whitespace-nowrap">Start Your Journey with Somhako</h1>
						<p className="mt-4 text-lg font-extrabold text-gray-600 mr-60">Create your account and unlock endless opportunities.</p>
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

AuthSignUp.noAuth = true;
