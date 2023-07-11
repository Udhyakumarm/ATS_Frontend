import Button from "@/components/Button";
import FormField from "@/components/FormField";
import HeaderBar from "@/components/HeaderBar";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import { useCarrierStore } from "@/utils/code";
import { getProviders, useSession } from "next-auth/react";
import router from "next/router";
import { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toastcomp from "@/components/toast";
import CandFooter from "@/components/candidate/footer";

export default function CanCareerApplyJob() {
	const { data: session } = useSession();
	const cancelButtonRef = useRef(null);
	const [socialPopup, setSocialPopup] = useState(false);
	const [skillsPopup, setSkillsPopup] = useState(false);
	const [eduPopup, setEduPopup] = useState(false);
	const [certPopup, setCertPopup] = useState(false);
	const [expPopup, setExpPopup] = useState(false);

	const cname = useCarrierStore((state) => state.cname);
	const cid = useCarrierStore((state) => state.cid);
	const jid = useCarrierStore((state) => state.jid);
	const jdata = useCarrierStore((state) => state.jdata);
	const setjdata = useCarrierStore((state) => state.setjdata);

	const [resume, setresume] = useState();
	const [fname, setfname] = useState("");
	const [lname, setlname] = useState("");
	const [email, setemail] = useState("");
	const [phone, setphone] = useState("");
	const [summary, setsummary] = useState("");

	const [token, settoken] = useState("");
	const [done, setdone] = useState(0);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	useEffect(() => {
		if (session) {
			settoken(session["accessToken"]);
		}
	}, [session]);

	useEffect(() => {
		if ((jdata && Object.keys(jdata).length === 0) || (jid && jid == "") || !session) {
			if (cname == "" && cid == "") router.replace(`/organization/${cname}`);
			else router.back();
		}
	}, [cid, jid, jdata, session, cname]);

	function verifyForm() {
		return fname.length > 0 && lname.length > 0 && email.length > 0 && phone.length > 0 && summary.length > 0 && resume;
	}

	const [link, setlink] = useState("");
	const [linkarr, setlinkarr] = useState([]);

	function verifySocialForm() {
		return link.length > 0;
	}

	const [skill, setSkill] = useState([]);
	const [stitle, setSTitle] = useState("");
	const [sprf, setSProf] = useState("");
	const [sset, setSSet] = useState("");

	function verifySkillPopup() {
		return stitle.length > 0 && sprf.length > 0 && sset.length > 0;
	}

	const [cert, setCert] = useState([]);
	const [certname, setCERTName] = useState("");
	const [corg, setCOrg] = useState("");
	const [cexp, setCExp] = useState(false);
	const [cidate, setCIDate] = useState("");
	const [cedate, setCEDate] = useState("");
	const [certid, setCERTId] = useState("");
	const [curl, setCUrl] = useState("");

	function verifyCertPopup() {
		return (
			certname.length > 0 &&
			corg.length > 0 &&
			cidate.length > 0 &&
			certid.length > 0 &&
			curl.length > 0 &&
			(cexp || cedate.length > 0)
		);
	}

	async function saveresume() {
		const formData = new FormData();
		formData.append("file", resume);
		await axiosInstanceAuth2
			.post(`/candidate/candidateresume/${jdata["refid"]}/`, formData)
			.then(async (res) => {
				console.log("Resume Saved");
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function saveprofile() {
		const formData = new FormData();
		formData.append("first_name", fname);
		formData.append("last_name", lname);
		formData.append("mobile", phone);
		formData.append("summary", summary);
		await axiosInstanceAuth2
			.post(`/candidate/candidateprofile/${jdata["refid"]}/`, formData)
			.then(async (res) => {
				createapplicant();
				console.log("profile saved");
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function createapplicant() {
		const formData = new FormData();
		await axiosInstanceAuth2
			.post(`/job/applicant/apply/${jdata["refid"]}/`)
			.then(async (res) => {
				console.log("Applied");
				toastcomp("Applied Successfully", "success");
			})
			.catch((err) => {
				console.log(err);
				toastcomp("Applied Not Successfully", "error");
			});
	}

	function apply() {
		saveresume();
		saveprofile();
	}

	function show() {
		console.log("Link : ", linkarr);
		console.log("Skill : ", skill);
		console.log("Certificate : ", cert);
	}

	return (
		<>
			<main className="py-8">
				<div className="mx-auto w-full max-w-[1000px] px-4">
					<div className="rounded-normal bg-white shadow-normal dark:bg-gray-800">
						<div className="overflow-hidden rounded-t-normal">
							<HeaderBar handleBack={() => router.back()} />
						</div>
						<div className="p-8">
							<div className="py-1">
								<div className="my-2 flex overflow-hidden rounded-normal border">
									<div className="w-[70px] bg-red-600 p-3 text-center font-bold text-white">
										<p className="uppercase">pdf</p>
									</div>
									<div className="flex w-[calc(100%-70px)] items-center justify-between py-3 px-6">
										<p className="font-semibold text-darkGray">Product Manager</p>
										<aside>
											<button type="button" className="text-primary hover:underline">
												Choose
											</button>
											<button type="button" className="ml-10 text-darkGray hover:text-red-500">
												<i className="fa-solid fa-xmark"></i>
											</button>
										</aside>
									</div>
								</div>
								<div className="my-2 flex overflow-hidden rounded-normal border">
									<div className="w-[70px] bg-red-600 p-3 text-center font-bold text-white">
										<p className="uppercase">pdf</p>
									</div>
									<div className="flex w-[calc(100%-70px)] items-center justify-between py-3 px-6">
										<p className="font-semibold text-darkGray">Product Manager</p>
										<aside>
											<button type="button" className="text-primary hover:underline">
												Choose
											</button>
											<button type="button" className="ml-10 text-darkGray hover:text-red-500">
												<i className="fa-solid fa-xmark"></i>
											</button>
										</aside>
									</div>
								</div>
							</div>
							<hr className="my-4" />
							<label htmlFor="uploadCV" className="mb-6 block cursor-pointer rounded-normal border p-6 text-center">
								<h3 className="mb-4 text-lg font-semibold">Autofill With Resume</h3>
								<h5 className="mb-2 text-darkGray">Drag and Drop Resume Here</h5>
								<p className="mb-2 text-sm">
									Or <span className="font-semibold text-primary">Click Here To Upload</span>
								</p>
								<p className="text-sm text-darkGray">Maximum File Size: 5 MB</p>
								<input type="file" className="hidden" id="uploadCV" onChange={(e) => setresume(e.target.files[0])} />
							</label>
							<div className="mx-[-10px] flex flex-wrap">
								<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
									<FormField
										fieldType="input"
										inputType="text"
										label="First Name"
										placeholder="First Name"
										value={fname}
										handleChange={(e) => setfname(e.target.value)}
									/>
								</div>
								<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
									<FormField
										fieldType="input"
										inputType="text"
										label="Last Name"
										placeholder="Last Name"
										value={lname}
										handleChange={(e) => setlname(e.target.value)}
									/>
								</div>
							</div>
							<div className="mx-[-10px] flex flex-wrap">
								<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
									<FormField
										fieldType="input"
										inputType="email"
										label="Email"
										placeholder="Email"
										required
										value={email}
										handleChange={(e) => setemail(e.target.value)}
									/>
								</div>
								<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
									<FormField
										fieldType="input"
										inputType="number"
										label="Phone Number"
										placeholder="Phone Number"
										value={phone}
										handleChange={(e) => setphone(e.target.value)}
									/>
								</div>
							</div>
							<div className="mb-4">
								<label className="mb-1 inline-block font-bold">Social Links</label>
								<div className="flex items-center">
									<div className="flex min-h-[45px] w-[calc(100%-40px)] items-center rounded-normal border border-borderColor py-1 px-3">
										<div className="text-lg">
											<i className="fa-brands fa-behance mr-5"></i>
											<i className="fa-brands fa-stack-overflow mr-5"></i>
											<i className="fa-brands fa-linkedin-in mr-5"></i>
											<i className="fa-brands fa-github mr-5"></i>
										</div>
									</div>
									<div className="w-[40px] text-right">
										<button type="button" className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white">
											<i className="fa-regular fa-plus"></i>
										</button>
									</div>
								</div>
							</div>
							<FormField
								fieldType="textarea"
								label="Summary"
								placeholder="Summary"
								value={summary}
								handleChange={(e) => setsummary(e.target.value)}
							/>
							<div className="mb-4">
								<label className="mb-1 inline-block font-bold">Skills</label>
								<div className="flex">
									<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor py-1 px-3">
										<div className="text-sm">
											<p className="my-1">Skill 1</p>
											<p className="my-1">Skill 2</p>
											<p className="my-1">Skill 3</p>
											<p className="my-1">Skill 4</p>
										</div>
									</div>
									<div className="w-[40px] text-right">
										<button type="button" className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white">
											<i className="fa-regular fa-plus"></i>
										</button>
									</div>
								</div>
							</div>
							<div className="mb-4">
								<label className="mb-1 inline-block font-bold">Education</label>
								<div className="flex">
									<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor py-1 px-3">
										{Array(2).fill(
											<article className="border-b last:border-b-0">
												<div className="flex flex-wrap text-sm">
													<div className="my-2 w-[30%]">
														<h4 className="font-bold">XYZ Group</h4>
													</div>
													<div className="my-2 w-[70%] pl-4">
														<p className="font-semibold">2021 Sep - 2022 Nov</p>
													</div>
												</div>
												<p className="mb-2 text-sm">
													<b>Description -</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
													tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
													exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
													reprehenderit in voluptate velit esse cillum dolore eu
												</p>
											</article>
										)}
									</div>
									<div className="w-[40px] text-right">
										<button type="button" className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white">
											<i className="fa-regular fa-plus"></i>
										</button>
									</div>
								</div>
							</div>
							<div className="mb-4">
								<label className="mb-1 inline-block font-bold">Certifications</label>
								<div className="flex">
									<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor py-1 px-3">
										{Array(2).fill(
											<article className="border-b last:border-b-0">
												<div className="flex flex-wrap text-sm">
													<div className="my-2 w-[30%]">
														<h4 className="font-bold">XYZ Group</h4>
													</div>
													<div className="my-2 w-[70%] pl-4">
														<p className="font-semibold">2021 Sep - 2022 Nov</p>
													</div>
												</div>
												<p className="mb-2 text-sm">
													<b>Description -</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
													tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
													exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
													reprehenderit in voluptate velit esse cillum dolore eu
												</p>
											</article>
										)}
									</div>
									<div className="w-[40px] text-right">
										<button type="button" className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white">
											<i className="fa-regular fa-plus"></i>
										</button>
									</div>
								</div>
							</div>
							<hr className="mt-8 mb-4" />
							<div className="relative mb-4">
								<label htmlFor="newGraduate" className="absolute right-12 top-0 text-sm font-bold">
									<input type="checkbox" id="newGraduate" name="newGraduate" className="mr-2 mb-[3px]" />
									New Graduate
								</label>
								<div className="mb-0">
									<label className="mb-1 inline-block font-bold">Education</label>
									<div className="flex">
										<div className="min-h-[45px] w-[calc(100%-40px)] rounded-normal border border-borderColor py-1 px-3">
											{Array(2).fill(
												<article className="border-b last:border-b-0">
													<div className="flex flex-wrap text-sm">
														<div className="my-2 w-[30%]">
															<h4 className="font-bold">XYZ Group</h4>
														</div>
														<div className="my-2 w-[70%] pl-4">
															<p className="font-semibold">2021 Sep - 2022 Nov</p>
														</div>
													</div>
													<p className="mb-2 text-sm">
														<b>Description -</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
														tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
														exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
														in reprehenderit in voluptate velit esse cillum dolore eu
													</p>
												</article>
											)}
										</div>
										<div className="w-[40px] text-right">
											<button type="button" className="h-[30px] w-[30px] rounded bg-gradDarkBlue text-sm text-white">
												<i className="fa-regular fa-plus"></i>
											</button>
										</div>
									</div>
								</div>
							</div>
							<div className="mx-[-10px] flex flex-wrap">
								<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
									<FormField fieldType="input" inputType="text" label="Current Salary" placeholder="Current Salary" />
								</div>
								<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
									<FormField fieldType="input" inputType="text" label="Expected Salary" placeholder="Expected Salary" />
								</div>
							</div>
							<FormField fieldType="input" inputType="text" label="Notice Period" placeholder="Notice Period" />
							<p className="mb-4 text-darkGray">
								<small>Note: You can edit your details manually</small>
							</p>
							<Button label="Apply" loader={false} disabled={!verifyForm()} btnType="button" handleClick={apply} />
							<Button label="Show Data" loader={false} btnType="button" handleClick={show} />
						</div>
					</div>
				</div>
			</main>
			<CandFooter />
			<Transition.Root show={socialPopup} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setSocialPopup}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Add Social Profile</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setSocialPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<FormField
											fieldType="input"
											inputType="text"
											label="Enter Social Profile Url"
											placeholder="https://facebook.com"
											value={link}
											handleChange={(e) => setlink(e.target.value)}
										/>
										<div className="text-center">
											<Button
												label="Save"
												disabled={!verifySocialForm()}
												btnType="button"
												handleClick={() => {
													let arr = linkarr;
													arr.push(link);
													setlinkarr(arr);
													setlink("");
													setSocialPopup(false);
												}}
											/>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={skillsPopup} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setSkillsPopup}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Add Skills</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setSkillsPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<FormField
											fieldType="select"
											label="Choose desired skill"
											singleSelect
											value={stitle}
											handleChange={(e) => setSTitle(e.target.value)}
											options={[{ name: "HTML" }, { name: "PHP" }, { name: "PYTHON" }]}
										/>
										<FormField
											fieldType="select"
											label="Choose profeciency"
											singleSelect
											value={sprf}
											handleChange={(e) => setSProf(e.target.value)}
											options={[{ name: "Beginner" }, { name: "Intermediate" }, { name: "Advance" }]}
										/>
										<FormField
											fieldType="select"
											label="Set skill primary or secondary"
											singleSelect
											value={sset}
											handleChange={(e) => setSSet(e.target.value)}
											options={[{ name: "Primary" }, { name: "Secondary" }]}
										/>
										<div className="text-center">
											<Button
												label="Save"
												disabled={!verifySkillPopup()}
												btnType="button"
												handleClick={() => {
													let arr = skill;
													var dict = {
														title: stitle,
														prof: sprf,
														set: sset
													};
													arr.push(dict);
													setSkill(arr);
													setSTitle("");
													setSProf("");
													setSSet("");
													setSkillsPopup(false);
												}}
											/>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={eduPopup} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setEduPopup}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Add Education</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setEduPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="mx-[-10px] flex flex-wrap">
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField fieldType="input" inputType="text" label="Course Name" placeholder="Course Name" />
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="University Name"
													placeholder="University Name"
												/>
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField fieldType="input" inputType="date" label="Start Date" placeholder="Start Date" />
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField fieldType="input" inputType="date" label="End Date" placeholder="End Date" />
											</div>
										</div>
										<FormField fieldType="textarea" label="About" />
										<div className="text-center">
											<Button label="Save" />
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={certPopup} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setCertPopup}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Add Certification</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setCertPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="mx-[-10px] flex flex-wrap">
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Certificate Name"
													placeholder="Certificate Name"
													value={certname}
													handleChange={(e) => setCERTName(e.target.value)}
												/>
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Issuing Organization"
													placeholder="Issuing Organization"
													value={corg}
													handleChange={(e) => setCOrg(e.target.value)}
												/>
											</div>
										</div>
										<div className="mb-4">
											<label htmlFor="credNotExp" className="text-sm font-bold">
												<input
													type="checkbox"
													id="credNotExp"
													name="credNotExp"
													className="mr-2 mb-[3px]"
													checked={cexp}
													onChange={(e) => setCExp(e.target.checked)}
												/>
												This credential does not expire.
											</label>
										</div>
										<div className="mx-[-10px] flex flex-wrap">
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="date"
													label="Issue Date"
													placeholder="Issue Date"
													value={cidate}
													handleChange={(e) => setCIDate(e.target.value)}
												/>
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="date"
													label="Expiration Date"
													placeholder="Expiration Date"
													value={cedate}
													handleChange={(e) => setCEDate(e.target.value)}
													disabled={cexp}
												/>
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Credential ID"
													placeholder="Credential ID"
													value={certid}
													handleChange={(e) => setCERTId(e.target.value)}
												/>
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Credential URL"
													placeholder="Credential URL"
													value={curl}
													handleChange={(e) => setCUrl(e.target.value)}
												/>
											</div>
										</div>
										<div className="text-center">
											<Button
												label="Save"
												disabled={!verifyCertPopup()}
												btnType="button"
												handleClick={() => {
													let arr = cert;
													var dict = {
														title: certname,
														company: corg,
														yearofissue: cidate,
														creid: certid,
														creurl: curl
													};
													if (!cexp) {
														dict["yearofexp"] = cedate;
													} else {
														dict["yearofexp"] = "";
													}

													arr.push(dict);
													setSkill(arr);
													setCERTName("");
													setCOrg("");
													setCIDate("");
													setCEDate("");
													setCERTId("");
													setCUrl("");
													setCExp(false);
													setCertPopup(false);
												}}
											/>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={expPopup} as={Fragment}>
				<Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setExpPopup}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative w-full transform overflow-hidden rounded-[30px] bg-[#FBF9FF] text-left text-black shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 sm:max-w-2xl">
									<div className="flex items-center justify-between bg-gradient-to-b from-gradLightBlue to-gradDarkBlue px-8 py-3 text-white">
										<h4 className="font-semibold leading-none">Add Experience</h4>
										<button
											type="button"
											className="leading-none hover:text-gray-700"
											onClick={() => setExpPopup(false)}
										>
											<i className="fa-solid fa-xmark"></i>
										</button>
									</div>
									<div className="p-8">
										<div className="mx-[-10px] flex flex-wrap">
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField fieldType="input" inputType="text" label="Title" placeholder="Title" />
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField fieldType="input" inputType="text" label="Company Name" placeholder="Company Name" />
											</div>
										</div>
										<div className="mb-4">
											<label htmlFor="currentlyWorking" className="text-sm font-bold">
												<input
													type="checkbox"
													id="currentlyWorking"
													name="currentlyWorking"
													className="mr-2 mb-[3px]"
												/>
												Currently Working?
											</label>
										</div>
										<FormField fieldType="select" label="Job Type" />
										<div className="mx-[-10px] flex flex-wrap">
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField fieldType="input" inputType="date" label="Start Date" placeholder="Start Date" />
											</div>
											<div className="mb-[20px] w-full px-[10px] md:max-w-[50%]">
												<FormField fieldType="input" inputType="date" label="End Date" placeholder="End Date" />
											</div>
										</div>
										<FormField fieldType="textarea" label="About" />
										<div className="text-center">
											<Button label="Save" />
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}

CanCareerApplyJob.noAuth = true;
