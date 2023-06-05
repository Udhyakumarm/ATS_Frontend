import Image from "next/image";
import Button from "./Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import googleIcon from "/public/images/social/google-icon.png";

export default function JobCard_1({ sklLoad, handleClick, data }: any) {
	if (sklLoad === true) {
		return (
			<>
				<div className="h-full rounded-normal border bg-gradient-to-b from-[#f7f7f7] to-white px-3 py-2 dark:from-gray-700 dark:to-gray-900">
					<div className="mb-4 flex items-center">
						<div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded-[10px] bg-[#eeeeee] dark:bg-gray-800">
							<Skeleton circle width={25} height={25} />
						</div>
						<aside className="w-[calc(100%-60px)]">
							<h5 className="clamp_2 text-sm font-semibold">
								<Skeleton width={80} />
							</h5>
							<p className="text-[12px]">
								<Skeleton width={40} />
							</p>
						</aside>
					</div>
					<ul className="mb-2 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
						<li className="mr-3 list-none">
							<Skeleton width={40} />
						</li>
						<li className="mr-3">
							<Skeleton width={40} />
						</li>
						<li className="mr-3">
							<Skeleton width={40} />
						</li>
					</ul>
					<div className="flex flex-wrap items-center justify-between">
						<p className="mr-4 text-[12px] font-bold text-darkGray dark:text-gray-400">
							<Skeleton width={100} />
						</p>
						<Skeleton width={60} height={25} />
					</div>
				</div>
			</>
		);
	}
	return (
		<>
			<div className="h-full rounded-normal border bg-gradient-to-b from-[#eeeeee] to-white px-3 py-2 dark:from-gray-700 dark:to-gray-900">
				<div className="mb-4 flex items-center">
					<div className="mr-4 flex h-[45px] w-[45px] items-center justify-center rounded-[10px] bg-[#eeeeee] dark:bg-gray-800">
						<Image src={googleIcon} alt={"Company"} width={25} height={25} />
					</div>
					<aside className="w-[calc(100%-60px)]">
						<h5 className="clamp_2 text-sm font-semibold">{data["job_title"]}</h5>
						{/* <p className="text-[12px]">Figma</p> */}
					</aside>
				</div>
				<ul className="mb-2 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
					<li className="mr-3 list-none capitalize">
						{data["employment_type"] && data["employment_type"].length > 0 ? (
							data["employment_type"]
						) : (
							<>Not Disclosed</>
						)}
					</li>
					<li className="mr-3 capitalize">
						{data["worktype"] && data["worktype"].length > 0 ? data["worktype"] : <>Not Disclosed</>}
					</li>
					<li className="mr-3 capitalize">
						{data["experience"] && data["experience"].length > 0 ? data["experience"] : <>Not Disclosed</>}
					</li>
				</ul>
				<div className="flex flex-wrap items-center justify-between">
					<p className="mr-4 text-[12px] font-bold text-darkGray dark:text-gray-400">
						{data["currency"] && data["currency"].length > 0 ? data["currency"] : <>Not Disclosed</>}
					</p>
					<Button btnStyle="outlined" btnType="submit" handleClick={handleClick} label="View" loader={false} />
				</div>
			</div>
		</>
	);
}
