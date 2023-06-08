import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import favIcon from "/public/favicon-white.ico";
import Link from "next/link";
import { axiosInstance2, axiosInstanceAuth } from "@/pages/api/axiosApi";
import moment from "moment";
import toastcomp from "./toast";
import { useApplicantStore } from "@/utils/code";
import { useRouter } from "next/router";

export default function ChatAssistance(props: any) {
	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const setappid = useApplicantStore((state: { setappid: any }) => state.setappid);
	const setappdata = useApplicantStore((state: { setappdata: any }) => state.setappdata);
	const settype = useApplicantStore((state: { settype: any }) => state.settype);

	const router = useRouter();

	const [click, setClick] = useState(false);
	const [maximize, setMaximize] = useState(false);
	const messageEl: any = useRef(null);
	const accessToken = props.accessToken;
	const setnotify = props.setnotify;
	const freeslotdata = props.freeslotdata;
	const setfreeslotdata = props.setfreeslotdata;
	const setEditSchdInter = props.setEditSchdInter;
	const cardarefid = props.cardarefid;
	const cardstatus = props.cardstatus;
	const orgpro = props.orgpro;
	const change = props.change;
	const setchange = props.setchange;

	const intername = props.intername;
	const interdesc = props.interdesc;
	const interdate = props.interdate;
	const interstime = props.interstime;
	const interetime = props.interetime;

	const setintername = props.setintername;
	const setinterdesc = props.setinterdesc;
	const setinterdate = props.setinterdate;
	const setinterstime = props.setinterstime;
	const setinteretime = props.setinteretime;

	const [prompt, setprompt] = useState("");
	const [msgs, setmsgs] = useState([]);
	const [lpk, setlpk] = useState("");
	const [des, setdes] = useState(false);
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
				setdes(false);
				console.log("$", res);
				console.log("@", res.data);
				setmsgs(res.data);
				let a = res.data;
				for (let i = 0; i < a.length; i++) {
					if (a[i]["response"].includes("I suggest Interview can been Schedule at")) {
						setdes(true);
					}
				}
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
		await axiosInstanceAuth2
			// .post(`/candidate/chatuserjob/clf0u1qzc0000dcu01f9a5x0m/`, formData)
			.post(`/chatbot/chat-organization-wise/`, formData)
			.then((res) => {
				if (res.data.res === "Sure Here All Candidate" || res.data.res.includes("Sure Here Are Response")) {
					loadChat();
				} else {
					const formData2 = new FormData();
					formData2.append("message", p);
					formData2.append("response", res.data.res);
					addChat(formData2);
				}
				setprompt("");
			})
			.catch((err) => {
				console.log(err);
				setprompt("");
			});
	}

	async function updateChat(msg: string | Blob, pk: any, type: string) {
		if (type === "confirm") {
			const formData2 = new FormData();
			formData2.append("stime", freeslotdata["Start Time"]);
			formData2.append("etime", freeslotdata["End Time"]);
			await axiosInstanceAuth2
				.put(`/organization/integrations/calendar_automation/${orgpro[0]["unique_id"]}/${cardarefid}/`, formData2)
				.then(async (res) => {
					const formData2 = new FormData();
					formData2.append("response", msg);
					await axiosInstanceAuth2
						.put(`/chatbot/updatechat/${pk}/`, formData2)
						.then(async (res) => {
							loadChat();
						})
						.catch((err) => {
							console.log(err);
						});
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (type === "change") {
			const formData2 = new FormData();
			formData2.append("summary", intername);
			formData2.append("desc", interdesc);
			console.log("$", moment(`${interdate} ${interstime}`).format());
			formData2.append("stime", moment(`${interdate} ${interstime}`).format());
			formData2.append("etime", moment(`${interdate} ${interetime}`).format());
			await axiosInstanceAuth2
				.put(`/organization/integrations/calendar_automation/${orgpro[0]["unique_id"]}/${cardarefid}/`, formData2)
				.then(async (res) => {
					const formData2 = new FormData();
					formData2.append(
						"response",
						"Interview has been Schedule at " +
							moment(`${interdate} ${interstime}`).format("MMMM Do YYYY, h:mm a") +
							" to " +
							moment(`${interdate} ${interetime}`).format("h:mm a")
					);
					await axiosInstanceAuth2
						.put(`/chatbot/updatechat/${pk}/`, formData2)
						.then(async (res) => {
							loadChat();
						})
						.catch((err) => {
							console.log(err);
						});
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			const formData2 = new FormData();
			formData2.append("response", msg);
			await axiosInstanceAuth2
				.put(`/chatbot/updatechat/${pk}/`, formData2)
				.then(async (res) => {
					loadChat();
				})
				.catch((err) => {
					console.log(err);
				});
		}
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
		if (change) {
			updateChat("Interview Scheduled", lpk, "change").then(() => {
				setintername("");
				setinterdesc("");
				setinterdate("");
				setinterstime("");
				setinteretime("");
				setfreeslotdata({});
				setlpk("");
				setClick(change);
				setMaximize(false);
				setchange(false);
			});
		}
	}, [change]);

	useEffect(() => {
		if (click) {
			if (props.notifyStatus) {
				if (freeslotdata["message"] || freeslotdata["Message"]) {
					const formData2 = new FormData();
					formData2.append("message", "Applicant Move In Interview / Phone Screen");
					if (freeslotdata["Message"]) formData2.append("response", freeslotdata["Message"]);
					if (freeslotdata["message"]) formData2.append("response", freeslotdata["message"]);
					addChat(formData2);
				} else {
					const formData2 = new FormData();
					formData2.append("message", "Applicant Move In Interview / Phone Screen");
					formData2.append(
						"response",
						"I suggest Interview can been Schedule at " +
							moment(freeslotdata["Simple Start Date"]).format("MMMM Do YYYY, h:mm a") +
							" to " +
							moment(freeslotdata["Simple End Date"]).format("h:mm a")
					);
					addChat(formData2);
				}

				setnotify(false);
			}
			loadChat();
		}
	}, [click]);

	// function check22(res: any) {
	// 	// toastcomp(res, "success");
	// 	// let regex = /.*?(?=Array of Responded Applicant)/;
	// 	// let match = res.match(regex);
	// 	// toastcomp(match, "error");
	// 	// if (match) {
	// 	// 	return match[0];
	// 	// } else {
	// 	// 	return "LOREM";
	// 	// }

	// 	// let res2 = res.split("Array of Responded Applicant IDs: ");
	// 	// // toastcomp(res2, "error");
	// 	// return res2[0];
	// 	return res;
	// }

	// function check23(res: any) {
	// 	let res2 = res.split("Array of Responded Applicant IDs: ");
	// 	//[clik2l57v00097wsr5qa2bf03]
	// 	let fstr = res2[1];
	// 	fstr = fstr.replaceAll("[", "");
	// 	fstr = fstr.replaceAll("]", "");
	// 	let fstrArr = fstr.split(",");
	// 	return fstrArr;
	// }

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
					`fixed bottom-5 right-5 z-[66]` + " " + (maximize ? "w-[calc(100%-2.5rem)] max-w-[1920px]" : "w-auto")
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
							<h4 className="text-lg font-bold">Chat Assistance</h4>
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
					<div className="h-[calc(100%-134px)] overflow-y-auto px-6 py-2" ref={messageEl}>
						<ul className="w-full text-sm">
							{msgs &&
								msgs.map((data, i) => (
									<>
										<div key={i}>
											<li className="my-2 ml-auto max-w-[90%] text-right">
												<div className="mb-1 inline-block rounded rounded-br-normal rounded-tl-normal bg-white px-4 py-2 text-left font-bold shadow dark:bg-gray-700">
													{data["message"]}
												</div>
												<div className="text-[10px] text-darkGray dark:text-gray-100">
													{moment(data["timestamp"]).fromNow()}
												</div>
											</li>
											<li className="my-2 max-w-[90%]">
												{!data["response"].includes("I suggest Interview can been Schedule at") ? (
													<>
														<div className="mb-1 inline-block rounded rounded-bl-normal rounded-tr-normal bg-gradDarkBlue px-4 py-2 text-white shadow">
															{data["response"]}
														</div>
													</>
												) : (
													<div className="mb-1 inline-block">
														<div className="mb-2 rounded rounded-bl-normal rounded-tr-normal bg-gradDarkBlue px-4 py-2 text-white shadow">
															{data["response"]}
														</div>
														<button
															type="button"
															className="rounded border border-slate-800 px-4 py-1.5 hover:bg-slate-800 hover:text-white"
															onClick={() =>
																updateChat(
																	data["response"].replace(
																		"I suggest Interview can been Schedule at",
																		"Interview can been Schedule at"
																	),
																	data["id"],
																	"confirm"
																)
															}
														>
															Confirm
														</button>
														<button
															type="button"
															className="mx-1.5 rounded border border-slate-800 px-4 py-1.5 hover:bg-slate-800 hover:text-white"
															onClick={() => {
																setClick(!click);
																setEditSchdInter(true);
																setlpk(data["id"]);
															}}
														>
															Change
														</button>
														<button
															type="button"
															className="mx-1.5 rounded border border-slate-800 px-4 py-1.5 hover:bg-slate-800 hover:text-white"
															onClick={() => updateChat("Interview Process Deleted", data["id"], "cancel")}
														>
															Cancel
														</button>
													</div>
												)}
												<div className="text-[10px] text-darkGray dark:text-gray-100">
													{moment(data["timestamp"]).fromNow()}
												</div>

												<div>
													{data["capplicant"] &&
														data["capplicant"].map((data, i) => (
															<button
																key={i}
																type="button"
																className="rounded border border-slate-800 px-4 py-1.5 hover:bg-slate-800 hover:text-white"
																onClick={() => {
																	setClick(false);
																	setMaximize(false);
																	setjobid(data["job"]["refid"]);
																	setappid(data["arefid"]);
																	settype("career");
																	setappdata(data);
																	router.push("/organization/applicants/detail");
																}}
															>
																{data["user"]["first_name"]}&nbsp;{data["user"]["last_name"]}
															</button>
														))}
													{data["vapplicant"] &&
														data["vapplicant"].map((data, i) => (
															<button
																key={i}
																type="button"
																className="rounded border border-slate-800 px-4 py-1.5 hover:bg-slate-800 hover:text-white"
																onClick={() => {
																	setClick(false);
																	setMaximize(false);
																	setjobid(data["job"]["refid"]);
																	setappid(data["arefid"]);
																	settype("vendor");
																	setappdata(data);
																	router.push("/organization/applicants/detail");
																}}
															>
																{data["applicant"]["first_name"]}&nbsp;{data["applicant"]["last_name"]}
															</button>
														))}
												</div>
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
					<div className="bg-white p-3 dark:bg-gray-700">
						<div className="flex items-center rounded bg-lightBlue p-2 dark:bg-gray-800">
							<textarea
								name=""
								id=""
								className="h-[40px] w-[calc(100%-50px)] resize-none  border-0 bg-transparent focus:border-0 focus:shadow-none focus:outline-none focus:ring-0"
								placeholder="Type something..."
								value={prompt}
								onChange={(e) => setprompt(e.target.value)}
								disabled={des}
								onKeyDown={(e) => {
									if (e.keyCode == 13 && e.shiftKey == false) {
										e.preventDefault();
										sendMsg();
									}
								}}
							></textarea>
							<button
								type="button"
								className="block w-[50px] border-l-2 border-gray-400 text-sm leading-normal"
								onClick={(e) => sendMsg()}
								disabled={des}
							>
								<i className="fa-solid fa-paper-plane"></i>
							</button>
						</div>
					</div>
				</div>
				<button
					type="button"
					className="relative ml-auto mt-3 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-2 shadow-normal"
					onClick={handleClick}
				>
					{props.notifyStatus ? (
						<>
							<span className="absolute left-0 top-0 h-3 w-3 rounded-full bg-green-300 shadow-normal"></span>
						</>
					) : (
						<></>
					)}

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
