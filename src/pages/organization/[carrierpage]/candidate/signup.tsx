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

const signUpInfoRules: Rules = {
	email: "required|email",
	password: ["required", "min:8", "regex:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"],
	passwordConfirm: ["required", "min:8", "regex:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"],
	first_name: "required",
	last_name: "required",
	phone_number: "required",
	org_id: "required"
};

export default function CanCareerSignUp() {
	const router = useRouter();

	const [formError, setFormError] = useState({
		first_name: null,
		last_name: null,
		email: null,
		phone_number: null,
		password: null,
		passwordConfirm: "",
		org_id: ""
	});
	const updateSignUpInfo = (
		prevState: {
			email: string;
			password: string;
			passwordConfirm: string;
			first_name: string;
			last_name: string;
			phone_number: string;
			org_id: string;
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
		passwordConfirm: "",
		org_id: ""
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
			.post("/candidate/candidate-email-registration/" + signUpInfo.org_id + "/", {
				email: signUpInfo.email,
				first_name: signUpInfo.first_name,
				last_name: signUpInfo.last_name,
				password: signUpInfo.password,
				password2: signUpInfo.passwordConfirm,
				mobile: signUpInfo.phone_number
			})
			.then((response) => {
				console.log(response);
				router.push("/auth/candidate/signin");
				setTimeout(() => {
					console.log("Send verification email");
				}, 100);
				toastcomp("Successfully Registerd", "success")
				setTimeout(() => {
				toastcomp("We Send Verification Email", "info")
				}, 100)
			})
			.catch((err) => {
				console.log(err);
				if (err.response.data.errors.non_field_errors) {
					err.response.data.errors.non_field_errors.map((text: any) => toastcomp(text, "error"))
					return false
				}
				if (err.response.data.errors.email) {
					err.response.data.errors.email.map((text: any) => toastcomp(text, "error"))
					return false
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
						<FormField
							fieldType="input"
							inputType="text"
							label="First Name"
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
							label="Last Name"
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
							label="Email"
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
							label="Phone Number"
							id="phone_number"
							value={signUpInfo.phone_number}
							handleChange={dispatch}
							error={formError.phone_number}
							required
						/>
						<div className="mb-4 w-full md:max-w-[50%]">
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
						</div>
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
