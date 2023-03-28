import Button from "@/components/Button";
import FormField from "@/components/FormField";
import HeaderBar from "@/components/HeaderBar";
import { useCarrierStore } from "@/utils/code";
import { getProviders, useSession } from "next-auth/react";
import router from "next/router";
import { useEffect } from "react";

export default function SearchJobsDetail() {
    const { data: session } = useSession();
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
        if(orgdetail && Object.keys(orgdetail).length === 0 || jdata && Object.keys(jdata).length === 0 || jid && jid == ""){
            if(cname=="" || cid=="")
                router.replace(`/organization/${cname}`)
            else
                router.back()
        }
    },[cid,orgdetail,jid,jdata,cname])

    useEffect(()=>{if(jdata)console.log(jdata)},[jdata])
    
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
                                    className={`w-full rounded border-0 text-sm dark:bg-gray-800 pl-8 focus:ring-0`}
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
                    {jdata && <div className="w-[calc(100%-300px)] pl-8">
                        <div className="mb-6 bg-white dark:bg-gray-800 rounded-normal shadow-normal">
                            <div className="rounded-t-normal overflow-hidden">
                                <HeaderBar handleBack={() => router.back()} />
                            </div>
                            <div className="py-4 px-8">
                                <h3 className="mb-4 font-bold text-lg">{jdata['job_title']} ({jdata['worktype']})</h3>
                                <ul className="mb-3 list-disc list-inside flex flex-wrap items-center text-[12px] text-darkGray dark:text-gray-400 font-semibold">
                                    {jdata['employment_type'] && <li className="mr-4">
                                        {jdata['employment_type']}
                                    </li> }
                                    {jdata['currency'] && <li className="mr-4">
                                        {jdata['currency']}
                                    </li>}
                                    {jdata['vacancy'] && <li className="mr-4">
                                        Vacancy - {jdata['vacancy']}
                                    </li>}
                                </ul>
                                <Button btnStyle="sm" label="Apply Here" loader={false} btnType="button" handleClick={()=>{
                                                    if(session){
                                                        router.push(`/organization/${cname}/job-apply`)
                                                    }
                                                    else{
                                                        router.push(`/organization/${cname}/candidate/signin`)
                                                    }
                                                }} />
                                <hr className="my-4" />
                                <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Department Information</h3>
                                    <ul className="mb-3 list-disc list-inside flex flex-wrap items-center text-[12px] text-darkGray dark:text-gray-400 font-semibold">
                                        {jdata['department'] && <li className="mr-4">
                                            {jdata['department']} department
                                        </li>}
                                        {jdata['job_function'] && <li className="mr-4">
                                            {jdata['job_function']} function
                                        </li>}
                                        {jdata['industry'] && <li className="mr-4">
                                            {jdata['industry']} Industry
                                        </li>}
                                        {jdata['group_or_division'] && <li className="mr-4">
                                            {jdata['group_or_division']} group_or_division
                                        </li>}
                                    </ul>
                                </aside>
                                <hr className="my-4" />
                                {jdata['description'] && <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Description</h3>
                                    <article className="text-[12px] text-darkGray dark:text-gray-400">
                                    {jdata['description']}
                                    </article>
                                </aside>}
                                <hr className="my-4" />
                                {jdata['responsibility'] && <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Your Responsibilities</h3>
                                    <article className="text-[12px] text-darkGray dark:text-gray-400">
                                    {jdata['responsibility']}
                                    </article>
                                </aside>}
                                <hr className="my-4" />
                                {jdata['looking_for'] && <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">What are we Looking For</h3>
                                    <article className="text-[12px] text-darkGray dark:text-gray-400">
                                    {jdata['looking_for']}
                                    </article>
                                </aside>}
                                <hr className="my-4" />
                                <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Skills</h3>
                                    {jdata['jobSkill'] && <article className="text-[12px] text-darkGray dark:text-gray-400">
                                        {
                                            jdata['jobSkill'].split(',').map((item,i) => <p key={i}>{item}</p>)
                                        }
                                    </article>}
                                </aside>
                                <hr className="my-4" />
                                <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Employment Details</h3>
                                    <ul className="mb-3 list-disc list-inside flex flex-wrap items-center text-[12px] text-darkGray dark:text-gray-400 font-semibold">
                                        {jdata['employment_type'] && <li className="mr-4">
                                            {jdata['employment_type']}
                                        </li>}
                                        {jdata['education'] && <li className="mr-4">
                                            {jdata['education']}
                                        </li>}
                                        {jdata['location'] && <li className="mr-4">
                                            {jdata['location']}
                                        </li>}
                                        {jdata['experience'] && <li className="mr-4">
                                            {jdata['experience']} of Experience
                                        </li>}
                                    </ul>
                                </aside>
                                <hr className="my-4" />
                                <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Benefits</h3>
                                    <ul className="mb-3 list-disc list-inside flex flex-wrap items-center text-[12px] text-darkGray dark:text-gray-400 font-semibold">
                                        {jdata['relocation'] == "Yes" && <li className="mr-4">
                                            Paid Relocation
                                        </li>}
                                        {jdata['visa'] == "Yes" && <li className="mr-4">
                                            Visa Sponsorship
                                        </li>}
                                        {jdata['worktype'] && <li className="mr-4">
                                            {jdata['worktype']} Working
                                        </li>}
                                    </ul>
                                </aside>
                            </div>
                        </div>
                        <h3 className="mb-6 font-bold text-xl">Similar Jobs</h3>
                        <div className="flex flex-wrap mx-[-7px]">
                            {Array(4).fill(
                                <div className="w-full md:max-w-[50%] px-[7px] mb-[15px]">
                                    <div className="h-full bg-white dark:bg-gray-800 rounded-[10px] shadow-normal p-5">
                                        <h4 className="font-bold text-lg mb-3">Software Engineer</h4>
                                        <ul className="mb-3 flex flex-wrap items-center text-[12px] text-darkGray dark:text-gray-400 font-semibold">
                                            <li className="mr-8">
                                                <i className="fa-solid fa-location-dot mr-2"></i>
                                                Remote
                                            </li>
                                            <li className="mr-8">
                                                <i className="fa-regular fa-clock mr-2"></i>
                                                Full Time
                                            </li>
                                            <li>
                                                <i className="fa-solid fa-dollar-sign mr-2"></i>
                                                50-55k
                                            </li>
                                        </ul>
                                        <div className="flex flex-wrap justify-between items-center">
                                            <div className="mr-4">
                                                <Button btnStyle="sm" label="View" loader={false} />
                                            </div>
                                            <p className="font-bold text-darkGray dark:text-gray-400 text-[12px]">29 min ago</p>
                                        </div>
                                    </div>
                                </div>
                            )}
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