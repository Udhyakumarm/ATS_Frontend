import Button from "@/components/button";
import FormField from "@/components/formfield";
import HeaderBar from "@/components/HeaderBar";
import { getProviders } from "next-auth/react";
import router from "next/router";

export default function SearchJobsDetail() {
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
                    <div className="w-[calc(100%-300px)] pl-8">
                        <div className="mb-6 bg-white dark:bg-gray-800 rounded-normal shadow-normal">
                            <div className="rounded-t-normal overflow-hidden">
                                <HeaderBar handleBack={() => router.back()} />
                            </div>
                            <div className="py-4 px-8">
                                <h3 className="mb-4 font-bold text-lg">Software Engineer (Remote)</h3>
                                <ul className="mb-3 list-disc list-inside flex flex-wrap items-center text-[12px] text-darkGray dark:text-white font-semibold">
                                    <li className="mr-4">
                                        Full Time
                                    </li>
                                    <li className="mr-4">
                                        7.5 LPA INR
                                    </li>
                                    <li className="mr-4">
                                        Vacancy - 50
                                    </li>
                                </ul>
                                <Button btnStyle="sm" label="Apply Here" loader={false} />
                                <hr className="my-4" />
                                <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Department Information</h3>
                                    <article className="text-[12px] text-darkGray dark:text-white">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </article>
                                </aside>
                                <hr className="my-4" />
                                <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Your Responsibilities</h3>
                                    <article className="text-[12px] text-darkGray dark:text-white">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </article>
                                </aside>
                                <hr className="my-4" />
                                <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">What are we Looking For</h3>
                                    <article className="text-[12px] text-darkGray dark:text-white">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </article>
                                </aside>
                                <hr className="my-4" />
                                <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Skills</h3>
                                    <article className="text-[12px] text-darkGray dark:text-white">
                                        <p>Skill 1</p>
                                        <p>Skill 2</p>
                                    </article>
                                </aside>
                                <hr className="my-4" />
                                <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Employment Details</h3>
                                    <ul className="mb-3 list-disc list-inside flex flex-wrap items-center text-[12px] text-darkGray dark:text-white font-semibold">
                                        <li className="mr-4">
                                            Full Time
                                        </li>
                                        <li className="mr-4">
                                            Bachelor's Degree
                                        </li>
                                        <li className="mr-4">
                                            English, Japan
                                        </li>
                                        <li className="mr-4">
                                            2+ Years of Experience
                                        </li>
                                    </ul>
                                </aside>
                                <hr className="my-4" />
                                <aside className="mb-4">
                                    <h3 className="mb-2 font-bold text-lg">Benefits</h3>
                                    <ul className="mb-3 list-disc list-inside flex flex-wrap items-center text-[12px] text-darkGray dark:text-white font-semibold">
                                        <li className="mr-4">
                                            Paid Relocation
                                        </li>
                                        <li className="mr-4">
                                            Visa Sponsorship
                                        </li>
                                        <li className="mr-4">
                                            Remote Working
                                        </li>
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
                                        <ul className="mb-3 flex flex-wrap items-center text-[12px] text-darkGray dark:text-white font-semibold">
                                            <li className="mr-8">
                                                <i className="fa-solid fa-location-dot mr-2"></i>
                                                Remote
                                            </li>
                                            <li className="mr-8">
                                                <i className="fa-regular fa-clock mr-2"></i>
                                                Full Time
                                            </li>
                                            <li className="mr-8">
                                                <i className="fa-solid fa-dollar-sign mr-2"></i>
                                                50-55k
                                            </li>
                                        </ul>
                                        <div className="flex flex-wrap justify-between items-center">
                                            <div className="mr-4">
                                                <Button btnStyle="sm" label="View" loader={false} />
                                            </div>
                                            <p className="font-bold text-darkGray dark:text-white text-[12px]">29 min ago</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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