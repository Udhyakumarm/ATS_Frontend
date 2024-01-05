//@ts-nocheck
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import moment from "moment";

export default function toastcomp2(title: any, jtitle: any, created: any, data: any, lang: any) {
	toast(
		(t) => (
			<>
				<span className="flex w-[300px] justify-between gap-2">
					<div className="flex flex-col gap-2">
						<small>{lang}</small>
						<p className="min-w-md mt-1 text-base font-semibold">
							{lang === "ja" && jtitle && jtitle.length > 0 ? jtitle : title}
						</p>
						{created && <span className="text-[10px]">{moment(created).fromNow()}</span>}
					</div>
					<button
						onClick={() => toast.dismiss(t.id)}
						className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
					>
						<i class="fa-solid fa-xmark"></i>
					</button>
				</span>
			</>
		),
		{
			reverseOrder: true,
			position: "bottom-right",
			duration: 6000,
			ariaProps: {
				role: "status",
				"aria-live": "polite"
			}
		}
	);
}
