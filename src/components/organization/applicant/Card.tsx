import { useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import Image from "next/image";
import userImg from "/public/images/user-image.png";
import socialIcon from "/public/images/social/linkedin-icon.png";
import { useApplicantStore, useLangStore, useNotificationStore } from "@/utils/code";
import moment from "moment";
import Button from "@/components/Button";
import { DragSource, DropTarget } from "react-dnd";
import cn from "classnames";
import _ from "lodash";
import React from "react";

export default function Card(props: any) {
	const srcLang = useLangStore((state: { lang: any }) => state.lang);
	const router = useRouter();
	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const setcanid = useApplicantStore((state: { setcanid: any }) => state.setcanid);
	const setappid = useApplicantStore((state: { setappid: any }) => state.setappid);
	const setappdata = useApplicantStore((state: { setappdata: any }) => state.setappdata);
	const settype = useApplicantStore((state: { settype: any }) => state.settype);
	return _.flowRight(
		props.connectDragSource,
		props.connectDropTarget
	)(
		<div
			className={cn("Card", {
				"Card--dragging": props.isDragging,
				"Card--spacer": props.isSpacer
			})}
		>
			{props.space === 0 ? (
				<div className="mb-4 rounded-normal bg-white px-4 py-2 shadow-normal dark:bg-gray-800">
					<div className="mb-2 flex items-center justify-between">
						<aside className="flex items-center">
							<Image src={userImg} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
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
					<p className="mb-1 text-[12px] text-darkGray">ID - {props["data"]["arefid"]}</p>
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
								router.push("applicants/detail");
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
