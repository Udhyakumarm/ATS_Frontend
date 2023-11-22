import React from "react";
import Image from "next/image";
import permiumImg from "/public/images/upgrade-plan-icon.png";
import { useRouter } from "next/router";
import toastcomp from "../toast";
import Button from "../Button";
import { useLangStore } from "@/utils/code";

export default function PermiumComp({ userRole, title, setUpgradePlan }: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	return (
		<div className="flex h-full w-full cursor-pointer items-center justify-center">
			<div className="mx-auto w-full max-w-[400px] rounded-normal bg-[rgba(255,255,255,0.5)] p-6 text-center text-white transition hover:scale-[1.05]">
				<Image src={permiumImg} alt="Upgrade" width={100} height={100} className="mx-auto mb-6 w-auto" />
				<h3 className="textGrad mb-4 inline-block rounded-[10px] border px-2 py-1 text-3xl font-extrabold">
					{title && title.length > 0 && (
						<>
							{title}
							<br />
						</>
					)}{" "}
					{srcLang === "ja" ? "プレミアムプランにアップグレード" : "Go Enterprise"}
				</h3>
				<p className="mb-2 text-sm text-darkGray">
					{srcLang === "ja"
						? "より高度な機能を備えたプレミアムプランにアップグレード"
						: "Upgrade your experience with our enterprise package for enhanced features and exclusive benefits."}
				</p>
				<Button
					btnStyle="sm"
					label={srcLang === "ja" ? "アップグレード" : "Upgrade"}
					btnType="button"
					handleClick={() => {
						if (userRole === "Super Admin") {
							router.push("/organization/settings/pricing");
						} else {
							toastcomp("Kindly Contact Your Super Admin", "warning");
						}
						if (setUpgradePlan) setUpgradePlan(false);
					}}
				/>
			</div>
		</div>
	);
}
