import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dialog, Tab, Transition } from "@headlessui/react";
import React, { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import userIcon from "/public/images/icons/user.png";
import UploadProfile from "@/components/UploadProfile";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import careerBanner from "/public/images/gall-4.png";
import galleryUpload from "/public/images/gallery_upload.png";
import gall_1 from "/public/images/gall-1.png";
import gall_2 from "/public/images/gall-2.png";
import gall_3 from "/public/images/gall-3.png";
import gall_4 from "/public/images/gall-4.png";
import userImg from "/public/images/user-image.png";
import { Switch } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { addActivityLog, axiosInstanceAuth } from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";
import mammoth from "mammoth";
// import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import { useUserStore } from "@/utils/code";
import moment from "moment";
import UpcomingComp from "@/components/organization/upcomingComp";
import PermiumComp from "@/components/organization/premiumComp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import { useNewNovusStore } from "@/utils/novus";
import OrgRSideBar from "@/components/organization/RSideBar";
import Joyride,{STATUS} from "react-joyride";
import useJoyrideStore from "@/utils/joyride";
import Button2 from "@/components/Button2";
export default function Profile({ atsVersion, userRole, upcomingSoon }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const currentUser = useUserStore((state: { user: any }) => state.user);
	const setcurrentUser = useUserStore((state: { setuser: any }) => state.setuser);

	const [rating, setrating] = useState(0);
	const [brating, setbrating] = useState(0);
	useEffect(() => {
		if (userRole === "Super Admin" && currentUser) {
			setrating(currentUser[0]["rating"]);
			setbrating(currentUser[0]["rating"]);
		}
	}, [currentUser]);

	const handleRInputChange = (e) => {
		const value = e.target.value;
		// Regular expression to match numbers between 0 and 90
		const regex = /^(?:[0-9]|[1-8][0-9]|90)$/;
		// Check if the input value matches the regex pattern
		if (regex.test(value)) {
			setrating(value);
			//update in database
			saveRating(value);
		} else {
			toastcomp("Use number between 0-90", "error");
			setrating(brating);
		}
	};

	async function saveRating(rating: any) {
		const fd = new FormData();
		fd.append("rating", rating);
		await axiosInstanceAuth2
			.post(`/organization/rating/update/`, fd)
			.then(async (res) => {
				if (res.data.success === 1) {
					toastcomp("rating update", "success");
					//load user
					LoadCUser();
				} else {
					toastcomp("rating not update", "error");
				}
			})
			.catch((err) => {
				console.log("@", "rating", err);
				toastcomp("rating not update", "error");
			});
	}

	async function LoadCUser() {
		await axiosInstanceAuth2
			.post(`/organization/get/currentUser/`)
			.then(async (res) => {
				console.log("@@@@", "LoadCUser", res.data);
				setcurrentUser(res.data);
			})
			.catch((err) => {
				console.log("@@@@", "LoadCUser", err);
				toastcomp("rating not update", "error");
			});
	}

	const router = useRouter();
	const cancelButtonRef = useRef(null);
	const [addSocial, setAddSocial] = useState(false);
	const [changePass, setChangePass] = useState(false);
	const [addFounder, setAddFounder] = useState(false);
	const [addWidget, setAddWidget] = useState(false);
	const [addGalImages, setAddGalImages] = useState(false);
	const [addGroups, setAddGroups] = useState(false);

	const [enabled, setEnabled] = useState(false);

	const [gallUpload, setGallUpload] = useState(false);

	const [tourCompleted, setTourCompleted] = useState(false);

	const [isTourOpen, setIsTourOpen] = useState(false);
	const [shouldShowTopBar,setShouldShowTopBar]=useState(false);
	const { shouldShowJoyride, isJoyrideCompleted, showJoyride } = useJoyrideStore();

	// const [activeTab, setActiveTab] = useState(0);
	useEffect(() => {
		if (!isJoyrideCompleted) {
			showJoyride();
		}
	}, [isJoyrideCompleted, showJoyride]);

	function blurOrNot(name: any) {
		// if (userRole === "Super Admin") {
		// 	if (atsVersion === "starter") {
		// 		return name === "Groups/Division" || name === "Offer Letter Format" || name === "Widget";
		// 	}
		// 	if (atsVersion === "premium") {
		// 		return name === "Groups/Division" || name === "Offer Letter Format" || name === "Widget";
		// 	}
		// 	if (atsVersion === "enterprise") {
		// 		return false;
		// 	}
		// } else {
		// 	if (atsVersion === "starter") {
		// 		return name === "Groups/Division" || name === "Offer Letter Format" || name === "Organization Profile";
		// 	}
		// 	if (atsVersion === "premium") {
		// 		return name === "Groups/Division" || name === "Offer Letter Format" || name === "Organization Profile";
		// 	}
		// 	if (atsVersion === "enterprise") {
		// 		return name === "Groups/Division" || name === "Offer Letter Format" || name === "Organization Profile";
		// 	}
		// }
		if (name === "Groups/Division") {
			return true;
		}
		if (userRole != "Super Admin" && (name === "Organization Profile" || name === "Offer Letter Format")) {
			return true;
		}
		return false;
	}

	const tabHeading_1 = [
		{
			title: t("Words.IndividualProfile"),
			blur: blurOrNot("Individual Profile")
		},
		{
			title: t("Words.OrganizationProfile"),
			blur: blurOrNot("Organization Profile")
		},
		{
			title: t("Words.Group") + " / " + t("Words.Division"),
			blur: blurOrNot("Groups/Division")
		},
		{
			title: t("Words.OfferLetterFormat"),
			blur: blurOrNot("Offer Letter Format")
		}
	];
	const tabHeading_2 = [
		{
			title: t("Words.Summary"),
			icon: <i className="fa-solid fa-bars"></i>,
			blur: blurOrNot("Summary")
		},
		{
			title: t("Words.Gallery"),
			icon: <i className="fa-solid fa-mountain-sun"></i>,
			blur: blurOrNot("Gallery")
		},
		{
			title: t("Words.Widget"),
			icon: <i className="fa-solid fa-gauge"></i>,
			blur: blurOrNot("Widget")
		}
		// {
		//     title: 'Custom Domain',
		//     icon: <i className="fa-solid fa-desktop"></i>
		// }
	];
	const gallery = [
		{
			image: gall_1
		},
		{
			image: gall_2
		},
		{
			image: gall_3
		},
		{
			image: gall_4
		}
	];

	const { data: session } = useSession();
	const [token, settoken] = useState("");
	//Individual Profile
	const [iprofile, setiprofile] = useState([]);
	const [iuniqueid, setiuniqueid] = useState("");

	const [profileimg, setProfileImg] = useState();
	const [purl, setpurl] = useState("");
	const [oname, setoname] = useState("");
	const [fname, setfname] = useState("");
	const [contact, setcontact] = useState("");
	const [email, setemail] = useState("");
	const [title, settitle] = useState("");
	const [dept, setdept] = useState("");
	//blur
	const [bluroname, setbluroname] = useState("");
	const [blurfname, setblurfname] = useState("");
	const [blurcontact, setblurcontact] = useState("");
	const [bluremail, setbluremail] = useState("");
	const [blurtitle, setblurtitle] = useState("");
	const [blurdept, setblurdept] = useState("");

	//Individual Link
	const [ilink, setilink] = useState([]);
	const [iaddlink, setiaddlink] = useState("");

	function verifyLinkPopup() {
		return iaddlink.length > 0;
	}

	//Org Profile
	const [oprofile, setoprofile] = useState([]);

	const [oabout, setoabout] = useState("");
	const [oafounder, setoafounder] = useState("");
	const [ourl, setourl] = useState("");
	const [ocontact, setocontact] = useState("");
	const [ocsize, setocsize] = useState("");
	const [owplace, setowplace] = useState("");
	const [ohlocation, setohlocation] = useState("");
	const [oboffice, setoboffice] = useState("");
	const [obenefits, setobenefits] = useState("");
	const [ofund, setofund] = useState("");

	const [ologo, setologo] = useState();
	const [oulogo, setoulogo] = useState();
	const [obanner, setobanner] = useState();
	const [oubanner, setoubanner] = useState();
	//blur
	const [bluroabout, setbluroabout] = useState("");
	const [bluroafounder, setbluroafounder] = useState("");
	const [blurourl, setblurourl] = useState("");
	const [blurocontact, setblurocontact] = useState("");
	const [blurocsize, setblurocsize] = useState("");
	const [blurowplace, setblurowplace] = useState("");
	const [blurohlocation, setblurohlocation] = useState("");
	const [bluroboffice, setbluroboffice] = useState("");
	const [blurobenefits, setblurobenefits] = useState("");
	const [blurofund, setblurofund] = useState("");

	//Org Founder
	const [ofounder, setofounder] = useState([]);

	const [ofounderimg, setofounderimg] = useState();
	const [ofounderimgURL, setofounderimgURL] = useState("");
	const [ofoundername, setofoundername] = useState("");
	const [ofounderdes, setofounderdes] = useState("");

	function verifyFounderPopup() {
		return ofounderimg && ofoundername.length > 0 && ofounderdes.length > 0;
	}

	useEffect(() => {
		if (ofounderimg) {
			setofounderimgURL(URL.createObjectURL(ofounderimg));
		} else {
			setofounderimgURL("");
		}
	}, [ofounderimg]);

	//Org Gallery
	const [ogallery, setoGallery] = useState([]);
	const [ofile, setoFile] = useState([] as any);

	//Offer Letter
	const [word, setword] = useState<ArrayBuffer | null>(null);
	const [wordpath, setwordpath] = useState("");
	const [wordfile, setwordfile] = useState<File | null>(null);
	const [value, setvalue] = useState("");
	const [bvalue, setbvalue] = useState("");
	const htmlRef = useRef<HTMLDivElement>(null);

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
			setwordfile(file);
			const arrayBuffer = await readFileAsArrayBuffer(file);
			setword(arrayBuffer);
			const fd = new FormData();
			fd.append("offer", file);
			saveOrganizationProfile2(fd);
			let aname = `Organization Offer Letter Added by ${userState[0]["name"]} (${
				userState[0]["email"]
			}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

			addActivityLog(axiosInstanceAuth2, aname);

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
					setvalue(html);
				})
				.catch(function (error) {
					console.log("@", error);
					setword(null);
					setwordfile(null);
					toastcomp("This Word Does Not Support Use .docx Only", "error");
				});
		}
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
			console.log(wordpath);
			convertDocxToArrayBuffer(wordpath)
				.then((arrayBuffer) => {
					// Use the arrayBuffer as needed

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
							setvalue(html);
						})
						.catch(function (error) {
							console.log("@", error);
							setword(null);
							setwordfile(null);
							toastcomp("Not Convert", "error");
						});
				})
				.catch((error) => {
					// Handle any errors
					console.error(error);
					toastcomp("Not Convert2", "error");
				});
		}
	}, [wordpath]);

	function resetOL() {
		setword(null);
		setwordfile(null);
		setwordpath("");
		const fd = new FormData();
		fd.append("offer", "");
		saveOrganizationProfile2(fd);
		let aname = `Organization Offer Letter Deleted by ${userState[0]["name"]} (${
			userState[0]["email"]
		}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

		addActivityLog(axiosInstanceAuth2, aname);
	}

	const handleDownload = () => {
		// Convert the HTML to a canvas
		html2canvas(document.getElementById("contentABC")).then(function (canvas) {
			const pdf = new jspdf();

			pdf.setFontSize(12);
			pdf.setFont("times", "normal", "normal");
			// Add the canvas to the PDF document
			pdf.addImage(canvas.toDataURL("image/png"), "JPEG", 5, 5);

			// Save the PDF document
			pdf.save("download.pdf");
		});
	};

	function onImageChange(e: any) {
		setoFile([...ofile, ...e.target.files]);
	}

	function deleteUImage(num: any) {
		var myElement = document.getElementById(`gallerypopup${num}`).remove();
		if (ofile.length == 1) {
			setoFile([]);
		} else {
			ofile.splice(num, 1);
		}
	}

	function verifyGalPopup() {
		return ofile.length > 0;
	}

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadIndividualProfile() {
		await axiosInstanceAuth2
			.get(`/organization/listindividualprofile/`)
			.then(async (res) => {
				console.log("@", "iprofile", res.data);
				setiprofile(res.data);
			})
			.catch((err) => {
				console.log("@", "iprofile", err);
			});
	}

	const userState = useUserStore((state: { user: any }) => state.user);

	async function saveIndividualProfile(formData: any) {
		await axiosInstanceAuth2
			.put(`/organization/individualprofile/update/`, formData)
			.then(async (res) => {
				toastcomp("Individual Profile Updated", "success");

				let aname = `Individual Profile Updated by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				loadIndividualProfile();
			})
			.catch((err) => {
				console.log(err);
				if (err.message != "Request failed with status code 401") {
					toastcomp("Individual Profile Not Updated", "error");
				}
			});
	}

	async function loadIndividualLink() {
		await axiosInstanceAuth2
			.get(`/organization/listindividuallink/${iuniqueid}/`)
			.then(async (res) => {
				console.log("@", "Link", res.data);
				setilink(res.data);
			})
			.catch((err) => {
				console.log("@", "Link", err);
			});
	}

	async function addIndividualLink() {
		var formData = new FormData();
		formData.append("title", iaddlink);
		await axiosInstanceAuth2
			.post(`/organization/individuallink/${iuniqueid}/`, formData)
			.then(async (res) => {
				toastcomp("Social Link Added", "success");

				let aname = `Individual Profile Updated by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				loadIndividualLink();
				setiaddlink("");
				setAddSocial(false);
			})
			.catch((err) => {
				toastcomp("Link Not Added", "error");
				console.log(err);
				loadIndividualLink();
				setiaddlink("");
				setAddSocial(false);
			});
	}

	async function delIndividualLink(val: any) {
		await axiosInstanceAuth2
			.delete(`/organization/individuallink/${iuniqueid}/${val}/delete/`)
			.then(async (res) => {
				toastcomp("Social Link Deleted", "success");

				let aname = `Individual Profile Updated by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				loadIndividualLink();
				setiaddlink("");
				setAddSocial(false);
			})
			.catch((err) => {
				toastcomp("Link Not Deleted", "error");
				console.log(err);
				loadIndividualLink();
				setiaddlink("");
				setAddSocial(false);
			});
	}

	async function loadOrganizationProfile() {
		await axiosInstanceAuth2
			.get(`/organization/listorganizationprofile/`)
			.then(async (res) => {
				console.log("@", "oprofile", res.data);
				setoprofile(res.data);
			})
			.catch((err) => {
				console.log("@", "oprofile", err);
			});
	}

	async function saveOrganizationProfile(formData: any) {
		await axiosInstanceAuth2
			.put(`/organization/organizationprofile/update/`, formData)
			.then(async (res) => {
				toastcomp("Organization Profile Updated", "success");

				let aname = `Organization Profile Updated by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				loadOrganizationProfile();
			})
			.catch((err) => {
				console.log(err);
				if (err.message != "Request failed with status code 401") {
					toastcomp("Organization Profile Not Updated", "error");
				}
			});
	}

	async function saveOrganizationProfile2(formData: any) {
		await axiosInstanceAuth2
			.put(`/organization/organizationprofile/update/`, formData)
			.then(async (res) => {
				toastcomp("Organization Offer Letter Updated", "success");
				loadOrganizationProfile();
			})
			.catch((err) => {
				console.log(err);
				if (err.message != "Request failed with status code 401") {
					toastcomp("Organization Profile Not Updated", "error");
				}
			});
	}

	async function loadOrganizationFounder() {
		await axiosInstanceAuth2
			.get(`/organization/listorganizationfounder/`)
			.then(async (res) => {
				console.log("@", "founder", res.data);
				setofounder(res.data);
			})
			.catch((err) => {
				console.log("@", "founder", err);
			});
	}

	async function addOrganizationFounder() {
		var formData = new FormData();
		formData.append("name", ofoundername);
		formData.append("designation", ofounderdes);
		formData.append("image", ofounderimg);
		await axiosInstanceAuth2
			.post(`/organization/organizationfounder/`, formData)
			.then(async (res) => {
				toastcomp("Organization founder Added", "success");

				let aname = `Organization Profile Updated by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				loadOrganizationFounder();
				setofounderdes("");
				setofounderimg();
				setofoundername("");
				setAddFounder(false);
			})
			.catch((err) => {
				toastcomp("founder Not Added", "error");
				console.log(err);
				loadOrganizationFounder();
				setofounderdes("");
				setofounderimg();
				setofoundername("");
				setAddFounder(false);
			});
	}

	async function delOrganizationFounder(val: any) {
		await axiosInstanceAuth2
			.delete(`/organization/organizationfounder/${val}/delete/`)
			.then(async (res) => {
				toastcomp("Organization founder Deleted", "success");

				let aname = `Organization Profile Updated by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				loadOrganizationFounder();
				setofounderdes("");
				setofounderimg();
				setofoundername("");
				setAddFounder(false);
			})
			.catch((err) => {
				toastcomp("Founder Not Deleted", "error");
				console.log(err);
				loadOrganizationFounder();
				setofounderdes("");
				setofounderimg();
				setofoundername("");
				setAddFounder(false);
			});
	}

	async function loadOrganizationGallery() {
		await axiosInstanceAuth2
			.get(`/organization/listorganizationgallery/`)
			.then(async (res) => {
				console.log("@", "gallery", res.data);
				setoGallery(res.data);
			})
			.catch((err) => {
				console.log("@", "gallery", err);
			});
	}

	async function addOrganizationGallery(formdata) {
		await axiosInstanceAuth2
			.post("/organization/organizationgallery/", formdata)
			.then(async (res) => {
				toastcomp("Gallery Added", "success");

				let aname = `Organization Profile Updated by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				loadOrganizationGallery();
				setoFile([]);
				setAddGalImages(false);
			})
			.catch((err) => {
				toastcomp("Gallery Not Added", "error");
				console.log(err);
				loadOrganizationGallery();
				setoFile([]);
				setAddGalImages(false);
			});
	}

	function saveGallery() {
		if (ofile.length > 0) {
			for (let i = 0; i < ofile.length; i++) {
				const formData = new FormData();
				formData.append("image", ofile[i]);
				addOrganizationGallery(formData);
			}
		}
	}

	async function delOrganizationGallery(val: any) {
		await axiosInstanceAuth2
			.delete(`/organization/organizationgallery/${val}/delete/`)
			.then(async (res) => {
				toastcomp("Organization Gallery Deleted", "success");

				let aname = `Organization Profile Updated by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				loadOrganizationGallery();
			})
			.catch((err) => {
				toastcomp("Gallery Not Deleted", "error");
				console.log(err);
				loadOrganizationGallery();
			});
	}

	useEffect(() => {
		if (token && token.length > 0) {
			loadIndividualProfile();
			loadOrganizationProfile();
			loadOrganizationFounder();
			loadOrganizationGallery();
		}
	}, [token]);

	useEffect(() => {
		if (iprofile && iprofile.length > 0) {
			for (let i = 0; i < iprofile.length; i++) {
				if (iprofile[i]["profile"]) {
					setpurl(iprofile[i]["profile"]);
				} else {
					setpurl("");
				}

				if (iprofile[i]["organization_Name"]) {
					setoname(iprofile[i]["organization_Name"]);
					setbluroname(iprofile[i]["organization_Name"]);
				} else {
					setoname("");
				}

				if (iprofile[i]["full_Name"]) {
					setfname(iprofile[i]["full_Name"]);
					setblurfname(iprofile[i]["full_Name"]);
				} else {
					setfname("");
				}

				if (iprofile[i]["contact_Number"]) {
					setcontact(iprofile[i]["contact_Number"]);
					setblurcontact(iprofile[i]["contact_Number"]);
				} else {
					setcontact("");
				}

				if (iprofile[i]["email"]) {
					setemail(iprofile[i]["email"]);
					setbluremail(iprofile[i]["email"]);
				} else {
					setemail("");
				}

				if (iprofile[i]["title"]) {
					settitle(iprofile[i]["title"]);
					setblurtitle(iprofile[i]["title"]);
				} else {
					settitle("");
				}

				if (iprofile[i]["department"]) {
					setdept(iprofile[i]["department"]);
					setblurdept(iprofile[i]["department"]);
				} else {
					setdept("");
				}

				setiuniqueid(iprofile[i]["unique_id"]);
			}
		}
	}, [iprofile]);

	useEffect(() => {
		if (oprofile && oprofile.length > 0) {
			for (let i = 0; i < oprofile.length; i++) {
				if (oprofile[i]["about_org"]) {
					setoabout(oprofile[i]["about_org"]);
					setbluroabout(oprofile[i]["about_org"]);
				} else {
					setoabout("");
				}

				if (oprofile[i]["about_founder"]) {
					setoafounder(oprofile[i]["about_founder"]);
					setbluroafounder(oprofile[i]["about_founder"]);
				} else {
					setoafounder("");
				}

				if (oprofile[i]["org_Url"]) {
					setourl(oprofile[i]["org_Url"]);
					setblurourl(oprofile[i]["org_Url"]);
				} else {
					setourl("");
				}

				if (oprofile[i]["contact_Number"]) {
					setocontact(oprofile[i]["contact_Number"]);
					setblurocontact(oprofile[i]["contact_Number"]);
				} else {
					setocontact("");
				}

				if (oprofile[i]["company_Size"]) {
					setocsize(oprofile[i]["company_Size"]);
					setblurocsize(oprofile[i]["company_Size"]);
				} else {
					setocsize("");
				}

				if (oprofile[i]["workplace_Type"]) {
					setowplace(oprofile[i]["workplace_Type"]);
					setblurowplace(oprofile[i]["workplace_Type"]);
				} else {
					setowplace("");
				}

				if (oprofile[i]["headquarter_Location"]) {
					setohlocation(oprofile[i]["headquarter_Location"]);
					setblurohlocation(oprofile[i]["headquarter_Location"]);
				} else {
					setohlocation("");
				}

				if (oprofile[i]["branch_Office"]) {
					setoboffice(oprofile[i]["branch_Office"]);
					setbluroboffice(oprofile[i]["branch_Office"]);
				} else {
					setoboffice("");
				}

				if (oprofile[i]["organization_Benefits"]) {
					setobenefits(oprofile[i]["organization_Benefits"]);
					setblurobenefits(oprofile[i]["organization_Benefits"]);
				} else {
					setobenefits("");
				}

				if (oprofile[i]["funding_Details"]) {
					setofund(oprofile[i]["funding_Details"]);
					setblurofund(oprofile[i]["funding_Details"]);
				} else {
					setofund("");
				}

				if (oprofile[i]["logo"]) {
					setologo(oprofile[i]["logo"]);
				} else {
					setologo("");
				}

				if (oprofile[i]["banner"]) {
					setobanner(oprofile[i]["banner"]);
				} else {
					setobanner("");
				}

				if (oprofile[i]["offer"]) {
					if(process.env.NODE_ENV === "production"){
setwordpath(oprofile[i]["offer"].replace("http:","https:"));
					}
					else{

						setwordpath(oprofile[i]["offer"]);
					}
				} else {
					setwordpath("");
				}

				// setiuniqueid(iprofile[i]["unique_id"])
			}
		}
	}, [oprofile]);

	useEffect(() => {
		if (iuniqueid && iuniqueid.length > 0) {
			loadIndividualLink();
		}
	}, [iuniqueid]);

	useEffect(() => {
		if (iprofile && iprofile.length > 0) {
			var formData = new FormData();
			if (iprofile[0]["organization_Name"] != bluroname) {
				formData.append("organization_Name", bluroname);
			}
			if (iprofile[0]["full_Name"] != blurfname) {
				formData.append("full_Name", blurfname);
			}
			if (iprofile[0]["contact_Number"] != blurcontact) {
				formData.append("contact_Number", blurcontact);
			}
			if (iprofile[0]["email"] != bluremail) {
				formData.append("email", bluremail);
			}
			if (iprofile[0]["title"] != blurtitle) {
				formData.append("title", blurtitle);
			}
			if (iprofile[0]["department"] != blurdept) {
				formData.append("department", blurdept);
			}
			if (profileimg) {
				formData.append("profile", profileimg);
			}

			if (Array.from(formData.keys()).length > 0) {
				saveIndividualProfile(formData);
			}
		}
	}, [bluroname, blurfname, blurcontact, bluremail, blurtitle, blurdept, profileimg]);

	useEffect(() => {
		if (oprofile && oprofile.length > 0) {
			var formData = new FormData();
			if (oprofile[0]["about_org"] != bluroabout) {
				formData.append("about_org", bluroabout);
			}
			if (oprofile[0]["about_founder"] != bluroafounder) {
				formData.append("about_founder", bluroafounder);
			}
			if (oprofile[0]["org_Url"] != blurourl) {
				formData.append("org_Url", blurourl);
			}
			if (oprofile[0]["contact_Number"] != blurocontact) {
				formData.append("contact_Number", blurocontact);
			}
			if (oprofile[0]["company_Size"] != ocsize) {
				formData.append("company_Size", ocsize);
			}
			if (oprofile[0]["workplace_Type"] != owplace) {
				formData.append("workplace_Type", owplace);
			}
			if (oprofile[0]["headquarter_Location"] != blurohlocation) {
				formData.append("headquarter_Location", blurohlocation);
			}
			if (oprofile[0]["branch_Office"] != bluroboffice) {
				formData.append("branch_Office", bluroboffice);
			}
			if (oprofile[0]["organization_Benefits"] != blurobenefits) {
				formData.append("organization_Benefits", blurobenefits);
			}
			if (oprofile[0]["funding_Details"] != blurofund) {
				formData.append("funding_Details", blurofund);
			}
			if (oulogo) {
				formData.append("logo", oulogo);
				setoulogo();
			}
			if (oubanner) {
				formData.append("banner", oubanner);
				setoubanner();
			}

			if (Array.from(formData.keys()).length > 0) {
				saveOrganizationProfile(formData);
			}
		}
	}, [
		bluroabout,
		bluroafounder,
		blurourl,
		blurocontact,
		ocsize,
		owplace,
		blurohlocation,
		bluroboffice,
		blurobenefits,
		blurofund,
		oulogo,
		oubanner
	]);

	function geticon(param1: string) {
		if (param1.toLowerCase().includes("facebook")) {
			return "fa-brands fa-facebook";
		} else if (param1.toLowerCase().includes("twitter")) {
			return "fa-brands fa-twitter";
		} else if (param1.toLowerCase().includes("instagram")) {
			return "fa-brands fa-instagram";
		} else if (param1.toLowerCase().includes("linkedin")) {
			return "fa-brands fa-linkedin";
		} else if (param1.toLowerCase().includes("github")) {
			return "fa-brands fa-github";
		} else if (param1.toLowerCase().includes("discord")) {
			return "fa-brands fa-discord";
		} else if (param1.toLowerCase().includes("youtube")) {
			return "fa-brands fa-youtube";
		} else if (param1.toLowerCase().includes("behance")) {
			return "fa-brands fa-behance";
		} else if (param1.toLowerCase().includes("behance")) {
			return "fa-brands fa-behance";
		} else {
			return "fa-solid fa-link";
		}
	}

	function gettitle(param1: string) {
		if (param1.toLowerCase().includes("facebook")) {
			return "facebook";
		} else if (param1.toLowerCase().includes("twitter")) {
			return "twitter";
		} else if (param1.toLowerCase().includes("instagram")) {
			return "instagram";
		} else if (param1.toLowerCase().includes("linkedin")) {
			return "linkedin";
		} else if (param1.toLowerCase().includes("github")) {
			return "github";
		} else if (param1.toLowerCase().includes("discord")) {
			return "discord";
		} else if (param1.toLowerCase().includes("youtube")) {
			return "youtube";
		} else if (param1.toLowerCase().includes("behance")) {
			return "behance";
		} else {
			return "link";
		}
	}

	//change password
	const [pass, setpass] = useState("");
	const [cpass, setcpass] = useState("");

	function verfiyPassword() {
		return pass.length > 8 && pass === cpass;
	}

	async function changePassword() {
		const fd = new FormData();
		fd.append("password", pass);
		fd.append("password2", cpass);
		await axiosInstanceAuth2
			.post(`/auth/change-password/`, fd)
			.then(async (res) => {
				toastcomp("Password Change SucessFully", "success");
				setChangePass(false);
				setpass("");
				setcpass("");
			})
			.catch((err) => {
				console.log("@", "gallery", err);
				toastcomp("Password Not Change", "error");
				setChangePass(false);
				setpass("");
				setcpass("");
			});
	}
	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);
	const joyrideSteps = [
		{
			target: ".tab-heading-0",
			title: t("Words.IndividualProfile"),
			content: "This tab allows you to view and manage details specific to individual profiles.",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true
		},
		{
			target: ".tab-heading-1",
			title: t("Words.OrganizationProfile"),
			content: "This tab allows you to view and manage details specific to your organization's profile.",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true
		},
		{
			target: ".tab-heading-3",
			title: t("Words.OfferLetterFormat"),
			content: "This tab allows you to customize the format and content of offer letters.",
			placement: "bottom",
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true
		}
	];

	return (
		<>
			<Head>
				<title>{t("Words.Profile")}</title>
			</Head>
			<main>
				<OrgSideBar />
				<OrgTopBar showTopbar={shouldShowTopBar} />
				{token && token.length > 0 && <OrgRSideBar axiosInstanceAuth2={axiosInstanceAuth2} />}
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className={`layoutWrap p-4` + " " + (visible && "mr-[calc(27.6%+1rem)]")}>
					<Joyride
						steps={joyrideSteps}
						run={shouldShowJoyride}
						continuous={true}
						styles={{
							options: {
								arrowColor: "#0066ff", // Set to primary color
								backgroundColor: "#F5F8FA", // Set to lightBlue
								overlayColor: "rgba(0, 0, 0, 0.4)", // Adjusted to match your styling
								primaryColor: "#0066ff", // Set to primary color
								textColor: "#3358c5", // Set to secondary color
								// width: 100, // Adjust as needed
								zIndex: 1000 // Set as needed
							}
						}}
						showProgress={true}
						showSkipButton={true}
						callback={(data: any) => {
							const { action, status, step, index } = data;
							// console.log("index ye hai", index);
							// console.log("status ye hai", status);
							// setActiveTab(index);
							// console.log("abhi step ye hain", step.title);
							if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
								// setTourCompleted(true);
								setShouldShowTopBar(true);
								// setCurrentStep(1);
							}
							if (action === "close") {
								setIsTourOpen(false);
								setTourCompleted(true); // Mark the tour as completed when the user closes it
							}
						}}
					/>
					<div className="rounded-normal bg-white shadow-normal dark:bg-gray-800">
						<div className="py-4">
							<div className="mx-auto mb-4 flex w-full max-w-[1100px] flex-wrap items-center justify-start px-4 py-2">
								<button
									onClick={() => router.back()}
									className="mr-10 justify-self-start text-darkGray dark:text-gray-400"
								>
									<i className="fa-solid fa-arrow-left text-xl"></i>
								</button>
								<h2 className="flex items-center text-lg font-bold">
									<div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded bg-[#B2E3FF] p-3">
										<Image src={userIcon} alt="Active Job" height={20} />
									</div>
									<span>{t("Words.Profile")}</span>
								</h2>
							</div>
							<Tab.Group>
								<div className={"overflow-auto border-b px-4"}>
									<Tab.List className={"mx-auto w-full max-w-[950px]"}>
										<div className="w-[790px]">
											{tabHeading_1.map((item, i) => (
												<Tab key={i} as={Fragment} className={`tab-heading-${i}`}>
													{({ selected }) => (
														<button
															className={
																"mr-16 border-b-4 py-2 font-semibold focus:outline-none" +
																" " +
																(selected
																	? "border-primary text-primary dark:border-white dark:text-white"
																	: "border-transparent text-darkGray dark:text-gray-400") +
																" " +
																(item.blur ? "display-none" : "")
															}
														>
															{item.title}
														</button>
													)}
												</Tab>
											))}
										</div>
									</Tab.List>
								</div>
								<Tab.Panels className={"mx-auto w-full max-w-[980px] px-4 py-8"}>
									<Tab.Panel>
										<div className="mb-4">
											<UploadProfile
												note="Supported Formats 2 mb  : Png , Jpeg"
												handleChange={(e) => setProfileImg(e.target.files[0])}
												purl={purl}
											/>
										</div>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label={t("Form.OrgName")}
													value={
														oprofile &&
														oprofile.length > 0 &&
														oprofile[0]["user"] &&
														oprofile[0]["user"]["company_name"]
													}
													// handleChange={(e) => setoname(e.target.value)}
													// handleOnBlur={(e) => setbluroname(e.target.value)}
													id={""}
													readOnly
													required
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="email"
													label={t("Form.Email")}
													value={currentUser[0]["email"]}
													required
													id={""}
													readOnly
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label={t("Form.FullName")}
													value={fname}
													handleChange={(e) => setfname(e.target.value)}
													handleOnBlur={(e) => setblurfname(e.target.value)}
													id={""}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="number"
													label={t("Form.PhoneNumber")}
													value={contact}
													handleChange={(e) => setcontact(e.target.value)}
													handleOnBlur={(e) => setblurcontact(e.target.value)}
													id={""}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label={t("Words.Title")}
													value={title}
													handleChange={(e) => settitle(e.target.value)}
													handleOnBlur={(e) => setblurtitle(e.target.value)}
													id={""}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label={t("Words.Department")}
													value={dept}
													handleChange={(e) => setdept(e.target.value)}
													handleOnBlur={(e) => setblurdept(e.target.value)}
													id={""}
												/>
											</div>
										</div>
										<hr className="my-4" />
										<div>
											<div className="flex flex-wrap items-center justify-between">
												<h6 className="mb-1 font-bold">{t("Words.AddSocialLogins")}</h6>
												<Button2
													btnType="button"
													btnStyle="iconRightBtn"
													label={t("Btn.Add")}
													iconRight={<i className="fa-solid fa-circle-plus"></i>}
													handleClick={() => setAddSocial(true)}
												/>
											</div>
											<div className="flex flex-wrap">
												{ilink &&
													ilink.map((data, i) => (
														<div className="relative mb-4 mr-6 p-1" key={i}>
															<Link href={data["title"]} className="text-center">
																<span className="mx-auto mb-1 block h-8 w-8 rounded bg-white p-1 shadow-normal dark:bg-gray-500">
																	<i className={`${geticon(data["title"])}`}></i>
																</span>
															</Link>
															<button
																type="button"
																className="absolute right-[0px] top-[-5px] rounded-full text-center text-[12px] font-bold text-red-500 dark:text-white"
																onClick={(e) => delIndividualLink(data["id"])}
															>
																<i className="fa-solid fa-circle-xmark"></i>
															</button>
														</div>
													))}
											</div>
										</div>
										<hr className="my-4" />
										<div>
											<h6 className="mb-1 font-bold">{t("Form.Password") + " " + t("Words.Settings")}</h6>
											<Button2
												btnType="button"
												label={t("Btn.ChangePassword")}
												handleClick={() => setChangePass(true)}
												transitionClass="leading-pro ease-soft-in tracking-tight-soft active:opacity-85 transition-all duration-300 hover:scale-105"
											/>
										</div>
									</Tab.Panel>
									{/* org profile */}
									<Tab.Panel>
										<Tab.Group>
											<Tab.List className={"mb-6 border-b"}>
												{tabHeading_2.map((item, i) => (
													<Tab key={i} as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"mr-6 inline-flex items-center border-b-4 px-4 py-2 font-semibold focus:outline-none" +
																	" " +
																	(selected
																		? "border-primary text-primary dark:border-white dark:text-white"
																		: "border-transparent text-darkGray dark:text-gray-400") +
																	" " +
																	(item.blur ? "display-none" : "")
																}
															>
																<div className="mr-2">{item.icon}</div>
																{item.title}
															</button>
														)}
													</Tab>
												))}
											</Tab.List>
											<Tab.Panels>
												<Tab.Panel>
													<FormField
														fieldType="reactquill"
														label={t("Form.AboutTheOrganization")}
														value={oabout}
														handleChange={setoabout}
														handleOnBlur={setbluroabout}
													/>
													<div className="mb-4">
														<h6 className="mb-3 font-bold">{t("Form.FoundersInformation")}</h6>
														<div className="-mx-4 flex flex-wrap">
															{ofounder &&
																ofounder.map((data, i) => (
																	<div
																		className="mb-4 w-[50%] px-4 last:mb-0 md:max-w-[33.3333%] lg:max-w-[25%]"
																		key={i}
																	>
																		<div className="relative min-h-[180px] w-full rounded-normal p-4 text-center shadow-normal dark:bg-gray-700">
																			<Image
																				src={data["image"]}
																				alt="User"
																				width={300}
																				height={300}
																				className="mx-auto mb-3 h-[100px] w-[100px] rounded-full object-cover shadow-highlight"
																			/>
																			<h5 className="font-semibold">{data["name"]}</h5>
																			<p className="text-sm italic text-darkGray dark:text-gray-400">
																				{data["designation"]}
																			</p>
																			<button
																				type="button"
																				className="absolute right-2 top-2 text-red-500 hover:text-red-700"
																				onClick={(e) => delOrganizationFounder(data["id"])}
																			>
																				<i className="fa-solid fa-trash"></i>
																			</button>
																		</div>
																	</div>
																))}
															<div className="mb-4 w-[50%] px-4 last:mb-0 md:max-w-[33.3333%] lg:max-w-[25%]">
																<button
																	type="button"
																	className="flex min-h-[180px] w-full items-center justify-center rounded-normal border-2 border-dashed hover:bg-lightBlue dark:hover:bg-gray-700"
																	onClick={() => setAddFounder(true)}
																>
																	<i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
																</button>
															</div>
														</div>
													</div>
													<FormField
														fieldType="reactquill"
														label={t("Form.AboutTheFounder")}
														value={oafounder}
														handleChange={setoafounder}
														handleOnBlur={setbluroafounder}
													/>
													{/* <FormField fieldType="input" inputType="text" label="About Founder" value={oafounder} handleChange={(e) => setoafounder(e.target.value)} handleOnBlur={(e) => setbluroafounder(e.target.value)} /> */}
													<div className="-mx-3 flex flex-wrap">
														<div className="mb-4 w-full px-3 md:max-w-[50%]">
															<FormField
																fieldType="input"
																inputType="text"
																label={t("Form.OrganizationURL")}
																value={ourl}
																handleChange={(e) => setourl(e.target.value)}
																handleOnBlur={(e) => setblurourl(e.target.value)}
															/>
														</div>
														<div className="mb-4 w-full px-3 md:max-w-[50%]">
															<FormField
																fieldType="input"
																inputType="text"
																label={t("Form.OrganizationContactNumber")}
																value={ocontact}
																handleChange={(e) => setocontact(e.target.value)}
																handleOnBlur={(e) => setblurocontact(e.target.value)}
															/>
														</div>
														<div className="mb-4 w-full px-3 md:max-w-[50%]">
															<FormField
																fieldType="select2"
																label={t("Form.CompanySize")}
																value={ocsize}
																handleChange={setocsize}
																singleSelect
																options={["1-10", "10-50", "50-100", "100-500", "500+"]}
															/>
														</div>
														<div className="mb-4 w-full px-3 md:max-w-[50%]">
															<FormField
																fieldType="select2"
																label={t("Form.WorkplaceType")}
																value={owplace}
																handleChange={setowplace}
																singleSelect
																options={[t("Select.Remote"), t("Select.Office"), t("Select.Hybrid")]}
															/>
														</div>
														<div className="mb-4 w-full px-3 md:max-w-[50%]">
															<FormField
																fieldType="input"
																inputType="text"
																label={t("Form.HeadquarterLocation")}
																value={ohlocation}
																handleChange={(e) => setohlocation(e.target.value)}
																handleOnBlur={(e) => setblurohlocation(e.target.value)}
															/>
														</div>
														<div className="mb-4 w-full px-3 md:max-w-[50%]">
															<FormField
																fieldType="input"
																inputType="text"
																label={t("Form.BranchOfficeOptional")}
																value={oboffice}
																handleChange={(e) => setoboffice(e.target.value)}
																handleOnBlur={(e) => setbluroboffice(e.target.value)}
															/>
														</div>
														<div className="mb-4 w-full px-3 md:max-w-[50%]">
															<FormField
																fieldType="input"
																inputType="text"
																label={t("Form.OrganizationBenefits")}
																value={obenefits}
																handleChange={(e) => setobenefits(e.target.value)}
																handleOnBlur={(e) => setblurobenefits(e.target.value)}
															/>
														</div>
														<div className="mb-4 w-full px-3 md:max-w-[50%]">
															<FormField
																fieldType="input"
																inputType="text"
																label={t("Form.FundingDetails")}
																value={ofund}
																handleChange={(e) => setofund(e.target.value)}
																handleOnBlur={(e) => setblurofund(e.target.value)}
															/>
														</div>
													</div>
												</Tab.Panel>
												<Tab.Panel>
													<div className="mb-6">
														<h6 className="mb-3 font-bold">{t("Words.CompanyLogo")}</h6>
														<UploadProfile
															note="Supported Formats 2 mb  : Png , Jpeg"
															handleChange={(e) => setoulogo(e.target.files[0])}
															purl={ologo}
														/>
													</div>
													<div className="mb-6">
														<h6 className="mb-3 font-bold">{t("Words.BannerImage")}</h6>
														{obanner && obanner.legth <= 0 ? (
															<label
																htmlFor="uploadBanner"
																className="flex min-h-[180px] w-full cursor-pointer items-center justify-center rounded-normal border-2 border-dashed hover:bg-lightBlue dark:hover:bg-gray-700"
															>
																<i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
																<input
																	type="file"
																	hidden
																	id="uploadBanner"
																	onChange={(e) => setoubanner(e.target.files[0])}
																/>
															</label>
														) : (
															<div className="relative block w-full overflow-hidden rounded-normal border">
																<Image
																	src={obanner}
																	alt="User"
																	width={1200}
																	height={1200}
																	className="h-[200px] w-full object-cover"
																/>
																<div className="absolute right-0 top-[-1px] overflow-hidden rounded-bl shadow-highlight">
																	{/* <button type="button" className="bg-white hover:bg-red-200 text-red-500 w-6 h-6 leading-6 text-center text-[12px] border-b">
                                                                    <i className={'fa-solid fa-trash'}></i>
                                                                </button> */}
																	<label
																		htmlFor="editBanner"
																		className="block h-6 w-6 cursor-pointer bg-white text-center text-[12px] leading-6 text-slate-500 hover:bg-slate-200"
																	>
																		<i className={"fa-solid fa-edit"}></i>
																		<input
																			type="file"
																			id="editBanner"
																			onChange={(e) => setoubanner(e.target.files[0])}
																			hidden
																		/>
																	</label>
																</div>
															</div>
														)}
													</div>
													<div className="mb-6">
														<h6 className="mb-3 font-bold">{t("Words.WorkplaceCulture")}</h6>
														<div className="overflow-hidden rounded-normal bg-white shadow-highlight dark:bg-gray-700">
															<div className="flex items-center justify-between bg-lightBlue p-3 dark:bg-gray-600">
																<h4 className="font-semibold">{t("Words.UploadImages")}</h4>
																<Button2
																	small
																	btnType="submit"
																	label={t("Btn.Add")}
																	handleClick={() => setAddGalImages(true)}
																/>
															</div>
															<div className="p-6">
																{ogallery && ogallery.length > 0 ? (
																	<>
																		<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
																			<Masonry className="masonary_grid">
																				{ogallery.map((data, i) => (
																					<div key={i} className="relative">
																						<Image
																							src={data["image"]}
																							height={800}
																							width={1200}
																							alt="Gallery"
																							className="w-full p-1"
																						/>
																						<button
																							type="button"
																							className="absolute right-2 top-2 h-7 w-7 rounded-full bg-white text-sm text-red-500 hover:text-red-700"
																							onClick={(e) => delOrganizationGallery(data["id"])}
																						>
																							<i className="fa-solid fa-trash"></i>
																						</button>
																					</div>
																				))}
																			</Masonry>
																		</ResponsiveMasonry>
																	</>
																) : (
																	<>
																		<div
																			className="flex min-h-[200px] cursor-pointer items-center justify-center"
																			onClick={() => setAddGalImages(true)}
																		>
																			<Image src={galleryUpload} alt="Upload" />
																		</div>
																	</>
																)}
															</div>
														</div>
													</div>
													{!upcomingSoon && (
														<div className="-mx-3 flex flex-wrap">
															<div className="mb-6 w-full px-3 lg:max-w-[50%]">
																<h6 className="mb-3 font-bold">{t("Words.ChooseColorPalates")}</h6>
																<div className="flex flex-wrap items-center">
																	<input type="color" id="favcolor" name="favcolor" className="h-8 w-8 bg-white" />
																</div>
															</div>
															<div className="w-full px-3 lg:max-w-[50%]">
																<h6 className="mb-3 font-bold">{t("Words.ConnectWithTeamCustomize")}</h6>
																<Button
																	btnStyle="iconLeftBtn"
																	label={t("Btn.SendEmail")}
																	iconLeft={<i className="fa-solid fa-envelope"></i>}
																/>
															</div>
														</div>
													)}
												</Tab.Panel>
												<Tab.Panel>
													{!upcomingSoon ? (
														<UpcomingComp />
													) : (
														<>
															<div className="flex flex-wrap justify-between">
																<h6 className="mb-2 whitespace-nowrap font-bold">{t("Words.AddWidget")}</h6>
																{oprofile && oprofile.length > 0 && oprofile[0]["user"] && (
																	<Link
																		className="whitespace-nowrap text-primary underline"
																		href={`https://ats.somhako.com/organization/${oprofile[0]["user"]["company_name"]}`}
																		target="_blank"
																	>
																		Visit Career Page
																	</Link>
																)}
															</div>
															<div className="flex rounded-normal border">
																<div className="flex w-[80%] items-center p-4">
																	<p>Link ATS Career Page with External Career Page</p>
																</div>
																<div className="w-[20%] rounded-normal bg-lightBlue p-4 text-center dark:bg-gray-600">
																	<Button2
																		btnType="button"
																		label={t("Btn.Add")}
																		handleClick={() => setAddWidget(true)}
																	/>
																</div>
															</div>
															{/* custom rating */}
															{userRole === "Super Admin" && (
																<div className="flex rounded-normal border">
																	<div className="flex w-[80%] flex-col items-start justify-center p-4">
																		<p>External Career Page AI Rating Filter {currentUser[0]["rating"]}%</p>
																		<small className="opacity-80">
																			Note: In case you do not wish to add the AI rating filter please mention 0.
																		</small>
																	</div>
																	<div className="mx-auto w-[20%] rounded-normal bg-lightBlue p-4 text-center text-center dark:bg-gray-600">
																		<input
																			type="number"
																			value={rating}
																			onChange={(e) => setrating(e.target.value)}
																			onBlur={handleRInputChange}
																			className="w-[40%]"
																		/>
																	</div>
																</div>
															)}
														</>
													)}
												</Tab.Panel>
											</Tab.Panels>
										</Tab.Group>
									</Tab.Panel>
									<Tab.Panel>
										{upcomingSoon ? (
											<UpcomingComp />
										) : (
											<>
												<div className="mb-6 flex flex-wrap items-center justify-between">
													<h5 className="mb-2 font-bold">Add Groups to your Parent Organization</h5>
													<Button
														btnStyle="iconRightBtn"
														label={t("Btn.Add")}
														iconRight={<i className="fa-solid fa-circle-plus"></i>}
														btnType="button"
														handleClick={() => setAddGroups(true)}
													/>
												</div>
												<div className="py-2">
													<p className="text-center text-darkGray dark:text-gray-400">No groups found</p>
													<div className="mx-[-15px] flex flex-wrap">
														{Array(5).fill(
															<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]">
																<div className="h-full rounded-normal bg-lightBlue p-4 shadow-highlight dark:bg-gray-700">
																	<div className="mb-2 flex items-start justify-between">
																		<Image
																			src={userImg}
																			alt="Logo"
																			width={100}
																			className="h-[50px] w-[50px] rounded-full object-cover"
																		/>
																		<button type="button" className="text-red-500 hover:text-red-700">
																			<i className="fa-solid fa-trash"></i>
																		</button>
																	</div>
																	<p className="mb-2 flex items-center justify-between text-sm text-darkGray dark:text-gray-400">
																		<span>Bell Cosmetic</span>
																		<span>ID - 45989</span>
																	</p>
																	<div className="flex items-center justify-between">
																		<Switch
																			checked={enabled}
																			onChange={setEnabled}
																			className={`${
																				enabled ? "bg-green-500" : "bg-gray-400"
																			} relative inline-flex h-6 w-11 items-center rounded-full`}
																		>
																			<span className="sr-only">Enable notifications</span>
																			<span
																				className={`${
																					enabled ? "translate-x-6" : "translate-x-1"
																				} inline-block h-4 w-4 transform rounded-full bg-white transition`}
																			/>
																		</Switch>
																		<Button btnStyle="outlined" label="Edit" />
																	</div>
																</div>
															</div>
														)}
													</div>
												</div>
											</>
										)}
									</Tab.Panel>
									<Tab.Panel>
										{["standard", "starter"].includes(atsVersion) ? (
											<PermiumComp userRole={userRole} />
										) : (
											<>
												<section className="px-10 py-6">
													<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
														<p className="my-2">
															{word != null || wordpath != "" ? (
																<>FileName (Offer Letter)</>
															) : (
																<>Select Offer Letter (Offer Letter)</>
															)}
														</p>
														{word != null || wordpath != "" ? (
															<div>
																<button
																	className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																	onClick={handleDownload}
																>
																	<i className="fa-solid fa-download mr-2"></i>
																	Download
																</button>
																&nbsp;|&nbsp;
																<button
																	className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																	onClick={() => resetOL()}
																>
																	Reset
																</button>
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
													{value && value.length > 0 && (word != null || wordpath != "") && (
														<>
															<div className="border py-2">
																<article
																	className="m-6"
																	ref={htmlRef}
																	id="contentABC"
																	dangerouslySetInnerHTML={{ __html: value }}
																></article>
															</div>
														</>
													)}
												</section>
											</>
										)}
									</Tab.Panel>
								</Tab.Panels>
							</Tab.Group>
						</div>
					</div>
				</div>
			</main>
			<Transition.Root show={addSocial} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddSocial}>
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
										<h4 className="flex items-center font-semibold leading-none">{t("Words.AddSocialLogins")}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddSocial(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{/* <FormField
                                            fieldType="select"
                                            inputType="text"
                                            label="Choose social media"
                                            singleSelect
                                            options={[
                                                { name: "Facebook" },
                                                { name: "Twitter" }
                                            ]}
                                        /> */}
										<FormField
											fieldType="input"
											inputType="text"
											label="URL"
											value={iaddlink}
											handleChange={(e) => setiaddlink(e.target.value)}
										/>
										<div className="text-center">
											<Button
												label={t("Btn.Add")}
												disabled={!verifyLinkPopup()}
												btnType={"button"}
												handleClick={addIndividualLink}
											/>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={changePass} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setChangePass}>
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
										<h4 className="flex items-center font-semibold leading-none">{t("Btn.ChangePassword")}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setChangePass(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{/* <FormField fieldType="input" inputType="password" label={t('Form.OldPassword')} required /> */}
										<FormField
											fieldType="input"
											inputType="password"
											label={t("Form.NewPassword")}
											required
											value={pass}
											handleChange={(e) => setpass(e.target.value)}
										/>
										<FormField
											fieldType="input"
											inputType="password"
											label={t("Form.ConfirmPassword")}
											required
											value={cpass}
											handleChange={(e) => setcpass(e.target.value)}
										/>
										<div className="text-center">
											<Button
												label={t("Btn.Submit")}
												btnType="button"
												disabled={!verfiyPassword()}
												handleClick={changePassword}
											/>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={addFounder} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddFounder}>
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
										<h4 className="flex items-center font-semibold leading-none">{t("Form.AddNewFounder")}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddFounder(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="mb-4 text-center">
											<UploadProfile handleChange={(e) => setofounderimg(e.target.files[0])} purl={ofounderimgURL} />
										</div>
										<FormField
											fieldType="input"
											inputType="text"
											label={t("Form.FounderName")}
											value={ofoundername}
											handleChange={(e) => setofoundername(e.target.value)}
										/>
										<FormField
											fieldType="input"
											inputType="text"
											label={t("Form.FounderDesignation")}
											value={ofounderdes}
											handleChange={(e) => setofounderdes(e.target.value)}
										/>
										<div className="text-center">
											<Button
												label={t("Btn.Add")}
												disabled={!verifyFounderPopup()}
												btnType={"button"}
												handleClick={addOrganizationFounder}
											/>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={addWidget} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddWidget}>
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
											{srcLang === "ja" ? "採用ページのウィジェット" : "Create Page Widget"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddWidget(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="bg-primary p-8">
										<p className="text-sm text-white">
											The careers widget is a simple giving ATS Career Page Url of your jobs embedded on a dedicated
											page on your website, such as your careers page. All you will need is access to the Content
											Management System (CMS) of your website, then follow the easy and simple steps mentioned below:
										</p>
									</div>
									<div className="p-8">
										<ul className="list-disc pl-4 text-sm">
											<li className="mb-4">
												Access the HTML on the webpage where you want the display search jobs button.
											</li>
											{oprofile && oprofile.length > 0 && oprofile[0]["user"] && (
												<>
													<li className="mb-4">
														Copy the below URL only and paste it into your website.
														<div className="mt-2 flex rounded border">
															<div className="flex w-[calc(100%-50px)] items-center border-r p-2">
																<p className="text-[12px]">
																	{`https://ats.somhako.com/organization/${oprofile[0]["user"]["company_name"]}`}
																</p>
															</div>

															<button
																type="button"
																className="w-[50px] p-3"
																onClick={() => {
																	navigator.clipboard.writeText(
																		`https://ats.somhako.com/organization/${oprofile[0]["user"]["company_name"]}`
																	);
																	toastcomp("URL Copied to clipboard", "success");
																}}
															>
																<i className="fa-solid fa-copy"></i>
															</button>
														</div>
													</li>
													<li className="mb-4">
														Copy the below URL tag and paste it into your website.
														<div className="mt-2 flex rounded border">
															<div className="flex w-[calc(100%-50px)] items-center border-r p-2">
																<p className="text-[12px]">
																	{/* {`https://ats.somhako.com/organization/${oprofile[0]["user"]["company_name"]}`} */}
																	&#60;a href=&ldquo;
																	{`https://ats.somhako.com/organization/${oprofile[0]["user"]["company_name"]}`}
																	&rdquo; target=&ldquo;_blank&rdquo;&#62;Search Jobs&#60;/a&#62;
																</p>
															</div>

															<button
																type="button"
																className="w-[50px] p-3"
																onClick={() => {
																	navigator.clipboard.writeText(
																		`<a href=“https://ats.somhako.com/organization/${oprofile[0]["user"]["company_name"]}” target=“_blank”>Search Jobs</a>`
																	);
																	toastcomp("URL tag Copied to clipboard", "success");
																}}
															>
																<i className="fa-solid fa-copy"></i>
															</button>
														</div>
													</li>
												</>
											)}
											<li className="mb-4">Addtional Note : available to modify CSS of above URL tag.</li>
											<li className="mb-4">
												{srcLang === "ja" ? "ページをプレビュー・公開" : "Preview the page and publish."}
											</li>
											<li className="mb-4">
												{srcLang === "ja"
													? "これで完了です。ウィジェットを追加したページに作成したすべての求人が反映されます。"
													: "Done. Now all of your created jobs will reflect on the page where you added the widget."}
											</li>
										</ul>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={addGalImages} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddGalImages}>
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
											{t("Btn.Add") + " " + t("Words.Gallery")}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddGalImages(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<label
											htmlFor="addGallery"
											className="mb-4 flex min-h-[180px] w-full cursor-pointer items-center justify-center rounded-normal border-2 border-dashed hover:bg-lightBlue dark:hover:bg-gray-700"
										>
											<i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
											<input type="file" hidden id="addGallery" accept="image/*" onChange={onImageChange} multiple />
										</label>
										{ofile.length > 0 && (
											<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
												<Masonry>
													{ofile.map((imageSrc, i) => (
														<div id={`gallerypopup${i}`} key={i} className="relative">
															<Image
																src={URL.createObjectURL(imageSrc)}
																height={800}
																width={1200}
																alt="Gallery"
																className="w-full p-1"
															/>
															<button
																type="button"
																className="absolute right-2 top-2 h-7 w-7 rounded-full bg-white text-sm text-red-500 hover:text-red-700"
																onClick={() => deleteUImage(i)}
															>
																<i className="fa-solid fa-trash"></i>
															</button>
														</div>
													))}
												</Masonry>
											</ResponsiveMasonry>
										)}
										<div className="text-center">
											<Button
												label={t("Btn.Add")}
												disabled={!verifyGalPopup()}
												btnType={"button"}
												handleClick={saveGallery}
											/>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={addGroups} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddGroups}>
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
											{t("Btn.Add") + " " + t("Words.Group")}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddGroups(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="text-center">
											<UploadProfile note="Supported Formats 2 mb  : Png , Jpeg" />
										</div>
										<FormField
											fieldType="input"
											inputType="text"
											label={srcLang === "ja" ? "グループ名" : "Name of group"}
										/>
										<FormField
											fieldType="input"
											inputType="text"
											label={srcLang === "ja" ? "グループ（親組織）" : "Group (Parent Organization)"}
										/>
										<div className="text-center">
											<Button label={t("Btn.Add")} />
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
export async function getStaticProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	return {
		props: {
			...translations
		}
	};
}
