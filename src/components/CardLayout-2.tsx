import React from "react";
import Button from "./Button";

export default function CardLayout_2() {
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