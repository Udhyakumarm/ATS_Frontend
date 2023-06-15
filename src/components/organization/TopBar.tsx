import ThemeChange from "../ThemeChange";
import { signOut, useSession } from "next-auth/react";
import { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition, Listbox, Tab } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import userImg from "/public/images/user-image.png";
import OrganizationCalendar from "./OrganizationCalendar";
import { axiosInstance } from "@/utils";
import { useRouter } from "next/router";
import googleIcon from "/public/images/social/google-icon.png";
import { useLangStore, useNotificationStore, useUserStore, useVersionStore } from "@/utils/code";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import UpcomingComp from "./upcomingComp";
import Button from "../Button";
import FormField from "../FormField";
import ToggleLang from "../ToggleLang";

const CalendarIntegrationOptions = [
	{ provider: "Google Calendar", icon: googleIcon, link: "/api/integrations/gcal/create" }
];

const preVersions = [{ name: "starter" }, { name: "premium" }, { name: "enterprise" }];

export default function OrgTopBar() {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const cancelButtonRef = useRef(null);
	const router = useRouter();
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const { data: session } = useSession();

	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);

	const type = useUserStore((state: { type: any }) => state.type);
	const role = useUserStore((state: { role: any }) => state.role);
	const user = useUserStore((state: { user: any }) => state.user);
	const version = useVersionStore((state: { version: any }) => state.version);
	const setversion = useVersionStore((state: { setversion: any }) => state.setversion);
	const [selectedPreVersion, setPreVersion] = useState({ name: version });

	const [integration, setIntegration] = useState([]);
	const [toDoPopup, setToDoPopup] = useState(false);
	const [toDoAddTaskPopup, setToDoAddTaskPopup] = useState(false);

	useEffect(() => {
		async function loadIntegrations() {
			if (!session) return;

			const { validatedIntegrations: newIntegrations } = await axiosInstance.next_api
				.get("/api/integrations/calendar")
				.then((response) => response.data)
				.catch((err) => {
					console.log(err);
					return { data: { success: false } };
				});

			setIntegration(newIntegrations);
		}

		loadIntegrations();
	}, [router, session]);

	const [token, settoken] = useState("");
	const [count, setcount] = useState(0);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadNotificationCount() {
		if (role === "Super Admin") {
			await axiosInstanceAuth2
				.get(`/chatbot/get-notification-count-admin/`)
				.then(async (res) => {
					// console.log("!", res.data);
					setcount(res.data.length);
				})
				.catch((err) => {
					console.log("!", err);
				});
		} else {
			await axiosInstanceAuth2
				.get(`/chatbot/get-notification-count/`)
				.then(async (res) => {
					// console.log("!", res.data);
					setcount(res.data.length);
				})
				.catch((err) => {
					console.log("!", err);
				});
		}
	}

	async function notification() {
		if (role === "Super Admin") {
			await axiosInstanceAuth2
				.get(`/chatbot/read-notification-count-admin/`)
				.then(async (res) => {
					// console.log("!", res.data);
					setcount(res.data.length);
					router.push("/organization/notifications");
				})
				.catch((err) => {
					console.log("!", err);
				});
		} else {
			await axiosInstanceAuth2
				.get(`/chatbot/read-notification-count/`)
				.then(async (res) => {
					// console.log("!", res.data);
					setcount(res.data.length);
					router.push("/organization/notifications");
				})
				.catch((err) => {
					console.log("!", err);
				});
		}
	}

	const load = useNotificationStore((state: { load: any }) => state.load);
	const toggleLoadMode = useNotificationStore((state: { toggleLoadMode: any }) => state.toggleLoadMode);

	useEffect(() => {
		if ((token && token.length > 0 && role && role.length > 0) || load) {
			loadNotificationCount();
			if (load) toggleLoadMode(false);
		}
	}, [token, role, load]);

	useEffect(() => {
		setversion(selectedPreVersion.name);
	}, [selectedPreVersion]);

	const tabHeading = [
		{
			title: srcLang==='ja' ? '高い' : 'High'
		},
		{
			title: srcLang==='ja' ? '中くらい' : 'Medium'
		},
		{
			title: srcLang==='ja' ? '低い' : 'Low'
		},
		{
			title: srcLang==='ja' ? '完了しました' : 'Completed'
		}
	];

	return (
		<>
			<div
				id="topbar"
				className="fixed left-0 top-0 z-[12] flex h-[65px] w-full items-center justify-end bg-white px-6 py-3 shadow transition dark:bg-gray-800 lg:left-[270px] lg:w-[calc(100%-270px)]"
			>
				<p className="bg-blue-500 p-1 text-white">
					{type}&nbsp;{role}
				</p>
				<p className="bg-green-500 p-1 uppercase text-white">{version}</p>

				{role === "Super Admin" && (
					<div className="ms-3">
						<Listbox value={selectedPreVersion} onChange={setPreVersion}>
							<div className="relative">
								<Listbox.Button className="flex items-center justify-center rounded-l bg-secondary px-2 py-2 text-white">
									{/* <span className="block truncate uppercase leading-1 mr-2">{lang}</span> */}
									<i className="fa-solid fa-code-compare"></i>
								</Listbox.Button>
								<Transition
									as={Fragment}
									leave="transition ease-in duration-100"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<Listbox.Options className="absolute right-0 top-[100%] mt-1 max-h-60 w-full min-w-[150px] overflow-auto rounded-md bg-secondary py-1 shadow-normal ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
										{preVersions.map((item, itemIdx) => (
											<Listbox.Option
												className={({ active }) =>
													`relative block cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-indigo-500 hover:text-white ${
														active ? "bg-indigo-500 text-white" : "text-white"
													}`
												}
												value={item}
												key={itemIdx}
												as={Link}
												href={router.asPath}
											>
												<span
													className={`block truncate uppercase ${
														version === item.name ? "font-medium" : "font-normal"
													}`}
												>
													{item.name}
												</span>
												{version === item.name ? (
													<span className={`absolute inset-y-0 left-0 flex items-center pl-3 text-white`}>
														<i className="fa-solid fa-check"></i>
													</span>
												) : null}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</Transition>
							</div>
						</Listbox>
					</div>
				)}

				<ThemeChange />
				<button type="button" className="mr-6 text-darkGray dark:text-gray-400" onClick={() => setToDoPopup(true)}>
					<i className="fa-regular fa-clipboard text-[20px]"></i>
				</button>
				{version != "starter" && (
					<button
						type="button"
						className="mr-6 text-darkGray dark:text-gray-400"
						onClick={() => setIsCalendarOpen(true)}
					>
						<i className="fa-regular fa-calendar-days text-[20px]"></i>
					</button>
				)}
				<div
					className="relative mr-6 cursor-pointer uppercase text-darkGray dark:text-gray-400"
					onClick={() => notification()}
				>
					<i className="fa-regular fa-bell text-[20px]"></i>
					<span className="absolute right-[-10px] top-[-7px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
						{count}
					</span>
				</div>
				<ToggleLang />
				<button
					type="button"
					className="ml-4 text-xl rounded text-red-500 hover:text-red-600"
					onClick={() => {
						signOut();

						settype("");
						setrole("");
						setuser([]);
					}}
				>
					<i className="fa-solid fa-right-from-bracket"></i>
				</button>
			</div>
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
								{integration && integration.length > 0 ? (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-5xl">
										<OrganizationCalendar integration={integration[0]} />
									</Dialog.Panel>
								) : (
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
								)}
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={toDoPopup} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setToDoPopup}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#fff] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">{srcLang==='ja' ? 'ToDoリスト' : 'To Do List'}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setToDoPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="text-right mb-6">
											<Button
												btnType="button"
												btnStyle="iconRightBtn"
												label={srcLang==='ja' ? '追加' : 'Add Task'}
												iconRight={<i className="fa-solid fa-circle-plus"></i>}
												handleClick={() => setToDoAddTaskPopup(true)}
											/>
										</div>
										<Tab.Group>
											<Tab.List className={"mb-6 border-b text-center"}>
												{tabHeading.map((item, i) => (
													<Tab key={i} as={Fragment}>
														{({ selected }) => (
															<button
																className={
																	"mr-6 inline-flex items-center border-b-4 px-4 py-2 font-semibold focus:outline-none" +
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
											<Tab.Panels>
												<Tab.Panel>
													<p className="text-sm text-darkGray text-center">{srcLang === 'ja' ? '未完了のタスクはありません' : 'Nothing In To Do List'}</p>	
													<div className="max-h-[60vh] overflow-auto">
														{Array(5).fill(
														<div className="rounded-normal border overflow-hidden my-2">
															<div className="px-8 py-4">
																<h5 className="font-bold mb-2">To do list title here</h5>
																<p className="text-sm text-darkGray dark:text-gray-400">Being able to rename and edit users lorem rename and edit users Being able to rename and edit users lorem rename and edit usersBeing able to rename and edit users lorem rename and edit users</p>
															</div>
															<div className="bg-lightBlue dark:bg-gray-700 px-8 py-2 flex flex-wrap items-center">
																<aside className="grow flex items-center">
																	<div className="flex items-center mr-6">
																		<span className="mr-2 rounded bg-[#FF8A00] p-2 flex items-center justify-center text-lg leading-normal text-white dark:bg-gray-800">
																			<i className="fa-regular fa-square-check"></i>
																		</span>
																		<h5 className="font-bold text-sm">20 Nov 2023</h5>
																	</div>
																	<p className="text-white bg-red-500 text-[10px] rounded-full leading-[1.2] py-1 px-2">{srcLang==='ja' ? '高い' : 'High'}</p>
																</aside>
																<aside>
																	<label htmlFor="markDone" className="inline-flex items-center text-[10px] text-darkGray dark:text-gray-400">
																		{srcLang==='ja' ? '完了としてマークする' : 'Mark as Done'}
																		<input type="checkbox" id="markDone" className="ml-2" />
																	</label>
																	<button type="button" className="ml-6">
																		<i className="fa-solid fa-pencil"></i>
																	</button>
																	<button type="button" className="ml-6">
																		<i className="fa-solid fa-trash-can"></i>
																	</button>
																</aside>
															</div>
														</div>
														)}
													</div>
												</Tab.Panel>
												<Tab.Panel>
													<p className="text-sm text-darkGray text-center">{srcLang === 'ja' ? '未完了のタスクはありません' : 'Nothing In To Do List'}</p>	
													<div className="max-h-[60vh] overflow-auto">
														{Array(5).fill(
														<div className="rounded-normal border overflow-hidden my-2">
															<div className="px-8 py-4">
																<h5 className="font-bold mb-2">To do list title here</h5>
																<p className="text-sm text-darkGray dark:text-gray-400">Being able to rename and edit users lorem rename and edit users Being able to rename and edit users lorem rename and edit usersBeing able to rename and edit users lorem rename and edit users</p>
															</div>
															<div className="bg-lightBlue dark:bg-gray-700 px-8 py-2 flex flex-wrap items-center">
																<aside className="grow flex items-center">
																	<div className="flex items-center mr-6">
																		<span className="mr-2 rounded bg-[#FF8A00] p-2 flex items-center justify-center text-lg leading-normal text-white dark:bg-gray-800">
																			<i className="fa-regular fa-square-check"></i>
																		</span>
																		<h5 className="font-bold text-sm">20 Nov 2023</h5>
																	</div>
																	<p className="text-white bg-yellow-500 text-[10px] rounded-full leading-[1.2] py-1 px-2">{srcLang==='ja' ? '中くらい' : 'Medium'}</p>
																</aside>
																<aside>
																	<label htmlFor="markDone" className="inline-flex items-center text-[10px] text-darkGray dark:text-gray-400">
																	{srcLang==='ja' ? '完了としてマークする' : 'Mark as Done'}
																		<input type="checkbox" id="markDone" className="ml-2" />
																	</label>
																	<button type="button" className="ml-6">
																		<i className="fa-solid fa-pencil"></i>
																	</button>
																	<button type="button" className="ml-6">
																		<i className="fa-solid fa-trash-can"></i>
																	</button>
																</aside>
															</div>
														</div>
														)}
													</div>
												</Tab.Panel>
												<Tab.Panel>
													<p className="text-sm text-darkGray text-center">{srcLang === 'ja' ? '未完了のタスクはありません' : 'Nothing In To Do List'}</p>	
													<div className="max-h-[60vh] overflow-auto">
														{Array(5).fill(
														<div className="rounded-normal border overflow-hidden my-2">
															<div className="px-8 py-4">
																<h5 className="font-bold mb-2">To do list title here</h5>
																<p className="text-sm text-darkGray dark:text-gray-400">Being able to rename and edit users lorem rename and edit users Being able to rename and edit users lorem rename and edit usersBeing able to rename and edit users lorem rename and edit users</p>
															</div>
															<div className="bg-lightBlue dark:bg-gray-700 px-8 py-2 flex flex-wrap items-center">
																<aside className="grow flex items-center">
																	<div className="flex items-center mr-6">
																		<span className="mr-2 rounded bg-[#FF8A00] p-2 flex items-center justify-center text-lg leading-normal text-white dark:bg-gray-800">
																			<i className="fa-regular fa-square-check"></i>
																		</span>
																		<h5 className="font-bold text-sm">20 Nov 2023</h5>
																	</div>
																	<p className="text-white bg-gray-500 text-[10px] rounded-full leading-[1.2] py-1 px-2">{srcLang==='ja' ? '低い' : 'Low'}</p>
																</aside>
																<aside>
																	<label htmlFor="markDone" className="inline-flex items-center text-[10px] text-darkGray dark:text-gray-400">
																	{srcLang==='ja' ? '完了としてマークする' : 'Mark as Done'}
																		<input type="checkbox" id="markDone" className="ml-2" />
																	</label>
																	<button type="button" className="ml-6">
																		<i className="fa-solid fa-pencil"></i>
																	</button>
																	<button type="button" className="ml-6">
																		<i className="fa-solid fa-trash-can"></i>
																	</button>
																</aside>
															</div>
														</div>
														)}
													</div>
												</Tab.Panel>
												<Tab.Panel>
													<p className="text-sm text-darkGray text-center">{srcLang === 'ja' ? '未完了のタスクはありません' : 'Nothing In To Do List'}</p>	
													<div className="max-h-[60vh] overflow-auto">
														{Array(5).fill(
														<div className="rounded-normal border overflow-hidden my-2">
															<div className="px-8 py-4">
																<h5 className="font-bold mb-2">To do list title here</h5>
																<p className="text-sm text-darkGray dark:text-gray-400">Being able to rename and edit users lorem rename and edit users Being able to rename and edit users lorem rename and edit usersBeing able to rename and edit users lorem rename and edit users</p>
															</div>
															<div className="bg-lightBlue dark:bg-gray-700 px-8 py-2 flex flex-wrap items-center">
																<aside className="grow">
																	<div className="flex items-center mr-6">
																		<span className="mr-2 rounded bg-[#FF8A00] p-2 flex items-center justify-center text-lg leading-normal text-white dark:bg-gray-800">
																			<i className="fa-regular fa-square-check"></i>
																		</span>
																		<h5 className="font-bold text-sm">20 Nov 2023</h5>
																	</div>
																</aside>
																<div className="flex items-center">
																	<p className="text-white bg-green-500 text-[10px] rounded-full leading-[1.2] py-1 px-2">{srcLang==='ja' ? '完了しました' : 'Completed'}</p>
																	<span className="text-[10px] text-darkGray dark:text-gray-400 ml-2">on 26 Jan 2024</span>
																</div>
															</div>
														</div>
														)}
													</div>
												</Tab.Panel>
											</Tab.Panels>
										</Tab.Group>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={toDoAddTaskPopup} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setToDoAddTaskPopup}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#fff] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">{srcLang==='ja' ? 'タスクの追加' : 'Add Task'}</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setToDoAddTaskPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<FormField fieldType="input" inputType="text" label={srcLang==='ja' ? 'タイトル' : 'Title'} />
										<FormField fieldType="reactquill" label={srcLang==='ja' ? '案内文' : 'Description'} />
										<FormField
											fieldType="select"
											label={srcLang==='ja' ? 'タスクの優先順位' : 'Task Priority'}
											options={[{ name: srcLang==='ja' ? '高い' : 'High' }, { name: srcLang==='ja' ? '中くらい' : 'Medium' }, { name: srcLang==='ja' ? '低い' : 'Low' }]}
										/>
										<FormField fieldType="input" inputType="date" label={srcLang==='ja' ? '締め切り' : 'Deadline'} />
										<Button label={srcLang==='ja' ? '追加' : 'Add'} />
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
