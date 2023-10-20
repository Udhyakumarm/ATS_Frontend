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

export default function noAuthFooter() {
	return (
		<>
			<div className="h-[40vh] w-full bg-white">
				<div
					className="m-2 h-full w-auto"
					style={{
						background: "linear-gradient(70deg, #2D129A -5.44%, #47BBFD 120.58%)"
					}}
				></div>
			</div>
		</>
	);
}
