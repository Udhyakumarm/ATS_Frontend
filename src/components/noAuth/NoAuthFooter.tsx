import ThemeChange from "../ThemeChange";
import { useRouter } from "next/router";
import ToggleLang from "../ToggleLang";
import toastcomp from "../toast";
import { useLangStore } from "@/utils/code";
import Logo from "../Logo";
import Link from "next/link";
import Image from "next/image";
import footerLogo from "/public/images/noAuth/footerLogo.png";
import { useEffect, useState } from "react";
import novusIcon from "/public/images/novus1.png";
import novusIcon12 from "/public/images/novus12.png";
import Button from "../Button";

export default function noAuthFooter() {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const LINKS = [
		{
			title: srcLang === "ja" ? "製品" : "Product",
			items: [srcLang === "ja" ? "応募者トラッキング" : "Applicant Tracking"]
		},
		{
			title: srcLang === "ja" ? "について" : "About",
			items: [
				srcLang === "ja" ? "会社概要" : "Company",
				srcLang === "ja" ? "ブログ" : "Blogs",
				srcLang === "ja" ? "デモを予約する" : "Book A Demo"
			]
		},
		{
			title: srcLang === "ja" ? "ポリシー" : "Policies",
			items: [
				srcLang === "ja" ? "プライバシーポリシー" : "Privacy Policy",
				srcLang === "ja" ? "利用規約" : "User Agreement",
				srcLang === "ja" ? "ご利用条件" : "Terms & Conditions"
			]
		}
	];

	const currentYear = new Date().getFullYear();
	return (
		<>
			<footer className="relative w-full bg-white py-4">
				<div
					className="mx-auto  rounded-md  px-8 py-4 sm:max-w-[600px] md:max-w-[720px] lg:max-w-[991px] xl:max-w-[1216px] 2xl:max-w-[1448px]"
					style={{
						background: "linear-gradient(70deg, #2D129A -5.44%, #47BBFD 120.58%)"
					}}
				>
					<div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
						{/* <h5 className="mb-6">Material Tailwind</h5> */}
						<div className="w-fit max-md:mx-auto">
							<Image src={footerLogo} priority alt={"Somhako"} width={200} />
						</div>
						<div className="grid grid-cols-3 items-start justify-between gap-4 max-sm:grid-cols-1">
							{LINKS.map(({ title, items }) => (
								<ul key={title} className="text-center max-sm:my-2">
									<p className="mb-3 text-xl font-medium text-white">{title}</p>
									{items.map((link) => (
										<li key={link}>
											<Link
												href="#"
												className="py-1.5 font-normal text-white/75 transition-colors hover:text-white hover:underline"
											>
												{link}
											</Link>
										</li>
									))}
								</ul>
							))}
						</div>
					</div>
					<div className="mt-8 flex w-full flex-col items-center justify-center border-t border-blue-50 py-4 md:flex-row md:justify-between">
						<p className="mb-4 text-center font-normal text-white md:mb-0">
							&copy; {currentYear} <a href="https://somhako.com/">Somhako</a>.{" "}
							{srcLang === "ja" ? "無断複写・転載を禁じます。" : "All Rights Reserved."}
						</p>
						<div className="flex gap-4 text-white sm:justify-center">
							<Link href="#" className="opacity-80 transition-opacity hover:opacity-100">
								<i className="fa-brands fa-linkedin"></i>
							</Link>
							<Link href="#" className="my-auto opacity-80 transition-opacity hover:opacity-100">
								<svg xmlns="http://www.w3.org/2000/svg" height="1rem" viewBox="0 0 512 512" className="fill-white">
									<path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
								</svg>
							</Link>
							<Link href="#" className="opacity-80 transition-opacity hover:opacity-100">
								<i className="fa-brands fa-medium"></i>
							</Link>
							<Link href="#" className="opacity-80 transition-opacity hover:opacity-100">
								<i className="fa-brands fa-facebook"></i>
							</Link>
							<Link href="#" className="opacity-80 transition-opacity hover:opacity-100">
								<i className="fa-brands fa-instagram"></i>
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
