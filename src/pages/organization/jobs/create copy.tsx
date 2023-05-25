import Head from "next/head";
import { useRouter } from "next/router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Fragment, useEffect, useReducer, useRef, useState } from "react";
import FormField from "@/components/FormField";
import Validator, { Rules } from "validatorjs";
import { axiosInstance } from "@/utils";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
import Orgsidebar from "@/components/organization/SideBar";
import Orgtopbar from "@/components/organization/TopBar";
import CardLayout_1 from "@/components/CardLayout-1";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import CardLayout_2 from "@/components/CardLayout-2";
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import Button from "@/components/Button";
const Toaster = dynamic(() => import("@/components/Toaster"), {
	ssr: false
});

const JobActionButton = ({ label, handleClick, icon, iconBg }: any) => {
	return (
		<button
			onClick={handleClick}
			className="mr-3 flex items-center justify-center rounded border border-gray-400 py-2 px-6 text-sm font-bold last:mr-0 hover:bg-lightBlue dark:hover:text-black"
			type="button"
		>
			<span className={"mr-2 block h-[20px] w-[20px] rounded-full text-[10px] text-white" + " " + iconBg}>{icon}</span>
			{label}
		</button>
	);
};

const StickyLabel = ({ label }: any) => (
	<h2 className="inline-block min-w-[250px] rounded-tl-normal rounded-br-normal bg-gradient-to-b from-gradLightBlue to-gradDarkBlue py-4 px-8 text-center font-semibold text-white shadow-lg">
		{label}
	</h2>
);

const tabTitles = ["Job Details", "Assessment", "Team Members", "Vendors", "Job Boards"];

const jobFormRules: Rules = {
	job_title: "required",
	job_function: "required",
	department: "required",
	location: "required",
	currency: "required",
	employment_type: "required",
	work_type: "required"
};
const people = [
	{ id: 1, name: "Durward Reynolds", unavailable: false },
	{ id: 2, name: "Kenton Towne", unavailable: false },
	{ id: 3, name: "Therese Wunsch", unavailable: false },
	{ id: 4, name: "Benedict Kessler", unavailable: true },
	{ id: 5, name: "Katelyn Rohan", unavailable: false }
];

