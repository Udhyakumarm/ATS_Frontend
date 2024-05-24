//@collapse
import { Dialog, Menu, Switch, Tab, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import FormField from "../FormField";
import Button from "../Button";
import { useLangStore } from "@/utils/code";
import toastcomp from "../toast";
import moment from "moment";
import Button2 from "../Button2";

export default function ACard(props: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const cancelButtonRef = useRef(null);
	const [companyDetails, setCompanyDetails] = useState(false);
	const [rcompanyDetails, setRCompanyDetails] = useState(false);
	const [allocationList, setallocationList] = useState(false);
	const [enabled, setEnabled] = useState(false);
	

	const [cname, setcname] = useState("");
	const [email, setemail] = useState("");
	const [aname, setaname] = useState("");
	const [agreement, setagreement] = useState("");
	const [signature, setsignature] = useState("");
	const [file, setfile] = useState(false);
	const [asdate, setasdate] = useState("");
	const [aedate, setaedate] = useState("");

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

	//renew
	const [ragreement, setragreement] = useState<File | null>(null);
	const [rfile, setrfile] = useState(false);
	const [raedate, setraedate] = useState("");

	useEffect(() => {
		if (rcompanyDetails) {
			setragreement(null);
			setrfile(false);
			setraedate("");
		}
	}, [rcompanyDetails]);

	function checkFormNewVendor() {
		return raedate.length > 0 && rfile;
	}

	function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files && event.target.files[0];
			setragreement(file);
			setrfile(true);
		}
	}

	const axiosInstanceAuth2 = props.axiosInstanceAuth2;
	async function addAgreement() {
		var formData = new FormData();
		formData.append("contract", ragreement);
		formData.append("expire", raedate);
		await axiosInstanceAuth2
			.put(`/applicant/update-contract/${props.data["acrefid"]}/`, formData)
			.then(async (res) => {
				toastcomp("Contract Renewed", "success");
				props.loadContracts();
				setRCompanyDetails(false);
				setragreement(null);
				setrfile(false);
				setraedate("");
			})
			.catch((err) => {
				toastcomp("Contract not Renewed", "error");
				setRCompanyDetails(false);
				console.log(err);
				props.loadContracts();
				setRCompanyDetails(false);
				setragreement(null);
				setrfile(false);
				setraedate("");
			});
	}

	const [shareCount, setshareCount] = useState({});

	async function loadShareCount() {
		await axiosInstanceAuth2
			.get(`/applicant/list-contract-share/${props.data["acrefid"]}/`)
			.then(async (res) => {
				console.log("!!!!!!", "list-contract-share", res.data);
				setshareCount(res.data);
			})
			.catch((err) => {
				toastcomp("list contract share", "error");
				setshareCount({ count: 0, all: 0, percentage: 0 });
			});
	}

	const [shareADetail, setshareADetail] = useState({});

	async function loadShareContractDetail() {
		await axiosInstanceAuth2
			.get(`/applicant/list-contract-share-detail/${props.data["acrefid"]}/`)
			.then(async (res) => {
				console.log("!!!!!!", "list-contract-share-detail", res.data);
				if(res.data.length > 0){

					setshareADetail(res.data[0]);
				}
				else{
					setshareADetail({})
				}
			})
			.catch((err) => {
				toastcomp("list contract share", "error");
				setshareADetail({});
			});
	}

	useEffect(()=>{
		if(props.data && props.data["acrefid"] && props.allocate){
			loadShareCount();
		}
	},[props.data])

	useEffect(()=>{
		if(allocationList){
			setshareADetail([]);
			loadShareContractDetail();
		}
	},[allocationList])

	
	const getColorCode = (number) => {
		// Function to convert an RGB array to a hex color code
		const rgbToHex = (rgb) =>
			"#" + rgb.map((value) => Math.min(255, Math.max(0, value)).toString(16).padStart(2, "0")).join("");

		let colorVariant = [255, 0, 0]; // Default red color

		if (number > 70) {
			const greenValue = Math.round((number - 70) * 5.1); // Map 70-100 to 0-255
			colorVariant = [255 - greenValue, 255, 0]; // Bright green variant
		} else if (number > 50) {
			const yellowValue = Math.round((number - 50) * 5.1); // Map 50-70 to 0-255
			colorVariant = [255, 255 - yellowValue, 0]; // Yellow variant
		} else {
			// const redValue = Math.round((75 - number) * 5.1); // Map 0-50 to 0-255
			const redValue = Math.round((number - 0) * 5.1); // Map 0-40 to 0-255
			colorVariant = [255, 255 - redValue, 0]; // Yellow variant
		}

		// Convert the RGB array to a hex color code
		const hexColor = rgbToHex(colorVariant);
		return hexColor;
	};


	function hexToRgb(hex) {
		// Remove # if present
		hex = hex.replace(/^#/, "");

		// Parse hex values to RGB
		var bigint = parseInt(hex, 16);
		var r = (bigint >> 16) & 255;
		var g = (bigint >> 8) & 255;
		var b = bigint & 255;

		return { r: r, g: g, b: b };
	}

	function rgbaFromHex(hex, opacity) {
		var rgb = hexToRgb(hex);
		return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + opacity + ")";
	}

	return (
		<>
			{props.allocate ? (
				<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]">
					<div className="relative h-full rounded-normal bg-lightBlue p-4 shadow-lg dark:bg-gray-700">
						<div className="mb-2">
							<h4 className="my-1 mr-2 text-lg font-semibold">{props.data["cname"]}</h4>
						</div>
						<p className="mb-4 text-sm text-darkGray dark:text-gray-300">{props.data["email"]}</p>
						{shareCount && (
							<div className="flex items-center justify-between">
								<Button2
									small
									label={srcLang === "ja" ? "詳細" : "Shared Applications"}
									btnType="button"
									handleClick={() => setallocationList(true)}
									transitionClass="leading-pro ease-soft-in tracking-tight-soft active:opacity-85 transition-all duration-300 hover:scale-105"
								/>
							</div>
						)}

						{shareCount && (
							<div
								className="absolute -left-2 -top-2 h-6 w-6 rounded-full  text-sm text-darkGray dark:text-white"
								style={{
									borderColor: getColorCode(shareCount["percentage"]),
									borderWidth: "0 .05rem .01rem .20rem",
									backgroundColor: rgbaFromHex(getColorCode(shareCount["percentage"]), 0.2)
								}}
							>
								<div className="flex h-full w-full items-center justify-center">{shareCount["count"]}</div>
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]">
					<div className=" h-full rounded-normal bg-lightBlue p-4 shadow-lg dark:bg-gray-700">
						<div className="mb-2 flex items-start justify-between">
							<h4 className="my-1 mr-2 text-lg font-semibold">{props.data["cname"]}</h4>
							<div className="flex items-center gap-2">
								<div className="cursor-pointer text-red-400 hover:text-red-500" onClick={() => setAccountDelete(true)}>
									<i className="fa-solid fa-trash"></i>
								</div>
							</div>
						</div>
						<p className="mb-4 text-sm text-darkGray dark:text-gray-300">{props.data["email"]}</p>
						<div className="flex items-center justify-between">
							{moment().isAfter(moment(props.data["expire"])) && (
								<>
									<Button2
										small
										btnStyle="outlined"
										label={srcLang === "ja" ? "詳細" : "Renew Contract"}
										btnType="button"
										handleClick={() => setRCompanyDetails(true)}
									/>
								</>
							)}

							<Button2
							small
								btnStyle="sm"
								label={srcLang === "ja" ? "詳細" : "Contract Details"}
								btnType="button"
								handleClick={() => setCompanyDetails(true)}
							/>
						</div>
					</div>
				</div>
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
											{srcLang === "ja" ? "詳細" : "Contract Details"}
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
											value={props.data["email"]}
											readOnly
										/>

										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={srcLang === "ja" ? "会社名" : "Company Name"}
													fieldType="input"
													inputType="text"
													value={props.data["cname"]}
													readOnly
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={srcLang === "ja" ? "担当エージェント" : "Contact (Optional)"}
													fieldType="input"
													inputType="text"
													value={props.data["contact"]}
													readOnly
												/>
											</div>
										</div>

										<div className="-mx-3 flex flex-wrap items-start">
											<div className="mb-4 flex w-full px-3 md:max-w-[50%]">
												<div className="w-full">
													<h6 className="mb-1 font-bold">{srcLang === "ja" ? "契約書" : "Contract"}</h6>
													<div className="group my-2 flex">
														<div className="">
															<i className="fa-solid fa-file-pdf text-[40px] text-red-500"></i>
															{/* <i className="fa-solid fa-file-word text-[40px] text-indigo-800"></i> */}
														</div>
														<div className="flex grow items-center pl-4">
															<span className="flex grow cursor-pointer items-center pr-3 text-[12px] group-hover:underline">
																{props.data["contract"].split("/").pop()}
															</span>
															<Button
																label={srcLang === "ja" ? "みる" : "View"}
																btnStyle="sm"
																btnType="button"
																handleClick={() => {
																	window.open(props.data["contract"], "_blank");
																}}
															/>
														</div>
													</div>
												</div>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												{/* <h6 className="mb-1 w-full font-bold">Agreement Validity</h6> */}

												<FormField
													label={srcLang === "ja" ? "終了日" : "Expiry Date"}
													fieldType="input"
													inputType="date"
													value={props.data["expire"]}
													readOnly
												/>
											</div>
										</div>

										{props.data["address"] && props.data["address"].length > 0 && (
											<div className="mb-4 w-full">
												<FormField
													label={srcLang === "ja" ? "担当エージェント" : "Address (Optional)"}
													fieldType="textarea"
													value={props.data["address"]}
													disabled
													readOnly
												/>
											</div>
										)}
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
											{srcLang === "ja" ? "詳細" : "Contract Details"}
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
													{"Re-New Contract"}
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
												<FormField
													label={"New Expiry date"}
													fieldType="input"
													inputType="date"
													value={raedate}
													handleChange={(e) => setraedate(e.target.value)}
													required
												/>
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

			<Transition.Root show={allocationList} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setallocationList}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:mx-4">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "詳細" : "Shared Application List"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setallocationList(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="-mx-3 flex flex-wrap items-start">
											<div className="flex h-auto w-full flex-col justify-between overflow-auto bg-white dark:bg-gray-800">
												{shareADetail && shareADetail["applicant"] && shareADetail["applicant"].length > 0 ? (
													<table cellPadding={"0"} cellSpacing={"0"} className="h-fit w-full">
														<thead>
															<tr>
																<th className="border-b px-3 py-2 text-left">AI rating</th>
																<th className="border-b px-3 py-2 text-left">ID</th>
																<th className="border-b px-3 py-2 text-left">name</th>
																<th className="border-b px-3 py-2 text-left">email</th>
																<th className="border-b px-3 py-2 text-left">job title</th>
																<th className="border-b px-3 py-2 text-left">status</th>
																<th className="border-b px-3 py-2 text-left">type</th>
																<th className="border-b px-3 py-2 text-left">application date</th>
															</tr>
														</thead>
														<tbody>
															{shareADetail["applicant"] && shareADetail["applicant"].map((data, i) => (
															<tr key={i} className="h-auto cursor-pointer">
																<td
																	className="border-b px-3 py-2 text-sm"
																>
																	{data["percentage_fit"] && (
																		<span
																			className="px-2 py-1"
																			style={{
																				borderColor: getColorCode(data.percentage_fit),
																				borderWidth: ".20rem .05rem .01rem 0",
																				borderRadius: ".5rem 2rem"
																			}}
																		>
																			{data["percentage_fit"]}%
																		</span>
																	)}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																>
																	{data["arefid"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																>
																	{data["fname"]}&nbsp;{data["lname"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																>
																	{data["email"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																>
																	{data["job"]["jobTitle"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																>
																	{data["status"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																>
																	{data["type"]}
																</td>
																<td
																	className="border-b px-3 py-2 text-sm"
																>
																	{moment(data["created_at"]).format("MM/DD/YYYY")}
																</td>
																</tr>
															))}
														</tbody>
													</table>
												) : (
													<p className="mb-4 text-center text-base font-bold">
														{srcLang === "ja"
															? "アカウントを削除してもよろしいですか?"
															: "No application shared with this."}
													</p>
												)}
											</div>
										</div>
										<div className="flex w-full justify-between">
											<Button
												label={srcLang === "ja" ? "近い" : "Close"}
												btnType="button"
												handleClick={() => setallocationList(false)}
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
											Are you sure to delete This Contract
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
												: "Are you sure want to delete this contract ?"}
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
														props.delAccount(props.data["acrefid"]).then(() => setAccountDelete(false));
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
		</>
	);
}
