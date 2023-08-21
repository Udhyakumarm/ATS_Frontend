import { useState, Fragment, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useNewNovusStore } from "@/utils/novus";
import favIcon from "/public/favicon-white.ico";
import novusIcon1 from "/public/images/novus1.png";
import novusIcon2 from "/public/images/novus2.png";
import novusIcon3 from "/public/images/novus3.png";
import { useApplicantStore, useLangStore, useUserStore, useVersionStore } from "@/utils/code";
import AutoTextarea from "./AutoTextarea";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import toastcomp from "../toast";
import moment from "moment";

export default function OrgRSideBar({ axiosInstanceAuth2 }: any) {
	const router = useRouter();

	const [chat, setchat] = useState([]);
	const [text, settext] = useState("");
	const [step1, setstep1] = useState(false);

	const cancelButtonRef = useRef(null);
	const chatContainerRef = useRef(null);

	const visible = useNewNovusStore((state: { visible: any }) => state.visible);
	const tvisible = useNewNovusStore((state: { tvisible: any }) => state.tvisible);
	const nloader = useNewNovusStore((state: { nloader: any }) => state.nloader);
	const tnloader = useNewNovusStore((state: { tnloader: any }) => state.tnloader);
	const type = useUserStore((state: { type: any }) => state.type);
	const role = useUserStore((state: { role: any }) => state.role);
	const user = useUserStore((state: { user: any }) => state.user);
	const version = useVersionStore((state: { version: any }) => state.version);
	const srcLang = useLangStore((state: { lang: any }) => state.lang);

	const setjobid = useApplicantStore((state: { setjobid: any }) => state.setjobid);
	const setappid = useApplicantStore((state: { setappid: any }) => state.setappid);
	const setappdata = useApplicantStore((state: { setappdata: any }) => state.setappdata);
	const settype = useApplicantStore((state: { settype: any }) => state.settype);

	//load embding
	async function orgEmbedding() {
		await axiosInstanceAuth2
			.post(`/chatbot/org-embedding/`)
			.then(async (res) => {
				toastcomp("success org---", "success");
			})
			.catch((err) => {
				console.log(err);
				toastcomp("error", "error");
			});
	}

	useEffect(() => {
		if (chatContainerRef && chat.length > 0 && role != "Hiring Manager" && version === "enterprise") {
			chatContainerRef.current?.scrollTo({
				top: chatContainerRef.current.scrollHeight,
				behavior: "smooth"
			});
		}
	}, [chat]);

	// useEffect(() => {
	// 	if (chatContainerRef && !nloader) {
	// 		chatContainerRef.current?.scrollTo({
	// 			top: chatContainerRef.current.scrollHeight,
	// 			behavior: "smooth"
	// 		});
	// 	}
	// }, [nloader]);

	//load chat
	async function loadChat() {
		await axiosInstanceAuth2
			.get(`/chatbot/listchat/`)
			.then(async (res) => {
				console.log("&&", "chat", res.data);
				setchat(res.data);
				setSelectedCheckboxes([]);
				setssuggestion([]);
				setsuggSkill("");
				setsuggYear("");
				getAllUserName();
				getAllProfile();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		if (visible) {
			if (nloader) {
				orgEmbedding().then(() => loadChat().then(() => tnloader()));
			}
		} else {
			if (!nloader) {
				tnloader();
			}
		}
	}, [visible]);

	function filterBase1(param1: any, param2: any) {
		// Combine the two arrays
		const combinedArray = [...param1, ...param2];

		// Sort the combined array in descending order based on "percentage_fit"
		combinedArray.sort((a, b) => b.percentage_fit - a.percentage_fit);

		return combinedArray;
	}

	// const [ftext, setftext] = useState("");
	const [tmpLoader, settmpLoader] = useState(false);
	async function submitPrompt() {
		// setftext(text);
		// settext("");
		settmpLoader(true);
		// chatContainerRef.current?.scrollTo({
		// 	top: chatContainerRef.current.scrollHeight,
		// 	behavior: "smooth"
		// });

		toastcomp(text, "success");
		const fd = new FormData();
		fd.append("prompt", text);
		await axiosInstanceAuth2
			.post(`/chatbot/applicant-flow/`, fd)
			.then(async (res) => {
				settmpLoader(false);
				settext("");

				if (res.data.response && res.data.response === "Success") {
					loadChat();
				}
			})
			.catch((err) => {
				settmpLoader(false);
				settext("");

				console.log(err);
			});
	}

	const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

	const handleCheckboxChange = (value) => {
		if (selectedCheckboxes.includes(value)) {
			setSelectedCheckboxes(selectedCheckboxes.filter((item) => item !== value));
		} else {
			setSelectedCheckboxes([...selectedCheckboxes, value]);
		}
	};

	const [ssuggestion, setssuggestion] = useState([]);
	const [suggSkill, setsuggSkill] = useState("");
	const [suggYear, setsuggYear] = useState("");
	const handlesuggestionChange = (value) => {
		if (ssuggestion.includes(value)) {
			setssuggestion(ssuggestion.filter((item) => item !== value));
		} else {
			setssuggestion([...ssuggestion, value]);
		}
	};

	async function handleSuggestionFinal() {
		console.log("&&&", "pre defined suggstion", ssuggestion);
		console.log("&&&", "other skill", suggSkill);
		console.log("&&&", "other year", suggYear);
		let finalSkill = "";
		var prompt = "";
		if (ssuggestion.length > 0) {
			finalSkill = finalSkill + ssuggestion.toString();
		}
		if (suggSkill.length > 0) {
			if (finalSkill.length > 0) {
				finalSkill = finalSkill + "," + suggSkill;
			} else {
				finalSkill = suggSkill;
			}
		}
		if (finalSkill.length > 0 || suggYear.length > 0) {
			if (finalSkill.length > 0 && suggYear.length <= 0) {
				prompt = `show me top applicants who are having ${finalSkill} skills`;
				console.log("&&&", "prompt", prompt);
			} else if (finalSkill.length <= 0 && suggYear.length > 0) {
				prompt = `show me top applicants who are having greater than or equal to ${suggYear} years of experience`;
				console.log("&&&", "prompt", prompt);
			} else if (finalSkill.length > 0 && suggYear.length > 0) {
				prompt = `show me top applicants who are having ${finalSkill} skills and having greater than or equal to ${suggYear} years of experience`;
				console.log("&&&", "prompt", prompt);
			}
		}
		if (prompt.length > 0) {
			settmpLoader(true);
			settext(prompt);
			const fd = new FormData();
			fd.append("prompt", prompt);
			await axiosInstanceAuth2
				.post(`/chatbot/applicant-flow/`, fd)
				.then(async (res) => {
					settmpLoader(false);
					settext("");

					if (res.data.response && res.data.response === "Success") {
						loadChat();
					}
				})
				.catch((err) => {
					settmpLoader(false);
					settext("");

					console.log(err);
				});
		}
	}

	const [cepress, setcepress] = useState(false);

	useEffect(() => {
		if (cepress && text.length > 0) {
			submitPrompt();
		}
	}, [cepress]);

	async function handleSuggestion2(baseText: any) {
		if (baseText === "Reject Candidates") {
			var prompt = `[${selectedCheckboxes.toString()}] move to specific {Rejected}`;
			toastcomp(prompt, "success");
			settmpLoader(true);
			settext("Reject Candidates");
			setSelectedCheckboxes([]);
			const fd = new FormData();
			fd.append("prompt", prompt);
			await axiosInstanceAuth2
				.post(`/chatbot/applicant-flow/`, fd)
				.then(async (res) => {
					settmpLoader(false);
					settext("");

					if (res.data.response && res.data.response === "Success") {
						loadChat();
					}
				})
				.catch((err) => {
					settmpLoader(false);
					settext("");

					console.log(err);
				});
		} else if (baseText === "Move Candidates to next stage") {
			var prompt = `[${selectedCheckboxes.toString()}] move to next`;
			toastcomp(prompt, "success");
			settmpLoader(true);
			settext("Move Candidates to Next Stage");
			setSelectedCheckboxes([]);
			const fd = new FormData();
			fd.append("prompt", prompt);
			await axiosInstanceAuth2
				.post(`/chatbot/applicant-flow/`, fd)
				.then(async (res) => {
					settmpLoader(false);
					settext("");

					if (res.data.response && res.data.response === "Success") {
						loadChat();
					}
				})
				.catch((err) => {
					settmpLoader(false);
					settext("");

					console.log(err);
				});
		} else if (baseText === "Show me Top Applicants") {
			if (srcLang === "ja") {
				var prompt = `上位 5 件の応募者を表示する`;
			} else {
				var prompt = `Show me Top 5 Applicants`;
			}
			settmpLoader(true);
			settext(prompt);
			const fd = new FormData();
			fd.append("prompt", prompt);
			await axiosInstanceAuth2
				.post(`/chatbot/applicant-flow/`, fd)
				.then(async (res) => {
					settmpLoader(false);
					settext("");

					if (res.data.response && res.data.response === "Success") {
						loadChat();
					}
				})
				.catch((err) => {
					settmpLoader(false);
					settext("");

					console.log(err);
				});
		}
		// else if (baseText === "Python") {
		// 	var prompt = `show me applicants having skills python`;
		// 	settmpLoader(true);
		// 	settext(prompt);
		// 	const fd = new FormData();
		// 	fd.append("prompt", prompt);
		// 	await axiosInstanceAuth2
		// 		.post(`/chatbot/applicant-flow/`, fd)
		// 		.then(async (res) => {
		// 			settmpLoader(false);
		// 			settext("");

		// 			if (res.data.response && res.data.response === "Success") {
		// 				loadChat();
		// 			}
		// 		})
		// 		.catch((err) => {
		// 			settmpLoader(false);
		// 			settext("");

		// 			console.log(err);
		// 		});
		// } else if (baseText === "HTML, CSS") {
		// 	var prompt = `show me applicants having skills html, css`;
		// 	settmpLoader(true);
		// 	settext(prompt);
		// 	const fd = new FormData();
		// 	fd.append("prompt", prompt);
		// 	await axiosInstanceAuth2
		// 		.post(`/chatbot/applicant-flow/`, fd)
		// 		.then(async (res) => {
		// 			settmpLoader(false);
		// 			settext("");

		// 			if (res.data.response && res.data.response === "Success") {
		// 				loadChat();
		// 			}
		// 		})
		// 		.catch((err) => {
		// 			settmpLoader(false);
		// 			settext("");

		// 			console.log(err);
		// 		});
		// }
	}

	const [dataname, setdataname] = useState([]);
	const [dataprofile, setdataprofile] = useState([]);

	async function getAllUserName() {
		await axiosInstanceAuth2.get(`/organization/list/org/all/`).then((res) => {
			console.log("&&", "data name", res.data);
			setdataname(res.data);
		});
	}

	async function getAllProfile() {
		await axiosInstanceAuth2.get(`/organization/list/ind/all/`).then((res) => {
			console.log("&&", "data profile", res.data);
			setdataprofile(res.data);
		});
	}

	function getColor(s) {
		if (s === "Shortlist") {
			return "bg-[#BEFDD4]";
		} else if (s === "On Hold") {
			return "bg-[#F8EE00]";
		} else if (s === "Reject") {
			return "bg-[#FF5858]";
		}
	}

	return (
		<>
			<div className="transition duration-[1000ms]">
				{visible ? (
					<div
						id="sidebar"
						className={`bg-lightblue fixed right-10 top-[calc(65px+2rem)] z-[10] mr-[2rem] h-full w-[33%] rounded-normal dark:bg-gray-900 lg:right-0`}
						style={{ boxShadow: "0px 0px 10px 5px rgba(167, 167, 167, 0.25)" }}
					>
						<div
							className="flex h-[70px] items-center justify-between rounded-tl-normal rounded-tr-normal px-6 py-3"
							style={{ background: "var(--linear, linear-gradient(180deg, #9290FC 0%, #6A67EA 100%))" }}
						>
							<div className="flex items-center gap-1 pl-3">
								<Image src={novusIcon2} alt="Somhako" width={31} height={31} />
								<h4 className="text-center text-xl font-bold text-white">{srcLang === "ja" ? "ノーバス" : "Novus"} </h4>
								<span className="text-center text-base font-normal tracking-tighter text-white">1.2</span>
							</div>
							<div className="pr-3">
								<button type="button" className="text-white dark:text-gray-100" onClick={() => tvisible()}>
									<i className="fa-solid fa-x"></i>
								</button>
							</div>
						</div>

						<div
							className={`h-[calc(100vh-calc(60px+70px+65px+2rem))] overflow-y-auto px-4 py-7`}
							ref={chatContainerRef}
						>
							{nloader ? (
								<>
									<div className="flex h-full w-full flex-col items-center justify-center">
										{/* <Image src={novusIcon1} alt="novus" width={200} height={200} />
										<div className="loader1 dark:border-lightblue bg-transpert border border-gray-900">
											<div className="shape1"></div>
										</div> */}

										<div className="loader2">
											{/* <span className="loader2-text">
												<Image src={novusIcon1} alt="novus" width={50} height={50} />
											</span> */}
											<span className="load2"></span>
										</div>

										{/* <div className="loader3">
											<svg className="pl" width="240" height="240" viewBox="0 0 240 240">
												<circle
													className="pl__ring pl__ring--a"
													cx="120"
													cy="120"
													r="105"
													fill="none"
													stroke="#000"
													stroke-width="20"
													stroke-dasharray="0 660"
													stroke-dashoffset="-330"
													stroke-linecap="round"
												></circle>
												<circle
													className="pl__ring pl__ring--b"
													cx="120"
													cy="120"
													r="35"
													fill="none"
													stroke="#000"
													stroke-width="20"
													stroke-dasharray="0 220"
													stroke-dashoffset="-110"
													stroke-linecap="round"
												></circle>
												<circle
													className="pl__ring pl__ring--c"
													cx="85"
													cy="120"
													r="70"
													fill="none"
													stroke="#000"
													stroke-width="20"
													stroke-dasharray="0 440"
													stroke-linecap="round"
												></circle>
												<circle
													className="pl__ring pl__ring--d"
													cx="155"
													cy="120"
													r="70"
													fill="none"
													stroke="#000"
													stroke-width="20"
													stroke-dasharray="0 440"
													stroke-linecap="round"
												></circle>
											</svg>
										</div> */}

										{/* <div className="loader4">
											<Image
												src={novusIcon1}
												alt="novus"
												width={50}
												height={50}
												className="t-0 absolute z-[5] h-[6em] w-[6em] p-1"
											/>
											<div className="spinner">
												<div className="spinnerin"></div>
											</div>
										</div> */}

										{/* <div className="loader5 shadow-lg">
											<Image
												src={novusIcon1}
												alt="novus"
												width={50}
												height={50}
												className="t-0 growIcon2 absolute z-[5] h-[3em] w-[3em] p-1"
											/>
											<span className="border-black dark:border-white"></span>
										</div> */}
									</div>
								</>
							) : (
								<>
									{chat && chat.length <= 0 ? (
										<>
											{tmpLoader ? (
												<>
													<div className="my-2 mb-3 ml-auto  max-w-[85%] rounded bg-gradDarkBlue px-6 py-3 text-left shadow-lg">
														<div className="flex justify-between gap-4">
															<span className="text-base font-medium text-white">{text}</span>
															<span className="my-auto whitespace-nowrap text-center text-xs text-white">
																{moment().format("h:mm a")}
															</span>
														</div>
													</div>
													<div className="typeLoader1 my-2 mb-3 bg-white text-left shadow-lg dark:bg-gray-700"></div>
												</>
											) : (
												<div className="m-0 flex h-full w-full flex-wrap items-end p-0">
													<span
														className="cursor-pointer rounded-full border border-borderColor px-4 py-2 text-xs shadow"
														onClick={() => handleSuggestion2("Show me Top Applicants")}
													>
														{srcLang === "ja" ? "上位 5 件の応募者を表示する" : "Show me Top 5 Applicants"}
													</span>

													{/* <div className="mx-auto flex flex-wrap items-center justify-center gap-2 text-xs">
														<span
															className="cursor-pointer rounded-full border border-borderColor px-4 py-2 shadow"
															onClick={() => handleSuggestion2("Show me Top Applicants")}
														>
															Show me Top Applicants
														</span>
														<span
															className="cursor-pointer rounded-full border border-borderColor px-4 py-2 shadow"
															onClick={() => handleSuggestion2("Python")}
														>
															Python
														</span>
														<span
															className="cursor-pointer rounded-full border border-borderColor px-4 py-2 shadow"
															onClick={() => handleSuggestion2("HTML, CSS")}
														>
															HTML, CSS
														</span>
													</div> */}
												</div>
											)}
										</>
									) : (
										<>
											<div id="append_div2" className="hidden">
												{/* user chat */}
												<div className="my-2 mb-3 ml-auto  max-w-[85%] rounded bg-gradDarkBlue px-6 py-3 text-left shadow-lg">
													<div className="flex justify-between gap-4">
														<span className="text-justify text-base font-medium text-white">
															Give Me Top 5 Applicant
														</span>
														<span className="my-auto whitespace-nowrap text-center text-xs text-white">3:01 PM</span>
													</div>
												</div>
												{/* novus res */}
												<div className="my-2 mb-3  max-w-[85%] rounded bg-white px-6 py-3 text-left text-left shadow-lg dark:bg-gray-700">
													<div className="flex flex-nowrap justify-between gap-4">
														<span className="text-justify text-base font-medium">Sure here are 5 applicants</span>
														<span className="my-auto whitespace-nowrap text-center text-xs">3:02 PM</span>
													</div>
												</div>
												{/* applicant */}
												<div className="my-2 mb-3  max-w-[85%] rounded bg-white text-left shadow-lg dark:bg-gray-700">
													<div className="flex flex-wrap gap-4 border-b-2 border-borderColor px-5 py-3">
														<span className="rounded bg-lightBlue text-sm dark:bg-gray-900">
															<div className="flex items-center">
																<label className="novusCheck px-2">
																	<input type="checkbox" />
																	<div className="checkmark"></div>
																</label>
																<button className="overflow-hidden text-ellipsis whitespace-nowrap border-l border-gray-700 p-2 dark:border-white">
																	Naman Doshi
																</button>
															</div>
														</span>
														<span className="rounded bg-lightBlue text-sm dark:bg-gray-900">
															<div className="flex items-center">
																<label className="novusCheck px-2">
																	<input type="checkbox" />
																	<div className="checkmark"></div>
																</label>
																<button className="overflow-hidden text-ellipsis whitespace-nowrap border-l border-gray-700 p-2 dark:border-white">
																	Som SIR
																</button>
															</div>
														</span>
														<span className="rounded bg-lightBlue text-sm dark:bg-gray-900">
															<div className="flex items-center">
																<label className="novusCheck px-2">
																	<input type="checkbox" />
																	<div className="checkmark"></div>
																</label>
																<button className="overflow-hidden text-ellipsis whitespace-nowrap border-l border-gray-700 p-2 dark:border-white">
																	Rahber LOREM
																</button>
															</div>
														</span>
														<span className="rounded bg-lightBlue text-sm dark:bg-gray-900">
															<div className="flex items-center">
																<label className="novusCheck px-2">
																	<input type="checkbox" />
																	<div className="checkmark"></div>
																</label>
																<button className="overflow-hidden text-ellipsis whitespace-nowrap border-l border-gray-700 p-2 dark:border-white">
																	Vivek Sheetwal
																</button>
															</div>
														</span>
													</div>
													<div className=" px-5 py-3">
														<p className="text-sm font-bold">Suggestions</p>
														<div className="mt-2 flex flex-wrap gap-2">
															<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">Lorem.</span>
															<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">
																Lorem, ipsum.
															</span>
															<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">Lorem.</span>
															<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">Lorem.</span>
															<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">
																Lorem, ipsum.
															</span>
															<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">Lorem.</span>
														</div>
													</div>
												</div>
												{/* Suggestions 2 */}
												<div className="my-2 mb-3 ml-auto w-fit max-w-[85%] cursor-pointer items-end whitespace-pre-line rounded border border-gray-400 bg-white px-6 py-3 text-justify text-base font-medium text-primary hover:bg-primary/50 hover:bg-secondary/50 hover:text-white dark:bg-gray-700 dark:text-lightBlue  dark:hover:bg-secondary/50 ">
													Move Candidates to next stage
												</div>
												<div className="my-2 mb-3 ml-auto w-fit max-w-[85%] cursor-pointer items-end whitespace-pre-line rounded border border-gray-400 bg-white px-6 py-3 text-justify text-base font-medium text-primary hover:bg-secondary/50 hover:text-white dark:bg-gray-700 dark:text-lightBlue dark:hover:bg-secondary/50 dark:hover:text-white">
													Reject Candidates
												</div>
												{/* simple notify */}
												<div className="bg-transpert my-2 mb-3 w-fit max-w-[85%] rounded text-left text-left hover:border-2">
													<div className="flex items-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="15"
															height="11"
															viewBox="0 0 15 11"
															fill="none"
														>
															<path
																fill-rule="evenodd"
																clip-rule="evenodd"
																d="M5.26899 6.66339L13.0538 0L15 1.70643L5.26907 10.0358L0 5.52574L1.99369 3.81924L5.26899 6.66339Z"
																fill="#00FF29"
															/>
														</svg>
														<span className="ml-2 text-sm">Review notification has been sent to Hiring Manager</span>
													</div>
												</div>
												<div className="bg-transpert my-2 mb-3 w-fit max-w-[85%] rounded text-left text-left hover:border-2">
													<div className="flex items-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="15"
															height="11"
															viewBox="0 0 15 11"
															fill="none"
														>
															<path
																fill-rule="evenodd"
																clip-rule="evenodd"
																d="M5.26899 6.66339L13.0538 0L15 1.70643L5.26907 10.0358L0 5.52574L1.99369 3.81924L5.26899 6.66339Z"
																fill="#00FF29"
															/>
														</svg>
														<span className="ml-2 text-sm">Review notification Recieved</span>
													</div>
												</div>
												{/* usecase1 feedback */}
												<div className="my-2 mb-3 max-w-[85%] rounded bg-white text-left shadow-lg dark:bg-gray-700">
													<div className="flex flex-wrap justify-between gap-4 px-5 py-3 pb-0">
														<div className="flex items-center gap-2">
															<Image src={novusIcon1} alt="" width={23} height={23} />
															<p className="text-sm">Hiring Manager1</p>
														</div>
														<div className="my-auto rounded bg-[#BEFDD4] px-3 py-1 text-center text-xs font-bold dark:text-black">
															Shortlisted
														</div>
													</div>
													<div className="flex items-center gap-2 border-b-2 border-borderColor px-5 py-3 text-xs">
														<div>Candidate-</div>
														<div className="cursor-pointer bg-lightBlue p-2 font-medium dark:bg-gray-800">
															Josh Rynn
														</div>
														<div>5542136</div>
													</div>
													<div className="flex items-center gap-2 border-b-2 border-borderColor px-5 py-3 text-xs font-medium">
														<i className="fa-solid fa-info rounded-full border border-black/75 px-1.5 py-0.5 text-[8px] dark:border-white/75"></i>
														<p>Interview process will be handle by Steve Adam</p>
													</div>
													<div className="flex flex-col gap-2 px-5 py-3 text-sm">
														<div className="font-bold">Feedback</div>
														<div>
															<ReactReadMoreReadLess
																charLimit={80}
																readMoreText={"Read more ▼"}
																readLessText={"Read less ▲"}
															>
																Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium assumenda cum
																explicabo ratione modi aut dolorum deleniti quia! Molestiae aspernatur quam fugiat,
																accusamus vero adipisci ducimus eos commodi dignissimos iusto?
															</ReactReadMoreReadLess>
														</div>
													</div>
												</div>
												{/* lodaer animation */}
												<div className="typeLoader1 my-2 mb-3 bg-white text-left shadow-lg dark:bg-gray-700"></div>
											</div>
											{/* <br />
											<hr />
											<br /> */}
											<div id="append_div">
												{chat.map((data, i) => (
													<div key={i}>
														{data["message"] && data["message"].length > 0 ? (
															<>
																{/* user chat */}
																<div className="my-2 mb-3 ml-auto  max-w-[85%] rounded bg-gradDarkBlue px-6 py-3 text-left shadow-lg">
																	<div className="flex justify-between gap-4">
																		<span className="text-base font-medium text-white">{data["message"]}</span>
																		<span className="my-auto whitespace-nowrap text-center text-xs text-white">
																			{moment(data["timestamp"]).format("h:mm a")}
																		</span>
																	</div>
																</div>
																{/* novus res */}
																<div className="my-2 mb-3  max-w-[85%] rounded bg-white px-6 py-3 text-left text-left shadow-lg dark:bg-gray-700">
																	<div className="flex flex-nowrap justify-between gap-4">
																		<span className="text-base font-medium">{data["response"]}</span>
																		<span className="my-auto whitespace-nowrap text-center text-xs">
																			{moment(data["timestamp"]).format("h:mm a")}
																		</span>
																	</div>
																</div>
																{/* applicant */}
																{data["capplicant"].length > 0 || data["vapplicant"].length > 0 ? (
																	<div className="my-2 mb-3  max-w-[85%] rounded bg-white text-left shadow-lg dark:bg-gray-700">
																		<div className="flex flex-wrap gap-4 border-b-2 border-borderColor px-5 py-3">
																			{filterBase1(data["capplicant"], data["vapplicant"]).map((data2, j) => (
																				<span className="rounded bg-lightBlue text-sm dark:bg-gray-900" key={j}>
																					{i === chat.length - 1 && data["suggestion"] ? (
																						<div className="flex items-center">
																							<label className="novusCheck px-2">
																								<input
																									type="checkbox"
																									onChange={() => handleCheckboxChange(data2["arefid"])}
																								/>
																								<div className="checkmark"></div>
																							</label>
																							<button
																								className="relative overflow-hidden text-ellipsis whitespace-nowrap border-l border-gray-700 p-2 dark:border-white"
																								onClick={() => {
																									setjobid(data2["job"]["refid"]);
																									setappid(data2["arefid"]);
																									if (data2["user"]) {
																										settype("vendor");
																									} else {
																										settype("career");
																									}
																									setappdata(data2);
																									router.push("/organization/applicants/detail");
																								}}
																							>
																								{/* <span className="z-3 absolute right-0 top-0 text-[10px]">
																								{data["percentage_fit"]}
																							</span> */}
																								{data2["user"] ? (
																									<>
																										{data2["user"]["first_name"]}&nbsp;{data2["user"]["last_name"]}
																									</>
																								) : (
																									<>
																										{data2["applicant"]["first_name"]}&nbsp;
																										{data2["applicant"]["last_name"]}
																									</>
																								)}
																								<span
																									className=" 
																								relative ml-2  inline-block before:absolute before:-inset-1 before:block before:-skew-y-6 before:bg-pink-200"
																								>
																									<span className="relative text-xs text-black">
																										{data2["percentage_fit"]}
																									</span>
																								</span>
																							</button>
																						</div>
																					) : (
																						<>
																							<button
																								className="relative overflow-hidden text-ellipsis whitespace-nowrap p-2 "
																								onClick={() => {
																									setjobid(data2["job"]["refid"]);
																									setappid(data2["arefid"]);
																									if (data2["user"]) {
																										settype("vendor");
																									} else {
																										settype("career");
																									}
																									setappdata(data2);
																									router.push("/organization/applicants/detail");
																								}}
																							>
																								{/* <span className="z-3 absolute right-0 top-0 text-[10px]">
																								{data["percentage_fit"]}
																							</span> */}
																								{data2["user"] ? (
																									<>
																										{data2["user"]["first_name"]}&nbsp;{data2["user"]["last_name"]}
																									</>
																								) : (
																									<>
																										{data2["applicant"]["first_name"]}&nbsp;
																										{data2["applicant"]["last_name"]}
																									</>
																								)}
																								<span
																									className=" 
																								relative ml-2  inline-block before:absolute before:-inset-1 before:block before:-skew-y-6 before:bg-pink-200"
																								>
																									<span className="relative text-xs text-black">
																										{data2["percentage_fit"]}
																									</span>
																								</span>
																							</button>
																						</>
																					)}
																				</span>
																			))}
																		</div>
																		{i === chat.length - 1 && data["suggestion"] && (
																			<div className=" px-5 py-3">
																				<p className="text-sm font-bold">Suggestions</p>

																				<div className="flex items-end justify-center">
																					<div className="csug mt-2 flex flex-wrap gap-2">
																						{data["suggestion"].split(",").map((data, i) => (
																							<label key={i}>
																								<input
																									type="checkbox"
																									className="hidden"
																									onChange={() => handlesuggestionChange(data)}
																								/>
																								<span className="cursor-pointer rounded-full border-2 border-gray-500 px-3 py-1 text-xs">
																									{data}
																								</span>
																							</label>
																						))}
																						<input
																							type="search"
																							value={suggSkill}
																							onChange={(e) => setsuggSkill(e.target.value)}
																							placeholder="Other Skills Comma Seperated"
																							className={
																								`w-[48%] min-w-[15px] rounded-full border-2  px-3 py-1 text-xs focus:border-primary active:border-primary dark:bg-gray-700 dark:text-lightBlue` +
																								" " +
																								`${suggSkill.length > 0 ? "border-primary" : "border-gray-500"}`
																							}
																						/>
																						<input
																							type="search"
																							onInput={(e) => {
																								e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
																							}}
																							value={suggYear}
																							onChange={(e) => setsuggYear(e.target.value)}
																							placeholder="No of Min Experience Year"
																							className={
																								`w-[46%] min-w-[15px] rounded-full border-2  px-3 py-1 text-xs focus:border-primary active:border-primary dark:bg-gray-700 dark:text-lightBlue` +
																								" " +
																								`${suggYear.length > 0 ? "border-primary" : "border-gray-500"}`
																							}
																						/>
																					</div>
																					{(suggSkill.length > 0 || suggYear.length > 0 || ssuggestion.length > 0) && (
																						<div
																							className="cursor-pointer whitespace-nowrap text-primary dark:text-lightBlue"
																							onClick={() => handleSuggestionFinal()}
																						>
																							Go <i className="fa-solid fa-chevron-right"></i>
																						</div>
																					)}
																				</div>

																				{/* <br />
																				<br /> */}

																				{/* <div className="mt-2 flex flex-wrap gap-2">
																					<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">
																						Lorem.
																					</span>
																					<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">
																						Lorem, ipsum.
																					</span>
																					<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">
																						Lorem.
																					</span>
																					<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">
																						Lorem.
																					</span>
																					<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">
																						Lorem, ipsum.
																					</span>
																					<span className="rounded-full border-2 border-gray-500 px-3 py-1 text-xs">
																						Lorem.
																					</span>
																				</div> */}
																			</div>
																		)}
																	</div>
																) : (
																	<></>
																)}

																{i === chat.length - 1 && selectedCheckboxes.length > 0 && (
																	<>
																		{/* Suggestions 2 */}
																		<div
																			className="my-2 mb-3 ml-auto w-fit max-w-[85%] cursor-pointer items-end whitespace-pre-line rounded border border-gray-400 bg-white px-6 py-3 text-justify text-base font-medium text-primary hover:bg-primary/50 hover:bg-secondary/50 hover:text-white dark:bg-gray-700 dark:text-lightBlue  dark:hover:bg-secondary/50 "
																			onClick={() => handleSuggestion2("Move Candidates to next stage")}
																		>
																			Move Candidates to next stage
																		</div>
																		<div
																			className="my-2 mb-3 ml-auto w-fit max-w-[85%] cursor-pointer items-end whitespace-pre-line rounded border border-gray-400 bg-white px-6 py-3 text-justify text-base font-medium text-primary hover:bg-secondary/50 hover:text-white dark:bg-gray-700 dark:text-lightBlue dark:hover:bg-secondary/50 dark:hover:text-white"
																			onClick={() => handleSuggestion2("Reject Candidates")}
																		>
																			Reject Candidates
																		</div>
																	</>
																)}
															</>
														) : (
															<>
																{data["response"] === "@feedback" ? (
																	<>
																		<div className="my-2 mb-3 max-w-[85%] rounded bg-white text-left shadow-lg dark:bg-gray-700">
																			<div className="flex flex-wrap justify-between gap-4 px-5 py-3 pb-0">
																				<div className="flex items-center gap-2">
																					{dataprofile &&
																						dataprofile.length > 0 &&
																						dataprofile
																							.filter((obj) => obj.user.id === data["feedback"]["user"]["id"])
																							.map((data, i) => (
																								<Image
																									src={data["profile"]}
																									alt=""
																									width={26}
																									height={26}
																									key={i}
																									className="rounded-full"
																								/>
																							))}

																					{dataname &&
																						dataname.length > 0 &&
																						dataname
																							.filter((obj) => obj.id === data["feedback"]["user"]["id"])
																							.map((data, i) => (
																								<p className="text-sm" key={i}>
																									{data["name"]}
																								</p>
																							))}
																				</div>
																				<div
																					className={
																						`my-auto rounded px-3 py-1 text-center text-xs font-bold dark:text-black` +
																						" " +
																						`${getColor(data["feedback"]["status"])}`
																					}
																				>
																					{data["feedback"]["status"]}
																				</div>
																			</div>
																			<div className="flex items-center gap-2 border-b-2 border-borderColor px-5 py-3 text-sm">
																				<div>Candidate-</div>
																				<div
																					className="cursor-pointer bg-lightBlue p-2 dark:bg-gray-800"
																					onClick={() => {
																						if (data["capplicant"].length > 0) {
																							setjobid(data["capplicant"][0]["job"]["refid"]);
																							setappid(data["capplicant"][0]["arefid"]);
																							settype("career");
																							setappdata(data["capplicant"][0]);
																						} else {
																							setjobid(data["vapplicant"][0]["job"]["refid"]);
																							setappid(data["vapplicant"][0]["arefid"]);
																							settype("vendor");
																							setappdata(data["vapplicant"][0]);
																						}

																						router.push("/organization/applicants/detail");
																					}}
																				>
																					{data["capplicant"].length > 0 && (
																						<>
																							{data["capplicant"][0]["user"]["first_name"]}{" "}
																							{data["capplicant"][0]["user"]["last_name"]}
																						</>
																					)}
																					{data["vapplicant"].length > 0 && (
																						<>
																							{data["vapplicant"][0]["applicant"]["first_name"]}{" "}
																							{data["vapplicant"][0]["applicant"]["last_name"]}
																						</>
																					)}
																					<span
																						className=" 
																								relative ml-2  inline-block before:absolute before:-inset-1 before:block before:-skew-y-6 before:bg-pink-200"
																					>
																						<span className="relative text-xs text-black">
																							{data["capplicant"].length > 0
																								? data["capplicant"][0]["percentage_fit"]
																								: data["vapplicant"][0]["percentage_fit"]}
																						</span>
																					</span>
																				</div>
																				<div>
																					{data["capplicant"].length > 0
																						? data["capplicant"][0]["arefid"]
																						: data["vapplicant"][0]["arefid"]}
																				</div>
																			</div>
																			<div className="flex items-center gap-2 border-b-2 border-borderColor px-5 py-3 text-xs font-medium">
																				<i className="fa-solid fa-info rounded-full border border-black/75 px-1 py-0.5 text-[8px] dark:border-white/75"></i>

																				{data["feedback"]["status"] === "Shortlist" && (
																					<>
																						{dataname &&
																							dataname.length > 0 &&
																							dataname
																								.filter((obj) => obj.id === data["feedback"]["user"]["id"])
																								.map((data, i) => (
																									<p key={i}>Interview process will be handle by {data["name"]}</p>
																								))}
																					</>
																				)}
																				{data["feedback"]["status"] === "On Hold" && (
																					<p>Candidate Stay in Review Stage</p>
																				)}
																				{data["feedback"]["status"] === "Reject" && (
																					<p>Candidate Moved to Rejected Stage</p>
																				)}
																			</div>
																			<div className="flex flex-col gap-2 px-5 py-3 text-sm">
																				<div className="font-bold">Feedback</div>
																				<div>
																					<ReactReadMoreReadLess
																						charLimit={80}
																						readMoreText={"Read more ▼"}
																						readLessText={"Read less ▲"}
																						readMoreClassName="font-medium"
																						readLessClassName="font-medium"
																					>
																						{data["feedback"]["feedback"]}
																					</ReactReadMoreReadLess>
																				</div>
																			</div>
																		</div>
																	</>
																) : (
																	<div className="bg-transpert my-2 mb-3 w-fit max-w-[85%] rounded text-left text-left">
																		<div className="flex items-center">
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				width="15"
																				height="11"
																				viewBox="0 0 15 11"
																				fill="none"
																			>
																				<path
																					fill-rule="evenodd"
																					clip-rule="evenodd"
																					d="M5.26899 6.66339L13.0538 0L15 1.70643L5.26907 10.0358L0 5.52574L1.99369 3.81924L5.26899 6.66339Z"
																					fill="#00FF29"
																				/>
																			</svg>
																			<span className="ml-2 text-sm">{data["response"]}</span>
																		</div>
																	</div>
																)}
															</>
														)}
													</div>
												))}
												{tmpLoader && (
													<>
														<div className="my-2 mb-3 ml-auto  max-w-[85%] rounded bg-gradDarkBlue px-6 py-3 text-left shadow-lg">
															<div className="flex justify-between gap-4">
																<span className="text-base font-medium text-white">{text}</span>
																<span className="my-auto whitespace-nowrap text-center text-xs text-white">
																	{moment().format("h:mm a")}
																</span>
															</div>
														</div>
														<div className="typeLoader1 my-2 mb-3 bg-white text-left shadow-lg dark:bg-gray-700"></div>
													</>
												)}
											</div>
										</>
									)}
								</>
							)}
						</div>

						<div className="fixed bottom-0 z-[45] w-[33%] bg-white p-3 dark:bg-gray-800">
							<div className="flex">
								<AutoTextarea
									value={text}
									onChange={settext}
									// extra="dark:text-white dark:bg-gray-700 bg-lightblue"
									extra=""
									place={srcLang === "ja" ? "ここに結果を入力してください..." : "Type here for Results ..."}
									disable={nloader || tmpLoader}
									setcepress={setcepress}
								/>
								{text.length > 0 && (
									<button
										type="button"
										className="ml-3 block flex w-[40px] items-center justify-center border-l border-black text-center text-[19px] leading-normal"
										disabled={nloader || tmpLoader}
										onClick={() => submitPrompt()}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
											<path
												d="M19.8914 1.43809L17.4042 17.578C17.3762 17.7659 17.3054 17.9448 17.1975 18.101C17.0895 18.2573 16.9472 18.3867 16.7815 18.4794C16.6158 18.5721 16.431 18.6255 16.2414 18.6356C16.0518 18.6458 15.8624 18.6123 15.6877 18.5378L10.9314 16.5495L8.95397 19.5148C8.88679 19.6351 8.78863 19.7351 8.66969 19.8046C8.55076 19.874 8.41539 19.9103 8.27767 19.9097C8.06325 19.9097 7.85762 19.8245 7.706 19.6728C7.55438 19.5212 7.46921 19.3155 7.46921 19.101V15.3631C7.46827 15.0866 7.55947 14.8178 7.72839 14.599L16.1735 3.73717L4.75888 14.0135L0.771483 12.3549C0.550561 12.2628 0.360768 12.1091 0.224728 11.9121C0.0886891 11.7152 0.0121429 11.4832 0.00421474 11.2439C-0.0153253 11.0112 0.0333627 10.7778 0.144325 10.5722C0.255288 10.3667 0.423716 10.198 0.629015 10.0867L18.0462 0.16407C18.2492 0.0478976 18.4809 -0.00860405 18.7146 0.00106148C18.9483 0.010727 19.1745 0.0861673 19.3672 0.218709C19.56 0.35125 19.7114 0.535512 19.8042 0.75031C19.8969 0.965107 19.9271 1.20172 19.8914 1.43294V1.43809Z"
												fill="url(#paint0_linear_564_920)"
											/>
											<defs>
												<linearGradient
													id="paint0_linear_564_920"
													x1="1.59285e-07"
													y1="20.4451"
													x2="22.5456"
													y2="2.57596"
													gradientUnits="userSpaceOnUse"
												>
													<stop stop-color="#5236FF" />
													<stop offset="0.0001" stop-color="#5236FF" />
													<stop offset="1" stop-color="#85C5FF" />
												</linearGradient>
											</defs>
										</svg>
									</button>
								)}
							</div>
						</div>
					</div>
				) : (
					<></>
				)}
			</div>
		</>
	);
}
