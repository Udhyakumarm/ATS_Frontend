import { useState } from "react"
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import Image from "next/image";
import userImg from "/public/images/user-image.png";
import socialIcon from "/public/images/social/linkedin-icon.png";
import { useApplicantStore } from "@/utils/code";
import moment from "moment";
import Button from "@/components/Button";
import {DragSource, DropTarget} from 'react-dnd';
import cn from 'classnames';
import _ from 'lodash';
import React from 'react';

export default function Card(props: any) {
    const router = useRouter()
    const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const setcanid = useApplicantStore((state: { setcanid: any }) => state.setcanid);
    return _.flowRight(props.connectDragSource, props.connectDropTarget)(
        <div
        className={cn('Card', {
            'Card--dragging': props.isDragging,
            'Card--spacer': props.isSpacer,
        })}
        >
        {props.space === 0 ?
        <div className="mb-4 rounded-normal bg-white py-2 px-4 shadow-normal">
            <div className="mb-2 flex items-center justify-between">
                <aside className="flex items-center">
                    <Image src={userImg} alt="User" width={30} className="h-[30px] rounded-full object-cover" />
                    <h5 className="pl-4 text-sm font-semibold">
                        {props["data"]["user"]["first_name"]} {props["data"]["user"]["last_name"]}
                    </h5>
                </aside>
                <aside>
                    <Image src={socialIcon} alt="Social" className="h-[16px] w-auto" />
                </aside>
            </div>
            <p className="mb-1 text-[12px] text-darkGray">ID - {props["data"]["user"]["erefid"]}</p>
            <div className="flex items-center justify-between">
                <aside className="flex items-center text-[12px] text-darkGray dark:text-white">
                    <i className="fa-solid fa-calendar-days mr-2 text-[16px]"></i>
                    <p>{moment(props["data"]["timestamp"]).format("Do MMM YYYY")}</p>
                </aside>
                <Button
                    btnStyle="outlined"
                    label="View"
                    btnType="button"
                    handleClick={() => {
                        setjobid(props["data"]["job"]["refid"]);
                        setcanid(props["data"]["user"]["erefid"]);
                        router.push("applicants/detail");
                    }}
                />
            </div>
        </div> 
        :
        <div className="mb-4 rounded-normal py-2 px-4 shadow-normal flex h-[calc(100vh-305px)] justify-center items-center ">No Applicant (You Can Drag Here)</div>
        }
        </div>
    )
}


export const DraggableCard = _.flowRight([
    DropTarget(
      'Card',
      {
        hover(props, monitor) {
          const {columnId, columnIndex} = props;
          const draggingItem = monitor.getItem();
          if (draggingItem.id !== props.id) {
            props.moveCard(draggingItem.id, columnId, columnIndex);
          }
        },
      },
      connect => ({
        connectDropTarget: connect.dropTarget(),
      })
    ),
    DragSource(
      'Card',
      {
        beginDrag(props) {
          return {id: props.id};
        },
  
        isDragging(props, monitor) {
          return props.id === monitor.getItem().id;
        },
      },
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
      })
    ),
])(Card);