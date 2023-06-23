import React, { useEffect, useState, useRef, Fragment } from "react";
import Image from "next/image";
import favIcon from "/public/favicon-white.ico";
import { useRouter } from "next/router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "./Button";
import { Combobox, Transition } from "@headlessui/react";
import { useResizeDetector } from "react-resize-detector";
import { withResizeDetector } from "react-resize-detector";
import { useApplicantStore, useUserStore, useVersionStore } from "@/utils/code";
import { useNovusStore } from "@/utils/novus";
import { useSession } from "next-auth/react";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import toastcomp from "./toast";
import moment from "moment";

const promptsList = [
	{ id: 1, name: "Start", desc: "Basic Conversion" },
	{ id: 2, name: "Applicant", desc: "Applicant Related Prompts (Use Case 1)" },
	{ id: 3, name: "Offer Management", desc: "Offer of Applicant Related Prompts (Use Case 2)" },
	{ id: 4, name: "Jobs", desc: "Jobs Related Prompts" },
	{ id: 5, name: "Interviews", desc: "Interviews Related Prompts" }
];

const subPromptsList = {
	Start: [],
	Applicant: [
		{ name: "all applicant", prompt: ["show me all applicant"], sprompt: ["show me all c applicant"] },
		{
			name: "search applicant",
			prompt: [
				"show me all applicant whose skills are skill 1,skill 2,...skill N",
				"show me all applicant whose experience is greater than 0-N year"
			],
			sprompt: ["show me all applicant whose skills are ", "show me all applicant whose experience are "]
		},
		{
			name: "move applicant",
			prompt: [
				"applicant [12345] move to next phase",
				"applicant [12345] move to previous phase",
				"applicant [12345] move to specific {Interview}"
			],
			sprompt: [
				"applicant [12345] move to next phase",
				"applicant [12345] move to previous phase",
				"applicant [12345] move to specific {Interview}"
			]
		}
	],
	"Offer Management": [],
	Jobs: [
		{
			name: "generate description",
			prompt: [
				"Write a Job description for Software Developer with skills python,javascript,django,react",
				"Prompt Write a Job description for Software Developer with skills python,javascript,django,react having annual salary range 200000 to 1000000 in INR ₹",
				"Write a Job description in japanese language for Software Developer with skills python,javascript,django,react"
			],
			sprompt: [
				"Write a Job description for Software Developer with skills python,javascript,django,react",
				"Prompt Write a Job description for Software Developer with skills python,javascript,django,react having annual salary range 200000 to 1000000 in INR ₹",
				"Write a Job description in japanese language for Software Developer with skills python,javascript,django,react"
			]
		}
	],
	Interviews: []
};

