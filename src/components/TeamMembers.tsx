import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import userImg1 from "/public/images/user-image1.jpeg";

export default function TeamMembers({ selectedData, axiosInstanceAuth2 }: any) {
	const [tm, settm] = useState([]);
	const [orgdata, setorgdata] = useState({});
	const [count, setcount] = useState(0);

	async function loadTeamMember(refid: any) {
		await axiosInstanceAuth2
			.get(`/organization/list/team/${refid}/`)
			.then(async (res) => {
				// console.log("team data", res.data);
				settm(res.data);
				var data = res.data;
				let fdata = {};
				for (let i = 0; i < data.length; i++) {
					await axiosInstanceAuth2.get(`/organization/list/org/${data[i]["user"]["id"]}/`).then(async (res2) => {
						fdata[data[i]["id"]] = res2.data[0];
					});
				}
				// console.log("team org data", fdata);
				setorgdata(fdata);
			})
			.catch((err) => {
				console.log("team data", err);
			});
	}

	useEffect(() => {
		// console.log("team selectedData", selectedData.refid);
		if (selectedData.name === "All") {
			loadTeamMember("all");
		} else {
			loadTeamMember(selectedData.refid);
		}
	}, [selectedData]);

	useEffect(() => {
		setcount(tm.length);
	}, [tm]);

	return (
		<>
			{count > 0 && (
				<div className="flex items-center">
					<Menu as="div" className="relative flex">
						<Menu.Button className={"relative"}>
							<div className="flex flex-row-reverse">
								{tm
									.slice(0, 3)
									.map((data, i) =>
										data["profile"] && data["profile"].length > 0 ? (
											<Image
												key={i}
												src={data["profile"]}
												alt="User"
												width={35}
												height={35}
												className={`h-[35px] rounded-full object-cover`}
											/>
										) : (
											<Image
												key={i}
												src={userImg1}
												alt="User"
												width={35}
												height={35}
												className={`h-[35px] rounded-full object-cover`}
											/>
										)
									)}
								{count > 3 && <div className="mt-auto">...</div>}
							</div>
							<span className="absolute right-0 top-0 block flex h-full w-[35px] items-center justify-center rounded-full bg-[rgba(0,0,0,0.3)] text-sm text-white">
								+{count}
							</span>
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
							<Menu.Items
								className={
									"absolute right-0 top-[100%] z-20 mt-2 max-h-[400px] w-[250px] overflow-y-auto rounded-normal bg-white py-2 shadow-normal dark:bg-gray-700"
								}
							>
								<Menu.Item>
									<div className="p-3">
										<h6 className="border-b pb-2 font-bold">Team Members</h6>
										<div>
											{tm.map((data, i) => (
												<div className="mt-4 flex items-center" key={i}>
													{data["profile"] && data["profile"].length > 0 ? (
														<Image
															key={i}
															src={data["profile"]}
															alt="User"
															width={40}
															height={40}
															className={`h-[40px] rounded-full object-cover`}
														/>
													) : (
														<Image
															key={i}
															src={userImg1}
															alt="User"
															width={40}
															height={40}
															className={`h-[40px] rounded-full object-cover`}
														/>
													)}
													<aside className="pl-4 text-sm">
														<h5 className="font-bold">
															{orgdata[data["id"]] && orgdata[data["id"]]["name"] && orgdata[data["id"]]["name"]}
														</h5>
														<p className="text-darkGray dark:text-gray-400">
															{orgdata[data["id"]] && orgdata[data["id"]]["role"] && orgdata[data["id"]]["role"]}
														</p>
													</aside>
												</div>
											))}
										</div>
									</div>
								</Menu.Item>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			)}
		</>
	);
}
