import { useLangStore } from "@/utils/code";
import React from "react";

export function Column(props: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	let array = [
		{ Sourced: "応募前" },
		{ Review: "レビュー" },
		{ Interview: "面接" },
		{ Shortlisted: "面接通過" },
		{ Offer: "オファー" },
		{ Hired: "入社" },
		{ Rejected: "不合格" }
	];
	let foundObject = array.find((obj) => obj.hasOwnProperty(props.title));
	return (
		<div className="mx-1 min-w-[300px] p-2">
			<h5 className="mb-4 text-lg font-semibold">
				{srcLang === "ja" && foundObject ? foundObject[props.title] : props.title}
			</h5>
			{props.children}
		</div>
	);
}
