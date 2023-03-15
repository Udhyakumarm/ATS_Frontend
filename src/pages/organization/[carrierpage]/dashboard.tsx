import Button from "@/components/button";

export default function careerDashboard() {
    return (
        <>
            <main className="py-8">
                <div className="container">
                    <h3 className="mb-6 font-bold text-xl">Dashboard</h3>
                    <div className="flex flex-wrap mx-[-7px]">
                        {Array(4).fill(
                            <div className="w-full md:max-w-[50%] lg:max-w-[calc(100%/3)] px-[7px] mb-[15px]">
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
                                        <li>
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
            </main>
        </>
    )
}