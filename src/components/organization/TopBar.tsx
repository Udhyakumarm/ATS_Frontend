//@collapse
import ThemeChange from "../ThemeChange";
import { signOut, useSession } from "next-auth/react";
import { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition, Listbox, Tab } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import userImg from "/public/images/user-image.png";
import OrganizationCalendar from "./OrganizationCalendar";
import OrganizationCalendar2 from "./OrganizationCalendar2";
import { axiosInstance } from "@/utils";
import { useRouter } from "next/router";
import googleIcon from "/public/images/social/google-icon.png";
import { useCalStore, useLangStore, useNotificationStore, useUserStore, useVersionStore } from "@/utils/code";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import UpcomingComp from "./upcomingComp";
import Button from "../Button";
import FormField from "../FormField";
import ToggleLang from "../ToggleLang";
import toastcomp from "../toast";
import moment from "moment";
import gcalIcon from "/public/images/social/google-cal-icon2.png";
import novusIcon from "/public/images/novus1.png";
import novusIcon12 from "/public/images/novus12.png";

import LogoImg from "/public/images/noAuth/headerLogo.png";
import { useNewNovusStore } from "@/utils/novus";
import PermiumComp from "./premiumComp";
import toastcomp2 from "../toast2";

const CalendarIntegrationOptions = [
	{ provider: "Google Calendar", icon: gcalIcon, link: "/api/integrations/gcal/create" }
];

const preVersions = [{ name: "free" }, { name: "starter" }, { name: "standard" }, { name: "enterprise" }];

