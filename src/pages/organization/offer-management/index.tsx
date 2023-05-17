import Head from "next/head";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import TeamMembers from "@/components/TeamMembers";
import { Dialog, Listbox, Tab, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
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

const people = [
	{ id: 1, name: "Durward Reynolds", unavailable: false },
	{ id: 2, name: "Kenton Towne", unavailable: false },
	{ id: 3, name: "Therese Wunsch", unavailable: false },
	{ id: 4, name: "Benedict Kessler", unavailable: true },
	{ id: 5, name: "Katelyn Rohan", unavailable: false }
];

export default function OfferManagement() {
	const [sklLoad] = useState(true);
	const [selectedPerson, setSelectedPerson] = useState(people[0]);

	const cancelButtonRef = useRef(null);
	const [discussEmail, setDiscussEmail] = useState(false);

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
	const [userID, setuserID] = useState(0);
	const [newoffer, setnewoffer] = useState(true);
	const [oldofferID, setoldofferID] = useState(0);
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


	async function loadApplicant() {
		await axiosInstanceAuth2
			.get(`/job/listapplicant/`)
			.then(async (res) => {
				console.log("@", "Applicant Load", res.data);
				setapplicantlist(res.data);
				setrefersh(0);
			})
			.catch((err) => {
				console.log("@", "Applicant Load", err);
				setapplicantlist([]);
				setrefersh(0);
			});
	}

	async function loadTeamMember() {
		await axiosInstanceAuth2
			.get(`/organization/listorguser/`)
			.then(async (res) => {
				console.log("@", "listorguser", res.data);
				settm(res.data);
				let arr = []
				var data = res.data
				for(let i=0;i<data.length;i++){
					if(data[i]["role"] === "Hiring Manager" && data[i]["verified"] === true){
						arr.push(data[i]["email"])
					}
				}
				sethmanage(arr)
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

	function checkOfferExist(arefid) {
		setnewoffer(true);
		setdesignation("")
		setdept("")
		setsection("")
		setdiv("")
		setgrade("")
		setlocation("")
		setcurr("")
		settype("")
		setfrom("")
		setto("")
		setctype("")
		setvisa("")
		setrelocation("")
		setapproval("")
		
		for (let i = 0; i < om.length; i++) {
			if (om[i]["applicant"]["arefid"] === arefid) {
				setnewoffer(false);
				setoldofferID(i);
				console.log("@",om[i])		
				if(om[i]["designation"] && om[i]["designation"].length > 0){setdesignation(om[i]["designation"])}
				if(om[i]["department"] && om[i]["department"].length > 0){setdept(om[i]["department"])}
				if(om[i]["section"] && om[i]["section"].length > 0){setsection(om[i]["section"])}
				if(om[i]["divsion"] && om[i]["divsion"].length > 0){setdiv(om[i]["divsion"])}
				if(om[i]["grade"] && om[i]["grade"].length > 0){setgrade(om[i]["grade"])}
				if(om[i]["location"] && om[i]["location"].length > 0){setlocation(om[i]["location"])}
				if(om[i]["currency"] && om[i]["currency"].length > 0){setcurr(om[i]["currency"])}
				if(om[i]["salary_type"] && om[i]["salary_type"].length > 0){settype(om[i]["salary_type"])}
				if(om[i]["salary_from"] && om[i]["salary_from"].length > 0){setfrom(om[i]["salary_from"])}
				if(om[i]["salary_to"] && om[i]["salary_to"].length > 0){setto(om[i]["salary_to"])}
				if(om[i]["candidate_type"] && om[i]["candidate_type"].length > 0){setctype(om[i]["candidate_type"])}
				if(om[i]["visa_sponsorship"] && om[i]["visa_sponsorship"].length > 0){setvisa(om[i]["visa_sponsorship"])}
				if(om[i]["paid_relocation"] && om[i]["paid_relocation"].length > 0){setrelocation(om[i]["paid_relocation"])}
			}
		}
		console.log("@", "New Offer ?", newoffer);
	}

	useEffect(() => {
		if (token.length > 0 && refersh > 0) {
			loadApplicant();
			loadTeamMember();
			loadOffer();
		}
	}, [token, refersh]);

	return (
		<>
			<Head>
				<title>Offer Management</title>
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
						<div className="w-full lg:max-w-[280px]">
							<FormField
								fieldType="input"
								inputType="search"
								placeholder="Search applicants, jobs ..."
								icon={<i className="fa-solid fa-magnifying-glass"></i>}
							/>
							<div>
								{applicantlist
									? applicantlist.map((data, i) => (
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
														<Image src={userImg} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
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
									  ))
									: Array(5).fill(
											<div className="mb-4 rounded-normal bg-white px-4 py-2 shadow-normal last:mb-0 dark:bg-gray-800">
												<div className="mb-2 flex items-center justify-between">
													<aside className="flex items-center">
														<Skeleton circle width={30} height={30} />
														<h5 className="grow pl-4 text-sm font-semibold">
															<Skeleton width={100} />
														</h5>
													</aside>
													<aside>
														<Skeleton width={16} height={16} />
													</aside>
												</div>
												<p className="mb-2 text-[12px] text-darkGray dark:text-gray-400">
													<Skeleton width={100} />
												</p>
												<div className="flex items-center justify-between">
													<aside className="flex items-center text-[12px] text-darkGray dark:text-gray-400">
														<Skeleton width={130} />
													</aside>
													<span className="text-[10px] text-darkGray dark:text-gray-400">
														<Skeleton width={50} />
													</span>
												</div>
											</div>
									  )}
							</div>
						</div>
						{showOffer && (
							<div className="w-full pl-6 lg:max-w-[calc(100%-280px)]">
								<div className="rounded-normal border bg-white dark:border-gray-600 dark:bg-gray-800">
									<h2 className="flex justify-between px-10 py-4 text-xl font-bold">
										<span>
											{applicantlist[userID]["user"]["first_name"]}&nbsp;{applicantlist[userID]["user"]["last_name"]}
										</span>
										<span>{applicantlist[userID]["job"]["job_title"]}</span>
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
																? "border-primary text-primary"
																: "border-transparent text-darkGray dark:text-gray-400")
														}
													>
														Offer
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
																? "border-primary text-primary"
																: "border-transparent text-darkGray dark:text-gray-400")
														}
													>
														Timeline
													</button>
												)}
											</Tab>
										</Tab.List>
										<Tab.Panels>
											<Tab.Panel>
												<div className="mb-4 flex flex-wrap items-center justify-center border-b py-4 dark:border-b-gray-600">
													<div
														className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
														onClick={() => setstep(1)}
													>
														{step === 1 ? (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																	<span className="text-[32px] font-bold text-white"> 1 </span>
																</div>
																<p className="relative z-10 text-center text-sm font-bold">Offer Prepration</p>
															</>
														) : (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																	<span className="text-[32px] font-bold text-white"> 1 </span>
																	<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																</div>
																<p className="relative z-10 text-center text-sm font-bold">Offer Prepration</p>
															</>
														)}
													</div>
													<div
														className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
														onClick={() => setstep(2)}
													>
														{step === 2 ? (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																	<span className="text-[32px] font-bold text-white"> 2 </span>
																</div>
																<p className="relative z-10 text-center text-sm font-bold">Offer Finalization</p>
															</>
														) : step > 2 ? (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																	<span className="text-[32px] font-bold text-white"> 2 </span>
																	<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																</div>
																<p className="relative z-10 text-center text-sm font-bold">Offer Finalization</p>
															</>
														) : (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white p-2 shadow-highlight dark:bg-gray-600">
																	<span className="text-[32px] font-bold text-darkGray dark:text-gray-400"> 2 </span>
																</div>
																<p className="relative z-10 text-center text-sm font-bold text-darkGray dark:text-gray-400">
																	Offer Finalization
																</p>
															</>
														)}
													</div>
													<div
														className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
														onClick={() => setstep(3)}
													>
														{step === 3 ? (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																	<span className="text-[32px] font-bold text-white"> 3 </span>
																</div>
																<p className="relative z-10 text-center text-sm font-bold">Offer Discussion</p>
															</>
														) : step > 3 ? (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																	<span className="text-[32px] font-bold text-white"> 3 </span>
																	<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																</div>
																<p className="relative z-10 text-center text-sm font-bold">Offer Discussion</p>
															</>
														) : (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white p-2 shadow-highlight dark:bg-gray-600">
																	<span className="text-[32px] font-bold text-darkGray dark:text-gray-400"> 3 </span>
																</div>
																<p className="relative z-10 text-center text-sm font-bold text-darkGray dark:text-gray-400">
																	Offer Discussion
																</p>
															</>
														)}
													</div>
													<div
														className="after:content[''] relative w-[150px] p-4 after:absolute after:left-[50%] after:top-[50px] after:block after:h-[0px] after:w-[150px] after:border-b-2 after:border-dashed last:after:hidden dark:after:border-gray-600"
														onClick={() => setstep(4)}
													>
														{step === 4 ? (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																	<span className="text-[32px] font-bold text-white"> 4 </span>
																</div>
																<p className="relative z-10 text-center text-sm font-bold">Offer Status</p>
															</>
														) : step > 4 ? (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradDarkBlue p-2 shadow-highlight">
																	<span className="text-[32px] font-bold text-white"> 4 </span>
																	<i className="fa-solid fa-check text-[32px] text-green-300"></i>
																</div>
																<p className="relative z-10 text-center text-sm font-bold">Offer Status</p>
															</>
														) : (
															<>
																<div className="relative z-10 mx-auto mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white p-2 shadow-highlight dark:bg-gray-600">
																	<span className="text-[32px] font-bold text-darkGray dark:text-gray-400"> 4 </span>
																</div>
																<p className="relative z-10 text-center text-sm font-bold text-darkGray dark:text-gray-400">
																	Offer Status
																</p>
															</>
														)}
													</div>
												</div>
												{step === 1 && (
													<section className="px-10 py-6">
														<div className="mb-6 rounded-normal bg-red-100 px-6 py-4">
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
														</div>
														<div className="-mx-3 flex flex-wrap">
															<div className="mb-4 w-full px-3 md:max-w-[50%]">
																<FormField label="Designation" fieldType="input" inputType="text" value={designation} handleChange={(e)=>setdesignation(e.target.value)} />
															</div>
															<div className="mb-4 w-full px-3 md:max-w-[50%]">
																<FormField label="Department" fieldType="input" inputType="text" value={dept} handleChange={(e)=>setdept(e.target.value)} />
															</div>
															<div className="mb-4 w-full px-3 md:max-w-[50%]">
																<FormField label="Section" fieldType="input" inputType="text" value={section} handleChange={(e)=>setsection(e.target.value)} />
															</div>
															<div className="mb-4 w-full px-3 md:max-w-[50%]">
																<FormField label="Division" fieldType="input" inputType="text" value={div} handleChange={(e)=>setdiv(e.target.value)} />
															</div>
															<div className="mb-4 w-full px-3 md:max-w-[50%]">
																<FormField label="Grade" fieldType="input" inputType="text"  value={grade} handleChange={(e)=>setgrade(e.target.value)}/>
															</div>
															<div className="mb-4 w-full px-3 md:max-w-[50%]">
																<FormField label="Location" fieldType="input" inputType="text"  value={location} handleChange={(e)=>setlocation(e.target.value)}/>
															</div>
														</div>
														<div className="mb-4">
															<h4 className="mb-2 font-bold">Salary Range</h4>
															<div className="flex flex-wrap">
																<div className="w-[170px] pr-6 last:pr-0">
																	<FormField placeholder="Currency" fieldType="select2" 
													singleSelect value={curr}
													handleChange={setcurr}  options={[
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
                                "ZWL ZWL$",
                              ]} />
																</div>
																<div className="w-[170px] pr-6 last:pr-0">
																	<FormField placeholder="Type" singleSelect fieldType="select2" options={['Monthly','Yearly']} value={type} handleChange={settype} />
																</div>
																<div className="grow pr-6 last:pr-0">
																	<FormField placeholder="From" fieldType="input" inputType="number" value={from} handleChange={(e)=>setfrom(e.target.value)} />
																</div>
																<div className="grow pr-6 last:pr-0">
																	<FormField placeholder="To" fieldType="input" inputType="number" value={to} handleChange={(e)=>setto(e.target.value)} />
																</div>
															</div>
														</div>
														<FormField label="Candidate Type" singleSelect fieldType="select2" options={['Full Time','Part TIme', 'Internship']} value={ctype} handleChange={setctype} />
														<div className="flex flex-wrap">
															<div className="grow pr-6 last:pr-0">
															<FormField label="Visa Sponsorship" singleSelect fieldType="select2" options={['Yes','No']} value={visa} handleChange={setvisa} />
															</div>
															<div className="grow pr-6 last:pr-0">
															<FormField label="Paid Relocation" singleSelect fieldType="select2" options={['Yes','No']} value={relocation} handleChange={setrelocation} />
															</div>
														</div>
														<FormField label="Approval Authorities" fieldType="select2" options={hmanage} value={approval} handleChange={setapproval} />
														<Button label="Send For Approval" />
													</section>
												)}

												{step === 2 && (
													<section className="px-10 py-6">
														<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
															<p className="my-2">FileName (Offer Letter)</p>
															<Link
																href={`#`}
																className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																download
															>
																<i className="fa-solid fa-download mr-2"></i>
																Download
															</Link>
														</div>
														<div className="py-2">
															<p className="py-4 text-center">Preview Here</p>
															<div className="flex flex-wrap items-center justify-between px-8 pt-4">
																<div className="my-1 mr-4 last:mr-0">
																	<Button label="Confirm Details" />
																</div>
																<div className="my-1 mr-4 last:mr-0">
																	<Button btnStyle="gray" label="Edit Details" />
																</div>
															</div>
														</div>
													</section>
												)}

												{step === 3 && (
													<section className="px-10 py-6">
														<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
															<p className="my-2">FileName (Offer Letter)</p>
															<Link
																href={`#`}
																className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200"
																download
															>
																<i className="fa-solid fa-download mr-2"></i>
																Download
															</Link>
														</div>
														<div className="py-2">
															<p className="py-4 text-center">Preview Here</p>
															<div className="px-8 pt-4 text-center">
																<Button
																	label="Send Email Template"
																	btnType="button"
																	handleClick={() => setDiscussEmail(true)}
																/>
															</div>
														</div>
													</section>
												)}

												{step === 4 && (
													<section className="px-10 py-6">
														<div className="mb-6 rounded-normal bg-yellow-100 px-6 py-8 text-center font-bold text-gray-700">
															<i className="fa-regular fa-clock mb-2 text-[40px]"></i>
															<p className="text-lg">Offer Pending</p>
															<small className="font-semibold">Offer status by Applicant</small>
														</div>
														<div className="mb-6 rounded-normal bg-green-100 px-6 py-8 text-center font-bold text-gray-700">
															<i className="fa-solid fa-check-circle mb-2 text-[40px] text-green-700"></i>
															<p className="mb-2 text-lg text-green-700">Offer Accepted</p>
															<Link
																href="#"
																target="_blank"
																download
																className="inline-block rounded bg-green-700 px-4 py-1 text-[12px] font-semibold text-white"
															>
																Download Offer Letter
															</Link>
														</div>
													</section>
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
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
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
										<h4 className="text-3xl font-bold">Email has been sent</h4>
										<Image src={successGraphic} alt="Success" width={300} className="mx-auto my-4 w-[200px]" />
										<hr className="mb-4" />
										<div className="mb-2">
											<Button label="Schedule a Call" />
										</div>
										<p className="mx-auto w-full max-w-[320px] text-sm text-darkGray">
											Schedule a Call with Applicant to Discuss Further Onboarding Steps
										</p>
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
