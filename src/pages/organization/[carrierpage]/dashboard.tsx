import Button from "@/components/Button";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useCarrierStore } from "@/utils/code";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import { Tab, Transition } from "@headlessui/react";
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
			.get(`/job/applicants/alls/${cid}/`)
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
			.get(`/job/can/offer/detail/${id}/`)
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
			.post(`/job/can/offer/update/${omrefid}/`, fd)
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
			const pages = pdfDoc.getPages();
			const font = await pdfDoc.embedFont("Helvetica"); // You can use a different font if desired

			for (const page of pages) {
				const text = "Powered By Somhako";
				const width = font.widthOfTextAtSize(text, 12);
				const textX = (page.getWidth() - width) / 2;
				const textY = 40; // Adjust this value to set the distance from the bottom

				page.drawText(text, { x: textX, y: textY, size: 12, font });
			}

			// Serialize the modified PDF
			const mergedPdfData = await pdfDoc.save();

			// Create Blob for the merged PDF
			const pdfFile = new Blob([mergedPdfData], { type: "application/pdf" });

			// Create FormData to send the PDF
			const fd = new FormData();
			fd.append("step", 5);
			fd.append("finalofferLetter", pdfFile, "merged.pdf");
			fd.append("candidate_status", "Accepted");
			fd.append("novus", "accept");
			updateOffer(omrefid, fd, "Approve");
		} catch (error) {
			console.error("Error while merging and submitting PDF:", error);
		}
	};

	return (
		<>
			<Head>
				<title>{t("Words.Dashboard")}</title>
				<meta name="description" content="Generated by create next app" />
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
																<ul className="mb-3 flex flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
																	<li className="mr-8">
																		<i className="fa-solid fa-location-dot mr-2 capitalize"></i>
																		{data["job"]["jobWorktype"] ? data["job"]["jobWorktype"] : <>Not Disclosed</>}
																	</li>
																	<li className="mr-8">
																		<i className="fa-regular fa-clock mr-2 capitalize"></i>
																		{data["job"]["jobEmploymentType"] ? (
																			data["job"]["jobEmploymentType"]
																		) : (
																			<>Not Disclosed</>
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
																			<>Not Disclosed</>
																		)}
																	</li>
																</ul>
																<p className="border-b pb-3 text-[12px] text-darkGray dark:text-gray-400">
																	Applied On - {moment(data["timestamp"]).format("DD MMM YYYY")}
																</p>
																<ul className="pt-3 text-[12px] font-bold text-darkGray dark:text-gray-400">
																	<li className="flex items-center">
																		<span className="mr-3 h-[8px] w-[8px] rounded-full bg-gradLightBlue"></span>{" "}
																		{data["status"]}
																	</li>
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
												<p className="text-center">No Applied Jobs Found</p>
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
													<p className="text-lg">No Offer</p>
													<small className="font-semibold">Right Now There Are No Offers For You.</small>
												</div>
											</section>
										) : (
											<>
												{offers.map((data, i) => (
													<>
														{data["step"] >= 3 && (
															<div key={i}>
																<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
																	<p className="my-2 font-bold">Offer Letter</p>
																	<button
																		className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																		onClick={() => {
																			if (
																				data["step"] >= 4 &&
																				data["finalofferLetter"] &&
																				data["finalofferLetter"].length > 0
																			) {
																				window.open(data["finalofferLetter"], "_blank");
																			} else if (
																				data["step"] === 3 &&
																				data["offerLetter"] &&
																				data["offerLetter"].length > 0
																			) {
																				window.open(data["offerLetter"], "_blank");
																			}
																		}}
																	>
																		<i className="fa-solid fa-download mr-2"></i>
																		Download
																	</button>
																</div>

																{data["step"] > 4 && (
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
																)}

																{data["step"] === 3 && (
																	<div className="mx-auto w-full max-w-[700px] py-4">
																		<p className="text-center">
																			{data["offerLetter"] && data["offerLetter"].length > 0 && (
																				<iframe src={`${data["offerLetter"]}`} className="h-[50vh] w-[100%]"></iframe>
																			)}
																		</p>
																		<p className="pt-2 text-center text-sm">
																			Right Now Offer Is Disscussion Stage <br />
																			After Select Slot Offer Approve/Reject Option Available.
																		</p>
																	</div>
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

																{/* {data["step"] >= 4 ? (
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
																) : (
																	<>
																		{data["step"] == 4 && (
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
																						<h5 className="mb-2 font-bold">Add Signature</h5>
																						<label
																							htmlFor="uploadBanner"
																							className="flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-normal border-2 border-dashed py-4 hover:bg-lightBlue dark:hover:bg-gray-700"
																						>
																							<i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
																							<p className="text-sm text-darkGray dark:text-gray-400">
																								Upload Signature or Photo
																								<br />
																								<small>(File type should be .png format)</small>
																							</p>
																							<Image
																								src={signature}
																								alt="Sign"
																								width={1200}
																								height={800}
																								className="mx-auto h-auto max-h-[200px] w-auto object-contain"
																							/>
																							<input type="file" hidden id="uploadBanner" accept="image/*" />
																						</label>
																					</div>
																				</div>
																				<div className="flex flex-wrap items-center justify-center border-t pt-4 dark:border-t-gray-600">
																					<div className="mx-2">
																						<Button btnStyle="success" label="Accept" />
																					</div>
																					<div className="mx-2">
																						<Button btnStyle="danger" label="Reject" />
																					</div>
																				</div>
																			</>
																		)}
																	</>
																)} */}
															</div>
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
