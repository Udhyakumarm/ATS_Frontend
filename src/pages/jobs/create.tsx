import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import dashboardIcon from "/public/images/icons/dashboard.png";
import integrationIcon from "/public/images/icons/integration.png";
import jobsIcon from "/public/images/icons/jobs.png";
import analyticsIcon from "/public/images/icons/analytics.png";
import vendorsIcon from "/public/images/icons/vendors.png";
import applicantsIcon from "/public/images/icons/applicants.png";
import collectionIcon from "/public/images/icons/collection.png";
import Button from "@/components/button";
import { useRouter } from "next/router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useReducer, useState } from "react";
import JobFormField from "@/components/JobFormField";
import Validator, { Rules } from "validatorjs";
import { axiosInstance } from "@/utils";
import { useSession } from "next-auth/react";

const JobActionButton = ({ label, handleClick, icon }: any) => {
	return (
		<button
			onClick={handleClick}
			className="flex flex-row items-center gap-3 rounded-lg border border-slate-400 px-3 py-2 font-semibold hover:bg-slate-100"
			type="button"
		>
			{icon}
			{label}
		</button>
	);
};

const StickyLabel = ({ label }: any) => (
	<div className="absolute z-10 min-w-[200px] rounded-tl-normal rounded-br-normal bg-gradient-to-t from-[#6A67EA] to-[#9290FC] py-6 px-3 text-white shadow-md">
		{label}
	</div>
);

const tabTitles = ["Job Details", "Assessment", "Team Members", "Vendors", "Job Boards"];

const jobFormRules: Rules = {
	job_title: "required",
	job_function: "required",
	department: "required",
	location: "required",
	currency: "required",
	employment_type: "required",
	worktype: "required"
};

