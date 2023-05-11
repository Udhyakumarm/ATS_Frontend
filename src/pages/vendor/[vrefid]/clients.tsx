import VendorSideBar from "@/components/vendor/Sidebar";
import VendorTopBar from "@/components/vendor/TopBar";
import Head from "next/head";
import { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState, useMemo } from "react";
import { Combobox, Dialog, Tab, Transition } from "@headlessui/react";
import Button from "@/components/Button";
import Link from "next/link";
import FormField from "@/components/FormField";
import Image from "next/image";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import userImg from "public/images/user-image.png";
import gall2 from "public/images/gall-2.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { axiosInstance, axiosInstanceAuth } from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";
import { debounce } from "lodash";
import { axiosInstance as axis } from "@/utils";

const people = [
	{ id: 1, name: "Wade Cooper" },
	{ id: 2, name: "Arlene Mccoy" },
	{ id: 3, name: "Devon Webb" },
	{ id: 4, name: "Tom Cook" },
	{ id: 5, name: "Tanya Fox" },
	{ id: 6, name: "Hellen Schmidt" }
];

export default function VendorClients() {
	const router = useRouter();
	const { vrefid } = router.query;

	const [load, setload] = useState(false);
	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [vdata, setvdata] = useState({});

	const [vjdata, setvjdata] = useState([]);
	const [addSocial, setAddSocial] = useState(false);
	const [vjobclick, setvjobclick] = useState(-1);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadVendorJobData(id: string) {
		await axiosInstanceAuth2
			.get(`/vendors/vendor_job_data/${id}/`)
			.then(async (res) => {
				console.log("!", res.data);
				setvjdata(res.data);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	useEffect(() => {
		if (vrefid && vrefid.length > 0 && token && token.length > 0) {
			loadVendorJobData(vrefid);
		}
	}, [vrefid, token]);

	const cancelButtonRef = useRef(null);
	const [addCand, setAddCand] = useState(false);
	const [viewApplicant, setViewApplicant] = useState(false);
	const [selected, setSelected] = useState(people[0]);
	const [query, setQuery] = useState("");

	const [popuprefid, setpopuprefid] = useState("");
	const filteredPeople =
		query === ""
			? people
			: people.filter((person) =>
					person.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""))
			  );

	const tabHeading_1 = [
		{
			title: "Job Description"
		},
		{
			title: "About Organization"
		},
		{
			title: "All Applicants"
		}
	];

	const [orgdetail, setorgdetail] = useState({});
	async function loadOrgDetail(pk: any) {
		await axiosInstance
			.get(`/organization/get/organizationprofile/vendor/${pk.toString()}/`)
			.then((res) => {
				setorgdetail(res.data);
				console.log("@", res.data);
			})
			.catch((err) => {
				console.log("@", err);
			});
	}

	useEffect(() => {
		if (vjobclick != -1) {
			loadOrgDetail(vjdata[vjobclick]["user"]);
		}
	}, [vjobclick]);

	useEffect(() => {
		if (!addCand) {
			setpopuprefid("");
		}
	}, [addCand]);

	//add applicant state
	const [resume, setresume] = useState<File | null>(null);
	const [fname, setfname] = useState("");
	const [lname, setlname] = useState("");
	const [email, setemail] = useState("");
	const [phone, setphone] = useState("");

	//link
	const [links, setlinks] = useState([]);
	const [link, setlink] = useState("");

	function deleteLink(id: any) {
		var arr = links;
		arr = arr.splice(1, parseInt(id));
		setlinks(arr);
		setlink("");
	}

	function verifylink() {
		return link.length > 0;
	}

	function addlink() {
		let arr = links;
		arr.push(link);
		setlinks(arr);
		setAddSocial(false);
		setlink("");
	}

	const [summary, setsummary] = useState("");
	const [csalary, setcsalary] = useState("");
	const [esalary, setesalary] = useState("");
	const [notice, setnotice] = useState("");
	const [msg, setmsg] = useState("");
	const [skill, setskill] = useState("");

	function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files && event.target.files[0];
			setresume(file);
		} else {
			setresume(null);
		}
	}

	const [ski, setski] = useState([]);
	// const [load, setload] = useState(false);

	const debouncedSearchResults = useMemo(() => {
		return debounce(searchSkill, 300);
	}, []);

	useEffect(() => {
		return () => {
			debouncedSearchResults.cancel();
		};
	}, [debouncedSearchResults]);

	//exp
	const [newgre, setnewgre] = useState(false);
	const [expcount, setexpcount] = useState(1);
	const [expid, setexpid] = useState(["expBlock1"]);

	const [educount, seteducount] = useState(0);
	const [eduid, seteduid] = useState([]);

	const [certcount, setcertcount] = useState(0);
	const [certid, setcertid] = useState([]);

	async function searchSkill(value) {
		await axis.marketplace_api
			.get(`/job/load/skills/?search=${value}`)
			.then(async (res) => {
				let obj = res.data;
				let arr = [];
				for (const [key, value] of Object.entries(obj)) {
					arr.push(value);
				}
				setski(arr);
				setload(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function addVendorCandidateApplicant(refid: any, vrefid: any, vcrefid: any) {
		await axiosInstanceAuth2
			.post(`/vendors/vendor-applicant-apply/${refid}/${vrefid}/${vcrefid}/`)
			.then((res) => {
				toastcomp(res.data.Message, "success");
			})
			.catch((err) => {
				toastcomp("Vendor Candidate Applicant Not Created", "error");
				console.log("@", err);
			});
	}

	async function addVendorCandidateCert(vrefid: any, refid: any, fd: any) {
		await axiosInstanceAuth2
			.post(`/vendors/vendor-candidate-cretificate/${refid}/${vrefid}/`, fd)
			.then((res) => {
				toastcomp("Vendor Candidate Cert Created", "success");
			})
			.catch((err) => {
				toastcomp("Vendor Candidate Cert Not Created", "error");
				console.log("@", err);
			});
	}

	async function addVendorCandidateEdu(vrefid: any, refid: any, fd: any) {
		await axiosInstanceAuth2
			.post(`/vendors/vendor-candidate-education/${refid}/${vrefid}/`, fd)
			.then((res) => {
				toastcomp("Vendor Candidate Edu Created", "success");
			})
			.catch((err) => {
				toastcomp("Vendor Candidate Edu Not Created", "error");
				console.log("@", err);
			});
	}

	async function addVendorCandidateExp(vrefid: any, refid: any, fd: any) {
		await axiosInstanceAuth2
			.post(`/vendors/vendor-candidate-experience/${refid}/${vrefid}/`, fd)
			.then((res) => {
				toastcomp("Vendor Candidate Exp Created", "success");
			})
			.catch((err) => {
				toastcomp("Vendor Candidate Exp Not Created", "error");
				console.log("@", err);
			});
	}

	async function addVendorCandidateLink(vrefid: any, refid: any, title: any) {
		const fd = new FormData();
		fd.append("title", title);

		await axiosInstanceAuth2
			.post(`/vendors/vendor-candidate-social/${refid}/${vrefid}/`, fd)
			.then((res) => {
				toastcomp("Vendor Candidate Link Created", "success");
			})
			.catch((err) => {
				toastcomp("Vendor Candidate Link Not Created", "error");
				console.log("@", err);
			});
	}

	async function addVendorCandidateProfile(vrefid: any, refid: any) {
		const fd = new FormData();
		fd.append("first_name", fname);
		fd.append("last_name", lname);
		fd.append("email", email);
		fd.append("mobile", phone);
		fd.append("resume", resume);
		fd.append("summary", summary);
		fd.append("current_salary", csalary);
		fd.append("expected_salary", esalary);
		if (!newgre) fd.append("notice_period", notice);
		fd.append("recuriter_message", msg);
		fd.append("skills", skill);

		await axiosInstanceAuth2
			.post(`/vendors/vendor-candidate/${refid}/${vrefid}/`, fd)
			.then(async (res) => {
				console.log(res.data);
				let vcrefid = res.data.data[0]["vcrefid"];
				toastcomp("Vendor Candidate Profile Created", "success");
				if (vcrefid && vcrefid.length > 0) {
					for (let i = 0; i < links.length; i++) {
						addVendorCandidateLink(vcrefid, refid, links[i]);
					}

					if (!newgre) {
						for (let i = 0; i < expid.length; i++) {
							var fd1 = new FormData();
							fd.append("title", document.getElementById(`title${expid[i]}`).value);
							fd.append("company", document.getElementById(`cname${expid[i]}`).value);
							fd.append("year_of_join", document.getElementById(`sdate${expid[i]}`).value);
							fd.append("year_of_end", document.getElementById(`edate${expid[i]}`).value);
							fd.append("expbody", document.getElementById(`desc${expid[i]}`).value);
							fd.append("type", document.getElementById(`jtype${expid[i]}`).value);
							addVendorCandidateExp(vcrefid, refid, fd1);
						}
					}

					for (let i = 0; i < eduid.length; i++) {
						var fd1 = new FormData();
						fd.append("title", document.getElementById(`title${eduid[i]}`).value);
						fd.append("college", document.getElementById(`cname${eduid[i]}`).value);
						fd.append("yearofjoin", document.getElementById(`sdate${eduid[i]}`).value);
						fd.append("yearofend", document.getElementById(`edate${eduid[i]}`).value);
						fd.append("edubody", document.getElementById(`desc${eduid[i]}`).value);
						addVendorCandidateEdu(vcrefid, refid, fd1);
					}

					for (let i = 0; i < certid.length; i++) {
						var fd1 = new FormData();
						fd.append("title", document.getElementById(`title${certid[i]}`).value);
						fd.append("company", document.getElementById(`cname${certid[i]}`).value);
						fd.append("yearofissue", document.getElementById(`sdate${certid[i]}`).value);
						fd.append("yearofexp", document.getElementById(`edate${certid[i]}`).value);
						fd.append("creid", document.getElementById(`cid${certid[i]}`).value);
						fd.append("creurl", document.getElementById(`curl${certid[i]}`).value);
						addVendorCandidateCert(vcrefid, refid, fd1);
					}

					addVendorCandidateApplicant(refid, vrefid, vcrefid);
				}
			})
			.catch((err) => {
				toastcomp("Vendor Candidate Profile Not Created", "error");
				console.log(err);
			});
	}

	function addApp(event: FormEvent<HTMLFormElement>, vrefid: any, refid: any) {
		event.preventDefault();

		var check = 0;
		if (!newgre) {
			for (let i = 0; i < expid.length; i++) {
				if (
					!document.getElementById(`title${expid[i]}`).value ||
					!document.getElementById(`cname${expid[i]}`).value ||
					!document.getElementById(`jtype${expid[i]}`).value ||
					!document.getElementById(`sdate${expid[i]}`).value ||
					!document.getElementById(`edate${expid[i]}`).value ||
					!document.getElementById(`desc${expid[i]}`).value ||
					document.getElementById(`title${expid[i]}`).value.length <= 0 ||
					document.getElementById(`cname${expid[i]}`).value.length <= 0 ||
					document.getElementById(`jtype${expid[i]}`).value.length <= 0 ||
					document.getElementById(`sdate${expid[i]}`).value.length <= 0 ||
					document.getElementById(`edate${expid[i]}`).value.length <= 0 ||
					document.getElementById(`desc${expid[i]}`).value.length <= 0
				) {
					check = 1;
				}
			}
		}

		for (let i = 0; i < eduid.length; i++) {
			if (
				!document.getElementById(`title${eduid[i]}`).value ||
				!document.getElementById(`cname${eduid[i]}`).value ||
				!document.getElementById(`sdate${eduid[i]}`).value ||
				!document.getElementById(`edate${eduid[i]}`).value ||
				!document.getElementById(`desc${eduid[i]}`).value ||
				document.getElementById(`title${eduid[i]}`).value.length <= 0 ||
				document.getElementById(`cname${eduid[i]}`).value.length <= 0 ||
				document.getElementById(`sdate${eduid[i]}`).value.length <= 0 ||
				document.getElementById(`edate${eduid[i]}`).value.length <= 0 ||
				document.getElementById(`desc${eduid[i]}`).value.length <= 0
			) {
				check = 2;
			}
		}

		for (let i = 0; i < certid.length; i++) {
			if (
				!document.getElementById(`title${certid[i]}`).value ||
				!document.getElementById(`cname${certid[i]}`).value ||
				!document.getElementById(`sdate${certid[i]}`).value ||
				!document.getElementById(`edate${certid[i]}`).value ||
				!document.getElementById(`cid${certid[i]}`).value ||
				!document.getElementById(`curl${certid[i]}`).value ||
				document.getElementById(`title${certid[i]}`).value.length <= 0 ||
				document.getElementById(`cname${certid[i]}`).value.length <= 0 ||
				document.getElementById(`sdate${certid[i]}`).value.length <= 0 ||
				document.getElementById(`edate${certid[i]}`).value.length <= 0 ||
				document.getElementById(`cid${certid[i]}`).value.length <= 0 ||
				document.getElementById(`curl${certid[i]}`).value.length <= 0
			) {
				check = 3;
			}
		}

		console.log(check);
		if (check === 0) addVendorCandidateProfile(vrefid, refid);
		else if (check === 1) toastcomp("Fill Up Exp", "error");
		else if (check === 2) toastcomp("Fill Up Edu", "error");
		else if (check === 3) toastcomp("Fill Up Cert", "error");
	}

	return (
		<>
			<Head>
				<title>Vendor | Clients</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<VendorSideBar />
				<VendorTopBar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className="layoutWrap">
					<div className="flex flex-wrap p-4 lg:p-8">
						<div className="w-full lg:max-w-[300px]">
							<div className="rounded-normal border bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
								<Combobox value={selected} onChange={setSelected}>
									<div className="relative mb-6">
										<div className="relative w-full cursor-default overflow-hidden rounded-[6px] border dark:border-gray-600">
											<Combobox.Input
												className="w-full border-none py-2 pl-3 pr-12 text-sm leading-5 text-gray-900 focus:ring-0 dark:bg-gray-800 dark:text-gray-400"
												displayValue={(person) => person.name}
												onChange={(event) => setQuery(event.target.value)}
											/>
											<Combobox.Button className="absolute inset-y-0 right-0 flex items-center border-l px-3 dark:border-gray-600 dark:text-gray-400">
												<i className="fa-solid fa-chevron-down"></i>
											</Combobox.Button>
										</div>
										<Transition
											as={Fragment}
											leave="transition ease-in duration-100"
											leaveFrom="opacity-100"
											leaveTo="opacity-0"
											afterLeave={() => setQuery("")}
										>
											<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 sm:text-sm">
												{filteredPeople.length === 0 && query !== "" ? (
													<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
														Nothing found.
													</div>
												) : (
													filteredPeople.map((person) => (
														<Combobox.Option
															key={person.id}
															className={
																"clamp_1 relative cursor-pointer px-6 py-2 pl-8 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
															}
															value={person}
														>
															{({ selected, active }) => (
																<>
																	<span className={` ${selected ? "font-bold" : "font-normal"}`}>{person.name}</span>
																	{selected ? (
																		<span className="absolute left-3">
																			<i className="fa-solid fa-check"></i>
																		</span>
																	) : null}
																</>
															)}
														</Combobox.Option>
													))
												)}
											</Combobox.Options>
										</Transition>
									</div>
								</Combobox>
								<h4 className="mb-2 font-bold">Jobs</h4>
								<div>
									{vjdata &&
										vjdata.length > 0 &&
										vjdata.map((data, i) => (
											<div
												className={
													"border border-transparent border-b-slate-200 px-3 py-4 last:border-b-0 hover:shadow-highlight dark:border-b-gray-600 dark:hover:bg-gray-900"
												}
												key={i}
												onClick={() => {
													setvjobclick(i);
												}}
											>
												<h4 className="mb-2 text-sm font-bold">
													{data["job_title"] && data["job_title"].length > 0 ? data["job_title"] : <>N/A</>}
												</h4>
												<ul className="flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
													<li className="mr-3 list-none">
														{data["industry"] && data["industry"].length > 0 ? data["industry"] : <>N/A</>}
													</li>
													<li className="mr-3">
														Vacancy - {data["vacancy"] && data["vacancy"].length > 0 ? data["vacancy"] : <>0</>}
													</li>
												</ul>
											</div>
										))}
									{/* {Array(8).fill(
										<div
											className={
												"border border-transparent border-b-slate-200 px-3 py-4 last:border-b-0 hover:shadow-highlight dark:border-b-gray-600 dark:hover:bg-gray-900"
											}
										>
											<h4 className="mb-2 text-sm font-bold">Software Developer</h4>
											<ul className="flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
												<li className="mr-3 list-none">Engineer</li>
												<li className="mr-3">Vacancy - 50</li>
											</ul>
										</div>
									)} */}
								</div>
							</div>
						</div>
						{vjobclick != -1 && (
							<div className="w-full pl-6 lg:max-w-[calc(100%-300px)]">
								<div className="rounded-normal bg-white dark:bg-gray-800">
									<div className="mx-auto flex w-full max-w-[800px] flex-wrap justify-between px-4 py-4">
										<aside>
											<h2 className="mb-2 text-lg font-bold">
												{vjdata[vjobclick]["job_title"] && vjdata[vjobclick]["job_title"]} (
												{vjdata[vjobclick]["worktype"] && vjdata[vjobclick]["worktype"]})
											</h2>
											<ul className="mb-2 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
												<li className="mr-3 list-none">
													{vjdata[vjobclick]["employment_type"] ? vjdata[vjobclick]["employment_type"] : <>N/A</>}
												</li>
												<li className="mr-3">
													{vjdata[vjobclick]["currency"] ? vjdata[vjobclick]["currency"] : <>N/A</>}
												</li>
												<li className="mr-3">
													Vacancy - {vjdata[vjobclick]["vacancy"] ? vjdata[vjobclick]["vacancy"] : <>N/A</>}
												</li>
												<li className="mr-3">
													{vjdata[vjobclick]["group_or_division"] ? vjdata[vjobclick]["group_or_division"] : <>N/A</>}
												</li>
											</ul>
										</aside>
										<Button
											label="Add Candidate"
											btnType="button"
											handleClick={() => {
												setAddCand(true);
												setpopuprefid(vjdata[vjobclick]["refid"]);
											}}
										/>
									</div>
									<Tab.Group>
										<div className="border-b dark:border-b-gray-600">
											<Tab.List className={"mx-auto w-full max-w-[800px] px-4"}>
												{tabHeading_1.map((item, i) => (
													<Tab key={i} as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"mr-16 border-b-4 py-3 font-semibold focus:outline-none" +
																	" " +
																	(selected
																		? "border-primary text-primary"
																		: "border-transparent text-darkGray dark:text-gray-400")
																}
															>
																{item.title}
															</button>
														)}
													</Tab>
												))}
											</Tab.List>
										</div>
										<Tab.Panels>
											<Tab.Panel>
												<div className="mx-auto w-full max-w-[800px] px-4 py-4">
													<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
														<h5 className="mb-2 font-bold">Department Information</h5>
														<article
															className="text-sm"
															dangerouslySetInnerHTML={{ __html: vjdata[vjobclick]["description"] }}
														></article>
													</div>
													<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
														<h5 className="mb-2 font-bold">Your Responsibilities</h5>
														<article
															className="text-sm"
															dangerouslySetInnerHTML={{ __html: vjdata[vjobclick]["responsibility"] }}
														></article>
													</div>
													<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
														<h5 className="mb-2 font-bold">What We're Looking For</h5>
														<article
															className="text-sm"
															dangerouslySetInnerHTML={{ __html: vjdata[vjobclick]["looking_for"] }}
														></article>
													</div>
													<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
														<h5 className="mb-2 font-bold">Skills</h5>
														<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
															{vjdata[vjobclick]["jobSkill"] &&
																vjdata[vjobclick]["jobSkill"].split(",").map((data, i) =>
																	i === 0 ? (
																		<li className="mr-3 list-none" key={i}>
																			{data}
																		</li>
																	) : (
																		<li className="mr-3" key={i}>
																			{data}
																		</li>
																	)
																)}
														</ul>
													</div>
													<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
														<h5 className="mb-2 font-bold">Employment Details</h5>
														<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
															<li className={`mr-3 list-none`}>{vjdata[vjobclick]["employment_type"]}</li>
															<li className="mr-3">{vjdata[vjobclick]["education"]}</li>
															<li className="mr-3">{vjdata[vjobclick]["location"]}</li>
															<li className="mr-3">{vjdata[vjobclick]["experience"]}</li>
														</ul>
													</div>
													<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
														<h5 className="mb-2 font-bold">Benefits</h5>
														<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
															<li className="mr-3 list-none">Paid Relocation : {vjdata[vjobclick]["relocation"]}</li>
															<li className="mr-3">Visa Sposnership : {vjdata[vjobclick]["visa"]}</li>
															<li className="mr-3">{vjdata[vjobclick]["worktype"]} Working</li>
														</ul>
													</div>
													<br />
													{/* <Button label="Download Job Description" btnStyle="gray" /> */}
												</div>
											</Tab.Panel>
											<Tab.Panel>
												{orgdetail &&
													orgdetail["OrgProfile"] &&
													orgdetail["OrgProfile"].map((data: any, i: React.Key) => (
														<div className="mx-auto w-full max-w-[800px] px-4 py-4">
															<div className="mb-3 flex flex-wrap rounded-normal border p-4 pb-0">
																{orgdetail["Founder"].map(
																	(
																		data: {
																			[x: string]:
																				| string
																				| number
																				| boolean
																				| React.ReactElement<any, string | React.JSXElementConstructor<any>>
																				| React.ReactFragment
																				| React.ReactPortal
																				| null
																				| undefined;
																		},
																		i: React.Key | null | undefined
																	) => (
																		<div
																			className="mb-3 w-full pr-4 text-center md:max-w-[calc(100%/3)] lg:max-w-[calc(100%/4)] xl:max-w-[calc(100%/5)]"
																			key={i}
																		>
																			<Image
																				src={`http://127.0.0.1:8000${data["image"]}`}
																				alt="User"
																				width={80}
																				height={80}
																				className="mx-auto mb-2 h-[80px] rounded-full object-cover"
																			/>
																			<p className="mb-1 text-sm font-bold">{data["name"]}</p>
																			<p className="text-sm text-darkGray">{data["designation"]}</p>
																		</div>
																	)
																)}
															</div>
															{data["org_Url"] && data["org_Url"] != "" && (
																<p className="mb-3">
																	<Link
																		href={`${data["org_Url"]}`}
																		target="_blank"
																		className="text-primary hover:underline dark:text-white"
																	>
																		<i className="fa-solid fa-globe mr-2"></i> {data["org_Url"]}
																	</Link>
																</p>
															)}
															<ul className="mb-6 flex list-inside list-disc flex-wrap items-center font-semibold text-darkGray dark:text-gray-400">
																{data["company_Size"] && data["company_Size"] != "" && (
																	<li className="mr-3 list-none">{data["company_Size"]} Employees</li>
																)}
																{data["headquarter_Location"] && data["headquarter_Location"] != "" && (
																	<li className="mr-3">{data["headquarter_Location"]}</li>
																)}
																{data["funding_Details"] && data["funding_Details"] != "" && (
																	<li className="mr-3">{data["funding_Details"]}</li>
																)}
															</ul>
															<hr className="mb-6" />
															<h2 className="mb-3 text-lg font-bold">About Orgnaztion</h2>
															{data["about_org"] && data["about_org"] != "" && (
																<article
																	className="mb-6"
																	dangerouslySetInnerHTML={{ __html: data["about_org"] }}
																></article>
															)}
															<hr className="mb-6" />
															<h2 className="mb-3 text-lg font-bold">About Founder</h2>
															{data["about_founder"] && data["about_founder"] != "" && (
																<p className="mb-6">{data["about_founder"]}</p>
															)}
															<hr className="mb-6" />
															{data["organization_Benefits"] && data["organization_Benefits"] != "" && (
																<div className="mb-6">
																	<h2 className="mb-3 text-lg font-bold">Benefits</h2>
																	<p>{data["organization_Benefits"]}</p>
																	{/* <ul className="mb-6 list-disc list-inside text-darkGray dark:text-gray-400 font-semibold">
                                                                        <li className="mr-3">
                                                                        Medical Insurance
                                                                        </li>
                                                                        <li className="mr-3">
                                                                        Quarterly Bonus
                                                                        </li>
                                                                        <li className="mr-3">
                                                                        Meals
                                                                        </li>
                                                                    </ul> */}
																</div>
															)}
															<hr className="mb-6" />
															{orgdetail["Gallery"] && (
																<div>
																	<h2 className="mb-3 text-lg font-bold">Work Place Culture</h2>
																	<div className="rounded-large border p-6">
																		<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
																			<Masonry>
																				{orgdetail["Gallery"].map(
																					(data: { image: any }, i: React.Key | null | undefined) => (
																						<img
																							src={`http://127.0.0.1:8000${data.image}`}
																							alt="Office"
																							className="w-full rounded-normal p-2"
																							key={i}
																						/>
																					)
																				)}
																			</Masonry>
																		</ResponsiveMasonry>
																	</div>
																</div>
															)}
														</div>
													))}
											</Tab.Panel>
											<Tab.Panel>
												<div className="mx-auto w-full max-w-[800px] px-4 py-4">
													<div className="max-h-[405px] overflow-auto">
														<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
															<thead>
																<tr>
																	<th className="border-b py-2 px-3 text-left">Applicants</th>
																	<th className="border-b py-2 px-3 text-left">Status</th>
																	<th className="border-b py-2 px-3 text-left">Applied</th>
																	<th className="border-b py-2 px-3 text-left">Profile</th>
																</tr>
															</thead>
															<tbody className="text-sm font-semibold">
																{Array(10).fill(
																	<tr className="odd:bg-gray-100 dark:odd:bg-gray-600">
																		<td className="py-2 px-3 text-left">Jane Cooper</td>
																		<td className="py-2 px-3 text-left">Shortlisted</td>
																		<td className="py-2 px-3 text-left">28 Jan 2023</td>
																		<td className="py-2 px-3 text-left">
																			<button
																				type="button"
																				className="text-primary hover:underline"
																				onClick={() => setViewApplicant(true)}
																			>
																				View
																			</button>
																		</td>
																	</tr>
																)}
															</tbody>
														</table>
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
			<Transition.Root show={addCand} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddCand}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-white text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Add Applicant</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddCand(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<form
										action=""
										method="post"
										onSubmit={(e) => {
											addApp(e, vrefid, popuprefid);
										}}
									>
										<div className="p-8">
											<label
												htmlFor="uploadCV"
												className="mb-6 block cursor-pointer rounded-normal border p-6 text-center"
											>
												<h5 className="mb-2 text-darkGray">Drag and Drop Resume Here</h5>
												<p className="mb-2 text-sm">
													Or <span className="font-semibold text-primary">Click Here To Upload</span>
												</p>
												<p className="text-sm text-darkGray">Maximum File Size: 5 MB</p>
												<input type="file" className="hidden" id="uploadCV" onChange={handleFileInputChange} />
											</label>
											<div className="mx-[-10px] flex flex-wrap">
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label="First Name"
														value={fname}
														handleChange={(e) => setfname(e.target.value)}
														placeholder="First Name"
													/>
												</div>
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label="Last Name"
														placeholder="Last Name"
														value={lname}
														handleChange={(e) => setlname(e.target.value)}
													/>
												</div>
											</div>
											<div className="mx-[-10px] flex flex-wrap">
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="email"
														label="Email"
														placeholder="Email"
														value={email}
														handleChange={(e) => setemail(e.target.value)}
													/>
												</div>
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="number"
														label="Phone Number"
														placeholder="Phone Number"
														value={phone}
														handleChange={(e) => setphone(e.target.value)}
													/>
												</div>
											</div>
											<div className="mb-4">
												<div className="mb-2 flex flex-wrap items-center justify-between">
													<label className="mb-1 inline-block font-bold">Social Links</label>
													<button
														type="button"
														className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
														onClick={() => setAddSocial(true)}
													>
														<i className="fa-regular fa-plus"></i>
													</button>
												</div>
												<div className="flex flex-wrap">
													{links &&
														links.map((data, i) => (
															<div
																className="relative mr-6 mb-4 w-[100px] rounded-normal bg-lightBlue p-3 text-center shadow-highlight dark:bg-gray-700"
																key={i}
															>
																<Link href={data} target="_blank" className="">
																	<span className="mx-auto mb-1 block h-8 w-8 rounded bg-white p-1 shadow-normal dark:bg-gray-500">
																		<i className={`fa-brand fa-link`}></i>
																	</span>
																	<p className="text-[12px] font-bold capitalize">Link {i}</p>
																</Link>
																<button
																	type="button"
																	className="absolute top-[-10px] right-[-10px] rounded-full text-center text-[20px] font-bold text-red-500 dark:text-white"
																	onClick={() => deleteLink(i)}
																>
																	<i className="fa-solid fa-circle-xmark"></i>
																</button>
															</div>
														))}
												</div>
											</div>
											<FormField
												fieldType="textarea"
												label="Summary"
												placeholder="Summary"
												value={summary}
												handleChange={(e) => setsummary(e.target.value)}
											/>
											<FormField
												options={ski}
												onSearch={searchSkill}
												fieldType="select2"
												id="skills"
												handleChange={setskill}
												label="Skills"
											/>

											{/* exp */}
											<hr className="mt-8 mb-4" />
											<div className="relative mb-4">
												<label htmlFor="newGraduate" className="absolute right-12 top-0 text-sm font-bold">
													<input
														type="checkbox"
														id="newGraduate"
														name="newGraduate"
														className="mr-2 mb-[3px]"
														checked={newgre}
														onChange={(e) => setnewgre(e.target.checked)}
													/>
													New Graduate
												</label>
												<div className="mb-0">
													<label className="mb-1 inline-block font-bold">Experience</label>
													<div className="flex" style={{ display: newgre === true ? "none" : "flex" }}>
														<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor py-1 px-3">
															{expid &&
																expid.map((data, i) => (
																	<article className="border-b last:border-b-0" key={i} id={data}>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[90%]">
																				<input
																					type="text"
																					placeholder="Title"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`title${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[10%] pl-4 text-right">
																				<button
																					type="button"
																					className="pr-4 text-red-500"
																					disabled={expid.length === 1}
																					onClick={() => {
																						setexpcount(expcount - 1);
																						const newExpid = expid.filter((id) => id !== data);
																						setexpid(newExpid);
																					}}
																				>
																					<i className="fa-solid fa-trash-can"></i>
																				</button>
																			</div>
																		</div>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[50%]">
																				<input
																					type="text"
																					placeholder="Company Name"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`cname${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[50%] pl-4">
																				<input
																					type="text"
																					placeholder="Job Type"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`jtype${data}`}
																				/>
																			</div>
																		</div>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[50%]">
																				<input
																					type="date"
																					placeholder="Start Date"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`sdate${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[50%] pl-4">
																				<input
																					type="date"
																					placeholder="End Date"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`edate${data}`}
																				/>
																			</div>
																		</div>
																		<textarea
																			placeholder="Description"
																			className="h-[60px] w-full resize-none rounded-normal border border-borderColor text-sm"
																			id={`desc${data}`}
																		></textarea>
																	</article>
																))}
														</div>
														<div className="w-[40px] text-right">
															<button
																type="button"
																className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
																onClick={() => {
																	setexpid([...expid, `expBlock${expcount + 1}`]);
																	setexpcount(expcount + 1);
																}}
																disabled={newgre}
															>
																<i className="fa-regular fa-plus"></i>
															</button>
														</div>
													</div>
												</div>
											</div>

											{/* edu */}
											<hr className="mt-8 mb-4" />
											<div className="relative mb-4">
												<div className="mb-0">
													<label className="mb-1 inline-block font-bold">Education</label>
													<div className="flex">
														<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor py-1 px-3">
															{eduid &&
																eduid.map((data, i) => (
																	<article className="border-b last:border-b-0" key={i} id={data}>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[90%]">
																				<input
																					type="text"
																					placeholder="Degree Title"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`title${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[10%] pl-4 text-right">
																				<button
																					type="button"
																					className="pr-4 text-red-500"
																					// disabled={expid.length === 1}
																					onClick={() => {
																						seteducount(educount - 1);
																						const neweduid = eduid.filter((id) => id !== data);
																						seteduid(neweduid);
																					}}
																				>
																					<i className="fa-solid fa-trash-can"></i>
																				</button>
																			</div>
																		</div>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[33%]">
																				<input
																					type="text"
																					placeholder="College Name"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`cname${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[33%] pl-4">
																				<input
																					type="date"
																					placeholder="Start Date"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`sdate${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[33%] pl-4">
																				<input
																					type="date"
																					placeholder="End Date"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`edate${data}`}
																				/>
																			</div>
																		</div>
																		<textarea
																			placeholder="Description"
																			className="h-[60px] w-full resize-none rounded-normal border border-borderColor text-sm"
																			id={`desc${data}`}
																		></textarea>
																	</article>
																))}
														</div>
														<div className="w-[40px] text-right">
															<button
																type="button"
																className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
																onClick={() => {
																	seteduid([...eduid, `eduBlock${educount + 1}`]);
																	seteducount(educount + 1);
																}}
															>
																<i className="fa-regular fa-plus"></i>
															</button>
														</div>
													</div>
												</div>
											</div>

											{/* cer */}
											<hr className="mt-8 mb-4" />
											<div className="relative mb-4">
												<div className="mb-0">
													<label className="mb-1 inline-block font-bold">Certificate</label>
													<div className="flex">
														<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor py-1 px-3">
															{certid &&
																certid.map((data, i) => (
																	<article className="border-b last:border-b-0" key={i} id={data}>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[90%]">
																				<input
																					type="text"
																					placeholder="Title"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`title${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[10%] pl-4 text-right">
																				<button
																					type="button"
																					className="pr-4 text-red-500"
																					// disabled={expid.length === 1}
																					onClick={() => {
																						setcertcount(certcount - 1);
																						const newcertid = certid.filter((id) => id !== data);
																						setcertid(newcertid);
																					}}
																				>
																					<i className="fa-solid fa-trash-can"></i>
																				</button>
																			</div>
																		</div>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[33%]">
																				<input
																					type="text"
																					placeholder="Company Issued Name"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`cname${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[33%] pl-4">
																				<input
																					type="date"
																					placeholder="Start Date"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`sdate${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[33%] pl-4">
																				<input
																					type="date"
																					placeholder="End Date"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`edate${data}`}
																				/>
																			</div>
																		</div>
																		<div className="flex flex-wrap items-center text-sm">
																			<div className="my-2 w-[50%]">
																				<input
																					type="text"
																					placeholder="Creditanls ID"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`cid${data}`}
																				/>
																			</div>
																			<div className="my-2 w-[50%] pl-4">
																				<input
																					type="text"
																					placeholder="Creditanls URL"
																					className="w-full rounded-normal border border-borderColor text-sm"
																					id={`curl${data}`}
																				/>
																			</div>
																		</div>
																	</article>
																))}
														</div>
														<div className="w-[40px] text-right">
															<button
																type="button"
																className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
																onClick={() => {
																	setcertid([...certid, `certBlock${certcount + 1}`]);
																	setcertcount(certcount + 1);
																}}
															>
																<i className="fa-regular fa-plus"></i>
															</button>
														</div>
													</div>
												</div>
											</div>

											{/* edu */}
											{/* <hr className="mt-8 mb-4" />
											<div className="mb-4">
												<label className="mb-1 inline-block font-bold">Education</label>
												<div className="flex">
													<div className="min-h-[45px] w-[calc(100%-40px)]">
														{Array(2).fill(
															<article className="mb-2 border-b pb-2 last:border-b-0">
																<div className="flex flex-wrap items-center text-sm">
																	<div className="my-2 w-[30%]">
																		<input
																			type="text"
																			placeholder="Company Name"
																			className="w-full rounded-normal border border-borderColor text-sm"
																		/>
																	</div>
																	<div className="my-2 w-[60%] pl-4">
																		<input
																			type="text"
																			placeholder="2021 Sep - 2022 Nov"
																			className="w-full rounded-normal border border-borderColor text-sm"
																		/>
																	</div>
																	<div className="my-2 w-[10%] pl-4 text-right">
																		<button type="button" className="pr-4 text-red-500">
																			<i className="fa-solid fa-trash-can"></i>
																		</button>
																	</div>
																</div>
																<textarea
																	placeholder="Description"
																	className="h-[120px] w-full resize-none rounded-normal border border-borderColor text-sm"
																></textarea>
															</article>
														)}
													</div>
													<div className="w-[40px] text-right">
														<button
															type="button"
															className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
														>
															<i className="fa-regular fa-plus"></i>
														</button>
													</div>
												</div>
											</div>

											<div className="mb-4">
												<label className="mb-1 inline-block font-bold">Certifications</label>
												<div className="flex">
													<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor py-1 px-3">
														{Array(2).fill(
															<article className="border-b last:border-b-0">
																<div className="flex flex-wrap items-center text-sm">
																	<div className="my-2 w-[30%]">
																		<input
																			type="text"
																			placeholder="Company Name"
																			className="w-full rounded-normal border border-borderColor text-sm"
																		/>
																	</div>
																	<div className="my-2 w-[60%] pl-4">
																		<input
																			type="text"
																			placeholder="2021 Sep - 2022 Nov"
																			className="w-full rounded-normal border border-borderColor text-sm"
																		/>
																	</div>
																	<div className="my-2 w-[10%] pl-4 text-right">
																		<button type="button" className="pr-4 text-red-500">
																			<i className="fa-solid fa-trash-can"></i>
																		</button>
																	</div>
																</div>
																<textarea
																	placeholder="Description"
																	className="h-[120px] w-full resize-none rounded-normal border border-borderColor text-sm"
																></textarea>
															</article>
														)}
													</div>
													<div className="w-[40px] text-right">
														<button
															type="button"
															className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white"
														>
															<i className="fa-regular fa-plus"></i>
														</button>
													</div>
												</div>
											</div> */}

											<div className="mx-[-10px] flex flex-wrap">
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label="Current Salary"
														placeholder="Current Salary"
														value={csalary}
														handleChange={(e) => setcsalary(e.target.value)}
													/>
												</div>
												<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
													<FormField
														fieldType="input"
														inputType="text"
														label="Expected Salary"
														placeholder="Expected Salary"
														value={esalary}
														handleChange={(e) => setesalary(e.target.value)}
													/>
												</div>
											</div>
											<FormField
												fieldType="input"
												inputType="text"
												label="Notice Period"
												placeholder="Notice Period"
												value={notice}
												handleChange={(e) => setnotice(e.target.value)}
												readOnly={newgre}
											/>
											<FormField
												fieldType="reactquill"
												label="Any Message to Recruiter"
												placeholder="Notice Period"
												value={msg}
												handleChange={setmsg}
												handleOnBlur={setmsg}
											/>
											<Button label="Add" loader={false} btnType={"submit"} />
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Applicant Profile</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setViewApplicant(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
											<p className="mx-auto w-full max-w-[600px] text-center">Preview Here</p>
										</div>
										<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
											<h2 className="mb-2 text-xl font-bold">Olivia Wilson</h2>
											<ul className="mb-2 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
												<li className="mr-3 list-none">www.oliv9301@gmail.com</li>
												<li className="mr-3">+91 9351042541</li>
												<li className="mr-3">Notice Period -30 Days</li>
												<li className="mr-3">Current Salary - 6.0 LPA</li>
												<li className="mr-3">Expected Salary - 8.0 LPA</li>
											</ul>
											<div className="flex flex-wrap items-center text-2xl">
												<Link href={"#"} target="_blank" className="m-3 mb-0">
													<i className="fa-brands fa-behance"></i>
												</Link>
												<Link href={"#"} target="_blank" className="m-3 mb-0">
													<i className="fa-brands fa-stack-overflow"></i>
												</Link>
												<Link href={"#"} target="_blank" className="m-3 mb-0">
													<i className="fa-brands fa-linkedin-in"></i>
												</Link>
												<Link href={"#"} target="_blank" className="m-3 mb-0">
													<i className="fa-brands fa-github"></i>
												</Link>
											</div>
										</div>
										<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
											<label className="mb-1 inline-block font-bold">Summary</label>
											<article className="text-sm">Lorem impsum is a dummy text editor.</article>
										</div>
										<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
											<label className="mb-1 inline-block font-bold">Skills</label>
											<div className="min-h-[45px] rounded-normal border border-borderColor py-1 px-3">
												<div className="text-sm">
													<p className="my-1">Skill 1</p>
													<p className="my-1">Skill 2</p>
													<p className="my-1">Skill 3</p>
													<p className="my-1">Skill 4</p>
												</div>
											</div>
										</div>
										<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
											<label className="mb-1 inline-block font-bold">Education</label>
											<div className="min-h-[45px] rounded-normal border border-borderColor py-1 px-3">
												{Array(2).fill(
													<article className="border-b last:border-b-0">
														<div className="flex flex-wrap text-sm">
															<div className="my-2 w-[30%]">
																<h4 className="font-bold">XYZ Group</h4>
															</div>
															<div className="my-2 w-[70%] pl-4">
																<p className="font-semibold">2021 Sep - 2022 Nov</p>
															</div>
														</div>
														<p className="mb-2 text-sm">
															<b>Description -</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
															eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
															nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
															irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
														</p>
													</article>
												)}
											</div>
										</div>
										<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
											<label className="mb-1 inline-block font-bold">Certifications</label>
											<div className="min-h-[45px] rounded-normal border border-borderColor py-1 px-3">
												{Array(2).fill(
													<article className="border-b last:border-b-0">
														<div className="flex flex-wrap text-sm">
															<div className="my-2 w-[30%]">
																<h4 className="font-bold">XYZ Group</h4>
															</div>
															<div className="my-2 w-[70%] pl-4">
																<p className="font-semibold">2021 Sep - 2022 Nov</p>
															</div>
														</div>
														<p className="mb-2 text-sm">
															<b>Description -</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
															eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
															nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
															irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
														</p>
													</article>
												)}
											</div>
										</div>
										<div className="mb-4 border-b pb-4 dark:border-b-gray-600">
											<label className="mb-1 inline-block font-bold">Experience</label>
											<div className="min-h-[45px] rounded-normal border border-borderColor py-1 px-3">
												{Array(2).fill(
													<article className="border-b last:border-b-0">
														<div className="flex flex-wrap text-sm">
															<div className="my-2 w-[30%]">
																<h4 className="font-bold">XYZ Group</h4>
															</div>
															<div className="my-2 w-[70%] pl-4">
																<p className="font-semibold">2021 Sep - 2022 Nov</p>
															</div>
														</div>
														<p className="mb-2 text-sm">
															<b>Description -</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
															eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
															nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
															irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
														</p>
													</article>
												)}
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
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
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">Add Social Login</h4>
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
											label="Add URL"
											value={link}
											handleChange={(e) => setlink(e.target.value)}
										/>
										<div className="text-center">
											<Button label="Add" btnType={"button"} disabled={!verifylink()} handleClick={addlink} />
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
