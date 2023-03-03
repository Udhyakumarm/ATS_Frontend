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
import { useEffect, useReducer, useState } from "react";
import JobFormField from "@/components/JobFormField";
import Validator, { Rules } from "validatorjs";
import { axiosInstance } from "@/utils";
import { useSession } from "next-auth/react";
import HeaderBar from "@/components/HeaderBar";
import JobCard from "@/components/JobCard";

export default function Home() {
	const router = useRouter();

	const { data: session } = useSession();

	const [draftedJobs, setDraftedJobs] = useState([]);

	useEffect(() => {
		const getDraftedJobs = async () => {
			const newDraftedJobs = await axiosInstance.api
				.get("/job/list-job", { headers: { authorization: "Bearer " + session?.accessToken } })
				.then((response) => response.data.map((job: any) => !job.jobStatus && job))
				.catch((error) => {
					console.log({ error });
					return null;
				});

			setDraftedJobs(newDraftedJobs);
		};

		getDraftedJobs();
	}, [session]);

	return (
		<>
			<Head>
				<title>Drafted Jobs</title>
			</Head>
			<main className="py-8">
				<div className="md:px-26 mx-auto w-full max-w-[1920px] lg:px-40">
					<HeaderBar title="Drafted Jobs" icon={null} handleBack={() => router.back()} />
					<div className="bg-white p-10 dark:bg-gray-800 ">
						<div className="grid grid-cols-2 gap-x-8 gap-y-8">
							{draftedJobs &&
								draftedJobs.map(
									(job: any, i) =>
										job && (
											<JobCard
												key={i}
												job={job}
												handleView={() => {
													router.push("/organization/jobs/drafted/" + job.refid);
												}}
											/>
										)
								)}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
