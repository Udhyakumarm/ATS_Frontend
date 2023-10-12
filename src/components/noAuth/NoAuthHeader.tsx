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

export default function noAuthHeader() {
	// const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();

	const [isVisible, setIsVisible] = useState(false);
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};

	useEffect(() => {
		// Button is displayed after scrolling for 500 pixels
		const toggleVisibility = () => {
			if (window.pageYOffset > 20) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);

		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	return (
		<>
			<div
				id="topbar"
				className={
					`fixed left-0 top-0 z-[12] flex h-[65px] w-full items-center justify-between bg-transparent px-6 py-3 shadow` +
					" " +
					`${isVisible ? "backdrop-blur-md" : "bg-transparent"}`
				}
			>
				<div>
					{/* <Logo width="188" /> */}
					{/* <Image src={novusIcon12} alt={"Novus1"} width={30} className="max-h-[30px]" /> */}
					<Image src={novusIcon} alt={"Novus1"} width={45} className="max-h-[45px]" />
				</div>
				<div className="flex gap-8 px-6 py-3">
					<Link href="/lp" className={`${router.route.includes("/lp") ? "menu__link2" : "menu__link"}`}>
						Home
					</Link>
					<Link href="#" className={`${router.route.includes("/about") ? "menu__link2" : "menu__link"}`}>
						About
					</Link>
					<Link href="#" className={`${router.route.includes("/features") ? "menu__link2" : "menu__link"}`}>
						Features
					</Link>
					<div>
						<Link href="#" className={`${router.route.includes("/novus") ? "menu__link2" : "menu__link"}`}>
							Novus
						</Link>
						<span className="mb-1 ml-1 mt-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">beta</span>
					</div>
					<Link href="#" className={`${router.route.includes("/blogs") ? "menu__link2" : "menu__link"}`}>
						Blogs
					</Link>
					{/* <ThemeChange />
					<button
						type="button"
						className="mr-6 text-darkGray dark:text-gray-400"
						// onClick={() => setToDoPopup(true)}
					>
						<i className="fa-regular fa-clipboard text-[20px]"></i>
					</button>

					<div
						className="relative mr-6 cursor-pointer uppercase text-darkGray dark:text-gray-400"
						// onClick={() => notification()}
					>
						<i className="fa-regular fa-bell text-[20px]"></i>
						<span className="absolute right-[-10px] top-[-7px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[8px] text-white">
							10
						</span>
					</div>
					<ToggleLang /> */}
				</div>
			</div>
		</>
	);
}
