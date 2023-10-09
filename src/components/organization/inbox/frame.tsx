import React, { useEffect, useState, Fragment, useRef } from "react";
import { Dialog, Menu, Tab, Transition } from "@headlessui/react";
import Image from "next/image";
import FormField from "@/components/FormField";
import userImg1 from "/public/images/user-image1.jpeg";
import Button from "@/components/Button";
import AutoTextarea from "@/components/organization/AutoTextarea";
import startNewChat from "/public/images/no-data/iconGroup-4.png";
import InboxChatMsg from "./chatMsg";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import toastcomp from "@/components/toast";
import moment from "moment";
import Link from "next/link";

export default function InboxFrame({
	togglePages,
	setTogglePages,
	axiosInstanceAuth2,
	cardActive,
	cardActiveData,
	setcardActive,
	setcardActiveData,
	text,
	settext,
	setclick,
	socket,
	isTypingFun,
	isStopTypingFun,
	sendOutgoingFileMessage,
	sendOutgoingTextMessage,
	sendOutgoingMediaMessage,
	markASRead,
	sendOutgoingContactMessage,

	loadS,
	setloadS,
	loadSidebar
}: any) {
	const cancelButtonRef = useRef(null);
	const [showContact, setShowContact] = useState(false);
	const [showContactData, setShowContactData] = useState([]);

	const [isPickerOpen, setIsPickerOpen] = useState(false);

	const handleEmojiClick = (emoji) => {
		settext(text + emoji.native);
		setIsPickerOpen(false);
	};

	async function loadCData() {
		await axiosInstanceAuth2
			.get(`/inbox/cc/`)
			.then(async (res) => {
				console.log("^^^", "CDATA", res.data);

				setShowContactData(res.data);
			})
			.catch((err) => {
				setShowContactData([]);
			});
	}

	useEffect(() => {
		if (showContact) {
			loadCData();
		}
	}, [showContact]);

	const [toggle, setoggle] = useState(true);
	const [toggle2, setoggle2] = useState(true);
	const [reply, setreply] = useState(false);
	const [replyC, setreplyC] = useState({});
	const [media, setmedia] = useState(null);
	const [file, setfile] = useState(null);
	const [isTyping, setisTyping] = useState(null);
	// const [text, settext] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const [loadSD, setloadSD] = useState(false);
	const handleEmojiSelect = (emoji: any) => {
		// onEmojiSelect(emoji.native);
		setShowPicker(false);
	};

	const [msg, setmsg] = useState([]);
	async function loadFrame(id: any) {
		await axiosInstanceAuth2
			.get(`/inbox/messages/${id}/`)
			.then(async (res) => {
				console.log("&&&", "msg", res.data);
				setmsg(res.data.reverse());
			})
			.catch((err) => {
				console.log(err);
				setmsg([]);
			});
	}

	const [dataFile, setdataFile] = useState([]);
	const [dataMwdia, setdataMwdia] = useState([]);
	async function loadMedia(id: any) {
		await axiosInstanceAuth2
			.get(`/inbox/get_media/${id}/`)
			.then(async (res) => {
				// toastcomp("media load", "success");
				if (res.data.length > 0) {
					var flatArray = [].concat(...res.data);
					console.log("media", flatArray);
					setdataMwdia(flatArray);
				} else {
					setdataMwdia([]);
				}
			})
			.catch((err) => {
				console.log(err);
				setdataMwdia([]);
			});
	}
	async function loadFile(id: any) {
		await axiosInstanceAuth2
			.get(`/inbox/get_file/${id}/`)
			.then(async (res) => {
				if (res.data.length > 0) {
					var flatArray = [].concat(...res.data);
					console.log("document", flatArray);
					setdataFile(flatArray);
				} else {
					setdataFile([]);
				}
				// toastcomp("file load", "success");
			})
			.catch((err) => {
				console.log(err);
				setdataFile([]);
			});
	}

	useEffect(() => {
		if (!toggle) {
			loadMedia(cardActiveData["other_user_id"]);
			loadFile(cardActiveData["other_user_id"]);
		}
	}, [toggle]);

	async function msgRead2(id: any) {
		await axiosInstanceAuth2
			.post(`/inbox/dialogs_reads/${id}/`)
			.then(async (res) => {
				// toastcomp("API CALL", "success");
				// setloadSD(true);
			})
			.catch((err) => {
				setloadSD(false);
				// setloadS(true);
			});
	}

	async function delMsg(id: any) {
		await axiosInstanceAuth2
			.post(`/inbox/messages_remove/${id}/`)
			.then(async (res) => {
				// toastcomp("success del", "success");
				loadSidebar();
				loadFrame(cardActiveData["other_user_id"]);
			})
			.catch((err) => {
				loadFrame(cardActiveData["other_user_id"]);
			});
	}

	async function recallMsg(id: any) {
		await axiosInstanceAuth2
			.post(`/inbox/recall/${id}/`)
			.then(async (res) => {
				toastcomp("success recall", "success");
				loadSidebar();
				loadFrame(cardActiveData["other_user_id"]);
			})
			.catch((err) => {
				loadFrame(cardActiveData["other_user_id"]);
			});
	}

	const [editText, seteditText] = useState("");
	const [editId, seteditId] = useState("");

	function editMsg(id: any, text: any) {
		// toastcomp("edit process start", "success");
		seteditId(id);
		seteditText(text);
		settext(text);
	}
	async function editMsg2() {
		// toastcomp("edit process 2 start", "success");
		const fd = new FormData();
		fd.append("text", text);
		await axiosInstanceAuth2
			.post(`/inbox/messages_update/${editId}/`, fd)
			.then(async (res) => {
				// toastcomp("success update", "success");
				loadSidebar();
				loadFrame(cardActiveData["other_user_id"]);
				settext("");
				seteditId("");
				seteditText("");
			})
			.catch((err) => {
				loadFrame(cardActiveData["other_user_id"]);
			});
	}

	// useEffect(() => {
	// 	if (loadSD) {
	// 		setloadS(true);
	// 		// setloadSD(false);
	// 	}
	// }, [loadSD]);

	socket.onmessage = function (e) {
		loadSidebar();
		var fdata = JSON.parse(e.data);
		// console.log("^^^", "eee data", data);
		if (cardActive) {
			if (fdata["msg_type"] === 3 || fdata["msg_type"] === 4 || fdata["msg_type"] === 11 || fdata["msg_type"] === 13) {
				loadFrame(cardActiveData["other_user_id"]);
			}
		}
	};

	useEffect(() => {
		if (msg && msg.length > 0) {
			var unreadItems1 = msg.filter((item) => item.read === false);
			const unreadItems = unreadItems1.filter((item) => item.out === false);
			for (let i = 0; i < unreadItems.length; i++) {
				console.log("^^^", "MAR", i);
				markASRead(socket, unreadItems[i]["sender"], unreadItems[i]["id"]);
			}
		}
	}, [msg]);

	useEffect(() => {
		if (axiosInstanceAuth2 && cardActive) {
			loadFrame(cardActiveData["other_user_id"]);
			// msgRead2(cardActiveData["other_user_id"]);
		}
	}, [axiosInstanceAuth2, cardActive, cardActiveData]);

	useEffect(() => {
		if (isTyping != null) {
			if (isTyping === true) {
				isTypingFun(socket, cardActiveData["other_user_id"]);
			} else {
				isStopTypingFun(socket, cardActiveData["other_user_id"]);
			}
		}
	}, [isTyping]);

	const fileInputRef = useRef(null);
	const mediaInputRef = useRef(null);
	const handleDocumentButtonClick = () => {
		// Trigger the file input's click event
		fileInputRef.current.click();
	};
	const handleMediauttonClick = () => {
		// Trigger the file input's click event
		mediaInputRef.current.click();
	};
	function uploadFile(e) {
		if (e.target.files) {
			const file = e.target.files[0];
			setfile(file);
		} else {
			setfile(null);
		}
	}
	function uploadMedia(e) {
		if (e.target.files) {
			const file = e.target.files[0];
			setmedia(file);
		} else {
			setmedia(null);
		}
	}

	async function handleSendClick() {
		isStopTypingFun(socket, cardActiveData["other_user_id"]);
		if (file != null) {
			const fd = new FormData();
			fd.append("file", file);
			await axiosInstanceAuth2.post(`/inbox/upload/`, fd).then(async (res) => {
				var id = res.data["id"].toString();
				console.log("id", id);
				if (id != null && id.length > 0) {
					let user_pk = cardActiveData["other_user_id"].toString();
					if (reply) {
						sendOutgoingFileMessage(socket, id, text, user_pk, replyC["id"]);
					} else {
						sendOutgoingFileMessage(socket, id, text, user_pk, "-1");
					}
					setreply(false);
					setreplyC({});
					setfile(null);
					setmedia(null);
					settext("");
					loadFrame(cardActiveData["other_user_id"]);
				}
			});
		} else if (media != null) {
			const fd = new FormData();
			fd.append("file", media);
			await axiosInstanceAuth2.post(`/inbox/upload2/`, fd).then(async (res) => {
				var id = res.data["id"].toString();
				console.log("id", id);
				if (id != null && id.length > 0) {
					let user_pk = cardActiveData["other_user_id"].toString();
					if (reply) {
						sendOutgoingMediaMessage(socket, id, text, user_pk, replyC["id"]);
					} else {
						sendOutgoingMediaMessage(socket, id, text, user_pk, "-1");
					}
					setreply(false);
					setreplyC({});
					setfile(null);
					setmedia(null);
					settext("");
					loadFrame(cardActiveData["other_user_id"]);
				}
			});
		} else {
			if (editText.length > 0 && editId.length > 0) {
				editMsg2();
			} else {
				let user_pk = cardActiveData["other_user_id"].toString();
				if (reply) {
					sendOutgoingTextMessage(socket, text, user_pk, replyC["id"]);
				} else {
					sendOutgoingTextMessage(socket, text, user_pk, "-1");
				}
				setreply(false);
				setreplyC({});
				setfile(null);
				setmedia(null);
				settext("");
				loadFrame(cardActiveData["other_user_id"]);
			}
		}
	}

	async function handleContactCardMsg(email: any) {
		setShowContact(false);
		const fd = new FormData();
		fd.append("email", email);
		await axiosInstanceAuth2
			.post(`/inbox/pro/`, fd)
			.then(async (res) => {
				console.log("^^^", "CDATA2", res.data);
				let user_pk = cardActiveData["other_user_id"].toString();
				if (reply) {
					sendOutgoingContactMessage(socket, res.data["id"], user_pk, replyC["id"]);
				} else {
					sendOutgoingContactMessage(socket, res.data["id"], user_pk, "-1");
				}
				setreply(false);
				setreplyC({});
			})
			.catch((err) => {
				console.log("^^^ error cdata2");
			});
	}

	const msgContainerRef = useRef(null);
	useEffect(() => {
		if (msgContainerRef && msg.length > 0) {
			msgContainerRef.current?.scrollTo({
				top: msgContainerRef.current.scrollHeight,
				behavior: "smooth"
			});
		}
	}, [msg]);

	return (
		<>
			<div className="relative h-full overflow-hidden rounded-normal border bg-white pb-[80px] shadow-normal dark:border-gray-600 dark:bg-gray-800">
				{togglePages ? (
					<>
						{/* <div className="h-[calc(100vh-212px)] overflow-y-auto">
						<div className="group">
							<div className="border-b px-4 py-6 group-last:border-b-0 dark:border-b-gray-600">
								<div className="mx-auto w-full max-w-[90%]">
									<div className="mb-4 flex items-center justify-between">
										<Image
											src={userImg1}
											alt="User"
											width={150}
											className="h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
										/>
										<p className="text-right text-[12px] text-darkGray dark:text-gray-400">
											10 Feb 2023
											<br />
											3:30 PM
										</p>
									</div>
									<article className="text-sm text-darkGray dark:text-gray-400">
										Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
										industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
										scrambled it to make a type specimen book. It has survived not only five centuries, but also the
										leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
										with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
										publishing software like Aldus PageMaker including versions of Lorem Ipsum.
									</article>
								</div>
							</div>
						</div>
						<div className="group">
							<div className="border-b px-4 py-6 group-last:border-b-0 dark:border-b-gray-600">
								<div className="mx-auto w-full max-w-[90%]">
									<div className="overflow-hidden rounded-large border dark:border-gray-500">
										<div className="bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-6 text-center text-white">
											<h3 className="mb-2 text-lg">Interview has been Scheduled</h3>
											<p>You can find the details below</p>
										</div>
										<div className="px-10 py-6">
											<h2 className="mb-4 text-lg font-bold">Hi Recruiter Name,</h2>
											<p className="mb-6 text-sm text-darkGray dark:text-gray-400">
												Your Interview has been scheduled for Software Developer Job at Organization Name
											</p>
											<div className="mb-2 flex flex-wrap">
												<div className="w-full md:max-w-[75%]">
													<ul>
														<li className="mb-6 flex items-start">
															<span className="w-30px mr-4 inline-block">
																<i className="fa-solid fa-user text-[14px]"></i>
															</span>
															<aside className="grow">
																<h5 className="font-bold">Interviewer</h5>
																<p className="text-sm text-darkGray dark:text-gray-400">Adam Smith</p>
															</aside>
														</li>
														<li className="mb-6 flex items-start">
															<span className="w-30px mr-4 inline-block">
																<i className="fa-solid fa-street-view text-[14px]"></i>
															</span>
															<aside className="grow">
																<h5 className="font-bold">Interview Name</h5>
																<p className="text-sm text-darkGray dark:text-gray-400">Software Developer</p>
															</aside>
														</li>
														<li className="mb-6 flex items-start">
															<span className="w-30px mr-4 inline-block">
																<i className="fa-solid fa-clock text-[14px]"></i>
															</span>
															<aside className="grow">
																<h5 className="font-bold">Event Duration</h5>
																<p className="text-sm text-darkGray dark:text-gray-400">30 min</p>
															</aside>
														</li>
													</ul>
												</div>
												<div className="w-full md:max-w-[25%]">
													<aside className="mb-6 flex items-center">
														<h5 className="mr-4 font-bold">Date:</h5>
														<p className="text-sm text-darkGray dark:text-gray-400">05 Dec 2022</p>
													</aside>
													<aside className="mb-4 flex items-center">
														<h5 className="mr-4 font-bold">Time:</h5>
														<p className="text-sm text-darkGray dark:text-gray-400">02:00 PM</p>
													</aside>
												</div>
											</div>
											<div className="flex flex-wrap">
												<div className="my-1 mr-4 last:mr-0">
													<Button btnStyle="success" label="Reschedule" />
												</div>
												<div className="my-1 mr-4 last:mr-0">
													<Button btnStyle="danger" label="Cancel" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div> */}
					</>
				) : (
					<>
						<div className="border-b dark:border-b-gray-600">
							<div className="mx-auto flex w-full max-w-[90%] items-center px-4 py-2">
								<Image
									src={
										process.env.NODE_ENV === "production"
											? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/media/${cardActiveData["profile"]}`
											: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/media/${cardActiveData["profile"]}`
									}
									alt="User"
									width={1500}
									height={1500}
									className="mr-4 h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
								/>
								<aside>
									<h4 className="jusitfy-between flex items-center text-lg font-bold">
										<span className="grow">
											{cardActiveData["username"]}
											<span className="pl-4 text-xs text-gray-700/75 dark:text-lightBlue/75">
												{cardActiveData["title"]}
											</span>
											<span className="pl-4 text-xs text-gray-700/75 dark:text-lightBlue/75">
												{cardActiveData["dept"]}
											</span>
										</span>
										{/* <Menu as="div" className="relative">
										<Menu.Button className="ml-2 w-6 text-darkGray dark:text-gray-400">
											<i className="fa-solid fa-ellipsis-vertical"></i>
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
													"absolute right-0 top-[100%] w-[200px] rounded bg-white py-2 text-darkGray shadow-normal dark:bg-gray-700 dark:text-gray-400"
												}
											>
												<Menu.Item>
													<button
														type="button"
														className="relative flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
														onClick={() => setCreateGroup(true)}
													>
														Edit Group
													</button>
												</Menu.Item>
												<Menu.Item>
													<button
														type="button"
														className="relative flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
														onClick={() => setExitGroup(true)}
													>
														Exit Group
													</button>
												</Menu.Item>
												<div className="border-t dark:border-t-gray-500">
													<p className="px-4 pb-1 pt-2 text-[10px] font-semibold">Created by Steven on 04 Feb 2021</p>
													<Menu.Item>
														<button
															type="button"
															className="relative flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm font-bold hover:bg-red-500 hover:text-white"
															onClick={() => setDeleteGroup(true)}
														>
															Delete Group
														</button>
													</Menu.Item>
												</div>
											</Menu.Items>
										</Transition>
									</Menu> */}
									</h4>
									<div className="flex items-center gap-4">
										<div
											className={
												"flex w-fit cursor-pointer gap-1 py-2 text-xs " +
												`${
													toggle
														? "border-b-2 border-primary text-primary dark:border-white dark:text-white"
														: "text-gray-700/75 dark:text-lightBlue/75"
												}`
											}
											onClick={() => setoggle(true)}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="13"
												height="16"
												viewBox="0 0 13 16"
												fill="none"
												className={`${
													toggle ? "fill-primary dark:fill-white" : "fill-gray-700/75 dark:fill-lightBlue/75"
												}`}
											>
												<path
													d="M9.74935 0.535156H3.24935C2.89369 0.535156 2.5415 0.604132 2.21291 0.738144C1.88432 0.872157 1.58576 1.06858 1.33427 1.3162C0.826357 1.8163 0.541016 2.49458 0.541016 3.20182V7.46849C0.540888 8.08324 0.756482 8.67915 1.15131 9.15537C1.54613 9.63159 2.09594 9.95887 2.70768 10.0818V11.2018C2.70724 11.4127 2.77029 11.619 2.88888 11.7946C3.00746 11.9702 3.17626 12.1073 3.37393 12.1885C3.50651 12.2411 3.64808 12.2682 3.79102 12.2685C4.07787 12.2673 4.35253 12.1541 4.55477 11.9538L6.40727 10.1352H9.74935C10.105 10.1352 10.4572 10.0662 10.7858 9.93217C11.1144 9.79816 11.4129 9.60173 11.6644 9.35411C11.9159 9.10649 12.1154 8.81251 12.2515 8.48898C12.3876 8.16544 12.4577 7.81868 12.4577 7.46849V3.20182C12.4577 2.85163 12.3876 2.50487 12.2515 2.18133C12.1154 1.8578 11.9159 1.56383 11.6644 1.3162C11.4129 1.06858 11.1144 0.872157 10.7858 0.738144C10.4572 0.604132 10.105 0.535156 9.74935 0.535156ZM11.3743 7.46849C11.3743 7.89284 11.2031 8.2998 10.8984 8.59986C10.5936 8.89992 10.1803 9.06849 9.74935 9.06849H6.17977C6.03766 9.06908 5.90149 9.12463 5.8006 9.22316L3.79102 11.2018V9.60182C3.79102 9.46037 3.73395 9.32472 3.63236 9.2247C3.53078 9.12468 3.39301 9.06849 3.24935 9.06849C2.81837 9.06849 2.40505 8.89992 2.1003 8.59986C1.79555 8.2998 1.62435 7.89284 1.62435 7.46849V3.20182C1.62435 2.77748 1.79555 2.37051 2.1003 2.07045C2.40505 1.77039 2.81837 1.60182 3.24935 1.60182H9.74935C10.1803 1.60182 10.5936 1.77039 10.8984 2.07045C11.2031 2.37051 11.3743 2.77748 11.3743 3.20182V7.46849Z"
													// fill="#5500FF"
												/>
												<path
													d="M4.0625 6.13516C4.51123 6.13516 4.875 5.77698 4.875 5.33516C4.875 4.89333 4.51123 4.53516 4.0625 4.53516C3.61377 4.53516 3.25 4.89333 3.25 5.33516C3.25 5.77698 3.61377 6.13516 4.0625 6.13516Z"
													// fill="#5500FF"
												/>
												<path
													d="M6.5 6.13516C6.94873 6.13516 7.3125 5.77698 7.3125 5.33516C7.3125 4.89333 6.94873 4.53516 6.5 4.53516C6.05127 4.53516 5.6875 4.89333 5.6875 5.33516C5.6875 5.77698 6.05127 6.13516 6.5 6.13516Z"
													// fill="#5500FF"
												/>
												<path
													d="M8.9375 6.13516C9.38623 6.13516 9.75 5.77698 9.75 5.33516C9.75 4.89333 9.38623 4.53516 8.9375 4.53516C8.48877 4.53516 8.125 4.89333 8.125 5.33516C8.125 5.77698 8.48877 6.13516 8.9375 6.13516Z"
													// fill="#5500FF"
												/>
											</svg>
											<span>Chats</span>
										</div>
										<div
											className={
												"flex w-fit cursor-pointer items-center gap-1 py-2 text-xs " +
												`${
													!toggle
														? "border-b-2 border-primary text-primary dark:border-white dark:text-white"
														: "text-gray-700/75 dark:text-lightBlue/75"
												}`
											}
											onClick={() => setoggle(false)}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="11"
												viewBox="0 0 14 11"
												fill="none"
												className={`${
													!toggle ? "fill-primary dark:fill-white" : "fill-gray-700/75 dark:fill-lightBlue/75"
												}`}
											>
												<path
													d="M12.495 0H1.505C0.6825 0 0 0.707921 0 1.56106V9.43894C0 10.2921 0.6825 11 1.505 11H12.495C13.3175 11 14 10.2921 14 9.43894V1.5429C14 0.689769 13.3175 0 12.495 0ZM1.225 1.56106L2.835 3.10396H1.225V1.56106ZM4.6025 3.10396C4.5675 3.06766 4.55 3.0132 4.515 2.9769L2.7125 1.27063H3.7975L5.7225 3.10396H4.6025ZM7.49 3.10396C7.455 3.06766 7.4375 3.0132 7.4025 2.9769L5.6 1.27063H6.685L8.61 3.10396H7.49ZM10.395 3.10396C10.36 3.06766 10.3425 3.0132 10.3075 2.9769L8.505 1.27063H9.59L11.515 3.10396H10.395ZM12.775 1.5429V2.57756L11.3925 1.27063H12.495C12.6525 1.27063 12.775 1.39769 12.775 1.5429ZM12.495 9.72937H1.505C1.3475 9.72937 1.225 9.60231 1.225 9.43894V4.37459H12.775V9.43894C12.775 9.58416 12.6525 9.72937 12.495 9.72937Z"
													// fill="#727272"
												/>
											</svg>
											<span>Files</span>
										</div>
									</div>
								</aside>
							</div>
						</div>
						{toggle ? (
							<div className="h-[calc(100vh-280px)] overflow-y-auto" ref={msgContainerRef}>
								<div className="mx-auto w-full max-w-[90%] px-4">
									{msg.length <= 0 ? (
										<div className="flex min-h-[400px] items-center justify-center">
											<div className="mx-auto w-full max-w-[300px] py-8 text-center">
												<div className="mb-6 p-2">
													<Image
														src={startNewChat}
														alt="No Data"
														width={300}
														className="mx-auto max-h-[150px] w-auto max-w-[150px]"
													/>
												</div>
												<h5 className="font-bold">Start New Chat</h5>
											</div>
										</div>
									) : (
										<>
											{msg.map((data, i) => (
												<div key={i} className="mb-1">
													{data["out"] ? (
														<InboxChatMsg
															type="me"
															data={data}
															delMsg={delMsg}
															editMsg={editMsg}
															recallMsg={recallMsg}
															settext={settext}
															setreply={setreply}
															setreplyC={setreplyC}
															axiosInstanceAuth2={axiosInstanceAuth2}
														/>
													) : (
														<InboxChatMsg
															type="user"
															data={data}
															delMsg={delMsg}
															editMsg={editMsg}
															recallMsg={recallMsg}
															setreply={setreply}
															setreplyC={setreplyC}
															axiosInstanceAuth2={axiosInstanceAuth2}
														/>
													)}
													{/* <InboxChatMsg type="reply" /> */}
												</div>
											))}
										</>
									)}

									{/* <InboxChatMsg type="user" />
								<InboxChatMsg type="me" />
								<InboxChatMsg type="reply" /> */}
								</div>
							</div>
						) : (
							<div className="mx-2 h-full p-2">
								<div className="flex items-center gap-4">
									<div
										className={
											"flex w-fit cursor-pointer gap-1 py-2 text-xs " +
											`${
												toggle2
													? "border-b-2 border-primary text-primary dark:border-white dark:text-white"
													: "text-gray-700/75 dark:text-lightBlue/75"
											}`
										}
										onClick={() => setoggle2(true)}
									>
										<span>Document</span>
									</div>
									<div
										className={
											"flex w-fit cursor-pointer items-center gap-1 py-2 text-xs " +
											`${
												!toggle2
													? "border-b-2 border-primary text-primary dark:border-white dark:text-white"
													: "text-gray-700/75 dark:text-lightBlue/75"
											}`
										}
										onClick={() => setoggle2(false)}
									>
										<span>Media</span>
									</div>
								</div>
								{toggle2 ? (
									<div className="p-4">
										{dataFile && dataFile.length > 0 ? (
											<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
												<table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
													<thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
														<tr>
															<th scope="col" className="px-6 py-3">
																Document name
															</th>
															<th scope="col" className="px-6 py-3">
																Uploaded Date
															</th>
															<th scope="col" className="px-6 py-3">
																<span className="sr-only">view</span>
															</th>
														</tr>
													</thead>
													<tbody>
														{dataFile.map((data, i) => (
															<tr
																key={i}
																className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
															>
																<th
																	scope="row"
																	className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
																>
																	{data["file"].replace("file/", "")}
																</th>
																<td className="px-6 py-4">{moment(data["upload_date"]).format("DD/MM/YYYY")}</td>
																<td className="px-6 py-4 text-right">
																	<Link
																		href={
																			process.env.NODE_ENV === "production"
																				? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/media/${data["file"]}`
																				: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/media/${data["file"]}`
																		}
																		target="_blank"
																		className="font-medium text-blue-600 hover:underline dark:text-blue-500"
																	>
																		View
																	</Link>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										) : (
											<p className="text-center text-base">No Document Found</p>
										)}
									</div>
								) : (
									<div className="p-4">
										{dataMwdia && dataMwdia.length > 0 ? (
											<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
												<table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
													<thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
														<tr>
															<th scope="col" className="px-6 py-3">
																Media name
															</th>
															<th scope="col" className="px-6 py-3">
																Uploaded Date
															</th>
															<th scope="col" className="px-6 py-3">
																<span className="sr-only">view</span>
															</th>
														</tr>
													</thead>
													<tbody>
														{dataMwdia.map((data, i) => (
															<tr
																key={i}
																className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
															>
																<th
																	scope="row"
																	className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
																>
																	{data["media"].replace("media/", "")}
																</th>
																<td className="px-6 py-4">{moment(data["upload_date"]).format("DD/MM/YYYY")}</td>
																<td className="px-6 py-4 text-right">
																	<Link
																		href={
																			process.env.NODE_ENV === "production"
																				? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/media/${data["media"]}`
																				: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/media/${data["media"]}`
																		}
																		target="_blank"
																		className="font-medium text-blue-600 hover:underline dark:text-blue-500"
																	>
																		View
																	</Link>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										) : (
											<p className="text-center text-base">No Media Found</p>
										)}
									</div>
								)}
							</div>
						)}
					</>
				)}
				{toggle && (
					<>
						<div className="absolute bottom-0 left-0 w-full border-t bg-lightBlue p-3 dark:border-t-gray-600 dark:bg-gray-900">
							{reply && (
								<div className="flex w-full items-center gap-2">
									<i
										className="fa-solid fa-xmark cursor-pointer p-3"
										onClick={() => {
											setreply(false);
											setreplyC({});
										}}
									></i>
									<span className="flex w-full flex-wrap items-center gap-2 border-2 border-borderColor bg-primary/[0.05] p-2 px-6">
										<span className="whitespace-nowrap">Reply to {replyC["sender_username"]} :</span>
										<div className="">
											<article className="text-sm">
												{replyC["file"] && (
													<>
														<button
															onClick={() => {
																window.open(
																	process.env.NODE_ENV === "production"
																		? `${process.env.NEXT_PUBLIC_PROD_BACKEND}${replyC["file"]["url"]}`
																		: `${process.env.NEXT_PUBLIC_DEV_BACKEND}${replyC["file"]["url"]}`,
																	"_blank"
																);
															}}
															className={
																`flex items-center gap-2 px-1 text-[15px]` +
																" " +
																`${(replyC["media"] || replyC["contact"] || replyC["text"]) && "mb-1 pb-2 shadow-md"}`
															}
														>
															<i className="fa-regular fa-file text-[30px]"></i>
															<p>{replyC["file"]["name"]}</p>
														</button>
													</>
												)}
												{replyC["media"] && (
													<>
														<button
															onClick={() => {
																window.open(
																	process.env.NODE_ENV === "production"
																		? `${process.env.NEXT_PUBLIC_PROD_BACKEND}${replyC["media"]["url"]}`
																		: `${process.env.NEXT_PUBLIC_DEV_BACKEND}${replyC["media"]["url"]}`,
																	"_blank"
																);
															}}
															className={
																`flex items-center gap-2 px-1 text-[15px]` +
																" " +
																`${(replyC["text"] || replyC["contact"]) && "mb-1 pb-2 shadow-md"}`
															}
														>
															<i className="fa-regular fa-image text-[30px]"></i>
															<p>{replyC["media"]["name"]}</p>
														</button>
													</>
												)}

												{replyC["contact"] && (
													<>
														<p className="ml-3 text-sm">Contact Card</p>
													</>
												)}

												{replyC["text"] && replyC["text"].length > 0 && <p className="text-left">{replyC["text"]}</p>}
											</article>
										</div>
									</span>
								</div>
							)}

							{file && (
								<div className="flex items-center gap-2">
									<i className="fa-solid fa-xmark cursor-pointer p-3" onClick={() => setfile(null)}></i>
									<span>
										Selected File &nbsp;
										<b>{file.name}</b>
									</span>
								</div>
							)}
							{media && (
								<div className="flex items-center gap-2">
									<i className="fa-solid fa-xmark cursor-pointer p-3" onClick={() => setmedia(null)}></i>
									<span>
										Selected Media &nbsp;
										<b>{media.name}</b>
									</span>
								</div>
							)}
							<div className="flex items-center gap-2 rounded bg-white p-2 shadow-normal dark:bg-gray-800">
								<textarea
									name=""
									id=""
									className="h-[40px] w-full resize-none  border-0 bg-transparent focus:border-0 focus:shadow-none focus:outline-none focus:ring-0"
									placeholder="Type something..."
									value={text}
									onChange={(e) => {
										settext(e.target.value);
										setisTyping(true);
									}}
									onBlur={(e) => {
										setisTyping(false);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleSendClick();
										}
									}}
								></textarea>
								<div className="flex gap-4">
									<button
										type="button"
										className="block px-0.5 text-lg leading-normal"
										onClick={() => setIsPickerOpen(!isPickerOpen)}
									>
										<i className="fa-regular fa-face-smile"></i>
									</button>

									{isPickerOpen && (
										<div style={{ position: "absolute", bottom: "50px", right: "10px" }}>
											<Picker data={data} onEmojiSelect={handleEmojiClick} />
										</div>
									)}

									<button type="button" className="block px-0.5 text-lg leading-normal">
										<i className="fa-solid fa-microphone"></i>
									</button>
									<input
										type="file"
										ref={fileInputRef}
										accept=".pdf, .doc, .docx, .txt"
										style={{ display: "none" }}
										onChange={uploadFile}
									/>
									<input
										type="file"
										ref={mediaInputRef}
										accept=".jpg, .jpeg, .png, .mp3, .mp4"
										style={{ display: "none" }}
										onChange={uploadMedia}
									/>
									<Menu as="div" className="relative">
										<Menu.Button className="block px-0.5 text-lg leading-normal">
											<i className="fa-solid fa-plus"></i>
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
													"absolute bottom-[100%] right-0 h-auto w-fit whitespace-nowrap rounded bg-white py-2 text-darkGray shadow-normal dark:bg-gray-700 dark:text-gray-400"
												}
											>
												<Menu.Item>
													<button
														type="button"
														className="relative flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
														onClick={() => handleDocumentButtonClick()}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="11"
															height="14"
															viewBox="0 0 11 14"
															fill="none"
															className="fill-[#484848] dark:fill-lightBlue/50"
														>
															<path
																d="M10.6043 0H0.395683C0.177108 0 0 0.177259 0 0.396022V13.604C0 13.8227 0.177108 14 0.395683 14H7.8741C7.98727 14 8.09505 13.9515 8.17007 13.8668L10.9003 10.7875C10.9644 10.7151 11 10.6215 11 10.5247V0.396022C11 0.177259 10.8229 0 10.6043 0ZM8.26329 12.5683V10.9009H9.74173L8.26329 12.5683ZM10.2086 10.1088H7.86761C7.64904 10.1088 7.47193 10.2861 7.47193 10.5049V13.208H0.791367V0.792043H10.2086V10.1088ZM2.60439 7.64702H8.39561C8.61419 7.64702 8.79129 7.46976 8.79129 7.251C8.79129 7.03224 8.61419 6.85498 8.39561 6.85498H2.60439C2.38581 6.85498 2.2087 7.03224 2.2087 7.251C2.2087 7.46976 2.38581 7.64702 2.60439 7.64702ZM2.60439 5.50644H8.39561C8.61419 5.50644 8.79129 5.32918 8.79129 5.11042C8.79129 4.89166 8.61419 4.7144 8.39561 4.7144H2.60439C2.38581 4.7144 2.2087 4.89166 2.2087 5.11042C2.2087 5.32918 2.38581 5.50644 2.60439 5.50644ZM2.60439 3.36634H8.39561C8.61419 3.36634 8.79129 3.18908 8.79129 2.97032C8.79129 2.75156 8.61419 2.5743 8.39561 2.5743H2.60439C2.38581 2.5743 2.2087 2.75156 2.2087 2.97032C2.2087 3.18908 2.38581 3.36634 2.60439 3.36634Z"
																// fill="#484848"
															/>
														</svg>
														<span className="pl-2">Document</span>
													</button>
												</Menu.Item>
												<Menu.Item>
													<button
														type="button"
														className="relative flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
														onClick={() => handleMediauttonClick()}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="14"
															height="12"
															viewBox="0 0 14 12"
															fill="none"
															className="fill-[#484848] dark:fill-lightBlue/50"
														>
															<path
																d="M12.5007 11.13H1.09528C0.804793 11.13 0.526205 11.0146 0.3208 10.8092C0.115395 10.6038 0 10.3252 0 10.0347L0 1.09528C0 0.804793 0.115395 0.526205 0.3208 0.3208C0.526205 0.115395 0.804793 0 1.09528 0L12.5007 0C12.7912 0 13.0698 0.115395 13.2752 0.3208C13.4806 0.526205 13.596 0.804793 13.596 1.09528V10.0347C13.596 10.3252 13.4806 10.6038 13.2752 10.8092C13.0698 11.0146 12.7912 11.13 12.5007 11.13ZM1.09528 0.854019C1.03129 0.854019 0.969927 0.879437 0.924682 0.924682C0.879437 0.969927 0.854019 1.03129 0.854019 1.09528V10.0347C0.854019 10.0664 0.860259 10.0978 0.872384 10.127C0.884508 10.1563 0.902279 10.1829 0.924682 10.2053C0.947085 10.2277 0.973682 10.2455 1.00295 10.2576C1.03222 10.2697 1.0636 10.276 1.09528 10.276H12.5007C12.5643 10.2754 12.6251 10.2498 12.6699 10.2046C12.7147 10.1594 12.7398 10.0983 12.7398 10.0347V1.09528C12.7398 1.03166 12.7147 0.970617 12.6699 0.925433C12.6251 0.880249 12.5643 0.854582 12.5007 0.854019H1.09528Z"
																// fill="#484848"
															/>
															<path
																d="M2.57893 9.27971H11.0145C11.0821 9.28163 11.1488 9.26454 11.2071 9.23039C11.2654 9.19624 11.313 9.1464 11.3444 9.08654C11.3757 9.02669 11.3897 8.95922 11.3846 8.89183C11.3795 8.82444 11.3556 8.75984 11.3155 8.70538L10.1519 7.12544C10.1216 7.08341 10.0825 7.04841 10.0374 7.02284C9.99225 6.99727 9.94215 6.98172 9.89048 6.97727C9.83881 6.97281 9.78678 6.97954 9.73795 6.99701C9.68912 7.01447 9.64462 7.04226 9.6075 7.07847L8.41188 8.21645L5.63631 4.4481C5.60176 4.40102 5.55629 4.36303 5.50382 4.3374C5.45135 4.31176 5.39344 4.29925 5.33506 4.30093C5.27669 4.30261 5.21959 4.31843 5.16868 4.34704C5.11777 4.37565 5.07456 4.41619 5.04277 4.46518L2.26721 8.72246C2.23141 8.77757 2.21135 8.84141 2.20918 8.90709C2.20701 8.97277 2.22282 9.0378 2.25491 9.09515C2.28699 9.1525 2.33412 9.20001 2.39123 9.23253C2.44833 9.26506 2.51323 9.28137 2.57893 9.27971Z"
																// fill="#484848"
															/>
															<path
																d="M9.42233 4.4931C10.1216 4.4931 10.6884 3.92626 10.6884 3.22702C10.6884 2.52778 10.1216 1.96094 9.42233 1.96094C8.72309 1.96094 8.15625 2.52778 8.15625 3.22702C8.15625 3.92626 8.72309 4.4931 9.42233 4.4931Z"
																// fill="#484848"
															/>
														</svg>
														<span className="pl-2">Image and Video</span>
													</button>
												</Menu.Item>
												<Menu.Item>
													<button
														type="button"
														className="relative flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
														// onClick={() => setExitGroup(true)}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="13"
															height="13"
															viewBox="0 0 13 13"
															fill="none"
															className="fill-[#484848] dark:fill-lightBlue/50"
														>
															<path
																d="M12.6609 2.79901C12.6609 2.37578 12.4928 1.96988 12.1936 1.67062C11.8943 1.37135 11.4884 1.20322 11.0652 1.20322H10.3327V0.319157C10.3327 0.234511 10.2991 0.153332 10.2392 0.0934788C10.1794 0.0336253 10.0982 0 10.0135 0C9.9289 0 9.84772 0.0336253 9.78787 0.0934788C9.72801 0.153332 9.69439 0.234511 9.69439 0.319157V1.20322H6.64963V0.319157C6.64963 0.234511 6.61601 0.153332 6.55615 0.0934788C6.4963 0.0336253 6.41512 0 6.33047 0C6.24583 0 6.16465 0.0336253 6.1048 0.0934788C6.04494 0.153332 6.01132 0.234511 6.01132 0.319157V1.20322H2.96656V0.319157C2.96656 0.234511 2.93294 0.153332 2.87308 0.0934788C2.81323 0.0336253 2.73205 0 2.64741 0C2.56276 0 2.48158 0.0336253 2.42173 0.0934788C2.36187 0.153332 2.32825 0.234511 2.32825 0.319157V1.20322H1.59578C1.17256 1.20322 0.766662 1.37135 0.467394 1.67062C0.168127 1.96988 0 2.37578 0 2.79901V10.5928C0 10.8024 0.0412762 11.0099 0.121472 11.2035C0.201667 11.3971 0.319212 11.573 0.467394 11.7212C0.615577 11.8694 0.791495 11.9869 0.985104 12.0671C1.17871 12.1473 1.38622 12.1886 1.59578 12.1886H11.0652C11.2747 12.1886 11.4822 12.1473 11.6758 12.0671C11.8695 11.9869 12.0454 11.8694 12.1936 11.7212C12.3417 11.573 12.4593 11.3971 12.5395 11.2035C12.6197 11.0099 12.6609 10.8024 12.6609 10.5928V2.79901ZM12.0226 10.5944C12.0226 10.8483 11.9218 11.0919 11.7422 11.2714C11.5626 11.451 11.3191 11.5519 11.0652 11.5519H1.59578C1.34185 11.5519 1.09831 11.451 0.91875 11.2714C0.73919 11.0919 0.638314 10.8483 0.638314 10.5944V5.04906H12.0226V10.5944ZM12.0226 4.41234H0.638314V2.79901C0.638314 2.54507 0.73919 2.30153 0.91875 2.12197C1.09831 1.94241 1.34185 1.84153 1.59578 1.84153H2.32825V2.7256C2.32825 2.81024 2.36187 2.89142 2.42173 2.95128C2.48158 3.01113 2.56276 3.04476 2.64741 3.04476C2.73205 3.04476 2.81323 3.01113 2.87308 2.95128C2.93294 2.89142 2.96656 2.81024 2.96656 2.7256V1.84153H6.01132V2.7256C6.01132 2.81024 6.04494 2.89142 6.1048 2.95128C6.16465 3.01113 6.24583 3.04476 6.33047 3.04476C6.41512 3.04476 6.4963 3.01113 6.55615 2.95128C6.61601 2.89142 6.64963 2.81024 6.64963 2.7256V1.84153H9.69439V2.7256C9.69439 2.81024 9.72801 2.89142 9.78787 2.95128C9.84772 3.01113 9.9289 3.04476 10.0135 3.04476C10.0982 3.04476 10.1794 3.01113 10.2392 2.95128C10.2991 2.89142 10.3327 2.81024 10.3327 2.7256V1.84153H11.0652C11.3191 1.84153 11.5626 1.94241 11.7422 2.12197C11.9218 2.30153 12.0226 2.54507 12.0226 2.79901V4.41234Z"
																// fill="#484848"
															/>
															<path
																d="M5.27795 9.92389C5.33761 9.98236 5.41782 10.0151 5.50136 10.0151C5.5849 10.0151 5.66511 9.98236 5.72477 9.92389L9.36156 6.45625C9.42272 6.39763 9.45808 6.31712 9.45988 6.23243C9.46167 6.14773 9.42975 6.0658 9.37113 6.00464C9.31252 5.94348 9.23201 5.90812 9.14731 5.90632C9.06262 5.90453 8.98069 5.93645 8.91953 5.99507L5.50774 9.25685L3.75238 7.50149C3.6927 7.44118 3.61152 7.40704 3.52667 7.40659C3.44183 7.40614 3.36029 7.43942 3.29998 7.49909C3.23967 7.55877 3.20553 7.63996 3.20508 7.7248C3.20463 7.80964 3.23791 7.89119 3.29758 7.9515L5.27795 9.92389Z"
																// fill="#484848"
															/>
														</svg>
														<span className="pl-2">Event</span>
													</button>
												</Menu.Item>
												<Menu.Item>
													<button
														type="button"
														className="relative flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
														onClick={() => setShowContact(true)}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="13"
															height="10"
															viewBox="0 0 13 10"
															fill="none"
															className="fill-[#484848] dark:fill-lightBlue/50"
														>
															<path
																d="M2.07317 2.12891C1.96911 2.12891 1.88477 2.22416 1.88477 2.34167V4.25657C1.88477 4.37408 1.96911 4.46933 2.07317 4.46933H3.39201C3.49607 4.46933 3.58042 4.37408 3.58042 4.25657V2.34167C3.58042 2.22416 3.49607 2.12891 3.39201 2.12891H2.07317Z"
																// fill="#484848"
															/>
															<path
																d="M1.88477 7.11623C1.88477 7.06283 1.96911 7.01953 2.07317 7.01953H3.39201C3.49607 7.01953 3.58042 7.06283 3.58042 7.11623V7.98666C3.58042 8.04006 3.49607 8.08336 3.39201 8.08336H2.07317C1.96911 8.08336 1.88477 8.04006 1.88477 7.98666V7.11623Z"
																// fill="#484848"
															/>
															<path
																d="M4.52239 7.01953C4.41833 7.01953 4.33398 7.06283 4.33398 7.11623V7.98666C4.33398 8.04006 4.41833 8.08336 4.52239 8.08336H5.84123C5.94529 8.08336 6.02964 8.04006 6.02964 7.98666V7.11623C6.02964 7.06283 5.94529 7.01953 5.84123 7.01953H4.52239Z"
																// fill="#484848"
															/>
															<path
																d="M6.7832 7.11623C6.7832 7.06283 6.86755 7.01953 6.97161 7.01953H8.29045C8.39451 7.01953 8.47886 7.06283 8.47886 7.11623V7.98666C8.47886 8.04006 8.39451 8.08336 8.29045 8.08336H6.97161C6.86755 8.08336 6.7832 8.04006 6.7832 7.98666V7.11623Z"
																// fill="#484848"
															/>
															<path
																d="M9.42083 7.01953C9.31677 7.01953 9.23242 7.06283 9.23242 7.11623V7.98666C9.23242 8.04006 9.31677 8.08336 9.42083 8.08336H10.7397C10.8437 8.08336 10.9281 8.04006 10.9281 7.98666V7.11623C10.9281 7.06283 10.8437 7.01953 10.7397 7.01953H9.42083Z"
																// fill="#484848"
															/>
															<path
																fill-rule="evenodd"
																clip-rule="evenodd"
																d="M1.22464 0C0.54828 0 0 0.61917 0 1.38298V8.61702C0 9.38083 0.54828 10 1.22464 10H11.7754C12.4517 10 13 9.38083 13 8.61702V1.38298C13 0.61917 12.4517 0 11.7754 0H1.22464ZM0.565217 1.38298C0.565217 0.971702 0.860449 0.638298 1.22464 0.638298H11.7754C12.1396 0.638298 12.4348 0.971702 12.4348 1.38298V8.61702C12.4348 9.0283 12.1396 9.3617 11.7754 9.3617H1.22464C0.860449 9.3617 0.565217 9.0283 0.565217 8.61702V1.38298Z"
																// fill="#484848"
															/>
														</svg>
														<span className="pl-2">Contact Card</span>
													</button>
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
									<button
										type="button"
										className={`block border-l-2 border-gray-400 px-4 text-lg leading-normal`}
										onClick={() => handleSendClick()}
										disabled={text === ""}
									>
										<i className={`fa-solid fa-paper-plane` + " " + `${text.length > 0 ? "text-primary" : ""}`}></i>
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</div>

			<Transition.Root show={showContact} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setShowContact}>
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-2xl bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-md">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="flex items-center font-semibold leading-none">Select Contact Card</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setShowContact(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									{/* <div className="p-8 pb-0"> */}
									{/* <FormField
									fieldType="input"
									inputType="search"
									placeholder="Search team"
									icon={<i className="fa-solid fa-magnifying-glass"></i>}
								/> */}
									{/* </div> */}
									<div className="py-2">
										<div className="max-h-[300px] overflow-y-auto px-8">
											{showContactData &&
												showContactData.map((data, i) => (
													<div
														className="my-1 flex cursor-pointer items-center justify-between rounded border px-4 py-2 hover:shadow-lg dark:border-gray-600"
														key={i}
														onClick={() => handleContactCardMsg(data["email"])}
													>
														<div className="flex grow items-center pr-2">
															<Image
																src={
																	process.env.NODE_ENV === "production"
																		? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/media/${data["profile"]}`
																		: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/media/${data["profile"]}`
																}
																alt="User"
																width={1500}
																height={1500}
																className="mr-4 h-[35px] w-[35px] rounded-full object-cover shadow-highlight"
															/>
															<h6 className="text-sm font-semibold">{data["name"]}</h6>
														</div>
														<aside className="text-sm text-darkGray dark:text-gray-400">{data["role"]}</aside>
													</div>
												))}
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
