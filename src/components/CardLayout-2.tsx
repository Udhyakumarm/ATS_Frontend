import React from "react";
import Button from "./Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useLangStore } from "@/utils/code";

export default function CardLayout_2({ sklLoad, data }: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	if (sklLoad === true) {
		return (
			<div className="h-full rounded-normal bg-lightBlue p-6 shadow-lg dark:bg-gray-700">
				<div className="mb-4 flex flex-wrap items-center justify-between">
					<Skeleton width={60} height={20} />
					<div className="pl-2">
						<Skeleton width={60} height={25} />
					</div>
				</div>
				<h4 className="text-lg font-semibold">
					<Skeleton width={130} />
					<Skeleton count={2} />
				</h4>
			</div>
		);
	}
	return (
		<>
			<div className="h-full rounded-normal bg-lightBlue p-6 shadow-lg dark:bg-gray-700">
				<div className="mb-2 flex items-start justify-between">
					<h4 className="my-1 mr-2 text-lg font-semibold">{data["company_name"]}</h4>
					<Button btnStyle="outlined" label={srcLang==='ja' ? '追加' : 'Add'} />
				</div>
				<p className="font-semibold text-darkGray dark:text-gray-300">{data["agent_name"]}</p>
				<p className="text-sm text-darkGray dark:text-gray-300">{data["email"]}</p>
			</div>
		</>
	);
}
