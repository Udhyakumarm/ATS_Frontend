//@collapse
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
import { axiosInstanceAuth, axiosInstance2 } from "@/pages/api/axiosApi";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import OrgRSideBar from "@/components/organization/RSideBar";
import { Menu, Tab, Listbox, Transition, Dialog } from "@headlessui/react";
import toastcomp from "@/components/toast";
import moment from "moment";
import { PopupModal } from "react-calendly";
import { InlineWidget } from "react-calendly";

export default function Pricing() {
	const { t } = useTranslation("common");

	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const [duration, setduration] = useState(true);
	const [tab, settab] = useState(0);
	const [activePlan, setactivePlan] = useState(1);
	const [planInfo, setplanInfo] = useState("");
	const [price, setprice] = useState(false);
	const [changePlan, setchangePlan] = useState(false);
	const [changePlan2, setchangePlan2] = useState(false);
	const [billingInfo2, setbillingInfo2] = useState(false);
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
	const [cplan, setcplan] = useState({});
	const [aplan, setaplan] = useState([]);
	const [vplan, setvplan] = useState([]);
	const [vcplan, setvcplan] = useState([]);
	const cancelButtonRef = useRef(null);

	const [bilingData, setbilingData] = useState([]);
	const [ainame, setainame] = useState("");
	const [aiaddress, setaiaddress] = useState("");
	const [aicon, setaicon] = useState("");
	const [biname, setbiname] = useState("");
	const [biaddress, setbiaddress] = useState("");
	const [bicon, setbicon] = useState("");
	const [acheck, setacheck] = useState(false);
	const [plansData, setPlansData] = useState([]);
	const [selectedPlanId, setSelectedPlanId] = useState(null);

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

	async function regBillingInfo() {
		setbillingInfo2(false);
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
				initatePopup();
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("regBillingInfo error", "error");
				getBillingInfo();
			});
	}
	// /subscription/get-pricelist/
	const redirectToStripe = async (planId:any) => {
		try {
			const formData = new FormData();
			formData.append("product_id", planId);

			const response = await axiosInstanceAuth2.post(`/subscription/create-subscription/`, formData);
			if (response.data.url && response.data.url.length > 0) {
				toastcomp("Redirecting to Stripe", "success");
				router.replace(response.data.url);
			} else {
				toastcomp("Error occured", "error");
			}
		} catch (error) {
			console.error("Error redirecting to Stripe:", error);
			toastcomp("Error redirecting to Stripe", "error");
		}
	};
	// 
	// getplansData();
	const getplansData = async () => {
		try {
			const response = await axiosInstanceAuth2.get(`/subscription/get-pricelist/`);
			console.log("response from get pricelist api:", response.data);
			setPlansData(response.data);
			console.log(plansData[0].price_id);
		} catch (error) {
			console.error("Error fetching plan data:", error);
			return null;
		}
	};
	// getplansData();
	useEffect(() => {
		const timer = setTimeout(() => {
			getplansData();
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

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

	async function getInvoice(planInfo: any) {
		const fd = new FormData();
		fd.append("plan_type", planInfo);
		await axiosInstanceAuth2
			.post(`/subscription/invoice/`, fd)
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

	async function getCurrentPlanInfo() {
		await axiosInstanceAuth2
			.get(`/subscription/get-active-plan/`)
			.then(async (res) => {
				console.log("!!!", "get-active-plan", res.data);
				const data = res.data;
				if (data.length > 0) {
					setcplan(data[0]);
				} else {
					setcplan({});
				}
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("get-active-plan error", "error");
				setcplan({});
			});
	}

	async function getALLPlanInfo() {
		await axiosInstanceAuth2
			.get(`/subscription/get-all-plan/`)
			.then(async (res) => {
				console.log("!!!", "get-all-plan", res.data);
				setaplan(res.data);
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("get-all-plan error", "error");
				setaplan([]);
			});
	}

	async function getALLVPlanInfo() {
		await axiosInstanceAuth2
			.get(`/subscription/get-all-csh/`)
			.then(async (res) => {
				console.log("!!!", "get-all-csh", res.data);
				setvplan(res.data);
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("get-all-csh error", "error");
				setvplan([]);
			});
	}

	async function getALLVCPlanInfo() {
		await axiosInstanceAuth2
			.get(`/subscription/get-all-csh1/`)
			.then(async (res) => {
				console.log("!!!", "get-all-csh", res.data);
				setvcplan(res.data);
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("get-all-csh error", "error");
				setvcplan([]);
			});
	}

	useEffect(() => {
		if (token && token.length > 0) {
			getCurrentPlanInfo();
			getALLPlanInfo();
			// getALLVPlanInfo();
			// getALLVCPlanInfo();
			getBillingInfo();
		}
	}, [token, tab]);

	async function initatePopup() {
		await axiosInstanceAuth2.get(`/subscription/get-all-pay-proof-plan/`).then(async (res) => {
			console.log("!!!", "get-all-pay-proof-plan", res.data);
			toastcomp("get-all-pay-proof-plan success", "success");
			const data = res.data;
			toastcomp("initatePopup", "success");
			setchangePlan(false);
			setbillingInfo2(false);
			setchangePlan2(false);
			if (data.length > 0) {
				setstep(3);
				setchangePlan2(true);
			} else {
				await axiosInstanceAuth2.get(`/organization/billinginfo/`).then(async (res) => {
					console.log("!!!", "setbilingData", res.data);
					setbilingData(res.data);
					const data2 = res.data;
					if (data2 && data2.length <= 0) {
						setbillingInfo2(true);
					} else {
						setstep(1);
						setcheck1(false);
						setsign(null);
						setfile(false);
						setpath("");
						console.log("!!!", "planInfo", planInfo);
						getInvoice(planInfo);
						setchangePlan2(true);
					}
				});
			}
		});

		// Calendly.initPopupWidget({ url: "https://calendly.com/somhako/somhako-plan" });
	}

	useEffect(() => {
		if (price) {
			if (cplan && cplan.active) {
				setchangePlan(true);
				setprice(false);
			} else {
				initatePopup();
				setprice(false);
			}
		}
	}, [price]);

	async function regVendor() {
		const fd = new FormData();
		fd.append("plan_info", planInfo);
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
												{srcLang === "ja" ? "プランと請求について" : "Plan & Billing Information"}
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
												{srcLang === "ja" ? "請求履歴" : "Billing History"}
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
								{/* temp change naman */}
								{/* <div className={"mx-auto mb-10 w-full max-w-[800px] text-center"}>
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
								</div> */}
								<div className="mx-auto flex w-[80%] flex-wrap justify-center gap-4 p-2">
									{/* duration true for monthly */}
									{/* free plan */}
									{cplan.plan_info && cplan.plan_info === "FREE" ? (
										<div className="m-2 flex min-w-[20vw] cursor-default justify-between rounded-normal bg-[#3358C5] p-4 px-6 text-white shadow-lg shadow-[#3358C5]/[0.7]">
											<div className="flex flex-col gap-1">
												<div className="text-xs font-bold">{srcLang === "ja" ? "無料体験" : "FREE Trial"}</div>
												<div className="flex gap-1 text-lg font-semibold">
													<div className="font-black">0 ￥</div>
													<div>30 days</div>
												</div>
												{/* <div className="text-xs font-bold">Flexible</div>
												<div className="text-xs font-[300]">100 Application free</div> */}
											</div>
											<div
												className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold text-[#3358C5]"
												style={{
													boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
												}}
											>
												{srcLang === "ja" ? "エンタープライズ" : "Enterprise"}
											</div>
										</div>
									) : (
										<div className="m-2 flex min-w-[20vw] cursor-pointer justify-between rounded-normal bg-white p-4 px-6 shadow-md hover:shadow-lg dark:bg-gray-900 dark:hover:shadow-gray-600">
											<div className="flex flex-col gap-1">
												<div className="text-xs font-bold">{srcLang === "ja" ? "無料体験" : "FREE Trial"}</div>
												<div className="flex gap-1 text-lg font-semibold">
													<div className="font-black text-primary">0 ￥</div>
													<div>30 {srcLang === "ja" ? "日" : "days"}</div>
												</div>
												{/* <div className="text-xs font-bold">Flexible</div>
												<div className="text-xs font-[300]">100 Application free</div> */}
											</div>
											<div
												className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold dark:bg-gray-800"
												style={{
													boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
												}}
											>
												{srcLang === "ja" ? "エンタープライズ" : "Enterprise"}
											</div>
										</div>
									)}
									{duration ? (
										<>
											{/* starter m plan */}
											{cplan.plan_info && cplan.plan_info === "STARTER_MONTHLY" ? (
												<div className="m-2 flex min-w-[20vw] cursor-default justify-between rounded-normal bg-[#3358C5] p-4 px-6 text-white shadow-lg shadow-[#3358C5]/[0.7]">
													<div className="flex flex-col gap-1">
														<div className="text-xs font-bold">{srcLang === "ja" ? "毎月固定" : "Monthly Fixed"}</div>
														<div className="text-lg font-black">5,000￥/{srcLang === "ja" ? "毎月" : "Monthly"}</div>

														<div className="text-[10px] font-bold">
															{srcLang === "ja" ? "現役／有給" : "Active/Paid"}
														</div>
														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
													</div>
													<div
														className="ml-[1rem] h-fit w-fit rounded-full bg-white px-7 py-1.5 text-[10px] font-bold text-[#3358C5]"
														style={{
															boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
														}}
													>
														{srcLang === "ja" ? "スターター" : "Starter"}
													</div>
												</div>
											) : (
												<div
													className="m-2 flex min-w-[20vw] cursor-pointer justify-between rounded-normal bg-white p-4 px-6 shadow-md hover:shadow-lg dark:bg-gray-900 dark:hover:shadow-gray-600"
													onClick={() => {
														setplanInfo("STARTER_MONTHLY");
														setprice(true);
														setSelectedPlanId(plansData[0].price_id);
														// redirectToStripe("price_1OzDl8SHBwE4Ooa9diFz5Ca5");
													}}
												>
													<div className="flex flex-col gap-1">
														<div className="text-xs font-bold">{srcLang === "ja" ? "毎月固定" : "Monthly Fixed"}</div>
														<div className="text-lg font-black text-primary ">
															5,000￥/{srcLang === "ja" ? "毎月" : "Monthly"}
														</div>

														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
													</div>
													<div
														className="ml-[1rem] h-fit w-fit rounded-full bg-white px-7 py-1.5 text-[10px] font-bold dark:bg-gray-800"
														style={{
															boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
														}}
													>
														{srcLang === "ja" ? "スターター" : "Starter"}
													</div>
												</div>
											)}

											{/* standard m plan */}
											{cplan.plan_info && cplan.plan_info === "STANDARD_MONTHLY" ? (
												<div className="m-2 flex min-w-[20vw] cursor-default justify-between rounded-normal bg-[#3358C5] p-4 px-6 text-white shadow-lg shadow-[#3358C5]/[0.7]">
													<div className="flex flex-col gap-1">
														<div className="text-xs font-bold">{srcLang === "ja" ? "毎月固定" : "Monthly Fixed"}</div>
														<div className="text-base font-black line-through decoration-red-500">30,000￥</div>
														<div className="text-lg font-black ">12,000￥/{srcLang === "ja" ? "毎月" : "Monthly"}</div>

														<div className="text-[10px] font-bold">
															{srcLang === "ja" ? "現役／有給" : "Active/Paid"}
														</div>
														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
													</div>
													<div
														className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold text-[#3358C5]"
														style={{
															boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
														}}
													>
														{srcLang === "ja" ? "標準" : "Standard"}
													</div>
												</div>
											) : (
												<div
													className="m-2 flex min-w-[20vw] cursor-pointer justify-between rounded-normal bg-white p-4 px-6 shadow-md hover:shadow-lg dark:bg-gray-900 dark:hover:shadow-gray-600"
													onClick={() => {
														setplanInfo("STANDARD_MONTHLY");
														setprice(true);
														setSelectedPlanId(plansData[1].price_id);
														// redirectToStripe("price_1OzDllSHBwE4Ooa93HdCGu4d");
													}}
												>
													<div className="flex flex-col gap-1">
														<div className="text-xs font-bold">{srcLang === "ja" ? "毎月固定" : "Monthly Fixed"}</div>
														<div className="text-base font-black text-primary line-through decoration-red-500">
															30,000￥
														</div>
														<div className="text-lg font-black text-primary ">
															12,000￥/{srcLang === "ja" ? "毎月" : "Monthly"}
														</div>

														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
													</div>
													<div
														className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold dark:bg-gray-800"
														style={{
															boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
														}}
													>
														{srcLang === "ja" ? "標準" : "Standard"}
													</div>
												</div>
											)}

											{/* Enterprise m plan */}
											{cplan.plan_info && cplan.plan_info === "ENTERPRISE_MONTHLY" ? (
												<div className="m-2 flex min-w-[20vw] cursor-default justify-between rounded-normal bg-[#3358C5] p-4 px-6 text-white shadow-lg shadow-[#3358C5]/[0.7]">
													<div className="flex flex-col justify-center gap-1">
														<div className="text-xs font-bold">{srcLang === "ja" ? "毎月固定" : "Monthly Fixed"}</div>
														{/* <div className="text-base font-black line-through decoration-red-500">60,000￥</div> */}
														<div className="text-lg font-black">45,000￥/{srcLang === "ja" ? "毎月" : "Monthly"}</div>

														<div className="text-[10px] font-bold">
															{srcLang === "ja" ? "現役／有給" : "Active/Paid"}
														</div>
														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
													</div>
													<div
														className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold text-[#3358C5]"
														style={{
															boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
														}}
													>
														{srcLang === "ja" ? "エンタープライズ" : "Enterprise"}
													</div>
												</div>
											) : (
												<div
													className="m-2 flex min-w-[20vw] cursor-pointer justify-between rounded-normal bg-white p-4 px-6 shadow-md hover:shadow-lg dark:bg-gray-900 dark:hover:shadow-gray-600"
													onClick={() => {
														setplanInfo("ENTERPRISE_MONTHLY");
														setprice(true);
														setSelectedPlanId(plansData[2].price_id);
														// redirectToStripe("price_1OzDm5SHBwE4Ooa9rBn3ipJR");
													}}
												>
													<div className="flex flex-col justify-center gap-1">
														<div className="text-xs font-bold">{srcLang === "ja" ? "毎月固定" : "Monthly Fixed"}</div>
														{/* <div className="text-base font-black text-primary line-through decoration-red-500">
															60,000￥
														</div> */}
														<div className="text-lg font-black text-primary ">
															45,000￥/{srcLang === "ja" ? "毎月" : "Monthly"}
														</div>

														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
													</div>
													<div
														className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold dark:bg-gray-800"
														style={{
															boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
														}}
													>
														{srcLang === "ja" ? "エンタープライズ" : "Enterprise"}
													</div>
												</div>
											)}
										</>
									) : (
										<>
											{/* starter y plan */}
											{cplan.plan_info && cplan.plan_info === "STARTER_YEARLY" ? (
												<div className="m-2 flex min-w-[20vw] cursor-default justify-between rounded-normal bg-[#3358C5] p-4 px-6 text-white shadow-lg shadow-[#3358C5]/[0.7]">
													<div className="flex flex-col gap-1">
														<div className="text-xs font-bold">Annual Fixed</div>
														<div className="text-lg font-black">60,000￥/yearly</div>

														<div className="text-[10px] font-bold">Active/Paid</div>
														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
													</div>
													<div
														className="ml-[1rem] h-fit w-fit rounded-full bg-white px-7 py-1.5 text-[10px] font-bold text-[#3358C5]"
														style={{
															boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
														}}
													>
														Starter
													</div>
												</div>
											) : (
												<div
													className="m-2 flex min-w-[20vw] cursor-pointer justify-between rounded-normal bg-white p-4 px-6 shadow-md hover:shadow-lg dark:bg-gray-900 dark:hover:shadow-gray-600"
													onClick={() => {
														setplanInfo("STARTER_YEARLY");
														setprice(true);
													}}
												>
													<div className="flex flex-col gap-1">
														<div className="text-xs font-bold">Annual Fixed</div>
														<div className="text-lg font-black text-primary ">60,000￥/yearly</div>

														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
													</div>
													<div
														className="ml-[1rem] h-fit w-fit rounded-full bg-white px-7 py-1.5 text-[10px] font-bold dark:bg-gray-800"
														style={{
															boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
														}}
													>
														Starter
													</div>
												</div>
											)}

											{/* standard y plan */}
											{cplan.plan_info && cplan.plan_info === "STANDARD_YEARLY" ? (
												<div className="m-2 flex min-w-[20vw] cursor-default justify-between rounded-normal bg-[#3358C5] p-4 px-6 text-white shadow-lg shadow-[#3358C5]/[0.7]">
													<div className="flex flex-col gap-1">
														<div className="text-xs font-bold">Annual Fixed</div>
														<div className="text-base font-black  line-through decoration-red-500">360,000￥</div>
														<div className="text-lg font-black  ">210,000￥/yearly</div>

														<div className="text-[10px] font-bold">Active/Paid</div>
														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
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
													className="m-2 flex min-w-[20vw] cursor-pointer justify-between rounded-normal bg-white p-4 px-6 shadow-md hover:shadow-lg dark:bg-gray-900 dark:hover:shadow-gray-600"
													onClick={() => {
														setplanInfo("STANDARD_YEARLY");
														setprice(true);
													}}
												>
													<div className="flex flex-col gap-1">
														<div className="text-xs font-bold">Annual Fixed</div>
														<div className="text-base font-black text-primary line-through decoration-red-500">
															360,000￥
														</div>
														<div className="text-lg font-black text-primary ">210,000￥/yearly</div>

														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
													</div>
													<div
														className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold dark:bg-gray-800"
														style={{
															boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
														}}
													>
														Standard
													</div>
												</div>
											)}

											{/* Enterprise y plan */}
											{cplan.plan_info && cplan.plan_info === "ENTERPRISE_YEARLY" ? (
												<div className="m-2 flex min-w-[20vw] cursor-default justify-between rounded-normal bg-[#3358C5] p-4 px-6 text-white shadow-lg shadow-[#3358C5]/[0.7]">
													<div className="flex flex-col gap-1">
														<div className="text-xs font-bold">Annual Fixed</div>
														<div className="text-base font-black  line-through decoration-red-500">540,000￥</div>
														<div className="text-lg font-black  ">480,000￥/yearly</div>

														<div className="text-[10px] font-bold">Active/Paid</div>
														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
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
													className="m-2 flex min-w-[20vw] cursor-pointer justify-between rounded-normal bg-white p-4 px-6 shadow-md hover:shadow-lg dark:bg-gray-900 dark:hover:shadow-gray-600"
													onClick={() => {
														setplanInfo("ENTERPRISE_YEARLY");
														setprice(true);
													}}
												>
													<div className="flex flex-col gap-1">
														<div className="text-xs font-bold">Annual Fixed</div>
														<div className="text-base font-black text-primary line-through decoration-red-500">
															540,000￥
														</div>
														<div className="text-lg font-black text-primary ">480,000￥/yearly</div>

														{/* <div className="text-xs font-bold">Flexible</div>
														<div className="text-xs font-[300]">1000 = 200￥/applicant</div>
														<div className="text-xs font-[300]">1,001 and above = 100￥/ applicant</div> */}
													</div>
													<div
														className="ml-[1rem] h-fit w-fit rounded-full bg-white px-5 py-1.5 text-[10px] font-bold dark:bg-gray-800"
														style={{
															boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.25)"
														}}
													>
														Enterprise
													</div>
												</div>
											)}
										</>
									)}
								</div>
								<br />
								<div>
									<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
										<thead>
											<tr>
												<th className="w-[300px] border-b px-3 py-2"></th>
												<th className="border-b px-3 py-2">{srcLang === "ja" ? "無料体験" : "FREE Trial"}</th>
												<th className="border-b px-3 py-2">{srcLang === "ja" ? "スターター" : "Starter"}</th>
												<th className="border-b px-3 py-2">{srcLang === "ja" ? "標準" : "Standard"}</th>
												<th className="border-b px-3 py-2">{srcLang === "ja" ? "エンタープライズ" : "Enterprise"}</th>
											</tr>
										</thead>
										<tbody className="text-sm font-semibold">
											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Novus AI HR Assistant
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Plan Duration
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												{/* temp change naman remove yearly */}
												<td className="px-3 py-2 text-center">Only 30 Days</td>
												<td className="px-3 py-2 text-center">Monthly</td>
												<td className="px-3 py-2 text-center">Monthly</td>
												<td className="px-3 py-2 text-center">Monthly</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Team Members
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">Unlimited</td>
												<td className="px-3 py-2 text-center">Up to 3</td>
												<td className="px-3 py-2 text-center">Unlimited</td>
												<td className="px-3 py-2 text-center">Unlimited</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Vendors/Agency Contracts
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">Up to 2</td>
												<td className="px-3 py-2 text-center">Up to 3</td>
												<td className="px-3 py-2 text-center">Up to 5</td>
												<td className="px-3 py-2 text-center">Unlimited</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Publish/Active Jobs
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">Up to 2</td>
												<td className="px-3 py-2 text-center">Up to 3</td>
												<td className="px-3 py-2 text-center">Up to 10</td>
												<td className="px-3 py-2 text-center">Unlimited</td>
											</tr>

											{/* temp hide naman
											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Application
												</td>
												<td className="px-3 py-2 text-center">Up to 100</td>
												<td className="px-3 py-2 text-center">80 / 1000</td>
												<td className="px-3 py-2 text-center">240 / 3000</td>
												<td className="px-3 py-2 text-center">Flexible</td>
											</tr> */}

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Calendar & Interview
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">Automate & Manual</td>
												<td className="px-3 py-2 text-center">Manual</td>
												<td className="px-3 py-2 text-center">Manual</td>
												<td className="px-3 py-2 text-center">Automate & Manual</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Custimize Dashboard
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Offer Management
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													AI Generated Job Description
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													AI Generated Interview Questions
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													AI Generated Application Rating
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Internal Communication
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-xmark"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Analytics
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Career & Widget
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
											</tr>

											<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
												<td className="w-[300px] px-3 py-2">
													Application Kanban Board
													{/* <Menu as="div" className="relative inline-block">
														<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-circle-question"></i>
														</Menu.Button>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items
																className={
																	"absolute left-[100%] top-0 z-[2] ml-2 w-[200px] rounded bg-gradDarkBlue px-4 py-2 text-[10px] leading-normal text-white shadow-highlight"
																}
															>
																<span className="absolute -left-1 top-4 block h-3 w-3 rotate-45 bg-gradDarkBlue"></span>
																<Menu.Item>
																	<p>Lorem impsum is a dummy text provide here.</p>
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu> */}
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
												<td className="px-3 py-2 text-center">
													<i className="fa-solid fa-check"></i>
												</td>
											</tr>
										</tbody>
									</table>
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
										<span>{srcLang === "ja" ? "プラン購読" : "Plan Subscription"}</span>
									</button>
									{aplan && aplan.length > 0 ? (
										<>
											<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
												<thead>
													<tr>
														<th className="border-b px-4 py-2 text-left">
															{srcLang === "ja" ? "プラン名" : "Plan Name"}
														</th>
														<th className="border-b px-4 py-2 text-left">
															{srcLang === "ja" ? "計画期間" : "Plan Duration"}
														</th>
														<th className="border-b px-4 py-2 text-left">
															{srcLang === "ja" ? "ステータス" : "Status"}
														</th>
														<th className="border-b px-4 py-2 text-left">{srcLang === "ja" ? "有料" : "Paid"}</th>
													</tr>
												</thead>
												<tbody>
													{aplan.map((data, i) => (
														<tr key={i}>
															{data.plan_info && data.plan_info === "FREE" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "無料版" : "Free Version"}
																</td>
															)}
															{data.plan_info && data.plan_info === "STARTER_MONTHLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "スターター・バージョン" : "Starter Version"}
																</td>
															)}
															{data.plan_info && data.plan_info === "STANDARD_MONTHLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "スタンダード版" : "Standard Version"}
																</td>
															)}
															{data.plan_info && data.plan_info === "ENTERPRISE_MONTHLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "エンタープライズ版" : "Enterprise Version"}
																</td>
															)}
															{data.plan_info && data.plan_info === "STARTER_YEARLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "スターター・バージョン" : "Starter Version"}
																</td>
															)}
															{data.plan_info && data.plan_info === "STANDARD_YEARLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "スタンダード版" : "Standard Version"}
																</td>
															)}
															{data.plan_info && data.plan_info === "ENTERPRISE_YEARLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "エンタープライズ版" : "Enterprise Version"}
																</td>
															)}

															{data.plan_info && data.plan_info === "FREE" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "ジャスト・フォー・マンス" : "Just For Month"}
																</td>
															)}
															{data.plan_info && data.plan_info === "STARTER_MONTHLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "月次ベース" : "Monthly Basis"}
																</td>
															)}
															{data.plan_info && data.plan_info === "STANDARD_MONTHLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "月次ベース" : "Monthly Basis"}
																</td>
															)}
															{data.plan_info && data.plan_info === "ENTERPRISE_MONTHLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "月次ベース" : "Monthly Basis"}
																</td>
															)}
															{data.plan_info && data.plan_info === "STARTER_YEARLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "年間ベース" : "Yearly Basis"}
																</td>
															)}
															{data.plan_info && data.plan_info === "STANDARD_YEARLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "年間ベース" : "Yearly Basis"}
																</td>
															)}
															{data.plan_info && data.plan_info === "ENTERPRISE_YEARLY" && (
																<td className="border-b px-4 py-2 text-sm">
																	{srcLang === "ja" ? "年間ベース" : "Yearly Basis"}
																</td>
															)}
															<td className="border-b px-4 py-2 text-sm">{data.active_plan ? "Active" : "Inactive"}</td>
															<td className="border-b px-4 py-2 text-sm">
																{data.active ? (
																	<i className="fa-solid fa-circle-check text-green-500"></i>
																) : (
																	<i className="fa-solid fa-circle-xmark text-red-500"></i>
																)}
															</td>
														</tr>
													))}
												</tbody>
											</table>
											{/* <div className="my-2 text-center">
										<Button label="Download CSV" btnStyle="sm" />
									</div> */}
										</>
									) : (
										<>
											<p>{srcLang === "ja" ? "データなし" : "No Data"}</p>
										</>
									)}
								</div>
								{/* vpayout */}
								{/* <br />
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

									<>
										<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
											<thead>
												<tr>
													<th className="border-b px-4 py-2 text-left">Total Applicants</th>
													<th className="border-b px-4 py-2 text-left">Amount</th>
													<th className="border-b px-4 py-2 text-left">Date of Payment</th>
													<th className="border-b px-4 py-2 text-left">Paid</th>
												</tr>
											</thead>
											<tbody>
												{vcplan &&
													vcplan.map((data, i) => (
														<tr key={i}>
															<td className="border-b px-4 py-2 text-sm">{data.total_count}</td>

															<td className="border-b px-4 py-2 text-sm">
																¥ {data.total_count >= 1000 ? data.total_count * 100 : data.total_count * 200}
															</td>
															<td className="border-b px-4 py-2 text-sm">Active</td>
															<td className="border-b px-4 py-2 text-sm">
																<i className="fa-solid fa-circle-xmark text-red-500"></i>
															</td>
														</tr>
													))}
												{vplan &&
													vplan.map((data, i) => (
														<tr key={i}>
															<td className="border-b px-4 py-2 text-sm">{data.total_count}</td>

															<td className="border-b px-4 py-2 text-sm">¥ {data.amount}</td>
															<td className="border-b px-4 py-2 text-sm">
																{moment(data.date_of_payment).format("D-MM-YYYY")}
															</td>
															<td className="border-b px-4 py-2 text-sm">
																{data.is_paid ? (
																	<i className="fa-solid fa-circle-check text-green-500"></i>
																) : (
																	<i className="fa-solid fa-circle-xmark text-red-500"></i>
																)}
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</>
								</div> */}
							</div>
						)}
					</div>
				</div>
			</main>

			<Transition.Root show={changePlan} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setchangePlan}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-lg">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">Change Plan</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setchangePlan(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{/* <h3 className="mb-4 text-center text-lg font-bold">
											{srcLang === "ja"
												? "アカウントを削除してもよろしいですか?"
												: "Are you sure want to change/upgrade your account plan?"}
										</h3> */}
										<h1 className="mb-4 text-center text-lg font-semibold">Active Plan Info</h1>
										<div className="flex items-center justify-center gap-2">
											<p>Plan Info : </p>
											{cplan.plan_info && cplan.plan_info === "FREE" && <p>Free Version</p>}
											{cplan.plan_info && cplan.plan_info === "STARTER_MONTHLY" && <p>Starter Version</p>}
											{cplan.plan_info && cplan.plan_info === "STANDARD_MONTHLY" && <p>Standard Version</p>}
											{cplan.plan_info && cplan.plan_info === "ENTERPRISE_MONTHLY" && <p>Enterprise Version</p>}
											{cplan.plan_info && cplan.plan_info === "STARTER_YEARLY" && <p>Starter Version</p>}
											{cplan.plan_info && cplan.plan_info === "STANDARD_YEARLY" && <p>Standard Version</p>}
											{cplan.plan_info && cplan.plan_info === "ENTERPRISE_YEARLY" && <p>Enterprise Version</p>}
										</div>
										<div className="flex items-center justify-center gap-2">
											<p>Plan Duration : </p>
											{cplan.plan_info && cplan.plan_info === "FREE" && <p>Just For Month</p>}
											{cplan.plan_info && cplan.plan_info === "STARTER_MONTHLY" && <p>Monthly Basis</p>}
											{cplan.plan_info && cplan.plan_info === "STANDARD_MONTHLY" && <p>Monthly Basis</p>}
											{cplan.plan_info && cplan.plan_info === "ENTERPRISE_MONTHLY" && <p>Monthly Basis</p>}
											{cplan.plan_info && cplan.plan_info === "STARTER_YEARLY" && <p>Yearly Basis</p>}
											{cplan.plan_info && cplan.plan_info === "STANDARD_YEARLY" && <p>Yearly Basis</p>}
											{cplan.plan_info && cplan.plan_info === "ENTERPRISE_YEARLY" && <p>Yearly Basis</p>}
										</div>
										<div className="flex items-center justify-center gap-2">
											<p>Plan Expiry : </p>
											{cplan.expire && (
												<p>
													{moment(cplan.expire).format("D-MM-YYYY")}&nbsp;(
													{moment(cplan.expire).diff(moment(), "days") <= 0
														? "0"
														: moment(cplan.expire).diff(moment(), "days")}
													&nbsp;days left)
												</p>
											)}
										</div>

										<div className="flex flex-wrap justify-center">
											<div className="my-1 mr-4 last:mr-0">
												<Button
													btnStyle="gray"
													label={"Close"}
													btnType="button"
													handleClick={() => setchangePlan(false)}
												/>
											</div>
											<div className="my-1 mr-4 last:mr-0">
												<Button label={"Change Plan"} btnType="button" onClick={redirectToStripe(selectedPlanId)} />
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={billingInfo2} as={Fragment}>
				<Dialog as="div" className="relative z-[1000]" initialFocus={cancelButtonRef} onClose={setbillingInfo2}>
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
								{/* {bilingData && bilingData.length <= 0 ? ( */}
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all sm:my-8 sm:max-w-lg">
									<div className="flex items-center justify-between px-8 py-6">
										<h4 className="text-lg font-semibold leading-none">Billing Information</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setbillingInfo2(false)}
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
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={changePlan2} as={Fragment}>
				<Dialog as="div" className="relative z-[1000]" initialFocus={cancelButtonRef} onClose={setchangePlan2}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all sm:my-8 sm:max-w-lg">
									<div className="flex items-center justify-between px-8 py-6">
										<h4 className="text-lg font-semibold leading-none">Direct Payment</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setchangePlan2(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="w-full p-8 pt-4 font-normal">
										{step === 1 && (
											<>
												{path && path.length > 0 ? (
													<>
														<div
															className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-normal border-2 border-dashed py-2 last:mb-0"
															onClick={() => {
																window.open(path, "_blank");
															}}
														>
															Invoice Download Here
														</div>
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
																			alt="Payment Proof"
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
																Click here if you read the agreement terms and submit your filled details for the
																Somhako.
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
												) : (
													<div className="mb-4 flex w-full items-center justify-center rounded-normal border-2 border-dashed py-2 last:mb-0">
														Invoice Generating...
													</div>
												)}
											</>
										)}
										{step === 3 && (
											<>
												<div className="mb-4 flex w-full items-center justify-center rounded-normal border-2 border-dashed py-2 last:mb-0">
													You already submit your payment proof
												</div>
												<div className="mb-4 flex w-full items-center justify-center rounded-normal border-2 border-dashed py-2 last:mb-0">
													We taking 2 or 3 Working Days For Activate Your Plan
												</div>
												<div className="mb-4 last:mb-0">
													<Button label={"Close"} btnType={"button"} handleClick={() => setchangePlan2(false)} />
												</div>
											</>
										)}
									</div>
								</Dialog.Panel>
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
