import Button from "@/components/Button";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useCarrierStore } from "@/utils/code";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import { Tab, Transition } from "@headlessui/react";
import signature from "/public/images/signature.jpg";
import Image from "next/image";

export default function CanCareerDashboard() {
	const [sklLoad] = useState(true);
	const { data: session } = useSession();
	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const setcid = useCarrierStore((state: { setcid: any }) => state.setcid);
	const orgdetail = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);
	const setorgdetail = useCarrierStore((state: { setorgdetail: any }) => state.setorgdetail);
	const jid = useCarrierStore((state: { jid: any }) => state.jid);
	const setjid = useCarrierStore((state: { setjid: any }) => state.setjid);
	const jdata = useCarrierStore((state: { jdata: any }) => state.jdata);
	const setjdata = useCarrierStore((state: { setjdata: any }) => state.setjdata);

	const [token, settoken] = useState("");
	const [loadash, setloadash] = useState([]);
	const router = useRouter();

	useEffect(() => {
		if (orgdetail && Object.keys(orgdetail).length === 0 && session) {
			if (cname == "" || cid == "") router.replace(`/organization/${cname}`);
			else router.back();
		}
	}, [cid, orgdetail, cname, session]);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	async function loaddashboard() {
		const axiosInstanceAuth2 = axiosInstanceAuth(token);
		await axiosInstanceAuth2
			.get(`/job/applicants/alls/${cid}/`)
			.then(async (res) => {
				console.log("!", res.data);
				setloadash(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		if (token && token.length > 0 && cid && cid.length > 0) {
			loaddashboard();
		}
	}, [token, cid]);

	return (
		<>
			<main className="py-8">
				<div className="container">
					<h3 className="mb-6 text-xl font-bold">Dashboard</h3>
					<div className="overflow-hidden rounded-normal border dark:border-gray-600">
						<Tab.Group>
							<Tab.List className={"border-b bg-white px-6 shadow-normal dark:border-gray-600 dark:bg-gray-800"}>
								<Tab as={Fragment}>
									{({ selected }) => (
										<button
											className={
												"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
												" " +
												(selected
													? "border-primary text-primary"
													: "border-transparent text-darkGray dark:text-gray-400")
											}
										>
											Applied Jobs
										</button>
									)}
								</Tab>
								<Tab as={Fragment}>
									{({ selected }) => (
										<button
											className={
												"border-b-4 px-6 py-3 font-semibold focus:outline-none" +
												" " +
												(selected
													? "border-primary text-primary"
													: "border-transparent text-darkGray dark:text-gray-400")
											}
										>
											Offer
										</button>
									)}
								</Tab>
							</Tab.List>
							<Tab.Panels>
								<Tab.Panel>
									<div className="bg-white p-6 dark:bg-gray-800">
										<div className="mx-[-7px] flex flex-wrap">
											{sklLoad
												? loadash &&
												  loadash.map((data, i) => (
														<div className="mb-[15px] w-full px-[7px] md:max-w-[50%] lg:max-w-[calc(100%/3)]" key={i}>
															<div className="h-full rounded-[10px] bg-white p-5 shadow-normal dark:bg-gray-700">
																<button
																	type="button"
																	className="mb-3 cursor-pointer text-lg font-bold"
																	onClick={() => {
																		setjid(data["job"]["refid"]);
																		setjdata(data["job"]);
																		router.push(`/organization/${cname}/job-detail`);
																	}}
																>
																	{data["job"]["job_title"]}
																</button>
																<ul className="mb-3 flex flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
																	<li className="mr-8">
																		<i className="fa-solid fa-location-dot mr-2 capitalize"></i>
																		{data["job"]["worktype"] ? data["job"]["worktype"] : <>Not Disclosed</>}
																	</li>
																	<li className="mr-8">
																		<i className="fa-regular fa-clock mr-2 capitalize"></i>
																		{data["job"]["employment_type"] ? (
																			data["job"]["employment_type"]
																		) : (
																			<>Not Disclosed</>
																		)}
																	</li>
																	<li>
																		<i className="fa-solid fa-dollar-sign mr-2 capitalize"></i>
																		{data["job"]["currency"] ? data["job"]["currency"] : <>Not Disclosed</>}
																	</li>
																</ul>
																<p className="border-b pb-3 text-[12px] text-darkGray dark:text-gray-400">
																	Applied On - {moment(data["timestamp"]).format("DD MMM YYYY")}
																</p>
																<ul className="pt-3 text-[12px] font-bold text-darkGray dark:text-gray-400">
																	<li className="flex items-center">
																		<span className="mr-3 h-[8px] w-[8px] rounded-full bg-gradLightBlue"></span>{" "}
																		{data["status"]}
																	</li>
																</ul>
																{/* <div className="flex flex-wrap items-center justify-between">
																<div className="mr-4">
																	<Button
																		btnStyle="sm"
																		label="View"
																		loader={false}
																		btnType="button"
																		handleClick={() => {
																			setjid(data["job"]["refid"]);
																			setjdata(data["job"]);
																			router.push(`/organization/${cname}/job-detail`);
																		}}
																	/>
																</div>
																<p className="text-[12px] font-bold text-darkGray dark:text-gray-400">
																	{moment(data["timestamp"]).fromNow()}
																</p>
															</div> */}
															</div>
														</div>
												  ))
												: Array(5).fill(
														<div className="mb-[15px] w-full px-[7px] md:max-w-[50%] lg:max-w-[calc(100%/3)]">
															<div className="h-full rounded-[10px] bg-white p-5 shadow-normal dark:bg-gray-700">
																<h4 className="mb-3 text-lg font-bold">
																	<Skeleton width={160} />
																</h4>
																<ul className="mb-3 flex flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
																	<li className="mr-8">
																		<Skeleton width={40} />
																	</li>
																	<li className="mr-8">
																		<Skeleton width={40} />
																	</li>
																	<li>
																		<Skeleton width={40} />
																	</li>
																</ul>
																<div className="flex flex-wrap items-center justify-between">
																	<div className="mr-4">
																		<Skeleton width={80} height={25} />
																	</div>
																	<p className="text-[12px] font-bold text-darkGray dark:text-gray-400">
																		<Skeleton width={60} />
																	</p>
																</div>
															</div>
														</div>
												  )}
										</div>
									</div>
								</Tab.Panel>
								<Tab.Panel>
									<div className="bg-white p-6 dark:bg-gray-800">
										<div className="flex flex-wrap items-center justify-between bg-lightBlue p-2 px-8 text-sm dark:bg-gray-700">
											<p className="my-2 font-bold">Offer Letter</p>
											<button className="my-2 inline-block font-bold text-primary hover:underline dark:text-gray-200">
												<i className="fa-solid fa-download mr-2"></i>
												Download
											</button>
										</div>
										<div className="mx-auto w-full max-w-[700px] py-4">
											<p className="text-center">Preview Is Here</p>
											<div className="pt-8">
												<h5 className="mb-2 font-bold">Add Signature</h5>
												<label
													htmlFor="uploadBanner"
													className="flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-normal border-2 border-dashed py-4 hover:bg-lightBlue dark:hover:bg-gray-700"
												>
													<i className="fa-solid fa-plus text-[80px] text-lightGray"></i>
													<p className="text-sm text-darkGray dark:text-gray-400">
														Upload Signature or Photo
														<br />
														<small>(File type should be .png format)</small>
													</p>
													<Image
														src={signature}
														alt="Sign"
														width={1200}
														height={800}
														className="mx-auto h-auto max-h-[200px] w-auto object-contain"
													/>
													<input type="file" hidden id="uploadBanner" accept="image/*" />
												</label>
											</div>
										</div>
										<div className="flex flex-wrap items-center justify-center border-t pt-4 dark:border-t-gray-600">
											<div className="mx-2">
												<Button btnStyle="success" label="Accept" />
											</div>
											<div className="mx-2">
												<Button btnStyle="danger" label="Reject" />
											</div>
										</div>
									</div>
								</Tab.Panel>
							</Tab.Panels>
						</Tab.Group>
					</div>
				</div>
			</main>
		</>
	);
}

CanCareerDashboard.noAuth = true;
