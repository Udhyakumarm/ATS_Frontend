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
	const LINKS = [
		{
			title: "Product",
			items: ["Applicant Tracking"]
		},
		{
			title: "About",
			items: ["Company", "Blog", "Book A Demo"]
		},
		{
			title: "Policies",
			items: ["Privacy Policy", "User Agreement", "Terms & Conditions"]
		}
	];

	const currentYear = new Date().getFullYear();
	return (
		<>
			{/* <div className="h-[40vh] w-full bg-white">
				<div
					className="m-2 h-full w-auto"
					style={{
						background: "linear-gradient(70deg, #2D129A -5.44%, #47BBFD 120.58%)"
					}}
				></div>
			</div> */}
			<footer className="relative w-full bg-white p-4">
				<div
					className="mx-auto w-full rounded-md px-8 py-4"
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
							&copy; {currentYear} <a href="https://somhako.com/">Somhako</a>. All Rights Reserved.
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
