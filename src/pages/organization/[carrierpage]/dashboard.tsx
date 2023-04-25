import Button from "@/components/Button";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useCarrierStore } from "@/utils/code";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CanCareerDashboard() {
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
					<div className="mx-[-7px] flex flex-wrap">
						{loadash &&
							loadash.map((data, i) => (
								<div className="mb-[15px] w-full px-[7px] md:max-w-[50%] lg:max-w-[calc(100%/3)]" key={i}>
									<div className="h-full rounded-[10px] bg-white p-5 shadow-normal dark:bg-gray-800">
										<h4 className="mb-3 text-lg font-bold">
											{data["job"]["job_title"]} ({data["status"]})
										</h4>
										<ul className="mb-3 flex flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
											<li className="mr-8">
												<i className="fa-solid fa-location-dot mr-2 capitalize"></i>
												{data["job"]["worktype"] ? data["job"]["worktype"] : <>Not Disclosed</>}
											</li>
											<li className="mr-8">
												<i className="fa-regular fa-clock mr-2 capitalize"></i>
												{data["job"]["employment_type"] ? data["job"]["employment_type"] : <>Not Disclosed</>}
											</li>
											<li>
												<i className="fa-solid fa-dollar-sign mr-2 capitalize"></i>
												{data["job"]["currency"] ? data["job"]["currency"] : <>Not Disclosed</>}
											</li>
										</ul>
										<div className="flex flex-wrap items-center justify-between">
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
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</main>
		</>
	);
}

CanCareerDashboard.noAuth = true;
