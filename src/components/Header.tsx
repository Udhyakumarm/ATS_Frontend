import Logo from "@/components/Logo";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { useCarrierStore } from "@/utils/code";
import Image from "next/image";
import ThemeChange from "./ThemeChange";
import { Popover } from "@headlessui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default function Header() {
	const router = useRouter();
	const { data: session } = useSession();
	useEffect(() => {
		if (session?.error === "RefreshAccessTokenError" && !router.asPath.startsWith("/auth")) {
			signIn(); // Force sign in to hopefully resolve error
		}
	}, [router.asPath, session]);

	const [auth, setauth] = useState(false);

	useEffect(() => {
		if (session) {
			setauth(true);
		} else {
			setauth(false);
		}
	}, [session]);

	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const setcname = useCarrierStore((state: { setcname: any }) => state.setcname);
	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const setcid = useCarrierStore((state: { setcid: any }) => state.setcid);
	const orgdetail: any = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);
	const setorgdetail = useCarrierStore((state: { setorgdetail: any }) => state.setorgdetail);

	if (
		router.asPath === "/organization/" + cname ||
		router.asPath === "/organization/" + cname + "/search-jobs" ||
		router.asPath === "/organization/" + cname + "/dashboard" ||
		router.asPath === "/organization/" + cname + "/job-detail" ||
		router.asPath === "/organization/" + cname + "/job-apply"
	) {
		return (
			<>
				<header className="bg-white shadow-normal dark:bg-gray-800">
					<div className="mx-auto flex w-full max-w-[1920px] items-center justify-between py-3 px-4 md:px-10 lg:px-14">
						<div className="flex items-center">
							<Image
								src={`http://127.0.0.1:8000${orgdetail["OrgProfile"][0]["logo"]}`}
								alt={"Somhako"}
								width={200}
								height={200}
								className="mr-8 max-h-[40px] w-auto"
								onClick={() => {
									router.push("/organization/" + cname);
								}}
							/>
							<ul className="flex text-sm font-semibold">
								<li className="mx-3">
									<Link
										href={"/organization/" + cname + "/search-jobs"}
										className={
											`inline-block border-b-2 px-2 py-[10px] hover:text-primary` +
											" " +
											(router.pathname == "/organization/" + cname + "/search-jobs"
												? "border-b-primary text-primary"
												: "border-b-transparent")
										}
									>
										Search Jobs
									</Link>
								</li>
								{auth && (
									<li className="mx-3">
										<Link
											href={"/organization/" + cname + "/dashboard"}
											className={
												`inline-block border-b-2 px-2 py-[10px] hover:text-primary` +
												" " +
												(router.pathname == "/organization/" + cname + "/search-jobs"
													? "border-b-primary text-primary"
													: "border-b-transparent")
											}
										>
											Dashboard
										</Link>
									</li>
								)}
							</ul>
						</div>
						<div className="flex items-center">
							<ThemeChange />
							{auth && (
								<>
									<Popover className="relative mr-6">
										<Popover.Button>
											<button type="button" className="relative uppercase text-darkGray dark:text-white">
												<i className="fa-regular fa-bell text-[20px]"></i>
												<span className="absolute right-[-10px] top-[-7px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
													99+
												</span>
											</button>
										</Popover.Button>
										<Popover.Panel className="absolute right-0 z-10 w-[280px] rounded bg-white p-4 shadow-normal dark:bg-gray-700">
											<h4 className="mb-3 text-lg font-bold">Notifications</h4>
											<ul className="max-h-[300px] list-disc overflow-y-auto px-4 text-sm font-semibold text-darkGray dark:text-white">
												<li className="py-2">You have applied For Job</li>
												<li className="py-2">Your Profile has been Shortlisted for this Job</li>
												<li className="py-2">Your Profile has been Rejected for this Job</li>
											</ul>
										</Popover.Panel>
									</Popover>
									<Popover className="relative">
										<Popover.Button>
											<button type="button" className="h-[35px] w-[35px] rounded-full bg-darkGray text-white">
												S
											</button>
										</Popover.Button>
										<Popover.Panel className="absolute right-0 z-10 w-[150px] overflow-hidden rounded bg-white shadow-normal dark:bg-gray-700">
											<ul className="text-sm">
												<li>
													<Link href="#" className="block w-full py-2 py-1 px-4 font-bold hover:bg-gray-200">
														<i className="fa-solid fa-gear mr-3"></i>
														Settings
													</Link>
												</li>
												<li>
													<button
														type="button"
														className="block w-full bg-red-500 py-2 py-1 px-4 text-left font-bold text-white hover:bg-red-600"
														onClick={() => signOut({ callbackUrl: `/organization/${cname}` })}
													>
														<i className="fa-solid fa-right-from-bracket mr-3"></i> Logout
													</button>
												</li>
											</ul>
										</Popover.Panel>
									</Popover>
								</>
							)}
						</div>
					</div>
				</header>
			</>
		);
	} else if (router.asPath === "/organization") {
		return (
			<>
				<header className="bg-white shadow-normal dark:bg-gray-800">
					<div className="mx-auto flex w-full max-w-[1920px] items-center justify-between py-3 px-4 md:px-10 lg:px-14">
						<Logo url="/" width={205} />
						<div className="flex items-center">
							<ThemeChange />
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
