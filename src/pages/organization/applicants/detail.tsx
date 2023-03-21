import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { axiosInstance } from "@/utils";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useEffect, useState, Fragment } from "react";
import { useApplicantStore } from "@/utils/code";
import Button from "@/components/Button";
import Image from "next/image";
import { Tab } from '@headlessui/react'
import jobIcon from '/public/images/icons/jobs.png'
import TeamMembers from "@/components/TeamMembers";
import userImg from '/public/images/user-image.png'
import testGorrila from '/public/images/test-gorrila.png'

export default function Detail() {
	const router = useRouter();

	const applicantlist = useApplicantStore((state: { applicantlist: any }) => state.applicantlist);
	const setapplicantlist = useApplicantStore((state: { setapplicantlist: any }) => state.setapplicantlist);
	const applicantdetail = useApplicantStore((state: { applicantdetail: any }) => state.applicantdetail);
	const setapplicantdetail = useApplicantStore((state: { setapplicantdetail: any }) => state.setapplicantdetail);
	const jobid = useApplicantStore((state: { jobid: any }) => state.jobid);
	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const canid = useApplicantStore((state: { canid: any }) => state.canid);
	const setcanid = useApplicantStore((state: { setcanid: any }) => state.setcanid);

	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [refersh, setrefersh] = useState(0);
	const [refersh1, setrefersh1] = useState(0);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadApplicantDetail() {
		await axiosInstanceAuth2
			.get(`/candidate/listuser/${canid}/${jobid}`)
			.then(async (res) => {
				console.log(res.data);
				setapplicantdetail(res.data);
				setrefersh(0);
			})
			.catch((err) => {
				console.log(err);
				setrefersh(0);
			});
	}

	useEffect(() => {
		if (
			(token.length > 0 && Object.keys(applicantdetail).length === 0 && jobid.length > 0 && canid.length > 0) ||
			refersh != 0
		) {
			loadApplicantDetail();
		}
	}, [token, applicantdetail, refersh, jobid, canid]);

	async function loadApplicant() {
		await axiosInstanceAuth2
			.get(`/job/listapplicant/`)
			.then(async (res) => {
				// console.log(res.data)
				setapplicantlist(res.data);
				setrefersh1(0);
			})
			.catch((err) => {
				console.log(err);
				setrefersh1(0);
			});
	}

	useEffect(() => {
		if (refersh1 != 0) {
			loadApplicant();
		}
	}, [refersh1]);

	async function chnageStatus(status: string | Blob, arefid: any) {
		const fdata = new FormData();
		fdata.append("status", status);
		await axiosInstanceAuth2
			.put(`/job/applicant/${arefid}/update/`, fdata)
			.then((res) => {
				setrefersh1(1);
			})
			.catch((err) => {
				console.log(err);
				setrefersh1(1);
			});
	}

	return (
		<>
			<Head>
				<title>Applicant Detail</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<Orgsidebar />
				<Orgtopbar />
				<div id="overlay" className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)]"></div>
				<div className="layoutWrap p-4 lg:p-8">
					<div className="relative">
						<div className="flex flex-wrap">
							<div className="w-full lg:max-w-[400px]">
								<div className="mb-4 flex items-center rounded-large border-2 border-slate-300 bg-white p-5 shadow-normal dark:border-gray-700 dark:bg-gray-800">
									<button className="mr-5 justify-self-start text-darkGray dark:text-white">
										<i className="fa-solid fa-arrow-left text-2xl"></i>
									</button>
									<h2 className="text-xl font-bold">
										<span>Profile</span>
									</h2>
								</div>
								<div className="mb-4 rounded-large border-2 border-slate-300 bg-white p-5 shadow-normal dark:border-gray-700 dark:bg-gray-800">
									<div className="mb-4 border-b pb-4">
										<div className="mb-4 border-b pb-2 text-center">
											<Image
												src={userImg}
												alt="User"
												width={90}
												className="mx-auto mb-3 h-[90px] rounded-full object-cover shadow-normal"
											/>
											<h3 className="mb-2 font-bold">Anne Jacob</h3>
											<p className="mb-2 text-sm text-darkGray">Product Manager - ID 43108</p>
											<p className="mb-2 text-sm text-darkGray">
												Source - &nbsp;
												<span className="font-semibold text-primary">
													<i className="fa-brands fa-linkedin"></i> LinkedIn
												</span>
											</p>
										</div>
										<div className="flex flex-wrap items-center justify-between">
											<div className="my-1 flex items-center">
												<div className="mr-2 block h-[26px] w-[30px] rounded border border-white bg-red-100 text-center leading-[23px] text-red-500 shadow-normal">
													<i className="fa-regular fa-envelope"></i>
												</div>
												<p className="text-[11px] font-semibold text-darkGray">annejacob121@gmail.com</p>
											</div>
											<div className="my-1 flex items-center">
												<div className="mr-2 block h-[26px] w-[30px] rounded border border-white bg-teal-100 text-center leading-[23px] text-teal-500 shadow-normal">
													<i className="fa-solid fa-phone text-[14px]"></i>
												</div>
												<p className="text-[11px] font-semibold text-darkGray">+91 - 9878548965</p>
											</div>
										</div>
										<div className="flex flex-wrap items-center justify-center text-2xl">
											<Link href={"#"} target="_blank" className="m-3 mb-0">
												<i className="fa-brands fa-behance"></i>
											</Link>
											<Link href={"#"} target="_blank" className="m-3 mb-0">
												<i className="fa-brands fa-github"></i>
											</Link>
											<Link href={"#"} target="_blank" className="m-3 mb-0">
												<i className="fa-brands fa-stack-overflow"></i>
											</Link>
										</div>
									</div>
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">Details</h3>
										<ul className="flex flex-wrap text-[12px] text-darkGray">
											<li className="mb-2 w-[50%] pr-2">Current Salary - 6.0 LPA</li>
											<li>
												<Button
													label="Sourced"
													loader={false}
													btnType="button"
													handleClick={() => {
														chnageStatus("Sourced", data["arefid"]);
													}}
												/>
												<Button
													label="Applied"
													loader={false}
													btnType="button"
													handleClick={() => {
														chnageStatus("Applied", data["arefid"]);
													}}
												/>
												<Button
													label="Phone Screen"
													loader={false}
													btnType="button"
													handleClick={() => {
														chnageStatus("Phone Screen", data["arefid"]);
													}}
												/>
												<Button
													label="Assement"
													loader={false}
													btnType="button"
													handleClick={() => {
														chnageStatus("Assement", data["arefid"]);
													}}
												/>
												<Button
													label="Interview"
													loader={false}
													btnType="button"
													handleClick={() => {
														chnageStatus("Interview", data["arefid"]);
													}}
												/>
												<Button
													label="Offered"
													loader={false}
													btnType="button"
													handleClick={() => {
														chnageStatus("Offered Letter", data["arefid"]);
													}}
												/>
												<Button
													label="Hired"
													loader={false}
													btnType="button"
													handleClick={() => {
														chnageStatus("Hired", data["arefid"]);
													}}
												/>
											</li>
										</ul>
									</div>
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">Summary</h3>
										<p className="text-[12px] text-darkGray">
											{
												"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
											}
										</p>
									</div>
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">Skills</h3>
										<ul className="flex flex-wrap rounded-normal border p-2 text-[12px] shadow">
											<li className="m-1 min-w-[75px] rounded-[30px] bg-gray-100 px-4 py-2 text-center">Skill 1</li>
											<li className="m-1 min-w-[75px] rounded-[30px] bg-gray-100 px-4 py-2 text-center">Skill 1</li>
											<li className="m-1 min-w-[75px] rounded-[30px] bg-gray-100 px-4 py-2 text-center">Skill 1</li>
											<li className="m-1 min-w-[75px] rounded-[30px] bg-gray-100 px-4 py-2 text-center">Skill 1</li>
											<li className="m-1 min-w-[75px] rounded-[30px] bg-gray-100 px-4 py-2 text-center">Skill 1</li>
											<li className="m-1 min-w-[75px] rounded-[30px] bg-gray-100 px-4 py-2 text-center">Skill 1</li>
										</ul>
									</div>
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">Education</h3>
										{Array(2).fill(
											<div className="mb-2 rounded-normal border p-3 text-[12px] text-darkGray shadow last:mb-0">
												<h4 className="mb-1 font-bold text-black dark:text-white">Web Developer</h4>
												<p>XYZ Company</p>
												<p className="mb-1">May 2019 - March 2022</p>
												<p>
													Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
													labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
													laboris nisi ut aliquip ex ea commodo consequat.
												</p>
											</div>
										)}
									</div>
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">Certifications</h3>
										{Array(2).fill(
											<div className="mb-2 rounded-normal border p-3 text-[12px] text-darkGray shadow last:mb-0">
												<h4 className="mb-1 font-bold text-black dark:text-white">Web Developer</h4>
												<p>XYZ Company</p>
												<p className="mb-1">May 2019 - March 2022</p>
												<p>
													Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
													labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
													laboris nisi ut aliquip ex ea commodo consequat.
												</p>
											</div>
										)}
									</div>
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">Experience</h3>
										{Array(2).fill(
											<div className="mb-2 rounded-normal border p-3 text-[12px] text-darkGray shadow last:mb-0">
												<h4 className="mb-1 font-bold text-black dark:text-white">Web Developer</h4>
												<p>XYZ Company</p>
												<p className="mb-1">May 2019 - March 2022</p>
												<p>
													Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
													labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
													laboris nisi ut aliquip ex ea commodo consequat.
												</p>
											</div>
										)}
									</div>
									<div className="mb-4 border-b pb-4">
										<h3 className="mb-4 text-lg font-semibold">Message from Vendor</h3>
										<div className="mb-2 rounded-normal border p-3 text-[12px] text-darkGray shadow last:mb-0">
											<p>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
												labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
												laboris nisi ut aliquip ex ea commodo consequat.
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="w-full lg:max-w-[calc(100%-400px)] lg:pl-8">
								<div className="bg-white dark:bg-gray-800 border-2 border-slate-300 dark:border-gray-700 shadow-normal rounded-large overflow-hidden">
									<div className="flex flex-wrap items-center jusitfy-between shadow p-5">
										<aside className="flex items-center">
											<Image src={jobIcon} alt="Jobs" width={20} className="mr-3" />
											<h2 className="text-xl font-bold">
												<span>Software Developer</span>
											</h2>
										</aside>
										<aside className="flex grow justify-end">
											<TeamMembers />
										</aside>
									</div>
									<div className="">
										<Tab.Group>
											<Tab.List className={'px-4 border-b'}>
												<Tab as={Fragment}>
													{({ selected }) => (
														<button
														className={
															'font-semibold border-b-4 py-3 px-6 focus:outline-none' + ' ' + (selected ? 'text-primary border-primary' : 'text-darkGray border-transparent')
														}
														>
														Profile
														</button>
													)}
												</Tab>
												<Tab as={Fragment}>
													{({ selected }) => (
														<button
														className={
															'font-semibold border-b-4 py-3 px-6 focus:outline-none' + ' ' + (selected ? 'text-primary border-primary' : 'text-darkGray border-transparent')
														}
														>
														Assessment
														</button>
													)}
												</Tab>
												<Tab as={Fragment}>
													{({ selected }) => (
														<button
														className={
															'font-semibold border-b-4 py-3 px-6 focus:outline-none' + ' ' + (selected ? 'text-primary border-primary' : 'text-darkGray border-transparent')
														}
														>
														Feedback
														</button>
													)}
												</Tab>
												<Tab as={Fragment}>
													{({ selected }) => (
														<button
														className={
															'font-semibold border-b-4 py-3 px-6 focus:outline-none' + ' ' + (selected ? 'text-primary border-primary' : 'text-darkGray border-transparent')
														}
														>
														Timeline
														</button>
													)}
												</Tab>
											</Tab.List>
											<Tab.Panels>
												<Tab.Panel className={'min-h-[calc(100vh-250px)]'}>
													<div className="flex flex-wrap items-center justify-between bg-lightBlue text-sm p-2 px-8">
														<p className="my-2">PDF File</p>
														<Link href={'#'} className="my-2 inline-block text-primary font-bold hover:underline">
															<i className="fa-solid fa-download mr-2"></i>
															Download
														</Link>
													</div>
													<div className="px-8">
														Preview Here
													</div>
												</Tab.Panel>
												<Tab.Panel className={'min-h-[calc(100vh-250px)] py-6 px-8'}>
													<div className="flex flex-wrap mx-[-15px]">
														{Array(6).fill(
															<div className="w-full md:max-w-[50%] px-[15px] mb-[30px]">
																<div className="h-full bg-lightBlue rounded-normal shadow-lg p-6">
																	<div className="flex flex-wrap justify-between items-start mb-4">
																		<Image src={testGorrila} alt="Assessment" className="h-[30px] w-auto mb-2" />
																		<div className="-mt-2 pl-2">	
																			<Button btnStyle="outlined" label="Add" />
																		</div>
																	</div>
																	<h4 className="font-semibold text-lg">Test Gorilla</h4>
																</div>
															</div>
														)}
													</div>
												</Tab.Panel>
												<Tab.Panel className={'min-h-[calc(100vh-250px)]'}>Content 3</Tab.Panel>
												<Tab.Panel className={'min-h-[calc(100vh-250px)]'}>Content 4</Tab.Panel>
											</Tab.Panels>
										</Tab.Group>
									</div>
								</div>
							</div>
						</div>
						{/* <div className="-mx-4">
							<Button
								label="Back"
								loader={false}
								btnType="button"
								handleClick={() => {
									setjobid("");
									setcanid("");
									setapplicantdetail({});
									setapplicantlist([]);
									router.back();
								}}
							/>

							{applicantdetail && applicantlist['Resume'].map((data, i) => (
									<Document file=`${data['file']}` key={i}/>
								))}

							{applicantdetail["Resume"] &&
								applicantdetail["Resume"].map((data, i) => (
									<iframe src={`http://127.0.0.1:8000${data["file"]}`} key={i} />
								))}
							{applicantlist &&
								applicantlist.map(
									(data, i) =>
										data["job"]["refid"] == jobid &&
										data["user"]["erefid"] == canid && (
											<ul
												key={i}
												className="m-4 w-full list-disc rounded-normal bg-white p-4 p-6 shadow-normal hover:bg-lightBlue dark:bg-gray-700 dark:hover:bg-gray-600"
											>
												<li>
													Current Status : <span className="text-lg font-bold">{data["status"]}</span>
												</li>
												<li>
													<Button
														label="Sourced"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Sourced", data["arefid"]);
														}}
													/>
													<Button
														label="Applied"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Applied", data["arefid"]);
														}}
													/>
													<Button
														label="Phone Screen"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Phone Screen", data["arefid"]);
														}}
													/>
													<Button
														label="Assement"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Assement", data["arefid"]);
														}}
													/>
													<Button
														label="Interview"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Interview", data["arefid"]);
														}}
													/>
													<Button
														label="Offered"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Offered", data["arefid"]);
														}}
													/>
													<Button
														label="Hired"
														loader={false}
														btnType="button"
														handleClick={() => {
															chnageStatus("Hired", data["arefid"]);
														}}
													/>
												</li>
											</ul>
										)
								)}
						</div> */}
					</div>
				</div>
			</main>
		</>
	);
}
