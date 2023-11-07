import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useCarrierStore } from "@/utils/code";
import { axiosInstance } from "@/pages/api/axiosApi";
import Button from "@/components/Button";
import moment from "moment";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import CandFooter from "@/components/candidate/footer";

export default function CanCareer() {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const { carrierpage } = router.query;

	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const setcname = useCarrierStore((state: { setcname: any }) => state.setcname);

	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const setcid = useCarrierStore((state: { setcid: any }) => state.setcid);
	const jid = useCarrierStore((state: { jid: any }) => state.jid);
	const setjid = useCarrierStore((state: { setjid: any }) => state.setjid);
	const jdata = useCarrierStore((state: { jdata: any }) => state.jdata);
	const setjdata = useCarrierStore((state: { setjdata: any }) => state.setjdata);
	const orgdetail = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);
	const setorgdetail = useCarrierStore((state: { setorgdetail: any }) => state.setorgdetail);

	const [load, setload] = useState(false);

	async function loadOrgDetail(carrierID: any) {
		await axiosInstance
			.get(`/organization/get/organizationprofile/carrier/${carrierID}/`)
			.then((res) => {
				setorgdetail(res.data);
				console.log("@", res.data);
			})
			.catch((err) => {
				console.log(err);
				setorgdetail({});
			});
	}

	async function getcid(cname: any) {
		await axiosInstance.get(`/organization/get/organizationprofilecid/carrier/${cname}/`).then((res) => {
			console.log(res.data);
			console.log(res.data["OrgProfile"]);
			console.log(res.data["OrgProfile"][0]["unique_id"]);
			setcid(res.data["OrgProfile"][0]["unique_id"]);
			loadOrgDetail(res.data["OrgProfile"][0]["unique_id"]);
			setload(true);
		});
	}

	useEffect(() => {
		if (carrierpage && carrierpage.length > 0 && !load) {
			setcname(carrierpage);
			setcid("");
			getcid(carrierpage);
		}
	}, [cname, carrierpage, load]);

	// useEffect(() => {
	// 	if (cname && cid && cname.length > 0 && cid.length <= 0) {
	// 		getcid(cname);
	// 	}
	// }, [cname, cid]);

	return (
		<>
			<Head>
				<title>{t("Words.Career")}</title>
			</Head>
			<main className="py-8">
				{orgdetail["OrgProfile"] &&
					orgdetail["OrgProfile"].map((data: any, i: React.Key) => (
						<>
							<div className="mx-auto w-full max-w-[1200px] px-4" key={i}>
								<Image
									src={
										process.env.NODE_ENV === "production"
											? process.env.NEXT_PUBLIC_PROD_BACKEND + data["banner"]
											: process.env.NEXT_PUBLIC_DEV_BACKEND + data["banner"]
									}
									alt="Banner"
									width={1200}
									height={200}
									className="mx-auto mb-6 max-h-[200px] rounded-large object-cover"
								/>
								<div className="mx-auto w-full max-w-[1100px] px-4">
									<div className="mb-6 rounded-normal bg-white px-8 py-4 dark:bg-gray-800">
										{orgdetail["Founder"].length > 0 && (
											<div className="mb-3 flex flex-wrap rounded-normal border p-4 pb-0">
												{orgdetail["Founder"].map((data: any, i: React.Key) => (
													<div
														className="mb-3 w-full pr-4 text-center md:max-w-[calc(100%/3)] lg:max-w-[calc(100%/4)] xl:max-w-[calc(100%/5)]"
														key={i}
													>
														<Image
															src={
																process.env.NODE_ENV === "production"
																	? process.env.NEXT_PUBLIC_PROD_BACKEND + data["image"]
																	: process.env.NEXT_PUBLIC_DEV_BACKEND + data["image"]
															}
															alt="User"
															width={80}
															height={80}
															className="mx-auto mb-2 h-[80px] rounded-full object-cover"
														/>
														<p className="mb-1 text-sm font-bold">{data["name"]}</p>
														<p className="text-sm text-darkGray">{data["designation"]}</p>
													</div>
												))}
											</div>
										)}

										<ul className="mb-6 flex list-inside list-disc flex-wrap items-center justify-center font-semibold text-darkGray dark:text-gray-400">
											<li className="mr-3 list-none">
												{data["org_Url"] && data["org_Url"] != "" ? (
													<Link
														href={`${data["org_Url"]}`}
														target="_blank"
														className="text-primary hover:underline dark:text-white"
													>
														<i className="fa-solid fa-globe mr-2"></i> {data["org_Url"]}
													</Link>
												) : (
													<>
														Company URL <small>Not Disclosed</small>
													</>
												)}
											</li>
											<li className="mr-3">
												{data["contact_Number"] && data["contact_Number"] != "" ? (
													<>Company Contact : {data["contact_Number"]}</>
												) : (
													<>
														Company Contact <small>Not Disclosed</small>
													</>
												)}
											</li>
											<li className="mr-3">
												{data["company_Size"] && data["company_Size"] != "" ? (
													<>Company Size : {data["company_Size"]} Employees</>
												) : (
													<>
														Company Size <small>Not Disclosed</small>
													</>
												)}
											</li>
											<li className="mr-3">
												{data["workplace_Type"] && data["workplace_Type"] != "" ? (
													<>Workplace Culture : {data["workplace_Type"]}</>
												) : (
													<>
														Workplace Culture <small>Not Disclosed</small>
													</>
												)}
											</li>
										</ul>

										<hr className="mb-6" />
										<h2 className="mb-3 text-lg font-bold">{t("Words.AboutOrganization")}</h2>
										{data["about_org"] && data["about_org"] != "" ? (
											<article className="mb-6" dangerouslySetInnerHTML={{ __html: data["about_org"] }}></article>
										) : (
											<small>Not Disclosed</small>
										)}
										<hr className="mb-6" />
										<h2 className="mb-3 text-lg font-bold">{t("Form.AboutTheFounder")}</h2>
										{data["about_founder"] && data["about_founder"] != "" ? (
											<article className="mb-6" dangerouslySetInnerHTML={{ __html: data["about_founder"] }}></article>
										) : (
											<small>Not Disclosed</small>
										)}
										<hr className="mb-6" />
										<h2 className="mb-3 text-lg font-bold">Other Information</h2>
										<h4 className="mb-2">
											{data["headquarter_Location"] && data["headquarter_Location"] != "" ? (
												<>Headquarter Location : {data["headquarter_Location"]}</>
											) : (
												<>
													Headquarter Location : <small>Not Disclosed</small>
												</>
											)}
										</h4>
										<h4 className="mb-2">
											{data["branch_Office"] && data["branch_Office"] != "" ? (
												<>Branch Office : {data["branch_Office"]}</>
											) : (
												<>
													Branch Office : <small>Not Disclosed</small>
												</>
											)}
										</h4>
										<h4 className="mb-2">
											{data["funding_Details"] && data["funding_Details"] != "" ? (
												<>Funding Details : {data["funding_Details"]}</>
											) : (
												<>
													Funding Details : <small>Not Disclosed</small>
												</>
											)}
										</h4>
										<h4 className="mb-2">
											{data["organization_Benefits"] && data["organization_Benefits"] != "" ? (
												<>Organization Benefits : {data["organization_Benefits"]}</>
											) : (
												<>
													Organization Benefits : <small>Not Disclosed</small>
												</>
											)}
										</h4>

										<hr className="mb-6" />
										{orgdetail["Gallery"] && (
											<div>
												<h2 className="mb-3 text-lg font-bold">{t("Words.WorkplaceCulture")}</h2>
												<div className="rounded-large border p-6">
													<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
														<Masonry>
															{orgdetail["Gallery"].map((data: { image: any }, i: React.Key | null | undefined) => (
																<Image
																	src={
																		process.env.NODE_ENV === "production"
																			? process.env.NEXT_PUBLIC_PROD_BACKEND + data["image"]
																			: process.env.NEXT_PUBLIC_DEV_BACKEND + data["image"]
																	}
																	alt="Office"
																	width={1000}
																	height={1000}
																	className="w-full rounded-normal p-2"
																	key={i}
																/>
															))}
														</Masonry>
													</ResponsiveMasonry>
												</div>
											</div>
										)}
									</div>
									{/* {orgdetail["Job"] && (
										<div>
											<h2 className="mb-3 text-lg font-bold">Similar Jobs</h2>
											<div className="mx-[-7px] flex flex-wrap">
												{orgdetail["Job"].slice(0, 2).map((data: any, i: React.Key) => (
													<div className="mb-[15px] w-full px-[7px] md:max-w-[50%] lg:max-w-[calc(100%/3)]" key={i}>
														<div className="h-full rounded-[10px] bg-white p-5 shadow-normal dark:bg-gray-800">
															<h4 className="mb-3 text-lg font-bold">{data["job_title"]}</h4>
															<ul className="mb-3 flex flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
																<li className="mr-8">
																	<i className="fa-solid fa-location-dot mr-2"></i>
																	{data["worktype"] ? data["worktype"] : <>N/A</>}
																</li>
																<li className="mr-8">
																	<i className="fa-regular fa-clock mr-2"></i>
																	{data["employment_type"] ? data["employment_type"] : <>N/A</>}
																</li>
																<li>
																	<i className="fa-solid fa-dollar-sign mr-2"></i>
																	{data["currency"] ? data["currency"] : <>N/A</>}
																</li>
															</ul>
															<div className="flex flex-wrap items-center justify-between">
																<div className="mr-4">
																	<Button
																		btnStyle="sm"
																		label="View"
																		loader={false}
																		btnType="button"
																		handleClick={() => {
																			setjid(data["refid"]);
																			setjdata(data);
																			router.push(`/organization/${cname}/job-detail`);
																		}}
																	/>
																</div>
																<p className="text-[12px] font-bold text-darkGray dark:text-gray-400">
																	{moment(data["publish_date"]).fromNow()}
																</p>
															</div>
														</div>
													</div>
												))}
											</div>
											<Button
												btnStyle="sm"
												label="View All Job"
												loader={false}
												btnType="button"
												handleClick={() => {
													router.push(`/organization/${cname}/search-jobs`);
												}}
											/>
										</div>
									)} */}
								</div>
							</div>
						</>
					))}
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
CanCareer.noAuth = true;
