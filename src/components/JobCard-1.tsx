import Image from "next/image";
import Button from "./Button";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import googleIcon from "/public/images/social/google-icon.png";

export default function JobCard_1({sklLoad} : any) {
    if(sklLoad === true) {
        return(
            <>
                <div className="h-full rounded-normal border bg-gradient-to-b from-[#f7f7f7] to-white py-2 px-3 dark:from-gray-700 dark:to-gray-900">
                    <div className="mb-4 flex items-center">
                        <div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded-[10px] bg-[#eeeeee] dark:bg-gray-800">
                            <Skeleton circle width={25} height={25} />
                        </div>
                        <aside className="w-[calc(100%-60px)]">
                            <h5 className="clamp_2 text-sm font-semibold"><Skeleton width={80} /></h5>
                            <p className="text-[12px]"><Skeleton width={40} /></p>
                        </aside>
                    </div>
                    <ul className="mb-2 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
                        <li className="mr-3 list-none"><Skeleton width={40} /></li>
                        <li className="mr-3"><Skeleton width={40} /></li>
                        <li className="mr-3"><Skeleton width={40} /></li>
                    </ul>
                    <div className="flex flex-wrap items-center justify-between">
                        <p className="mr-4 text-[12px] font-bold text-darkGray dark:text-gray-400"><Skeleton width={100} /></p>
                        <Skeleton width={60} height={25} />
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <div className="h-full rounded-normal border bg-gradient-to-b from-[#eeeeee] to-white py-2 px-3 dark:from-gray-700 dark:to-gray-900">
                <div className="mb-4 flex items-center">
                    <div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded-[10px] bg-[#eeeeee] dark:bg-gray-800">
                        <Image src={googleIcon} alt={"Company"} width={25} height={25} />
                    </div>
                    <aside className="w-[calc(100%-60px)]">
                        <h5 className="clamp_2 text-sm font-semibold">Ux Designer</h5>
                        <p className="text-[12px]">Figma</p>
                    </aside>
                </div>
                <ul className="mb-2 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
                    <li className="mr-3 list-none">Full Time</li>
                    <li className="mr-3">Remote</li>
                    <li className="mr-3">Junior</li>
                </ul>
                <div className="flex flex-wrap items-center justify-between">
                    <p className="mr-4 text-[12px] font-bold text-darkGray dark:text-gray-400">$80k-110k/year</p>
                    <Button btnStyle="outlined" label="View" loader={false} />
                </div>
            </div>
        </>
    )
}