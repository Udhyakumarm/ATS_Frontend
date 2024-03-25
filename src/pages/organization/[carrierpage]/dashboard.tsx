import Button from "@/components/Button";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useCarrierStore } from "@/utils/code";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment, useRef } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import signature from "/public/images/signature.jpg";
import Image from "next/image";
import UpcomingComp from "@/components/organization/upcomingComp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import Head from "next/head";
import CandFooter from "@/components/candidate/footer";
import toastcomp from "@/components/toast";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import Confetti from "react-confetti";
import Link from "next/link";

export default function CanCareerDashboard({ upcomingSoon }: any) {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const handleWindowResize = () => {
		setWindowWidth(window.innerWidth);
		setWindowHeight(window.innerHeight);
	};

	// Add event listener for window resize
	useEffect(() => {
		window.addEventListener("resize", handleWindowResize);
		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, []);

	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [sklLoad] = useState(true);
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
	const [showConfetti, setShowConfetti] = useState(false);
	const [token, settoken] = useState("");
	const [loadash, setloadash] = useState([]);
	const router = useRouter();

	useEffect(() => {
		if (orgdetail && Object.keys(orgdetail).length === 0 && session) {
			if (cname == "" || cid == "") router.replace(`/organization/${cname}`);
			else router.back();
		}
	}, [cid, orgdetail, cname, session]);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);
	async function loaddashboard() {
		await axiosInstanceAuth2
			.get(`/applicant/carrer-dashbaord/${cid}/`)
			.then(async (res) => {
				console.log("!", res.data);
				setloadash(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		if (token && token.length > 0 && cid && cid.length > 0 && orgdetail && orgdetail["OrgProfile"]) {
			loaddashboard();
			if (orgdetail["OrgProfile"].length > 0) {
				loadOffer(orgdetail["OrgProfile"][0]["user"]["id"]);
			}
		}
	}, [token, cid, orgdetail]);

	const [offers, setOffers] = useState([]);

	async function loadOffer(id: any) {
		await axiosInstanceAuth2
			.get(`/applicant/can/offer/detail/${id}/`)
			.then(async (res) => {
				console.log("data", res.data);
				setOffers(res.data);
			})
			.catch((err) => {
				setOffers([]);
				console.log("data", err);
			});
	}

	async function updateOffer(omrefid: any, fd: any, type: any) {
		await axiosInstanceAuth2
			.post(`/applicant/can/offer/update/${omrefid}/`, fd)
			.then(async (res) => {
				toastcomp("Offer " + type + " successfully", "success");
				if (orgdetail["OrgProfile"].length > 0) {
					loadOffer(orgdetail["OrgProfile"][0]["user"]["id"]);
				}
				if (type === "Approve") {
					setShowConfetti(true);
				}
			})
			.catch((err) => {
				toastcomp("Offer " + type + " not successfully", "error");
				if (orgdetail["OrgProfile"].length > 0) {
					loadOffer(orgdetail["OrgProfile"][0]["user"]["id"]);
				}
				console.log("data", err);
			});
	}

	function rejectOffer(omrefid: any) {
		const fd = new FormData();
		fd.append("step", "2");
		fd.append("novus", "reject");
		fd.append("candidate_status", "Pending");
		fd.append("candidate_visibility", "false");
		updateOffer(omrefid, fd, "Reject");
	}

	const [sign, setsign] = useState<File | null>(null);
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

	const signatureImageToPngDataUrl = (imageFile) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const dataUrl = reader.result;
				resolve(dataUrl);
			};
			reader.onerror = (error) => reject(error);
			reader.readAsDataURL(imageFile);
		});
	};

	const acceptOffer = async (omrefid: any, offerLetter: any) => {
		try {
			// Load PDF and signature image
			const pdfData = await fetch(offerLetter).then((res) => res.arrayBuffer());
			const signatureData = await signatureImageToPngDataUrl(sign);

			// Create a PDF document
			const pdfDoc = await PDFDocument.load(pdfData);

			// Create a new page for the signature image
			const signaturePage = pdfDoc.addPage([600, 400]);

			// Load the signature image
			const signatureImage = await pdfDoc.embedPng(signatureData);

			// Get signature image dimensions
			const { width, height } = signatureImage.scale(0.5);

			// Draw the signature image on the new page
			signaturePage.drawImage(signatureImage, {
				x: signaturePage.getWidth() / 2 - width / 2,
				y: signaturePage.getHeight() / 2 - height / 2,
				width,
				height,
				opacity: 0.8
			});

			// Add footer to every page
			// const pages = pdfDoc.getPages();
			// const font = await pdfDoc.embedFont("Helvetica"); // You can use a different font if desired

			// for (const page of pages) {
			// 	const text = "Powered By Somhako";
			// 	const width = font.widthOfTextAtSize(text, 12);
			// 	const textX = (page.getWidth() - width) / 2;
			// 	const textY = 40; // Adjust this value to set the distance from the bottom

			// 	page.drawText(text, { x: textX, y: textY, size: 12, font });
			// }

			// Serialize the modified PDF
			const mergedPdfData = await pdfDoc.save();

			// Create Blob for the merged PDF
			const pdfFile = new Blob([mergedPdfData], { type: "application/pdf" });

			// Create FormData to send the PDF
			const fd = new FormData();
			fd.append("step", 5);
			fd.append("finalofferLetter", pdfFile, "merged.pdf");
			fd.append("candidate_status", "Accepted");
			fd.append("candidate_visibility", "true");
			fd.append("novus", "accept");
			updateOffer(omrefid, fd, "Approve");
		} catch (error) {
			console.error("Error while merging and submitting PDF:", error);
		}
	};

	// Shift Docs and view app

	const cancelButtonRef = useRef(null);
	const [viewApplicant, setViewApplicant] = useState(false);
	const [odocs, setodocs] = useState(false);
	const [odocsapp, setodocsapp] = useState({});
	const [venappdetail, setvenappdetail] = useState({});
	const [odocsresume, setodocsresume] = useState([]);
	const [docs, setdocs] = useState([]);
	async function loadAppDosc(arefid: any) {
		await axiosInstanceAuth2
			.get(`/applicant/listdocs/${arefid}/`)
			.then((res) => {
				console.log("@@@@@", "listdocs", res.data);
				setdocs(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function delAppDocs(pk: any) {
		await axiosInstanceAuth2
			.delete(`/applicant/deletedocs/${pk}/`)
			.then((res) => {
				setodocs(false);
				toastcomp("Document deleted", "success");
			})
			.catch((err) => {
				setodocs(false);
				toastcomp("Document not deleted", "error");
				console.log(err);
			});
	}

	async function addAppDocs(arefid: any) {
		try {
			for (let i = 0; i < odocsresume.length; i++) {
				const formData = new FormData();
				formData.append("document", odocsresume[i]); // Append the current resume to FormData

				// Make the POST request with axios
				const response = await axiosInstanceAuth2.post(`/applicant/createdocs/${arefid}/`, formData);

				// Handle response for each request
				console.log(`Response for resume ${i + 1}:`, response.data);
			}
			setodocs(false);
			toastcomp(`${odocsresume.length} documets added`, "success");
		} catch (error) {
			// Handle error
			setodocs(false);
			toastcomp(`doc upload error`, "success");
			console.error("Error:", error);
		}
	}

	function handleODOCSFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files.length > 0) {
			const files = event.target.files;

			// setodocsresume((prevArray) => [...prevArray, ...files]);
			setodocsresume((prevArray) => {
				const uniqueItems = new Map();
				prevArray.forEach((item) => uniqueItems.set(item.name, item));
				Array.from(files).forEach((item) => uniqueItems.set(item.name, item));
				return Array.from(uniqueItems.values());
			});
		}
	}

	useEffect(() => {
		console.log("####", "odocsresume", odocsresume);
	}, [odocsresume]);

	useEffect(() => {
		if (odocs) {
			setodocsresume([]);
		}
	}, [odocs]);

	return (
		<>
			<Head>
				<title>{t("Words.Dashboard")}</title>
			</Head>
			<main className="py-8">
				<div className="container">
					{/* <h3 className="mb-6 text-lg font-bold">Dashboard</h3> */}
					<div className="overflow-hidden rounded-normal border dark:border-gray-600">
						<Tab.Group>
							<Tab.List className={"border-b bg-white px-6 shadow-normal dark:border-gray-600 dark:bg-gray-800"}>
								<Tab as={Fragment}>
									{({ selected }) => (
										<button
											className={
												"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
												" " +
												(selected
													? "border-primary text-primary dark:border-white dark:text-white"
													: "border-transparent text-darkGray dark:text-gray-400")
											}
										>
											{t("Words.AppliedJobs")}
										</button>
									)}
								</Tab>
								<Tab as={Fragment}>
									{({ selected }) => (
										<button
											className={
												"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
												" " +
												(selected
													? "border-primary text-primary dark:border-white dark:text-white"
													: "border-transparent text-darkGray dark:text-gray-400")
											}
										>
											{t("Words.Offer")}
										</button>
									)}
								</Tab>
							</Tab.List>
							<Tab.Panels>
								<Tab.Panel>
									<div className="bg-white p-6 dark:bg-gray-800">
										{loadash && loadash.length > 0 ? (
											<>
												<div className="mx-[-7px] flex flex-wrap">
													{loadash.map((data, i) => (
														<div className="mb-[15px] w-full px-[7px] md:max-w-[50%] lg:max-w-[calc(100%/3)]" key={i}>
															<div className="h-full rounded-[10px] bg-white p-5 shadow-normal dark:bg-gray-700">
																<button
																	type="button"
																	className="mb-3 cursor-pointer text-lg font-bold"
																	onClick={() => {
																		setjid(data["job"]["refid"]);
																		// setjdata(data["job"]);
																		router.push(`/organization/${cname}/job-detail/${data["job"]["refid"]}`);
																	}}
																>
																	{data["job"]["jobTitle"]}
																</button>
																<ul className="mb-3 flex flex-wrap items-start text-[12px] font-semibold text-darkGray dark:text-gray-400">
																	<li className="mr-8">
																		<i className="fa-solid fa-location-dot mr-2 capitalize"></i>
																		{data["job"]["jobWorktype"] ? data["job"]["jobWorktype"] : <>Not Disclosed</>}
																	</li>
																	<li className="mr-8">
																		<i className="fa-regular fa-clock mr-2 capitalize"></i>
																		{data["job"]["jobEmploymentType"] ? (
																			data["job"]["jobEmploymentType"]
																		) : (
																			<>{srcLang === "ja" ? "非公開" : "Not Disclosed"}</>
																		)}
																	</li>
																	<li>
																		<i className="fa-solid fa-dollar-sign mr-2 capitalize"></i>
																		{data["job"]["jobCurrency"] &&
																		data["job"]["jobFromSalary"] &&
																		data["job"]["jobToSalary"] ? (
																			<>
																				{data["job"]["jobCurrency"]} {data["job"]["jobFromSalary"]} to{" "}
																				{data["job"]["jobToSalary"]}
																			</>
																		) : (
																			<>{srcLang === "ja" ? "非公開" : "Not Disclosed"}</>
																		)}
																	</li>
																</ul>
																<p className="border-b pb-3 text-[12px] text-darkGray dark:text-gray-400">
																{srcLang === "ja" ? "適用日" : "Applied On"}
 - {moment(data["created_at"]).format("DD MMM YYYY, h:mm a")}
																</p>
																<ul className="flex justify-between pt-3 text-[12px] font-bold text-darkGray dark:text-gray-400">
																	<li className="flex items-center">
																		<span className="mr-3 h-[8px] w-[8px] rounded-full bg-gradLightBlue"></span>{" "}
																		{data["status"]}
																	</li>
																	<div className="flex gap-1">
																		<button
																			type="button"
																			className="text-primary hover:underline dark:text-white"
																			onClick={() => {
																				setvenappdetail(data);
																				loadAppDosc(data["arefid"]);
																				setViewApplicant(true);
																			}}
																		>
																			{srcLang === "ja" ? "表示" : "View"}
																		</button>
																		<span>|</span>
																		<button
																			type="button"
																			className="text-primary hover:underline dark:text-white"
																			onClick={() => {
																				setodocsapp(data);
																				loadAppDosc(data["arefid"]);
																				setodocs(true);
																			}}
																		>
																			{srcLang === "ja" ? "変更" : "Change"}
																		</button>
																	</div>
																</ul>

																{/* <div className="flex flex-wrap items-center justify-between">
														<div className="mr-4">
															<Button
																btnStyle="sm"
																label="View"
																loader={false}
																btnType="button"
																handleClick={() => {
																	setjid(data["job"]["refid"]);
																	setjdata(data["job"]);
																	router.push(`/organization/${cname}/job-detail`);
																}}
															/>
														</div>
														<p className="text-[12px] font-bold text-darkGray dark:text-gray-400">
															{moment(data["timestamp"]).fromNow()}
														</p>
													</div> */}
															</div>
														</div>
													))}
												</div>
											</>
										) : (
											<>
												<p className="text-center">{srcLang === "ja" ? "適用された求人は見つかりません" : "No Applied Jobs Found"}</p>
											</>
										)}
									</div>
								</Tab.Panel>
								<Tab.Panel>
									<div className="text-center">
										{process.env.NODE_ENV != "production" && (
											<Button
												btnStyle={"sm"}
												btnType="button"
												handleClick={() => setShowConfetti(true)}
												disabled={showConfetti}
												label={"Test Confetti"}
											/>
										)}
										{showConfetti && (
											<Confetti
												recycle={false}
												width={windowWidth}
												height={windowHeight}
												onConfettiComplete={(confetti: Confetti) => setShowConfetti(false)}
											/>
										)}
									</div>
									<div className="bg-white p-6 dark:bg-gray-800">
										{offers && offers.length <= 0 ? (
											<section className="">
												<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
													<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
													<p className="text-lg">{srcLang === "ja" ? "オファーなし" : "No Offer"}</p>
													<small className="font-semibold">{srcLang === "ja" ? "現在、あなたへのオファーはありません。" : "Right Now There Are No Offers For You."}</small>
												</div>
											</section>
										) : (
											<>
												{offers.map((data, i) => (
													<>
														{data["step"] >= 2 ? (
															<div key={i}>
																{!data["candidate_visibility"] || data["step"] === 2 || data["step"] === 3 ? (
																	<>
																		<section>
																			<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																				<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																				{data["step"] === 3 && <p className="text-lg">{srcLang === "ja" ? "討論段階の提供" : "Offer In A Disscussion Stage"} </p>}
																				{data["step"] === 2 && (
																					<p className="text-lg"> {srcLang === "ja" ? "討論段階の提供" : "Offer In A Disscussion Stage"} </p>
																				)}
																				{data["step"] === 3 && (
																					<small className="font-semibold">
																						{srcLang === "ja" ? "オファーレターは、採用担当者が閲覧できるようにした時点で見ることができます" : "You can view the offer letter once the recruiter makes it visible to you."}
																					</small>
																				)}
																			</div>
																		</section>
																	</>
																) : (
																	<>
																		<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
																			<p className="my-2 font-bold"> {srcLang === "ja" ? "提供書" : "Offer Letter"}</p>
																			<button
																				className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																				onClick={() => {
																					if (data["finalofferLetter"] && data["finalofferLetter"].length > 0) {
																						window.open(data["finalofferLetter"], "_blank");
																					} else if (data["offerLetter"] && data["offerLetter"].length > 0) {
																						window.open(data["offerLetter"], "_blank");
																					}
																				}}
																			>
																				<i className="fa-solid fa-download mr-2"></i>
																				{srcLang === "ja" ? "ダウンロード" : "Download"}
																			</button>
																		</div>

																		{data["step"] > 4 && (
																			<>
																				<div className="mx-auto w-full max-w-[700px] py-4">
																					<p className="text-center">
																						{data["finalofferLetter"] && data["finalofferLetter"].length > 0 && (
																							<iframe
																								src={`${data["finalofferLetter"]}`}
																								className="h-[50vh] w-[100%]"
																							></iframe>
																						)}
																					</p>
																				</div>
																				<div className="my-6 rounded-normal bg-green-100 px-6 py-8 text-center font-bold text-gray-700">
																					<i className="fa-solid fa-check-circle mb-2 text-[40px] text-green-700"></i>
																					<p className="mb-2 text-lg text-green-700">{t("Words.OfferAccepted")}</p>
																				</div>
																			</>
																		)}

																		{data["step"] === 4 && (
																			<>
																				<div className="mx-auto w-full max-w-[700px] py-4">
																					<p className="text-center">
																						{data["offerLetter"] && data["offerLetter"].length > 0 && (
																							<iframe
																								src={`${data["offerLetter"]}`}
																								className="h-[50vh] w-[100%]"
																							></iframe>
																						)}
																					</p>
																					<div className="pt-8">
																						<h5 className="mb-2 font-bold">{srcLang === "ja" ? "署名を追加" : "Add Signature"}</h5>
																						<label
																							htmlFor="uploadBanner"
																							className="flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-normal border-2 border-dashed py-4 hover:bg-lightBlue dark:hover:bg-gray-700"
																						>
																							{!file ? (
																								<>
																									<i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
																									<p className="text-sm text-darkGray dark:text-gray-400">
																									{srcLang === "ja" ? "署名または写真をアップロード" : "Upload Signature or Photo"}
																										<br />
																										<small> {srcLang === "ja" ? "(ファイルタイプは .png 形式である必要があります)" : "(File type should be .png format)"}</small>
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
																								accept=".png"
																								onChange={handleFileInputChange}
																							/>
																						</label>
																					</div>
																				</div>
																				<div className="flex flex-wrap items-center justify-center border-t pt-4 dark:border-t-gray-600">
																					<div className="mx-2">
																						<Button
																							btnStyle="success"
																							label="Accept"
																							btnType="button"
																							disabled={!file}
																							handleClick={() => acceptOffer(data["omrefid"], data["offerLetter"])}
																						/>
																					</div>
																					<div className="mx-2">
																						<Button
																							btnStyle="danger"
																							label="Reject"
																							btnType="button"
																							handleClick={() => rejectOffer(data["omrefid"])}
																						/>
																					</div>
																				</div>
																			</>
																		)}
																	</>
																)}
															</div>
														) : (
															<section>
																<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																	<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																	<p className="text-lg">{srcLang === "ja" ? "準備段階の提供" : "Offer In A Prepration Stage"} </p>
																</div>
															</section>
														)}
													</>
												))}
											</>
										)}
									</div>
								</Tab.Panel>
							</Tab.Panels>
						</Tab.Group>
					</div>
				</div>
			</main>
			<Transition.Root show={viewApplicant} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setViewApplicant}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">{t("Words.ApplicantProfile")}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setViewApplicant(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									{venappdetail && (
										<div className="p-8">
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<p className="mx-auto w-full max-w-[600px] text-center">
													<iframe src={venappdetail["resume"]} className="h-[100vh] w-[100%]"></iframe>
												</p>
											</div>
											{docs && docs.length > 0 && (
												<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
													<label className="mb-1 inline-block font-bold">{srcLang === "ja" ? "オプションの文書" : "Optional Document"}</label>
													<article className="flex flex-col text-sm">
														{docs.map((data, i) => (
															<Link
																key={i}
																href={data["document"]}
																target="_blank"
																className="my-1 inline-block font-bold text-primary hover:underline dark:text-white"
																download={data["document"].split("/").pop()}
															>
																<i className="fa-solid fa-download mr-2"></i>
																{data["document"].split("/").pop()}
															</Link>
														))}
													</article>
												</div>
											)}
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">{srcLang === "ja" ? "候補者情報" : "Candidate Information"}</label>
												<article className="text-sm">
													Name :{" "}
													{venappdetail["fname"] &&
													venappdetail["fname"].length > 0 &&
													venappdetail["lname"] &&
													venappdetail["lname"].length > 0 ? (
														<>
															{venappdetail["fname"]}&nbsp;{venappdetail["lname"]}
														</>
													) : (
														<>N/A</>
													)}
												</article>
												<article className="text-sm">
													Email :{" "}
													{venappdetail["email"] && venappdetail["email"].length > 0 ? venappdetail["email"] : <>N/A</>}
												</article>
												<article className="text-sm">
													Rating : {venappdetail["percentage_fit"] ? <>{venappdetail["percentage_fit"]}%</> : <>N/A</>}
												</article>
											</div>
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">{t("Words.Summary")}</label>
												<article className="text-sm">
													{venappdetail["summary"] && venappdetail["summary"].length > 0 ? (
														venappdetail["summary"]
													) : (
														<>N/A</>
													)}
												</article>
											</div>
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">{t("Words.MessageFromVendor")}</label>
												<article className="text-sm">
													{venappdetail["recuriter_message"] && venappdetail["recuriter_message"].length > 0 ? (
														venappdetail["recuriter_message"]
													) : (
														<>N/A</>
													)}
												</article>
											</div>
										</div>
									)}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={odocs} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setodocs}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">{t("Words.ApplicantProfile")}</h4>
										<button type="button" className="leading-none hover:text-gray-700" onClick={() => setodocs(false)}>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{odocsapp && (
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold"> {srcLang === "ja" ? "現在のオプションの文書" : "Current Optional Document"}</label>
												<article className="text-sm">
													Name :{" "}
													{odocsapp["fname"] &&
													odocsapp["fname"].length > 0 &&
													odocsapp["lname"] &&
													odocsapp["lname"].length > 0 ? (
														<>
															{odocsapp["fname"]}&nbsp;{odocsapp["lname"]}
														</>
													) : (
														<>N/A</>
													)}
												</article>
												<article className="text-sm">
													Email : {odocsapp["email"] && odocsapp["email"].length > 0 ? odocsapp["email"] : <>N/A</>}
												</article>
												<article className="text-sm">
													Rating : {odocsapp["percentage_fit"] ? <>{odocsapp["percentage_fit"]}%</> : <>N/A</>}
												</article>
											</div>
										)}

										{docs && docs.length > 0 && (
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">{srcLang === "ja" ? "現在のオプションの文書" : "Current Optional Document"}</label>
												<article className="flex flex-col text-sm">
													{docs.map((data, i) => (
														<div key={i} className="flex items-center justify-between">
															<Link
																href={data["document"]}
																target="_blank"
																className="my-1 inline-block font-bold text-primary hover:underline dark:text-white"
																download={data["document"].split("/").pop()}
															>
																<i className="fa-solid fa-download mr-2"></i>
																{data["document"].split("/").pop()}
															</Link>

															<button
																type="button"
																className={`my-1 w-auto min-w-[40px] rounded bg-red-200 px-2 py-1 text-[12px] text-red-600 hover:bg-red-600  hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-500`}
																onClick={() => delAppDocs(data["id"])}
															>
																<i className="fa-solid fa-trash"></i>
															</button>
														</div>
													))}
												</article>
											</div>
										)}

										<label
											htmlFor="uploadCV"
											className="mb-6 block cursor-pointer rounded-normal border p-6 text-center"
										>
											<p className="mb-2 text-sm">
												<span className="font-semibold text-primary dark:text-white">
												{srcLang === "ja" ? "単一または複数の任意書類をアップロードするには、ここをクリックしてください。" : "Click here to Upload Single or Multiple Optional Documents"}
												</span>
											</p>
											<p className="text-sm text-darkGray"> {srcLang === "ja" ? "最大ファイルサイズ: 5 MB" : "Maximum File Size: 5 MB"}</p>
											<input
												type="file"
												className="hidden"
												id="uploadCV"
												onChange={handleODOCSFileInputChange}
												multiple
											/>
										</label>

										{odocsresume && odocsresume.length > 0 && (
											<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
												<label className="mb-1 inline-block font-bold">{srcLang === "ja" ? "新しいオプションの文書" : "New Optional Document"}</label>
												<article className="flex flex-col text-sm">
													{odocsresume.map((data, i) => (
														<div key={i} className="flex items-center justify-between">
															<button
																onClick={() => {
																	if (data) {
																		const fileUrl = URL.createObjectURL(data);
																		window.open(fileUrl, "_blank");
																	}
																}}
																className="my-1 inline-block font-bold text-primary hover:underline dark:text-white"
															>
																<i className="fa-solid fa-download mr-2"></i>
																{data["name"]}
															</button>

															<button
																type="button"
																className={`my-1 w-auto min-w-[40px] rounded bg-red-200 px-2 py-1 text-[12px] text-red-600 hover:bg-red-600  hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-500`}
																onClick={() =>
																	setodocsresume((prevArray) => {
																		// Make a copy of the previous array
																		const newArray = [...prevArray];
																		// Remove the item at the specified index
																		newArray.splice(i, 1);
																		return newArray;
																	})
																}
															>
																<i className="fa-solid fa-trash"></i>
															</button>
														</div>
													))}
												</article>
												<Button btnType="button" label="Save" handleClick={() => addAppDocs(odocsapp["arefid"])} />
											</div>
										)}
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
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

CanCareerDashboard.mobileEnabled = true;
