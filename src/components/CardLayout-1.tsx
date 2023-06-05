import React from "react";
import Image from "next/image";
import Button from "./Button";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import testGorrila from "/public/images/test-gorrila.png";

export default function CardLayout_1({ handleIntegrate, label, access, handlePost, isBlank, sklLoad }: any) {
    if(sklLoad === true) {
        return(
            <div className="h-full rounded-normal bg-lightBlue dark:bg-gray-700 p-6 shadow-lg">
                <div className="mb-4 flex flex-wrap items-center justify-between">
                    <Skeleton circle width={30} height={30} />
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
        {
            isBlank
            ?
            <>
                <div className="h-full rounded-normal bg-lightBlue dark:bg-gray-700 p-6 shadow-lg">
                    <div className="mb-4 flex flex-wrap items-start justify-between">
                        <Image src={testGorrila} width={300} height={200} alt="Assessment" className="mb-2 h-[30px] w-auto mr-2" />
                        <div className="-mt-2">
                            <Button btnStyle="outlined" label={'Add'} />
                        </div>
                    </div>
                    <h4 className="text-lg font-semibold">Test Gorilla</h4>
                </div>
            </>
            :
            <>
                <div className="h-full rounded-normal bg-lightBlue dark:bg-gray-700 p-6 shadow-lg">
                    <div className="mb-4 flex flex-wrap items-start justify-between">
                        <Image src={"/images/logos/" + label.toLowerCase() + "_logo.png"} width={300} height={200} alt="Assessment" className="mb-2 h-[30px] w-auto" />
                        <div className="-mt-2 pl-2">
                            <Button btnStyle="outlined" label={access ? "Post Job" : "Add"} onClick={() => (access ? handlePost() : handleIntegrate())} />
                        </div>
                    </div>
                    <h4 className="text-lg font-semibold">{label}</h4>
                </div>
            </>
        }
        </>
    )
}