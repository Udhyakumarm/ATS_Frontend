import Image from "next/image";
import Button from "./Button";
import googleIcon from "/public/images/social/google-icon.png";

export default function JobCard_1() {
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
                <ul className="mb-2 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-white">
                    <li className="mr-3">Full Time</li>
                    <li className="mr-3">Remote</li>
                    <li className="mr-3">Junior</li>
                </ul>
                <div className="flex flex-wrap items-center justify-between">
                    <p className="mr-4 text-[12px] font-bold text-darkGray dark:text-white">$80k-110k/year</p>
                    <Button btnStyle="outlined" label="View" loader={false} />
                </div>
            </div>
        </>
    )
}