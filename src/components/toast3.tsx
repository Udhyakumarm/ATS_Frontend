//@ts-nocheck
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { useRouter } from "next/router";
import { useApplicantStore } from "@/utils/code";

const ToastComp22 = ({ data, axiosInstanceAuth2, fetchRealNotificationCount, afterclickRealNotification }) => {
	// const [toastId, setToastId] = useState(null);

	const router = useRouter();
	const lang = router.locale;
	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const setappid = useApplicantStore((state: { setappid: any }) => state.setappid);
	const setappdata = useApplicantStore((state: { setappdata: any }) => state.setappdata);
	const settype = useApplicantStore((state: { settype: any }) => state.settype);

	async function updateRealNotification(id: any) {
		await axiosInstanceAuth2
			.put(`/applicant/read-real-notification/${id}/`)
			.then(async (res) => {
				// console.log("!!!!", "Real Notification Read success");
				fetchRealNotificationCount();
			})
			.catch((err) => {
				// console.log("!!!!", "Real Notification Read error", err);
			});
	}

	async function handleClick(data: any) {
		// console.log("!!!!!", "notification clicked");
		//first action unread

		if (data["notification_type"] === "Applicant") {
			updateRealNotification(data.id);
			var data2 = data["applicant"];
			data2["type"] = "career";
			setjobid(data["applicant"]["job"]["refid"]);
			setappid(data["applicant"]["arefid"]);
			settype("career");
			setappdata(data2);
			router.push(data["link"]);
		} else if (data["notification_type"] === "Vendor Applicant") {
			updateRealNotification(data.id);
			var data2 = data["vapplicant"];
			data2["type"] = "vendor";
			setjobid(data["vapplicant"]["job"]["refid"]);
			setappid(data["vapplicant"]["arefid"]);
			settype("vendor");
			setappdata(data2);
			router.push(data["link"]);
		} else if (data["link"] && data["link"].length > 0) {
			updateRealNotification(data.id);
			router.push(data["link"]);
		}
	}

	function handleClick2() {
		// console.log("!!!!!", "notification clicked all");
		afterclickRealNotification();
	}

	useEffect(() => {
		if (data) {
			// console.log("!!!!", "toast3");
			const limitedData = data.slice(0, 4);
			for (let i = 0; i < limitedData.length; i++) {
				toast(
					(t) => (
						<>
							<span
								className={`flex w-[300px] select-none justify-between gap-2 ${
									limitedData[i]["link"] && limitedData[i]["link"].length > 0 ? "cursor-pointer" : "cursor-not-allowed"
								}`}
								onClick={(e) => {
									e.stopPropagation();
									handleClick(limitedData[i]);
									toast.dismiss(t.id);
								}}
							>
								<div className="flex flex-col gap-2">
									<p className="min-w-md mt-1 text-base font-semibold">
										{lang === "ja" && limitedData[i]["jtitle"] && limitedData[i]["jtitle"].length > 0
											? limitedData[i]["jtitle"]
											: limitedData[i]["title"]}
									</p>
									{limitedData[i]["created"] && (
										<span className="text-[10px]">{moment(limitedData[i]["created"]).fromNow()}</span>
									)}
								</div>
								<button
									onClick={(e) => {
										e.stopPropagation();
										toast.dismiss(t.id);
									}}
									className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
								>
									<i className="fa-solid fa-xmark"></i>
								</button>
							</span>
						</>
					),
					{
						reverseOrder: true,
						position: "bottom-right",
						duration: 5000,
						ariaProps: {
							role: "status",
							"aria-live": "polite"
						}
					}
				);
			}
			if (data.length > 4) {
				toast(
					(t) => (
						<>
							<span
								className="flex w-[300px] cursor-pointer select-none justify-between gap-2"
								onClick={(e) => {
									e.stopPropagation();
									handleClick2();
									toast.dismiss(t.id);
								}}
							>
								<p className="min-w-md mt-1 text-base font-semibold">
									{lang === "ja" ? `さらに${data.length - 4}件の通知 ...` : `${data.length - 4} more notifications ...`}
								</p>
								<button
									onClick={(e) => {
										e.stopPropagation();
										toast.dismiss(t.id);
									}}
									className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
								>
									<i className="fa-solid fa-xmark"></i>
								</button>
							</span>
						</>
					),
					{
						reverseOrder: true,
						position: "bottom-right",
						duration: 5000,
						ariaProps: {
							role: "status",
							"aria-live": "polite"
						}
					}
				);
			}
		}
	}, [data]);

	return null; // Since this is just a side effect, you don't need to render anything
};

export default ToastComp22;
