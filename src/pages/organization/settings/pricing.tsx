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
	const tabHeading_1 = [
		{
			title: t("Form.Monthly")
		},
		{
			title: t("Form.Yearly")
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
	const [step, setstep] = useState(0);
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
			setstep(0);
			setcheck1(false);
			setsign(null);
			setfile(false);
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
						<div className="border-b py-4">
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
									<span>{t("Words.Plans_Pricing")}</span>
								</h2>
							</div>
						</div>
						<div className="mx-auto w-full max-w-[980px] px-4 py-6">
							<div className="mx-auto mb-6 w-full max-w-[800px]">
								<p className="text-center text-sm font-semibold text-darkGray dark:text-gray-400">
									{srcLang === "ja"
										? "規模の大小に関わらず、自動化による生産性の高い採用活動を提供します。"
										: "Whether your time-saving automation needs are large or small, we are here to help you scale."}
								</p>
							</div>
							<Tab.Group>
								<Tab.List className={"mx-auto mb-10 w-full max-w-[800px] text-center"}>
									{tabHeading_1.map((item, i) => (
										<Tab key={i} as={Fragment}>
											{({ selected }) => (
												<button
													className={
														"rounded-full px-4 py-2 text-[12px] font-bold uppercase" +
														" " +
														(selected ? "bg-primary text-white" : "text-darkGray dark:text-gray-400")
													}
												>
													{item.title}
												</button>
											)}
										</Tab>
									))}
								</Tab.List>
								<Tab.Panels>
									<Tab.Panel>
										<div className="mx-auto mb-6 flex w-full max-w-[800px] flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%] lg:max-w-[calc(100%/3)]">
												<div className="rounded-normal bg-white p-4 text-sm text-darkGray dark:bg-gray-600 dark:text-gray-400">
													<div className="mb-10 text-right"></div>
													<h3 className="mb-3 text-xl font-extrabold text-black dark:text-white">
														$19
														<sub className="bottom-0 text-sm text-darkGray dark:text-gray-400">
															{" "}
															/ {srcLang === "ja" ? "1ヵ月" : "month"}
														</sub>
													</h3>
													<h5 className="mb-2 text-lg font-semibold text-black dark:text-white">
														{t("Plans.Starter")}
													</h5>
													<p className="mb-2 text-[12px]">Unleash the power of automation.</p>
													<ul className="mb-[92px]">
														{Array(2).fill(
															<li className="my-3 flex items-center">
																<i className="fa-solid fa-circle-check mr-2"></i>
																Lorem Impsum text editor
															</li>
														)}
													</ul>
													<div className="text-center">
														<Button
															btnStyle="gray"
															label={t("Btn.ChoosePlan")}
															btnType="button"
															full
															handleClick={() => setprice(true)}
														/>
													</div>
												</div>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%] lg:max-w-[calc(100%/3)]">
												<div className="rounded-normal bg-white p-4 text-sm text-darkGray dark:bg-gray-600 dark:text-gray-400">
													<div className="mb-10 text-right"></div>
													<h3 className="mb-3 text-xl font-extrabold text-black dark:text-white">
														$54
														<sub className="bottom-0 text-sm text-darkGray dark:text-gray-400">
															{" "}
															/ {srcLang === "ja" ? "1ヵ月" : "month"}
														</sub>
													</h3>
													<h5 className="mb-2 text-lg font-semibold text-black dark:text-white">
														{t("Plans.Premium")}
													</h5>
													<p className="mb-2 text-[12px]">Advanced tools to take your work to the next level.</p>
													<ul className="mb-10">
														{Array(3).fill(
															<li className="my-3 flex items-center">
																<i className="fa-solid fa-circle-check mr-2"></i>
																Lorem Impsum text editor
															</li>
														)}
													</ul>
													<div className="text-center">
														<Button
															btnStyle="gray"
															label={t("Btn.ChoosePlan")}
															btnType="button"
															full
															handleClick={() => setprice(true)}
														/>
													</div>
												</div>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%] lg:max-w-[calc(100%/3)]">
												<div className="rounded-normal bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-4 text-sm text-white shadow-highlight">
													<div className="mb-4 text-right">
														<span className="rounded-full bg-[#403879] px-4 py-1 text-[10px] font-bold uppercase text-white">
															Most Popular
														</span>
													</div>
													<h3 className="mb-3 text-xl font-extrabold">Book</h3>
													<h5 className="mb-2 text-lg font-semibold">{t("Plans.Enterprise")}</h5>
													<p className="mb-2 text-[12px]">Automation plus enterprise-grade features.</p>
													<ul>
														{Array(4).fill(
															<li className="my-3 flex items-center">
																<i className="fa-solid fa-circle-check mr-2"></i>
																Lorem Impsum text editor
															</li>
														)}
													</ul>
													<div className="text-center">
														<Button
															label={t("Btn.RequestACall")}
															btnType="button"
															full
															handleClick={() => setprice(true)}
														/>
													</div>
												</div>
											</div>
										</div>
										<div>
											<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
												<thead>
													<tr>
														<th className="w-[300px] border-b px-3 py-2"></th>
														<th className="border-b px-3 py-2">{t("Plans.Starter")}</th>
														<th className="border-b px-3 py-2">{t("Plans.Premium")}</th>
														<th className="border-b px-3 py-2">{t("Plans.Enterprise")}</th>
													</tr>
												</thead>
												<tbody className="text-sm font-semibold">
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Members
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center">1</td>
														<td className="px-3 py-2 text-center">Up to 3</td>
														<td className="px-3 py-2 text-center">Unlimited</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Workspace roles
															<span className="ml-2 inline-block rounded-full border border-darkGray px-1 text-[10px] leading-normal text-darkGray dark:bg-gray-200">
																soon
															</span>
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center">Lorem</td>
														<td className="px-3 py-2 text-center">Lorem</td>
														<td className="px-3 py-2 text-center">Lorem</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Guests
															<span className="ml-2 inline-block rounded-full border border-darkGray px-1 text-[10px] leading-normal text-darkGray dark:bg-gray-200">
																soon
															</span>
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Live Collaboration
															<span className="ml-2 inline-block rounded-full border border-darkGray px-1 text-[10px] leading-normal text-darkGray dark:bg-gray-200">
																soon
															</span>
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Integration of sub-brands
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Access to standard templates
															<Menu as="div" className="relative inline-block">
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
															</Menu>
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
															Access to pro templates
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Custom designed templates
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Asset library
															<Menu as="div" className="relative inline-block">
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
															</Menu>
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
									</Tab.Panel>
									<Tab.Panel>
										<div className="mx-auto mb-6 flex w-full max-w-[800px] flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%] lg:max-w-[calc(100%/3)]">
												<div className="rounded-normal bg-white p-4 text-sm text-darkGray dark:bg-gray-600 dark:text-gray-400">
													<div className="mb-10 text-right"></div>
													<h3 className="mb-3 text-xl font-extrabold text-black dark:text-white">
														$229
														<sub className="bottom-0 text-sm text-darkGray dark:text-gray-400">
															{" "}
															/ {srcLang === "ja" ? "1年" : "yearly"}
														</sub>
													</h3>
													<h5 className="mb-2 text-lg font-semibold text-black dark:text-white">
														{t("Plans.Starter")}
													</h5>
													<p className="mb-2 text-[12px]">Unleash the power of automation.</p>
													<ul className="mb-[92px]">
														{Array(2).fill(
															<li className="my-3 flex items-center">
																<i className="fa-solid fa-circle-check mr-2"></i>
																Lorem Impsum text editor
															</li>
														)}
													</ul>
													<div className="text-center">
														<Button btnStyle="gray" label={t("Btn.ChoosePlan")} full />
													</div>
												</div>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%] lg:max-w-[calc(100%/3)]">
												<div className="rounded-normal bg-white p-4 text-sm text-darkGray dark:bg-gray-600 dark:text-gray-400">
													<div className="mb-10 text-right"></div>
													<h3 className="mb-3 text-xl font-extrabold text-black dark:text-white">
														$454
														<sub className="bottom-0 text-sm text-darkGray dark:text-gray-400">
															{" "}
															/ {srcLang === "ja" ? "1年" : "yearly"}
														</sub>
													</h3>
													<h5 className="mb-2 text-lg font-semibold text-black dark:text-white">
														{t("Plans.Premium")}
													</h5>
													<p className="mb-2 text-[12px]">Advanced tools to take your work to the next level.</p>
													<ul className="mb-10">
														{Array(3).fill(
															<li className="my-3 flex items-center">
																<i className="fa-solid fa-circle-check mr-2"></i>
																Lorem Impsum text editor
															</li>
														)}
													</ul>
													<div className="text-center">
														<Button btnStyle="gray" label={t("Btn.ChoosePlan")} full />
													</div>
												</div>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%] lg:max-w-[calc(100%/3)]">
												<div className="rounded-normal bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-4 text-sm text-white shadow-highlight">
													<div className="mb-4 text-right">
														<span className="rounded-full bg-[#403879] px-4 py-1 text-[10px] font-bold uppercase text-white">
															Most Popular
														</span>
													</div>
													<h3 className="mb-3 text-xl font-extrabold">Book</h3>
													<h5 className="mb-2 text-lg font-semibold">{t("Plans.Enterprise")}</h5>
													<p className="mb-2 text-[12px]">Automation plus enterprise-grade features.</p>
													<ul>
														{Array(4).fill(
															<li className="my-3 flex items-center">
																<i className="fa-solid fa-circle-check mr-2"></i>
																Lorem Impsum text editor
															</li>
														)}
													</ul>
													<div className="text-center">
														<Button label={t("Btn.RequestACall")} full />
													</div>
												</div>
											</div>
										</div>
										<div>
											<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
												<thead>
													<tr>
														<th className="w-[300px] border-b px-3 py-2"></th>
														<th className="border-b px-3 py-2">{t("Plans.Starter")}</th>
														<th className="border-b px-3 py-2">{t("Plans.Premium")}</th>
														<th className="border-b px-3 py-2">{t("Plans.Enterprise")}</th>
													</tr>
												</thead>
												<tbody className="text-sm font-semibold">
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Members
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center">1</td>
														<td className="px-3 py-2 text-center">Up to 3</td>
														<td className="px-3 py-2 text-center">Unlimited</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Workspace roles
															<span className="ml-2 inline-block rounded-full border border-darkGray px-1 text-[10px] leading-normal text-darkGray dark:bg-gray-200">
																soon
															</span>
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center">Lorem</td>
														<td className="px-3 py-2 text-center">Lorem</td>
														<td className="px-3 py-2 text-center">Lorem</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Guests
															<span className="ml-2 inline-block rounded-full border border-darkGray px-1 text-[10px] leading-normal text-darkGray dark:bg-gray-200">
																soon
															</span>
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Live Collaboration
															<span className="ml-2 inline-block rounded-full border border-darkGray px-1 text-[10px] leading-normal text-darkGray dark:bg-gray-200">
																soon
															</span>
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Integration of sub-brands
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Access to standard templates
															<Menu as="div" className="relative inline-block">
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
															</Menu>
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
															Access to pro templates
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Custom designed templates
															<Menu as="div" className="relative inline-block">
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
															</Menu>
														</td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center"></td>
														<td className="px-3 py-2 text-center">
															<i className="fa-solid fa-check"></i>
														</td>
													</tr>
													<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
														<td className="w-[300px] px-3 py-2">
															Asset library
															<Menu as="div" className="relative inline-block">
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
															</Menu>
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
									</Tab.Panel>
								</Tab.Panels>
							</Tab.Group>
						</div>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all sm:my-8 sm:max-w-lg">
									<div className="flex items-center justify-between px-8 py-6">
										<h4 className="text-lg font-semibold leading-none">
											{step === 0 && "Select Payment Method"}
											{step === 1 && "Direct Payment Option"}
											{step === 2 && "Online Payment Option"}
										</h4>
										<button type="button" className="leading-none hover:text-gray-700" onClick={() => setprice(false)}>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="w-full p-8 pt-4 font-normal">
										{step === 0 && (
											<div className="mx-[-10px] flex flex-wrap">
												<div className="mb-4 w-full px-[10px] md:max-w-[50%]">
													<Button label={"Direct Pay"} btnType="button" full handleClick={() => setstep(1)} />
												</div>
												<div className="mb-4 w-full px-[10px] md:max-w-[50%]">
													<Button label={"Online Pay"} btnType="button" full handleClick={() => setstep(2)} />
												</div>
											</div>
										)}
										{step === 1 && (
											<>
												<div className="mb-4 flex w-full items-center justify-center rounded-normal border-2 border-dashed py-2 last:mb-0">
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
													<Button label={"Submit"} btnType={"button"} handleClick={regVendor} disabled={!checkForm()} />
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

										{/* 
										<div className="mb-4 last:mb-0">
											<div>
												<label htmlFor={`field_cname`} className="mb-1 inline-block text-sm font-light">
													Company Name&nbsp;<span className="text-xs text-gray-500">(Corporate Information)</span>&nbsp;
													<sup className="text-red-500">*</sup>
												</label>
												<input
													type="text"
													id="cname"
													className={`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm`}
													value={cname}
													onChange={(e) => setcname(e.target.value)}
												/>
											</div>
										</div>
										<div className="mb-4 last:mb-0">
											<div>
												<label htmlFor={`field_email`} className="mb-1 inline-block text-sm font-light">
													Email Address&nbsp;<span className="text-xs text-gray-500">(Corporate Information)</span>
													&nbsp;
													<sup className="text-red-500">*</sup>
												</label>
												<input
													type="email"
													id="email"
													className={`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm`}
													value={email}
													onChange={(e) => setemail(e.target.value)}
												/>
												<label htmlFor={`field_email`} className="my-1 inline-block text-xs font-light text-gray-500">
													We do not accept free email addresses, including Gmail, Yahoo! Mail, and cell phone email
													addresses.
												</label>
											</div>
										</div>
										<div className="mb-4 last:mb-0">
											<div>
												<label htmlFor={`field_contact`} className="mb-1 inline-block text-sm font-light">
													Telephone Number&nbsp;
													<sup className="text-red-500">*</sup>
												</label>
												<input
													type="text"
													id="contact"
													className={`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm`}
													value={contact}
													onChange={(e) => setcontact(e.target.value)}
												/>
											</div>
										</div>
										<div className="mb-4 last:mb-0">
											<div>
												<label htmlFor={`field_address`} className="mb-1 inline-block text-sm font-light">
													Address&nbsp;
													<sup className="text-red-500">*</sup>
												</label>
												<input
													type="text"
													id="address"
													className={`min-h-[45px] w-full rounded-normal border border-borderColor p-3 text-sm`}
													value={address}
													onChange={(e) => setaddress(e.target.value)}
												/>
											</div>
										</div>
										<div className="mb-4 last:mb-0">
											<div>
												<label htmlFor={`field_ctype`} className="mb-2 inline-block text-sm font-light">
													Company Type
												</label>

												<div className="flex flex-wrap justify-center gap-4">
													{checkboxes.map((checkbox, i) => (
														<div className="flex flex-nowrap gap-2 text-xs" key={i}>
															<input
																type="checkbox"
																value={checkbox}
																checked={selectedCheckbox === checkbox}
																onChange={() => handleCheckboxChange(checkbox)}
															/>
															{checkbox}
														</div>
													))}
												</div>
											</div>
										</div>
										<div className="mb-4 last:mb-0">
											<label htmlFor={`field_address`} className="mb-1 inline-block text-sm font-light">
												Handling of personal information (Privacy Policy)
											</label>
											<div className="justfy-start my-1 flex items-center text-sm">
												<input
													type="checkbox"
													id="agreeWithAgreement"
													className="mr-2"
													checked={check1}
													onChange={(e) => setcheck1(e.target.checked)}
												/>
												<span>Agree</span>
												<sup className="text-red-500">*</sup>
											</div>
										</div>
										<div>
											<button
												className="transform rounded-normal bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-3 text-xs tracking-wide text-white shadow-lg transition-all duration-500 ease-in-out hover:scale-110 hover:animate-pulse hover:from-blue-600 hover:to-blue-800 hover:brightness-110 active:animate-bounce disabled:from-slate-200 disabled:to-slate-200 disabled:text-gray-500"
												disabled={!disBtn()}
												onClick={() => submit()}
											>
												Request for materials
											</button>
										</div> */}
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
