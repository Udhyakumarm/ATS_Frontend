import React, { useEffect, useState, Fragment, useRef } from "react";
import { Dialog, Menu, Tab, Transition } from "@headlessui/react";
import Image from "next/image";
import FormField from "@/components/FormField";
import userImg1 from "/public/images/user-image1.jpeg";
import Button from "@/components/Button";
import AutoTextarea from "@/components/organization/AutoTextarea";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import moment from "moment";

export default function InboxCard({
	pin,
	count,
	data,
	setcardActive,
	setcardActiveData,
	cardActive,
	cardActiveData,
	socket,
	pinnedClick,
	callbackOnline,
	onlinePK,
	setonlinePK,
	sidebarData
}: any) {
	function contextClick(e: any, data: any) {
		// var data = data.copy;
		// setmuteChat(true);
		// if (data === "Mute") {
		// }
	}
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
		} else {
			setcardActive(false);
			setcardActiveData({});
		}
	}

	// useEffect(() => {
	socket.onmessage = function (e) {
		var fdata = JSON.parse(e.data);
		// console.log("^^^", "eee data", data);
		console.log("^^^", "eee", fdata);

		if (fdata["msg_type"] === 1 && sidebarData.find((item) => item.other_user_id === parseInt(fdata["user_pk"]))) {
			if (!onlinePK.includes(parseInt(fdata["user_pk"]))) {
				setonlinePK([...onlinePK, parseInt(fdata["user_pk"])]);
				console.log("^^^", "**", onlinePK);
			}
			// setonline(true);
			console.log("^^^", "** RUNNNNNNNNNNNNN");
			callbackOnline(socket, fdata["user_pk"]);
		}
		if (fdata["msg_type"] === 2 && sidebarData.find((item) => item.other_user_id === parseInt(fdata["user_pk"]))) {
			// setonline(false);
			if (onlinePK.includes(parseInt(fdata["user_pk"]))) {
				const updatedItems = onlinePK.filter((existingItem) => existingItem !== parseInt(fdata["user_pk"]));
				setonlinePK(updatedItems);
				console.log("^^^", "**", onlinePK);
			}
		}
		if (fdata["msg_type"] === 5 && parseInt(fdata["user_pk"]) === data["other_user_id"]) {
			setisTyping(true);
		}
		if (fdata["msg_type"] === 10 && parseInt(fdata["user_pk"]) === data["other_user_id"]) {
			setisTyping(false);
			setTimeout(() => {
				setisTyping(null);
			}, 1000);
		}
		if (fdata["msg_type"] === 9 && parseInt(fdata["sender"]) === data["other_user_id"]) {
			setnewUnreadCount(fdata["unread_count"]);
		}
		if (fdata["msg_type"] === 3 && parseInt(fdata["sender"]) === data["other_user_id"]) {
			setnewLastMessage(fdata["text"]);
		}
	};
	// }, [socket]);

	useEffect(() => {
		console.log("^^^", "**", "onlinePK", onlinePK);
	}, [onlinePK]);

	function pinMessgae(e) {
		e.stopPropagation();
		console.log("Pin CLick", data);
	}

	return (
		<>
			<ContextMenuTrigger id={`${cardActive && cardActiveData["id"] === data["id"] ? "contextmenu" : ""}`}>
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
						{/* {data["unread_count"] && data["unread_count"] > 0 && ( */}
						<span className="absolute right-[-5px] top-[-5px] flex h-[21px] w-[21px] items-center justify-center rounded-full bg-primary text-center text-xs font-bold text-white">
							{newUnreadCount != null ? newUnreadCount : data["unread_count"]}
						</span>
						{/* )} */}
						{onlinePK.includes(data["other_user_id"]) && (
							<span className="absolute left-[-5px] top-[-5px] flex h-[10px] w-[10px] items-center justify-center rounded-full bg-cyan-500 text-center text-xs font-bold text-white"></span>
						)}
					</div>
					<div className="w-[calc(100%-50px)] pl-3 pt-1">
						<div className="mb-2 flex justify-between">
							<h5 className="overflow-hidden truncate text-ellipsis text-sm font-semibold">{data["username"]}</h5>
							<div className="flex flex-nowrap gap-2">
								{data["is_pinned"] ? (
									<span className="rounded-md bg-primary p-1" onClick={(e) => pinnedClick(e, data["id"])}>
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
											<path
												d="M13.8707 3.19067L10.8081 0.127958C10.6375 -0.0426525 10.3596 -0.0426525 10.189 0.127958L9.97016 0.346791C9.33583 0.981148 9.07976 1.91327 9.28317 2.78386L7.89836 4.16871C6.58801 3.6305 5.08296 3.9215 4.06345 4.94105L3.18848 5.81606C3.01788 5.98667 3.01788 6.26454 3.18848 6.43518L5.06769 8.31219L0.127953 13.2541C-0.0426509 13.4247 -0.0426509 13.7025 0.127953 13.8732C0.213254 13.9562 0.324804 14 0.436349 14C0.547895 14 0.659445 13.9562 0.744746 13.8709L5.68644 8.93098L7.56565 10.8103C7.65095 10.8933 7.7625 10.9371 7.87404 10.9371C7.98559 10.9371 8.09714 10.8933 8.18244 10.808L9.05741 9.93296C10.0769 8.91341 10.3678 7.40831 9.82972 6.09791L11.2145 4.71306C12.0852 4.91876 13.015 4.66269 13.6515 4.02604L13.8703 3.8072C14.0432 3.63675 14.0432 3.36099 13.8703 3.19039L13.8707 3.19067ZM11.2369 3.80979C11.0771 3.75287 10.8999 3.79453 10.7818 3.91264L8.99677 5.69777C8.86111 5.83344 8.83044 6.03899 8.91803 6.20974C9.45837 7.24241 9.26579 8.49144 8.44116 9.31628L7.87441 9.88075L4.11826 6.12445L4.68485 5.55784C5.50963 4.73303 6.7588 4.54274 7.79128 5.08096C7.96189 5.1684 8.16759 5.13788 8.30323 5.00221L10.0883 3.21708C10.2064 3.09897 10.2481 2.9218 10.1911 2.76204C9.98117 2.16706 10.1014 1.52384 10.504 1.05778L12.9409 3.49485C12.4729 3.89742 11.8318 4.01764 11.2369 3.80979Z"
												fill="white"
											/>
										</svg>
									</span>
								) : (
									<span
										className="rounded-md bg-gray-200 p-1 dark:bg-gray-600 "
										onClick={(e) => pinnedClick(e, data["id"])}
									>
										<svg
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
										</svg>
									</span>
								)}
								<span className="block overflow-hidden truncate text-ellipsis rounded bg-gray-200 px-2 py-1 text-[10px] font-semibold dark:bg-gray-600">
									{/* {moment(data["modified"]).format("h:mm a")} */}
									{moment(data["modified"]).fromNow()}
								</span>
							</div>
						</div>
						{isTyping != null ? (
							<>
								<p className="clamp_2 text-[12px] text-darkGray">
									{isTyping === true && "User Is Typing ..."}
									{isTyping === false && "User Stopped Typing ..."}
								</p>
							</>
						) : (
							<>
								{data["last_message"] && (
									<p className="clamp_2 text-[12px] text-darkGray">
										{data["last_message"]["file"] || data["last_message"]["media"] ? (
											<>
												<i className="fa-solid fa-file"></i>&nbsp;
												{data["last_message"]["file"]
													? data["last_message"]["file"]["name"]
													: data["last_message"]["media"]["name"]}
											</>
										) : (
											<p className="overflow-hidden truncate text-ellipsis ">
												{newLastMessage != null ? newLastMessage : data["last_message"]["text"]}
											</p>
										)}
									</p>
								)}
							</>
						)}
					</div>
				</div>
			</ContextMenuTrigger>
			{cardActive && cardActiveData["id"] === data["id"] && (
				<ContextMenu id="contextmenu" className="rounded-lg border-2 bg-white py-4 shadow-lg dark:bg-gray-700">
					<MenuItem
						data={{ text: "Mute" }}
						onClick={contextClick}
						className="flex cursor-pointer items-center gap-2 p-2  px-3 hover:bg-lightBlue hover:dark:bg-gray-900"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="10"
							viewBox="0 0 16 10"
							fill="none"
							className="fill-black dark:fill-white"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M4.51268 7.85393C4.46382 7.86923 4.41188 7.8774 4.35788 7.8774H2.3007C1.44851 7.8774 0.757812 7.19222 0.757812 6.34685V3.28577C0.757812 2.4404 1.44851 1.75523 2.3007 1.75523H4.35788C4.41188 1.75523 4.46382 1.76339 4.51268 1.7787L8.4059 0.12367C8.88265 -0.0788714 9.42986 -0.0304089 9.8629 0.252741C10.2959 0.535892 10.5567 1.01598 10.5567 1.53024V8.10238C10.5567 8.61665 10.2959 9.09673 9.8629 9.37988C9.42986 9.66303 8.88265 9.7115 8.4059 9.50895L4.51268 7.85393ZM4.87217 6.89632L8.81116 8.57124C8.97008 8.63859 9.15214 8.62226 9.29665 8.52787C9.44117 8.43349 9.52809 8.2738 9.52809 8.10238V1.53024C9.52809 1.35882 9.44117 1.19913 9.29665 1.10475C9.15214 1.01037 8.97008 0.994037 8.81116 1.06138L4.87217 2.73631V6.89632ZM3.84358 2.77559H2.3007C2.01681 2.77559 1.7864 3.00415 1.7864 3.28577V6.34685C1.7864 6.62847 2.01681 6.85704 2.3007 6.85704H3.84358V2.77559ZM12.3737 4.81631L11.1944 3.64647C10.9938 3.4475 10.9938 3.12404 11.1944 2.92507C11.395 2.7261 11.721 2.7261 11.9216 2.92507L13.1009 4.09492L14.2802 2.92507C14.4808 2.7261 14.8068 2.7261 15.0074 2.92507C15.208 3.12404 15.208 3.4475 15.0074 3.64647L13.8281 4.81631L15.0074 5.98616C15.208 6.18513 15.208 6.50858 15.0074 6.70755C14.8068 6.90652 14.4808 6.90652 14.2802 6.70755L13.1009 5.53771L11.9216 6.70755C11.721 6.90652 11.395 6.90652 11.1944 6.70755C10.9938 6.50858 10.9938 6.18513 11.1944 5.98616L12.3737 4.81631Z"
								// fill="#484848"
							/>
						</svg>
						<span>Mute</span>
					</MenuItem>
					<MenuItem
						data={{ text: "Delete" }}
						onClick={contextClick}
						className="flex cursor-pointer items-center gap-2 p-2  px-3 hover:bg-lightBlue hover:dark:bg-gray-900"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							className="fill-black dark:fill-white"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M1.59998 2.40155V10.0015C1.59998 10.5318 1.81078 11.0407 2.1856 11.4158C2.56077 11.7906 3.06961 12.0014 3.59996 12.0014H8.39991C8.93026 12.0014 9.4391 11.7906 9.81427 11.4158C10.1891 11.0407 10.3999 10.5318 10.3999 10.0015V2.40155H11.5999C11.8207 2.40155 11.9999 2.22236 11.9999 2.00156C11.9999 1.78076 11.8207 1.60156 11.5999 1.60156H0.399996C0.179193 1.60156 0 1.78076 0 2.00156C0 2.22236 0.179193 2.40155 0.399996 2.40155H1.59998ZM9.5999 2.40155V10.0015C9.5999 10.3199 9.47347 10.625 9.24829 10.8499C9.02347 11.075 8.71828 11.2015 8.39991 11.2015H3.59996C3.28156 11.2015 2.9764 11.075 2.75158 10.8499C2.5264 10.625 2.39997 10.3198 2.39997 10.0015V2.40155H9.5999Z"
								// fill="#484848"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M3.99961 0.799991H7.99956C8.22036 0.799991 8.39956 0.620798 8.39956 0.399996C8.39956 0.179193 8.22036 0 7.99956 0H3.99961C3.7788 0 3.59961 0.179193 3.59961 0.399996C3.59961 0.620798 3.7788 0.799991 3.99961 0.799991Z"
								// fill="#484848"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M4.40234 4.4039V9.20385C4.40234 9.42465 4.58154 9.60385 4.80234 9.60385C5.02314 9.60385 5.20234 9.42465 5.20234 9.20385V4.4039C5.20234 4.1831 5.02314 4.00391 4.80234 4.00391C4.58154 4.00391 4.40234 4.1831 4.40234 4.4039Z"
								// fill="#484848"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M6.80078 4.4039V9.20385C6.80078 9.42465 6.97997 9.60385 7.20078 9.60385C7.42158 9.60385 7.60077 9.42465 7.60077 9.20385V4.4039C7.60077 4.1831 7.42158 4.00391 7.20078 4.00391C6.97997 4.00391 6.80078 4.1831 6.80078 4.4039Z"
								// fill="#484848"
							/>
						</svg>
						<span>Delete Chat</span>
					</MenuItem>
					<MenuItem
						data={{ text: "Read" }}
						onClick={contextClick}
						className="flex cursor-pointer items-center gap-2 p-2 px-3 hover:bg-lightBlue hover:dark:bg-gray-900"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="17"
							height="11"
							viewBox="0 0 17 11"
							fill="none"
							className="fill-black dark:fill-white"
						>
							<path
								d="M11.3672 0.162361C11.0737 -0.0839503 10.6353 -0.0457015 10.3887 0.24781L3.58793 8.35246L1.22642 5.53834C0.979969 5.2451 0.542144 5.20658 0.24809 5.45289C-0.0456926 5.69947 -0.084077 6.13757 0.162505 6.43135L3.05598 9.87943C3.18795 10.0365 3.38272 10.1274 3.58793 10.1274C3.79315 10.1274 3.98792 10.0365 4.11989 9.87943L11.4527 1.14082C11.6992 0.847039 11.661 0.408943 11.3672 0.162361Z"
								// fill="#484848"
							/>
							<path
								d="M15.7628 0.162361C15.469 -0.0839503 15.0309 -0.0457015 14.7843 0.24781L7.98366 8.35274L7.70493 8.0207C7.45876 7.72665 7.02039 7.68813 6.72661 7.93498C6.43282 8.18129 6.39444 8.61939 6.64102 8.91317L7.45184 9.87943C7.58381 10.0368 7.77858 10.1274 7.98379 10.1274C8.18901 10.1274 8.38378 10.0365 8.51561 9.87943L15.8482 1.14082C16.0948 0.846768 16.0566 0.408943 15.7628 0.162361Z"
								// fill="#484848"
							/>
						</svg>
						<span>Mark as read</span>
					</MenuItem>
				</ContextMenu>
			)}
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
