import React, { useEffect, useState, Fragment, useRef } from "react";
import Image from "next/image";
import FormField from "@/components/FormField";
import userImg1 from "/public/images/user-image1.jpeg";
import { Dialog, Menu, Tab, Transition, Popover } from "@headlessui/react";
import moment from "moment";
import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/theme-dark.css";
import { useTheme } from "next-themes";

export default function InboxChatMsg({ type, data, delMsg, editMsg }: any) {
	const { theme, setTheme } = useTheme();
	const [isOpen, setOpen] = useState(false);
	const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

	function handleContextClick(e) {
		console.log(`[MenuItem] ${e.value} clicked`);
		if (e.value === "DeleteMe") {
			delMsg(data["id"]);
		}
		if (e.value === "EditMe") {
			editMsg(data["id"], data["text"]);
		}
	}

	const generateRandomGradient = () => {
		// Generate random color values for a linear gradient
		const color1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
		const color2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

		// Generate a random gradient direction
		const directions = ["to right", "to left", "to top", "to bottom"];
		const randomDirection = directions[Math.floor(Math.random() * directions.length)];

		// Create the linear gradient CSS property
		const newGradient = `linear-gradient(${randomDirection}, ${color1}, ${color2})`;

		// Update the state with the new gradient
		return newGradient;
	};

	return (
		<>
			{type === "user" && (
				<>
					<div className="group flex w-full cursor-default items-end py-1">
						<div className="flex max-w-[80%] cursor-default flex-row flex-nowrap items-end">
							<Image
								src={
									process.env.NODE_ENV === "production"
										? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/media/${data["sender_profile"]}`
										: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/media/${data["sender_profile"]}`
								}
								alt="User"
								width={150}
								height={150}
								className="h-[35px] w-[35px] rounded-full object-cover shadow-highlight"
							/>
							<div
								onContextMenu={(e) => {
									if (typeof document.hasFocus === "function" && !document.hasFocus()) return;

									e.preventDefault();
									setAnchorPoint({ x: e.clientX, y: e.clientY });
									setOpen(true);
								}}
							>
								<div className="ml-2 mr-3 rounded-xl bg-stone-300/25 px-3 py-2">
									<article className="text-lg text-darkGray dark:text-lightBlue ">
										{data["file"] && (
											<>
												<button
													onClick={() => {
														window.open(
															process.env.NODE_ENV === "production"
																? `${process.env.NEXT_PUBLIC_PROD_BACKEND}${data["file"]["url"]}`
																: `${process.env.NEXT_PUBLIC_DEV_BACKEND}${data["file"]["url"]}`,
															"_blank"
														);
													}}
													className={
														`flex items-center gap-2 rounded bg-stone-300/50 px-4 py-2 text-[15px]` +
														" " +
														`${(data["media"] || data["contact"] || data["text"]) && "mb-2"}`
													}
												>
													<i className="fa-regular fa-file text-[30px]"></i>
													<b>{data["file"]["name"]}</b>
												</button>
											</>
										)}
										{data["media"] && (
											<>
												<button
													onClick={() => {
														window.open(
															process.env.NODE_ENV === "production"
																? `${process.env.NEXT_PUBLIC_PROD_BACKEND}${data["media"]["url"]}`
																: `${process.env.NEXT_PUBLIC_DEV_BACKEND}${data["media"]["url"]}`,
															"_blank"
														);
													}}
													className={
														`flex items-center gap-2 rounded bg-stone-300/50 px-4 py-2 text-[15px]` +
														" " +
														`${(data["text"] || data["contact"]) && "mb-2"}`
													}
												>
													<i className="fa-regular fa-image text-[30px]"></i>
													<b>{data["media"]["name"]}</b>
												</button>
											</>
										)}

										{data["contact"] && (
											<>
												<Popover className="relative">
													{({ open }) => (
														<>
															<Popover.Button
																className={
																	`flex items-center gap-2 rounded bg-stone-300/50 px-4 py-2 text-[15px]` +
																	" " +
																	`${data["text"] && "mb-2"}`
																}
															>
																<i className="fa-solid fa-id-card text-[30px]"></i>
																<b>{data["contact"]["name"] ? data["contact"]["name"] : "Contact Card"}</b>
															</Popover.Button>
															<Transition
																as={Fragment}
																enter="transition ease-out duration-200"
																enterFrom="opacity-0 translate-y-1"
																enterTo="opacity-100 translate-y-0"
																leave="transition ease-in duration-150"
																leaveFrom="opacity-100 translate-y-0"
																leaveTo="opacity-0 translate-y-1"
															>
																<Popover.Panel className="absolute bottom-0 left-[20vw] z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-4 sm:px-0">
																	<div className="relative flex w-auto flex-col rounded-xl bg-white bg-clip-border text-gray-700 drop-shadow-lg dark:bg-gray-900">
																		<div
																			className="bg-blue-gray-500 relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-border text-white shadow-lg shadow-blue-500/50"
																			// style={{ background: generateRandomGradient() }}
																		>
																			<div className="absolute right-[calc(50%-50px)] top-[calc(50%-50px)]">
																				<Image
																					src={
																						process.env.NODE_ENV === "production"
																							? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/media/${data["contact"]["profile"]}`
																							: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/media/${data["contact"]["profile"]}`
																					}
																					alt={"ABC"}
																					width={100}
																					height={100}
																					className="h-[100px] w-[100px] rounded-full border-4 border-white object-cover"
																				/>
																			</div>
																		</div>
																		<div className="p-6">
																			<h5 className="text-blue-gray-900 mb-2 block font-sans text-xl font-semibold capitalize leading-snug tracking-normal antialiased dark:text-lightBlue">
																				{data["contact"]["name"]}
																			</h5>
																			<p className="text-blue-gray-900 mb-2 block font-sans text-sm capitalize leading-snug tracking-normal antialiased dark:text-lightBlue">
																				{data["contact"]["title"]}
																			</p>
																			<hr className="dark:border-lightBlue/50" />
																			<p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased dark:text-lightBlue">
																				<div className="flex flex-col gap-2">
																					<div className="flex justify-between gap-2">
																						<b>Email</b>
																						<p>{data["contact"]["email"] ? data["contact"]["email"] : "N/A"}</p>
																					</div>
																					<div className="flex justify-between gap-2">
																						<b>Deparment</b>
																						<p>
																							{data["contact"]["department"] ? data["contact"]["department"] : "N/A"}
																						</p>
																					</div>
																					<div className="flex justify-between gap-2">
																						<b>Role</b>
																						<p>{data["contact"]["role"] ? data["contact"]["role"] : "N/A"}</p>
																					</div>
																				</div>
																			</p>
																		</div>
																	</div>
																</Popover.Panel>
															</Transition>
														</>
													)}
												</Popover>
											</>
										)}

										{data["text"] && data["text"].length > 0 && <p className="text-left">{data["text"]}</p>}
									</article>
								</div>

								<ControlledMenu
									anchorPoint={anchorPoint}
									state={isOpen ? "open" : "closed"}
									direction="right"
									onClose={() => setOpen(false)}
									theming={theme === "dark" ? "dark" : undefined}
								>
									<MenuItem value="ReplyOther" onClick={(e) => handleContextClick(e)}>
										<i className="fa-solid fa-reply"></i>&nbsp;&nbsp;Reply
									</MenuItem>
									<MenuItem value="RecallOther" onClick={(e) => handleContextClick(e)}>
										<i className="fa-regular fa-message"></i>&nbsp;&nbsp;Recall
									</MenuItem>
								</ControlledMenu>
							</div>

							{data["isEdit"] && <p className="pr-2 text-sm">edited</p>}
							<h4 className="mb-2 hidden whitespace-nowrap text-[10px] font-bold text-darkGray group-hover:block dark:text-gray-400">
								{moment(data["sent"]).format("h:mm a")}
							</h4>
						</div>
					</div>
				</>
			)}

			{type === "me" && (
				<>
					<div className="group flex w-full cursor-default flex-row-reverse items-end py-1">
						<div className="flex max-w-[80%] cursor-default flex-row-reverse flex-nowrap items-end">
							<Image
								src={
									process.env.NODE_ENV === "production"
										? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/media/${data["sender_profile"]}`
										: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/media/${data["sender_profile"]}`
								}
								alt="User"
								width={150}
								height={150}
								className="h-[35px] w-[35px] rounded-full object-cover shadow-highlight"
							/>
							<div
								onContextMenu={(e) => {
									if (typeof document.hasFocus === "function" && !document.hasFocus()) return;

									e.preventDefault();
									setAnchorPoint({ x: e.clientX, y: e.clientY });
									setOpen(true);
								}}
							>
								<div className="ml-2 mr-3 rounded-xl bg-sky-300/25 px-3 py-3">
									<article className="text-lg text-darkGray dark:text-lightBlue ">
										{data["file"] && (
											<>
												<button
													onClick={() => {
														window.open(
															process.env.NODE_ENV === "production"
																? `${process.env.NEXT_PUBLIC_PROD_BACKEND}${data["file"]["url"]}`
																: `${process.env.NEXT_PUBLIC_DEV_BACKEND}${data["file"]["url"]}`,
															"_blank"
														);
													}}
													className={
														`flex items-center gap-2 rounded-lg bg-sky-300/25 px-4 py-2 text-[15px]` +
														" " +
														`${(data["media"] || data["contact"] || data["text"]) && "mb-2"}`
													}
												>
													<i className="fa-regular fa-file text-[30px]"></i>
													<b>{data["file"]["name"]}</b>
												</button>
											</>
										)}

										{data["media"] && (
											<>
												<button
													onClick={() => {
														window.open(
															process.env.NODE_ENV === "production"
																? `${process.env.NEXT_PUBLIC_PROD_BACKEND}${data["media"]["url"]}`
																: `${process.env.NEXT_PUBLIC_DEV_BACKEND}${data["media"]["url"]}`,
															"_blank"
														);
													}}
													className={
														`flex items-center gap-2 rounded-lg bg-sky-300/25 px-4 py-2 text-[15px]` +
														" " +
														`${(data["text"] || data["contact"]) && "mb-2"}`
													}
												>
													<i className="fa-regular fa-image text-[30px]"></i>
													<b>{data["media"]["name"]}</b>
												</button>
											</>
										)}

										{data["contact"] && (
											<>
												<Popover className="relative">
													{({ open }) => (
														<>
															<Popover.Button
																className={
																	`flex items-center gap-2 rounded-lg bg-sky-300/25 px-4 py-2 shadow-md  shadow-blue-400` +
																	" " +
																	`${data["text"] && "mb-2"}`
																}
															>
																<i className="fa-solid fa-id-card text-[30px]"></i>
																<p>{data["contact"]["name"] ? data["contact"]["name"] : "Contact Card"}</p>
															</Popover.Button>
															<Transition
																as={Fragment}
																enter="transition ease-out duration-200"
																enterFrom="opacity-0 translate-y-1"
																enterTo="opacity-100 translate-y-0"
																leave="transition ease-in duration-150"
																leaveFrom="opacity-100 translate-y-0"
																leaveTo="opacity-0 translate-y-1"
															>
																<Popover.Panel className="absolute bottom-0 right-0 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-4 sm:px-0">
																	<div className="relative flex w-auto flex-col rounded-xl bg-white bg-clip-border text-gray-700 drop-shadow-lg dark:bg-gray-900">
																		<div
																			className="bg-blue-gray-500 relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-border text-white shadow-lg shadow-blue-500/50"
																			// style={{ background: generateRandomGradient() }}
																		>
																			<div className="absolute right-[calc(50%-50px)] top-[calc(50%-50px)]">
																				<Image
																					src={
																						process.env.NODE_ENV === "production"
																							? `${process.env.NEXT_PUBLIC_PROD_BACKEND}/media/${data["contact"]["profile"]}`
																							: `${process.env.NEXT_PUBLIC_DEV_BACKEND}/media/${data["contact"]["profile"]}`
																					}
																					alt={"ABC"}
																					width={100}
																					height={100}
																					className="h-[100px] w-[100px] rounded-full border-4 border-white object-cover"
																				/>
																			</div>
																		</div>
																		<div className="p-6">
																			<h5 className="text-blue-gray-900 mb-2 block font-sans text-xl font-semibold capitalize leading-snug tracking-normal antialiased dark:text-lightBlue">
																				{data["contact"]["name"]}
																			</h5>
																			<p className="text-blue-gray-900 mb-2 block font-sans text-sm capitalize leading-snug tracking-normal antialiased dark:text-lightBlue">
																				{data["contact"]["title"]}
																			</p>
																			<hr className="dark:border-lightBlue/50" />
																			<p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased dark:text-lightBlue">
																				<div className="flex flex-col gap-2">
																					<div className="flex justify-between gap-2">
																						<b>Email</b>
																						<p>{data["contact"]["email"] ? data["contact"]["email"] : "N/A"}</p>
																					</div>
																					<div className="flex justify-between gap-2">
																						<b>Deparment</b>
																						<p>
																							{data["contact"]["department"] ? data["contact"]["department"] : "N/A"}
																						</p>
																					</div>
																					<div className="flex justify-between gap-2">
																						<b>Role</b>
																						<p>{data["contact"]["role"] ? data["contact"]["role"] : "N/A"}</p>
																					</div>
																				</div>
																			</p>
																		</div>
																	</div>
																</Popover.Panel>
															</Transition>
														</>
													)}
												</Popover>
											</>
										)}

										{data["text"] && data["text"].length > 0 && <p className="text-right">{data["text"]}</p>}
									</article>
								</div>

								<ControlledMenu
									anchorPoint={anchorPoint}
									state={isOpen ? "open" : "closed"}
									direction="right"
									onClose={() => setOpen(false)}
									theming={theme === "dark" ? "dark" : undefined}
								>
									<MenuItem value="ReplyMe" onClick={(e) => handleContextClick(e)}>
										<i className="fa-solid fa-reply"></i>&nbsp;&nbsp;Reply
									</MenuItem>
									<MenuItem value="RecallMe" onClick={(e) => handleContextClick(e)}>
										<i className="fa-regular fa-message"></i>&nbsp;&nbsp;Recall
									</MenuItem>
									{data["text"] && data["text"].length > 0 && (
										<MenuItem value="EditMe" onClick={(e) => handleContextClick(e)}>
											<i className="fa-solid fa-pencil"></i>&nbsp;&nbsp;Edit
										</MenuItem>
									)}
									<MenuItem value="DeleteMe" onClick={(e) => handleContextClick(e)}>
										<i className="fa-solid fa-trash"></i>&nbsp;&nbsp;Delete
									</MenuItem>
								</ControlledMenu>
							</div>
							{data["isEdit"] && <p className="pl-2 text-sm">edited</p>}
							<h4 className="mb-2 hidden whitespace-nowrap text-[10px] font-bold text-darkGray group-hover:block dark:text-gray-400">
								{moment(data["sent"]).format("h:mm a")}
							</h4>
						</div>
					</div>
				</>
			)}

			{type === "reply" && (
				<div className="group flex items-start py-4">
					<Image
						src={userImg1}
						alt="User"
						width={150}
						className="h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
					/>
					<div className="ml-2 rounded-2xl py-4 pl-2">
						<h4 className="mb-2 font-bold">
							Me
							<span className="pl-3 text-[10px] text-darkGray dark:text-gray-400">4:27 PM</span>
						</h4>
						<article className="text-sm text-darkGray dark:text-gray-400">
							Lorem ipsum dolor sit amet consectetur. Pellentesque sagittis sed dictum lorem. Neque eget faucibus dolor
							risus posuere vitae sodales. Sit odio morbi dolor egestas sit aliquam velit cum. Pharetra tortor sit
							vestibulum
						</article>
						<div className="flex items-center rounded-2xl bg-[#F2FAFF]/[0.5] px-2 py-4  text-darkGray dark:bg-[#F2FAFF]/[0.1] dark:text-gray-400">
							<article className="text-sm">
								<span className="text-primary">@abc&nbsp;</span>
								Lorem ipsum dolor sit amet consectetur. Pellentesque sagittis sed dictum lorem. Neque eget faucibus
								dolor risus posuere vitae sodales. Sit odio morbi dolor egestas sit aliquam velit cum. Pharetra tortor
								sit vestibulum
							</article>

							<Menu as="div" className="hidden group-hover:relative group-hover:block">
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
											"absolute bottom-5 right-0 whitespace-nowrap rounded bg-white py-2 text-darkGray shadow-normal dark:bg-gray-700 dark:text-gray-400"
										}
									>
										<Menu.Item>
											<button
												type="button"
												className="relative flex flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
												// onClick={() => setCreateGroup(true)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="15"
													height="13"
													viewBox="0 0 15 13"
													fill="none"
													className="fill-[#484848] dark:fill-lightBlue/50"
												>
													<path
														d="M13.5937 12.0656C13.4449 12.0637 13.3028 12.0037 13.1976 11.8985C13.0924 11.7933 13.0324 11.6512 13.0304 11.5024C13.0304 8.73857 9.31282 7.35667 6.81939 7.10882C6.77166 7.10386 6.72342 7.10935 6.67802 7.12491C6.63263 7.14048 6.59117 7.16574 6.55653 7.19895C6.51635 7.23157 6.48402 7.27281 6.46192 7.31961C6.43982 7.3664 6.42852 7.41757 6.42885 7.46932C6.42394 7.75172 6.33951 8.02701 6.18525 8.2636C6.03099 8.50019 5.81315 8.68849 5.55673 8.8069C5.30031 8.9253 5.0157 8.96902 4.73556 8.93302C4.45543 8.89702 4.19112 8.78277 3.97297 8.60338L0.518213 5.59925C0.35662 5.45918 0.226798 5.28622 0.13743 5.09194C0.0480611 4.89766 0.00120668 4.68654 0 4.4727C0.00120668 4.25885 0.0480611 4.04773 0.13743 3.85345C0.226798 3.65917 0.35662 3.48621 0.518213 3.34615L3.97297 0.34201C4.19063 0.162981 4.45426 0.0487959 4.73374 0.0125058C5.01322 -0.0237843 5.29727 0.0192845 5.55343 0.13679C5.80959 0.254295 6.02753 0.441496 6.18233 0.676999C6.33714 0.912502 6.42256 1.18681 6.42885 1.46856V1.73893C6.42747 1.81659 6.45175 1.89253 6.49792 1.95499C6.54408 2.01745 6.60956 2.06294 6.6842 2.08441C8.9373 2.64017 14.1945 4.68299 14.1945 11.4949C14.1946 11.5724 14.1789 11.6492 14.1484 11.7205C14.1179 11.7917 14.0731 11.8561 14.0169 11.9095C13.9607 11.9629 13.8941 12.0043 13.8214 12.0311C13.7486 12.058 13.6712 12.0697 13.5937 12.0656ZM6.78935 5.98227H6.93204C8.92339 6.13626 10.8288 6.85827 12.4221 8.06264C11.0928 4.73556 7.9159 3.55643 6.41383 3.17341C6.10306 3.08277 5.82988 2.89416 5.635 2.63567C5.44012 2.37718 5.33396 2.06265 5.33234 1.73893V1.50611C5.33486 1.43622 5.3161 1.36721 5.27855 1.3082C5.241 1.2492 5.18643 1.20298 5.12205 1.17566C5.05976 1.14516 4.98959 1.13456 4.92106 1.14531C4.85254 1.15606 4.78899 1.18763 4.73902 1.23574L1.28427 4.23988C1.24351 4.27366 1.21088 4.31617 1.18877 4.36427C1.16667 4.41237 1.15568 4.46483 1.15659 4.51776C1.15571 4.5696 1.16676 4.62095 1.1889 4.66783C1.21104 4.71472 1.24367 4.75588 1.28427 4.78813L4.73902 7.79227C4.79168 7.83681 4.85601 7.86532 4.92438 7.8744C4.99275 7.88348 5.06229 7.87276 5.12475 7.84351C5.18722 7.81425 5.23997 7.76769 5.27677 7.70936C5.31356 7.65102 5.33285 7.58335 5.33234 7.51438C5.33234 7.11601 5.49059 6.73395 5.77229 6.45226C6.05398 6.17057 6.43604 6.01231 6.83441 6.01231L6.78935 5.98227Z"
														// fill="#484848"
													/>
												</svg>
												<span>Reply</span>
											</button>
										</Menu.Item>

										<Menu.Item>
											<button
												type="button"
												className="relative flex flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
												// onClick={() => setCreateGroup(true)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="11"
													height="11"
													viewBox="0 0 11 11"
													fill="none"
													className="fill-[#484848] dark:fill-lightBlue/50"
												>
													<path
														d="M8.5 0H2.5C2.1717 0 1.84661 0.0646644 1.54329 0.190301C1.23998 0.315938 0.96438 0.500087 0.732233 0.732233C0.263392 1.20107 5.21141e-08 1.83696 5.21141e-08 2.5V6.5C-0.000117575 7.07633 0.198892 7.63499 0.563347 8.08145C0.927802 8.52791 1.43532 8.83473 2 8.95V10C1.99959 10.1977 2.05779 10.3911 2.16726 10.5557C2.27672 10.7204 2.43253 10.8489 2.615 10.925C2.73738 10.9743 2.86806 10.9998 3 11C3.26479 10.9989 3.51832 10.8928 3.705 10.705L5.415 9H8.5C8.82831 9 9.15339 8.93534 9.45671 8.8097C9.76002 8.68406 10.0356 8.49991 10.2678 8.26777C10.4999 8.03562 10.6841 7.76002 10.8097 7.45671C10.9353 7.15339 11 6.82831 11 6.5V2.5C11 2.1717 10.9353 1.84661 10.8097 1.54329C10.6841 1.23998 10.4999 0.96438 10.2678 0.732233C10.0356 0.500087 9.76002 0.315938 9.45671 0.190301C9.15339 0.0646644 8.82831 0 8.5 0ZM10 6.5C10 6.89783 9.84196 7.27936 9.56066 7.56066C9.27936 7.84197 8.89783 8 8.5 8H5.205C5.07383 8.00055 4.94813 8.05263 4.855 8.145L3 10V8.5C3 8.36739 2.94732 8.24021 2.85355 8.14645C2.75979 8.05268 2.63261 8 2.5 8C2.10218 8 1.72064 7.84197 1.43934 7.56066C1.15804 7.27936 1 6.89783 1 6.5V2.5C1 2.10218 1.15804 1.72064 1.43934 1.43934C1.72064 1.15804 2.10218 1 2.5 1H8.5C8.89783 1 9.27936 1.15804 9.56066 1.43934C9.84196 1.72064 10 2.10218 10 2.5V6.5Z"
														// fill="#484848"
													/>
													<path
														d="M8 5.027C8 6.11555 6.87931 7 5.5 7C4.12069 7 3 6.11555 3 5.027C3 3.93845 4.122 3.054 5.5 3.054H7.24634L5.96891 2.18089C5.91536 2.14378 5.90883 2.07884 5.95585 2.03555C6.00418 1.99225 6.08647 1.98813 6.14002 2.02524L7.6826 3.07977C7.71134 3.09936 7.72832 3.12719 7.72832 3.15709C7.72832 3.18698 7.71134 3.21584 7.6826 3.23543L6.14002 4.28996C6.1152 4.30646 6.08516 4.3147 6.05512 4.3147C6.01855 4.3147 5.98197 4.30233 5.95585 4.27965C5.90883 4.23636 5.91536 4.17142 5.96891 4.13431L7.24765 3.26017H5.5C4.26567 3.26017 3.26123 4.05287 3.26123 5.027C3.26123 6.00113 4.26567 6.79384 5.5 6.79384C6.73433 6.79384 7.73877 6.00216 7.73877 5.027C7.73877 4.97031 7.79754 4.92392 7.86938 4.92392C7.94122 4.92392 8 4.97031 8 5.027Z"
														fill="black"
													/>
												</svg>
												<span>Recall</span>
											</button>
										</Menu.Item>

										<Menu.Item>
											<button
												type="button"
												className="relative flex flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
												// onClick={() => setCreateGroup(true)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													viewBox="0 0 12 12"
													fill="none"
													className="fill-[#484848] dark:fill-lightBlue/50"
												>
													<path
														d="M1.31251 12H9.1875C9.5356 12 9.86944 11.8617 10.1156 11.6156C10.3617 11.3694 10.5 11.0356 10.5 10.6875V6.375H9.75V10.6875C9.75 10.8367 9.69074 10.9798 9.58525 11.0852C9.47976 11.1907 9.33669 11.25 9.1875 11.25H1.31251C1.16332 11.25 1.02025 11.1907 0.914758 11.0852C0.809269 10.9798 0.750005 10.8367 0.750005 10.6875V2.8125C0.750005 2.66332 0.809269 2.52024 0.914758 2.41475C1.02025 2.30926 1.16332 2.25 1.31251 2.25H5.62501V1.5H1.31251C0.965057 1.5 0.631785 1.63776 0.385751 1.8831C0.139717 2.12843 0.000998066 2.4613 5.35763e-06 2.80875V10.6838C-0.000488002 10.8564 0.0330967 11.0275 0.0988351 11.1872C0.164573 11.3468 0.261173 11.492 0.383099 11.6143C0.505025 11.7365 0.649881 11.8335 0.809366 11.8997C0.96885 11.9659 1.13983 12 1.31251 12Z"
														// fill="#484848"
													/>
													<path
														d="M11.4066 0.318218C11.1931 0.113985 10.909 0 10.6135 0C10.318 0 10.0339 0.113985 9.82037 0.318218L4.67537 5.45947C4.53227 5.60422 4.42448 5.78003 4.36037 5.97322L3.76787 7.74322C3.74652 7.80034 3.73943 7.8618 3.7472 7.92229C3.75497 7.98277 3.77737 8.04044 3.81246 8.09031C3.84756 8.14018 3.89428 8.18074 3.94859 8.20847C4.0029 8.23621 4.06315 8.25028 4.12412 8.24947C4.16394 8.25487 4.2043 8.25487 4.24412 8.24947L5.99912 7.62697C6.19231 7.56286 6.36812 7.45507 6.51287 7.31197L11.6691 2.17072C11.8798 1.95978 11.9981 1.67384 11.9981 1.37572C11.9981 1.07759 11.8798 0.791656 11.6691 0.580718L11.4066 0.318218ZM11.1404 1.63822L5.99912 6.78322C5.93733 6.84353 5.86309 6.8896 5.78162 6.91822L4.72037 7.27072L5.07287 6.20947C5.10149 6.128 5.14756 6.05376 5.20787 5.99197L10.3491 0.846968C10.4207 0.781792 10.5148 0.746854 10.6116 0.749468C10.71 0.749882 10.8043 0.788939 10.8741 0.858218L11.1404 1.12447C11.2097 1.19432 11.2487 1.28859 11.2491 1.38697C11.2458 1.48143 11.207 1.57117 11.1404 1.63822Z"
														// fill="#484848"
													/>
												</svg>
												<span>Edit</span>
											</button>
										</Menu.Item>

										<Menu.Item>
											<button
												type="button"
												className="relative flex flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-900"
												// onClick={() => setCreateGroup(true)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="13"
													height="12"
													viewBox="0 0 13 12"
													fill="none"
													className="fill-[#484848] dark:fill-lightBlue/50"
												>
													<path
														fill-rule="evenodd"
														clip-rule="evenodd"
														d="M2.24647 2.40155V10.0015C2.24647 10.5318 2.45727 11.0407 2.83208 11.4158C3.20726 11.7906 3.7161 12.0014 4.24645 12.0014H9.04639C9.57674 12.0014 10.0856 11.7906 10.4608 11.4158C10.8356 11.0407 11.0464 10.5318 11.0464 10.0015V2.40155H12.2464C12.4672 2.40155 12.6464 2.22236 12.6464 2.00156C12.6464 1.78076 12.4672 1.60156 12.2464 1.60156H1.04648C0.825678 1.60156 0.646484 1.78076 0.646484 2.00156C0.646484 2.22236 0.825678 2.40155 1.04648 2.40155H2.24647ZM10.2464 2.40155V10.0015C10.2464 10.3199 10.12 10.625 9.89477 10.8499C9.66995 11.075 9.36477 11.2015 9.04639 11.2015H4.24645C3.92805 11.2015 3.62289 11.075 3.39807 10.8499C3.17289 10.625 3.04646 10.3198 3.04646 10.0015V2.40155H10.2464Z"
														// fill="#484848"
													/>
													<path
														fill-rule="evenodd"
														clip-rule="evenodd"
														d="M4.64609 0.799991H8.64605C8.86685 0.799991 9.04604 0.620798 9.04604 0.399996C9.04604 0.179193 8.86685 0 8.64605 0H4.64609C4.42529 0 4.24609 0.179193 4.24609 0.399996C4.24609 0.620798 4.42529 0.799991 4.64609 0.799991Z"
														// fill="#484848"
													/>
													<path
														fill-rule="evenodd"
														clip-rule="evenodd"
														d="M5.04883 4.4039V9.20385C5.04883 9.42465 5.22802 9.60385 5.44882 9.60385C5.66963 9.60385 5.84882 9.42465 5.84882 9.20385V4.4039C5.84882 4.1831 5.66963 4.00391 5.44882 4.00391C5.22802 4.00391 5.04883 4.1831 5.04883 4.4039Z"
														// fill="#484848"
													/>
													<path
														fill-rule="evenodd"
														clip-rule="evenodd"
														d="M7.44727 4.4039V9.20385C7.44727 9.42465 7.62646 9.60385 7.84726 9.60385C8.06806 9.60385 8.24726 9.42465 8.24726 9.20385V4.4039C8.24726 4.1831 8.06806 4.00391 7.84726 4.00391C7.62646 4.00391 7.44727 4.1831 7.44727 4.4039Z"
														// fill="#484848"
													/>
												</svg>
												<span>Delete</span>
											</button>
										</Menu.Item>
									</Menu.Items>
								</Transition>
							</Menu>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
