import Button from "@/components/Button";
import FormField from "@/components/FormField";
import Logo from "@/components/Logo";
import CandFooter from "@/components/candidate/footer";
import { useCarrierStore } from "@/utils/code";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { axiosInstance, axiosInstance2 } from "../api/axiosApi";
import moment from "moment";
import toastcomp from "@/components/toast";
import ThemeChange from "@/components/ThemeChange";
import ToggleLang from "@/components/ToggleLang";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

export default function OfferSchedule() {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);

	const [loader, setloader] = useState(true);

	const router = useRouter();

	const { omrefid } = router.query;
	const [offerDetails, setofferDetails] = useState([]);

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

	async function loadOffer(omrefid: any) {
		await axiosInstance
			.get(`/job/list-offer-dl/${omrefid}/`)
			.then(async (res) => {
				console.log("!", "Offer Detail", res.data);
				setofferDetails(res.data);
				setloader(false);
			})
			.catch((err) => {
				console.log("!", err);
				setofferDetails([]);
				setloader(false);
			});
	}

	async function updateOffer(omrefid: any, fd: any, type: any) {
		await axiosInstance2
			.post(`/job/list-offer-dl-update/${omrefid}/`, fd)
			.then(async (res) => {
				console.log("!", "Offer Detail", res.data);
				loadOffer(omrefid).then(() => {
					if (type === "Reject") {
						toastcomp("Offer Rejected", "success");
					}
					if (type === "Approve") {
						toastcomp("Offer Accepted", "success");
					}
				});
			})
			.catch((err) => {
				console.log("!", err);
				loadOffer(omrefid).then(() => {
					if (type === "Reject") {
						toastcomp("Offer Can't Rejected", "error");
					}
					if (type === "Approve") {
						toastcomp("Offer Can't Accepted", "error");
					}
				});
			});
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
			// fd.append("novus", "accept");
			updateOffer(omrefid, fd, "Approve");
		} catch (error) {
			console.error("Error while merging and submitting PDF:", error);
		}
	};

	function rejectOffer(omrefid: any) {
		const fd = new FormData();
		fd.append("candidate_visibility", "false");
		fd.append("step", 2);
		fd.append("candidate_status", "Pending");
		updateOffer(omrefid, fd, "Reject");
	}

	useEffect(() => {
		if (omrefid && omrefid.length > 0) {
			// setloader(false);
			loadOffer(omrefid);
		}
	}, [omrefid]);

	return (
		<>
			<Head>
				<title>{t("Words.InterviewDetails")}</title>
			</Head>
			<main className="relative py-8">
				<div className="absolute right-2 top-5">
					<ThemeChange />
				</div>
				<div className="mx-auto w-full max-w-[800px] px-4">
					<div className="mb-4 text-center">
						<Logo width={180} />
					</div>
					<div className="rounded-large bg-white p-6 shadow-normal dark:bg-gray-800 md:px-12 md:py-8">
						{loader ? (
							<div className="absolute left-0 top-0 z-[1] flex h-[100vh] w-full cursor-pointer items-start justify-center bg-[rgba(0,0,0,0.1)] backdrop-blur-md">
								<div className="flex h-[100vh] flex-col items-center justify-center text-center">
									<i className="fa-solid fa-spinner fa-spin"></i>
									<p className="my-2 font-bold">Kindly hold on for a moment while we process your request.</p>
								</div>
							</div>
						) : (
							<>
								<h1 className="mb-6 text-3xl font-bold capitalize">Offer Details</h1>

								<div>
									{offerDetails && offerDetails.length > 0 ? (
										<>
											{offerDetails.map((data, i) => (
												<div key={i}>
													{data["step"] === 1 && (
														<section className="">
															<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																<p className="text-lg">Offer In a Prepration Stage</p>
															</div>
														</section>
													)}
													{data["step"] === 2 && (
														<section className="">
															<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																<p className="text-lg">Offer In a Finalization Stage</p>
															</div>
														</section>
													)}
													{data["step"] === 3 && !data["candidate_visibility"] && (
														<section className="">
															<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																<p className="text-lg">Offer In A Disscussion Stage </p>
																<small className="font-semibold">
																	You can view the offer letter once the recruiter makes it visible to you.
																</small>
															</div>
														</section>
													)}

													{data["step"] >= 4 && data["candidate_visibility"] && (
														<>
															<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
																<p className="my-2 font-bold">Offer Letter</p>
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
																	Download
																</button>
															</div>

															{data["step"] > 4 && (
																<>
																	<div className="mx-auto w-full max-w-[700px] py-4">
																		<p className="text-center">
																			{data["finalofferLetter"] && data["finalofferLetter"].length > 0 ? (
																				<iframe
																					src={`${data["finalofferLetter"]}`}
																					className="h-[50vh] w-[100%]"
																				></iframe>
																			) : (
																				<iframe src={`${data["offerLetter"]}`} className="h-[50vh] w-[100%]"></iframe>
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
																				<iframe src={`${data["offerLetter"]}`} className="h-[50vh] w-[100%]"></iframe>
																			)}
																		</p>
																		<div className="pt-8">
																			<h5 className="mb-2 font-bold">Add Signature</h5>
																			<label
																				htmlFor="uploadBanner"
																				className="flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-normal border-2 border-dashed py-4 hover:bg-lightBlue dark:hover:bg-gray-700"
																			>
																				{!file ? (
																					<>
																						<i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
																						<p className="text-sm text-darkGray dark:text-gray-400">
																							Upload Signature or Photo
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
											))}
										</>
									) : (
										<>
											<section className="">
												<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
													<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
													<p className="text-lg">No Offer</p>
													<small className="font-semibold">Right Now There Are No Offers For This Candidate.</small>
												</div>
											</section>
										</>
									)}
								</div>
								<hr className="mb-4" />
								{/* <div>
									<h6 className="mb-3 inline-block font-bold capitalize">
										Select Date and Time for {data["type"]} Call
									</h6>
									<div className="-mx-4 mb-2 flex flex-wrap">
										<div className="mb-4 w-[50%] px-4 md:max-w-[33.33%]">
											<label
												htmlFor="choosedate_1"
												className={`group cursor-pointer text-sm`}
												onClick={(e) => {
													if (!finish) {
														setSelected("slot1");
													}
												}}
											>
												{moment(data["slot1"]).format("DD MMMM YYYY")}
												<input
													type="text"
													value={getStartAndEndTime(data["slot1"], data["duration"])}
													id="choosedate_1"
													readOnly
													className={`mt-1 w-full cursor-pointer rounded-normal border border-borderColor p-3 text-sm focus:shadow-none focus:outline-none focus:ring-0 ${
														select === "slot1"
															? "bg-gradDarkBlue text-white"
															: "bg-transparent group-hover:bg-gradLightBlue group-hover:text-white"
													}`}
												/>
											</label>
										</div>
										<div className="mb-4 w-[50%] px-4 md:max-w-[33.33%]">
											<label
												htmlFor="choosedate_1"
												className="group cursor-pointer text-sm"
												onClick={(e) => {
													if (!finish) {
														setSelected("slot2");
													}
												}}
											>
												{moment(data["slot2"]).format("DD MMMM YYYY")}
												<input
													type="text"
													value={getStartAndEndTime(data["slot2"], data["duration"])}
													id="choosedate_1"
													readOnly
													className={`mt-1 w-full cursor-pointer rounded-normal border border-borderColor p-3 text-sm focus:shadow-none focus:outline-none focus:ring-0 ${
														select === "slot2"
															? "bg-gradDarkBlue text-white"
															: "bg-transparent group-hover:bg-gradLightBlue group-hover:text-white"
													}`}
												/>
											</label>
										</div>
										<div className="mb-4 w-[50%] px-4 md:max-w-[33.33%]">
											<label
												htmlFor="choosedate_1"
												className="group cursor-pointer text-sm"
												onClick={(e) => {
													if (!finish) {
														setSelected("slot3");
													}
												}}
											>
												{moment(data["slot3"]).format("DD MMMM YYYY")}
												<input
													type="text"
													value={getStartAndEndTime(data["slot3"], data["duration"])}
													id="choosedate_1"
													readOnly
													className={`mt-1 w-full cursor-pointer rounded-normal border border-borderColor p-3 text-sm focus:shadow-none focus:outline-none focus:ring-0 ${
														select === "slot3"
															? "bg-gradDarkBlue text-white"
															: "bg-transparent group-hover:bg-gradLightBlue group-hover:text-white"
													}`}
												/>
											</label>
										</div>
										<div className="mb-4 w-[50%] px-4 md:max-w-[33.33%]">
											<label
												htmlFor="choosedate_1"
												className="group cursor-pointer text-sm"
												onClick={(e) => {
													if (!finish) {
														setSelected("slot4");
													}
												}}
											>
												{moment(data["slot4"]).format("DD MMMM YYYY")}
												<input
													type="text"
													value={getStartAndEndTime(data["slot4"], data["duration"])}
													id="choosedate_1"
													readOnly
													className={`mt-1 w-full cursor-pointer rounded-normal border border-borderColor p-3 text-sm focus:shadow-none focus:outline-none focus:ring-0 ${
														select === "slot4"
															? "bg-gradDarkBlue text-white"
															: "bg-transparent group-hover:bg-gradLightBlue group-hover:text-white"
													}`}
												/>
											</label>
										</div>
										<div className="mb-4 w-[50%] px-4 md:max-w-[33.33%]">
											<label
												htmlFor="choosedate_1"
												className="group cursor-pointer text-sm"
												onClick={(e) => {
													if (!finish) {
														setSelected("slot5");
													}
												}}
											>
												{moment(data["slot5"]).format("DD MMMM YYYY")}
												<input
													type="text"
													value={getStartAndEndTime(data["slot5"], data["duration"])}
													id="choosedate_1"
													readOnly
													className={`mt-1 w-full cursor-pointer rounded-normal border border-borderColor p-3 text-sm focus:shadow-none focus:outline-none focus:ring-0 ${
														select === "slot5"
															? "bg-gradDarkBlue text-white"
															: "bg-transparent group-hover:bg-gradLightBlue group-hover:text-white"
													}`}
												/>
											</label>
										</div>
									</div>
									<hr className="mb-4" />
									<FormField
										fieldType="input"
										inputType="email"
										label={srcLang === "ja" ? "候補者の電子メール ID" : "Candidate Email Id"}
										value={email}
										readOnly
									/>
									<Button
										btnType="submit"
										label={`${finish ? t("Btn.AlreadyScheduled") : t("Btn.Schedule")}`}
										disabled={finish || loader}
										handleClick={schduleInterviewCall}
									/>
								</div> */}
							</>
						)}
					</div>
					<div className="pt-2 text-right">
						<ToggleLang />
					</div>
				</div>
				<CandFooter />
			</main>
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

OfferSchedule.noAuth = true;
