import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { axiosInstance } from "@/utils";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useEffect, Fragment, useRef, useState, Key } from "react";
import { useApplicantStore } from "@/utils/code";
import Button from "@/components/Button";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import Image from "next/image";
import userImg from "/public/images/user-image.png";
import socialIcon from "/public/images/social/linkedin-icon.png";
import boardIcon from "/public/images/board-icon.png";
import FormField from "@/components/FormField";
import { Menu } from "@headlessui/react";
import TeamMembers from "@/components/TeamMembers";
import moment from "moment";
import Canban from "@/components/organization/applicant/Canban";

export default function Home() {
	const router = useRouter();

	const cancelButtonRef = useRef(null);
	const [socialPopup, setSocialPopup] = useState(false);

	const applicantlist = useApplicantStore((state: { applicantlist: any }) => state.applicantlist);
	const applicantdetail = useApplicantStore((state: { applicantdetail: any }) => state.applicantdetail);
	const setapplicantlist = useApplicantStore((state: { setapplicantlist: any }) => state.setapplicantlist);
	const jobid = useApplicantStore((state: { jobid: any }) => state.jobid);
	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const canid = useApplicantStore((state: { canid: any }) => state.canid);
	const setcanid = useApplicantStore((state: { setcanid: any }) => state.setcanid);

	var jobs = [{ id: 1, name: "All", refid: "ALL", unavailable: false }];

	const [jobd, setjobd] = useState([{ id: 1, name: "All", refid: "ALL", unavailable: false }]);

	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [refersh, setrefersh] = useState(1);
	const [joblist, setjoblist] = useState(0);
	const [selectedJob, setSelectedJob] = useState(jobd[0]);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadApplicant() {
		await axiosInstanceAuth2
			.get(`/job/listapplicant/`)
			.then(async (res) => {
				console.log(res.data);
				setapplicantlist(res.data);
				setrefersh(0);
			})
			.catch((err) => {
				console.log(err);
				setrefersh(0);
			});
	}

	useEffect(() => {
		if (token.length > 0 && refersh > 0) {
			loadApplicant();
		}
	}, [token, refersh]);

	useEffect(() => {
		console.log("applicantdetail", applicantdetail);
		console.log("applicantlist", applicantlist);
	}, [applicantdetail, applicantlist]);

	useEffect(() => {
		if (applicantlist.length > 0) {
			let arr = [{ id: 1, name: "All", refid: "ALL", unavailable: false }];
			for (let i = 0; i < applicantlist.length; i++) {
				let dic: any = {};
				dic["id"] = i + 2;
				dic["name"] = applicantlist[i]["job"]["job_title"];
				dic["refid"] = applicantlist[i]["job"]["refid"];
				dic["unavailable"] = false;
				arr.push(dic);
			}
			setjobd(arr);
			setjoblist(1);
			console.log(jobd);
		} else {
			setjoblist(2);
		}
	}, [applicantlist]);

	return (
		<>
			<Head>
				<title>Applicants</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<Orgsidebar />
				<Orgtopbar />
				<div id="overlay" className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"></div>
				<div className="layoutWrap">
					<div className="flex flex-wrap items-center justify-between bg-white py-4 px-4 shadow-normal dark:bg-gray-800 lg:px-8">
						<div className="mr-3">
							<Listbox value={selectedJob} onChange={setSelectedJob}>
								<Listbox.Button className={"text-lg font-bold"}>
									{selectedJob["name"]} <i className="fa-solid fa-chevron-down ml-2 text-sm"></i>
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
										{joblist > 0 &&
											jobd.map((item) => (
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
							<div className="mr-4 flex items-center">
								<p className="mr-3 font-semibold">Add Board</p>
								<button
									type="button"
									className="h-7 w-7 rounded bg-gray-400 text-sm text-white hover:bg-gray-700"
									onClick={() => setSocialPopup(true)}
								>
									<i className="fa-solid fa-plus"></i>
								</button>
							</div>
							<TeamMembers  alen={applicantlist.length} />
							{/* <div className="flex items-center">
								<div className="-mr-4">
									<Image src={userImg} alt="User" width={40} className="h-[40px] rounded-full object-cover" />
								</div>
								<div className="-mr-4">
									<Image src={userImg} alt="User" width={40} className="h-[40px] rounded-full object-cover" />
								</div>
								<Menu as="div" className="relative flex">
									<Menu.Button className={"relative"}>
										<Image src={userImg} alt="User" width={40} className="h-[40px] rounded-full object-cover" />
										<span className="absolute left-0 top-0 block flex h-full w-full items-center justify-center rounded-full bg-[rgba(0,0,0,0.5)] text-sm text-white">
											{applicantlist && <>+{applicantlist.length}</>}
										</span>
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
												"absolute right-0 top-[100%] mt-2 max-h-[400px] w-[250px] overflow-y-auto rounded-normal bg-white py-2 shadow-normal"
											}
										>
											<Menu.Item>
												<div className="p-3">
													<h6 className="border-b pb-2 font-bold">Team Members</h6>
													<div>
														{Array(5).fill(
															<div className="mt-4 flex items-center">
																<Image
																	src={userImg}
																	alt="User"
																	width={40}
																	className="h-[40px] rounded-full object-cover"
																/>
																<aside className="pl-4 text-sm">
																	<h5 className="font-bold">Anne Jacob</h5>
																	<p className="text-darkGray">Hiring Manager</p>
																</aside>
															</div>
														)}
													</div>
												</div>
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
							</div> */}
						</aside>
					</div>
					{refersh == 0 && <Canban applicantlist={applicantlist} token={token} />}
					
					{/* <div className="flex h-[calc(100vh-155px)] overflow-auto p-4 lg:p-8">
						<div className="min-w-[300px] p-2 mx-1 border border-slate-200 bg-gray-50 dark:bg-gray-700 rounded-normal">
							<h5 className="mb-4 text-lg font-semibold">Sourced</h5>
							{applicantlist &&
								applicantlist.map(
									(data: any, i: React.Key) =>
										data["status"] == "Sourced" && (
											<div className="mb-4 rounded-normal bg-white py-2 px-4 shadow-normal" key={i}>
												<div className="mb-2 flex items-center justify-between">
													<aside className="flex items-center">
														<Image src={userImg} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
														<h5 className="pl-4 text-sm font-semibold">
															{data["user"]["first_name"]} {data["user"]["last_name"]}
														</h5>
													</aside>
													<aside>
														<Image src={socialIcon} alt="Social" className="h-[16px] w-auto" />
													</aside>
												</div>
												<p className="mb-1 text-[12px] text-darkGray">ID - {data["arefid"]}</p>
												<div className="flex items-center justify-between">
													<aside className="flex items-center text-[12px] text-darkGray dark:text-white">
														<i className="fa-solid fa-calendar-days mr-2 text-[16px]"></i>
														<p>{moment(data["timestamp"]).format("Do MMM YYYY")}</p>
													</aside>
													<Button
														btnStyle="outlined"
														label="View"
														btnType="button"
														handleClick={() => {
															setjobid(data["job"]["refid"]);
															setcanid(data["user"]["erefid"]);
															router.push("applicants/detail");
														}}
													/>
												</div>
											</div>
										)
								)}
						</div>

						<div className="min-w-[300px] p-2 mx-1 border border-slate-200 bg-gray-50 dark:bg-gray-700 rounded-normal">
							<h5 className="mb-4 text-lg font-semibold">Applied</h5>
							{applicantlist &&
								applicantlist.map(
									(data: any, i: Key | null | undefined) =>
										data["status"] == "Applied" && (
											<div className="mb-4 rounded-normal bg-white py-2 px-4 shadow-normal" key={i}>
												<div className="mb-2 flex items-center justify-between">
													<aside className="flex items-center">
														<Image src={userImg} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
														<h5 className="pl-4 text-sm font-semibold">
															{data["user"]["first_name"]} {data["user"]["last_name"]}
														</h5>
													</aside>
													<aside>
														<Image src={socialIcon} alt="Social" className="h-[16px] w-auto" />
													</aside>
												</div>
												<p className="mb-1 text-[12px] text-darkGray">ID - {data["arefid"]}</p>
												<div className="flex items-center justify-between">
													<aside className="flex items-center text-[12px] text-darkGray">
														<i className="fa-solid fa-calendar-days mr-2 text-[16px]"></i>
														<p>{moment(data["timestamp"]).format("Do MMM YYYY")}</p>
													</aside>
													<Button
														btnStyle="outlined"
														label="View"
														btnType="button"
														handleClick={() => {
															setjobid(data["job"]["refid"]);
															setcanid(data["user"]["erefid"]);
															router.push("applicants/detail");
														}}
													/>
												</div>
											</div>
										)
								)}
						</div>

						<div className="min-w-[300px] p-2 mx-1 border border-slate-200 bg-gray-50 dark:bg-gray-700 rounded-normal">
							<h5 className="mb-4 text-lg font-semibold">Phone Screen</h5>
							{applicantlist &&
								applicantlist.map(
									(data: any, i: Key | null | undefined) =>
										data["status"] == "Phone Screen" && (
											<div className="mb-4 rounded-normal bg-white py-2 px-4 shadow-normal" key={i}>
												<div className="mb-2 flex items-center justify-between">
													<aside className="flex items-center">
														<Image src={userImg} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
														<h5 className="pl-4 text-sm font-semibold">
															{data["user"]["first_name"]} {data["user"]["last_name"]}
														</h5>
													</aside>
													<aside>
														<Image src={socialIcon} alt="Social" className="h-[16px] w-auto" />
													</aside>
												</div>
												<p className="mb-1 text-[12px] text-darkGray">ID - {data["arefid"]}</p>
												<div className="flex items-center justify-between">
													<aside className="flex items-center text-[12px] text-darkGray">
														<i className="fa-solid fa-calendar-days mr-2 text-[16px]"></i>
														<p>{moment(data["timestamp"]).format("Do MMM YYYY")}</p>
													</aside>
													<Button
														btnStyle="outlined"
														label="View"
														btnType="button"
														handleClick={() => {
															setjobid(data["job"]["refid"]);
															setcanid(data["user"]["erefid"]);
															router.push("applicants/detail");
														}}
													/>
												</div>
											</div>
										)
								)}
						</div>

						<div className="min-w-[300px] p-2 mx-1 border border-slate-200 bg-gray-50 dark:bg-gray-700 rounded-normal">
							<h5 className="mb-4 text-lg font-semibold">Assement</h5>
							{applicantlist &&
								applicantlist.map(
									(data: any, i: Key | null | undefined) =>
										data["status"] == "Assement" && (
											<div className="mb-4 rounded-normal bg-white py-2 px-4 shadow-normal" key={i}>
												<div className="mb-2 flex items-center justify-between">
													<aside className="flex items-center">
														<Image src={userImg} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
														<h5 className="pl-4 text-sm font-semibold">
															{data["user"]["first_name"]} {data["user"]["last_name"]}
														</h5>
													</aside>
													<aside>
														<Image src={socialIcon} alt="Social" className="h-[16px] w-auto" />
													</aside>
												</div>
												<p className="mb-1 text-[12px] text-darkGray">ID - {data["arefid"]}</p>
												<div className="flex items-center justify-between">
													<aside className="flex items-center text-[12px] text-darkGray">
														<i className="fa-solid fa-calendar-days mr-2 text-[16px]"></i>
														<p>{moment(data["timestamp"]).format("Do MMM YYYY")}</p>
													</aside>
													<Button
														btnStyle="outlined"
														label="View"
														btnType="button"
														handleClick={() => {
															setjobid(data["job"]["refid"]);
															setcanid(data["user"]["erefid"]);
															router.push("applicants/detail");
														}}
													/>
												</div>
											</div>
										)
								)}
						</div>

						<div className="min-w-[300px] p-2 mx-1 border border-slate-200 bg-gray-50 dark:bg-gray-700 rounded-normal">
							<h5 className="mb-4 text-lg font-semibold">Interview</h5>
							{applicantlist &&
								applicantlist.map(
									(data: any, i: Key | null | undefined) =>
										data["status"] == "Interview" && (
											<div className="mb-4 rounded-normal bg-white py-2 px-4 shadow-normal" key={i}>
												<div className="mb-2 flex items-center justify-between">
													<aside className="flex items-center">
														<Image src={userImg} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
														<h5 className="pl-4 text-sm font-semibold">
															{data["user"]["first_name"]} {data["user"]["last_name"]}
														</h5>
													</aside>
													<aside>
														<Image src={socialIcon} alt="Social" className="h-[16px] w-auto" />
													</aside>
												</div>
												<p className="mb-1 text-[12px] text-darkGray">ID - {data["arefid"]}</p>
												<div className="flex items-center justify-between">
													<aside className="flex items-center text-[12px] text-darkGray">
														<i className="fa-solid fa-calendar-days mr-2 text-[16px]"></i>
														<p>{moment(data["timestamp"]).format("Do MMM YYYY")}</p>
													</aside>
													<Button
														btnStyle="outlined"
														label="View"
														btnType="button"
														handleClick={() => {
															setjobid(data["job"]["refid"]);
															setcanid(data["user"]["erefid"]);
															router.push("applicants/detail");
														}}
													/>
												</div>
											</div>
										)
								)}
						</div>

						<div className="min-w-[300px] p-2 mx-1 border border-slate-200 bg-gray-50 dark:bg-gray-700 rounded-normal">
							<h5 className="mb-4 text-lg font-semibold">Offered Letter</h5>
							{applicantlist &&
								applicantlist.map(
									(data: any, i: Key | null | undefined) =>
										data["status"] == "Offered Letter" && (
											<div className="mb-4 rounded-normal bg-white py-2 px-4 shadow-normal" key={i}>
												<div className="mb-2 flex items-center justify-between">
													<aside className="flex items-center">
														<Image src={userImg} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
														<h5 className="pl-4 text-sm font-semibold">
															{data["user"]["first_name"]} {data["user"]["last_name"]}
														</h5>
													</aside>
													<aside>
														<Image src={socialIcon} alt="Social" className="h-[16px] w-auto" />
													</aside>
												</div>
												<p className="mb-1 text-[12px] text-darkGray">ID - {data["arefid"]}</p>
												<div className="flex items-center justify-between">
													<aside className="flex items-center text-[12px] text-darkGray">
														<i className="fa-solid fa-calendar-days mr-2 text-[16px]"></i>
														<p>{moment(data["timestamp"]).format("Do MMM YYYY")}</p>
													</aside>
													<Button
														btnStyle="outlined"
														label="View"
														btnType="button"
														handleClick={() => {
															setjobid(data["job"]["refid"]);
															setcanid(data["user"]["erefid"]);
															router.push("applicants/detail");
														}}
													/>
												</div>
											</div>
										)
								)}
						</div>

						<div className="min-w-[300px] p-2 mx-1 border border-slate-200 bg-gray-50 dark:bg-gray-700 rounded-normal">
							<h5 className="mb-4 text-lg font-semibold">Hired</h5>
							{applicantlist &&
								applicantlist.map(
									(data: any, i: Key | null | undefined) =>
										data["status"] == "Hired" && (
											<div className="mb-4 rounded-normal bg-white py-2 px-4 shadow-normal" key={i}>
												<div className="mb-2 flex items-center justify-between">
													<aside className="flex items-center">
														<Image src={userImg} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
														<h5 className="pl-4 text-sm font-semibold">
															{data["user"]["first_name"]} {data["user"]["last_name"]}
														</h5>
													</aside>
													<aside>
														<Image src={socialIcon} alt="Social" className="h-[16px] w-auto" />
													</aside>
												</div>
												<p className="mb-1 text-[12px] text-darkGray">ID - {data["arefid"]}</p>
												<div className="flex items-center justify-between">
													<aside className="flex items-center text-[12px] text-darkGray">
														<i className="fa-solid fa-calendar-days mr-2 text-[16px]"></i>
														<p>{moment(data["timestamp"]).format("Do MMM YYYY")}</p>
													</aside>
													<Button
														btnStyle="outlined"
														label="View"
														btnType="button"
														handleClick={() => {
															setjobid(data["job"]["refid"]);
															setcanid(data["user"]["erefid"]);
															router.push("applicants/detail");
														}}
													/>
												</div>
											</div>
										)
								)}
						</div>
					</div> */}




					{/* {applicantlist &&
						applicantlist.map((data, i) => (
							<ul
								key={i}
								className="m-4 w-full list-disc rounded-normal bg-white p-4 p-6 shadow-normal hover:bg-lightBlue dark:bg-gray-700 dark:hover:bg-gray-600"
							>
								<li>
									Aplicant Id : <span className="text-lg font-bold">{data["arefid"]}</span>
								</li>
								<li>
									Job Id : <span className="text-lg font-bold">{data["job"]["refid"]}</span>
								</li>
								<li>
									Candidate Id : <span className="text-lg font-bold"> {data["user"]["erefid"]}</span>
								</li>
								<li>
									Applicant Status : <span className="text-lg font-bold">{data["status"]}</span>
								</li>
								<li>
									Candidate Email : <span className="text-lg font-bold">{data["user"]["email"]}</span>
								</li>
								<li>
									Job Title : <span className="text-lg font-bold">{data["job"]["job_title"]}</span>
								</li>
								<li>
									<Button
										label="View"
										loader={false}
										btnType="button"
										handleClick={() => {
											setjobid(data["job"]["refid"]);
											setcanid(data["user"]["erefid"]);
											router.push("applicants/detail");
										}}
									/>
								</li>
							</ul>
						))} */}
				</div>
			</main>
			<Transition.Root show={socialPopup} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setSocialPopup}>
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
										<h4 className="flex items-center font-semibold leading-none">
											<Image src={boardIcon} alt="Add" width={24} className="mr-3" />
											Add Board
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setSocialPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<FormField
											fieldType="input"
											inputType="text"
											label="Board Title"
											placeholder="Assign new board title"
										/>
										<div className="text-center">
											<Button label="Save" />
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
