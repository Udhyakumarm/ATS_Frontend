import React, { useState, Fragment } from "react";
import tab1 from "public/images/noAuth/tab1.png";
import tab2 from "public/images/noAuth/tab2.png";
import tab3 from "public/images/noAuth/tab3.png";
import { Tab, Dialog, Listbox, Transition } from "@headlessui/react";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";
import Image from "next/image";

export default function Tabs() {
	const tabHeading_1 = [
		{
			title: "Talent Acquisition"
		},
		{
			title: "Talent Management"
		},
		{
			title: "Workflow Management"
		}
	];
	return (
		<>
			<Tab.Group>
				<Tab.List className={"overflow-auto"}>
					<div className="flex w-full justify-center ">
						{tabHeading_1.map((item, i) => (
							<Tab key={i} as={Fragment}>
								{({ selected }) => (
									<button
										className={
											"border-b-4 px-5 py-1 font-semibold focus:outline-none" +
											" " +
											(selected
												? "scale-105 border-gray-900 text-gray-900 dark:border-white dark:text-white"
												: "border-transparent text-darkGray dark:text-gray-400") +
											" " +
											(!item.hide && "display-none")
										}
									>
										<i className="fa-solid fa-circle-check"></i>&nbsp;
										{item.title}
									</button>
								)}
							</Tab>
						))}
					</div>
				</Tab.List>
				<Tab.Panels>
					<Tab.Panel>
						<div className="m-2 flex items-center justify-center gap-4 p-2">
							<Image src={tab1} alt="LP" width={"1000"} height={"1000"} className="h-[35vh] w-auto " />
							<div className="m-2 w-[25vw]  p-2">
								<Tab1 />
							</div>
						</div>
					</Tab.Panel>
					<Tab.Panel>
						<div className="m-2 flex items-center justify-center gap-4 p-2">
							<Image src={tab2} alt="LP" width={"1000"} height={"1000"} className="h-[35vh] w-auto " />
							<div className="m-2 w-[25vw]  p-2">
								<Tab2 />
							</div>
						</div>
					</Tab.Panel>
					<Tab.Panel>
						<div className="m-2 flex items-center justify-center gap-4 p-2">
							<Image src={tab3} alt="LP" width={"1000"} height={"1000"} className="h-[35vh] w-auto " />
							<div className="m-2 w-[25vw]  p-2">
								<Tab3 />
							</div>
						</div>
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</>
	);
}
