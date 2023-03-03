import Button from "@/components/button";
import FormField from "@/components/FormField";
import Logo from "@/components/logo";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import Validator, { Rules } from "validatorjs";
import { getCsrfToken, getProviders, signIn, useSession } from "next-auth/react";
import { axiosInstance } from "@/utils";
import { useRouter } from "next/router";

const signUpInfoRules: Rules = {
	email: "required|email",
	password: ["required", "min:8", "regex:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"],
	passwordConfirm: ["required", "min:8", "regex:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"],
	fullName: "required",
	organizationName: "required"
};

export default function SignUp() {
	const router = useRouter();

	const [formError, setFormError] = useState({
		organizationName: null,
		fullName: null,
		email: null,
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
		passwordConfirm: ""
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
				company_name: signUpInfo.organizationName,
				password: signUpInfo.password,
				password2: signUpInfo.passwordConfirm,
				company_type: ""
			})
			.then((response) => {
				console.log(response);
				router.push("/auth/signin");
				setTimeout(() => {
					console.log("Send verification email");
				}, 100);
			})
			.catch((err) => {
				console.log(err);
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