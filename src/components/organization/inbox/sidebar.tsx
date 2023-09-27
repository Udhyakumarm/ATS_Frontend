import React, { useEffect, useState, Fragment, useRef } from "react";
import { Dialog, Menu, Tab, Transition } from "@headlessui/react";
import Image from "next/image";
import FormField from "@/components/FormField";
import userImg1 from "/public/images/user-image1.jpeg";
import Button from "@/components/Button";
import AutoTextarea from "@/components/organization/AutoTextarea";
import InboxCard from "./card";

export default function InboxSideBar({
	togglePages,
	setTogglePages,
	axiosInstanceAuth2,
	setcardActive,
	setcardActiveData,
	cardActive,
	cardActiveData,
	socket,
	sidebarData,
	setsidebarData,
	pinnedClick,
	typingPK,
	settypingPK,
	loadSidebar
}: any) {
	return (
		<div className="overflow-hidden rounded-normal border bg-white/50 shadow-normal dark:border-gray-600 dark:bg-gray-800/50">
			<Tab.Group>
				<Tab.List className={"border-b px-6 pt-2 dark:border-gray-600"}>
					{/* <Tab as={Fragment}>
						{({ selected }) => (
							<button
								className={
									"mr-6 border-b-4 py-3 font-semibold focus:outline-none" +
									" " +
									(selected ? "border-primary text-primary" : "border-transparent text-darkGray dark:text-gray-400")
								}
								onClick={() => setTogglePages(true)}
							>
								Inbox
							</button>
						)}
					</Tab> */}
					<Tab as={Fragment}>
						{({ selected }) => (
							<button
								className={
									"mr-6 border-b-4 py-3 font-semibold focus:outline-none" +
									" " +
									(selected ? "border-primary text-primary" : "border-transparent text-darkGray dark:text-gray-400")
								}
								onClick={() => setTogglePages(false)}
							>
								Chats
							</button>
						)}
					</Tab>
				</Tab.List>
				<Tab.Panels>
					{/* <Tab.Panel>
						<Tab.Group>
							<Tab.List className={"px-6"}>
								<Tab as={Fragment}>
									{({ selected }) => (
										<button
											className={
												"mr-6 py-3 text-sm font-semibold focus:outline-none" +
												" " +
												(selected ? "text-primary" : "text-darkGray dark:text-gray-400")
											}
										>
											Applicants
										</button>
									)}
								</Tab>
								<Tab as={Fragment}>
									{({ selected }) => (
										<button
											className={
												"mr-6 py-3 text-sm font-semibold focus:outline-none" +
												" " +
												(selected ? "text-primary" : "text-darkGray dark:text-gray-400")
											}
										>
											Vendors
										</button>
									)}
								</Tab>
							</Tab.List>
							<Tab.Panels>
								<Tab.Panel>
									<div className="p-4 pt-0">
										<div className="flex items-center gap-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												className="fill-black dark:fill-white"
											>
												<path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="M16.0007 16.7077C14.4083 18.1332 12.3054 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 12.3054 18.1332 14.4083 16.7078 16.0006L22.0104 21.3033C22.2057 21.4986 22.2057 21.8151 22.0104 22.0104C21.8152 22.2057 21.4986 22.2057 21.3033 22.0104L16.0007 16.7077ZM18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
													// fill="#1D1D1D"
												/>
											</svg>
											<input
												type="search"
												placeholder={"Search Applicants ..."}
												className={`min-h-[45px] w-full border-none bg-transparent p-3 text-sm `}
											/>
										</div>
									</div>
									<div className="h-[calc(100vh-264px)] overflow-y-auto p-4 pt-0">
										<InboxCard pin={true} count={2} />
										<InboxCard active={true} count={15} />
										<InboxCard />
									</div>
								</Tab.Panel>
								<Tab.Panel>
									<div className="p-4 pt-0">
										<div className="flex items-center gap-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												className="fill-black dark:fill-white"
											>
												<path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="M16.0007 16.7077C14.4083 18.1332 12.3054 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 12.3054 18.1332 14.4083 16.7078 16.0006L22.0104 21.3033C22.2057 21.4986 22.2057 21.8151 22.0104 22.0104C21.8152 22.2057 21.4986 22.2057 21.3033 22.0104L16.0007 16.7077ZM18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
													// fill="#1D1D1D"
												/>
											</svg>
											<input
												type="search"
												placeholder={"Search Vendors ..."}
												className={`min-h-[45px] w-full border-none bg-transparent p-3 text-sm`}
											/>
										</div>
									</div>
									<div className="h-[calc(100vh-264px)] overflow-y-auto p-4 pt-0"></div>
								</Tab.Panel>
							</Tab.Panels>
						</Tab.Group>
					</Tab.Panel> */}
					<Tab.Panel>
						<Tab.Group>
							<Tab.List className={"px-6"}>
								{/* <Tab as={Fragment}>
									{({ selected }) => (
										<button
											className={
												"mr-6 py-3 text-sm font-semibold focus:outline-none" +
												" " +
												(selected ? "text-primary" : "text-darkGray dark:text-gray-400")
											}
										>
											All Chats
										</button>
									)}
								</Tab> */}
								{/* <Tab as={Fragment}>
									{({ selected }) => (
										<button
											className={
												"mr-6 py-3 text-sm font-semibold focus:outline-none" +
												" " +
												(selected ? "text-primary" : "text-darkGray dark:text-gray-400")
											}
										>
											Groups
										</button>
									)}
								</Tab> */}
							</Tab.List>
							<Tab.Panels>
								<Tab.Panel>
									{/* <div className="flex items-center p-4 pt-0">
										<div className="grow">
											<FormField
												fieldType="input"
												inputType="search"
												placeholder="Search team"
												icon={<i className="fa-solid fa-magnifying-glass"></i>}
											/>
										</div>
										<button
											type="button"
											className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400"
											// onClick={() => setAddMembers(true)}
										>
											<i className="fa-solid fa-user-plus"></i>
										</button>
										<Menu as="div" className="relative">
											<Menu.Button className="ml-2 w-6 py-2 text-darkGray dark:text-gray-400">
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
															<i className="fa-solid fa-users mr-2"></i> Create Group
														</button>
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu> 
									</div> */}
									<div className="p-4 pt-3">
										<div className="flex items-center gap-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												className="fill-black dark:fill-white"
											>
												<path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="M16.0007 16.7077C14.4083 18.1332 12.3054 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 12.3054 18.1332 14.4083 16.7078 16.0006L22.0104 21.3033C22.2057 21.4986 22.2057 21.8151 22.0104 22.0104C21.8152 22.2057 21.4986 22.2057 21.3033 22.0104L16.0007 16.7077ZM18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
													// fill="#1D1D1D"
												/>
											</svg>
											<input
												type="search"
												placeholder={"Search Team Members ..."}
												className={`min-h-[45px] w-full border-none bg-transparent p-3 text-sm `}
											/>
											{/* <svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												className="fill-black dark:fill-white"
											>
												<path
													d="M14.8973 0H4.80788C2.15697 0 0 2.15252 0 4.79796V14.8676C0 17.5131 2.15697 19.6656 4.80788 19.6656H14.8983C17.5493 19.6656 19.7062 17.5131 19.7062 14.8676V4.79796C19.7062 2.15252 17.5493 0 14.8983 0H14.8973ZM18.1869 14.8676C18.1869 16.6777 16.7112 18.1504 14.8973 18.1504H4.80788C2.99404 18.1504 1.51828 16.6777 1.51828 14.8676V4.79796C1.51828 2.98787 2.99404 1.51515 4.80788 1.51515H14.8983C16.7122 1.51515 18.1879 2.98787 18.1879 4.79796V14.8676H18.1869Z"
													fill="#939393"
												/>
												<path
													d="M14.3071 9.07536H10.6116V5.38648C10.6116 4.9683 10.2715 4.62891 9.85243 4.62891C9.43339 4.62891 9.0933 4.9683 9.0933 5.38648V9.07536H5.39781C4.97877 9.07536 4.63867 9.41475 4.63867 9.83293C4.63867 10.2511 4.97877 10.5905 5.39781 10.5905H9.0933V14.2794C9.0933 14.6976 9.43339 15.037 9.85243 15.037C10.2715 15.037 10.6116 14.6976 10.6116 14.2794V10.5905H14.3071C14.7261 10.5905 15.0662 10.2511 15.0662 9.83293C15.0662 9.41475 14.7261 9.07536 14.3071 9.07536Z"
													fill="#939393"
												/>
											</svg> */}
										</div>
									</div>
									{sidebarData && sidebarData.length > 0 && (
										<div className="h-[calc(100vh-264px)] overflow-y-auto p-4 pt-0">
											{sidebarData.map((data, i) => (
												<div key={i}>
													<InboxCard
														pin={false}
														setcardActive={setcardActive}
														setcardActiveData={setcardActiveData}
														cardActive={cardActive}
														cardActiveData={cardActiveData}
														online={data["other_user_online"]}
														count={data["unread_count"]}
														data={data}
														socket={socket}
														pinnedClick={pinnedClick}
														typingPK={typingPK}
														settypingPK={settypingPK}
														sidebarData={sidebarData}
														loadSidebar={loadSidebar}
													/>
												</div>
											))}
										</div>
									)}
								</Tab.Panel>
								{/* <Tab.Panel>
									<div className="flex items-center p-4 pt-0">
										<div className="grow">
											<FormField
												fieldType="input"
												inputType="search"
												placeholder="Search vendors"
												icon={<i className="fa-solid fa-magnifying-glass"></i>}
											/>
										</div>
										<button
											type="button"
											className="ml-2 w-6 text-darkGray dark:text-gray-400"
											// onClick={() => setAddMembers(true)}
										>
											<i className="fa-solid fa-user-plus"></i>
										</button>
									</div>
									<div className="h-[calc(100vh-264px)] overflow-y-auto p-4 pt-0">
										<div
											className={
												"flex border border-transparent border-b-slate-200 px-3 py-4 last:border-b-0 hover:shadow-highlight dark:border-b-gray-600 dark:hover:bg-gray-900"
											}
										>
											<Image
												src={userImg1}
												alt="User"
												width={150}
												className="h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
											/>
											<div className="w-[calc(100%-50px)] pl-3 pt-1">
												<div className="mb-2 flex justify-between">
													<h5 className="text-sm font-semibold">Jack Paul</h5>
													<span className="block rounded bg-gray-200 px-2 py-1 text-[10px] font-semibold dark:bg-gray-600">
														3:30 PM
													</span>
												</div>
												<p className="clamp_2 text-[12px] text-darkGray">
													Your Interview has been scheduled for Software Developer Job at Organization Name Software
													Developer Job at Organization Name
												</p>
											</div>
										</div>
									</div>
								</Tab.Panel> */}
							</Tab.Panels>
						</Tab.Group>
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
}
