import React, { useEffect, useState } from "react";
import Image from "next/image";
import comingImg from "/public/images/coming-soon-icon.png";
import { useLangStore } from "@/utils/code";
import Link from "next/link";

export default function AnalyticsComp({ data2, axiosInstanceAuth2 }: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);

	const [data, setdata] = useState({});
	async function getAnalyticsData2(refid: any) {
		await axiosInstanceAuth2.post(`/chatbot/only-analytics/${refid}/`).then((res) => {
			setdata(res.data);
			console.log("&&", "AD!", res.data);
		});
	}

	useEffect(() => {
		if (data2["refid"].length > 0) {
			getAnalyticsData2(data2["refid"]);
		}
	}, [data2]);

	return (
		<div className="my-2 mb-3  max-w-[85%] rounded bg-white text-left shadow-lg dark:bg-gray-700">
			<div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 text-xs">
				<div className="flex flex-wrap items-center gap-1">
					<span className="max-w-[40%] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold">
						{data2["jobTitle"]}
					</span>
					<span>({data2["refid"]})</span>
				</div>
				<Link href="/organization/jobs/active" className="text-[#50F] underline dark:text-white">
					view
				</Link>
			</div>
			<div className="flex flex-wrap justify-center gap-2 pb-3 text-xs">
				<div className="border border-borderColor p-1 font-bold dark:bg-lightBlue">
					<span className="pr-0.5 dark:text-black">{data["hired"] ? data["hired"] : <>0</>}</span>
					<span className="pl-0.5 text-[#197D00]">Hired</span>
				</div>
				<div className="border border-borderColor p-1 font-bold dark:bg-lightBlue">
					<span className="pr-0.5 dark:text-black">{data["pipeline"] ? data["pipeline"] : <>0</>}</span>
					<span className="pl-0.5 text-[#CB5805]">In Process</span>
				</div>
				<div className="border border-borderColor p-1 font-bold dark:bg-lightBlue">
					<span className="pr-0.5 dark:text-black">{data["process"] ? data["process"] : <>0</>}</span>
					<span className="pl-0.5 text-[#1A73E8]">In Pipeline</span>
				</div>
				<div className="border border-borderColor p-1 font-bold dark:bg-lightBlue">
					<span className="pr-0.5 dark:text-black">{data["rejected"] ? data["rejected"] : <>0</>}</span>
					<span className="pl-0.5 text-[#FF1515]">Rejected</span>
				</div>
			</div>
		</div>
	);
}
