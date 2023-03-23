import { useState, Fragment } from "react";
import { Menu, Transition } from '@headlessui/react'
import Button from "./Button";

export default function JobCard_2({ job, handleView }: any) {
	const [starred, setStarred] = useState(false);

	return (
		<>
		<div className="h-full rounded-normal shadow-normal bg-white dark:bg-gray-700 py-2 px-5">
			<div className="flex flex-wrap items-center justify-between mb-2">
				<div className="flex items-center my-2">
					<button type="button" onClick={() => setStarred((prev) => !prev)}>
						<i className={'mr-2' + ' ' + (starred ? "fa-solid fa-star text-yellow-400" : "fa-solid fa-star text-gray-200")}/>
					</button>
					<h4 className="font-bold">{job.job_title}</h4>
				</div>
				<div className="text-right text-gray-400">
					<button type="button" className="mr-6">
						<i className="fa-solid fa-copy"></i>
					</button>
					<Menu as="div" className="relative inline-block">
						<Menu.Button className={'p-2'}>
							<i className="fa-solid fa-ellipsis-vertical"></i>
						</Menu.Button>
						<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className={'absolute right-0 top-[100%] text-darkGray dark:text-white w-[200px] rounded-normal bg-white py-2 shadow-normal dark:bg-gray-700'}>
								<Menu.Item>
									<button type="button" className="w-full text-left relative cursor-pointer px-6 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900">
										Edit Job
									</button>
								</Menu.Item>
								<Menu.Item>
									<button type="button" className="w-full text-left relative cursor-pointer px-6 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900">
										Clone Job
									</button>
								</Menu.Item>
								<Menu.Item>
									<button type="button" className="w-full text-left relative cursor-pointer px-6 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900">
										Archieve Job
									</button>
								</Menu.Item>
								<Menu.Item>
									<button type="button" className="w-full text-left relative cursor-pointer px-6 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900">
										Upload Resume (PDF/DOC)
									</button>
								</Menu.Item>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</div>
			<ul className="mb-4 flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-white">
				<li className="mr-3">{job.worktype}</li>
				<li className="mr-3">{job.employment_type}</li>
			</ul>
			<div className="mx-[-15px] mb-4 flex flex-wrap text-sm">
				<div className="pl-[15px] mr-[15px] grow border-r">
					<h5 className="text-darkGray dark:text-gray-400 mb-1">Total Candidates</h5>
					<h6 className="text-lg font-semibold">50</h6>
				</div>
				<div className="pl-[15px] mr-[15px] grow border-r">
					<h5 className="text-darkGray dark:text-gray-400 mb-1">Active Candidates</h5>
					<h6 className="text-lg font-semibold">50</h6>
				</div>
				<div className="pl-[15px] grow">
					<h5 className="text-darkGray dark:text-gray-400 mb-1">Job ID</h5>
					<h6 className="text-lg font-semibold">50141</h6>
				</div>
			</div>
			<Button btnStyle="outlined" btnType="button" label="View Job" handleClick={() => handleView(job)} />
		</div>
		</>
	);
}
