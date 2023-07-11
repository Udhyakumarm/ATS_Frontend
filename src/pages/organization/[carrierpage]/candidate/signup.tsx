import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import Validator, { Rules } from "validatorjs";
import { getCsrfToken, getProviders, signIn, useSession } from "next-auth/react";
import { axiosInstance } from "@/utils";
import { useRouter } from "next/router";
import { sign } from "crypto";
import toastcomp from "@/components/toast";
import { useCarrierStore } from "@/utils/code";
import { axiosInstance2, axiosInstance as axiosInstance22 } from "@/pages/api/axiosApi";
import Image from "next/image";
import ToggleLang from "@/components/ToggleLang";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import CandFooter from "@/components/candidate/footer";

const signUpInfoRules: Rules = {
	email: "required|email",
	password: ["required", "min:8", "regex:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"],
	passwordConfirm: ["required", "min:8", "regex:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"],
	first_name: "required",
	last_name: "required",
	phone_number: "required"
	// org_id: "required"
};

export default function CandSignUp() {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const orgdetail: any = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);
	const setcname = useCarrierStore((state: { setcname: any }) => state.setcname);

	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const setcid = useCarrierStore((state: { setcid: any }) => state.setcid);

	const { carrierpage } = router.query;

	useEffect(() => {
		if ((carrierpage && cname == "") || cname != carrierpage) {
			console.log("@", 1);
			console.log("@", carrierpage);
			setcname(carrierpage);
			setcid("");
		}
	}, [cname, setcname, carrierpage]);

	async function getcid(cname: any) {
		await axiosInstance22.get(`/organization/get/organizationprofilecid/carrier/${cname}/`).then((res) => {
			console.log(res.data);
			console.log(res.data["OrgProfile"]);
			console.log(res.data["OrgProfile"][0]["unique_id"]);
			setcid(res.data["OrgProfile"][0]["unique_id"]);
		});
	}

	useEffect(() => {
		if (cname != "" && cname && cname.length > 0 && cid == "") {
			getcid(cname);
		}
	}, [cname, cid]);

	const [formError, setFormError] = useState({
		first_name: null,
		last_name: null,
		email: null,
		phone_number: null,
		password: null,
		passwordConfirm: ""
		// org_id: ""
	});
	const updateSignUpInfo = (
		prevState: {
			email: string;
			password: string;
			passwordConfirm: string;
			first_name: string;
			last_name: string;
			phone_number: string;
			// org_id: string;
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
		first_name: "",
		last_name: "",
		email: "",
		phone_number: "",
		password: "",
		passwordConfirm: ""
		// org_id: ""
	});

	useEffect(() => {
		if (
			!formError.passwordConfirm &&
			signUpInfo.passwordConfirm !== "" &&
			signUpInfo.password !== signUpInfo.passwordConfirm
		)
			setFormError((prev) => ({ ...prev, passwordConfirm: "The confirmation password does not match" }));
	}, [formError.passwordConfirm, signUpInfo.password, signUpInfo.passwordConfirm]);

	async function handleSignUp(event: { preventDefault: () => void }) {
		const form = new FormData();
		Object.keys(signUpInfo).map((key) => form.append(key, signUpInfo[key as keyof typeof signUpInfo]));

		event.preventDefault();
		await axiosInstance.api
			.post("/candidate/candidate-email-registration/" + cid + "/", {
				email: signUpInfo.email,
				first_name: signUpInfo.first_name,
				last_name: signUpInfo.last_name,
				password: signUpInfo.password,
				password2: signUpInfo.passwordConfirm,
				mobile: signUpInfo.phone_number
			})
			.then(async (response) => {
				try {
					let title = `${signUpInfo.first_name} ${signUpInfo.last_name} (${signUpInfo.email}) has signup in as an ${response.data.role}`;
					// let notification_type = `${}`

					await axiosInstance2
						.post("/chatbot/notification/unauth/", {
							email: signUpInfo.email,
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
				console.log(response);
				router.push(`/organization/${cname}/`);
				setTimeout(() => {
					console.log("Send verification email");
				}, 100);
				toastcomp("Successfully Registerd", "success");
				setTimeout(() => {
					toastcomp("We Send Verification Email", "info");
				}, 100);
			})
			.catch((err) => {
				console.log(err);
				if (err.response.data.errors.non_field_errors) {
					err.response.data.errors.non_field_errors.map((text: any) => toastcomp(text, "error"));
					return false;
				}
				if (err.response.data.errors.email) {
					err.response.data.errors.email.map((text: any) => toastcomp(text, "error"));
					return false;
				}
			});
	}

	return (
		<>
			<Head>
				<title>{srcLang === "ja" ? "アカウント作成" : "Sign Up"}</title>
				<meta name="description" />
			</Head>
			<main className="py-8">
				<div className="mx-auto w-full max-w-[550px] px-4">
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
					<form
						className="min-h-[400px] rounded-large bg-white p-6 shadow-normal dark:bg-gray-800 md:px-12 md:py-8"
						onSubmit={handleSignUp}
					>
						<h1 className="mb-6 text-3xl font-bold">
							{srcLang === "ja" ? (
								"アカウント作成"
							) : (
								<>
									Sign <span className="text-primary">Up</span>
								</>
							)}
						</h1>
						<FormField
							fieldType="input"
							inputType="text"
							label={t("Form.FirstName")}
							id="first_name"
							handleChange={dispatch}
							value={signUpInfo.first_name}
							error={formError.first_name}
							required
							icon={<i className="fa-regular fa-user"></i>}
						/>
						<FormField
							fieldType="input"
							inputType="text"
							label={t("Form.LastName")}
							id="last_name"
							value={signUpInfo.last_name}
							error={formError.last_name}
							handleChange={dispatch}
							required
							icon={<i className="fa-regular fa-user"></i>}
						/>
						<FormField
							fieldType="input"
							inputType="email"
							label={t("Form.Email")}
							id="email"
							value={signUpInfo.email}
							handleChange={dispatch}
							error={formError.email}
							icon={<i className="fa-regular fa-envelope"></i>}
							required
						/>
						<FormField
							fieldType="input"
							inputType="text"
							label={t("Form.PhoneNumber")}
							id="phone_number"
							value={signUpInfo.phone_number}
							handleChange={dispatch}
							error={formError.phone_number}
							required
						/>
						{/* <div className="mb-4 w-full md:max-w-[50%]">
							<FormField
								fieldType="input"
								inputType="text"
								label="Organization ID"
								id="org_id"
								value={signUpInfo.org_id}
								error={formError.org_id}
								handleChange={dispatch}
								required
							/>
						</div> */}
						<div className="-mx-3 flex flex-wrap">
							<div className="mb-4 w-full px-3 md:max-w-[50%]">
								<FormField
									fieldType="input"
									inputType="password"
									label={t("Form.Password")}
									id="password"
									value={signUpInfo.password}
									error={formError.password}
									handleChange={dispatch}
								/>
							</div>
							<div className="mb-4 w-full px-3 md:max-w-[50%]">
								<FormField
									fieldType="input"
									inputType="password"
									label={t("Form.ConfirmPassword")}
									id="passwordConfirm"
									value={signUpInfo.passwordConfirm}
									error={formError.passwordConfirm}
									handleChange={dispatch}
								/>
							</div>
						</div>
						<div className="mb-4">
							<Button btnType="submit" label={t("Btn.CreateAccount")} full={true} loader={false} disabled={false} />
						</div>
						<p className="text-center text-darkGray">
							{srcLang === "ja" ? "アカウント作成がまだの方は" : "Already have an Account?"}{" "}
							<Link href={`/organization/${cname}/candidate/signin`} className="font-bold text-primary hover:underline dark:text-white">
								{srcLang === "ja" ? "こちら" : "Sign In"}
							</Link>
						</p>
					</form>
					<div className="pt-2 text-right">
						<ToggleLang />
					</div>
				</div>
			</main>
			<CandFooter />
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


CandSignUp.noAuth = true;
