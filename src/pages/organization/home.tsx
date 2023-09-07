import React, { useState } from "react";
import ReactPlayer from "react-player";
import Button from "@/components/Button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

export default function HomePage() {
	const [open, setOpen] = useState(0);
	const [nav1, setNav1] = useState();
	const [nav2, setNav2] = useState();
	const features = [
		{
			title: (
				<>
					HR <br /> Assistance
				</>
			),
			desc: "Experience the ease of connecting, managing, and moving candidates effortlessly with our AI-powered HR assistance, utilizing a simple chat interface",
			graphic: "/videos/chat-bot.webm",
			height: "670px"
		},
		{
			title: (
				<>
					Job <br /> Boards
				</>
			),
			desc: "Expand your reach and cultivate a robust talent pipeline by seamlessly connecting with multiple job boards.",
			graphic: "/videos/job-boards-integration.mp4"
		},
		{
			title: <>Integrations</>,
			desc: "Optimize engagement and communication by seamlessly integrating powerful plugins.",
			graphic: "/videos/integration.mp4"
		},
		{
			title: (
				<>
					Workflow <br /> Automation
				</>
			),
			desc: "Enhanced efficiency through streamlined workflow automation",
			img: "/images/feature_calendar.png"
		}
	];
	const faq = [
		{
			title: "lorem impsum",
			desc: "desc text is here"
		},
		{
			title: "lorem ABCD",
			desc: "desc text is 124"
		}
	];
	const settings = {
		dots: false,
		arrows: false,
		infinite: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		fade: true,
		adaptiveHeight: true
	};
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
	};
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
		)
	};
	return (
		<>
			<main>
				<section className="flex min-h-screen items-center bg-white py-10 dark:bg-gray-900">
					<div className="container text-center">
						<h1 className="mb-10 font-poppins text-[35px] font-semibold sm:text-[45px] md:text-[55px] lg:text-[65px] xl:text-[75px]">
							Empower your hiring with automation
						</h1>
						<h2 className="textGrad mb-6 font-poppins text-[25px] font-bold sm:text-[30px] md:text-[35px] lg:text-[40px] xl:text-[45px]">
							Simplify, Streamline, Succeed
						</h2>
						<p className="mx-auto mb-10 w-full max-w-[450px] text-darkGray lg:text-[20px]">
							Efficiently oversee your entire hiring process, from sourcing to offer management.
						</p>
						<div className="mx-auto w-[120px]">
							<Button
								full
								btnType="submit"
								btnStyle="iconRightBtn"
								label="Sign Up"
								iconRight={<i className="fa-solid fa-up-right-from-square"></i>}
							/>
						</div>
					</div>
				</section>
				<section className="border-x-[0.5em] border-gray-100 bg-white py-10 dark:border-gray-600 dark:bg-gray-900 md:border-x-[2em] lg:border-x-[3em]">
					<div className="container">
						<h3 className="textGrad mx-auto mb-6 w-full max-w-[950px] text-center font-poppins text-[25px] font-bold md:text-[30px]">
							Efficiently oversee your entire hiring process, from sourcing to Offer management.
						</h3>
						{features.map((item, i) => (
							<div
								className="group -mx-6 flex flex-wrap items-center py-6 odd:flex-row-reverse"
								id={`features_${i + 1}`}
								key={i}
							>
								<div className="my-4 w-full px-6 lg:max-w-[50%] xl:max-w-[50%]">
									<div className="rounded-[20px] bg-gradient-to-r from-[#FFE9F44D] to-[#EAF3FF] p-8 shadow-highlight dark:from-gray-800 dark:to-gray-700 md:p-14">
										<div className="flex items-center lg:group-even:flex-row-reverse">
											<span className="mr-5 inline-block text-[90px] font-bold leading-none text-gradDarkBlue sm:text-[120px] lg:group-odd:mr-5 lg:group-even:ml-5 xl:text-[135px]">
												{i + 1}
											</span>
											<h2 className="textGrad text-[30px] font-extrabold leading-none sm:text-[40px] lg:grow xl:text-[50px]">
												{item.title}
											</h2>
										</div>
										<p className="mt-4 font-bold lg:text-lg">{item.desc}</p>
									</div>
								</div>
								<div className="my-4 w-full px-6 lg:max-w-[50%] xl:max-w-[50%]">
									{item.graphic && (
										<ReactPlayer
											className="reactPlayer overflow-hidden rounded-normal bg-white"
											url={item.graphic}
											playing
											loop
											muted
											width={"100%"}
											height={item.height ? item.height : ""}
										/>
									)}
									{item.img && <Image src={item.img} alt="Image" width={600} height={300} />}
								</div>
							</div>
						))}
					</div>
				</section>
				<section className="bg_img_features bg-white py-20 dark:bg-gray-900">
					<div className="container">
						<div className="bg_img_features__headings mx-auto mb-10 w-full max-w-[600px] border-b border-gray-400 lg:mb-20">
							<Slider {...settings2} asNavFor={nav1} ref={(slider2) => setNav2(slider2 as any)}>
								<div className="item cursor-pointer py-2 text-center">
									<h6 className="font-bold text-gray-800">Kanban Board</h6>
								</div>
								<div className="item cursor-pointer py-2 text-center">
									<h6 className="font-bold text-gray-800">Vendors</h6>
								</div>
								<div className="item cursor-pointer py-2 text-center">
									<h6 className="font-bold text-gray-800">Career Page</h6>
								</div>
								<div className="item cursor-pointer py-2 text-center">
									<h6 className="font-bold text-gray-800">Internal Chat</h6>
								</div>
								<div className="item cursor-pointer py-2 text-center">
									<h6 className="font-bold text-gray-800">User Access</h6>
								</div>
							</Slider>
						</div>
						<Slider {...settings} asNavFor={nav2} ref={(slider1) => setNav1(slider1 as any)}>
							<div>
								<div className="flex flex-wrap items-center">
									<div className="my-6 w-full text-center lg:max-w-[40%] lg:pr-6 lg:text-left">
										<h4 className="mb-8 text-[30px] font-extrabold leading-none dark:text-black sm:text-[35px] xl:text-[40px]">
											Manage Candidate Seamlessly
										</h4>
										<p className="font-bold dark:text-black lg:text-lg">
											Effortlessly navigate talent with Kanban: Empowering eagle-eye precision in candidate movement.
										</p>
									</div>
									<div className="w-full lg:max-w-[60%] lg:pl-6">
										<ReactPlayer
											className="overflow-hidden rounded-normal"
											url={"/videos/kanban-board.webm"}
											playing
											loop
											muted
											width={"100%"}
											height={"100%"}
										/>
									</div>
								</div>
							</div>
							<div>
								<div className="flex flex-wrap items-center">
									<div className="my-6 w-full text-center lg:max-w-[40%] lg:pr-6 lg:text-left">
										<h4 className="mb-8 text-[30px] font-extrabold leading-none dark:text-black sm:text-[35px] xl:text-[40px]">
											Vendors
										</h4>
										{/* <p className='font-bold lg:text-lg dark:text-black'>Effortlessly navigate talent with Kanban: Empowering eagle-eye precision in candidate movement.</p> */}
									</div>
									<div className="w-full lg:max-w-[60%] lg:pl-6">
										<Image src={"/images/home_vendors.png"} alt="Vendors" width={800} height={400} />
									</div>
								</div>
							</div>
							<div>
								<div className="flex flex-wrap items-center">
									<div className="my-6 w-full text-center lg:max-w-[40%] lg:pr-6 lg:text-left">
										<h4 className="mb-8 text-[30px] font-extrabold leading-none dark:text-black sm:text-[35px] xl:text-[40px]">
											Career Page
										</h4>
										{/* <p className='font-bold lg:text-lg dark:text-black'>Effortlessly navigate talent with Kanban: Empowering eagle-eye precision in candidate movement.</p> */}
									</div>
									<div className="w-full lg:max-w-[60%] lg:pl-6">
										<Image src={"/images/home_career.png"} alt="Career Page" width={800} height={400} />
									</div>
								</div>
							</div>
							<div>
								<div className="flex flex-wrap items-center">
									<div className="my-6 w-full text-center lg:max-w-[40%] lg:pr-6 lg:text-left">
										<h4 className="mb-8 text-[30px] font-extrabold leading-none dark:text-black sm:text-[35px] xl:text-[40px]">
											Internal Chat
										</h4>
										{/* <p className='font-bold lg:text-lg dark:text-black'>Effortlessly navigate talent with Kanban: Empowering eagle-eye precision in candidate movement.</p> */}
									</div>
									<div className="w-full lg:max-w-[60%] lg:pl-6">
										<Image src={"/images/home_internal_chat.png"} alt="Internal Chat" width={800} height={400} />
									</div>
								</div>
							</div>
							<div>
								<div className="flex flex-wrap items-center">
									<div className="my-6 w-full text-center lg:max-w-[40%] lg:pr-6 lg:text-left">
										<h4 className="mb-8 text-[30px] font-extrabold leading-none dark:text-black sm:text-[35px] xl:text-[40px]">
											User Access
										</h4>
										{/* <p className='font-bold lg:text-lg dark:text-black'>Effortlessly navigate talent with Kanban: Empowering eagle-eye precision in candidate movement.</p> */}
									</div>
									<div className="w-full lg:max-w-[60%] lg:pl-6">
										<Image src={"/images/home_user_access.png"} alt="User Access" width={800} height={400} />
									</div>
								</div>
							</div>
						</Slider>
					</div>
				</section>
				<section className="flex items-center bg-white py-20 dark:bg-gray-900">
					<div className="container">
						<div className="rounded-[20px] bg-gradient-to-r from-[#FFE9F44D] to-[#EAF3FF] p-8 shadow-highlight dark:from-gray-800 dark:to-gray-700 md:p-14">
							<div className="mx-auto w-full max-w-[500px]">
								<h2 className="mb-10 text-[30px] font-extrabold sm:text-[40px] xl:text-[50px]">
									Book a <span className="textGrad">Demo</span>
								</h2>
								<p className="mb-10 lg:text-lg">
									Book a demo with us today and discover unparalleled support and a deep understanding of your needs.
									We're here for you every step of the way, providing the best experience possible
								</p>
								<Button btnType="button" label="Request a Demo" />
							</div>
						</div>
					</div>
				</section>
				<section className="testimonials bg-lightBlue py-20 dark:bg-gray-800">
					<div className="container">
						<h2 className="textGrad mb-10 text-center text-[30px] font-extrabold sm:text-[40px] xl:text-[50px]">
							Testimonials
						</h2>
						<div className="relative mx-auto my-10 w-full max-w-[700px] px-8 py-10">
							<Image
								src={"/images/blurb.png"}
								alt="Blurb"
								className="absolute right-10 top-0 h-[400px] w-auto"
								width={800}
								height={400}
							/>
							<Slider {...settings3}>
								{Array(5).fill(
									<div className="py-3 md:px-8">
										<div className="relative">
											<div className="absolute left-[10px] top-[50%] z-[1] h-[calc(100%-100px)] w-[calc(100%-20px)] translate-y-[calc(-50%+20px)] rounded-normal bg-white shadow-normal dark:bg-gray-700"></div>
											<div className="absolute left-[20px] top-[50%] z-[2] h-[calc(100%-65px)] w-[calc(100%-40px)] translate-y-[calc(-50%+20px)] rounded-normal bg-white shadow-normal dark:bg-gray-700"></div>
											<div className="relative z-[3] px-8">
												<Image
													src={"/images/user-image.png"}
													alt="User"
													className="mx-auto mb-[-40px] h-[80px] w-[80px] rounded-full object-cover"
													width={300}
													height={300}
												/>
												<div className="rounded-normal bg-white px-3 pb-6 pt-14 text-center shadow-normal dark:bg-gray-700 sm:px-6">
													<h5 className="mb-2 text-lg font-bold">Hannah Schmitt</h5>
													<p className="mb-3 text-sm sm:mb-6">Lead Designer</p>
													<p className="line-clamp-6 text-[12px] sm:text-sm">
														Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci
														lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.
														Faucibus venenatis felis id augue sit cursus pellentesque enim Lorem ipsum dolor sit amet,
														consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas.
														Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus
														venenatis felis id augue sit cursus pellentesque enim Lorem ipsum dolor sit amet,
														consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas.
														Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus
														venenatis felis id augue sit cursus pellentesque enim Lorem ipsum dolor sit amet,
														consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas.
														Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus
														venenatis felis id augue sit cursus pellentesque enim{" "}
													</p>
												</div>
											</div>
										</div>
									</div>
								)}
							</Slider>
						</div>
					</div>
				</section>
				<section className="bg-white py-20 dark:bg-gray-900">
					<div className="container">
						<h2 className="mb-10 text-[30px] font-extrabold sm:text-[40px] xl:text-[50px]">
							FREQUENTLY ASKED <span className="textGrad">QUESTION</span>
						</h2>
						{faq.map((item, i) => (
							<div className="border" key={i}>
								<div className="flex items-center justify-between px-4 py-2">
									<h5 className="text-sm font-extrabold">{item.title}</h5>
									<button
										type="button"
										className="h-[30px] w-[30px] rounded-full border bg-white text-sm shadow-normal dark:bg-gray-700"
										onClick={() => setOpen(i)}
									>
										<i className={`fa-solid ${open == i ? "fa-angle-up" : "fa-angle-down"}`}></i>
									</button>
								</div>
								<div className={`border-t p-4 text-sm ${open == i ? "block" : "hidden"}`}>{item.desc}</div>
							</div>
						))}
					</div>
				</section>
			</main>
		</>
	);
}
