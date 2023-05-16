import Button from "@/components/Button";
import FormField from "@/components/FormField";
import OrgSideBar from "@/components/organization/SideBar";
import OrgTopBar from "@/components/organization/TopBar";
import { Transition } from "@headlessui/react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Head from "next/head";
import Image from "next/image";
import { Fragment, useState } from "react";
import userImg from "/public/images/user-image.png";
import googleIcon from "/public/images/social/google-icon.png";
import Link from "next/link";
import noInterviewdata from "/public/images/no-data/iconGroup-3.png";

export default function Interviews() {
    const [sklLoad] = useState(true);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [upcomingInterview, setUpcomingInterview] = useState(true);
    const [pastInterview, setPastInterview] = useState(false);
    function handleUpcomingInterview() {
        setUpcomingInterview(true);
        setPastInterview(false);
    }
    function handlePastInterview() {
        setPastInterview(true);
        setUpcomingInterview(false);
    }
    const Interviews = ({sklLoad}:any) => {
        if(sklLoad === true) {
            return (
                <>
                <div className="border-b last:border-b-0 py-6">
                    <h6 className="text-darkGray dark:text-gray-400 mb-2">
                        <Skeleton width={120} />
                    </h6>
                    {Array(4).fill(
                    <div className='border rounded mb-3 text-sm'>
                        <div className="flex flex-wrap items-center px-4">
                            <div className="w-full lg:max-w-[25%] py-3 px-2">
                                <Skeleton width={80} />
                                <Skeleton width={120} />
                            </div>
                            <div className="w-full lg:max-w-[25%] py-3 px-2">
                                <Skeleton width={80} />
                                <Skeleton width={120} />
                            </div>
                            <div className="w-full lg:max-w-[25%] py-3 px-2">
                                <Skeleton width={80} />
                                <Skeleton width={120} />
                            </div>
                            <div className="w-full lg:max-w-[10%] py-3">
                                <Skeleton width={80} height={25} />
                            </div>
                            <div className="w-full lg:max-w-[15%] py-3 text-right">
                                <Skeleton width={80} height={25} />
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                </>
            )
        }
        return (
         <>
         <div className="border-b last:border-b-0 py-6">
            <h6 className="text-darkGray dark:text-gray-400 mb-2"><b className="text-black dark:text-white">Today:</b> 8 Feb</h6>
            {Array(4).fill(
            <div className={'border rounded mb-3 text-sm' + ' ' + (accordionOpen ? 'border-slate-300' : '')}>
                <div className="flex flex-wrap items-center px-4">
                    <div className="w-full lg:max-w-[25%] py-3 px-2">
                        <h6 className="font-bold">Job</h6>
                        <p className="text-[12px] text-darkGray dark:text-gray-400">Software Developer</p>
                    </div>
                    <div className="w-full lg:max-w-[25%] py-3 px-2">
                        <h6 className="font-bold">Candidate</h6>
                        <p className="text-[12px] text-darkGray dark:text-gray-400">Jack Paul - ID 42123</p>
                    </div>
                    <div className="w-full lg:max-w-[25%] py-3 px-2">
                        <h6 className="font-bold">Scheduled Time</h6>
                        <p className="text-[12px] text-darkGray dark:text-gray-400">2:00 PM to 3:00 PM</p>
                    </div>
                    <div className="w-full lg:max-w-[10%] py-3">
                        <Button btnStyle='sm' label="Join" />
                    </div>
                    <div className="w-full lg:max-w-[15%] py-3 text-right">
                        <button type="button" className="font-semibold text-darkGray dark:text-gray-400" onClick={() => setAccordionOpen(!accordionOpen)}>
                            View More
                            <i className={'fa-solid ml-2' + ' ' + (accordionOpen ? 'fa-chevron-up' : 'fa-chevron-down')}></i>
                        </button>
                    </div>
                </div>
                <Transition.Root show={accordionOpen} as={Fragment}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="border-t">
                            <div className="flex flex-wrap">
                                <div className="w-full md:max-w-[75%] border-r">
                                    <div className="px-6 py-4">
                                        <div className="flex flex-wrap mb-4">
                                            <div className="w-full lg:max-w-[25%] pr-4 mr-4">
                                                <h6 className="font-bold">Scheduled by</h6>
                                                <p className="text-[12px] text-darkGray dark:text-gray-400">Admin Smith</p>
                                            </div> 
                                            <div className="w-full lg:max-w-[50%] pl-4">
                                                <h6 className="font-bold">Job ID</h6>
                                                <p className="text-[12px] text-darkGray dark:text-gray-400">54123</p>
                                            </div> 
                                        </div>
                                        <div className="flex flex-wrap mb-4">
                                            <div className="w-full lg:max-w-[25%] pr-4 mr-4 border-r">
                                                <h6 className="font-bold">Interview Type</h6>
                                                <p className="text-[12px] text-darkGray dark:text-gray-400">Video Interview</p>
                                            </div> 
                                            <div className="w-full lg:max-w-[50%] pl-4">
                                                <div className="flex items-center">
                                                    <Image
                                                        src={googleIcon}
                                                        alt="Google"
                                                        width={100}
                                                        className="h-[30px] w-auto rounded-full object-cover"
                                                    />
                                                    <aside className="pl-3 text-[12px]">
                                                        <h5 className="font-bold">Google Meet</h5>
                                                        <Link href="www.googlemeet.com" target="_blank" className="text-primary">
                                                            www.googlemeet.com
                                                        </Link>
                                                    </aside>
                                                </div>
                                            </div> 
                                        </div>
                                        <div className="flex flex-wrap mb-4">
                                            <div className="w-full">
                                                <h6 className="font-bold">Interviewers</h6>
                                                <ul className="mb-2 text-[12px] flex list-inside list-disc flex-wrap items-center font-semibold text-darkGray dark:text-gray-400">
                                                    <li className="mr-3 list-none">Admin Smith</li>
                                                    <li className="mr-3">Evan Chris</li>
                                                </ul>
                                            </div> 
                                        </div>
                                        <div className="flex flex-wrap mb-2">
                                            <div className="w-full">
                                                <h6 className="font-bold">Event Name</h6>
                                                <p className="text-[12px] text-darkGray dark:text-gray-400">Video Interview for Software Developer Job</p>
                                            </div> 
                                        </div>
                                        <div className="flex flex-wrap">
                                            <div className="my-1 mr-4 last:mr-0">
                                                <Button btnStyle="success" label="Reschedule" />
                                            </div>
                                            <div className="my-1 mr-4 last:mr-0">
                                                <Button btnStyle="danger" label="Cancel" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:max-w-[25%]">
                                    <div className="text-center border-b p-3">
                                        <h3 className="font-bold">Team Members</h3>
                                    </div>
                                    <div className="py-2 max-h-[270px] overflow-y-auto">
                                        {Array(10).fill(
                                        <div className="flex items-center py-2 px-4">
                                            <Image
                                                src={userImg}
                                                alt="User"
                                                width={40}
                                                className="h-[40px] rounded-full object-cover"
                                            />
                                            <aside className="pl-4 text-[12px]">
                                                <h5 className="font-bold">Anne Jacob</h5>
                                                <p className="text-darkGray dark:text-gray-400">Hiring Manager</p>
                                            </aside>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </Transition.Root>
            </div>
            )}
         </div>
         </>   
        )
    };
    return(
        <>
            <Head>
				<title>Interviews</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<OrgSideBar />
				<OrgTopBar />
				<div id="overlay" className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"></div>
				<div className="layoutWrap p-4 lg:p-8">
                    <div className="flex flex-wrap">
                        <div className="w-full lg:max-w-[25%]">
                            <div className="h-[calc(100vh-130px)] bg-white dark:bg-gray-800 rounded-normal shadow-normal border dark:border-gray-600">
                                <div className="border-b py-3 px-8">
                                    <h2 className="font-bold text-lg">Filters</h2>
                                </div>
                                <div className="border-b mb-4 py-2">
                                    <button type="button" className={'w-full py-3 px-8 flex items-center font-bold hover:bg-lightBlue dark:hover:bg-gray-900' + ' ' + (upcomingInterview ? 'bg-lightBlue text-primary dark:bg-gray-900 dark:text-white' : '')} onClick={()=> handleUpcomingInterview()}>
                                        <i className="fa-solid fa-calendar-days mr-3"></i>
                                        Upcoming Interviews
                                    </button>
                                    <button type="button" className={'w-full py-3 px-8 flex items-center font-bold hover:bg-lightBlue dark:hover:bg-gray-900' + ' ' + (pastInterview ? 'bg-lightBlue text-primary dark:bg-gray-900 dark:text-white' : '')} onClick={()=> handlePastInterview()}>
                                        <i className="fa-solid fa-clock-rotate-left mr-3"></i>
                                        Past Interviews
                                    </button>
                                </div>
                                <div className="py-3 px-8">
                                    <FormField fieldType="select" label="Jobs" />
                                    <FormField fieldType="select" label="Time" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:max-w-[75%] pl-8">
                            <div className="bg-white dark:bg-gray-800 rounded-normal shadow-normal overflow-hidden">
                                <div className="bg-white dark:bg-gray-700 shadow-normal">
                                    <h2 className="inline-block min-w-[200px] rounded-tl-normal bg-gradient-to-b from-gradLightBlue to-gradDarkBlue py-4 px-8 text-center font-semibold text-white shadow-lg">
                                        Interviews
                                    </h2>
                                </div>
                                <div className="px-8 h-[calc(100vh-185px)] overflow-y-auto">
                                    {
                                        upcomingInterview
                                        ?
                                        <>
                                        {
                                            sklLoad
                                            ?
                                            Array(2).fill(
                                                <Interviews />
                                            )
                                            :
                                            Array(2).fill(
                                                <Interviews sklLoad={true} />
                                            )
                                        }
                                        </>
                                        :
                                        <>
                                        {Array(2).fill(
                                            <Interviews />
                                        )}
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-normal shadow-normal min-h-[calc(100vh-130px)] flex items-center justify-center">
						<div className="text-center py-8 w-full max-w-[300px] mx-auto">
							<div className="mb-6 p-2">
								<Image src={noInterviewdata} alt="No Data" width={300} className="w-auto max-w-[200px] max-h-[200px] mx-auto" />
							</div>
							<h5 className="text-lg font-semibold mb-4">No Interviews</h5>
							<p className="text-sm text-darkGray mb-2">There are no Interviews as of now , Post a New Job to schedule interview with applicants </p>
							{/* <Link href={'/organization/jobs/create'} className="my-2 min-w-[60px] inline-block rounded py-2 px-3 text-white text-[14px] bg-gradient-to-b from-gradLightBlue to-gradDarkBlue hover:from-gradDarkBlue hover:to-gradDarkBlue">Post a New Job</Link> */}
						</div>
					</div>
                </div>
            </main>
        </>
    )
}