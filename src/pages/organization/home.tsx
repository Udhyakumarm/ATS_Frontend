import React, { useState } from 'react';
import ReactPlayer from 'react-player'
import Button from "@/components/Button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';

export default function HomePage() {
    const [open, setOpen] = useState(0)
    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();
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
            graphic: '/videos/integration.mp4'
		},
        {
			title: <>Workflow <br /> Automation</>,
			desc: "Enhanced efficiency through streamlined workflow automation",
            img: '/images/feature_calendar.png'
		},
    ]
    const faq = [
        {
            title: 'lorem impsum',
            desc: 'desc text is here'
        },
        {
            title: 'lorem impsum 2',
            desc: 'desc text is here 3'
        }
    ]
    const settings = {
		dots: false,
		arrows: false,
		infinite: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
        fade: true,
        adaptiveHeight: true,
	}
    const settings2 = {
        dots: false,
		arrows: false,
		infinite: false,
		slidesToShow: 5,
		slidesToScroll: 1,
        focusOnSelect: true,
        prevArrow: (
			<button type="button" className="slick-arrow">
				<i className="fa-solid fa-chevron-left"></i>
			</button>
		),
		nextArrow: (
			<button type="button" className="slick-arrow">
				<i className="fa-solid fa-chevron-right"></i>
			</button>
		),
        responsive: [
            {
              breakpoint: 600,
              settings: {
                arrows: true,
                slidesToShow: 1
              }
            }
        ]
    }
    const settings3 = {
		dots: false,
		arrows: true,
		infinite: false,
		speed: 1000,
		slidesToShow: 1,
		slidesToScroll: 1,
        fade: false,
        prevArrow: (
			<button type="button" className="slick-arrow">
				<i className="fa-solid fa-chevron-left"></i>
			</button>
		),
		nextArrow: (
			<button type="button" className="slick-arrow">
				<i className="fa-solid fa-chevron-right"></i>
			</button>
		),
	}
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
                                <p className="mt-4 font-bold lg:text-lg">{item.desc}</p>
                            </div>
                        </div>
                        <div className="px-6 my-4 w-full lg:max-w-[50%] xl:max-w-[50%]">
                            {
                                item.graphic &&
                                <ReactPlayer className="reactPlayer bg-white rounded-normal overflow-hidden" url={item.graphic} playing loop muted width={'100%'} height={item.height ? item.height : ''} />
                            }
                            {
                                item.img &&
                                <Image src={item.img} alt='Image' width={600} height={300} />
                            }
                        </div>
                    </div>
                    ))}
                </div>
            </section>
            <section className='py-20 bg-white dark:bg-gray-900 bg_img_features'>
                <div className="container">
                    <div className='mb-10 lg:mb-20 bg_img_features__headings w-full max-w-[600px] mx-auto border-b border-gray-400'>
                        <Slider {...settings2} asNavFor={nav1} ref={(slider2) => setNav2(slider2 as any)}>
                            <div className='py-2 text-center cursor-pointer item'>
                                <h6 className='text-gray-800 font-bold'>Kanban Board</h6>
                            </div>
                            <div className='py-2 text-center cursor-pointer item'>
                                <h6 className='text-gray-800 font-bold'>Vendors</h6>
                            </div>
                            <div className='py-2 text-center cursor-pointer item'>
                                <h6 className='text-gray-800 font-bold'>Career Page</h6>
                            </div>
                            <div className='py-2 text-center cursor-pointer item'>
                                <h6 className='text-gray-800 font-bold'>Internal Chat</h6>
                            </div>
                            <div className='py-2 text-center cursor-pointer item'>
                                <h6 className='text-gray-800 font-bold'>User Access</h6>
                            </div>
                        </Slider>
                    </div>
                    <Slider {...settings} asNavFor={nav2} ref={(slider1) => setNav1(slider1 as any)}>
                        <div>
                            <div className='flex flex-wrap items-center'>
                                <div className='w-full lg:max-w-[40%] lg:pr-6 my-6 text-center lg:text-left'>
                                    <h4 className='mb-8 text-[30px] sm:text-[35px] xl:text-[40px] leading-none font-extrabold dark:text-black'>Manage Candidate Seamlessly</h4>
                                    <p className='font-bold lg:text-lg dark:text-black'>Effortlessly navigate talent with Kanban: Empowering eagle-eye precision in candidate movement.</p>
                                </div>
                                <div className='w-full lg:max-w-[60%] lg:pl-6'>
                                    <ReactPlayer className="rounded-normal overflow-hidden" url={'/videos/kanban-board.webm'} playing loop muted width={'100%'} height={'100%'} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='flex flex-wrap items-center'>
                                <div className='w-full lg:max-w-[40%] lg:pr-6 my-6 text-center lg:text-left'>
                                    <h4 className='mb-8 text-[30px] sm:text-[35px] xl:text-[40px] leading-none font-extrabold dark:text-black'>Vendors</h4>
                                    {/* <p className='font-bold lg:text-lg dark:text-black'>Effortlessly navigate talent with Kanban: Empowering eagle-eye precision in candidate movement.</p> */}
                                </div>
                                <div className='w-full lg:max-w-[60%] lg:pl-6'>
                                    <Image src={'/images/home_vendors.png'} alt='Vendors' width={800} height={400} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='flex flex-wrap items-center'>
                                <div className='w-full lg:max-w-[40%] lg:pr-6 my-6 text-center lg:text-left'>
                                    <h4 className='mb-8 text-[30px] sm:text-[35px] xl:text-[40px] leading-none font-extrabold dark:text-black'>Career Page</h4>
                                    {/* <p className='font-bold lg:text-lg dark:text-black'>Effortlessly navigate talent with Kanban: Empowering eagle-eye precision in candidate movement.</p> */}
                                </div>
                                <div className='w-full lg:max-w-[60%] lg:pl-6'>
                                    <Image src={'/images/home_career.png'} alt='Career Page' width={800} height={400} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='flex flex-wrap items-center'>
                                <div className='w-full lg:max-w-[40%] lg:pr-6 my-6 text-center lg:text-left'>
                                    <h4 className='mb-8 text-[30px] sm:text-[35px] xl:text-[40px] leading-none font-extrabold dark:text-black'>Internal Chat</h4>
                                    {/* <p className='font-bold lg:text-lg dark:text-black'>Effortlessly navigate talent with Kanban: Empowering eagle-eye precision in candidate movement.</p> */}
                                </div>
                                <div className='w-full lg:max-w-[60%] lg:pl-6'>
                                    <Image src={'/images/home_internal_chat.png'} alt='Internal Chat' width={800} height={400} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='flex flex-wrap items-center'>
                                <div className='w-full lg:max-w-[40%] lg:pr-6 my-6 text-center lg:text-left'>
                                    <h4 className='mb-8 text-[30px] sm:text-[35px] xl:text-[40px] leading-none font-extrabold dark:text-black'>User Access</h4>
                                    {/* <p className='font-bold lg:text-lg dark:text-black'>Effortlessly navigate talent with Kanban: Empowering eagle-eye precision in candidate movement.</p> */}
                                </div>
                                <div className='w-full lg:max-w-[60%] lg:pl-6'>
                                <Image src={'/images/home_user_access.png'} alt='User Access' width={800} height={400} />
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </section>
            <section className="py-20 bg-white dark:bg-gray-900 flex items-center">
                <div className="container">
                    <div className="bg-gradient-to-r from-[#FFE9F44D] to-[#EAF3FF] dark:from-gray-800 dark:to-gray-700 shadow-highlight rounded-[20px] p-8 md:p-14">
                        <div className="w-full max-w-[500px] mx-auto">
                            <h2 className="font-extrabold text-[30px] sm:text-[40px] xl:text-[50px] mb-10">Book a <span className='textGrad'>Demo</span></h2>
                            <p className="lg:text-lg mb-10">Book a demo with us today and discover unparalleled support and a deep understanding of your needs. We're here for you every step of the way, providing the best experience possible</p>
                            <Button btnType="button" label="Request a Demo" />
                        </div>
                    </div>
                </div>
            </section>
            <section className='py-20 bg-lightBlue dark:bg-gray-800 testimonials'>
                <div className="container">
                    <h2 className='font-extrabold text-[30px] sm:text-[40px] xl:text-[50px] mb-10 text-center textGrad'>Testimonials</h2>
                    <div className="py-10 px-8 my-10 w-full max-w-[700px] mx-auto relative">
                        <Image src={'/images/blurb.png'} alt='Blurb' className='absolute right-10 top-0 w-auto h-[400px]' width={800} height={400} />
                        <Slider {...settings3}>
                            {Array(5).fill(
                                <div className='py-3 md:px-8'>
                                    <div className='relative'>
                                        <div className='absolute left-[10px] top-[50%] w-[calc(100%-20px)] h-[calc(100%-100px)] translate-y-[calc(-50%+20px)] z-[1] bg-white dark:bg-gray-700 shadow-normal rounded-normal'></div>
                                        <div className='absolute left-[20px] top-[50%] w-[calc(100%-40px)] h-[calc(100%-65px)] translate-y-[calc(-50%+20px)] z-[2] bg-white dark:bg-gray-700 shadow-normal rounded-normal'></div>
                                        <div className='relative z-[3] px-8'>
                                            <Image src={'/images/user-image.png'} alt='User' className='mb-[-40px] object-cover mx-auto rounded-full w-[80px] h-[80px]' width={300} height={300} />
                                            <div className="bg-white dark:bg-gray-700 shadow-normal rounded-normal px-3 sm:px-6 pb-6 pt-14 text-center">
                                                <h5 className='font-bold text-lg mb-2'>Hannah Schmitt</h5>
                                                <p className='mb-3 sm:mb-6 text-sm'>Lead Designer</p>
                                                <p className='text-[12px] sm:text-sm line-clamp-6'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim  </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Slider>
                    </div>
                </div>
            </section>
            <section className='py-20 bg-white dark:bg-gray-900'>
                <div className='container'>
                    <h2 className='font-extrabold text-[30px] sm:text-[40px] xl:text-[50px] mb-10'>FREQUENTLY ASKED <span className='textGrad'>QUESTION</span></h2>
                    {faq.map((item, i) => (
                    <div className='border' key={i}>
                        <div className='flex items-center justify-between py-2 px-4'>
                            <h5 className='font-extrabold text-sm'>{item.title}</h5>
                            <button type='button' className='bg-white dark:bg-gray-700 rounded-full border w-[30px] h-[30px] shadow-normal text-sm' onClick={()=>setOpen(i)}>
                                <i className={`fa-solid ${open == i ? 'fa-angle-up' : 'fa-angle-down' }`}></i>
                            </button>
                        </div>
                        <div className={`p-4 border-t text-sm ${open == i ? 'block' : 'hidden' }`}>
                            {item.desc}
                        </div>
                    </div>
                    ))}
                </div>
            </section>
        </main>
        </>
    )
}