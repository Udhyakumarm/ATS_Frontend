import Head from "next/head";
import { useRouter } from "next/router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useReducer, useState } from "react";
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
const Toaster = dynamic(() => import("@/components/Toaster"), {
	ssr: false
});

const JobActionButton = ({ label, handleClick, icon, iconBg }: any) => {
	return (
		<button
			onClick={handleClick}
			className="flex items-center justify-center border border-gray-400 rounded py-2 px-6 text-sm font-bold mr-3 last:mr-0 hover:bg-lightBlue"
			type="button"
		>
			<span className={'mr-2 text-white text-[10px] block w-[20px] h-[20px] rounded-full' + ' ' + iconBg}>
				{icon}
			</span>
			{label}
		</button>
	);
};

const StickyLabel = ({ label }: any) => (
	<h2 className="bg-gradient-to-b from-gradLightBlue to-gradDarkBlue text-white inline-block font-semibold py-4 px-8 rounded-tl-normal rounded-br-normal min-w-[250px] text-center shadow-lg">
		{label}
	</h2>
);

const IntegrationCard = ({ handleIntegrate, label, access, handlePost }: any) => {
	return (
		<div className="flex h-auto max-h-[250px] w-auto max-w-md flex-col justify-between rounded-xl bg-gray-100 p-5 shadow-xl dark:bg-slate-700 dark:text-white">
			<div className="flex flex-col items-stretch justify-between">
				<Image src={"/images/logos/" + label.toLowerCase() + "_logo.png"} width={50} height={50} alt="logo" />

				<div className="mt-4 text-lg font-semibold">{label}</div>
			</div>
			<div className="mt-8 flex flex-row justify-end">
				<button
					className=" rounded-md border border-slate-300 px-5 text-base font-thin hover:bg-white hover:font-light"
					onClick={() => (access ? handlePost() : handleIntegrate())}
				>
					{access ? "Post Job" : "Add"}
				</button>
			</div>
		</div>
	);
};

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

