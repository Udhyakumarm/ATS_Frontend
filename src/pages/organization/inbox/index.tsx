import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import Head from "next/head";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import FormField from "@/components/FormField";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import userImg1 from "/public/images/user-image1.jpeg";
import Button from "@/components/Button";
import { Menu } from "@headlessui/react";
import InboxSideBar from "@/components/organization/inbox/sidebar";
import InboxFrame from "@/components/organization/inbox/frame";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { useUserStore } from "@/utils/code";
import toastcomp from "@/components/toast";

const sendOutgoingTextMessage = (socket: any, text: any, user_pk: any) => {
	console.log(`Sending text message: '${text}', user_pk: '${user_pk}'`);
	const randomId = Math.floor(1000 + Math.random() * 9000);
	const data = {
		text,
		user_pk,
		random_id: -randomId // Use snake_case for property names in JavaScript
	};

	console.log("^^", "final data", data);
	console.log("^^", "final data2", JSON.stringify({ msg_type: 3, data }));

	socket.send(JSON.stringify({ msg_type: 3, data })); // Adjust the message structure as needed

	console.log("Message Send Process DOne");
};

const sendOutgoingFileMessage = (socket: any, file_id: any, text: any, user_pk: any) => {
	console.log(`Sending File message: '${text}', user_pk: '${user_pk}'`);
	const randomId = Math.floor(1000 + Math.random() * 9000);
	const data = {
		text,
		user_pk,
		file_id: file_id,
		random_id: -randomId // Use snake_case for property names in JavaScript
	};

	console.log("^^", "final data", data);
	console.log("^^", "final data2", JSON.stringify({ msg_type: 3, data }));

	socket.send(JSON.stringify({ msg_type: 4, data })); // Adjust the message structure as needed

	console.log("File Message Send Process DOne");
};

const sendOutgoingMediaMessage = (socket: any, file_id: any, text: any, user_pk: any) => {
	console.log(`Sending File message: '${text}', user_pk: '${user_pk}'`);
	const randomId = Math.floor(1000 + Math.random() * 9000);
	const data = {
		text,
		user_pk,
		media_id: file_id,
		random_id: -randomId // Use snake_case for property names in JavaScript
	};

	console.log("^^", "final data", data);
	console.log("^^", "final data2", JSON.stringify({ msg_type: 3, data }));

	socket.send(JSON.stringify({ msg_type: 11, data })); // Adjust the message structure as needed

	console.log("Mieda Message Send Process DOne");
};

const sendOutgoingContactMessage = (socket: any, contact_id: any, user_pk: any) => {
	const randomId = Math.floor(1000 + Math.random() * 9000);
	const data = {
		user_pk,
		card_id: contact_id,
		random_id: -randomId // Use snake_case for property names in JavaScript
	};

	console.log("^^", "final data", data);
	console.log("^^", "final data2", JSON.stringify({ msg_type: 13, data }));

	socket.send(JSON.stringify({ msg_type: 13, data })); // Adjust the message structure as needed

	console.log("Contact Message Send Process DOne");
};

const markASRead = (socket: any, user_pk: any, mid: any) => {
	socket.send(JSON.stringify({ msg_type: 6, user_pk: user_pk, message_id: mid }));
};

const callbackOnline = (socket: any, user_pk: any) => {
	socket.send(JSON.stringify({ msg_type: 12, user_pk: user_pk })); // Adjust the message structure as needed
};

const isTyping = (socket: any, user_pk: any) => {
	console.log("^^", "final data2", JSON.stringify({ msg_type: 5, user_pk: user_pk }));

	socket.send(JSON.stringify({ msg_type: 5, user_pk: user_pk })); // Adjust the message structure as needed

	console.log("Message Typing Process DOne");
};

const isStopTyping = (socket: any, user_pk: any) => {
	console.log("^^", "final data2", JSON.stringify({ msg_type: 10, user_pk: user_pk }));

	socket.send(JSON.stringify({ msg_type: 10, user_pk: user_pk })); // Adjust the message structure as needed

	console.log("Message Stopped Typing Process DOne");
};

