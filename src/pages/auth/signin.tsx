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
import { useLangStore, useUserStore } from "@/utils/code";
import moment from "moment";
const Toaster = dynamic(() => import("../../components/Toaster"), {
	ssr: false
});
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ToggleLang from "@/components/ToggleLang";
import Novus from "@/components/Novus";

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

export default function AuthSignIn({ providers }: any) {
	const { t } = useTranslation('common')
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const updateLoginInfo = (
		prevState: { email: string; password: string },
		event: { target: { id: string; value: any } }
	) => {
		return { ...prevState, [event.target.id]: event.target.value };
	};

	const type = useUserStore((state: { type: any }) => state.type);
	const role = useUserStore((state: { role: any }) => state.role);
	const user = useUserStore((state: { user: any }) => state.user);
	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);
	
	const { error } = useRouter().query;

	const [loginInfo, dispatch] = useReducer(updateLoginInfo, {
		email: "",
		password: ""
	});

	const handleSubmit = async (event: any) => {
		event.preventDefault();
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
				console.log("@", response.data);
				if (response.data.role) {
					setrole(response.data.role);
				}
				if (response.data.type) {
					settype(response.data.type);
				}
				if (response.data.userObj && response.data["userObj"].length > 0) {
					setuser(response.data.userObj);
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
							toastcomp("Log Add", "success");
						})
						.catch((err) => {
							toastcomp("Log Not Add", "error");
						});
				} catch (error) {
					toastcomp("Log Not Add", "error");
				}

				try {
					let title = `${response.data.userObj[0]["name"]} (${response.data.userObj[0]["email"]}) has logged in as an ${response.data.role}`;
					// let notification_type = `${}`

					await axiosInstance2
						.post("/chatbot/notification/unauth/", {
							email: loginInfo.email,
							title: title
							// notification_type: notification_type
						})
						.then((res) => {
							toastcomp("Notify Add", "success");
						})
						.catch((err) => {
							toastcomp("Notify Not Add", "error");
						});
				} catch (error) {
					toastcomp("Notify Not Add", "error");
				}

				await signIn("credentials", {
					email: loginInfo.email,
					password: loginInfo.password,
					//For NextAuth
					user_type: "organization",
					callbackUrl: callback
				})
					.then(async (res) => console.log({ res }))
					.then(async () => await router.push("/"));
			})
			.catch((err) => {
				settype("");
				setrole("");
				setuser([]);
				console.log(err);
				if (err.response.data.non_field_errors) {
					err.response.data.non_field_errors.map((text: any) => toastcomp(text, "error"));
					return false;
				}
				if (err.response.data.detail) {
					toastcomp(err.response.data.detail, "error");
					return false;
				}
				if (err.response.data.errors.email) {
					err.response.data.errors.email.map((text: any) => toastcomp(text, "error"));
					return false;
				}
			});
	};
	return (
		<>
			<Head>
				<title>{srcLang === 'ja' ? 'ログイン' : 'Sign In'}</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main className="py-8">
			<Novus />
				<Toaster />
				<form className="mx-auto w-full max-w-[550px] px-4" onSubmit={handleSubmit}>
					<div className="mb-4 text-center">
						<Logo width={180} />
					</div>
					<div className="min-h-[400px] rounded-large bg-white p-6 shadow-normal dark:bg-gray-800 md:px-12 md:py-8">
						<h1 className="mb-6 text-3xl font-bold">
							{srcLang === 'ja' ? 'ログイン' : <>Sign <span className="text-primary">In</span></>}
						</h1>
						<AuthError error={error} />

						<FormField
							fieldType="input"
							inputType="email"
							label={t('Form.Email')}
							id="email"
							value={loginInfo.email}
							handleChange={dispatch}
							icon={<i className="fa-regular fa-envelope"></i>}
							required
						/>
						<FormField
							fieldType="input"
							inputType="password"
							label={t('Form.Password')}
							id="password"
							value={loginInfo.password}
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
										defaultChecked
									/>
									{srcLang === 'ja' ? 'ログイン情報を保存' : 'Remember Me'}
								</label>
							</div>
							<Link href={"/auth/forgot"} className="font-bold text-primary hover:underline">
								{srcLang === 'ja' ? 'パスワードを忘れた方' : 'Forgot Password?'}
							</Link>
						</div>
						<div className="mb-4">
							<Button btnType="submit" label={t('Btn.SignIn')} full={true} loader={false} disabled={false} />
						</div>
						<p className="text-center text-darkGray">
							{srcLang === 'ja' ? 'アカウント作成がまだの方は' : 'Not sign up yet ?'}{" "}
							<Link href={"/auth/signup"} className="font-bold text-primary hover:underline">
								{srcLang === 'ja' ? 'こちら' : 'Create Account'}
							</Link>
						</p>
					</div>
					<div className="text-right pt-2">
						<ToggleLang />
					</div>
				</form>
			</main>
		</>
	);
}
export async function getStaticProps({ context, locale }:any) {
	const translations = await serverSideTranslations(locale, ['common']);
	const providers = await getProviders();
	return {
		props: {
		...translations,
		providers
		},
	};
}

AuthSignIn.noAuth = true;
