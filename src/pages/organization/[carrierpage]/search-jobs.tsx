import Button from "@/components/button";
import FormField from "@/components/formfield";
import { useCarrierStore } from "@/utils/code";
import moment from "moment";
import { getProviders } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SearchJobs() {

    const router = useRouter();
    
    const cname = useCarrierStore((state) => state.cname)
    const cid = useCarrierStore((state) => state.cid)
    const setcid = useCarrierStore((state) => state.setcid)
    const orgdetail = useCarrierStore((state) => state.orgdetail)
    const setorgdetail = useCarrierStore((state) => state.setorgdetail)
    const jid = useCarrierStore((state) => state.jid)
    const setjid = useCarrierStore((state) => state.setjid)
    const jdata = useCarrierStore((state) => state.jdata)
    const setjdata = useCarrierStore((state) => state.setjdata)

    useEffect(()=>{
        if(orgdetail && Object.keys(orgdetail).length === 0){
            if(cid=="" || cname=="")
                router.replace(`/organization/${cname}`)
            else
                router.back()
        }
    },[cid,orgdetail,cname])
    
    

    return (
        <>
            <main className="py-8">
                <div className="container flex flex-wrap">
                    <div className="w-[300px] h-[calc(100vh-120px)] bg-white dark:bg-gray-800 shadow-normal border border-slate-300 rounded-normal sticky top-0">
                        <div className="border-b py-2 px-6">
                            <div className="relative">
                                <input
                                    type={'search'}
                                    id={'jobSearch'}
                                    className={`w-full rounded  border-0 text-sm dark:bg-gray-700 pl-8 focus:ring-0`}
                                    placeholder="Search for Jobs"
                                />
                                <span className="absolute left-0 top-[2px] text-xl">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </span>
                            </div>
                        </div>
                        <div className="py-4 px-6">
                            <h2 className="font-semibold mb-2">Filters</h2>
                            <div className="py-2">
                                <FormField 
                                fieldType="select" 
                                placeholder="Location"
                                />
                                <FormField 
                                fieldType="select" 
                                placeholder="Experience"
                                />
                                <FormField 
                                fieldType="select" 
                                placeholder="Job Type"
                                />
                            </div>
                        </div>
                    </div>
                    {orgdetail['Job'] && <div className="w-[calc(100%-300px)] pl-8">
                        <h3 className="mb-6 font-bold text-xl">{orgdetail['Job'].length} {orgdetail['Job'].length > 1 ? <>Jobs</> : <>Job</> }</h3>
                        <div className="flex flex-wrap mx-[-7px]">
                            {orgdetail['Job'].map((data,i)=>(
                                <div className="w-full md:max-w-[50%] px-[7px] mb-[15px]" key={i}>
                                    <div className="h-full bg-white dark:bg-gray-800 rounded-[10px] shadow-normal p-5">
                                        <h4 className="font-bold text-lg mb-3">{data['job_title']}</h4>
                                        <ul className="mb-3 flex flex-wrap items-center text-[12px] text-darkGray dark:text-white font-semibold">
                                            <li className="mr-8">
                                                <i className="fa-solid fa-location-dot mr-2"></i>
                                                {data['worktype'] ? data['worktype'] : <>N/A</>}
                                            </li>
                                            <li className="mr-8">
                                                <i className="fa-regular fa-clock mr-2"></i>
                                                {data['employment_type'] ? data['employment_type'] : <>N/A</>}
                                            </li>
                                            <li className="mr-8">
                                                <i className="fa-solid fa-dollar-sign mr-2"></i>
                                                {data['currency'] ? data['currency'] : <>N/A</>}
                                            </li>
                                        </ul>
                                        <div className="flex flex-wrap justify-between items-center">
                                            <div className="mr-4">
                                                <Button btnStyle="sm" label="View" loader={false} btnType="button" handleClick={()=>{
                                                    setjid(data['refid'])
                                                    setjdata(data)
                                                    router.push(`/organization/${cname}/job-detail`)
                                                }} />
                                            </div>
                                            <p className="font-bold text-darkGray dark:text-white text-[12px]">{moment(data['publish_date']).fromNow()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            </main>
        </>
    )
}

export async function getServerSideProps(context: any) {
	const providers = await getProviders();
	return {
		props: {
			providers
		}
	};
}