export default function Inbox() {
	const [sklLoad] = useState(true);
	const cancelButtonRef = useRef(null);
	const [addMembers, setAddMembers] = useState(false);
	const [createGroup, setCreateGroup] = useState(false);
	const [exitGroup, setExitGroup] = useState(false);
	const [deleteGroup, setDeleteGroup] = useState(false);

	const [togglePages, setTogglePages] = useState(false);
	function handleInboxPage() {
		setTogglePages(true);
	}
	function handleChatPage() {
		setTogglePages(false);
	}

	const MessageCards = ({ sklLoad }: any) => {
		if (sklLoad === true) {
			return (
				<>
					<div
						className={
							"flex border border-transparent border-b-slate-200 px-3 py-4 last:border-b-0 dark:border-b-gray-600"
						}
					>
						<Skeleton circle width={50} height={50} />
						<div className="w-[calc(100%-50px)] pl-3 pt-1">
							<div className="mb-2 flex justify-between">
								<h5 className="text-sm font-semibold">
									<Skeleton width={100} />
								</h5>
								<Skeleton width={50} />
							</div>
							<Skeleton count={2} />
						</div>
					</div>
				</>
			);
		}
		return <></>;
	};

	const router = useRouter();
	const { data: session } = useSession();
	const [token, settoken] = useState("");
	const [text, settext] = useState("");
	const [click, setclick] = useState(false);
	const [cardActive, setcardActive] = useState(false);
	const [cardActiveData, setcardActiveData] = useState({});
	const currentUser = useUserStore((state: { user: any }) => state.user);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);
	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	const [socket, setSocket] = useState(null);
	useEffect(() => {
		if (token && token.length > 0) {
			console.log("&&&", "token", token);
			const rws = new ReconnectingWebSocket(
				process.env.NODE_ENV === "production"
					? `wss://atsapi.somhako.com:8001/ws/chat/?access_token=${token}`
					: `ws://http://127.0.0.1:8000/ws/chat/?access_token=${token}`
			);

			rws.addEventListener("open", () => {
				toastcomp("Connected to WebSocket server", "success");
				console.log();
				setSocket(rws);
			});

			rws.onmessage = function (e) {
				// console.log("^^^", "eee", e.data);
			};

			rws.addEventListener("close", () => {
				toastcomp("Disconnected to WebSocket server", "success");
				setSocket(null);
			});
		}
	}, [token]);

	useEffect(() => {
		if (text.length > 0 && socket != null) {
			isTyping(socket, cardActiveData["other_user_id"]);
		}
	}, [text]);

	// function performSendingMessage(text: any, socket: any, opk: any) {
	// 	let userData = {
	// 		username: currentUser[0]["name"],
	// 		pk: currentUser[0]["id"].toString()
	// 	};
	// 	let user_pk = opk.toString();
	// 	sendOutgoingTextMessage(socket, text, user_pk, userData);
	// }

	// useEffect(() => {
	// 	console.log("^^", "rws socket", socket);
	// 	if (click && text.length > 0 && socket != null) {
	// 		toastcomp(text, "success");
	// 		performSendingMessage(text, socket, cardActiveData["other_user_id"]);
	// 		settext("");
	// 		setclick(false);
	// 	}
	// }, [click]);

	return (
		<>
			{socket != null ? (
				<>
					<Head>
						<title>Inbox</title>
						<meta name="description" content="Generated by create next app" />
					</Head>
					<main>
						<OrgSideBar />
						<OrgTopBar />
						<div
							id="overlay"
							className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
						></div>
						<div className="layoutWrap p-4">
							<div className="flex flex-wrap">
								<div className="mb-4 w-full xl:mb-0 xl:max-w-[27%]">
									<InboxSideBar
										togglePages={togglePages}
										setTogglePages={setTogglePages}
										axiosInstanceAuth2={axiosInstanceAuth2}
										cardActive={cardActive}
										cardActiveData={cardActiveData}
										setcardActive={setcardActive}
										setcardActiveData={setcardActiveData}
										socket={socket}
										callbackOnline={callbackOnline}
									/>
								</div>
								{cardActive && (
									<div className="w-full xl:max-w-[73%] xl:pl-4">
										<InboxFrame
											togglePages={togglePages}
											setTogglePages={setTogglePages}
											axiosInstanceAuth2={axiosInstanceAuth2}
											cardActive={cardActive}
											cardActiveData={cardActiveData}
											setcardActive={setcardActive}
											setcardActiveData={setcardActiveData}
											text={text}
											settext={settext}
											setclick={setclick}
											isTypingFun={isTyping}
											isStopTypingFun={isStopTyping}
											socket={socket}
											sendOutgoingTextMessage={sendOutgoingTextMessage}
											sendOutgoingFileMessage={sendOutgoingFileMessage}
											sendOutgoingMediaMessage={sendOutgoingMediaMessage}
											markASRead={markASRead}
											sendOutgoingContactMessage={sendOutgoingContactMessage}
										/>
									</div>
								)}
							</div>
						</div>
					</main>
					<Transition.Root show={addMembers} as={Fragment}>
						<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAddMembers}>
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
										<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-xl">
											<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
												<h4 className="flex items-center font-semibold leading-none">Add new memeber to chat</h4>
												<button
													type="button"
													className="leading-none hover:text-gray-700"
													onClick={() => setAddMembers(false)}
												>
													<i className="fa-solid fa-xmark"></i>
												</button>
											</div>
											<div className="p-8 pb-0">
												<FormField
													fieldType="input"
													inputType="search"
													placeholder="Search team"
													icon={<i className="fa-solid fa-magnifying-glass"></i>}
												/>
											</div>
											<div className="py-2">
												<div className="max-h-[300px] overflow-y-auto px-8">
													{Array(20).fill(
														<div className="my-1 flex items-center justify-between rounded border px-4 py-2 dark:border-gray-600">
															<div className="flex grow items-center pr-2">
																<Image
																	src={userImg1}
																	alt="User"
																	width={150}
																	className="mr-4 h-[35px] w-[35px] rounded-full object-cover shadow-highlight"
																/>
																<h6 className="text-sm font-semibold">Jacob Adam</h6>
															</div>
															<aside>
																<button type="button" className="text-sm text-darkGray dark:text-gray-400">
																	Chat
																</button>
															</aside>
														</div>
													)}
												</div>
											</div>
										</Dialog.Panel>
									</Transition.Child>
								</div>
							</div>
						</Dialog>
					</Transition.Root>
					<Transition.Root show={createGroup} as={Fragment}>
						<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setCreateGroup}>
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
										<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-xl">
											<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
												<h4 className="flex items-center font-semibold leading-none">Create Group</h4>
												<button
													type="button"
													className="leading-none hover:text-gray-700"
													onClick={() => setCreateGroup(false)}
												>
													<i className="fa-solid fa-xmark"></i>
												</button>
											</div>
											<div className="p-8 pb-0">
												<FormField fieldType="input" inputType="text" label="Group Name" required />
												<FormField fieldType="textarea" label="Group Description" />
											</div>
											<div className="py-2">
												<h5 className="mb-1 px-8 font-bold">Select Members</h5>
												<div className="max-h-[300px] overflow-y-auto px-8">
													<div className="my-1 flex items-center justify-between rounded border px-4 py-2 dark:border-gray-600">
														<div className="flex grow items-center pr-2">
															<Image
																src={userImg1}
																alt="User"
																width={150}
																className="mr-4 h-[35px] w-[35px] rounded-full object-cover shadow-highlight"
															/>
															<h6 className="text-sm font-semibold">Jacob Adam</h6>
														</div>
														<aside>
															<button type="button" className="text-sm text-red-500">
																Remove
															</button>
														</aside>
													</div>
													{Array(10).fill(
														<div className="my-1 flex items-center justify-between rounded border px-4 py-2 dark:border-gray-600">
															<div className="flex grow items-center pr-2">
																<Image
																	src={userImg1}
																	alt="User"
																	width={150}
																	className="mr-4 h-[35px] w-[35px] rounded-full object-cover shadow-highlight"
																/>
																<h6 className="text-sm font-semibold">Jacob Adam</h6>
															</div>
															<aside>
																<button type="button" className="text-sm text-darkGray dark:text-gray-400">
																	Add
																</button>
															</aside>
														</div>
													)}
												</div>
												<div className="text-center">
													<Button label="Done" />
												</div>
											</div>
										</Dialog.Panel>
									</Transition.Child>
								</div>
							</div>
						</Dialog>
					</Transition.Root>
					<Transition.Root show={exitGroup} as={Fragment}>
						<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setExitGroup}>
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
												<h4 className="flex items-center font-semibold leading-none">Exit Group</h4>
												<button
													type="button"
													className="leading-none hover:text-gray-700"
													onClick={() => setExitGroup(false)}
												>
													<i className="fa-solid fa-xmark"></i>
												</button>
											</div>
											<div className="p-8">
												<h3 className="mb-4 text-center text-lg font-bold">
													Are you sure want to exit from this group?
												</h3>
												<div className="flex flex-wrap justify-center">
													<div className="my-1 mr-4 last:mr-0">
														<Button btnStyle="danger" label="No" />
													</div>
													<div className="my-1 mr-4 last:mr-0">
														<Button label="Yes" />
													</div>
												</div>
											</div>
										</Dialog.Panel>
									</Transition.Child>
								</div>
							</div>
						</Dialog>
					</Transition.Root>
					<Transition.Root show={deleteGroup} as={Fragment}>
						<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setDeleteGroup}>
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
												<h4 className="flex items-center font-semibold leading-none">Delete Group</h4>
												<button
													type="button"
													className="leading-none hover:text-gray-700"
													onClick={() => setDeleteGroup(false)}
												>
													<i className="fa-solid fa-xmark"></i>
												</button>
											</div>
											<div className="p-8">
												<h3 className="mb-4 text-center text-lg font-bold">Are you sure want to delete this group?</h3>
												<div className="flex flex-wrap justify-center">
													<div className="my-1 mr-4 last:mr-0">
														<Button btnStyle="danger" label="No" />
													</div>
													<div className="my-1 mr-4 last:mr-0">
														<Button label="Yes" />
													</div>
												</div>
											</div>
										</Dialog.Panel>
									</Transition.Child>
								</div>
							</div>
						</Dialog>
					</Transition.Root>
				</>
			) : (
				<></>
			)}
		</>
	);
}
