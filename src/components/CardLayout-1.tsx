import React from "react";
import Image from "next/image";
import Button from "./Button";
import testGorrila from "/public/images/test-gorrila.png";

export default function CardLayout_1({ handleIntegrate, label, access, handlePost, isBlank }: any) {
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