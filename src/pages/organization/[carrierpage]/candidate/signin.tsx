import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import { getProviders } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useCarrierStore, useUserStore } from "@/utils/code";
import { axiosInstance, axiosInstance2 } from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";
import Image from "next/image";
import ToggleLang from "@/components/ToggleLang";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import Validator, { Rules } from "validatorjs";

const signInInfoRules: Rules = {
	email: "required|email",
	password: ["required", "min:8", "regex:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"]
};

export default function CandSignIn({ providers }: any) {
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
				required: "This field is required",
				regex: "Your password must be alphanumeric with at least one upper case letter"
			}
		);

		if (!validation.passes()) setFormError((prev) => ({ ...prev, [key]: validation.errors.first(key) }));
		else setFormError((prev) => ({ ...prev, [key]: null }));

		return { ...prevState, [key]: value };
	};

	const [loginInfo, dispatch] = useReducer(updateLoginInfo, {
		email: "",
		password: ""
	});

	function checkLoginFun() {
		return (
			loginInfo.email.length > 0 &&
			loginInfo.password.length > 0 &&
			formError.email === null &&
			formError.password === null
		);
	}

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

	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const cname = useCarrierStore((state: { cname: any }) => state.cname);

	const type = useUserStore((state: { type: any }) => state.type);
	const role = useUserStore((state: { role: any }) => state.role);
	const user = useUserStore((state: { user: any }) => state.user);
	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);
	const orgdetail: any = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);
	const [btnLoader, setBtnLoader] = useState(false);
	const [rememberMe, setrememberMe] = useState(true);
	const [success, setSuccess] = useState(false);
	const [wrong, setWrong] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

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

		await axiosInstance
			.post(`/candidate/candidatecheck/${loginInfo.email}/${cid}/`)
			.then(async (res) => {
				if (res.data.success) {
					await axiosInstance2
						.post("/candidate/candidatelogin/", {
							email: loginInfo.email,
							password: loginInfo.password
						})
						.then(async (response) => {
							setBtnLoader(false);

							setSuccess(true);
							setWrong(false);
							setErrorMsg("");
							console.log("@", res.data);
							setSuccess(true);
							if (response.data.role) {
								setrole(response.data.role);
							}
							if (response.data.type) {
								settype(response.data.type);
							}
							if (response.data.userObj && response.data["userObj"].length > 0) {
								setuser(response.data.userObj);
							}

							try {
								let title = `${response.data.userObj[0]["first_name"]} ${response.data.userObj[0]["last_name"]} (${response.data.userObj[0]["email"]}) has logged in as an ${response.data.role}`;
								// let notification_type = `${}`

								await axiosInstance2
									.post("/chatbot/external-notification/unauth/", {
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

							const callback = `${
								process.env.NODE_ENV === "production"
									? process.env.NEXT_PUBLIC_PROD_FRONTEND + "organization/" + cname + "/"
									: process.env.NEXT_PUBLIC_DEV_FRONTEND + "organization/" + cname + "/"
							}`;
							await signIn("credentials", {
								email: loginInfo.email,
								password: loginInfo.password,
								user_type: "candidate",
								callbackUrl: callback
							})
								.then(async (res) => {
									console.log({ res });
									router.push(`/organization/${cname}`);
								})
								.catch((err) => {
									console.log(err);
								});
						})
						.catch((err) => {
							setBtnLoader(false);
							settype("");
							setrole("");
							setuser([]);
							console.log(err);
							setWrong(true);
							setSuccess(false);
							if (err.response.data.non_field_errors) {
								err.response.data.non_field_errors.map((text: any) => setErrorMsg(text));
							} else if (err.response.data.detail) {
								setErrorMsg(err.response.data.detail);
							} else if (err.response.data.errors.email) {
								err.response.data.errors.email.map((text: any) => setErrorMsg(text));
							} else {
								setErrorMsg("Server Error, Try Again After Few Min ...");
							}
							return false;
						});
				} else if (res.data.error) {
					settype("");
					setrole("");
					setuser([]);
					setBtnLoader(false);
					setWrong(true);
					setSuccess(false);
					setErrorMsg(res.data.error);
				}
			})
			.catch((err) => {
				settype("");
				setrole("");
				setuser([]);
				console.log(err);
				setBtnLoader(false);
				setWrong(true);
				setSuccess(false);
				setErrorMsg("User Not Exist");
			});
	};
	return (
		<>
			<Head>
				<title>{srcLang === "ja" ? "ログイン" : "Sign In"}</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main className="py-8">
				<form className="mx-auto w-full max-w-[550px] px-4" onSubmit={handleSubmit}>
					<div className="mb-4 text-center">
						{orgdetail["OrgProfile"] ? (
							<Image
								src={
									process.env.NODE_ENV === "production"
										? process.env.NEXT_PUBLIC_PROD_BACKEND + orgdetail["OrgProfile"][0]["logo"]
										: process.env.NEXT_PUBLIC_DEV_BACKEND + orgdetail["OrgProfile"][0]["logo"]
								}
								alt={"Somhako"}
								width={200}
								height={200}
								className="mx-auto max-h-[80px] w-auto"
								onClick={() => {
									router.push("/organization/" + cname);
								}}
							/>
						) : (
							<>
								<Logo width={180} />
							</>
						)}
					</div>
					<div className="min-h-[400px] rounded-large bg-white p-6 shadow-normal dark:bg-gray-800 md:px-12 md:py-8">
						<h1 className="mb-6 text-3xl font-bold">
							{srcLang === "ja" ? (
								"ログイン"
							) : (
								<>
									Sign <span className="text-primary">In</span>
								</>
							)}
						</h1>
						<FormField
							fieldType="input"
							inputType="email"
							label={t("Form.Email")}
							id="email"
							value={loginInfo.email}
							handleChange={dispatch}
							icon={<i className="fa-regular fa-envelope"></i>}
							error={formError.email}
							required
						/>
						<FormField
							fieldType="input"
							inputType="password"
							label={t("Form.Password")}
							id="password"
							value={loginInfo.password}
							error={formError.password}
							handleChange={dispatch}
							required
						/>
						<div className="mb-4 flex flex-wrap items-center justify-between">
							<div className="flex items-center">
								<label htmlFor="rememberMe" className="text-darkGray">
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
							<Link href={"/auth/forgot"} className="font-bold text-primary hover:underline dark:text-white">
								{srcLang === "ja" ? "パスワードを忘れた方" : "Forgot Password?"}
							</Link>
						</div>
						<div className="mb-4">
							<Button
								btnType="submit"
								label={t("Btn.SignIn")}
								full={true}
								loader={btnLoader}
								disabled={btnLoader || !checkLoginFun()}
							/>
						</div>
						{success && (
							<p className="mb-4 text-center text-sm text-green-600">
								<i className="fa-solid fa-check fa-lg mr-2 align-middle"></i> Login Successfully
							</p>
						)}
						{wrong && (
							<p className="mb-4 text-center text-sm capitalize text-red-600">
								<i className="fa-solid fa-xmark fa-lg mr-2 align-middle"></i> {errorMsg}
							</p>
						)}
						<p className="text-center text-darkGray">
							{srcLang === "ja" ? "アカウント作成がまだの方は" : "Not sign up yet ?"}{" "}
							<Link
								href={`/organization/${cname}/candidate/signup`}
								className="font-bold text-primary hover:underline dark:text-white"
							>
								{srcLang === "ja" ? "こちら" : "Create Account"}
							</Link>
						</p>
					</div>
					<div className="pt-2 text-right">
						<ToggleLang />
					</div>
				</form>
			</main>
		</>
	);
}

export async function getServerSideProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	const providers = await getProviders();
	return {
		props: {
			...translations,
			providers
		}
	};
}

CandSignIn.noAuth = true;
