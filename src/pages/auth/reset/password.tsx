import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import ToggleLang from "@/components/ToggleLang";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toastcomp from "@/components/toast";

export default function CreatePassword() {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [password, setpassword] = useState("");
	const [password2, setpassword2] = useState("");
	const [i1, seti1] = useState("");
	const [i2, seti2] = useState("");
	const { asPath } = useRouter();
	const router = useRouter();

	function validbtn() {
		return password.length >= 8 && password2.length >= 8 && password == password2;
	}

	const axiosInstance = axios.create({
		baseURL:
			process.env.NODE_ENV === "production"
				? process.env.NEXT_PUBLIC_PROD_BACKEND_BASE
				: process.env.NEXT_PUBLIC_DEV_BACKEND_BASE,
		timeout: process.env.NODE_ENV === "production" ? 5000 : 10000,
		headers: {
			// 'Authorization': "JWT " + access_token,
			"Content-Type": "application/json",
			accept: "application/json"
		}
	});

	async function forgetpass() {
		if (i1.length > 0 && i2.length > 0) {
			await axiosInstance
				.patch("/auth/password-reset-complete/", {
					password: password,
					uidb64: i1,
					token: i2
				})
				.then((response) => {
					toastcomp("Password Reset Suceesfully", "success");
					setpassword("");
					setpassword2("");
					if(response.data.url && response.data.url.length > 0){
						router.push(response.data.url)
					}
				})
				.catch((err) => {
					// // console.log(err);
					toastcomp("Password Reset Unuceesfully", "error");
				});
		}
	}

	useEffect(() => {
		// console.log("#", asPath);
		let c = asPath.substring(1).split("/")[2].split("&");
		// console.log("#", c);
		if (c) {
			seti1(c[2].split("=")[1]);
			seti2(c[3].split("=")[1]);
		}
	}, []);

	return (
		<>
			<Head>
				<title>{srcLang === "ja" ? "パスワードを設定" : "Create Password"}</title>
			</Head>
			<main className="py-8">
				<div className="mx-auto w-full max-w-[550px] px-4">
					<div className="mb-4 text-center">
						<Logo width={180} />
					</div>
					<div className="min-h-[400px] rounded-large bg-white p-6 shadow-normal dark:bg-gray-800 md:px-12 md:py-8">
						<h1 className="mb-6 text-3xl font-bold">
							{srcLang === "ja" ? (
								"パスワードを設定"
							) : (
								<>
									Create <span className="text-primary">Password</span>
								</>
							)}
						</h1>
						<FormField
							fieldType="input"
							inputType="password"
							label={t("Form.NewPassword")}
							value={password}
							handleChange={(e) => setpassword(e.target.value)}
						/>
						<FormField
							fieldType="input"
							inputType="password"
							label={t("Form.ConfirmPassword")}
							value={password2}
							handleChange={(e) => setpassword2(e.target.value)}
						/>
						<div className="mb-4">
							<Button
								label={t("Btn.Submit")}
								btnType="button"
								full={true}
								loader={false}
								disabled={!validbtn()}
								handleClick={(e) => forgetpass()}
							/>
						</div>
						<p className="text-center text-darkGray">
							{srcLang === "ja" ? "アカウント作成がまだの方は" : "Already have an Account?"}{" "}
							<Link href={"/auth/signin"} className="font-bold text-primary hover:underline">
								{srcLang === "ja" ? "こちら" : "Sign In"}
							</Link>
						</p>
					</div>
					<div className="pt-2 text-right">
						<ToggleLang />
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

CreatePassword.noAuth = true;
