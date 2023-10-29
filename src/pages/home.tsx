import Head from "next/head";
import React, { useRef, Fragment, useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NoAuthHeader from "@/components/noAuth/NoAuthHeader";
import NoAuthFooter from "@/components/noAuth/NoAuthFooter";
import Image from "next/image";
import overlay2 from "public/images/noAuth/overlay2.png";
import bgFinal from "public/images/noAuth/bgFinal.png";
import benfitsImg1 from "public/images/noAuth/benfitsImg1.png";
import novusSection from "public/images/noAuth/novusSection.png";
import whySomhako from "public/images/noAuth/whySomhako.png";
import whySomhako1 from "public/images/noAuth/whySomhako1.png";
import whySomhako2 from "public/images/noAuth/whySomhako2.png";
import whySomhako3 from "public/images/noAuth/whySomhako3.png";
import whySomhako4 from "public/images/noAuth/whySomhako4.png";
import dream1 from "public/images/noAuth/dream1.png";
import faq from "public/images/noAuth/faq.png";
import demoBg from "public/images/noAuth/demoBg.png";
import Tabs from "@/components/noAuth/Tabs";
import Faq from "@/components/noAuth/FaQ";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";
import ToggleLang from "@/components/noAuth/ToggleLang";

export default function LandingPage() {
	const settings = {
		dots: true,
		arrows: false,
		infinite: true,
		speed: 1500,
		slidesToShow: 1,
		slidesToScroll: 1,
		adaptiveHeight: false,
		autoplay: true,
		autoplaySpeed: 4000,
		vertical: false,
		emulateTouch: true
	};

	const [scrollTop, setScrollTop] = useState(0);

	const handleScroll = (event) => {
		setScrollTop(event.currentTarget.scrollTop);
	};

	useEffect(() => {
		console.log("scrollTop", scrollTop);
	}, [scrollTop]);

	const { t } = useTranslation("common");

	const whyHeading_1 = [
		{
			title: t("Noauth.home.wsSliderText1"),
			sub: t("Noauth.home.wsSliderSub1"),
			img: whySomhako1
		},
		{
			title: t("Noauth.home.wsSliderText2"),
			sub: t("Noauth.home.wsSliderSub2"),
			img: whySomhako2
		},
		{
			title: t("Noauth.home.wsSliderText3"),
			sub: t("Noauth.home.wsSliderSub3"),
			img: whySomhako3
		},
		{
			title: t("Noauth.home.wsSliderText4"),
			sub: t("Noauth.home.wsSliderSub4"),
			img: whySomhako4
		}
	];

	return (
		<>
			<Head>
				<title>Landing Page ATS</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<NoAuthHeader scrollTop={scrollTop} />

				<ToggleLang />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>

				<div className="h-[100vh] w-[100vw] overflow-y-scroll" onScroll={handleScroll}>
					{/* hero section */}
					<div
						className="h-auto min-h-[100vh] w-full border-t-2 border-transparent"
						style={{
							background: "linear-gradient(70deg, #2D129A -5.44%, #47BBFD 120.58%)"
						}}
					>
						<div className="relative" style={{ minHeight: "100vh", height: "inherit" }}>
							<div className="absolute left-0 top-0 z-0 w-full" style={{ minHeight: "100vh", height: "100%" }}>
								<div className="flex items-center justify-center " style={{ height: "inherit" }}>
									<Image
										width={1000}
										height={1000}
										src={overlay2}
										alt="img"
										className="h-auto w-full  opacity-10 invert"
									/>
								</div>
							</div>
							<div className="mt-[4rem]" style={{ minHeight: "calc(100vh - 4rem)", height: "inherit" }}>
								<div
									className="my-4 flex flex-col items-center justify-around gap-10 max-lg:justify-around"
									style={{ minHeight: "calc(100vh - 6rem)", height: "inherit" }}
								>
									<div className="h-max w-full">
										<div className="flex w-full flex-col items-center justify-center lg:flex-row">
											<div className="w-full flex-row items-center justify-center p-8 text-center text-white max-lg:my-2 max-lg:py-2 max-sm:px-2">
												<p className="z-10 mb-2 text-left text-[4vw] font-bold leading-[5vw] tracking-[0.5vw] max-lg:mb-4 max-lg:text-center max-lg:text-[5vw] max-lg:leading-[6.5vw] max-sm:mb-2">
													{t("Noauth.home.heroText1")}
													<br /> {t("Noauth.home.heroText2")}
												</p>
												<p className="z-10 mb-8 w-[35vw] text-justify text-[1vw] font-light  max-lg:w-full max-lg:text-[2vw] max-sm:mb-3 max-sm:text-[2.5vw]">
													{t("Noauth.home.heroSubText")}
												</p>
												<div className=" flex flex-row items-center justify-start max-lg:justify-center max-md:justify-center max-md:gap-4 max-sm:flex-col">
													<button className="transform rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-3 tracking-wide text-white shadow-lg transition-all duration-500 ease-in-out hover:scale-110 hover:animate-pulse hover:from-blue-600 hover:to-blue-800 hover:brightness-110 active:animate-bounce">
														{t("Noauth.home.heroBtn1")}
													</button>
													<div className="-translate-x-3 scale-75 max-sm:-translate-x-0">
														<button className="learn-more1" style={{ width: "18rem" }}>
															<span className="circle" aria-hidden="true">
																<span className="icon arrow"></span>
															</span>
															<span className="button-text">{t("Noauth.home.heroBtn2")}</span>
														</button>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-end py-3 max-lg:w-[50vw] max-sm:w-auto">
												<Image src={bgFinal} alt="bg1x" width={1000} height={1000} className="z-10 h-auto w-auto" />
											</div>
										</div>
									</div>
									<div className="flex h-max w-full items-center justify-center">
										<div className="cards z-10 grid grid-cols-4 max-lg:grid-cols-2 max-sm:mb-4 max-sm:cursor-none max-sm:grid-cols-1">
											<div className="card group">
												<p className="px-1 text-[1vw] font-bold uppercase tracking-wide group-hover:font-bold max-lg:text-[1.7vw] max-sm:text-[2.5vw]">
													{t("Noauth.home.heroCardText1")}
												</p>
												<p className="px-1.5 text-[.6vw] font-medium max-lg:text-[1.3vw] max-sm:text-[2vw]">
													{t("Noauth.home.heroCardSub1")}
												</p>
												<div className="star-1">
													<svg
														xmlnsXlink="http://www.w3.org/1999/xlink"
														viewBox="0 0 784.11 815.53"
														style={{
															shapeRendering: "geometricPrecision",
															textRendering: "geometricPrecision",
															imageRendering: "optimizeQuality",
															fillRule: "evenodd",
															clipRule: "evenodd"
														}}
														version="1.1"
														xmlSpace="preserve"
														xmlns="http://www.w3.org/2000/svg"
													>
														<defs></defs>
														<g id="Layer_x0020_1">
															<metadata id="CorelCorpID_0Corel-Layer"></metadata>
															<path
																d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
																className="fil0"
															></path>
														</g>
													</svg>
												</div>
												<div className="star-2">
													<svg
														xmlnsXlink="http://www.w3.org/1999/xlink"
														viewBox="0 0 784.11 815.53"
														style={{
															shapeRendering: "geometricPrecision",
															textRendering: "geometricPrecision",
															imageRendering: "optimizeQuality",
															fillRule: "evenodd",
															clipRule: "evenodd"
														}}
														version="1.1"
														xmlSpace="preserve"
														xmlns="http://www.w3.org/2000/svg"
													>
														<defs></defs>
														<g id="Layer_x0020_1">
															<metadata id="CorelCorpID_0Corel-Layer"></metadata>
															<path
																d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
																className="fil0"
															></path>
														</g>
													</svg>
												</div>
												<div className="star-3">
													<svg
														xmlnsXlink="http://www.w3.org/1999/xlink"
														viewBox="0 0 784.11 815.53"
														style={{
															shapeRendering: "geometricPrecision",
															textRendering: "geometricPrecision",
															imageRendering: "optimizeQuality",
															fillRule: "evenodd",
															clipRule: "evenodd"
														}}
														version="1.1"
														xmlSpace="preserve"
														xmlns="http://www.w3.org/2000/svg"
													>
														<defs></defs>
														<g id="Layer_x0020_1">
															<metadata id="CorelCorpID_0Corel-Layer"></metadata>
															<path
																d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
																className="fil0"
															></path>
														</g>
													</svg>
												</div>
												<div className="star-4">
													<svg
														xmlnsXlink="http://www.w3.org/1999/xlink"
														viewBox="0 0 784.11 815.53"
														style={{
															shapeRendering: "geometricPrecision",
															textRendering: "geometricPrecision",
															imageRendering: "optimizeQuality",
															fillRule: "evenodd",
															clipRule: "evenodd"
														}}
														version="1.1"
														xmlSpace="preserve"
														xmlns="http://www.w3.org/2000/svg"
													>
														<defs></defs>
														<g id="Layer_x0020_1">
															<metadata id="CorelCorpID_0Corel-Layer"></metadata>
															<path
																d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
																className="fil0"
															></path>
														</g>
													</svg>
												</div>
												<div className="star-5">
													<svg
														xmlnsXlink="http://www.w3.org/1999/xlink"
														viewBox="0 0 784.11 815.53"
														style={{
															shapeRendering: "geometricPrecision",
															textRendering: "geometricPrecision",
															imageRendering: "optimizeQuality",
															fillRule: "evenodd",
															clipRule: "evenodd"
														}}
														version="1.1"
														xmlSpace="preserve"
														xmlns="http://www.w3.org/2000/svg"
													>
														<defs></defs>
														<g id="Layer_x0020_1">
															<metadata id="CorelCorpID_0Corel-Layer"></metadata>
															<path
																d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
																className="fil0"
															></path>
														</g>
													</svg>
												</div>
												<div className="star-6">
													<svg
														xmlnsXlink="http://www.w3.org/1999/xlink"
														viewBox="0 0 784.11 815.53"
														style={{
															shapeRendering: "geometricPrecision",
															textRendering: "geometricPrecision",
															imageRendering: "optimizeQuality",
															fillRule: "evenodd",
															clipRule: "evenodd"
														}}
														version="1.1"
														xmlSpace="preserve"
														xmlns="http://www.w3.org/2000/svg"
													>
														<defs></defs>
														<g id="Layer_x0020_1">
															<metadata id="CorelCorpID_0Corel-Layer"></metadata>
															<path
																d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
																className="fil0"
															></path>
														</g>
													</svg>
												</div>
											</div>
											<div className="card group">
												<p className="px-1 text-[1vw] font-bold uppercase tracking-wide group-hover:font-bold max-lg:text-[1.7vw] max-sm:text-[2.5vw]">
													{t("Noauth.home.heroCardText2")}
												</p>
												<p className="px-1.5 text-[.6vw] font-medium max-lg:text-[1.3vw] max-sm:text-[2vw]">
													{t("Noauth.home.heroCardSub2")}
												</p>
											</div>
											<div className="card group">
												<p className="px-1 text-[1vw] font-bold uppercase tracking-wide group-hover:font-bold max-lg:text-[1.7vw] max-sm:text-[2.5vw]">
													{t("Noauth.home.heroCardText3")}
												</p>
												<p className="px-1.5 text-[.6vw] font-medium max-lg:text-[1.3vw] max-sm:text-[2vw]">
													{t("Noauth.home.heroCardSub3")}
												</p>
											</div>
											<div className="card group">
												<p className="px-1 text-[1vw] font-bold uppercase tracking-wide group-hover:font-bold max-lg:text-[1.7vw] max-sm:text-[2.5vw]">
													{t("Noauth.home.heroCardText4")}
												</p>
												<p className="px-1.5 text-[.6vw] font-medium max-lg:text-[1.3vw] max-sm:text-[2vw]">
													{t("Noauth.home.heroCardSub4")}
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* benefit section */}
					<div className="h-auto min-h-[100vh] w-full bg-[#F5F6F8]">
						<div className="relative " style={{ minHeight: "100vh", height: "inherit" }}>
							<div className="z-10 " style={{ minHeight: "100vh", height: "inherit" }}>
								<div className="flex flex-row gap-2  max-md:gap-0" style={{ minHeight: "100vh", height: "inherit" }}>
									<div className="h-auto w-[10vw] ">
										<span className="flex h-full items-center justify-center border-r-2 border-dashed border-borderColor  max-lg:items-start max-lg:pt-[4rem] ">
											<p
												className="select-none text-[4vw] font-extrabold tracking-wide text-black/[0.1]"
												style={{ textOrientation: "upright", writingMode: "vertical-lr" }}
											>
												Benefits
											</p>
										</span>
									</div>
									<div className="h-auto w-[90vw] ">
										<div className="flex h-full flex-col items-center justify-around gap-20 max-md:gap-10 ">
											<div className="flex w-full flex-row items-center justify-center gap-2  p-4 max-lg:flex-col max-md:p-2">
												<div className="w-full flex-grow ">
													<div className="flex w-full flex-col gap-2 p-4 max-lg:items-center max-lg:justify-center max-md:p-0">
														<div
															className=" text-[2.5vw] font-bold uppercase tracking-[0.25vw] max-lg:text-center max-lg:text-[3vw] max-md:text-[3.5vw]"
															style={{
																background:
																	"-webkit-linear-gradient(75deg, rgba(15, 101, 205, 0.90) -1.16%, rgba(67, 165, 229, 0.63) 108.83%)",
																WebkitBackgroundClip: "text",
																WebkitTextFillColor: "transparent"
															}}
														>
															{t("Noauth.home.benefitsText1")}
														</div>
														<div className="w-[40vw] text-[1vw] text-black max-lg:w-[60vw]  max-lg:text-[2vw] max-md:text-[2.5vw] lg:text-justify">
															{t("Noauth.home.benefitsText2")}
														</div>
													</div>
												</div>
												<div className="flex items-center justify-center p-4 px-10">
													<Image
														src={benfitsImg1}
														alt="bg1x"
														width={1000}
														height={1000}
														className="z-20  h-auto w-fit max-lg:w-[30vw] max-md:w-fit"
													/>
												</div>
											</div>
											<div className="w-full ">
												<Tabs t={t} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* novus section */}
					<div
						className="h-auto min-h-[100vh] w-full "
						style={{
							background: "linear-gradient(70deg, #2D129A -5.44%, #47BBFD 120.58%)"
						}}
					>
						<div className="relative" style={{ minHeight: "100vh", height: "inherit" }}>
							<div className="absolute left-0 top-0 z-0 w-full" style={{ minHeight: "100vh", height: "100%" }}>
								<div className="flex items-end justify-start" style={{ height: "inherit" }}>
									<Image
										width={1000}
										height={1000}
										src={novusSection}
										alt="img"
										className="h-[100%] w-fit object-fill"
									/>
								</div>
							</div>

							<div
								className="z-10 flex items-center justify-center  p-8 max-md:items-start max-md:p-2"
								style={{ minHeight: "100vh", height: "inherit" }}
							>
								<div className="z-10 ml-[30vw] flex w-[50vw] flex-col gap-4 rounded-3xl p-4 text-white max-lg:ml-0 max-lg:w-[60vw] max-lg:border-l-2 max-lg:border-t-2 max-lg:border-black/[0.78] max-lg:bg-white max-lg:backdrop-blur max-md:w-[80vw] max-md:border-white/[0.4] max-md:bg-black/[0.15] ">
									<div className="z-10 text-[1.5vw] font-light leading-[3vw]  text-white max-lg:text-[1.7vw] max-lg:leading-[4vw] max-lg:text-black max-md:text-[2.5vw] max-md:leading-[5vw] max-md:text-white">
										<span className="z-10 text-[3.5vw] font-semibold uppercase tracking-wider max-lg:text-[4vw] max-md:text-[5vw]">
											{t("Noauth.home.novusText1")}
										</span>{" "}
										{t("Noauth.home.novusText2")}
									</div>
									<div className="z-10 flex justify-start  max-lg:justify-center">
										<button className="btn1 rounded-full px-6 py-2 text-xl">
											{t("Noauth.home.novusBtn1")}
											<div className="star-1">
												<svg
													xmlnsXlink="http://www.w3.org/1999/xlink"
													viewBox="0 0 784.11 815.53"
													style={{
														shapeRendering: "geometricPrecision",
														textRendering: "geometricPrecision",
														imageRendering: "optimizeQuality",
														fillRule: "evenodd",
														clipRule: "evenodd"
													}}
													version="1.1"
													xmlSpace="preserve"
													xmlns="http://www.w3.org/2000/svg"
												>
													<defs></defs>
													<g id="Layer_x0020_1">
														<metadata id="CorelCorpID_0Corel-Layer"></metadata>
														<path
															d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
															className="fil0"
														></path>
													</g>
												</svg>
											</div>
											<div className="star-2">
												<svg
													xmlnsXlink="http://www.w3.org/1999/xlink"
													viewBox="0 0 784.11 815.53"
													style={{
														shapeRendering: "geometricPrecision",
														textRendering: "geometricPrecision",
														imageRendering: "optimizeQuality",
														fillRule: "evenodd",
														clipRule: "evenodd"
													}}
													version="1.1"
													xmlSpace="preserve"
													xmlns="http://www.w3.org/2000/svg"
												>
													<defs></defs>
													<g id="Layer_x0020_1">
														<metadata id="CorelCorpID_0Corel-Layer"></metadata>
														<path
															d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
															className="fil0"
														></path>
													</g>
												</svg>
											</div>
											<div className="star-3">
												<svg
													xmlnsXlink="http://www.w3.org/1999/xlink"
													viewBox="0 0 784.11 815.53"
													style={{
														shapeRendering: "geometricPrecision",
														textRendering: "geometricPrecision",
														imageRendering: "optimizeQuality",
														fillRule: "evenodd",
														clipRule: "evenodd"
													}}
													version="1.1"
													xmlSpace="preserve"
													xmlns="http://www.w3.org/2000/svg"
												>
													<defs></defs>
													<g id="Layer_x0020_1">
														<metadata id="CorelCorpID_0Corel-Layer"></metadata>
														<path
															d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
															className="fil0"
														></path>
													</g>
												</svg>
											</div>
											<div className="star-4">
												<svg
													xmlnsXlink="http://www.w3.org/1999/xlink"
													viewBox="0 0 784.11 815.53"
													style={{
														shapeRendering: "geometricPrecision",
														textRendering: "geometricPrecision",
														imageRendering: "optimizeQuality",
														fillRule: "evenodd",
														clipRule: "evenodd"
													}}
													version="1.1"
													xmlSpace="preserve"
													xmlns="http://www.w3.org/2000/svg"
												>
													<defs></defs>
													<g id="Layer_x0020_1">
														<metadata id="CorelCorpID_0Corel-Layer"></metadata>
														<path
															d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
															className="fil0"
														></path>
													</g>
												</svg>
											</div>
											<div className="star-5">
												<svg
													xmlnsXlink="http://www.w3.org/1999/xlink"
													viewBox="0 0 784.11 815.53"
													style={{
														shapeRendering: "geometricPrecision",
														textRendering: "geometricPrecision",
														imageRendering: "optimizeQuality",
														fillRule: "evenodd",
														clipRule: "evenodd"
													}}
													version="1.1"
													xmlSpace="preserve"
													xmlns="http://www.w3.org/2000/svg"
												>
													<defs></defs>
													<g id="Layer_x0020_1">
														<metadata id="CorelCorpID_0Corel-Layer"></metadata>
														<path
															d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
															className="fil0"
														></path>
													</g>
												</svg>
											</div>
											<div className="star-6">
												<svg
													xmlnsXlink="http://www.w3.org/1999/xlink"
													viewBox="0 0 784.11 815.53"
													style={{
														shapeRendering: "geometricPrecision",
														textRendering: "geometricPrecision",
														imageRendering: "optimizeQuality",
														fillRule: "evenodd",
														clipRule: "evenodd"
													}}
													version="1.1"
													xmlSpace="preserve"
													xmlns="http://www.w3.org/2000/svg"
												>
													<defs></defs>
													<g id="Layer_x0020_1">
														<metadata id="CorelCorpID_0Corel-Layer"></metadata>
														<path
															d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
															className="fil0"
														></path>
													</g>
												</svg>
											</div>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* spotlight section */}
					<div
						className="flex h-auto min-h-[35vh] w-full items-center justify-around gap-10 px-8 py-2 max-md:min-h-[25vh] max-md:flex-col max-md:justify-center max-md:gap-2"
						style={{
							backgroundImage: "url('/images/noAuth/tabBg1.jpg')",
							backgroundRepeat: "no-repeat",
							backgroundSize: "cover",
							backgroundPosition: "center"
						}}
					>
						<p className="flex flex-col gap-4   max-md:text-center ">
							<div className="text-[1.5vw] leading-10 tracking-widest text-white max-lg:text-[1.7vw] max-md:text-[2.2vw] max-md:leading-4">
								{t("Noauth.home.spText1")}
							</div>
							<div className="z-10 flex justify-start  pt-4 text-white max-md:justify-center max-md:pt-4">
								<div className="-translate-x-3 scale-90 ">
									<button className="learn-more1">
										<span className="circle" aria-hidden="true">
											<span className="icon arrow"></span>
										</span>
										<span className="button-text">{t("Noauth.home.spBtn1")}</span>
									</button>
								</div>
							</div>
						</p>
						<div className="m-2 flex h-[25vh] w-[30%] justify-center max-lg:w-full">
							<Image src={demoBg} alt="LP" width={"1000"} height={"1000"} className="z-10 h-full  w-auto" />
						</div>
					</div>

					{/* why section */}
					<div
						className="h-auto w-full "
						style={{
							background: "linear-gradient(70deg, #2D129A -5.44%, #47BBFD 120.58%)"
						}}
					>
						<div
							className="flex flex-col items-center justify-center gap-8 "
							style={{ minHeight: "auto", height: "inherit" }}
						>
							<div className="m-2 flex h-auto w-full items-center justify-center  p-8 max-md:p-2">
								<div className="min-h-auto flex w-[70vw] items-center gap-4 rounded-3xl bg-white p-4 px-12 max-lg:h-auto max-lg:min-h-fit max-lg:w-[90vw] max-md:flex-col  max-md:p-2">
									<div className="flex flex-grow flex-col gap-4  max-md:gap-2">
										<div
											className="w-full  text-[2.5vw] font-bold uppercase tracking-[0.25vw] max-lg:text-center max-lg:text-[3.3vw] max-md:w-full max-md:text-center max-md:text-[4vw]"
											style={{
												background:
													"linear-gradient(75deg, rgba(15, 101, 205, 0.90) -1.16%, rgba(67, 165, 229, 0.63) 108.83%)",
												backgroundClip: "text",
												WebkitBackgroundClip: "text",
												WebkitTextFillColor: "transparent"
											}}
										>
											{t("Noauth.home.wsText1")}
										</div>
										<div className="text-[1.5vw] font-normal tracking-wider text-black max-lg:text-[2vw] max-md:text-center max-md:text-[2.5vw]">
											{t("Noauth.home.wsText2")}
											<span className="font-bold">{t("Noauth.home.wsText3")}</span>
										</div>
										<div className="w-[90%] text-[1vw] font-light text-black max-lg:text-[2vw] max-md:w-full max-md:text-center max-md:text-[2.5vw]">
											{t("Noauth.home.wsText4")}
										</div>
									</div>
									<div className="w-auto  lg:w-[60vw]">
										<Image src={whySomhako} alt="why" width={1000} height={1000} className="h-auto w-auto" />
									</div>
								</div>
							</div>
							<div className="m-2 h-auto w-full  p-8 max-lg:p-4 max-lg:pb-[4rem] max-md:p-2 max-md:pb-[4rem]">
								<Slider {...settings}>
									{whyHeading_1.map((data, i) => (
										<div key={i}>
											<div className="min-h-auto mx-auto my-auto flex w-[80vw] items-center justify-center gap-4  p-4 px-12 max-lg:h-auto max-lg:min-h-fit max-lg:w-[90vw] max-md:flex-col max-md:p-2">
												<div className="flex flex-grow flex-col gap-4 ">
													<div className="w-full text-[2vw]  text-white max-lg:text-[3.3vw] max-md:text-center max-md:text-[4vw]">
														{data.title}
													</div>
													<div className="w-[90%] text-[1vw] font-light tracking-wider text-white max-lg:text-[2vw] max-md:w-full max-md:text-center max-md:text-[2.5vw]">
														{data.sub}
													</div>
													<div className="z-10 flex justify-start  pt-8 text-white max-md:justify-center">
														<button className="transform rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-3 tracking-wide text-white shadow-lg transition-all duration-500 ease-in-out hover:scale-110 hover:animate-pulse hover:from-blue-600 hover:to-blue-800 hover:brightness-110 active:animate-bounce">
															{t("Noauth.home.wsSliderBtn")}
														</button>
													</div>
												</div>
												<div className="h-full w-full  lg:h-[60vh]">
													<Image
														src={data.img}
														alt="why"
														width={1000}
														height={1000}
														className="mx-auto h-full w-auto "
													/>
												</div>
											</div>
										</div>
									))}
								</Slider>
								<style>
									{`
          /* Change the color of slick dots to white */
          .slick-dots li button:before {
            color: white;
          }
          .slick-dots li.slick-active button:before {
            color: white;
          }
        `}
								</style>
							</div>
						</div>
					</div>

					{/* dream section */}
					<div className="flex h-auto  w-full items-center justify-evenly gap-10 bg-[#F5F6F8] p-4 max-md:min-h-[25vh] max-md:flex-col max-md:justify-center max-md:gap-4 max-md:p-2">
						<div className="z-10  flex w-[30%] justify-center p-4  max-md:w-auto">
							<Image src={dream1} height={1000} width={1000} alt="123" className="h-auto w-auto" />
						</div>
						<p className="flex w-[60%] flex-col gap-4 max-md:w-auto">
							<div
								className="z-10 w-fit  text-left text-[2.5vw] font-bold uppercase tracking-[0.25vw] max-lg:text-center max-md:w-full max-md:text-center max-md:text-[3.5vw]"
								style={{
									background:
										"linear-gradient(75deg, rgba(15, 101, 205, 0.90) -1.16%, rgba(67, 165, 229, 0.63) 108.83%)",
									backgroundClip: "text",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent"
								}}
							>
								{t("Noauth.home.dsText1")}
							</div>
							<div className="w-[90%] text-[1vw] font-light tracking-wider text-black max-lg:w-full max-lg:text-center max-md:text-[2vw]">
								{t("Noauth.home.dsText2")}
							</div>
							<div className="w-[90%] text-[1.2vw] tracking-wider text-black max-lg:w-full max-lg:text-center max-md:text-[2.2vw]">
								{t("Noauth.home.dsText3")}
							</div>
							<div className="z-10 flex justify-start  text-white max-lg:justify-center">
								<button className="transform rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-3 tracking-wide text-white shadow-lg transition-all duration-500 ease-in-out hover:scale-110 hover:animate-pulse hover:from-blue-600 hover:to-blue-800 hover:brightness-110 active:animate-bounce">
									{t("Noauth.home.dsText4")}
								</button>
							</div>
						</p>
					</div>

					{/* faq section */}
					<div
						className="h-auto  w-full "
						style={{
							background: "linear-gradient(70deg, #2D129A -5.44%, #47BBFD 120.58%)"
						}}
					>
						<div className="flex flex-col items-center justify-center gap-0 ">
							<div className="m-2 h-auto   py-4 text-[2.5vw] font-bold tracking-[0.25vw] text-white max-lg:text-center max-md:w-full max-md:text-center max-md:text-[3.5vw]">
								FAQ
							</div>
							<div
								className="m-2 flex h-auto w-full items-center justify-center  p-8"
								style={{ minHeight: "auto", height: "inherit" }}
							>
								<div className="min-h-auto flex w-[70vw] items-center gap-4 rounded-3xl bg-white p-4 px-12 max-lg:h-auto max-lg:min-h-fit max-lg:w-[90vw] max-md:flex-col  max-md:p-2">
									<div className="flex w-[30vw] justify-center  lg:w-[60vw]">
										<Image src={faq} alt="why" width={1000} height={1000} className="h-auto w-auto" />
									</div>
									<div className="flex w-[70vw] flex-col gap-4 ">
										<div className="px-2 text-center text-[1.3vw] font-semibold tracking-wider text-[#2D129A] max-lg:text-[1.7vw] max-md:text-[2.3vw]">
											{t("Noauth.home.faqText1")}
										</div>
										<Faq t={t} />
									</div>
								</div>
							</div>
						</div>
					</div>

					<NoAuthFooter />
				</div>
			</main>
		</>
	);
}

export async function getStaticProps({ context, locale }: any) {
	const translations = await serverSideTranslations(locale, ["common"]);
	return {
		props: {
			...translations
		}
	};
}

LandingPage.noAuth = true;
LandingPage.mobileEnabled = true;
