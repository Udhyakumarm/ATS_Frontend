import Button from "@/components/Button";
import FormField from "@/components/FormField";
import UploadProfile from "@/components/UploadProfile";
import { Dialog, Transition } from "@headlessui/react";
import { useState, useRef, Fragment } from "react";
import UpcomingComp from "@/components/organization/upcomingComp";

export default function CandSettings({ upcomingSoon }: any) {
	const cancelButtonRef = useRef(null);
	const [changePass, setChangePass] = useState(false);
	const [accountDelete, setAccountDelete] = useState(false);
	return (
		<>
			<main className="py-8">
				<div className="container">
					<div className="rounded-normal bg-white p-6 shadow-normal dark:bg-gray-800">
						{!upcomingSoon ? (
							<UpcomingComp />
						) : (
							<>
								<div className="mb-4">
									<UploadProfile note="Supported Formats 2MB  : png , jpg " />
								</div>
								<div className="-mx-4 flex flex-wrap">
									<div className="mb-4 w-full px-4 md:max-w-[50%]">
										<FormField fieldType="input" inputType="input" label="First Name" />
									</div>
									<div className="mb-4 w-full px-4 md:max-w-[50%]">
										<FormField fieldType="input" inputType="input" label="Last Name" />
									</div>
								</div>
								<FormField fieldType="input" inputType="email" label="Email" required />
								<div className="mb-4">
									<h6 className="mb-1 inline-block font-bold">Unique ID</h6>
									<div className="flex w-full items-center rounded-normal border border-borderColor p-1 dark:border-gray-600 dark:bg-gray-700">
										<input type="text" className="grow border-0 text-sm focus:ring-0" />
										<button type="button" className="w-[50px] py-2">
											<i className="fa-solid fa-copy"></i>
										</button>
									</div>
								</div>
								<hr className="my-4" />
								<div>
									<h6 className="mb-1 font-bold">Password Settings</h6>
									<Button btnType="button" label="Change Password" handleClick={() => setChangePass(true)} />
								</div>
								<hr className="my-4" />
								<Button
									btnType="submit"
									btnStyle="danger"
									label="Delete Account"
									handleClick={() => setAccountDelete(true)}
								/>
							</>
						)}
					</div>
				</div>
			</main>
			<Transition.Root show={changePass} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setChangePass}>
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
										<h4 className="flex items-center font-semibold leading-none">Change Password</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setChangePass(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<FormField fieldType="input" inputType="password" label="Old Password" required />
										<FormField fieldType="input" inputType="password" label="New Password" required />
										<FormField fieldType="input" inputType="password" label="Confirm Password" required />
										<div className="text-center">
											<Button label="Submit" />
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={accountDelete} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setAccountDelete}>
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
										<h4 className="flex items-center font-semibold leading-none">Delete Account</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setAccountDelete(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<h3 className="mb-4 text-center text-lg font-bold">Are you sure want to delete your account?</h3>
										<div className="flex flex-wrap justify-center">
											<div className="my-1 mr-4 last:mr-0">
												<Button btnStyle="gray" label="No" />
											</div>
											<div className="my-1 mr-4 last:mr-0">
												<Button btnStyle="danger" label="Yes" />
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
