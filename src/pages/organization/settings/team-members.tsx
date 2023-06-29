import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Head from "next/head";
import { Dialog, Listbox, Tab, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import usersIcon from "/public/images/icons/team-users.png";
import { Fragment, useEffect, useRef, useState } from "react";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";
import { addActivityLog, addNotifyLog, axiosInstanceAuth } from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";
import moment from "moment";
import { useUserStore, useNotificationStore } from "@/utils/code";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLangStore } from "@/utils/code";
import UpcomingComp from "@/components/organization/upcomingComp";

const people = [{ name: "Recruiter" }, { name: "Collaborator" }, { name: "Hiring Manager" }];

export default function TeamMembers({ upcomingSoon }: any) {
	const { t } = useTranslation("common");
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();

	const [access, setAccess] = useState(people[0]);

	const cancelButtonRef = useRef(null);
	const [addTeam, setAddTeam] = useState(false);
	const [addDivision, setAddDivision] = useState(false);

	const { data: session } = useSession();
	const [token, settoken] = useState("");

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	//Add TM

	const [name, setname] = useState("");
	const [oemail, setoemail] = useState("");
	const [dept, setdept] = useState("");
	const [role, setrole] = useState(people[0]);

	function verifyAddTeam() {
		return name.length > 0 && oemail.length > 0 && dept.length > 0 && role;
	}

	//Load TM
	const [tm, settm] = useState([]);
	const [filterTeam, setFilterTeam] = useState([]);
	const [search, setsearch] = useState("");

	const userState = useUserStore((state: { user: any }) => state.user);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	async function loadTeamMember() {
		await axiosInstanceAuth2
			.get(`/organization/listorguser/`)
			.then(async (res) => {
				console.log("@", "listorguser", res.data);
				settm(res.data);
				setFilterTeam(res.data);
			})
			.catch((err) => {
				console.log("@", "listorguser", err);
			});
	}

	useEffect(() => {
		if (search.length > 0) {
			let localSearch = search.toLowerCase();
			let arr = [];
			for (let i = 0; i < tm.length; i++) {
				if (tm[i]["name"].toLowerCase().includes(localSearch) || tm[i]["email"].toLowerCase().includes(localSearch)) {
					arr.push(tm[i]);
				}
			}
			setFilterTeam(arr);
		} else {
			setFilterTeam(tm);
		}
	}, [search]);

	async function addTeamMember() {
		const fd = new FormData();
		fd.append("name", name);
		fd.append("email", oemail);
		fd.append("role", role.name);
		fd.append("dept", dept);
		await axiosInstanceAuth2
			.post(`/organization/create/org/user/`, fd)
			.then(async (res) => {
				console.log("@", "iprofile", res.data);
				toastcomp("New User Add", "Success");

				let aname = `New User ${name} (${oemail}) as ${role["name"]} joined in our Organization by ${
					userState[0]["name"]
				} (${userState[0]["email"]}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				let title = `New User ${name} (${oemail}) as ${role["name"]} joined in our Organization by ${userState[0]["name"]} (${userState[0]["email"]})`;

				addNotifyLog(axiosInstanceAuth2, title, "");
				toggleLoadMode(true);

				setAddTeam(false);
				setname("");
				setoemail("");
				setdept("");
				setrole(people[0]);
				loadTeamMember();
			})
			.catch((err) => {
				console.log("@", "iprofile", err);
				toastcomp("New User Not Add", "error");
				setAddTeam(false);
				setname("");
				setoemail("");
				setdept("");
				setrole(people[0]);
				loadTeamMember();
			});
	}

	async function saveTeamMember(role: string, pk: any) {
		const fd = new FormData();
		fd.append("role", role);
		await axiosInstanceAuth2
			.put(`/organization/updateorguser/${pk}/`, fd)
			.then(async (res) => {
				toastcomp("User Updated", "Success");
				console.log("@", res.data);

				let aname = `Organization User role Updated to ${res.data["role"]} by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				let title = `Organization User role Updated to ${res.data["role"]} by ${userState[0]["name"]} (${userState[0]["email"]})`;

				addNotifyLog(axiosInstanceAuth2, title, "");
				toggleLoadMode(true);

				loadTeamMember();
			})
			.catch((err) => {
				console.log("@", "iprofile", err);
				toastcomp("User Not Updated", "error");
				loadTeamMember();
			});
	}

	async function delTeamMember(pk: any, email: any) {
		await axiosInstanceAuth2
			.delete(`/organization/deleteorguser/${pk}/`)
			.then(async (res) => {
				toastcomp("User Removed", "Success");
				console.log("@", res.data);

				let aname = `Organization User (${email}) Removed by ${userState[0]["name"]} (${
					userState[0]["email"]
				}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;

				addActivityLog(axiosInstanceAuth2, aname);

				let title = `Organization User (${email}) Removed by ${userState[0]["name"]} (${userState[0]["email"]})`;

				addNotifyLog(axiosInstanceAuth2, title, "");
				toggleLoadMode(true);

				loadTeamMember();
			})
			.catch((err) => {
				console.log("@", "iprofile", err);
				toastcomp("User Not Deleted", "error");
				loadTeamMember();
			});
	}

	useEffect(() => {
		if (token && token.length > 0) {
			loadTeamMember();
		}
	}, [token]);

	const tabHeading_1 = [
		{
			title: t("Words.AllTeamMembers")
		},
		{
			title: t("Words.Divison")
		}
	];
	const TeamTableHead = [
		{
			title: t("Words.UserName")
		},
		{
			title: t("Words.Department_Title")
		},
		{
			title: t("Form.Email")
		},
		{
			title: t("Words.InviteStatus")
		},
		{
			title: t("Words.Access")
		}
	];
	function DivisionsList() {
		const [accordionOpen, setAccordionOpen] = useState(false);
		return (
			<>
				<div className={"mb-3 rounded border text-sm" + " " + (accordionOpen ? "border-slate-300" : "")}>
					<div className="flex flex-wrap items-center px-4">
						<h6 className="grow py-3 font-bold">Software Developer</h6>
						<div className="py-3 text-right">
							<button type="button" className="ml-2 text-red-500 hover:text-red-700">
								<i className={"fa-solid fa-trash"}></i>
							</button>
							<button
								type="button"
								className="ml-4 text-darkGray dark:text-gray-400"
								onClick={() => setAccordionOpen(!accordionOpen)}
							>
								<i className={"fa-solid" + " " + (accordionOpen ? "fa-chevron-up" : "fa-chevron-down")}></i>
							</button>
						</div>
					</div>
					<Transition.Root show={accordionOpen} as={Fragment}>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="border-t">
								<div className="overflow-x-auto two">
									<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
										<thead>
											<tr>
												{TeamTableHead.map((item, i) => (
													<th className="border-b px-4 py-2 text-left" key={i}>
														{item.title}
													</th>
												))}
											</tr>
										</thead>
										<tbody>
											{Array(6).fill(
												<tr>
													<td className="border-b px-4 py-2 text-sm">Jane Cooper</td>
													<td className="border-b px-4 py-2 text-sm">Recruiter</td>
													<td className="border-b px-4 py-2 text-sm">jane@microsoft.com</td>
													<td className="border-b px-4 py-2 text-sm">On Pending</td>
													<td className="border-b px-4 py-2 text-sm">Hiring Manager</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						</Transition.Child>
					</Transition.Root>
				</div>
			</>
		);
	}
	return (
		<>
			<Head>
				<title>{t("Words.TeamMembers")}</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<OrgSideBar />
				<OrgTopBar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className="layoutWrap p-4 lg:p-8">
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
										<Image src={usersIcon} alt="Active Job" height={20} />
									</div>
									<span>{t("Words.TeamMembers")}</span>
								</h2>
							</div>
							<Tab.Group>
								<div className={"border-b px-4"}>
									<Tab.List className={"mx-auto w-full max-w-[950px]"}>
										{tabHeading_1.map((item, i) => (
											<Tab key={i} as={Fragment}>
												{({ selected }) => (
													<button
														className={
															"mr-16 border-b-4 py-2 font-semibold focus:outline-none" +
															" " +
															(selected
																? "border-primary text-primary dark:text-white dark:border-white"
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
								<Tab.Panels className={"mx-auto w-full max-w-[980px] px-4 py-8"}>
									<Tab.Panel>
										<div className="mb-6 flex flex-wrap items-center justify-between">
											<div className="w-[350px] pr-2">
												<FormField
													fieldType="input"
													inputType="search"
													placeholder={t("Words.Search")}
													icon={<i className="fa-solid fa-magnifying-glass"></i>}
													value={search}
													handleChange={(e) => setsearch(e.target.value)}
												/>
											</div>
											<div className="flex grow items-center justify-end">
												<div className="mr-3">
													<Button
														btnType="button"
														btnStyle="iconRightBtn"
														label={t("Btn.Add")}
														iconRight={<i className="fa-solid fa-circle-plus"></i>}
														handleClick={() => setAddTeam(true)}
													/>
												</div>
												{/* <div className="mr-3 w-[150px]">
													<FormField
														fieldType="select"
														placeholder={t("Words.Sort")}
														singleSelect={true}
														options={[
															{
																id: "A-to-Z",
																name: "A to Z"
															},
															{
																id: "Z-to-A",
																name: "Z to A"
															}
														]}
													/>
												</div>
												<div className="w-[150px]">
													<label
														htmlFor="teamSelectAll"
														className="flex min-h-[45px] w-full cursor-pointer items-center justify-between rounded-normal border border-borderColor p-3 text-sm text-darkGray dark:border-gray-600 dark:bg-gray-700"
													>
														<span>{t("Words.SelectAll")}</span>
														<input type="checkbox" id="teamSelectAll" />
													</label>
												</div> */}
											</div>
										</div>
										<div className="overflow-x-auto three">
											<table cellPadding={"0"} cellSpacing={"0"} className="w-full min-w-[948px]">
												<thead>
													<tr>
														{TeamTableHead.map((item, i) => (
															<th className="border-b px-3 py-2 text-left" key={i}>
																{item.title}
															</th>
														))}
														<th className="border-b px-3 py-2 text-left"></th>
													</tr>
												</thead>
												<tbody>
													{filterTeam &&
														filterTeam.map((data, i) => (
															<tr key={i}>
																<td className="border-b px-3 py-2 text-sm">{data["name"]}</td>
																<td className="border-b px-3 py-2 text-sm">{data["dept"]}</td>
																<td className="border-b px-3 py-2 text-sm">{data["email"]}</td>
																<td className="border-b px-3 py-2 text-sm">
																	{data["verified"] == false ? <>On Pending</> : <>Verified</>}
																</td>
																<td className="w-[250px] border-b px-3 py-2">
																	<div className="w-full">
																		<Listbox
																			value={{ name: data["role"] }}
																			onChange={(selectedOption) => {
																				saveTeamMember(selectedOption.name, data["id"]);
																			}}
																		>
																			<Listbox.Button
																				className={
																					"min-h-[45px] w-full rounded-normal border bg-white text-left text-sm font-bold dark:border-gray-600 dark:bg-gray-700"
																				}
																			>
																				<span className="inline-block w-[calc(100%-40px)] px-3 py-2">
																					{data["role"]}
																				</span>
																				<span className="inline-block w-[40px] border-l px-3 py-2 text-center text-sm dark:border-gray-600">
																					<i className="fa-solid fa-chevron-down"></i>
																				</span>
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
																						"absolute right-0 top-[100%] mt-2 w-[250px] overflow-hidden rounded-normal bg-white shadow-normal dark:bg-gray-700"
																					}
																				>
																					{people.map((person, i) => (
																						<Listbox.Option
																							key={i}
																							value={person}
																							className="clamp_1 relative cursor-pointer px-6 py-2 pl-8 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
																						>
																							{/* {({ selected }) => (
                                                                                    <>
                                                                                        <span className={` ${selected ? "font-bold" : "font-normal"}`}>{person.name}</span>
                                                                                        {selected ? (
                                                                                            <span className="absolute left-3">
                                                                                                <i className="fa-solid fa-check"></i>
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )} */}

																							<>
																								<span
																									className={` ${
																										person.name == data["role"] ? "font-bold" : "font-normal"
																									}`}
																								>
																									{person.name}
																								</span>
																								{person.name == data["role"] ? (
																									<span className="absolute left-3">
																										<i className="fa-solid fa-check"></i>
																									</span>
																								) : null}
																							</>
																						</Listbox.Option>
																					))}
																				</Listbox.Options>
																			</Transition>
																		</Listbox>
																	</div>
																</td>
																{/* <td className="border-b px-3 py-2 text-right">
																	<input type="checkbox" />
																</td> */}
																<td className="border-b px-3 py-2 text-right">
																	<button type="button" className="ml-2 text-red-500 hover:text-red-700" onClick={() => delTeamMember(data["id"], data["email"])}>
																		<i className={"fa-solid fa-trash"}></i>
																	</button>
																</td>
															</tr>
														))}
												</tbody>
											</table>
										</div>
									</Tab.Panel>
									<Tab.Panel>
										{upcomingSoon ? (
											<UpcomingComp />
										) : (
											<>
												<div className="mb-6 flex flex-wrap items-center justify-between rounded-normal border p-3 dark:border-gray-600">
													<h2 className="text-lg font-bold">{t("Btn.Add") + " " + t("Words.Division")}</h2>
													<Button
														btnType="button"
														btnStyle="iconRightBtn"
														label={t("Btn.Add")}
														iconRight={<i className="fa-solid fa-circle-plus"></i>}
														handleClick={() => setAddDivision(true)}
													/>
												</div>
												<p className="text-center text-darkGray dark:text-gray-400">No divions found</p>
												<div>
													<DivisionsList />
													<DivisionsList />
													<DivisionsList />
												</div>
											</>
										)}
									</Tab.Panel>
								</Tab.Panels>
							</Tab.Group>
						</div>
					</div>
				</div>
			</main>
			<Transition.Root show={addTeam} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddTeam}>
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
											{t("Btn.Add") + " " + t("Words.TeamMembers")}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddTeam(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="overflow-auto p-8">
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label={t("Form.FullName")}
													value={name}
													handleChange={(e) => setname(e.target.value)}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="email"
													label={t("Form.OrgEmail")}
													value={oemail}
													handleChange={(e) => setoemail(e.target.value)}
													required
												/>
											</div>
										</div>
										<div className="mb-4">
											<h6 className="mb-1 font-bold">{t("Words.Access")}</h6>
											<Listbox value={role} onChange={setrole}>
												<Listbox.Button
													className={
														"min-h-[45px] w-full rounded-normal border bg-white text-left text-sm font-bold dark:border-gray-600 dark:bg-gray-700"
													}
												>
													<span className="inline-block w-[calc(100%-40px)] px-3 py-2">{role.name}</span>
													<span className="inline-block w-[40px] border-l px-3 py-2 text-center text-sm dark:border-gray-600">
														<i className="fa-solid fa-chevron-down"></i>
													</span>
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
															"absolute right-0 top-[100%] mt-2 w-[250px] overflow-hidden rounded-normal bg-white shadow-normal dark:bg-gray-700"
														}
													>
														{people.map((person, i) => (
															<Listbox.Option
																key={i}
																value={person}
																className="clamp_1 relative cursor-pointer px-6 py-2 pl-8 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
															>
																{({ selected }) => (
																	<>
																		<span className={` ${selected ? "font-bold" : "font-normal"}`}>{person.name}</span>
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
										<FormField
											fieldType="input"
											inputType="text"
											label={t("Words.Department")}
											value={dept}
											handleChange={(e) => setdept(e.target.value)}
										/>
										<div className="text-center">
											<Button
												label={t("Btn.Add")}
												disabled={!verifyAddTeam()}
												btnType={"button"}
												handleClick={addTeamMember}
											/>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={addDivision} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddDivision}>
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
										<h4 className="flex items-center font-semibold leading-none">
											{t("Btn.Add") + " " + t("Words.Division")}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAddDivision(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<FormField fieldType="input" inputType="text" label={t("Words.Title")} />
										<div className="overflow-x-auto one">
											<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
												<thead>
													<tr>
														{TeamTableHead.map((item, i) => (
															<th className="border-b px-3 py-2 text-left" key={i}>
																{item.title}
															</th>
														))}
														<th className="border-b px-3 py-2 text-right">
															<input type="checkbox" />
														</th>
													</tr>
												</thead>
												<tbody>
													{Array(6).fill(
														<tr>
															<td className="border-b px-3 py-2 text-sm">Jane Cooper</td>
															<td className="border-b px-3 py-2 text-sm">Recruiter</td>
															<td className="border-b px-3 py-2 text-sm">jane@microsoft.com</td>
															<td className="border-b px-3 py-2 text-sm">On Pending</td>
															<td className="border-b px-3 py-2 text-sm">Hiring Manager</td>
															<td className="border-b px-3 py-2 text-right">
																<input type="checkbox" />
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
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
