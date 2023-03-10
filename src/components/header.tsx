import { useTheme } from "next-themes";
import Logo from "@/components/logo";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useCarrierId } from "@/utils/code";
import Image from "next/image";
import ThemeChange from "./ThemeChange"
import { Popover } from '@headlessui/react'
import googleIcon from '/public/images/social/google-icon.png'
import Link from "next/link";

export default function Header() {
	const router = useRouter();
	const { theme, setTheme } = useTheme();

	const cid = useCarrierId((state) => state.cid)
	const addcid = useCarrierId((state) => state.addcid)

	if (router.asPath === "/organization/"+ cid +"/carrierpage" || router.asPath === "/organization/"+ cid +"/search-jobs" || router.asPath === "/organization/"+ cid +"/dashboard") {
		return(
			<>
				<header className="bg-white shadow-normal dark:bg-gray-800">
					<div className="mx-auto flex w-full max-w-[1920px] items-center justify-between py-3 px-4 md:px-10 lg:px-14">
						<div className="flex items-center">
							<Image src={googleIcon} alt={'Somhako'} width={200} className="max-h-[40px] w-auto mr-8" />
							<ul className="flex text-sm font-semibold text-darkGray">
								<li className="mx-3">
									<Link href={"/organization/"+ cid +"/search-jobs"} className={`inline-block px-2 py-[10px] border-b-2 hover:text-primary border-b-primary text-primary`}>
										Search Jobs
									</Link>
								</li>
								<li className="mx-3">
									<Link href={"/organization/"+ cid +"/dashboard"} className={`inline-block px-2 py-[10px] border-b-2 hover:text-primary border-b-transparent`}>
										Dashboard
									</Link>
								</li>
							</ul>
						</div>
						<div className="flex items-center">
							<ThemeChange />
							<Popover className="relative mr-6">
								<Popover.Button>
									<button type="button" className="text-darkGray dark:text-white uppercase relative">
										<i className="fa-regular fa-bell text-[20px]"></i>
										<span className="flex items-center justify-center w-[20px] h-[20px] rounded-full bg-primary text-white text-[8px] absolute right-[-10px] top-[-7px]">99+</span>
									</button>
								</Popover.Button>
								<Popover.Panel className="absolute right-0 z-10 bg-white dark:bg-gray-700 w-[280px] p-4 shadow-normal rounded">
									<h4 className="font-bold mb-3 text-lg">Notifications</h4>
									<ul className="list-disc px-4 text-sm text-darkGray dark:text-white font-semibold max-h-[300px] overflow-y-auto">
										<li className="py-2">
										You have applied For Job
										</li>
										<li className="py-2">
										Your Profile has been Shortlisted for this Job
										</li>
										<li className="py-2">
										Your Profile has been Rejected for this Job
										</li>
									</ul>
								</Popover.Panel>
							</Popover>
							<Popover className="relative">
								<Popover.Button>
									<button
										type="button"
										className="h-[35px] w-[35px] rounded-full bg-darkGray text-white"
									>
										S
									</button>
								</Popover.Button>
								<Popover.Panel className="absolute right-0 z-10 bg-white dark:bg-gray-700 w-[150px] shadow-normal rounded overflow-hidden">
									<ul className="text-sm">
										<li>
											<Link href="#" className="w-full block py-2 font-bold py-1 px-4 hover:bg-gray-200">
												<i className="fa-solid fa-gear mr-3"></i>
												Settings
											</Link>
										</li>
										<li>
											<button type="button" className="text-left w-full block py-2 font-bold py-1 px-4 text-white bg-red-500 hover:bg-red-600"><i className="fa-solid fa-right-from-bracket mr-3"></i> Logout</button>
										</li>
									</ul>
								</Popover.Panel>
							</Popover>
						</div>
					</div>
				</header>
			</>
		)
	}
	else if (router.asPath === "/organization") {
		return (
			<>
				<header className="bg-white shadow-normal dark:bg-gray-800">
					<div className="mx-auto flex w-full max-w-[1920px] items-center justify-between py-3 px-4 md:px-10 lg:px-14">
						<Logo url="/" width={205} />
						<div className="flex items-center">
							<button
								aria-label="Toggle Dark Mode"
								type="button"
								className="mr-2 w-[35px] rounded px-2 py-1 text-black dark:text-white"
								onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							>
								{theme === "dark" ? (
									<>
										<i className="fa-solid fa-moon"></i>
									</>
								) : (
									<>
										<i className="fa-solid fa-sun"></i>
									</>
								)}
							</button>
							<button
								type="button"
								className="h-[30px] w-[30px] rounded bg-red-500 text-sm text-white hover:bg-red-600"
								onClick={() => signOut()}
							>
								<i className="fa-solid fa-right-from-bracket"></i>
							</button>
						</div>
					</div>
				</header>
			</>
		);
	}
	
	return <></>;
}
