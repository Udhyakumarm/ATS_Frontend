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
					<div className="min-h-[400px] rounded-large bg-white p-6 shadow-normal dark:bg-gray-800 md:py-8 md:px-12">
						<h1 className="mb-6 text-3xl font-bold">
							Sign <span className="text-primary">Up</span>
						</h1>

						<div className="mb-4">
							<Button
								btnType="button"
								label="Candidate"
								full={true}
								loader={false}
								disabled={false}
								handleClick={() => router.push("/auth/candidate/signup")}
							/>
							<Button
								btnType="button"
								label="Organization"
								full={true}
								loader={false}
								disabled={false}
								handleClick={() => router.push("/auth/organization/signup")}
							/>
						</div>
						<p className="text-center text-darkGray">
							Already have an Account?{" "}
							<Link href={"/auth/signin"} className="font-bold text-primary hover:underline">
								Sign In
							</Link>
						</p>
					</div>
				</div>
			</main>
		</>
	);
}
