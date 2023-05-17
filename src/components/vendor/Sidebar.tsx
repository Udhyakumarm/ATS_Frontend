import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../Logo";
import Favicon from "/public/favicon.ico";
import FaviconWhite from "/public/favicon-white.ico";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import clientsIcon from "/public/images/icons/clients.png";
import inboxesIcon from "/public/images/icons/inboxes.png";
import settingsIcon from "/public/images/icons/settings.png";
import clientsIconWhite from "/public/images/icons-white/clients.png";
import inboxesIconWhite from "/public/images/icons-white/inboxes.png";
import settingsIconWhite from "/public/images/icons-white/settings.png";
import { useCarrierStore } from "@/utils/code";

export default function VendorSideBar() {
	const router = useRouter();
	const { theme } = useTheme();
	const [show, setShow] = useState(false);
	function toggleSidebar() {
		document.querySelector("main")?.classList.toggle("sidebarToggled");
		setShow(!show);
	}

	const vid = useCarrierStore((state: { vid: any }) => state.vid);

	const menu = [
		{
			title: "Clients",
			url: `/vendor/[vrefid]/clients`,
			url2: `/vendor/${vid}/clients`,
			img: clientsIcon,
			imgWhite: clientsIconWhite
		},
		{
			title: "Inboxes",
			url: `/vendor/[vrefid]/inbox`,
			url2: `/vendor/${vid}/inbox`,
			img: inboxesIcon,
			imgWhite: inboxesIconWhite
		},
		{
			title: "Settings",
			url: `/vendor/[vrefid]/settings`,
			url2: `/vendor/${vid}/settings`,
			img: settingsIcon,
			imgWhite: settingsIconWhite
		}
	];

	useEffect(() => {
		console.log(router.pathname);
	});

	return (
		<>
			{vid && vid.length > 0 && (
				<div
					id="sidebar"
					className={
						`fixed top-0 z-[13] h-full w-[270px] bg-white shadow transition dark:bg-gray-800 lg:left-0` +
						" " +
						(show ? "left-[-50px]" : "left-0")
					}
				>
					<div className="relative flex h-[65px] items-center p-3">
						<button
							type="button"
							className={
								`absolute right-[-16px] top-[50%] h-[30px] w-[30px] translate-y-[-50%] rounded-full bg-white shadow dark:bg-gray-700` +
								" " +
								(show ? "right-[-31px] rounded-[6px] rounded-bl-[0] rounded-tl-[0]" : <></>)
							}
							onClick={toggleSidebar}
						>
							<i className={`fa-solid fa-chevron-left` + " " + (show ? "fa-chevron-right" : <></>)}></i>
						</button>
						{show ? (
							<>
								<Image src={theme === "dark" ? FaviconWhite : Favicon} alt="Somhako" />
							</>
						) : (
							<>
								<Logo width="188" />
							</>
						)}
					</div>
					<div className="h-[calc(100%-65px)] overflow-y-auto p-3">
						<ul>
							{menu.map((menuItem, i) => (
								<li className={`my-[12px]` + " " + (show ? "my-[24px]" : "")} key={i}>
									<Link
										href={menuItem.url2}
										className={
											`flex items-center rounded-[8px] font-semibold hover:bg-lightBlue dark:hover:bg-gray-900` +
											" " +
											(router.pathname == menuItem.url
												? "border-r-gradDarkBlue bg-lightBlue text-primary dark:bg-gray-900 dark:text-white"
												: "border-r-transparent bg-transparent") +
											" " +
											(show
												? "justify-center bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
												: "border-r-[10px] px-4 py-2")
										}
									>
										<span className={`inline-block h-[20px] w-[20px]` + " " + (show ? "text-center" : "mr-4")}>
											<Image
												src={theme === "dark" ? menuItem.imgWhite : menuItem.img}
												alt={menuItem.title}
												width={100}
												className={"mx-auto max-h-[20px] w-auto"}
											/>
										</span>
										{show ? "" : menuItem.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</>
	);
}
