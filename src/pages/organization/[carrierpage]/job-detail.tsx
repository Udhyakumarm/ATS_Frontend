import Button from "@/components/Button";
import FormField from "@/components/FormField";
import HeaderBar from "@/components/HeaderBar";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useCarrierStore } from "@/utils/code";
import { getProviders, useSession } from "next-auth/react";
import router from "next/router";
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from "react";

export default function CanCareerJobDetail() {
	const { data: session } = useSession();
	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const setcid = useCarrierStore((state: { setcid: any }) => state.setcid);
	const orgdetail = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);
	const setorgdetail = useCarrierStore((state: { setorgdetail: any }) => state.setorgdetail);
	const jid = useCarrierStore((state: { jid: any }) => state.jid);
	const setjid = useCarrierStore((state: { setjid: any }) => state.setjid);
	const jdata = useCarrierStore((state: { jdata: any }) => state.jdata);
	const setjdata = useCarrierStore((state: { setjdata: any }) => state.setjdata);

	const [token, settoken] = useState("");
	const [btndis, setbtndis] = useState(false);

	useEffect(() => {
		if (
			(orgdetail && Object.keys(orgdetail).length === 0) ||
			(jdata && Object.keys(jdata).length === 0) ||
			(jid && jid == "")
		) {
			if (cname == "" || cid == "") router.replace(`/organization/${cname}`);
			else router.back();
		}
	}, [cid, orgdetail, jid, jdata, cname]);

	useEffect(() => {
		if (jdata) console.log(jdata);
	}, [jdata]);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	async function checkApplicant() {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		await axiosInstanceAuth2
			.get(`/job/applicant/check/${jid}/`)
			.then(async (res) => {
				console.log("!", res.data);
				if (res.data["Message"] == 1) {
					setbtndis(true);
				} else {
					setbtndis(false);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		if (token && token.length > 0 && jid && jid.length > 0) {
			checkApplicant();
		}
	}, [token, jid]);

	return (
		<>
			<main className="py-8">
				<div className="container flex flex-wrap">
					<div className="sticky top-0 h-[calc(100vh-120px)] w-[300px] rounded-normal border border-slate-300 bg-white shadow-normal dark:bg-gray-800">
						<div className="border-b py-2 px-6">
							<div className="relative">
								<input
									type={"search"}
									id={"jobSearch"}
									className={`w-full rounded border-0 pl-8 text-sm focus:ring-0 dark:bg-gray-800`}
									placeholder="Search for Jobs"
								/>
								<span className="absolute left-0 top-[2px] text-xl">
									<i className="fa-solid fa-magnifying-glass"></i>
								</span>
							</div>
						</div>
						<div className="py-4 px-6">
							<h2 className="mb-2 font-semibold">Filters</h2>
							<div className="py-2">
								<FormField fieldType="select" placeholder="Location" />
								<FormField fieldType="select" placeholder="Experience" />
								<FormField fieldType="select" placeholder="Job Type" />
							</div>
						</div>
					</div>
					{jdata && (
						<div className="w-[calc(100%-300px)] pl-8">
							<div className="mb-6 rounded-normal bg-white shadow-normal dark:bg-gray-800">
								<div className="overflow-hidden rounded-t-normal">
									<HeaderBar handleBack={() => router.back()} />
								</div>
								<div className="py-4 px-8">
									<h3 className="mb-4 text-lg font-bold">
										{jdata["job_title"]} ({jdata["worktype"]})
									</h3>
									<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
										{jdata["employment_type"] && <li className="mr-4">{jdata["employment_type"]}</li>}
										{jdata["currency"] && <li className="mr-4">{jdata["currency"]}</li>}
										{jdata["vacancy"] && <li className="mr-4">Vacancy - {jdata["vacancy"]}</li>}
									</ul>
									<Button
										btnStyle="sm"
										label={btndis ? "Already Applied" : "Apply Here"}
										loader={false}
										btnType="button"
										handleClick={() => {
											if (session) {
												router.push(`/organization/${cname}/job-apply`);
											} else {
												router.push(`/organization/${cname}/candidate/signin`);
											}
										}}
										disabled={btndis}
									/>
									<hr className="my-4" />
									<aside className="mb-4">
										<h3 className="mb-2 text-lg font-bold">Department Information</h3>
										<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
											{jdata["department"] && <li className="mr-4">{jdata["department"]} department</li>}
											{jdata["job_function"] && <li className="mr-4">{jdata["job_function"]} function</li>}
											{jdata["industry"] && <li className="mr-4">{jdata["industry"]} Industry</li>}
											{jdata["group_or_division"] && (
												<li className="mr-4">{jdata["group_or_division"]} group_or_division</li>
											)}
										</ul>
									</aside>
									<hr className="my-4" />
									{jdata["description"] && (
										<aside className="mb-4">
											<h3 className="mb-2 text-lg font-bold">Description</h3>
											<article className="text-[12px] text-darkGray dark:text-gray-400">{jdata["description"]}</article>
										</aside>
									)}
									<hr className="my-4" />
									{jdata["responsibility"] && (
										<aside className="mb-4">
											<h3 className="mb-2 text-lg font-bold">Your Responsibilities</h3>
											<article className="text-[12px] text-darkGray dark:text-gray-400">
												{jdata["responsibility"]}
											</article>
										</aside>
									)}
									<hr className="my-4" />
									{jdata["looking_for"] && (
										<aside className="mb-4">
											<h3 className="mb-2 text-lg font-bold">What are we Looking For</h3>
											<article className="text-[12px] text-darkGray dark:text-gray-400">{jdata["looking_for"]}</article>
										</aside>
									)}
									<hr className="my-4" />
									<aside className="mb-4">
										<h3 className="mb-2 text-lg font-bold">Skills</h3>
										{jdata["jobSkill"] && (
											<article className="text-[12px] text-darkGray dark:text-gray-400">
												{jdata["jobSkill"]
													.split(",")
													.map(
														(
															item:
																| string
																| number
																| boolean
																| ReactElement<any, string | JSXElementConstructor<any>>
																| ReactFragment
																| ReactPortal
																| null
																| undefined,
															i: Key | null | undefined
														) => (
															<p key={i}>{item}</p>
														)
													)}
											</article>
										)}
									</aside>
									<hr className="my-4" />
									<aside className="mb-4">
										<h3 className="mb-2 text-lg font-bold">Employment Details</h3>
										<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
											{jdata["employment_type"] && <li className="mr-4">{jdata["employment_type"]}</li>}
											{jdata["education"] && <li className="mr-4">{jdata["education"]}</li>}
											{jdata["location"] && <li className="mr-4">{jdata["location"]}</li>}
											{jdata["experience"] && <li className="mr-4">{jdata["experience"]} of Experience</li>}
										</ul>
									</aside>
									<hr className="my-4" />
									<aside className="mb-4">
										<h3 className="mb-2 text-lg font-bold">Benefits</h3>
										<ul className="mb-3 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
											{jdata["relocation"] == "Yes" && <li className="mr-4">Paid Relocation</li>}
											{jdata["visa"] == "Yes" && <li className="mr-4">Visa Sponsorship</li>}
											{jdata["worktype"] && <li className="mr-4">{jdata["worktype"]} Working</li>}
										</ul>
									</aside>
								</div>
							</div>
							<h3 className="mb-6 text-xl font-bold">Similar Jobs</h3>
							<div className="mx-[-7px] flex flex-wrap">
								{Array(4).fill(
									<div className="mb-[15px] w-full px-[7px] md:max-w-[50%]">
										<div className="h-full rounded-[10px] bg-white p-5 shadow-normal dark:bg-gray-800">
											<h4 className="mb-3 text-lg font-bold">Software Engineer</h4>
											<ul className="mb-3 flex flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
												<li className="mr-8">
													<i className="fa-solid fa-location-dot mr-2"></i>
													Remote
												</li>
												<li className="mr-8">
													<i className="fa-regular fa-clock mr-2"></i>
													Full Time
												</li>
												<li>
													<i className="fa-solid fa-dollar-sign mr-2"></i>
													50-55k
												</li>
											</ul>
											<div className="flex flex-wrap items-center justify-between">
												<div className="mr-4">
													<Button btnStyle="sm" label="View" loader={false} />
												</div>
												<p className="text-[12px] font-bold text-darkGray dark:text-gray-400">29 min ago</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</main>
		</>
	);
}

CanCareerJobDetail.noAuth = true;
