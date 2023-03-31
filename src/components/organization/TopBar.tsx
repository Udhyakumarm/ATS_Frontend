import ThemeChange from "../ThemeChange";
import { signOut, useSession } from "next-auth/react";
import { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import userImg from "/public/images/user-image.png";
import OrganizationCalendar from "./OrganizationCalendar";
import { axiosInstance } from "@/utils";
import { useRouter } from "next/router";
import googleIcon from '/public/images/social/google-icon.png'

const CalendarIntegrationOptions = [{ provider: "Google Calendar", icon: googleIcon, link: "/api/integrations/gcal/create" }];

export default function OrgTopBar() {
	const cancelButtonRef = useRef(null);
	const router = useRouter();
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const { data: session } = useSession();

	const [integration, setIntegration] = useState([]);

	useEffect(() => {
		async function loadIntegrations() {
			if (!session) return;

			const { validatedIntegrations: newIntegrations } = await axiosInstance.next_api
				.get("/api/integrations/calendar")
				.then((response) => response.data)
				.catch((err) => {
					console.log(err);
					return { data: { success: false } };
				});

			setIntegration(newIntegrations);
		}

		loadIntegrations();
	}, [router, session]);

	return (
		<>
			<div
				id="topbar"
				className="fixed top-0 left-0 z-[12] flex h-[65px] w-full items-center justify-end bg-white py-3 px-6 shadow transition dark:bg-gray-800 lg:left-[270px] lg:w-[calc(100%-270px)]"
			>
				<ThemeChange />
				<button type="button" className="mr-6 text-darkGray dark:text-gray-400">
					<i className="fa-regular fa-clipboard text-[20px]"></i>
				</button>
				<button type="button" className="mr-6 text-darkGray dark:text-gray-400" onClick={() => setIsCalendarOpen(true)}>
					<i className="fa-regular fa-calendar-days text-[20px]"></i>
				</button>
				<button type="button" className="relative mr-6 uppercase text-darkGray dark:text-gray-400">
					<i className="fa-regular fa-bell text-[20px]"></i>
					<span className="absolute right-[-10px] top-[-7px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
						99+
					</span>
				</button>
				<button type="button" className="mr-6 font-semibold uppercase text-darkGray dark:text-gray-400">
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
								{integration && integration.length > 0 ? (
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
													<div key={i} className="my-2 w-full border rounded-normal overflow-hidden">
														<Link href={integration.link} className="flex items-center justify-between w-full p-4 hover:bg-lightBlue">
															<Image src={integration.icon} alt={integration.provider} width={150} className="max-h-[24px] mr-4 w-auto" />
															<span className="min-w-[60px] rounded py-1 px-2 text-white text-[12px] bg-gradient-to-b from-gradLightBlue to-gradDarkBlue hover:from-gradDarkBlue hover:to-gradDarkBlue">
																{`Integrate ${integration.provider}`}
															</span>
														</Link>
													</div>
												))}
											</div>
										</div>
									</Dialog.Panel>
								)}
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}