export default function Home() {
	const router = useRouter();

	const { data: session } = useSession();

	const [index, setIndex] = useState(0);
	const [formErrors, setFormErrors] = useState<any>({});

	const [integrationList, setIntegrationList] = useState({
		LinkedIn: { access: null },
		Indeed: { access: null },
		Somhako: { access: null },
		GlassDoor: { access: null },
		Twitter: { access: null }
	});

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

		if (validation.fails()) return;

		const newJob = await axiosInstance.api
			.post(
				"/job/create-job/",
				{ ...cleanedData, jobStatus: "Published", publish_date: new Date() },
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
			icon: (
				<i className="fa-solid fa-play" />
			),
			iconBg: 'bg-gradient-to-r from-[#FF930F] to-[#FFB45B]'
		},
		{
			label: "Save as Draft",
			action: draftJob,
			icon: (
				<i className="fa-regular fa-bookmark"></i>
			),
			iconBg: 'bg-gradient-to-r from-gradLightBlue to-gradDarkBlue'
		},
		{
			label: "Publish",
			action: publishJob,
			icon: (
				<i className="fa-solid fa-paper-plane"></i>
			),
			iconBg: 'bg-gradient-to-r from-[#6D27F9] to-[#9F09FB] text-[8px]'
		}
	];

	const CustomTabs = (currentIndex: number, tabIndex: number) => (
		<Tab
			key={tabIndex}
		>
			<button type="button" className={'border-b-4 py-3 px-10 font-semibold focus:outline-none' + ' ' + (tabIndex === currentIndex ? "border-primary text-primary" : "border-transparent text-darkGray")}>
				{tabTitles[tabIndex]}
			</button>
		</Tab>
	);
	return (
		<>
			<Head>
				<title>Post New Job</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main>
				<Orgsidebar />
				<Orgtopbar />
				<div id="overlay" className="fixed left-0 top-0 z-[9] hidden h-full w-full bg-[rgba(0,0,0,0.2)]"></div>
				<Toaster />
				<div className="layoutWrap p-4 lg:p-8">
					<div className="relative">
						<Tabs onSelect={(i, l) => setIndex(i)}>
							<div className="bg-white dark:bg-gray-800 shadow-normal rounded-t-normal mb-8">
								<div className="p-6 flex flex-wrap items-center justify-between">
									<div className="flex flex-wrap items-center justify-start py-2">
										<button className="justify-self-start text-darkGray dark:text-white mr-5" onClick={() => router.back()}>
											<i className="fa-solid fa-arrow-left text-2xl"></i>
										</button>
										<h2 className="text-xl font-bold">
											<span>{jobForm.job_title !== "" ? jobForm.job_title : "Job Title"}</span>
										</h2>
									</div>
									<div className="flex flex-wrap items-center">
										{jobActions.map((action, i) => (
											<JobActionButton label={action.label} handleClick={action.action} icon={action.icon} iconBg={action.iconBg} key={i} />
										))}
									</div>
								</div>
								<TabList className={'flex flex-wrap w-full max-w-[1100px] mx-auto'}>
									{tabTitles.map((_, i) => CustomTabs(index, i))}
								</TabList>
							</div>
							<TabPanel>
								<div className="relative bg-white rounded-normal shadow-normal mb-8">
									<StickyLabel label="Job Title and Department" />
									<div className="w-full max-w-[1055px] mx-auto px-4 py-8">
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
								<div className="relative bg-white rounded-normal shadow-normal mb-8">
									<StickyLabel label="Department Informatiom" />
									<div className="w-full max-w-[1055px] mx-auto px-4 py-8">
										<FormField
											fieldType="reactquill"
											id="description"
											value={jobForm.description}
											error={formErrors?.description}
											handleChange={dispatch}
										/>
									</div>
								</div>
								<div className="relative bg-white rounded-normal shadow-normal mb-8">
									<StickyLabel label="Your Responsibilities" />
									<div className="w-full max-w-[1055px] mx-auto px-4 py-8">
										<FormField
											fieldType="reactquill"
											id="responsibility"
											value={jobForm.responsibility}
											error={formErrors?.responsibility}
											handleChange={dispatch}
										/>
									</div>
								</div>
								<div className="relative bg-white rounded-normal shadow-normal mb-8">
									<StickyLabel label="What We're Looking For" />
									<div className="w-full max-w-[1055px] mx-auto px-4 py-8">
										<FormField
											fieldType="reactquill"
											id="looking_for"
											value={jobForm.looking_for}
											error={formErrors?.looking_for}
											handleChange={dispatch}
										/>
									</div>
								</div>
								<div className="relative bg-white rounded-normal shadow-normal mb-8">
									<StickyLabel label="Skills" />
									<div className="w-full max-w-[1055px] mx-auto px-4 py-8">
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
								<div className="relative bg-white rounded-normal shadow-normal mb-8">
									<StickyLabel label="Employment Details" />
									<div className="w-full max-w-[1055px] mx-auto px-4 py-8">
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
								<div className="relative bg-white rounded-normal shadow-normal mb-8">
									<StickyLabel label="Annual Salary" />
									<div className="w-full max-w-[1055px] mx-auto px-4 py-8">
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
								<div className="relative bg-white rounded-normal shadow-normal">
									<StickyLabel label="Benefits" />
									<div className="w-full max-w-[1055px] mx-auto px-4 py-8">
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
								<h2>Any content 2</h2>
							</TabPanel>
							<TabPanel>
								<h2>Any content 2</h2>
							</TabPanel>
							<TabPanel>
								<h2>Any content 2</h2>
							</TabPanel>
							<TabPanel>
								<div className="relative">
									<StickyLabel label="Post Jobs on different Job Boards" />
									<div className="relative mt-10 rounded-normal bg-white px-3 shadow-normal dark:bg-gray-800">
										<div className="m-10 grid grid-cols-3 gap-6 p-10 pt-24">
											{Object.keys(integrationList).map((key: any) => (
												<IntegrationCard
													key={key}
													label={key}
													access={integrationList[key as keyof typeof integrationList].access}
													handleIntegrate={() => handleIntegrate(key)}
													handlePost={() => handleIntegrationPost(key)}
												/>
											))}
										</div>
									</div>
								</div>
							</TabPanel>
						</Tabs>
					</div>
				</div>
			</main>
		</>
	);
}
