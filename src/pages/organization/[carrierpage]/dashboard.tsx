import Button from "@/components/Button";

export default function CanCareerDashboard() {
	return (
		<>
			<main className="py-8">
				<div className="container">
					<h3 className="mb-6 text-xl font-bold">Dashboard</h3>
					<div className="mx-[-7px] flex flex-wrap">
						{Array(4).fill(
							<div className="mb-[15px] w-full px-[7px] md:max-w-[50%] lg:max-w-[calc(100%/3)]">
								<div className="h-full rounded-[10px] bg-white p-5 shadow-normal dark:bg-gray-800">
									<h4 className="mb-3 text-lg font-bold">Software Engineer</h4>
									<ul className="mb-3 flex flex-wrap items-center text-[12px] font-semibold text-darkGray dark:text-gray-400">
										<li className="mr-8">
											<i className="fa-solid fa-location-dot mr-2"></i>
											Remote
										</li>
										<li className="mr-8">
											<i className="fa-regular fa-clock mr-2"></i>
											Full Time
										</li>
										<li>
											<i className="fa-solid fa-dollar-sign mr-2"></i>
											50-55k
										</li>
									</ul>
									<div className="flex flex-wrap items-center justify-between">
										<div className="mr-4">
											<Button btnStyle="sm" label="View" loader={false} />
										</div>
										<p className="text-[12px] font-bold text-darkGray dark:text-gray-400">29 min ago</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
		</>
	);
}

CanCareerDashboard.noAuth = true;