export default function Home() {
	const router = useRouter();

	const { data: session } = useSession();

	const [index, setIndex] = useState(0);
	const [formErrors, setFormErrors] = useState<any>({});

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
		worktype: "",
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
		worktype: cleanMuliField(data.worktype),
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

	async function draftJob() {
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

		if (newJob) router.push("/jobs/drafted/");
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

		if (newJob) router.push("/jobs/active/");
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

		if (newJob) router.push("/jobs/" + newJob.refid);
	}

	const jobActions = [
		{
			label: "Preview",
			action: previewJob,
			icon: (
				<i className="fa-solid fa-circle-play bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text font-extrabold text-transparent " />
			)
		},
		{
			label: "Save as Draft",
			action: draftJob,
			icon: (
				<i className="fa-solid fa-file bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text font-extrabold text-transparent" />
			)
		},
		{
			label: "Publish",
			action: publishJob,
			icon: (
				<i className="fa-solid fa-square-check  bg-gradient-to-r from-secondary to-primary bg-clip-text font-extrabold text-transparent" />
			)
		}
	];

	const CustomTabs = (currentIndex: number, tabIndex: number) => (
		<Tab className="flex flex-col items-center justify-center gap-y-2 transition-all duration-100" key={tabIndex}>
			<div className={tabIndex === currentIndex ? "font-semibold text-primary " : ""}>{tabTitles[tabIndex]}</div>
			{tabIndex === currentIndex && <div className="w-28 border-2 border-primary" />}
		</Tab>
	);
	return (
		<>
			<Head>
				<title>Home</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<main className="py-8">
				<div className="md:px-26 mx-auto h-full w-full max-w-[1920px] overflow-hidden lg:px-40">
					<Tabs onSelect={(i, l) => setIndex(i)}>
						<div className="sticky top-0 z-20 overflow-hidden rounded-t-lg bg-white pt-5 drop-shadow-md dark:bg-gray-800">
							<div className="flex flex-row items-center justify-between pt-2 text-gray-800">
								<div className="flex flex-row px-8">
									<button onClick={() => router.back()} className="text-slate-400">
										<i className="fa-solid fa-arrow-left pl-4 text-3xl"></i>
									</button>
									<div className="ml-20 text-xl font-normal text-slate-600">
										<span>{jobForm.job_title !== "" ? jobForm.job_title : "| Job Title"}</span>
									</div>
								</div>
								<div className="flex flex-row items-center justify-between gap-5 pr-10">
									{jobActions.map((action, i) => (
										<JobActionButton label={action.label} handleClick={action.action} icon={action.icon} key={i} />
									))}
								</div>
							</div>
							<div className="mx-auto w-full max-w-[1100px]">
								<TabList className="mx-10 mt-8 mb-0 flex flex-row justify-between text-lg text-slate-700">
									{tabTitles.map((_, i) => CustomTabs(index, i))}
								</TabList>
							</div>
						</div>
						<TabPanel className="mt-10">
							<div className="relative">
								<StickyLabel label="Job Title and Department" />
								<div className="relative mt-10 rounded-normal bg-white px-3 shadow-normal dark:bg-gray-800">
									<div className="m-10 p-10 pt-24">
										<JobFormField
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
												<JobFormField
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
												<JobFormField
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
										</div>
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<JobFormField
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
												<JobFormField
													fieldType="input"
													inputType="text"
													label="Group or Division"
													id="group_or_division"
													value={jobForm.group_or_division}
													error={formErrors?.group_or_division}
													handleChange={dispatch}
												/>
											</div>
										</div>
										<JobFormField
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
							<div className="relative">
								<StickyLabel label="Department Information" />

								<div className="relative mt-10 rounded-normal bg-white px-3 shadow-normal dark:bg-gray-800">
									<div className="m-10 p-10 pt-24">
										<JobFormField
											fieldType="textarea"
											inputType="textarea"
											id="description"
											value={jobForm.description}
											error={formErrors?.description}
											handleChange={dispatch}
										/>
									</div>
								</div>
							</div>
							<div className="relative">
								<StickyLabel label="Your Responsibilities" />

								<div className="relative mt-10 rounded-normal bg-white px-3 shadow-normal dark:bg-gray-800">
									<div className="m-10 p-10 pt-24">
										<JobFormField
											fieldType="textarea"
											inputType="textarea"
											id="responsibility"
											value={jobForm.responsibility}
											error={formErrors?.responsibility}
											handleChange={dispatch}
										/>
									</div>
								</div>
							</div>
							<div className="relative">
								<StickyLabel label="What We're Looking For" />

								<div className="relative mt-10 rounded-normal bg-white px-3 shadow-normal dark:bg-gray-800">
									<div className="m-10 p-10 pt-24">
										<JobFormField
											fieldType="textarea"
											id="looking_for"
											value={jobForm.looking_for}
											error={formErrors?.looking_for}
											handleChange={dispatch}
										/>
									</div>
								</div>
							</div>
							<div className="relative">
								<StickyLabel label="Skills" />

								<div className="mt-10 rounded-normal bg-white px-3 shadow-normal dark:bg-gray-800">
									<div className="m-10 p-10 pt-24">
										<JobFormField
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
							</div>
							<div className="relative top-12">
								<StickyLabel label="Employment Details" />

								<div className="relative mt-10 rounded-normal bg-white px-3 shadow-normal dark:bg-gray-800">
									<div className="m-10 p-10 pt-24">
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<JobFormField
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
												<JobFormField
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
												<JobFormField
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
												<JobFormField
													fieldType="input"
													inputType="text"
													label="Language"
													id="language"
													value={jobForm.language}
													error={formErrors?.language}
													handleChange={dispatch}
												/>
											</div>
										</div>
										<div className="-mx-3 mb-4 w-full px-3  md:max-w-[50%]">
											<JobFormField
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
							<div className="relative">
								<StickyLabel label="Annual Salary" />
								<div className="relative mt-10 rounded-normal bg-white px-3 shadow-normal dark:bg-gray-800">
									<div className="m-10 p-10 pt-24">
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<JobFormField
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
												<JobFormField
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
							</div>
							<div className="relative">
								<StickyLabel label="Benefits" />
								<div className="relative mt-10 rounded-normal bg-white px-3 shadow-normal dark:bg-gray-800">
									<div className="m-10 p-10 pt-24">
										<div className="-mx-3 flex flex-wrap">
											<div className="mb-4 w-full px-3 md:max-w-[50%]">
												<JobFormField
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
												<JobFormField
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
										</div>

										<div className="-mx-3 mb-4 w-full px-3  md:max-w-[50%]">
											<JobFormField
												fieldType="select"
												label="Work Type"
												id="worktype"
												value={jobForm.worktype}
												error={formErrors?.worktype}
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
							<h2>Any content 2</h2>
						</TabPanel>
					</Tabs>
				</div>
			</main>
		</>
	);
}