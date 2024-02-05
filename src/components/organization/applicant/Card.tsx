import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import Image from "next/image";
import userImg1 from "/public/images/user-image1.jpeg";
import socialIcon from "/public/images/social/linkedin-icon.png";
import { useApplicantStore, useLangStore, useNotificationStore } from "@/utils/code";
import moment from "moment";
import Button from "@/components/Button";
import { DragSource, DropTarget } from "react-dnd";
import cn from "classnames";
import _ from "lodash";
import React from "react";
import toastcomp from "@/components/toast";

export default function Card(props: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const setcanid = useApplicantStore((state: { setcanid: any }) => state.setcanid);
	const setappid = useApplicantStore((state: { setappid: any }) => state.setappid);
	const setappdata = useApplicantStore((state: { setappdata: any }) => state.setappdata);
	const settype = useApplicantStore((state: { settype: any }) => state.settype);

	const getColorCode = (number) => {
		// Function to convert an RGB array to a hex color code
		const rgbToHex = (rgb) =>
			"#" + rgb.map((value) => Math.min(255, Math.max(0, value)).toString(16).padStart(2, "0")).join("");

		let colorVariant = [255, 0, 0]; // Default red color

		if (number > 70) {
			const greenValue = Math.round((number - 70) * 5.1); // Map 70-100 to 0-255
			colorVariant = [255 - greenValue, 255, 0]; // Bright green variant
		} else if (number > 50) {
			const yellowValue = Math.round((number - 50) * 5.1); // Map 50-70 to 0-255
			colorVariant = [255, 255 - yellowValue, 0]; // Yellow variant
		} else {
			// const redValue = Math.round((75 - number) * 5.1); // Map 0-50 to 0-255
			const redValue = Math.round((number - 0) * 5.1); // Map 0-40 to 0-255
			colorVariant = [255, 255 - redValue, 0]; // Yellow variant
		}

		// Convert the RGB array to a hex color code
		const hexColor = rgbToHex(colorVariant);
		if (props.atsVersion === "starter") {
			return "transpert";
		} else {
			return hexColor;
		}
	};

	return _.flowRight(
		props.connectDragSource,
		props.connectDropTarget
	)(
		<div
			className={cn("Card pb-1 ", {
				"Card--dragging": props.isDragging,
				"Card--spacer": props.isSpacer
			})}
		>
			{props.space === 0 ? (
				// <div
				// 	className={`mb-4 rounded-normal border border-4 bg-white px-4 py-2 shadow-normal dark:bg-gray-800 border-[${getColorCode(
				// 		props.data.percentage_fit
				// 	)}]`}
				// >
				<div
					className="mb-4 rounded-normal bg-white px-4 py-2 shadow-normal dark:bg-gray-800"
					style={{
						// boxShadow: `0px -1px 5px 0px  ${getColorCode(props.data.percentage_fit)}`, //shadow
						// boxShadow: `0 1px 3px 0  ${getColorCode(props.data.percentage_fit)}, 0 1px 2px -1px rgb(0 0 0 / 0.1)`, //shadow
						// boxShadow: `0 6px 9px -3px  ${getColorCode(props.data.percentage_fit)}, 0 2px 4px -2px rgb(0 0 0 / 0.1)`, //shadow -md
						// boxShadow: `0 10px 15px -3px ${getColorCode(props.data.percentage_fit)}, 0 4px 6px -4px rgb(0 0 0 / 0.1)`, //shadow-lg
						// 			boxShadow: `inset 0 10px 15px -3px ${getColorCode(props.data.percentage_fit)},0 4px 6px -4px rgb(0 0 0 / 0.1)`, //shadow-inset
						// boxShadow: `0 4px 6px -1px ${getColorCode(props.data.percentage_fit)}, 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
						borderColor: getColorCode(props.data.percentage_fit),
						borderWidth: ".20rem 0 0 0"
					}}
				>
					{/* <span
						className=" absolute right-[-10px] top-[-10px] rounded-full px-1 py-1 text-sm font-bold text-white dark:text-black"
						style={{
							backgroundColor: getColorCode(props.data.percentage_fit)
						}}
					>
						{props.data.percentage_fit}
					</span> */}
					<div className="mb-2 flex items-center justify-between">
						<aside className="flex items-center">
							<Image src={userImg1} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
							<h5 className="pl-4 text-sm font-semibold">
								{props["data"]["type"] === "career" && (
									<>
										{props["data"]["user"]["first_name"]} {props["data"]["user"]["last_name"]}
									</>
								)}
								{props["data"]["type"] === "vendor" && (
									<>
										{props["data"]["applicant"]["first_name"]} {props["data"]["applicant"]["last_name"]}
									</>
								)}
							</h5>
						</aside>
						<aside>
							{/* <Image src={socialIcon} alt="Social" className="h-[16px] w-auto" /> */}
							{props["data"]["type"]}
						</aside>
					</div>
					<div className="flex justify-between">
						<p
							className="mb-1 cursor-pointer text-[12px] text-darkGray"
							onClick={() => {
								navigator.clipboard.writeText(props["data"]["arefid"]);
								toastcomp("ID Copied to clipboard", "success");
							}}
						>
							{props["data"]["arefid"]}
						</p>
						{props.atsVersion != "starter" && <p className="text-[12px] ">{props["data"]["percentage_fit"]}%</p>}
					</div>
					<div className="flex items-center justify-between">
						<aside className="flex items-center text-[12px] text-darkGray dark:text-gray-400">
							<i className="fa-solid fa-calendar-days mr-2 text-[16px]"></i>
							<p>{moment(props["data"]["timestamp"]).format("Do MMM YYYY")}</p>
						</aside>
						<Button
							btnStyle="outlined"
							label={srcLang === "ja" ? "みる" : "View"}
							btnType="button"
							handleClick={() => {
								setjobid(props["data"]["job"]["refid"]);
								// setcanid(props["data"]["user"]["erefid"]);
								setappid(props["data"]["arefid"]);
								settype(props["data"]["type"]);
								setappdata(props["data"]);
								console.log("&&&&", "click ", props["data"]);
								// router.push("applicants/detail");
								window.open("applicants/detail", '_blank');
							}}
						/>
					</div>
				</div>
			) : (
				<div className="mb-4 rounded-normal bg-white px-4 py-2 text-center shadow-normal dark:bg-gray-800">
					{srcLang === "ja" ? "申請者がいません" : "No Applicant"} <br />{" "}
					<small>
						<i>{srcLang === "ja" ? "ここにドラッグできます" : "You Can Drag Here"}</i>
					</small>
				</div>
			)}
		</div>
	);
}

export const DraggableCard = _.flowRight([
	DropTarget(
		"Card",
		{
			hover(props, monitor) {
				const { columnId, columnIndex } = props;
				const draggingItem = monitor.getItem();
				if (draggingItem.id !== props.id) {
					props.moveCard(draggingItem.id, columnId, columnIndex);
				}
			}
		},
		(connect) => ({
			connectDropTarget: connect.dropTarget()
		})
	),
	DragSource(
		"Card",
		{
			beginDrag(props) {
				return { id: props.id };
			},

			isDragging(props, monitor) {
				return props.id === monitor.getItem().id;
			}
		},
		(connect, monitor) => ({
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging()
		})
	)
])(Card);