export default function JobsCreate() {
	const router = useRouter();

	const { data: session } = useSession();
	const [token, settoken] = useState("");
	//Load TM
	const [tm, settm] = useState([]);

	useEffect(() => {
		if (session) {
			settoken(session.accessToken as string);
		} else if (!session) {
			settoken("");
		}
	}, [session]);

	const axiosInstanceAuth2 = axiosInstanceAuth(token);

	async function loadTeamMember() {
		await axiosInstanceAuth2
			.get(`/organization/listorguser/`)
			.then(async (res) => {
				console.log("@", "listorguser", res.data);
				settm(res.data);
			})
			.catch((err) => {
				console.log("@", "listorguser", err);
			});
	}

	useEffect(() => {
		if (token && token.length > 0) {
			loadTeamMember();
		}
	}, [token]);

	const [index, setIndex] = useState(0);
	const [formErrors, setFormErrors] = useState<any>({});

	const cancelButtonRef = useRef(null)
    const [previewPopup, setPreviewPopup] = useState(false)

	const [integrationList, setIntegrationList] = useState({
		LinkedIn: { access: null },
		Indeed: { access: null },
		Somhako: { access: null },
		GlassDoor: { access: null },
		Twitter: { access: null }
	});

	const [selectedPerson, setSelectedPerson] = useState(people[0]);

	const [skillOptions, setSkillOptions] = useState<any>([]);

	const updateFormInfo = (prevForm: any, event: { target: { id: string; value: any } }) => {
		const { id: key, value } = event.target;

		if (key in Object.keys(jobFormRules)) {
			const validation = new Validator(
				{ [key]: value },
				{ [key]: jobFormRules[key] },
				{
					required: "This field is required"
				}
			);

			if (!validation.passes()) setFormErrors((prev: any) => ({ ...prev, [key]: validation.errors.first(key) }));
			else setFormErrors((prev: any) => ({ ...prev, [key]: null }));
		}

		return { ...prevForm, [key]: value };
	};

	const [jobForm, dispatch] = useReducer(updateFormInfo, {
		job_title: "",
		job_function: "",
		department: "",
		industry: "",
		group_or_division: "",
		vacancy: "",
		description: "",
		responsibility: "",
		looking_for: "",
		employment_type: "",
		experience: "",
		education: "",
		location: "",
		skills: "",
		currency: "",
		salary: "",
		relocation: "",
		visa: "",
		work_type: "",
		deadline: "",
		publish_date: ""
	});

	const cleanMuliField = (field: any) =>
		Object.values(field)
			.map((item: any) => item.name)
			.join(", ");
	const cleanData = (data: any) => ({
		...data,
		employment_type: cleanMuliField(data.employment_type),
		skills: cleanMuliField(data.skills),
		relocation: cleanMuliField(data.relocation),
		worktype: cleanMuliField(data.work_type),
		visa: cleanMuliField(data.visa)
	});

	async function searchSkill(value: string) {
		await axiosInstance.marketplace_api
			.get(`/job/load/skills/?search=${value}`)
			.then(async (res) => {
				let obj = res.data;
				let arr = [];
				for (const [key, value] of Object.entries(obj)) {
					arr.push({ name: value });
				}
				setSkillOptions(arr);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		async function loadIntegrations() {
			console.log({ session });
			if (!session) return;
			console.log(session);
			const organization = await axiosInstance.api
				.get("/organization/listorganizationprofile/", { headers: { authorization: "Bearer " + session?.accessToken } })
				.then((response) => response.data[0]);
			const { integrations: newIntegrations } = await axiosInstance.api
				.get("/organization/integrations/" + organization.unique_id + "/", {
					headers: { authorization: "Bearer " + session?.accessToken }
				})
				.then((response) => response.data);

			setIntegrationList((prevList: any) => {
				newIntegrations.forEach((integration: { access_token: any; provider: string }) => {
					Object.keys(prevList).map((key) =>
						key.toLowerCase() === integration.provider ? (prevList[key] = { access: integration.access_token }) : null
					);
				});
				console.log(prevList);
				return prevList;
			});
		}

		loadIntegrations();
	}, [session]);

	const handleIntegrate = async (provider: string) =>
		await router.push("/api/integration/" + provider.toLowerCase() + "/create");

	const handleIntegrationPost = async (provider: any) => {
		const cleanedData = cleanData(jobForm);
		const validation = new Validator(cleanedData, jobFormRules);

		if (validation.fails()) {
			console.log(validation.errors);
			Object.keys(validation.errors.errors).forEach((key) =>
				toast.error(validation.errors.errors[key as keyof typeof validation.errors] as unknown as string)
			);
			return;
		}
	};

	async function draftJob() {
		const cleanedData = cleanData(jobForm);
		const validation = new Validator(cleanedData, jobFormRules);

		if (validation.fails()) {
			console.log(validation.errors);
			Object.keys(validation.errors.errors).forEach((key) =>
				toast.error(validation.errors.errors[key as keyof typeof validation.errors] as unknown as string)
			);
			return;
		}

		const newJob = await axiosInstance.api
			.post("/job/create-job/", cleanedData, {
				headers: {
					authorization: "Bearer " + session?.accessToken
				}
			})
			.then((response) => response.data)
			.catch((err) => {
				console.log(err);
				return null;
			});

		if (newJob) router.push("/organization/jobs/drafted/");
	}

	async function publishJob() {
		const cleanedData = cleanData(jobForm);
		const validation = new Validator(cleanedData, jobFormRules);

		if (validation.fails()) {
			console.log(validation.errors);
			Object.keys(validation.errors.errors).forEach((key) =>
				toast.error(validation.errors.errors[key as keyof typeof validation.errors] as unknown as string)
			);
			return;
		}

		const newJob = await axiosInstance.api
			.post(
				"/job/create-job/",
				{ ...cleanedData, jobStatus: "Active", publish_date: new Date() },
				{
					headers: {
						authorization: "Bearer " + session?.accessToken
					}
				}
			)
			.then((response) => response.data)
			.catch((err) => {
				console.log(err);
				return null;
			});

		if (newJob) router.push("/organization/jobs/active/");
	}

	async function previewJob() {
		setPreviewPopup(true);
		return;
		const cleanedData = cleanData(jobForm);
		const validation = new Validator(cleanedData, jobFormRules);

		if (validation.fails()) return;

		const newJob = await axiosInstance.api
			.post("/job/create-job/", cleanedData, {
				headers: {
					authorization: "Bearer " + session?.accessToken
				}
			})
			.then((response) => response.data)
			.catch((err) => {
				console.log(err);
				return null;
			});

		if (newJob) router.push("/organization/jobs/" + newJob.refid);
	}

	const jobActions = [
		{
			label: "Preview",
			action: previewJob,
			icon: <i className="fa-solid fa-play" />,
			iconBg: "bg-gradient-to-r from-[#FF930F] to-[#FFB45B]"
		},
		{
			label: "Save as Draft",
			action: draftJob,
			icon: <i className="fa-regular fa-bookmark"></i>,
			iconBg: "bg-gradient-to-r from-gradLightBlue to-gradDarkBlue"
		},
		{
			label: "Publish",
			action: publishJob,
			icon: <i className="fa-solid fa-paper-plane"></i>,
			iconBg: "bg-gradient-to-r from-[#6D27F9] to-[#9F09FB] text-[8px]"
		}
	];

	const CustomTabs = (currentIndex: number, tabIndex: number) => (
		<Tab key={tabIndex}>
			<button
				type="button"
				className={
					"border-b-4 py-3 px-10 font-semibold focus:outline-none" +
					" " +
					(tabIndex === currentIndex
						? "border-primary text-primary"
						: "border-transparent text-darkGray dark:text-gray-400")
				}
			>
				{tabTitles[tabIndex]}
			</button>
		</Tab>
	);

	const TeamTableHead = [
		{
			title: "User Name"
		},
		{
			title: "Department/Title"
		},
		{
			title: "Email"
		},
		{
			title: "Access"
		},
		{
			title: " "
		}
	];

	return (
		<>
			<Head>
				<title>Post New Job</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<Orgsidebar />
				<Orgtopbar />
				<div
					id="overlay"
					className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)]"
				></div>
				<Toaster />
				<div className="layoutWrap p-4 lg:p-8">
					<div className="relative">
						<Tabs onSelect={(i, l) => setIndex(i)}>
							<div className="mb-8 rounded-t-normal bg-white shadow-normal dark:bg-gray-800">
								<div className="flex flex-wrap items-center justify-between p-6">
									<div className="flex flex-wrap items-center justify-start py-2">
										<button
											className="mr-5 justify-self-start text-darkGray dark:text-gray-400"
											onClick={() => router.back()}
										>
											<i className="fa-solid fa-arrow-left text-2xl"></i>
										</button>
										<h2 className="text-xl font-bold">
											<span>{jobForm.job_title !== "" ? jobForm.job_title : "Job Title"}</span>
										</h2>
									</div>
									<div className="flex flex-wrap items-center">
										{jobActions.map((action, i) => (
											<JobActionButton
												label={action.label}
												handleClick={action.action}
												icon={action.icon}
												iconBg={action.iconBg}
												key={i}
											/>
										))}
									</div>
								</div>
								<TabList className={"mx-auto flex w-full max-w-[1100px] flex-wrap"}>
									{tabTitles.map((_, i) => CustomTabs(index, i))}
								</TabList>
							</div>
							<TabPanel>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Job Title and Department" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField
											fieldType="input"
											inputType="text"
											label="Job Title"
											id="job_title"
											required
											value={jobForm.job_title}
											error={formErrors?.job_title}
											handleChange={dispatch}
										/>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Job Function"
													id="job_function"
													required
													value={jobForm.job_function}
													error={formErrors?.job_function}
													handleChange={dispatch}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Department"
													id="department"
													required
													value={jobForm.department}
													error={formErrors?.department}
													handleChange={dispatch}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Industry"
													id="industry"
													value={jobForm.industry}
													error={formErrors?.industry}
													handleChange={dispatch}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Group or Division"
													id="group_or_division"
													value={jobForm.group_or_division}
													error={formErrors?.group_or_division}
													handleChange={dispatch}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="number"
													label="Vacancy"
													id="vacancy"
													value={jobForm.vacancy}
													error={formErrors?.vacancy}
													handleChange={dispatch}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Department Information" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField
											fieldType="reactquill"
											id="description"
											value={jobForm.description}
											error={formErrors?.description}
											handleChange={dispatch}
										/>
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Your Responsibilities" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField
											fieldType="reactquill"
											id="responsibility"
											value={jobForm.responsibility}
											error={formErrors?.responsibility}
											handleChange={dispatch}
										/>
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="What We are Looking For" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField
											fieldType="reactquill"
											id="looking_for"
											value={jobForm.looking_for}
											error={formErrors?.looking_for}
											handleChange={dispatch}
										/>
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Skills" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<FormField
											options={skillOptions}
											fieldType="select"
											id="skills"
											onSearch={searchSkill}
											value={jobForm.skills}
											error={formErrors?.skills}
											handleChange={dispatch}
										/>
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Employment Details" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="select"
													label="Employment Type"
													id="employment_type"
													singleSelect
													value={jobForm.employment_type}
													error={formErrors?.employment_type}
													handleChange={dispatch}
													options={[
														{ name: "Full Time" },
														{ name: "Part Time" },
														{ name: "Contract" },
														{ name: "Temporary" },
														{ name: "Internship" }
													]}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Experience"
													id="experience"
													value={jobForm.experience}
													error={formErrors?.experience}
													handleChange={dispatch}
												/>
											</div>
										</div>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Education"
													id="education"
													value={jobForm.education}
													error={formErrors?.education}
													handleChange={dispatch}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Language"
													id="language"
													value={jobForm.language}
													error={formErrors?.language}
													handleChange={dispatch}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Job Location"
													id="location"
													required
													value={jobForm.location}
													error={formErrors?.location}
													handleChange={dispatch}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Annual Salary" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="number"
													label="Salary Starting From"
													id="salary"
													value={jobForm.salary}
													error={formErrors?.salary}
													handleChange={dispatch}
													icon={<i className="fa-regular fa-money-bill-alt"></i>}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="input"
													inputType="text"
													label="Currency"
													id="currency"
													required
													value={jobForm.currency}
													error={formErrors?.currency}
													handleChange={dispatch}
													icon={<i className="fa-regular fa-money-bill-alt"></i>}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="relative rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Benefits" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="select"
													label="Relocation"
													id="relocation"
													value={jobForm.relocation}
													error={formErrors?.relocation}
													handleChange={dispatch}
													singleSelect
													options={[
														{ id: "yes", name: "Yes" },
														{ id: "no", name: "No" }
													]}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="select"
													label="Visa Sponsorship"
													id="visa"
													value={jobForm.visa}
													error={formErrors?.visa}
													handleChange={dispatch}
													singleSelect
													options={[
														{ id: "yes", name: "Yes" },
														{ id: "no", name: "No" }
													]}
												/>
											</div>
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<FormField
													fieldType="select"
													label="Work Type"
													id="work_type"
													value={jobForm.work_type}
													error={formErrors?.work_type}
													handleChange={dispatch}
													singleSelect
													options={[
														{ id: "remote", name: "Remote" },
														{ id: "office", name: "Office" },
														{ id: "hybrid", name: "Hybrid" }
													]}
												/>
											</div>
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Assessment" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="mx-[-15px] flex flex-wrap">
											{Array(6).fill(
												<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]">
													<CardLayout_1 isBlank={true} />
												</div>
											)}
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Team Members" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="mb-6 flex flex-wrap items-center justify-between">
											<div className="w-[350px] pr-2">
												<FormField
													fieldType="input"
													inputType="search"
													placeholder="Search"
													icon={<i className="fa-solid fa-magnifying-glass"></i>}
												/>
											</div>
											<div className="flex grow items-center justify-end">
												<div className="mr-3 w-[150px]">
													<FormField
														fieldType="select"
														placeholder="Sort"
														singleSelect={true}
														options={[
															{
																id: "A-to-Z",
																name: "A to Z"
															},
															{
																id: "Z-to-A",
																name: "Z to A"
															}
														]}
													/>
												</div>
												<div className="w-[150px]">
													<label
														htmlFor="teamSelectAll"
														className="flex min-h-[45px] w-full cursor-pointer items-center justify-between rounded-normal border border-borderColor p-3 text-sm text-darkGray dark:border-gray-600 dark:bg-gray-700"
													>
														<span>Select All</span>
														<input type="checkbox" id="teamSelectAll" />
													</label>
												</div>
											</div>
										</div>
										<div className="overflow-x-auto">
											<table cellPadding={"0"} cellSpacing={"0"} className="w-full">
												<thead>
													<tr>
														{TeamTableHead.map((item, i) => (
															<th className="border-b py-2 px-3 text-left" key={i}>
																{item.title}
															</th>
														))}
													</tr>
												</thead>
												<tbody>
													{tm &&
														tm.map(
															(data, i) =>
																data["verified"] !== false && (
																	<tr key={i}>
																		<td className="border-b py-2 px-3 text-sm">{data["name"]}</td>
																		<td className="border-b py-2 px-3 text-sm">{data["dept"]}</td>
																		<td className="border-b py-2 px-3 text-sm">{data["email"]}</td>
																		<td className="border-b py-2 px-3 text-sm">{data["role"]}</td>
																		<td className="border-b py-2 px-3 text-right">
																			<input type="checkbox" />
																		</td>
																	</tr>
																)
														)}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Vendors" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="mb-6 flex flex-wrap items-center justify-between">
											<div className="w-[350px] pr-2">
												<FormField
													fieldType="input"
													inputType="search"
													placeholder="Search"
													icon={<i className="fa-solid fa-magnifying-glass"></i>}
												/>
											</div>
											<div className="flex grow items-center justify-end">
												<div className="mr-3 w-[150px]">
													<FormField
														fieldType="select"
														placeholder="Sort"
														singleSelect={true}
														options={[
															{
																id: "A-to-Z",
																name: "A to Z"
															},
															{
																id: "Z-to-A",
																name: "Z to A"
															}
														]}
													/>
												</div>
												<div className="w-[150px]">
													<label
														htmlFor="teamSelectAll"
														className="flex min-h-[45px] w-full cursor-pointer items-center justify-between rounded-normal border border-borderColor p-3 text-sm text-darkGray dark:border-gray-600 dark:bg-gray-700"
													>
														<span>Select All</span>
														<input type="checkbox" id="teamSelectAll" />
													</label>
												</div>
											</div>
										</div>
										<div className="mx-[-15px] flex flex-wrap">
											{Array(6).fill(
												<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]">
													<CardLayout_2 />
												</div>
											)}
										</div>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<div className="relative mb-8 rounded-normal bg-white shadow-normal dark:bg-gray-800">
									<StickyLabel label="Job Boards" />
									<div className="mx-auto w-full max-w-[1055px] px-4 py-8">
										<div className="mx-[-15px] flex flex-wrap">
											{Object.keys(integrationList).map((key: any) => (
												<div className="mb-[30px] w-full px-[15px] md:max-w-[50%] lg:max-w-[33.3333%]" key={key}>
													<CardLayout_1
														key={key}
														label={key}
														access={integrationList[key as keyof typeof integrationList].access}
														handleIntegrate={() => handleIntegrate(key)}
														handlePost={() => handleIntegrationPost(key)}
														isBlank={false}
													/>
												</div>
											))}
										</div>
									</div>
								</div>
							</TabPanel>
						</Tabs>
					</div>
				</div>
			</main>
			<Transition.Root show={previewPopup} as={Fragment}>
                <Dialog
                as="div"
                className="relative z-40"
                initialFocus={cancelButtonRef}
                onClose={setPreviewPopup}
                >
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
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <Dialog.Panel className="relative transform overflow-hidden rounded-[30px] bg-[#FBF9FF] dark:bg-gray-800 text-black dark:text-white text-left shadow-xl transition-all w-full sm:max-w-full min-h-screen">
                            <div className="flex items-center justify-between px-8 py-3 border-b dark:border-b-gray-600">
								<aside>
									<h4 className="leading-none font-bold text-xl">
										Software Engineer
									</h4>
									<ul className="flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold">
										<li className="mr-3 list-none">Full Time</li>
										<li className="mr-3">7.5 LPA INR</li>
										<li className="mr-3">Vacancy - 50</li>
									</ul>
								</aside>
                                <button
                                    type="button"
                                    className="leading-none hover:text-gray-700"
                                    onClick={() => setPreviewPopup(false)}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="px-8">
								<div>
									<div className="border-b last:border-b-0 dark:border-b-gray-600 py-4">
										<h5 className="font-bold mb-2">Department Information</h5>
										<article className="text-sm">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
										</article>
									</div>
									<div className="border-b last:border-b-0 dark:border-b-gray-600 py-4">
										<h5 className="font-bold mb-2">Your Responsibilities</h5>
										<article className="text-sm">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
										</article>
									</div>
									<div className="border-b last:border-b-0 dark:border-b-gray-600 py-4">
										<h5 className="font-bold mb-2">What We are Looking For</h5>
										<article className="text-sm">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
										</article>
									</div>
									<div className="border-b last:border-b-0 dark:border-b-gray-600 py-4">
										<h5 className="font-bold mb-2">Skills</h5>
										<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
											<li className="mr-3 list-none">PHP</li>
											<li className="mr-3">ReactJs</li>
											<li className="mr-3">HTML</li>
										</ul>
									</div>
									<div className="border-b last:border-b-0 dark:border-b-gray-600 py-4">
										<h5 className="font-bold mb-2">Employment Details</h5>
										<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
											<li className="mr-3 list-none">Full Time</li>
											<li className="mr-3">Bachelors Degree</li>
											<li className="mr-3">English, Japan</li>
											<li className="mr-3">2+ Years of experience</li>
										</ul>
									</div>
									<div className="border-b last:border-b-0 dark:border-b-gray-600 py-4">
										<h5 className="font-bold mb-2">Annual Salary</h5>
										<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
											<li className="mr-3 list-none">50000 INR</li>
										</ul>
									</div>
									<div className="border-b last:border-b-0 dark:border-b-gray-600 py-4">
										<h5 className="font-bold mb-2">Benefits</h5>
										<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
											<li className="mr-3 list-none">Paid Relocation</li>
											<li className="mr-3">Visa Sposnership</li>
											<li className="mr-3">Remote Working</li>
										</ul>
									</div>
								</div>
								<div className="py-4">
									<Button label="Close" btnType="button" handleClick={() => setPreviewPopup(false)} />
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
