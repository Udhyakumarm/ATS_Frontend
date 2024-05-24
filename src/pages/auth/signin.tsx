import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import { getProviders } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import toastcomp from "@/components/toast";
import { axiosInstance2 } from "../api/axiosApi";
import { useLangStore, useUserStore, useNotificationStore, useVersionStore } from "@/utils/code";
import moment from "moment";
const Toaster = dynamic(() => import("../../components/Toaster"), {
	ssr: false
});
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ToggleLang from "@/components/ToggleLang";
import Novus from "@/components/Novus";
import Validator, { Rules } from "validatorjs";
import Button2 from "@/components/Button2";
import CandFooter from "@/components/candidate/footer";
import { motion } from "framer-motion";
import ToggleLangBottom from "@/components/ToggleLangBottom";

const signInInfoRules: Rules = {
	email: "required|email",
	password: ["required", "min:8"]
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
	if (errorMessage) {
		return (
			<p className="mb-4 text-center text-sm text-red-600">
				<i className="fa-solid fa-xmark fa-lg mr-2 align-middle"></i> {errorMessage}
			</p>
		);
	}
};

export default function AuthSignIn({ providers }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();

	const [formError, setFormError] = useState({
		email: null,
		password: null
	});

	const updateLoginInfo = (
		prevState: { email: string; password: string },
		event: { target: { id: string; value: any } }
	) => {
		const { id: key, value } = event.target;

		const validation = new Validator(
			{ [key]: value },
			{ [key]: signInInfoRules[key] },
			{
				min: "The password must be at least 8 characters long",
				required: "This field is required"
				// regex: "Your password must be alphanumeric with at least one upper case letter"
			}
		);

		if (!validation.passes()) setFormError((prev) => ({ ...prev, [key]: validation.errors.first(key) }));
		else setFormError((prev) => ({ ...prev, [key]: null }));

		return { ...prevState, [key]: value };
	};

	function checkLoginFun() {
		return (
			loginInfo.email.length > 0 &&
			loginInfo.password.length > 0 &&
			formError.email === null &&
			formError.password === null
		);
	}

	const type = useUserStore((state: { type: any }) => state.type);
	const role = useUserStore((state: { role: any }) => state.role);
	const user = useUserStore((state: { user: any }) => state.user);
	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const setversion = useVersionStore((state: { setversion: any }) => state.setversion);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);
	const reminder = useNotificationStore((state: { reminder: any }) => state.reminder);
	const togglereminderMode = useNotificationStore((state: { togglereminderMode: any }) => state.togglereminderMode);
	const [btnLoader, setBtnLoader] = useState(false);
	const [rememberMe, setrememberMe] = useState(true);
	const [termsandcond, setTermsandcond] = useState(false);
	const [success, setSuccess] = useState(false);
	const [wrong, setWrong] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const { error } = useRouter().query;

	const [loginInfo, dispatch] = useReducer(updateLoginInfo, {
		email: "",
		password: ""
	});

	useEffect(() => {
		const storedEmail = localStorage.getItem("myapp-email");
		const storedPassword = localStorage.getItem("myapp-password");
		if (storedEmail) {
			dispatch({
				target: { id: "email", value: storedEmail }
			});
		}
		if (storedPassword) {
			dispatch({
				target: { id: "password", value: storedPassword }
			});
		}
	}, []);

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (rememberMe) {
			localStorage.setItem("myapp-email", loginInfo.email);
			localStorage.setItem("myapp-password", loginInfo.password);
		} else {
			localStorage.removeItem("myapp-email");
			localStorage.removeItem("myapp-password");
		}
		setBtnLoader(true);

		if (loginInfo.email.length > 0 && loginInfo.password.length > 0) {
			const callback = `${
				process.env.NODE_ENV === "production"
					? process.env.NEXT_PUBLIC_PROD_FRONTEND
					: process.env.NEXT_PUBLIC_DEV_FRONTEND
			}`;

			await axiosInstance2
				.post("/organization/login/", {
					email: loginInfo.email,
					password: loginInfo.password
				})
				.then(async (response) => {
					// setBtnLoader(false);
					if (response.data.Message) {
						// toastcomp(response.data.Message, "error");
						setWrong(true);
						setErrorMsg(response.data.Message);
						setSuccess(false);
					} else {
						setSuccess(true);
						setWrong(false);
						setErrorMsg("");
						// console.log("@", response.data);
						if (response.data.role) {
							setrole(response.data.role);
						}
						if (response.data.version) {
							setversion(response.data.version);
							toastcomp(response.data.version, "success");
						}
						if (response.data.type) {
							settype(response.data.type);
							toastcomp(response.data.type, "success");
						}
						if (response.data.userObj && response.data["userObj"].length > 0) {
							setuser(response.data.userObj);
							if (response.data.role === "Super Admin") {
								togglereminderMode(response.data.userObj[0]["register_date"]);
							}
						}
						let aname = "";
						try {
							aname = `${response.data.userObj[0]["name"]} (${response.data.userObj[0]["email"]}) has logged in as an ${
								response.data.role
							} at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

							await axiosInstance2
								.post("/organization/activity-log/unauth/", {
									email: loginInfo.email,
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
							let title = `${response.data.userObj[0]["name"]} (${response.data.userObj[0]["email"]}) has logged in as an ${response.data.role}`;
							// let notification_type = `${}`

							await axiosInstance2
								.post("/applicant/notification/unauth/", {
									email: loginInfo.email,
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

						await signIn("credentials", {
							email: loginInfo.email,
							password: loginInfo.password,
							//For NextAuth
							user_type: "organization",
							callbackUrl: callback
						})
							// .then(async (res) => console.log({ res }))
							.then(async () => await router.push("/"));
					}
				})
				.catch((err) => {
					setBtnLoader(false);
					settype("");
					setrole("");
					setuser([]);
					// console.log(err);

					setWrong(true);
					setSuccess(false);
					if (err.response.data.non_field_errors) {
						err.response.data.non_field_errors.map((text: any) => setErrorMsg(text));
					} else if (err.response.data.detail) {
						// toastcomp(err.response.data.detail, "error");
						setErrorMsg(err.response.data.detail);
					} else if (err.response.data.errors.email) {
						err.response.data.errors.email.map((text: any) => setErrorMsg(text));
					} else {
						setErrorMsg("Server Error, Try Again After Few Min ...");
					}
					return false;
				});
		} else {
			setBtnLoader(false);
			setWrong(true);
			setSuccess(false);

			if (loginInfo.email.length <= 0) setErrorMsg("Fill Up Email");
			else if (loginInfo.password.length <= 0) setErrorMsg("Fill Up Password");
		}
	};
	return (
		<>
			<Head>
				<title>{srcLang === "ja" ? "ログイン" : "Sign In"}</title>
			</Head>
			<main
				className="flex  min-h-screen flex-col bg-gray-50 md:flex-row"
				// initial={{ opacity: 0 }}
				// animate={{ opacity: 1 }}
				// exit={{ opacity: 0}}
			>
				<div className="relative items-center justify-center align-middle md:w-1/2">
					<div className="absolute left-4 top-4  mr-4  flex items-center space-x-4">
						<img src="/images/noAuth/headerLogo1.png" alt="logo" />
					</div>
					<div className="flex  h-screen items-center flex-col text-center justify-center">
						<img
							src="/signin.svg"
							alt="Image Description"
							className="floating-effect mx-auto ml-44 inline-block h-auto max-w-xl  border-b-2 border-black  object-contain p-4 opacity-90"
						/>
						<h1 className="mt-8 ml-56 text-4xl font-extra-bold bg-gradient-to-r from-blue-300 to-blue-700 bg-clip-text text-transparent whitespace-nowrap">Unlock the Magic with Somhako!</h1>
						<p className="mt-4 text-lg font-extrabold text-gray-600 ml-56">Sign in to your account.</p>
					</div>
					<div className="absolute bottom-4 left-4 flex items-center space-x-4">
						<i className="fas fa-globe ml-7 text-2xl text-gray-600"></i>
						<div className="relative">
							<ToggleLangBottom />
						</div>
					</div>
				</div>
				<div
					className="flex flex-col justify-center  shadow-slate-300 md:w-1/2 "
					// initial={{ opacity: 0, x: 100 }}
					// animate={{ opacity: 1, x: 0 }}
					// transition={{ duration: 1.7,ease: "easeInOut"  }}
				>
					<Toaster />
					<form
						className="relative mx-auto h-[550px]  max-w-md rounded-xl border-2  border-neutral-200 bg-white px-6 pt-2 shadow-normal dark:bg-gray-800 md:px-8 md:py-12"
						onSubmit={handleSubmit}
						// initial={{ opacity: 0, y: 50 }}
						// animate={{ opacity: 1, y: 0 }}
						// transition={{ duration: 0.5 }}
					>
						{/* <div className="absolute right-0 top-0 mr-4 mt-4">
							<img src="images/somhako_logo.png" alt="" /> 
						</div> */}

						{/* <div className="absolute right-0 top-0 mr-1 mt-1 inline-block text-center">
							<img src="/images/noAuth/headerLogo.png" alt="logo" className="w-12" />
						</div> */}
						<div className="min-h-[350px]  rounded-large p-6  md:px-8 md:py-4">
							<h1 className="mb-8 whitespace-nowrap text-3xl font-bold">
								{/* {srcLang === "ja" ? (
									"ログイン"
								) : (
									<>
										Sign <span className="text-primary">In</span>
									</>
								)} */}
								Welcome {" "}
								<span className="bg-gradient-to-r from-blue-700 to-sky-400 bg-clip-text font-extrabold text-transparent ">
									Back
								</span>
							</h1>
							<FormField
								fieldType="input"
								inputType="email"
								// label={t("Form.Email")}
								id="email"
								value={loginInfo.email}
								handleChange={dispatch}
								icon={<i className="fa-regular fa-envelope"></i>}
								error={formError.email}
								required
								placeholder="Email"
							/>
							<FormField
								fieldType="input"
								inputType="password"
								// label={t("Form.Password")}
								id="password"
								value={loginInfo.password}
								handleChange={dispatch}
								error={formError.password}
								required
								placeholder="Password"
							/>
							<div className="mb-4 mt-2 px-2 flex flex-wrap items-end justify-between">
								<div className="flex items-center">
									<label htmlFor="rememberMe" className="text-darkGray mr-3">
										<input
											type="checkbox"
											id="rememberMe"
											className="mb-1 mr-2 rounded border-lightGray"
											checked={rememberMe}
											onChange={(e) => setrememberMe(!rememberMe)}
										/>
										{srcLang === "ja" ? "ログイン情報を保存" : "Remember Me"}
									</label>
								</div>
								<Link href={"/auth/forgot"} className="font-bold text-primary hover:underline dark:text-white ml-1">
									{srcLang === "ja" ? "パスワードを忘れた方" : "Forgot Password?"}
								</Link>
							</div>
							<div className="mb-2 mt-2 text-blue-200">
								<Button2
									btnType="submit"
									btnStyle="secondary"
									label={t("Btn.SignIn")}
									full={true}
									loader={btnLoader}
									disabled={btnLoader || !checkLoginFun()}
									transitionClass="leading-pro ease-soft-in tracking-tight-soft active:opacity-85 transition-all duration-300 hover:scale-105"
								/>
							</div>
							<div className="mt-4 flex flex-col items-start  font-normal">
								{/* <label htmlFor="termsAndPrivacy" className=" text-md flex  items-center text-darkGray">
									<input
										type="checkbox"
										id="termsAndPrivacy"
										className="mb-1 mr-2 rounded border-lightGray "
										checked={termsandcond}
										onChange={(e) => setTermsandcond(!termsandcond)}
										// Add your checkbox state and handler here
									/>
									{srcLang === "ja" ? (
										<span>
											<Link href="/terms-of-service" className="text-blue-500 hover:underline ">
												利用規約
											</Link>
											および
											<Link href="/privacy-policy" className="text-blue-500 hover:underline">
												プライバシーポリシー
											</Link>
											を読み、同意しました。
										</span>
									) : (
										<span>
											I have read and accepted the{" "}
											<Link href="/terms-of-service" className="text-blue-500 hover:underline">
												Terms of Service
											</Link>{" "}
											and{" "}
											<Link href="/privacy-policy" className="text-blue-500 hover:underline">
												Privacy Policy
											</Link>
											.
										</span>
									)}
								</label>
								<label htmlFor="rememberMe" className="text-md flex items-center text-darkGray">
									<input
										type="checkbox"
										id="rememberMe"
										className="mb-1 mr-2 flex rounded border-lightGray"
										checked={rememberMe}
										onChange={(e) => setrememberMe(!rememberMe)}
									/>
									{srcLang === "ja" ? "ログイン情報を保存" : "Remember Me"}
								</label> */}
							</div>
							<AuthError error={error} />
							{success && (
								<p className="mb-4 text-center text-sm text-green-600">
									<i className="fa-solid fa-check fa-lg mr-2 align-middle"></i> Login Successfully
								</p>
							)}
							{wrong && (
								<p className="mb-4 text-center text-sm capitalize text-red-600">
									<i className="fa-solid fa-xmark fa-lg mr-2 align-middle"></i>
									{errorMsg}
								</p>
							)}
							<div className="mt-2 flex items-center">
								<hr className="mr-2 flex-grow border-t border-gray-300" />
								<span className="text-gray-500">OR</span>
								<hr className="ml-2 flex-grow border-t border-gray-300" />
							</div>

							<p className="mt-6 text-center text-darkGray">
								{srcLang === "ja" ? "アカウント作成がまだの方は" : "Not sign up yet ?"}{" "}
								<Link href={"/auth/signup"} className="font-bold text-primary hover:underline dark:text-white">
									{srcLang === "ja" ? "こちら" : "Create Account"}
								</Link>
								{/* <CandFooter /> */}
							</p>
						</div>
						{/* <hr className="my-1 w-full" />
						<div className="mt-2 text-right">
							<ToggleLang />
						</div> */}
						{/* <motion.div
							className="mx-auto  flex flex-col"
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.8,ease: "easeOut" }}
						>
							<CandFooter />
						</motion.div> */}
					</form>
					{/* <div
							className="mx-auto  flex flex-col"
							// initial={{ opacity: 0, y: 50 }}
							// animate={{ opacity: 1, y: 0 }}
							// transition={{ duration: 0.5, delay: 0.8,ease: "easeOut" }}
						>
							<CandFooter />
						</div> */}
				</div>
			</main>
		</>
	);
}
export async function getStaticProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	const providers = await getProviders();
	return {
		props: {
			...translations,
			providers
		}
	};
}

AuthSignIn.noAuth = true;
// AS HERE you can see teh in the main div htere is a form and a cand footer component currently due to cand footer being render outisdie the form due to which its being render at top of the pagejust beside teh forma I wnat this structure only that there must be a image aove this footer at the top of the page and the footer i pushed down and teh tis whole image + footer beng parallel to the form div to its side I want o achieve this layout help me do it