export default function OrgTopBar({ todoLoadMore, settodoLoadMore, loadTodo }: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const cancelButtonRef = useRef(null);
	const router = useRouter();
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const { data: session } = useSession();

	const settype = useUserStore((state: { settype: any }) => state.settype);
	const setrole = useUserStore((state: { setrole: any }) => state.setrole);
	const setuser = useUserStore((state: { setuser: any }) => state.setuser);

	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);

	const type = useUserStore((state: { type: any }) => state.type);
	const role = useUserStore((state: { role: any }) => state.role);
	const user = useUserStore((state: { user: any }) => state.user);
	const version = useVersionStore((state: { version: any }) => state.version);
	const setversion = useVersionStore((state: { setversion: any }) => state.setversion);
	const [selectedPreVersion, setPreVersion] = useState({ name: version });

	const [toDoPopup, setToDoPopup] = useState(false);
	const [isExpired, setisExpired] = useState(false);
	const [toDoAddTaskPopup, setToDoAddTaskPopup] = useState(false);

	useEffect(() => {
		if (user && user.length > 0) {
			if (user[0]["is_expired"]) {
				setisExpired(true);
			}
		}
	}, [user]);

	useEffect(() => {
		if (!toDoPopup && todoLoadMore) {
			settodoLoadMore(false);
		}
	}, [toDoPopup]);
	// useEffect(() => {
	// 	async function loadIntegrations() {
	// 		if (!session) return;

	// 		const { validatedIntegrations: newIntegrations } = await axiosInstance.next_api
	// 			.get("/api/integrations/calendar")
	// 			.then((response) => response.data)
	// 			.catch((err) => {
	// 				// console.log(err);
	// 				return { data: { success: false } };
	// 			});

	// 		setIntegration(newIntegrations);
	// 	}

	// 	loadIntegrations();
	// }, [router, session]);

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
			loadTodo2();
			if (load) toggleLoadMode(false);
		}
	}, [token, role, load]);

	useEffect(() => {
		if (selectedPreVersion && selectedPreVersion.name) {
			setversion(selectedPreVersion.name);
		}
	}, [selectedPreVersion]);

	const tabHeading = [
		{
			title: srcLang === "ja" ? "高い" : "High"
		},
		{
			title: srcLang === "ja" ? "中くらい" : "Medium"
		},
		{
			title: srcLang === "ja" ? "低い" : "Low"
		},
		{
			title: srcLang === "ja" ? "完了しました" : "Completed"
		}
	];

	//toodo
	const [editTodo, seteditTodo] = useState(false);
	const [editTodoID, seteditTodoID] = useState();
	const [title, settitle] = useState("");
	const [desc, setdesc] = useState("");
	const [priority, setpriority] = useState("");
	const [deadline, setdeadline] = useState("");

	const [todos, settodos] = useState([]);
	const [htodos, sethtodos] = useState([]);
	const [mtodos, setmtodos] = useState([]);
	const [ltodos, setltodos] = useState([]);
	const [ctodos, setctodos] = useState([]);

	function checkAddDis() {
		return title.length > 0 && desc.length > 0 && priority.length > 0 && deadline.length > 0;
	}

	async function addTodo() {
		const fd = new FormData();
		fd.append("title", title);
		fd.append("desc", desc);
		fd.append("priority", priority);
		fd.append("deadline", moment(deadline).format().toString());
		await axiosInstanceAuth2
			.post(`/chatbot/todo/create/`, fd)
			.then(async (res) => {
				loadTodo2();
				setToDoAddTaskPopup(false);
				loadTodo();
				toastcomp("Todo Created", "success");
			})
			.catch((err) => {
				console.log("!", err);
				loadTodo();
				toastcomp("Todo Not Created", "error");
			});
	}

	function markAsDone(e: any, pk: any, title: any) {
		if (e.target.checked) {
			const fd2 = new FormData();
			fd2.append("title", title);
			fd2.append("compelete", e.target.checked);
			updateTodo(fd2, pk);
		}
	}

	function updateFunDone() {
		const fd = new FormData();
		fd.append("title", title);
		fd.append("desc", desc);
		fd.append("priority", priority);
		fd.append("deadline", moment(deadline).format().toString());
		updateTodo(fd, editTodoID);
	}

	function editTodoFun(data: any) {
		seteditTodo(true);
		seteditTodoID(data["id"]);
		settitle(data["title"]);
		setdesc(data["desc"]);
		setpriority(data["priority"]);
		setdeadline(moment(data["deadline"]).format("YYYY-MM-DD").toString());
		setToDoAddTaskPopup(true);
		loadTodo();
	}

	useEffect(() => {
		if (!toDoAddTaskPopup) {
			settitle("");
			setdesc("");
			setpriority("");
			setdeadline("");
		}
	}, [toDoAddTaskPopup]);

	async function updateTodo(fd: any, pk: any) {
		await axiosInstanceAuth2
			.put(`/chatbot/todo/${pk}/update/`, fd)
			.then(async (res) => {
				loadTodo2();
				setToDoAddTaskPopup(false);
				toastcomp("Todo Updated", "success");
				loadTodo();
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("Todo Not Updted", "error");
				loadTodo();
			});
	}

	async function deleteTodo(pk: any) {
		await axiosInstanceAuth2
			.delete(`/chatbot/todo/${pk}/delete/`)
			.then(async (res) => {
				loadTodo2();
				setToDoAddTaskPopup(false);
				toastcomp("Todo Deleted", "success");
				loadTodo();
			})
			.catch((err) => {
				console.log("!", err);
				toastcomp("Todo Not Deleted", "error");
			});
	}

	async function loadTodo2() {
		await axiosInstanceAuth2
			.get(`/chatbot/list-todo/`)
			.then(async (res) => {
				console.log("!", "TODO", res.data);
				settodos(res.data);
				var data = res.data;
				let arr = [],
					arr2 = [],
					arr3 = [],
					arr4 = [];
				for (let i = 0; i < data.length; i++) {
					if (data[i]["compelete"]) {
						arr.push(data[i]);
					} else {
						if (data[i]["priority"] === "Low") {
							arr2.push(data[i]);
						} else if (data[i]["priority"] === "Medium") {
							arr3.push(data[i]);
						} else if (data[i]["priority"] === "High") {
							arr4.push(data[i]);
						}
					}
				}
				setctodos(arr);
				setltodos(arr2);
				setmtodos(arr3);
				sethtodos(arr4);
			})
			.catch((err) => {
				console.log("!", err);
			});
	}

	useEffect(() => {
		if (todoLoadMore) {
			setToDoPopup(true);
		}
	}, [todoLoadMore]);

	const [gcall, setgcall] = useState(false);

	async function checkGCAL() {
		setgcall(false);
		await axiosInstanceAuth2
			.post("gcal/connect-google/")
			.then((res) => {
				if (res.data.res === "success") {
					setgcall(true);
				}
				setIsCalendarOpen(true);
			})
			.catch(() => {
				setIsCalendarOpen(true);
			});
	}

	async function coonectGoogleCal() {
		setgcall(false);
		await axiosInstanceAuth2.post("gcal/connect-google/").then((res) => {
			if (res.data.authorization_url) {
				router.replace(`${res.data.authorization_url}`);
			} else if (res.data.res === "success") {
				// router.replace(`http://localhost:3000/organization/dashboard?gcal=success`);
				// setIsCalendarOpen(true);
				setgcall(true);
			}
		});
		// .catch((res) => {
		// 	if (res.data.authorization_url) {
		// 		router.replace(`${res.data.authorization_url}`);
		// 	} else if (res.data.res === "success") {
		// 		router.replace(`http://localhost:3000/organization/dashboard?gcal=success`);
		// 	}
		// });
	}

	const { gcal } = router.query;
	const { res } = router.query;

	useEffect(() => {
		if (gcal && gcal === "success") {
			toastcomp("google calendar integreated", "success");
			checkGCAL();
		} else if (gcal && gcal === "error") {
			toastcomp("google calendar not integreated", "error");
			if (res) {
				if (res === "1") {
					toastcomp("Reason : One GoogleCalander Object Found, Try Again after some time.", "error");
				}
				if (res === "2") {
					toastcomp("Reason : Email not found in Org Data of ATS, Try Again after some time.", "error");
				}
				if (res === "3") {
					toastcomp("Reason : Use current user email, Try Again after some time.", "error");
				}
				if (res === "4") {
					toastcomp("Reason : Refresh token error, Try Again after some time.", "error");
				}
			}
			setIsCalendarOpen(false);
		}
	}, [gcal, res]);

	const [err, seterr] = useState(false);
	const [errMsg, seterrMsg] = useState("");

	//realtime notification
	const [realNotification, setrealNotification] = useState([]);

	async function fetchCount() {
		await axiosInstanceAuth2
			.get(`/chatbot/real-notification/`)
			.then(async (res) => {
				console.log("!!!", "Real Notification", res.data);
				const data = res.data.slice(0, 5);
				for (let i = 0; i < data.length; i++) {
					toastcomp2(data[i]["title"], "success");
				}

				setrealNotification(res.data);
			})
			.catch((err) => {
				setrealNotification([]);
				console.log("!!!", "Real Notification", err);
			});
	}

	// useEffect(() => {
	// 	if (token && token.length > 0 && !isExpired) {
	// 		// Call the async function immediately when the component mounts

	// 		console.log("!!!", "timeout1");
	// 		fetchCount();

	// 		// Set up an interval to call the async function every 5 seconds
	// 		const intervalId = setInterval(() => {
	// 			console.log("!!!", "timeout2");
	// 			fetchCount();
	// 		}, 10000); // 5000 milliseconds = 5 seconds

	// 		// Clean up the interval when the component unmounts to avoid memory leaks
	// 		return () => {
	// 			clearInterval(intervalId);
	// 		};
	// 	}
	// }, [token]);

	return (
		<>
			<div
				id="topbar"
				className="fixed left-0 top-0 z-[12] flex h-[65px] w-full items-center justify-end bg-white px-6 py-3 shadow transition dark:bg-gray-800 lg:left-[270px] lg:w-[calc(100%-270px)]"
			>
				{/* {role === "Super Admin" && (
					<div className="mr-6 ms-3">
						<Listbox value={selectedPreVersion} onChange={setPreVersion}>
							<div className="relative">
								<Listbox.Button className="flex items-center justify-center rounded-l bg-secondary px-2 py-2 text-white">
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
				)} */}

				<p className="mr-6 rounded-lg bg-primary/75 px-2 py-1 text-center text-xs font-bold uppercase text-white">
					{version}
				</p>

				<p className="mr-6 rounded-lg bg-primary/75 px-2 py-1 text-center text-xs font-bold uppercase text-white">
					{role}
				</p>
				<ThemeChange />
				<button
					type="button"
					className={`mr-6 text-darkGray dark:text-gray-400 ${isExpired && "relative"}`}
					// disabled={isExpired}
					onClick={() => {
						if (isExpired) {
							toastcomp("Plan Expired", "error");
							router.push("/organization/settings/pricing");
						} else {
							setToDoPopup(true);
						}
					}}
				>
					<i className="fa-regular fa-clipboard text-[20px]"></i>
					{isExpired && (
						<div className="group absolute left-0 top-0 flex h-full w-full items-center justify-center bg-red-400/[0.05] backdrop-blur-[0.5px]"></div>
					)}
				</button>
				<button
					type="button"
					className={`mr-6 text-darkGray dark:text-gray-400 ${isExpired && "relative"}`}
					onClick={() => {
						if (isExpired) {
							toastcomp("Plan Expired", "error");
							router.push("/organization/settings/pricing");
						} else if (version === "standard" || version === "starter") {
							seterr(true);
							seterrMsg("Calendar Automation");
						} else {
							checkGCAL();
						}
					}}
				>
					<i className="fa-regular fa-calendar-days text-[20px]"></i>
					{isExpired && (
						<div className="group absolute left-0 top-0 flex h-full w-full items-center justify-center bg-red-400/[0.05] backdrop-blur-[0.5px]"></div>
					)}
				</button>
				<div
					className="relative mr-6 cursor-pointer uppercase text-darkGray dark:text-gray-400"
					onClick={() => {
						if (isExpired) {
							toastcomp("Plan Expired", "error");
							router.push("/organization/settings/pricing");
						} else {
							notification();
						}
					}}
				>
					<i className="fa-regular fa-bell text-[20px]"></i>
					<span className="absolute right-[-10px] top-[-7px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
						{count}
					</span>
					{isExpired && (
						<div className="group absolute left-0 top-0 flex h-full w-full items-center justify-center bg-red-400/[0.05] backdrop-blur-[0.5px]"></div>
					)}
				</div>
				<ToggleLang />
				{role != "Hiring Manager" && (
					<button
						type="button"
						className={`ml-4 text-darkGray dark:text-gray-400 ${isExpired && "relative"}`}
						onClick={() => {
							if (isExpired) {
								toastcomp("Plan Expired", "error");
								router.push("/organization/settings/pricing");
							} else if (version === "standard" || version === "starter") {
								seterr(true);
								seterrMsg("Novus AI");
							} else {
								tvisible();
							}
						}}
					>
						<Image src={novusIcon12} alt={"Novus1"} width={30} className="max-h-[30px]" />
						{isExpired && (
							<div className="group absolute left-0 top-0 flex h-full w-full items-center justify-center bg-red-400/[0.05] backdrop-blur-[0.5px]"></div>
						)}
					</button>
				)}
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
								{gcall ? (
									<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-5xl">
										<OrganizationCalendar2
											axiosInstanceAuth2={axiosInstanceAuth2}
											setIsCalendarOpen={setIsCalendarOpen}
										/>
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
													<div key={i} className="my-2 w-full cursor-pointer overflow-hidden rounded-normal border">
														<div
															onClick={coonectGoogleCal}
															className="flex w-full items-center justify-between p-4 hover:bg-lightBlue hover:dark:bg-gray-900"
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
														</div>
													</div>
												))}
											</div>
										</div>
									</Dialog.Panel>
								)}
								{/* {integration && integration.length > 0 ? (
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
								)} */}
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#fff] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-4xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "ToDoリスト" : "To Do List"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setToDoPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="mb-6 text-right">
											<Button
												btnType="button"
												btnStyle="iconRightBtn"
												label={srcLang === "ja" ? "追加" : "Add Task"}
												iconRight={<i className="fa-solid fa-circle-plus"></i>}
												handleClick={() => {
													seteditTodo(false);
													setToDoAddTaskPopup(true);
												}}
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
													{htodos && htodos.length > 0 ? (
														<div className="max-h-[60vh] overflow-auto">
															{htodos.map((data, i) => (
																<div className="my-2 overflow-hidden rounded-normal border" key={i}>
																	<div className="px-8 py-4">
																		<h5 className="mb-2 font-bold">{data["title"]}</h5>
																		<p
																			className="text-sm text-darkGray dark:text-gray-400"
																			dangerouslySetInnerHTML={{ __html: data["desc"] }}
																		></p>
																	</div>
																	<div className="flex flex-wrap items-center bg-lightBlue px-8 py-2 dark:bg-gray-700">
																		<aside className="flex grow items-center">
																			<div className="mr-6 flex items-center">
																				<span className="mr-2 flex items-center justify-center rounded bg-[#000] p-2 text-lg leading-normal text-white dark:bg-gray-800">
																					<i className="fa-regular fa-square-check"></i>
																				</span>
																				<h5 className="text-sm font-bold">
																					{moment(data["deadline"]).format("DD MMM YYYY")}
																				</h5>
																			</div>
																			<p className="rounded-full bg-red-500 px-2 py-1 text-[10px] leading-[1.2] text-white">
																				{srcLang === "ja" ? "高い" : "High"}
																			</p>
																		</aside>
																		<aside>
																			<label
																				htmlFor="markDone"
																				className="inline-flex items-center text-[10px] text-darkGray dark:text-gray-400"
																			>
																				{srcLang === "ja" ? "完了としてマークする" : "Mark as Done"}
																				<input
																					type="checkbox"
																					className="ml-2"
																					onChange={(e) => markAsDone(e, data["id"], data["title"])}
																				/>
																			</label>
																			<button type="button" className="ml-6" onClick={() => editTodoFun(data)}>
																				<i className="fa-solid fa-pencil"></i>
																			</button>
																			<button type="button" className="ml-6" onClick={() => deleteTodo(data["id"])}>
																				<i className="fa-solid fa-trash-can"></i>
																			</button>
																		</aside>
																	</div>
																</div>
															))}
														</div>
													) : (
														<p className="text-center text-sm text-darkGray">
															{srcLang === "ja" ? "未完了のタスクはありません" : "Nothing In To Do List"}
														</p>
													)}
												</Tab.Panel>
												<Tab.Panel>
													{mtodos && mtodos.length > 0 ? (
														<div className="max-h-[60vh] overflow-auto">
															{mtodos.map((data, i) => (
																<div className="my-2 overflow-hidden rounded-normal border" key={i}>
																	<div className="px-8 py-4">
																		<h5 className="mb-2 font-bold">{data["title"]}</h5>
																		<p
																			className="text-sm text-darkGray dark:text-gray-400"
																			dangerouslySetInnerHTML={{ __html: data["desc"] }}
																		></p>
																	</div>
																	<div className="flex flex-wrap items-center bg-lightBlue px-8 py-2 dark:bg-gray-700">
																		<aside className="flex grow items-center">
																			<div className="mr-6 flex items-center">
																				<span className="mr-2 flex items-center justify-center rounded bg-[#000] p-2 text-lg leading-normal text-white dark:bg-gray-800">
																					<i className="fa-regular fa-square-check"></i>
																				</span>
																				<h5 className="text-sm font-bold">
																					{moment(data["deadline"]).format("DD MMM YYYY")}
																				</h5>
																			</div>
																			<p className="rounded-full bg-yellow-500 px-2 py-1 text-[10px] leading-[1.2] text-white">
																				{srcLang === "ja" ? "中くらい" : "Medium"}
																			</p>
																		</aside>
																		<aside>
																			<label
																				htmlFor="markDone"
																				className="inline-flex items-center text-[10px] text-darkGray dark:text-gray-400"
																			>
																				{srcLang === "ja" ? "完了としてマークする" : "Mark as Done"}
																				<input
																					type="checkbox"
																					className="ml-2"
																					onChange={(e) => markAsDone(e, data["id"], data["title"])}
																				/>
																			</label>
																			<button type="button" className="ml-6" onClick={() => editTodoFun(data)}>
																				<i className="fa-solid fa-pencil"></i>
																			</button>
																			<button type="button" className="ml-6" onClick={() => deleteTodo(data["id"])}>
																				<i className="fa-solid fa-trash-can"></i>
																			</button>
																		</aside>
																	</div>
																</div>
															))}
														</div>
													) : (
														<p className="text-center text-sm text-darkGray">
															{srcLang === "ja" ? "未完了のタスクはありません" : "Nothing In To Do List"}
														</p>
													)}
												</Tab.Panel>
												<Tab.Panel>
													{ltodos && ltodos.length > 0 ? (
														<div className="max-h-[60vh] overflow-auto">
															{ltodos.map((data, i) => (
																<div className="my-2 overflow-hidden rounded-normal border" key={i}>
																	<div className="px-8 py-4">
																		<h5 className="mb-2 font-bold">{data["title"]}</h5>
																		<p
																			className="text-sm text-darkGray dark:text-gray-400"
																			dangerouslySetInnerHTML={{ __html: data["desc"] }}
																		></p>
																	</div>
																	<div className="flex flex-wrap items-center bg-lightBlue px-8 py-2 dark:bg-gray-700">
																		<aside className="flex grow items-center">
																			<div className="mr-6 flex items-center">
																				<span className="mr-2 flex items-center justify-center rounded bg-[#000] p-2 text-lg leading-normal text-white dark:bg-gray-800">
																					<i className="fa-regular fa-square-check"></i>
																				</span>
																				<h5 className="text-sm font-bold">
																					{moment(data["deadline"]).format("DD MMM YYYY")}
																				</h5>
																			</div>
																			<p className="rounded-full bg-gray-500 px-2 py-1 text-[10px] leading-[1.2] text-white">
																				{srcLang === "ja" ? "低い" : "Low"}
																			</p>
																		</aside>
																		<aside>
																			<label
																				htmlFor="markDone"
																				className="inline-flex items-center text-[10px] text-darkGray dark:text-gray-400"
																			>
																				{srcLang === "ja" ? "完了としてマークする" : "Mark as Done"}
																				<input
																					type="checkbox"
																					className="ml-2"
																					onChange={(e) => markAsDone(e, data["id"], data["title"])}
																				/>
																			</label>
																			<button type="button" className="ml-6" onClick={() => editTodoFun(data)}>
																				<i className="fa-solid fa-pencil"></i>
																			</button>
																			<button type="button" className="ml-6" onClick={() => deleteTodo(data["id"])}>
																				<i className="fa-solid fa-trash-can"></i>
																			</button>
																		</aside>
																	</div>
																</div>
															))}
														</div>
													) : (
														<p className="text-center text-sm text-darkGray">
															{srcLang === "ja" ? "未完了のタスクはありません" : "Nothing In To Do List"}
														</p>
													)}
												</Tab.Panel>
												<Tab.Panel>
													{ctodos && ctodos.length > 0 ? (
														<div className="max-h-[60vh] overflow-auto">
															{ctodos.map((data, i) => (
																<div className="my-2 overflow-hidden rounded-normal border" key={i}>
																	<div className="px-8 py-4">
																		<h5 className="mb-2 font-bold">{data["title"]}</h5>
																		<p
																			className="text-sm text-darkGray dark:text-gray-400"
																			dangerouslySetInnerHTML={{ __html: data["desc"] }}
																		></p>
																	</div>
																	<div className="flex flex-wrap items-center bg-lightBlue px-8 py-2 dark:bg-gray-700">
																		<aside className="grow">
																			<div className="mr-6 flex items-center">
																				<span className="mr-2 flex items-center justify-center rounded bg-[#000] p-2 text-lg leading-normal text-white dark:bg-gray-800">
																					<i className="fa-regular fa-square-check"></i>
																				</span>
																				<h5 className="text-sm font-bold">
																					{moment(data["deadline"]).format("DD MMM YYYY")}
																				</h5>
																			</div>
																		</aside>
																		<div className="flex items-center">
																			<p className="rounded-full bg-green-500 px-2 py-1 text-[10px] leading-[1.2] text-white">
																				{srcLang === "ja" ? "完了しました" : "Completed"}
																			</p>
																			<span className="ml-2 text-[10px] text-darkGray dark:text-gray-400">
																				on {moment(data["timestamp"]).format("DD MMM YYYY")}
																			</span>
																		</div>
																	</div>
																</div>
															))}
														</div>
													) : (
														<p className="text-center text-sm text-darkGray">
															{srcLang === "ja" ? "未完了のタスクはありません" : "Nothing In To Do List"}
														</p>
													)}
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#fff] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{/* {srcLang === "ja" ? "タスクの追加" : "Add Task"} */}
											{editTodo ? "Update Task" : "Add Task"}
										</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setToDoAddTaskPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<FormField
											fieldType="input"
											inputType="text"
											label={srcLang === "ja" ? "タイトル" : "Title"}
											value={title}
											handleChange={(e) => settitle(e.target.value)}
										/>
										<FormField
											fieldType="reactquill"
											label={srcLang === "ja" ? "案内文" : "Description"}
											value={desc}
											handleChange={setdesc}
											handleOnBlur={setdesc}
										/>
										<FormField
											fieldType="select2"
											id="priority"
											label={srcLang === "ja" ? "タスクの優先順位" : "Task Priority"}
											// options={[
											// 	srcLang === "ja" ? "高い" : "High",
											// 	srcLang === "ja" ? "中くらい" : "Medium",
											// 	srcLang === "ja" ? "低い" : "Low"
											// ]}
											options={["High", "Medium", "Low"]}
											value={priority}
											handleChange={setpriority}
											singleSelect
										/>
										<FormField
											fieldType="input"
											inputType="date"
											label={srcLang === "ja" ? "締め切り" : "Deadline"}
											value={deadline}
											handleChange={(e) => setdeadline(e.target.value)}
										/>
										<Button
											// label={srcLang === "ja" ? "追加" : "Add"}
											label={editTodo ? "Update" : "Add"}
											disabled={!checkAddDis()}
											btnType="button"
											handleClick={() => {
												editTodo ? updateFunDone() : addTodo();
											}}
										/>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={err} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={seterr}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#fff] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">
											{srcLang === "ja" ? "プランをアップグレードする" : "Upgrade Your Plan"}
										</h4>
										<button type="button" className="leading-none hover:text-gray-700" onClick={() => seterr(false)}>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										{err && errMsg.length > 0 && <PermiumComp userRole={role} title={errMsg} setUpgradePlan={seterr} />}
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
