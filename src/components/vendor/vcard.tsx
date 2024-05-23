//@collapse
import { Dialog, Menu, Switch, Tab, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import FormField from "../FormField";
import Button from "../Button";
import { useLangStore } from "@/utils/code";
import toastcomp from "../toast";
import moment from "moment";
import Button2 from "../Button2";

export default function VCard(props: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const cancelButtonRef = useRef(null);
	const [companyDetails, setCompanyDetails] = useState(false);
	const [rcompanyDetails, setRCompanyDetails] = useState(false);
	const [enabled, setEnabled] = useState(false);
	useEffect(() => {
		if (props.data["verified"] === true && props.data["onboard"] === true && props.data["activate"] === true) {
			setEnabled(true);
		}
	}, [props]);

	const [cname, setcname] = useState("");
	const [email, setemail] = useState("");
	const [aname, setaname] = useState("");
	const [agreement, setagreement] = useState("");
	const [signature, setsignature] = useState("");
	const [file, setfile] = useState(false);
	const [asdate, setasdate] = useState("");
	const [aedate, setaedate] = useState("");

	const axiosInstanceAuth2 = props.axiosInstanceAuth2;

	async function loadVendorRegData(vid: string) {
		await axiosInstanceAuth2
			.get(`/vendors/vendor_data2/${vid}/`)
			.then(async (res: any) => {
				if (res.data.length > 0) {
					setemail(res.data[0]["email"]);
					setcname(res.data[0]["vendor"]["company_name"]);
					setaname(res.data[0]["vendor"]["agent_name"]);
					setagreement(res.data[0]["vendor"]["agreement"]);
					setsignature(res.data[0]["signature"]);
					setasdate(res.data[0]["vendor"]["agreement_valid_start_date"]);
					setaedate(res.data[0]["vendor"]["agreement_valid_end_date"]);
				} else {
					setemail("");
					setcname("");
					setaname("");
					setagreement("");
					setsignature("");
					setasdate("");
					setaedate("");
				}
			})
			.catch((err: any) => {
				console.log("!", err);
				setemail("");
				setcname("");
				setaname("");
				setagreement("");
				setasdate("");
				setaedate("");
				setcurrentvid();
			});
	}

	useEffect(() => {
		console.log("!", companyDetails);
		if (companyDetails || rcompanyDetails) {
			loadVendorRegData(props.data["vrefid"]);
		}
	}, [companyDetails,rcompanyDetails]);

	const [accountDelete, setAccountDelete] = useState(false);
	const [jobFunction1, setjobFunction1] = useState(false);
	const [jobData, setjobData] = useState([]);
	const [currentvid, setcurrentvid] = useState();

	const [checkedCheckboxes, setCheckedCheckboxes] = useState({});
	const [bchecked, setBChecked] = useState({});

	const handleCheckboxChange = (checkboxId) => {
		setCheckedCheckboxes((prevCheckedCheckboxes) => ({
			...prevCheckedCheckboxes,
			[checkboxId]: !prevCheckedCheckboxes[checkboxId]
		}));
		console.log("@!!", "check", checkedCheckboxes);
	};

	async function loadActiveJobs(vid: string) {
		await axiosInstanceAuth2
			.get(`/vendors/vendor_data2/${vid}/`)
			.then(async (res: any) => {
				if (res.data.length > 0) {
					console.log("@@@", "loadActiveJobs step1 vendor ID", res.data[0]["vendor"]["id"]);
					setcurrentvid(res.data[0]["vendor"]["id"]);
					var vvid = res.data[0]["vendor"]["id"];
					await axiosInstanceAuth2
						.get(`/job/active-list-job/`)
						.then(async (res: any) => {
							console.log("@@@", "loadActiveJobs step2 jobs", res.data);
							setjobData(res.data);
							const jobs = res.data;
							var checkedState = {};
							for (let i = 0; i < jobs.length; i++) {
								if (jobs[i]["vendor"].includes(vvid)) {
									checkedState[jobs[i]["refid"]] = true;
								} else {
									checkedState[jobs[i]["refid"]] = false;
								}
							}
							console.log("@!!", "loadActiveJobs before check", checkedState);
							setCheckedCheckboxes(checkedState);
							setBChecked(checkedState);
						})
						.catch((err: any) => {
							console.log("@@@", "loadActiveJobs step2 jobs", err);
							setjobData([]);
							setcurrentvid(null);
						});
				} else {
					setcurrentvid(null);
					setjobData([]);
				}
			})
			.catch((err: any) => {
				console.log("@@@", "loadActiveJobs step1 vendor", err);
				setjobData([]);
				setcurrentvid(null);
			});
	}

	useEffect(() => {
		setCheckedCheckboxes({});
		setBChecked({});
		if (jobFunction1 === true) {
			loadActiveJobs(props.data["vrefid"]);
		}
	}, [jobFunction1]);

	async function saveJobsVendor() {
		console.log("@!!", "before", bchecked);
		console.log("@!!", "new", checkedCheckboxes);

		const differingPairs = Object.keys(bchecked)
			.filter((key) => bchecked[key] !== checkedCheckboxes[key])
			.map((key) => ({ key, value: checkedCheckboxes[key] }));

		console.log("@!!", "new after", differingPairs);

		const trueValuesKeys = differingPairs.filter((item) => item.value === true).map((item) => item.key);
		const falseValuesKeys = differingPairs.filter((item) => item.value === false).map((item) => item.key);

		console.log("@!!", "new after true", trueValuesKeys);
		console.log("@!!", "new after false", falseValuesKeys);

		if (trueValuesKeys.length > 0 || falseValuesKeys.length > 0) {
			const fd = new FormData();
			fd.append("trueValuesKeys", trueValuesKeys.join());
			fd.append("falseValuesKeys", falseValuesKeys.join());
			await axiosInstanceAuth2
				.post(`/job/active-vendors-change/${currentvid}/`, fd)
				.then(async (res: any) => {
					console.log("@!!", "active-vendors-change", res.data);
					setjobFunction1(false);
					toastcomp("vendors job updated successfully", "success");
				})
				.catch((err: any) => {
					console.log("@!!", "active-vendors-change", err);
					setjobFunction1(false);
					toastcomp("vendors job updated unsuccessfully", "error");
				});
		} else {
			setjobFunction1(false);
			toastcomp("vendors job can't found any change", "success");
		}
	}

	//renew
	const [ragreement, setragreement] = useState<File | null>(null);
	const [rfile, setrfile] = useState(false);
	const [rasdate, setrasdate] = useState("");
	const [raedate, setraedate] = useState("");

	useEffect(()=>{
		if(rcompanyDetails){
			setragreement(null)
			setrfile(false)
			setrasdate("")
			setraedate("")
		}
	},[rcompanyDetails])

	function checkFormNewVendor() {
		return (
			rasdate.length > 0 &&
			raedate.length > 0 &&
			rfile
		);
	}

	function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files && event.target.files[0];
			setragreement(file);
			setrfile(true);
		}
	}

	
	async function addAgreement() {
		var formData = new FormData();
		formData.append("agreement", ragreement);
		formData.append("agreement_valid_start_date", rasdate);
		formData.append("agreement_valid_end_date", raedate);
		await axiosInstanceAuth2
			.put(`/vendors/renewvendor-update/${props.data["vrefid"]}/`, formData)
			.then(async (res) => {
				toastcomp("Agreement Renewed", "success");
				props.loadVendors();
				setRCompanyDetails(false)
				setragreement(null)
			setrfile(false)
			setrasdate("")
			setraedate("")
			})
			.catch((err) => {
				toastcomp("Agreement not Renewed", "error");
				setRCompanyDetails(false);
				console.log(err);
				setragreement(null);
				setrfile(false);
				setrasdate("");
				setraedate("");
			});
	}

	return (
		<>
			{props.fvendor ? (
				props.data["verified"] === true &&
				props.data["onboard"] === true && (
					<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]">
						<div className="h-full rounded-normal bg-lightBlue p-4 shadow-lg dark:bg-gray-700">
							<div className="mb-2 flex items-start justify-between">
								<h4 className="my-1 mr-2 text-lg font-semibold">{props.data["company_name"]}</h4>
								<div className="flex items-center gap-2">
									<div
										className="cursor-pointer text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-300"
										onClick={() => setjobFunction1(true)}
									>
										<i className="fa-solid fa-square-plus"></i>
									</div>
									<div
										className="cursor-pointer text-red-400 hover:text-red-500"
										onClick={() => setAccountDelete(true)}
									>
										<i className="fa-solid fa-trash"></i>
									</div>
								</div>
							</div>
							<p className="font-semibold text-darkGray dark:text-gray-300">{props.data["agent_name"]}</p>
							<p className="mb-4 text-sm text-darkGray dark:text-gray-300">{props.data["email"]}</p>
							<div className="flex items-center justify-between">
								{moment().isAfter(moment(props.data["agreement_valid_end_date"])) ? (
									<>
										<Button2
											btnStyle="outlined"
											label={srcLang === "ja" ? "詳細" : "Renew Contract"}
											btnType="button"
											handleClick={() => setRCompanyDetails(true)}
											small
										/>
									</>
								) : (
									<>
										<Switch
											checked={enabled}
											onChange={(e) => {
												props.activateVendor(props.data["vrefid"], !enabled);
												setEnabled(!enabled);
											}}
											className={`${
												enabled ? "bg-green-500" : "bg-gray-400"
											} relative inline-flex h-5 w-10 items-center rounded-full`}
										>
											<span className="sr-only">Enable notifications</span>
											<span
												className={`${
													enabled ? "translate-x-6" : "translate-x-1"
												} inline-block h-3 w-3 transform rounded-full bg-white transition`}
											/>
										</Switch>
									</>
								)}

								<Button2
									small
									label={srcLang === "ja" ? "詳細" : "Company Details"}
									btnType="button"
									handleClick={() => setCompanyDetails(true)}
									
								/>
							</div>
						</div>
					</div>
				)
			) : (
				<>
					{props.data["verified"] === true && props.data["onboard"] === false && (
						<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]">
							<div className="h-full rounded-normal bg-lightBlue p-4 shadow-lg dark:bg-gray-700">
								<div className="mb-2 flex items-start justify-between">
									<h4 className="my-1 mr-2 text-lg font-semibold">{props.data["company_name"]}</h4>
									<Menu as="div" className="relative">
										<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
											<i className="fa-solid fa-ellipsis-vertical"></i>
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
													"absolute right-0 top-[100%] w-[200px] rounded bg-white py-1 text-darkGray shadow-normal dark:bg-gray-700 dark:text-gray-400"
												}
											>
												<Menu.Item>
													<button
														type="button"
														className="relative flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
														onClick={() => setCompanyDetails(true)}
													>
														<i className="fa-solid fa-building mr-2"></i>{" "}
														{srcLang === "ja" ? "詳細" : "Company Details"}
													</button>
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
								</div>
								<p className="font-semibold text-darkGray dark:text-gray-300">{props.data["agent_name"]}</p>
								<p className="mb-4 text-sm text-darkGray dark:text-gray-300">{props.data["email"]}</p>
								<div className="flex items-center justify-between">
									<p className="flex items-center text-sm text-darkGray dark:text-gray-400">
										<i className="fa-solid fa-circle-check mr-2 text-green-500"></i>
										Verified
									</p>
									<Button
										btnStyle="sm"
										label={srcLang === "ja" ? "登録" : "On Board"}
										btnType={"button"}
										handleClick={(e: any) => props.onBoardVendor(props.data["vrefid"])}
									/>
								</div>
							</div>
						</div>
					)}

					{props.data["verified"] === false && props.data["onboard"] === false && (
						<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]">
							<div className="h-full rounded-normal bg-lightBlue p-4 shadow-lg dark:bg-gray-700">
								<div className="mb-2 flex items-start justify-between">
									<h4 className="my-1 mr-2 text-lg font-semibold">{props.data["company_name"]}</h4>
								</div>
								<p className="font-semibold text-darkGray dark:text-gray-300">{props.data["agent_name"]}</p>
								<p className="mb-4 text-sm text-darkGray dark:text-gray-300">{props.data["email"]}</p>
								<div className="flex items-center justify-between">
									<p className="flex items-center text-sm text-darkGray dark:text-gray-400">
										<i className="fa-solid fa-clock mr-2"></i>
										Pending
									</p>
									<Button btnStyle="sm" label={srcLang === "ja" ? "登録" : "On Board"} disabled />
								</div>
							</div>
						</div>
					)}
				</>
			)}

			<Transition.Root show={companyDetails} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setCompanyDetails}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "詳細" : "Company Details"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setCompanyDetails(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<FormField
											label={srcLang === "ja" ? "メールアドレス" : "Email"}
											fieldType="input"
											inputType="email"
											required
											value={email}
											readOnly
										/>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={srcLang === "ja" ? "会社名" : "Company Name"}
													fieldType="input"
													inputType="text"
													value={cname}
													readOnly
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={srcLang === "ja" ? "担当エージェント" : "Agent Name"}
													fieldType="input"
													inputType="text"
													value={aname}
													readOnly
												/>
											</div>
										</div>

										<div className="-mx-3 flex flex-wrap items-start">
											<div className="mb-4 flex w-full px-3 md:max-w-[50%]">
												<div className="w-[50%] ">
													<h6 className="mb-1 font-bold">{srcLang === "ja" ? "契約書" : "Agreement"}</h6>
													<div className="group my-2 flex">
														<div className="">
															<i className="fa-solid fa-file-pdf text-[40px] text-red-500"></i>
															{/* <i className="fa-solid fa-file-word text-[40px] text-indigo-800"></i> */}
														</div>
														<div className="flex grow items-center pl-4">
															{/* <span className="flex grow cursor-pointer items-center pr-3 text-[12px] group-hover:underline">
																
																{agreement.split("/").pop()}
															</span> */}
															<Button
																label={srcLang === "ja" ? "みる" : "View"}
																btnStyle="sm"
																btnType="button"
																handleClick={() => {
																	window.open(agreement, "_blank");
																}}
															/>
														</div>
													</div>
												</div>
												<div className="w-[50%]">
													<h6 className="mb-1 font-bold">{srcLang === "ja" ? "契約書" : "signature"}</h6>
													<div className="group my-2 flex">
														<div className="">
															<i className="fa-solid fa-signature text-[40px] text-red-500"></i>
															{/* <i className="fa-solid fa-file-word text-[40px] text-indigo-800"></i> */}
														</div>
														<div className="flex grow items-center pl-4">
															{/* <span className="flex grow cursor-pointer items-center pr-3 text-[12px] group-hover:underline">
																{agreement.split("/").pop()}
															</span> */}
															<Button
																label={srcLang === "ja" ? "みる" : "View"}
																btnStyle="sm"
																btnType="button"
																handleClick={() => {
																	window.open(signature, "_blank");
																}}
															/>
														</div>
													</div>
												</div>
											</div>
											<div className="mb-4 flex w-full flex-wrap px-3 md:max-w-[50%]">
												{/* <h6 className="mb-1 w-full font-bold">Agreement Validity</h6> */}
												<div className="w-full pr-2 md:max-w-[50%]">
													<FormField
														label={srcLang === "ja" ? "開始日" : "Start Date"}
														fieldType="input"
														inputType="date"
														value={asdate}
														readOnly
													/>
												</div>
												<div className="w-full pl-2 md:max-w-[50%]">
													<FormField
														label={srcLang === "ja" ? "終了日" : "End Date"}
														fieldType="input"
														inputType="date"
														value={aedate}
														readOnly
													/>
												</div>
											</div>
										</div>
										<Button
											label={srcLang === "ja" ? "近い" : "Close"}
											btnType="button"
											handleClick={() => setCompanyDetails(false)}
										/>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={rcompanyDetails} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setRCompanyDetails}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "詳細" : "Company Details"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setRCompanyDetails(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="-mx-3 flex flex-wrap items-start">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<h6 className="mb-1 font-bold">
													{"Re-New Agreement"}
													<sup className="text-red-500">*</sup>
												</h6>
												{!rfile ? (
													<div className="relative min-h-[45px] w-full rounded-normal border border-borderColor p-3 pr-9 text-sm focus:bg-red-500 dark:border-gray-600 dark:bg-gray-700">
														<input
															type="file"
															className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
															accept=".pdf,.doc,.docx"
															onChange={handleFileInputChange}
														/>
														<span className="absolute right-3 top-[12px] text-lightGray">
															<i className="fa-solid fa-paperclip"></i>
														</span>
														<span className="absolute left-5 top-[12px] text-darkGray dark:text-gray-400">
															Pdf, Docx etc...
														</span>
													</div>
												) : (
													<div className="my-2 flex">
														<div className="">
															{ragreement.type === "application/pdf" && (
																<i className="fa-solid fa-file-pdf text-[50px] text-red-500"></i>
															)}
															{ragreement.type === "application/msword" ||
																(ragreement.type ===
																	"application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
																	<i className="fa-solid fa-file-word text-[50px] text-indigo-800"></i>
																))}
														</div>
														<div className="my-auto flex grow flex-col pl-4">
															<div className="flex items-center justify-between text-base">
																<span className="flex w-full items-center">
																	<small className="clamp_1 mr-2">{ragreement.name && ragreement.name}</small>(
																	{ragreement.size && <>{(ragreement.size / (1024 * 1024)).toFixed(2)} MB</>})
																</span>
																<aside className="ml-2 flex gap-0.5">
																	<button
																		type="button"
																		className="hover:text-underline text-primary"
																		title="View"
																		onClick={() => {
																			if (ragreement) {
																				const fileUrl = URL.createObjectURL(ragreement);
																				window.open(fileUrl, "_blank");
																			}
																		}}
																	>
																		<i className="fa-solid fa-eye"></i>
																	</button>
																	<button
																		type="button"
																		className="hover:text-underline ml-4 text-red-500"
																		title="Delete"
																		onClick={() => {
																			setrfile(false);
																			setragreement(null);
																		}}
																	>
																		<i className="fa-solid fa-trash"></i>
																	</button>
																</aside>
															</div>
															{/* <div className="relative pt-4">
																<div className="relative h-2 w-full overflow-hidden rounded border bg-gray-100">
																	<span
																		className="absolute left-0 top-0 h-full w-full bg-primary transition-all"
																		style={{ width: "99%" }}
																	></span>
																</div>
															</div> */}
														</div>
													</div>
												)}
											</div>
											<div className="flex w-full flex-wrap px-3 md:max-w-[50%]">
												{/* <h6 className="mb-1 w-full font-bold">Agreement Validity</h6> */}
												<div className="mb-4 w-full pr-2 md:max-w-[50%]">
													<FormField
														label={"New start date"}
														fieldType="input"
														inputType="date"
														value={rasdate}
														handleChange={(e) => {
															setrasdate(e.target.value);
														}}
														required
													/>
												</div>
												<div className="mb-4 w-full md:max-w-[50%] md:pl-2">
													<FormField
														label={"New end date"}
														fieldType="input"
														inputType="date"
														value={raedate}
														handleChange={(e) => setraedate(e.target.value)}
														required
													/>
												</div>
											</div>
										</div>
										<div className="flex w-full justify-between">
											<Button
												label={srcLang === "ja" ? "契約書を送付" : "Renew Agreement"}
												btnType="button"
												handleClick={addAgreement}
												disabled={!checkFormNewVendor()}
											/>
											<Button
												label={srcLang === "ja" ? "近い" : "Close"}
												btnType="button"
												handleClick={() => setRCompanyDetails(false)}
											/>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={accountDelete} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAccountDelete}>
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
										<h4 className="flex items-center font-semibold leading-none">
											Are you sure to delete This Agent/Vendor
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAccountDelete(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<h3 className="mb-4 text-center text-lg font-bold">
											{srcLang === "ja"
												? "アカウントを削除してもよろしいですか?"
												: "Are you sure want to delete this vendor ?"}
										</h3>
										<div className="flex flex-wrap justify-center">
											<div className="my-1 mr-4 last:mr-0">
												<Button
													btnStyle="gray"
													label={"No"}
													btnType="button"
													handleClick={() => setAccountDelete(false)}
												/>
											</div>
											<div className="my-1 mr-4 last:mr-0">
												<Button
													btnStyle="danger"
													label={"Yes"}
													btnType="button"
													handleClick={() => {
														props.delAccount(props.data["vrefid"]).then(() => setAccountDelete(false));
													}}
												/>
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={jobFunction1} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setjobFunction1}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">Jobs for Agent</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setjobFunction1(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="three overflow-x-auto">
											{jobData && jobData.length > 0 ? (
												<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
													<thead>
														<tr>
															<th className="border-b px-3 py-2 text-left">Job Title</th>
															<th className="border-b px-3 py-2 text-left">Refid</th>
															<th className="border-b px-3 py-2 text-left">Access</th>
														</tr>
													</thead>
													<tbody>
														{jobData.map((data, i) => (
															<tr key={i} className="">
																<td className={`border-b px-3 py-2 text-sm`}>{data["jobTitle"]}</td>
																<td className={`border-b px-3 py-2 text-sm`}>{data["refid"]}</td>
																<td className={`border-b px-3 py-2 text-sm`}>
																	<Switch
																		checked={checkedCheckboxes[data.refid] || false}
																		onChange={() => handleCheckboxChange(data.refid)}
																		className={`${
																			checkedCheckboxes[data.refid] ? "bg-green-500" : "bg-gray-400"
																		} relative inline-flex h-5 w-10 items-center rounded-full`}
																	>
																		<span className="sr-only"></span>
																		<span
																			className={`${
																				checkedCheckboxes[data.refid] ? "translate-x-6" : "translate-x-1"
																			} inline-block h-3 w-3 transform rounded-full bg-white transition`}
																		/>
																	</Switch>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											) : (
												<div>No Job Found</div>
											)}
										</div>

										{/* <div className="mb-4 flex flex-col ">
											{jobData && jobData.length > 0 ? (
												<>
													<div className="mb-2 flex justify-between gap-2 border-b-2 border-borderColor">
														<span>Job Title (refid)</span>
														<span>Active</span>
													</div>
													{jobData.map((data, i) => (
														<div className="mb-1 flex justify-between gap-2" key={i}>
															<span>
																{data["jobTitle"]} ({data["refid"]})
															</span>
															<Switch
																checked={checkedCheckboxes[data.refid] || false}
																onChange={() => handleCheckboxChange(data.refid)}
																className={`${
																	checkedCheckboxes[data.refid] ? "bg-green-500" : "bg-gray-400"
																} relative inline-flex h-5 w-10 items-center rounded-full`}
															>
																<span className="sr-only">Enable notifications</span>
																<span
																	className={`${
																		checkedCheckboxes[data.refid] ? "translate-x-6" : "translate-x-1"
																	} inline-block h-3 w-3 transform rounded-full bg-white transition`}
																/>
															</Switch>
														</div>
													))}
												</>
											) : (
												<>
													<h3>No Jobs</h3>
												</>
											)}
										</div> */}

										<div className="flex flex-wrap justify-center">
											<div className="my-1 mr-4 last:mr-0">
												<Button
													btnStyle="gray"
													label={"Close"}
													btnType="button"
													handleClick={() => setjobFunction1(false)}
												/>
											</div>
											<div className="my-1 mr-4 last:mr-0">
												<Button
													btnStyle="success"
													label={"Save"}
													btnType="button"
													// handleClick={() => {
													// 	props.delAccount(props.data["vrefid"]).then(() => setjobFunction1(false));
													// }}
													handleClick={() => saveJobsVendor()}
												/>
											</div>
										</div>
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
