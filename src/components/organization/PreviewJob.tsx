export default function PreviewJob() {
	return (
		<>
			<div className="border-b px-8 py-3 dark:border-b-gray-600">
				<h4 className="text-lg font-bold leading-none">Job Title</h4>
				<ul className="flex list-inside list-disc flex-wrap items-center text-[12px] font-semibold">
					<li className="mr-3 list-none">Full Time</li>
					<li className="mr-3">INR 5000</li>
					<li className="mr-3">Vacancy - 50+</li>
				</ul>
			</div>
			<div className="px-8">
				<div>
					<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
						<h5 className="mb-2 font-bold">Department Information</h5>
						<article className="text-sm">Lorem Impsum</article>
					</div>
					<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
						<h5 className="mb-2 font-bold">Your Responsibilities</h5>
						<article className="text-sm">Lorem Impsum</article>
					</div>
					<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
						<h5 className="mb-2 font-bold">What We are Looking For</h5>
						<article className="text-sm">Lorem Impsum</article>
					</div>
					<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
						<h5 className="mb-2 font-bold">Skills</h5>
						<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
							<li className="list-nonr mr-3">PHP</li>
							<li className="mr-3">ReactJs</li>
							<li className="mr-3">HTML</li>
						</ul>
					</div>
					<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
						<h5 className="mb-2 font-bold">Employment Details</h5>
						<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
							<li className="mr-3 list-none">Full time</li>
							<li className="mr-3">Degree</li>
							<li className="mr-3">English, Japan</li>
							<li className="mr-3">5+ years of experience</li>
						</ul>
					</div>
					<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
						<h5 className="mb-2 font-bold">Annual Salary</h5>
						<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
							<li className="mr-3 list-none">INR 70000</li>
						</ul>
					</div>
					<div className="border-b py-4 last:border-b-0 dark:border-b-gray-600">
						<h5 className="mb-2 font-bold">Benefits</h5>
						<ul className="flex list-inside list-disc flex-wrap items-center text-sm font-semibold">
							<li className="mr-3 list-none">Paid Relocation : Yes</li>
							<li className="mr-3">Visa Sposnership : No</li>
							<li className="mr-3">Remote</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}
