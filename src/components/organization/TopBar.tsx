import ThemeChange from "../ThemeChange";
import { signOut } from "next-auth/react";
import { useState, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import userImg from "/public/images/user-image.png";
import OrganizationCalendar from "./OrganizationCalendar";

export default function OrgTopBar() {
	const cancelButtonRef = useRef(null);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	return (
		<>
			<div
				id="topbar"
				className="fixed top-0 left-0 z-[12] flex h-[65px] w-full items-center justify-end bg-white py-3 px-6 shadow transition dark:bg-gray-800 lg:left-[270px] lg:w-[calc(100%-270px)]"
			>
				<ThemeChange />
				<button type="button" className="mr-6 text-darkGray dark:text-white">
					<i className="fa-regular fa-clipboard text-[20px]"></i>
				</button>
				<button type="button" className="mr-6 text-darkGray dark:text-white" onClick={() => setIsCalendarOpen(true)}>
					<i className="fa-regular fa-calendar-days text-[20px]"></i>
				</button>
				<button type="button" className="relative mr-6 uppercase text-darkGray dark:text-white">
					<i className="fa-regular fa-bell text-[20px]"></i>
					<span className="absolute right-[-10px] top-[-7px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
						99+
					</span>
				</button>
				<button type="button" className="mr-6 font-semibold uppercase text-darkGray dark:text-white">
					Eng <i className="fa-solid fa-chevron-down text-[12px]"></i>
				</button>
				<button
					type="button"
					className="h-[30px] w-[30px] rounded bg-red-500 text-sm text-white hover:bg-red-600"
					onClick={() => signOut()}
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
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-5xl">
									<OrganizationCalendar />
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}
