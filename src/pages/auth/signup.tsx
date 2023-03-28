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
	return <div className="pb-4 text-red-600">{errorMessage}</div>;
};

export default function AuthSignUp() {
	const router = useRouter();
	const { error } = useRouter().query;

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
			.post("/organization/registration/superadmin/", {
				email: signUpInfo.email,
				name: signUpInfo.fullName,
				company_name: signUpInfo.organizationName.toLowerCase().replace(/\s/g, ""),
				password: signUpInfo.password,
				password2: signUpInfo.passwordConfirm,
				company_type: signUpInfo.companyType
			})
			.then((response) => {
				console.log(response);
				router.push("/auth/signin");
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
				<title>Sign Up</title>
				<meta name="description" />
			</Head>
			<main className="py-8">
				<div className="mx-auto w-full max-w-[550px] px-4">
					<div className="mb-4 text-center">
						<Logo width={180} />
					</div>
					<form
						className="min-h-[400px] rounded-large bg-white p-6 shadow-normal dark:bg-gray-800 md:py-8 md:px-12"
						onSubmit={handleSignUp}
					>
						<h1 className="mb-6 text-3xl font-bold">
							Sign <span className="text-primary">Up</span>
						</h1>
						<AuthError error={error} />

						<FormField
							fieldType="input"
							inputType="text"
							label="Organization Name"
							id="organizationName"
							handleChange={dispatch}
							value={signUpInfo.organizationName}
							error={formError.organizationName}
							required
						/>
						<FormField
							fieldType="input"
							inputType="text"
							label="Full Name"
							id="fullName"
							value={signUpInfo.fullName}
							error={formError.fullName}
							handleChange={dispatch}
							icon={<i className="fa-regular fa-user"></i>}
						/>
						<FormField
							fieldType="input"
							inputType="email"
							label="Email"
							id="email"
							value={signUpInfo.email}
							handleChange={dispatch}
							error={formError.email}
							icon={<i className="fa-regular fa-envelope"></i>}
							required
						/>
						<FormField
							fieldType="select"
							inputType="text"
							label="Organization Type"
							id="companyType"
							singleSelect
							value={signUpInfo.companyType}
							options={[
								{ name: "Sole Proprietorship" },
								{ name: "Corporation" },
								{ name: "Limited Liability Company (LLC)" }
							]}
							handleChange={dispatch}
							error={formError.companyType}
							icon={<i className="fa-regular fa-envelope"></i>}
							required
						/>
						<div className="-mx-3 flex flex-wrap">
							<div className="mb-4 w-full px-3 md:max-w-[50%]">
								<FormField
									fieldType="input"
									inputType="password"
									label="Password"
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
									label="Confirm Password"
									id="passwordConfirm"
									value={signUpInfo.passwordConfirm}
									error={formError.passwordConfirm}
									handleChange={dispatch}
								/>
							</div>
						</div>
						<div className="mb-4">
							<Button btnType="submit" label="Create Account" full={true} loader={false} disabled={false} />
						</div>
						<p className="text-center text-darkGray">
							Already have an Account?{" "}
							<Link href={"/auth/signin"} className="font-bold text-primary hover:underline">
								Sign In
							</Link>
						</p>
					</form>
				</div>
			</main>
		</>
	);
}

SignUp.noAuth = true;
