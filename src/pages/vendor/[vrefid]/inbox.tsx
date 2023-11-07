import VendorSideBar from "@/components/vendor/Sidebar";
import VendorTopBar from "@/components/vendor/TopBar";
import Head from "next/head";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import FormField from "@/components/FormField";
import Image from "next/image";
import userImg from "/public/images/user-image.png";
import Button from "@/components/Button";
import { Menu } from "@headlessui/react";
import { useTranslation } from "next-i18next";

export default function VendorInbox() {
	const { t } = useTranslation("common");
	const cancelButtonRef = useRef(null);
	const [addMembers, setAddMembers] = useState(false);
	const [createGroup, setCreateGroup] = useState(false);
	const [exitGroup, setExitGroup] = useState(false);
	const [deleteGroup, setDeleteGroup] = useState(false);

	const MessageCards = () => {
		return (
			<>
				<div
					className={
						"flex border border-transparent border-b-slate-200 px-3 py-4 last:border-b-0 hover:shadow-highlight dark:border-b-gray-600 dark:hover:bg-gray-900"
					}
				>
					<Image
						src={userImg}
						alt="User"
						width={150}
						className="h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
					/>
					<div className="w-[calc(100%-50px)] pl-3 pt-1">
						<div className="mb-2 flex items-start justify-between">
							<aside>
								<p className="text-[10px] font-semibold text-darkGray dark:text-gray-400">Jack Paul</p>
								<h5 className="text-sm font-semibold">Vendor Interview</h5>
							</aside>
							<span className="block rounded bg-gray-200 px-2 py-1 text-[10px] font-semibold dark:bg-gray-600">
								3:30 PM
							</span>
						</div>
						<p className="clamp_2 text-[12px] text-darkGray">
							Your Interview has been scheduled for Software Developer Job at Organization Name Software Developer Job
							at Organization Name
						</p>
					</div>
				</div>
			</>
		);
	};

	return (
		<>
			<Head>
				<title>
					{t("Words.Vendors")} | {t("Words.Inbox")}
				</title>
			</Head>
			<main>
				<VendorSideBar />
				<VendorTopBar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<div className="layoutWrap p-4 lg:p-8">
					<div className="flex flex-wrap">
						<div className="mb-4 w-full xl:mb-0 xl:max-w-[32%]">
							<div className="rounded-normal border bg-white shadow-normal dark:border-gray-600 dark:bg-gray-800">
								<div className="mb-6 px-6 pt-6">
									<FormField
										fieldType="input"
										inputType="search"
										placeholder="Search applicants, jobs ..."
										icon={<i className="fa-solid fa-magnifying-glass"></i>}
									/>
								</div>
								<div className="h-[calc(100vh-265px)] overflow-y-auto p-6 pt-0">{Array(5).fill(<MessageCards />)}</div>
							</div>
						</div>
						<div className="w-full xl:max-w-[68%] xl:pl-6">
							<div className="relative h-full overflow-hidden rounded-normal border bg-white pb-[80px] shadow-normal dark:border-gray-600 dark:bg-gray-800">
								<div className="border-b dark:border-b-gray-600">
									<div className="jusitfy-between mx-auto flex w-full max-w-[90%] items-center px-4 py-2">
										<div className="flex grow items-center">
											<Image
												src={userImg}
												alt="User"
												width={150}
												className="mr-4 h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
											/>
											<aside>
												<p className="text-[10px] font-semibold text-darkGray dark:text-gray-400">Jack Paul</p>
												<h5 className="text-sm font-semibold">Vendor Interview</h5>
											</aside>
										</div>
										<Menu as="div" className="relative">
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
															className="relative flex w-full cursor-pointer items-center px-4 py-2 text-left text-sm font-bold hover:bg-red-500 hover:text-white"
															onClick={() => setDeleteGroup(true)}
														>
															Delete Chat
														</button>
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu>
									</div>
								</div>
								<div className="h-[calc(100vh-280px)] overflow-y-auto">
									<div className="mx-auto w-full max-w-[90%] px-4">
										<div className="flex items-start py-4">
											<Image
												src={userImg}
												alt="User"
												width={150}
												className="h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
											/>
											<div className="pl-4 pt-1">
												<h4 className="mb-2 font-bold">
													Jack Paul
													<span className="pl-3 text-[10px] text-darkGray dark:text-gray-400">4:27 PM</span>
												</h4>
												<article className="text-sm text-darkGray dark:text-gray-400">
													Lorem ipsum dolor sit amet consectetur. Pellentesque sagittis sed dictum lorem. Neque eget
													faucibus dolor risus posuere vitae sodales. Sit odio morbi dolor egestas sit aliquam velit
													cum. Pharetra tortor sit vestibulum
												</article>
											</div>
										</div>
										<div className="flex items-start py-4">
											<Image
												src={userImg}
												alt="User"
												width={150}
												className="h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
											/>
											<div className="pl-4 pt-1">
												<h4 className="mb-2 font-bold">
													Me
													<span className="pl-3 text-[10px] text-darkGray dark:text-gray-400">4:27 PM</span>
												</h4>
												<article className="text-sm text-darkGray dark:text-gray-400">
													Lorem ipsum dolor sit amet consectetur. Pellentesque sagittis sed dictum lorem. Neque eget
													faucibus dolor risus posuere vitae sodales. Sit odio morbi dolor egestas sit aliquam velit
													cum. Pharetra tortor sit vestibulum
												</article>
											</div>
										</div>
										<div className="flex items-start py-4">
											<Image
												src={userImg}
												alt="User"
												width={150}
												className="h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
											/>
											<div className="pl-4 pt-1">
												<h4 className="mb-2 font-bold">
													Jack Paul
													<span className="pl-3 text-[10px] text-darkGray dark:text-gray-400">4:27 PM</span>
												</h4>
												<article className="text-sm text-darkGray dark:text-gray-400">
													Lorem ipsum dolor sit amet consectetur. Pellentesque sagittis sed dictum lorem. Neque eget
													faucibus dolor risus posuere vitae sodales. Sit odio morbi dolor egestas sit aliquam velit
													cum. Pharetra tortor sit vestibulum
												</article>
											</div>
										</div>
										<div className="flex items-start py-4">
											<Image
												src={userImg}
												alt="User"
												width={150}
												className="h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
											/>
											<div className="pl-4 pt-1">
												<h4 className="mb-2 font-bold">
													Me
													<span className="pl-3 text-[10px] text-darkGray dark:text-gray-400">4:27 PM</span>
												</h4>
												<article className="text-sm text-darkGray dark:text-gray-400">
													Lorem ipsum dolor sit amet consectetur. Pellentesque sagittis sed dictum lorem. Neque eget
													faucibus dolor risus posuere vitae sodales. Sit odio morbi dolor egestas sit aliquam velit
													cum. Pharetra tortor sit vestibulum
												</article>
											</div>
										</div>
										<div className="flex items-start py-4">
											<Image
												src={userImg}
												alt="User"
												width={150}
												className="h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
											/>
											<div className="pl-4 pt-1">
												<h4 className="mb-2 font-bold">
													Jack Paul
													<span className="pl-3 text-[10px] text-darkGray dark:text-gray-400">4:27 PM</span>
												</h4>
												<article className="text-sm text-darkGray dark:text-gray-400">
													Lorem ipsum dolor sit amet consectetur. Pellentesque sagittis sed dictum lorem. Neque eget
													faucibus dolor risus posuere vitae sodales. Sit odio morbi dolor egestas sit aliquam velit
													cum. Pharetra tortor sit vestibulum
												</article>
											</div>
										</div>
										<div className="flex items-start py-4">
											<Image
												src={userImg}
												alt="User"
												width={150}
												className="h-[50px] w-[50px] rounded-full object-cover shadow-highlight"
											/>
											<div className="pl-4 pt-1">
												<h4 className="mb-2 font-bold">
													Me
													<span className="pl-3 text-[10px] text-darkGray dark:text-gray-400">4:27 PM</span>
												</h4>
												<article className="text-sm text-darkGray dark:text-gray-400">
													Lorem ipsum dolor sit amet consectetur. Pellentesque sagittis sed dictum lorem. Neque eget
													faucibus dolor risus posuere vitae sodales. Sit odio morbi dolor egestas sit aliquam velit
													cum. Pharetra tortor sit vestibulum
												</article>
											</div>
										</div>
									</div>
								</div>
								<div className="absolute bottom-0 left-0 w-full border-t bg-lightBlue p-3 dark:border-t-gray-600 dark:bg-gray-900">
									<div className="flex items-center rounded bg-white p-2 shadow-normal dark:bg-gray-800">
										<textarea
											name=""
											id=""
											className="h-[40px] w-[calc(100%-50px)] resize-none  border-0 bg-transparent focus:border-0 focus:shadow-none focus:outline-none focus:ring-0"
											placeholder="Type something..."
										></textarea>
										<button type="button" className="block w-[50px] border-l-2 border-gray-400 text-sm leading-normal">
											<i className="fa-solid fa-paper-plane"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
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
															src={userImg}
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
														src={userImg}
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
															src={userImg}
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
										<h3 className="mb-4 text-center text-lg font-bold">Are you sure want to exit from this group?</h3>
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
	);
}
