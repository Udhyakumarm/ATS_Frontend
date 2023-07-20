import Head from "next/head";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import TeamMembers from "@/components/TeamMembers";
import { Dialog, Listbox, Tab, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment, useRef, useState, useEffect } from "react";
import FormField from "@/components/FormField";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import userImg from "public/images/user-image.png";
import userImg1 from "public/images/user-image1.jpeg";
import socialIcon from "public/images/social/linkedin-icon.png";
import Button from "@/components/Button";
import Link from "next/link";
import successGraphic from "public/images/success-graphic.png";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import moment from "moment";
import toastcomp from "@/components/toast";
import { useCalStore, useUserStore } from "@/utils/code";
import mammoth from "mammoth";
// import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import noInterviewdata from "/public/images/no-data/iconGroup-3.png";
import UpcomingComp from "@/components/organization/upcomingComp";
import googleIcon from "/public/images/social/google-icon.png";
import TImeSlot from "@/components/TimeSlot";

const CalendarIntegrationOptions = [
	{ provider: "Google Calendar", icon: googleIcon, link: "/api/integrations/gcal/create" }
];

const people = [
	{ id: 1, name: "All", unavailable: false },
	{ id: 2, name: "Software Developer", unavailable: false },
	{ id: 3, name: "PHP Developer", unavailable: false },
	{ id: 4, name: "ReactJS Developer", unavailable: true },
	{ id: 5, name: "Web Designer", unavailable: false }
];

