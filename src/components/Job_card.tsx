import Image from "next/image";
import moment from "moment";
import { useCarrierStore } from "@/utils/code";
import { useRouter } from "next/router";

export default function Job_card(props: { data: any }) {
	const { data } = props;

	const router = useRouter();

	const cid = useCarrierStore((state: { cid: any }) => state.cid);
	const addcid = useCarrierStore((state: { addcid: any }) => state.addcid);
	const jid = useCarrierStore((state: { jid: any }) => state.jid);
	const addjid = useCarrierStore((state: { addjid: any }) => state.addjid);
	const jdata = useCarrierStore((state: { jdata: any }) => state.jdata);
	const addjdata = useCarrierStore((state: { addjdata: any }) => state.addjdata);

	function viewJob(id: any, data: any) {
		addjid(id);
		addcid("");
		addjdata(data);
		router.push(`/job/${id}`);
	}

	return (
		<>
			<div className="h-full rounded-[25px] border border-2 border-slate-300 bg-[#f4f4f4] p-3 dark:border-gray-600 dark:bg-gray-900">
				<div className="mb-8 flex">
					<div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white p-2.5">
						{/* {data.org.profile && (
              <Image
                src={`${data.org.profile}`}
                width={300}
                height={300}
                alt="Google"
                className="w-full h-full rounded-full object-cover"
              />
            )} */}
					</div>
					<div className="w-[calc(100%-60px)] pl-3">
						<h3 className="text-md line_clamp_1 mb-1 font-bold text-black dark:text-white">{data.job_title}</h3>
						<h5 className="text-sm font-medium text-black dark:text-white">{data.user.company_name}</h5>
					</div>
				</div>
				<div className="flex flex-wrap border-b border-slate-300 text-[12px] text-[#787878] dark:text-white">
					<p className="line_clamp_2 mb-3 w-full sm:max-w-[50%]">
						Place: {data.location ? data.location : <>Not Specified</>}
					</p>
					<p className="mb-3 w-full sm:max-w-[50%] sm:text-right">
						{data.experience ? data.experience : <>Not Specified</>}
					</p>
					<p className="mb-3 w-full sm:max-w-[50%]">
						{data.employment_type ? data.employment_type : <>Not Specified</>}
					</p>
					<p className="mb-3 w-full sm:max-w-[50%] sm:text-right">
						{data.currency ? <> {data.currency}</> : <>Not Specified</>}
					</p>
				</div>
				<div className="flex items-center justify-between pt-4 text-[12px]">
					<p className="text-black dark:text-white">{moment(data.timestamp).fromNow()}</p>
					<button
						type="button"
						onClick={(e) => viewJob(data.refid, data)}
						className="text-[#6D27F9] hover:text-black hover:underline dark:text-gray-400 dark:hover:text-white"
					>
						View Job
					</button>
				</div>
			</div>
		</>
	);
}
