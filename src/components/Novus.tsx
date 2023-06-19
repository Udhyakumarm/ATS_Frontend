import React, { useEffect, useState, useRef, Fragment } from "react";
import Image from "next/image";
import favIcon from "/public/favicon-white.ico";
import { useRouter } from "next/router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "./Button";
import { Combobox, Transition } from '@headlessui/react'
import { useResizeDetector } from 'react-resize-detector';
import { withResizeDetector } from 'react-resize-detector';

const promptsList = [
	{ id: 1, name: 'Applicant', desc: 'Applicant prompts' },
	{ id: 2, name: 'Offer Management', desc: 'Offer Management prompts' },
	{ id: 3, name: 'Jobs', desc: 'Jobs prompts' },
	{ id: 4, name: 'Interviews', desc: 'Interviews prompts' }
]

function Novus(props: any) {
	const router = useRouter();
	const [click, setClick] = useState(false);
	const [maximize, setMaximize] = useState(false);
	const [showPrompts, setShowPrompts] = useState(false);
	const messageEl: any = useRef(null);
	const [prompt, setprompt] = useState("");
	const [selected, setSelected] = useState('')
	const [query, setQuery] = useState('')
	const [subPrompt, setSubPrompt] = useState(false);
	const { width, height, ref } = useResizeDetector();

	const filteredpromptsList =
		query === ''
			? promptsList
			: promptsList.filter((item) =>
				item.name
					.toLowerCase()
					.replace(/\s+/g, '')
					.includes(query.toLowerCase().replace(/\s+/g, ''))
			)

	function PromptsDataHandle() {
		return (
			<>
				<Slider {...promptsSlider} className="w-full max-w-[400px]">
					{Array(6).fill(
						<div>
							<p className="bg-white mr-2 border rounded py-1 px-3 text-[10px] shadow-normal cursor-pointer text-center" onClick={handleSubPrompt}>All applicants</p>
						</div>
					)}
				</Slider>
			</>
		)
	}

	function handleChangePromts(e: any) {
		setQuery(e.target.value)
		if (e.target.value == '') {
			setShowPrompts(false)
			setSelected(' ')
		}
	}

	function handleClick() {
		setClick(!click);
		setMaximize(false);
	}

	function handlePromptItem() {
		setShowPrompts(true)
	}

	function handleSubPrompt() {
		setSubPrompt(true)
	}

	useEffect(() => {
		if (messageEl) {
			messageEl.current.addEventListener("DOMNodeInserted", (event: { currentTarget: any }) => {
				const { currentTarget: target } = event;
				target.scroll({ top: target.scrollHeight, behavior: "smooth" });
			});
		}
	}, []);

	const teamListSlider = {
		dots: false,
		arrows: true,
		infinite: false,
		speed: 300,
		slidesToShow: 2.5,
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
	const promptsSlider = {
		dots: false,
		arrows: true,
		infinite: false,
		speed: 300,
		slidesToShow: 2.5,
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

	return (
		<>
			<div
				className={
					`fixed left-0 top-0 z-[65] h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]` +
					" " +
					(click ? "block" : "hidden")
				}
				onClick={handleClick}
			></div>
			<div
				className={
					`chatNovus fixed bottom-5 right-5 z-[66]` + " " + (maximize ? "w-[calc(100%-2.5rem)] max-w-[1920px]" : "w-auto")
				}
			>
				<div
					className={
						`overflow-hidden rounded-normal bg-lightBlue shadow-normal dark:bg-gray-600` +
						" " +
						(click ? "block" : "hidden") +
						" " +
						(maximize ? "h-[calc(100vh-102px)] w-full" : "h-[70vh] w-[450px]")
					}
				>
					<div className="flex items-center justify-between bg-white px-6 py-3 dark:bg-gray-700">
						<aside className="flex items-center">
							<div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-2">
								<Image src={favIcon} alt="Somhako" width={16} />
							</div>
							<h4 className="text-lg font-bold">Novus</h4>
						</aside>
						<aside>
							<button
								type="button"
								className="text-darkGray dark:text-gray-100"
								onClick={(e) => setMaximize(!maximize)}
							>
								{maximize ? (
									<>
										<i className="fa-solid fa-down-left-and-up-right-to-center"></i>
									</>
								) : (
									<>
										<i className="fa-solid fa-maximize"></i>
									</>
								)}
							</button>
						</aside>
					</div>
					<div className={`overflow-y-auto px-6 py-2`} id="novusMiddle" ref={messageEl} style={{height: `calc(100% - calc(${height}px + 54px))`}}>
						<ul className="w-full text-sm">
							<li className="my-2 text-right max-w-[90%] ml-auto">
								<div className="inline-block text-left bg-white py-2 px-4 rounded rounded-tl-normal rounded-br-normal shadow font-bold mb-1">
									Hi
								</div>
								<div className="text-[10px] text-darkGray">
									4:04 PM
								</div>
							</li>
							<li className="my-2 max-w-[90%]">
								<div className="inline-block bg-gradDarkBlue text-white py-2 px-4 rounded rounded-tr-normal rounded-bl-normal shadow mb-1">
									Hi there how may I help you?
								</div>
								<div className="text-[10px] text-darkGray">
									4:03 PM
								</div>
							</li>
							<li className="my-2 text-right max-w-[90%] ml-auto">
								<div className="inline-block text-left bg-white py-2 px-4 rounded rounded-tl-normal rounded-br-normal shadow font-bold mb-1">
									Show me the Urgent Tasks
								</div>
								<div className="text-[10px] text-darkGray">
									4:02 PM
								</div>
							</li>
							<li className="my-2 max-w-[90%]">
								<div className="inline-block mb-1">
									<div className="mb-1 last:mb-0">
										<h6 className="font-bold">Team Meeting</h6>
										<p className="text-[12px]">Lorem impsum is a dummy text</p>
									</div>
									<div className="mb-1 last:mb-0">
										<h6 className="font-bold">Team Meeting</h6>
										<p className="text-[12px]">Lorem impsum is a dummy text</p>
									</div>
								</div>
								<div className="text-[10px] text-darkGray">
									4:03 PM
								</div>
							</li>
							<li className="my-2 text-right max-w-[90%] ml-auto">
								<div className="inline-block text-left bg-white py-2 px-4 rounded rounded-tl-normal rounded-br-normal shadow font-bold mb-1">
									How many applicants total in pipeline
								</div>
								<div className="text-[10px] text-darkGray">
									4:02 PM
								</div>
							</li>
							<li className="my-2 max-w-[90%]">
								<div className="inline-block bg-gradDarkBlue text-white py-2 px-4 rounded rounded-tr-normal rounded-bl-normal shadow mb-1">
									60 applicants
								</div>
								<div className="text-[10px] text-darkGray">
									4:03 PM
								</div>
							</li>
							<li className="my-2 text-right max-w-[90%] ml-auto">
								<div className="inline-block text-left bg-white py-2 px-4 rounded rounded-tl-normal rounded-br-normal shadow font-bold mb-1">
									Show me the most experienced applicants of Product Manager Job
								</div>
								<div className="text-[10px] text-darkGray">
									4:02 PM
								</div>
							</li>
							<li className="my-2 max-w-[90%]">
								<div className="mb-1">
									<div className="bg-gradDarkBlue text-white py-2 px-4 rounded rounded-tr-normal rounded-bl-normal shadow mb-1">
										Here is the list of most experienced applicants of Product Manager Job
									</div>
									<Slider {...teamListSlider} className="w-full max-w-[400px]">
										{Array(6).fill(
											<div className="pr-1">
												<div className="rounded flex items-center shadow border overflow-hidden">
													<button type="button" className="py-1 px-3 grow bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-lightBlue text-[10px] whitespace-nowrap">
														Anne Hardy
													</button>
													<button type="button" className="w-[25px] h-[30px] bg-gray-500 text-white hover:bg-gray-700 text-[10px] flex items-center justify-center">
														<i className="fa-solid fa-copy"></i>
													</button>
												</div>
											</div>
										)}
									</Slider>
								</div>
								<div className="text-[10px] text-darkGray">
									4:03 PM
								</div>
							</li>
							<li className="my-2 text-right max-w-[90%] ml-auto">
								<div className="inline-block text-left bg-white py-2 px-4 rounded rounded-tl-normal rounded-br-normal shadow font-bold mb-1">
									Schedule Interview with Jack
								</div>
								<div className="text-[10px] text-darkGray">
									4:02 PM
								</div>
							</li>
							<li className="my-2 max-w-[90%]">
								<div className="inline-block mb-1">
									<div className="bg-gradDarkBlue text-white py-2 px-4 rounded rounded-tr-normal rounded-bl-normal shadow mb-2">
										Interview has been Schedule at 28 Feb at 3:00 PM
									</div>
									<div className="flex flex-wrap">
										<div className="mr-2 last:mr-0">
											<Button btnStyle="success" label="Confirm" />
										</div>
										<div className="mr-2 last:mr-0">
											<Button btnStyle="gray" label="Change" />
										</div>
										<div className="mr-2 last:mr-0">
											<Button btnStyle="danger" label="Cancel" />
										</div>
									</div>
								</div>
								<div className="text-[10px] text-darkGray">
									4:03 PM
								</div>
							</li>
						</ul>
					</div>
					<div ref={ref}>
						<div className="bg-white p-3 dark:bg-gray-700 relative border-t-2 border-gray-300">
							{
								subPrompt &&
								<div className="px-3 py-2 absolute z-[3] left-0 bottom-[calc(100%+5px)] scrollbarHidden bg-white shadow-normal w-full border-t-2 border-gray-300 max-h-[150px] overflow-auto">
									<p className="text-sm flex items-center p-2 my-1 bg-white rounded cursor-pointer hover:bg-gray-100">1. Lorem impsum is a dummy text provider</p>
									<p className="text-sm flex items-center p-2 my-1 bg-white rounded cursor-pointer hover:bg-gray-100">2. Lorem impsum is a dummy text provider</p>
									<p className="text-sm flex items-center p-2 my-1 bg-white rounded cursor-pointer hover:bg-gray-100">3. Lorem impsum is a dummy text provider</p>
									<p className="text-sm flex items-center p-2 my-1 bg-white rounded cursor-pointer hover:bg-gray-100">4. Lorem impsum is a dummy text provider</p>
								</div>
							}
							{
								showPrompts &&
								<div className="px-3 py-2 flex w-full border shadow-normal">
									<div className="border-r font-bold w-[60px] text-[12px] flex items-center py-2">Prompts</div>
									<div className="w-[calc(100%-60px)] flex items-center px-5">
										<PromptsDataHandle />
									</div>
								</div>
							}
							<div className="rounded bg-lightBlue p-2 dark:bg-gray-800">
								<div className="flex items-center">
									<Combobox value={selected} onChange={setSelected}>
										<div className="w-[calc(100%-50px)] pr-2 border-r-2 border-gray-400">
											<div className="relative flex flex-wrap items-center cursor-default overflow-hidden bg-transparent text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
												<Combobox.Button className={`px-2 text-left ${selected ? 'w-auto' : 'w-auto'}`}>
													/
												</Combobox.Button>
												{!selected.name &&
													<Combobox.Input
														className="w-auto border-none p-0 pr-2 text-sm leading-5 bg-transparent text-gray-900 focus:ring-0"
														placeholder="Click on “/” for prompt"
														displayValue={(item:any) => item.name}
														onChange={handleChangePromts}
													/>
												}
												{
													selected &&
													<>
														<p className="text-[12px]">{selected.name}</p>
														{selected.name &&
															<>
																<div className="mx-2 bg-white rounded py-1 px-3 grow">
																	<div className="flex items-center"><input type="search" className="w-full border-0 px-2 py-0 outline-0 text-[12px] focus:ring-0" placeholder="Choose prompt above..." /></div>
																</div>
																<Combobox.Input
																	className="border-none p-0 pr-2 text-sm leading-5 bg-transparent text-gray-900 focus:ring-0"
																	placeholder="Click on “/” for prompt"
																	displayValue={(item: any) => ' '}
																	onChange={handleChangePromts}
																/>
															</>
														}
													</>
												}
											</div>
											<Transition
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
												afterLeave={() => setQuery('')}
											>
												<Combobox.Options className="absolute z-[3] left-0 bottom-[calc(100%+5px)] scrollbarHidden max-h-[150px] w-full overflow-auto bg-white py-1 px-3 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
													{filteredpromptsList.length === 0 && query !== '' ? (
														<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
															Nothing found.
														</div>
													) : (
														filteredpromptsList.map((item) => (
															<Combobox.Option
																key={item.id}
																className={({ active }) =>
																	`relative cursor-default select-none py-2 px-4 ${active ? 'bg-gray-100' : 'text-gray-900'
																	}`
																}
																onClick={handlePromptItem}
																value={item}
															>
																{({ selected, active }) => (
																	<>
																		<div className={`text-sm flex items-center ${selected ? 'font-bold' : 'font-normal'}`}>/ <span className="ml-1">{item.name}</span></div>
																		<p className="text-[12px] text-darkGray">{item.desc}</p>
																	</>
																)}
															</Combobox.Option>
														))
													)}
												</Combobox.Options>
											</Transition>
										</div>
									</Combobox>
									<button
										type="button"
										className="block w-[50px] text-sm leading-normal"
									>
										<i className="fa-solid fa-paper-plane"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<button
					type="button"
					className="relative ml-auto mt-3 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-2 shadow-normal"
					onClick={handleClick}
				>
					<span className="absolute left-0 top-0 h-3 w-3 rounded-full bg-green-300 shadow-normal"></span>

					{click ? (
						<>
							<i className="fa-solid fa-xmark text-xl text-white"></i>
						</>
					) : (
						<>
							<Image src={favIcon} alt="Somhako" width={22} />
						</>
					)}
				</button>
			</div>
		</>
	);
}

export default withResizeDetector(Novus);