function Novus(props: any) {
	const router = useRouter();
	const [chatloader, setchatloader] = useState(true);
	const [click, setClick] = useState(false);
	const [maximize, setMaximize] = useState(false);
	const [showPrompts, setShowPrompts] = useState(false);
	const [prompt, setprompt] = useState("");
	const [selected, setSelected] = useState("");
	const [query, setQuery] = useState("");
	const [subPrompt, setSubPrompt] = useState(false);
	const { width, height, ref } = useResizeDetector();
	const [showTooltip, setShowTooltip] = useState(false);
	const chatContainerRef = useRef(null);

	//novus zustand state
	const animation = useNovusStore((state: { animation: any }) => state.animation);
	const setanimation = useNovusStore((state: { setanimation: any }) => state.setanimation);
	const listOfApplicant = useNovusStore((state: { listOfApplicant: any }) => state.listOfApplicant);
	const setlistOfApplicant = useNovusStore((state: { setlistOfApplicant: any }) => state.setlistOfApplicant);
	//otehr zustand state
	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const setappid = useApplicantStore((state: { setappid: any }) => state.setappid);
	const setappdata = useApplicantStore((state: { setappdata: any }) => state.setappdata);
	const settype = useApplicantStore((state: { settype: any }) => state.settype);
	const type = useUserStore((state: { type: any }) => state.type);
	const role = useUserStore((state: { role: any }) => state.role);
	const user = useUserStore((state: { user: any }) => state.user);
	const version = useVersionStore((state: { version: any }) => state.version);

	//typing state
	const [cwidth, setCWidth] = useState(0);
	const [isEmpty, setIsEmpty] = useState(false);
	const [subprompttitle, setsubprompttitle] = useState([]);
	const [dsubprompttitle, setdsubprompttitle] = useState([]);
	const [finalquery, setfinalquery] = useState("");

	//message state
	const [chat, setchat] = useState([]);
	const [disablechat, setdisablechat] = useState(false);

	const { data: session } = useSession();
	const [token, settoken] = useState("");

	//session use Effect
	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
			setClick(false);
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);
	//token use effect
	useEffect(() => {
		if (token && token.length > 0) {
			loadChat();
		}
	}, [token]);

	//final query handle keydown event
	const handleSearchKeyDown = (event) => {
		if (event.key === "Backspace" && event.target.value === "") {
			setIsEmpty(true);
			setSelected("");
			setShowPrompts(false);
			setSubPrompt(false);
			setsubprompttitle([]);
			setdsubprompttitle([]);
			setfinalquery("");
		}
		if (event.key === "Enter") {
			submitQuery();
		}
	};

	//when /apllicant change this useeffect fire....
	useEffect(() => {
		setIsEmpty(false);
		if (selected["name"]) {
			setCWidth(selected["name"].length + 1);
			if (selected["name"] === "Applicant") {
				applicantEmbedding();
			}
			if (subPromptsList[selected["name"]].length > 0) {
				setShowPrompts(true);
			} else {
				setShowPrompts(false);
				setSubPrompt(false);
				setsubprompttitle([]);
				setdsubprompttitle([]);
				setfinalquery("");
			}
		} else {
			setCWidth(0);
		}
	}, [selected]);

	//handle change prompts combo box input
	function handleChangePromts(e: any) {
		setQuery(e.target.value);
		setCWidth(e.target.value.length + 1);
		if (e.target.value == "") {
			setShowPrompts(false);
			setSelected(" ");
			setSubPrompt(false);
			setsubprompttitle([]);
			setdsubprompttitle([]);
			setfinalquery("");
		}
	}

	//handle Sub Prompt List show or not
	function handleSubPrompt(sprompt: any, prompt: any) {
		if (prompt.length > 0) {
			if (prompt.length === 1) {
				setfinalquery(sprompt[0]);
				setSubPrompt(false);
				setsubprompttitle([]);
				setdsubprompttitle([]);
			} else {
				// setfinalquery("");
				setSubPrompt(true);
				setsubprompttitle(prompt);
				setdsubprompttitle(sprompt);
			}
		} else {
			setSubPrompt(false);
			setsubprompttitle([]);
			setdsubprompttitle([]);
		}
	}

	//load chat
	async function loadChat() {
		await axiosInstanceAuth2
			.get(`/chatbot/listchat/`)
			.then(async (res) => {
				setchat(res.data);
				// setdes(false);
				// console.log("$", res);
				// console.log("@", res.data);
				// setmsgs(res.data);
				// let a = res.data;
				// for (let i = 0; i < a.length; i++) {
				// 	if (a[i]["response"].includes("I suggest Interview can been Schedule at")) {
				// 		setdes(true);
				// 	}
				// }
			})
			.catch((err) => {
				console.log(err);
			});
	}

	//update chat
	async function updateChat(res: string, pk: any, type: string, aid: any, ctype: any) {
		if (type === "stay") {
			// Hiring Manager hm@somhako.com Giving Feedback To Applicant : `Shortlist`
			let res2 = res.split("Feedback To Applicant");
			let fres = "";
			fres = fres + res2[0];
			let res3 = res2[1];
			res3 = res3.split("`")[1];
			fres = fres + " " + res3 + " Feedback, You Select Stay Option...";
			// console.log("&",res3)
			// console.log("&",fres)
			const formData2 = new FormData();
			formData2.append("response", fres);
			await axiosInstanceAuth2
				.put(`/chatbot/updatechat/${pk}/`, formData2)
				.then(async (res) => {
					loadChat();
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (type === "next") {
			let res2 = res.split("Feedback To Applicant");
			let fres = "";
			fres = fres + res2[0];
			let res3 = res2[1];
			res3 = res3.split("`")[1];
			console.log("&", res3);
			if (res3 === "On Hold") {
				fres = fres + " " + res3 + " Feedback, You Select Next Option, Applicant Stay In Review Stage...";
				const formData2 = new FormData();
				formData2.append("response", fres);
				await axiosInstanceAuth2
					.put(`/chatbot/updatechat/${pk}/`, formData2)
					.then(async (res) => {
						loadChat();
					})
					.catch((err) => {
						console.log(err);
					});
			}
			if (res3 === "Reject") {
				fres = fres + " " + res3 + " Feedback, You Select Next Option, Applicant Transfer To Rejected Stage...";
				const formData2 = new FormData();
				formData2.append("response", fres);
				await axiosInstanceAuth2
					.put(`/chatbot/updatechat/${pk}/`, formData2)
					.then(async (res) => {
						loadChat();
					})
					.catch((err) => {
						console.log(err);
					});
				let prompt = "applicant [" + aid + "] move to specific {Rejected}";
				applicantChat(prompt);
			}
			if (res3 === "Shortlist") {
				let canid = aid;
				let url = "";
				if (ctype === "career") {
					url = `/job/listfeedback/${canid}/`;
				}
				if (ctype === "vendor") {
					url = `/job/listvfeedback/${canid}/`;
				}

				await axiosInstanceAuth2.get(url).then(async (res) => {
					console.log("@@", res.data);
					let fdata = res.data;
					let ch = true;
					for (let i = 0; i < fdata.length; i++) {
						if (fdata[i]["status"] != "Shortlist") {
							ch = false;
						}
					}
					if (ch) {
						fres = fres + " " + res3 + " Feedback, You Select Next Option, Applicant Transfer To Shortlisted Stage...";
						const formData2 = new FormData();
						formData2.append("response", fres);
						await axiosInstanceAuth2
							.put(`/chatbot/updatechat/${pk}/`, formData2)
							.then(async (res) => {
								loadChat();
							})
							.catch((err) => {
								console.log(err);
							});
						let prompt = "applicant [" + aid + "] move to specific {Shortlisted}";
						applicantChat(prompt);
					} else {
						fres = fres + " " + res3 + " Feedback, You Select Next Option, Applicant Not Transfer...";
						const formData2 = new FormData();
						formData2.append("response", fres);
						await axiosInstanceAuth2
							.put(`/chatbot/updatechat/${pk}/`, formData2)
							.then(async (res) => {
								loadChat();
							})
							.catch((err) => {
								console.log(err);
							});
					}
				});
			}
		}
	}

	//start option chat res
	async function startChat(prompt: any) {
		setdisablechat(true);
		const fd = new FormData();
		fd.append("prompt", prompt);
		await axiosInstanceAuth2
			.post(`/chatbot/basic-conversation/`, fd)
			.then(async (res) => {
				if (res.data.response && res.data.response === "Success") {
					loadChat();
				}
				setdisablechat(false);
				setfinalquery("");
			})
			.catch((err) => {
				console.log(err);
				setdisablechat(false);
				setfinalquery("");
			});
	}

	//applicant option chat res
	async function applicantChat(prompt: any) {
		setdisablechat(true);
		const fd = new FormData();
		fd.append("prompt", prompt);
		await axiosInstanceAuth2
			.post(`/chatbot/applicant-flow/`, fd)
			.then(async (res) => {
				if (res.data.response && res.data.response === "Success") {
					loadChat();
				}
				setdisablechat(false);
				setfinalquery("");
			})
			.catch((err) => {
				console.log(err);
				setdisablechat(false);
				setfinalquery("");
			});
	}

	//handle btn event
	function submitQuery() {
		if (finalquery.length > 0) {
			if (selected["name"] === "Start") {
				toastcomp("Start", "success");
				startChat(finalquery);
				setfinalquery("Loading...");
			} else if (selected["name"] === "Applicant") {
				toastcomp("Start", "success");
				applicantChat(finalquery);
				setfinalquery("Loading...");
			} else {
				toastcomp("Under Development Yet Else Start Basic Conversion", "success");
				setSelected({ id: 1, name: "Start", desc: "Basic Conversion" });
			}
		} else {
			if (selected.name) {
				toastcomp("Write Query for NOVUS", "error");
			} else {
				toastcomp("Start The NOVUS by clicking on /", "error");
			}
		}
	}

	//applicant embedding
	async function applicantEmbedding() {
		setfinalquery("Loading ..... ");
		setdisablechat(true);
		await axiosInstanceAuth2
			.post(`/chatbot/org-embedding/`)
			.then(async (res) => {
				toastcomp("success org---", "success");
				setfinalquery("");
				setdisablechat(false);
			})
			.catch((err) => {
				console.log(err);
				toastcomp("error", "error");
				setfinalquery("");
				setdisablechat(false);
			});
	}

	//applicant Data gathering function
	async function loadListOfApplicant() {
		let arr2 = [];
		await axiosInstanceAuth2.get(`/job/listapplicant/`).then(async (res) => {
			// console.log("!", "applicant", res.data);
			let arr = res.data;
			for (let i = 0; i < arr.length; i++) {
				let dic = arr[i];
				dic["type"] = "career";
				arr2.push(dic);
			}
			// console.log("!", "applicant2", arr2);
			setlistOfApplicant(arr2);
		});

		await axiosInstanceAuth2.get(`/job/listvendorapplicant/`).then(async (res) => {
			// console.log("!", "vendorapplicant", res.data);
			let arr = res.data;
			for (let i = 0; i < arr.length; i++) {
				let dic = arr[i];
				dic["type"] = "vendor";
				arr2.push(dic);
			}
			// console.log("!", "vendorapplicant2", arr2);
			setlistOfApplicant(arr2);
		});
	}

	//other data start
	const filteredpromptsList =
		query === ""
			? promptsList
			: promptsList.filter((item) =>
					item.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""))
			  );

	const allowedPaths = [
		"/organization",
		"/organization/dashboard",
		"/organization/notifications",
		"/organization/analytics",
		// "/organization/applicants",
		"/organization/applicants/detail",
		"/organization/applicants/schedule-interview",
		"/organization/inbox",
		"/organization/interviews",
		"/organization/jobs",
		"/organization/jobs/create",
		"/organization/jobs/active",
		"/organization/jobs/archived",
		"/organization/jobs/clone/[editJob]",
		"/organization/jobs/closed",
		"/organization/jobs/draft",
		"/organization/jobs/edit/[editJob]",
		"/organization/offer-management",
		"/organization/settings",
		"/organization/settings/calender",
		"/organization/settings/integrations",
		"/organization/settings/notifications",
		"/organization/settings/pricing",
		"/organization/settings/profile",
		"/organization/settings/team-members",
		"/organization/settings/vendors"
	];

	function handleClickOverlay() {
		setClick(!click);
		setMaximize(false);
	}

	function handleClickBtn() {
		setClick(!click);
		setMaximize(false);
	}

	useEffect(() => {
		if (
			chatContainerRef &&
			allowedPaths.includes(router.pathname) &&
			chat.length > 0 &&
			role != "Hiring Manager" &&
			version === "enterprise"
		) {
			chatContainerRef.current?.scrollTo({
				top: chatContainerRef.current.scrollHeight,
				behavior: 'smooth',
			  });
		}
	}, [chat]);

	useEffect(() => {
		if (click && animation) {
			setanimation(false);
		}
		if (click) {
			loadChat();
			loadListOfApplicant();
		}
	}, [click]);

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
		)
	};
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
		)
	};

	//other data end
	return (
		allowedPaths.includes(router.pathname) &&
		role != "Hiring Manager" &&
		version === "enterprise" && (
			<>
				<div
					className={
						`fixed left-0 top-0 z-[65] h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]` +
						" " +
						(click ? "block" : "hidden")
					}
					onClick={handleClickOverlay}
				></div>
				<div
					onMouseEnter={() => setShowTooltip(!showTooltip)}
					className={
						`chatNovus fixed bottom-5 right-5 z-[66]` +
						" " +
						(maximize ? "w-[calc(100%-2.5rem)] max-w-[1920px]" : "w-auto")
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
						{click && 
						<div
							className={`overflow-y-auto px-6 py-2`}
							ref={chatContainerRef}
							style={{ height: `calc(100% - calc(${height}px + 54px))` }}
						>
							<ul className="w-full text-sm" id="append_div">
								{chat.length > 0 &&
									chat.map((data, i) => (
										<>
											<div key={i}>
												{data["message"] && data["message"].length > 0 ? (
													<>
														<li className="my-2 ml-auto max-w-[90%] text-right">
															<div className="mb-1 inline-block rounded rounded-br-normal rounded-tl-normal bg-white px-4 py-2 text-left font-bold shadow dark:bg-gray-800">
																{data["message"]}
															</div>
															<div className="text-[10px] text-darkGray dark:text-gray-400">
																{moment(data["timestamp"]).fromNow()}
															</div>
														</li>

														<li className="my-2 max-w-[90%]">
															<div className="mb-1 inline-block rounded rounded-bl-normal rounded-tr-normal bg-gradDarkBlue px-4 py-2 text-white shadow">
																{data["response"]}
															</div>
															{data["capplicant"].length > 0 || data["vapplicant"].length > 0 ? (
																<Slider
																	{...teamListSlider}
																	className={`w-full ${maximize ? "max-w-[800px]" : "max-w-[400px]"}`}
																>
																	{data["capplicant"] &&
																		data["capplicant"].length > 0 &&
																		data["capplicant"].map((data, i) => (
																			<div className="pr-1" key={i}>
																				<div className="flex items-center overflow-hidden rounded border shadow">
																					<button
																						type="button"
																						className="grow whitespace-nowrap bg-white px-3 py-1 text-[10px] text-black hover:bg-lightBlue dark:bg-gray-600 dark:text-white"
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
																					<button
																						type="button"
																						className="flex h-[30px] w-[25px] items-center justify-center bg-gray-500 text-[10px] text-white hover:bg-gray-700"
																						onClick={() => {
																							navigator.clipboard.writeText(data["arefid"]);
																							toastcomp("ID Copied to clipboard", "success");
																						}}
																					>
																						<i className="fa-solid fa-copy"></i>
																					</button>
																				</div>
																			</div>
																		))}
																	{/* differ */}
																	{data["vapplicant"] &&
																		data["vapplicant"].length > 0 &&
																		data["vapplicant"].map((data, i) => (
																			<div className="pr-1" key={i}>
																				<div className="flex items-center overflow-hidden rounded border shadow">
																					<button
																						type="button"
																						className="grow whitespace-nowrap bg-white px-3 py-1 text-[10px] text-black hover:bg-lightBlue dark:bg-gray-600 dark:text-white"
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
																					<button
																						type="button"
																						className="flex h-[30px] w-[25px] items-center justify-center bg-gray-500 text-[10px] text-white hover:bg-gray-700"
																						onClick={() => {
																							navigator.clipboard.writeText(data["arefid"]);
																							toastcomp("ID Copied to clipboard", "success");
																						}}
																					>
																						<i className="fa-solid fa-copy"></i>
																					</button>
																				</div>
																			</div>
																		))}
																</Slider>
															) : (
																<></>
															)}
															<div className="text-[10px] text-darkGray dark:text-gray-400">
																{moment(data["timestamp"]).fromNow()}
															</div>
														</li>
													</>
												) : (
													<>
														<li className="my-2 max-w-[90%]">
															<div className="mb-1 inline-block">
																<div className="mb-1 last:mb-0">
																	<p className="text-[14px]">{data["response"]}</p>
																</div>
															</div>
															{data["response"].includes("Giving Feedback To Applicant") &&
															(data["capplicant"].length > 0 || data["vapplicant"].length > 0) ? (
																<>
																	{data["capplicant"] &&
																		data["capplicant"].length > 0 &&
																		data["capplicant"].map((data2, i) => (
																			<div className="flex flex-wrap" key={i}>
																				<div className="pr-1">
																					<div className="flex items-center overflow-hidden rounded border shadow">
																						<button
																							type="button"
																							className="grow whitespace-nowrap bg-white px-3 py-1 text-[10px] text-black hover:bg-lightBlue dark:bg-gray-600 dark:text-white"
																							onClick={() => {
																								setClick(false);
																								setMaximize(false);
																								setjobid(data2["job"]["refid"]);
																								setappid(data2["arefid"]);
																								settype("career");
																								setappdata(data2);
																								router.push("/organization/applicants/detail");
																							}}
																						>
																							{data2["user"]["first_name"]}&nbsp;{data2["user"]["last_name"]}
																						</button>
																						<button
																							type="button"
																							className="flex h-[30px] w-[25px] items-center justify-center bg-gray-500 text-[10px] text-white hover:bg-gray-700"
																							onClick={() => {
																								navigator.clipboard.writeText(data2["arefid"]);
																								toastcomp("ID Copied to clipboard", "success");
																							}}
																						>
																							<i className="fa-solid fa-copy"></i>
																						</button>
																					</div>
																				</div>

																				<div className="mr-2 last:mr-0">
																					<Button
																						btnStyle="success"
																						label="Next"
																						btnType={"button"}
																						handleClick={() =>
																							updateChat(
																								data["response"],
																								data["id"],
																								"next",
																								data2["arefid"],
																								"career"
																							)
																						}
																					/>
																				</div>
																				<div className="mr-2 last:mr-0">
																					<Button
																						btnStyle="gray"
																						label="Stay"
																						btnType={"button"}
																						handleClick={() =>
																							updateChat(
																								data["response"],
																								data["id"],
																								"stay",
																								data2["arefid"],
																								"career"
																							)
																						}
																					/>
																				</div>
																			</div>
																		))}
																	{/* differ */}
																	{data["vapplicant"] &&
																		data["vapplicant"].length > 0 &&
																		data["vapplicant"].map((data2, i) => (
																			<div className="flex flex-wrap" key={i}>
																				<div className="pr-1">
																					<div className="flex items-center overflow-hidden rounded border shadow">
																						<button
																							type="button"
																							className="grow whitespace-nowrap bg-white px-3 py-1 text-[10px] text-black hover:bg-lightBlue dark:bg-gray-600 dark:text-white"
																							onClick={() => {
																								setClick(false);
																								setMaximize(false);
																								setjobid(data2["job"]["refid"]);
																								setappid(data2["arefid"]);
																								settype("vendor");
																								setappdata(data2);
																								router.push("/organization/applicants/detail");
																							}}
																						>
																							{data2["applicant"]["first_name"]}&nbsp;{data2["applicant"]["last_name"]}
																						</button>
																						<button
																							type="button"
																							className="flex h-[30px] w-[25px] items-center justify-center bg-gray-500 text-[10px] text-white hover:bg-gray-700"
																							onClick={() => {
																								navigator.clipboard.writeText(data2["arefid"]);
																								toastcomp("ID Copied to clipboard", "success");
																							}}
																						>
																							<i className="fa-solid fa-copy"></i>
																						</button>
																					</div>
																				</div>

																				<div className="mr-2 last:mr-0">
																					<Button
																						btnStyle="success"
																						label="Next"
																						btnType={"button"}
																						handleClick={() =>
																							updateChat(
																								data["response"],
																								data["id"],
																								"next",
																								data2["arefid"],
																								"vendor"
																							)
																						}
																					/>
																				</div>
																				<div className="mr-2 last:mr-0">
																					<Button
																						btnStyle="gray"
																						label="Stay"
																						btnType={"button"}
																						handleClick={() =>
																							updateChat(
																								data["response"],
																								data["id"],
																								"stay",
																								data2["arefid"],
																								"vendor"
																							)
																						}
																					/>
																				</div>
																			</div>
																		))}
																</>
															) : (
																<></>
															)}
															<div className="text-[10px] text-darkGray dark:text-gray-400">
																{moment(data["timestamp"]).fromNow()}
															</div>
														</li>
													</>
												)}
											</div>
										</>
									))}
								{/* <li className="my-2 ml-auto max-w-[90%] text-right">
									<div className="mb-1 inline-block rounded rounded-br-normal rounded-tl-normal bg-white px-4 py-2 text-left font-bold shadow dark:bg-gray-800">
										Hi
									</div>
									<div className="text-[10px] text-darkGray dark:text-gray-400">4:04 PM</div>
								</li>
								<li className="my-2 max-w-[90%]">
									<div className="mb-1 inline-block rounded rounded-bl-normal rounded-tr-normal bg-gradDarkBlue px-4 py-2 text-white shadow">
										Hi there how may I help you?
									</div>
									<div className="text-[10px] text-darkGray dark:text-gray-400">4:03 PM</div>
								</li>
								<li className="my-2 ml-auto max-w-[90%] text-right">
									<div className="mb-1 inline-block rounded rounded-br-normal rounded-tl-normal bg-white px-4 py-2 text-left font-bold shadow dark:bg-gray-800">
										Show me the Urgent Tasks
									</div>
									<div className="text-[10px] text-darkGray dark:text-gray-400">4:02 PM</div>
								</li>
								<li className="my-2 max-w-[90%]">
									<div className="mb-1 inline-block">
										<div className="mb-1 last:mb-0">
											<h6 className="font-bold">Team Meeting</h6>
											<p className="text-[12px]">Lorem impsum is a dummy text</p>
										</div>
										<div className="mb-1 last:mb-0">
											<h6 className="font-bold">Team Meeting</h6>
											<p className="text-[12px]">Lorem impsum is a dummy text</p>
										</div>
									</div>
									<div className="text-[10px] text-darkGray dark:text-gray-400">4:03 PM</div>
								</li>
								<li className="my-2 ml-auto max-w-[90%] text-right">
									<div className="mb-1 inline-block rounded rounded-br-normal rounded-tl-normal bg-white px-4 py-2 text-left font-bold shadow dark:bg-gray-800">
										How many applicants total in pipeline
									</div>
									<div className="text-[10px] text-darkGray dark:text-gray-400">4:02 PM</div>
								</li>
								<li className="my-2 max-w-[90%]">
									<div className="mb-1 inline-block rounded rounded-bl-normal rounded-tr-normal bg-gradDarkBlue px-4 py-2 text-white shadow">
										60 applicants
									</div>
									<div className="text-[10px] text-darkGray dark:text-gray-400">4:03 PM</div>
								</li>
								<li className="my-2 ml-auto max-w-[90%] text-right">
									<div className="mb-1 inline-block rounded rounded-br-normal rounded-tl-normal bg-white px-4 py-2 text-left font-bold shadow dark:bg-gray-800">
										Show me the most experienced applicants of Product Manager Job
									</div>
									<div className="text-[10px] text-darkGray dark:text-gray-400">4:02 PM</div>
								</li>
								<li className="my-2 max-w-[90%]">
									<div className="mb-1">
										<div className="mb-1 rounded rounded-bl-normal rounded-tr-normal bg-gradDarkBlue px-4 py-2 text-white shadow">
											Here is the list of most experienced applicants of Product Manager Job
										</div>
										<Slider {...teamListSlider} className="w-full max-w-[400px]">
											{Array(6).fill(
												<div className="pr-1">
													<div className="flex items-center overflow-hidden rounded border shadow">
														<button
															type="button"
															className="grow whitespace-nowrap bg-white px-3 py-1 text-[10px] text-black hover:bg-lightBlue dark:bg-gray-600 dark:text-white"
														>
															Anne Hardy
														</button>
														<button
															type="button"
															className="flex h-[30px] w-[25px] items-center justify-center bg-gray-500 text-[10px] text-white hover:bg-gray-700"
														>
															<i className="fa-solid fa-copy"></i>
														</button>
													</div>
												</div>
											)}
										</Slider>
									</div>
									<div className="text-[10px] text-darkGray dark:text-gray-400">4:03 PM</div>
								</li>
								<li className="my-2 ml-auto max-w-[90%] text-right">
									<div className="mb-1 inline-block rounded rounded-br-normal rounded-tl-normal bg-white px-4 py-2 text-left font-bold shadow dark:bg-gray-800">
										Schedule Interview with Jack
									</div>
									<div className="text-[10px] text-darkGray dark:text-gray-400">4:02 PM</div>
								</li>
								<li className="my-2 max-w-[90%]">
									<div className="mb-1 inline-block">
										<div className="mb-2 rounded rounded-bl-normal rounded-tr-normal bg-gradDarkBlue px-4 py-2 text-white shadow">
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
									<div className="text-[10px] text-darkGray dark:text-gray-400">4:03 PM</div>
								</li> */}
							</ul>
						</div>
						}
						<div ref={ref}>
							<div className="relative border-t-2 border-gray-300 bg-white p-3 dark:bg-gray-700">
								{subPrompt && (
									<div className="scrollbarHidden absolute bottom-[calc(100%+0px)] left-0 z-[3] max-h-[150px] w-full overflow-auto border-t-2 border-gray-300 bg-white px-3 py-2 shadow-normal">
										{subprompttitle.map((data, i) => (
											<p
												className="my-1 flex cursor-pointer items-center rounded bg-white p-2 text-sm hover:bg-gray-100 dark:text-black"
												key={i}
												onClick={() => {
													setfinalquery(dsubprompttitle[i]);
													setSubPrompt(false);
													setsubprompttitle([]);
													setdsubprompttitle([]);
												}}
											>
												{i + 1}. {data}
											</p>
										))}
									</div>
								)}
								{showPrompts && (
									<div className="flex w-full border px-3 py-2 shadow-normal">
										<div className="flex w-[60px] items-center border-r py-2 text-[12px] font-bold">Prompts</div>
										<div className="flex w-[calc(100%-60px)] items-center px-5">
											<Slider {...promptsSlider} className={`w-full ${maximize ? "max-w-[800px]" : "max-w-[400px]"}`}>
												{subPromptsList[selected["name"]].map((data, i) => (
													<div key={i}>
														<p
															className="mr-2 cursor-pointer rounded border bg-white px-3 py-1 text-center text-[10px] shadow-normal dark:bg-gray-800"
															onClick={() => handleSubPrompt(data["sprompt"], data["prompt"])}
														>
															{data["name"]}
														</p>
													</div>
												))}
											</Slider>
										</div>
									</div>
								)}
								<div className="rounded bg-lightBlue p-2 dark:bg-gray-800">
									<div className="flex items-center">
										<Combobox value={selected} onChange={setSelected}>
											<div className="w-[calc(100%-50px)] border-r-2 border-gray-400 pr-2">
												<div className="relative flex cursor-default flex-wrap items-center overflow-hidden bg-transparent text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
													<Combobox.Button
														className={`border-2 px-2 text-left ${selected.name ? "w-auto" : "w-[100%]"}`}
													>
														/
													</Combobox.Button>
													<Combobox.Input
														className={`border-2 border-gray-400 bg-transparent p-0 pr-2 text-sm leading-5 text-gray-900 focus:ring-0 ${
															selected.name ? "w-auto" : "hidden"
														}`}
														placeholder="Click on “/” for prompt"
														displayValue={(item: any) => item.name}
														onChange={handleChangePromts}
														style={{ width: cwidth + "ch" }}
													/>

													{/* {!selected.name && (
														<Combobox.Input
															className="w-auto border-none bg-transparent p-0 pr-2 text-sm leading-5 text-gray-900 focus:ring-0"
															placeholder="Click on “/” for prompt"
															displayValue={(item: any) => item.name}
															onChange={handleChangePromts}
														/>
													)} */}
													{selected && (
														<>
															{/* <p className="text-[12px]">{selected.name}</p> */}
															{selected.name && (
																<>
																	{!isEmpty && (
																		<div className="mx-2 grow rounded bg-white px-3 py-1">
																			<div className="flex items-center">
																				<input
																					type="search"
																					className="w-full border-0 px-2 py-0 text-[12px] outline-0 focus:ring-0"
																					placeholder={`${showPrompts ? "Choose Prompt Above..." : "Write Query...."}`}
																					onKeyDown={handleSearchKeyDown}
																					value={finalquery}
																					onChange={(e) => setfinalquery(e.target.value)}
																					disabled={disablechat}
																					autoFocus
																				/>
																			</div>
																		</div>
																	)}
																</>
															)}
														</>
													)}
												</div>
												<Transition
													as={Fragment}
													leave="transition ease-in duration-100"
													leaveFrom="opacity-100"
													leaveTo="opacity-0"
													afterLeave={() => setQuery("")}
												>
													<Combobox.Options className="scrollbarHidden absolute bottom-[calc(100%+0px)] left-0 z-[3] max-h-[150px] w-full overflow-auto bg-white px-3 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
														{filteredpromptsList.length === 0 && query !== "" ? (
															<div className="relative cursor-default select-none px-4 py-2 text-gray-700">
																Nothing found.
															</div>
														) : (
															filteredpromptsList.map((item) => (
																<Combobox.Option
																	key={item.id}
																	className={({ active }) =>
																		`relative cursor-default select-none px-4 py-2 ${
																			active ? "bg-gray-100" : "text-gray-900"
																		}`
																	}
																	value={item}
																>
																	{({ selected, active }) => (
																		<>
																			<div
																				className={`flex items-center text-sm dark:text-gray-800 ${
																					selected ? "font-bold" : "font-normal"
																				}`}
																			>
																				/ <span className="ml-1">{item.name}</span>
																			</div>
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
										<button type="button" className="block w-[50px] text-sm leading-normal" onClick={submitQuery}>
											<i className="fa-solid fa-paper-plane"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<button
						type="button"
						className={
							"relative ml-auto mt-3 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-b from-gradLightBlue to-gradDarkBlue p-2 shadow-normal" +
							" " +
							`${animation && "growIcon"}`
						}
						onClick={handleClickBtn}
						onMouseEnter={() => setShowTooltip(true)}
						onMouseLeave={() => setShowTooltip(false)}
					>
						{animation && (
							<span className="absolute left-0 top-0 h-3 w-3 rounded-full bg-green-300 shadow-normal"></span>
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

						{!click && !animation && (
							<div
								className={`after:content[''] absolute bottom-3 right-[calc(100%+7px)] rounded bg-gradDarkBlue px-4 py-1 text-[12px] leading-[1.6] text-white shadow-normal after:absolute after:right-[-4px] after:top-2 after:h-[10px] after:w-[10px] after:rotate-45 after:bg-gradDarkBlue dark:bg-white dark:text-black after:dark:bg-white ${
									showTooltip ? "block" : "hidden"
								}`}
							>
								NOVUS
							</div>
						)}
					</button>
				</div>
			</>
		)
	);
}

export default withResizeDetector(Novus);
