import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import favIcon from "/public/favicon-white.ico";
import Link from "next/link";
import { axiosInstance2, axiosInstanceAuth } from "@/pages/api/axiosApi";
import moment from "moment";

export default function ChatAssistance(props: { accessToken?: any }) {
	const [click, setClick] = useState(false);
	const [maximize, setMaximize] = useState(false);
	const messageEl: any = useRef(null);
	const accessToken = props.accessToken;
	const [prompt, setprompt] = useState("");
	const [msgs, setmsgs] = useState([]);
	// const [msg,setmsg] = useState([]);

	const axiosInstanceAuth2 = axiosInstanceAuth(accessToken);

	function handleClick() {
		setClick(!click);
		setMaximize(false);
	}

	async function loadChat() {
		await axiosInstanceAuth2
			.get(`/chatbot/listchat/`)
			.then(async (res) => {
				console.log(res);
				console.log(res.data);
				setmsgs(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function addChat(formData: FormData) {
		await axiosInstanceAuth2
			.post(`/chatbot/addchat/`, formData)
			.then(async (res) => {
				loadChat();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function sendMsg() {
		var p = prompt;
		setprompt("Loading.....");
		const formData = new FormData();
		formData.append("prompt", p);
		await axiosInstance2
			.post(`/candidate/chatuserjob/clf0u1qzc0000dcu01f9a5x0m/`, formData)
			.then((res) => {
				const formData2 = new FormData();
				formData2.append("message", p);
				formData2.append("response", res.data.res);
				addChat(formData2);
				setprompt("");
			})
			.catch((err) => {
				console.log(err);
				setprompt("");
			});
	}

	useEffect(() => {
		if (messageEl) {
			messageEl.current.addEventListener("DOMNodeInserted", (event: { currentTarget: any }) => {
				const { currentTarget: target } = event;
				target.scroll({ top: target.scrollHeight, behavior: "smooth" });
			});
		}
	}, []);

	useEffect(() => {
		if (click) {
			loadChat();
		}
	}, [click]);

	return (
		<>
			<div
				className={`fixed left-0 top-0 z-[65] h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]` + " " + (click ? "block" : "hidden")}
				onClick={handleClick}
			></div>
			<div
				className={
					`fixed right-5 bottom-5 z-[66]` + " " + (maximize ? "w-[calc(100%-2.5rem)] max-w-[1920px]" : "w-auto")
				}
			>
				<div
					className={
						`overflow-hidden rounded-normal bg-lightBlue dark:bg-gray-600 shadow-normal` +
						" " +
						(click ? "block" : "hidden") +
						" " +
						(maximize ? "h-[calc(100vh-102px)] w-full" : "h-[70vh] w-[450px]")
					}
				>
					<div className="flex items-center justify-between bg-white dark:bg-gray-700 px-6 py-3">
						<aside className="flex items-center">
							<div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-2">
								<Image src={favIcon} alt="Somhako" width={16} />
							</div>
							<h4 className="text-lg font-bold">Chat Assistance</h4>
						</aside>
						<aside>
							<button type="button" className="text-darkGray dark:text-gray-100" onClick={(e) => setMaximize(!maximize)}>
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
					<div className="h-[calc(100%-134px)] overflow-y-auto py-2 px-6" ref={messageEl}>
						<ul className="w-full text-sm">
							{msgs &&
								msgs.map((data, i) => (
									<>
										<div key={i}>
											<li className="my-2 ml-auto max-w-[90%] text-right">
												<div className="mb-1 inline-block rounded rounded-tl-normal rounded-br-normal bg-white dark:bg-gray-700 py-2 px-4 text-left font-bold shadow">
													{data["message"]}
												</div>
												<div className="text-[10px] text-darkGray dark:text-gray-100">{moment(data["timestamp"]).fromNow()}</div>
											</li>
											<li className="my-2 max-w-[90%]">
												<div className="mb-1 inline-block rounded rounded-tr-normal rounded-bl-normal bg-gradDarkBlue py-2 px-4 text-white shadow">
													{data["response"]}
												</div>
												<div className="text-[10px] text-darkGray dark:text-gray-100">{moment(data["timestamp"]).fromNow()}</div>
											</li>
										</div>
									</>
								))}
						</ul>
						{/* <ul className="w-full text-sm">
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
                                <div className="inline-block mb-1">
                                    <div className="bg-gradDarkBlue text-white py-2 px-4 rounded rounded-tr-normal rounded-bl-normal shadow mb-1">
                                        Here is the list of most experienced applicants of Product Manager Job
                                    </div>
                                    <div className="text-[12px]">
                                        <p className="mb-1 last:mb-0"> 
                                            <Link href={'#'} className="text-primary hover:underline">Anne Hardy - ID 789856</Link>
                                        </p>
                                        <p className="mb-1 last:mb-0"> 
                                            <Link href={'#'} className="text-primary hover:underline">Anne Hardy - ID 789856</Link>
                                        </p>
                                        <p className="mb-1 last:mb-0"> 
                                            <Link href={'#'} className="text-primary hover:underline">Anne Hardy - ID 789856</Link>
                                        </p>
                                    </div>
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
                                    <button type="button" className="rounded border border-slate-800 px-4 py-1.5 hover:bg-slate-800 hover:text-white">
                                        Confirm
                                    </button>
                                </div>
                                <div className="text-[10px] text-darkGray">
                                    4:03 PM
                                </div>
                            </li>
                        </ul> */}
					</div>
					<div className="bg-white dark:bg-gray-700 p-3">
						<div className="flex items-center rounded bg-lightBlue dark:bg-gray-800 p-2">
							{/* <input
								type="text"
								placeholder="Type something..."
								className="w-[calc(100%-50px)] border-0 bg-transparent focus:border-0 focus:shadow-none focus:outline-none focus:ring-0"
								value={prompt}
								onChange={(e) => setprompt(e.target.value)}
							/> */}
							<textarea name="" id="" className="w-[calc(100%-50px)] border-0 bg-transparent  focus:border-0 focus:shadow-none focus:outline-none focus:ring-0 resize-none h-[40px]" placeholder="Type something..." value={prompt} onChange={(e) => setprompt(e.target.value)}></textarea>
							<button
								type="button"
								className="block w-[50px] border-l-2 border-gray-400 text-sm leading-normal"
								onClick={(e) => sendMsg()}
							>
								<i className="fa-solid fa-paper-plane"></i>
							</button>
						</div>
					</div>
				</div>
				<button
					type="button"
					className="ml-auto mt-3 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-2 shadow-normal"
					onClick={handleClick}
				>
					{click ? (
						<>
							<i className="fa-solid fa-xmark text-2xl text-white"></i>
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
