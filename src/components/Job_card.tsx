import Image from "next/image"
import moment from "moment"
import { useCarrierId, useJobId } from "@/utils/code"
import { useRouter } from "next/router"


export default function Job_card(props: { data: any }) {
  const { data } = props

  const router = useRouter();

  
	const cid = useCarrierId((state) => state.cid)
	const addcid = useCarrierId((state) => state.addcid)
	const jid = useJobId((state) => state.jid)
	const addjid = useJobId((state) => state.addjid)
	const jdata = useJobId((state) => state.jdata)
	const addjdata = useJobId((state) => state.addjdata)

  function viewJob(id: any,data: any){
    addjid(id)
    addcid('')
    addjdata(data)
    router.push(`/job/${id}`)
  }

  return (
    <>
      <div className="bg-[#f4f4f4] dark:bg-gray-900 p-3 border border-2 border-slate-300 dark:border-gray-600 rounded-[25px] h-full">
        <div className="flex mb-8">
          <div className="bg-white rounded-full p-2.5 flex items-center justify-center w-[50px] h-[50px]">
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
          <div className="pl-3 w-[calc(100%-60px)]">
            <h3 className="font-bold text-md mb-1 line_clamp_1 text-black dark:text-white">
              {data.job_title}
            </h3>
            <h5 className="font-medium text-sm text-black dark:text-white">{data.user.company_name}</h5>
          </div>
        </div>
        <div className="text-[#787878] dark:text-white text-[12px] flex flex-wrap border-b border-slate-300">
          <p className="w-full sm:max-w-[50%] mb-3 line_clamp_2">
            Place: {data.location ? data.location : <>Not Specified</>}
          </p>
          <p className="w-full sm:max-w-[50%] mb-3 sm:text-right">
            {data.experience ? data.experience : <>Not Specified</>}
          </p>
          <p className="w-full sm:max-w-[50%] mb-3">
            {data.employment_type ? data.employment_type : <>Not Specified</>}
          </p>
          <p className="w-full sm:max-w-[50%] mb-3 sm:text-right">
            {data.currency ? (
              <> {data.currency}
              </>
            ) : (
              <>Not Specified</>
            )}
          </p>
        </div>
        <div className="flex items-center justify-between pt-4 text-[12px]">
          <p className="text-black dark:text-white">{moment(data.timestamp).fromNow()}</p>
          <button
            type="button"
            onClick={e => viewJob(data.refid,data)}
            className="text-[#6D27F9] dark:text-gray-400 dark:hover:text-white hover:underline hover:text-black"
          >
            View Job
          </button>
        </div>
      </div>
    </>
  )
}