import React, { useEffect, useState, Fragment, useRef } from "react";
import { Dialog, Menu, Tab, Transition } from "@headlessui/react";
import Image from "next/image";
import FormField from "@/components/FormField";
import userImg1 from "/public/images/user-image1.jpeg";
import Button from "@/components/Button";
import AutoTextarea from "@/components/organization/AutoTextarea";
import moment from "moment";
import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/theme-dark.css";
import { useTheme } from "next-themes";
import { useLangStore } from "@/utils/code";

export default function InboxCard({
	pin,
	count,
	online,
	data,
	setcardActive,
	setcardActiveData,
	cardActive,
	cardActiveData,
	socket,
	pinnedClick,
	typingPK,
	settypingPK,
	sidebarData,
	loadSidebar
}: // msgRead
any) {
	const { theme, setTheme } = useTheme();
	const [isOpen, setOpen] = useState(false);
	const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

	const cancelButtonRef = useRef(null);
	const [muteChat, setmuteChat] = useState(false);
	const [one, setone] = useState(true);
	// const [online, setonline] = useState(false);
	const [isTyping, setisTyping] = useState(null);
	const [newUnreadCount, setnewUnreadCount] = useState(null);
	const [newLastMessage, setnewLastMessage] = useState(null);

	function clickCard(data: any) {
		if (cardActiveData["id"] != data["id"]) {
			console.log("&&&", "click", data);
			// setcardActive(true);
			setcardActive(true);
			setcardActiveData(data);
			// msgRead(data["other_user_id"]).then(() => {
			// 	loadSidebar();
			// });
		} else {
			setcardActive(false);
			setcardActiveData({});
		}
	}

	// useEffect(() => {
	// socket.onmessage = function (e) {
	// 	loadSidebar();
	// var fdata = JSON.parse(e.data);
	// console.log("^^^", "eee data", data);
	// console.log("^^^", "eee", fdata);

	// if (fdata["msg_type"] === 1 && sidebarData.find((item) => item.other_user_id === parseInt(fdata["user_pk"]))) {
	// 	if (!onlinePK.includes(parseInt(fdata["user_pk"]))) {
	// 		setonlinePK([...onlinePK, parseInt(fdata["user_pk"])]);
	// 		console.log("^^^", "**", onlinePK, "#", fdata["user_pk"]);
	// 	}
	// 	// setonline(true);
	// 	// console.log("^^^", "** RUNNNNNNNNNNNNN");
	// 	// callbackOnline(socket, fdata["user_pk"]);
	// }
	// if (fdata["msg_type"] === 2 && sidebarData.find((item) => item.other_user_id === parseInt(fdata["user_pk"]))) {
	// 	// setonline(false);
	// 	if (onlinePK.includes(parseInt(fdata["user_pk"]))) {
	// 		const updatedItems = onlinePK.filter((existingItem) => existingItem !== parseInt(fdata["user_pk"]));
	// 		setonlinePK(updatedItems);
	// 		console.log("^^^", "**", onlinePK);
	// 	}
	// }
	// if (fdata["msg_type"] === 5 && sidebarData.find((item) => item.other_user_id === parseInt(fdata["user_pk"]))) {
	// 	if (!typingPK.includes(parseInt(fdata["user_pk"]))) {
	// 		settypingPK([...typingPK, parseInt(fdata["user_pk"])]);
	// 		console.log("^^^", "**", typingPK);
	// 	}
	// 	// setisTyping(true);
	// }
	// if (fdata["msg_type"] === 10 && sidebarData.find((item) => item.other_user_id === parseInt(fdata["user_pk"]))) {
	// 	// setisTyping(false);
	// 	// setTimeout(() => {
	// 	// 	setisTyping(null);
	// 	// }, 1000);
	// 	if (typingPK.includes(parseInt(fdata["user_pk"]))) {
	// 		const updatedItems = typingPK.filter((existingItem) => existingItem !== parseInt(fdata["user_pk"]));
	// 		settypingPK(updatedItems);
	// 		console.log("^^^", "**", typingPK);
	// 	}
	// }
	// if (fdata["msg_type"] === 9 && sidebarData.find((item) => item.other_user_id === parseInt(fdata["sender"]))) {
	// 	setnewUnreadCount(fdata["unread_count"]);
	// }
	// if (fdata["msg_type"] === 3 && sidebarData.find((item) => item.other_user_id === parseInt(fdata["sender"]))) {
	// 	setnewLastMessage(fdata["text"]);
	// }
	// };
	// }, [socket]);

	function pinMessgae(e) {
		e.stopPropagation();
		console.log("Pin CLick", data);
	}

	const srcLang = useLangStore((state: { lang: any }) => state.lang);

	return (
		<>
			<div
				onContextMenu={(e) => {
					if (
						(typeof document.hasFocus === "function" && !document.hasFocus()) ||
						!cardActive ||
						cardActiveData["id"] != data["id"]
					)
						return;

					e.preventDefault();
					setAnchorPoint({ x: e.clientX, y: e.clientY });
					setOpen(true);
				}}
			>
				<div
					className={
						"group mb-3 flex cursor-pointer  rounded-2xl px-3 py-4 " +
						`${
							cardActive && cardActiveData["id"] === data["id"]
								? "border border-slate-200 bg-white drop-shadow-lg  dark:bg-gray-900"
								: "border border-transparent border-b-slate-200 last:border-b-0 hover:shadow-highlight dark:border-b-gray-600 dark:hover:bg-gray-900"
						}`
					}
					onClick={() => clickCard(data)}
				>
					<div className="relative h-[50px] w-[50px]">
						<Image
							src={
								process.env.NODE_ENV === "production"
									? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/media/${data["profile"]}`
									: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/media/${data["profile"]}`
							}
							alt="User"
							width={1500}
							height={1500}
							className={
								"h-[50px] w-[50px] rounded-full object-cover" +
								`${
									cardActive && cardActiveData["id"] === data["id"] ? "drop-shadow-lg" : "group-hover:shadow-highlight"
								}`
							}
						/>
						{data["unread_count"] && data["unread_count"] > 0 ? (
							<span className="absolute right-[-5px] top-[-5px] flex h-[21px] w-[21px] items-center justify-center rounded-full bg-primary text-center text-xs font-bold text-white">
								{newUnreadCount != null ? newUnreadCount : data["unread_count"]}
							</span>
						) : (
							<></>
						)}
						{online && (
							<span className="absolute left-[-5px] top-[-5px] flex h-[10px] w-[10px] items-center justify-center rounded-full bg-cyan-500 text-center text-xs font-bold text-white"></span>
						)}
					</div>
					<div className="flex w-[calc(100%-50px)] flex-col justify-center pl-3 pt-1">
						<div className="mb-1 flex justify-between">
							<h5 className="overflow-hidden truncate text-ellipsis text-sm font-semibold">{data["username"]}</h5>
							<div className="flex flex-nowrap gap-2">
								{data["is_pinned"] ? (
									<span
										className="rounded-md  pl-2 text-sm text-gray-700/75 dark:text-gray-600"
										onClick={(e) => pinnedClick(e, data["id"])}
									>
										{/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
											<path
												d="M13.8707 3.19067L10.8081 0.127958C10.6375 -0.0426525 10.3596 -0.0426525 10.189 0.127958L9.97016 0.346791C9.33583 0.981148 9.07976 1.91327 9.28317 2.78386L7.89836 4.16871C6.58801 3.6305 5.08296 3.9215 4.06345 4.94105L3.18848 5.81606C3.01788 5.98667 3.01788 6.26454 3.18848 6.43518L5.06769 8.31219L0.127953 13.2541C-0.0426509 13.4247 -0.0426509 13.7025 0.127953 13.8732C0.213254 13.9562 0.324804 14 0.436349 14C0.547895 14 0.659445 13.9562 0.744746 13.8709L5.68644 8.93098L7.56565 10.8103C7.65095 10.8933 7.7625 10.9371 7.87404 10.9371C7.98559 10.9371 8.09714 10.8933 8.18244 10.808L9.05741 9.93296C10.0769 8.91341 10.3678 7.40831 9.82972 6.09791L11.2145 4.71306C12.0852 4.91876 13.015 4.66269 13.6515 4.02604L13.8703 3.8072C14.0432 3.63675 14.0432 3.36099 13.8703 3.19039L13.8707 3.19067ZM11.2369 3.80979C11.0771 3.75287 10.8999 3.79453 10.7818 3.91264L8.99677 5.69777C8.86111 5.83344 8.83044 6.03899 8.91803 6.20974C9.45837 7.24241 9.26579 8.49144 8.44116 9.31628L7.87441 9.88075L4.11826 6.12445L4.68485 5.55784C5.50963 4.73303 6.7588 4.54274 7.79128 5.08096C7.96189 5.1684 8.16759 5.13788 8.30323 5.00221L10.0883 3.21708C10.2064 3.09897 10.2481 2.9218 10.1911 2.76204C9.98117 2.16706 10.1014 1.52384 10.504 1.05778L12.9409 3.49485C12.4729 3.89742 11.8318 4.01764 11.2369 3.80979Z"
												fill="white"
											/>
										</svg> */}
										<i className="fa-solid fa-thumbtack"></i>
									</span>
								) : (
									<span
										className="rounded-md pl-2 text-sm text-gray-400 dark:text-gray-600"
										onClick={(e) => pinnedClick(e, data["id"])}
									>
										{/* <svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 14 14"
											fill="none"
											className="fill-gray-700 dark:fill-white"
										>
											<path
												d="M13.8707 3.19067L10.8081 0.127958C10.6375 -0.0426525 10.3596 -0.0426525 10.189 0.127958L9.97016 0.346791C9.33583 0.981148 9.07976 1.91327 9.28317 2.78386L7.89836 4.16871C6.58801 3.6305 5.08296 3.9215 4.06345 4.94105L3.18848 5.81606C3.01788 5.98667 3.01788 6.26454 3.18848 6.43518L5.06769 8.31219L0.127953 13.2541C-0.0426509 13.4247 -0.0426509 13.7025 0.127953 13.8732C0.213254 13.9562 0.324804 14 0.436349 14C0.547895 14 0.659445 13.9562 0.744746 13.8709L5.68644 8.93098L7.56565 10.8103C7.65095 10.8933 7.7625 10.9371 7.87404 10.9371C7.98559 10.9371 8.09714 10.8933 8.18244 10.808L9.05741 9.93296C10.0769 8.91341 10.3678 7.40831 9.82972 6.09791L11.2145 4.71306C12.0852 4.91876 13.015 4.66269 13.6515 4.02604L13.8703 3.8072C14.0432 3.63675 14.0432 3.36099 13.8703 3.19039L13.8707 3.19067ZM11.2369 3.80979C11.0771 3.75287 10.8999 3.79453 10.7818 3.91264L8.99677 5.69777C8.86111 5.83344 8.83044 6.03899 8.91803 6.20974C9.45837 7.24241 9.26579 8.49144 8.44116 9.31628L7.87441 9.88075L4.11826 6.12445L4.68485 5.55784C5.50963 4.73303 6.7588 4.54274 7.79128 5.08096C7.96189 5.1684 8.16759 5.13788 8.30323 5.00221L10.0883 3.21708C10.2064 3.09897 10.2481 2.9218 10.1911 2.76204C9.98117 2.16706 10.1014 1.52384 10.504 1.05778L12.9409 3.49485C12.4729 3.89742 11.8318 4.01764 11.2369 3.80979Z"
												// fill="#3E3E3E"
											/>
										</svg> */}
										<i className="fa-solid fa-thumbtack rotate-45"></i>
									</span>
								)}
								{data["last_message"] && (
									<span className="block overflow-hidden truncate text-ellipsis rounded px-2 py-1 text-[10px] font-semibold dark:bg-gray-600">
										{/* {moment(data["modified"]).format("h:mm a")} */}
										{moment(data["last_message"]["sent"]).fromNow()}
									</span>
								)}
							</div>
						</div>
						{data["other_user_type"] ? (
							<>
								<p className="clamp_2 text-[12px] text-darkGray">
									User Is Typing ...
									{/* {isTyping === false && "User Stopped Typing ..."} */}
								</p>
							</>
						) : (
							<>
								{data["last_message"] && (
									<p className="clamp_2 text-[12px] text-darkGray">
										{data["last_message"]["isRecall"] ? (
											<>
												{data["last_message"]["out"] ? (
													<>{srcLang === "ja" ? "あなたはメッセージを取り消しました。" : "You recalled a message."}</>
												) : (
													<>
														{srcLang === "ja" ? "ユーザーがメッセージを取り消しました。" : "User recalled a message."}
													</>
												)}
											</>
										) : (
											<>
												{data["last_message"]["file"] ||
												data["last_message"]["media"] ||
												data["last_message"]["contact"] ? (
													<>
														{data["last_message"]["file"] && <i className="fa-solid fa-file"></i>}
														{data["last_message"]["media"] && <i className="fa-regular fa-image"></i>}
														{data["last_message"]["contact"] && <i className="fa-solid fa-id-card"></i>}
														&nbsp;
														{data["last_message"]["file"] ? (
															data["last_message"]["file"]["name"]
														) : (
															<>
																{data["last_message"]["media"]
																	? data["last_message"]["media"]["name"]
																	: "Contact Card ..."}
															</>
														)}
													</>
												) : (
													<p className="overflow-hidden truncate text-ellipsis ">
														{newLastMessage != null ? newLastMessage : data["last_message"]["text"]}
													</p>
												)}
											</>
										)}
									</p>
								)}
							</>
						)}
					</div>
				</div>

				<ControlledMenu
					anchorPoint={anchorPoint}
					state={isOpen ? "open" : "closed"}
					direction="right"
					onClose={() => setOpen(false)}
					theming={theme === "dark" ? "dark" : undefined}
				>
					<MenuItem value="Mute" onClick={(e) => console.log(`[MenuItem] ${e.value} clicked`)}>
						<i className="fa-solid fa-volume-xmark"></i>&nbsp;&nbsp;Mute
					</MenuItem>
					<MenuItem value="Delete" onClick={(e) => console.log(`[MenuItem] ${e.value} clicked`)}>
						<i className="fa-solid fa-trash"></i>&nbsp;&nbsp;Delete Chat
					</MenuItem>
					<MenuItem value="MarkAsRead" onClick={(e) => console.log(`[MenuItem] ${e.value} clicked`)}>
						<i className="fa-solid fa-check-double"></i>&nbsp;&nbsp;Mark As Read
					</MenuItem>
				</ControlledMenu>
			</div>
			<Transition.Root show={muteChat} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setmuteChat}>
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
								<Dialog.Panel className="relative w-auto transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-lg">
									<div className="flex items-center justify-center justify-between gap-2 px-8 py-3">
										<h4 className="flex items-center font-semibold leading-none">Mute this chat for</h4>
										<button type="button" className="hover:text-gray-700" onClick={() => setmuteChat(false)}>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div>
										<div>
											<input type="radio" id="mute" checked />
											<label htmlFor="mute">For 1 Hours</label>
										</div>
										<div>
											<input type="radio" id="mute" checked />
											<label htmlFor="mute">For 8 Hours</label>
										</div>
										<div>
											<input type="radio" id="mute" checked />
											<label htmlFor="mute">For 24 Hours</label>
										</div>
										<div>
											<input type="radio" id="mute" checked />
											<label htmlFor="mute">Always</label>
										</div>
									</div>
									{/* <div className="p-8">
										<h3 className="mb-4 text-center text-lg font-bold">Are you sure want to delete this group?</h3>
										<div className="flex flex-wrap justify-center">
											<div className="my-1 mr-4 last:mr-0">
												<Button btnStyle="danger" label="No" />
											</div>
											<div className="my-1 mr-4 last:mr-0">
												<Button label="Yes" />
											</div>
										</div>
									</div> */}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}