export default function OfferManagement({ atsVersion, userRole, upcomingSoon }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [sklLoad] = useState(true);
	const router = useRouter();
	//int
	const integration = useCalStore((state: { integration: any }) => state.integration);
	const setIntegration = useCalStore((state: { setIntegration: any }) => state.setIntegration);

	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [loader, setloader] = useState(true);
	const cancelButtonRef = useRef(null);
	const [editDetails, seteditDetails] = useState(false);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	const [applicantlist, setapplicantlist] = useState([]);
	const [filterApplicants, setFilterApplicants] = useState([]);
	const [search, setsearch] = useState("");
	const [stepform, setstepform] = useState(false);
	const [feedreject, setfeedreject] = useState(false);
	const [offer, setoffer] = useState([]);
	const [currentApplicant, setcurrentApplicant] = useState({});
	const [tm, settm] = useState([]);

	const [step, setstep] = useState(0);
	const [omf, setomf] = useState([]);

	//step1
	const [designation, setdesignation] = useState("");
	const [dept, setdept] = useState("");
	const [section, setsection] = useState("");
	const [div, setdiv] = useState("");
	const [grade, setgrade] = useState("");
	const [location, setlocation] = useState("");
	const [curr, setcurr] = useState("");
	const [type, settype] = useState("");
	const [from, setfrom] = useState("");
	const [to, setto] = useState("");
	const [ctype, setctype] = useState("");
	const [visa, setvisa] = useState("");
	const [relocation, setrelocation] = useState("");
	const [approval, setapproval] = useState("");
	const [hmanage, sethmanage] = useState([]);
	const [hmanageID, sethmanageID] = useState([]);
	//feedback hm
	const [feedback, setfeedback] = useState("");
	const [omrefid, setomrefid] = useState("");
	const [ostatus, setostatus] = useState("");
	const [ocstatus, setocstatus] = useState("");
	const [ouid, setouid] = useState("");

	//step 2
	const [word, setword] = useState<ArrayBuffer | null>(null);
	const [wordpath, setwordpath] = useState("");
	const [value, setvalue] = useState("");
	const [bvalue, setbvalue] = useState("");
	const htmlRef = useRef<HTMLDivElement>(null);

	async function loadApplicant() {
		try {
			let arr = [];
			setloader(true);
			var [res1, res2] = await Promise.all([
				axiosInstanceAuth2.get(`/job/listapplicant/`),
				axiosInstanceAuth2.get(`/job/listvendorapplicant/`)
			]);

			arr = res1.data
				.filter((data: any) => data.status === "Offer")
				.map((data: any) => ({ ...data, type: "career" }))
				.concat(
					res2.data.filter((data: any) => data.status === "Offer").map((data: any) => ({ ...data, type: "vendor" }))
				);

			console.info("data", "offer applicant", arr);
			setapplicantlist(arr);
			setFilterApplicants(arr);
			setloader(false);
		} catch (error) {
			setapplicantlist([]);
			setFilterApplicants([]);
			setloader(false);

			console.error("Error fetching data:", error);
		}
	}

	async function loadTeamMember() {
		await axiosInstanceAuth2
			.get(`/organization/listorguser/`)
			.then(async (res) => {
				console.log("@", "listorguser", res.data);
				settm(res.data);
			})
			.catch((err) => {
				console.log("@", "listorguser", err);
			});
	}

	async function loadOrganizationProfile() {
		await axiosInstanceAuth2
			.get(`/organization/listorganizationprofile/`)
			.then(async (res) => {
				console.log("@", "oprofile", res.data);
				let data = res.data;
				if (data && data.length > 0) {
					for (let i = 0; i < data.length; i++) {
						if (data[i]["offer"]) {
							setwordpath(data[i]["offer"]);
						} else {
							setwordpath("");
						}
						setouid(data[i]["unique_id"]);
					}
				}
			})
			.catch((err) => {
				console.log("@", "oprofile", err);
			});
	}

	const convertDocxToArrayBuffer = async (filePath: any) => {
		try {
			const response = await fetch(filePath);
			const fileBuffer = await response.arrayBuffer();
			return fileBuffer;
		} catch (error) {
			console.error("@", "Error converting DOCX to ArrayBuffer:", error);
			throw error;
		}
	};

	useEffect(() => {
		if (
			wordpath &&
			wordpath.length > 0 &&
			currentApplicant &&
			currentApplicant["type"] &&
			currentApplicant["type"].length > 0
		) {
			// console.log(wordpath);
			convertDocxToArrayBuffer(wordpath)
				.then((arrayBuffer) => {
					// Use the arrayBuffer as needed
					setword(arrayBuffer);
					mammoth
						.convertToHtml(
							{ arrayBuffer: arrayBuffer },
							{
								ignoreEmptyParagraphs: false,
								includeDefaultStyleMap: false,
								includeEmbeddedStyleMap: false,
								styleMap: ["p[style-name='Section Title'] => h1:fresh", "p[style-name='Subsection Title'] => h2:fresh"]
							}
						)
						.then(function (result) {
							var html = result.value; // The generated HTML
							var messages = result.messages; // Any messages, such as warnings during conversion
							// console.log("@", html);
							// console.log("@", messages);
							html = html.replaceAll("<p></p>", "<br/>");
							html = html + "<br/><br/>";
							setbvalue(html);

							if (currentApplicant["type"] === "career") {
								if (
									currentApplicant["user"]["last_name"] &&
									currentApplicant["user"]["last_name"].length > 0 &&
									currentApplicant["user"]["first_name"] &&
									currentApplicant["user"]["first_name"].length > 0
								) {
									html = html.replaceAll(
										"[Candidate's Name]",
										`${currentApplicant["user"]["first_name"]}&nbsp;${currentApplicant["user"]["last_name"]}`
									);
								}
							} else if (currentApplicant["type"] === "vendor") {
								if (
									currentApplicant["applicant"]["last_name"] &&
									currentApplicant["applicant"]["last_name"].length > 0 &&
									currentApplicant["applicant"]["first_name"] &&
									currentApplicant["applicant"]["first_name"].length > 0
								) {
									html = html.replaceAll(
										"[Candidate's Name]",
										`${currentApplicant["applicant"]["first_name"]}&nbsp;${currentApplicant["applicant"]["last_name"]}`
									);
								}
							}
							if (designation && designation.length > 0) {
								html = html.replaceAll("[Designation]", designation);
							}
							if (dept && dept.length > 0) {
								html = html.replaceAll("[Department]", dept);
							}
							if (section && section.length > 0) {
								html = html.replaceAll("[Section]", section);
							}
							if (div && div.length > 0) {
								html = html.replaceAll("[Division]", div);
							}
							if (grade && grade.length > 0) {
								html = html.replaceAll("[Grade]", grade);
							}
							if (location && location.length > 0) {
								html = html.replaceAll("[Location]", location);
							}
							if (curr && curr.length > 0) {
								html = html.replaceAll("[Currency]", curr);
							}
							if (from && from.length > 0) {
								html = html.replaceAll("[Salary Range From]", from);
							}
							if (to && to.length > 0) {
								html = html.replaceAll("[Salary Range To]", to);
							}
							if (type && type.length > 0) {
								html = html.replaceAll("[Monthly/Yearly]", type);
							}
							if (ctype && ctype.length > 0) {
								html = html.replaceAll("[Candidate Type]", ctype);
							}
							if (visa && visa.length > 0) {
								html = html.replaceAll("[Visa Sponsorship]", visa);
							}
							if (relocation && relocation.length > 0) {
								html = html.replaceAll("[Paid Relocation]", relocation);
							}
							setvalue(html);
						})
						.catch(function (error) {
							console.log("@", "err1", error);
							setword(null);
							toastcomp("This Word Does Not Support Use .docx Only", "error");
						});
				})
				.catch((error) => {
					// Handle any errors
					console.log("@", "err2", error);
					setword(null);
					toastcomp("Not Convert2", "error");
				});
		}
	}, [wordpath, currentApplicant]);

	useEffect(() => {
		if (search.length > 0) {
			// setshowOffer(false);
			let localSearch = search.toLowerCase();
			let arr = [];
			for (let i = 0; i < applicantlist.length; i++) {
				if (
					applicantlist[i]["type"] === "career" &&
					(applicantlist[i]["user"]["first_name"].toLowerCase().includes(localSearch) ||
						applicantlist[i]["user"]["last_name"].toLowerCase().includes(localSearch))
				) {
					arr.push(applicantlist[i]);
				}
				if (
					applicantlist[i]["type"] === "vendor" &&
					(applicantlist[i]["applicant"]["first_name"].toLowerCase().includes(localSearch) ||
						applicantlist[i]["applicant"]["last_name"].toLowerCase().includes(localSearch))
				) {
					arr.push(applicantlist[i]);
				}
			}
			setFilterApplicants(arr);
		} else {
			setFilterApplicants(applicantlist);
		}
	}, [search]);

	useEffect(() => {
		if (token && token.length > 0) {
			loadApplicant();
			loadTeamMember();
			loadOrganizationProfile();
		}
	}, [token]);

	async function offerDetail(arefid: string, current_data: any) {
		try {
			var [res] = await Promise.all([axiosInstanceAuth2.get(`/job/list-offer/${arefid}/`)]);

			console.info("data", "offer detail", res.data);
			console.info("data", "offer current applicant", current_data);
			setcurrentApplicant(current_data);
			setoffer(res.data);

			const data22 = current_data?.job?.team;
			const filteredIDs = data22
				? data22
						.filter(
							(item: any) => (item.role === "Hiring Manager" || item.role === "Collaborator") && item.verified === true
						)
						.map((item: any) => item.id)
				: [];

			const filteredNames = data22
				? data22
						.filter(
							(item: any) => (item.role === "Hiring Manager" || item.role === "Collaborator") && item.verified === true
						)
						.map((item: any) => item.email)
				: [];

			sethmanage(filteredNames);
			sethmanageID(filteredIDs);

			if (res.data.length > 0) {
				var data = res.data[0];

				console.info("data", "offer detail step", data["step"]);

				loadOfferFeedback(data["omrefid"]);
				setomrefid(data["omrefid"]);
				if (data["designation"] && data["designation"].length > 0) {
					setdesignation(data["designation"]);
				}
				if (data["department"] && data["department"].length > 0) {
					setdept(data["department"]);
				}
				if (data["section"] && data["section"].length > 0) {
					setsection(data["section"]);
				}
				if (data["divsion"] && data["divsion"].length > 0) {
					setdiv(data["divsion"]);
				}
				if (data["grade"] && data["grade"].length > 0) {
					setgrade(data["grade"]);
				}
				if (data["location"] && data["location"].length > 0) {
					setlocation(data["location"]);
				}
				if (data["currency"] && data["currency"].length > 0) {
					setcurr(data["currency"]);
				}
				if (data["salary_type"] && data["salary_type"].length > 0) {
					settype(data["salary_type"]);
				}
				if (data["salary_from"] && data["salary_from"].length > 0) {
					setfrom(data["salary_from"]);
				}
				if (data["salary_to"] && data["salary_to"].length > 0) {
					setto(data["salary_to"]);
				}
				if (data["candidate_type"] && data["candidate_type"].length > 0) {
					setctype(data["candidate_type"]);
				}
				if (data["visa_sponsorship"] && data["visa_sponsorship"].length > 0) {
					setvisa(data["visa_sponsorship"]);
				}
				if (data["paid_relocation"] && data["paid_relocation"].length > 0) {
					setrelocation(data["paid_relocation"]);
				}
				if (data["step"] && data["step"].length > 0) {
					setstep(data["step"]);
				}
				if (data["candidate_status"] && data["candidate_status"].length > 0) {
					setocstatus(data["candidate_status"]);
				}

				if (data["approval_authorities"] && data["approval_authorities"].length > 0) {
					let fstring = [];
					let fautharr = data["approval_authorities"];

					const filteredData = data22
						? data22.filter(
								(item: any) =>
									(item.role === "Hiring Manager" || item.role === "Collaborator") && item.verified === true
						  )
						: [];

					const idToEmailMap = filteredData.reduce((acc: any, item: any) => {
						acc[item.id] = item.email;
						return acc;
					}, {});

					fstring = fautharr.map((searchString: any) => idToEmailMap[searchString]).filter(Boolean);
					setapproval(fstring.join(","));
				}
			} else {
				setstep(1);
				setomf([]);
				setdesignation("");
				setdept("");
				setsection("");
				setdiv("");
				setgrade("");
				setlocation("");
				setcurr("");
				settype("");
				setfrom("");
				setto("");
				setctype("");
				setvisa("");
				setrelocation("");
				setapproval("");
				setomrefid("");
				setostatus("");
				setocstatus("");
			}

			setstepform(true);
		} catch (error) {
			setcurrentApplicant({});
			setoffer([]);
			setstepform(false);
			console.error("Error fetching data:", error);
		}
	}

	async function loadOfferFeedback(omrefid: string) {
		await axiosInstanceAuth2
			.get(`/job/list-offerfeedback/${omrefid}/`)
			.then(async (res) => {
				console.log("@", "list-offer-feedback", res.data);
				setomf(res.data);
				setfeedreject(false);
				var data = res.data;
				for (let i = 0; i < data.length; i++) {
					if (data[i]["status"] === "Reject") {
						setfeedreject(true);
					}
				}
			})
			.catch((err) => {
				setomf([]);
				console.log("@", "list-offer-feedback", err);
			});
	}

	useEffect(() => {
		console.log("data", "step", step);
	}, [step]);

	function rejectVerify() {
		return feedback.length > 0;
	}

	function nextstep1Verify() {
		return omf.length > 0 && approval.length > 0 && omf.length === approval.split(",").length;
	}

	function checkBtnOffer() {
		return (
			designation.length > 0 &&
			dept.length > 0 &&
			section.length > 0 &&
			div.length > 0 &&
			grade.length > 0 &&
			location.length > 0 &&
			curr.length > 0 &&
			type.length > 0 &&
			from.length > 0 &&
			to.length > 0 &&
			ctype.length > 0 &&
			visa.length > 0 &&
			relocation.length > 0 &&
			approval.length > 0
		);
	}

	function checkBtnOffer1() {
		return (
			designation.length > 0 &&
			dept.length > 0 &&
			section.length > 0 &&
			div.length > 0 &&
			grade.length > 0 &&
			location.length > 0 &&
			curr.length > 0 &&
			type.length > 0 &&
			from.length > 0 &&
			to.length > 0 &&
			ctype.length > 0 &&
			visa.length > 0 &&
			relocation.length > 0
		);
	}

	async function newOfferFeedback(status: string) {
		const fd = new FormData();
		if (feedback && feedback.length > 0) {
			fd.append("feedback", feedback);
		}
		fd.append("status", status);

		await axiosInstanceAuth2
			.post(`/job/create-offerfeedback/${omrefid}/`, fd)
			.then(async (res) => {
				toastcomp("offer feedback created", "success");
			})
			.catch((err) => {
				toastcomp("offer feedback not created", "error");
			});
	}

	async function updateStep(count: any) {
		const fd = new FormData();
		fd.append("step", count);
		await axiosInstanceAuth2
			.put(`/job/update-offer/${omrefid}/`, fd)
			.then(async (res) => {
				toastcomp("offer stage Updated", "success");
				offerDetail(currentApplicant["arefid"], currentApplicant);
				console.log("@", "Offer stage Updated", res.data);
				// setom(res.data);
			})
			.catch((err) => {
				toastcomp("offer stage Not Updated", "error");
				offerDetail(currentApplicant["arefid"], currentApplicant);
				// setom([]);
				console.log("@", "Offer stage Not Updated", err);
			});
	}

	async function handleOfferManagement(arefid: string) {
		const fd = new FormData();
		fd.append("designation", designation);
		fd.append("department", dept);
		fd.append("section", section);
		fd.append("divsion", div);
		fd.append("grade", grade);
		fd.append("location", location);
		fd.append("currency", curr);
		fd.append("salary_type", type);
		fd.append("salary_from", from);
		fd.append("salary_to", to);
		fd.append("candidate_type", ctype);
		fd.append("visa_sponsorship", visa);
		fd.append("paid_relocation", relocation);

		// let fstring: never[] = [];
		// let fautharr = approval.split(",");
		// for (let i = 0; i < fautharr.length; i++) {
		// 	const searchString = fautharr[i];
		// 	const index = hmanage.indexOf(searchString);
		// 	if (index !== -1) {
		// 		fstring.push(hmanageID[index]);
		// 	}
		// }

		var fautharr = approval.split(",");
		var fstring = fautharr
			.map((searchString) => hmanageID[hmanage.indexOf(searchString)])
			.filter((value) => value !== -1);

		fd.append("authority", fstring.join("|"));

		if (offer.length <= 0) {
			fd.append("step", step);
			await axiosInstanceAuth2
				.post(`/job/create-offer/${arefid}/`, fd)
				.then(async (res) => {
					toastcomp("offer Sent", "success");
					console.log("@", "Offer Sent", res.data);
					offerDetail(arefid, currentApplicant);
					// setom(res.data);
				})
				.catch((err) => {
					toastcomp("offer Not Sent", "error");
					offerDetail(arefid, currentApplicant);
					// setom([]);
					console.log("@", "Offer Not Sent", err);
				});
		} else {
			await axiosInstanceAuth2
				.put(`/job/update-offer/${omrefid}/`, fd)
				.then(async (res) => {
					toastcomp("offer Updated", "success");
					offerDetail(arefid, currentApplicant);
					console.log("@", "Offer Updated", res.data);
					// setom(res.data);
				})
				.catch((err) => {
					toastcomp("offer Not Updated", "error");
					offerDetail(arefid, currentApplicant);
					// setom([]);
					console.log("@", "Offer Not Updated", err);
				});
		}
	}

	function updateOffer() {
		let html = bvalue;
		if (currentApplicant["type"] === "career") {
			if (
				currentApplicant["user"]["last_name"] &&
				currentApplicant["user"]["last_name"].length > 0 &&
				currentApplicant["user"]["first_name"] &&
				currentApplicant["user"]["first_name"].length > 0
			) {
				html = html.replaceAll(
					"[Candidate's Name]",
					`${currentApplicant["user"]["first_name"]}&nbsp;${currentApplicant["user"]["last_name"]}`
				);
			}
		} else if (currentApplicant["type"] === "vendor") {
			if (
				currentApplicant["applicant"]["last_name"] &&
				currentApplicant["applicant"]["last_name"].length > 0 &&
				currentApplicant["applicant"]["first_name"] &&
				currentApplicant["applicant"]["first_name"].length > 0
			) {
				html = html.replaceAll(
					"[Candidate's Name]",
					`${currentApplicant["applicant"]["first_name"]}&nbsp;${currentApplicant["applicant"]["last_name"]}`
				);
			}
		}
		if (designation && designation.length > 0) {
			html = html.replaceAll("[Designation]", designation);
		}
		if (dept && dept.length > 0) {
			html = html.replaceAll("[Department]", dept);
		}
		if (section && section.length > 0) {
			html = html.replaceAll("[Section]", section);
		}
		if (div && div.length > 0) {
			html = html.replaceAll("[Division]", div);
		}
		if (grade && grade.length > 0) {
			html = html.replaceAll("[Grade]", grade);
		}
		if (location && location.length > 0) {
			html = html.replaceAll("[Location]", location);
		}
		if (curr && curr.length > 0) {
			html = html.replaceAll("[Currency]", curr);
		}
		if (from && from.length > 0) {
			html = html.replaceAll("[Salary Range From]", from);
		}
		if (to && to.length > 0) {
			html = html.replaceAll("[Salary Range To]", to);
		}
		if (type && type.length > 0) {
			html = html.replaceAll("[Monthly/Yearly]", type);
		}
		if (ctype && ctype.length > 0) {
			html = html.replaceAll("[Candidate Type]", ctype);
		}
		if (visa && visa.length > 0) {
			html = html.replaceAll("[Visa Sponsorship]", visa);
		}
		if (relocation && relocation.length > 0) {
			html = html.replaceAll("[Paid Relocation]", relocation);
		}
		setvalue(html);
		seteditDetails(false);
	}

	async function updateOfferStep2(arefid: string) {
		html2canvas(document.getElementById("contentABC")).then(async function (canvas) {
			const pdf = new jspdf();

			pdf.setFontSize(12);
			pdf.setFont("times", "normal", "normal");
			// Add the canvas to the PDF document
			pdf.addImage(canvas.toDataURL("image/png"), "JPEG", 5, 5);

			const pdfContent = pdf.output("arraybuffer");

			const blob = new Blob([pdfContent], { type: "application/pdf" });

			const fd = new FormData();
			fd.append("designation", designation);
			fd.append("department", dept);
			fd.append("section", section);
			fd.append("divsion", div);
			fd.append("grade", grade);
			fd.append("location", location);
			fd.append("currency", curr);
			fd.append("salary_type", type);
			fd.append("salary_from", from);
			fd.append("salary_to", to);
			fd.append("candidate_type", ctype);
			fd.append("visa_sponsorship", visa);
			fd.append("paid_relocation", relocation);
			fd.append("step", 3);
			fd.append("offerLetter", blob, "converted.pdf");

			await axiosInstanceAuth2
				.put(`/job/update-offer-step2/${omrefid}/`, fd)
				.then(async (res) => {
					toastcomp("offer Updated", "success");
					console.log("@", "Offer Updated", res.data);
					// setom(res.data);
				})
				.catch((err) => {
					toastcomp("offer Not Updated", "error");
					// setom([]);
					console.log("@", "Offer Not Updated", err);
				});

			offerDetail(arefid, currentApplicant);
		});
	}

	const handleDownload = () => {
		// Convert the HTML to a canvas
		html2canvas(document.getElementById("contentABCD")).then(function (canvas) {
			const pdf = new jspdf();

			pdf.setFontSize(12);
			pdf.setFont("times", "normal", "normal");
			// Add the canvas to the PDF document
			pdf.addImage(canvas.toDataURL("image/png"), "JPEG", 5, 5);

			// Save the PDF document
			if (currentApplicant["type"] === "career") {
				pdf.save(`OfferLetter_${currentApplicant["user"]["first_name"]}_${currentApplicant["user"]["last_name"]}.pdf`);
			} else if (currentApplicant["type"] === "vendor") {
				pdf.save(
					`OfferLetter_${currentApplicant["applicant"]["first_name"]}_${currentApplicant["applicant"]["last_name"]}.pdf`
				);
			}
		});
	};

	return (
		<>
			<Head>
				<title>{t("Words.OfferManagement")}</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<Orgsidebar />
				<Orgtopbar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className="layoutWrap p-4 lg:p-8">
					{!upcomingSoon && (
						<div className="relative z-[10] flex flex-wrap items-center justify-between bg-white px-4 py-4 shadow-normal dark:bg-gray-800 lg:px-8">
							<div className="mr-3">
								<Listbox value={selectedPerson} onChange={setSelectedPerson}>
									<Listbox.Button className={"text-lg font-bold"}>
										{selectedPerson["name"]} <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
									</Listbox.Button>
									<Transition
										enter="transition duration-100 ease-out"
										enterFrom="transform scale-95 opacity-0"
										enterTo="transform scale-100 opacity-100"
										leave="transition duration-75 ease-out"
										leaveFrom="transform scale-100 opacity-100"
										leaveTo="transform scale-95 opacity-0"
									>
										<Listbox.Options
											className={
												"absolute left-0 top-[100%] mt-2 w-[250px] rounded-normal bg-white py-2 shadow-normal dark:bg-gray-700"
											}
										>
											{people.map((item) => (
												<Listbox.Option
													key={item.id}
													value={item}
													disabled={item.unavailable}
													className="clamp_1 relative cursor-pointer px-6 py-2 pl-8 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
												>
													{({ selected }) => (
														<>
															<span className={` ${selected ? "font-bold" : "font-normal"}`}>{item.name}</span>
															{selected ? (
																<span className="absolute left-3">
																	<i className="fa-solid fa-check"></i>
																</span>
															) : null}
														</>
													)}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</Transition>
								</Listbox>
							</div>
							<aside className="flex items-center">
								<TeamMembers alen={"5"} />
							</aside>
						</div>
					)}

					{applicantlist && applicantlist.length > 0 ? (
						<>
							<div className="relative z-[9] flex flex-wrap p-4 lg:p-8">
								<div className="mb-4 w-full xl:max-w-[280px]">
									<FormField
										fieldType="input"
										inputType="search"
										placeholder={t("Words.Search")}
										icon={<i className="fa-solid fa-magnifying-glass"></i>}
										value={search}
										handleChange={(e) => setsearch(e.target.value)}
									/>
									<div className="max-h-[400px] overflow-auto xl:max-h-[inherit]">
										{filterApplicants ? (
											filterApplicants.map((data, i) => (
												<div
													className="mb-4 cursor-pointer rounded-normal bg-white px-4 py-2 shadow-normal last:mb-0 dark:bg-gray-800"
													key={i}
													onClick={() => {
														offerDetail(data["arefid"], data);
													}}
												>
													<div className="mb-2 flex items-center justify-between">
														<aside className="flex items-center">
															<Image
																src={userImg1}
																alt="User"
																width={30}
																className="h-[30px] rounded-full object-cover"
															/>
															<h5 className="pl-4 text-sm font-semibold">
																{data["type"] === "career" && (
																	<>
																		{data["user"]["first_name"]} {data["user"]["last_name"]}
																	</>
																)}
																{data["type"] === "vendor" && (
																	<>
																		{data["applicant"]["first_name"]} {data["applicant"]["last_name"]}
																	</>
																)}
															</h5>
														</aside>
														<aside>
															{/* <Image src={socialIcon} alt="Social" className="h-[16px] w-auto" /> */}
															{data["type"]}
														</aside>
													</div>
													<p
														className="mb-2 cursor-pointer text-[12px] text-darkGray dark:text-gray-400"
														onClick={() => {
															navigator.clipboard.writeText(data["arefid"]);
															toastcomp("ID Copied to clipboard", "success");
														}}
													>
														ID - {data["arefid"]}
													</p>
													<div className="flex items-center justify-between">
														<aside className="flex items-center text-[12px] text-darkGray dark:text-gray-400">
															<i className="fa-solid fa-calendar-days mr-2 text-[16px]"></i>
															<p>{moment(data["timestamp"]).format("Do MMM YYYY")}</p>
														</aside>
														<span className="text-[10px] text-darkGray dark:text-gray-400">
															{moment(data["timestamp"]).format("h:mm a")}
														</span>
													</div>
												</div>
											))
										) : (
											<></>
										)}
									</div>
								</div>
								{stepform && (
									<div className="w-full xl:max-w-[calc(100%-280px)] xl:pl-6">
										<div className="rounded-normal border bg-white dark:border-gray-600 dark:bg-gray-800">
											<h2 className="flex justify-between px-10 py-4 text-lg font-bold">
												<span>
													{currentApplicant["user"] && (
														<>
															{currentApplicant["user"]["first_name"]}&nbsp;
															{currentApplicant["user"]["last_name"]}
														</>
													)}
													{currentApplicant["applicant"] && (
														<>
															{currentApplicant["applicant"]["first_name"]}&nbsp;
															{currentApplicant["applicant"]["last_name"]}
														</>
													)}
												</span>
												<button onClick={() => toastcomp(step, "success")}>STEP</button>
												<span>Source : {currentApplicant["type"]}</span>
											</h2>

											<Tab.Group>
												<Tab.List className={"border-b px-10 dark:border-b-gray-600"}>
													<Tab as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"mr-6 border-b-4 py-3 font-semibold focus:outline-none" +
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
													<Tab as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"mr-6 border-b-4 py-3 font-semibold focus:outline-none" +
																	" " +
																	(selected
																		? "border-primary text-primary dark:border-white dark:text-white"
																		: "border-transparent text-darkGray dark:text-gray-400")
																}
															>
																{t("Words.Timeline")}
															</button>
														)}
													</Tab>
												</Tab.List>
												<Tab.Panels>
													<Tab.Panel>
														{userRole != "Hiring Manager" && (
															<div className="mb-4 flex flex-wrap items-center justify-center border-b py-4 dark:border-b-gray-600">
																<div
																	className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
																	// onClick={() => setstep(1)}
																>
																	{(offer.length > 0 && offer[0]["step"] === 1) || (offer.length <= 0 && step === 1) ? (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																				<span className="text-[32px] font-bold text-white"> 1 </span>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold">
																				{t("Words.OfferPrepration")}
																			</p>
																		</>
																	) : (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																				{/* <span className="text-[32px] font-bold text-white"> 1 </span> */}
																				<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold">
																				{t("Words.OfferPrepration")}
																			</p>
																		</>
																	)}
																</div>
																<div
																	className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
																	// onClick={() => setstep(2)}
																>
																	{(offer.length > 0 && offer[0]["step"] === 2) || (offer.length <= 0 && step === 2) ? (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																				<span className="text-[32px] font-bold text-white"> 2 </span>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold">
																				{t("Words.OfferFinalization")}
																			</p>
																		</>
																	) : (offer.length > 0 && offer[0]["step"] > 2) || (offer.length <= 0 && step > 2) ? (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																				{/* <span className="text-[32px] font-bold text-white"> 2 </span> */}
																				<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold">
																				{t("Words.OfferFinalization")}
																			</p>
																		</>
																	) : (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white p-2 shadow-highlight dark:bg-gray-600">
																				<span className="text-[32px] font-bold text-darkGray dark:text-gray-400">
																					{" "}
																					2{" "}
																				</span>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold text-darkGray dark:text-gray-400">
																				{t("Words.OfferFinalization")}
																			</p>
																		</>
																	)}
																</div>
																<div
																	className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
																	// onClick={() => setstep(3)}
																>
																	{(offer.length > 0 && offer[0]["step"] === 3) || (offer.length <= 0 && step === 3) ? (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																				<span className="text-[32px] font-bold text-white"> 3 </span>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold">
																				{t("Words.OfferDiscussion")}
																			</p>
																		</>
																	) : (offer.length > 0 && offer[0]["step"] > 3) || (offer.length <= 0 && step > 3) ? (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																				{/* <span className="text-[32px] font-bold text-white"> 3 </span> */}
																				<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold">
																				{t("Words.OfferDiscussion")}
																			</p>
																		</>
																	) : (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white p-2 shadow-highlight dark:bg-gray-600">
																				<span className="text-[32px] font-bold text-darkGray dark:text-gray-400">
																					{" "}
																					3{" "}
																				</span>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold text-darkGray dark:text-gray-400">
																				{t("Words.OfferDiscussion")}
																			</p>
																		</>
																	)}
																</div>
																<div
																	className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
																	// onClick={() => setstep(4)}
																>
																	{(offer.length > 0 && offer[0]["step"] === 4) || (offer.length <= 0 && step === 4) ? (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																				<span className="text-[32px] font-bold text-white"> 4 </span>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold">
																				{t("Words.OfferStatus")}
																			</p>
																		</>
																	) : (offer.length > 0 && offer[0]["step"] > 4) || (offer.length <= 0 && step > 4) ? (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																				{/* <span className="text-[32px] font-bold text-white"> 4 </span> */}
																				<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold">
																				{t("Words.OfferStatus")}
																			</p>
																		</>
																	) : (
																		<>
																			<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white p-2 shadow-highlight dark:bg-gray-600">
																				<span className="text-[32px] font-bold text-darkGray dark:text-gray-400">
																					{" "}
																					4{" "}
																				</span>
																			</div>
																			<p className="relative z-10 text-center text-sm font-bold text-darkGray dark:text-gray-400">
																				{t("Words.OfferStatus")}
																			</p>
																		</>
																	)}
																</div>
															</div>
														)}

														{userRole === "Hiring Manager" ? (
															<section className="px-10 py-6">
																{offer.length > 0 ? (
																	<>
																		<div className="-mx-3 flex flex-wrap">
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t("Form.Designation")}
																					fieldType="input"
																					inputType="text"
																					value={designation}
																					handleChange={(e) => setdesignation(e.target.value)}
																					required
																					readOnly
																				/>
																			</div>
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t("Words.Department")}
																					fieldType="input"
																					inputType="text"
																					value={dept}
																					handleChange={(e) => setdept(e.target.value)}
																					required
																					readOnly
																				/>
																			</div>
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t("Form.Section")}
																					fieldType="input"
																					inputType="text"
																					value={section}
																					handleChange={(e) => setsection(e.target.value)}
																					required
																					readOnly
																				/>
																			</div>
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t("Words.Division")}
																					fieldType="input"
																					inputType="text"
																					value={div}
																					handleChange={(e) => setdiv(e.target.value)}
																					required
																					readOnly
																				/>
																			</div>
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t("Form.Grade")}
																					fieldType="input"
																					inputType="text"
																					value={grade}
																					handleChange={(e) => setgrade(e.target.value)}
																					required
																					readOnly
																				/>
																			</div>
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t("Form.Location")}
																					fieldType="input"
																					inputType="text"
																					value={location}
																					handleChange={(e) => setlocation(e.target.value)}
																					required
																					readOnly
																				/>
																			</div>
																		</div>
																		<div className="">
																			<h4 className="mb-2 font-bold">
																				{t("Form.SalaryRange")}
																				<sup className="text-red-500">*</sup>
																			</h4>
																			<div className="flex flex-wrap">
																				<div className="mb-4 w-[170px] pr-6 last:pr-0">
																					<FormField
																						placeholder={t("Words.Currency")}
																						fieldType="select2"
																						singleSelect
																						value={curr}
																						readOnly
																						handleChange={setcurr}
																						options={[
																							"USD $",
																							"CAD CA$",
																							"EUR €",
																							"AED AED",
																							"AFN Af",
																							"ALL ALL",
																							"AMD AMD",
																							"ARS AR$",
																							"AUD AU$",
																							"AZN man.",
																							"BAM KM",
																							"BDT Tk",
																							"BGN BGN",
																							"BHD BD",
																							"BIF FBu",
																							"BND BN$",
																							"BOB Bs",
																							"BRL R$",
																							"BWP BWP",
																							"BYN Br",
																							"BZD BZ$",
																							"CDF CDF",
																							"CHF CHF",
																							"CLP CL$",
																							"CNY CN¥",
																							"COP CO$",
																							"CRC ₡",
																							"CVE CV$",
																							"CZK Kč",
																							"DJF Fdj",
																							"DKK Dkr",
																							"DOP RD$",
																							"DZD DA",
																							"EEK Ekr",
																							"EGP EGP",
																							"ERN Nfk",
																							"ETB Br",
																							"GBP £",
																							"GEL GEL",
																							"GHS GH₵",
																							"GNF FG",
																							"GTQ GTQ",
																							"HKD HK$",
																							"HNL HNL",
																							"HRK kn",
																							"HUF Ft",
																							"IDR Rp",
																							"ILS ₪",
																							"INR ₹",
																							"IQD IQD",
																							"IRR IRR",
																							"ISK Ikr",
																							"JMD J$",
																							"JOD JD",
																							"JPY ¥",
																							"KES Ksh",
																							"KHR KHR",
																							"KMF CF",
																							"KRW ₩",
																							"KWD KD",
																							"KZT KZT",
																							"LBP L.L.",
																							"LKR SLRs",
																							"LTL Lt",
																							"LVL Ls",
																							"LYD LD",
																							"MAD MAD",
																							"MDL MDL",
																							"MGA MGA",
																							"MKD MKD",
																							"MMK MMK",
																							"MOP MOP$",
																							"MUR MURs",
																							"MXN MX$",
																							"MYR RM",
																							"MZN MTn",
																							"NAD N$",
																							"NGN ₦",
																							"NIO C$",
																							"NOK Nkr",
																							"NPR NPRs",
																							"NZD NZ$",
																							"OMR OMR",
																							"PAB B/.",
																							"PEN S/.",
																							"PHP ₱",
																							"PKR PKRs",
																							"PLN zł",
																							"PYG ₲",
																							"QAR QR",
																							"RON RON",
																							"RSD din.",
																							"RUB RUB",
																							"RWF RWF",
																							"SAR SR",
																							"SDG SDG",
																							"SEK Skr",
																							"SGD S$",
																							"SOS Ssh",
																							"SYP SY£",
																							"THB ฿",
																							"TND DT",
																							"TOP T$",
																							"TRY TL",
																							"TTD TT$",
																							"TWD NT$",
																							"TZS TSh",
																							"UAH ₴",
																							"UGX USh",
																							"UYU $U",
																							"UZS UZS",
																							"VEF Bs.F.",
																							"VND ₫",
																							"XAF FCFA",
																							"XOF CFA",
																							"YER YR",
																							"ZAR R",
																							"ZMK ZK",
																							"ZWL ZWL$"
																						]}
																					/>
																				</div>
																				<div className="mb-4 w-[170px] pr-6 last:pr-0">
																					<FormField
																						placeholder={t("Words.Type")}
																						singleSelect
																						fieldType="select2"
																						options={[t("Form.Monthly"), t("Form.Yearly")]}
																						value={type}
																						handleChange={settype}
																						readOnly
																					/>
																				</div>
																				<div className="mb-4 grow pr-6 last:pr-0">
																					<FormField
																						placeholder={t("Words.From")}
																						fieldType="input"
																						inputType="number"
																						value={from}
																						handleChange={(e) => setfrom(e.target.value)}
																						readOnly
																					/>
																				</div>
																				<div className="mb-4 grow pr-6 last:pr-0">
																					<FormField
																						placeholder={t("Words.To")}
																						fieldType="input"
																						inputType="number"
																						value={to}
																						handleChange={(e) => setto(e.target.value)}
																						readOnly
																					/>
																				</div>
																			</div>
																		</div>
																		<FormField
																			label={t("Form.CandidateType")}
																			singleSelect
																			fieldType="select2"
																			options={[t("Select.FullTime"), t("Select.PartTime"), t("Select.Internship")]}
																			value={ctype}
																			handleChange={setctype}
																			required
																			readOnly
																		/>
																		<div className="flex flex-wrap">
																			<div className="grow pr-6 last:pr-0">
																				<FormField
																					label={t("Words.VisaSponsorship")}
																					singleSelect
																					fieldType="select2"
																					options={[t("Select.Yes"), t("Select.No"), "N/A"]}
																					value={visa}
																					handleChange={setvisa}
																					required
																					readOnly
																				/>
																			</div>
																			<div className="grow pr-6 last:pr-0">
																				<FormField
																					label={t("Words.PaidRelocation")}
																					singleSelect
																					fieldType="select2"
																					options={[t("Select.Yes"), t("Select.No"), "N/A"]}
																					value={relocation}
																					handleChange={setrelocation}
																					required
																					readOnly
																				/>
																			</div>
																		</div>
																		<FormField
																			label={t("Form.ApprovalAuthorities")}
																			fieldType="select2"
																			options={hmanage}
																			value={approval}
																			handleChange={setapproval}
																			required
																			readOnly
																		/>

																		<hr />

																		<h4 className="mb-2 mt-6 font-bold">{t("Form.Feedback")}</h4>
																		<FormField
																			placeholder={t("Form.WriteFeedback")}
																			fieldType="textarea"
																			value={feedback}
																			handleChange={(e) => setfeedback(e.target.value)}
																		/>

																		<div className="flex flex-wrap gap-2">
																			<Button
																				label={t("Btn.Approve")}
																				btnStyle="success"
																				btnType={"button"}
																				handleClick={() => newOfferFeedback("Approve")}
																			/>

																			<Button
																				label={t("Btn.Reject")}
																				btnType={"button"}
																				btnStyle="danger"
																				disabled={!rejectVerify()}
																				handleClick={() => newOfferFeedback("Reject")}
																			/>
																		</div>
																	</>
																) : (
																	<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																		<i className="fa-solid fa-magnifying-glass mb-2 text-[40px]"></i>
																		<p className="text-lg text-yellow-700">{t("Words.OfferNotYetCreated")}</p>
																		<p className="text-sm">{t("Words.UnderDevelopment")}</p>
																	</div>
																)}
															</section>
														) : (
															<>
																{(offer.length > 0 && offer[0]["step"] === 1) || (offer.length <= 0 && step === 1) ? (
																	<section className="px-10 py-6">
																		{offer.length <= 0 || feedreject ? (
																			<>
																				{omf &&
																					omf.length > 0 &&
																					omf.map((data, i) =>
																						data["status"] === "Reject" ? (
																							<div className="mb-6 rounded-normal bg-red-100 px-6 py-4" key={i}>
																								<div className="flex flex-wrap items-center justify-between font-bold">
																									<p className="mb-1 text-red-700">
																										<i className="fa-regular fa-face-frown"></i> {t("Form.Rejected")} (
																										{data["organization"]["email"]})
																									</p>
																									<p className="text-[12px] text-darkGray">
																										{moment(data["timestamp"]).fromNow()}
																									</p>
																								</div>
																								<h5 className="mt-2 font-semibold text-black">{t("Form.Feedback")}:</h5>
																								<p className="mb-2 text-sm text-darkGray">{data["feedback"]}</p>
																							</div>
																						) : (
																							<div className="mb-6 rounded-normal bg-green-100 px-6 py-4" key={i}>
																								<div className="flex flex-wrap items-center justify-between font-bold">
																									<p className="mb-1 text-green-700">
																										<i className="fa-regular fa-face-smile"></i> {t("Form.Approved")} (
																										{data["organization"]["email"]})
																									</p>
																									<p className="text-[12px] text-darkGray">
																										{moment(data["timestamp"]).fromNow()}
																									</p>
																								</div>
																								<h5 className="mt-2 font-semibold text-black">{t("Form.Feedback")}:</h5>
																								<p className="mb-2 text-sm text-darkGray">{data["feedback"]}</p>
																							</div>
																						)
																					)}

																				<div className="-mx-3 flex flex-wrap">
																					<div className="mb-4 w-full px-3 md:max-w-[50%]">
																						<FormField
																							label={t("Form.Designation")}
																							fieldType="input"
																							inputType="text"
																							value={designation}
																							handleChange={(e) => setdesignation(e.target.value)}
																							required
																						/>
																					</div>
																					<div className="mb-4 w-full px-3 md:max-w-[50%]">
																						<FormField
																							label={t("Words.Department")}
																							fieldType="input"
																							inputType="text"
																							value={dept}
																							handleChange={(e) => setdept(e.target.value)}
																							required
																						/>
																					</div>
																					<div className="mb-4 w-full px-3 md:max-w-[50%]">
																						<FormField
																							label={t("Form.Section")}
																							fieldType="input"
																							inputType="text"
																							value={section}
																							handleChange={(e) => setsection(e.target.value)}
																							required
																						/>
																					</div>
																					<div className="mb-4 w-full px-3 md:max-w-[50%]">
																						<FormField
																							label={t("Words.Division")}
																							fieldType="input"
																							inputType="text"
																							value={div}
																							handleChange={(e) => setdiv(e.target.value)}
																							required
																						/>
																					</div>
																					<div className="mb-4 w-full px-3 md:max-w-[50%]">
																						<FormField
																							label={t("Form.Grade")}
																							fieldType="input"
																							inputType="text"
																							value={grade}
																							handleChange={(e) => setgrade(e.target.value)}
																							required
																						/>
																					</div>
																					<div className="mb-4 w-full px-3 md:max-w-[50%]">
																						<FormField
																							label={t("Form.Location")}
																							fieldType="input"
																							inputType="text"
																							value={location}
																							handleChange={(e) => setlocation(e.target.value)}
																							required
																						/>
																					</div>
																				</div>
																				<div className="">
																					<h4 className="mb-2 font-bold">
																						{t("Form.SalaryRange")}
																						<sup className="text-red-500">*</sup>
																					</h4>
																					<div className="-mx-3 flex flex-wrap">
																						<div className="mb-4 w-[50%] px-3 xl:max-w-[20%]">
																							<FormField
																								placeholder={t("Words.Currency")}
																								fieldType="select2"
																								singleSelect
																								value={curr}
																								handleChange={setcurr}
																								options={[
																									"USD $",
																									"CAD CA$",
																									"EUR €",
																									"AED AED",
																									"AFN Af",
																									"ALL ALL",
																									"AMD AMD",
																									"ARS AR$",
																									"AUD AU$",
																									"AZN man.",
																									"BAM KM",
																									"BDT Tk",
																									"BGN BGN",
																									"BHD BD",
																									"BIF FBu",
																									"BND BN$",
																									"BOB Bs",
																									"BRL R$",
																									"BWP BWP",
																									"BYN Br",
																									"BZD BZ$",
																									"CDF CDF",
																									"CHF CHF",
																									"CLP CL$",
																									"CNY CN¥",
																									"COP CO$",
																									"CRC ₡",
																									"CVE CV$",
																									"CZK Kč",
																									"DJF Fdj",
																									"DKK Dkr",
																									"DOP RD$",
																									"DZD DA",
																									"EEK Ekr",
																									"EGP EGP",
																									"ERN Nfk",
																									"ETB Br",
																									"GBP £",
																									"GEL GEL",
																									"GHS GH₵",
																									"GNF FG",
																									"GTQ GTQ",
																									"HKD HK$",
																									"HNL HNL",
																									"HRK kn",
																									"HUF Ft",
																									"IDR Rp",
																									"ILS ₪",
																									"INR ₹",
																									"IQD IQD",
																									"IRR IRR",
																									"ISK Ikr",
																									"JMD J$",
																									"JOD JD",
																									"JPY ¥",
																									"KES Ksh",
																									"KHR KHR",
																									"KMF CF",
																									"KRW ₩",
																									"KWD KD",
																									"KZT KZT",
																									"LBP L.L.",
																									"LKR SLRs",
																									"LTL Lt",
																									"LVL Ls",
																									"LYD LD",
																									"MAD MAD",
																									"MDL MDL",
																									"MGA MGA",
																									"MKD MKD",
																									"MMK MMK",
																									"MOP MOP$",
																									"MUR MURs",
																									"MXN MX$",
																									"MYR RM",
																									"MZN MTn",
																									"NAD N$",
																									"NGN ₦",
																									"NIO C$",
																									"NOK Nkr",
																									"NPR NPRs",
																									"NZD NZ$",
																									"OMR OMR",
																									"PAB B/.",
																									"PEN S/.",
																									"PHP ₱",
																									"PKR PKRs",
																									"PLN zł",
																									"PYG ₲",
																									"QAR QR",
																									"RON RON",
																									"RSD din.",
																									"RUB RUB",
																									"RWF RWF",
																									"SAR SR",
																									"SDG SDG",
																									"SEK Skr",
																									"SGD S$",
																									"SOS Ssh",
																									"SYP SY£",
																									"THB ฿",
																									"TND DT",
																									"TOP T$",
																									"TRY TL",
																									"TTD TT$",
																									"TWD NT$",
																									"TZS TSh",
																									"UAH ₴",
																									"UGX USh",
																									"UYU $U",
																									"UZS UZS",
																									"VEF Bs.F.",
																									"VND ₫",
																									"XAF FCFA",
																									"XOF CFA",
																									"YER YR",
																									"ZAR R",
																									"ZMK ZK",
																									"ZWL ZWL$"
																								]}
																							/>
																						</div>
																						<div className="mb-4 w-[50%] px-3 xl:max-w-[20%]">
																							<FormField
																								placeholder={t("Words.Type")}
																								singleSelect
																								fieldType="select2"
																								options={["Monthly", "Yearly"]}
																								value={type}
																								handleChange={settype}
																							/>
																						</div>
																						<div className="mb-4 w-[50%] px-3 xl:max-w-[30%]">
																							<FormField
																								placeholder={t("Words.From")}
																								fieldType="input"
																								inputType="number"
																								value={from}
																								handleChange={(e) => setfrom(e.target.value)}
																							/>
																						</div>
																						<div className="mb-4 w-[50%] px-3 xl:max-w-[30%]">
																							<FormField
																								placeholder={t("Words.To")}
																								fieldType="input"
																								inputType="number"
																								value={to}
																								handleChange={(e) => setto(e.target.value)}
																							/>
																						</div>
																					</div>
																				</div>
																				<FormField
																					label={t("Form.CandidateType")}
																					singleSelect
																					fieldType="select2"
																					options={[t("Select.FullTime"), t("Select.PartTime"), t("Select.Internship")]}
																					value={ctype}
																					handleChange={setctype}
																					required
																				/>
																				<div className="flex flex-wrap">
																					<div className="mb-4 grow pr-6 last:pr-0">
																						<FormField
																							label={t("Words.VisaSponsorship")}
																							singleSelect
																							fieldType="select2"
																							options={[t("Select.Yes"), t("Select.No"), "N/A"]}
																							value={visa}
																							handleChange={setvisa}
																							required
																						/>
																					</div>
																					<div className="mb-4 grow pr-6 last:pr-0">
																						<FormField
																							label={t("Words.PaidRelocation")}
																							singleSelect
																							fieldType="select2"
																							options={[t("Select.Yes"), t("Select.No"), "N/A"]}
																							value={relocation}
																							handleChange={setrelocation}
																							required
																						/>
																					</div>
																				</div>
																				<FormField
																					label={t("Form.ApprovalAuthorities")}
																					fieldType="select2"
																					options={hmanage}
																					value={approval}
																					handleChange={setapproval}
																					required
																				/>

																				<Button
																					label={
																						offer.length <= 0 ? t("Btn.SendForApproval") : t("Btn.ReSendForApproval")
																					}
																					btnType={"button"}
																					disabled={!checkBtnOffer()}
																					handleClick={() => handleOfferManagement(currentApplicant["arefid"])}
																				/>
																			</>
																		) : omf && omf.length > 0 ? (
																			<>
																				{omf.map((data, i) => (
																					<div className="mb-6 rounded-normal bg-green-100 px-6 py-4" key={i}>
																						<div className="flex flex-wrap items-center justify-between font-bold">
																							<p className="mb-1 text-green-700">
																								<i className="fa-regular fa-face-smile"></i> {t("Form.Approved")} (
																								{data["organization"]["email"]})
																							</p>
																							<p className="text-[12px] text-darkGray">
																								{moment(data["timestamp"]).fromNow()}
																							</p>
																						</div>
																						<h5 className="mt-2 font-semibold text-black">{t("Form.Feedback")}:</h5>
																						<p className="mb-2 text-sm text-darkGray">
																							{data["feedback"].length > 0 ? data["feedback"] : <>N/A</>}
																						</p>
																					</div>
																				))}
																				{approval
																					.split(",")
																					.filter(
																						(email) => !omf.some((item) => item["organization"]["email"] === email)
																					).length > 0 ? (
																					<>
																						<p className="">Remaining Approval Authroties Who Not GIve Feedback :</p>
																						{approval
																							.split(",")
																							.filter(
																								(email) => !omf.some((item) => item["organization"]["email"] === email)
																							)
																							.map((data, i) => (
																								<p key={i} className="text-sm">
																									{i + 1}) {data}
																								</p>
																							))}
																					</>
																				) : (
																					<p className="text-center text-sm">
																						All Approval Authroties Give There Feedback Positive
																					</p>
																				)}{" "}
																				<Button
																					label={t("Btn.Next")}
																					btnType={"button"}
																					disabled={!nextstep1Verify()}
																					handleClick={() => updateStep(2)}
																					// handleClick={() => {
																					// loadOrganizationProfile();
																					// setstep(2);
																					// }}
																				/>
																			</>
																		) : (
																			<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																				<i className="fa-solid fa-magnifying-glass mb-2 text-[40px]"></i>
																				<p className="text-lg text-yellow-700">{t("Words.OfferSentSuccessfully")}</p>
																				<p className="text-sm">{t("Words.UnderReview")}</p>
																			</div>
																		)}
																	</section>
																) : (
																	<></>
																)}

																{(offer.length > 0 && offer[0]["step"] === 2) || (offer.length <= 0 && step === 2) ? (
																	<section className="px-10 py-6">
																		{wordpath === "" && (
																			<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																				<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																				<p className="text-lg">{t("Words.OfferLetterFomratPending")}</p>
																				<small className="font-semibold">
																					{t("Words.KindlyContactYourOrgSuperAdminATS")}
																				</small>
																			</div>
																		)}
																		{value && value.length > 0 && word != null ? (
																			<>
																				<div className="border py-2">
																					<article
																						className="m-6"
																						ref={htmlRef}
																						id="contentABC"
																						dangerouslySetInnerHTML={{ __html: value }}
																					></article>
																				</div>
																				<div className="flex flex-wrap items-center justify-between px-8 pt-4">
																					<div className="my-1 mr-4 last:mr-0">
																						<Button
																							label={t("Btn.Confirm")}
																							btnType="button"
																							handleClick={() => updateOfferStep2(currentApplicant["arefid"])}
																						/>
																					</div>
																					<div className="my-1 mr-4 last:mr-0">
																						<Button
																							btnStyle="gray"
																							label={t("Btn.Edit")}
																							btnType="button"
																							handleClick={() => seteditDetails(true)}
																						/>
																					</div>
																				</div>
																			</>
																		) : (
																			<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																				<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																				<p className="text-lg">Server Error</p>
																				<small className="font-semibold">
																					Try Again Or Change Offer Letter Format For That Contact Super Admin
																				</small>
																			</div>
																		)}
																	</section>
																) : (
																	<></>
																)}

																{(offer.length > 0 && offer[0]["step"] === 3) || (offer.length <= 0 && step === 3) ? (
																	<section className="px-10 py-6">
																		{word != null && (
																			<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
																				<p className="my-2">{t("Words.OfferLetter")}</p>
																				<button
																					className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																					onClick={handleDownload}
																				>
																					<i className="fa-solid fa-download mr-2"></i>
																					{t("Btn.Download")}
																				</button>
																			</div>
																		)}
																		{value && value.length > 0 && word != null && (
																			<>
																				<div className="border py-2">
																					<article
																						className="m-6"
																						ref={htmlRef}
																						id="contentABCD"
																						dangerouslySetInnerHTML={{ __html: value }}
																					></article>
																				</div>
																				<div className="px-8 pt-4 text-center">
																					<Button
																						label={"Schedule Offer Call"}
																						btnType="button"
																						handleClick={() => setIsCalendarOpen(true)}
																					/>
																				</div>
																			</>
																		)}
																	</section>
																) : (
																	<></>
																)}
															</>
														)}
													</Tab.Panel>
													<Tab.Panel>
														{upcomingSoon ? (
															<>
																<UpcomingComp />
															</>
														) : (
															<div className="px-10">
																<div className="relative max-h-[455px] overflow-y-auto before:absolute before:left-[80px] before:top-0 before:h-[100%] before:w-[1px] before:bg-gray-600 before:bg-slate-200 before:content-['']">
																	{Array(2).fill(
																		<div className="flex items-start">
																			<div className="w-[80px] px-2 py-4">
																				<p className="text-sm text-darkGray dark:text-gray-400">
																					<Skeleton width={30} />
																					<Skeleton width={55} />
																				</p>
																			</div>
																			<div className="w-[calc(100%-80px)] pl-6">
																				<div className="border-b dark:border-b-gray-600">
																					<article className="py-4">
																						<h6 className="text-sm font-bold">
																							<Skeleton width={70 + "%"} />
																						</h6>
																						<p className="text-[12px] text-darkGray dark:text-gray-400">
																							<Skeleton width={20 + "%"} />
																						</p>
																					</article>
																				</div>
																			</div>
																		</div>
																	)}
																	<div className="flex items-start">
																		<div className="w-[80px] px-2 py-4">
																			<p className="text-sm text-darkGray dark:text-gray-400">
																				8 Feb
																				<br />
																				<small>2:30 PM</small>
																			</p>
																		</div>
																		<div className="w-[calc(100%-80px)] pl-6">
																			<div className="border-b dark:border-b-gray-600">
																				<article className="py-4">
																					<h6 className="mb-2 text-sm font-bold">
																						Applicant has been shifted to new Job -Software Engineer
																					</h6>
																					<p className="text-[12px] text-darkGray dark:text-gray-400">
																						By - Steve Paul : Collaborator
																					</p>
																				</article>
																			</div>
																		</div>
																	</div>
																	<div className="flex items-start">
																		<div className="w-[80px] px-2 py-4">
																			<p className="text-sm text-darkGray dark:text-gray-400">
																				8 Feb
																				<br />
																				<small>2:30 PM</small>
																			</p>
																		</div>
																		<div className="w-[calc(100%-80px)] pl-6">
																			<div className="border-b dark:border-b-gray-600">
																				<article className="py-4">
																					<h6 className="mb-2 text-sm font-bold">
																						Applicant has been shifted to new Job -Software Engineer
																					</h6>
																					<p className="text-[12px] text-darkGray dark:text-gray-400">
																						By - Steve Paul : Collaborator
																					</p>
																				</article>
																				<article className="py-4">
																					<h6 className="mb-2 text-sm font-bold">
																						Applicant has been shifted to new Job -Software Engineer
																					</h6>
																					<p className="text-[12px] text-darkGray dark:text-gray-400">
																						By - Steve Paul : Collaborator
																					</p>
																				</article>
																			</div>
																		</div>
																	</div>
																	<div className="flex items-start">
																		<div className="w-[80px] px-2 py-4">
																			<p className="text-sm text-darkGray dark:text-gray-400">
																				8 Feb
																				<br />
																				<small>2:30 PM</small>
																			</p>
																		</div>
																		<div className="w-[calc(100%-80px)] pl-6">
																			<div className="border-b dark:border-b-gray-600">
																				<article className="py-4">
																					<h6 className="mb-2 text-sm font-bold">
																						Applicant has been shifted to new Job -Software Engineer
																					</h6>
																					<p className="text-[12px] text-darkGray dark:text-gray-400">
																						By - Steve Paul : Collaborator
																					</p>
																				</article>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														)}
													</Tab.Panel>
												</Tab.Panels>
											</Tab.Group>
										</div>
									</div>
								)}
							</div>
						</>
					) : (
						<>
							<div className="w-full rounded-normal border bg-white shadow-normal dark:border-gray-600 dark:bg-gray-800 xl:max-w-[calc(100%)] xl:pl-8 2xl:max-w-[calc(100%)]">
								<div className="h-[calc(100vh-185px)] overflow-y-auto px-8">
									<div className="flex min-h-full items-center justify-center">
										{loader ? (
											<div className="mx-auto w-full max-w-[300px] py-8 text-center">
												<i className="fa-solid fa-spinner fa-spin"></i>
												<p className="my-2 font-bold">Kindly hold on for a moment while we process your request.</p>
											</div>
										) : (
											<div className="mx-auto w-full max-w-[300px] py-8 text-center">
												<div className="mb-6 p-2">
													<Image
														src={noInterviewdata}
														alt="No Data"
														width={300}
														className="mx-auto max-h-[200px] w-auto max-w-[200px]"
													/>
												</div>
												<h5 className="mb-4 text-lg font-semibold">No Offer Stage Applicants</h5>
												<p className="mb-2 text-sm text-darkGray">
													There are no Applicants are in Offer Stage
													<br />
													that moment can not able to create Offer
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</main>

			<Transition.Root show={editDetails} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={seteditDetails}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-6xl">
									<div className="px-8 py-2 text-right">
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => seteditDetails(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8 pt-0">
										<h4 className="text-3xl font-bold">{t("Words.EditOfferDetails")}</h4>
										<hr className="mb-4" />
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.Designation")}
													fieldType="input"
													inputType="text"
													value={designation}
													handleChange={(e) => setdesignation(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Words.Department")}
													fieldType="input"
													inputType="text"
													value={dept}
													handleChange={(e) => setdept(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.Section")}
													fieldType="input"
													inputType="text"
													value={section}
													handleChange={(e) => setsection(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Words.Division")}
													fieldType="input"
													inputType="text"
													value={div}
													handleChange={(e) => setdiv(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.Grade")}
													fieldType="input"
													inputType="text"
													value={grade}
													handleChange={(e) => setgrade(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t("Form.Location")}
													fieldType="input"
													inputType="text"
													value={location}
													handleChange={(e) => setlocation(e.target.value)}
													required
												/>
											</div>
										</div>
										<div className="">
											<h4 className="mb-2 font-bold">
												{t("Form.SalaryRange")}
												<sup className="text-red-500">*</sup>
											</h4>
											<div className="flex flex-wrap">
												<div className="mb-4 w-[170px] pr-6 last:pr-0">
													<FormField
														placeholder={t("Words.Currency")}
														fieldType="select2"
														singleSelect
														value={curr}
														handleChange={setcurr}
														options={[
															"USD $",
															"CAD CA$",
															"EUR €",
															"AED AED",
															"AFN Af",
															"ALL ALL",
															"AMD AMD",
															"ARS AR$",
															"AUD AU$",
															"AZN man.",
															"BAM KM",
															"BDT Tk",
															"BGN BGN",
															"BHD BD",
															"BIF FBu",
															"BND BN$",
															"BOB Bs",
															"BRL R$",
															"BWP BWP",
															"BYN Br",
															"BZD BZ$",
															"CDF CDF",
															"CHF CHF",
															"CLP CL$",
															"CNY CN¥",
															"COP CO$",
															"CRC ₡",
															"CVE CV$",
															"CZK Kč",
															"DJF Fdj",
															"DKK Dkr",
															"DOP RD$",
															"DZD DA",
															"EEK Ekr",
															"EGP EGP",
															"ERN Nfk",
															"ETB Br",
															"GBP £",
															"GEL GEL",
															"GHS GH₵",
															"GNF FG",
															"GTQ GTQ",
															"HKD HK$",
															"HNL HNL",
															"HRK kn",
															"HUF Ft",
															"IDR Rp",
															"ILS ₪",
															"INR ₹",
															"IQD IQD",
															"IRR IRR",
															"ISK Ikr",
															"JMD J$",
															"JOD JD",
															"JPY ¥",
															"KES Ksh",
															"KHR KHR",
															"KMF CF",
															"KRW ₩",
															"KWD KD",
															"KZT KZT",
															"LBP L.L.",
															"LKR SLRs",
															"LTL Lt",
															"LVL Ls",
															"LYD LD",
															"MAD MAD",
															"MDL MDL",
															"MGA MGA",
															"MKD MKD",
															"MMK MMK",
															"MOP MOP$",
															"MUR MURs",
															"MXN MX$",
															"MYR RM",
															"MZN MTn",
															"NAD N$",
															"NGN ₦",
															"NIO C$",
															"NOK Nkr",
															"NPR NPRs",
															"NZD NZ$",
															"OMR OMR",
															"PAB B/.",
															"PEN S/.",
															"PHP ₱",
															"PKR PKRs",
															"PLN zł",
															"PYG ₲",
															"QAR QR",
															"RON RON",
															"RSD din.",
															"RUB RUB",
															"RWF RWF",
															"SAR SR",
															"SDG SDG",
															"SEK Skr",
															"SGD S$",
															"SOS Ssh",
															"SYP SY£",
															"THB ฿",
															"TND DT",
															"TOP T$",
															"TRY TL",
															"TTD TT$",
															"TWD NT$",
															"TZS TSh",
															"UAH ₴",
															"UGX USh",
															"UYU $U",
															"UZS UZS",
															"VEF Bs.F.",
															"VND ₫",
															"XAF FCFA",
															"XOF CFA",
															"YER YR",
															"ZAR R",
															"ZMK ZK",
															"ZWL ZWL$"
														]}
													/>
												</div>
												<div className="mb-4 w-[170px] pr-6 last:pr-0">
													<FormField
														placeholder={t("Words.Type")}
														singleSelect
														fieldType="select2"
														options={["Monthly", "Yearly"]}
														value={type}
														handleChange={settype}
													/>
												</div>
												<div className="mb-4 grow pr-6 last:pr-0">
													<FormField
														placeholder={t("Words.From")}
														fieldType="input"
														inputType="number"
														value={from}
														handleChange={(e) => setfrom(e.target.value)}
													/>
												</div>
												<div className="mb-4 grow pr-6 last:pr-0">
													<FormField
														placeholder={t("Words.To")}
														fieldType="input"
														inputType="number"
														value={to}
														handleChange={(e) => setto(e.target.value)}
													/>
												</div>
											</div>
										</div>
										<FormField
											label={t("Form.CandidateType")}
											singleSelect
											fieldType="select2"
											options={[t("Select.FullTime"), t("Select.PartTime"), t("Select.Internship")]}
											value={ctype}
											handleChange={setctype}
											required
										/>
										<div className="flex flex-wrap">
											<div className="grow pr-6 last:pr-0">
												<FormField
													label={t("Words.VisaSponsorship")}
													singleSelect
													fieldType="select2"
													options={[t("Select.Yes"), t("Select.No"), "N/A"]}
													value={visa}
													handleChange={setvisa}
													required
												/>
											</div>
											<div className="grow pr-6 last:pr-0">
												<FormField
													label={t("Words.PaidRelocation")}
													singleSelect
													fieldType="select2"
													options={[t("Select.Yes"), t("Select.No"), "N/A"]}
													value={relocation}
													handleChange={setrelocation}
													required
												/>
											</div>
										</div>
										<hr className="mb-5 mt-5" />
										<Button
											label={t("Btn.Update")}
											btnType={"button"}
											disabled={!checkBtnOffer1()}
											handleClick={() => updateOffer()}
										/>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={isCalendarOpen} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setIsCalendarOpen}>
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
								{integration && integration.length <= 0 ? (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-md">
										<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
											<h4 className="font-semibold leading-none">Integrate Calendar</h4>
											<button
												type="button"
												className="leading-none hover:text-gray-700"
												onClick={() => setIsCalendarOpen(false)}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										</div>
										<div className="p-8">
											<div className="flex flex-wrap">
												{CalendarIntegrationOptions.map((integration, i) => (
													<div key={i} className="my-2 w-full overflow-hidden rounded-normal border">
														<Link
															href={integration.link}
															className="flex w-full items-center justify-between p-4 hover:bg-lightBlue"
														>
															<Image
																src={integration.icon}
																alt={integration.provider}
																width={150}
																className="mr-4 max-h-[24px] w-auto"
															/>
															<span className="min-w-[60px] rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-2 py-1 text-[12px] text-white hover:from-gradDarkBlue hover:to-gradDarkBlue">
																{`Integrate ${integration.provider}`}
															</span>
														</Link>
													</div>
												))}
											</div>
										</div>
									</Dialog.Panel>
								) : (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-md">
										<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
											<h4 className="font-semibold leading-none">Schedule Offer Call</h4>
											<button
												type="button"
												className="leading-none hover:text-gray-700"
												onClick={() => setIsCalendarOpen(false)}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										</div>
										<div className="p-8">
											<TImeSlot
												cardarefid={currentApplicant["arefid"]}
												axiosInstanceAuth2={axiosInstanceAuth2}
												setIsCalendarOpen={setIsCalendarOpen}
												type={"offer"}
											/>
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
