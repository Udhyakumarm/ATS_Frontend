import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import pricingIcon from "/public/images/icons/pricing.png";
import { ChangeEvent, Fragment, useRef } from "react";
import Button from "@/components/Button";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { useNewNovusStore } from "@/utils/novus";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import OrgRSideBar from "@/components/organization/RSideBar";
import { Menu, Tab, Listbox, Transition, Dialog } from "@headlessui/react";
import toastcomp from "@/components/toast";

export default function Pricing() {
	const { t } = useTranslation("common");

	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const [duration, setduration] = useState(false);
	const [tab, settab] = useState(0);
	const [activePlan, setactivePlan] = useState(1);
	const [planInfo, setplanInfo] = useState("");
	const tabHeading_1 = [
		{
			title: "Plan & billing Information"
		},
		{
			title: "Billing history"
		}
	];
	const { data: session } = useSession();
	const [token, settoken] = useState("");
	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);
	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	const cancelButtonRef = useRef(null);
	const [price, setprice] = useState(false);
	const [path, setpath] = useState("");
	const [step, setstep] = useState(1);
	const [sign, setsign] = useState<File | null>(null);
	const [check1, setcheck1] = useState(false);
	const [file, setfile] = useState(false);

	function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files && event.target.files[0];
			setsign(file);
			setfile(true);
		} else {
			if (file == null) {
				setsign(null);
				setfile(false);
			}
		}
	}

	function checkForm() {
		return check1 && sign != null;
	}

	useEffect(() => {
		if (price) {
			setstep(1);
			setcheck1(false);
			setsign(null);
			setfile(false);
			setpath("");
			// if(bilingData.length > 0){
			console.log("!!!", "planInfo", planInfo);
			getInvoice(planInfo);
			// }
		}
	}, [price]);

	async function regVendor() {
		const fd = new FormData();
		fd.append("plan_info", "ENTERPRISE_MONTHLY");
		fd.append("payment_proof", sign);
		await axiosInstanceAuth2
			.post(`/subscription/direct-pay/`, fd)
			.then(async (res) => {
				toastcomp("reg success", "success");
				setstep(3);
				setcheck1(false);
				setsign(null);
				setfile(false);
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("reg error", "error");
			});
	}

	const [bilingData, setbilingData] = useState([]);
	const [ainame, setainame] = useState("");
	const [aiaddress, setaiaddress] = useState("");
	const [aicon, setaicon] = useState("");
	const [biname, setbiname] = useState("");
	const [biaddress, setbiaddress] = useState("");
	const [bicon, setbicon] = useState("");
	const [acheck, setacheck] = useState(false);

	function checkForm1() {
		return (
			acheck &&
			ainame.length > 0 &&
			aiaddress.length > 0 &&
			aicon.length > 0 &&
			biname.length > 0 &&
			biaddress.length > 0 &&
			bicon.length > 0
		);
	}

	async function getBillingInfo() {
		await axiosInstanceAuth2
			.get(`/organization/billinginfo/`)
			.then(async (res) => {
				console.log("!!!", "setbilingData", res.data);
				setbilingData(res.data);
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("setbilingData error", "error");
			});
	}

	async function getInvoice(planInfo: any) {
		const fd = new FormData();
		fd.append("plan_type", planInfo);
		await axiosInstanceAuth2
			.post(`/subscription/pay-invoice/`, fd)
			.then(async (res) => {
				console.log("!!!", "getInvoice", res.data);
				const data = res.data;
				const path =
					process.env.NODE_ENV === "production"
						? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/${data.Path}`
						: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/${data.Path}`;

				console.log("!!!", "path", path);
				setpath(path);

				// setbilingData(res.data);
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("getInvoice error", "error");
			});
	}

	async function regBillingInfo() {
		const fd = new FormData();
		fd.append("ai_representative", ainame);
		fd.append("ai_address", aiaddress);
		fd.append("ai_phone", aicon);
		fd.append("bi_representative", biname);
		fd.append("bi_address", biaddress);
		fd.append("bi_phone", bicon);
		await axiosInstanceAuth2
			.post(`/organization/billinginfo/add/`, fd)
			.then(async (res) => {
				toastcomp("regBillingInfo success", "success");
				getBillingInfo();
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("regBillingInfo error", "error");
				getBillingInfo();
			});
	}

	useEffect(() => {
		if (token && token.length > 0) {
			getBillingInfo();
		}
	}, [token]);

	return (
		<>
			<Head>
				<title>{t("Words.Plans_Pricing")}</title>
			</Head>
			<main>
				<OrgSideBar />
				<OrgTopBar />
				{token && token.length > 0 && <OrgRSideBar axiosInstanceAuth2={axiosInstanceAuth2} />}
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className={`layoutWrap p-4` + " " + (visible && "mr-[calc(27.6%+1rem)]")}>
					<div className="rounded-normal bg-white shadow-normal dark:bg-gray-800">
						<div className="border-b py-2">
							<div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-start px-4 py-2">
								<button
									onClick={() => router.back()}
									className="mr-10 justify-self-start text-darkGray dark:text-gray-400"
								>
									<i className="fa-solid fa-arrow-left text-xl"></i>
								</button>
								<h2 className="flex items-center text-lg font-bold">
									<div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded bg-[#B2E3FF] p-3">
										<Image src={pricingIcon} alt="Active Job" height={20} />
									</div>
									<div className="flex flex-col gap-2">
										<span>{t("Words.Plans_Pricing")}</span>
										<div className="flex gap-2">
											<button
												className={
													"mr-4 border-b-4 py-1 text-xs font-semibold focus:outline-none" +
													" " +
													(tab === 0
														? "border-primary text-primary dark:border-white dark:text-white"
														: "border-transparent text-darkGray dark:text-gray-400")
												}
												onClick={() => settab(0)}
											>
												Plan & billing Information
											</button>
											<button
												className={
													"mr-4 border-b-4 py-1 text-xs font-semibold focus:outline-none" +
													" " +
													(tab === 1
														? "border-primary text-primary dark:border-white dark:text-white"
														: "border-transparent text-darkGray dark:text-gray-400")
												}
												onClick={() => settab(1)}
											>
												Billing history
											</button>
										</div>
									</div>
								</h2>
							</div>
						</div>
						{tab === 0 && (
							<div className="mx-auto w-full max-w-[980px] px-4 py-6">
								<div className="mx-auto mb-6 w-full max-w-[800px]">
									<p className="text-center text-sm font-semibold text-darkGray dark:text-gray-400">
										{srcLang === "ja"
											? "規模の大小に関わらず、自動化による生産性の高い採用活動を提供します。"
											: "Whether your time-saving automation needs are large or small, we are here to help you scale."}
									</p>
								</div>
								<div className={"mx-auto mb-10 w-full max-w-[800px] text-center"}>
									<button
										className={
											"rounded-full px-4 py-2 text-[12px] font-bold uppercase" +
											" " +
											(!duration ? "bg-primary text-white" : "text-darkGray dark:text-gray-400")
										}
										onClick={() => setduration(false)}
									>
										{t("Form.Yearly")}
									</button>
									<button
										className={
											"rounded-full px-4 py-2 text-[12px] font-bold uppercase" +
											" " +
											(duration ? "bg-primary text-white" : "text-darkGray dark:text-gray-400")
										}
										onClick={() => setduration(true)}
									>
										{t("Form.Monthly")}
									</button>
								</div>
								<div className="mx-auto flex w-[80%] flex-wrap justify-center gap-4 p-2">
									{activePlan === 0 ? (
										<div className="m-2 flex min-w-[20vw] cursor-default justify-between rounded-normal bg-[#3358C5] p-4 px-6 text-white shadow-lg shadow-[#3358C5]/[0.7]">
											<div className="flex flex-col gap-1">
												<div className="text-xs font-bold">FREE Trial</div>
												<div className="flex gap-1 text-lg font-semibold">
													<div className="font-black">0 ￥</div>
													<div>30 days</div>
												</div>
												<div className="text-xs font-bold">Flexible</div>
												<div className="text-xs font-[300]">100 Application free</div>
											</div>
											<div
												className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold text-[#3358C5]"
												style={{
													boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
												}}
											>
												Enterprise
											</div>
										</div>
									) : (
										<div className="m-2 flex min-w-[20vw] cursor-pointer justify-between rounded-normal bg-white p-4 px-6 shadow-md hover:shadow-lg">
											<div className="flex flex-col gap-1">
												<div className="text-xs font-bold">FREE Trial</div>
												<div className="flex gap-1 text-lg font-semibold">
													<div className="font-black text-primary">0 ￥</div>
													<div>30 days</div>
												</div>
												<div className="text-xs font-bold">Flexible</div>
												<div className="text-xs font-[300]">100 Application free</div>
											</div>
											<div
												className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold"
												style={{
													boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
												}}
											>
												Enterprise
											</div>
										</div>
									)}

									{activePlan === 1 ? (
										<div className="m-2 flex min-w-[20vw] cursor-default justify-between rounded-normal bg-[#3358C5] p-4 px-6 text-white shadow-lg shadow-[#3358C5]/[0.7]">
											<div className="flex flex-col gap-1">
												<div className="text-xs font-bold">{duration ? "Monthly Fixed" : "Annual Fixed"}</div>
												<div className="text-lg font-black">{duration ? "30,000￥/monthly" : "360,000￥/yearly"}</div>

												<div className="text-[10px] font-bold">Active/Paid</div>
												<div className="text-xs font-bold">Flexible</div>
												<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
												<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div>
											</div>
											<div
												className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold text-[#3358C5]"
												style={{
													boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
												}}
											>
												Standard
											</div>
										</div>
									) : (
										<div
											className="m-2 flex min-w-[20vw] cursor-pointer justify-between rounded-normal bg-white p-4 px-6 shadow-md hover:shadow-lg"
											onClick={() => {
												setplanInfo(duration ? "STANDARD_MONTHLY" : "STANDARD_YEARLY");
												setprice(true);
											}}
										>
											<div className="flex flex-col gap-1">
												<div className="text-xs font-bold">{duration ? "Monthly Fixed" : "Annual Fixed"}</div>
												<div className="text-lg font-black text-primary ">
													{duration ? "30,000￥/monthly" : "360,000￥/yearly"}
												</div>

												<div className="text-xs font-bold">Flexible</div>
												<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
												<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div>
											</div>
											<div
												className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold"
												style={{
													boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
												}}
											>
												Standard
											</div>
										</div>
									)}

									{activePlan === 2 ? (
										<div className="m-2 flex min-w-[20vw] cursor-default justify-between rounded-normal bg-[#3358C5] p-4 px-6 text-white shadow-lg shadow-[#3358C5]/[0.7]">
											<div className="flex flex-col gap-1">
												<div className="text-xs font-bold">{duration ? "Monthly Fixed" : "Annual Fixed"}</div>
												<div className="text-lg font-black">{duration ? "45,000￥/monthly" : "480,000￥/yearly"}</div>

												<div className="text-[10px] font-bold">Active/Paid</div>
												<div className="text-xs font-bold">Flexible</div>
												<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
												<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div>
											</div>
											<div
												className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold text-[#3358C5]"
												style={{
													boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
												}}
											>
												Enterprise
											</div>
										</div>
									) : (
										<div
											className="m-2 flex min-w-[20vw] cursor-pointer justify-between rounded-normal bg-white p-4 px-6 shadow-md hover:shadow-lg"
											onClick={() => {
												setplanInfo(duration ? "ENTERPRISE_MONTHLY" : "ENTERPRISE_YEARLY");
												setprice(true);
											}}
										>
											<div className="flex flex-col gap-1">
												<div className="text-xs font-bold">{duration ? "Monthly Fixed" : "Annual Fixed"}</div>
												<div className="text-lg font-black text-primary">
													{duration ? "45,000￥/monthly" : "480,000￥/yearly"}
												</div>

												<div className="text-xs font-bold">Flexible</div>
												<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
												<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div>
											</div>
											<div
												className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold"
												style={{
													boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
												}}
											>
												Enterprise
											</div>
										</div>
									)}
								</div>
								<br />
								<hr />
								<br />
								<div className="my-2 flex w-full flex-col items-center justify-center gap-10">
									<h1 className="text-base font-bold">Billing Information </h1>
									<div className="flex justify-center gap-20 text-sm">
										<div className="flex  flex-col gap-1">
											<p className="pb-4">
												Account Information&nbsp;<i className="fa-solid fa-pen-to-square"></i>
											</p>
											{bilingData && bilingData.length > 0 ? (
												<>
													{bilingData.map((data, i) => (
														<>
															<span className="text-xs">{data.ai_representative}</span>
															<span className="text-xs">{data.ai_address}</span>
															<span className="text-xs">{data.ai_phone}</span>
														</>
													))}
												</>
											) : (
												<>
													<span className="text-xs">No Data</span>
												</>
											)}
											{/* <span className="text-xs">Taro Suzuki (Representative)</span>
											<span className="text-xs">
												Somhako Inc,. 223-0061, Yokohoma shi , kohoku, Hiyoshi 506 0709999999, 045,000000
											</span> */}
										</div>
										<div className="flex  flex-col gap-1">
											<p className="pb-4">
												Billing address&nbsp;<i className="fa-solid fa-pen-to-square"></i>
											</p>
											{bilingData && bilingData.length > 0 ? (
												<>
													{bilingData.map((data, i) => (
														<>
															<span className="text-xs">{data.bi_representative}</span>
															<span className="text-xs">{data.bi_address}</span>
															<span className="text-xs">{data.bi_phone}</span>
														</>
													))}
												</>
											) : (
												<>
													<span className="text-xs">No Data</span>
												</>
											)}
											{/* <span className="text-xs">Taro Suzuki (Representative)</span>
											<span className="text-xs">
												Somhako Inc,. 223-0061, Yokohoma shi , kohoku, Hiyoshi 506 0709999999, 045,000000
											</span> */}
										</div>
									</div>
								</div>
							</div>
						)}
						{tab === 1 && (
							<div className="mx-auto w-full max-w-[980px] px-4 py-6">
								<div>
									<button
										className={
											"my-2 mr-4 flex gap-2 border-b-4 border-primary py-1 text-base font-semibold text-primary focus:outline-none dark:border-white dark:text-white"
										}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
											<path
												d="M14.3407 16.1846C14.0558 16.1846 13.8249 16.441 13.8249 16.7575V18.8679C13.8249 19.0069 13.7747 19.1401 13.6853 19.2374C13.596 19.3348 13.4753 19.3883 13.3502 19.3858H1.49588C1.23997 19.3845 1.03272 19.1545 1.03154 18.8703V6.04946H4.20728C4.53559 6.04946 4.85051 5.90464 5.08268 5.64665C5.31485 5.38883 5.44525 5.03909 5.44525 4.6745V1.14571H13.3503C13.6068 1.14571 13.8147 1.37651 13.8147 1.66121V4.64016C13.8147 4.95665 14.0457 5.21303 14.3305 5.21303C14.6154 5.21303 14.8464 4.95665 14.8464 4.64016V1.66121C14.8458 1.22083 14.6881 0.798547 14.4077 0.487192C14.1272 0.175822 13.747 0.00062209 13.3504 8.30165e-06H5.37528C4.95471 -0.00143025 4.55113 0.184145 4.25477 0.515509L0.464349 4.72528C0.165976 5.05439 -0.00128223 5.50241 7.40277e-06 5.96947V18.8705C0.000583095 19.3108 0.158334 19.7331 0.438851 20.0445C0.719232 20.3559 1.09951 20.5311 1.49602 20.5317H13.3503C13.7476 20.531 14.1283 20.3557 14.4091 20.0438C14.6899 19.732 14.8478 19.3092 14.8484 18.8681V16.7577C14.8485 16.4449 14.6225 16.1898 14.3409 16.1848L14.3407 16.1846ZM4.41572 1.95703V4.67239C4.41572 4.73313 4.39398 4.79148 4.35541 4.83447C4.31669 4.87731 4.26416 4.90144 4.20946 4.90144H1.75396L4.41572 1.95703Z"
												fill="#3358C5"
											/>
											<path
												d="M18.4098 4.82809C18.1658 4.55795 17.8352 4.40625 17.4907 4.40625C17.1459 4.40625 16.8153 4.55794 16.5714 4.82809L8.27018 14.0443C8.19289 14.1308 8.14222 14.2424 8.12582 14.3627L7.71317 17.4219H7.71303C7.69014 17.587 7.73346 17.755 7.83134 17.8819C7.92936 18.0089 8.07228 18.0817 8.22269 18.0819H8.30113L11.0393 17.6006C11.1478 17.5822 11.2483 17.5261 11.3261 17.4403L19.6332 8.2306C19.877 7.95999 20.0141 7.59267 20.0141 7.20987C20.0141 6.82689 19.877 6.45974 19.6332 6.18897L18.4098 4.82809ZM18.9051 7.41975L10.7258 16.503L8.83368 16.8238L9.12255 14.7225L17.2999 5.63681C17.3503 5.58086 17.4187 5.54937 17.4898 5.54937C17.561 5.54937 17.6294 5.58086 17.6796 5.63681L18.9032 6.99802C18.9537 7.05381 18.9819 7.12973 18.9819 7.20869C18.9819 7.28781 18.9537 7.36374 18.9032 7.41952L18.9051 7.41975Z"
												fill="#3358C5"
											/>
											<path
												d="M11.7512 5.11974C11.7512 4.9679 11.6968 4.82212 11.6001 4.71471C11.5034 4.6073 11.3721 4.54688 11.2354 4.54688H7.8596C7.57476 4.54688 7.34375 4.80342 7.34375 5.11974C7.34375 5.43623 7.57476 5.69261 7.8596 5.69261H11.2354C11.3721 5.69261 11.5034 5.63235 11.6001 5.52494C11.6968 5.41737 11.7512 5.27175 11.7512 5.11974Z"
												fill="#3358C5"
											/>
											<path
												d="M11.4525 8.34631C11.4525 8.1943 11.3982 8.04868 11.3013 7.94111C11.2046 7.8337 11.0735 7.77344 10.9366 7.77344H3.50023C3.21539 7.77344 2.98438 8.02982 2.98438 8.34631C2.98438 8.66263 3.21539 8.91918 3.50023 8.91918H10.941C11.2243 8.91662 11.4527 8.66087 11.4527 8.34631H11.4525Z"
												fill="#3358C5"
											/>
											<path
												d="M8.39052 11.5729C8.39052 11.4209 8.33611 11.2752 8.23939 11.1678C8.14267 11.0603 8.0114 11 7.87467 11H3.50023C3.21539 11 2.98438 11.2564 2.98438 11.5729C2.98438 11.8892 3.21539 12.1457 3.50023 12.1457H7.87467C8.0114 12.1457 8.14267 12.0853 8.23939 11.9779C8.33611 11.8705 8.39052 11.7247 8.39052 11.5729Z"
												fill="#3358C5"
											/>
											<path
												d="M3.50023 14.2266C3.21539 14.2266 2.98438 14.4831 2.98438 14.7994C2.98438 15.1159 3.21539 15.3723 3.50023 15.3723H6.42003C6.70488 15.3723 6.93589 15.1159 6.93589 14.7994C6.93589 14.4831 6.70488 14.2266 6.42003 14.2266H3.50023Z"
												fill="#3358C5"
											/>
										</svg>
										<span>Plan subscribtion</span>
									</button>
									<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
										<thead>
											<tr>
												<th className="border-b px-4 py-2 text-left">Plan Name</th>
												<th className="border-b px-4 py-2 text-left">Status</th>
												<th className="border-b px-4 py-2 text-left">Users</th>
												<th className="border-b px-4 py-2 text-left">Payment</th>
												<th className="border-b px-4 py-2 text-left">Paid</th>
											</tr>
										</thead>
										<tbody>
											{Array(5).fill(
												<tr>
													<td className="border-b px-4 py-2 text-sm">Somhako Enterprise </td>
													<td className="border-b px-4 py-2 text-sm">Active</td>
													<td className="border-b px-4 py-2 text-sm">15 Users</td>
													<td className="border-b px-4 py-2 text-sm">Flexible plan </td>
													<td className="border-b px-4 py-2 text-sm text-primary hover:underline">Invoice </td>
												</tr>
											)}
										</tbody>
									</table>
									<div className="my-2 text-center">
										<Button label="Download CSV" btnStyle="sm" />
									</div>
								</div>
								<br />
								<hr />
								<br />
								<div>
									<button
										className={
											"my-2 mr-4 flex gap-2 border-b-4 border-primary py-1 text-base font-semibold text-primary focus:outline-none dark:border-white dark:text-white"
										}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
											<path
												d="M3 8.66309V19.4028H18.9639L18.9641 14.1769V3.4375H8.22503V8.66274L3 8.66309ZM13.4501 8.95157V13.8886H8.51343V8.95157H13.4501ZM3.28819 19.1142V14.1772H8.2249V19.1142H3.28819ZM8.51343 19.1142V14.1772H13.4501V19.1142H8.51343ZM18.6754 14.1772V19.1142H13.7387V14.1772H18.6754ZM18.6754 8.95157V13.8886H13.7387V8.95157H18.6754ZM18.6754 3.72632V8.66303H13.7387V3.72667L18.6754 3.72632ZM8.51343 3.72632H13.4501V8.66303H8.51343V3.72632ZM8.22495 13.8886H3.28825V8.95157H8.22495V13.8886Z"
												fill="black"
												stroke="#3358C5"
												stroke-width="0.8"
											/>
											<path
												d="M1 6.51378H6.51378V1H1V6.51378ZM6.2249 1.28854V6.22524L1.28854 6.22511V1.28874H6.2249V1.28854Z"
												fill="black"
												stroke="#F4F90B"
												stroke-width="0.8"
											/>
										</svg>
										<span>Variable subscribtion</span>
									</button>
									<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
										<thead>
											<tr>
												<th className="border-b px-4 py-2 text-left">Total Applications</th>
												<th className="border-b px-4 py-2 text-left">Amount</th>
												<th className="border-b px-4 py-2 text-left">Billing cycle </th>
												<th className="border-b px-4 py-2 text-left">Paid on date </th>
												<th className="border-b px-4 py-2 text-left">Due</th>
												<th className="border-b px-4 py-2 text-left">Paid</th>
											</tr>
										</thead>
										<tbody>
											{Array(5).fill(
												<tr>
													<td className="border-b px-4 py-2 text-sm">200</td>
													<td className="border-b px-4 py-2 text-sm">￥２0000/-</td>
													<td className="border-b px-4 py-2 text-sm">Oct 15- Nov 12 2023</td>
													<td className="border-b px-4 py-2 text-sm">Nov 14,2023</td>
													<td className="border-b px-4 py-2 text-sm text-primary hover:underline">
														Invoice&nbsp;<i className="fa-solid fa-circle-check text-green-500"></i>
													</td>
													<td className="border-b px-4 py-2 text-sm text-primary hover:underline">
														<span className="text-red-500">due</span>Invoice{" "}
													</td>
												</tr>
											)}
										</tbody>
									</table>
									<div className="my-2 text-center">
										<Button label="Download CSV" btnStyle="sm" />
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
			<Transition.Root show={price} as={Fragment}>
				<Dialog as="div" className="relative z-[1000]" initialFocus={cancelButtonRef} onClose={setprice}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								{bilingData && bilingData.length <= 0 ? (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all sm:my-8 sm:max-w-lg">
										<div className="flex items-center justify-between px-8 py-6">
											<h4 className="text-lg font-semibold leading-none">Billing Information</h4>
											<button
												type="button"
												className="leading-none hover:text-gray-700"
												onClick={() => setprice(false)}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										</div>
										<div className="w-full p-8 pt-4 font-normal">
											<>
												<div className="mb-4 flex w-full items-center justify-center rounded-normal border-2 border-dashed py-2 last:mb-0">
													Before Purchace Plan Fill up Biling Information
												</div>
												<div className="mb-4 last:mb-0">
													<div>
														<label htmlFor={`field_cname`} className="mb-1 inline-block text-sm font-light">
															Account Information Represtative&nbsp;
															<sup className="text-red-500">*</sup>
														</label>
														<input
															type="text"
															id="cname"
															className={`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm`}
															value={ainame}
															onChange={(e) => setainame(e.target.value)}
														/>
													</div>
												</div>
												<div className="mb-4 last:mb-0">
													<div>
														<label htmlFor={`field_cname`} className="mb-1 inline-block text-sm font-light">
															Account Information Address&nbsp;
															<sup className="text-red-500">*</sup>
														</label>
														<textArea
															id="cname"
															className={`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm`}
															value={aiaddress}
															onChange={(e) => setaiaddress(e.target.value)}
														></textArea>
													</div>
												</div>
												<div className="mb-4 last:mb-0">
													<div>
														<label htmlFor={`field_cname`} className="mb-1 inline-block text-sm font-light">
															Account Information Contact&nbsp;
															<sup className="text-red-500">*</sup>
														</label>
														<input
															type="text"
															id="cname"
															className={`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm`}
															value={aicon}
															onChange={(e) => setaicon(e.target.value)}
														/>
													</div>
												</div>
												<div className="mb-4 last:mb-0">
													<div>
														<label htmlFor={`field_cname`} className="mb-1 inline-block text-sm font-light">
															Billing Information Represtative&nbsp;
															<sup className="text-red-500">*</sup>
														</label>
														<input
															type="text"
															id="cname"
															className={`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm`}
															value={biname}
															onChange={(e) => setbiname(e.target.value)}
														/>
													</div>
												</div>
												<div className="mb-4 last:mb-0">
													<div>
														<label htmlFor={`field_cname`} className="mb-1 inline-block text-sm font-light">
															Billing Information Address&nbsp;
															<sup className="text-red-500">*</sup>
														</label>
														<textArea
															id="cname"
															className={`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm`}
															value={biaddress}
															onChange={(e) => setbiaddress(e.target.value)}
														></textArea>
													</div>
												</div>
												<div className="mb-4 last:mb-0">
													<div>
														<label htmlFor={`field_cname`} className="mb-1 inline-block text-sm font-light">
															Billing Information Contact&nbsp;
															<sup className="text-red-500">*</sup>
														</label>
														<input
															type="text"
															id="cname"
															className={`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm`}
															value={bicon}
															onChange={(e) => setbicon(e.target.value)}
														/>
													</div>
												</div>

												<div className="mb-4 last:mb-0">
													<label htmlFor="agreeWithAgreement" className="flex cursor-pointer text-xs font-light">
														<input
															type="checkbox"
															id="agreeWithAgreement"
															className="mr-4 mt-1"
															checked={acheck}
															onChange={(e) => setacheck(e.target.checked)}
														/>
														Account Info Cant Chnage
													</label>
												</div>
												<div className="mb-4 last:mb-0">
													<Button
														label={"Submit"}
														btnType={"button"}
														handleClick={regBillingInfo}
														disabled={!checkForm1()}
													/>
												</div>
											</>
										</div>
									</Dialog.Panel>
								) : (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all sm:my-8 sm:max-w-lg">
										<div className="flex items-center justify-between px-8 py-6">
											<h4 className="text-lg font-semibold leading-none">Direct Payment</h4>
											<button
												type="button"
												className="leading-none hover:text-gray-700"
												onClick={() => setprice(false)}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										</div>
										<div className="w-full p-8 pt-4 font-normal">
											{/* {step === 0 && (
											<div className="mx-[-10px] flex flex-wrap">
												<div className="mb-4 w-full px-[10px] md:max-w-[50%]">
													<Button label={"Direct Pay"} btnType="button" full handleClick={() => setstep(1)} />
												</div>
												<div className="mb-4 w-full px-[10px] md:max-w-[50%]">
													<Button label={"Online Pay"} btnType="button" full handleClick={() => setstep(2)} />
												</div>
											</div>
										)} */}
											{step === 1 && (
												<>
													{path && path.length > 0 && (
														<div
															className="mb-4 flex w-full items-center justify-center rounded-normal border-2 border-dashed py-2 last:mb-0"
															onClick={() => {
																window.open(path, "_blank");
															}}
														>
															Invoice Download Here
														</div>
													)}
													<div className="mb-4 last:mb-0">
														<h5 className="text-md mb-2 w-full font-semibold">Upload Payment Proof</h5>
														<label
															htmlFor="uploadBanner"
															className="flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-normal border-2 border-dashed hover:bg-lightBlue dark:hover:bg-gray-700"
														>
															{!file ? (
																<>
																	<i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
																	<p className="text-sm text-darkGray dark:text-gray-400">
																		Upload Payment Proof
																		<br />
																		<small>(File type should be .png format)</small>
																	</p>
																</>
															) : (
																<>
																	<Image
																		src={URL.createObjectURL(sign)}
																		alt="User"
																		width={1200}
																		height={800}
																		className="mx-auto h-auto max-h-[200px] w-auto object-contain"
																	/>
																</>
															)}
															<input
																type="file"
																hidden
																id="uploadBanner"
																accept="image/*"
																onChange={handleFileInputChange}
															/>
														</label>
													</div>
													<div className="mb-4 last:mb-0">
														<label htmlFor="agreeWithAgreement" className="flex cursor-pointer text-xs font-light">
															<input
																type="checkbox"
																id="agreeWithAgreement"
																className="mr-4 mt-1"
																checked={check1}
																onChange={(e) => setcheck1(e.target.checked)}
															/>
															Click here if you read the agreement terms and submit your filled details for the Somhako.
														</label>
													</div>
													<div className="mb-4 last:mb-0">
														<Button
															label={"Submit"}
															btnType={"button"}
															handleClick={regVendor}
															disabled={!checkForm()}
														/>
													</div>
												</>
											)}
											{step === 3 && (
												<>
													<div className="mb-4 flex w-full items-center justify-center rounded-normal border-2 border-dashed py-2 last:mb-0">
														We taking 2 or 3 Working Days For Activate Your Account
													</div>
													<div className="mb-4 last:mb-0">
														<Button label={"Close"} btnType={"button"} handleClick={() => setprice(false)} />
													</div>
												</>
											)}
										</div>
									</Dialog.Panel>
								)}
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
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
