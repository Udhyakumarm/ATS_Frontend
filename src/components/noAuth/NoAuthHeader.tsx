import ThemeChange from "../ThemeChange";
import { useRouter } from "next/router";
import ToggleLang from "../ToggleLang";
import toastcomp from "../toast";
import { useLangStore } from "@/utils/code";
import Logo from "../Logo";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import novusIcon from "/public/images/novus1.png";
import novusIcon12 from "/public/images/novus12.png";
import Button from "../Button";

export default function noAuthHeader({ scrollTop }: any) {
	// const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<nav
				id="topbar"
				className={`fixed left-0 top-0 z-[100] flex w-full flex-wrap items-center justify-between  px-4 py-1 ${
					scrollTop > 10 ? "bg-white/10 backdrop-blur-md" : "bg-transparent"
				} ${isOpen && " bg-white/10 backdrop-blur-lg max-lg:h-full"} `}
			>
				<div className=" flex flex-shrink-0 items-center ">
					<Image src={novusIcon} className="h-[45px] w-[45px]" alt="Logo" />
				</div>
				<div className="block lg:hidden">
					<button onClick={() => setIsOpen(!isOpen)} className="flex items-center rounded px-3 py-2">
						<svg
							className={`h-5 w-5 fill-white ${isOpen ? "hidden" : "block"}`}
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
						</svg>
						<svg
							className={`h-5 w-5 fill-white ${isOpen ? "block" : "hidden"}`}
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
						</svg>
					</button>
				</div>

				<div
					className={`block w-full  p-4 text-sm lg:flex lg:w-auto lg:items-center lg:justify-center lg:gap-6 ${
						isOpen ? " mt-4 block  lg:mt-0" : "hidden"
					}`}
				>
					<Link
						href="/home"
						className={
							"my-auto mb-4 block w-fit max-lg:mx-auto lg:mb-0 lg:mt-0" +
							" " +
							`${router.route.includes("/lp") ? "menu__link2" : "menu__link"}`
						}
					>
						Home
					</Link>
					<Link
						href="/about"
						className={
							"my-auto mb-4 block w-fit max-lg:mx-auto lg:mb-0 lg:mt-0" +
							" " +
							`${router.route.includes("/about") ? "menu__link2" : "menu__link"}`
						}
					>
						About
					</Link>
					<Link
						href="/features"
						className={
							"my-auto mb-4 block w-fit max-lg:mx-auto lg:mb-0 lg:mt-0" +
							" " +
							`${router.route.includes("/features") ? "menu__link2" : "menu__link"}`
						}
					>
						Features
					</Link>
					<Link href="/novus" className="my-auto mb-4 flex w-fit flex-nowrap max-lg:mx-auto lg:mb-0 lg:mt-0">
						<div className={`${router.route.includes("/novus") ? "menu__link2" : "menu__link"}`}>Novus</div>
						<span className="mb-1 ml-1 mt-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">beta</span>
					</Link>
					<Link
						href="#"
						className={
							"my-auto mb-4 block w-fit max-lg:mx-auto lg:mb-0 lg:mt-0" +
							" " +
							`${router.route.includes("/blogs") ? "menu__link2" : "menu__link"}`
						}
					>
						Blogs
					</Link>
				</div>

				<div className={`block items-center max-lg:mx-auto  lg:inline-flex ${isOpen ? "block" : "hidden"}`}>
					<button
						className={`my-2 w-auto rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-3 py-2 text-sm font-semibold text-white hover:from-gradDarkBlue hover:to-gradDarkBlue disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200`}
					>
						Learn More
						<span className="ml-2">
							<i className="fa-regular fa-circle-check"></i>
						</span>
					</button>
				</div>
			</nav>

			{/* <div
				id="topbar"
				className={
					`fixed left-0 top-0 z-[12] mx-auto flex min-h-[65px] w-full flex-col flex-wrap items-center justify-center border-4 border-black bg-transparent px-6 py-3 delay-150 md:flex-row` +
					" " +
					`${scrollTop > 10 ? "bg-white/10 backdrop-blur-md" : "bg-transparent"}`
				}
			>
				<div className="mb-4 flex items-center md:mb-0">
					<Image src={novusIcon} alt={"Novus1"} width={55} className="max-h-[55px]" />
				</div>
				<div className="flex flex-wrap items-center justify-center gap-10 px-6 py-3 md:ml-auto md:mr-auto">
					<Link
						href="/lp"
						className={"my-auto" + " " + `${router.route.includes("/lp") ? "menu__link2" : "menu__link"}`}
					>
						Home
					</Link>
					<Link
						href="#"
						className={"my-auto" + " " + `${router.route.includes("/about") ? "menu__link2" : "menu__link"}`}
					>
						About
					</Link>
					<Link
						href="#"
						className={"my-auto" + " " + `${router.route.includes("/features") ? "menu__link2" : "menu__link"}`}
					>
						Features
					</Link>
					<div className="my-auto">
						<Link href="#" className={`${router.route.includes("/novus") ? "menu__link2" : "menu__link"}`}>
							Novus
						</Link>
						<span className="mb-1 ml-1 mt-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">beta</span>
					</div>
					<Link
						href="#"
						className={"my-auto" + " " + `${router.route.includes("/blogs") ? "menu__link2" : "menu__link"}`}
					>
						Blogs
					</Link>
					
				</div>

				<div className="mt-4 inline-flex items-center md:mt-0">
					<button
						className={`my-2 w-auto rounded bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-3 py-2 text-sm font-semibold text-white hover:from-gradDarkBlue hover:to-gradDarkBlue disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200`}
					>
						Learn More
						<span className="ml-2">
							<i className="fa-regular fa-circle-check"></i>
						</span>
					</button>
				</div>
			</div> */}
		</>
	);
}
