import React from "react";
import Button from "./Button";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function CardLayout_2({sklLoad} : any) {
    if(sklLoad === true) {
        return(
            <div className="h-full rounded-normal bg-lightBlue dark:bg-gray-700 p-6 shadow-lg">
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
        )
    }
    return(
        <>
        <div className="h-full rounded-normal bg-lightBlue dark:bg-gray-700 p-6 shadow-lg">
            <div className="mb-2 flex items-start justify-between">
                <h4 className="text-lg font-semibold my-1 mr-2">Company Name</h4>
                <Button btnStyle="outlined" label={'Add'} />
            </div>
            <p className="text-darkGray dark:text-gray-300 font-semibold">Jane Cooper</p>
            <p className="text-darkGray dark:text-gray-300 text-sm">jane@xyzemail.com</p>
        </div>
        </>
    )
}