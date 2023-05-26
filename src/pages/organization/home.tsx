import React from 'react'
import ReactPlayer from 'react-player'
import Button from "@/components/Button";

export default function HomePage() {
    const features = [
		{
			title: <>HR <br /> Assistance</>,
			desc: "Experience the ease of connecting, managing, and moving candidates effortlessly with our AI-powered HR assistance, utilizing a simple chat interface",
            graphic: '/videos/chat-bot.webm',
            height: '670px'
		},
        {
			title: <>Job <br /> Boards</>,
			desc: "Expand your reach and cultivate a robust talent pipeline by seamlessly connecting with multiple job boards.",
            graphic: '/videos/job-boards-integration.mp4'
		},
        {
			title: <>Integrations</>,
			desc: "Optimize engagement and communication by seamlessly integrating powerful plugins.",
            graphic: '/videos/job-boards-integration.mp4'
		},
        {
			title: <>Workflow <br /> Automation</>,
			desc: "Enhanced efficiency through streamlined workflow automation",
            graphic: '/videos/job-boards-integration.mp4'
		},
    ]
    return(
        <>
        <main>
            <section className="min-h-screen py-10 flex items-center bg-white dark:bg-gray-900">
                <div className="container text-center">
                    <h1 className="text-[35px] sm:text-[45px] md:text-[55px] lg:text-[65px] xl:text-[75px] font-poppins font-semibold mb-10">Empower your hiring with automation</h1>
                    <h2 className="text-[25px] sm:text-[30px] md:text-[35px] lg:text-[40px] xl:text-[45px] font-poppins font-bold mb-6 textGrad">Simplify, Streamline, Succeed</h2>
                    <p className="w-full max-w-[450px] mx-auto text-darkGray lg:text-[20px] mb-10">Efficiently oversee your entire hiring process, from sourcing to offer management.</p>
                    <div className="w-[120px] mx-auto">
                        <Button full btnType="submit" btnStyle="iconRightBtn" label="Sign Up" iconRight={(<i className="fa-solid fa-up-right-from-square"></i>)} />
                    </div>
                </div>
            </section>
            <section className="py-10 bg-white dark:bg-gray-900 border-x-[0.5em] md:border-x-[2em] lg:border-x-[3em] border-gray-100 dark:border-gray-600">
                <div className="container">
                    <h3 className="text-[25px] md:text-[30px] w-full max-w-[950px] mx-auto text-center font-poppins font-bold mb-6 textGrad">
                        Efficiently oversee your entire hiring process, from sourcing to Offer management.  
                    </h3>
                    {features.map((item, i) => (
                    <div className="flex items-center flex-wrap -mx-6 py-6 group odd:flex-row-reverse" id={`features_${i+1}`} key={i}>
                        <div className="px-6 my-4 w-full lg:max-w-[50%] xl:max-w-[50%]">
                            <div className="bg-gradient-to-r from-[#FFE9F44D] to-[#EAF3FF] dark:from-gray-800 dark:to-gray-700 shadow-highlight rounded-[20px] p-8 md:p-14">
                                <div className="flex items-center lg:group-even:flex-row-reverse">
                                    <span className="inline-block text-gradDarkBlue font-bold text-[90px] sm:text-[120px] xl:text-[135px] leading-none mr-5 lg:group-even:ml-5 lg:group-odd:mr-5">{i+1}</span>
                                    <h2 className="lg:grow textGrad font-extrabold text-[30px] sm:text-[40px] xl:text-[50px] leading-none">{item.title}</h2>
                                </div>
                                <p className="mt-4 font-bold lg:text-xl">{item.desc}</p>
                            </div>
                        </div>
                        <div className="px-6 my-4 w-full lg:max-w-[50%] xl:max-w-[50%]">
                            <ReactPlayer className="reactPlayer bg-white rounded-normal overflow-hidden" url={item.graphic} playing loop muted width={'100%'} height={item.height ? item.height : ''} />
                        </div>
                    </div>
                    ))}
                </div>
            </section>
            <section className="py-10 bg-white dark:bg-gray-900 flex items-center">
                <div className="container">
                    <div className="bg-gradient-to-r from-[#FFE9F44D] to-[#EAF3FF] dark:from-gray-800 dark:to-gray-700 shadow-highlight rounded-[20px] p-8 md:p-14">
                        <div className="w-full max-w-[500px] mx-auto">
                            <h2 className="font-extrabold text-[30px] sm:text-[40px] xl:text-[50px] mb-10">Book a <span className='textGrad'>Demo</span></h2>
                            <p className="lg:text-xl mb-10">Book a demo with us today and discover unparalleled support and a deep understanding of your needs. We're here for you every step of the way, providing the best experience possible</p>
                            <Button btnType="button" label="Request a Demo" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
        </>
    )
}