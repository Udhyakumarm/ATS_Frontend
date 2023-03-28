import Button from "@/components/Button";
import FormField from "@/components/FormField";
import { useCarrierStore } from "@/utils/code";
import moment from "moment";
import { getProviders } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CanCareerSearchJobs() {
	const router = useRouter();

	const cname = useCarrierStore((state: { cname: any }) => state.cname);
	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const setcid = useCarrierStore((state: { setcid: any }) => state.setcid);
	const orgdetail = useCarrierStore((state: { orgdetail: any }) => state.orgdetail);
	const setorgdetail = useCarrierStore((state: { setorgdetail: any }) => state.setorgdetail);
	const jid = useCarrierStore((state: { jid: any }) => state.jid);
	const setjid = useCarrierStore((state: { setjid: any }) => state.setjid);
	const jdata = useCarrierStore((state: { jdata: any }) => state.jdata);
	const setjdata = useCarrierStore((state: { setjdata: any }) => state.setjdata);

	useEffect(() => {
		if (orgdetail && Object.keys(orgdetail).length === 0) {
			if (cid == "" || cname == "") router.replace(`/organization/${cname}`);
			else router.back();
		}
	}, [cid, orgdetail, cname]);

	return (
		<>
			<main className="py-8">
				<div className="container flex flex-wrap">
					<div className="sticky top-0 h-[calc(100vh-120px)] w-[300px] rounded-normal border border-slate-300 bg-white shadow-normal dark:bg-gray-800">
						<div className="border-b py-2 px-6">
							<div className="relative">
								<input
									type={"search"}
									id={"jobSearch"}
									className={`w-full rounded border-0 pl-8 text-sm focus:ring-0 dark:bg-gray-800`}
									placeholder="Search for Jobs"
								/>
								<span className="absolute left-0 top-[2px] text-xl">
									<i className="fa-solid fa-magnifying-glass"></i>
								</span>
							</div>
						</div>
						<div className="py-4 px-6">
							<h2 className="mb-2 font-semibold">Filters</h2>
							<div className="py-2">
								<FormField fieldType="select" placeholder="Location" />
								<FormField fieldType="select" placeholder="Experience" />
								<FormField fieldType="select" placeholder="Job Type" />
							</div>
						</div>
					</div>
					{orgdetail["Job"] && (
						<div className="w-[calc(100%-300px)] pl-8">
							<h3 className="mb-6 text-xl font-bold">
								{orgdetail["Job"].length} {orgdetail["Job"].length > 1 ? <>Jobs</> : <>Job</>}
							</h3>
							<div className="mx-[-7px] flex flex-wrap">
								{orgdetail["Job"].map((data: any, i: React.Key) => (
									<div className="mb-[15px] w-full px-[7px] md:max-w-[50%]" key={i}>
										<div className="h-full rounded-[10px] bg-white p-5 shadow-normal dark:bg-gray-800">
											<h4 className="mb-3 text-lg font-bold">{data["job_title"]}</h4>
											<ul className="mb-3 flex flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
												<li className="mr-8">
													<i className="fa-solid fa-location-dot mr-2"></i>
													{data["worktype"] ? data["worktype"] : <>N/A</>}
												</li>
												<li className="mr-8">
													<i className="fa-regular fa-clock mr-2"></i>
													{data["employment_type"] ? data["employment_type"] : <>N/A</>}
												</li>
												<li>
													<i className="fa-solid fa-dollar-sign mr-2"></i>
													{data["currency"] ? data["currency"] : <>N/A</>}
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
															setjid(data["refid"]);
															setjdata(data);
															router.push(`/organization/${cname}/job-detail`);
														}}
													/>
												</div>
												<p className="text-[12px] font-bold text-darkGray dark:text-gray-400">
													{moment(data["publish_date"]).fromNow()}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</main>
		</>
	);
}

export async function getServerSideProps(context: any) {
	const providers = await getProviders();
	return {
		props: {
			providers
		}
	};
}
