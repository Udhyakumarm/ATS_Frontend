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
import socialIcon from "public/images/social/linkedin-icon.png";
import Button from "@/components/Button";
import Link from "next/link";
import successGraphic from "public/images/success-graphic.png";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import moment from "moment";
import toastcomp from "@/components/toast";
import { useUserStore } from "@/utils/code";
import mammoth from "mammoth";
// import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useLangStore } from "@/utils/code";

const people = [
	{ id: 1, name: "All", unavailable: false },
	{ id: 2, name: "Software Developer", unavailable: false },
	{ id: 3, name: "PHP Developer", unavailable: false },
	{ id: 4, name: "ReactJS Developer", unavailable: true },
	{ id: 5, name: "Web Designer", unavailable: false }
];

export default function OfferManagement() {
	const { t } = useTranslation('common')
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const [sklLoad] = useState(true);
	const [selectedPerson, setSelectedPerson] = useState(people[0]);
	const role = useUserStore((state: { role: any }) => state.role);

	const cancelButtonRef = useRef(null);
	const [discussEmail, setDiscussEmail] = useState(false);
	const [editDetails, seteditDetails] = useState(false);
	const [editSchdInter, setEditSchdInter] = useState(false);

	const router = useRouter();

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

	const [refersh, setrefersh] = useState(1);
	const [applicantlist, setapplicantlist] = useState([]);
	const [tm, settm] = useState([]);
	const [om, setom] = useState([]);
	const [step, setstep] = useState(1);
	const [showOffer, setshowOffer] = useState(false);
	const [userID, setuserID] = useState(-1);
	const [newoffer, setnewoffer] = useState(true);
	const [oldofferID, setoldofferID] = useState(0);
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

	//step 3

	const [intername, setintername] = useState("");
	const [interdesc, setinterdesc] = useState("");
	const [interdate, setinterdate] = useState("");
	const [interstime, setinterstime] = useState("");
	const [interetime, setinteretime] = useState("");
	const [change, setchange] = useState(false);

	const [filterApplicants, setFilterApplicants] = useState([]);
	const [search, setsearch] = useState("");

	function checkForm() {
		return (
			intername.length > 0 &&
			interdesc.length > 0 &&
			interdate.length > 0 &&
			interstime.length > 0 &&
			interetime.length > 0
		);
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

	const convertDocxToArrayBuffer = async (filePath) => {
		try {
			const response = await fetch(filePath);
			const fileBuffer = await response.arrayBuffer();
			return fileBuffer;
		} catch (error) {
			console.error("Error converting DOCX to ArrayBuffer:", error);
			throw error;
		}
	};

	useEffect(() => {
		if (wordpath && wordpath.length > 0) {
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

							if (
								applicantlist[userID]["user"]["last_name"] &&
								applicantlist[userID]["user"]["last_name"].length > 0 &&
								applicantlist[userID]["user"]["first_name"] &&
								applicantlist[userID]["user"]["first_name"].length > 0
							) {
								html = html.replaceAll(
									"[Candidate's Name]",
									`${applicantlist[userID]["user"]["first_name"]}&nbsp;${applicantlist[userID]["user"]["last_name"]}`
								);
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
							console.log("@", error);
							setword(null);
							toastcomp("This Word Does Not Support Use .docx Only", "error");
						});
				})
				.catch((error) => {
					// Handle any errors
					console.error(error);
					setword(null);
					toastcomp("Not Convert2", "error");
				});
		}
	}, [wordpath]);

	async function loadApplicant() {
		await axiosInstanceAuth2
			.get(`/job/listapplicant/`)
			.then(async (res) => {
				console.log("@", "Applicant Load", res.data);
				setapplicantlist(res.data);
				setFilterApplicants(res.data);
				setrefersh(0);
			})
			.catch((err) => {
				console.log("@", "Applicant Load", err);
				setapplicantlist([]);
				setrefersh(0);
			});
	}

	useEffect(() => {
		if (search.length > 0) {
			let localSearch = search.toLowerCase();
			let arr = [];
			for (let i = 0; i < applicantlist.length; i++) {
				if (applicantlist[i]["user"]["first_name"].toLowerCase().includes(localSearch) || applicantlist[i]["user"]["last_name"].toLowerCase().includes(localSearch)) {
					arr.push(applicantlist[i]);
				}
			}
			setFilterApplicants(arr);
		} else {
			setFilterApplicants(applicantlist);
		}
	}, [search]);

	async function loadTeamMember() {
		await axiosInstanceAuth2
			.get(`/organization/listorguser/`)
			.then(async (res) => {
				console.log("@", "listorguser", res.data);
				settm(res.data);
				// let arr = []
				// let arr2 = []
				// var data = res.data
				// for(let i=0;i<data.length;i++){
				// 	if(data[i]["role"] === "Hiring Manager" && data[i]["verified"] === true){
				// 		arr.push(data[i]["email"])
				// 		arr2.push(data[i]["id"])
				// 	}
				// }
				// sethmanage(arr)
				// sethmanageID(arr2)
			})
			.catch((err) => {
				console.log("@", "listorguser", err);
			});
	}

	async function loadOffer() {
		await axiosInstanceAuth2
			.get(`/job/list-offer/`)
			.then(async (res) => {
				console.log("@", "list-offer", res.data);
				setom(res.data);
			})
			.catch((err) => {
				setom([]);
				console.log("@", "list-offer", err);
			});
	}

	const [feedreject, setfeedreject] = useState(false);

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

	function checkOfferExist(arefid: string) {
		loadOffer();
		loadTeamMember();
		setnewoffer(true);
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
		setomf([]);
		setomrefid("");
		setostatus("");
		setocstatus("");
		loadOrganizationProfile();

		for (let i = 0; i < om.length; i++) {
			if (om[i]["applicant"]["arefid"] === arefid) {
				setnewoffer(false);
				setoldofferID(i);
				console.log("@", om[i]);
				console.log("@", "approval_authorities", om[i]["approval_authorities"]);
				if (om[i]["designation"] && om[i]["designation"].length > 0) {
					setdesignation(om[i]["designation"]);
				}
				if (om[i]["department"] && om[i]["department"].length > 0) {
					setdept(om[i]["department"]);
				}
				if (om[i]["section"] && om[i]["section"].length > 0) {
					setsection(om[i]["section"]);
				}
				if (om[i]["divsion"] && om[i]["divsion"].length > 0) {
					setdiv(om[i]["divsion"]);
				}
				if (om[i]["grade"] && om[i]["grade"].length > 0) {
					setgrade(om[i]["grade"]);
				}
				if (om[i]["location"] && om[i]["location"].length > 0) {
					setlocation(om[i]["location"]);
				}
				if (om[i]["currency"] && om[i]["currency"].length > 0) {
					setcurr(om[i]["currency"]);
				}
				if (om[i]["salary_type"] && om[i]["salary_type"].length > 0) {
					settype(om[i]["salary_type"]);
				}
				if (om[i]["salary_from"] && om[i]["salary_from"].length > 0) {
					setfrom(om[i]["salary_from"]);
				}
				if (om[i]["salary_to"] && om[i]["salary_to"].length > 0) {
					setto(om[i]["salary_to"]);
				}
				if (om[i]["candidate_type"] && om[i]["candidate_type"].length > 0) {
					setctype(om[i]["candidate_type"]);
				}
				if (om[i]["visa_sponsorship"] && om[i]["visa_sponsorship"].length > 0) {
					setvisa(om[i]["visa_sponsorship"]);
				}
				if (om[i]["paid_relocation"] && om[i]["paid_relocation"].length > 0) {
					setrelocation(om[i]["paid_relocation"]);
				}

				if (om[i]["approval_authorities"] && om[i]["approval_authorities"].length > 0) {
					let fstring = [];
					let fautharr = om[i]["approval_authorities"];
					for (let i = 0; i < fautharr.length; i++) {
						const searchString = fautharr[i];
						const index = hmanageID.indexOf(searchString);
						if (index !== -1) {
							fstring.push(hmanage[index]);
						}
					}
					setapproval(fstring.join(","));
				}
				setomrefid(om[i]["omrefid"]);
				loadOfferFeedback(om[i]["omrefid"]);
				if (om[i]["status"] && om[i]["status"].length > 0) {
					setostatus(om[i]["status"]);
				}
				if (om[i]["candidate_status"] && om[i]["candidate_status"].length > 0) {
					setocstatus(om[i]["candidate_status"]);
				}
			}
		}

		console.log("@", "New Offer ?", newoffer);
	}

	useEffect(() => {
		if (ostatus && ostatus === "step3") {
			setstep(3);
		} else if (ostatus && ostatus === "step4") {
			setstep(4);
		} else {
			setstep(1);
		}
	}, [ostatus]);

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

	async function newOffer(arefid: string) {
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

		let fstring: never[] = [];
		let fautharr = approval.split(",");
		for (let i = 0; i < fautharr.length; i++) {
			const searchString = fautharr[i];
			const index = hmanage.indexOf(searchString);
			if (index !== -1) {
				fstring.push(hmanageID[index]);
			}
		}

		fd.append("authority", fstring.join("|"));

		if (newoffer) {
			await axiosInstanceAuth2
				.post(`/job/create-offer/${arefid}/`, fd)
				.then(async (res) => {
					toastcomp("offer Sent", "success");
					console.log("@", "Offer Sent", res.data);
					// setom(res.data);
				})
				.catch((err) => {
					toastcomp("offer Not Sent", "error");
					// setom([]);
					console.log("@", "Offer Not Sent", err);
				});
		} else {
			await axiosInstanceAuth2
				.put(`/job/update-offer/${omrefid}/`, fd)
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
		}

		checkOfferExist(arefid);
	}

	function rejectVerify() {
		return feedback.length > 0;
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

	useEffect(() => {
		if (token.length > 0 && refersh > 0) {
			loadOffer();
			loadApplicant();
			loadTeamMember();
		}
	}, [token, refersh]);

	useEffect(() => {
		if (showOffer && userID != -1) {
			var data = applicantlist[userID]["job"]["team"];
			let arr = [];
			let arr2 = [];
			for (let i = 0; i < data.length; i++) {
				if (
					(data[i]["role"] === "Hiring Manager" || data[i]["role"] === "Collaborator") &&
					data[i]["verified"] === true
				) {
					arr.push(data[i]["email"]);
					arr2.push(data[i]["id"]);
				}
			}
			sethmanage(arr);
			sethmanageID(arr2);
		}
	}, [userID, showOffer]);

	function nextstepVerify() {
		return omf.length > 0 && hmanage.length > 0 && omf.length === hmanage.length;
	}

	const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
		return new Promise<ArrayBuffer>((resolve, reject) => {
			const fileReader = new FileReader();

			fileReader.onload = () => {
				const arrayBuffer = fileReader.result as ArrayBuffer;
				resolve(arrayBuffer);
			};

			fileReader.onerror = () => {
				reject(new Error("Failed to read file."));
			};

			fileReader.readAsArrayBuffer(file);
		});
	};

	async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (file) {
			const arrayBuffer = await readFileAsArrayBuffer(file);
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
					console.log("@", html);
					console.log("@", messages);
					html = html.replaceAll("<p></p>", "<br/>");
					html = html + "<br/><br/>";
					setbvalue(html);

					if (
						applicantlist[userID]["user"]["last_name"] &&
						applicantlist[userID]["user"]["last_name"].length > 0 &&
						applicantlist[userID]["user"]["first_name"] &&
						applicantlist[userID]["user"]["first_name"].length > 0
					) {
						html = html.replaceAll(
							"[Candidate's Name]",
							`${applicantlist[userID]["user"]["first_name"]}&nbsp;${applicantlist[userID]["user"]["last_name"]}`
						);
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
					console.log("@", error);
					setword(null);
					toastcomp("This Word Does Not Support Use .docx Only", "error");
				});
		}
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
			pdf.save("download.pdf");
		});
	};

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
			fd.append("status", "stpe3");
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

			checkOfferExist(arefid);
			setstep(3);
		});
	}

	async function handleStep3() {
		await axiosInstanceAuth2
			.post(`/job/send-email-offer/${omrefid}/`)
			.then(async (res) => {
				toastcomp(res.data.msg, "success");
				setDiscussEmail(true);
			})
			.catch((err) => {
				toastcomp("Email Templated not sent", "error");
			});
	}

	async function handleStep32() {
		const formData2 = new FormData();
		formData2.append("summary", intername);
		formData2.append("desc", interdesc);
		formData2.append("stime", moment(`${interdate} ${interstime}`).format());
		formData2.append("etime", moment(`${interdate} ${interetime}`).format());

		await axiosInstanceAuth2
			.post(`/job/offer-schedule-call/${ouid}/${omrefid}/`, formData2)
			.then(async (res) => {
				if (res.data.Message && res.data.Message.length > 0) {
					toastcomp(res.data.Message, "error");
				} else {
					toastcomp("Call Schedule", "success");
				}
				setEditSchdInter(false);
			})
			.catch((err) => {
				toastcomp("Call Not Schedule", "error");
				setEditSchdInter(false);
			});
		checkOfferExist(applicantlist[userID]["arefid"]);
	}

	function updateOffer() {
		let html = bvalue;
		if (
			applicantlist[userID]["user"]["last_name"] &&
			applicantlist[userID]["user"]["last_name"].length > 0 &&
			applicantlist[userID]["user"]["first_name"] &&
			applicantlist[userID]["user"]["first_name"].length > 0
		) {
			html = html.replaceAll(
				"[Candidate's Name]",
				`${applicantlist[userID]["user"]["first_name"]}&nbsp;${applicantlist[userID]["user"]["last_name"]}`
			);
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

	return (
		<>
			<Head>
				<title>{t('Words.OfferManagement')}</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<Orgsidebar />
				<Orgtopbar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className="layoutWrap">
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
					<div className="relative z-[9] flex flex-wrap p-4 lg:p-8">
						<div className="w-full xl:max-w-[280px] mb-4">
							<FormField
								fieldType="input"
								inputType="search"
								placeholder={t('Words.Search')}
								icon={<i className="fa-solid fa-magnifying-glass"></i>}
								value={search}
								handleChange={(e) => setsearch(e.target.value)}
							/>
							<div className="max-h-[400px] overflow-auto xl:max-h-[inherit]">
								{filterApplicants ? (
									filterApplicants.map(
										(data, i) =>
											data["status"] === "Offer" && (
												<div
													className="mb-4 rounded-normal bg-white px-4 py-2 shadow-normal last:mb-0 dark:bg-gray-800"
													key={i}
													onClick={() => {
														setshowOffer(true);
														setuserID(i);
														checkOfferExist(data["arefid"]);
													}}
												>
													<div className="mb-2 flex items-center justify-between">
														<aside className="flex items-center">
															<Image
																src={userImg}
																alt="User"
																width={30}
																className="h-[30px] rounded-full object-cover"
															/>
															<h5 className="pl-4 text-sm font-semibold">
																{data["user"]["first_name"]}&nbsp;{data["user"]["last_name"]}
															</h5>
														</aside>
														<aside>
															<Image src={socialIcon} alt="Social" className="h-[16px] w-auto" />
														</aside>
													</div>
													<p className="mb-2 text-[12px] text-darkGray dark:text-gray-400">ID - {data["arefid"]}</p>
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
											)
									)
								) : (
									<></>
								)}
								{/*  : Array(5).fill(
									 		<div className="mb-4 rounded-normal bg-white px-4 py-2 shadow-normal last:mb-0 dark:bg-gray-800">
									// 			<div className="mb-2 flex items-center justify-between">
									// 				<aside className="flex items-center">
									// 					<Skeleton circle width={30} height={30} />
									// 					<h5 className="grow pl-4 text-sm font-semibold">
									// 						<Skeleton width={100} />
									// 					</h5>
									// 				</aside>
									// 				<aside>
									// 					<Skeleton width={16} height={16} />
									// 				</aside>
									// 			</div>
									// 			<p className="mb-2 text-[12px] text-darkGray dark:text-gray-400">
									// 				<Skeleton width={100} />
									// 			</p>
									// 			<div className="flex items-center justify-between">
									// 				<aside className="flex items-center text-[12px] text-darkGray dark:text-gray-400">
									// 					<Skeleton width={130} />
									// 				</aside>
									// 				<span className="text-[10px] text-darkGray dark:text-gray-400">
									// 					<Skeleton width={50} />
									// 				</span>
									// 			</div>
									 		</div>
									   )} */}
							</div>
						</div>
						{showOffer && (
							<div className="w-full xl:max-w-[calc(100%-280px)] xl:pl-6">
								<div className="rounded-normal border bg-white dark:border-gray-600 dark:bg-gray-800">
									<h2 className="flex justify-between px-10 py-4 text-lg font-bold">
										<span>
											{applicantlist[userID]["user"]["first_name"]}&nbsp;{applicantlist[userID]["user"]["last_name"]}
										</span>
										{/* <span>{applicantlist[userID]["job"]["job_title"]}</span> */}
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
																? "border-primary text-primary dark:text-white dark:border-white"
																: "border-transparent text-darkGray dark:text-gray-400")
														}
													>
														{t('Words.Offer')}
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
																? "border-primary text-primary dark:text-white dark:border-white"
																: "border-transparent text-darkGray dark:text-gray-400")
														}
													>
														{t('Words.Timeline')}
													</button>
												)}
											</Tab>
										</Tab.List>
										<Tab.Panels>
											<Tab.Panel>
												{role != "Hiring Manager" && (
													<div className="mb-4 flex flex-wrap items-center justify-center border-b py-4 dark:border-b-gray-600">
														<div
															className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
															// onClick={() => setstep(1)}
														>
															{step === 1 ? (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																		<span className="text-[32px] font-bold text-white"> 1 </span>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold">{t('Words.OfferPrepration')}</p>
																</>
															) : (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																		<span className="text-[32px] font-bold text-white"> 1 </span>
																		<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold">{t('Words.OfferPrepration')}</p>
																</>
															)}
														</div>
														<div
															className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
															// onClick={() => setstep(2)}
														>
															{step === 2 ? (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																		<span className="text-[32px] font-bold text-white"> 2 </span>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold">{t('Words.OfferFinalization')}</p>
																</>
															) : step > 2 ? (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																		<span className="text-[32px] font-bold text-white"> 2 </span>
																		<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold">{t('Words.OfferFinalization')}</p>
																</>
															) : (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white p-2 shadow-highlight dark:bg-gray-600">
																		<span className="text-[32px] font-bold text-darkGray dark:text-gray-400"> 2 </span>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold text-darkGray dark:text-gray-400">
																	{t('Words.OfferFinalization')}
																	</p>
																</>
															)}
														</div>
														<div
															className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
															// onClick={() => setstep(3)}
														>
															{step === 3 ? (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																		<span className="text-[32px] font-bold text-white"> 3 </span>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold">{t('Words.OfferDiscussion')}</p>
																</>
															) : step > 3 ? (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																		<span className="text-[32px] font-bold text-white"> 3 </span>
																		<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold">{t('Words.OfferDiscussion')}</p>
																</>
															) : (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white p-2 shadow-highlight dark:bg-gray-600">
																		<span className="text-[32px] font-bold text-darkGray dark:text-gray-400"> 3 </span>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold text-darkGray dark:text-gray-400">
																	{t('Words.OfferDiscussion')}
																	</p>
																</>
															)}
														</div>
														<div
															className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
															// onClick={() => setstep(4)}
														>
															{step === 4 ? (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																		<span className="text-[32px] font-bold text-white"> 4 </span>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold">{t('Words.OfferStatus')}</p>
																</>
															) : step > 4 ? (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																		<span className="text-[32px] font-bold text-white"> 4 </span>
																		<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold">{t('Words.OfferStatus')}</p>
																</>
															) : (
																<>
																	<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white p-2 shadow-highlight dark:bg-gray-600">
																		<span className="text-[32px] font-bold text-darkGray dark:text-gray-400"> 4 </span>
																	</div>
																	<p className="relative z-10 text-center text-sm font-bold text-darkGray dark:text-gray-400">
																	{t('Words.OfferStatus')}
																	</p>
																</>
															)}
														</div>
													</div>
												)}

												{role === "Hiring Manager" ? (
													<section className="px-10 py-6">
														{!newoffer ? (
															<>
																<div className="-mx-3 flex flex-wrap">
																	<div className="mb-4 w-full px-3 md:max-w-[50%]">
																		<FormField
																			label={t('Form.Designation')}
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
																			label={t('Words.Department')}
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
																			label={t('Form.Section')}
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
																			label={t('Words.Division')}
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
																			label={t('Form.Grade')}
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
																			label={t('Form.Location')}
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
																		{t('Form.SalaryRange')}<sup className="text-red-500">*</sup>
																	</h4>
																	<div className="flex flex-wrap">
																		<div className="w-[170px] pr-6 last:pr-0 mb-4">
																			<FormField
																				placeholder={t('Words.Currency')}
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
																		<div className="w-[170px] pr-6 last:pr-0 mb-4">
																			<FormField
																				placeholder={t('Words.Type')}
																				singleSelect
																				fieldType="select2"
																				options={[t('Form.Monthly'), t('Form.Yearly')]}
																				value={type}
																				handleChange={settype}
																				readOnly
																			/>
																		</div>
																		<div className="grow pr-6 last:pr-0 mb-4">
																			<FormField
																				placeholder={t('Words.From')}
																				fieldType="input"
																				inputType="number"
																				value={from}
																				handleChange={(e) => setfrom(e.target.value)}
																				readOnly
																			/>
																		</div>
																		<div className="grow pr-6 last:pr-0 mb-4">
																			<FormField
																				placeholder={t('Words.To')}
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
																	label={t('Form.CandidateType')}
																	singleSelect
																	fieldType="select2"
																	options={[t('Select.FullTime'), t('Select.PartTime'), t('Select.Internship')]}
																	value={ctype}
																	handleChange={setctype}
																	required
																	readOnly
																/>
																<div className="flex flex-wrap">
																	<div className="grow pr-6 last:pr-0">
																		<FormField
																			label={t('Words.VisaSponsorship')}
																			singleSelect
																			fieldType="select2"
																			options={[t('Select.Yes'), t('Select.No'), 'N/A']}
																			value={visa}
																			handleChange={setvisa}
																			required
																			readOnly
																		/>
																	</div>
																	<div className="grow pr-6 last:pr-0">
																		<FormField
																			label={t('Words.PaidRelocation')}
																			singleSelect
																			fieldType="select2"
																			options={[t('Select.Yes'), t('Select.No'), 'N/A']}
																			value={relocation}
																			handleChange={setrelocation}
																			required
																			readOnly
																		/>
																	</div>
																</div>
																<FormField
																	label={t('Form.ApprovalAuthorities')}
																	fieldType="select2"
																	options={hmanage}
																	value={approval}
																	handleChange={setapproval}
																	required
																	readOnly
																/>

																<hr />

																<h4 className="mb-2 mt-6 font-bold">{t('Form.Feedback')}</h4>
																<FormField
																	placeholder={t('Form.WriteFeedback')}
																	fieldType="textarea"
																	value={feedback}
																	handleChange={(e) => setfeedback(e.target.value)}
																/>

																<div className="flex flex-wrap gap-2">
																	<Button
																		label={t('Btn.Approve')}
																		btnStyle="success"
																		btnType={"button"}
																		handleClick={() => newOfferFeedback("Approve")}
																	/>

																	{/* disabled={!checkBtnOffer()} handleClick={()=>newOffer(applicantlist[userID]["arefid"])} */}

																	<Button
																		label={t('Btn.Reject')}
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
																<p className="text-lg text-yellow-700">{t('Words.OfferNotYetCreated')}</p>
																<p className="text-sm">{t('Words.UnderDevelopment')}</p>
															</div>
														)}
													</section>
												) : (
													<>
														{step === 1 && (
															<section className="px-10 py-6">
																{/* feedback */}
																{/* <div className="mb-6 rounded-normal bg-red-100 px-6 py-4">
															<div className="flex flex-wrap items-center justify-between font-bold">
																<p className="mb-1 text-red-700">
																	<i className="fa-regular fa-face-frown"></i> Rejected (Hiring Manager)
																</p>
																<p className="text-[12px] text-darkGray">by Steve Paul on 22 Mar 2023</p>
															</div>
															<h5 className="mt-2 font-semibold text-black">Feedback:</h5>
															<p className="mb-2 text-sm text-darkGray">
																This lead is rejected due to the following reason. [reason mention here]
															</p>
															<small className="text-black">
																<b>Note:</b> Kindly please make correction then resend this lead.
															</small>
														</div>
														<div className="mb-6 rounded-normal bg-green-100 px-6 py-4">
															<div className="flex flex-wrap items-center justify-between font-bold">
																<p className="mb-1 text-green-700">
																	<i className="fa-regular fa-face-smile"></i> Approved (Hiring Manager)
																</p>
																<p className="text-[12px] text-darkGray">by Steve Paul on 22 Mar 2023</p>
															</div>
															<h5 className="mt-2 font-semibold text-black">Feedback:</h5>
															<p className="mb-2 text-sm text-darkGray">Thank you! We are happy to serve you.</p>
														</div>
														<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
															<i className="fa-solid fa-magnifying-glass mb-2 text-[40px]"></i>
															<p className="text-lg text-yellow-700">Offer Sent Successfully</p>
															<p className="text-sm">Under Review</p>
														</div> */}
																{newoffer || feedreject ? (
																	<>
																		{omf &&
																			omf.length > 0 &&
																			omf.map((data, i) =>
																				data["status"] === "Reject" ? (
																					<div className="mb-6 rounded-normal bg-red-100 px-6 py-4" key={i}>
																						<div className="flex flex-wrap items-center justify-between font-bold">
																							<p className="mb-1 text-red-700">
																								<i className="fa-regular fa-face-frown"></i> {t('Form.Rejected')} (
																								{data["organization"]["email"]})
																							</p>
																							<p className="text-[12px] text-darkGray">
																								{moment(data["timestamp"]).fromNow()}
																							</p>
																						</div>
																						<h5 className="mt-2 font-semibold text-black">{t('Form.Feedback')}:</h5>
																						<p className="mb-2 text-sm text-darkGray">{data["feedback"]}</p>
																					</div>
																				) : (
																					<div className="mb-6 rounded-normal bg-green-100 px-6 py-4" key={i}>
																						<div className="flex flex-wrap items-center justify-between font-bold">
																							<p className="mb-1 text-green-700">
																								<i className="fa-regular fa-face-smile"></i> {t('Form.Approved')} (
																								{data["organization"]["email"]})
																							</p>
																							<p className="text-[12px] text-darkGray">
																								{moment(data["timestamp"]).fromNow()}
																							</p>
																						</div>
																						<h5 className="mt-2 font-semibold text-black">{t('Form.Feedback')}:</h5>
																						<p className="mb-2 text-sm text-darkGray">{data["feedback"]}</p>
																					</div>
																				)
																			)}

																		<div className="-mx-3 flex flex-wrap">
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t('Form.Designation')}
																					fieldType="input"
																					inputType="text"
																					value={designation}
																					handleChange={(e) => setdesignation(e.target.value)}
																					required
																				/>
																			</div>
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t('Words.Department')}
																					fieldType="input"
																					inputType="text"
																					value={dept}
																					handleChange={(e) => setdept(e.target.value)}
																					required
																				/>
																			</div>
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t('Form.Section')}
																					fieldType="input"
																					inputType="text"
																					value={section}
																					handleChange={(e) => setsection(e.target.value)}
																					required
																				/>
																			</div>
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t('Words.Division')}
																					fieldType="input"
																					inputType="text"
																					value={div}
																					handleChange={(e) => setdiv(e.target.value)}
																					required
																				/>
																			</div>
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t('Form.Grade')}
																					fieldType="input"
																					inputType="text"
																					value={grade}
																					handleChange={(e) => setgrade(e.target.value)}
																					required
																				/>
																			</div>
																			<div className="mb-4 w-full px-3 md:max-w-[50%]">
																				<FormField
																					label={t('Form.Location')}
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
																				{t('Form.SalaryRange')}<sup className="text-red-500">*</sup>
																			</h4>
																			<div className="flex flex-wrap -mx-3">
																				<div className="w-[50%] xl:max-w-[20%] mb-4 px-3">
																					<FormField
																						placeholder={t('Words.Currency')}
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
																				<div className="w-[50%] xl:max-w-[20%] mb-4 px-3">
																					<FormField
																						placeholder={t('Words.Type')}
																						singleSelect
																						fieldType="select2"
																						options={["Monthly", "Yearly"]}
																						value={type}
																						handleChange={settype}
																					/>
																				</div>
																				<div className="w-[50%] xl:max-w-[30%] mb-4 px-3">
																					<FormField
																						placeholder={t('Words.From')}
																						fieldType="input"
																						inputType="number"
																						value={from}
																						handleChange={(e) => setfrom(e.target.value)}
																					/>
																				</div>
																				<div className="w-[50%] xl:max-w-[30%] mb-4 px-3">
																					<FormField
																						placeholder={t('Words.To')}
																						fieldType="input"
																						inputType="number"
																						value={to}
																						handleChange={(e) => setto(e.target.value)}
																					/>
																				</div>
																			</div>
																		</div>
																		<FormField
																			label={t('Form.CandidateType')}
																			singleSelect
																			fieldType="select2"
																			options={[t('Select.FullTime'), t('Select.PartTime'), t('Select.Internship')]}
																			value={ctype}
																			handleChange={setctype}
																			required
																		/>
																		<div className="flex flex-wrap">
																			<div className="mb-4 grow pr-6 last:pr-0">
																				<FormField
																					label={t('Words.VisaSponsorship')}
																					singleSelect
																					fieldType="select2"
																					options={[t('Select.Yes'), t('Select.No'), 'N/A']}
																					value={visa}
																					handleChange={setvisa}
																					required
																				/>
																			</div>
																			<div className="mb-4 grow pr-6 last:pr-0">
																				<FormField
																					label={t('Words.PaidRelocation')}
																					singleSelect
																					fieldType="select2"
																					options={[t('Select.Yes'), t('Select.No'), 'N/A']}
																					value={relocation}
																					handleChange={setrelocation}
																					required
																				/>
																			</div>
																		</div>
																		<FormField
																			label={t('Form.ApprovalAuthorities')}
																			fieldType="select2"
																			options={hmanage}
																			value={approval}
																			handleChange={setapproval}
																			required
																		/>

																		<Button
																			label={newoffer ? t('Btn.SendForApproval') : t('Btn.ReSendForApproval')}
																			btnType={"button"}
																			disabled={!checkBtnOffer()}
																			handleClick={() => newOffer(applicantlist[userID]["arefid"])}
																		/>
																	</>
																) : omf && omf.length > 0 ? (
																	<>
																		{omf.map((data, i) =>
																			data["status"] === "Reject" ? (
																				<div className="mb-6 rounded-normal bg-red-100 px-6 py-4" key={i}>
																					<div className="flex flex-wrap items-center justify-between font-bold">
																						<p className="mb-1 text-red-700">
																							<i className="fa-regular fa-face-frown"></i> {t('Form.Rejected')} (
																							{data["organization"]["email"]})
																						</p>
																						<p className="text-[12px] text-darkGray">
																							{moment(data["timestamp"]).fromNow()}
																						</p>
																					</div>
																					<h5 className="mt-2 font-semibold text-black">{t('Form.Feedback')}:</h5>
																					<p className="mb-2 text-sm text-darkGray">{data["feedback"]}</p>
																				</div>
																			) : (
																				<div className="mb-6 rounded-normal bg-green-100 px-6 py-4" key={i}>
																					<div className="flex flex-wrap items-center justify-between font-bold">
																						<p className="mb-1 text-green-700">
																							<i className="fa-regular fa-face-smile"></i> {t('Form.Approved')} (
																							{data["organization"]["email"]})
																						</p>
																						<p className="text-[12px] text-darkGray">
																							{moment(data["timestamp"]).fromNow()}
																						</p>
																					</div>
																					<h5 className="mt-2 font-semibold text-black">{t('Form.Feedback')}:</h5>
																					<p className="mb-2 text-sm text-darkGray">{data["feedback"]}</p>
																				</div>
																			)
																		)}

																		<Button
																			label={t('Btn.Next')}
																			btnType={"button"}
																			disabled={!nextstepVerify()}
																			handleClick={() => {
																				loadOrganizationProfile();
																				setstep(2);
																			}}
																		/>
																	</>
																) : (
																	<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																		<i className="fa-solid fa-magnifying-glass mb-2 text-[40px]"></i>
																		<p className="text-lg text-yellow-700">{t('Words.OfferSentSuccessfully')}</p>
																		<p className="text-sm">{t('Words.UnderReview')}</p>
																	</div>
																)}
															</section>
														)}

														{step === 2 && (
															<section className="px-10 py-6">
																{wordpath === "" ? (
																	<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																		<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																		<p className="text-lg">{t('Words.OfferLetterFomratPending')}</p>
																		<small className="font-semibold">{t('Words.KindlyContactYourOrgSuperAdminATS')}</small>
																	</div>
																) : (
																	<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
																		<p className="my-2">
																			{word != null ? (
																				<>{t('Words.OfferLetter')}</>
																			) : (
																				<>{t('Words.SelectOfferLetter')}</>
																			)}
																		</p>
																		{word != null ? (
																			<div>
																				{/* <button
																					className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																					onClick={handleDownload}
																				>
																					<i className="fa-solid fa-download mr-2"></i>
																					Download
																				</button>
																				&nbsp;|&nbsp;
																				<button
																					className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																					onClick={() => setword(null)}
																				>
																					Reset
																				</button> */}
																			</div>
																		) : (
																			<div className="my-2 inline-block w-[50%] font-bold text-primary hover:underline dark:text-gray-200">
																				<div className="relative min-h-[45px] w-full rounded-normal border border-borderColor p-3 pr-9 text-sm focus:bg-red-500 dark:border-gray-600 dark:bg-gray-700">
																					<input
																						type="file"
																						className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
																						accept=".docx"
																						onChange={handleFileInputChange}
																					/>
																					<span className="absolute right-3 top-[12px] text-lightGray">
																						<i className="fa-solid fa-paperclip"></i>
																					</span>
																					<span className="absolute left-5 top-[12px] text-darkGray dark:text-gray-400">
																						Docx etc...
																					</span>
																				</div>
																			</div>
																		)}
																	</div>
																)}
																{value && value.length > 0 && word != null && (
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
																					label={t('Btn.Confirm')}
																					btnType="button"
																					handleClick={() => updateOfferStep2(applicantlist[userID]["arefid"])}
																				/>
																			</div>
																			<div className="my-1 mr-4 last:mr-0">
																				<Button
																					btnStyle="gray"
																					label={t('Btn.Edit')}
																					btnType="button"
																					handleClick={() => seteditDetails(true)}
																				/>
																			</div>
																		</div>
																	</>
																)}
															</section>
														)}

														{step === 3 && (
															<section className="px-10 py-6">
																{word != null && (
																	<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
																		<p className="my-2">{t('Words.OfferLetter')}</p>
																		<button
																			className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																			onClick={handleDownload}
																		>
																			<i className="fa-solid fa-download mr-2"></i>
																			{t('Btn.Download')}
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
																				label={t('Btn.SendEmailTemplate')}
																				btnType="button"
																				handleClick={() => handleStep3()}
																			/>
																		</div>
																	</>
																)}
															</section>
														)}

														{step === 4 && (
															<section className="px-10 py-6">
																{ocstatus === "Pending" && (
																	<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
																		<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
																		<p className="text-lg">{t('Words.OfferPending')}</p>
																		<small className="font-semibold">{t('Words.OfferStatusApplicant')}</small>
																	</div>
																)}
																{ocstatus === "Accepted" && (
																	<div className="mb-6 rounded-normal bg-green-100 px-6 py-8 text-center font-bold text-gray-700">
																		<i className="fa-solid fa-check-circle mb-2 text-[40px] text-green-700"></i>
																		<p className="mb-2 text-lg text-green-700">{t('Words.OfferAccepted')}</p>
																		<button
																			onClick={() => handleDownload()}
																			className="inline-block rounded bg-green-700 px-4 py-1 text-[12px] font-semibold text-white"
																		>
																			{t('Btn.Download')} {t('Words.OfferLetter')}
																		</button>
																	</div>
																)}
															</section>
														)}
													</>
												)}
											</Tab.Panel>
											<Tab.Panel>
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
											</Tab.Panel>
										</Tab.Panels>
									</Tab.Group>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
			<Transition.Root show={discussEmail} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setDiscussEmail}>
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
									<div className="px-8 py-2 text-right">
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setDiscussEmail(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8 pt-0 text-center">
										<h4 className="text-3xl font-bold">
											{
												srcLang==='ja'
												?
												'メールが送信されました'
												:
												'Email has been sent'
											}
										</h4>
										<Image src={successGraphic} alt="Success" width={300} className="mx-auto my-4 w-[200px]" />
										<hr className="mb-4" />
										<div className="mb-2">
											<Button
												label={ srcLang==='ja'?  '面談を調整' : 'Schedule a Call' }
												btnType="button"
												handleClick={() => {
													setDiscussEmail(false);
													setEditSchdInter(true);
												}}
											/>
										</div>
										<p className="mx-auto w-full max-w-[320px] text-sm text-darkGray">
											{
												srcLang==='ja'
												?
												'候補者とオファー面談を調整します'
												:
												'Schedule a Call with Applicant to Discuss Further Onboarding Steps'
											}
										</p>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

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
										<h4 className="text-3xl font-bold">{t('Words.EditOfferDetails')}</h4>
										<hr className="mb-4" />
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t('Form.Designation')}
													fieldType="input"
													inputType="text"
													value={designation}
													handleChange={(e) => setdesignation(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t('Words.Department')}
													fieldType="input"
													inputType="text"
													value={dept}
													handleChange={(e) => setdept(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t('Form.Section')}
													fieldType="input"
													inputType="text"
													value={section}
													handleChange={(e) => setsection(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t('Words.Division')}
													fieldType="input"
													inputType="text"
													value={div}
													handleChange={(e) => setdiv(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t('Form.Grade')}
													fieldType="input"
													inputType="text"
													value={grade}
													handleChange={(e) => setgrade(e.target.value)}
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													label={t('Form.Location')}
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
											{t('Form.SalaryRange')}<sup className="text-red-500">*</sup>
											</h4>
											<div className="flex flex-wrap">
												<div className="w-[170px] pr-6 last:pr-0 mb-4">
													<FormField
														placeholder={t('Words.Currency')}
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
												<div className="w-[170px] pr-6 last:pr-0 mb-4">
													<FormField
														placeholder={t('Words.Type')}
														singleSelect
														fieldType="select2"
														options={["Monthly", "Yearly"]}
														value={type}
														handleChange={settype}
													/>
												</div>
												<div className="grow pr-6 last:pr-0 mb-4">
													<FormField
														placeholder={t('Words.From')}
														fieldType="input"
														inputType="number"
														value={from}
														handleChange={(e) => setfrom(e.target.value)}
													/>
												</div>
												<div className="grow pr-6 last:pr-0 mb-4">
													<FormField
														placeholder={t('Words.To')}
														fieldType="input"
														inputType="number"
														value={to}
														handleChange={(e) => setto(e.target.value)}
													/>
												</div>
											</div>
										</div>
										<FormField
											label={t('Form.CandidateType')}
											singleSelect
											fieldType="select2"
											options={[t('Select.FullTime'), t('Select.PartTime'), t('Select.Internship')]}
											value={ctype}
											handleChange={setctype}
											required
										/>
										<div className="flex flex-wrap">
											<div className="grow pr-6 last:pr-0">
												<FormField
													label={t('Words.VisaSponsorship')}
													singleSelect
													fieldType="select2"
													options={[t('Select.Yes'), t('Select.No'), 'N/A']}
													value={visa}
													handleChange={setvisa}
													required
												/>
											</div>
											<div className="grow pr-6 last:pr-0">
												<FormField
													label={t('Words.PaidRelocation')}
													singleSelect
													fieldType="select2"
													options={[t('Select.Yes'), t('Select.No'), 'N/A']}
													value={relocation}
													handleChange={setrelocation}
													required
												/>
											</div>
										</div>
										<hr className="mb-5 mt-5" />
										<Button
											label={t('Btn.Update')}
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

			<Transition.Root show={editSchdInter} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setEditSchdInter}>
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
										<h4 className="flex items-center font-semibold leading-none">{t('Words.ScheduleInterview')}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setEditSchdInter(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<FormField
											label={t('Form.InterviewName')}
											fieldType="input"
											inputType="text"
											value={intername}
											handleChange={(e) => setintername(e.target.value)}
										/>
										{/* <FormField label="Date & Time" fieldType="date" singleSelect showTimeSelect showHours /> */}
										{/* <FormField label="Platform" fieldType="select" /> */}
										<FormField
											label={t('Form.Description')}
											fieldType="textarea"
											value={interdesc}
											handleChange={(e) => setinterdesc(e.target.value)}
										/>
										{/* <FormField label="Add Interviewer" fieldType="select" /> */}

										<div className="mb-4 last:mb-0">
											<div>
												<label htmlFor={`field_start_date`} className="mb-1 inline-block font-bold">
												{t('Form.StartDate')}
												</label>
												<div className="relative">
													<input type="date" value={interdate} onChange={(e) => setinterdate(e.target.value)} />
												</div>
											</div>
										</div>
										<div className="mb-4 last:mb-0">
											<div>
												<label htmlFor={`field_start_date`} className="mb-1 inline-block font-bold">
												{t('Form.StartTime')}
												</label>
												<div className="relative">
													<input type="time" value={interstime} onChange={(e) => setinterstime(e.target.value)} />
												</div>
											</div>
										</div>
										<div className="mb-4 last:mb-0">
											<div>
												<label htmlFor={`field_start_date`} className="mb-1 inline-block font-bold">
												{t('Form.EndTime')}
												</label>
												<div className="relative">
													<input type="time" value={interetime} onChange={(e) => setinteretime(e.target.value)} />
												</div>
											</div>
										</div>

										<Button
											label={t('Btn.Confirm')}
											disabled={!checkForm()}
											btnType={"button"}
											handleClick={() => handleStep32()}
										/>
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
export async function getStaticProps({ context, locale }:any) {
	const translations = await serverSideTranslations(locale, ['common']);
	return {
		props: {
		...translations
		},
	};
}